// JobVerse — store de autenticação (dev / recrutador)
//
// Implementação manual, sem Supabase Auth. Ver supabase/users.sql pra contexto.
// Persistido em localStorage via zustand/middleware. O store guarda só o
// usuário público (id/github/tipo/empresa) — NUNCA salva senha ou hash.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { gerarSalt, hashSenha, verificarSenha } from './hash';

export type TipoUsuario = 'dev' | 'recrutador';

export interface Usuario {
  id: string;
  github: string;
  tipo: TipoUsuario;
  empresaSlug?: string;
}

export type ResultadoAuth = { ok: true } | { ok: false; erro: string };

interface CadastroDados {
  github: string;
  senha: string;
  tipo: TipoUsuario;
  empresaSlug?: string;
}

interface AuthState {
  usuario: Usuario | null;
  carregando: boolean;
  cadastrar: (dados: CadastroDados) => Promise<ResultadoAuth>;
  entrar: (github: string, senha: string) => Promise<ResultadoAuth>;
  sair: () => void;
}

// ---------------------------------------------------------------------------
// Validações
// ---------------------------------------------------------------------------

const GITHUB_REGEX = /^[A-Za-z0-9-]{1,39}$/;

export function validarGithub(github: string): string | null {
  if (!github.trim()) return 'Informe o usuário do GitHub.';
  if (!GITHUB_REGEX.test(github.trim())) {
    return 'Usuário inválido. Use letras, números e hífens (até 39 caracteres).';
  }
  return null;
}

export function validarSenha(senha: string): string | null {
  if (senha.length < 4) return 'Senha precisa ter ao menos 4 caracteres.';
  return null;
}

// ---------------------------------------------------------------------------
// Row da tabela users (espelho manual — ver supabase/users.sql)
// ---------------------------------------------------------------------------

interface UserRow {
  id: string;
  github: string;
  senha_hash: string;
  salt: string;
  tipo: TipoUsuario;
  empresa_slug: string | null;
  created_at: string;
}

function rowParaUsuario(row: UserRow): Usuario {
  return {
    id: row.id,
    github: row.github,
    tipo: row.tipo,
    empresaSlug: row.empresa_slug ?? undefined
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      carregando: false,

      cadastrar: async ({ github, senha, tipo, empresaSlug }) => {
        const githubLimpo = github.trim();
        const errGh = validarGithub(githubLimpo);
        if (errGh) return { ok: false, erro: errGh };
        const errSe = validarSenha(senha);
        if (errSe) return { ok: false, erro: errSe };
        if (tipo === 'recrutador' && !empresaSlug) {
          return { ok: false, erro: 'Selecione a empresa que você representa.' };
        }

        if (!supabase) {
          return {
            ok: false,
            erro: 'Backend não configurado. Defina VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no .env.'
          };
        }

        set({ carregando: true });
        try {
          const salt = await gerarSalt();
          const senhaHash = await hashSenha(senha, salt);

          const { data, error } = await supabase
            .from('users')
            .insert({
              github: githubLimpo,
              senha_hash: senhaHash,
              salt,
              tipo,
              empresa_slug: tipo === 'recrutador' ? empresaSlug ?? null : null
            })
            .select('*')
            .maybeSingle();

          if (error) {
            // 23505 = unique violation → github já existe
            if (error.code === '23505') {
              return { ok: false, erro: 'Esse usuário do GitHub já está cadastrado. Tente entrar.' };
            }
            // 42P01 = tabela inexistente → users.sql não foi aplicado ainda
            if (error.code === '42P01') {
              return {
                ok: false,
                erro: 'Tabela users não existe. Aplique supabase/users.sql no SQL Editor.'
              };
            }
            console.error('[auth.cadastrar] falha:', error.message);
            return { ok: false, erro: 'Erro inesperado ao cadastrar. Tente de novo.' };
          }

          if (!data) {
            return { ok: false, erro: 'Cadastro não retornou dados. Tente novamente.' };
          }

          set({ usuario: rowParaUsuario(data as UserRow) });
          return { ok: true };
        } catch (e) {
          console.error('[auth.cadastrar] exception:', e);
          return { ok: false, erro: 'Falha ao cadastrar. Verifique sua conexão.' };
        } finally {
          set({ carregando: false });
        }
      },

      entrar: async (github, senha) => {
        const githubLimpo = github.trim();
        const errGh = validarGithub(githubLimpo);
        if (errGh) return { ok: false, erro: errGh };
        if (!senha) return { ok: false, erro: 'Informe a senha.' };

        if (!supabase) {
          return {
            ok: false,
            erro: 'Backend não configurado. Defina VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no .env.'
          };
        }

        set({ carregando: true });
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('github', githubLimpo)
            .maybeSingle();

          if (error) {
            if (error.code === '42P01') {
              return {
                ok: false,
                erro: 'Tabela users não existe. Aplique supabase/users.sql no SQL Editor.'
              };
            }
            console.error('[auth.entrar] falha:', error.message);
            return { ok: false, erro: 'Erro ao consultar usuário.' };
          }

          if (!data) {
            return { ok: false, erro: 'Usuário não encontrado. Cadastre-se primeiro.' };
          }

          const row = data as UserRow;
          const ok = await verificarSenha(senha, row.senha_hash, row.salt);
          if (!ok) {
            return { ok: false, erro: 'Senha incorreta.' };
          }

          set({ usuario: rowParaUsuario(row) });
          return { ok: true };
        } catch (e) {
          console.error('[auth.entrar] exception:', e);
          return { ok: false, erro: 'Falha ao entrar. Verifique sua conexão.' };
        } finally {
          set({ carregando: false });
        }
      },

      sair: () => set({ usuario: null })
    }),
    {
      name: 'jobverse-auth',
      // Só persistimos o usuário público — nunca senha/hash.
      partialize: (state) => ({ usuario: state.usuario })
    }
  )
);

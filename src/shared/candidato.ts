import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { emitir } from './realtime';
import { supabase } from './supabase';
import { obterMapaSlugParaId } from './db';
import { vagaPorId as vagaPorIdMock } from '../feira/vagas';
import { useToast } from './toast';

interface DadosCV {
  skills: string[];
  sobre: string;
  github: string;
}

interface CandidatoState {
  id: string | null;
  nome: string;
  email?: string;
  skills: string[];
  sobre: string;
  github: string;
  visitadas: string[];
  candidaturas: string[];
  definir: (dados: { nome: string; email?: string }) => void;
  salvarCV: (dados: DadosCV) => void;
  registrarVisita: (slug: string, dwellSeconds?: number) => void;
  registrarCandidatura: (jobId: string) => void;
  limpar: () => void;
}

// ---------------------------------------------------------------------------
// Helpers de persistência no Supabase. Silenciam erro pra não quebrar a UX.
// ---------------------------------------------------------------------------

interface PerfilCandidatoLocal {
  id: string;
  nome: string;
  email?: string;
  skills: string[];
  sobre: string;
  github: string;
}

async function upsertCandidato(perfil: PerfilCandidatoLocal): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('candidates')
      .upsert(
        {
          id: perfil.id,
          nome: perfil.nome || 'Visitante',
          email: perfil.email ?? null,
          skills: perfil.skills.length ? perfil.skills : null,
          sobre: perfil.sobre || null,
          github: perfil.github || null
        },
        { onConflict: 'id' }
      );
    if (error) {
      console.error('[candidato.upsertCandidato] falha:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[candidato.upsertCandidato] exception:', e);
    return false;
  }
}

async function inserirCandidatura(
  candidateId: string,
  jobId: string
): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('applications')
      .insert({ candidate_id: candidateId, job_id: jobId });
    if (error) {
      // 23505 = unique_violation (já candidatado) — silencia.
      if (error.code === '23505') return;
      console.error('[candidato.inserirCandidatura] falha:', error.message);
      // Toast só pra erros não-esperados.
      try {
        useToast.getState().mostrar('Erro ao salvar candidatura no servidor.', 'erro');
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    console.error('[candidato.inserirCandidatura] exception:', e);
  }
}

async function inserirVisita(
  candidateId: string,
  slug: string,
  dwellSeconds: number
): Promise<void> {
  if (!supabase) return;
  try {
    const mapa = await obterMapaSlugParaId();
    const companyId = mapa.get(slug);
    if (!companyId) {
      // Empresa não está no DB — não dá pra registrar visita.
      console.warn('[candidato.inserirVisita] slug sem company_id:', slug);
      return;
    }
    const { error } = await supabase
      .from('visits')
      .insert({
        candidate_id: candidateId,
        company_id: companyId,
        dwell_seconds: dwellSeconds
      });
    if (error) {
      console.error('[candidato.inserirVisita] falha:', error.message);
    }
  } catch (e) {
    console.error('[candidato.inserirVisita] exception:', e);
  }
}

export const useCandidato = create<CandidatoState>()(
  persist(
    (set, get) => ({
      id: null,
      nome: '',
      email: undefined,
      skills: [],
      sobre: '',
      github: '',
      visitadas: [],
      candidaturas: [],
      definir: ({ nome, email }) => {
        const novoId = crypto.randomUUID();
        set({
          id: novoId,
          nome,
          email,
          // Preserva CV anterior caso o usuário só tenha mudado o nome.
          visitadas: [],
          candidaturas: []
        });
        // Pré-cria o candidato no DB (sem skills/sobre ainda) pra que visitas
        // anteriores ao preenchimento do CV consigam FK.
        void upsertCandidato({
          id: novoId,
          nome,
          email,
          skills: [],
          sobre: '',
          github: ''
        });
      },
      salvarCV: ({ skills, sobre, github }) => {
        set({ skills, sobre, github });
        const state = get();
        if (state.id) {
          void upsertCandidato({
            id: state.id,
            nome: state.nome,
            email: state.email,
            skills,
            sobre,
            github
          });
        }
      },
      registrarVisita: (slug, dwellSeconds) => {
        const state = get();
        const segs = dwellSeconds ?? 0;
        // Broadcast (BroadcastChannel) — fallback cross-tab quando sem Supabase.
        if (state.id) {
          emitir({
            tipo: 'nova-visita',
            candidatoId: state.id,
            companySlug: slug,
            dwellSeconds: segs,
            nomeCandidato: state.nome || 'Visitante'
          });
          // Garante que o candidato existe no DB antes de inserir visit.
          void (async () => {
            const ok = await upsertCandidato({
              id: state.id!,
              nome: state.nome,
              email: state.email,
              skills: state.skills,
              sobre: state.sobre,
              github: state.github
            });
            if (ok) {
              await inserirVisita(state.id!, slug, segs);
            }
          })();
        }
        if (state.visitadas.includes(slug)) return;
        set({ visitadas: [...state.visitadas, slug] });
      },
      registrarCandidatura: (jobId) => {
        const state = get();
        // Resolve slug pelo mock (sempre disponível) só pra emitir o broadcast.
        const vaga = vagaPorIdMock(jobId);
        const companySlug = vaga?.companySlug;
        if (companySlug && state.id) {
          emitir({
            tipo: 'nova-candidatura',
            candidatoId: state.id,
            companySlug,
            jobId,
            nomeCandidato: state.nome || 'Visitante'
          });
        }
        if (state.id) {
          void (async () => {
            const ok = await upsertCandidato({
              id: state.id!,
              nome: state.nome,
              email: state.email,
              skills: state.skills,
              sobre: state.sobre,
              github: state.github
            });
            if (ok) {
              await inserirCandidatura(state.id!, jobId);
            }
          })();
        }
        if (state.candidaturas.includes(jobId)) return;
        set({ candidaturas: [...state.candidaturas, jobId] });
      },
      limpar: () =>
        set({
          id: null,
          nome: '',
          email: undefined,
          skills: [],
          sobre: '',
          github: '',
          visitadas: [],
          candidaturas: []
        })
    }),
    { name: 'jobverse-candidato' }
  )
);

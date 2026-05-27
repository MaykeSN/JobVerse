import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus, Github, KeyRound, Building2, Code2 } from 'lucide-react';
import {
  useAuth,
  type TipoUsuario,
  validarGithub,
  validarSenha
} from '../shared/auth';
import { useUI } from '../shared/ui';
import { useCandidato } from '../shared/candidato';
import { useToast } from '../shared/toast';
import { supabase } from '../shared/supabase';
import { empresas as empresasMock } from '../feira/empresas';
import { tocarClick, tocarSucesso } from '../shared/audio';

type Tab = 'entrar' | 'cadastrar';

export default function AuthModal() {
  const navigate = useNavigate();
  const authModal = useUI((s) => s.authModal);
  const fecharAuth = useUI((s) => s.fecharAuth);
  const cadastrar = useAuth((s) => s.cadastrar);
  const entrar = useAuth((s) => s.entrar);
  const carregando = useAuth((s) => s.carregando);
  const definirCandidato = useCandidato((s) => s.definir);
  const candidatoExistente = useCandidato((s) => s.id);
  const mostrarToast = useToast((s) => s.mostrar);

  const aberto = authModal !== false;
  const tipoInicial: TipoUsuario =
    authModal && authModal.tipoInicial ? authModal.tipoInicial : 'dev';

  const [tab, setTab] = useState<Tab>('cadastrar');
  const [github, setGithub] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>(tipoInicial);
  const [empresaSlug, setEmpresaSlug] = useState<string>(empresasMock[0]?.slug ?? '');
  const [erros, setErros] = useState<{ github?: string; senha?: string; geral?: string }>({});

  const empresas = useMemo(() => empresasMock, []);
  const empresaSelecionada = empresas.find((e) => e.slug === empresaSlug);

  // Reset ao abrir
  useEffect(() => {
    if (aberto) {
      setTab('cadastrar');
      setGithub('');
      setSenha('');
      setTipo(tipoInicial);
      setEmpresaSlug(empresas[0]?.slug ?? '');
      setErros({});
    }
  }, [aberto, tipoInicial, empresas]);

  // ESC fecha
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharAuth();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [aberto, fecharAuth]);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErros({});

    const errGh = validarGithub(github);
    const errSe = validarSenha(senha);
    if (errGh || errSe) {
      setErros({ github: errGh ?? undefined, senha: errSe ?? undefined });
      return;
    }

    tocarClick();

    const resultado =
      tab === 'cadastrar'
        ? await cadastrar({
            github,
            senha,
            tipo,
            empresaSlug: tipo === 'recrutador' ? empresaSlug : undefined
          })
        : await entrar(github, senha);

    if (!resultado.ok) {
      setErros({ geral: resultado.erro });
      mostrarToast(resultado.erro, 'erro');
      return;
    }

    // Pega o usuário recém-logado direto do store (já foi setado pelo cadastrar/entrar)
    const usuario = useAuth.getState().usuario;
    if (!usuario) {
      setErros({ geral: 'Falha inesperada após login.' });
      return;
    }

    // Se for dev, garante um candidato local ligado ao users.id
    if (usuario.tipo === 'dev') {
      if (!candidatoExistente) {
        // Sessão nova → cria o candidato já ligado ao user.
        definirCandidato({ nome: usuario.github, userId: usuario.id });
      } else {
        // Candidato local já existe (visitante anônimo virou dev) — só
        // pluga o userId sem perder skills/sobre/candidaturas que ele tinha.
        useCandidato.setState({ userId: usuario.id });
      }
    }

    tocarSucesso();
    mostrarToast(
      tab === 'cadastrar'
        ? `Conta criada. Bem-vindo, ${usuario.github}!`
        : `Bem-vindo de volta, ${usuario.github}!`,
      'sucesso'
    );
    fecharAuth();

    if (usuario.tipo === 'dev') {
      navigate('/feira');
    } else if (usuario.empresaSlug) {
      navigate(`/recrutador/${usuario.empresaSlug}`);
    } else {
      navigate('/recrutador');
    }
  };

  const corAtiva = tipo === 'dev' ? '#00D4FF' : '#FF4B91';
  const semBackend = supabase === null;

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-bg-deep/85 backdrop-blur-md"
          onClick={fecharAuth}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border bg-bg-panel/95 backdrop-blur shadow-2xl overflow-hidden"
            style={{
              borderColor: `${corAtiva}55`,
              boxShadow: `0 0 60px ${corAtiva}44`
            }}
          >
            {/* Header */}
            <div
              className="relative px-6 py-5 border-b"
              style={{ borderColor: `${corAtiva}33` }}
            >
              <button
                type="button"
                onClick={fecharAuth}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-bright hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <p
                className="text-[10px] uppercase tracking-[0.3em] mb-1"
                style={{ color: corAtiva }}
              >
                {tab === 'cadastrar' ? 'Criar conta' : 'Entrar'}
              </p>
              <h2 className="font-display text-2xl text-text-bright">JobVerse</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
              {(['cadastrar', 'entrar'] as Tab[]).map((t) => {
                const ativo = tab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTab(t);
                      setErros({});
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-[0.25em] transition ${
                      ativo
                        ? 'text-text-bright bg-white/5'
                        : 'text-text-dim hover:text-text-bright hover:bg-white/[0.03]'
                    }`}
                    style={ativo ? { boxShadow: `inset 0 -2px 0 ${corAtiva}` } : undefined}
                  >
                    {t === 'cadastrar' ? (
                      <UserPlus className="w-3.5 h-3.5" />
                    ) : (
                      <LogIn className="w-3.5 h-3.5" />
                    )}
                    {t === 'cadastrar' ? 'Cadastrar' : 'Entrar'}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={submeter} className="px-6 py-5 space-y-4">
              {semBackend && (
                <div className="text-xs px-3 py-2 rounded-lg border border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta">
                  Backend não configurado. Defina <code>VITE_SUPABASE_URL</code> e{' '}
                  <code>VITE_SUPABASE_ANON_KEY</code> no <code>.env</code>.
                </div>
              )}

              {/* GitHub */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-text-dim mb-1.5">
                  Usuário do GitHub
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-bg-elev/60 transition focus-within:border-text-bright/30"
                  style={{ borderColor: `${corAtiva}33` }}
                >
                  <Github className="w-4 h-4 text-text-dim shrink-0" />
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="seu-usuario"
                    autoComplete="username"
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-sm text-text-bright placeholder:text-text-muted"
                  />
                </div>
                {erros.github && (
                  <p className="text-[11px] text-neon-magenta mt-1">{erros.github}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-text-dim mb-1.5">
                  Senha
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-bg-elev/60 transition focus-within:border-text-bright/30"
                  style={{ borderColor: `${corAtiva}33` }}
                >
                  <KeyRound className="w-4 h-4 text-text-dim shrink-0" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••"
                    autoComplete={tab === 'cadastrar' ? 'new-password' : 'current-password'}
                    className="flex-1 bg-transparent outline-none text-sm text-text-bright placeholder:text-text-muted"
                  />
                </div>
                {erros.senha && (
                  <p className="text-[11px] text-neon-magenta mt-1">{erros.senha}</p>
                )}
              </div>

              {/* Tipo (só no cadastro) */}
              {tab === 'cadastrar' && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-text-dim mb-2">
                    Eu sou
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTipo('dev')}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition"
                      style={
                        tipo === 'dev'
                          ? {
                              borderColor: '#00D4FF',
                              background: 'rgba(0,212,255,0.12)',
                              boxShadow: '0 0 18px rgba(0,212,255,0.35)',
                              color: '#00D4FF'
                            }
                          : { borderColor: 'rgba(255,255,255,0.08)', color: '#94A3B8' }
                      }
                    >
                      <Code2 className="w-4 h-4" />
                      <span className="text-sm font-display tracking-wide">Dev</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo('recrutador')}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition"
                      style={
                        tipo === 'recrutador'
                          ? {
                              borderColor: '#FF4B91',
                              background: 'rgba(255,75,145,0.12)',
                              boxShadow: '0 0 18px rgba(255,75,145,0.35)',
                              color: '#FF4B91'
                            }
                          : { borderColor: 'rgba(255,255,255,0.08)', color: '#94A3B8' }
                      }
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-display tracking-wide">Recrutador</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Empresa (só recrutador, só no cadastro) */}
              {tab === 'cadastrar' && tipo === 'recrutador' && (
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-text-dim mb-1.5">
                    Empresa que você representa
                  </label>
                  <select
                    value={empresaSlug}
                    onChange={(e) => setEmpresaSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-bg-elev/60 text-sm text-text-bright outline-none transition focus:border-text-bright/30"
                    style={{
                      borderColor: empresaSelecionada
                        ? `${empresaSelecionada.cor}55`
                        : 'rgba(255,75,145,0.33)'
                    }}
                  >
                    {empresas.map((e) => (
                      <option key={e.slug} value={e.slug} className="bg-bg-panel">
                        {e.nome}
                      </option>
                    ))}
                  </select>
                  {empresaSelecionada && (
                    <p
                      className="text-[11px] mt-1.5"
                      style={{ color: empresaSelecionada.cor }}
                    >
                      ● {empresaSelecionada.missao}
                    </p>
                  )}
                </div>
              )}

              {erros.geral && (
                <p className="text-sm text-neon-magenta">{erros.geral}</p>
              )}

              {/* Botão submit */}
              <motion.button
                type="submit"
                disabled={carregando}
                whileHover={!carregando ? { scale: 1.02 } : undefined}
                whileTap={!carregando ? { scale: 0.98 } : undefined}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-display text-sm tracking-[0.15em] uppercase font-bold text-bg-deep transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: corAtiva,
                  boxShadow: `0 0 28px ${corAtiva}66`
                }}
              >
                {carregando ? (
                  'Processando…'
                ) : tab === 'cadastrar' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Criar conta
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </motion.button>

              <p className="text-[10px] text-text-muted text-center pt-1">
                {tab === 'cadastrar'
                  ? 'Já tem conta? Use a aba Entrar.'
                  : 'Primeira vez? Use a aba Cadastrar.'}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

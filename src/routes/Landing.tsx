import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Building2, LogOut } from 'lucide-react';
import ParticulasBg from '../shared/ParticulasBg';
import SeletorQualidade from '../components/SeletorQualidade';
import ToggleAudio from '../components/ToggleAudio';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../shared/auth';
import { useUI } from '../shared/ui';
import { useCandidato } from '../shared/candidato';

export default function Landing() {
  const navigate = useNavigate();
  const usuario = useAuth((s) => s.usuario);
  const sair = useAuth((s) => s.sair);
  const abrirAuth = useUI((s) => s.abrirAuth);
  const definirCandidato = useCandidato((s) => s.definir);
  const candidatoId = useCandidato((s) => s.id);
  const candidatoUserId = useCandidato((s) => s.userId);
  const limparCandidato = useCandidato((s) => s.limpar);

  const irPraDestino = () => {
    if (!usuario) return;
    if (usuario.tipo === 'dev') {
      // Garante candidato local ligado ao user.id pra rastrear candidaturas.
      // - Sem candidato → cria do zero.
      // - Com candidato mas userId vazio → só pluga o userId, preservando CV/candidaturas.
      if (!candidatoId) {
        definirCandidato({ nome: usuario.github, userId: usuario.id });
      } else if (candidatoUserId !== usuario.id) {
        useCandidato.setState({ userId: usuario.id });
      }
      navigate('/feira');
    } else if (usuario.empresaSlug) {
      navigate(`/recrutador/${usuario.empresaSlug}`);
    } else {
      navigate('/recrutador');
    }
  };

  const fazerLogout = () => {
    sair();
    limparCandidato();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticulasBg />
      <SeletorQualidade posicao="bottom-right" />
      <ToggleAudio posicao="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-xl w-full mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 backdrop-blur-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-neon-cyan">
            HackWeb 2026 · ExpoVerse
          </span>
        </motion.div>

        <h1 className="font-display text-6xl md:text-7xl font-black tracking-tight mb-4 animate-glitch">
          <span className="text-glow-cyan">JOB</span>
          <span className="text-neon-magenta text-glow-magenta">VERSE</span>
        </h1>

        <p className="text-text-dim text-lg mb-10 leading-relaxed">
          Feira de empregos imersiva pra devs.<br />
          Entre, explore, sinta a cultura — e leve uma vaga.
        </p>

        {usuario ? (
          // -------- Logado --------
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-neon-cyan/20 bg-bg-panel/70 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-bold"
                  style={{
                    background:
                      usuario.tipo === 'dev'
                        ? 'rgba(0,212,255,0.15)'
                        : 'rgba(255,75,145,0.15)',
                    color: usuario.tipo === 'dev' ? '#00D4FF' : '#FF4B91',
                    boxShadow:
                      usuario.tipo === 'dev'
                        ? '0 0 18px rgba(0,212,255,0.35)'
                        : '0 0 18px rgba(255,75,145,0.35)'
                  }}
                >
                  {usuario.github.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-display text-base text-text-bright leading-tight">
                    {usuario.github}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-text-dim">
                    {usuario.tipo === 'dev' ? 'Dev' : 'Recrutador'}
                    {usuario.empresaSlug ? ` · ${usuario.empresaSlug}` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fazerLogout}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-text-dim hover:text-neon-magenta transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </motion.div>

            <motion.button
              type="button"
              onClick={irPraDestino}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-bg-deep font-display font-bold tracking-[0.15em] uppercase shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_45px_rgba(255,75,145,0.55)] transition-shadow inline-flex items-center justify-center gap-2"
            >
              Entrar no JobVerse
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        ) : (
          // -------- Não logado --------
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={() => abrirAuth('dev')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-xl border border-neon-cyan/40 bg-bg-panel/60 backdrop-blur text-text-bright hover:border-neon-cyan hover:bg-bg-panel/80 hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] transition"
            >
              <Code2 className="w-6 h-6 text-neon-cyan group-hover:scale-110 transition-transform" />
              <span className="font-display text-base text-glow-cyan">Sou dev</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-text-dim">
                Entrar / Cadastrar
              </span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => abrirAuth('recrutador')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-xl border border-neon-magenta/40 bg-bg-panel/60 backdrop-blur text-text-bright hover:border-neon-magenta hover:bg-bg-panel/80 hover:shadow-[0_0_28px_rgba(255,75,145,0.45)] transition"
            >
              <Building2 className="w-6 h-6 text-neon-magenta group-hover:scale-110 transition-transform" />
              <span className="font-display text-base text-glow-magenta">Sou recrutador</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-text-dim">
                Acessar painel
              </span>
            </motion.button>
          </div>
        )}

        <p className="text-xs text-text-muted mt-8 tracking-wider">
          Protótipo · iRede Tecnologia · Web3 · 2026
        </p>
      </motion.div>

      <AuthModal />
    </div>
  );
}

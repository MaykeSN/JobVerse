import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ParticulasBg from '../shared/ParticulasBg';
import { useCandidato } from '../shared/candidato';
import SeletorQualidade from '../components/SeletorQualidade';

export default function Landing() {
  const navigate = useNavigate();
  const definir = useCandidato((s) => s.definir);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    definir({ nome: nome.trim(), email: email.trim() || undefined });
    navigate('/feira');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticulasBg />
      <SeletorQualidade posicao="bottom-right" />

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

        <h1 className="font-display text-6xl md:text-7xl font-black tracking-tight mb-4">
          <span className="text-glow-cyan">JOB</span>
          <span className="text-neon-magenta text-glow-magenta">VERSE</span>
        </h1>

        <p className="text-text-dim text-lg mb-10 leading-relaxed">
          Feira de empregos imersiva pra devs.<br />
          Entre, explore, sinta a cultura — e leve uma vaga.
        </p>

        <form onSubmit={entrar} className="space-y-3">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            required
            autoFocus
            className="w-full px-5 py-3 rounded-lg bg-bg-panel/80 backdrop-blur border border-neon-cyan/20 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30 transition placeholder:text-text-muted"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opcional)"
            className="w-full px-5 py-3 rounded-lg bg-bg-panel/80 backdrop-blur border border-neon-cyan/20 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30 transition placeholder:text-text-muted"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full px-6 py-3 mt-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-bg-deep font-display font-bold tracking-[0.15em] uppercase shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_45px_rgba(255,75,145,0.55)] transition-shadow inline-flex items-center justify-center gap-2"
          >
            Entrar na feira
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>

        <p className="text-xs text-text-muted mt-8 tracking-wider">
          Protótipo · iRede Tecnologia · Web3 · 2026
        </p>
      </motion.div>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { empresaPorSlug } from '../feira/empresas';

export default function Recrutador() {
  const { slug } = useParams<{ slug: string }>();
  const empresa = slug ? empresaPorSlug(slug) : undefined;

  if (!empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="font-display text-2xl text-neon-magenta mb-4">Empresa não encontrada</p>
          <Link to="/" className="text-text-dim hover:text-neon-cyan">← Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-bg-deep">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-dim hover:text-neon-cyan transition mb-8"
      >
        <ArrowLeft className="w-3 h-3" />
        Voltar
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-text-dim mb-2">Dashboard do recrutador</p>
        <h1
          className="font-display text-5xl font-bold mb-2"
          style={{ color: empresa.cor, textShadow: `0 0 14px ${empresa.cor}77` }}
        >
          {empresa.nome}
        </h1>
        <p className="text-text-dim mb-12">{empresa.missao}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card CVs */}
          <div className="rounded-xl border border-neon-cyan/20 bg-bg-panel/50 backdrop-blur p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-text-dim mb-2">CVs recebidos</p>
            <p className="font-display text-4xl text-glow-cyan mb-4">0</p>
            <p className="text-sm text-text-muted">Lista realtime chega na fase 5.</p>
          </div>

          {/* Card Visitas */}
          <div className="rounded-xl border border-neon-magenta/20 bg-bg-panel/50 backdrop-blur p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-text-dim mb-2">Visitas</p>
            <p className="font-display text-4xl text-glow-magenta mb-4">0</p>
            <p className="text-sm text-text-muted">Heatmap + dwell time na fase 5.</p>
          </div>

          {/* Card IA em breve */}
          <div className="relative rounded-xl border border-neon-purple/30 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 backdrop-blur p-6 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
            <div className="relative">
              <Sparkles className="w-6 h-6 text-neon-purple mb-3" />
              <p className="text-xs uppercase tracking-[0.2em] text-neon-purple mb-2">Análise IA</p>
              <p className="font-display text-xl mb-2">Em breve</p>
              <p className="text-sm text-text-muted">Resumo automático de CV, match score e insights agregados.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-text-muted">
          Stack da empresa: {empresa.stack.join(' · ')}
        </div>
      </motion.div>
    </div>
  );
}

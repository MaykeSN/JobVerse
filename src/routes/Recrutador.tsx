import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { empresaPorSlug } from '../feira/empresas';
import ParticulasBg from '../shared/ParticulasBg';
import ListaCVs from '../recrutador/ListaCVs';
import Heatmap from '../recrutador/Heatmap';
import IAEmBreve from '../recrutador/IAEmBreve';
import IndicadorAoVivo from '../recrutador/IndicadorAoVivo';

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
    <div className="relative min-h-screen bg-bg-deep overflow-hidden">
      {/* Background sutil de partículas */}
      <ParticulasBg densidade="baixa" />

      <div className="relative z-10 p-6 md:p-10">
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
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-dim mb-2">
                Dashboard do recrutador
              </p>
              <h1
                className="font-display text-4xl md:text-5xl font-bold mb-2"
                style={{ color: empresa.cor, textShadow: `0 0 14px ${empresa.cor}77` }}
              >
                {empresa.nome}
              </h1>
              <p className="text-text-dim max-w-xl">{empresa.missao}</p>
            </div>
            <IndicadorAoVivo />
          </div>

          {/* Grid principal: 60/40 no desktop, 1col mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Coluna 1 — Lista de CVs (60%) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="lg:col-span-3"
            >
              <ListaCVs empresa={empresa} />
            </motion.div>

            {/* Coluna 2 — Heatmap + IA (40%) */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Heatmap empresa={empresa} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <IAEmBreve />
              </motion.div>
            </div>
          </div>

          {/* Footer com stack */}
          <div className="mt-12 text-xs text-text-muted">
            Stack da empresa: {empresa.stack.join(' · ')}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, Eye, ArrowRight } from 'lucide-react';
import { empresaPorSlug } from '../feira/empresas';
import { useEmpresas } from '../shared/db';
import { useAuth } from '../shared/auth';
import ParticulasBg from '../shared/ParticulasBg';
import ListaCVs from '../recrutador/ListaCVs';
import Heatmap from '../recrutador/Heatmap';
import IAEmBreve from '../recrutador/IAEmBreve';
import IndicadorAoVivo from '../recrutador/IndicadorAoVivo';

export default function Recrutador() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const usuario = useAuth((s) => s.usuario);

  // Tenta primeiro pela lista vinda do DB; se não chegou ainda, cai no mock.
  const { dados: empresasDb } = useEmpresas();
  const empresaDb = slug ? empresasDb.find((e) => e.slug === slug) : undefined;
  const empresa = empresaDb ?? (slug ? empresaPorSlug(slug) : undefined);

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

  // Recrutador logado tentando ver empresa que NÃO é a dele → bloqueia.
  const recrutadorSemAcesso =
    usuario?.tipo === 'recrutador' && usuario.empresaSlug && usuario.empresaSlug !== slug;

  if (recrutadorSemAcesso && usuario) {
    return (
      <div className="relative min-h-screen bg-bg-deep overflow-hidden">
        <ParticulasBg densidade="baixa" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center px-8 py-10 rounded-2xl border border-neon-magenta/40 bg-bg-panel/80 backdrop-blur shadow-[0_0_40px_rgba(255,75,145,0.3)]"
          >
            <ShieldAlert className="w-10 h-10 text-neon-magenta mx-auto mb-4" />
            <h2 className="font-display text-2xl text-glow-magenta mb-2">
              Acesso restrito
            </h2>
            <p className="text-sm text-text-dim mb-6 leading-relaxed">
              Você está logado como recrutador da{' '}
              <span className="text-text-bright">{usuario.empresaSlug}</span> e não tem
              permissão pra ver o painel da{' '}
              <span style={{ color: empresa.cor }}>{empresa.nome}</span>.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/recrutador/${usuario.empresaSlug}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-magenta text-bg-deep font-display text-sm tracking-[0.15em] uppercase font-bold shadow-[0_0_22px_rgba(255,75,145,0.5)] hover:scale-[1.02] transition"
            >
              Ir pro meu painel
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-4">
              <Link
                to="/"
                className="text-[11px] uppercase tracking-[0.25em] text-text-dim hover:text-neon-cyan transition"
              >
                ← Voltar pra landing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Estado "demo público" — sem login OU dev espiando
  const modoDemo = !usuario || usuario.tipo !== 'recrutador';

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

        {modoDemo && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 max-w-6xl mx-auto inline-flex items-center gap-2 px-3 py-2 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 backdrop-blur text-[11px] uppercase tracking-[0.2em]"
          >
            <Eye className="w-3.5 h-3.5 text-neon-magenta" />
            <span className="text-neon-magenta">Modo demo</span>
            <span className="text-text-dim normal-case tracking-normal">
              · faça login pra acessar como recrutador
            </span>
          </motion.div>
        )}

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

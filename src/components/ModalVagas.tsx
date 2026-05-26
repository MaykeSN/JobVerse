import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Briefcase, Check } from 'lucide-react';
import type { Empresa } from '../shared/tipos';
import { vagasPorSlug } from '../feira/vagas';
import { useCandidato } from '../shared/candidato';
import { useUI } from '../shared/ui';

interface Props {
  empresa: Empresa | null;
  onFechar: () => void;
}

const BADGE_POR_SENIORIDADE: Record<string, string> = {
  'júnior': 'bg-neon-lime/15 text-neon-lime border-neon-lime/30',
  'pleno': 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30',
  'sênior': 'bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30'
};

export default function ModalVagas({ empresa, onFechar }: Props) {
  const abrirCV = useUI((s) => s.abrirCV);
  const candidaturas = useCandidato((s) => s.candidaturas);

  const vagas = useMemo(
    () => (empresa ? vagasPorSlug(empresa.slug) : []),
    [empresa]
  );

  // ESC fecha
  useEffect(() => {
    if (!empresa) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [empresa, onFechar]);

  return (
    <AnimatePresence>
      {empresa && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-bg-deep/75 backdrop-blur-md"
          onClick={onFechar}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border bg-bg-panel/95 backdrop-blur shadow-2xl overflow-hidden"
            style={{
              borderColor: `${empresa.cor}55`,
              boxShadow: `0 0 60px ${empresa.cor}33`
            }}
          >
            {/* Header */}
            <div
              className="relative px-7 py-6 border-b"
              style={{ borderColor: `${empresa.cor}33` }}
            >
              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-bright hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4" style={{ color: empresa.cor }} />
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: empresa.cor }}
                >
                  Vagas abertas
                </span>
              </div>
              <h2
                className="font-display text-3xl md:text-4xl font-bold"
                style={{
                  color: empresa.cor,
                  textShadow: `0 0 18px ${empresa.cor}99`
                }}
              >
                {empresa.nome}
              </h2>
              <p className="text-text-dim mt-2 leading-relaxed max-w-2xl">
                {empresa.missao}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {empresa.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: `${empresa.cor}55`,
                      color: empresa.cor,
                      background: `${empresa.cor}10`
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Lista de vagas */}
            <div className="overflow-y-auto px-7 py-5 space-y-4">
              {vagas.length === 0 ? (
                <p className="text-text-dim text-sm">
                  Nenhuma vaga cadastrada no momento.
                </p>
              ) : (
                vagas.map((vaga) => {
                  const jaCandidatou = candidaturas.includes(vaga.id);
                  const badge =
                    BADGE_POR_SENIORIDADE[vaga.senioridade] ??
                    'bg-text-dim/15 text-text-dim border-text-dim/30';

                  return (
                    <motion.article
                      key={vaga.id}
                      layout
                      className="rounded-xl border border-white/5 bg-bg-elev/60 p-5 hover:border-white/10 transition"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-lg text-text-bright leading-tight">
                          {vaga.titulo}
                        </h3>
                        <span
                          className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border whitespace-nowrap ${badge}`}
                        >
                          {vaga.senioridade}
                        </span>
                      </div>

                      <p className="text-sm text-text-dim leading-relaxed mb-3">
                        {vaga.descricao}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {vaga.requisitos.map((req) => (
                          <span
                            key={req}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-text-dim border border-white/5"
                          >
                            {req}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={jaCandidatou}
                        onClick={() => abrirCV(vaga)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm tracking-[0.15em] uppercase transition ${
                          jaCandidatou
                            ? 'border border-neon-irede/40 text-neon-irede bg-neon-irede/10 cursor-default'
                            : 'border text-bg-deep font-bold hover:scale-[1.02]'
                        }`}
                        style={
                          jaCandidatou
                            ? undefined
                            : {
                                background: empresa.cor,
                                borderColor: empresa.cor,
                                boxShadow: `0 0 22px ${empresa.cor}55`
                              }
                        }
                      >
                        {jaCandidatou ? (
                          <>
                            <Check className="w-4 h-4" />
                            Candidatado
                          </>
                        ) : (
                          'Candidatar'
                        )}
                      </button>
                    </motion.article>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

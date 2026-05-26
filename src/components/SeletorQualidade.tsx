import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Gauge, Battery } from 'lucide-react';
import { useGraficos, type Qualidade } from '../shared/graficos';

const OPCOES: { valor: Qualidade; label: string; descricao: string; Icon: typeof Zap }[] = [
  { valor: 'alta', label: 'Alta', descricao: 'Reflexo, bloom, partículas cheias', Icon: Zap },
  { valor: 'media', label: 'Média', descricao: 'Balanceado pra notebooks', Icon: Gauge },
  { valor: 'baixa', label: 'Baixa', descricao: 'Sem reflexo nem pós-fx', Icon: Battery }
];

interface Props {
  posicao?: 'bottom-left' | 'bottom-right' | 'top-right';
}

export default function SeletorQualidade({ posicao = 'bottom-left' }: Props) {
  const qualidade = useGraficos((s) => s.qualidade);
  const setQualidade = useGraficos((s) => s.setQualidade);
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [aberto]);

  const posClasses =
    posicao === 'bottom-right'
      ? 'bottom-4 right-4'
      : posicao === 'top-right'
      ? 'top-4 right-4'
      : 'bottom-4 left-4';

  const opcaoAtual = OPCOES.find((o) => o.valor === qualidade)!;

  return (
    <div ref={ref} className={`absolute ${posClasses} z-30 pointer-events-auto`}>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neon-cyan/30 bg-bg-panel/80 backdrop-blur text-text-bright hover:border-neon-cyan/60 hover:bg-bg-panel transition"
      >
        <Settings className="w-4 h-4 text-neon-cyan" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-text-dim">Qualidade</span>
        <span className="font-display text-sm text-glow-cyan">{opcaoAtual.label}</span>
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${posicao.includes('bottom') ? 'bottom-full mb-2' : 'top-full mt-2'} ${posicao.includes('right') ? 'right-0' : 'left-0'} w-64 rounded-xl border border-neon-cyan/20 bg-bg-panel/95 backdrop-blur p-1 shadow-[0_0_30px_rgba(0,212,255,0.15)]`}
          >
            {OPCOES.map(({ valor, label, descricao, Icon }) => {
              const ativo = valor === qualidade;
              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => {
                    setQualidade(valor);
                    setAberto(false);
                  }}
                  className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition ${
                    ativo ? 'bg-neon-cyan/10' : 'hover:bg-neon-cyan/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${ativo ? 'text-neon-cyan' : 'text-text-dim'}`} />
                  <div className="flex-1">
                    <p className={`font-display text-sm ${ativo ? 'text-glow-cyan' : 'text-text-bright'}`}>
                      {label}
                    </p>
                    <p className="text-[11px] text-text-dim leading-tight mt-0.5">{descricao}</p>
                  </div>
                  {ativo && <span className="text-[10px] text-neon-cyan mt-1">●</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

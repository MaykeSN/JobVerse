import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useToast, type ToastMsg } from '../shared/toast';

const TEMPO_VIDA_MS = 3500;

const ESTILO_POR_TIPO: Record<
  ToastMsg['tipo'],
  { acento: string; sombra: string; borda: string; Icon: typeof CheckCircle2 }
> = {
  sucesso: {
    acento: 'text-neon-irede',
    sombra: 'shadow-[0_0_30px_rgba(0,200,150,0.45)]',
    borda: 'border-neon-irede/40',
    Icon: CheckCircle2
  },
  info: {
    acento: 'text-neon-cyan',
    sombra: 'shadow-[0_0_30px_rgba(0,212,255,0.45)]',
    borda: 'border-neon-cyan/40',
    Icon: Info
  },
  erro: {
    acento: 'text-neon-magenta',
    sombra: 'shadow-[0_0_30px_rgba(255,75,145,0.45)]',
    borda: 'border-neon-magenta/40',
    Icon: AlertTriangle
  }
};

function ToastItem({ toast }: { toast: ToastMsg }) {
  const remover = useToast((s) => s.remover);
  const { acento, sombra, borda, Icon } = ESTILO_POR_TIPO[toast.tipo];

  useEffect(() => {
    const t = setTimeout(() => remover(toast.id), TEMPO_VIDA_MS);
    return () => clearTimeout(t);
  }, [toast.id, remover]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.92 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border ${borda} bg-bg-panel/95 backdrop-blur ${sombra} min-w-[280px] max-w-md`}
    >
      <Icon className={`w-5 h-5 mt-0.5 ${acento} shrink-0`} />
      <p className="text-sm text-text-bright leading-snug">{toast.mensagem}</p>
    </motion.div>
  );
}

/**
 * Container global de toasts. Renderizar uma vez no topo da árvore que
 * deve exibi-los (ex.: rota /feira).
 */
export default function Toast() {
  const fila = useToast((s) => s.fila);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence initial={false}>
        {fila.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

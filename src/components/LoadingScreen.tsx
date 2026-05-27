import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Overlay HTML (fora do Canvas) que mostra progresso de carregamento
 * de assets 3D (Environment HDRI, fontes do drei Text, etc).
 * Some assim que `useProgress.active` vira `false`.
 */
export default function LoadingScreen() {
  const { progress, active } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-bg-deep"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] text-text-dim mb-3"
          >
            Carregando a feira
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-5xl font-black mb-8 animate-glitch"
          >
            <span className="text-glow-cyan">JOB</span>
            <span className="text-neon-magenta text-glow-magenta">VERSE</span>
          </motion.h1>

          <div className="w-64 h-1.5 rounded-full bg-bg-panel overflow-hidden border border-neon-cyan/20">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta shadow-[0_0_12px_rgba(0,212,255,0.6)]"
            />
          </div>

          <p className="font-display text-xs text-text-dim mt-3 tracking-widest">
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

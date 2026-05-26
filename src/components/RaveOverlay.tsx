import { motion, AnimatePresence } from 'framer-motion';
import { useRave } from '../shared/easter-eggs';

/**
 * Overlay sutil que pulsa em magenta/cyan quando o easter egg do
 * Konami code está ativo. Não bloqueia interações (pointer-events-none).
 */
export default function RaveOverlay() {
  const ativo = useRave((s) => s.ativo);

  return (
    <AnimatePresence>
      {ativo && (
        <>
          <motion.div
            key="strobe"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.35, 0.1, 0.4, 0.08, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute inset-0 z-40 pointer-events-none mix-blend-screen"
            style={{
              background:
                'radial-gradient(circle at 30% 40%, rgba(255,75,145,0.6), transparent 60%), radial-gradient(circle at 70% 60%, rgba(0,212,255,0.5), transparent 60%)'
            }}
          />

          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: [1, 1.08, 1],
              rotate: [-2, 2, -2]
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.8, repeat: Infinity },
              rotate: { duration: 0.6, repeat: Infinity }
            }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="px-5 py-2 rounded-full border-2 border-neon-magenta bg-bg-panel/90 shadow-[0_0_30px_rgba(255,75,145,0.7)]">
              <span className="font-display text-sm tracking-[0.3em] text-glow-magenta">
                🎉 RAVE MODE
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

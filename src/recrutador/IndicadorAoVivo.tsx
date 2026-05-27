import { motion } from 'framer-motion';

/**
 * Pill pulsante "AO VIVO". Pulsação infinita via framer-motion.
 * Visual cyberpunk: lime neon com glow.
 */
export default function IndicadorAoVivo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-lime/40 bg-neon-lime/10"
      style={{ boxShadow: '0 0 18px rgba(132, 204, 22, 0.25)' }}
    >
      <motion.span
        animate={{ opacity: [1, 0.35, 1], scale: [1, 0.85, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-2 h-2 rounded-full bg-neon-lime"
        style={{ boxShadow: '0 0 10px #84CC16' }}
      />
      <span className="text-[10px] font-display uppercase tracking-[0.3em] text-neon-lime">
        Ao vivo
      </span>
    </motion.div>
  );
}

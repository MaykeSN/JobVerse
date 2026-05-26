import { Sparkles } from 'lucide-react';

/**
 * Card "Análise IA — em breve". Slot reservado pra LLM no roadmap.
 * Visual de stub deliberado (gradient + blur) — comunica futuro sem mentir.
 */
export default function IAEmBreve() {
  return (
    <div className="relative rounded-xl border border-neon-purple/30 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 backdrop-blur p-6 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative">
        <Sparkles className="w-6 h-6 text-neon-purple mb-3" />
        <p className="text-xs uppercase tracking-[0.2em] text-neon-purple mb-2">Análise IA</p>
        <p className="font-display text-xl mb-2">Em breve</p>
        <p className="text-sm text-text-muted">
          Resumo automático de CV, match score e insights agregados do estande.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 px-3 py-1.5 rounded-lg text-xs uppercase tracking-[0.2em] border border-neon-purple/30 text-text-muted opacity-50 cursor-not-allowed"
        >
          Gerar resumo
        </button>
      </div>
    </div>
  );
}

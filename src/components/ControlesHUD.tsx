/**
 * Hint de controles estilo gamepad — fica no canto inferior central da Feira.
 * Duas linhas: movimento (WASD/Shift/Mouse) e ações de UI (Q/V/L/M/ESC).
 * Atalhos de UI existem pra contornar a limitação do pointer lock — não dá
 * pra clicar em botões HTML sem soltar o cursor, então atalhos fazem o mesmo.
 */

interface TeclaProps {
  keys: string[];
  label: string;
  variant?: 'default' | 'mouse' | 'destaque';
}

function Tecla({ keys, label, variant = 'default' }: TeclaProps) {
  const tema =
    variant === 'destaque'
      ? 'border-neon-magenta/40 text-neon-magenta shadow-[inset_0_-2px_0_0_rgba(255,75,145,0.18),0_0_10px_rgba(255,75,145,0.22)]'
      : variant === 'mouse'
      ? 'border-neon-purple/40 text-neon-purple shadow-[inset_0_-2px_0_0_rgba(168,85,247,0.18),0_0_10px_rgba(168,85,247,0.22)]'
      : 'border-neon-cyan/35 text-neon-cyan shadow-[inset_0_-2px_0_0_rgba(0,212,255,0.18),0_0_10px_rgba(0,212,255,0.20)]';

  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex gap-0.5">
        {keys.map((k) => (
          <span
            key={k}
            className={`min-w-[22px] h-[26px] px-1.5 inline-flex items-center justify-center rounded-md border bg-bg-panel/95 text-[10px] font-mono font-bold ${tema}`}
          >
            {k}
          </span>
        ))}
      </div>
      <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim">{label}</span>
    </div>
  );
}

function Divisor() {
  return <span className="w-px h-8 bg-neon-cyan/15" />;
}

function WASDCluster() {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex flex-col items-center gap-0.5">
        <span className="min-w-[22px] h-[26px] px-1.5 inline-flex items-center justify-center rounded-md border border-neon-cyan/35 bg-bg-panel/95 text-[10px] font-mono font-bold text-neon-cyan shadow-[inset_0_-2px_0_0_rgba(0,212,255,0.18),0_0_10px_rgba(0,212,255,0.20)]">
          W
        </span>
        <div className="flex gap-0.5">
          {['A', 'S', 'D'].map((k) => (
            <span
              key={k}
              className="min-w-[22px] h-[26px] px-1.5 inline-flex items-center justify-center rounded-md border border-neon-cyan/35 bg-bg-panel/95 text-[10px] font-mono font-bold text-neon-cyan shadow-[inset_0_-2px_0_0_rgba(0,212,255,0.18),0_0_10px_rgba(0,212,255,0.20)]"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
      <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim">Mover</span>
    </div>
  );
}

interface Props {
  mostrarM?: boolean;
  mostrarB?: boolean;
}

export default function ControlesHUD({ mostrarM = false, mostrarB = false }: Props) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border border-neon-cyan/15 bg-bg-deep/70 backdrop-blur-lg shadow-[0_0_30px_rgba(0,212,255,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        {/* Linha 1 — Movimento */}
        <div className="flex items-center gap-3">
          <WASDCluster />
          <Divisor />
          <Tecla keys={['⇧']} label="Correr" />
          <Divisor />
          <Tecla keys={['🖱']} label="Estande" variant="mouse" />
        </div>

        {/* Linha 2 — Ações de UI (atalhos pra contornar pointer lock) */}
        <div className="flex items-center gap-3 pt-1 border-t border-neon-cyan/10 w-full justify-center">
          <Tecla keys={['Q']} label="Qualidade" variant="destaque" />
          <Divisor />
          <Tecla keys={['V']} label="Áudio" />
          <Divisor />
          <Tecla keys={['L']} label="Sair" />
          {mostrarB && (
            <>
              <Divisor />
              <Tecla keys={['B']} label="Lobby" variant="mouse" />
            </>
          )}
          {mostrarM && (
            <>
              <Divisor />
              <Tecla keys={['M']} label="CVs" variant="destaque" />
            </>
          )}
          <Divisor />
          <Tecla keys={['ESC']} label="Cursor" />
        </div>
      </div>
    </div>
  );
}

import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../shared/audio';

interface Props {
  posicao?: 'top-right' | 'bottom-right' | 'top-left';
}

export default function ToggleAudio({ posicao = 'top-right' }: Props) {
  const habilitado = useAudio((s) => s.habilitado);
  const toggle = useAudio((s) => s.toggle);

  const posClasses =
    posicao === 'bottom-right'
      ? 'bottom-4 right-4'
      : posicao === 'top-left'
      ? 'top-4 left-4'
      : 'top-4 right-4';

  return (
    <button
      type="button"
      onClick={toggle}
      title={habilitado ? 'Desligar áudio ambiente' : 'Ligar áudio ambiente (synth)'}
      className={`absolute ${posClasses} z-30 inline-flex items-center justify-center w-9 h-9 rounded-full border border-neon-cyan/30 bg-bg-panel/80 backdrop-blur text-text-bright hover:border-neon-cyan hover:shadow-[0_0_18px_rgba(0,212,255,0.4)] transition pointer-events-auto`}
    >
      {habilitado ? (
        <Volume2 className="w-4 h-4 text-neon-cyan" />
      ) : (
        <VolumeX className="w-4 h-4 text-text-dim" />
      )}
    </button>
  );
}

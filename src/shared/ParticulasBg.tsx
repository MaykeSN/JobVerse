import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { usePreset } from './graficos';

interface Props {
  densidade?: 'baixa' | 'media' | 'alta';
}

export default function ParticulasBg({ densidade }: Props) {
  const [pronto, setPronto] = useState(false);
  const preset = usePreset();
  const efetiva = densidade ?? preset.particulas2D;

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setPronto(true));
  }, []);

  if (!pronto) return null;

  const numero = efetiva === 'alta' ? 100 : efetiva === 'baixa' ? 30 : 60;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0"
      options={{
        background: { color: { value: '#05060F' } },
        fpsLimit: 60,
        particles: {
          color: { value: ['#00D4FF', '#FF4B91', '#A855F7'] },
          links: {
            color: '#00D4FF',
            distance: 140,
            enable: true,
            opacity: 0.25,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.6,
            outModes: { default: 'bounce' }
          },
          number: { density: { enable: true }, value: numero },
          opacity: { value: 0.5 },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } }
        },
        detectRetina: true
      }}
    />
  );
}

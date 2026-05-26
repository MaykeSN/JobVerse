import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface Props {
  densidade?: 'baixa' | 'media' | 'alta';
}

export default function ParticulasBg({ densidade = 'media' }: Props) {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setPronto(true));
  }, []);

  if (!pronto) return null;

  const numero = densidade === 'alta' ? 100 : densidade === 'baixa' ? 30 : 60;

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

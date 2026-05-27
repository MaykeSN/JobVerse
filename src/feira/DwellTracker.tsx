import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useCandidato } from '../shared/candidato';

interface Props {
  posicao: [number, number, number];
  companySlug: string;
  /** Raio do gatilho em metros (default 4). */
  raio?: number;
  /** Tempo mínimo dentro do raio pra contar visita (default 2s). */
  tempoMinimo?: number;
  /** Callback opcional pra UI reagir ao "dentro do estande" (highlight, etc). */
  onDentroChange?: (dentro: boolean) => void;
}

/**
 * Componente R3F (não renderiza nada visível). Mede tempo da câmera
 * dentro do raio do estande e registra visita quando o player sai
 * após ficar tempoMinimo segundos lá dentro.
 *
 * Optimização: usa distância ao quadrado pra evitar sqrt por frame.
 */
export default function DwellTracker({
  posicao,
  companySlug,
  raio = 4,
  tempoMinimo = 2,
  onDentroChange
}: Props) {
  const registrarVisita = useCandidato((s) => s.registrarVisita);
  const entradaRef = useRef<number | null>(null);
  const dentroRef = useRef(false);
  const alvoVec = useRef(new Vector3(posicao[0], 0, posicao[2]));
  const camPlano = useRef(new Vector3());
  const [, force] = useState(0);

  const raioSq = raio * raio;

  useFrame(({ camera, clock }) => {
    camPlano.current.set(camera.position.x, 0, camera.position.z);
    const distSq = camPlano.current.distanceToSquared(alvoVec.current);
    const dentro = distSq < raioSq;

    if (dentro && !dentroRef.current) {
      entradaRef.current = clock.elapsedTime;
      dentroRef.current = true;
      onDentroChange?.(true);
      // re-render leve pra propagar o estado pra props consumidores se quiserem
      force((n) => n + 1);
    } else if (!dentro && dentroRef.current) {
      const entrada = entradaRef.current;
      dentroRef.current = false;
      entradaRef.current = null;
      onDentroChange?.(false);
      if (entrada !== null) {
        const tempo = clock.elapsedTime - entrada;
        if (tempo >= tempoMinimo) {
          registrarVisita(companySlug, Math.round(tempo));
        }
      }
      force((n) => n + 1);
    }
  });

  return null;
}

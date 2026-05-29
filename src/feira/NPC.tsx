import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import type { Group } from 'three';
import type { Empresa } from '../shared/tipos';

/**
 * "Recepcionista" do estande — humanoide low-poly procedural que fica parado
 * ao lado do estande no lobby. Dá sensação de feira viva sem precisar de
 * modelo GLTF externo (zero risco de asset não carregar).
 *
 * Cor do NPC = cor da empresa. Animação de respiração via useFrame.
 */
interface NPCProps {
  cor: string;
  posicao: [number, number, number];
  yaw: number;
}

function NPC({ cor, posicao, yaw }: NPCProps) {
  const grupoRef = useRef<Group>(null);
  const baseY = posicao[1];

  useFrame(({ clock }) => {
    if (grupoRef.current) {
      // Respiração leve + balanço discreto
      grupoRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 1.5) * 0.04;
      grupoRef.current.rotation.y = yaw + Math.sin(clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <group ref={grupoRef} position={posicao} rotation={[0, yaw, 0]}>
      {/* Cabeça */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#1a1d2e" emissive={cor} emissiveIntensity={0.2} />
      </mesh>

      {/* Visor / olhos (faixa horizontal) */}
      <mesh position={[0, 1.62, 0.155]}>
        <planeGeometry args={[0.22, 0.05]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>

      {/* Antena */}
      <mesh position={[0, 1.86, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
        <meshStandardMaterial color="#0B0D1A" />
      </mesh>
      <mesh position={[0, 1.98, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>

      {/* Tronco */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.36, 0.62, 0.2]} />
        <meshStandardMaterial color="#1a1d2e" emissive={cor} emissiveIntensity={0.1} />
      </mesh>

      {/* Faixa peitoral (cor da empresa) */}
      <mesh position={[0, 1.18, 0.11]}>
        <planeGeometry args={[0.3, 0.07]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>

      {/* Logo central peitoral (círculo) */}
      <mesh position={[0, 0.95, 0.105]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>

      {/* Braços */}
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.045, 0.58, 8]} />
          <meshStandardMaterial color="#1a1d2e" emissive={cor} emissiveIntensity={0.12} />
        </mesh>
      ))}

      {/* Mãos */}
      {[-0.24, 0.24].map((x) => (
        <mesh key={`mao-${x}`} position={[x, 0.7, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#0B0D1A" emissive={cor} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Pernas */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={`perna-${x}`} position={[x, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.075, 0.75, 8]} />
          <meshStandardMaterial color="#0B0D1A" />
        </mesh>
      ))}

      {/* Plataforma sob os pés (vibe holograma) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.3, 24]} />
        <meshBasicMaterial color={cor} transparent opacity={0.7} toneMapped={false} />
      </mesh>

      {/* Sparkles ao redor — vibe "está conectado" */}
      <Sparkles count={8} scale={[0.8, 2, 0.8]} position={[0, 1, 0]} color={cor} size={1.5} speed={0.4} />
    </group>
  );
}

/**
 * Wrapper que calcula posição/rotação do NPC com base no estande da empresa.
 * Posiciona o NPC à esquerda do estande (tangente CCW) virado pro spawn central.
 */
export function NPCDoEstande({ empresa }: { empresa: Empresa }) {
  const [x, , z] = empresa.posicao;
  const r = Math.sqrt(x * x + z * z) || 1;
  // Vetor tangencial = 90° CCW do vetor radial outward
  const tx = -z / r;
  const tz = x / r;
  const distancia = 2.2;
  const npcX = x + tx * distancia;
  const npcZ = z + tz * distancia;
  // Yaw pra olhar pro centro do lobby (origem)
  const yaw = Math.atan2(-npcX, -npcZ);

  return <NPC cor={empresa.cor} posicao={[npcX, 0, npcZ]} yaw={yaw} />;
}

export default NPC;

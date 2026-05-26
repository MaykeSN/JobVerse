import { useMemo } from 'react';
import { Float, Sparkles, Text } from '@react-three/drei';
import { Vector3 } from 'three';
import type { Empresa } from '../shared/tipos';
import { usePreset } from '../shared/graficos';

interface EstandeProps {
  empresa: Empresa;
}

const SPAWN = new Vector3(0, 0, 0);

export default function Estande({ empresa }: EstandeProps) {
  const { posicao, cor, nome, missao, stack } = empresa;
  const preset = usePreset();

  // Estande olha pra praça central — calculamos yaw uma vez
  const yaw = useMemo(() => {
    const dx = SPAWN.x - posicao[0];
    const dz = SPAWN.z - posicao[2];
    return Math.atan2(dx, dz);
  }, [posicao]);

  const tags = stack.slice(0, 4);

  return (
    <group position={posicao} rotation={[0, yaw, 0]}>
      {/* Base circular reflexiva — usamos meshStandardMaterial com metalness alto
          em vez de MeshReflectorMaterial pra economizar fillrate (5 estandes). */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 48]} />
        <meshStandardMaterial
          color="#0B0D1A"
          emissive={cor}
          emissiveIntensity={0.25}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Anel de luz no chão */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.05, 64]} />
        <meshBasicMaterial color={cor} />
      </mesh>

      {/* Pilares laterais — vibe portal */}
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 1.8, 0]} castShadow>
          <boxGeometry args={[0.18, 3.6, 0.18]} />
          <meshStandardMaterial
            color={cor}
            emissive={cor}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Travessa superior conectando os pilares */}
      <mesh position={[0, 3.55, 0]}>
        <boxGeometry args={[3.6, 0.12, 0.18]} />
        <meshStandardMaterial
          color={cor}
          emissive={cor}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Backdrop atrás do portal */}
      <mesh position={[0, 2, -0.6]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshStandardMaterial
          color="#05060F"
          emissive={cor}
          emissiveIntensity={0.08}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Painel flutuante (nome + missão + stack) — Float dá vida */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group position={[0, 2.2, -0.4]}>
          <Text
            position={[0, 0.9, 0]}
            fontSize={0.42}
            color={cor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.012}
            outlineColor={cor}
            maxWidth={3.2}
            // Emissive virá do bloom — toneMapped=false intensifica o brilho
          >
            {nome}
          </Text>

          <Text
            position={[0, 0.1, 0]}
            fontSize={0.16}
            color="#E2E8F0"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
            textAlign="center"
            lineHeight={1.3}
          >
            {missao}
          </Text>

          {tags.map((tag, i) => (
            <Text
              key={tag}
              position={[0, -0.5 - i * 0.22, 0]}
              fontSize={0.14}
              color={cor}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.005}
              outlineColor="#05060F"
            >
              {`> ${tag}`}
            </Text>
          ))}
        </group>
      </Float>

      {/* Sparkles colunar na cor da empresa */}
      <Sparkles
        count={preset.sparklesEstande}
        scale={[3, 4.5, 3]}
        position={[0, 2.2, 0]}
        size={3}
        speed={0.45}
        color={cor}
      />

      {preset.pointLightEstande && (
        <pointLight position={[0, 2.5, 0]} color={cor} intensity={1.6} distance={6} />
      )}
    </group>
  );
}

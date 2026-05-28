import { useMemo, useRef, useState } from 'react';
import { Float, Html, Sparkles, Text } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Vector3, type Mesh, type MeshBasicMaterial, type MeshStandardMaterial } from 'three';
import type { Empresa } from '../shared/tipos';
import { usePreset } from '../shared/graficos';
import { useGraficos } from '../shared/graficos';
import { tocarClick } from '../shared/audio';
import { useLocalizacao } from '../shared/localizacao';
import DwellTracker from './DwellTracker';

interface EstandeProps {
  empresa: Empresa;
  contagens?: { vagas: number; candidatos: number };
}

const SPAWN = new Vector3(0, 0, 0);

export default function Estande({ empresa, contagens }: EstandeProps) {
  const { posicao, cor, nome, missao, stack } = empresa;
  const preset = usePreset();
  const qualidade = useGraficos((s) => s.qualidade);
  const irParaSala = useLocalizacao((s) => s.irParaSala);

  const [dentro, setDentro] = useState(false);
  const anelRef = useRef<Mesh>(null);
  const orbitalRef = useRef<Mesh>(null);
  const pilarMatRefs = useRef<MeshStandardMaterial[]>([]);

  const setPilarRef = (i: number) => (m: MeshStandardMaterial | null) => {
    if (m) pilarMatRefs.current[i] = m;
  };

  // Estande olha pra praça central — calculamos yaw uma vez
  const yaw = useMemo(() => {
    const dx = SPAWN.x - posicao[0];
    const dz = SPAWN.z - posicao[2];
    return Math.atan2(dx, dz);
  }, [posicao]);

  const tags = stack.slice(0, 4);

  // Anel pulsa quando dentro, anel orbital sempre girando, pilares respiram (qualidade alta)
  useFrame(({ clock }, delta) => {
    if (anelRef.current) {
      const material = anelRef.current.material as MeshBasicMaterial;
      material.opacity = dentro ? 0.6 + Math.sin(clock.elapsedTime * 4) * 0.4 : 1;
    }
    if (orbitalRef.current) {
      orbitalRef.current.rotation.z += delta * (dentro ? 0.9 : 0.35);
    }
    if (qualidade === 'alta') {
      const base = 1.2;
      const amp = dentro ? 0.7 : 0.4;
      pilarMatRefs.current.forEach((m, i) => {
        if (!m) return;
        m.emissiveIntensity = base + Math.sin(clock.elapsedTime * 1.6 + i * 1.4) * amp;
      });
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    tocarClick();
    // Teleporta pra sala interna — mantém o pointer lock pra andar lá dentro.
    irParaSala(empresa.slug);
  };

  return (
    <group position={posicao} rotation={[0, yaw, 0]}>
      {/* Base hexagonal reflexiva — hitbox principal de click */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[0, Math.PI / 6, 0]}
        receiveShadow
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <cylinderGeometry args={[2, 2, 0.15, 6]} />
        <meshStandardMaterial
          color="#0B0D1A"
          emissive={cor}
          emissiveIntensity={dentro ? 0.5 : 0.25}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Anel orbital girando — vibe sci-fi */}
      <mesh ref={orbitalRef} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.035, 8, 64]} />
        <meshBasicMaterial color={cor} transparent opacity={0.75} toneMapped={false} />
      </mesh>

      {/* Anel de luz no chão (pulsa quando dentro) */}
      <mesh
        ref={anelRef}
        position={[0, 0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <ringGeometry args={[1.9, 2.05, 64]} />
        <meshBasicMaterial color={cor} transparent />
      </mesh>

      {/* Pilares laterais — vibe portal, com pulsing em qualidade alta */}
      {[-1.7, 1.7].map((x, i) => (
        <mesh key={x} position={[x, 1.8, 0]} castShadow onClick={handleClick}>
          <boxGeometry args={[0.18, 3.6, 0.18]} />
          <meshStandardMaterial
            ref={setPilarRef(i)}
            color={cor}
            emissive={cor}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Travessa superior conectando os pilares */}
      <mesh position={[0, 3.55, 0]} onClick={handleClick}>
        <boxGeometry args={[3.6, 0.12, 0.18]} />
        <meshStandardMaterial
          color={cor}
          emissive={cor}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Backdrop atrás do portal */}
      <mesh position={[0, 2, -0.6]} onClick={handleClick}>
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
        <pointLight position={[0, 2.5, 0]} color={cor} intensity={dentro ? 2.4 : 1.6} distance={6} />
      )}

      {/* Pin flutuante: nº de vagas + nº de candidatos */}
      {contagens && (
        <Html
          position={[0, 4.6, 0]}
          center
          distanceFactor={9}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            className="px-3 py-1.5 rounded-full bg-bg-deep/85 backdrop-blur border whitespace-nowrap"
            style={{
              borderColor: `${cor}66`,
              boxShadow: `0 0 14px ${cor}44, inset 0 1px 0 0 rgba(255,255,255,0.05)`
            }}
          >
            <span className="font-display text-[11px] font-bold" style={{ color: cor }}>
              {contagens.vagas}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-dim ml-1">
              {contagens.vagas === 1 ? 'vaga' : 'vagas'}
            </span>
            <span className="text-text-dim/40 mx-2">·</span>
            <span className="font-display text-[11px] font-bold text-text-bright">
              {contagens.candidatos}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-dim ml-1">
              {contagens.candidatos === 1 ? 'candidato' : 'candidatos'}
            </span>
          </div>
        </Html>
      )}

      {/* DwellTracker — registra visita quando jogador fica >= 2s no raio */}
      <DwellTracker
        posicao={posicao}
        companySlug={empresa.slug}
        raio={4}
        tempoMinimo={2}
        onDentroChange={setDentro}
      />
    </group>
  );
}

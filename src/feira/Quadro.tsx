import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { DoubleSide, type MeshStandardMaterial } from 'three';
import type { Vaga } from '../shared/tipos';
import { tocarClick } from '../shared/audio';
import { destravarPlayer } from './PlayerControls';
import { useUI } from '../shared/ui';

interface QuadroProps {
  vaga: Vaga;
  posicao: [number, number, number];
  rotacaoY: number;
  cor: string;
  jaCandidatado: boolean;
}

const SENIORIDADE_LABEL: Record<string, string> = {
  júnior: 'JÚNIOR',
  pleno: 'PLENO',
  sênior: 'SÊNIOR'
};

/**
 * Quadro de vaga pendurado na parede de uma sala. Funciona como um pôster
 * interativo — click no botão "Candidatar" libera o cursor e abre o ModalCV.
 */
export default function Quadro({ vaga, posicao, rotacaoY, cor, jaCandidatado }: QuadroProps) {
  const abrirCV = useUI((s) => s.abrirCV);
  const botaoMat = useRef<MeshStandardMaterial>(null);

  // Pulsing sutil no botão Candidatar (quando ainda não candidatou)
  useFrame(({ clock }) => {
    if (!botaoMat.current || jaCandidatado) return;
    botaoMat.current.emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 2.4) * 0.3;
  });

  const handleCandidatar = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (jaCandidatado) return;
    tocarClick();
    destravarPlayer();
    abrirCV(vaga);
  };

  const requisitosTexto = vaga.requisitos.slice(0, 4).map((r) => `• ${r}`).join('\n');

  return (
    <group position={posicao} rotation={[0, rotacaoY, 0]}>
      {/* Moldura externa — borda emissive na cor da empresa */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.1, 2.7]} />
        <meshBasicMaterial color={cor} side={DoubleSide} transparent opacity={0.85} toneMapped={false} />
      </mesh>

      {/* Painel principal (background do quadro) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 2.6]} />
        <meshStandardMaterial
          color="#0B0D1A"
          emissive={cor}
          emissiveIntensity={0.08}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Título da vaga */}
      <Text
        position={[0, 1.05, 0.02]}
        fontSize={0.14}
        color={cor}
        anchorX="center"
        anchorY="top"
        maxWidth={1.85}
        textAlign="center"
        outlineWidth={0.005}
        outlineColor={cor}
      >
        {vaga.titulo}
      </Text>

      {/* Badge de senioridade */}
      <Text
        position={[0, 0.7, 0.02]}
        fontSize={0.08}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {SENIORIDADE_LABEL[vaga.senioridade] ?? vaga.senioridade.toUpperCase()}
      </Text>

      {/* Descrição curta */}
      <Text
        position={[0, 0.35, 0.02]}
        fontSize={0.072}
        color="#E2E8F0"
        anchorX="center"
        anchorY="top"
        maxWidth={1.78}
        textAlign="center"
        lineHeight={1.3}
      >
        {vaga.descricao.length > 130 ? vaga.descricao.slice(0, 127) + '…' : vaga.descricao}
      </Text>

      {/* Requisitos */}
      <Text
        position={[-0.85, -0.25, 0.02]}
        fontSize={0.062}
        color="#94A3B8"
        anchorX="left"
        anchorY="top"
        maxWidth={1.7}
        lineHeight={1.4}
      >
        {requisitosTexto}
      </Text>

      {/* Botão Candidatar — mesh clicável + texto */}
      <group position={[0, -1.05, 0.02]} onClick={handleCandidatar}>
        <mesh>
          <planeGeometry args={[1.5, 0.32]} />
          <meshStandardMaterial
            ref={botaoMat}
            color={jaCandidatado ? '#475569' : cor}
            emissive={jaCandidatado ? '#000000' : cor}
            emissiveIntensity={jaCandidatado ? 0 : 0.7}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.11}
          color={jaCandidatado ? '#94A3B8' : '#05060F'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
        >
          {jaCandidatado ? 'CANDIDATADO ✓' : 'CANDIDATAR'}
        </Text>
      </group>
    </group>
  );
}

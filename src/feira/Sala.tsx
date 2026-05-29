import { useRef } from 'react';
import { Float, Sparkles, Text } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { DoubleSide, type Mesh } from 'three';
import type { Empresa } from '../shared/tipos';
import { useVagasDaEmpresa } from '../shared/db';
import { useCandidato } from '../shared/candidato';
import { useLocalizacao } from '../shared/localizacao';
import { tocarClick } from '../shared/audio';
import Quadro from './Quadro';

interface SalaProps {
  empresa: Empresa;
}

const ALTURA_PAREDE = 4;
const TAMANHO_SALA = 10;

/**
 * Sala interna de uma empresa. Aparece quando o player clica no estande do lobby.
 * Layout: chão + 4 paredes na cor da empresa + 3 quadros de vagas (um em cada parede
 * lateral + parede do fundo abaixo do logo) + totem central pra voltar ao lobby.
 */
export default function Sala({ empresa }: SalaProps) {
  const { dados: vagas } = useVagasDaEmpresa(empresa.slug);
  const candidaturas = useCandidato((s) => s.candidaturas);
  const voltar = useLocalizacao((s) => s.voltarParaLobby);
  const totemRef = useRef<Mesh>(null);

  // Totem pulsa pra chamar atenção
  useFrame(({ clock }) => {
    if (totemRef.current) {
      totemRef.current.rotation.y += 0.008;
    }
  });

  const voltarLobby = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    tocarClick();
    voltar();
  };

  // 3 posições nas paredes pros quadros (fundo, esquerda, direita)
  const posicoesQuadros: Array<{ posicao: [number, number, number]; rotacaoY: number }> = [
    { posicao: [0, 1.7, -TAMANHO_SALA / 2 + 0.05], rotacaoY: 0 }, // fundo (atrás do logo)
    { posicao: [-TAMANHO_SALA / 2 + 0.05, 1.7, 0], rotacaoY: Math.PI / 2 }, // esquerda
    { posicao: [TAMANHO_SALA / 2 - 0.05, 1.7, 0], rotacaoY: -Math.PI / 2 } // direita
  ];

  return (
    <group>
      {/* Chão da sala — emissive sutil na cor da empresa */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TAMANHO_SALA, TAMANHO_SALA]} />
        <meshStandardMaterial
          color="#0B0D1A"
          emissive={empresa.cor}
          emissiveIntensity={0.06}
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Linhas neon no chão — bordas da sala */}
      {[
        { args: [TAMANHO_SALA, 0.04] as [number, number], pos: [0, 0.02, -TAMANHO_SALA / 2 + 0.1] as [number, number, number] },
        { args: [TAMANHO_SALA, 0.04] as [number, number], pos: [0, 0.02, TAMANHO_SALA / 2 - 0.1] as [number, number, number] },
        { args: [0.04, TAMANHO_SALA] as [number, number], pos: [-TAMANHO_SALA / 2 + 0.1, 0.02, 0] as [number, number, number] },
        { args: [0.04, TAMANHO_SALA] as [number, number], pos: [TAMANHO_SALA / 2 - 0.1, 0.02, 0] as [number, number, number] }
      ].map((linha, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={linha.pos}>
          <planeGeometry args={linha.args} />
          <meshBasicMaterial color={empresa.cor} toneMapped={false} />
        </mesh>
      ))}

      {/* Paredes — leve emissive pra "respirar" cor da empresa */}
      {/* Fundo */}
      <mesh position={[0, ALTURA_PAREDE / 2, -TAMANHO_SALA / 2]}>
        <planeGeometry args={[TAMANHO_SALA, ALTURA_PAREDE]} />
        <meshStandardMaterial
          color="#05060F"
          emissive={empresa.cor}
          emissiveIntensity={0.04}
          side={DoubleSide}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      {/* Frente (atrás do totem, abre pro fora — fica fechada com mesma cor) */}
      <mesh position={[0, ALTURA_PAREDE / 2, TAMANHO_SALA / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[TAMANHO_SALA, ALTURA_PAREDE]} />
        <meshStandardMaterial
          color="#05060F"
          emissive={empresa.cor}
          emissiveIntensity={0.04}
          side={DoubleSide}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      {/* Esquerda */}
      <mesh position={[-TAMANHO_SALA / 2, ALTURA_PAREDE / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[TAMANHO_SALA, ALTURA_PAREDE]} />
        <meshStandardMaterial
          color="#05060F"
          emissive={empresa.cor}
          emissiveIntensity={0.04}
          side={DoubleSide}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      {/* Direita */}
      <mesh position={[TAMANHO_SALA / 2, ALTURA_PAREDE / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[TAMANHO_SALA, ALTURA_PAREDE]} />
        <meshStandardMaterial
          color="#05060F"
          emissive={empresa.cor}
          emissiveIntensity={0.04}
          side={DoubleSide}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>

      {/* Logo gigante da empresa na parede do fundo */}
      <Float speed={0.8} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, ALTURA_PAREDE - 0.6, -TAMANHO_SALA / 2 + 0.1]}
          fontSize={0.6}
          color={empresa.cor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor={empresa.cor}
          maxWidth={TAMANHO_SALA - 1}
        >
          {empresa.nome}
        </Text>
      </Float>

      {/* Missão como subtitle */}
      <Text
        position={[0, ALTURA_PAREDE - 1.15, -TAMANHO_SALA / 2 + 0.1]}
        fontSize={0.11}
        color="#94A3B8"
        anchorX="center"
        anchorY="top"
        maxWidth={TAMANHO_SALA - 2}
        textAlign="center"
      >
        {empresa.missao}
      </Text>

      {/* Quadros de vagas — máximo 3 distribuídos nas paredes */}
      {vagas.slice(0, 3).map((vaga, i) => (
        <Quadro
          key={vaga.id}
          vaga={vaga}
          posicao={posicoesQuadros[i].posicao}
          rotacaoY={posicoesQuadros[i].rotacaoY}
          cor={empresa.cor}
          jaCandidatado={candidaturas.includes(vaga.id)}
        />
      ))}

      {/* Totem central de voltar ao lobby */}
      <group position={[0, 0, 2]} onClick={voltarLobby}>
        <mesh ref={totemRef} position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 1.5, 8]} />
          <meshStandardMaterial
            color="#00D4FF"
            emissive="#00D4FF"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
        {/* Anel pulsante no chão sob o totem */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.7, 32]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} toneMapped={false} />
        </mesh>
        {/* Texto flutuante acima */}
        <Float speed={1.5} floatIntensity={0.4}>
          <Text
            position={[0, 1.95, 0]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.16}
            color="#00D4FF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#00D4FF"
          >
            VOLTAR AO LOBBY →
          </Text>
        </Float>
        <Sparkles count={18} scale={[1.4, 2.2, 1.4]} position={[0, 1, 0]} color="#00D4FF" size={2.5} speed={0.5} />
      </group>

      {/* Iluminação da sala */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, ALTURA_PAREDE - 0.5, 0]} color={empresa.cor} intensity={2.5} distance={12} />
      <pointLight position={[0, 1.5, 2]} color="#00D4FF" intensity={1.2} distance={5} />

      {/* Sparkles ambiente da sala na cor da empresa */}
      <Sparkles
        count={50}
        scale={[TAMANHO_SALA * 0.8, ALTURA_PAREDE * 0.8, TAMANHO_SALA * 0.8]}
        position={[0, ALTURA_PAREDE / 2, 0]}
        color={empresa.cor}
        size={2}
        speed={0.2}
      />
    </group>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { type Group } from 'three';
import { useCandidato } from '../shared/candidato';
import { useMultiplayer, type JogadorRemoto } from '../shared/multiplayer';
import { useLocalizacao } from '../shared/localizacao';

/** Taxa de emissão de posição (10fps — balanceia fluidez vs tráfego) */
const EMIT_MS = 100;

// ---------------------------------------------------------------------------
// Avatar holograma cyberpunk — cilindros + transparência + olhos brilhantes
// ---------------------------------------------------------------------------
function AvatarJogador({ cor }: { cor: string }) {
  return (
    <>
      {/* Projeção no chão — anel que indica presença */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.38, 32]} />
        <meshBasicMaterial color={cor} transparent opacity={0.7} toneMapped={false} />
      </mesh>

      {/* Feixe de luz do chão até a cintura (efeito projeção) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.14, 0.8, 12, 1, true]} />
        <meshBasicMaterial color={cor} transparent opacity={0.12} toneMapped={false} side={2} />
      </mesh>

      {/* Pernas — cilindros finos arredondados */}
      <mesh position={[-0.1, 0.38, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 0.65, 10]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.9} toneMapped={false} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0.1, 0.38, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 0.65, 10]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.9} toneMapped={false} transparent opacity={0.88} />
      </mesh>

      {/* Torso — cilindro mais largo */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.19, 0.21, 0.6, 12]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.6} toneMapped={false} transparent opacity={0.75} />
      </mesh>

      {/* Ombros — esfera que conecta braços */}
      <mesh position={[0, 1.34, 0]}>
        <sphereGeometry args={[0.21, 12, 8]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.5} toneMapped={false} transparent opacity={0.65} />
      </mesh>

      {/* Braços — cilindros levemente inclinados */}
      <mesh position={[-0.33, 1.08, 0]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.055, 0.065, 0.52, 8]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.75} toneMapped={false} transparent opacity={0.82} />
      </mesh>
      <mesh position={[0.33, 1.08, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.055, 0.065, 0.52, 8]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.75} toneMapped={false} transparent opacity={0.82} />
      </mesh>

      {/* Pescoço */}
      <mesh position={[0, 1.58, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.16, 8]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={1.0} toneMapped={false} transparent opacity={0.9} />
      </mesh>

      {/* Cabeça — esfera principal */}
      <mesh position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={1.4} toneMapped={false} transparent opacity={0.92} />
      </mesh>

      {/* Olhos — dois pontos brancos brilhantes */}
      <mesh position={[-0.065, 1.845, 0.15]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0.065, 1.845, 0.15]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Sparkles holográficos ao redor */}
      <Sparkles count={7} scale={[0.65, 2.1, 0.65]} position={[0, 1, 0]} color={cor} size={1.4} speed={0.35} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Wrapper por jogador — lerp suave + hover animation
// ---------------------------------------------------------------------------
function JogadorAvatar({ jogador }: { jogador: JogadorRemoto }) {
  const grupoRef = useRef<Group>(null);
  const alvo = useRef({ x: jogador.x, z: jogador.z, rotY: jogador.rotY + Math.PI });

  useEffect(() => {
    alvo.current = { x: jogador.x, z: jogador.z, rotY: jogador.rotY + Math.PI };
  }, [jogador.x, jogador.z, jogador.rotY]);

  useFrame(({ clock }) => {
    const g = grupoRef.current;
    if (!g) return;
    // Lerp suave de posição e rotação
    g.position.x += (alvo.current.x - g.position.x) * 0.15;
    g.position.z += (alvo.current.z - g.position.z) * 0.15;
    g.rotation.y += (alvo.current.rotY - g.rotation.y) * 0.15;
    // Hover suave — avatar levita levemente
    g.position.y = Math.sin(clock.elapsedTime * 1.4 + alvo.current.x) * 0.055;
  });

  return (
    <group ref={grupoRef} position={[jogador.x, 0, jogador.z]}>
      <AvatarJogador cor={jogador.cor} />
      {/* Nome flutuando acima da cabeça */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.15}
        color={jogador.cor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor={jogador.cor}
      >
        {jogador.nome}
      </Text>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Componente principal — vive dentro do Canvas, sempre montado
// ---------------------------------------------------------------------------
export default function OutrosJogadores() {
  const { camera } = useThree();
  const nome = useCandidato((s) => s.nome);
  const localizacao = useLocalizacao((s) => s.localizacao);

  const conectar = useMultiplayer((s) => s.conectar);
  const desconectar = useMultiplayer((s) => s.desconectar);
  const emitir = useMultiplayer((s) => s.emitir);
  const limparInativos = useMultiplayer((s) => s.limparInativos);
  const jogadores = useMultiplayer((s) => s.jogadores);


  // ID único por aba/sessão — NÃO usa candidato.id pois ele persiste no
  // localStorage e seria igual em todas as abas do mesmo browser, fazendo
  // o filtro "sou eu mesmo" bloquear o outro player.
  const [sessionId] = useState(() => Math.random().toString(36).slice(2, 10));

  // Conecta e inicia emissão via setInterval — roda mesmo com aba em background
  useEffect(() => {
    conectar(sessionId, nome || 'Dev');

    // setInterval não é throttled pelo browser em background (ao contrário do rAF)
    // Só emite após SUBSCRIBED pra evitar REST fallback que não entrega a outros
    const emitInterval = setInterval(() => {
      const loc = useLocalizacao.getState().localizacao;
      if (!useMultiplayer.getState().conectado) return;
      // Inclui localização no broadcast (lobby ou sala específica)
      const localStr = loc.tipo === 'sala' ? `sala:${loc.slug}` : 'feira';
      emitir(camera.position.x, camera.position.z, camera.rotation.y, localStr);
    }, EMIT_MS);

    const cleanupInterval = setInterval(limparInativos, 3000);

    return () => {
      clearInterval(emitInterval);
      clearInterval(cleanupInterval);
      desconectar();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtra jogadores pela mesma localização do player atual
  const localAtual = localizacao.tipo === 'sala'
    ? `sala:${localizacao.slug}`
    : 'feira';

  // Limite: lobby = 30 avatares, sala = 8 (espaço pequeno)
  const LIMITE = localizacao.tipo === 'sala' ? 8 : 30;

  const visiveis = Object.values(jogadores)
    .filter((j) => j.local === localAtual)
    .slice(0, LIMITE);

  if (visiveis.length === 0) return null;

  return (
    <>
      {visiveis.map((j) => (
        <JogadorAvatar key={j.id} jogador={j} />
      ))}
    </>
  );
}

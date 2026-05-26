import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Line, MeshReflectorMaterial, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useCandidato } from '../shared/candidato';
import { usePreset } from '../shared/graficos';
import { empresas } from '../feira/empresas';
import Estande from '../feira/Estande';
import PlayerControls, { usePointerLockState } from '../feira/PlayerControls';
import SeletorQualidade from '../components/SeletorQualidade';

function Piso() {
  const preset = usePreset();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      {preset.reflexo ? (
        <MeshReflectorMaterial
          blur={preset.reflexoBlur}
          resolution={preset.reflexoResolution}
          mixBlur={1}
          mixStrength={preset.reflexoMirror * 90}
          roughness={0.85}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0B0D1A"
          metalness={0.8}
          mirror={preset.reflexoMirror}
        />
      ) : (
        <meshStandardMaterial color="#0B0D1A" metalness={0.5} roughness={0.7} />
      )}
    </mesh>
  );
}

// Linhas neon (vibe Tron) do spawn pros 5 estandes
function LinhasNeon() {
  return (
    <>
      {empresas.map((e) => (
        <Line
          key={e.slug}
          points={[
            [0, 0.06, 0],
            [e.posicao[0] * 0.85, 0.06, e.posicao[2] * 0.85]
          ]}
          color="#00D4FF"
          lineWidth={2.5}
          transparent
          opacity={0.85}
        />
      ))}
    </>
  );
}

function PracaCentral() {
  return (
    <group>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.8, 64]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.5, 64]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function Feira() {
  const nome = useCandidato((s) => s.nome);
  const visitadas = useCandidato((s) => s.visitadas);
  const candidaturas = useCandidato((s) => s.candidaturas);
  const locked = usePointerLockState();
  const preset = usePreset();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg-deep">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim">Visitante</p>
        <p className="font-display text-xl text-glow-cyan">{nome || '—'}</p>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-4 text-right">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim">Visitadas</p>
          <p className="font-display text-lg text-neon-cyan">{visitadas.length} / 5</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim">Vagas</p>
          <p className="font-display text-lg text-neon-magenta">{candidaturas.length}</p>
        </div>
        <Link
          to="/"
          className="ml-2 text-[10px] uppercase tracking-[0.3em] text-text-dim hover:text-neon-cyan transition pointer-events-auto"
        >
          ← Sair
        </Link>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">
          WASD + mouse · Shift pra correr · ESC pra sair
        </p>
      </div>

      {/* Seletor de qualidade gráfica — sempre visível, fora do gate */}
      <SeletorQualidade posicao="bottom-left" />

      {/* Crosshair sutil quando em FPS */}
      {locked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan/80 shadow-[0_0_8px_#00D4FF]" />
        </div>
      )}

      {/* Gate de entrada — overlay HTML enquanto pointer não-locked */}
      {!locked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-deep/70 backdrop-blur-sm">
          <div className="text-center px-8 py-6 border border-neon-cyan/30 rounded-xl bg-bg-panel/70 shadow-[0_0_40px_rgba(0,212,255,0.25)]">
            <p className="text-[10px] uppercase tracking-[0.4em] text-text-dim">JobVerse</p>
            <p className="font-display text-3xl text-glow-cyan mt-2">Clique pra entrar</p>
            <p className="text-sm text-text-dim mt-3">
              WASD + mouse pra mover · Shift pra correr · ESC pra liberar o cursor
            </p>
          </div>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 5, 14], fov: 60 }} gl={{ antialias: true }}>
        <color attach="background" args={['#05060F']} />
        <fog attach="fog" args={['#05060F', 18, 55]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[8, 12, 5]} intensity={0.6} castShadow />
        <pointLight position={[0, 6, 0]} color="#00D4FF" intensity={1.5} />

        <Suspense fallback={null}>
          <Piso />
          <PracaCentral />
          <LinhasNeon />
          {empresas.map((e) => (
            <Estande key={e.slug} empresa={e} />
          ))}
          {/* Sparkles ambiente — quantidade depende da qualidade */}
          <Sparkles
            count={preset.sparklesAmbiente}
            scale={[40, 8, 40]}
            position={[0, 4, 0]}
            size={2}
            speed={0.2}
            color="#00D4FF"
          />
          <Environment preset="night" />
        </Suspense>

        <PlayerControls />

        {preset.bloom && (
          <EffectComposer>
            <Bloom
              intensity={preset.bloomIntensity}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            {preset.vignette ? (
              <Vignette eskil={false} offset={0.2} darkness={0.75} />
            ) : (
              <></>
            )}
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useCandidato } from '../shared/candidato';
import { empresas } from '../feira/empresas';

function EstandePalha({ posicao, cor, label }: { posicao: [number, number, number]; cor: string; label: string }) {
  return (
    <group position={posicao}>
      {/* base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.4} />
      </mesh>
      {/* totem */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.6, 2.8, 0.6]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.7} />
      </mesh>
      {/* coluna de sparkles na cor */}
      <Sparkles count={40} scale={[3, 4, 3]} position={[0, 2, 0]} size={3} speed={0.5} color={cor} />
    </group>
  );
}

function Piso() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#0B0D1A" metalness={0.85} roughness={0.35} />
    </mesh>
  );
}

export default function Feira() {
  const nome = useCandidato((s) => s.nome);
  const visitadas = useCandidato((s) => s.visitadas);
  const candidaturas = useCandidato((s) => s.candidaturas);

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
          Boneco de palha · arraste pra orbitar · próxima fase: WASD + PointerLock
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 8, 18], fov: 55 }} gl={{ antialias: true }}>
        <color attach="background" args={['#05060F']} />
        <fog attach="fog" args={['#05060F', 12, 45]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[8, 12, 5]} intensity={0.8} castShadow />
        <pointLight position={[0, 6, 0]} color="#00D4FF" intensity={1.5} />

        <Suspense fallback={null}>
          <Piso />
          {/* Praça central */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2, 64]} />
            <meshBasicMaterial color="#00D4FF" />
          </mesh>
          {/* Estandes em pentágono */}
          {empresas.map((e) => (
            <EstandePalha key={e.slug} posicao={e.posicao} cor={e.cor} label={e.nome} />
          ))}
          {/* Sparkles ambiente */}
          <Sparkles count={150} scale={[40, 8, 40]} position={[0, 4, 0]} size={2} speed={0.2} color="#00D4FF" />
          <Environment preset="night" />
        </Suspense>

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={6} maxDistance={30} />

        <EffectComposer>
          <Bloom intensity={1.1} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

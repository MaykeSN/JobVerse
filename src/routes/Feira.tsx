import { Suspense, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Line, MeshReflectorMaterial, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useCandidato } from '../shared/candidato';
import { useAuth } from '../shared/auth';
import { usePreset } from '../shared/graficos';
import { useUI, useTemOverlayAberto } from '../shared/ui';
import { useRave, useKonami } from '../shared/easter-eggs';
import { tocarRave, useAudio } from '../shared/audio';
import { useGraficos, type Qualidade } from '../shared/graficos';
import { useToast } from '../shared/toast';
import { useContagensPorEmpresa } from '../shared/contagens';
import { useLocalizacao } from '../shared/localizacao';
import { empresaPorSlug } from '../feira/empresas';
import Sala from '../feira/Sala';
import Teletransporte from '../feira/Teletransporte';
import { MousePointerClick } from 'lucide-react';
import { useCallback } from 'react';
import ToggleAudio from '../components/ToggleAudio';
import RaveOverlay from '../components/RaveOverlay';
import LoadingScreen from '../components/LoadingScreen';
import ControlesHUD from '../components/ControlesHUD';
import { empresas } from '../feira/empresas';
import Estande from '../feira/Estande';
import PlayerControls, {
  usePointerLockState,
  travarPlayer,
  destravarPlayer
} from '../feira/PlayerControls';
import SeletorQualidade from '../components/SeletorQualidade';
import ModalCV from '../components/ModalCV';
import MinhasCandidaturasModal from '../components/MinhasCandidaturasModal';
import Toast from '../components/Toast';

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
  const navigate = useNavigate();
  const nome = useCandidato((s) => s.nome);
  const visitadas = useCandidato((s) => s.visitadas);
  const candidaturas = useCandidato((s) => s.candidaturas);
  const usuario = useAuth((s) => s.usuario);
  const locked = usePointerLockState();
  const preset = usePreset();

  const vagaSelecionada = useUI((s) => s.vagaSelecionada);
  const fecharCV = useUI((s) => s.fecharCV);
  const localizacao = useLocalizacao((s) => s.localizacao);
  const voltarParaLobby = useLocalizacao((s) => s.voltarParaLobby);

  // Empresa de contexto pro ModalCV: vem da sala atual quando dentro de uma.
  const empresaContexto =
    localizacao.tipo === 'sala' ? empresaPorSlug(localizacao.slug) ?? null : null;
  const jaEntrou = useUI((s) => s.jaEntrou);
  const marcarEntrou = useUI((s) => s.marcarEntrou);
  const abrirMinhasCandidaturas = useUI((s) => s.abrirMinhasCandidaturas);
  const temOverlay = useTemOverlayAberto();
  const contagens = useContagensPorEmpresa();

  // Guard de rota — recrutador logado vai direto pro próprio painel; nome
  // local (`nome`) também conta como "sessão dev anônima" e tem acesso.
  useEffect(() => {
    if (usuario?.tipo === 'recrutador') {
      if (usuario.empresaSlug) {
        navigate(`/recrutador/${usuario.empresaSlug}`);
      } else {
        navigate('/recrutador');
      }
      return;
    }
    // Não logado E sem candidato local → volta pra landing
    if (!usuario && !nome) {
      navigate('/');
    }
  }, [usuario, nome, navigate]);

  // Atalhos de teclado — funcionam em ambos modos (lock e cursor livre)
  // pra contornar a limitação de não poder clicar em UI durante o lock.
  // Q: cicla qualidade · V: toggle áudio · L: sair · M: candidaturas (dev)
  useEffect(() => {
    const SEQUENCIA_QUALIDADE: Qualidade[] = ['alta', 'media', 'baixa'];
    const LABELS_QUALIDADE: Record<Qualidade, string> = {
      alta: 'Alta',
      media: 'Média',
      baixa: 'Baixa'
    };

    const handler = (e: KeyboardEvent) => {
      // Não interfere se usuário está digitando em algum input
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      // Ignora se modal aberto (M abre dev candidaturas, mas só sem overlay)
      if (temOverlay) return;

      const key = e.key.toLowerCase();

      if (key === 'q') {
        e.preventDefault();
        const atual = useGraficos.getState().qualidade;
        const prox =
          SEQUENCIA_QUALIDADE[
            (SEQUENCIA_QUALIDADE.indexOf(atual) + 1) % SEQUENCIA_QUALIDADE.length
          ];
        useGraficos.getState().setQualidade(prox);
        useToast.getState().mostrar(`Qualidade: ${LABELS_QUALIDADE[prox]}`, 'info');
      } else if (key === 'v') {
        e.preventDefault();
        useAudio.getState().toggle();
        const ligado = useAudio.getState().habilitado;
        useToast
          .getState()
          .mostrar(ligado ? 'Áudio ambiente ligado' : 'Áudio mutado', 'info');
      } else if (key === 'l') {
        e.preventDefault();
        if (document.pointerLockElement) destravarPlayer();
        navigate('/');
      } else if (key === 'm' && usuario?.tipo === 'dev') {
        e.preventDefault();
        if (document.pointerLockElement) destravarPlayer();
        abrirMinhasCandidaturas();
      } else if (key === 'b' && localizacao.tipo === 'sala') {
        e.preventDefault();
        voltarParaLobby();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [usuario, temOverlay, abrirMinhasCandidaturas, navigate, localizacao, voltarParaLobby]);

  // Modal abriu → libera pointer lock. Modal fechou → re-trava após exit-animation
  // (pra eliminar o "delay de voltar a controlar" que o usuário sentia).
  // Quando um modal abre, libera o pointer lock pra não conflitar com mouse no DOM.
  // O re-lock NÃO é feito aqui — o browser bloqueia requestPointerLock() chamado
  // fora de um handler de user gesture (setTimeout perde o contexto). O re-lock
  // acontece síncrono dentro do onClick do botão de fechar modal (handleFecharComLock).
  useEffect(() => {
    if (temOverlay && document.pointerLockElement) destravarPlayer();
  }, [temOverlay]);

  /**
   * Wrapper que fecha um overlay E re-trava o cursor no MESMO event tick,
   * preservando o user-activation gesture pro browser autorizar o
   * requestPointerLock. Usado nos `onFechar` dos modais.
   */
  const fecharComLock = (fn: () => void) => () => {
    fn();
    if (jaEntrou) travarPlayer();
  };

  // Marca que o usuário já entrou ao menos uma vez (gate fullscreen só na 1ª)
  useEffect(() => {
    if (locked && !jaEntrou) marcarEntrou();
  }, [locked, jaEntrou, marcarEntrou]);


  // Konami code (↑↑↓↓←→←→BA) → rave mode 10s
  const rave = useRave((s) => s.ativo);
  const ativarRave = useRave((s) => s.ativar);
  const triggerRave = useCallback(() => {
    ativarRave(10000);
    tocarRave();
  }, [ativarRave]);
  useKonami(triggerRave);

  // Amplificadores durante o rave
  const sparklesCount = Math.round(preset.sparklesAmbiente * (rave ? 1.5 : 1));
  const bloomIntensity = preset.bloomIntensity * (rave ? 2 : 1);

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

      {/* HUD de controles estilo gamepad — só quando em jogo (lock + sem overlay) */}
      {locked && !temOverlay && (
        <ControlesHUD
          mostrarM={usuario?.tipo === 'dev'}
          mostrarB={localizacao.tipo === 'sala'}
        />
      )}

      {/* Indicador da sala atual (top-center) — só quando dentro de uma empresa */}
      {locked && !temOverlay && empresaContexto && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div
            className="px-4 py-1.5 rounded-full border bg-bg-deep/70 backdrop-blur-lg"
            style={{
              borderColor: `${empresaContexto.cor}55`,
              boxShadow: `0 0 16px ${empresaContexto.cor}33`
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim">Estande</p>
            <p
              className="font-display text-sm font-bold leading-tight"
              style={{ color: empresaContexto.cor, textShadow: `0 0 10px ${empresaContexto.cor}55` }}
            >
              {empresaContexto.nome}
            </p>
          </div>
        </div>
      )}

      {/* Seletor de qualidade gráfica — sempre visível, fora do gate */}
      <SeletorQualidade posicao="bottom-left" />
      <ToggleAudio posicao="bottom-right" />

      {/* Crosshair sutil quando em FPS (e sem overlay) */}
      {locked && !temOverlay && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan/80 shadow-[0_0_8px_#00D4FF]" />
        </div>
      )}

      {/* Gate de boas-vindas — fullscreen, só na PRIMEIRA entrada da sessão. */}
      {!locked && !temOverlay && !jaEntrou && (
        <div
          onClick={() => travarPlayer()}
          className="absolute inset-0 z-20 flex items-center justify-center bg-bg-deep/70 backdrop-blur-sm cursor-pointer"
        >
          <div className="text-center px-8 py-6 border border-neon-cyan/30 rounded-xl bg-bg-panel/70 shadow-[0_0_40px_rgba(0,212,255,0.25)]">
            <p className="text-[10px] uppercase tracking-[0.4em] text-text-dim">JobVerse</p>
            <p className="font-display text-3xl text-glow-cyan mt-2">Clique pra entrar</p>
            <p className="text-sm text-text-dim mt-3">
              WASD + mouse pra mover · Shift pra correr · ESC libera o cursor
            </p>
          </div>
        </div>
      )}

      {/* Cursor livre depois da 1ª entrada — pill discreto pra retomar */}
      {!locked && !temOverlay && jaEntrou && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={() => travarPlayer()}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/40 bg-bg-panel/80 backdrop-blur text-text-bright hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition"
          >
            <MousePointerClick className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-text-dim">
              Cursor livre ·
            </span>
            <span className="font-display text-sm text-glow-cyan">Voltar pra feira</span>
          </button>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 5, 14], fov: 60 }} gl={{ antialias: true }}>
        <color attach="background" args={['#05060F']} />
        <fog attach="fog" args={['#05060F', 18, 55]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[8, 12, 5]} intensity={0.6} castShadow />
        <pointLight position={[0, 6, 0]} color="#00D4FF" intensity={1.5} />

        <Suspense fallback={null}>
          {localizacao.tipo === 'feira' ? (
            <>
              <Piso />
              <PracaCentral />
              <LinhasNeon />
              {empresas.map((e) => (
                <Estande key={e.slug} empresa={e} contagens={contagens[e.slug]} />
              ))}
            </>
          ) : (
            empresaContexto && <Sala empresa={empresaContexto} />
          )}
          {/* Sparkles ambiente — quantidade depende da qualidade (1.5x no rave) */}
          <Sparkles
            count={sparklesCount}
            scale={[40, 8, 40]}
            position={[0, 4, 0]}
            size={2}
            speed={rave ? 0.6 : 0.2}
            color={rave ? '#FF4B91' : '#00D4FF'}
          />
          <Environment preset="night" />
        </Suspense>

        <PlayerControls />
        <Teletransporte />

        {preset.bloom && (
          <EffectComposer>
            <Bloom
              intensity={bloomIntensity}
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

      {/* Overlays HTML — modal de CV + toast + rave + loading.
          ModalVagas foi substituído pelas salas internas (Sala.tsx) — agora
          o usuário clica direto no Quadro da vaga dentro da sala. */}
      <ModalCV
        vaga={vagaSelecionada}
        empresa={empresaContexto}
        onFechar={fecharComLock(fecharCV)}
      />
      <MinhasCandidaturasModal />
      <Toast />
      <RaveOverlay />
      <LoadingScreen />
    </div>
  );
}

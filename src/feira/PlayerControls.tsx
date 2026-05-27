import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  KeyboardControls,
  PointerLockControls,
  useKeyboardControls
} from '@react-three/drei';
import { Vector3 } from 'three';

type Movement = 'forward' | 'back' | 'left' | 'right' | 'run';

/**
 * Singleton handle pro controls do drei. Setado quando o componente monta
 * (via useThree dentro do Canvas) e usado por código fora do Canvas que
 * precisa trancar/destrancar o cursor programaticamente.
 *
 * Importante: usar `lock()` do drei (que ativa os listeners de mousemove
 * pra rotação da câmera) em vez de `document.body.requestPointerLock()`
 * direto — caso contrário o cursor trava mas a câmera não vira.
 */
interface ControlsHandle {
  lock(): void;
  unlock(): void;
}

let handle: ControlsHandle | null = null;

export function travarPlayer() {
  console.log('[PLOCK] travarPlayer chamado. handle existe?', !!handle, 'pointerLockElement?', !!document.pointerLockElement);
  if (handle) {
    handle.lock();
    console.log('[PLOCK] handle.lock() chamado');
  } else {
    console.warn('[PLOCK] handle NULL — fallback requestPointerLock direto');
    document.body.requestPointerLock();
  }
}

export function destravarPlayer() {
  console.log('[PLOCK] destravarPlayer chamado. handle existe?', !!handle, 'pointerLockElement?', !!document.pointerLockElement);
  if (handle) {
    handle.unlock();
    console.log('[PLOCK] handle.unlock() chamado');
  } else if (document.pointerLockElement) {
    document.exitPointerLock();
    console.log('[PLOCK] exitPointerLock direto');
  }
}

const KEY_MAP = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'back', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] }
];

const PLAYER_HEIGHT = 1.7;
const BASE_SPEED = 3.5;
const RUN_MULTIPLIER = 1.8;

function Mover() {
  const { camera } = useThree();
  const [, get] = useKeyboardControls<Movement>();

  // Reused vectors — avoid allocating per-frame
  const forwardVec = useRef(new Vector3());
  const rightVec = useRef(new Vector3());
  const moveVec = useRef(new Vector3());

  useFrame((_, delta) => {
    // Easing suave da câmera pro nível humano — permite shot estabelecedor inicial.
    if (Math.abs(camera.position.y - PLAYER_HEIGHT) > 0.01) {
      camera.position.y += (PLAYER_HEIGHT - camera.position.y) * Math.min(delta * 1.8, 1);
    } else {
      camera.position.y = PLAYER_HEIGHT;
    }

    // Não move sem pointer lock — evita câmera andar sozinha quando o user
    // tá interagindo com UI (seletor de qualidade, audio, modais).
    if (!document.pointerLockElement) return;

    const { forward, back, left, right, run } = get();
    if (!forward && !back && !left && !right) return;

    camera.getWorldDirection(forwardVec.current);
    forwardVec.current.y = 0;
    forwardVec.current.normalize();

    // Right = forward rotated +90° on Y (era invertido — A/D trocados antes do fix)
    rightVec.current.set(-forwardVec.current.z, 0, forwardVec.current.x);

    moveVec.current.set(0, 0, 0);
    if (forward) moveVec.current.add(forwardVec.current);
    if (back) moveVec.current.sub(forwardVec.current);
    if (right) moveVec.current.add(rightVec.current);
    if (left) moveVec.current.sub(rightVec.current);

    if (moveVec.current.lengthSq() === 0) return;
    moveVec.current.normalize();

    const speed = BASE_SPEED * (run ? RUN_MULTIPLIER : 1) * delta;
    camera.position.addScaledVector(moveVec.current, speed);
  });

  return null;
}

interface PlayerControlsProps {
  onLockChange?: (locked: boolean) => void;
}

export default function PlayerControls({ onLockChange }: PlayerControlsProps) {
  const map = useMemo(() => KEY_MAP, []);

  return (
    <KeyboardControls map={map}>
      <Mover />
      <ConectarHandle />
      {/*
        - selector dummy (`#__jobverse_no_auto_lock` nunca existe) faz o drei
          NÃO instalar nenhum listener de click automático. O lock é sempre
          chamado manualmente via `travarPlayer()` nos botões certos (gate
          inicial e pill "Voltar pra feira"). Sem isso, o drei adicionava
          listener em `document` (sem selector) ou em elementos que ainda
          não existiam no momento do mount (com seletor real).
        - makeDefault: expõe o controls em useThree(s => s.controls) pro
          ConectarHandle registrar no singleton.
      */}
      <PointerLockControls
        makeDefault
        selector="#__jobverse_no_auto_lock"
        onLock={() => { console.log('[PLOCK] drei onLock event'); onLockChange?.(true); }}
        onUnlock={() => { console.log('[PLOCK] drei onUnlock event'); onLockChange?.(false); }}
      />
    </KeyboardControls>
  );
}

/**
 * Componente interno que vive DENTRO do Canvas pra acessar `useThree`
 * e registrar o controls do drei num singleton externo.
 */
function ConectarHandle() {
  const controls = useThree((s) => s.controls) as unknown as ControlsHandle | null;
  useEffect(() => {
    console.log('[PLOCK] ConectarHandle effect — controls?', controls, 'tem lock?', controls && typeof (controls as ControlsHandle).lock === 'function');
    if (controls && typeof controls.lock === 'function' && typeof controls.unlock === 'function') {
      handle = controls;
      console.log('[PLOCK] handle REGISTRADO no singleton');
    } else {
      console.warn('[PLOCK] controls sem lock/unlock — handle nao registrado');
    }
    return () => {
      console.log('[PLOCK] handle removido do singleton');
      handle = null;
    };
  }, [controls]);
  return null;
}

/**
 * Hook utilitário que observa o estado do pointer lock fora do Canvas
 * (PointerLockControls vive dentro do Canvas, então o overlay HTML
 * depende do evento nativo do browser).
 */
export function usePointerLockState() {
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const handler = () => {
      const novo = document.pointerLockElement !== null;
      console.log('[PLOCK] pointerlockchange event — locked agora:', novo);
      setLocked(novo);
    };
    document.addEventListener('pointerlockchange', handler);
    return () => document.removeEventListener('pointerlockchange', handler);
  }, []);
  return locked;
}

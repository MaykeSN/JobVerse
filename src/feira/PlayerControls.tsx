import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  KeyboardControls,
  PointerLockControls,
  useKeyboardControls
} from '@react-three/drei';
import { Vector3 } from 'three';

type Movement = 'forward' | 'back' | 'left' | 'right' | 'run';

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

    const { forward, back, left, right, run } = get();
    if (!forward && !back && !left && !right) return;

    camera.getWorldDirection(forwardVec.current);
    forwardVec.current.y = 0;
    forwardVec.current.normalize();

    rightVec.current.set(forwardVec.current.z, 0, -forwardVec.current.x);

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
      <PointerLockControls
        onLock={() => onLockChange?.(true)}
        onUnlock={() => onLockChange?.(false)}
      />
    </KeyboardControls>
  );
}

/**
 * Hook utilitário que observa o estado do pointer lock fora do Canvas
 * (PointerLockControls vive dentro do Canvas, então o overlay HTML
 * depende do evento nativo do browser).
 */
export function usePointerLockState() {
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const handler = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', handler);
    return () => document.removeEventListener('pointerlockchange', handler);
  }, []);
  return locked;
}

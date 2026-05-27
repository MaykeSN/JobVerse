/**
 * Easter eggs do JobVerse. Por enquanto: Konami code (↑↑↓↓←→←→BA)
 * ativa "rave mode" por 10s — bloom 2x, sparkles cheios, screen tint
 * pulsante. Toca um arpejo. Pra usar no pitch como surpresa.
 */
import { useEffect } from 'react';
import { create } from 'zustand';

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

interface RaveState {
  ativo: boolean;
  ativar: (duracaoMs?: number) => void;
  desativar: () => void;
}

export const useRave = create<RaveState>((set, get) => ({
  ativo: false,
  ativar: (duracaoMs = 10000) => {
    if (get().ativo) return;
    set({ ativo: true });
    window.setTimeout(() => set({ ativo: false }), duracaoMs);
  },
  desativar: () => set({ ativo: false })
}));

/**
 * Hook que instala o listener de Konami code globalmente.
 * Chamar uma vez no root da Feira (ou App).
 */
export function useKonami(onTrigger: () => void) {
  useEffect(() => {
    let buffer: string[] = [];
    const handler = (e: KeyboardEvent) => {
      buffer.push(e.code);
      if (buffer.length > KONAMI.length) {
        buffer = buffer.slice(-KONAMI.length);
      }
      if (buffer.length === KONAMI.length && KONAMI.every((k, i) => buffer[i] === k)) {
        buffer = [];
        onTrigger();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTrigger]);
}

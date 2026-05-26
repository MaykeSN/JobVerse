import { create } from 'zustand';

export type TipoToast = 'sucesso' | 'info' | 'erro';

export interface ToastMsg {
  id: number;
  mensagem: string;
  tipo: TipoToast;
}

interface ToastState {
  fila: ToastMsg[];
  mostrar: (mensagem: string, tipo?: TipoToast) => void;
  remover: (id: number) => void;
}

let nextId = 1;

export const useToast = create<ToastState>((set) => ({
  fila: [],
  mostrar: (mensagem, tipo = 'sucesso') => {
    const id = nextId++;
    set((s) => ({ fila: [...s.fila, { id, mensagem, tipo }] }));
  },
  remover: (id) => set((s) => ({ fila: s.fila.filter((t) => t.id !== id) }))
}));

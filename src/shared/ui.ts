import { create } from 'zustand';
import type { Empresa, Vaga } from './tipos';

interface UIState {
  empresaAberta: Empresa | null;
  vagaSelecionada: Vaga | null;
  abrirEmpresa: (e: Empresa) => void;
  fecharEmpresa: () => void;
  abrirCV: (v: Vaga) => void;
  fecharCV: () => void;
  fecharTudo: () => void;
}

/**
 * Store de UI overlay (modais). Independente do store de candidato pra
 * não acoplar lógica de domínio à lógica de apresentação.
 *
 * Convenção: abrir o CV NÃO fecha o modal de vagas — eles ficam empilhados,
 * e o CV é renderizado por cima. Fechar o CV volta pro modal de vagas.
 */
export const useUI = create<UIState>((set) => ({
  empresaAberta: null,
  vagaSelecionada: null,
  abrirEmpresa: (e) => set({ empresaAberta: e }),
  fecharEmpresa: () => set({ empresaAberta: null, vagaSelecionada: null }),
  abrirCV: (v) => set({ vagaSelecionada: v }),
  fecharCV: () => set({ vagaSelecionada: null }),
  fecharTudo: () => set({ empresaAberta: null, vagaSelecionada: null })
}));

/**
 * Hook auxiliar — true se qualquer overlay HTML estiver aberto.
 * Usado pra liberar o pointer lock e suspender o crosshair.
 */
export const useTemOverlayAberto = () =>
  useUI((s) => s.empresaAberta !== null || s.vagaSelecionada !== null);

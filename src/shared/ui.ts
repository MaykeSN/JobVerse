import { create } from 'zustand';
import type { Empresa, Vaga } from './tipos';
import type { TipoUsuario } from './auth';

/**
 * Estado do modal de autenticação. `false` = fechado. Quando aberto, guarda
 * o tipo pré-selecionado (clicar em "Sou dev" abre já com a tab dev marcada).
 */
export type AuthModalState = false | { tipoInicial: TipoUsuario };

interface UIState {
  empresaAberta: Empresa | null;
  vagaSelecionada: Vaga | null;
  /** Modal de auth da landing. `false` quando fechado. */
  authModal: AuthModalState;
  /** Modal "minhas candidaturas" (atalho M na feira pra devs). */
  minhasCandidaturasAberto: boolean;
  // Flag de sessão — `true` depois que o usuário entrou na feira pela primeira vez.
  // Não persiste; reseta ao recarregar (intencional pra dar boas-vindas se a sessão recomeçar).
  jaEntrou: boolean;
  abrirEmpresa: (e: Empresa) => void;
  fecharEmpresa: () => void;
  abrirCV: (v: Vaga) => void;
  fecharCV: () => void;
  fecharTudo: () => void;
  marcarEntrou: () => void;
  abrirAuth: (tipoInicial?: TipoUsuario) => void;
  fecharAuth: () => void;
  abrirMinhasCandidaturas: () => void;
  fecharMinhasCandidaturas: () => void;
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
  authModal: false,
  minhasCandidaturasAberto: false,
  jaEntrou: false,
  abrirEmpresa: (e) => set({ empresaAberta: e }),
  fecharEmpresa: () => set({ empresaAberta: null, vagaSelecionada: null }),
  abrirCV: (v) => set({ vagaSelecionada: v }),
  fecharCV: () => set({ vagaSelecionada: null }),
  fecharTudo: () =>
    set({
      empresaAberta: null,
      vagaSelecionada: null,
      authModal: false,
      minhasCandidaturasAberto: false
    }),
  marcarEntrou: () => set({ jaEntrou: true }),
  abrirAuth: (tipoInicial = 'dev') => set({ authModal: { tipoInicial } }),
  fecharAuth: () => set({ authModal: false }),
  abrirMinhasCandidaturas: () => set({ minhasCandidaturasAberto: true }),
  fecharMinhasCandidaturas: () => set({ minhasCandidaturasAberto: false })
}));

/**
 * Hook auxiliar — true se qualquer overlay HTML estiver aberto.
 * Usado pra liberar o pointer lock e suspender o crosshair.
 */
export const useTemOverlayAberto = () =>
  useUI(
    (s) =>
      s.empresaAberta !== null ||
      s.vagaSelecionada !== null ||
      s.authModal !== false ||
      s.minhasCandidaturasAberto
  );

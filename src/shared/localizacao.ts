import { create } from 'zustand';

/**
 * Onde o player está dentro da experiência 3D.
 * - `feira`: lobby com os 5 estandes em pentágono.
 * - `sala`: dentro da sala interna de uma empresa, com quadros de vagas nas paredes.
 *
 * Não persiste — toda nova sessão começa no lobby.
 */
export type Localizacao = { tipo: 'feira' } | { tipo: 'sala'; slug: string };

interface LocalizacaoState {
  localizacao: Localizacao;
  irParaSala: (slug: string) => void;
  voltarParaLobby: () => void;
}

export const useLocalizacao = create<LocalizacaoState>((set) => ({
  localizacao: { tipo: 'feira' },
  irParaSala: (slug) => set({ localizacao: { tipo: 'sala', slug } }),
  voltarParaLobby: () => set({ localizacao: { tipo: 'feira' } })
}));

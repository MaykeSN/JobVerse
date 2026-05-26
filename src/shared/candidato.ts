import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CandidatoState {
  id: string | null;
  nome: string;
  email?: string;
  visitadas: string[];
  candidaturas: string[];
  definir: (dados: { nome: string; email?: string }) => void;
  registrarVisita: (slug: string) => void;
  registrarCandidatura: (jobId: string) => void;
  limpar: () => void;
}

export const useCandidato = create<CandidatoState>()(
  persist(
    (set) => ({
      id: null,
      nome: '',
      email: undefined,
      visitadas: [],
      candidaturas: [],
      definir: ({ nome, email }) =>
        set({ id: crypto.randomUUID(), nome, email, visitadas: [], candidaturas: [] }),
      registrarVisita: (slug) =>
        set((s) =>
          s.visitadas.includes(slug) ? s : { ...s, visitadas: [...s.visitadas, slug] }
        ),
      registrarCandidatura: (jobId) =>
        set((s) =>
          s.candidaturas.includes(jobId) ? s : { ...s, candidaturas: [...s.candidaturas, jobId] }
        ),
      limpar: () => set({ id: null, nome: '', email: undefined, visitadas: [], candidaturas: [] })
    }),
    { name: 'jobverse-candidato' }
  )
);

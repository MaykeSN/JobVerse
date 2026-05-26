import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DadosCV {
  skills: string[];
  sobre: string;
  github: string;
}

interface CandidatoState {
  id: string | null;
  nome: string;
  email?: string;
  skills: string[];
  sobre: string;
  github: string;
  visitadas: string[];
  candidaturas: string[];
  definir: (dados: { nome: string; email?: string }) => void;
  salvarCV: (dados: DadosCV) => void;
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
      skills: [],
      sobre: '',
      github: '',
      visitadas: [],
      candidaturas: [],
      definir: ({ nome, email }) =>
        set({
          id: crypto.randomUUID(),
          nome,
          email,
          // Preserva CV anterior caso o usuário só tenha mudado o nome.
          visitadas: [],
          candidaturas: []
        }),
      salvarCV: ({ skills, sobre, github }) =>
        set({ skills, sobre, github }),
      registrarVisita: (slug) =>
        set((s) =>
          s.visitadas.includes(slug) ? s : { ...s, visitadas: [...s.visitadas, slug] }
        ),
      registrarCandidatura: (jobId) =>
        set((s) =>
          s.candidaturas.includes(jobId) ? s : { ...s, candidaturas: [...s.candidaturas, jobId] }
        ),
      limpar: () =>
        set({
          id: null,
          nome: '',
          email: undefined,
          skills: [],
          sobre: '',
          github: '',
          visitadas: [],
          candidaturas: []
        })
    }),
    { name: 'jobverse-candidato' }
  )
);

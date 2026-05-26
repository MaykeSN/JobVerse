import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function uuidv4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return [...bytes]
    .map((b, i) => ([4, 6, 8, 10].includes(i) ? '-' : '') + b.toString(16).padStart(2, '0'))
    .join('');
}

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
          id: uuidv4(),
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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { vagaPorId } from '../feira/vagas';
import { emitir } from './realtime';

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
  registrarVisita: (slug: string, dwellSeconds?: number) => void;
  registrarCandidatura: (jobId: string) => void;
  limpar: () => void;
}

export const useCandidato = create<CandidatoState>()(
  persist(
    (set, get) => ({
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
      registrarVisita: (slug, dwellSeconds) => {
        const state = get();
        // Broadcast — outras abas (recrutador) recebem mesmo se a visita já foi contada.
        if (state.id) {
          emitir({
            tipo: 'nova-visita',
            candidatoId: state.id,
            companySlug: slug,
            dwellSeconds: dwellSeconds ?? 0,
            nomeCandidato: state.nome || 'Visitante'
          });
        }
        if (state.visitadas.includes(slug)) return;
        set({ visitadas: [...state.visitadas, slug] });
      },
      registrarCandidatura: (jobId) => {
        const state = get();
        const vaga = vagaPorId(jobId);
        if (vaga && state.id) {
          emitir({
            tipo: 'nova-candidatura',
            candidatoId: state.id,
            companySlug: vaga.companySlug,
            jobId,
            nomeCandidato: state.nome || 'Visitante'
          });
        }
        if (state.candidaturas.includes(jobId)) return;
        set({ candidaturas: [...state.candidaturas, jobId] });
      },
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

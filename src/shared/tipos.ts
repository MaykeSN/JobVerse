export interface Empresa {
  /** UUID da empresa quando vem do DB. Pode ficar undefined no mock offline. */
  id?: string;
  slug: string;
  nome: string;
  missao: string;
  stack: string[];
  cor: string;
  posicao: [number, number, number];
}

export interface Vaga {
  /** UUID quando vem do DB. No fallback mock é um slug determinístico. */
  id: string;
  companySlug: string;
  titulo: string;
  descricao: string;
  senioridade: 'júnior' | 'pleno' | 'sênior';
  requisitos: string[];
}

export interface Candidato {
  id: string;
  nome: string;
  email?: string;
  skills?: string[];
  sobre?: string;
  github?: string;
}

/**
 * Candidato fictício do banco mockado (Fase 5).
 * Difere de `Candidato` por trazer dados já agregados a uma vaga e uma visita,
 * pra renderizar direto na lista do recrutador sem joins.
 */
export interface CandidatoMock {
  id: string;
  nome: string;
  skills: string[];
  sobre: string;
  github: string;
  jobId: string;
  companySlug: string;
  dwellSeconds: number;
  criadoHaMinutos: number;
}

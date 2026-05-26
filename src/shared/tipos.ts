export interface Empresa {
  slug: string;
  nome: string;
  missao: string;
  stack: string[];
  cor: string;
  posicao: [number, number, number];
}

export interface Vaga {
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

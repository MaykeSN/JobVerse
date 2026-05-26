// JobVerse — tipos do banco (espelho manual do schema em supabase/schema.sql)
//
// Mantidos à mão (sem supabase gen types) porque o schema é pequeno e estável
// pro escopo do hackathon. Se o schema evoluir, atualizar AQUI em conjunto
// com schema.sql para não ficar dessincronizado.

/** Coordenada 3D da empresa na cena (coluna jsonb `posicao`). */
export interface Posicao3D {
  x: number;
  y: number;
  z: number;
}

// ---------------------------------------------------------------------------
// Row types — shape exato que vem do SELECT
// ---------------------------------------------------------------------------

export interface CompanyRow {
  id: string;
  slug: string;
  nome: string;
  missao: string;
  stack: string[];
  logo_url: string | null;
  video_url: string | null;
  cor_tema: string | null;
  posicao: Posicao3D;
}

export type Senioridade = 'júnior' | 'pleno' | 'sênior';

export interface JobRow {
  id: string;
  company_id: string;
  titulo: string;
  descricao: string;
  senioridade: Senioridade;
  requisitos: string[];
}

export interface CandidateRow {
  id: string;
  nome: string;
  email: string | null;
  skills: string[] | null;
  sobre: string | null;
  github: string | null;
  created_at: string;
}

export interface ApplicationRow {
  id: string;
  candidate_id: string;
  job_id: string;
  created_at: string;
}

export interface VisitRow {
  id: string;
  candidate_id: string;
  company_id: string;
  dwell_seconds: number;
  created_at: string;
}

export interface AISummaryRow {
  id: string;
  candidate_id: string | null;
  company_id: string | null;
  summary: string | null;
  match_score: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Insert types — campos com default no banco ficam opcionais
// ---------------------------------------------------------------------------

export interface CompanyInsert {
  id?: string;
  slug: string;
  nome: string;
  missao: string;
  stack: string[];
  logo_url?: string | null;
  video_url?: string | null;
  cor_tema?: string | null;
  posicao: Posicao3D;
}

export interface JobInsert {
  id?: string;
  company_id: string;
  titulo: string;
  descricao: string;
  senioridade: Senioridade;
  requisitos: string[];
}

export interface CandidateInsert {
  id?: string;
  nome: string;
  email?: string | null;
  skills?: string[] | null;
  sobre?: string | null;
  github?: string | null;
  created_at?: string;
}

export interface ApplicationInsert {
  id?: string;
  candidate_id: string;
  job_id: string;
  created_at?: string;
}

export interface VisitInsert {
  id?: string;
  candidate_id: string;
  company_id: string;
  dwell_seconds?: number;
  created_at?: string;
}

export interface AISummaryInsert {
  id?: string;
  candidate_id?: string | null;
  company_id?: string | null;
  summary?: string | null;
  match_score?: number | null;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// Update types — tudo opcional
// ---------------------------------------------------------------------------

export type CompanyUpdate = Partial<CompanyInsert>;
export type JobUpdate = Partial<JobInsert>;
export type CandidateUpdate = Partial<CandidateInsert>;
export type ApplicationUpdate = Partial<ApplicationInsert>;
export type VisitUpdate = Partial<VisitInsert>;
export type AISummaryUpdate = Partial<AISummaryInsert>;

// ---------------------------------------------------------------------------
// Database root — convenção do supabase-js (Database['public']['Tables'])
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: CompanyRow;
        Insert: CompanyInsert;
        Update: CompanyUpdate;
      };
      jobs: {
        Row: JobRow;
        Insert: JobInsert;
        Update: JobUpdate;
      };
      candidates: {
        Row: CandidateRow;
        Insert: CandidateInsert;
        Update: CandidateUpdate;
      };
      applications: {
        Row: ApplicationRow;
        Insert: ApplicationInsert;
        Update: ApplicationUpdate;
      };
      visits: {
        Row: VisitRow;
        Insert: VisitInsert;
        Update: VisitUpdate;
      };
      ai_summaries: {
        Row: AISummaryRow;
        Insert: AISummaryInsert;
        Update: AISummaryUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Resposta da Edge Function ai-summary (stub "em breve")
// ---------------------------------------------------------------------------

export interface AISummaryStubResponse {
  status: 'em_breve';
  message: string;
  placeholder: {
    summary: string;
    match_score: number | null;
  };
}

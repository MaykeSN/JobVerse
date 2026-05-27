// JobVerse — camada de acesso ao Supabase (hooks + adaptadores).
//
// Estratégia: tudo aqui é "null-safe". Se `supabase` for null (env não
// configurada) ou a query falhar, caímos no mock local sem quebrar a UI.
//
// Sem React Query — useEffect/useState basta pro escopo do hackathon.

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './supabase';
import { empresas as empresasMock, empresaPorSlug } from '../feira/empresas';
import { vagas as vagasMock, vagasPorSlug } from '../feira/vagas';
import { candidatosPorEmpresa } from '../feira/candidatos-mock';
import type { Empresa, Vaga, CandidatoMock } from './tipos';
import type {
  CompanyRow,
  JobRow,
  ApplicationRow,
  CandidateRow,
  VisitRow
} from './tipos-db';

// ---------------------------------------------------------------------------
// Adaptadores DB → tipos do front
// ---------------------------------------------------------------------------

/**
 * Converte `companies.posicao` (jsonb {x,y,z}) para tupla [x,y,z] que o R3F espera.
 * Defensivo: se vier algo torto do DB, cai pra [0,0,0].
 */
function posicaoParaTupla(p: unknown): [number, number, number] {
  if (p && typeof p === 'object') {
    const obj = p as Record<string, unknown>;
    const x = typeof obj.x === 'number' ? obj.x : 0;
    const y = typeof obj.y === 'number' ? obj.y : 0;
    const z = typeof obj.z === 'number' ? obj.z : 0;
    return [x, y, z];
  }
  return [0, 0, 0];
}

export function adaptarEmpresa(row: CompanyRow): Empresa {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    missao: row.missao,
    stack: row.stack,
    cor: row.cor_tema ?? '#00D4FF',
    posicao: posicaoParaTupla(row.posicao)
  };
}

export function adaptarVaga(row: JobRow, companySlug: string): Vaga {
  return {
    id: row.id,
    companySlug,
    titulo: row.titulo,
    descricao: row.descricao,
    senioridade: row.senioridade,
    requisitos: row.requisitos
  };
}

// ---------------------------------------------------------------------------
// Resultado padronizado dos hooks
// ---------------------------------------------------------------------------

export interface FetchResult<T> {
  dados: T;
  carregando: boolean;
  erro: string | null;
}

// ---------------------------------------------------------------------------
// useEmpresas — lista todas as empresas (com fallback pro mock)
// ---------------------------------------------------------------------------

export function useEmpresas(): FetchResult<Empresa[]> {
  const [dados, setDados] = useState<Empresa[]>(empresasMock);
  const [carregando, setCarregando] = useState(supabase !== null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setCarregando(false);
      return;
    }
    let ativo = true;
    (async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('slug');
      if (!ativo) return;
      if (error) {
        console.error('[db.useEmpresas] falha:', error.message);
        setErro(error.message);
        // Mantém o mock — não zera a UI.
      } else if (data && data.length > 0) {
        setDados((data as CompanyRow[]).map(adaptarEmpresa));
      }
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  return { dados, carregando, erro };
}

// ---------------------------------------------------------------------------
// Cache simples de empresas pra resolver slug → id sem refetch
// (usado em registrarVisita do store de candidato)
// ---------------------------------------------------------------------------

let cacheEmpresasPromise: Promise<Map<string, string>> | null = null;

export function obterMapaSlugParaId(): Promise<Map<string, string>> {
  if (cacheEmpresasPromise) return cacheEmpresasPromise;
  cacheEmpresasPromise = (async () => {
    const mapa = new Map<string, string>();
    if (!supabase) return mapa;
    const { data, error } = await supabase.from('companies').select('id, slug');
    if (error || !data) {
      console.error('[db.obterMapaSlugParaId] falha:', error?.message);
      cacheEmpresasPromise = null; // permite retry depois
      return mapa;
    }
    for (const row of data as Array<{ id: string; slug: string }>) {
      mapa.set(row.slug, row.id);
    }
    return mapa;
  })();
  return cacheEmpresasPromise;
}

// ---------------------------------------------------------------------------
// useVagasDaEmpresa — vagas de uma empresa por slug
// ---------------------------------------------------------------------------

export function useVagasDaEmpresa(
  slug: string | undefined
): FetchResult<Vaga[]> {
  const fallback = useMemo<Vaga[]>(
    () => (slug ? vagasPorSlug(slug) : []),
    [slug]
  );
  const [dados, setDados] = useState<Vaga[]>(fallback);
  const [carregando, setCarregando] = useState(supabase !== null && !!slug);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setDados(fallback);
  }, [fallback]);

  useEffect(() => {
    if (!supabase || !slug) {
      setCarregando(false);
      return;
    }
    let ativo = true;
    setCarregando(true);
    (async () => {
      // 1) Resolve company_id pelo slug
      const { data: company, error: errCompany } = await supabase
        .from('companies')
        .select('id, slug')
        .eq('slug', slug)
        .maybeSingle();
      if (!ativo) return;
      if (errCompany || !company) {
        if (errCompany) {
          console.error(
            '[db.useVagasDaEmpresa] empresa não encontrada:',
            errCompany?.message
          );
          setErro(errCompany.message);
        }
        setCarregando(false);
        return;
      }
      // 2) Busca vagas dessa empresa
      const { data: jobs, error: errJobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id);
      if (!ativo) return;
      if (errJobs) {
        console.error('[db.useVagasDaEmpresa] falha jobs:', errJobs.message);
        setErro(errJobs.message);
      } else if (jobs) {
        setDados((jobs as JobRow[]).map((j) => adaptarVaga(j, slug)));
      }
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, [slug]);

  return { dados, carregando, erro };
}

// ---------------------------------------------------------------------------
// useCVsDaEmpresa — applications + candidates (+ jobs) com realtime
// ---------------------------------------------------------------------------

/**
 * Versão "achatada" do candidato pro painel (mesmo shape do mock antigo).
 * Mantém compatibilidade com `CandidatoMock` pro front continuar igual.
 */
export interface ItemCVDB extends CandidatoMock {
  /** ISO timestamp da application — usado pra ordenar e calcular criadoHaMinutos */
  criadoEm: string;
}

interface LinhaCVCrua {
  application: ApplicationRow;
  candidate: CandidateRow;
  job: JobRow;
}

function minutosDesde(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 60_000));
}

function linhaParaItem(linha: LinhaCVCrua, slug: string): ItemCVDB {
  const c = linha.candidate;
  return {
    id: linha.application.id,
    nome: c.nome,
    skills: c.skills ?? [],
    sobre: c.sobre ?? '',
    github: c.github ?? '',
    jobId: linha.job.id,
    companySlug: slug,
    dwellSeconds: 0, // visits são separadas
    criadoHaMinutos: minutosDesde(linha.application.created_at),
    criadoEm: linha.application.created_at
  };
}

export function useCVsDaEmpresa(slug: string | undefined): FetchResult<ItemCVDB[]> {
  // Fallback pro mock antigo (com tempos relativos pré-computados).
  const fallback = useMemo<ItemCVDB[]>(() => {
    if (!slug) return [];
    return candidatosPorEmpresa(slug).map((c) => ({
      ...c,
      criadoEm: new Date(Date.now() - c.criadoHaMinutos * 60_000).toISOString()
    }));
  }, [slug]);

  const [dados, setDados] = useState<ItemCVDB[]>(fallback);
  const [carregando, setCarregando] = useState(supabase !== null && !!slug);
  const [erro, setErro] = useState<string | null>(null);
  // Guarda mapa de company_id por slug pra realtime filter.
  const companyIdRef = useRef<string | null>(null);

  // Reset quando muda slug.
  useEffect(() => {
    setDados(fallback);
  }, [fallback]);

  useEffect(() => {
    const sb = supabase;
    if (!sb || !slug) {
      setCarregando(false);
      return;
    }
    let ativo = true;
    setCarregando(true);

    const carregar = async () => {
      // 1) Resolve company_id.
      const { data: company, error: errCompany } = await sb
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!ativo) return null;
      if (errCompany || !company) {
        if (errCompany) {
          console.error('[db.useCVsDaEmpresa] company falhou:', errCompany.message);
          setErro(errCompany.message);
        }
        setCarregando(false);
        return null;
      }
      companyIdRef.current = company.id;

      // 2) jobs da empresa
      const { data: jobs, error: errJobs } = await sb
        .from('jobs')
        .select('*')
        .eq('company_id', company.id);
      if (!ativo) return null;
      if (errJobs || !jobs) {
        console.error('[db.useCVsDaEmpresa] jobs falhou:', errJobs?.message);
        setErro(errJobs?.message ?? 'jobs vazio');
        setCarregando(false);
        return null;
      }
      const jobsById = new Map<string, JobRow>(
        (jobs as JobRow[]).map((j) => [j.id, j])
      );
      const jobIds = (jobs as JobRow[]).map((j) => j.id);
      if (jobIds.length === 0) {
        setDados([]);
        setCarregando(false);
        return company.id;
      }

      // 3) applications dessas jobs
      const { data: apps, error: errApps } = await sb
        .from('applications')
        .select('*')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });
      if (!ativo) return null;
      if (errApps || !apps) {
        console.error('[db.useCVsDaEmpresa] apps falhou:', errApps?.message);
        setErro(errApps?.message ?? 'apps vazio');
        setCarregando(false);
        return null;
      }

      if (apps.length === 0) {
        setDados([]);
        setCarregando(false);
        return company.id;
      }

      // 4) candidates dos applications
      const candidateIds = Array.from(
        new Set((apps as ApplicationRow[]).map((a) => a.candidate_id))
      );
      const { data: cands, error: errCands } = await sb
        .from('candidates')
        .select('*')
        .in('id', candidateIds);
      if (!ativo) return null;
      if (errCands || !cands) {
        console.error('[db.useCVsDaEmpresa] cands falhou:', errCands?.message);
        setErro(errCands?.message ?? 'cands vazio');
        setCarregando(false);
        return null;
      }
      const candsById = new Map<string, CandidateRow>(
        (cands as CandidateRow[]).map((c) => [c.id, c])
      );

      // 5) merge
      const linhas: LinhaCVCrua[] = [];
      for (const app of apps as ApplicationRow[]) {
        const job = jobsById.get(app.job_id);
        const cand = candsById.get(app.candidate_id);
        if (job && cand) {
          linhas.push({ application: app, candidate: cand, job });
        }
      }
      setDados(linhas.map((l) => linhaParaItem(l, slug)));
      setCarregando(false);
      return company.id;
    };

    (async () => {
      await carregar();
    })();

    // Realtime — INSERT em applications filtrado pelas jobs dessa empresa.
    // Como o filter do postgres_changes não suporta IN, filtramos no client
    // checando se a job pertence à empresa via re-fetch leve do registro.
    const channel = sb
      .channel(`cvs-${slug}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applications' },
        async (payload) => {
          if (!ativo) return;
          const app = payload.new as ApplicationRow;
          // Confirma que o job é dessa empresa
          const { data: job } = await sb
            .from('jobs')
            .select('*')
            .eq('id', app.job_id)
            .maybeSingle();
          if (!job || (job as JobRow).company_id !== companyIdRef.current) return;
          const { data: cand } = await sb
            .from('candidates')
            .select('*')
            .eq('id', app.candidate_id)
            .maybeSingle();
          if (!cand) return;
          const novo = linhaParaItem(
            {
              application: app,
              candidate: cand as CandidateRow,
              job: job as JobRow
            },
            slug
          );
          setDados((prev) => {
            // Dedupe por id de application.
            if (prev.some((p) => p.id === novo.id)) return prev;
            return [novo, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      ativo = false;
      void sb.removeChannel(channel);
    };
  }, [slug]);

  return { dados, carregando, erro };
}

// ---------------------------------------------------------------------------
// useVisitasDaEmpresa — visits agregadas com realtime
// ---------------------------------------------------------------------------

export interface ItemVisita {
  /** Nome do candidato — usado como chave no agregado. */
  nome: string;
  segundos: number;
}

interface VisitaCrua {
  candidateId: string;
  nome: string;
  segundos: number;
}

function agregarPorCandidato(linhas: VisitaCrua[]): ItemVisita[] {
  const mapa = new Map<string, { nome: string; segundos: number }>();
  for (const l of linhas) {
    const atual = mapa.get(l.candidateId);
    // max(dwell) quando candidato tem múltiplas visitas
    if (!atual || l.segundos > atual.segundos) {
      mapa.set(l.candidateId, { nome: l.nome, segundos: l.segundos });
    }
  }
  return Array.from(mapa.values());
}

export function useVisitasDaEmpresa(
  slug: string | undefined
): FetchResult<ItemVisita[]> {
  // Fallback: mesma fonte do Heatmap antigo.
  const fallback = useMemo<ItemVisita[]>(() => {
    if (!slug) return [];
    return candidatosPorEmpresa(slug).map((c) => ({
      nome: c.nome,
      segundos: c.dwellSeconds
    }));
  }, [slug]);

  const [dados, setDados] = useState<ItemVisita[]>(fallback);
  const [carregando, setCarregando] = useState(supabase !== null && !!slug);
  const [erro, setErro] = useState<string | null>(null);
  const companyIdRef = useRef<string | null>(null);
  // Pra realtime: lista crua (com candidateId) pra reagregar quando chegar uma visita nova.
  const cruasRef = useRef<VisitaCrua[]>([]);

  useEffect(() => {
    setDados(fallback);
    cruasRef.current = [];
  }, [fallback]);

  useEffect(() => {
    const sb = supabase;
    if (!sb || !slug) {
      setCarregando(false);
      return;
    }
    let ativo = true;
    setCarregando(true);

    (async () => {
      // 1) Resolve company_id.
      const { data: company, error: errCompany } = await sb
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!ativo) return;
      if (errCompany || !company) {
        if (errCompany) {
          console.error('[db.useVisitas] company falhou:', errCompany.message);
          setErro(errCompany.message);
        }
        setCarregando(false);
        return;
      }
      companyIdRef.current = company.id;

      // 2) visits dessa empresa
      const { data: visits, error: errVisits } = await sb
        .from('visits')
        .select('candidate_id, dwell_seconds')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      if (!ativo) return;
      if (errVisits || !visits) {
        console.error('[db.useVisitas] visits falhou:', errVisits?.message);
        setErro(errVisits?.message ?? 'visits vazio');
        setCarregando(false);
        return;
      }

      if (visits.length === 0) {
        setDados([]);
        setCarregando(false);
        return;
      }

      // 3) candidates dos visits
      const candidateIds = Array.from(
        new Set((visits as Array<{ candidate_id: string }>).map((v) => v.candidate_id))
      );
      const { data: cands, error: errCands } = await sb
        .from('candidates')
        .select('id, nome')
        .in('id', candidateIds);
      if (!ativo) return;
      if (errCands || !cands) {
        console.error('[db.useVisitas] cands falhou:', errCands?.message);
        setErro(errCands?.message ?? 'cands vazio');
        setCarregando(false);
        return;
      }
      const nomesPorId = new Map<string, string>(
        (cands as Array<{ id: string; nome: string }>).map((c) => [c.id, c.nome])
      );

      const cruas: VisitaCrua[] = (
        visits as Array<{ candidate_id: string; dwell_seconds: number }>
      ).map((v) => ({
        candidateId: v.candidate_id,
        nome: nomesPorId.get(v.candidate_id) ?? 'Visitante',
        segundos: v.dwell_seconds
      }));
      cruasRef.current = cruas;
      setDados(agregarPorCandidato(cruas));
      setCarregando(false);
    })();

    // Realtime — INSERT em visits dessa empresa
    const channel = sb
      .channel(`visits-${slug}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'visits' },
        async (payload) => {
          if (!ativo) return;
          const v = payload.new as VisitRow;
          if (v.company_id !== companyIdRef.current) return;
          const { data: cand } = await sb
            .from('candidates')
            .select('nome')
            .eq('id', v.candidate_id)
            .maybeSingle();
          if (!cand) return;
          const crua: VisitaCrua = {
            candidateId: v.candidate_id,
            nome: (cand as { nome: string }).nome,
            segundos: v.dwell_seconds
          };
          cruasRef.current = [crua, ...cruasRef.current];
          setDados(agregarPorCandidato(cruasRef.current));
        }
      )
      .subscribe();

    return () => {
      ativo = false;
      void sb.removeChannel(channel);
    };
  }, [slug]);

  return { dados, carregando, erro };
}

// ---------------------------------------------------------------------------
// Helpers de lookup que não precisam de hook
// ---------------------------------------------------------------------------

/** Busca uma vaga numa lista (substitui a função `vagaPorId` global). */
export function vagaPorIdEmLista(lista: Vaga[], id: string): Vaga | undefined {
  return lista.find((v) => v.id === id);
}

/** Re-exporta helpers do mock pra quem ainda quer offline puro. */
export { empresasMock, vagasMock, empresaPorSlug };

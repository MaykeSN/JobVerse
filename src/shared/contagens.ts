import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { empresas } from '../feira/empresas';
import { vagasPorSlug } from '../feira/vagas';
import { candidatosPorEmpresa } from '../feira/candidatos-mock';

export type ContagensPorSlug = Record<string, { vagas: number; candidatos: number }>;

interface JobJoinRow {
  company_id: string;
  companies: { slug: string } | null;
}

interface AppJoinRow {
  candidate_id: string;
  jobs: { company_id: string; companies: { slug: string } | null } | null;
}

function fallbackInicial(): ContagensPorSlug {
  const base: ContagensPorSlug = {};
  empresas.forEach((e) => {
    base[e.slug] = {
      vagas: vagasPorSlug(e.slug).length,
      candidatos: candidatosPorEmpresa(e.slug).length
    };
  });
  return base;
}

/**
 * Hook que retorna contagens agregadas de vagas e candidatos por empresa,
 * usadas pra renderizar o "pin" flutuante acima de cada estande.
 *
 * Sem Supabase configurado: usa números do mock.
 * Com Supabase: faz fetch agregado (2 queries) + subscribe em `applications`
 * pra atualizar em tempo real quando alguém candidata.
 */
export function useContagensPorEmpresa(): ContagensPorSlug {
  const [dados, setDados] = useState<ContagensPorSlug>(fallbackInicial);

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    let ativo = true;

    const carregar = async () => {
      try {
        const [vagasRes, appsRes] = await Promise.all([
          sb.from('jobs').select('company_id, companies(slug)'),
          sb.from('applications').select('candidate_id, jobs!inner(company_id, companies!inner(slug))')
        ]);

        if (!ativo) return;

        const agregado: ContagensPorSlug = {};
        empresas.forEach((e) => {
          agregado[e.slug] = { vagas: 0, candidatos: 0 };
        });

        const jobRows = (vagasRes.data ?? []) as unknown as JobJoinRow[];
        jobRows.forEach((row) => {
          const slug = row.companies?.slug;
          if (slug && agregado[slug]) agregado[slug].vagas += 1;
        });

        const setsPorEmpresa: Record<string, Set<string>> = {};
        empresas.forEach((e) => {
          setsPorEmpresa[e.slug] = new Set();
        });

        const appRows = (appsRes.data ?? []) as unknown as AppJoinRow[];
        appRows.forEach((row) => {
          const slug = row.jobs?.companies?.slug;
          if (slug && setsPorEmpresa[slug]) setsPorEmpresa[slug].add(row.candidate_id);
        });

        Object.entries(setsPorEmpresa).forEach(([slug, set]) => {
          if (agregado[slug]) agregado[slug].candidatos = set.size;
        });

        setDados(agregado);
      } catch (err) {
        console.error('[contagens] falha ao carregar', err);
      }
    };

    void carregar();

    const channel = sb
      .channel('contagens-applications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applications' },
        () => {
          void carregar();
        }
      )
      .subscribe();

    return () => {
      ativo = false;
      void sb.removeChannel(channel);
    };
  }, []);

  return dados;
}

import { supabase } from './supabase';
import { analisarMatch } from './matchScore';
import type { Vaga, Empresa } from './tipos';

export async function syncCandidato(id: string, nome: string, email?: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from('candidates')
      .upsert({ id, nome, email: email ?? null, skills: [], sobre: '', github: null }, { onConflict: 'id', ignoreDuplicates: true });
  } catch { /* silent — UX não quebra sem backend */ }
}

export async function syncCandidatura(
  candidatoId: string,
  skills: string[],
  sobre: string,
  github: string,
  vaga: Vaga,
  empresa: Empresa
): Promise<void> {
  if (!supabase) return;
  try {
    const { score, insights } = analisarMatch(skills, sobre, github, vaga, empresa);

    await supabase
      .from('candidates')
      .update({ skills, sobre, github: github || null, updated_at: new Date().toISOString() })
      .eq('id', candidatoId);

    await supabase
      .from('applications')
      .upsert(
        { candidate_id: candidatoId, job_id: vaga.id, company_slug: vaga.companySlug, match_score: score, insights },
        { onConflict: 'candidate_id,job_id' }
      );
  } catch { /* silent */ }
}

export async function syncVisita(
  candidatoId: string,
  companySlug: string,
  dwellSeconds: number
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from('visits')
      .insert({ candidate_id: candidatoId, company_slug: companySlug, dwell_seconds: dwellSeconds });
  } catch { /* silent */ }
}

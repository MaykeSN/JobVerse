import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FileText, Briefcase, Calendar, Inbox } from 'lucide-react';
import { useUI } from '../shared/ui';
import { useAuth } from '../shared/auth';
import { useCandidato } from '../shared/candidato';
import { supabase } from '../shared/supabase';
import { empresas as empresasMock } from '../feira/empresas';
import { vagaPorId as vagaPorIdMock } from '../feira/vagas';
import type { Empresa, Vaga } from '../shared/tipos';
import type {
  ApplicationRow,
  CompanyRow,
  JobRow
} from '../shared/tipos-db';
import { adaptarEmpresa, adaptarVaga } from '../shared/db';

interface ItemCandidatura {
  applicationId: string;
  criadoEm: string;
  vaga: Vaga;
  empresa: Empresa;
}

const BADGE_POR_SENIORIDADE: Record<string, string> = {
  'júnior': 'bg-neon-lime/15 text-neon-lime border-neon-lime/30',
  'pleno': 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30',
  'sênior': 'bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30'
};

function formatarData(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function MinhasCandidaturasModal() {
  const aberto = useUI((s) => s.minhasCandidaturasAberto);
  const fechar = useUI((s) => s.fecharMinhasCandidaturas);
  const usuario = useAuth((s) => s.usuario);
  const candidatoId = useCandidato((s) => s.id);
  const candidaturasLocais = useCandidato((s) => s.candidaturas);

  const [itens, setItens] = useState<ItemCandidatura[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // ESC fecha
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [aberto, fechar]);

  // Fallback offline — usa candidaturas do store local + mocks de empresa/vaga
  const itensFallback = useMemo<ItemCandidatura[]>(() => {
    return candidaturasLocais
      .map((jobId) => {
        const vaga = vagaPorIdMock(jobId);
        if (!vaga) return null;
        const empresa = empresasMock.find((e) => e.slug === vaga.companySlug);
        if (!empresa) return null;
        return {
          applicationId: `local-${jobId}`,
          criadoEm: new Date().toISOString(),
          vaga,
          empresa
        };
      })
      .filter((x): x is ItemCandidatura => x !== null);
  }, [candidaturasLocais]);

  useEffect(() => {
    if (!aberto) return;

    // Sem backend ou sem login → usa fallback local.
    if (!supabase || !usuario || usuario.tipo !== 'dev') {
      setItens(itensFallback);
      setCarregando(false);
      setErro(null);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro(null);

    (async () => {
      const sb = supabase;
      if (!sb) return;
      // 1) Acha candidates dessa user_id (pode haver mais de um se a coluna foi
      //    adicionada depois de várias sessões). Caímos pro candidato local se
      //    o user_id ainda não tiver sido salvo.
      let candidateIds: string[] = [];
      const { data: cands, error: errCands } = await sb
        .from('candidates')
        .select('id')
        .eq('user_id', usuario.id);
      if (!ativo) return;
      if (errCands) {
        // 42703 = coluna user_id não existe (users.sql não aplicado)
        if (errCands.code !== '42703') {
          console.error('[MinhasCandidaturas] candidates falhou:', errCands.message);
        }
      } else if (cands) {
        candidateIds = (cands as Array<{ id: string }>).map((c) => c.id);
      }
      // Sempre inclui o candidato local atual (caso ele ainda não tenha user_id setado no DB)
      if (candidatoId && !candidateIds.includes(candidatoId)) {
        candidateIds.push(candidatoId);
      }

      if (candidateIds.length === 0) {
        setItens([]);
        setCarregando(false);
        return;
      }

      // 2) applications
      const { data: apps, error: errApps } = await sb
        .from('applications')
        .select('*')
        .in('candidate_id', candidateIds)
        .order('created_at', { ascending: false });
      if (!ativo) return;
      if (errApps || !apps) {
        console.error('[MinhasCandidaturas] applications falhou:', errApps?.message);
        setErro('Não foi possível carregar suas candidaturas.');
        setItens(itensFallback);
        setCarregando(false);
        return;
      }
      const appRows = apps as ApplicationRow[];

      if (appRows.length === 0) {
        setItens([]);
        setCarregando(false);
        return;
      }

      // 3) jobs + companies
      const jobIds = Array.from(new Set(appRows.map((a) => a.job_id)));
      const { data: jobs, error: errJobs } = await sb
        .from('jobs')
        .select('*')
        .in('id', jobIds);
      if (!ativo) return;
      if (errJobs || !jobs) {
        console.error('[MinhasCandidaturas] jobs falhou:', errJobs?.message);
        setErro('Não foi possível carregar suas candidaturas.');
        setItens(itensFallback);
        setCarregando(false);
        return;
      }
      const jobRows = jobs as JobRow[];
      const companyIds = Array.from(new Set(jobRows.map((j) => j.company_id)));

      const { data: comps, error: errComps } = await sb
        .from('companies')
        .select('*')
        .in('id', companyIds);
      if (!ativo) return;
      if (errComps || !comps) {
        console.error('[MinhasCandidaturas] companies falhou:', errComps?.message);
        setErro('Não foi possível carregar suas candidaturas.');
        setItens(itensFallback);
        setCarregando(false);
        return;
      }
      const compRows = comps as CompanyRow[];
      const compById = new Map<string, Empresa>(
        compRows.map((c) => [c.id, adaptarEmpresa(c)])
      );

      const lista: ItemCandidatura[] = appRows
        .map((app) => {
          const job = jobRows.find((j) => j.id === app.job_id);
          if (!job) return null;
          const empresa = compById.get(job.company_id);
          if (!empresa) return null;
          return {
            applicationId: app.id,
            criadoEm: app.created_at,
            vaga: adaptarVaga(job, empresa.slug),
            empresa
          };
        })
        .filter((x): x is ItemCandidatura => x !== null);

      // Merge com fallback local pra não perder candidaturas mock-only
      const idsRemotos = new Set(lista.map((l) => `${l.empresa.slug}:${l.vaga.titulo}`));
      const extras = itensFallback.filter(
        (l) => !idsRemotos.has(`${l.empresa.slug}:${l.vaga.titulo}`)
      );

      setItens([...lista, ...extras]);
      setCarregando(false);
    })().catch((e) => {
      if (!ativo) return;
      console.error('[MinhasCandidaturas] exception:', e);
      setErro('Falha ao carregar candidaturas.');
      setItens(itensFallback);
      setCarregando(false);
    });

    return () => {
      ativo = false;
    };
  }, [aberto, usuario, candidatoId, itensFallback]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-bg-deep/85 backdrop-blur-md"
          onClick={fechar}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl border border-neon-cyan/40 bg-bg-panel/95 backdrop-blur shadow-[0_0_60px_rgba(0,212,255,0.35)] overflow-hidden"
          >
            <div className="relative px-6 py-5 border-b border-neon-cyan/20">
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-bright hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-neon-cyan" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan">
                  Minhas candidaturas
                </span>
              </div>
              <h2 className="font-display text-2xl text-glow-cyan">
                {usuario ? usuario.github : 'Sessão local'}
              </h2>
              <p className="text-xs text-text-dim mt-1">
                {itens.length} {itens.length === 1 ? 'candidatura' : 'candidaturas'}
              </p>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-3">
              {carregando ? (
                <p className="text-text-dim text-sm">Carregando…</p>
              ) : erro ? (
                <p className="text-sm text-neon-magenta">{erro}</p>
              ) : itens.length === 0 ? (
                <div className="text-center py-10">
                  <Inbox className="w-10 h-10 text-text-dim mx-auto mb-3" />
                  <p className="font-display text-lg text-text-bright">
                    Nenhuma candidatura ainda
                  </p>
                  <p className="text-sm text-text-dim mt-1">
                    Você ainda não se candidatou pra nenhuma vaga.
                  </p>
                </div>
              ) : (
                itens.map((item) => {
                  const badge =
                    BADGE_POR_SENIORIDADE[item.vaga.senioridade] ??
                    'bg-text-dim/15 text-text-dim border-text-dim/30';
                  return (
                    <motion.article
                      key={item.applicationId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border bg-bg-elev/60 p-4 hover:bg-bg-elev/80 transition relative overflow-hidden"
                      style={{ borderColor: `${item.empresa.cor}33` }}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{
                          background: item.empresa.cor,
                          boxShadow: `0 0 12px ${item.empresa.cor}`
                        }}
                      />
                      <div className="flex items-start justify-between gap-3 mb-2 pl-2">
                        <div>
                          <h3 className="font-display text-base text-text-bright leading-tight">
                            {item.vaga.titulo}
                          </h3>
                          <p
                            className="text-xs mt-0.5 inline-flex items-center gap-1"
                            style={{ color: item.empresa.cor }}
                          >
                            <Briefcase className="w-3 h-3" />
                            {item.empresa.nome}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border whitespace-nowrap ${badge}`}
                        >
                          {item.vaga.senioridade}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted inline-flex items-center gap-1 pl-2">
                        <Calendar className="w-3 h-3" />
                        {formatarData(item.criadoEm)}
                      </p>
                    </motion.article>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

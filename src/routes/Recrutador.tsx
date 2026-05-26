import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Eye, Zap, Github, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react';
import { empresaPorSlug } from '../feira/empresas';
import { vagasPorSlug } from '../feira/vagas';
import { supabase, supabaseConfigurado } from '../shared/supabase';
import { useEffect, useState, useCallback } from 'react';

interface CandidaturaRow {
  id: string;
  candidate_id: string;
  job_id: string;
  match_score: number;
  insights: string[];
  created_at: string;
  candidates: {
    nome: string;
    email: string | null;
    skills: string[];
    sobre: string;
    github: string | null;
  };
}

function ScoreBadge({ score }: { score: number }) {
  const [cor, label] =
    score >= 75 ? ['#00C896', 'Excelente'] :
    score >= 55 ? ['#00D4FF', 'Forte'] :
    score >= 35 ? ['#F59E0B', 'Médio'] :
                  ['#FF4B91', 'Fraco'];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-display tracking-wider"
      style={{ background: `${cor}22`, color: cor, border: `1px solid ${cor}55` }}
    >
      {score} · {label}
    </span>
  );
}

function CardCandidato({ c, cor, jobLabel }: { c: CandidaturaRow; cor: string; jobLabel: string }) {
  const [aberto, setAberto] = useState(false);
  const tempo = new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      layout
      className="rounded-xl border bg-bg-panel/60 backdrop-blur overflow-hidden"
      style={{ borderColor: `${cor}33` }}
    >
      <button
        type="button"
        onClick={() => setAberto((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm"
            style={{ background: `${cor}22`, color: cor }}
          >
            {c.candidates.nome.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text-bright text-sm truncate">{c.candidates.nome}</p>
            <p className="text-[11px] text-text-muted truncate">{jobLabel} · {tempo}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <ScoreBadge score={c.match_score} />
          {aberto ? <ChevronUp className="w-4 h-4 text-text-dim" /> : <ChevronDown className="w-4 h-4 text-text-dim" />}
        </div>
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: `${cor}22` }}>
              {c.candidates.email && (
                <p className="text-xs text-text-dim pt-3">✉ {c.candidates.email}</p>
              )}
              {c.candidates.github && (
                <a
                  href={c.candidates.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-neon-cyan hover:underline"
                >
                  <Github className="w-3 h-3" /> {c.candidates.github.replace('https://github.com/', '')}
                </a>
              )}
              {c.candidates.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.candidates.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-md"
                      style={{ background: `${cor}18`, color: cor }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {c.candidates.sobre && (
                <p className="text-xs text-text-dim leading-relaxed">{c.candidates.sobre}</p>
              )}
              {c.insights?.length > 0 && (
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">Análise</p>
                  {c.insights.map((ins, i) => (
                    <p key={i} className="text-xs text-text-dim flex items-start gap-1.5">
                      <span style={{ color: cor }}>›</span> {ins}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Recrutador() {
  const { slug } = useParams<{ slug: string }>();
  const empresa = slug ? empresaPorSlug(slug) : undefined;
  const vagas = slug ? vagasPorSlug(slug) : [];

  const [candidaturas, setCandidaturas] = useState<CandidaturaRow[]>([]);
  const [totalVisitas, setTotalVisitas] = useState(0);
  const [avgDwell, setAvgDwell] = useState(0);
  const [loading, setLoading] = useState(true);
  const [realtime, setRealtime] = useState(false);

  const cor = empresa?.cor ?? '#00D4FF';

  const carregarDados = useCallback(async () => {
    if (!supabase || !slug) return;

    const [{ data: apps }, { data: visits }] = await Promise.all([
      supabase
        .from('applications')
        .select('*, candidates(nome, email, skills, sobre, github)')
        .eq('company_slug', slug)
        .order('created_at', { ascending: false }),
      supabase
        .from('visits')
        .select('dwell_seconds')
        .eq('company_slug', slug),
    ]);

    if (apps) setCandidaturas(apps as CandidaturaRow[]);
    if (visits) {
      setTotalVisitas(visits.length);
      const total = visits.reduce((s, v) => s + (v.dwell_seconds ?? 0), 0);
      setAvgDwell(visits.length > 0 ? Math.round(total / visits.length) : 0);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Realtime: escuta INSERT em applications e visits
  useEffect(() => {
    if (!supabase || !slug) return;

    const channel = supabase
      .channel(`recrutador-${slug}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'applications', filter: `company_slug=eq.${slug}` }, () => {
        carregarDados();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'visits', filter: `company_slug=eq.${slug}` }, () => {
        carregarDados();
      })
      .subscribe((status) => {
        setRealtime(status === 'SUBSCRIBED');
      });

    return () => { supabase!.removeChannel(channel); };
  }, [slug, carregarDados]);

  if (!empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="font-display text-2xl text-neon-magenta mb-4">Empresa não encontrada</p>
          <Link to="/" className="text-text-dim hover:text-neon-cyan">← Voltar</Link>
        </div>
      </div>
    );
  }

  const avgScore = candidaturas.length > 0
    ? Math.round(candidaturas.reduce((s, c) => s + c.match_score, 0) / candidaturas.length)
    : 0;

  const jobLabel = (jobId: string) => vagas.find((v) => v.id === jobId)?.titulo ?? jobId;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-bg-deep">
      <div className="max-w-4xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-dim hover:text-neon-cyan transition"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar
          </Link>
          <div className="flex items-center gap-2 text-[11px] tracking-wider">
            {supabaseConfigurado ? (
              realtime ? (
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Wifi className="w-3 h-3" /> Conectando…
                </span>
              )
            ) : (
              <span className="flex items-center gap-1.5 text-yellow-500">
                <WifiOff className="w-3 h-3" /> Offline — configure .env
              </span>
            )}
          </div>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-text-dim mb-1">Dashboard do Recrutador</p>
          <h1 className="font-display text-5xl font-black mb-2" style={{ color: cor, textShadow: `0 0 24px ${cor}66` }}>
            {empresa.nome}
          </h1>
          <p className="text-text-dim mb-10">{empresa.missao}</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="rounded-xl border bg-bg-panel/50 backdrop-blur p-5" style={{ borderColor: `${cor}33` }}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" style={{ color: cor }} />
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-dim">CVs Recebidos</p>
              </div>
              {loading ? (
                <div className="h-10 w-16 rounded animate-pulse bg-white/10" />
              ) : (
                <p className="font-display text-5xl font-black" style={{ color: cor, textShadow: `0 0 16px ${cor}88` }}>
                  {candidaturas.length}
                </p>
              )}
            </div>

            <div className="rounded-xl border bg-bg-panel/50 backdrop-blur p-5" style={{ borderColor: `${cor}33` }}>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4" style={{ color: cor }} />
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-dim">Visitas · Dwell Médio</p>
              </div>
              {loading ? (
                <div className="h-10 w-24 rounded animate-pulse bg-white/10" />
              ) : (
                <p className="font-display text-5xl font-black" style={{ color: cor, textShadow: `0 0 16px ${cor}88` }}>
                  {totalVisitas}
                  <span className="text-lg text-text-dim ml-2 font-sans font-normal">
                    {avgDwell > 0 ? `~${avgDwell}s` : ''}
                  </span>
                </p>
              )}
            </div>

            <div className="rounded-xl border bg-bg-panel/50 backdrop-blur p-5" style={{ borderColor: `${cor}33` }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" style={{ color: cor }} />
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-dim">Match Médio IA</p>
              </div>
              {loading ? (
                <div className="h-10 w-16 rounded animate-pulse bg-white/10" />
              ) : (
                <p className="font-display text-5xl font-black" style={{ color: cor, textShadow: `0 0 16px ${cor}88` }}>
                  {candidaturas.length > 0 ? `${avgScore}` : '—'}
                  {candidaturas.length > 0 && <span className="text-2xl text-text-dim ml-1">/100</span>}
                </p>
              )}
            </div>
          </div>

          {/* Lista de candidatos */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-text-dim mb-4">
              Candidatos {candidaturas.length > 0 && `· ${candidaturas.length}`}
            </p>

            {!supabaseConfigurado ? (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
                <p className="text-yellow-400 text-sm font-medium mb-2">Supabase não configurado</p>
                <p className="text-text-muted text-xs leading-relaxed">
                  Crie o arquivo <code className="text-yellow-300">.env</code> com{' '}
                  <code className="text-yellow-300">VITE_SUPABASE_URL</code> e{' '}
                  <code className="text-yellow-300">VITE_SUPABASE_ANON_KEY</code> e rode o schema em{' '}
                  <code className="text-yellow-300">supabase/schema.sql</code>.
                </p>
              </div>
            ) : loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse bg-white/5" />
                ))}
              </div>
            ) : candidaturas.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-text-dim text-sm">Nenhum CV recebido ainda.</p>
                <p className="text-text-muted text-xs mt-1">
                  Compartilhe o link da feira para receber candidaturas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {candidaturas.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <CardCandidato c={c} cor={cor} jobLabel={jobLabel(c.job_id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

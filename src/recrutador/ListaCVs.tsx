import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Sparkles, Check } from 'lucide-react';
import type { Empresa, CandidatoMock } from '../shared/tipos';
import { candidatosPorEmpresa } from '../feira/candidatos-mock';
import { vagaPorId, vagasPorSlug } from '../feira/vagas';
import { useCandidato } from '../shared/candidato';
import { useRealtime, type RealtimeEvent } from '../shared/realtime';

interface Props {
  empresa: Empresa;
}

/**
 * Item da lista. Pode ser:
 *  - Um candidato do banco mockado (seed inicial)
 *  - O próprio usuário atual quando ele tem candidatura nessa empresa (`isVoce`)
 *  - Uma candidatura realtime chegando de outra aba (`isNovo` por 5s)
 */
interface ItemCV extends CandidatoMock {
  isVoce?: boolean;
  isNovo?: boolean;
}

// Cores deterministas pro avatar baseadas no nome.
const PALETA_AVATAR = ['#00D4FF', '#FF4B91', '#A855F7', '#84CC16', '#00C896', '#F59E0B'];
const corPorNome = (nome: string): string => {
  let h = 0;
  for (let i = 0; i < nome.length; i += 1) {
    h = (h * 31 + nome.charCodeAt(i)) >>> 0;
  }
  return PALETA_AVATAR[h % PALETA_AVATAR.length];
};

const formatarTempo = (minutos: number): string => {
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h`;
  const dias = Math.floor(horas / 24);
  return `há ${dias}d`;
};

const truncar = (texto: string, max: number): string =>
  texto.length <= max ? texto : `${texto.slice(0, max - 1).trimEnd()}…`;

export default function ListaCVs({ empresa }: Props) {
  // CV do usuário atual no zustand local.
  const candidaturasUser = useCandidato((s) => s.candidaturas);
  const nomeUser = useCandidato((s) => s.nome);
  const idUser = useCandidato((s) => s.id);
  const skillsUser = useCandidato((s) => s.skills);
  const sobreUser = useCandidato((s) => s.sobre);
  const githubUser = useCandidato((s) => s.github);

  // Estado: lista de itens.
  const [items, setItems] = useState<ItemCV[]>(() => candidatosPorEmpresa(empresa.slug));

  // Reset quando trocar empresa (rota dinâmica).
  useEffect(() => {
    setItems(candidatosPorEmpresa(empresa.slug));
  }, [empresa.slug]);

  // Insere o usuário no topo (uma vez por jobId desta empresa).
  useEffect(() => {
    if (!idUser) return;
    const vagasDaEmpresa = new Set(vagasPorSlug(empresa.slug).map((v) => v.id));
    const candidaturasDaEmpresa = candidaturasUser.filter((id) => vagasDaEmpresa.has(id));
    if (candidaturasDaEmpresa.length === 0) return;

    setItems((prev) => {
      const sem = prev.filter((p) => !p.isVoce);
      // Pega a candidatura mais recente (último do array) como referência.
      const jobId = candidaturasDaEmpresa[candidaturasDaEmpresa.length - 1];
      const eu: ItemCV = {
        id: `voce-${idUser}`,
        nome: nomeUser || 'Você',
        skills: skillsUser,
        sobre: sobreUser || 'Candidato real desta sessão.',
        github: githubUser,
        jobId,
        companySlug: empresa.slug,
        dwellSeconds: 0,
        criadoHaMinutos: 0,
        isVoce: true
      };
      return [eu, ...sem];
    });
  }, [
    idUser,
    nomeUser,
    skillsUser,
    sobreUser,
    githubUser,
    candidaturasUser,
    empresa.slug
  ]);

  // Limpa flag isNovo após 5s.
  const limparHighlight = useCallback((id: string) => {
    setTimeout(() => {
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, isNovo: false } : p)));
    }, 5000);
  }, []);

  // Handler realtime.
  const onRealtime = useCallback(
    (evt: RealtimeEvent) => {
      if (evt.tipo !== 'nova-candidatura') return;
      if (evt.companySlug !== empresa.slug) return;

      const vaga = vagaPorId(evt.jobId);
      if (!vaga) return;

      const novoId = `rt-${evt.candidatoId}-${evt.jobId}`;
      setItems((prev) => {
        // Idempotência: ignora se já existe.
        if (prev.some((p) => p.id === novoId)) return prev;
        const novo: ItemCV = {
          id: novoId,
          nome: evt.nomeCandidato,
          skills: [],
          sobre: 'Candidatura recém-chegada via realtime.',
          github: '',
          jobId: evt.jobId,
          companySlug: empresa.slug,
          dwellSeconds: 0,
          criadoHaMinutos: 0,
          isNovo: true
        };
        return [novo, ...prev];
      });
      limparHighlight(novoId);
    },
    [empresa.slug, limparHighlight]
  );

  useRealtime(onRealtime);

  return (
    <div className="rounded-xl border border-text-dim/15 bg-bg-panel/50 backdrop-blur p-6">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim mb-1">
            CVs recebidos
          </p>
          <h2 className="font-display text-xl text-text-bright">
            {items.length}{' '}
            <span className="text-sm text-text-muted font-body">
              candidato{items.length === 1 ? '' : 's'}
            </span>
          </h2>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">
          Ordenado por chegada
        </p>
      </div>

      <ul className="space-y-3 max-h-[640px] overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => (
            <ItemCard
              key={item.id}
              item={item}
              empresa={empresa}
              delay={idx * 0.04}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

interface ItemCardProps {
  item: ItemCV;
  empresa: Empresa;
  delay: number;
}

function ItemCard({ item, empresa, delay }: ItemCardProps) {
  const vaga = useMemo(() => vagaPorId(item.jobId), [item.jobId]);
  const corAvatar = useMemo(() => corPorNome(item.nome), [item.nome]);
  const inicial = item.nome.trim().charAt(0).toUpperCase() || '?';

  const SKILLS_VISIVEIS = 4;
  const skillsExibidas = item.skills.slice(0, SKILLS_VISIVEIS);
  const skillsRestantes = Math.max(0, item.skills.length - SKILLS_VISIVEIS);

  // Estilo condicional pro highlight.
  const borderColor = item.isVoce
    ? `${empresa.cor}88`
    : item.isNovo
      ? `${empresa.cor}aa`
      : 'rgba(148, 163, 184, 0.15)';

  const boxShadow = item.isVoce
    ? `0 0 26px ${empresa.cor}33`
    : item.isNovo
      ? `0 0 32px ${empresa.cor}55`
      : 'none';

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: item.isNovo
          ? [
              `0 0 0px ${empresa.cor}00`,
              `0 0 36px ${empresa.cor}77`,
              `0 0 20px ${empresa.cor}44`
            ]
          : boxShadow
      }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.35,
        delay,
        boxShadow: { duration: 1.6, repeat: item.isNovo ? Infinity : 0 }
      }}
      className="rounded-lg border bg-bg-elev/40 p-4"
      style={{ borderColor, boxShadow }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-bold text-bg-deep"
          style={{
            background: corAvatar,
            boxShadow: `0 0 14px ${corAvatar}55`
          }}
        >
          {inicial}
        </div>

        {/* Corpo */}
        <div className="flex-1 min-w-0">
          {/* Header: nome + tempo + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-display text-sm text-text-bright">{item.nome}</span>
            <span className="text-[10px] text-text-muted">
              {formatarTempo(item.criadoHaMinutos)}
            </span>

            {item.isVoce && (
              <span
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded font-display"
                style={{
                  background: `linear-gradient(90deg, ${empresa.cor}cc, ${empresa.cor}55)`,
                  color: '#05060F'
                }}
              >
                <Check className="w-3 h-3" />
                Sua candidatura
              </span>
            )}

            {item.isNovo && !item.isVoce && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded font-display border"
                style={{
                  borderColor: empresa.cor,
                  color: empresa.cor
                }}
              >
                Novo
              </motion.span>
            )}
          </div>

          {/* Vaga */}
          {vaga && (
            <p
              className="inline-block text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded mb-2 border"
              style={{
                borderColor: `${empresa.cor}55`,
                color: empresa.cor,
                background: `${empresa.cor}10`
              }}
            >
              {vaga.titulo}
            </p>
          )}

          {/* Sobre */}
          {item.sobre && (
            <p className="text-xs text-text-dim leading-relaxed mb-2">
              {truncar(item.sobre, 100)}
            </p>
          )}

          {/* Skills */}
          {skillsExibidas.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {skillsExibidas.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-text-dim/20 text-text-dim bg-bg-deep/40"
                >
                  {s}
                </span>
              ))}
              {skillsRestantes > 0 && (
                <span className="text-[10px] text-text-muted">+{skillsRestantes}</span>
              )}
            </div>
          )}

          {/* Footer: github + IA stub */}
          <div className="flex items-center justify-between gap-2 mt-2">
            {item.github ? (
              <a
                href={item.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-text-dim hover:text-neon-cyan transition"
              >
                <Github className="w-3.5 h-3.5" />
                github
              </a>
            ) : (
              <span className="text-[11px] text-text-muted">sem github</span>
            )}

            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-text-muted opacity-60">
              <Sparkles className="w-3 h-3" />
              Análise IA: —
            </span>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Activity } from 'lucide-react';
import type { Empresa } from '../shared/tipos';
import { useVisitasDaEmpresa, type ItemVisita } from '../shared/db';
import { useRealtime, type RealtimeEvent } from '../shared/realtime';

interface Props {
  empresa: Empresa;
}

interface DadoBarra {
  nome: string;
  segundos: number;
}

const formatarSegundos = (s: number): string => {
  if (s < 60) return `${s}s`;
  const min = Math.floor(s / 60);
  const resto = s % 60;
  return resto === 0 ? `${min}m` : `${min}m${resto}s`;
};

interface TooltipPayload {
  payload: DadoBarra;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const TooltipCustom = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-text-dim/30 bg-bg-deep/95 backdrop-blur px-3 py-2 text-xs">
      <p className="font-display text-text-bright">{d.nome}</p>
      <p className="text-text-dim">{formatarSegundos(d.segundos)} no estande</p>
    </div>
  );
};

/**
 * BarChart horizontal — top candidatos por dwell time no estande.
 * Fonte primária: Supabase (com realtime subscribe via useVisitasDaEmpresa).
 * Fonte de fallback: mock local quando sem env.
 * Patches via BroadcastChannel também são aplicados — cross-tab dev.
 */
export default function Heatmap({ empresa }: Props) {
  const { dados: visitasDb } = useVisitasDaEmpresa(empresa.slug);

  // Espelha o que veio do hook num state local pra poder patchar via BroadcastChannel.
  const [dados, setDados] = useState<DadoBarra[]>(() =>
    visitasDb.map((v: ItemVisita) => ({ nome: v.nome, segundos: v.segundos }))
  );

  useEffect(() => {
    setDados(visitasDb.map((v) => ({ nome: v.nome, segundos: v.segundos })));
  }, [visitasDb]);

  const onRealtime = useCallback(
    (evt: RealtimeEvent) => {
      if (evt.tipo !== 'nova-visita') return;
      if (evt.companySlug !== empresa.slug) return;

      setDados((prev) => {
        const existe = prev.findIndex((d) => d.nome === evt.nomeCandidato);
        if (existe >= 0) {
          // Pega o MAIOR dwell — visita pode repetir.
          const novoSeg = Math.max(prev[existe].segundos, evt.dwellSeconds);
          const clonado = prev.slice();
          clonado[existe] = { ...clonado[existe], segundos: novoSeg };
          return clonado;
        }
        return [...prev, { nome: evt.nomeCandidato, segundos: evt.dwellSeconds }];
      });
    },
    [empresa.slug]
  );

  useRealtime(onRealtime);

  // Top 6 ordenado decrescente.
  const top = useMemo(
    () => dados.slice().sort((a, b) => b.segundos - a.segundos).slice(0, 6),
    [dados]
  );

  // Pega o primeiro nome pra rótulo no eixo Y mais legível.
  const dadosLegiveis = useMemo(
    () =>
      top.map((d) => ({
        ...d,
        nome: d.nome.split(' ').slice(0, 2).join(' ')
      })),
    [top]
  );

  return (
    <div className="rounded-xl border border-text-dim/15 bg-bg-panel/50 backdrop-blur p-6">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-4 h-4" style={{ color: empresa.cor }} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim">
          Engajamento no estande
        </p>
      </div>
      <h2 className="font-display text-lg text-text-bright mb-1">
        Top {dadosLegiveis.length} por permanência
      </h2>
      <p className="text-xs text-text-muted mb-5">
        Tempo dentro do raio do estande (segundos).
      </p>

      <div className="w-full h-[280px]">
        {dadosLegiveis.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-text-muted">
            Nenhuma visita registrada ainda.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosLegiveis}
              layout="vertical"
              margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="rgba(148, 163, 184, 0.12)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="#64748B"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(v: number) => formatarSegundos(v)}
              />
              <YAxis
                type="category"
                dataKey="nome"
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                width={96}
              />
              <Tooltip
                content={<TooltipCustom />}
                cursor={{ fill: `${empresa.cor}10` }}
              />
              <Bar dataKey="segundos" radius={[0, 6, 6, 0]} isAnimationActive>
                {dadosLegiveis.map((entry, i) => (
                  <Cell
                    key={entry.nome}
                    fill={empresa.cor}
                    fillOpacity={1 - i * 0.12}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

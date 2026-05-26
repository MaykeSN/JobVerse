import { useEffect } from 'react';

/**
 * Camada de "realtime" mockada via BroadcastChannel.
 *
 * IMPORTANTE: BroadcastChannel só entrega mensagens pra OUTRAS abas/janelas do mesmo origin —
 * a aba que emite não recebe seu próprio evento. Pra testar localmente:
 *  1) Abra /feira numa aba e candidate-se a uma vaga.
 *  2) Abra /recrutador/<slug-da-empresa> em outra aba.
 *  3) O painel recebe a candidatura em tempo real.
 *
 * Pra suportar o caso de 1 aba só (útil em dev), o painel também consome o estado
 * local do zustand do candidato — a candidatura "Você" aparece direto sem precisar
 * passar pelo channel.
 */

export type RealtimeEvent =
  | {
      tipo: 'nova-candidatura';
      candidatoId: string;
      companySlug: string;
      jobId: string;
      nomeCandidato: string;
    }
  | {
      tipo: 'nova-visita';
      candidatoId: string;
      companySlug: string;
      dwellSeconds: number;
      nomeCandidato: string;
    };

const CHANNEL_NAME = 'jobverse-realtime';

// SSR-safe singleton: instancia só no browser.
let channel: BroadcastChannel | null = null;

const getChannel = (): BroadcastChannel | null => {
  if (typeof window === 'undefined') return null;
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
};

/**
 * Emite um evento pras outras abas do mesmo origin.
 * Silencia falhas — não queremos quebrar a UX do candidato se o canal falhar.
 */
export const emitir = (event: RealtimeEvent): void => {
  try {
    const ch = getChannel();
    ch?.postMessage(event);
  } catch {
    // ignore — realtime é nice-to-have
  }
};

/**
 * Hook que assina o canal e chama o handler a cada evento recebido.
 * O handler precisa ser estável (useCallback) ou o listener vai re-registrar a cada render.
 */
export const useRealtime = (handler: (event: RealtimeEvent) => void): void => {
  useEffect(() => {
    const ch = getChannel();
    if (!ch) return;

    const onMessage = (e: MessageEvent<RealtimeEvent>) => {
      handler(e.data);
    };

    ch.addEventListener('message', onMessage);
    return () => {
      ch.removeEventListener('message', onMessage);
    };
  }, [handler]);
};

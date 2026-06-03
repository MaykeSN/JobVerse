import { create } from 'zustand';
import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Multiplayer leve via Supabase Realtime Broadcast.
 * Sem escrita no banco — só mensagens pub/sub em tempo real.
 * Canal: 'jobverse-lobby' (todos os players da feira).
 *
 * Fluxo:
 *  1. OutrosJogadores.tsx chama `conectar(id, nome)` quando monta
 *  2. useFrame em OutrosJogadores emite posição a 10fps via `emitir()`
 *  3. Outros clientes recebem e atualizam `jogadores` no store
 *  4. Jogadores inativos (>6s sem update) são removidos por `limparInativos()`
 */

// Paleta neon pra distinguir jogadores visualmente
const CORES = ['#FF4B91', '#A855F7', '#F59E0B', '#EF4444', '#84CC16', '#06B6D4', '#F97316'];

function corDaId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return CORES[Math.abs(h) % CORES.length];
}

export interface JogadorRemoto {
  id: string;
  nome: string;
  x: number;
  z: number;
  rotY: number;
  cor: string;
  ts: number; // timestamp do último update (ms)
  local: string; // 'feira' | 'sala:slug'
}

interface MultiplayerState {
  jogadores: Record<string, JogadorRemoto>;
  conectado: boolean;
  _ch: RealtimeChannel | null;
  _id: string;
  _nome: string;
  conectar: (id: string, nome: string) => void;
  desconectar: () => void;
  emitir: (x: number, z: number, rotY: number, local?: string) => void;
  limparInativos: () => void;
}

export const useMultiplayer = create<MultiplayerState>((set, get) => ({
  jogadores: {},
  conectado: false,
  _ch: null,
  _id: '',
  _nome: '',

  conectar(id, nome) {
    if (!supabase || get()._ch) return;

    const ch = supabase.channel('jobverse-lobby', {
      config: { broadcast: { self: false } }
    });

    ch
      .on('broadcast', { event: 'pos' }, ({ payload }) => {
        if (!payload?.id || payload.id === get()._id) return;
        set((s) => ({
          jogadores: {
            ...s.jogadores,
            [payload.id]: {
              id: payload.id,
              nome: payload.nome ?? 'Dev',
              x: payload.x ?? 0,
              z: payload.z ?? 0,
              rotY: payload.r ?? 0,
              cor: corDaId(payload.id),
              ts: Date.now(),
              local: payload.loc ?? 'feira'
            }
          }
        }));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') set({ conectado: true });
      });

    set({ _ch: ch, _id: id, _nome: nome });
  },

  desconectar() {
    const { _ch } = get();
    if (_ch && supabase) supabase.removeChannel(_ch);
    set({ _ch: null, conectado: false, jogadores: {}, _id: '', _nome: '' });
  },

  emitir(x, z, rotY, local = 'feira') {
    const { _ch, _id, _nome } = get();
    if (!_ch || !_id) return;
    void _ch.send({
      type: 'broadcast',
      event: 'pos',
      payload: { id: _id, nome: _nome, x, z, r: rotY, loc: local }
    });
  },

  limparInativos() {
    const now = Date.now();
    set((s) => {
      const jogadores = { ...s.jogadores };
      let mudou = false;
      for (const id in jogadores) {
        if (now - jogadores[id].ts > 12000) { // 12s — tolerante a aba em background
          delete jogadores[id];
          mudou = true;
        }
      }
      return mudou ? { jogadores } : s;
    });
  }
}));

/**
 * Áudio ambiente do JobVerse — sintetizado em runtime via Web Audio API.
 * Zero assets externos. Drone evolutivo (3 osciladores + LFO no lowpass)
 * + sfx procedurais (click, sucesso). Toggle persistido no localStorage.
 *
 * O browser exige user gesture pra "destravar" o AudioContext —
 * por isso só inicializamos no toggle (que vem de click).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DroneNodes = {
  oscs: OscillatorNode[];
  gain: GainNode;
  lfo: OscillatorNode;
  filter: BiquadFilterNode;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let drone: DroneNodes | null = null;

function ensureCtx() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return { ctx, master: master! };
}

function startDrone() {
  if (drone) return;
  const { ctx: c, master: m } = ensureCtx();

  const g = c.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(0.8, c.currentTime + 2.5);

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 700;
  filter.Q.value = 4;

  // 3 vozes: A2 (drone), E3 (quinta), A3 oitava — minor mode (cyberpunk vibe)
  const oscs: OscillatorNode[] = [];
  const config: Array<{ freq: number; type: OscillatorType; gain: number; detune: number }> = [
    { freq: 110, type: 'triangle', gain: 0.55, detune: 0 },
    { freq: 164.81, type: 'sine', gain: 0.32, detune: -4 },
    { freq: 220, type: 'sine', gain: 0.22, detune: 6 }
  ];
  config.forEach(({ freq, type, gain, detune }) => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    const og = c.createGain();
    og.gain.value = gain;
    o.connect(og).connect(filter);
    o.start();
    oscs.push(o);
  });

  // LFO modula a frequência do lowpass — dá sensação de "respiração"
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 280;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  filter.connect(g).connect(m);
  drone = { oscs, gain: g, lfo, filter };
}

function stopDrone() {
  if (!drone || !ctx) return;
  const c = ctx;
  const d = drone;
  d.gain.gain.cancelScheduledValues(c.currentTime);
  d.gain.gain.linearRampToValueAtTime(0, c.currentTime + 1);
  setTimeout(() => {
    d.oscs.forEach((o) => o.stop());
    d.lfo.stop();
  }, 1100);
  drone = null;
}

/** SFX curto pra cliques de UI */
export function tocarClick() {
  if (!useAudio.getState().habilitado) return;
  const { ctx: c, master: m } = ensureCtx();
  const o = c.createOscillator();
  o.type = 'square';
  o.frequency.value = 880;
  const g = c.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(0.12, c.currentTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09);
  o.connect(g).connect(m);
  o.start();
  o.stop(c.currentTime + 0.1);
}

/** SFX confirmação (2 notas ascendentes) */
export function tocarSucesso() {
  if (!useAudio.getState().habilitado) return;
  const { ctx: c, master: m } = ensureCtx();
  [880, 1318.5].forEach((f, i) => {
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    const g = c.createGain();
    const start = c.currentTime + i * 0.1;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.12, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    o.connect(g).connect(m);
    o.start(start);
    o.stop(start + 0.25);
  });
}

/** SFX easter egg — tom curto de "celebração" */
export function tocarRave() {
  if (!useAudio.getState().habilitado) return;
  const { ctx: c, master: m } = ensureCtx();
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const g = c.createGain();
    const start = c.currentTime + i * 0.06;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.1, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    o.connect(g).connect(m);
    o.start(start);
    o.stop(start + 0.3);
  });
}

interface AudioState {
  habilitado: boolean;
  toggle: () => void;
  ativar: () => void;
  desativar: () => void;
}

export const useAudio = create<AudioState>()(
  persist(
    (set, get) => ({
      habilitado: false,
      toggle: () => {
        const novo = !get().habilitado;
        set({ habilitado: novo });
        if (novo) startDrone();
        else stopDrone();
      },
      ativar: () => {
        if (get().habilitado) return;
        set({ habilitado: true });
        startDrone();
      },
      desativar: () => {
        set({ habilitado: false });
        stopDrone();
      }
    }),
    { name: 'jobverse-audio' }
  )
);

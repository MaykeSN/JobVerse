import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Qualidade = 'baixa' | 'media' | 'alta';

interface GraficosState {
  qualidade: Qualidade;
  setQualidade: (q: Qualidade) => void;
}

export const useGraficos = create<GraficosState>()(
  persist(
    (set) => ({
      qualidade: 'alta',
      setQualidade: (qualidade) => set({ qualidade })
    }),
    { name: 'jobverse-graficos' }
  )
);

interface Preset {
  // Piso
  reflexo: boolean;
  reflexoResolution: number;
  reflexoBlur: [number, number];
  reflexoMirror: number;

  // Sparkles
  sparklesAmbiente: number;
  sparklesEstande: number;

  // Postprocessing
  bloom: boolean;
  bloomIntensity: number;
  vignette: boolean;

  // Particulas 2D (landing/recrutador)
  particulas2D: 'baixa' | 'media' | 'alta';

  // Estande
  pointLightEstande: boolean;
}

export const PRESETS: Record<Qualidade, Preset> = {
  baixa: {
    reflexo: false,
    reflexoResolution: 0,
    reflexoBlur: [0, 0],
    reflexoMirror: 0,
    sparklesAmbiente: 30,
    sparklesEstande: 12,
    bloom: false,
    bloomIntensity: 0,
    vignette: false,
    particulas2D: 'baixa',
    pointLightEstande: false
  },
  media: {
    reflexo: true,
    reflexoResolution: 256,
    reflexoBlur: [120, 40],
    reflexoMirror: 0.22,
    sparklesAmbiente: 70,
    sparklesEstande: 25,
    bloom: true,
    bloomIntensity: 0.7,
    vignette: false,
    particulas2D: 'media',
    pointLightEstande: true
  },
  alta: {
    reflexo: true,
    reflexoResolution: 512,
    reflexoBlur: [200, 80],
    reflexoMirror: 0.35,
    sparklesAmbiente: 120,
    sparklesEstande: 45,
    bloom: true,
    bloomIntensity: 1.1,
    vignette: true,
    particulas2D: 'alta',
    pointLightEstande: true
  }
};

export const usePreset = () => {
  const qualidade = useGraficos((s) => s.qualidade);
  return PRESETS[qualidade];
};

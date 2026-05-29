import { useEffect, useRef, useState } from 'react';
import { useLocalizacao } from './localizacao';

/**
 * Overlay HTML que faz um fade rápido para preto toda vez que o player
 * troca de localização (lobby ↔ sala). Esconde o salto abrupto da câmera
 * e dá a sensação de "portal" sem precisar de física ou animação 3D.
 *
 * - Fade IN  (0 → 1): 120ms — cobre o teleporte instantaneamente
 * - Mantém preto:      80ms — garante que a cena já renderizou no novo local
 * - Fade OUT (1 → 0): 350ms — dissolve suavemente pro novo ambiente
 */
export default function FadeTransicao() {
  const [visivel, setVisivel] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const localizacao = useLocalizacao((s) => s.localizacao);
  const prevTipo = useRef(localizacao.tipo);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevTipo.current === localizacao.tipo) return;
    prevTipo.current = localizacao.tipo;

    // Cancela qualquer transição em andamento
    if (timerRef.current) clearTimeout(timerRef.current);

    // Aparece imediatamente (opaco)
    setVisivel(true);
    setSaindo(false);

    // Após 200ms começa a sair (fade out)
    timerRef.current = setTimeout(() => {
      setSaindo(true);
      // Após o fade out completo (350ms), desmonta o overlay
      timerRef.current = setTimeout(() => setVisivel(false), 350);
    }, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localizacao]);

  if (!visivel) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#05060F',
        opacity: saindo ? 0 : 1,
        pointerEvents: 'none',
        zIndex: 45,
        transition: saindo ? 'opacity 0.35s ease-out' : 'opacity 0.12s ease-in',
      }}
    />
  );
}

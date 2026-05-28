import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useLocalizacao } from '../shared/localizacao';

/**
 * Componente "invisível" que reposiciona a câmera quando a localização muda
 * (lobby ↔ sala). Vive dentro do Canvas pra ter acesso ao `useThree`.
 *
 * - Voltar pro lobby: câmera no shot estabelecedor [0, 5, 14] olhando pra praça.
 * - Entrar numa sala: câmera próxima ao totem [0, 1.7, 2] olhando pro logo no fundo.
 */
export default function Teletransporte() {
  const camera = useThree((s) => s.camera);
  const localizacao = useLocalizacao((s) => s.localizacao);
  const tipoAnterior = useRef<string>(localizacao.tipo);

  useEffect(() => {
    // Evita teleport no primeiro render — câmera inicial já está no spot certo.
    if (tipoAnterior.current === localizacao.tipo && localizacao.tipo === 'feira') {
      tipoAnterior.current = localizacao.tipo;
      return;
    }
    tipoAnterior.current = localizacao.tipo;

    if (localizacao.tipo === 'feira') {
      camera.position.set(0, 5, 14);
      camera.lookAt(0, 1, 0);
    } else {
      // Sala — começa próximo ao totem (que fica em z=2), olhando pro logo
      // pendurado na parede do fundo (z = -5).
      camera.position.set(0, 1.7, 2);
      camera.lookAt(0, 1.8, -5);
    }
  }, [localizacao, camera]);

  return null;
}

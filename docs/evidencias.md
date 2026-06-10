# Evidências - JobVerse

Este arquivo centraliza o que deve ser comprovado na entrega final. Use os itens abaixo como checklist para preencher o documento de evidências com prints, links e observações.

## Links finais

| Item | Link |
|---|---|
| Deploy | https://job-verse-tau.vercel.app |
| Repositório | https://github.com/MaykeSN/JobVerse |
| Vídeo-pitch | A preencher |
| PDF técnico | `docs/JobVerse_Documentacao_Tecnica_Equipe_Zeus.pdf` |
| Slides | `docs/JobVerse_Pitch_Equipe_Zeus.pptx` |

## Prints recomendados

| Evidência | O que capturar |
|---|---|
| Landing | Tela inicial com identidade visual do JobVerse. |
| Login/cadastro | Modal com perfil dev/recrutador. |
| Feira 3D | Lobby com estandes visíveis. |
| Estande | Aproximação de um estande e indicação visual. |
| Sala interna | Sala da empresa com paredes, pilares, teto, NPC e stack tags. |
| Quadro de vaga | Quadro destacado por proximidade. |
| Candidatura | Modal de CV e envio para uma vaga. |
| Match score | Resultado/insights salvos na candidatura ou exibidos no painel. |
| Dashboard recrutador | Lista de CVs, heatmap e indicador ao vivo. |
| Multiplayer | Duas abas ou dois navegadores mostrando avatar remoto. |
| Deploy | URL pública aberta no navegador. |

## Testes técnicos

| Teste | Comando/ação | Resultado esperado |
|---|---|---|
| Typecheck | `npm run typecheck` | Sem erros de TypeScript. |
| Build | `npm run build` | Build gerado com sucesso. |
| Preview | `npm run preview` | Build abre localmente. |
| Supabase schema | Rodar `supabase/schema.sql` | Tabelas e realtime configurados. |
| Broadcast | Abrir duas abas na feira | Avatares remotos aparecem no mesmo local. |
| Fallback | Rodar sem `.env` | Fluxo visual continua navegável com mocks. |

## Observações para banca

- O multiplayer é leve e usa Supabase Broadcast, sem persistir posição no banco.
- O match score atual é heurístico/local; a Edge Function `ai-summary` prepara a evolução para IA real.
- RLS está desabilitado no MVP e deve ser habilitado em produção.
- Empresas e vagas do MVP são fictícias para demonstração.

# Checklist de entrega - JobVerse

## Requisitos do Desafio 4 - ExpoVerse

| Requisito | Status | Evidência no projeto |
|---|---:|---|
| Ambiente 3D navegável | OK | Rota `/feira` com cena R3F, WASD, mouse e estandes. |
| Interação com objetos | OK | Estandes, salas internas, quadros de vaga, totem de retorno e modais. |
| Experiência com propósito | OK | Feira de empregos imersiva para candidatos e recrutadores. |
| Execução no navegador | OK | Vite/React/Three.js, sem Unity ou instalação externa. |
| README com instruções | OK | `README.md`, `docs/execucao-local.md` e `docs/setup-supabase.md`. |
| Documentação técnica | OK | `docs/JobVerse_Documentacao_Tecnica_Equipe_Zeus.pdf` e `.docx`. |
| Evidências | Parcial | `docs/evidencias.md` e documento de evidências para preencher com prints finais. |
| Pitch/deck | OK | `docs/JobVerse_Pitch_Equipe_Zeus.pptx`, `docs/roteiro-pitch.md` e `docs/slides-outline.md`. |

## Funcionalidades entregues

- Landing com escolha de perfil.
- Autenticação custom por GitHub username e senha.
- Feira 3D com estandes em ambiente navegável.
- Salas internas por empresa.
- Quadros de vaga interativos.
- Candidatura com CV simplificado.
- Match score heurístico com insights.
- Painel de recrutador com CVs, heatmap e status ao vivo.
- Supabase Postgres e Realtime.
- Multiplayer leve via Supabase Broadcast.
- Avatares remotos filtrados por lobby/sala.
- NPC recepcionista e melhorias visuais nas salas.
- Rave mode via Konami code.
- Deploy público em Vercel.

## Itens para revisar antes da submissão

- Confirmar que o deploy público abre sem erro: https://job-verse-tau.vercel.app.
- Testar `/feira`, `/recrutador` e `/recrutador/irede`.
- Capturar prints finais para o arquivo de evidências.
- Inserir link do vídeo-pitch quando publicado.
- Conferir se o repositório GitHub está público e atualizado.
- Rodar `npm run typecheck` e `npm run build` antes do envio final.

## Riscos conhecidos

| Risco | Mitigação |
|---|---|
| Supabase não configurado na máquina da banca | O app possui fallback/mock para demonstração visual. |
| Multiplayer variar conforme rede/Supabase | É funcionalidade complementar; experiência principal continua local. |
| RLS desabilitado no MVP | Documentado como limitação e roadmap de produção. |
| IA real ainda não integrada | `ai-summary` é stub e match score local cobre a prova do conceito. |

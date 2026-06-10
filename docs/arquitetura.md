# Arquitetura do JobVerse

## Visão geral

O JobVerse é uma SPA web imersiva construída para o Desafio 4 - ExpoVerse. A aplicação roda no navegador e combina uma feira 3D navegável, salas internas por empresa, quadros de vaga, candidaturas, painel de recrutador e presença multiplayer leve.

O objetivo arquitetural é manter a experiência acessível para banca e usuários finais: sem Unity, sem instalação e com fallback local quando o Supabase não está configurado.

## Camadas

| Camada                     | Responsabilidade                                                 |
| -------------------------- | ---------------------------------------------------------------- |
| React/Vite                 | Aplicação SPA, rotas e UI HTML.                                  |
| React Three Fiber          | Cena 3D, lobby, estandes, salas, NPCs, quadros e avatares.       |
| Zustand                    | Estado local de candidato, UI, áudio, localização e multiplayer. |
| Supabase Postgres          | Persistência de candidatos, candidaturas e visitas.              |
| Supabase Realtime          | Atualização do painel de recrutador.                             |
| Supabase Broadcast         | Multiplayer leve com posição de outros jogadores.                |
| Edge Function `ai-summary` | Stub técnico para evolução com IA.                               |

## Fluxo principal

```text
Usuário
  -> Browser
  -> React/Vite SPA
  -> Cena 3D R3F + UI HTML
  -> Supabase Client
  -> Postgres + Realtime + Broadcast + Edge Function
```

## Experiência 3D

A rota `/feira` renderiza o ambiente principal. O candidato navega em primeira pessoa, visita estandes e pode entrar em salas internas por empresa.

Componentes principais:

- `Estande.tsx`: representa cada empresa no lobby.
- `Sala.tsx`: sala interna com chão reflexivo, paredes pulsantes, pilares neon, teto com grid, stack tags e NPC.
- `Quadro.tsx`: quadro de vaga interativo com destaque de proximidade.
- `Teletransporte.tsx`: transição entre lobby e sala.
- `FadeTransicao.tsx`: fade visual para esconder teleporte abrupto.
- `PlayerControls.tsx`: movimentação e colisão.
- `OutrosJogadores.tsx`: avatares remotos.

## Multiplayer

O multiplayer é leve e usa Supabase Realtime Broadcast no canal `jobverse-lobby`.

Características:

- Emissão de posição a cada 100 ms.
- Payload com `id`, `nome`, `x`, `z`, `rotY` e `local`.
- Local pode ser `feira` ou `sala:<slug>`.
- Avatares remotos são filtrados pelo mesmo local do jogador atual.
- Limite visual: 30 jogadores no lobby e 8 em sala.
- Jogadores inativos por mais de 12 segundos são removidos.

Essa escolha evita um servidor WebSocket próprio no MVP, mantendo a entrega simples para hackathon.

## Dados

| Tabela/estrutura  | Uso                                             |
| ----------------- | ----------------------------------------------- |
| `candidates`      | Perfil do candidato.                            |
| `applications`    | Candidaturas com `match_score` e `insights`.    |
| `visits`          | Permanência por empresa para heatmap.           |
| `users`           | Autenticação custom do MVP.                     |
| Broadcast payload | Presença multiplayer sem persistência no banco. |

## Match score

O match score é calculado no cliente em `src/shared/matchScore.ts`. A pontuação considera:

- cobertura dos requisitos da vaga;
- alinhamento com a stack da empresa;
- completude do perfil;
- sinais de senioridade no texto do candidato.

O resultado gera `score`, `nível` e uma lista de insights legíveis.

## Supabase e realtime

O painel do recrutador usa `postgres_changes` para refletir novas candidaturas e visitas. Já a presença multiplayer usa Broadcast, sem gravar posição no banco.

No MVP, RLS fica desabilitado para simplificar a demonstração. Em produção, o projeto deve migrar para Supabase Auth e políticas por papel/empresa.

## Deploy

Frontend:

- Vercel
- URL: https://job-verse-tau.vercel.app

Backend:

- Supabase Cloud
- Schema em `supabase/schema.sql`
- Seed em `supabase/seed.sql`
- Edge Function em `supabase/functions/ai-summary`

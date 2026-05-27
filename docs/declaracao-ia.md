# Declaração de uso de IA

Em conformidade com a **Regra 12** do edital HackWeb 2026.

## Ferramentas utilizadas

| Ferramenta | Provedor | Versão / Modelo | Uso |
|---|---|---|---|
| **Claude** | Anthropic | Opus 4.7 (via Claude Code) | Co-piloto principal: planejamento técnico, geração de boilerplate, refactor, escrita de docs, code review |

> Adicionar à tabela acima caso o time tenha usado outras ferramentas (ChatGPT, Gemini, Cursor, GitHub Copilot, geradores de imagem, etc).

---

## Onde a IA foi usada

| Área do projeto | Tipo de uso | % autoral |
|---|---|---|
| `PLANO.md` (plano técnico) | Co-escrita iterativa do plano | 60% IA · 40% revisão humana |
| Boilerplate inicial (Vite + React + R3F setup) | Geração baseada em prompt do time | 70% IA · 30% revisão humana |
| Componentes 3D (Estande, PlayerControls, DwellTracker) | Geração inicial + ajustes iterativos | 60% IA · 40% revisão humana |
| Cena R3F (Feira.tsx, Piso, LinhasNeon) | Geração inicial + refinamento manual de fog/camera/postprocessing | 50% IA · 50% revisão |
| Hooks de DB (`src/shared/db.ts`) | Geração baseada em schema + iteração | 65% IA · 35% revisão |
| Modais (Vagas, CV, Auth, MinhasCandidaturas) | Geração + ajustes de UX | 60% IA · 40% revisão |
| Dashboard recrutador (ListaCVs, Heatmap, IAEmBreve, IndicadorAoVivo) | Geração + decisões de design (escolha do BarChart) | 60% IA · 40% revisão |
| Sistema de auth (hash PBKDF2, store zustand) | Geração + revisão de segurança | 50% IA · 50% revisão |
| Áudio sintetizado (Web Audio drone + SFX) | Geração baseada em prompt detalhado | 70% IA · 30% revisão |
| Easter egg Konami + rave mode | Implementação 100% IA, revisão humana | 80% IA · 20% revisão |
| Schema SQL (`schema.sql`, `seed.sql`, `users.sql`) | Geração baseada em planejamento + revisão de tipos | 60% IA · 40% revisão |
| Conteúdo das empresas fictícias e candidatos mock | Geração de texto com brief detalhado | 70% IA · 30% curadoria humana |
| Logos das empresas | _(declarar se gerou com IA — DALL·E, Midjourney, etc)_ | _(a definir)_ |
| README, docs de setup, roteiro do pitch | Co-escrita | 60% IA · 40% revisão |

---

## O que é autoral vs. assistido

**Autoral (100% do time):**
- A ideia conceitual do JobVerse
- A arquitetura geral (separação 3D/dashboard/auth, escolha de stack)
- Decisões de produto (5 empresas, iRede como estande central, IA "em breve" como visão, sistema de qualidade gráfica)
- Decisões de UX (fluxo do candidato, pill "cursor livre", easter egg Konami, atalho `M` pra dev)
- Curadoria do conteúdo gerado por IA (rejeitar opções, ajustar tom, validar)
- Integração final de todos os módulos
- Testes manuais e validação visual

**Assistido por IA:**
- Boilerplate técnico (config Vite, Tailwind, TypeScript)
- Implementações de componentes individuais a partir de prompts detalhados
- Revisão de código
- Sugestões de estrutura e nomenclatura
- Geração de texto inicial das missões/vagas
- Documentação inicial (depois editada manualmente)

---

## Compromisso da equipe

A equipe é **totalmente responsável** pelo código submetido. Cada integrante:

1. Compreende e pode explicar a lógica, funcionamento e arquitetura de qualquer trecho do código — gerado ou não com auxílio de IA.
2. Reviu e validou cada bloco gerado antes de incorporá-lo.
3. Tomou decisões finais de produto, design e técnica de forma humana e fundamentada.

A IA atuou como **acelerador de produtividade**, não como substituta do trabalho intelectual.

---

## Política aplicada

Conforme regra 12 do edital:

> "Se a banca avaliadora identificar que o uso de IA ultrapassou o papel de apoio e substituiu o trabalho intelectual dos participantes, haverá decréscimo considerável na média final atribuída à entrega."

O time aderiu a essa política. Em caso de dúvida da banca, qualquer integrante pode explicar live qualquer trecho do código.

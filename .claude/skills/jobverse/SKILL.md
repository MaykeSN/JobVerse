---
name: jobverse
description: Contexto e ajuda com entregáveis finais do projeto JobVerse — feira de empregos imersiva 3D pra devs do HackWeb 2026 (Desafio 4 ExpoVerse, iRede / RESTIC 29). Use SEMPRE que o usuário pedir ajuda com vídeo-pitch de 5min, slides PDF do hackathon, screenshots/GIFs do produto, atualização do README, declaração de uso de IA (regra 12 do edital), submissão no formulário oficial iRede, ou tiver dúvidas sobre o JobVerse, a stack ou o time.
---

# JobVerse · HackWeb 2026 · Equipe

> Skill compartilhada do projeto. Carrega contexto completo pra cada integrante do time receber ajuda consistente do Claude.

---

## 📋 O que é o JobVerse

**Feira de empregos imersiva em 3D pra devs.** Projeto do HackWeb 2026 (Desafio 4 — ExpoVerse / Metaverso) da iRede Tecnologia / RESTIC 29.

**Tagline:** "Entre, explore, sinta a cultura — e leve uma vaga."

**Problema:** Processos seletivos de tecnologia são frios. Candidato envia CV pro vazio, não sente a cultura da empresa. Empresas perdem talento por não conseguir transmitir quem são antes da entrevista.

**Solução:** Ambiente 3D navegável onde 5 empresas têm estandes virtuais. Candidato anda em primeira pessoa, entra em **salas internas** com quadros de vagas nas paredes, candidata-se. Recrutadores têm painel realtime com CVs recebidos, heatmap de engajamento e (em breve) análise por IA.

**Links críticos:**
- 🌐 Produção: https://job-verse-tau.vercel.app
- 💻 Repo: https://github.com/MaykeSN/JobVerse
- 📚 Plano técnico: `PLANO.md` no repo
- 🎬 Roteiro pitch: `docs/roteiro-pitch.md`
- 🎨 Outline slides: `docs/slides-outline.md`

---

## ✅ Status atual (atualizado 27/05/2026)

**Pronto:**
- ✅ Landing com auth (dev/recrutador)
- ✅ Cena 3D do lobby (5 estandes em pentágono + NPCs recepcionistas + skybox de estrelas)
- ✅ Salas internas com quadros de vagas + totem voltar ao lobby
- ✅ Dashboard recrutador realtime (Supabase Realtime)
- ✅ Autenticação PBKDF2 client-side
- ✅ Atalhos de teclado (Q/V/L/M/B)
- ✅ Áudio sintetizado (Web Audio API) + easter egg Konami
- ✅ Sistema de qualidade gráfica (3 presets)
- ✅ Backend Supabase aplicado e funcional
- ✅ Deploy Vercel funcionando

**Pendente (até 31/05/2026 23:59 BRT):**
- ⏳ Vídeo-pitch de 5min no YouTube não-listado
- ⏳ Slides PDF (10 slides, exportar do outline)
- ⏳ Screenshots/GIFs no README
- ⏳ Atualizar `docs/declaracao-ia.md` com ferramentas usadas por cada integrante
- ⏳ Submissão no formulário oficial iRede

---

## 🎨 Stack técnica

| Camada | Tecnologia |
|---|---|
| Build | Vite 6 + React 18 + TypeScript 5 |
| 3D | three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing |
| Styling | Tailwind v4 (`@theme`) + framer-motion + tsParticles |
| Estado | Zustand persistido em localStorage |
| Backend | Supabase (Postgres + Realtime + Edge Functions) |
| Auth | Custom (Web Crypto API · PBKDF2 SHA-256) |
| Deploy | Vercel (frontend) + Supabase Cloud (backend) |

**Paleta de cores (igual em todo entregável):**
- Background: `#05060F`
- Cyan neon: `#00D4FF`
- Magenta neon: `#FF4B91`
- Verde iRede: `#00C896`
- Roxo Pixelforge: `#A855F7`
- Lima GreenLedger: `#84CC16`

**Tipografia:** Orbitron (display/títulos) + Inter (body)

---

## 🏢 5 empresas fictícias no MVP

| Slug | Nome | Setor | Cor |
|---|---|---|---|
| `irede` | **iRede Tecnologia** ⭐ | EdTech / Residências TIC | `#00C896` |
| `nimbus` | Nimbus Cloud | Infra / DevOps | `#00D4FF` |
| `kindred` | Kindred Health | Healthtech | `#FF4B91` |
| `pixelforge` | Pixelforge Studios | Gamedev | `#A855F7` |
| `greenledger` | GreenLedger | Fintech sustentável | `#84CC16` |

A **iRede ocupa o estande central** do pentágono — homenagem ao programa que organiza o HackWeb.

---

## 🎥 Ajuda com **Vídeo-pitch** (5 minutos)

**Arquivo de referência:** [`docs/roteiro-pitch.md`](../../../docs/roteiro-pitch.md) — tem fala literal por bloco.

**Estrutura recomendada:**
- **0:00–0:30** Abertura + problema relatável
- **0:30–1:30** O que é o JobVerse + stack
- **1:30–3:30** ★ Demo navegável ao vivo (a peça-chave do pitch)
- **3:30–4:30** Aplicação prática + roadmap
- **4:30–5:00** Time + URL + agradecimento à iRede

**Dicas críticas pra demo navegável (bloco 3):**
1. Cadastra como dev → entra na feira (mostra loading screen com glitch)
2. WASD até iRede (a verde) → DwellTracker pulsa o anel
3. **Click no estande** → câmera teleporta pra **dentro da sala interna**
4. Mostra os quadros de vagas nas paredes + logo gigante flutuante + totem ciano
5. Mira em "Candidatar" → modal de CV → enviar
6. **Abre 2ª aba `/recrutador/irede`** → mostra CV chegando em tempo real com highlight
7. Aponta pro Heatmap (Top 5 por permanência) + card "Análise IA em breve"
8. Volta pra aba 1, digita **Konami** (↑↑↓↓←→←→BA) → rave mode (10s de strobe)

**Checklist pré-gravação:**
- [ ] Qualidade gráfica em **Alta** (mostra o melhor visual)
- [ ] Áudio do JobVerse **desligado** (música/narração do pitch sobrepõe)
- [ ] 2 abas pré-abertas (feira + recrutador)
- [ ] DevTools fechado
- [ ] Microfone testado
- [ ] Ensaiar com cronômetro 3x antes do take final

**Onde subir:** YouTube **não-listado**, link no formulário iRede.

---

## 🎨 Ajuda com **Slides PDF** (10 slides)

**Arquivo de referência:** [`docs/slides-outline.md`](../../../docs/slides-outline.md) — tem layout, bullets e cores prontos pra cada slide.

**Slides:**
1. Capa (logo JOBVERSE cyan+magenta)
2. O problema (texto + ilustração)
3. A solução (3 colunas: Estandes 3D, Imersão 1ª P, Painel B2B)
4. Stack técnica (logos em grid)
5. Demo: a feira (screenshot grande)
6. Demo: dashboard recrutador (screenshot grande)
7. Aplicação prática (4 quadrantes)
8. Diferenciais vs alternativas (tabela)
9. Roadmap (timeline horizontal)
10. Encerramento (URLs + agradecimento)

**Onde fazer:** Canva, Figma Slides ou Google Slides. **Formato 16:9.**

**Regras de design:**
- Background `#05060F` em todos
- Títulos Orbitron, body Inter
- "JOB" em cyan, "VERSE" em magenta (mesma identidade do produto)
- Máximo 6 bullets por slide (~30s de fala)
- Transição fade simples — sem clip art
- **Usar screenshots reais** do produto, não mockups

**Exportar:** PDF 16:9. O edital pede PDF.

---

## 📸 Ajuda com **Screenshots/GIFs** pro README

**O README atual** ([`README.md`](../../../README.md)) tem 4 placeholders esperando mídia:

| Tela | URL | O que capturar |
|---|---|---|
| Landing | https://job-verse-tau.vercel.app | Logo glitch + form com botões "Sou dev / Sou recrutador" |
| Feira 3D | https://job-verse-tau.vercel.app/feira | Vista panorâmica dos 5 estandes em pentágono com NPCs ao lado |
| Sala interna | (entrar num estande) | Logo gigante flutuante + 3 quadros + totem ciano central |
| Dashboard recrutador | https://job-verse-tau.vercel.app/recrutador/irede | Pill "AO VIVO" + lista CVs + heatmap + card IA |
| Rave mode | Konami code na feira | GIF dos 10s de strobe + sparkles magenta |

**Ferramentas:** Lightshot ou ShareX (Windows) pra prints; ScreenToGif ou Loom pra GIF/vídeo curto do rave.

**Onde colocar:** `public/screenshots/` no repo. Atualizar o README substituindo a tabela `## Demo` por imagens reais:

```markdown
![Landing](public/screenshots/landing.png)
![Feira 3D](public/screenshots/feira.png)
```

**Cuidado:** Qualidade gráfica **Alta**, sem DevTools aberto, sem toast em cima.

---

## 📋 Ajuda com **Declaração de uso de IA** (regra 12 do edital)

**Arquivo:** [`docs/declaracao-ia.md`](../../../docs/declaracao-ia.md).

**Regra 12 do edital exige declarar:**
- Todas as ferramentas de IA generativa usadas (Claude, ChatGPT, Gemini, geradores de imagem, etc)
- Em quais partes do projeto
- O que foi gerado vs autoral
- Confirmação de que o time pode explicar todo o código

**Como ajudar um integrante a preencher:**
- Pergunta quais ferramentas IA ele usou (Claude Code, ChatGPT pra pesquisar, Midjourney pra logos, etc)
- Pergunta em qual parte (boilerplate, screenshots, missões fictícias, etc)
- Marca % autoral vs assistido por área
- A declaração já tem tabela base — só adicionar linhas

**⚠️ Risco:** Sem declaração completa, **decréscimo considerável na nota final** (texto literal do edital).

---

## ☁️ Ajuda com **Deploy Vercel**

Já está rodando em https://job-verse-tau.vercel.app

**Como atualizar:** auto-deploy a cada `git push origin main`. Confere no [vercel.com/dashboard](https://vercel.com/dashboard) → projeto **jobverse** → aba **Deployments** se o último commit tá "Ready".

**Environment vars necessárias na Vercel (já configuradas):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Forçar redeploy sem novo commit:** dashboard → último deploy → menu `⋯` → **Redeploy**.

---

## 📨 Ajuda com **Submissão iRede**

**Checklist do que enviar no formulário oficial:**
- [ ] Link do repositório GitHub público (https://github.com/MaykeSN/JobVerse)
- [ ] Link do vídeo-pitch no YouTube (não-listado)
- [ ] Arquivo PDF dos slides
- [ ] Link de produção (https://job-verse-tau.vercel.app)
- [ ] Nomes completos dos 4 integrantes da equipe

**Prazo final:** 31/05/2026 23:59 BRT. Sem prorrogação.

**Importante:** a submissão **não pode ser reenviada**. Só vale a primeira. Revisa tudo antes.

---

## ⚙️ Decisões técnicas críticas (não regridir)

Se for editar código do projeto, evita quebrar estas decisões:

1. **PointerLockControls com selector dummy** (`#__jobverse_no_auto_lock`) — não muda pra remover o selector, vai voltar bug de auto-lock acidental.
2. **`travarPlayer()` / `destravarPlayer()`** exportados de `PlayerControls.tsx` — sempre usar essas funções, **nunca** `document.body.requestPointerLock()` direto (perde user-activation gesture).
3. **`fecharComLock(fn)` wrapper** nos modais — re-trava o cursor no mesmo tick do click do user.
4. **Sistema de qualidade gráfica** (`useGraficos` + `usePreset`) — todos componentes 3D respeitam o preset. Não hardcoded valores de bloom/sparkles.
5. **Atalhos de teclado globais** ignoram inputs (INPUT/TEXTAREA/contentEditable) — não interferem em forms.
6. **Localização** (`useLocalizacao`) — `'feira'` ou `{ tipo: 'sala', slug }`. Render condicional decide se mostra lobby ou Sala.
7. **Graceful degradation** sem `.env`: mocks de `vagas.ts`, `empresas.ts`, `candidatos-mock.ts` continuam funcionando.

---

## 🎮 Atalhos pra mencionar no pitch/README

| Tecla | Ação |
|---|---|
| **WASD / setas** | Mover na cena 3D |
| **Shift** | Correr |
| **Mouse** | Olhar ao redor |
| **Click no estande** | Teleporta pra sala interna |
| **Click no quadro** | Abre modal de CV |
| **Click no totem ciano** | Volta pro lobby |
| **Q** | Cicla qualidade gráfica |
| **V** | Toggle áudio ambiente |
| **L** | Sair pra landing |
| **M** | Minhas candidaturas (dev) |
| **B** | Voltar pro lobby (em sala) |
| **ESC** | Libera cursor |
| **↑↑↓↓←→←→BA** | 🎉 Easter egg — Rave mode |

---

## 💬 Quando alguém perguntar...

### "Como demonstrar a feature X no vídeo?"
Sugira a sequência **bloco 3 do roteiro** (`docs/roteiro-pitch.md`). Esse bloco já tem a coreografia da demo.

### "Como descrever o projeto em 1 frase?"
> "Feira de empregos imersiva em 3D pra devs — entre, explore os estandes em 1ª pessoa, sinta a cultura, leve uma vaga."

### "Qual é o diferencial competitivo?"
1. **Imersão real** (3D navegável + salas internas + NPCs) vs LinkedIn/sites carreira frios
2. **Painel realtime** pro recrutador via Supabase
3. **Atalhos de teclado** UX de game pra qualquer ação
4. **Easter egg Konami** + áudio sintetizado em runtime
5. **Roadmap claro** com IA, multiplayer, WebXR

### "Como cito a iRede no pitch?"
Como **caso-cliente principal** — a iRede ocupa o estande central da feira como homenagem, e o projeto é diretamente plugável em residências/bootcamps tech (caso real da iRede).

### "Posso adicionar novos componentes ao código?"
Sim, mas:
- Respeita a paleta cyberpunk (cores acima)
- Usa Tailwind v4 com classes existentes (`bg-bg-panel`, `text-neon-cyan`, etc)
- Componentes 3D vão em `src/feira/`, UI 2D em `src/components/`
- Adiciona logs `[PLOCK]` se mexer em pointer lock (depois remove)
- Roda `npm run typecheck` antes de commit (zero erros, zero `any`)
- Atualiza `PLANO.md` checklist se completou alguma fase

---

## 🆘 Se algo quebrar antes da entrega

1. **Build falhou na Vercel:** confere `npm run build` local. Se tem erro de TS, roda `npm run typecheck` pra ver.
2. **Supabase off:** o app continua funcionando com mocks (graceful degradation). Não é crítico pro pitch.
3. **Pointer lock travou:** ESC + Ctrl+Shift+R (hard reload). Limpa localStorage se persistir.
4. **HMR travou no dev:** Ctrl+C no terminal e `npm run dev` de novo.

**Quando em dúvida, manda mensagem pro grupo da equipe.** O Mayke (dono do repo) coordena.

---

## 🚀 Mantra do time

> "JobVerse é onde devs e empresas se conhecem **antes** da entrevista — não depois."

Boa sorte na entrega! 💪

# JobVerse

> **Feira de empregos imersiva pra devs.** Entre, explore, sinta a cultura — e leve uma vaga.

Projeto do **HackWeb 2026 · Desafio 4 (ExpoVerse / Metaverso)** · iRede Tecnologia.

[![Stack](https://img.shields.io/badge/stack-Vite_+_React_+_R3F_+_Supabase-00D4FF?style=flat-square)](#stack)
[![Status](https://img.shields.io/badge/status-MVP_funcional-00C896?style=flat-square)](#)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?style=flat-square&logo=vercel)](https://job-verse-tau.vercel.app)

🌐 **Produção:** https://job-verse-tau.vercel.app

---

## O problema

Processos seletivos de tecnologia são frios, impessoais e assustadores. O candidato envia currículo num formulário, não sente a cultura da empresa, não tem ideia de quem são as pessoas por trás da vaga. Empresas de tech perdem talentos porque não conseguem transmitir sua identidade antes da entrevista.

## A solução

Um **ambiente 3D navegável** onde empresas parceiras (fictícias no MVP) têm **estandes virtuais**. Cada estande mostra missão, stack, vagas e deixa o candidato deixar CV — tudo de forma imersiva. Do outro lado, **recrutadores acessam um painel em tempo real** com CVs recebidos, heatmap de engajamento e (em breve) análise por IA.

Combina dois mundos: a presença física de uma feira de empregos com a escala e velocidade do digital.

---

## Demo

| Tela | Foto |
|---|---|
| **Landing** — partículas conectadas, glitch no logo | https://job-verse-tau.vercel.app |
| **Feira 3D** — 5 estandes em pentágono, FPS, Tron lines | https://job-verse-tau.vercel.app/feira |
| **Dashboard recrutador** — CVs realtime + Heatmap | https://job-verse-tau.vercel.app/recrutador/irede |
| **Rave mode** (Konami code) | ↑ ↑ ↓ ↓ ← → ← → B A na feira |

🎥 **Vídeo-pitch:** _(link YouTube não-listado — em breve)_

---

## Stack

| Camada | Tecnologia |
|---|---|
| Build | **Vite** 6 + **React** 18 + **TypeScript** 5 |
| 3D | **three.js** + **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing** |
| Styling | **Tailwind v4** (`@theme`) + **framer-motion** + **tsParticles** |
| Estado | **Zustand** (persistido em localStorage) |
| Backend | **Supabase** (Postgres + Realtime + Edge Functions) |
| Auth | Custom (Web Crypto API · PBKDF2 SHA-256) |
| Deploy | **Vercel** (frontend) + **Supabase Cloud** (backend) |

---

## Features destaque

### 🎮 Cena 3D imersiva
- FPS controls (WASD + mouse + Shift pra correr)
- 5 estandes em pentágono com identidade visual única (cor, nome em texto 3D, painel flutuante com missão e stack)
- Piso reflexivo (`MeshReflectorMaterial`), linhas neon estilo **Tron** ligando spawn aos estandes
- Postprocessing: Bloom + Vignette + ChromaticAberration sutil
- Sparkles colunares na cor de cada empresa
- DwellTracker: registra "visita" automaticamente após 2s no raio do estande

### ⚙️ Sistema de qualidade gráfica
3 presets (**Baixa / Média / Alta**) que ajustam reflexo do piso, sparkles, postprocessing e partículas 2D — escolha persistida no `localStorage`. Roda em laptop modesto na qualidade baixa.

### 🎵 Áudio sintetizado
Drone ambient cyberpunk gerado em runtime via **Web Audio API** (3 osciladores + LFO no lowpass + 1 SFX click + 1 SFX sucesso). Zero asset externo. Toggle persistido.

### 🎯 Easter egg
**Konami code** (↑ ↑ ↓ ↓ ← → ← → B A) ativa **rave mode** por 10s: bloom 2x, sparkles magenta 1.5x, screen strobe, arpejo C-E-G-C5.

### 📊 Painel B2B realtime
- Lista de CVs recebidos com **Supabase Realtime** (`postgres_changes` em `applications`)
- Heatmap **BarChart** (recharts) — Top 5 por dwell time
- Card "Análise IA — em breve" (slot reservado pra LLM no futuro)
- Pill pulsante "● AO VIVO" verde lima

### 🔐 Autenticação simples
GitHub username + senha (hash PBKDF2 client-side). Dois perfis: **dev** (entra na feira, candidata, vê suas candidaturas com tecla `M`) e **recrutador** (acessa direto o painel da sua empresa).

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+ e npm
- Conta gratuita no [Supabase](https://supabase.com)
- Conta gratuita no [Vercel](https://vercel.com) (opcional, pra deploy)

### Passos

```bash
# 1. Clone
git clone https://github.com/MaykeSN/JobVerse.git
cd JobVerse

# 2. Instala deps
npm install

# 3. Configura .env
cp .env.example .env
# Edite .env preenchendo VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
# (instruções detalhadas em docs/setup-supabase.md)

# 4. Aplica schema + seed no Supabase
# Veja: docs/setup-supabase.md

# 5. Roda
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) ou o deploy em [https://job-verse-tau.vercel.app](https://job-verse-tau.vercel.app).

**Sem `.env` configurado**, o app ainda funciona com mocks locais (graceful degradation): landing, cena 3D, modal de vagas, dashboard recrutador — tudo navegável. Só candidatura/realtime entre browsers diferentes não persiste.

---

## Estrutura do repositório

```
JobVerse/
├── public/                       Assets estáticos
├── src/
│   ├── routes/                   Rotas (Landing, Feira, Recrutador, RecrutadorIndex)
│   ├── feira/                    Componentes da cena 3D (Estande, PlayerControls, DwellTracker)
│   ├── recrutador/               Componentes do dashboard B2B (ListaCVs, Heatmap, etc)
│   ├── components/               UI compartilhada (modais, seletor de qualidade, etc)
│   ├── shared/                   Stores, hooks de DB, supabase client, audio, auth
│   └── styles/                   CSS global + Tailwind v4 @theme
├── supabase/
│   ├── schema.sql                Schema das 6 tabelas principais
│   ├── seed.sql                  5 empresas + 12 vagas (idempotente)
│   ├── users.sql                 Tabela de usuários (auth)
│   └── functions/ai-summary/     Edge Function stub (Deno)
├── docs/
│   ├── setup-supabase.md         Passo-a-passo de aplicação do banco
│   ├── declaracao-ia.md          Regra 12 do edital (transparência IA)
│   ├── roteiro-pitch.md          Roteiro do vídeo de 5min
│   └── slides-outline.md         Outline dos slides
├── PLANO.md                      Plano técnico completo
└── README.md                     Este arquivo
```

---

## Rotas

| Rota | Tela | Acesso |
|---|---|---|
| `/` | Landing — login/cadastro | Público |
| `/feira` | Cena 3D imersiva com 5 estandes | Dev logado |
| `/recrutador` | Grid de seleção de empresa | Público (modo demo) |
| `/recrutador/:slug` | Dashboard B2B realtime | Recrutador logado da empresa correspondente |

---

## Empresas no MVP

| Slug | Nome | Setor | Cor | Stack principal |
|---|---|---|---|---|
| `irede` | **iRede Tecnologia** | EdTech / Residências TIC | `#00C896` | Web3, Solidity, React |
| `nimbus` | Nimbus Cloud | Infra / DevOps | `#00D4FF` | Go, Rust, Kubernetes |
| `kindred` | Kindred Health | Healthtech | `#FF4B91` | Python, React |
| `pixelforge` | Pixelforge Studios | Gamedev | `#A855F7` | C#, Unity, Shaders |
| `greenledger` | GreenLedger | Fintech sustentável | `#84CC16` | TypeScript, Node, AWS |

A **iRede** ocupa o estande central do pentágono — homenagem ao programa que organiza o HackWeb.

---

## Aplicação prática

A solução é **diretamente plugável** em:

- **Eventos corporativos online** (RD Summit, Campus Party, Web Summit) — substituir landing pages estáticas por feiras 3D navegáveis
- **Páginas "carreiras" de empresas tech** — versão imersiva alternativa pro `careers.empresa.com`
- **Bootcamps e residências em tech** (caso da própria iRede) — conectar alunos com empresas parceiras de forma memorável
- **Feiras de profissões** em universidades (presencial híbrido) — acessível remotamente
- **Recrutamento internacional remoto** — sentir a cultura da empresa sem viajar

---

## Avaliação contra os critérios do edital

| Critério | Peso | Como o JobVerse atende |
|---|---|---|
| Clareza do problema | 15% | Problema relatável (recrutamento frio, perda de talento) com público bem definido |
| Qualidade da solução | 30% | Solução coerente: 3D + dashboard realtime + IA "em breve" mostram visão de produto completa |
| Qualidade técnica | 20% | TypeScript estrito (zero `any`), graceful degradation, realtime via `postgres_changes`, hash PBKDF2 nativo, code-splitting de rotas |
| Pitch | 20% | Roteiro estruturado (5min) — problema → solução → demo navegável → aplicação real |
| Aplicação real | 15% | Encaixe natural em eventos, empresas tech, bootcamps (lista acima) |

---

## Declaração de uso de IA

Em conformidade com a **regra 12 do edital HackWeb**, ferramentas de IA generativa foram utilizadas como apoio. Detalhes completos em [`docs/declaracao-ia.md`](./docs/declaracao-ia.md).

---

## Roadmap

- 🧠 **Análise automática de CV por LLM** (resumo, match score candidato × vaga, insights agregados pro recrutador)
- 🪪 **Selo NFT/POAP de visita** ao estande (Web3 honesto — encaixa no programa)
- 👥 **Multiplayer leve** — avatares dos outros candidatos visíveis na feira em tempo real (Socket.io ou Y.js)
- 🥽 **Compatibilidade WebXR** — entrar com Meta Quest no navegador embutido
- 📱 **PWA mobile** — fallback touch + giroscópio em vez de WASD
- 🔒 **RLS no Supabase** — cada recrutador só vê applications da própria empresa

---

## Equipe

Nicolas Cabral Carvalho
Mayke de Souza Nogueira
Yang Feitosa Andrade Barbosa
Samuel Macena da Silva

## Licença

MIT — código autoral. Assets de terceiros e ferramentas de IA declaradas em `docs/declaracao-ia.md`.

# JobVerse — Plano Técnico

**Hackathon:** HackWeb 2026 — Desafio 4 (ExpoVerse / Metaverso)
**Entrega:** 31/05/2026 23:59 BRT
**Repositório base:** template iRede (https://github.com/Web3irede?tab=repositories)

---

## 1. Tese do produto

Feira de empregos imersiva em 3D navegável. Candidato entra com nome, percorre estandes de empresas fictícias (incluindo a iRede, homenagem ao programa), consome conteúdo (missão, stack, vagas), deixa CV. Recrutador acessa painel realtime do próprio estande e vê quem visitou, dwell time e CVs entregues.

**Diferencial competitivo:** painel do recrutador em tempo real + camada visual cyberpunk/tech com partículas, glow e animações. A IA aparece como **"em breve"** — slot visual reservado no painel, sem implementação real.

---

## 2. Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                  Vercel (Vite build + SPA)                   │
│  / (Landing)  →  /feira (R3F Canvas)  →  /recrutador/:slug  │
└────────────────────────┬────────────────────────────────────┘
                         │ supabase-js
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                          Supabase                            │
│  Postgres  +  Realtime (websocket)  +  Storage (CVs PDF)    │
│  Edge Function: ai-summary (STUB — retorna "em_breve")      │
└─────────────────────────────────────────────────────────────┘
```

SPA React + Vite. Toda lógica server-side em Edge Functions Deno. Build estático servido pela Vercel.

---

## 3. Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Build | Vite | 5.x |
| UI | React + TypeScript | 18.x / 5.x |
| 3D | three.js + @react-three/fiber | 0.16x / 8.x |
| 3D helpers | @react-three/drei | 9.x (Sky, Sparkles, Text, useGLTF, PointerLockControls, KeyboardControls, Float, Environment) |
| Postprocessing | @react-three/postprocessing | 2.x (Bloom, Vignette, ChromaticAberration) |
| Styling | Tailwind CSS | 3.x |
| Animação UI | framer-motion | 11.x |
| Partículas 2D | @tsparticles/react + @tsparticles/slim | latest |
| Roteamento | react-router-dom | 6.x |
| State | zustand | 4.x |
| Gráficos | recharts | 2.x |
| Fonts | @fontsource/orbitron, @fontsource/inter | latest |
| Backend | @supabase/supabase-js | 2.x |
| Edge runtime | Deno (Supabase) | gerenciado |

**Por que TypeScript:** "Qualidade técnica" (20%) avalia organização do repo. TS deixa o código mais legível e profissional pra banca. Devs experientes — vale o tempo.

---

## 4. Estrutura de pastas

```
jobverse/
├── public/
│   ├── assets/
│   │   ├── models/             # GLTF dos estandes (Draco compressed)
│   │   ├── textures/           # Skybox, normal maps
│   │   ├── icons/              # Logos das 5 empresas
│   │   ├── audio/              # Ambiente lo-fi + sfx click
│   │   └── videos/             # Depoimentos curtos por empresa
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # Router setup
│   ├── routes/
│   │   ├── Landing.tsx         # Entrada — capta nome
│   │   ├── Feira.tsx           # Cena 3D
│   │   └── Recrutador.tsx      # Dashboard B2B
│   ├── feira/
│   │   ├── Cena.tsx            # <Canvas> R3F principal
│   │   ├── Estande.tsx         # Render de 1 estande
│   │   ├── PlayerControls.tsx  # PointerLock + WASD via KeyboardControls
│   │   ├── DwellTracker.tsx    # Hook que mede tempo dentro do trigger
│   │   ├── HUD.tsx             # Overlay 2D (nome, contadores)
│   │   ├── Particulas3D.tsx    # Sparkles ambiente + estande
│   │   ├── Postprocessamento.tsx  # Bloom + Vignette
│   │   ├── ModalVagas.tsx
│   │   ├── ModalCV.tsx
│   │   └── empresas.ts         # Dados estáticos das 5 empresas
│   ├── recrutador/
│   │   ├── Dashboard.tsx
│   │   ├── ListaCVs.tsx        # Subscribe realtime
│   │   ├── Heatmap.tsx         # Bar chart com recharts
│   │   └── IAEmBreve.tsx       # Card stub com blur + ícone
│   ├── shared/
│   │   ├── supabase.ts         # Client + types
│   │   ├── candidato.ts        # Zustand store (sessão local)
│   │   ├── tipos.ts            # Types globais
│   │   └── ParticulasBg.tsx    # tsParticles UI 2D
│   ├── components/             # UI puro (Button, Modal, Card, GlowBox)
│   └── styles/
│       └── globals.css         # Tailwind base + custom CSS vars
├── supabase/
│   ├── schema.sql
│   ├── seed.sql
│   └── functions/ai-summary/index.ts
├── docs/
│   ├── declaracao-ia.md
│   └── arquitetura.md
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── package.json
├── README.md
└── PLANO.md
```

---

## 5. Schema do banco

```sql
create table companies (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nome        text not null,
  missao      text not null,
  stack       text[] not null,
  logo_url    text,
  video_url   text,
  cor_tema    text default '#00D4FF',
  posicao     jsonb not null                -- {x,y,z} posição na cena
);

create table jobs (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references companies(id) on delete cascade,
  titulo       text not null,
  descricao    text not null,
  senioridade  text not null,
  requisitos   text[] not null
);

create table candidates (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text,
  skills      text[],
  sobre       text,
  github      text,
  created_at  timestamptz default now()
);

create table applications (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references candidates(id) on delete cascade,
  job_id        uuid not null references jobs(id) on delete cascade,
  created_at    timestamptz default now(),
  unique(candidate_id, job_id)
);

create table visits (
  id             uuid primary key default gen_random_uuid(),
  candidate_id   uuid not null references candidates(id) on delete cascade,
  company_id     uuid not null references companies(id) on delete cascade,
  dwell_seconds  int not null default 0,
  created_at     timestamptz default now()
);

create table ai_summaries (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid references candidates(id) on delete cascade,
  company_id    uuid references companies(id) on delete cascade,
  summary       text,
  match_score   numeric(4,2),
  created_at    timestamptz default now()
);

alter publication supabase_realtime add table applications;
alter publication supabase_realtime add table visits;
```

**RLS:** desativado no MVP do hackathon (anon key faz tudo). TODO de produção no README.

---

## 6. Design visual

### 6.1 Paleta (cyberpunk/tech)

```css
--bg-deep:     #05060F   /* navy/black do background */
--bg-panel:    #0B0D1A   /* glass cards */
--neon-cyan:   #00D4FF   /* primário */
--neon-magenta:#FF4B91   /* secundário/destaque */
--neon-purple: #A855F7
--neon-lime:   #84CC16
--neon-irede:  #00C896   /* verde da iRede */
--text-bright: #F8FAFC
--text-dim:    #94A3B8
```

### 6.2 Tipografia

- **Headings:** Orbitron (Google Fonts via @fontsource) — vibe sci-fi
- **Body:** Inter — legível
- **Mono (HUD):** JetBrains Mono — opcional, pra contadores

### 6.3 Sistema de partículas

| Onde | Lib | Efeito |
|---|---|---|
| Background landing | tsParticles | Pontos conectados (vibe rede neural) |
| Ambiente da cena 3D | drei `<Sparkles />` | Brilho disperso no ar |
| Volta de cada estande | drei `<Sparkles />` | Coluna de luz na cor do estande |
| Background recrutador | tsParticles | Linhas leves, baixa densidade |
| Click em vaga | framer-motion + CSS | Burst radial sparkles |

### 6.4 Animações

- **Modal/overlay entrada:** framer-motion `scale + fade` 250ms
- **Estande hover:** câmera aproxima suave (`drei <CameraControls />.smoothTime`)
- **Painel flutuante:** `drei <Float speed={1.5} />`
- **HUD contadores:** number tween com framer-motion
- **Bloom pulsando** nos logos das empresas (intensidade animada via useFrame)

### 6.5 Postprocessing

```tsx
<EffectComposer>
  <Bloom intensity={0.8} luminanceThreshold={0.4} />
  <Vignette eskil={false} offset={0.15} darkness={0.5} />
  <ChromaticAberration offset={[0.0008, 0.0008]} />  {/* sutil */}
</EffectComposer>
```

### 6.6 Layout do mundo 3D

Planta da feira: 5 estandes dispostos em **pentágono** ao redor de uma praça central. Spawn no centro, jogador escolhe pra qual direção ir. Distância ~12m do spawn a cada estande. Skybox dark com nebulosa (free HDRI no Poly Haven).

Chão: piso reflexivo (`MeshReflectorMaterial` do drei). Linhas neon no piso ligando o spawn aos estandes (vibe Tron). 

---

## 7. Componentes principais

### 7.1 `<Cena />`

```tsx
<Canvas shadows camera={{ position: [0, 1.7, 0], fov: 70 }}>
  <color attach="background" args={['#05060F']} />
  <fog attach="fog" args={['#05060F', 8, 40]} />
  <Environment preset="night" />
  <Sparkles count={200} scale={20} size={2} color="#00D4FF" />
  <PisoNeon />
  {empresas.map(e => <Estande key={e.slug} empresa={e} />)}
  <PlayerControls />
  <Postprocessamento />
</Canvas>
```

### 7.2 `<Estande empresa={...} />`

- Base 4x4m com glow na cor da empresa
- Backdrop com logo (plane + texture) com bloom
- `<Float>` envolvendo painel de texto 3D com missão (`drei <Text />`)
- Totem clicável (mesh com `onClick`) → abre `ModalVagas`
- `<Sparkles>` na cor da empresa em volta
- `<DwellTracker companySlug={...} />` que mede tempo

### 7.3 `<PlayerControls />`

- `<PointerLockControls />` do drei (clica pra travar mouse)
- `<KeyboardControls map={[{ name: 'forward', keys: ['w', 'ArrowUp'] }, ...]} />`
- Hook `useFrame` aplica movimento no `camera.position` baseado no estado das teclas

### 7.4 `<DwellTracker />`

Hook custom:
```ts
function useDwellTracker(companySlug: string, bounds: Box3) {
  const entered = useRef<number | null>(null);
  useFrame(({ camera, clock }) => {
    const inside = bounds.containsPoint(camera.position);
    if (inside && !entered.current) entered.current = clock.elapsedTime;
    if (!inside && entered.current) {
      const secs = Math.round(clock.elapsedTime - entered.current);
      entered.current = null;
      if (secs >= 2) registrarVisita(companySlug, secs);
    }
  });
}
```

### 7.5 `<HUD />`

Overlay 2D fixo (fora do Canvas), Tailwind + framer-motion:
- Top-left: nome do candidato + avatar gerado
- Top-right: contadores (empresas visitadas / vagas pegas)
- Bottom-center: dica de controle (W A S D, click)
- Bottom-right: botão de menu

---

## 8. Páginas e fluxos

### 8.1 `/` — Landing (`Landing.tsx`)
- Background tsParticles (rede neural animada)
- Logo JobVerse grande com efeito glitch ocasional
- Pitch curto (1 frase)
- Form mínimo: nome + email opcional
- Botão "Entrar na feira" com hover glow → cria UUID em localStorage, INSERT em `candidates`, navega pra `/feira`

### 8.2 `/feira` — Cena 3D (`Feira.tsx`)
- Canvas R3F fullscreen
- HUD overlay 2D
- Modais (CV, vagas) acionados por estado Zustand
- Loading screen com progress bar enquanto GLTFs carregam (`<Suspense>` + `useProgress`)

### 8.3 `/recrutador/:slug` — Painel
- Header com logo + nome + cor da empresa
- Background tsParticles sutil
- Grid de 3 cards:
  - **CVs recebidos** (lista realtime, ordenada por mais recente)
  - **Visitas** (recharts BarChart: dwell médio por hora ou ranking de candidatos)
  - **Análise IA — em breve** (gradient + blur + sparkles icon)
- Animação de entrada em stagger via framer-motion

### 8.4 Modal CV (dentro de `/feira`)
- framer-motion overlay (backdrop blur + scale-in)
- Form: skills (chips editáveis), sobre (textarea), github (link), PDF opcional
- Submit → INSERT `candidates` (upsert) + INSERT `applications`
- Toast de confirmação ("CV entregue para [empresa]")

---

## 9. Camada IA — "em breve"

### 9.1 Visual
- Card no dashboard: gradient `from-purple-500/20 to-cyan-500/20`, blur, ícone Sparkles do lucide-react
- Texto: "Análise IA — chegando em breve"
- Botão "Gerar resumo do candidato" desabilitado, com tooltip framer-motion
- Slot `match_score` em cada card de candidato mostra `—`

### 9.2 Backend
Edge Function `ai-summary` existe e responde com stub:

```ts
// supabase/functions/ai-summary/index.ts
Deno.serve(() => new Response(
  JSON.stringify({
    status: 'em_breve',
    message: 'Análise por IA estará disponível em versão futura'
  }),
  { headers: { 'Content-Type': 'application/json' } }
));
```

### 9.3 Roadmap no README
- Resumo automático de CV via LLM
- Match score candidato × vaga
- Insights agregados pro recrutador
- Análise de sentimento dos depoimentos

Ponto positivo em "Potencial de aplicação real" (15%) sem custar implementação.

---

## 10. Conteúdo — 5 empresas fictícias

| Slug | Nome | Setor | Stack | Cor |
|---|---|---|---|---|
| `irede` | **iRede Tecnologia** | EdTech / Residências TIC | Diversas + Web3 | `#00C896` |
| `nimbus` | Nimbus Cloud | Infra / DevOps | Go, Rust, Kubernetes | `#00D4FF` |
| `kindred` | Kindred Health | Healthtech | Python, React | `#FF4B91` |
| `pixelforge` | Pixelforge Studios | Gamedev | C#, Unity, WebGL | `#A855F7` |
| `greenledger` | GreenLedger | Fintech sustentável | TypeScript, Node, AWS | `#84CC16` |

Cada empresa precisa:
- Missão (1 frase forte)
- 2–3 vagas com requisitos
- Logo (gerar com IA, declarar no README)
- Vídeo depoimento 20–30s (gravar ou TTS)
- Posição na cena (vértice do pentágono)

**iRede como estande central da praça** (posição [0, 0, -12]) — homenagem visível no pitch.

---

## 11. Deploy

- **Frontend:** Vercel conectado ao repo. Auto-deploy a cada push na `main`. `vite build` → `dist/`.
- **Backend:** Supabase cloud (free tier). Schema via SQL Editor.
- **Edge Functions:** `supabase functions deploy ai-summary` (uma vez).
- **Variáveis:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (prefixo `VITE_` é obrigatório pro Vite expor no client).

---

## 12. Riscos técnicos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Curva R3F sem experiência prévia | Alta | Reservar 3–4h no início pra tutorial oficial (Bruno Simon / Wawa Sensei no YouTube têm cursos curtos R3F) |
| Performance com bloom + 5 estandes + sparkles | Média | Caps de partículas (~200), LOD nos modelos, `Bloom` com `luminanceThreshold` alto |
| Bundle Vite muito grande (drei + postprocessing) | Média | Code-splitting por rota (lazy load `/feira` e `/recrutador`) |
| GLTF de qualidade demoram pra achar | Média | Começar com primitivos R3F coloridos, swappar depois |
| PointerLock travar em algum browser | Baixa | Botão "clique pra entrar" como gate explícito |
| Realtime do Supabase desconectar | Baixa | Fallback polling a cada 5s + indicador de conexão |

---

## 13. Checklist de implementação

> Marcar `[x]` conforme concluído. Atualizar este arquivo a cada milestone.

### Fase 0 — Setup
- [ ] Clonar template iRede do GitHub *(manual — depende do usuário, pode mesclar com a estrutura atual depois)*
- [x] Scaffold Vite + React + TS (criado manualmente, equivalente ao `npm create vite`)
- [x] Instalar deps: three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- [x] Instalar: tailwindcss, framer-motion, @tsparticles/react, zustand, react-router-dom, recharts
- [x] Instalar: @supabase/supabase-js, @fontsource/orbitron, @fontsource/inter, lucide-react
- [x] Configurar Tailwind (paleta cyberpunk como cores customizadas via `@theme`)
- [ ] Criar conta Supabase + projeto novo *(manual — usuário precisa criar conta)*
- [ ] Configurar Vercel + conectar repo (auto-deploy on push) *(manual)*
- [x] `.env.example` com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
- [x] "Boneco de palha" R3F: cena com piso reflexivo + 5 totens em pentágono + Sparkles + Bloom — pronto pra rodar local

### Fase 1 — Schema e dados
- [x] Escrever `supabase/schema.sql` com 6 tabelas + FKs + índices + pgcrypto
- [x] Comando para habilitar realtime em `applications` e `visits` no schema
- [x] Definir as 5 empresas fictícias com missões originais
- [x] Escrever `supabase/seed.sql` (idempotente) com 5 empresas + 12 vagas
- [x] Escrever Edge Function stub `supabase/functions/ai-summary/index.ts` com CORS
- [x] Escrever `docs/setup-supabase.md` com passo-a-passo
- [x] Escrever `src/shared/tipos-db.ts` com Database type
- [ ] Aplicar `schema.sql` no Supabase *(manual — depende de criar projeto)*
- [ ] Aplicar `seed.sql` no Supabase *(manual)*
- [ ] Deploy Edge Function via CLI *(manual)*
- [ ] Validar SELECT pelo dashboard Supabase *(manual)*
- [ ] Gerar logos com IA (declarar em `docs/declaracao-ia.md`) *(opcional, fase 6)*

### Fase 2 — Esqueleto React
- [ ] Setup react-router com 3 rotas (/, /feira, /recrutador/:slug)
- [ ] `shared/supabase.ts` inicializa cliente
- [ ] Zustand store `candidato.ts` (id, nome, persiste em localStorage)
- [ ] Landing com background tsParticles + form + glow no botão
- [ ] Submit do form: INSERT em candidates, navega pra /feira

### Fase 3 — Cena 3D base
- [x] `<Canvas>` com fog, Environment night, color background
- [x] `<Piso>` com `MeshReflectorMaterial` (reflexo do mundo)
- [x] `<LinhasNeon>` ligando spawn aos 5 estandes (vibe Tron)
- [x] `<PracaCentral>` com 2 anéis no spawn
- [x] `PlayerControls` (PointerLockControls + WASD via KeyboardControls + Shift run)
- [x] Easing suave da câmera pro nível humano (welcome shot estabelecedor)
- [x] Gate "Clique pra entrar" + crosshair quando lockado
- [x] 5 estandes posicionados em pentágono renderizando via `<Estande>`
- [x] Sparkles ambiente + Sparkles por estande na cor da empresa
- [x] EffectComposer com Bloom + Vignette

### Fase 4 — Estandes funcionais
- [x] `<Estande />` com base reflexiva + pilares portal + backdrop + painel de texto 3D (nome, missão, stack)
- [x] `<Float>` no painel flutuante
- [x] HUD com nome + contadores reativos (zustand) — base já existe
- [ ] Totem/portal clicável (onClick em mesh do estande)
- [ ] DwellTracker registrando visitas no Supabase
- [ ] Modal de vagas com framer-motion entrance
- [ ] Modal de CV com form completo (skills, sobre, github)
- [ ] INSERT em `applications` + toast de confirmação
- [ ] Atualizar contadores ao candidatar

### Fase 5 — Painel recrutador
- [ ] Rota /recrutador/:slug lendo param
- [ ] Header com cor/logo dinâmicos
- [ ] Card de CVs com subscribe realtime
- [ ] Card de visitas com recharts BarChart
- [ ] Card "Análise IA — em breve" estilizado (blur + sparkles)
- [ ] Edge Function `ai-summary` stub deployada
- [ ] Background tsParticles sutil
- [ ] Animação stagger de entrada (framer-motion)

### Fase 6 — Polimento visual
- [ ] Substituir primitivos por GLTF (Quaternius / Kenney / Poly Pizza)
- [ ] Áudio ambiente lo-fi + sfx click
- [ ] Vídeos curtos das empresas em planes na cena
- [ ] Glitch effect ocasional no logo (postprocessing)
- [ ] Easter egg (1–2)
- [ ] Loading screen com progress bar custom
- [ ] Teste cross-browser (Chrome, Firefox, Edge)
- [ ] FPS check (alvo: 60fps em laptop médio)

### Fase 7 — Entrega
- [ ] README completo (pitch, stack, como rodar, screenshots, declaração IA, créditos, roadmap)
- [ ] `docs/declaracao-ia.md` listando Claude + outras ferramentas IA
- [ ] Slides PDF (8–10 slides, mesma paleta do produto)
- [ ] Vídeo-pitch 5min no YouTube (não listado)
- [ ] Link de produção testado + funcionando
- [ ] Submissão no formulário oficial iRede

---

## 14. Marcos externos

- **27/05/2026** — Mentoria final iRede. Levar versão navegável das fases 0–3.
- **31/05/2026 23:59 BRT** — Prazo final. Sem prorrogação.

---

## 15. Declaração de uso de IA (Regra 12)

Em `docs/declaracao-ia.md`:
- Ferramenta(s) (Claude, ChatGPT, geradores de imagem para logos)
- Em quais partes do projeto
- O que foi gerado vs autoral
- Confirmação de que o time compreende e pode explicar todo código

Sem essa declaração, **decréscimo considerável na nota final** (texto literal do edital).

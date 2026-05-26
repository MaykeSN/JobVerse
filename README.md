# JobVerse

Feira de empregos imersiva pra devs — projeto do **HackWeb 2026** (Desafio 4 / ExpoVerse).

> **Status:** em desenvolvimento. Veja [PLANO.md](./PLANO.md) pro plano técnico completo.

## Proposta

Ambiente 3D navegável onde empresas têm "estandes virtuais". Candidato entra, percorre a feira, deixa CV. Recrutador acessa painel realtime com CVs recebidos, visitas e (em breve) análise por IA.

## Stack

- **Build:** Vite + React 18 + TypeScript
- **3D:** three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- **Styling:** Tailwind v4 + framer-motion + tsParticles
- **Backend:** Supabase (Postgres + Realtime + Edge Functions)
- **Deploy:** Vercel

## Como rodar

```bash
npm install
cp .env.example .env   # preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

Sem `.env` configurado, a landing e a feira 3D ainda funcionam — só candidatura/painel realtime ficam inertes.

## Rotas

| Rota | Tela |
|---|---|
| `/` | Landing — capta nome do candidato |
| `/feira` | Cena 3D com estandes |
| `/recrutador/:slug` | Dashboard B2B (ex: `/recrutador/irede`) |

## Empresas no MVP

iRede Tecnologia · Nimbus Cloud · Kindred Health · Pixelforge Studios · GreenLedger.

## Declaração de uso de IA

Em conformidade com a regra 12 do edital HackWeb, ferramentas de IA generativa foram utilizadas como apoio. Detalhes em [`docs/declaracao-ia.md`](./docs/declaracao-ia.md).

## Roadmap

- Análise automática de CV por LLM
- Match score candidato × vaga
- Insights agregados pro recrutador
- Multiplayer (avatares de outros visitantes ao vivo)
- Compatibilidade WebXR (Meta Quest)

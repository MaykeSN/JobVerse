# Execução local - JobVerse

## Pré-requisitos

- Node.js 18+.
- npm.
- Conta Supabase para persistência/realtime completos.
- Conta Vercel apenas se for publicar novo deploy.

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Preencha:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sem `.env`, o app ainda abre com dados mockados, permitindo testar landing, feira 3D, salas, quadros e dashboard demo. Persistência real, realtime entre abas e multiplayer via Broadcast dependem do Supabase.

## Banco de dados

Execute no SQL Editor do Supabase:

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/users.sql`

O schema atual inclui:

- `candidates`
- `applications`
- `visits`
- publicação realtime para `applications` e `visits`

## Rodar em desenvolvimento

```bash
npm run dev
```

Acesse:

- Local: http://localhost:5173
- Deploy: https://job-verse-tau.vercel.app

## Rotas principais

| Rota | Uso |
|---|---|
| `/` | Landing e login/cadastro. |
| `/feira` | Ambiente 3D com lobby, estandes, salas e multiplayer. |
| `/recrutador` | Seleção de empresa para dashboard. |
| `/recrutador/:slug` | Dashboard B2B da empresa. |

## Validação

```bash
npm run typecheck
npm run build
npm run preview
```

## Teste rápido recomendado

1. Abrir a landing.
2. Entrar como candidato/dev.
3. Acessar `/feira`.
4. Navegar até um estande.
5. Entrar em uma sala interna.
6. Interagir com um quadro de vaga.
7. Enviar CV simplificado.
8. Abrir `/recrutador/irede`.
9. Verificar lista de CVs, heatmap e status ao vivo.
10. Abrir duas abas na feira para testar avatares multiplayer.

## Controles

| Controle | Função |
|---|---|
| WASD | Movimento. |
| Mouse | Olhar ao redor. |
| Shift | Correr. |
| Clique | Interagir com estande, quadro ou totem. |
| M | Minhas candidaturas. |
| Konami code | Rave mode. |

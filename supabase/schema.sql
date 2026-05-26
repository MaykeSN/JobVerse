-- JobVerse — schema do banco (Postgres / Supabase)
-- HackWeb 2026 — Desafio 4 (ExpoVerse)
--
-- TODO produção: habilitar RLS em todas as tabelas e definir policies
-- por papel (candidato vê só o próprio CV, recrutador vê apenas da própria
-- empresa). No MVP do hackathon a anon key acessa tudo direto.

-- Extensão para gen_random_uuid() (Postgres 13+; já habilitada por padrão no Supabase)
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- companies — empresas fictícias da feira, cada uma um estande no pentágono
-- ----------------------------------------------------------------------------
create table companies (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nome        text not null,
  missao      text not null,
  stack       text[] not null,
  logo_url    text,
  video_url   text,
  cor_tema    text default '#00D4FF',
  posicao     jsonb not null              -- {x, y, z} posição na cena 3D
);

-- ----------------------------------------------------------------------------
-- jobs — vagas publicadas por cada empresa no seu estande
-- ----------------------------------------------------------------------------
create table jobs (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references companies(id) on delete cascade,
  titulo       text not null,
  descricao    text not null,
  senioridade  text not null,
  requisitos   text[] not null
);

-- ----------------------------------------------------------------------------
-- candidates — visitantes da feira que preencheram nome (e opcionalmente CV)
-- ----------------------------------------------------------------------------
create table candidates (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text,
  skills      text[],
  sobre       text,
  github      text,
  created_at  timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- applications — candidatura de um candidato a uma vaga (unique candidate+job)
-- ----------------------------------------------------------------------------
create table applications (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references candidates(id) on delete cascade,
  job_id        uuid not null references jobs(id) on delete cascade,
  created_at    timestamptz default now(),
  unique (candidate_id, job_id)
);

-- ----------------------------------------------------------------------------
-- visits — dwell time do candidato dentro do trigger de um estande
-- ----------------------------------------------------------------------------
create table visits (
  id             uuid primary key default gen_random_uuid(),
  candidate_id   uuid not null references candidates(id) on delete cascade,
  company_id     uuid not null references companies(id) on delete cascade,
  dwell_seconds  int not null default 0,
  created_at     timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- ai_summaries — slot reservado pra análise IA do candidato (feature "em breve")
-- ----------------------------------------------------------------------------
create table ai_summaries (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid references candidates(id) on delete cascade,
  company_id    uuid references companies(id) on delete cascade,
  summary       text,
  match_score   numeric(4,2),
  created_at    timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- Índices úteis para queries do painel do recrutador e da feira
-- ----------------------------------------------------------------------------
create index idx_jobs_company_id          on jobs (company_id);
create index idx_applications_candidate_id on applications (candidate_id);
create index idx_applications_job_id      on applications (job_id);
create index idx_applications_created_at  on applications (created_at desc);
create index idx_visits_company_id        on visits (company_id);
create index idx_visits_candidate_id      on visits (candidate_id);
create index idx_visits_created_at        on visits (created_at desc);
create index idx_ai_summaries_candidate   on ai_summaries (candidate_id);
create index idx_ai_summaries_company     on ai_summaries (company_id);

-- ----------------------------------------------------------------------------
-- Realtime — habilita push websocket para o painel do recrutador
-- ----------------------------------------------------------------------------
alter publication supabase_realtime add table applications;
alter publication supabase_realtime add table visits;

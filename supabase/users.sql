-- JobVerse — autenticação simples (HackWeb 2026 MVP)
--
-- Rode este script DEPOIS de schema.sql (e idealmente DEPOIS de seed.sql, já que
-- a FK `empresa_slug` aponta pra companies(slug)).
--
-- Por que não Supabase Auth?
-- A iRede pediu uma demo "tudo na cara" no hackathon. Auth do Supabase é ótimo
-- pra produção (JWT, RLS), mas adiciona fluxo de confirmação por email, telas
-- de signup separadas e impede testes rápidos offline. No MVP optamos por hash
-- PBKDF2 client-side (Web Crypto nativo, zero dep) + tabela `users` própria.
--
-- TODO produção: migrar pra Supabase Auth + RLS. Hoje a anon key acessa tudo;
-- em produção:
--   • RLS em users: cada usuário só vê o próprio registro
--   • RLS em applications/visits: dev só vê o que é dele (via user_id)
--   • RLS em ai_summaries/jobs: recrutador só vê da empresa dele (via empresa_slug)
--   • Migrar senha_hash/salt pro auth.users gerenciado pelo Supabase

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- users — contas do JobVerse (dev ou recrutador)
-- ----------------------------------------------------------------------------
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  github        text unique not null,
  senha_hash    text not null,
  salt          text not null,
  tipo          text not null check (tipo in ('dev', 'recrutador')),
  -- Só preenche pra recrutador. Dev fica null.
  empresa_slug  text references companies(slug) on delete set null,
  created_at    timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- Liga candidate → user (dev) pra rastrear candidaturas por usuário logado.
-- Continua nullable: visitantes sem login ainda podem aplicar (modo demo).
-- ----------------------------------------------------------------------------
alter table candidates
  add column if not exists user_id uuid references users(id) on delete set null;

-- ----------------------------------------------------------------------------
-- Índices úteis pra login e queries de "minhas candidaturas"
-- ----------------------------------------------------------------------------
create index if not exists idx_users_github     on users (github);
create index if not exists idx_users_empresa    on users (empresa_slug);
create index if not exists idx_candidates_user  on candidates (user_id);

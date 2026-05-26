-- JobVerse · Schema MVP
-- Cole no SQL Editor do Supabase e clique em "Run"
-- Usa slugs de texto (ex: 'irede', 'irede-mentor-web3') para evitar seed de companies/jobs

-- Candidatos
create table if not exists candidates (
  id         uuid primary key,
  nome       text not null,
  email      text,
  skills     text[] default '{}',
  sobre      text  default '',
  github     text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidaturas (uma por candidato + vaga)
create table if not exists applications (
  id           uuid default gen_random_uuid() primary key,
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id       text not null,        -- ex: 'irede-mentor-web3'
  company_slug text not null,        -- ex: 'irede'
  match_score  integer default 0,
  insights     text[] default '{}',
  created_at   timestamptz default now(),
  unique(candidate_id, job_id)
);

-- Visitas ao estande com dwell time
create table if not exists visits (
  id            uuid default gen_random_uuid() primary key,
  candidate_id  uuid not null references candidates(id) on delete cascade,
  company_slug  text not null,
  dwell_seconds integer default 0,
  created_at    timestamptz default now()
);

-- Desabilita RLS (MVP -- habilite em producao real com policies por empresa)
alter table candidates   disable row level security;
alter table applications disable row level security;
alter table visits       disable row level security;

-- Habilita Realtime para o dashboard do recrutador (ignora se já estiver ativo)
do $$
begin
  begin
    alter publication supabase_realtime add table applications;
  exception when others then null;
  end;
  begin
    alter publication supabase_realtime add table visits;
  exception when others then null;
  end;
end $$;

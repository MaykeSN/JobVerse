-- JobVerse — seed inicial (5 empresas + 12 vagas)
-- Roda DEPOIS de schema.sql. Idempotente via ON CONFLICT no slug.
--
-- Posicionamento em pentágono raio 12 ao redor do spawn central:
--   angle_i = (i/5) * 2π - π/2     (i = 0..4, começando no "norte" e girando)
--   x = cos(angle) * 12   z = sin(angle) * 12   y = 0
--
-- iRede ocupa o vértice norte (frente do spawn) como estande-estrela.

-- ----------------------------------------------------------------------------
-- companies
-- ----------------------------------------------------------------------------
insert into companies (slug, nome, missao, stack, cor_tema, posicao) values
  (
    'irede',
    'iRede Tecnologia',
    'Formar a próxima geração de devs brasileiros por meio de residências em tecnologia e Web3.',
    array['Solidity', 'Ethers.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    '#00C896',
    '{"x": 0, "y": 0, "z": -12}'::jsonb
  ),
  (
    'nimbus',
    'Nimbus Cloud',
    'Levar infraestrutura cloud sem fricção do laptop do dev até clusters multirregionais.',
    array['Go', 'Rust', 'Kubernetes', 'Terraform', 'eBPF'],
    '#00D4FF',
    '{"x": 11.41, "y": 0, "z": -3.71}'::jsonb
  ),
  (
    'kindred',
    'Kindred Health',
    'Tornar saúde de qualidade acessível usando dados e software bem feito.',
    array['Python', 'FastAPI', 'React', 'PostgreSQL', 'HL7/FHIR'],
    '#FF4B91',
    '{"x": 7.05, "y": 0, "z": 9.71}'::jsonb
  ),
  (
    'pixelforge',
    'Pixelforge Studios',
    'Construir mundos digitais que vivem na memória de quem joga.',
    array['C#', 'Unity', 'WebGL', 'Shaders HLSL', 'Blender'],
    '#A855F7',
    '{"x": -7.05, "y": 0, "z": 9.71}'::jsonb
  ),
  (
    'greenledger',
    'GreenLedger',
    'Finanças transparentes para um planeta que ainda dá pra salvar.',
    array['TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'GraphQL'],
    '#84CC16',
    '{"x": -11.41, "y": 0, "z": -3.71}'::jsonb
  )
on conflict (slug) do update set
  nome     = excluded.nome,
  missao   = excluded.missao,
  stack    = excluded.stack,
  cor_tema = excluded.cor_tema,
  posicao  = excluded.posicao;

-- ----------------------------------------------------------------------------
-- jobs — 12 vagas distribuídas pelas 5 empresas
-- Usamos sub-selects por slug pra não depender de UUIDs hardcoded.
-- ----------------------------------------------------------------------------

-- iRede (3 vagas — programa de residência em tech/Web3)
insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Mentor de Residência Web3', 'Acompanhar turmas de residentes ao longo de seis meses, revisar entregas em Solidity e React, e ajudar cada dev a sair com um projeto on-chain no portfólio. Vaga remota com encontros semanais ao vivo.', 'sênior',
  array['Experiência com contratos em Solidity', 'Domínio de React e TypeScript', 'Histórico de mentoria, pair programming ou liderança técnica', 'Saber explicar o porquê, não só o como']
from companies where slug = 'irede';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Coordenador(a) de Capacitação Tech', 'Desenhar a trilha pedagógica das residências da iRede em parceria com mentores e empresas parceiras. Definir desafios práticos, critérios de avaliação e métricas de progresso dos residentes.', 'pleno',
  array['Experiência com formação de devs (bootcamp, faculdade, residência ou similar)', 'Visão de produto educacional', 'Confortável com SQL e dashboards', 'Comunicação clara em português escrito']
from companies where slug = 'irede';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Tutor(a) Frontend', 'Apoiar residentes em dúvidas de React, TypeScript e CSS moderno via plantão diário no Discord. Revisar PRs, dar feedback técnico e ajudar a depurar bugs reais. Ideal pra dev que adora ensinar.', 'júnior',
  array['React em projetos reais (mínimo 1 ano)', 'TypeScript e Tailwind', 'Paciência didática', 'Disponibilidade de 20h semanais']
from companies where slug = 'irede';

-- Nimbus Cloud (2 vagas)
insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Engenheiro(a) de Plataforma', 'Construir o control plane multi-tenant que orquestra clusters Kubernetes dos nossos clientes. Time pequeno, código em Go, deploy em produção semana sim, semana sim.', 'pleno',
  array['Go em produção', 'Kubernetes além do kubectl apply', 'Confortável com observabilidade (OpenTelemetry, Prometheus)', 'Já depurou um pod em CrashLoopBackOff de madrugada']
from companies where slug = 'nimbus';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'SRE Sênior', 'Cuidar do SLO de 99.95% da nossa malha de edge nodes. Automatizar tudo que doer duas vezes, escrever postmortems sem culpado e melhorar a vida de quem está de plantão.', 'sênior',
  array['Experiência prévia como SRE ou DevOps sênior', 'Terraform e IaC em escala', 'Linux a fundo (cgroups, namespaces, eBPF é bônus)', 'Inglês para colaborar com times distribuídos']
from companies where slug = 'nimbus';

-- Kindred Health (2 vagas)
insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Dev Backend Python', 'Trabalhar nas APIs que conectam o prontuário eletrônico a clínicas no interior do Brasil. Cada endpoint que você entrega chega em consultório real.', 'pleno',
  array['Python moderno (FastAPI, pydantic, async)', 'PostgreSQL bem entendido (índices, EXPLAIN)', 'Noção de LGPD e dados sensíveis', 'Disposição pra ler especificações HL7/FHIR']
from companies where slug = 'kindred';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Dev Frontend React', 'Construir a interface que médicos e enfermeiros usam todo dia. Acessibilidade não é checklist, é requisito de produto.', 'júnior',
  array['React e TypeScript', 'CSS moderno (flex, grid, custom properties)', 'Empatia com usuários não-técnicos', 'Curiosidade em UX de aplicações críticas']
from companies where slug = 'kindred';

-- Pixelforge Studios (2 vagas)
insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Programador(a) de Gameplay Unity', 'Implementar mecânicas centrais do nosso próximo título indie. Vai sentar do lado de game designers e ter palavra sobre o que faz cada sistema ser divertido.', 'pleno',
  array['Unity e C# em projetos finalizados (jam ou comercial)', 'Entender game loop, FSM e ECS', 'Portfólio com builds jogáveis', 'Paixão por iteração rápida']
from companies where slug = 'pixelforge';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Tech Artist (Shaders)', 'Fazer a ponte entre arte e engenharia. Escrever shaders, otimizar render pipeline e garantir que o jogo rode bem do Steam Deck ao desktop high-end.', 'sênior',
  array['HLSL ou GLSL em produção', 'URP/HDRP da Unity', 'Profiling de GPU (RenderDoc, Frame Debugger)', 'Olho artístico além do técnico']
from companies where slug = 'pixelforge';

-- GreenLedger (3 vagas)
insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Dev Fullstack TypeScript', 'Trabalhar do banco até a UI no painel que rastreia créditos de carbono de produtores rurais. Stack moderna, deploy contínuo, code review humano.', 'pleno',
  array['TypeScript em front e back', 'Node.js (Fastify ou Nest)', 'PostgreSQL e queries não-triviais', 'GraphQL é diferencial']
from companies where slug = 'greenledger';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Engenheiro(a) de Dados', 'Construir os pipelines que cruzam dados de satélite, IoT em campo e blockchain pra emitir cada crédito verde. Trabalho com volume de verdade e janelas de tempo apertadas.', 'sênior',
  array['Python e SQL avançado', 'Spark, dbt ou Airflow em escala', 'Modelagem dimensional (estrela, floco de neve)', 'Conforto com dados georreferenciados']
from companies where slug = 'greenledger';

insert into jobs (company_id, titulo, descricao, senioridade, requisitos)
select id, 'Estágio em Engenharia', 'Vaga de estágio para quem tá começando e quer aprender olhando código real. Trabalha junto com devs plenos e seniores, sem ser tratado como faz-tudo.', 'júnior',
  array['Cursando ciência da computação, engenharia de software ou correlato', 'Já fez algum projeto pessoal em qualquer linguagem', 'Quer aprender TypeScript e cloud', 'Boa comunicação escrita']
from companies where slug = 'greenledger';

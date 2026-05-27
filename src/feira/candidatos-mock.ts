import type { CandidatoMock } from '../shared/tipos';

/**
 * Banco fictício de candidatos por empresa.
 * Cada item já vem com a vaga aplicada e a duração da visita,
 * pra demonstrar o painel do recrutador sem precisar de Supabase.
 *
 * Skills são alinhadas com a stack de cada empresa pra parecer realista
 * num pitch — recrutador olha e reconhece. Sobres curtos, sem clichê.
 */
export const candidatosMock: CandidatoMock[] = [
  // ----------------------------------------------------------------
  // iRede — mentoria, residência, web3
  // ----------------------------------------------------------------
  {
    id: 'irede-ana-souza',
    nome: 'Ana Souza',
    skills: ['Solidity', 'React', 'TypeScript', 'Hardhat'],
    sobre:
      'Trabalho com contratos inteligentes desde 2022. Já mentorei 3 turmas de bootcamp de Web3 e curto explicar conceito de gas.',
    github: 'https://github.com/anasouza',
    jobId: 'irede-mentor-web3',
    companySlug: 'irede',
    dwellSeconds: 142,
    criadoHaMinutos: 4
  },
  {
    id: 'irede-bruno-lima',
    nome: 'Bruno Lima',
    skills: ['React', 'TypeScript', 'Tailwind', 'Vitest'],
    sobre:
      'Frontend há 4 anos, dei plantão de monitoria na faculdade e aprendo melhor explicando. Quero virar tutor de verdade.',
    github: 'https://github.com/brunolima',
    jobId: 'irede-tutor-frontend',
    companySlug: 'irede',
    dwellSeconds: 78,
    criadoHaMinutos: 12
  },
  {
    id: 'irede-camila-rocha',
    nome: 'Camila Rocha',
    skills: ['Pedagogia', 'SQL', 'Notion', 'Metabase'],
    sobre:
      'Saí de licenciatura, virei product manager em edtech. Hoje desenho trilhas técnicas e meço resultado com dado, não achismo.',
    github: 'https://github.com/camilarocha',
    jobId: 'irede-coord-capacitacao',
    companySlug: 'irede',
    dwellSeconds: 96,
    criadoHaMinutos: 22
  },
  {
    id: 'irede-diego-fernandes',
    nome: 'Diego Fernandes',
    skills: ['Solidity', 'Foundry', 'TypeScript', 'Ethers.js'],
    sobre:
      'Auditor júnior de smart contracts. Já achei bug em três protocolos open-source e quero passar essa malícia adiante.',
    github: 'https://github.com/diegofernandes',
    jobId: 'irede-mentor-web3',
    companySlug: 'irede',
    dwellSeconds: 35,
    criadoHaMinutos: 45
  },
  {
    id: 'irede-elisa-prado',
    nome: 'Elisa Prado',
    skills: ['React', 'TypeScript', 'CSS Grid', 'Figma'],
    sobre:
      'Recém-formada, mas com 2 anos de freela. Faço CSS na mão sem framework quando precisa.',
    github: 'https://github.com/elisaprado',
    jobId: 'irede-tutor-frontend',
    companySlug: 'irede',
    dwellSeconds: 12,
    criadoHaMinutos: 110
  },

  // ----------------------------------------------------------------
  // Nimbus Cloud — Go, Kubernetes, SRE
  // ----------------------------------------------------------------
  {
    id: 'nimbus-fernando-cardoso',
    nome: 'Fernando Cardoso',
    skills: ['Go', 'Kubernetes', 'gRPC', 'Prometheus'],
    sobre:
      'Saí de fintech onde toquei o control plane de pagamentos. Já operei cluster de 200 nodes sem pager virar problema.',
    github: 'https://github.com/fernandocardoso',
    jobId: 'nimbus-eng-plataforma',
    companySlug: 'nimbus',
    dwellSeconds: 168,
    criadoHaMinutos: 2
  },
  {
    id: 'nimbus-gabriela-mendes',
    nome: 'Gabriela Mendes',
    skills: ['Terraform', 'AWS', 'Linux', 'eBPF'],
    sobre:
      'SRE há 6 anos, três deles com IaC pra times grandes. Postmortem comigo é discussão de processo, não caça às bruxas.',
    github: 'https://github.com/gabimendes',
    jobId: 'nimbus-sre-senior',
    companySlug: 'nimbus',
    dwellSeconds: 124,
    criadoHaMinutos: 18
  },
  {
    id: 'nimbus-henrique-vargas',
    nome: 'Henrique Vargas',
    skills: ['Go', 'Kubernetes', 'OpenTelemetry', 'PostgreSQL'],
    sobre:
      'Dev backend que migrou de Java pra Go e nunca mais voltou. Curto plataforma porque o feedback loop é o produto.',
    github: 'https://github.com/henriquevargas',
    jobId: 'nimbus-eng-plataforma',
    companySlug: 'nimbus',
    dwellSeconds: 54,
    criadoHaMinutos: 33
  },
  {
    id: 'nimbus-isadora-bastos',
    nome: 'Isadora Bastos',
    skills: ['Rust', 'Tokio', 'Kubernetes', 'Networking'],
    sobre:
      'Vim do mundo de redes (CCNP) e troquei pela engenharia de software. Hoje toco um proxy em Rust em produção.',
    github: 'https://github.com/isadorabastos',
    jobId: 'nimbus-eng-plataforma',
    companySlug: 'nimbus',
    dwellSeconds: 89,
    criadoHaMinutos: 67
  },
  {
    id: 'nimbus-joao-pedro',
    nome: 'João Pedro Almeida',
    skills: ['Linux', 'Bash', 'Terraform', 'Ansible'],
    sobre:
      'SysAdmin que virou SRE. Já fui plantonista, hoje prefiro escrever código que cuida sozinho dos serviços.',
    github: 'https://github.com/joaopedroalmeida',
    jobId: 'nimbus-sre-senior',
    companySlug: 'nimbus',
    dwellSeconds: 22,
    criadoHaMinutos: 180
  },

  // ----------------------------------------------------------------
  // Kindred Health — Python, React, healthtech
  // ----------------------------------------------------------------
  {
    id: 'kindred-larissa-tavares',
    nome: 'Larissa Tavares',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'pydantic'],
    sobre:
      'Backend Python em healthtech há 3 anos. Já trabalhei com HL7 e LGPD em projeto real, sem achar que era detalhe.',
    github: 'https://github.com/larissatavares',
    jobId: 'kindred-backend-python',
    companySlug: 'kindred',
    dwellSeconds: 155,
    criadoHaMinutos: 5
  },
  {
    id: 'kindred-marcos-vinicius',
    nome: 'Marcos Vinícius',
    skills: ['React', 'TypeScript', 'Acessibilidade', 'Testing Library'],
    sobre:
      'Frontend com foco em a11y. Construí o checkout de um e-commerce que passou em audit do WCAG AA.',
    github: 'https://github.com/marcosvinicius',
    jobId: 'kindred-frontend-react',
    companySlug: 'kindred',
    dwellSeconds: 112,
    criadoHaMinutos: 14
  },
  {
    id: 'kindred-natalia-okabe',
    nome: 'Natália Okabe',
    skills: ['Python', 'Django', 'PostgreSQL', 'Celery'],
    sobre:
      'Migrei monolito Django de 8 anos sem downtime. Curto domínio de saúde porque a regra de negócio é densa.',
    github: 'https://github.com/nataliaokabe',
    jobId: 'kindred-backend-python',
    companySlug: 'kindred',
    dwellSeconds: 67,
    criadoHaMinutos: 28
  },
  {
    id: 'kindred-otavio-borges',
    nome: 'Otávio Borges',
    skills: ['React', 'TypeScript', 'Tailwind', 'Storybook'],
    sobre:
      'Devs sêniores me chamam de novato porque tenho 1 ano CLT, mas mantenho um design system aberto com 200 stars.',
    github: 'https://github.com/otavioborges',
    jobId: 'kindred-frontend-react',
    companySlug: 'kindred',
    dwellSeconds: 41,
    criadoHaMinutos: 76
  },
  {
    id: 'kindred-paula-correa',
    nome: 'Paula Corrêa',
    skills: ['Python', 'FastAPI', 'Redis', 'AWS Lambda'],
    sobre:
      'Saí de plantonista médica pra estudar dev. Faço backend há 2 anos e entendo o usuário do outro lado.',
    github: 'https://github.com/paulacorrea',
    jobId: 'kindred-backend-python',
    companySlug: 'kindred',
    dwellSeconds: 18,
    criadoHaMinutos: 95
  },

  // ----------------------------------------------------------------
  // Pixelforge — Unity, C#, shaders
  // ----------------------------------------------------------------
  {
    id: 'pixelforge-rafael-coutinho',
    nome: 'Rafael Coutinho',
    skills: ['Unity', 'C#', 'ECS', 'Shader Graph'],
    sobre:
      'Lancei 2 jogos em jam que viraram demo na Steam Next Fest. Gameplay programmer pq design e código andam juntos.',
    github: 'https://github.com/rafaelcoutinho',
    jobId: 'pixelforge-gameplay-unity',
    companySlug: 'pixelforge',
    dwellSeconds: 173,
    criadoHaMinutos: 7
  },
  {
    id: 'pixelforge-sofia-ribeiro',
    nome: 'Sofia Ribeiro',
    skills: ['HLSL', 'URP', 'RenderDoc', 'Houdini'],
    sobre:
      'Vim de VFX em cinema e migrei pra games. Faço shader procedural e otimizo pipeline em paralelo.',
    github: 'https://github.com/sofiaribeiro',
    jobId: 'pixelforge-tech-artist',
    companySlug: 'pixelforge',
    dwellSeconds: 138,
    criadoHaMinutos: 11
  },
  {
    id: 'pixelforge-thiago-nascimento',
    nome: 'Thiago Nascimento',
    skills: ['Unity', 'C#', 'WebGL', 'DOTween'],
    sobre:
      'Programei mini-games em WebGL pra agência. Quero algo maior, com mecânica de verdade, não só clique de marca.',
    github: 'https://github.com/thiagonascimento',
    jobId: 'pixelforge-gameplay-unity',
    companySlug: 'pixelforge',
    dwellSeconds: 82,
    criadoHaMinutos: 26
  },
  {
    id: 'pixelforge-ursula-veiga',
    nome: 'Úrsula Veiga',
    skills: ['GLSL', 'OpenGL', 'C++', 'Blender'],
    sobre:
      'Mestrado em computação gráfica, dissertação sobre PBR. Procuro time onde shader não é só efeito visual.',
    github: 'https://github.com/ursulaveiga',
    jobId: 'pixelforge-tech-artist',
    companySlug: 'pixelforge',
    dwellSeconds: 47,
    criadoHaMinutos: 52
  },
  {
    id: 'pixelforge-vinicius-melo',
    nome: 'Vinícius Melo',
    skills: ['Unity', 'C#', 'FSM', 'Multiplayer'],
    sobre:
      'Toquei netcode num MMO indie por 2 anos. Sei o quanto dói simular partida com 200ms de latência.',
    github: 'https://github.com/viniciusmelo',
    jobId: 'pixelforge-gameplay-unity',
    companySlug: 'pixelforge',
    dwellSeconds: 24,
    criadoHaMinutos: 140
  },

  // ----------------------------------------------------------------
  // GreenLedger — TypeScript fullstack, dados, sustentabilidade
  // ----------------------------------------------------------------
  {
    id: 'greenledger-wesley-pinheiro',
    nome: 'Wesley Pinheiro',
    skills: ['TypeScript', 'Node', 'PostgreSQL', 'GraphQL'],
    sobre:
      'Fullstack TS há 5 anos. Trabalhei em fintech B2B e quero mudar o setor — sustentável faz sentido pra mim.',
    github: 'https://github.com/wesleypinheiro',
    jobId: 'greenledger-fullstack-ts',
    companySlug: 'greenledger',
    dwellSeconds: 161,
    criadoHaMinutos: 3
  },
  {
    id: 'greenledger-yasmin-leal',
    nome: 'Yasmin Leal',
    skills: ['Python', 'Airflow', 'dbt', 'BigQuery'],
    sobre:
      'Engenheira de dados saída do agro. Conheço dado de satélite, NDVI e como cruzar com IoT em campo.',
    github: 'https://github.com/yasminleal',
    jobId: 'greenledger-eng-dados',
    companySlug: 'greenledger',
    dwellSeconds: 119,
    criadoHaMinutos: 16
  },
  {
    id: 'greenledger-zeca-pacheco',
    nome: 'Zeca Pacheco',
    skills: ['TypeScript', 'Fastify', 'Postgres', 'AWS'],
    sobre:
      'Saí de startup que fechou. Quero código que dura e produto onde minha cabeça importa, não só meu output.',
    github: 'https://github.com/zecapacheco',
    jobId: 'greenledger-fullstack-ts',
    companySlug: 'greenledger',
    dwellSeconds: 72,
    criadoHaMinutos: 31
  },
  {
    id: 'greenledger-aline-figueiredo',
    nome: 'Aline Figueiredo',
    skills: ['JavaScript', 'Python', 'SQL', 'Git'],
    sobre:
      'Cursando sistemas de informação no 5º período. Já fiz dois projetos pessoais com API pública e gosto de mexer com dado.',
    github: 'https://github.com/alinefigueiredo',
    jobId: 'greenledger-estagio',
    companySlug: 'greenledger',
    dwellSeconds: 38,
    criadoHaMinutos: 60
  },
  {
    id: 'greenledger-bento-marques',
    nome: 'Bento Marques',
    skills: ['Spark', 'Scala', 'Kafka', 'PostgreSQL'],
    sobre:
      'Eng. de dados sênior. Modelei estrela e floco em três setores; agora quero usar isso pra algo além de ad-tech.',
    github: 'https://github.com/bentomarques',
    jobId: 'greenledger-eng-dados',
    companySlug: 'greenledger',
    dwellSeconds: 9,
    criadoHaMinutos: 200
  }
];

export const candidatosPorEmpresa = (slug: string): CandidatoMock[] =>
  candidatosMock.filter((c) => c.companySlug === slug);

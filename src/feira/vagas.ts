import type { Vaga } from '../shared/tipos';

/**
 * Espelho local das vagas do `supabase/seed.sql`.
 * Enquanto Supabase não estiver de pé, a feira lê esse mock.
 * IDs são slugs determinísticos pra persistir candidaturas no localStorage
 * sem depender de UUIDs do banco.
 */
export const vagas: Vaga[] = [
  // ----------------------------------------------------------------
  // iRede (3 vagas — residência em tech/Web3)
  // ----------------------------------------------------------------
  {
    id: 'irede-mentor-web3',
    companySlug: 'irede',
    titulo: 'Mentor de Residência Web3',
    descricao:
      'Acompanhar turmas de residentes ao longo de seis meses, revisar entregas em Solidity e React, e ajudar cada dev a sair com um projeto on-chain no portfólio. Vaga remota com encontros semanais ao vivo.',
    senioridade: 'sênior',
    requisitos: [
      'Experiência com contratos em Solidity',
      'Domínio de React e TypeScript',
      'Histórico de mentoria, pair programming ou liderança técnica',
      'Saber explicar o porquê, não só o como'
    ]
  },
  {
    id: 'irede-coord-capacitacao',
    companySlug: 'irede',
    titulo: 'Coordenador(a) de Capacitação Tech',
    descricao:
      'Desenhar a trilha pedagógica das residências da iRede em parceria com mentores e empresas parceiras. Definir desafios práticos, critérios de avaliação e métricas de progresso dos residentes.',
    senioridade: 'pleno',
    requisitos: [
      'Experiência com formação de devs (bootcamp, faculdade, residência ou similar)',
      'Visão de produto educacional',
      'Confortável com SQL e dashboards',
      'Comunicação clara em português escrito'
    ]
  },
  {
    id: 'irede-tutor-frontend',
    companySlug: 'irede',
    titulo: 'Tutor(a) Frontend',
    descricao:
      'Apoiar residentes em dúvidas de React, TypeScript e CSS moderno via plantão diário no Discord. Revisar PRs, dar feedback técnico e ajudar a depurar bugs reais. Ideal pra dev que adora ensinar.',
    senioridade: 'júnior',
    requisitos: [
      'React em projetos reais (mínimo 1 ano)',
      'TypeScript e Tailwind',
      'Paciência didática',
      'Disponibilidade de 20h semanais'
    ]
  },

  // ----------------------------------------------------------------
  // Nimbus Cloud (2 vagas)
  // ----------------------------------------------------------------
  {
    id: 'nimbus-eng-plataforma',
    companySlug: 'nimbus',
    titulo: 'Engenheiro(a) de Plataforma',
    descricao:
      'Construir o control plane multi-tenant que orquestra clusters Kubernetes dos nossos clientes. Time pequeno, código em Go, deploy em produção semana sim, semana sim.',
    senioridade: 'pleno',
    requisitos: [
      'Go em produção',
      'Kubernetes além do kubectl apply',
      'Confortável com observabilidade (OpenTelemetry, Prometheus)',
      'Já depurou um pod em CrashLoopBackOff de madrugada'
    ]
  },
  {
    id: 'nimbus-sre-senior',
    companySlug: 'nimbus',
    titulo: 'SRE Sênior',
    descricao:
      'Cuidar do SLO de 99.95% da nossa malha de edge nodes. Automatizar tudo que doer duas vezes, escrever postmortems sem culpado e melhorar a vida de quem está de plantão.',
    senioridade: 'sênior',
    requisitos: [
      'Experiência prévia como SRE ou DevOps sênior',
      'Terraform e IaC em escala',
      'Linux a fundo (cgroups, namespaces, eBPF é bônus)',
      'Inglês para colaborar com times distribuídos'
    ]
  },

  // ----------------------------------------------------------------
  // Kindred Health (2 vagas)
  // ----------------------------------------------------------------
  {
    id: 'kindred-backend-python',
    companySlug: 'kindred',
    titulo: 'Dev Backend Python',
    descricao:
      'Trabalhar nas APIs que conectam o prontuário eletrônico a clínicas no interior do Brasil. Cada endpoint que você entrega chega em consultório real.',
    senioridade: 'pleno',
    requisitos: [
      'Python moderno (FastAPI, pydantic, async)',
      'PostgreSQL bem entendido (índices, EXPLAIN)',
      'Noção de LGPD e dados sensíveis',
      'Disposição pra ler especificações HL7/FHIR'
    ]
  },
  {
    id: 'kindred-frontend-react',
    companySlug: 'kindred',
    titulo: 'Dev Frontend React',
    descricao:
      'Construir a interface que médicos e enfermeiros usam todo dia. Acessibilidade não é checklist, é requisito de produto.',
    senioridade: 'júnior',
    requisitos: [
      'React e TypeScript',
      'CSS moderno (flex, grid, custom properties)',
      'Empatia com usuários não-técnicos',
      'Curiosidade em UX de aplicações críticas'
    ]
  },

  // ----------------------------------------------------------------
  // Pixelforge Studios (2 vagas)
  // ----------------------------------------------------------------
  {
    id: 'pixelforge-gameplay-unity',
    companySlug: 'pixelforge',
    titulo: 'Programador(a) de Gameplay Unity',
    descricao:
      'Implementar mecânicas centrais do nosso próximo título indie. Vai sentar do lado de game designers e ter palavra sobre o que faz cada sistema ser divertido.',
    senioridade: 'pleno',
    requisitos: [
      'Unity e C# em projetos finalizados (jam ou comercial)',
      'Entender game loop, FSM e ECS',
      'Portfólio com builds jogáveis',
      'Paixão por iteração rápida'
    ]
  },
  {
    id: 'pixelforge-tech-artist',
    companySlug: 'pixelforge',
    titulo: 'Tech Artist (Shaders)',
    descricao:
      'Fazer a ponte entre arte e engenharia. Escrever shaders, otimizar render pipeline e garantir que o jogo rode bem do Steam Deck ao desktop high-end.',
    senioridade: 'sênior',
    requisitos: [
      'HLSL ou GLSL em produção',
      'URP/HDRP da Unity',
      'Profiling de GPU (RenderDoc, Frame Debugger)',
      'Olho artístico além do técnico'
    ]
  },

  // ----------------------------------------------------------------
  // GreenLedger (3 vagas)
  // ----------------------------------------------------------------
  {
    id: 'greenledger-fullstack-ts',
    companySlug: 'greenledger',
    titulo: 'Dev Fullstack TypeScript',
    descricao:
      'Trabalhar do banco até a UI no painel que rastreia créditos de carbono de produtores rurais. Stack moderna, deploy contínuo, code review humano.',
    senioridade: 'pleno',
    requisitos: [
      'TypeScript em front e back',
      'Node.js (Fastify ou Nest)',
      'PostgreSQL e queries não-triviais',
      'GraphQL é diferencial'
    ]
  },
  {
    id: 'greenledger-eng-dados',
    companySlug: 'greenledger',
    titulo: 'Engenheiro(a) de Dados',
    descricao:
      'Construir os pipelines que cruzam dados de satélite, IoT em campo e blockchain pra emitir cada crédito verde. Trabalho com volume de verdade e janelas de tempo apertadas.',
    senioridade: 'sênior',
    requisitos: [
      'Python e SQL avançado',
      'Spark, dbt ou Airflow em escala',
      'Modelagem dimensional (estrela, floco de neve)',
      'Conforto com dados georreferenciados'
    ]
  },
  {
    id: 'greenledger-estagio',
    companySlug: 'greenledger',
    titulo: 'Estágio em Engenharia',
    descricao:
      'Vaga de estágio para quem tá começando e quer aprender olhando código real. Trabalha junto com devs plenos e seniores, sem ser tratado como faz-tudo.',
    senioridade: 'júnior',
    requisitos: [
      'Cursando ciência da computação, engenharia de software ou correlato',
      'Já fez algum projeto pessoal em qualquer linguagem',
      'Quer aprender TypeScript e cloud',
      'Boa comunicação escrita'
    ]
  }
];

export const vagasPorSlug = (slug: string): Vaga[] =>
  vagas.filter((v) => v.companySlug === slug);

export const vagaPorId = (id: string): Vaga | undefined =>
  vagas.find((v) => v.id === id);

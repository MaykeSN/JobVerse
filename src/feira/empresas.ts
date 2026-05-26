import type { Empresa } from '../shared/tipos';

// Pentágono em torno do spawn central (raio 12m)
const RAIO = 12;
const pos = (i: number, total = 5): [number, number, number] => {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(angle) * RAIO, 0, Math.sin(angle) * RAIO];
};

export const empresas: Empresa[] = [
  {
    slug: 'irede',
    nome: 'iRede Tecnologia',
    missao: 'Formar a próxima geração de talentos em tecnologia.',
    stack: ['Web3', 'Blockchain', 'React', 'Node'],
    cor: '#00C896',
    posicao: pos(0)
  },
  {
    slug: 'nimbus',
    nome: 'Nimbus Cloud',
    missao: 'Infraestrutura cloud sem fricção, do laptop ao planeta.',
    stack: ['Go', 'Rust', 'Kubernetes', 'Terraform'],
    cor: '#00D4FF',
    posicao: pos(1)
  },
  {
    slug: 'kindred',
    nome: 'Kindred Health',
    missao: 'Saúde acessível pelas mãos da tecnologia.',
    stack: ['Python', 'React', 'PostgreSQL', 'FastAPI'],
    cor: '#FF4B91',
    posicao: pos(2)
  },
  {
    slug: 'pixelforge',
    nome: 'Pixelforge Studios',
    missao: 'Criar mundos que ninguém quer abandonar.',
    stack: ['C#', 'Unity', 'WebGL', 'Shaders'],
    cor: '#A855F7',
    posicao: pos(3)
  },
  {
    slug: 'greenledger',
    nome: 'GreenLedger',
    missao: 'Finanças transparentes pra um planeta sustentável.',
    stack: ['TypeScript', 'Node', 'AWS', 'PostgreSQL'],
    cor: '#84CC16',
    posicao: pos(4)
  }
];

export const empresaPorSlug = (slug: string) =>
  empresas.find((e) => e.slug === slug);

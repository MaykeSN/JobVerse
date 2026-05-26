import type { Vaga, Empresa } from './tipos';

export interface AnaliseMatch {
  score: number;
  nivel: 'fraco' | 'médio' | 'forte' | 'excelente';
  insights: string[];
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function contemTermo(skill: string, termo: string): boolean {
  const s = norm(skill);
  const t = norm(termo);
  if (s.includes(t) || t.includes(s)) return true;
  // palavras individuais com 4+ chars
  return t.split(/\s+/).some((w) => w.length >= 4 && s.includes(w));
}

export function analisarMatch(
  skills: string[],
  sobre: string,
  github: string,
  vaga: Vaga,
  empresa: Empresa
): AnaliseMatch {
  // 1. Cobertura dos requisitos da vaga (40 pts)
  const reqCobertos = vaga.requisitos.filter((req) =>
    skills.some((s) => contemTermo(s, req))
  );
  const ptReqs = Math.round((reqCobertos.length / Math.max(vaga.requisitos.length, 1)) * 40);

  // 2. Alinhamento com a stack da empresa (30 pts)
  const stackAlinhada = empresa.stack.filter((tech) =>
    skills.some((s) => contemTermo(s, tech))
  );
  const ptStack = Math.round((stackAlinhada.length / Math.max(empresa.stack.length, 1)) * 30);

  // 3. Completude do perfil (20 pts)
  const ptPerfil = Math.round(
    Math.min(skills.length, 5) / 5 * 10 +
    Math.min(sobre.length, 200) / 200 * 6 +
    (github ? 4 : 0)
  );

  // 4. Sinal de sênioridade (10 pts)
  const sobreNorm = norm(sobre);
  const sinaisSenior = ['senior', 'lider', 'coordena', 'gerencia', 'arquitet', 'anos de'];
  const sinaisJunior = ['aprendendo', 'cursando', 'primeiro projeto', 'estagio', 'iniciante'];
  const éSenior = sinaisSenior.some((w) => sobreNorm.includes(w));
  const éJunior = sinaisJunior.some((w) => sobreNorm.includes(w));

  let ptSenior = 5;
  if (vaga.senioridade === 'sênior' && éSenior) ptSenior = 10;
  if (vaga.senioridade === 'júnior' && éJunior) ptSenior = 10;
  if (vaga.senioridade === 'sênior' && éJunior) ptSenior = 0;
  if (vaga.senioridade === 'júnior' && éSenior) ptSenior = 8;

  const score = Math.min(Math.max(ptReqs + ptStack + ptPerfil + ptSenior, 8), 97);

  // Insights legíveis
  const insights: string[] = [];

  if (stackAlinhada.length > 0) {
    insights.push(`Stack: ${stackAlinhada.slice(0, 3).join(', ')} identificada`);
  } else {
    insights.push(`Nenhuma tech da stack (${empresa.stack.slice(0, 2).join(', ')}) declarada`);
  }

  if (reqCobertos.length > 0) {
    insights.push(`${reqCobertos.length}/${vaga.requisitos.length} requisitos cobertos`);
  } else {
    insights.push('Requisitos específicos não cobertos');
  }

  insights.push(github ? 'GitHub informado — portfólio verificável' : 'Sem GitHub informado');

  const nivel: AnaliseMatch['nivel'] =
    score >= 75 ? 'excelente' :
    score >= 55 ? 'forte' :
    score >= 35 ? 'médio' : 'fraco';

  return { score, nivel, insights };
}

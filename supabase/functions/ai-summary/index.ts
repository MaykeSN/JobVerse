// JobVerse — Edge Function: ai-summary
//
// STUB intencional. A análise por IA é parte do roadmap "em breve" do produto:
// no MVP do hackathon o painel do recrutador apenas mostra um card com gradient,
// blur e ícone Sparkles. Esta função existe pra deixar a infraestrutura pronta
// (CORS, deploy, contrato de resposta) e ser chamada pela UI quando o usuário
// clicar no botão "Gerar resumo" — que devolve este placeholder.
//
// Quando a integração real for feita (Claude/OpenAI/etc), basta substituir o
// corpo de handle() mantendo o mesmo shape de resposta.
//
// Runtime: Deno (Supabase Edge Functions).
// Deploy: supabase functions deploy ai-summary

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173'
];

function corsHeaders(origin: string | null): Record<string, string> {
  // Aceita qualquer subdomínio Vercel do projeto + localhost dev.
  const allow =
    origin && (ALLOWED_ORIGINS.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname))
      ? origin
      : '*';

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400'
  };
}

interface AISummaryResponse {
  status: 'em_breve';
  message: string;
  placeholder: {
    summary: string;
    match_score: number | null;
  };
}

function handle(): AISummaryResponse {
  return {
    status: 'em_breve',
    message: 'Análise por IA estará disponível em versão futura',
    placeholder: {
      summary: '—',
      match_score: null
    }
  };
}

Deno.serve((req: Request) => {
  const origin = req.headers.get('origin');
  const headers = {
    ...corsHeaders(origin),
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers
    });
  }

  return new Response(JSON.stringify(handle()), { status: 200, headers });
});

# Setup Supabase — JobVerse

Passo a passo para subir o backend do JobVerse do zero. Tempo estimado: 15 minutos.

---

## 1. Criar conta e projeto

1. Acesse [supabase.com](https://supabase.com) e cadastre-se (pode usar o GitHub).
2. No dashboard, clique em **New project**.
3. Preencha:
   - **Name:** `jobverse` (ou outro nome).
   - **Database password:** salve em local seguro (você vai precisar pro CLI).
   - **Region:** `South America (São Paulo)` — `sa-east-1`. Menor latência pro Brasil.
   - **Pricing plan:** Free.
4. Clique em **Create new project** e aguarde ~2 minutos enquanto o Postgres sobe.

---

## 2. Copiar credenciais para o `.env`

No dashboard do projeto:

1. Vá em **Project Settings → API**.
2. Copie:
   - **Project URL** → cole em `VITE_SUPABASE_URL`.
   - **anon / public** key → cole em `VITE_SUPABASE_ANON_KEY`.

Na raiz do repo:

```bash
cp .env.example .env
```

Edite o `.env` recém-criado:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> O prefixo `VITE_` é obrigatório — só assim o Vite expõe a variável no client.

---

## 3. Aplicar o schema

1. No dashboard do Supabase, abra **SQL Editor** (ícone de banco de dados na barra lateral).
2. Clique em **+ New query**.
3. Abra o arquivo local `supabase/schema.sql`, copie o conteúdo inteiro e cole no editor.
4. Clique em **Run** (Ctrl+Enter).
5. Você deve ver `Success. No rows returned.` no final.

Verifique em **Table Editor** que as 6 tabelas apareceram:
`companies`, `jobs`, `candidates`, `applications`, `visits`, `ai_summaries`.

---

## 4. Carregar o seed (5 empresas + 12 vagas)

1. Ainda no **SQL Editor**, **+ New query**.
2. Copie o conteúdo de `supabase/seed.sql` e cole.
3. **Run**.
4. Confira em **Table Editor → companies** que existem 5 linhas, e em **jobs** que existem 12.

```sql
-- Validação rápida (cole no SQL Editor):
select c.slug, c.nome, count(j.id) as vagas
from companies c
left join jobs j on j.company_id = c.id
group by c.slug, c.nome
order by c.slug;
```

Esperado: `irede 3`, `nimbus 2`, `kindred 2`, `pixelforge 2`, `greenledger 3`.

---

## 5. Confirmar Realtime

O schema já roda `alter publication supabase_realtime add table applications;` e o
mesmo para `visits`. Para confirmar visualmente:

1. **Database → Replication** na barra lateral.
2. Você deve ver as tabelas `applications` e `visits` com toggle **ligado**.
3. Se estiverem desligadas, ligue manualmente.

---

## 6. Instalar a Supabase CLI

A CLI é necessária só pra fazer deploy da Edge Function.

**Windows (PowerShell):**

```powershell
scoop install supabase
```

ou via `npm` (cross-platform):

```bash
npm install -g supabase
```

**macOS:**

```bash
brew install supabase/tap/supabase
```

Confira:

```bash
supabase --version
```

---

## 7. Login e link do projeto

```bash
supabase login
```

Abre o navegador, autoriza, volta pra CLI.

Pegue o `project-ref` no dashboard: **Project Settings → General → Reference ID**
(string tipo `abcdefghijklmnop`).

Na raiz do repo:

```bash
supabase link --project-ref <SEU_PROJECT_REF>
```

Vai pedir a senha do banco (a que você salvou no passo 1).

---

## 8. Deploy da Edge Function `ai-summary`

```bash
supabase functions deploy ai-summary
```

Saída esperada termina com `Deployed Function ai-summary`.

---

## 9. Testar a função

Pegue a anon key e o URL do projeto e rode:

```bash
curl -i -X POST "https://<SEU_PROJECT_REF>.supabase.co/functions/v1/ai-summary" ^
  -H "Authorization: Bearer <VITE_SUPABASE_ANON_KEY>" ^
  -H "Content-Type: application/json" ^
  -d "{}"
```

> Em PowerShell troque `^` por backtick `` ` `` para quebrar linha; ou rode tudo em uma linha só.
> Em bash (Linux/macOS) use `\` para quebra de linha.

Resposta esperada (HTTP 200):

```json
{
  "status": "em_breve",
  "message": "Análise por IA estará disponível em versão futura",
  "placeholder": { "summary": "—", "match_score": null }
}
```

Se vier isso, está tudo certo. O frontend já pode chamar `/functions/v1/ai-summary`.

---

## 10. Próximos passos

- Voltar ao repo e rodar `npm run dev` — a Landing já deve conseguir inserir candidatos.
- Conectar a Vercel ao GitHub e configurar as mesmas duas variáveis no painel Vercel.
- Quando for produção: habilitar RLS (ver `-- TODO produção` no topo do `schema.sql`).

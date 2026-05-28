# Roteiro do vídeo-pitch — JobVerse

**Duração total:** 5 minutos (limite do edital)
**Formato:** YouTube não-listado
**Estilo:** narração calma + screencast da aplicação rodando + slides intercalados

> **Dica geral:** ensaiar com cronômetro. Falar 130-150 palavras por minuto. Não improvisar — leitura natural do roteiro entrega mais do que tentar parecer espontâneo nervoso.

---

## Bloco 1 — Abertura + problema (0:00 – 0:30)

**Visual:** Slide preto com texto branco glitch animado.

> "Você já se candidatou pra uma vaga de dev e ficou com aquela sensação fria de estar enviando currículo pro vazio?
>
> Não sabe quem vai ler. Não conhece a cultura. Não tem ideia de quem são as pessoas por trás daquela vaga.
>
> Do outro lado, empresas de tech investem fortunas em employer branding — e mesmo assim perdem talento porque não conseguem transmitir quem são antes da entrevista.
>
> Esse é o problema que o JobVerse resolve."

**Tempo:** ~30 segundos. **Tom:** problema relatável, sem inflar.

---

## Bloco 2 — O que é o JobVerse (0:30 – 1:30)

**Visual:** Transição pra screencast da landing JobVerse. Particles conectadas no fundo, logo glitching, partícipla 2D rolando.

> "JobVerse é uma feira de empregos imersiva, em 3D, navegável direto no navegador.
>
> Empresas têm estandes virtuais com identidade visual única. Candidatos andam entre eles em primeira pessoa, exploram a cultura, deixam CV — tudo de forma humana.
>
> Do outro lado, recrutadores acessam um painel em tempo real com os CVs recebidos, o engajamento de cada candidato no estande, e — em breve — análise por IA de match com a vaga.
>
> Tudo isso construído em React Three Fiber, com Supabase realtime no backend, rodando 100% no navegador. Sem download, sem app, sem fricção."

**Tempo:** ~1 minuto. **Tom:** confiante. Mostrar landing com mouse parado.

**Marcadores no slide:**
- "React + R3F + Supabase Realtime"
- "Browser-first. Zero install."

---

## Bloco 3 — Demo navegável (1:30 – 3:30) ★ peça-chave

**Visual:** SCREENCAST AO VIVO da aplicação. **Esse bloco é a estrela do pitch. Ensaiar 3-4 vezes.**

### 1:30 – 2:00 — Entrada
- Click em "Sou dev" na landing → cadastro rápido com github + senha
- Login → loading screen com progress bar glitch
- **Entra na feira:** câmera num shot estabelecedor mostrando os 5 estandes em pentágono

> "Login simples com GitHub username. Click pra entrar — e olha o que aparece."

### 2:00 – 2:40 — Cena 3D
- Click pra travar mouse → anda WASD até o estande iRede (verde)
- DwellTracker pulsa o anel
- HUD do canto sobe "Visitadas 1 / 5"

> "Cinco empresas, cada uma com sua identidade visual. O ambiente registra quanto tempo você passa em cada estande — é o equivalente digital de 'parar pra conversar' numa feira de verdade."

- Click no estande → modal de vagas abre com 3 vagas da iRede

> "Click no estande e você vê as vagas reais. Stack, senioridade, descrição."

- Click em "Candidatar" → modal de CV → preenche skills (Solidity, React, TypeScript) + sobre + github → submit
- Toast verde "CV entregue pra iRede. Boa sorte!"
- HUD sobe "Vagas 1"

> "Deixa skills, escreve um pouco sobre você, e envia. Mas o que acontece do outro lado é onde a coisa fica interessante."

### 2:40 – 3:20 — Switch para dashboard recrutador

- **Abrir aba 2:** `/recrutador/irede` — ENQUANTO o pitch fala, mostrar o painel iRede aparecer
- Lista de CVs com 5 mock pré-existentes
- Apertar Alt+Tab pra mostrar **a candidatura que acabou de fazer aparecendo em tempo real** com highlight neon

> "Esse é o painel do recrutador da iRede. Em tempo real, via Supabase Realtime, novos CVs aparecem com destaque. Cada candidato tem skills, sobre, link de github, e o tempo que passou no estande aqui no heatmap."

- Apontar pro Heatmap (Top 5 por permanência)
- Apontar pro card "Análise IA — Em breve"

> "E esse card aqui — Análise IA — é onde a próxima fase do produto entra: resumo automático de CV, match score com a vaga, insights agregados. Já está arquiteturalmente pronto. Falta a integração com o LLM."

### 3:20 – 3:30 — Easter egg (opcional, mas memorável)

- Voltar pra aba da feira, digitar Konami code → rave mode 10s

> "Ah, e tem um easter egg — porque feira de tech sem easter egg não é feira de tech."

**Tempo:** 2 minutos exatos. Pode estourar 10s, não mais.

---

## Bloco 4 — Aplicação prática + futuro (3:30 – 4:30)

**Visual:** Slide com lista de aplicações reais.

> "Onde isso encaixa de verdade?
>
> Eventos corporativos online como o RD Summit e a Campus Party podem trocar landing pages estáticas por feiras 3D acessíveis remotamente.
>
> Páginas de carreiras de empresas como Nubank, iFood ou Stone podem ter uma versão imersiva no `carreiras.empresa.com/3d`.
>
> Bootcamps e residências em tech — como o próprio programa da iRede — podem usar o JobVerse pra conectar alunos com empresas parceiras de forma muito mais memorável que um PDF de oportunidades.
>
> E pra recrutamento internacional remoto, dá pra sentir a cultura de uma empresa sem precisar viajar.
>
> No roadmap: análise por IA, multiplayer com avatares dos outros candidatos visíveis em tempo real, compatibilidade com Meta Quest via WebXR, e selo NFT de visita aos estandes — o ponto Web3 honesto da proposta."

**Tempo:** 1 minuto. **Tom:** projeção, visão de produto.

**Slide com:**
- Eventos · Páginas carreira · Bootcamps · Recrutamento remoto
- Roadmap: IA · Multiplayer · WebXR · NFT visita

---

## Bloco 5 — Time + fechamento (4:30 – 5:00)

**Visual:** Slide com fotos/nomes da equipe + logo JobVerse + URL do repo + agradecimento.

> "Esse é o JobVerse — projeto do time [NOMES] pro HackWeb 2026, desafio ExpoVerse.
>
> Acesse agora em job-verse-tau.vercel.app — sem cadastro, sem download.
>
> Código aberto em github.com/MaykeSN/JobVerse.
>
> Obrigado iRede pela oportunidade. Vamos transformar como devs e empresas se conhecem."

**Tempo:** ~25 segundos.

---

## Checklist pré-gravação

- [ ] Repo público em `main`, último commit estável
- [x] Deploy Vercel funcionando → https://job-verse-tau.vercel.app
- [ ] `.env` configurado, schema + seed aplicados no Supabase
- [ ] OBS ou Loom instalado, microfone testado
- [ ] Aba do navegador SEM extensões/notificações
- [ ] DevTools fechado durante gravação
- [ ] Qualidade gráfica setada em **Alta** (mostra o melhor)
- [ ] Áudio do JobVerse **DESLIGADO** durante a gravação (música do pitch sobrepõe)
- [ ] 2 abas pré-abertas pro switch do bloco 3 (feira + recrutador)
- [ ] Ensaiar 3x com cronômetro antes do take final

## Checklist pós-gravação

- [ ] Cortar trechos "uhms" e respiros longos
- [ ] Adicionar legenda em PT-BR (acessibilidade)
- [ ] Som ambient lo-fi sutil de fundo (Creative Commons)
- [ ] Watermark sutil "JobVerse · HackWeb 2026" no canto
- [ ] Upload YouTube **NÃO LISTADO**
- [ ] Link incluído no README + formulário de submissão

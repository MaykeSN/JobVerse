# Outline dos slides — JobVerse

**Quantidade:** 10 slides
**Formato sugerido:** 16:9, fundo `#05060F`, texto branco/cyan, fonte **Orbitron** nos títulos + **Inter** no corpo
**Ferramenta sugerida:** Canva, Figma Slides, Google Slides ou Beamer/Reveal.js
**Paleta (igual ao produto):**
- BG: `#05060F`
- Cyan: `#00D4FF`
- Magenta: `#FF4B91`
- Verde iRede: `#00C896`
- Texto dim: `#94A3B8`

---

## Slide 1 — Capa

**Layout:** centralizado. Logo grande. Sutil grid de partículas no fundo.

```
                  JOBVERSE
        Feira de empregos imersiva pra devs

                 ____________
                  HACKWEB 2026
              Desafio 4 · ExpoVerse

                  [Time · 2026]
```

- "JOB" em cyan + "VERSE" em magenta (mesma do produto)
- Sub: "Feira de empregos imersiva pra devs"
- Footer: nomes + iRede + ano

---

## Slide 2 — O problema

**Layout:** texto grande à esquerda + ilustração simples à direita (formulário cinza vazio com pessoa frustrada — pode gerar com IA).

```
Processos seletivos de tecnologia são frios.

→ Candidato envia CV pro vazio
→ Não sente a cultura da empresa
→ Empresas perdem talento por não conseguir
   transmitir quem são antes da entrevista
```

- Tom: relatável, sem inflar
- Cor de destaque: magenta nas setas

---

## Slide 3 — A solução

**Layout:** título grande no topo + 3 colunas embaixo.

```
            JOBVERSE
   Uma feira que cabe no navegador

┌─────────────┬─────────────┬─────────────┐
│   ESTANDES  │  IMERSÃO    │  PAINEL B2B │
│      3D     │     1ª P    │  REALTIME   │
│             │             │             │
│  5 empresas │  WASD+mouse │  CVs ao vivo│
│  identidade │  Cultura    │  Heatmap    │
│  única      │  perceptível│  IA "soon"  │
└─────────────┴─────────────┴─────────────┘
```

- Cada coluna com ícone simples (sparkles/eye/chart) cyan

---

## Slide 4 — Stack técnica

**Layout:** logos em grid.

```
       FRONTEND                  BACKEND
                            
   ⚛  React 18              🟢 Supabase
   ⚡  Vite                     Postgres
   📐 TypeScript              Realtime
   🎨 Tailwind v4              Edge Functions
   
                             🔐 Web Crypto
       3D                        Auth (PBKDF2)
   📦 three.js
   🎭 R3F + drei            ☁  Vercel
   ✨ Postprocessing           Deploy
```

- Sub: "100% browser-first · zero install"

---

## Slide 5 — Demo: a feira

**Layout:** Screenshot grande da cena 3D com 5 estandes em pentágono. **Indispensável.**

- Anotações pequenas (callouts cyan):
  - "FPS · WASD + mouse"
  - "Estandes na cor da marca"
  - "Linhas Tron · DwellTracker · sparkles"
  - "Sistema de qualidade · ajustável"

---

## Slide 6 — Demo: dashboard recrutador

**Layout:** Screenshot grande do painel `/recrutador/irede`.

- Callouts:
  - "AO VIVO · Supabase Realtime"
  - "Top 5 por permanência no estande"
  - "Análise IA — em breve (stub arquitetural pronto)"

---

## Slide 7 — Aplicação prática

**Layout:** 4 quadrantes com ícones.

```
┌──────────────────┬──────────────────┐
│  🎪 EVENTOS      │  🏢 PÁGINAS      │
│  Campus Party    │  CARREIRA        │
│  RD Summit       │  Nubank/iFood/   │
│  Web Summit      │  Stone           │
├──────────────────┼──────────────────┤
│  🎓 BOOTCAMPS    │  🌍 REMOTE       │
│  Residências TIC │  RECRUITING      │
│  Universidades   │  Sentir cultura  │
│  Bootcamps tech  │  sem viajar      │
└──────────────────┴──────────────────┘
```

- Cor de destaque: verde iRede no quadrante "Bootcamps"

---

## Slide 8 — Diferenciais vs. alternativas

**Layout:** tabela comparativa.

|  | LinkedIn | Site careers | Career Fair | **JobVerse** |
|---|---|---|---|---|
| Imersão | ❌ | ❌ | ✅ presencial | ✅ digital |
| Escala | ✅ | ✅ | ❌ | ✅ |
| Cultura percebida | ❌ | ⚠ | ✅ | ✅ |
| Realtime recrutador | ❌ | ❌ | ⚠ | ✅ |
| Sem fricção (browser) | ✅ | ✅ | ❌ | ✅ |
| Análise IA | ❌ | ❌ | ❌ | 🟡 em breve |

- **JobVerse** destacado em magenta

---

## Slide 9 — Roadmap

**Layout:** timeline horizontal.

```
HOJE (MVP)         PRÓXIMO          MÉDIO PRAZO
                                    
✓ Cena 3D          🧠 Análise IA    🥽 WebXR (Quest)
✓ Auth simples     👥 Multiplayer   🪪 NFT visita
✓ Painel realtime  📱 PWA mobile    🔒 RLS produção
✓ 5 empresas
```

- Tons: cyan → magenta → purple (gradient)

---

## Slide 10 — Encerramento

**Layout:** simétrico, logo grande no centro, CTAs embaixo.

```
                  JOBVERSE
            Vamos transformar como
        devs e empresas se conhecem

        ────────────────────────

  📦 github.com/MaykeSN/JobVerse
  🎥 youtube.com/...           (link do pitch)
  🌐 jobverse.vercel.app       (link de produção)

        ────────────────────────

           Equipe · iRede · 2026
              Obrigado!
```

- Logo com leve glitch animation (se exportar pra Reveal.js)
- Fundo: gradient sutil bg-deep → bg-panel

---

## Notas de design

- **Consistência com o produto:** mesma paleta, mesma tipografia. A banca vai notar.
- **Screenshots reais:** prefira screenshots do produto rodando a mockups vetoriais.
- **Densidade:** não passar de ~6 bullets por slide. Cada slide ~30s de fala.
- **Animações:** transição simples (fade) entre slides. Sem powerpoint clip art.
- **Acessibilidade:** contraste mínimo AA (texto sobre fundo escuro precisa ser bem claro).
- **Exportar PDF:** o edital pede PDF. Configure 16:9 e exporte sem incorporação de fonte (pra reduzir tamanho).

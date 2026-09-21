# Competitive & Naming Research

**Date of research:** 2026-09-21
**Researched by:** Claude Opus 5
**Purpose:** Evidence base for `IMPLEMENTATION_PLAN.md`. Everything below was pulled from live sources on the date above.

---

## 1. Reference site teardown — Duckle (https://duckle.org/)

### Positioning
ETL-first, open-source, developer/data-engineer audience. The entire site is organised around **ownership of infrastructure**, not around analytics outcomes.

| Attribute | Value |
| --- | --- |
| Hero headline | "Pipelines you own. Author and deploy to your servers or cloud." |
| Hero sub | "Duckle is an open-source ETL platform for teams who want their pipelines running on their own infrastructure." |
| Primary CTAs | "Download Duckle" · "View on GitHub" |
| Licence | MIT OR Apache-2.0 (dual) |
| Vendor | SlothFlowLabs (independent; explicit non-affiliation disclaimer re: DuckDB Labs / MotherDuck) |
| Engine | DuckDB, embedded + columnar; pipelines compile to inspectable SQL |

### Information architecture
`Product · Use cases · Integrations · Deploy · Docs · Learn · Download · Contact`

Page narrative, top to bottom:
1. Hero (ownership claim + one hard benchmark)
2. Integrations (breadth proof)
3. Build (visual canvas)
4. Run & Monitor (observability)
5. Solutions (3 cards)
6. Local AI
7. Proof (3 metric cards)
8. Ecosystem positioning
9. FAQ (16 questions — this is the SEO engine)
10. Get started (3 install paths)
11. Footer (4 columns)

### Techniques worth stealing
- **Specific benchmarks over adjectives.** "96 million rows out of Postgres to Parquet in 39.9s", "16 nodes and 279 rows written in 3006 ms", "1.7s", "~1s", "1B rows". Numbers with decimal places read as measured, not marketing.
- **"Working today, not a coming-soon list."** Pre-empts the standard scepticism about connector counts. They also split the number honestly: "385 components, 367 available today."
- **Anti-claims as features.** "No vendor cloud, no per-row billing", "no telemetry at either end", "never a black box". Defines the product by what it refuses to do.
- **FAQ as a keyword farm.** Questions are literally typed search queries: *"Is there an open-source alternative to Fivetran or Airbyte?"*, *"What replaced Talend Open Studio after it was discontinued?"*, *"What is the fastest way to extract an Oracle table to Parquet?"* Each answer is a mini landing page.
- **Competitor-displacement capture.** The Talend Open Studio EOL question (31 Jan 2024) targets a stranded, motivated audience.
- **Third install path for AI agents.** "Paste this prompt into Claude Code, Cursor or Codex: `Run uvx duckle quickstart...`" — treats coding agents as a distribution channel. Very current; almost nobody does this yet.
- **Honest scoping disclaimer** on the ecosystem section builds credibility rather than costing it.

### Weaknesses to beat
- Visually plain; screenshots do heavy lifting but the page itself has little craft.
- Story **stops at the pipeline.** No answer to "now what do I do with the data?"
- No pricing page, so no commercial narrative and no enterprise-buyer path.
- Dense, undifferentiated wall of FAQ text at the bottom.

---

## 2. Reference site teardown — OrcaSheets (https://orcasheets.ai/)

### Positioning
Analytics-first, enterprise-buyer audience. Organised around **outcomes and cost**, not infrastructure.

| Attribute | Value |
| --- | --- |
| Title | "OrcaSheets: Local-First Enterprise Analytics Platform" |
| Hero (rotating) | "Data to Analytics in Seconds" / "BI Without the Cloud Bill" / "Natural Language Meets Your Data" / "Zero Cloud Uploads, Ever" / "Unlimited Seats, Fixed Cost" / "Local Processing, Cloud Speed" |
| Hero body | "Conquer your data without conquering a new language. OrcaSheets turns your mighty machine into a full analytics engine that connects to all your sources and answers questions in plain English." |
| Trust bar | "1B rows in seconds · 50-70% cost savings · 20+ connectors · Unlimited seats" |
| Primary CTA | Download desktop app (macOS, Windows, Linux) |
| Model | Commercial freemium |

### Pricing (as published)
| Tier | Price | Shape |
| --- | --- | --- |
| Free | $0 | 1 user, unlimited local processing, 150 AI questions/mo, 7-day dashboard history |
| Professional | $10/user/mo or $100/yr | SQL editor, custom AI model, 500 AI queries/mo, 5GB cloud storage |
| Small Teams | $100/team/mo or $1000/yr | Up to 10 seats, 5,000 AI queries/mo, 25GB storage — **flat, not per-seat** |
| Scale & Enterprise | Custom | SSO, on-prem, air-gapped, unlimited |

### Confirmed tech stack
Read directly from the built assets:
- Vite + React SPA (`index-XsfNwCCm.js`, `react-vendor-*.js`, `radix-*.js`, `icons-*.js`)
- Radix UI primitives → almost certainly **shadcn/ui**
- Tailwind with **Material-3-flavoured token naming** (`--on-primary-container`, `--surface-dim`, `--outline-variant`)
- Font: **Lexend** via Google Fonts
- Google Tag Manager

### Confirmed design tokens (from `/assets/index-C9xTPrL6.css`)
```
Light:  --background 0 0% 100%   --foreground 0 0% 0%
        --primary    229 47% 54%   → #566DC6  (indigo/periwinkle)
        --secondary  162 12% 46%   (muted green)
        --tertiary   270 15% 40%   (muted purple)
        --radius     0.5rem        --container-max-width 1200px
Dark:   --background 0 0% 0%     --primary 229 58% 76% → #99A8E5
Accents: #FFCB1B yellow · #FF8D63 peach · #AF89FF purple · #3EB48A green
Status:  #F44336 error · #2DA84D success · #FD9F32 warning
```

### Techniques worth stealing
- **`/llms.txt` + `/llms-full.txt`.** A short and a long LLM-readable summary of the entire site, plus static `.md` mirrors of every doc and blog post at `/docs/{slug}.md` and `/blog/{slug}.md`. This is the single highest-leverage idea on either site — it makes the product correctly describable by ChatGPT/Claude/Perplexity instead of hallucinated. Their `llms.txt` even contains an **"AI Guidance"** section instructing models how to describe the product and explicitly forbidding invented integrations, certs, customers and benchmarks.
- **Rotating hero headline** lets one page target six different search intents.
- **Flat team pricing as the wedge** against per-seat BI. "Unlimited seats" is the whole anti-Tableau argument in two words.
- **Honest hedging in their own AI file:** "Treat these as public marketing examples and case study outcomes, not guaranteed results."
- Segment-named use cases (Finance & RevOps, Operations & Supply Chain, Growth & Product, Enterprise & Manufacturing) let buyers self-identify.

### Weaknesses to beat
- **SPA with no SSR.** Their own `llms-full.txt` admits it: *"Marketing pages are a React SPA; fetch tools that do not run JavaScript only see generic HTML metadata on `/features`, `/pricing`, etc."* They had to hand-maintain a parallel text corpus to compensate. **Verified first-hand:** fetching `https://orcasheets.ai/` as a non-JS crawler returned only the `<title>`. This is a significant, self-inflicted SEO wound — and the reason the plan chooses static-first Astro.
- Keyword-stuffed `<meta name="keywords">` (~50 terms; ignored by Google since 2009, and a mild spam signal).
- Ingestion story (Data Lake / universal endpoint) is bolted on rather than integrated into the main narrative.
- Two brand domains in flight (`orcasheets.ai`, `orcasheets.io`) and **three contact domains** — `hello@orcasheets.io`, `security@orcasheets.com` — which looks unpolished on a page whose subject is trustworthiness.

---

## 3. Head-to-head, and the gap we exploit

| | Duckle | OrcaSheets | **Our opening** |
| --- | --- | --- | --- |
| Category | Open-source ETL | Enterprise analytics | **Both halves, one local engine** |
| Audience | Data engineers | Analysts, finance, enterprise IT | Both, via split solution pages |
| Story starts | Raw source | A question | Raw source |
| Story ends | A loaded table | A dashboard | **A dashboard** |
| Commercial | None | Freemium, closed | **OSS core + paid team/enterprise** |
| Rendering | Static-ish, crawlable | SPA, not crawlable | **Static, fully crawlable** |
| Trust device | Benchmarks + no-telemetry | SOC 2 + local-first | Benchmarks + architecture diagram + no third-party requests |

**The gap:** Duckle gets your data ready and then abandons you. OrcaSheets assumes your data is already ready. Neither one owns the whole sentence *"from raw source to answered question, without leaving your own hardware."* That sentence is the brand.

**Secondary gap:** both sites make you *believe* the local-first claim. Neither one lets you *verify* it. A site that ships zero third-party requests, self-hosted fonts, no trackers, and says so with a measurable claim, proves the product's thesis with its own page weight. That is the differentiator this plan is built around.

---

## 4. Naming & domain research

### Method
RDAP queries against `rdap.org` on 2026-09-21. **Detection was validated in both directions** before any result was trusted:
- `zzqx-nonexistent-947261.{com,dev,ai}` → HTTP 404 (= available) ✅
- `duckle.org`, `orcasheets.ai` → HTTP 200 (= taken) ✅

> ⚠️ **`.io` results were discarded as unreliable.** `github.io` and `docker.io` both falsely reported 404, proving the `.io` registry does not serve public RDAP through this endpoint. Any `.io` candidate must be checked at a registrar by hand.

### Finding: the short-word space is exhausted
**40 single dictionary words across `.com`/`.dev`/`.ai` — zero available.** Not one. This included deliberately obscure choices: `quern.dev`, `solum.dev`, `alluvia.dev`, `basalt.dev`, `riffle.ai`, `headwater.ai`. Squatters have taken the entire pronounceable-single-word space on the TLDs that matter. Compounds are the only realistic path.

Also worth noting: the **aquatic-animal lane is saturated** — DuckDB, MotherDuck, Duckle, Quack, OrcaSheets. Another water creature would read as derivative. The plan deliberately moves to an adjacent metaphor.

### Verified-available shortlist

| Name | Domain | Status (2026-09-21) | Meaning & fit |
| --- | --- | --- | --- |
| **Headrace** | `headrace.ai` | ✅ **AVAILABLE** | The channel that carries water *to* the mill wheel — the intake. Ingestion made literal. Pairs with a coherent village-mill story: you bring your own grain, the mill is in your town, you keep the flour. Reads as infrastructure, not as a toy. **Recommended.** |
| **Quernstone** | `quernstone.ai` | ✅ **AVAILABLE** | A quern is a *hand-operated* stone mill — the machine you turn yourself, locally. The most semantically exact name on the list; also the least familiar word (higher explanation cost). |
| **Tidemill** | `tidemill.ai` | ✅ **AVAILABLE** | A mill driven by tides — power from a source you don't pay for. Memorable, slightly softer. |

`.com` is taken for all three, which is expected and acceptable: the direct comparator ships on `orcasheets.ai`, and `.ai` is now the native TLD for this category.

### Checked and unavailable
`millrace` · `loam` · `sluice` · `quarry` · `hearth` · `kiln` · `strata` · `capstan` · `lodestone` · `grist` · `wheelhouse` · `bellows` · `quern` · `thresher` · `gristmill` · `alluvia` · `cairn` · `solum` · `basalt` · `croft` · `headwater` · `riffle` · `millwright` · `tailrace` · `alluvial` · `millstone` · `winnower` · `stonemill` · `sluicegate`

### Caveats before purchase
1. Availability is **point-in-time (2026-09-21)** and must be re-confirmed at a registrar.
2. RDAP availability ≠ purchasable at base price — `.ai` premium pricing is common and is not visible over RDAP.
3. **No trademark search has been performed.** Required before committing. "Headrace" has existing unrelated commercial use (recruiting/consulting) — likely fine in Class 9/42 software, but must be cleared by counsel.
4. `.io` for all candidates remains **unknown** and needs a manual check.

---

## 5. Sources

- [Duckle](https://duckle.org/)
- [OrcaSheets](https://orcasheets.ai/)
- [OrcaSheets llms.txt](https://orcasheets.ai/llms.txt)
- [OrcaSheets llms-full.txt](https://orcasheets.ai/llms-full.txt)
- [OrcaSheets CSS bundle](https://orcasheets.ai/assets/index-C9xTPrL6.css)
- [rdap.org](https://rdap.org/) — domain registration status

# Implementation Plan — Local-First ETL & Analytics Marketing Site

**Project:** Marketing website for a local-first ETL + analytics product
**Working directory:** `E:\workspace_09212026\LocalETL_WebApp`
**Plan authored:** 2026-09-21
**Status:** 🔴 **AWAITING GO** — no implementation begins until the user says **"start"**

Companion documents:
- [RESEARCH_COMPETITIVE.md](RESEARCH_COMPETITIVE.md) — teardown of Duckle & OrcaSheets, naming/domain research
- [TASK_TRACKER.md](TASK_TRACKER.md) — live completed/deferred task register
- [COMMANDS.md](COMMANDS.md) — log of every command executed

---

## 1. Locked decisions

These were confirmed with the user on 2026-09-21 and are the fixed premises of this plan.

| # | Decision | Choice | Consequence |
| --- | --- | --- | --- |
| D1 | Tech stack | **Astro + Tailwind CSS** (install Node LTS via winget first) | Static HTML output, excellent SEO, islands only where interactivity is needed |
| D2 | Positioning | **Unified: one local engine, ingest → transform → analyze** | Hero owns the whole loop; two audience-specific solution tracks beneath |
| D3 | Site scope | **Full marketing site, ~18 routes** | Docs + blog + comparison pages included in v1 |
| D4 | Content truth | **Nothing built yet — honest placeholders only** | No invented benchmarks, customers, logos or certifications. Enforced by a claims register |
| D5 | Brand name | **Propose shortlist; user picks before build** | All code written against a `BRAND` token for one-pass rename |
| D6 | Visual direction | **Hybrid: light marketing pages, dark product surfaces** | Business buyers stay comfortable; engineers see a real tool |
| D7 | Hosting | **Host-agnostic**, configs for Vercel/Netlify/Cloudflare/GH Pages | Decide at launch, no rebuild |
| D8 | Commercial model | **Open-source core + paid Team/Enterprise tiers** | GitHub is a first-class CTA; 4-tier pricing page |

### Environment as verified on this machine
| Tool | Status |
| --- | --- |
| git 2.55.0.windows.5 | ✅ present |
| Python 3.12.10 | ✅ present |
| winget | ✅ present |
| Node / npm | ❌ **absent — Phase 0 installs it** |
| Bash tool (`/usr/bin/bash`) | ⚠️ broken — no coreutils on PATH. **Use the PowerShell tool for all shell work.** |
| Git repository | ❌ not initialised — Phase 0 initialises it |

---

## 2. Brand decision — required before Phase 1

Full research and method in [RESEARCH_COMPETITIVE.md §4](RESEARCH_COMPETITIVE.md). Headline finding: **40 single dictionary words were checked across `.com`/`.dev`/`.ai` and zero were available.** Compounds are the only realistic path. The aquatic-animal lane (DuckDB, MotherDuck, Duckle, Quack, OrcaSheets) is saturated, so the shortlist moves to an adjacent metaphor: **the village mill** — you bring your own grain, the mill is in your town, you keep the flour. That is local-first, stated as a 900-year-old idea rather than a tech slogan.

| Name | Domain | Verified 2026-09-21 | Why it works | Risk |
| --- | --- | --- | --- | --- |
| **Headrace** ⭐ | `headrace.ai` | ✅ available | The channel carrying water *to* the mill wheel — the intake. Ingestion made literal. Sounds like infrastructure. Easy to spell from hearing it. | Existing unrelated commercial use in recruiting — needs a Class 9/42 clearance |
| **Quernstone** | `quernstone.ai` | ✅ available | A quern is a *hand-operated* stone mill — the machine you turn yourself. Semantically the most exact name here. | Unfamiliar word; higher explanation cost; 3 syllables |
| **Tidemill** | `tidemill.ai` | ✅ available | Power from a source you don't pay for. Warm and memorable. | Slightly softer; "tide" hints at cloud-scale, mildly off-message |

**Recommendation: `Headrace` / headrace.ai.**

**Before purchase — mandatory:**
1. Re-confirm availability at a registrar (this check is point-in-time).
2. Check `.ai` premium pricing (not visible over RDAP).
3. **Trademark clearance by counsel** — no TM search has been performed.
4. Check `.io` manually (the `.io` registry does not serve public RDAP; all `.io` results were discarded).
5. Secure matching GitHub org and social handles.

> **If the user has not chosen by the time Phase 1 starts,** build proceeds against the literal token `__BRAND__` wired through `src/config/brand.ts`, renameable in a single pass. This is a stated fallback, not a delay.

---

## 3. Product narrative

### The one-sentence claim
> **From raw source to answered question — without your data leaving your own hardware.**

### Why this wins
Duckle stops at the loaded table. OrcaSheets starts at the question. Neither owns the sentence above. Our site tells one continuous story across three acts:

| Act | Section | Proof device |
| --- | --- | --- |
| **Ingest** | Connect anything — databases, warehouses, files, object stores, APIs | Connector grid with an honest available/planned split |
| **Transform** | Visual canvas that compiles to readable SQL — never a black box | Canvas → generated-SQL side-by-side |
| **Analyze** | Ask in plain English or SQL; pivot, chart, dashboard, share | Question → SQL → chart in one frame |

Binding all three: **one engine, one machine, zero egress.**

### Message hierarchy
1. **Primary (rational):** the whole pipeline runs on hardware you already own.
2. **Secondary (economic):** no per-row billing, no per-seat billing, no warehouse bill for ad-hoc work.
3. **Tertiary (emotional):** you can read every query it generates. Nothing is hidden from you.

### Differentiator we can prove on day one
**The site itself makes zero third-party network requests.** Self-hosted fonts, no Google Fonts, no GTM, no CDN-loaded trackers, privacy-respecting analytics only. Then we say so on the page, with the number. A site about data sovereignty that phones home to four vendors is an argument against itself — this is the cheapest credibility on the whole project, and neither reference site does it.

### Voice
Plain, specific, unhurried. Numbers with units. No "revolutionary", no "seamless", no "unleash". Anti-claims are allowed and encouraged ("no telemetry", "no account required") because they are falsifiable. Every superlative must be replaceable by a measurement — if it can't be, it gets cut.

---

## 4. Information architecture (18 routes)

```
/                                 Home
/features                         Full capability matrix
/how-it-works                     Architecture: ingest → transform → analyze
/integrations                     Connector catalogue, filterable
/pricing                          OSS · Pro · Team (flat) · Enterprise
/security                         Local-first architecture, data handling, deployment
/download                         macOS · Windows · Linux · pip · agent prompt
/solutions/data-engineers         ETL-first track (Duckle's audience)
/solutions/analysts               Analytics-first track (OrcaSheets' audience)
/solutions/enterprise             On-prem, VPC, SSO, air-gapped, sovereignty
/compare/[slug]                   vs-fivetran · vs-airbyte · vs-tableau-power-bi · vs-talend
/docs                             Docs hub
/docs/[slug]                      6 seed articles
/blog                             Blog index
/blog/[slug]                      4 seed posts
/about                            Team, mission, open-source commitment
/contact                          Sales, support, security contact
/404                              Not found

Generated, not authored:
/llms.txt  /llms-full.txt  /sitemap.xml  /robots.txt  /rss.xml
/docs/{slug}.md  /blog/{slug}.md        ← static markdown mirrors for AI crawlers
```

### Home page section order
1. Hero — rotating headline (6 variants, one per search intent), trust bar, dual CTA (Download / View on GitHub)
2. Logo-free trust strip — licence, platforms, "no account, no telemetry"
3. Act I — Ingest (connector grid)
4. Act II — Transform (canvas → SQL)
5. Act III — Analyze (question → chart)
6. Architecture diagram — where data sits and where it never goes
7. Solutions — 3 audience cards
8. Performance proof — benchmark cards `[PLACEHOLDER]`
9. Local AI — on-device assistant, no API key
10. Pricing teaser
11. FAQ — 14–18 questions, keyword-targeted, schema.org `FAQPage`
12. Get started — 3 install paths incl. the AI-agent prompt
13. Footer — 4 columns

### The `/compare/*` pages are deliberate
Duckle buries competitor displacement inside FAQ answers. Dedicated comparison pages capture the same high-intent traffic far better, and the Talend Open Studio EOL (31 Jan 2024) audience is stranded and actively migrating. Each page: honest table, "when to pick them instead" section (credibility), migration path.

---

## 5. Design system

Deliberately distinct from both reference sites. OrcaSheets is Lexend + indigo `#566DC6`; Duckle is a plain blue-on-dark. We go elsewhere.

### Colour tokens
```
Primary     #0E7C66   deep teal-green — "ground", on-prem, trust
Primary-dk  #0A5F4E   hover/active
Accent      #E8822B   amber — the mill fire; CTAs and highlights only
Ink         #0B1220   near-black navy — body text
Muted       #5A6472   secondary text
Surface     #FFFFFF   marketing page background
Subtle      #F6F8F7   alternating section background
Border      #E3E8E6
Product-bg  #0D1117   dark frames for all product screenshots/diagrams
Product-fg  #E6EDF3
Success #2E9E6B · Warning #E8A33D · Error #D64545
```
Full light/dark toggle sitewide via `data-theme`, respecting `prefers-color-scheme`. Product surfaces stay dark in **both** themes — that is the point of D6.

### Typography
- Headings + body: **Geist** (self-hosted via `@fontsource`)
- Code, SQL, metrics: **Geist Mono**
- **Self-hosted, not Google Fonts** — no third-party request, consistent with §3
- Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72px, fluid via `clamp()`

### Layout
- Container 1200px, 24px gutter
- 8px spacing scale; section rhythm 96px desktop / 56px mobile
- Radius 10px cards, 8px buttons, 6px inputs
- Breakpoints 640 / 768 / 1024 / 1280
- Shadows: two levels only, both very soft

### Imagery — no fake screenshots
The product does not exist yet (D4). Rather than mock up fake UI that will date badly, product visuals are **hand-authored inline SVG** in the dark product frame: pipeline canvas diagrams, architecture flows, query→result panels. These are honest (clearly illustrative), theme-aware, zero-weight, accessible, and instantly editable. Replaced with real screenshots when the product ships (Phase 8).

---

## 6. Honesty policy — enforced, not aspirational

Per D4, the product does not exist. The site must sell the vision without asserting facts that are not true.

**Hard rules:**
- ❌ No invented benchmark numbers, customer names, testimonials, customer logos, star counts, download counts
- ❌ No claimed certifications (SOC 2, ISO 27001, HIPAA, GDPR compliance outcomes)
- ❌ No "trusted by N companies"
- ✅ Architectural claims are fine (local execution, no egress) — they describe the design
- ✅ Aspirational copy is fine when framed as intent, not as measurement

**Mechanism:**
1. Every unverified figure is rendered through a `<Claim>` component carrying `status="placeholder"`, which emits `data-claim-status="placeholder"` into the DOM.
2. `CLAIMS.md` is a register: every numeric/factual claim on the site, its page, its current value, and `REAL | PLACEHOLDER | ASPIRATIONAL`.
3. A build-time check (`npm run check:claims`) fails the build if any placeholder claim is missing from the register.
4. A **pre-launch gate** in Phase 7 lists every remaining placeholder. Launching with placeholders is the user's explicit call, not a silent default.
5. Our own `llms.txt` carries an AI-guidance section — like OrcaSheets' — forbidding models from inventing integrations, certs, customers or benchmarks about us.

---

## 7. Phased delivery

Nine phases. Each has an explicit exit criterion; nothing proceeds until it is met. Estimates are working sessions, not calendar days.

---

### Phase 0 — Foundation & environment ⏱ ~0.5
**Goal:** a working toolchain and a clean repo before a single line of site code.

- [ ] Install Node.js LTS via `winget install OpenJS.NodeJS.LTS`; verify `node -v`, `npm -v` in a fresh shell
- [ ] `git init`; author identity; `main` branch
- [ ] `.gitignore` (node_modules, dist, .astro, .env*, .DS_Store, *.log)
- [ ] `.editorconfig`, `.nvmrc`
- [ ] Seed `COMMANDS.md` and `TASK_TRACKER.md`
- [ ] `LICENSE` for site source, `CONTRIBUTING.md` stub
- [ ] **First commit** (only after the user says "start")

**Exit:** `node -v` and `npm -v` succeed; `git log` shows one commit.
**Risk:** winget install does not update the current shell's PATH → open a fresh shell, or fall back to the official MSI.

---

### Phase 1 — Scaffold & design system ⏱ ~1.5
**Goal:** every visual decision made once, centrally, so later phases are assembly.

- [ ] `npm create astro@latest` — minimal, TypeScript strict
- [ ] Add `@astrojs/tailwind`, `@astrojs/mdx`, `@astrojs/sitemap`, `astro-icon`
- [ ] `src/config/brand.ts` — the single `BRAND` token (D5 rename point)
- [ ] `tailwind.config.mjs` — all §5 tokens, no ad-hoc values permitted downstream
- [ ] `@fontsource-variable/geist` + `geist-mono`, self-hosted, preloaded, `font-display: swap`
- [ ] `src/styles/global.css` — resets, theme variables, `data-theme` dark mode
- [ ] `BaseLayout.astro` — `<head>`, meta, OG, JSON-LD, skip-link, theme script (inline, pre-paint, no FOUC)
- [ ] Primitives: `Button` `Card` `Section` `Container` `Badge` `Tabs` `Accordion` `CodeBlock` `Prose`
- [ ] `Header` (responsive nav + mobile drawer + theme toggle), `Footer` (4 columns)
- [ ] `ProductFrame.astro` — the dark chrome wrapper all product visuals sit in
- [ ] `Claim.astro` — the §6 honesty component
- [ ] Prettier + ESLint + `astro check`; npm scripts
- [ ] `/styleguide` route rendering every token and primitive in both themes

**Exit:** `/styleguide` renders correctly in light and dark; `astro check` clean; zero third-party network requests in the Network tab.

---

### Phase 2 — Home page ⏱ ~2
**Goal:** the page that has to work. Everything else supports it.

- [ ] All 13 sections from §4
- [ ] `RotatingHeadline` island — 6 variants, `prefers-reduced-motion` respected, first variant server-rendered so crawlers and no-JS users see real text
- [ ] `ConnectorGrid` — honest available/planned split, category-grouped
- [ ] `PipelineCanvas` inline SVG — nodes, edges, generated-SQL panel
- [ ] `ArchitectureDiagram` inline SVG — trust boundary drawn explicitly; the single most important image on the site
- [ ] `QueryToChart` SVG — plain English → SQL → chart
- [ ] `FAQ` accordion + `FAQPage` JSON-LD
- [ ] `InstallPaths` — desktop / pip / **AI-agent prompt** with copy-to-clipboard
- [ ] Every number routed through `<Claim>`; `CLAIMS.md` created

**Exit:** home page complete at 360px / 768px / 1440px, both themes, keyboard-navigable, Lighthouse ≥95 all four categories.

---

### Phase 3 — Core product pages ⏱ ~2
- [ ] `/features` — capability matrix across ingest/transform/analyze/govern
- [ ] `/how-it-works` — deep architecture, execution model, where data lives, what crosses the boundary
- [ ] `/integrations` — filterable catalogue island (search + category + status), honest counts, "request a connector" CTA
- [ ] `/download` — OS auto-detect, checksums section, install paths, system requirements

**Exit:** all four pages responsive, themed, in nav and sitemap; connector data lives in one typed source file.

---

### Phase 4 — Commercial & trust pages ⏱ ~1.5
- [ ] `/pricing` — 4 tiers per D8 (OSS Free · Pro · Team flat · Enterprise), monthly/annual toggle, comparison table, pricing FAQ, **amounts as `[TODO]` placeholders** unless the user supplies them
- [ ] `/security` — local-first architecture, exactly what optional cloud features would transmit, deployment topologies, air-gapped, vuln-disclosure contact. **No certification claims** (D4/§6)
- [ ] `/solutions/data-engineers`, `/solutions/analysts`, `/solutions/enterprise`
- [ ] `/about` — mission, open-source commitment, no fabricated team bios
- [ ] `/contact` — routed contact form (sales / support / security), **one domain for all addresses** (an OrcaSheets mistake worth not repeating)

**Exit:** 7 pages live; `CLAIMS.md` updated; no unmarked claims anywhere.

---

### Phase 5 — Content engine ⏱ ~2
**Goal:** the SEO and AI-discoverability machine.

- [ ] Astro Content Collections with Zod schemas for `docs`, `blog`, `compare`
- [ ] `/docs` hub + sidebar nav + on-page TOC + prev/next + search island
- [ ] 6 seed doc articles: installation · quickstart · connecting-a-source · building-a-pipeline · querying-your-data · deployment
- [ ] `/blog` index + post layout + RSS
- [ ] 4 seed posts, each one targeting real search intent:
  - "What local-first ETL actually means"
  - "Why your warehouse bill is mostly ad-hoc queries"
  - "Reading the SQL your pipeline generates"
  - "Migrating off Talend Open Studio after EOL"
- [ ] 4 `/compare/*` pages — honest tables incl. a "when to pick them instead" section
- [ ] **`.md` mirror generator** — emits `/docs/{slug}.md` and `/blog/{slug}.md` at build time, so no parallel corpus is ever hand-maintained (OrcaSheets' hand-maintained version is the thing to avoid)

**Exit:** every content route renders; `.md` mirrors generated automatically; RSS validates.

---

### Phase 6 — SEO, AI discoverability & performance ⏱ ~1.5
- [ ] Per-page title/description/canonical; OG + Twitter cards; generated OG images
- [ ] JSON-LD: `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `Article`
- [ ] `sitemap.xml`, `robots.txt`
- [ ] **`/llms.txt` and `/llms-full.txt`, generated from content collections** — including the AI-guidance section from §6 that forbids models inventing facts about us
- [ ] **No `<meta name="keywords">`** — ignored since 2009, mild spam signal, and OrcaSheets' ~50-term tag is the clearest mistake on their site
- [ ] Image pipeline: AVIF/WebP, explicit dimensions, lazy below the fold
- [ ] Budgets enforced: JS ≤ 80KB gzip, LCP < 1.5s, CLS < 0.05, TBT < 150ms
- [ ] **Verify zero third-party requests** — this is the §3 differentiator; it gets a test, not a hope

**Exit:** Lighthouse ≥95 ×4 on all routes; rich-results validation passes; third-party request count is exactly 0.

---

### Phase 7 — Accessibility, QA & deploy ⏱ ~1.5
- [ ] WCAG 2.2 AA audit — contrast, focus-visible, landmarks, heading order, alt text, form labels, reduced-motion
- [ ] Full keyboard pass; screen-reader pass on nav, accordion, tabs, drawer, filters
- [ ] Cross-browser: Chrome, Firefox, Edge, Safari (incl. iOS)
- [ ] Link checker; 404 page; redirects
- [ ] Deploy configs: `vercel.json`, `netlify.toml`, Cloudflare Pages, GH Pages workflow, `Dockerfile` + nginx (D7)
- [ ] Security headers incl. a strict CSP (easy, because there is nothing third-party to allow)
- [ ] Privacy-respecting analytics — self-hosted or cookieless, documented on `/security`
- [ ] `README.md` — run, build, edit content, rename brand, deploy
- [ ] **Pre-launch gate:** print every outstanding `[PLACEHOLDER]` for the user's explicit sign-off

**Exit:** zero critical a11y issues; production build deploys cleanly to at least one target; placeholder report delivered.

---

### Phase 8 — Post-launch (deferred by default) ⏱ TBD
Not started unless the user asks. Tracked in `TASK_TRACKER.md` as deferred.
- Real screenshots replacing illustrative SVGs
- Real benchmarks replacing placeholders
- Case studies once customers exist
- i18n, changelog, careers, status page
- Newsletter, demo booking, in-browser interactive demo
- A/B testing on hero variants

---

## 8. Proposed repository layout

```
LocalETL_WebApp/
├── IMPLEMENTATION_PLAN.md        ← this file
├── RESEARCH_COMPETITIVE.md
├── TASK_TRACKER.md
├── COMMANDS.md
├── CLAIMS.md                     ← created in Phase 2
├── README.md
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── fonts/  favicon/  og/  robots.txt
└── src/
    ├── config/     brand.ts  nav.ts  site.ts
    ├── data/       connectors.ts  pricing.ts  faq.ts
    ├── components/ ui/  sections/  diagrams/  islands/
    ├── layouts/    BaseLayout  DocsLayout  BlogLayout
    ├── content/    docs/  blog/  compare/
    ├── pages/
    └── styles/
```

---

## 9. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Brand not chosen before Phase 1 | Rework across every page | Everything routes through `BRAND` in `src/config/brand.ts`; rename is one pass |
| `headrace.ai` gets registered before purchase | Restart naming | Two verified alternates on the shortlist; buy early |
| Trademark conflict | Forced rebrand post-launch | **Clearance before purchase** — flagged as mandatory in §2 |
| Node install doesn't hit PATH | Phase 0 stalls | Fresh shell; MSI fallback |
| Placeholders reach production | Credibility damage, possible legal exposure | `CLAIMS.md` register + build-time check + Phase 7 sign-off gate |
| Site over-promises vs. a product that doesn't exist | Trust damage at launch | §6 honesty policy; aspirational copy framed as intent |
| JS budget creep from islands | SEO/perf regression | Astro is static by default; budget enforced in CI from Phase 6 |
| Scope creep from 18 → 30 routes | Nothing ships | Phase 8 is the parking lot; deferrals go in the tracker |

---

## 10. Definition of done (v1)

- 18 routes live, responsive 360→1920px, light + dark
- Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO on every route
- WCAG 2.2 AA, zero critical issues
- **Zero third-party network requests** — the product's own thesis, demonstrated
- `llms.txt`, `llms-full.txt`, `.md` mirrors, sitemap, RSS all generated at build
- Every claim in `CLAIMS.md`, every placeholder signed off
- Deployable to any of four targets from one build
- README lets someone else run, edit and deploy it

---

## 11. Working agreements

Standing instructions from the user for this project:

1. **No implementation until the user says "start".** This plan is the deliverable for now.
2. **No git commits until the user says "start".**
3. **Every command executed gets logged** to [COMMANDS.md](COMMANDS.md).
4. **Completed and deferred tasks tracked** in [TASK_TRACKER.md](TASK_TRACKER.md).
5. Work proceeds phase by phase; each phase's exit criterion is met before the next begins.
6. Use the **PowerShell tool** for shell work — the Bash tool is broken in this environment.

---

## 12. Open questions for the user

Not blocking — Phase 0 and 1 can start without answers — but each will need one eventually.

1. **Brand:** Headrace, Quernstone, Tidemill, or your own? (Needed before Phase 1 ends; fallback is `__BRAND__`.)
2. **Pricing amounts:** real figures for Pro and Team, or `[TODO]` placeholders? (Phase 4)
3. **GitHub org/repo URL** for the OSS CTA — does it exist yet? (Phase 2)
4. **Contact email domain** — one domain for hello@ / security@ / sales@. (Phase 4)
5. **Licence for the product core** — MIT, Apache-2.0, dual, or BSL? Shapes the whole OSS narrative. (Phase 4)
6. **Contact form backend** — a real endpoint, or `mailto:` for v1? (Phase 7)
7. **Analytics** — self-hosted Plausible/Umami, or none at all? ("None" is the strongest story.) (Phase 7)

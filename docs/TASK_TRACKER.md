# Task Tracker

**Project:** Local-first ETL & analytics marketing site (working brand: **Headrace**)
**Last updated:** 2026-09-23
**Status:** ⏸️ **PAUSED at a clean boundary.** All 8 phases complete; v1 is
build-complete and verified. Resume instructions: **[RESUME_HERE.md](RESUME_HERE.md)**

> ⏸️ **Site ↔ product sync: plan awaiting approval (2026-09-23).** The site was audited
> against the engine, then re-audited after the engine's Phases 10a–10c. The user answered all
> 8 questions in [QUESTIONS_site_product_sync.md](QUESTIONS_site_product_sync.md) as
> recommended. **[PLAN_site_product_sync.md](PLAN_site_product_sync.md)** (S1 connectors, S2
> feature claims and roadmap, S3 docs, S4 register and checks) is written and waits for
> "start". No site changes yet.

> ✅ **Everything is pushed.** Local `main` and `origin/main` are in sync.
> (An earlier note here warned of two unpushed commits; that was true when
> written and is no longer.)

Legend: ✅ done · 🔄 in progress · ⬜ not started · ⏸️ deferred · 🚫 blocked · ❓ needs user decision

---

## At a glance

| | |
| --- | --- |
| **Phases complete** | 8 of 8 (Phase 8 partial — rest blocked on a product that exists) |
| **Routes building** | **45** — 32 HTML + 10 Markdown mirrors + RSS + 2 sitemaps |
| **Lighthouse** | **100 / 100 / 100 / 100** across 6 routes |
| **WCAG 2.2 AA** | **0 violations** across 58 page-loads (29 routes × 2 themes) |
| **Cross-browser** | Chromium, Firefox, WebKit all pass |
| **Internal links** | 1505 checked, **0 broken** |
| **Shipped weight** | 41.7 KB CSS, 2.4 KB JS (uncompressed) |
| **Third-party requests** | **0** — enforced at build time |
| **CSP** | 7 inline script hashes, **no `unsafe-inline`**, verified in-browser |
| **Fabricated metrics on site** | **0** |
| **Outstanding placeholders** | 3 (2 real: pricing.pro, pricing.team) |

| Phase | Name | Status | Commit |
| --- | --- | --- | --- |
| — | Research & planning | ✅ complete | — |
| 0 | Foundation & environment | ✅ complete | `7881a3a` |
| 1 | Scaffold & design system | ✅ complete | `7881a3a` |
| 2 | Home page | ✅ complete | `ba23557` |
| 3 | Core product pages | ✅ complete | `02e5e84` |
| 4 | Commercial & trust pages | ✅ complete | `90a6f55` |
| 5 | Content engine | ✅ complete | `0b1a3a0` |
| 6 | SEO, AI discoverability & performance | ✅ complete | `59be558` |
| 7 | Accessibility, QA & deploy | ✅ complete | `027b227` |
| 8 | Post-launch | ✅ **buildable subset done**; rest blocked | — |

### Phase 8 — Post-launch ✅ (partial by necessity)

Most of the Phase 8 parking list is **blocked on things that do not exist**.
Building placeholder versions would break the honesty rule the site is built
on, so they stayed unbuilt. Delivered the subset that is genuinely buildable
today:

| Delivered | Why it was worth doing now |
| --- | --- |
| **`/roadmap`** | The page a pre-launch product most obviously needs. Three stages, **no dates** — order is a commitment, timing is not. Includes a "what will not be built" section (no hosted cloud, no usage pricing, no telemetry, no cluster mode, no proprietary format), which is the part a competitor's roadmap never has. |
| **`/changelog`** | A real content collection, currently empty and saying so. Exists rather than 404s, and the first release is a Markdown file instead of a feature. |
| **`scripts/rebrand.mjs`** | Turns open question Q1 from a 40-file refactor into one command. Dry-run verified: 75 occurrences across 22 files, correctly ordered (domain before slug) and correctly skipping the planning documents, which are a historical record. |
| Roadmap in `/llms-full.txt` | "What does it do and when" is exactly what an AI gets asked about a pre-launch product. |

**Left unbuilt, and why** — each needs something that does not exist yet:

| Item | Blocked on |
| --- | --- |
| Real product screenshots | A working product |
| Real benchmarks | Something to measure |
| Case studies, testimonials, logos | Customers |
| In-browser interactive demo | The engine compiled to WASM |
| A/B testing hero variants | Traffic **and** analytics we have committed not to have — this one is permanently off unless that commitment changes |
| Newsletter / demo booking | A backend, and it conflicts with the footer's no-tracker claim |
| Status page | Something to monitor |
| Careers page | A company to hire into |
| i18n | A demand signal; large ongoing cost for none |

### Phase 6 — SEO & AI discoverability ✅ `59be558`
Generated `/llms.txt` (7.6 KB) and `/llms-full.txt` (31.2 KB) from the page
manifest and content collections, both carrying explicit anti-fabrication
guidance for AI systems · `robots.txt` deliberately allowing AI crawlers ·
`src/config/pages.ts` as the single metadata source, resolved by `BaseLayout`
on pathname so the mirror cannot drift · 30 generated OG cards ·
`BreadcrumbList` JSON-LD · `check-external.mjs` and `check-perf.mjs` ·
**Lighthouse 100 ×4** · fixed two a11y defects the audit found (`--c-faint`
failing AA in both themes; logo `aria-label` not containing its visible text)

### Phase 7 — Accessibility, QA & deploy ✅
- `/404` page with real suggested destinations
- **`check-a11y.mjs`** — full axe ruleset, every route × both themes, plus a
  keyboard-focusability sweep. Found **14 violations across 3 rules** that the
  Lighthouse spot-check had missed; all fixed, second run clean
- **`check-links.mjs`** — 1505 links, 0 broken
- **`check-claims.mjs`** — the pre-launch gate. Enumerates placeholders from
  the DOM and greps for phrases we have committed never to use. Reports rather
  than fails: shipping with a placeholder is a human decision
- **`gen-headers.mjs`** — security headers with a **per-script-hash CSP**, no
  `unsafe-inline`, generated during the build so hashes cannot go stale
- **`check-csp.mjs`** — serves `dist/` behind the real headers and drives the
  theme toggle and connector filter, because `astro preview` does not apply
  `_headers` and a broken CSP would only surface after deploy
- **`check-browsers.mjs`** — Chromium, Firefox, WebKit all pass
- Deploy configs: `netlify.toml`, `vercel.json`, `Dockerfile` +
  `deploy/nginx.conf`, GitHub Actions workflow; Cloudflare Pages reads the
  same generated `_headers`
- `README.md`

---

## Routes live today (42)

**Marketing (11)**
`/` · `/features` · `/how-it-works` · `/integrations` · `/pricing` · `/security` ·
`/download` · `/about` · `/contact` · `/styleguide` *(noindex)* · plus `/solutions` ×3

**Solutions (3)**
`/solutions/data-engineers` · `/solutions/analysts` · `/solutions/enterprise`

**Comparisons (4)**
`/compare/fivetran` · `/compare/airbyte` · `/compare/tableau-power-bi` · `/compare/talend`

**Docs (7)**
`/docs` · `/docs/installation` · `/docs/quickstart` · `/docs/connecting-a-source` ·
`/docs/building-a-pipeline` · `/docs/querying-your-data` · `/docs/deployment`

**Blog (5)**
`/blog` · `/blog/what-local-first-etl-means` ·
`/blog/your-warehouse-bill-is-ad-hoc-queries` ·
`/blog/read-the-sql-your-pipeline-generates` ·
`/blog/migrating-off-talend-open-studio`

**Machine-readable (13)**
10 × `.md` mirrors (6 docs + 4 blog) · `/rss.xml` · `/sitemap-index.xml` · `/sitemap-0.xml`

> Still to come in Phase 6: `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/404`.

---

## ✅ Completed in detail

### Research & planning — 2026-09-21
- Full teardown of **duckle.org** and **orcasheets.ai**
- OrcaSheets stack + design tokens extracted from their built assets (Vite + React +
  Radix, Lexend, primary `#566DC6`)
- **94 RDAP domain queries**, detection validated in both directions before trusting any
  result
- 8 decisions locked with the user (D1–D8)
- 4 planning documents authored

**Findings that changed the plan:**
- 40 single dictionary words across `.com`/`.dev`/`.ai` → **zero available**. Compounds
  are the only path.
- `.io` RDAP is unreliable via rdap.org (`github.io`/`docker.io` falsely reported free) →
  **all `.io` results discarded**.
- Verified available: `headrace.ai`, `quernstone.ai`, `tidemill.ai`.
- OrcaSheets' SPA is invisible to non-JS crawlers — **confirmed first-hand**, and the
  reason decision D1 chose static-first Astro.

### Phase 0 — Foundation ✅ `7881a3a`
- Node 24.19.0 LTS installed via winget (none was present on the machine)
- git repo initialised on `main`, identity configured
- `.gitignore` · `.editorconfig` · `.nvmrc` · `.prettierrc.json` · `.prettierignore`
- `LICENSE` (site source only — product licence still undecided) · `CONTRIBUTING.md`

### Phase 1 — Design system ✅ `7881a3a`
- Astro **7.3.3** + Tailwind **4.3.3** via `@tailwindcss/vite`, MDX, sitemap
- CSS-first tokens; runtime theming via `@theme inline` + `[data-theme]`
- Palette deliberately distinct from both references: deep teal `#0E7C66`, amber
  `#E8822B`
- **Product surfaces stay dark in both themes** (decision D6)
- Geist + Geist Mono self-hosted, latin subset only (51 KB total), preloaded
- 12 primitives: Button · Card · Badge · Section · SectionHeading · Accordion ·
  CodeBlock · ProductFrame · Icon · Logo · ThemeToggle · Claim
- `/styleguide` route rendering every token and primitive in both themes
- `astro-icon` dropped in favour of build-time Iconify inlining — one fewer dependency,
  one fewer runtime fetch

### Phase 2 — Home page ✅ `ba23557`
- 13 sections following one continuous argument: ingest → transform → analyse
- **Stable h1** with only the closing clause rotating (OrcaSheets rotates the whole
  headline, which leaves the h1 ambiguous to crawlers)
- Hand-authored SVG: `PipelineCanvas` (canvas → compiled SQL) and `ArchitectureDiagram`
  (the trust boundary, drawn explicitly)
- 16-question FAQ with `FAQPage` JSON-LD
- 3 install paths including an AI-agent prompt for Claude Code / Cursor / Codex
- **Zero fabricated metrics** — `CLAIMS.md` created and records why
- `SITE.preLaunch` flag drives every honesty disclosure from one switch

### Phase 3 — Core product pages ✅ `02e5e84`
- `/features` — 28 capabilities across 5 groups, sticky jump nav
- `/how-it-works` — 5-step execution model, trust boundary, **"what this is not good
  at"** section naming 4 real limits
- `/integrations` — 46 connectors in 6 categories, search + category filter in ~40 lines
  of vanilla JS; states outright that 0 work today
- `/download` — leads with "there is nothing to download yet" rather than a dead button
  or an email-harvesting waitlist
- `PageHero` component with optional pre-launch disclosure

### Phase 4 — Commercial & trust ✅ `90a6f55`
- `/pricing` — leads with **commitments** (never per row / per connector / per seat / no
  metering) because amounts are undecided; amounts render as "Not set" carrying
  `data-claim-status="placeholder"`
- `/security` — feature-by-feature transmission table with 3 rows honestly marked "only
  if enabled"; **"What we do not claim"** states we hold no certifications
- `/solutions/*` ×3 via one dynamic route, each with a "when this is the wrong tool"
  section
- `/about` · `/contact` (working mailto composer, no backend, collects nothing)
- `scripts/check-icons.mjs` wired into `npm run build`

### Phase 5 — Content engine ✅ `0b1a3a0`
- Content collections with Zod schemas: `docs`, `blog`, `compare`
- `DocsLayout` — sidebar grouped by section, prev/next pagination
- Hand-written `Prose` styles (not `@tailwindcss/typography`, whose defaults fight the
  tokens and won't keep code blocks on the dark product palette)
- **6 docs articles**, **4 blog posts**, **4 comparison pages**
- `/rss.xml`
- **Generated `.md` mirrors** — from the same collection entries the HTML renders from,
  so they cannot drift
- Shiki set to `github-dark-default` to stop highlighted code clashing with the diagrams
- The `compare` schema **requires** `pickThemWhen` (`.min(1)`): a comparison page cannot
  be published without stating when the competitor is the better choice

---

## Verification suite

Eight checks, each written because something broke or because the site makes a
claim that should be enforced rather than trusted.

| Command | Checks | In `build` |
| --- | --- | --- |
| `check:icons` | Every `<Icon name>` resolves | ✅ |
| `check:external` | No third-party resource references | ✅ |
| `check:links` | All internal links resolve | |
| `check:claims` | Placeholder claims + forbidden phrases | |
| `check:a11y` | WCAG 2.2 AA, all routes × both themes, keyboard sweep | |
| `check:perf` | Bytes, requests, LCP, CLS against budget | |
| `check:browsers` | Chromium, Firefox, WebKit | |
| `check:csp` | Site works under the generated CSP | |

---

## ⏸️ Deferred

| # | Item | Why deferred | Revisit when |
| --- | --- | --- | --- |
| D-1 | Real product screenshots | Product doesn't exist; illustrative SVG used instead | Product ships |
| D-2 | Real benchmark numbers | Nothing has been run, so nothing has been measured | First working build |
| D-3 | Customer logos, testimonials, case studies | No customers; fabricating them is forbidden by plan §6 | First reference customer |
| D-4 | Certification claims (SOC 2, ISO 27001, HIPAA) | Hold none. Site says so explicitly | If/when audited |
| D-5 | i18n / multi-language | No demand signal; large ongoing cost | Post-launch traffic data |
| D-6 | Changelog, careers, status pages | No content to put in them | Post-launch |
| D-7 | Newsletter, demo booking | Needs a backend and a list; footer currently claims no trackers | Phase 8 |
| D-8 | In-browser interactive demo | Needs the engine compiled to WASM | Product maturity |
| D-9 | A/B testing hero variants | Needs traffic to mean anything | 1k+ sessions/mo |
| D-10 | `.io` domain availability check | `.io` registry serves no public RDAP | Before purchase |
| D-11 | Docs search | 6 articles don't justify the JS | ~20 articles |
| D-12 | Per-page table of contents | Current articles are short enough | Longer docs |

---

## ❓ Open decisions

| # | Question | Needed by | Current fallback |
| --- | --- | --- | --- |
| Q1 | **Brand name** | Before launch | 🔄 **Direction settled 2026-09-22: staying Headrace.** Switching would move the same unresolved risk onto a weaker name — no candidate has a bought domain or trademark clearance. **Still blocked on:** registrar check + clearance by counsel. Until both land the name stays provisional and the site's hedging stays. To change it anyway: `npm run rebrand -- --name X --domain x.ai --dry` |
| Q2 | Real pricing amounts for Pro & Team | Before launch | Renders "Not set", flagged as placeholder |
| Q3 | GitHub org/repo URL | Before launch | `github.com/headrace/headrace` in `site.js` |
| Q4 | Contact email domain | Before launch | `hello@ / sales@ / security@ headrace.ai` |
| Q5 | Product core licence — MIT / Apache-2.0 / dual / BSL | Before launch | Copy says "open source" without naming one |
| Q6 | Contact form backend | — | ✅ **Resolved:** working mailto composer, no backend |
| Q7 | Analytics — self-hosted or none | Phase 7 | **None** — already claimed in the footer |

---

## 🚫 Blocked

| Item | Blocked by |
| --- | --- |
| Phase 6 start | Awaiting user confirmation (standing instruction: confirm between phases) |
| Domain purchase | Trademark clearance + registrar re-check (plan §2) |
| Replacing placeholders | Answers to Q1–Q5 |

---

## Known issues / debt

| Item | Severity | Note |
| --- | --- | --- |
| CSS is 41.7 KB uncompressed | low | Well within budget; Phase 6 will confirm gzip size |
| `execCommand` deprecation hint in `CodeBlock` | none | Intentional fallback when the Clipboard API is unavailable |
| RSS item links carry a trailing slash | cosmetic | `trailingSlash: 'never'` is set; both forms resolve |
| No `/404` page yet | medium | Scheduled for Phase 7 |
| `/styleguide` is `noindex` but publicly reachable | low | Intentional; excluded from sitemap |

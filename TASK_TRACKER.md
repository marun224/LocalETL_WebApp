# Task Tracker

**Project:** Local-First ETL & Analytics marketing site (working brand: **Headrace**)
**Last updated:** 2026-09-21
**Current status:** 🟢 **Phase 5 complete — awaiting confirmation to start Phase 6**

Legend: ✅ done · 🔄 in progress · ⬜ not started · ⏸️ deferred · 🚫 blocked · ❓ needs user decision

---

## Progress summary

| Phase | Name | Status | Commit |
| --- | --- | --- | --- |
| — | Research & planning | ✅ complete | — |
| 0 | Foundation & environment | ✅ complete | `7881a3a` |
| 1 | Scaffold & design system | ✅ complete | `7881a3a` |
| 2 | Home page | ✅ complete | `ba23557` |
| 3 | Core product pages | ✅ complete | `02e5e84` |
| 4 | Commercial & trust pages | ✅ complete | `90a6f55` |
| 5 | Content engine | ✅ complete | — |
| 6 | SEO, AI discoverability & performance | ⬜ **awaiting go-ahead** | |
| 7 | Accessibility, QA & deploy | ⬜ | |
| 8 | Post-launch | ⏸️ deferred by default | |

**29 routes building.** `astro check` clean. Zero third-party requests verified.

---

## ✅ Completed

### Research & planning — 2026-09-21
Teardown of duckle.org and orcasheets.ai; stack and design tokens extracted from
OrcaSheets' built assets; 94 RDAP domain queries with detection validated in both
directions; 8 decisions locked with the user (D1–D8); four planning documents authored.

Key findings: 40 single dictionary words checked across `.com`/`.dev`/`.ai` → **zero
available**. `.io` RDAP unreliable → discarded. Verified available: `headrace.ai`,
`quernstone.ai`, `tidemill.ai`. OrcaSheets' SPA is invisible to non-JS crawlers
(confirmed first-hand), which drove decision D1.

### Phase 0 — Foundation ✅
Node 24.19.0 LTS installed via winget (none was present) · git repo on `main` ·
`.gitignore`, `.editorconfig`, `.nvmrc`, Prettier config · LICENSE · CONTRIBUTING.md

### Phase 1 — Design system ✅
Astro 7.3.3 + Tailwind 4.3.3 (CSS-first `@theme`) · runtime theming via `@theme inline`
+ `[data-theme]` · deep teal `#0E7C66` + amber `#E8822B`, distinct from both reference
sites · product surfaces stay dark in both themes · Geist + Geist Mono self-hosted,
latin subset only · 12 primitives · `/styleguide` route

### Phase 2 — Home page ✅
13 sections · stable h1 with rotating closing clause · `PipelineCanvas` and
`ArchitectureDiagram` hand-authored SVG · 16-question FAQ with `FAQPage` JSON-LD ·
3 install paths incl. AI-agent prompt · **zero fabricated metrics** · `CLAIMS.md`
created · `SITE.preLaunch` flag drives all honesty disclosures

### Phase 3 — Core product pages ✅
`/features` (28 capabilities, sticky jump nav) · `/how-it-works` (5-step execution model
+ "what this is not good at") · `/integrations` (46 connectors, vanilla-JS filter) ·
`/download` (leads with "nothing to download yet") · `PageHero` component

### Phase 4 — Commercial & trust ✅
`/pricing` (leads with commitments, amounts marked "Not set") · `/security`
(feature-by-feature transmission table, "what we do not claim") · 3 solutions pages via
one dynamic route · `/about` · `/contact` (working mailto composer, no backend) ·
`scripts/check-icons.mjs` wired into build

### Phase 5 — Content engine ✅
Content collections with Zod schemas (docs, blog, compare) · `DocsLayout` with sidebar +
prev/next · hand-written `Prose` styles (code blocks stay on the dark product palette) ·
**6 docs articles** · **4 blog posts** · **4 comparison pages** · `/rss.xml` ·
**generated `.md` mirrors** at `/docs/{slug}.md` and `/blog/{slug}.md` — generated from
the same source the HTML renders from, so they cannot drift · Shiki theme aligned to the
product palette

The `compare` schema **requires** a `pickThemWhen` array (`.min(1)`) — a comparison page
cannot be published without stating when the competitor is the better choice.

---

## ⬜ Phase 6 — SEO, AI discoverability & performance (next)
| # | Task | Status |
| --- | --- | --- |
| 6.1 | Per-page OG images (generated) | ⬜ |
| 6.2 | Remaining JSON-LD: `BreadcrumbList`, `Product` | ⬜ |
| 6.3 | `robots.txt` | ⬜ |
| 6.4 | **Generated `/llms.txt` + `/llms-full.txt`** from content collections | ⬜ |
| 6.5 | `scripts/check-external.mjs` — fail build on any third-party origin | ⬜ |
| 6.6 | Perf budgets: JS ≤ 80KB, LCP < 1.5s, CLS < 0.05 | ⬜ |
| 6.7 | Image pipeline (AVIF/WebP, explicit dimensions) | ⬜ |
| 6.8 | Lighthouse ≥ 95 ×4 on every route | ⬜ |

## ⬜ Phase 7 — Accessibility, QA & deploy
WCAG 2.2 AA audit · keyboard + screen-reader pass · cross-browser · link checker ·
`/404` · 4 deploy configs (Vercel, Netlify, Cloudflare, GH Pages) + Dockerfile ·
CSP + security headers · analytics decision ❓Q7 · README · **placeholder sign-off gate**

---

## ⏸️ Deferred

| # | Item | Why | Revisit when |
| --- | --- | --- | --- |
| D-1 | Real product screenshots | Product doesn't exist; using illustrative SVG | Product ships |
| D-2 | Real benchmark numbers | Nothing to measure | First working build |
| D-3 | Customer logos / testimonials / case studies | No customers; fabricating is forbidden | First reference customer |
| D-4 | Certification claims (SOC 2, ISO 27001) | Not certified | If/when audited |
| D-5 | i18n | No demand signal | Post-launch traffic |
| D-6 | Changelog, careers, status pages | No content yet | Post-launch |
| D-7 | Newsletter, demo booking | Needs a backend and a list | Phase 8 |
| D-8 | In-browser interactive demo | Needs the engine in WASM | Product maturity |
| D-9 | A/B testing hero variants | Needs traffic | 1k+ sessions/mo |
| D-10 | `.io` domain availability check | `.io` serves no public RDAP | Before purchase |
| D-11 | Docs search | 6 articles don't justify it | ~20 articles |

---

## ❓ Open decisions

| # | Question | Needed by | Current fallback |
| --- | --- | --- | --- |
| Q1 | Brand name — **Headrace** (in use), Quernstone, Tidemill, or your own | Before launch | Building as Headrace; one-file rename via `src/config/brand.ts` |
| Q2 | Real pricing amounts for Pro & Team | Before launch | Rendered as "Not set" with `data-claim-status="placeholder"` |
| Q3 | GitHub org/repo URL | Before launch | `github.com/headrace/headrace` placeholder in `site.js` |
| Q4 | Contact email domain | Before launch | `hello@ / sales@ / security@ headrace.ai` |
| Q5 | Product core licence — MIT / Apache-2.0 / dual / BSL | Before launch | Copy says "open source" without naming one |
| Q6 | Contact form backend | Phase 7 | **Resolved for v1:** working mailto composer, no backend |
| Q7 | Analytics — self-hosted or none | Phase 7 | **None** (strongest story, and already claimed in the footer) |

---

## 🚫 Blocked

| Item | Blocked by |
| --- | --- |
| Phase 6 start | Awaiting user confirmation (per standing instruction) |
| Domain purchase | Trademark clearance + registrar re-check (plan §2) |
| Replacing placeholders | Q1–Q5 answers |

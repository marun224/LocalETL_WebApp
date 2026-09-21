# Task Tracker

**Project:** Local-First ETL & Analytics marketing site
**Last updated:** 2026-09-21
**Current status:** 🔴 **PLANNING — awaiting "start" from user. No implementation, no git commits.**

Legend: ✅ done · 🔄 in progress · ⬜ not started · ⏸️ deferred · 🚫 blocked · ❓ needs user decision

---

## Progress summary

| Phase | Name | Status | Tasks done |
| --- | --- | --- | --- |
| — | Research & planning | ✅ **complete** | 9 / 9 |
| 0 | Foundation & environment | ⬜ awaiting "start" | 0 / 7 |
| 1 | Scaffold & design system | ⬜ | 0 / 13 |
| 2 | Home page | ⬜ | 0 / 9 |
| 3 | Core product pages | ⬜ | 0 / 4 |
| 4 | Commercial & trust pages | ⬜ | 0 / 5 |
| 5 | Content engine | ⬜ | 0 / 7 |
| 6 | SEO, AI discoverability & performance | ⬜ | 0 / 8 |
| 7 | Accessibility, QA & deploy | ⬜ | 0 / 9 |
| 8 | Post-launch | ⏸️ deferred by default | 0 / 6 |

---

## ✅ Completed

### Research & planning — 2026-09-21
| # | Task | Notes |
| --- | --- | --- |
| R1 | ✅ Teardown of duckle.org | Full copy, IA, 16-question FAQ strategy, 3 install paths captured |
| R2 | ✅ Teardown of orcasheets.ai | SPA blocked plain fetch; recovered full copy via their `/llms-full.txt` |
| R3 | ✅ Extracted OrcaSheets tech stack | Vite + React + Radix/shadcn + Tailwind + Lexend + GTM, read from built assets |
| R4 | ✅ Extracted OrcaSheets design tokens | Primary `hsl(229 47% 54%)` = `#566DC6`, M3-style token naming, full light/dark palette |
| R5 | ✅ Gap analysis | Duckle ends at the loaded table; OrcaSheets starts at the question. Neither owns the full loop |
| R6 | ✅ Environment audit | git ✅ · Python 3.12 ✅ · winget ✅ · Node ❌ · Bash tool broken (no coreutils) |
| R7 | ✅ Domain availability research | 94 RDAP queries; detection validated in both directions before trusting results |
| R8 | ✅ Requirements gathering | 8 decisions locked with user (D1–D8) |
| R9 | ✅ Planning documents authored | `IMPLEMENTATION_PLAN.md`, `RESEARCH_COMPETITIVE.md`, `TASK_TRACKER.md`, `COMMANDS.md` |

**Key research findings recorded:**
- 40 single dictionary words checked across `.com`/`.dev`/`.ai` → **zero available**. Compounds are the only path.
- `.io` RDAP is unreliable via rdap.org (`github.io`/`docker.io` falsely reported free) → **all `.io` results discarded**.
- Verified available: `headrace.ai`, `quernstone.ai`, `tidemill.ai`.
- OrcaSheets' own `llms-full.txt` admits their SPA is invisible to non-JS crawlers — confirmed first-hand. Drove decision D1 (static-first Astro).

---

## ⬜ Pending — Phase 0: Foundation & environment
| # | Task | Status |
| --- | --- | --- |
| 0.1 | Install Node.js LTS via winget | ⬜ |
| 0.2 | Verify `node -v` / `npm -v` in a fresh shell | ⬜ |
| 0.3 | `git init` + identity + `main` branch | ⬜ |
| 0.4 | `.gitignore` | ⬜ |
| 0.5 | `.editorconfig` + `.nvmrc` | ⬜ |
| 0.6 | `LICENSE` + `CONTRIBUTING.md` stub | ⬜ |
| 0.7 | First git commit | ⬜ 🚫 blocked on "start" |

## ⬜ Pending — Phase 1: Scaffold & design system
| # | Task | Status |
| --- | --- | --- |
| 1.1 | `npm create astro@latest` (minimal, TS strict) | ⬜ |
| 1.2 | Integrations: tailwind, mdx, sitemap, astro-icon | ⬜ |
| 1.3 | `src/config/brand.ts` — single BRAND token | ⬜ ❓ depends on Q1 |
| 1.4 | Tailwind config with all design tokens | ⬜ |
| 1.5 | Self-hosted Geist + Geist Mono via fontsource | ⬜ |
| 1.6 | `global.css` + `data-theme` dark mode | ⬜ |
| 1.7 | `BaseLayout.astro` (head, meta, OG, JSON-LD, skip-link) | ⬜ |
| 1.8 | Inline pre-paint theme script (no FOUC) | ⬜ |
| 1.9 | UI primitives ×9 | ⬜ |
| 1.10 | `Header` + mobile drawer + theme toggle | ⬜ |
| 1.11 | `Footer` (4 columns) | ⬜ |
| 1.12 | `ProductFrame.astro` + `Claim.astro` | ⬜ |
| 1.13 | `/styleguide` route | ⬜ |

## ⬜ Pending — Phase 2: Home page
| # | Task | Status |
| --- | --- | --- |
| 2.1 | Hero + `RotatingHeadline` island (SSR first variant) | ⬜ |
| 2.2 | Trust strip | ⬜ |
| 2.3 | Act I — `ConnectorGrid` | ⬜ |
| 2.4 | Act II — `PipelineCanvas` SVG (canvas → SQL) | ⬜ |
| 2.5 | Act III — `QueryToChart` SVG | ⬜ |
| 2.6 | `ArchitectureDiagram` SVG with explicit trust boundary | ⬜ |
| 2.7 | Solutions cards + performance proof cards | ⬜ |
| 2.8 | FAQ accordion + `FAQPage` JSON-LD | ⬜ |
| 2.9 | `InstallPaths` incl. AI-agent prompt + copy button | ⬜ |

## ⬜ Pending — Phase 3: Core product pages
`/features` · `/how-it-works` · `/integrations` (filterable island) · `/download` (OS auto-detect)

## ⬜ Pending — Phase 4: Commercial & trust pages
`/pricing` (4 tiers) ❓Q2 · `/security` · `/solutions/*` ×3 · `/about` · `/contact` ❓Q4

## ⬜ Pending — Phase 5: Content engine
Content collections · `/docs` hub + 6 articles · `/blog` + 4 posts + RSS · `/compare/*` ×4 · **`.md` mirror generator**

## ⬜ Pending — Phase 6: SEO, AI discoverability & performance
Meta + OG images · JSON-LD ×6 · sitemap + robots · **generated `llms.txt` / `llms-full.txt`** · image pipeline · perf budgets · **verify zero third-party requests**

## ⬜ Pending — Phase 7: Accessibility, QA & deploy
WCAG 2.2 AA audit · keyboard + SR pass · cross-browser · link check · 4 deploy configs · CSP + security headers · analytics ❓Q7 · README · **placeholder sign-off gate**

---

## ⏸️ Deferred

| # | Item | Why deferred | Revisit when |
| --- | --- | --- | --- |
| D-1 | Real product screenshots | Product doesn't exist (D4). Using illustrative SVG instead | Product ships |
| D-2 | Real benchmark numbers | Nothing to measure yet | First working build |
| D-3 | Customer logos / testimonials / case studies | No customers. Fabricating these is forbidden by §6 | First reference customer |
| D-4 | Certification claims (SOC 2, ISO 27001) | Not certified. Cannot be claimed | If/when audited |
| D-5 | i18n / multi-language | No demand signal; large ongoing cost | Post-launch traffic data |
| D-6 | Changelog, careers, status pages | No content to put in them | Post-launch |
| D-7 | Newsletter + demo booking | Needs a backend and a list | Phase 8 |
| D-8 | In-browser interactive demo | Needs the real engine compiled to WASM | Product maturity |
| D-9 | A/B testing on hero variants | Needs traffic to be meaningful | 1k+ sessions/mo |
| D-10 | `.io` domain availability check | `.io` registry serves no public RDAP | Manual registrar check before purchase |

---

## ❓ Open decisions needed from user

| # | Question | Needed by | Fallback if unanswered |
| --- | --- | --- | --- |
| Q1 | Brand name — **Headrace** (rec.) / Quernstone / Tidemill / your own | End of Phase 1 | Build against `__BRAND__`, rename in one pass |
| Q2 | Real pricing amounts for Pro & Team? | Phase 4 | `[TODO]` placeholders |
| Q3 | GitHub org/repo URL for the OSS CTA | Phase 2 | Placeholder link |
| Q4 | Single contact email domain | Phase 4 | `hello@<brand>.ai` placeholder |
| Q5 | Product core licence — MIT / Apache-2.0 / dual / BSL | Phase 4 | State "open source" generically |
| Q6 | Contact form backend, or `mailto:` for v1 | Phase 7 | `mailto:` |
| Q7 | Analytics — self-hosted, or none | Phase 7 | **None** (strongest story) |

---

## 🚫 Blocked

| Item | Blocked by |
| --- | --- |
| All implementation work | User has not said **"start"** |
| All git commits | User has not said **"start"** |
| Domain purchase | Trademark clearance + registrar re-check (see plan §2) |

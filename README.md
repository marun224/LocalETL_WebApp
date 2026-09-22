# Headrace — marketing site

Static marketing site for a local-first ETL and analytics engine.
Astro 7 + Tailwind 4, no runtime framework, **zero third-party requests**.

> **The brand name is provisional.** `headrace.ai` was verified available on
> 2026-09-21 but has not been purchased and no trademark clearance has been
> done. Renaming is a one-file change — see [Rebranding](#rebranding).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

Node >= 22.12 required (`.nvmrc` pins 24.19.0).

---

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Icon check → type check → build → third-party check → header generation |
| `npm run preview` | Serve the production build |
| `npm run format` | Prettier across the repo |

### Verification

Each of these exists because something went wrong once, or because the site
makes a claim that ought to be enforced rather than trusted.

| Command | Checks | Needs preview running |
| --- | --- | --- |
| `check:icons` | Every `<Icon name>` resolves. Runs in `build`. | no |
| `check:external` | No third-party resource references. Runs in `build`. | no |
| `check:links` | All 1500+ internal links resolve to built files | no |
| `check:claims` | Enumerates placeholder claims and forbidden phrases | no |
| `check:a11y` | WCAG 2.2 AA via axe, every route × both themes, plus a keyboard sweep | **yes** |
| `check:perf` | Bytes by type, requests, LCP, CLS against a budget | **yes** |
| `check:browsers` | Chromium, Firefox and WebKit behave identically | **yes** |
| `check:csp` | The site works under the generated CSP (serves dist with real headers) | no |

```bash
# The ones needing a server
npm run preview &
npm run check:a11y && npm run check:perf && npm run check:browsers
```

### Assets

| Command | Does |
| --- | --- |
| `npm run og` | Regenerates the 30 OG cards in `public/og/` |
| `npm run fonts:sync` | Re-copies latin font subsets after a fontsource bump |
| `npm run shot` | Screenshots routes to `.screenshots/` for visual review |

---

## Current state

| | |
| --- | --- |
| Routes | 42 — 30 HTML, 10 Markdown mirrors, RSS, sitemaps |
| Lighthouse | 100 / 100 / 100 / 100 |
| Shipped JS | 2.4 kB (Astro's prefetch helper only) |
| Shipped CSS | 41.7 kB |
| WCAG 2.2 AA | 0 violations across 58 page-loads |
| Third-party requests | 0 |
| Outstanding placeholders | 3 — see `npm run check:claims` |

---

## The two rules

### 1. No invented facts

The product does not exist yet. Nothing may assert a fact that is not true:
no benchmarks, customers, testimonials, download counts or certifications.

Architectural claims are fine — they describe the design, not a measurement.

Unverified figures go through `<Claim status="placeholder" id="...">`, which
emits `data-claim-status` into the DOM so `npm run check:claims` can enumerate
them mechanically. Every one needs a row in [CLAIMS.md](docs/CLAIMS.md).

`SITE.preLaunch` in `src/config/site.js` drives every "not shipped yet"
disclosure on the site. Launch day is one boolean, not a hunt through 18 pages.

### 2. No third-party requests

Fonts are self-hosted, icons are inlined from Iconify at build time, there is
no tag manager, no CDN and no analytics. `check:external` fails the build if
that ever changes.

This is the product's own thesis demonstrated on its own website. A site
arguing for data sovereignty that phones home to four vendors is an argument
against itself.

---

## Layout

```
src/
├── config/
│   ├── brand.ts      ← the single rename point
│   ├── site.js       ← URL, emails, preLaunch flag
│   ├── pages.ts      ← page manifest: titles, descriptions, llms.txt summaries
│   └── nav.ts
├── data/             connectors · pricing · faq · solutions
├── components/
│   ├── ui/           primitives
│   ├── sections/     page sections
│   └── diagrams/     hand-authored SVG
├── content/          docs · blog · compare  (Markdown + Zod schemas)
├── layouts/
├── pages/
└── styles/global.css ← all design tokens
```

### Where things come from

- **Page titles and meta descriptions** live in `src/config/pages.ts`, not in
  the pages. `BaseLayout` resolves them by pathname. This is what keeps
  `/llms.txt` from drifting away from the site it describes.
- **Design tokens** live in `@theme` in `global.css`. Components use semantic
  names (`text-muted`, `bg-subtle`) and never raw hex or arbitrary values.
- **Product visuals** are hand-authored inline SVG inside `<ProductFrame>`,
  which stays dark in both themes. Not screenshots — the product does not
  exist, and a fake screenshot would be a claim.

---

## Deploying

The build output is plain static files, so any of these work from the same
`dist/`.

Security headers are **generated** by `scripts/gen-headers.mjs` during the
build, including a CSP with a SHA-256 hash per inline script — no
`'unsafe-inline'`. That is only possible because nothing third-party loads.
Verify with `npm run check:csp` before deploying.

| Target | Config | Notes |
| --- | --- | --- |
| **Netlify** | `netlify.toml` | Headers come from generated `dist/_headers` |
| **Cloudflare Pages** | build `npm run build`, output `dist` | Also reads `dist/_headers` |
| **Vercel** | `vercel.json` | Regenerated on every build; commit the change |
| **GitHub Pages** | `.github/workflows/deploy.yml` | Note: Pages cannot serve custom headers, so the CSP does not apply there |
| **Self-hosted** | `Dockerfile` + `deploy/nginx.conf` | `docker build -t headrace-site . && docker run -p 8080:8080 headrace-site` |

---

## Rebranding

1. Edit `src/config/brand.ts` — name, slug, domain, taglines.
2. Edit `src/config/site.js` — URL and email addresses.
3. Update the `ALLOWED_PREFIXES` origin in `scripts/check-external.mjs`.
4. `npm run og` to regenerate the cards.
5. `npm run build && npm run check:links`.

Nothing else in `src/` hardcodes the name.

---

## Open decisions

Tracked in [TASK_TRACKER.md](docs/TASK_TRACKER.md). The ones with placeholders in
production copy:

| | Question | Current state |
| --- | --- | --- |
| Q1 | Brand name | Built as Headrace, provisional |
| Q2 | Pricing amounts for Pro & Team | Render as "Not set" |
| Q3 | GitHub org/repo URL | `github.com/headrace/headrace` placeholder |
| Q4 | Contact email domain | `@headrace.ai` |
| Q5 | Product core licence | Copy says "open source" without naming one |

---

## Documents

| File | Contents |
| --- | --- |
| [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | The 9-phase plan and locked decisions |
| [RESEARCH_COMPETITIVE.md](docs/RESEARCH_COMPETITIVE.md) | Teardown of Duckle and OrcaSheets; naming research |
| [TASK_TRACKER.md](docs/TASK_TRACKER.md) | What is done, deferred and blocked |
| [CLAIMS.md](docs/CLAIMS.md) | Every factual claim on the site and its status |
| [COMMANDS.md](docs/COMMANDS.md) | Command log, including the environment traps |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Conventions |

---

## Licence

MIT — **for this website's source only**. The licence for the Headrace product
itself has not been chosen.

# Contributing

## Setup

```bash
npm install
npm run dev          # http://localhost:4321
```

Node >= 22.12 is required (`.nvmrc` pins 24.19.0).

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | `astro check` — types and template diagnostics |
| `npm run format` | Prettier across the repo |

## The two rules that matter

### 1. No invented facts

The product does not exist yet. Nothing on this site may assert a fact that
is not true. Specifically forbidden:

- Benchmark numbers that were not measured
- Customer names, logos, testimonials, case studies
- Download counts, star counts, "trusted by N teams"
- Certifications (SOC 2, ISO 27001, HIPAA) — we hold none

Architectural claims *are* fine ("runs locally", "no egress") because they
describe the design, not a measurement.

Every unverified figure goes through `<Claim>` with `status="placeholder"`
and gets a row in [CLAIMS.md](CLAIMS.md). The build fails if one is missing.

### 2. No third-party requests

The site must make zero network requests to any origin other than its own.
No Google Fonts, no tag manager, no CDN, no analytics beacons. Fonts are
self-hosted via `@fontsource-variable/*`; icons are inline SVG.

This is not fussiness — it is the product's own thesis, demonstrated. A site
about data sovereignty that phones home to four vendors argues against itself.

## Conventions

- Design tokens live in `src/styles/global.css` under `@theme`. Use them;
  do not write ad-hoc hex values or arbitrary Tailwind values in components.
- Brand name is never hardcoded — import `BRAND` from `src/config/brand.ts`.
- Interactive islands need an explicit `client:*` directive and must degrade
  to working, readable HTML without JS.
- Product visuals are hand-authored inline SVG inside `<ProductFrame>`, which
  stays dark in both themes.

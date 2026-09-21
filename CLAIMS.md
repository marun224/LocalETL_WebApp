# Claims Register

Every factual or numeric assertion on the site, with its status. Required by
[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) §6.

**Last audited:** 2026-09-21 (Phase 2)

| Status | Meaning | May ship? |
| --- | --- | --- |
| `REAL` | Measured, verifiable, or a statement about the site itself | ✅ yes |
| `ASPIRATIONAL` | A design goal, phrased as intent — never as a measurement | ✅ yes, if phrasing stays honest |
| `PLACEHOLDER` | Invented for layout | ❌ **must be replaced or removed before launch** |

---

## Current placeholder count: **0**

The home page carries **no fabricated metrics**. This was not an accident and
it is not a gap to be filled later.

The obvious way to build this page was to copy the reference sites' pattern —
"1B rows in seconds", "96 million rows in 39.9s", "50–70% cost savings" — with
invented numbers standing in until real ones exist. That would have meant
shipping measurements of a product that has never been run.

Instead the page argues from **architecture**, which is checkable today:
data does not leave the machine because there is no code path that sends it.
That claim needs no benchmark. When real numbers exist, they get added here
first and referenced on the page second.

---

## Claims currently on the site

### Architectural — `REAL`
These describe the intended design and are falsifiable by reading the source
once it exists. They are not performance claims.

| Claim | Where | Note |
| --- | --- | --- |
| No account, no telemetry, no phone-home | Home hero, architecture, FAQ | Must remain true in the shipped binary. If this ever changes, it changes here first. |
| Pipelines compile to readable SQL | Home, Act II | Core design commitment |
| Runs on Windows, macOS, Linux | Home hero, FAQ | |
| Open-source core | Home, footer, FAQ | Licence not yet chosen — copy deliberately says "open source" without naming one |
| Executes in-process on local CPU/disk | Architecture diagram | |

### About this website — `REAL`
| Claim | Where | Verified by |
| --- | --- | --- |
| Makes zero third-party requests | Footer | **Enforced at build time.** `scripts/check-external.mjs` runs as part of `npm run build` and fails it on any third-party resource reference in the built HTML or CSS. `scripts/screenshot.mjs` independently fails if a foreign origin is requested at runtime. Last confirmed 2026-09-21: 30 files scanned, 0 references. |
| No trackers, no cookies | Footer | No analytics installed; no cookie is set |

The footer claim is the product's own thesis demonstrated on its own site, so it
is enforced rather than trusted — one `<link>` to Google Fonts added in six
months would otherwise quietly make the site a liar.

### Measured — `REAL`
Figures about **this website**, not the product. Reproduce with
`npm run check:perf` and Lighthouse.

| Metric | Value | Measured |
| --- | --- | --- |
| Lighthouse (perf / a11y / best practices / SEO) | **100 / 100 / 100 / 100** | 2026-09-21, 6 routes |
| JavaScript shipped | 2.4 kB | Astro's prefetch helper only |
| CSS shipped | 41.7 kB | |
| Largest Contentful Paint | 60–116 ms | local preview |
| Cumulative Layout Shift | 0.0000 | |
| Requests per page | 4–5 | |

### Pre-launch disclosures — `REAL`
| Claim | Where |
| --- | --- |
| "Not yet. Pre-launch and in active development." | FAQ, second question — placed high deliberately |
| "Planned coverage… none of them is shipping yet" | Connector grid |
| "Illustrative diagram, not a screenshot" | Every ProductFrame caption |
| "These are the intended install paths. None works yet." | Install paths |

### Forward-looking — `ASPIRATIONAL`
| Claim | Where | Why it is acceptable |
| --- | --- | --- |
| 46 connectors across 6 categories | Connector grid | Labelled "planned coverage" and stated as scope, not availability |
| Flat team pricing, no per-seat billing | Home pricing teaser | A commitment about our own pricing, which we control |
| On-device AI assistant | Home, Local AI | Phrased as design ("is designed to run on-device") |

### Illustrative sample data — `REAL` (as samples)
| Item | Where | Note |
| --- | --- | --- |
| `orders_by_region` SQL, EMEA/AMER/APAC bars | Hero canvas, QueryToChart | Obviously synthetic example data inside a frame captioned as illustrative. Not presented as a result. |

---

## Explicitly absent, and staying absent until earned

| Not on the site | Required before it can appear |
| --- | --- |
| Throughput / row-count benchmarks | Measured on described hardware, reproducible |
| Customer names, logos, testimonials | A real customer who has agreed in writing |
| Case studies, "trusted by N teams" | Real engagements |
| SOC 2, ISO 27001, HIPAA claims | A completed audit. **Never asserted otherwise.** |
| GitHub stars / download counts | A public repository with real numbers |
| Cost-savings percentages | A real comparison against a real bill |

---

## Pre-launch gate (Phase 7)

```bash
# Enumerate every non-real claim rendered into the built site
npm run build
grep -ro 'data-claim-status="[a-z]*"' dist/ | sort | uniq -c
```

Launching with any `PLACEHOLDER` remaining is the user's explicit decision,
recorded here — never a silent default.

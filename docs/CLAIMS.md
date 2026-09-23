# Claims Register

Every factual or numeric assertion on the site, with its status. Required by
[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) §6.

**Last audited:** 2026-09-23 (site ↔ product sync: every product claim checked against the
engine in `ETL_Local_Tool` at `e07dc6f`; see [PLAN_site_product_sync.md](PLAN_site_product_sync.md))

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
| Runs on Windows and Linux; macOS planned | Home hero, FAQ, download, installation | Corrected 2026-09-23: macOS was claimed and has never been built. Windows and Linux are proven by the engine's CI (`gate.yml`, both OSes green) |
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
| Lighthouse (perf / a11y / best practices / SEO) | **100 / 100 / 100 / 100** | 2026-09-21, 6 routes (not re-run in the sync) |
| JavaScript shipped | 2.4 kB | Astro's prefetch helper only |
| CSS shipped | 42.9 kB | 2026-09-23 (`check:perf`; was 41.7 kB) |
| Largest Contentful Paint | 108–204 ms | 2026-09-23, local preview (`check:perf`) |
| Cumulative Layout Shift | 0.0000 | |
| Requests per page | 4–5 | |

### Pre-launch disclosures — `REAL`
| Claim | Where |
| --- | --- |
| "Not yet. Pre-launch and in active development." | FAQ, second question — placed high deliberately |
| "Nothing is released yet… 13 of them already work in the engine" | Connector grid, integrations notice |
| "Nothing here is released yet… anything not built is marked Planned" | Features, how-it-works and solutions page heroes |
| "Built, not yet released" | Roadmap's first stage |
| "Illustrative diagram, not a screenshot" | Every ProductFrame caption |
| "These are the intended install paths. None works yet." | Install paths |

### Forward-looking — `ASPIRATIONAL`
| Claim | Where | Why it is acceptable |
| --- | --- | --- |
| 49 connectors across 6 categories | Connector grid, integrations | Stated as scope. 36 of them are marked Planned, entry by entry |
| Flat team pricing, no per-seat billing | Home pricing teaser | A commitment about our own pricing, which we control |
| On-device AI assistant | Home, Local AI, features, FAQ, security | Marked Planned everywhere it appears, and phrased as design |

### Illustrative sample data — `REAL` (as samples)
| Item | Where | Note |
| --- | --- | --- |
| `orders_by_region` SQL, EMEA/AMER/APAC bars | Hero canvas, QueryToChart | Obviously synthetic example data inside a frame captioned as illustrative. Not presented as a result. |

---

## Product claims, checked against the engine — `REAL`

Added 2026-09-23. The product claims were audited against the engine
(`ETL_Local_Tool`) and every claim that did not hold was either reworded or
marked Planned. The audit itself, question by question, is in
[QUESTIONS_site_product_sync.md](QUESTIONS_site_product_sync.md).

### The rule

**A connector or feature is shown as working only with a named engine test
behind it.** A component existing is not enough: three of the engine's own
Phase 4 connectors (S3 writes on Windows, MySQL reads, moved Iceberg tables)
were broken until Phase 10c ran them against real systems. The same rule is
written into `src/data/connectors.ts` and at the top of `features.astro`.

### Connectors marked `working` (13)

"Working" = built and tested, not released. Evidence is in the engine repo.

| Site entry | Engine component | Evidence |
| --- | --- | --- |
| CSV | `src/snk.file.csv` | round trips; `samples/pipelines/*` in CI |
| Parquet | `src/snk.file.parquet` | tests and samples |
| JSON / JSONL | `src/snk.file.json`, `…jsonl` | round trips |
| Excel | `src/snk.file.excel` | round trip (loads the `excel` extension in CI) |
| XML | `src/snk.file.xml` | Phase 10a; `samples/pipelines/orders_xml.json` in CI |
| Local filesystem | every file component | implied by all of the above |
| SQLite | `src/snk.db.sqlite` | round trip, both write modes |
| PostgreSQL | `src/snk.db.postgres` | Phase 10c, `tests/verified.rs` against PostgreSQL 16 |
| MySQL | `src/snk.db.mysql` | Phase 10c, against MySQL 8.4 (a read bug found and fixed) |
| Delta Lake (read) | `src.lake.delta` | Phase 10c, a `deltalake`-written fixture |
| Iceberg (read) | `src.lake.iceberg` | Phase 10c, a `pyiceberg`-written, moved fixture (fixed) |
| MinIO / S3-compatible | `src/snk.cloud.s3` | Phase 10c, against MinIO (Windows writes fixed) |
| REST APIs | `src/snk.saas.rest` | Phase 10b fixture suite; one real HTTPS read of GitHub's API |

Kept `planned` on purpose: **Amazon S3** (not yet run against AWS itself),
**TSV** and **MariaDB** (one cheap test away each, not yet run), **GraphQL**.

### Features reworded (they overstated the engine)

| Was | Now | Why |
| --- | --- | --- |
| Column-level lineage | Lineage between nodes; column-level planned | `etl lineage` is node-level |
| Editable at any node | Swap in your own SQL (`xf.sql`) | Nodes are replaced, not edited in place |
| Branches fan out across cores | Each query runs in parallel across cores | DuckDB parallelises within a query |
| Joins across … SaaS APIs | … and REST APIs; named SaaS planned | No named SaaS connectors |
| Written back into your warehouse | … into Postgres, MySQL or SQLite | No warehouse sink |
| Team governance: RBAC, audit trails | The console's two roles; audit log planned | `etl serve`: viewer and operator |
| Credentials in the OS keychain / Vault | Encrypted in the workspace; `${ENV:…}`; Vault planned | `etl-secrets`, `params.rs` |
| Run history: per-node timings | Outcome, total time, rows per stage | Lazy stages carry no timing, by design |
| `pipeline.yaml`, `serve --schedule`, `pip install` | JSON, `etl schedule`, `etl run` | None of the former exists |

### Features marked Planned

CDC · schema-drift handling · Python escape hatch · plain-English questions ·
SQL editor · charts and dashboards · on-device AI · team governance (shared
connections, audit log) · macOS · Vault and cloud secret managers · an official
container image.

### Docs pages

All six were rewritten on 2026-09-23. Every command and output block on them
was run against the engine first; the session is in
[COMMANDS.md](COMMANDS.md). `querying-your-data` is headed "Planned".

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

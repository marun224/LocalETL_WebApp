# Plan: site ↔ product sync

**Status:** 📝 Draft for approval, 2026-09-23. No site changes until the user says "start".
**Inputs:** the audit and the user's answers in
[QUESTIONS_site_product_sync.md](QUESTIONS_site_product_sync.md) (all 8 as recommended), and the
engine at `ETL_Local_Tool` commit `9694099` (Phases 0–10c: 58 components).
**Goal:** every sentence on the site about what the product does is true of the engine today,
or visibly marked as planned. No claim without a check, the rule the site was built on
([IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) §6).

---

## What changes, in four phases

Each phase ends with `npm run build` and the checks it touches passing, and a commit.

### S1: Connector catalogue (Q1–Q4, Q7)

`src/data/connectors.ts` and everything that reads it.

1. **A third status.** `ConnectorStatus` becomes `'available' | 'working' | 'planned'`.
   `working` shows as **"Working, not yet released"**: built and tested in the engine, but not
   downloadable. `available` stays reserved for after launch. `CONNECTOR_COUNTS` gains `working`.
2. **13 entries become `working`:** CSV, Parquet, JSON / JSONL, Excel, XML, Local filesystem,
   SQLite, PostgreSQL, MySQL, Delta Lake, Iceberg, MinIO / S3-compatible, REST APIs.
3. **Entry changes:**

   | Change | Why |
   | --- | --- |
   | Delta Lake, Iceberg: `io` `both` → `source` | Q2: the engine only reads them |
   | Amazon S3 stays `planned` | Q3: not yet run against AWS |
   | Add **XML** (files, `both`, `working`) | Q4: built in 10a, missing from the site |
   | "REST / GraphQL" → **REST APIs** (`both`, `working`) + **GraphQL** (`both`, `planned`) | Q4 |
   | "CSV / TSV" → **CSV** (`working`) + **TSV** (`planned`) | Q7: TSV untested, and one tile can't hold both states |
   | MariaDB stays `planned` | Q7 |

   The total goes from **46 to 49** (+XML, +GraphQL, +TSV): 13 working, 36 planned, 0 available.
4. **Where it shows:** `ConnectorGrid.astro` (badge, filter and aria label for the new status),
   `integrations.astro` (the "every connector below is planned" notice becomes a count of
   working vs planned), `llms.txt.ts`, `llms-full.txt.ts`, and the integrations description in
   `config/pages.ts` ("46 … all planned").

### S2: Feature claims (Q5)

**Features page.** Each feature gets a status. Built features keep their check mark; planned
ones get a "Planned" badge in place of it, so nothing unbuilt reads as shipped.

| Feature | Becomes |
| --- | --- |
| Column-level lineage | **Reworded:** node-level lineage today (column-level planned) |
| Editable at any node | **Reworded:** replace any step with your own SQL (`xf.sql`) |
| Parallel execution | **Reworded:** DuckDB parallelises each query across cores. No branch fan-out claim |
| Joins across systems | **Reworded:** name what joins today (Postgres, MySQL, SQLite, files, lakes, REST); named SaaS apps planned |
| Exports that fit downstream | **Reworded:** "written back into Postgres, MySQL or SQLite", not "your warehouse" |
| Team governance | **Reworded:** two roles and tokens in the web console; shared connections and audit trails planned |
| Direct source connections, Read in place | Checked against S1's list; "warehouses" wording goes |
| Credentials stay yours | Workspace-encrypted secrets, not "your own secrets manager" |
| Change data capture, Schema drift handling, Python escape hatch, Plain-English questions, SQL editor, Charts and dashboards, On-device AI | **Marked Planned** |

**The same claims elsewhere**, found by grep and fixed the same way:

| Claim | Also in |
| --- | --- |
| Windows, macOS, Linux → Windows and Linux today, macOS planned | `Hero.astro`, `InstallPaths.astro`, `index.astro`, `download.astro`, `faq.ts`, `config/pages.ts`, `docs/installation.md` |
| Branch fan-out across cores | `how-it-works.astro` |
| Column-level lineage | `index.astro`, `compare/tableau-power-bi.md`, `config/pages.ts` |
| OS secret store / keychain | `security.astro` (and docs, in S3) |
| `pipeline.yaml`, `serve --schedule` / `--watch` | `download.astro` (and docs, in S3) |

**Roadmap** (`src/data/roadmap.ts`). It says "Building now: nothing here is finished or
usable yet", which is no longer true. Built items (the engine, SQL compilation, the first
connectors, the headless runner, run history and previews, pivots) move to a new **"Built,
not yet released"** stage. What stays: CDC, lineage, AI, charts, team features and the rest.

### S3: Docs pages (Q6)

Rewritten to match the engine as it is, using its own docs and samples
(`ETL_Local_Tool/docs/commands.md`, `docs/connectors.md`, `samples/pipelines/*.json`) as the
source. Every command shown on these pages was run against the engine's
`target\debug\etl.exe` before it went in.

| Page | Main fixes |
| --- | --- |
| `quickstart.md` | JSON pipeline, `etl run`, secrets encrypted in the workspace's `.etl/`, no "chart the result" |
| `installation.md` | No `pipeline.yaml`, no OS secret store, no query editor; Windows and Linux |
| `connecting-a-source.md` | Real component names and properties; `${SECRET:name}`; no schema-drift claim |
| `building-a-pipeline.md` | Real node types from `etl components`; a sample pipeline that runs |
| `deployment.md` | `etl build` (standalone binary), `etl schedule`, `etl serve` (the console) |
| `querying-your-data.md` | Covers a feature that isn't built (query editor, charts, AI). Keep it, headed "Planned: this describes where the product is going", and move the true parts (`xf.sql`, previews) into `building-a-pipeline.md` |

The pages' "pre-launch" framing stays: it's still true that nobody can download the product.

### S4: Register, checks and hand-off (Q8)

1. **`docs/CLAIMS.md`:** record the audit. Connector statuses with their evidence (the engine
   test or 10c check behind each), the reworded features, and a correction to the
   "Windows, macOS, Linux" row. "Last audited" moves to the date of the change.
2. **Keep this true next time.** A comment in `connectors.ts` and a line in CLAIMS.md: a
   connector becomes `working` only with a named engine test behind it.
3. **All eight checks:** build, links, claims, CSP, a11y, perf, browsers (with preview
   running). None of these has had a full re-run since 2026-09-21.
4. **Tracker, resume notes and command log** updated. Commit and push per phase.

---

## Not in this plan

| Item | Where it goes |
| --- | --- |
| Verifying TSV and MariaDB | Engine repo follow-up (Q7), about an hour. They flip to `working` after it |
| Amazon S3 against real AWS | Needs AWS credentials only the user has (Q3) |
| Redeploying the live site | Separate step. The live site also still lacks security headers (`c469d59` needs a redeploy) |
| The Cloudflare adapter `wrangler` installed | Separate fix |
| Brand, pricing, licence, contact, GitHub URL | The user's launch decisions, unchanged |

---

## Questions (answer with the plan's approval)

**P1. The home page's hero leads with the AI assistant and charts** (`Hero.astro`,
`QueryToChart.astro`, `index.astro`), neither of which is built.
- (a) Keep the hero's direction. Wherever it speaks in the present tense about an unbuilt
  feature, reword it as intent or add "planned".
- (b) Re-lead the hero with what's built (pipelines that compile to SQL, local connectors,
  air-gapped binaries), with AI and charts further down as the roadmap.

Recommended: **(a)** in this plan. (b) is a positioning decision and deserves its own pass.

**P2. Commit per phase, or once at the end?**
- (a) Per phase (S1–S4), pushing each. Each push runs the verify and audit jobs in
  `deploy.yml`, and GitHub Pages is opt-in and off.
- (b) One commit at the end.

Recommended: **(a)**, matching how the site was built. **But check first:** if Cloudflare
builds from this repo on push (the notes say `wrangler deploy` ran on "the build machine",
which suggests it does), every push goes live, and a half-synced site would be published
between phases. If so: commit per phase, push once at the end.

# Resume here

**Paused:** 2026-09-23, after the site ↔ product sync
**State:** All 8 phases complete, plus a round of deploy-prep fixes on
2026-09-22. Nothing is half-finished — work stopped at a clean boundary.

---

## ⚠️ Read this first

**The site ↔ product sync is done (2026-09-23).** Every product claim on the site was
checked against the engine and either holds, was reworded, or is marked Planned. Four
commits, S1–S4, per [PLAN_site_product_sync.md](PLAN_site_product_sync.md); what changed and
why is in [CLAIMS.md](CLAIMS.md) under *Product claims, checked against the engine*.

- **Connectors:** a third status, "Working, not yet released". 13 of 49 were working at the sync; the
  rest are planned. Amazon S3, TSV and MariaDB stay planned until tested.
- **Features:** each is built or marked Planned. Reworded where the site overstated the
  engine (lineage, parallelism, governance, secrets, run timings).
- **Docs:** all six rewritten; every command on them was run against the engine first.
- **The rule going forward:** nothing is marked working without a named engine test.
- **2026-09-24 (uncommitted):** GraphQL, Kafka and NATS JetStream marked working, NATS added
  to the catalogue: **16 of 50** working, 34 planned. Their tests are named in
  [CLAIMS.md](CLAIMS.md). Kinesis and SQS are built in the engine but stay off the site until
  checked against real AWS. The roadmap's "building now" moved from GraphQL to the
  message queues. **The live site needs a redeploy to show this.**
- **2026-09-24, later:** RabbitMQ marked working (**17 of 50**, 33 planned), its engine test
  named in CLAIMS.md; the roadmap's "building now" moved to databases and warehouses.

**Next, in order:**

1. **Redeploy the live site.** The Cloudflare deploy predates the sync *and* the
   security-headers fix (`c469d59`). Check the response headers after.
2. The deploy-prep items below (the undeclared Cloudflare adapter; a full check run is
   done as of 2026-09-23 except Lighthouse).
3. When the engine adds a connector or feature: mark it `working` only with its test named in
   `CLAIMS.md`. TSV and MariaDB are an hour's work in the engine repo.

**The engine the site describes** is `E:\workspace_09212026\ETL_Local_Tool` at `e07dc6f`
(Phases 0–10c), green in CI on run 35862990581.

**Everything is pushed.** Local `main` and `origin/main` are in sync on
`https://github.com/marun224/LocalETL_WebApp.git` (checked 2026-09-23 after a
fetch). Verify any time with:

```bash
git log --oneline origin/main..main    # empty output = nothing to push
```

> **Folder vs. repo name.** The local folder is
> `E:\workspace_09212026\ETL_Local_WebApp`. The GitHub repo is still named
> `LocalETL_WebApp`. They are not the same string — don't "fix" one to match
> the other by accident.

---

## Restarting the environment

```powershell
cd E:\workspace_09212026\ETL_Local_WebApp
$env:ASTRO_TELEMETRY_DISABLED = "1"
npm install        # node_modules is present, but re-run after any gap
npm run dev        # http://localhost:4321
```

Installed: Node 24.19.0, npm 11.17.0, git 2.55.0. `node_modules`, `dist`,
`.astro` and `.screenshots` are all present locally and all git-ignored.

As of 2026-09-23, `node` and `npm` resolve on PATH in both PowerShell and
Git Bash, and the Bash tool works (coreutils included). Earlier in this work
neither was true. If `node` is not found in a fresh shell again, add
`$env:Path += ";$env:ProgramFiles\nodejs"` first. If Bash loses its
coreutils again, use the PowerShell tool.

---

## Where things stand

| | |
| --- | --- |
| Phases | **8 of 8 complete** (Phase 8 partial — see below) |
| Commits | on `main`; the latest are the sync's S1–S4 (2026-09-23) |
| Hosting | **Cloudflare Pages** chosen; a first deploy went live 2026-09-22 (URL not recorded here) |
| Routes | **45** — 32 HTML + 10 Markdown mirrors + RSS + 2 sitemaps (plus `llms.txt`, `llms-full.txt`, `robots.txt`) |
| Lighthouse | **100 / 100 / 100 / 100** (2026-09-21; not re-run since) |
| WCAG 2.2 AA | **0 violations** across 62 page-loads (2026-09-23) |
| Cross-browser | Chromium, Firefox, WebKit ✅ |
| Internal links | 1505 checked, **0 broken** |
| Shipped weight | 42.9 kB CSS, 2.4 kB JS (2026-09-23) |
| Third-party requests | **0**, enforced at build |
| Fabricated metrics | **0** |
| Outstanding placeholders | **3** (2 real: `pricing.pro`, `pricing.team`) |

### Verify it all still passes

```powershell
npm run build                 # icons → types → build → third-party → headers
npm run check:links
npm run check:claims
npm run check:csp

# These three need a server running
Start-Job { npx astro preview --port 4321 }
npm run check:a11y
npm run check:perf
npm run check:browsers
```

All of these passed again on 2026-09-23, after the site ↔ product sync, along
with `npm run -s check` (0 errors) and `check:icons`. Lighthouse was last run on
2026-09-21.

---

## What changed on 2026-09-22

| Commit | Change |
| --- | --- |
| `09ea337` | Q1 direction settled: **staying Headrace**. Clearance still open, so the site keeps its provisional hedging |
| `c78aef7` | `SITE_URL` env var overrides the canonical origin; `NOINDEX=1` suppresses indexing site-wide. Defaults unchanged |
| `e6fa69a` | GitHub Pages deploy job is opt-in (repo variable `ENABLE_GITHUB_PAGES`). Turning it on also needs an Astro `base` and a link refactor |
| `c469d59` | `gen-headers.mjs` writes `_headers` into the directory the host actually serves (`dist/client` under the Cloudflare adapter) |

### ⚠️ Open from the Cloudflare deploy

- The first deploy went live with **no security headers** (no CSP, HSTS or
  X-Frame-Options). `c469d59` fixes the cause, but the live site needs a
  **rebuild and redeploy** before the fix takes effect. Nothing here records
  that this has happened. Check the response headers on the live URL.
- `npx wrangler deploy` ran `astro add cloudflare` on the build machine, which
  installed a server adapter that isn't declared in the repo. Either declare
  it in the repo or stop the deploy command from adding it.
- For a preview deploy, set `SITE_URL` to the preview's own address and
  `NOINDEX=1` in the Cloudflare build environment.

---

## What is NOT done, and why

Phase 8's remaining items are **blocked on things that do not exist yet**.
They were deliberately not faked.

| Item | Blocked on |
| --- | --- |
| Real product screenshots | A working product (illustrative SVG used instead) |
| Real benchmarks | Something to measure |
| Case studies, testimonials, customer logos | Customers |
| In-browser interactive demo | The engine compiled to WASM |
| A/B testing hero variants | Traffic **and** analytics we committed not to have — permanently off unless that commitment changes |
| Newsletter / demo booking | A backend; also conflicts with the footer's no-tracker claim |
| Status page | Something to monitor |
| i18n | A demand signal |

---

## The five decisions blocking launch

None of these are engineering. They are yours to make.

| | Question | Current state | How to apply |
| --- | --- | --- | --- |
| **Q1** | **Brand name** | **Direction settled 2026-09-22: staying Headrace.** Still blocked on a registrar check + trademark clearance | To change anyway: `npm run rebrand -- --name X --domain x.ai --dry`, then without `--dry` |
| **Q2** | Pricing for Pro & Team | Renders "Not set" | Edit `src/data/pricing.ts`: set `price`, drop `priceUnset` |
| **Q3** | GitHub org/repo URL | `github.com/headrace/headrace` placeholder | `src/config/site.js` |
| **Q4** | Contact email domain | `hello@ / sales@ / security@ headrace.ai` | `src/config/site.js` |
| **Q5** | Product core licence | Copy says "open source", unnamed | `src/config/site.js` + `/pricing` FAQ |

### ⚠️ Before buying the domain

`headrace.ai` was verified available on **2026-09-21** by RDAP. Also available:
`quernstone.ai`, `tidemill.ai`. A re-check on 2026-09-22 was **inconclusive**:
every RDAP query returned 403, controls included (see
[RESEARCH_COMPETITIVE.md](RESEARCH_COMPETITIVE.md)). Before purchase:

1. **Re-verify at a registrar** — the only good check is two days old, and RDAP is now blocked.
2. **Check `.ai` premium pricing** — not visible over RDAP.
3. **Trademark clearance by counsel — none has been done.** "Headrace" has
   existing unrelated commercial use in recruiting.
4. `.io` availability is **unknown** — that registry serves no public RDAP.

---

## When you resume, the obvious next steps

In rough order of value:

1. **Fix the live Cloudflare deploy.** Rebuild, redeploy, and confirm the CSP
   and other security headers are actually served. Settle the build-time adapter
   (see *Open from the Cloudflare deploy* above).
2. **Close out Q1.** The direction is settled (Headrace), so what's left is a
   registrar check and trademark clearance. Only run `npm run rebrand` if that
   clearance fails.
3. **Answer Q2–Q5**, then `npm run check:claims` should report 1 placeholder
   instead of 3 (the one left lives in `/styleguide`, which is `noindex`).
4. **Bring the site in line with the product.** The engine in
   `E:\workspace_09212026\ETL_Local_Tool` has moved on since the copy was
   written (engine, CLI, scheduler, web console). Connectors are all still
   `planned` and the quickstart says "Commands here do not work yet". Audit
   what really ships before flipping anything to `available`, and log each
   change in [CLAIMS.md](CLAIMS.md) first.
5. **Set `SITE.preLaunch = false`** on launch day. One boolean in
   `src/config/site.js` removes every "not shipped yet" disclosure sitewide.

---

## Things that will bite you (all learned the hard way)

Full detail in [COMMANDS.md](COMMANDS.md).

| Trap | What happens | Do this |
| --- | --- | --- |
| Bash heredoc in PowerShell | `git commit -F - <<'EOF'` is a parser error | Write the message to a file, `git commit -F <file>` |
| `Out-File -Encoding utf8` (PS 5.1) | Writes a BOM; git puts it in the commit subject | `[System.IO.File]::WriteAllText($p,$s,(New-Object System.Text.UTF8Encoding $false))` |
| `Get-Content` on UTF-8 | Em dashes render as `â€"` — looks like corruption, isn't | Decode bytes with `[System.Text.Encoding]::UTF8` |
| Native stderr | PowerShell 5.1 surfaces it as a terminating error | Check the actual result, not the error stream |
| Lighthouse on Windows | Exits non-zero *after* a successful run | Parse the JSON report, ignore the exit code |
| Regex across attribute values | `[^}]*\}` stops at the first brace inside `${...}` — this broke two files | Use the narrowest possible match; check the tag before rewriting |
| Contrast maths against white | The token may sit on a tinted wash | Compute against the **rendered** backdrop |

---

## Map of the repo

| File | What it is |
| --- | --- |
| [README.md](../README.md) | How to run, verify, deploy and rebrand |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | The 8-phase plan and the 8 locked decisions |
| [RESEARCH_COMPETITIVE.md](RESEARCH_COMPETITIVE.md) | Duckle + OrcaSheets teardown, naming/domain research |
| [TASK_TRACKER.md](TASK_TRACKER.md) | Per-phase detail, deferred items, open questions |
| [CLAIMS.md](CLAIMS.md) | Every factual claim on the site and its status |
| [COMMANDS.md](COMMANDS.md) | Full command log including every failure |
| [CONTRIBUTING.md](CONTRIBUTING.md) | The two rules |

### The two rules, in short

1. **No invented facts.** The product does not exist. No benchmarks,
   customers, testimonials or certifications. `<Claim>` wraps anything
   unverified; `npm run check:claims` enumerates them.
2. **No third-party requests.** Self-hosted fonts, build-time inlined icons,
   no tag manager, no analytics. `npm run check:external` fails the build if
   that ever changes.

Both are enforced by scripts, not by memory. That is the point.


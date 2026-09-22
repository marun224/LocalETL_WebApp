# Resume here

**Paused:** 2026-09-21
**State:** All 8 phases complete. The site is build-complete and verified.
Nothing is half-finished — work stopped at a clean boundary.

---

## ⚠️ Read this first

**Everything is pushed.** Local `main` and `origin/main` are in sync on
`https://github.com/marun224/LocalETL_WebApp.git`.

An earlier version of this section warned that two commits were unpushed. That
was accurate when written and is now stale — they went up. Verify any time
with:

```bash
git log --oneline origin/main..main    # empty output = nothing to push
```

---

## Restarting the environment

Node was installed during this work but **Windows PowerShell does not pick it
up automatically** in a fresh shell spawned by tooling. Every command below
assumes this prefix:

```powershell
$env:Path += ";$env:ProgramFiles\nodejs"
$env:ASTRO_TELEMETRY_DISABLED = "1"
```

Then:

```powershell
cd E:\workspace_09212026\LocalETL_WebApp
npm install        # node_modules is present, but re-run after any gap
npm run dev        # http://localhost:4321
```

Installed: Node 24.19.0, npm 11.17.0, git 2.55.0. `node_modules`, `dist`,
`.astro` and `.screenshots` are all present locally and all git-ignored.

> **The Bash tool is broken in this environment** — no coreutils on PATH
> (`mkdir`, `curl`, `head`, `wc` all missing). Use the PowerShell tool.

---

## Where things stand

| | |
| --- | --- |
| Phases | **8 of 8 complete** (Phase 8 partial — see below) |
| Commits | 9, on `main` |
| Routes | **45** — 32 HTML + 10 Markdown mirrors + RSS + 2 sitemaps (plus `llms.txt`, `llms-full.txt`, `robots.txt`) |
| Lighthouse | **100 / 100 / 100 / 100** |
| WCAG 2.2 AA | **0 violations** across 58 page-loads |
| Cross-browser | Chromium, Firefox, WebKit ✅ |
| Internal links | 1505 checked, **0 broken** |
| Shipped weight | 41.7 kB CSS, 2.4 kB JS |
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

All eight passed at the moment of pausing.

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
| **Q1** | **Brand name** | Built as **Headrace** / `headrace.ai` | `npm run rebrand -- --name X --domain x.ai --dry` then without `--dry` |
| **Q2** | Pricing for Pro & Team | Renders "Not set" | Edit `src/data/pricing.ts`: set `price`, drop `priceUnset` |
| **Q3** | GitHub org/repo URL | `github.com/headrace/headrace` placeholder | `src/config/site.js` |
| **Q4** | Contact email domain | `hello@ / sales@ / security@ headrace.ai` | `src/config/site.js` |
| **Q5** | Product core licence | Copy says "open source", unnamed | `src/config/site.js` + `/pricing` FAQ |

### ⚠️ Before buying the domain

`headrace.ai` was verified available on **2026-09-21** by RDAP. Also available:
`quernstone.ai`, `tidemill.ai`. Before purchase:

1. **Re-verify at a registrar** — that check is point-in-time and is now stale.
2. **Check `.ai` premium pricing** — not visible over RDAP.
3. **Trademark clearance by counsel — none has been done.** "Headrace" has
   existing unrelated commercial use in recruiting.
4. `.io` availability is **unknown** — that registry serves no public RDAP.

---

## When you resume, the obvious next steps

In rough order of value:

1. **Answer Q1** and run `npm run rebrand`. Everything else gets cheaper after
   the name is settled, and more content accumulates against the wrong name
   every day it is not.
2. **Push Phases 7–8** once you are happy with them.
3. **Answer Q2–Q5**, then `npm run check:claims` should report 2 placeholders
   instead of 3 (the third lives in `/styleguide`, which is `noindex`).
4. **Pick a deploy target** and do a real deploy. Configs exist for Netlify,
   Vercel, Cloudflare Pages, GitHub Pages and Docker/nginx. Note: **GitHub
   Pages cannot serve custom headers**, so the CSP will not apply there.
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

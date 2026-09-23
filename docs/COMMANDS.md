# Command Log

Every command executed for this project, in order, with its purpose and outcome.

**Shell:** PowerShell (Windows PowerShell 5.1) — the Bash tool in this environment is broken (no coreutils on PATH: `mkdir`, `curl`, `head`, `wc` all missing). **Use PowerShell for all shell work.**

Legend: ✅ succeeded · ⚠️ succeeded with caveats · ❌ failed

---

## Session 1 — 2026-09-21 · Research & planning

### 1. Environment audit

```powershell
# Check project directory exists and list contents
$p="E:\workspace_09212026\LocalETL_WebApp"
if(-not (Test-Path $p)){New-Item -ItemType Directory -Force $p | Out-Null}
Get-ChildItem $p | Select-Object Name,Length

# Check installed toolchain
foreach($t in @('node','npm','git','python','pnpm')){
  $c=Get-Command $t -ErrorAction SilentlyContinue
  if($c){"$t : " + (& $t --version 2>$null)} else {"$t : NOT FOUND"} }
```
✅ **Result:** directory empty. `git 2.55.0.windows.5` ✅ · `Python 3.12.10` ✅ · **node ❌ · npm ❌ · pnpm ❌**

```powershell
# Look for off-PATH Node installs and available package managers
$paths = @("$env:ProgramFiles\nodejs\node.exe","${env:ProgramFiles(x86)}\nodejs\node.exe",
           "$env:LOCALAPPDATA\Programs\nodejs\node.exe","$env:APPDATA\nvm",
           "$env:LOCALAPPDATA\fnm","$env:USERPROFILE\scoop\apps\nodejs")
foreach($p in $paths){ if(Test-Path $p){"FOUND: $p"} }
foreach($t in @('winget','choco','scoop')){
  if(Get-Command $t -ErrorAction SilentlyContinue){"$t available"} else {"$t not found"} }
```
✅ **Result:** no Node anywhere. `winget` available (→ install path for Phase 0). choco/scoop absent.

---

### 2. Reference site research

```powershell
# Download orcasheets.ai raw HTML (WebFetch returned only the <title> — SPA)
$r = Invoke-WebRequest -Uri "https://orcasheets.ai/" -UseBasicParsing `
     -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
$out="$env:TEMP\claude\orca.html"
New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null
$r.Content | Out-File -Encoding utf8 $out
```
⚠️ **Result:** only 4,774 bytes — a Vite SPA shell. Confirmed their marketing pages are invisible to non-JS crawlers. Revealed Lexend font, GTM, and a `<meta name="keywords">` with ~50 terms.

```powershell
# Their llms.txt / llms-full.txt carry the real copy
(Invoke-WebRequest -Uri "https://orcasheets.ai/llms.txt" -UseBasicParsing).Content
$r = Invoke-WebRequest -Uri "https://orcasheets.ai/llms-full.txt" -UseBasicParsing
$r.Content | Out-File -Encoding utf8 "$env:TEMP\claude\orca-llms-full.txt"
```
✅ **Result:** 16,760 chars of full site copy — homepage, features, pricing, security, integrations, docs index, API reference. Far better than scraping. This technique is adopted in Phase 6.

```powershell
# Extract built asset paths to identify the stack
$h = Get-Content "$env:TEMP\claude\orca.html" -Raw
[regex]::Matches($h,'(?:src|href)="(/assets/[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
```
✅ **Result:** `index-*.js`, `react-vendor-*.js`, `radix-*.js`, `icons-*.js`, `index-*.css` → Vite + React + Radix (shadcn/ui).

```powershell
# Pull the CSS bundle and extract the design tokens
$r = Invoke-WebRequest -Uri "https://orcasheets.ai/assets/index-C9xTPrL6.css" -UseBasicParsing
$c=$r.Content
$i=$c.IndexOf(':root'); if($i -ge 0){ $c.Substring($i,[Math]::Min(2600,$c.Length-$i)) }
```
✅ **Result:** 115,786 chars. Full light/dark palette recovered — primary `hsl(229 47% 54%)` = `#566DC6`, Material-3-style token naming, Lexend, 1200px container.

> `duckle.org` was read with the WebFetch tool (server-rendered, no shell command needed) and returned the complete page.

---

### 3. Domain availability research

**Method:** RDAP via `rdap.org`. HTTP 404 = available, HTTP 200 = registered.

```powershell
# Batch 1 — 10 single words × 4 TLDs
$names=@('millrace','loam','sluice','quarry','hearth','kiln','strata','capstan','lodestone','grist')
$tlds=@('com','io','dev','ai')
$rows=@()
foreach($n in $names){ foreach($t in $tlds){ $d="$n.$t"
  try{ $null=Invoke-WebRequest -Uri "https://rdap.org/domain/$d" -UseBasicParsing -TimeoutSec 12 -ErrorAction Stop; $st='TAKEN' }
  catch{ $c=$null; if($_.Exception.Response){$c=[int]$_.Exception.Response.StatusCode}
         if($c -eq 404){$st='AVAILABLE'} elseif($c -eq 400){$st='n/a'} else {$st="err$c"} }
  $rows += [pscustomobject]@{Domain=$d;Status=$st} } }
$rows | Format-Table -AutoSize | Out-String -Width 200
```
⚠️ **Result:** rate-limited (HTTP 429) after ~11 queries. Added `Start-Sleep -Milliseconds 1700-1800` between requests in all later batches.

```powershell
# Batch 2 — remainder, throttled (same pattern, with Start-Sleep -Milliseconds 1800)
```
⚠️ **Result:** every `.io` reported AVAILABLE — implausible for single words like `quarry.io`, `strata.io`. Triggered a validation step.

```powershell
# VALIDATION A — do known-registered domains report correctly?
foreach($d in @('github.io','docker.io','duckle.org','orcasheets.ai')){
  try{ $null=Invoke-WebRequest -Uri "https://rdap.org/domain/$d" -UseBasicParsing -TimeoutSec 12 -ErrorAction Stop; "$d => TAKEN" }
  catch{ $c=$null; if($_.Exception.Response){$c=[int]$_.Exception.Response.StatusCode}; "$d => reported-NOTFOUND(code $c)" }
  Start-Sleep -Milliseconds 1800 }
```
✅ **Result — critical finding:** `github.io` and `docker.io` both falsely reported 404, while `duckle.org` and `orcasheets.ai` correctly reported TAKEN. **The `.io` registry serves no public RDAP through this endpoint. All `.io` results were discarded as false positives.**

```powershell
# Batch 3 — 10 coined/obscure words × .ai/.dev/.com, throttled
$names=@('quern','thresher','gristmill','alluvia','cairn','solum','basalt','croft','headwater','riffle')
# ... same pattern, Start-Sleep -Milliseconds 1700
```
⚠️ **Result:** 30/30 TAKEN. So implausible it triggered a second validation.

```powershell
# VALIDATION B — does a guaranteed-unregistered domain report as free?
foreach($d in @('zzqx-nonexistent-947261.com','zzqx-nonexistent-947261.dev','zzqx-nonexistent-947261.ai')){
  try{ $r=Invoke-WebRequest -Uri "https://rdap.org/domain/$d" -UseBasicParsing -TimeoutSec 12 -ErrorAction Stop
       "$d => HTTP $($r.StatusCode), len=$($r.Content.Length)" }
  catch{ $c=$null; if($_.Exception.Response){$c=[int]$_.Exception.Response.StatusCode}; "$d => exception code=$c" }
  Start-Sleep -Milliseconds 1800 }
```
✅ **Result:** all three returned 404. **Detection confirmed correct in both directions** — the 30/30 result was real. Squatters genuinely hold the entire short-word space on `.com`/`.dev`/`.ai`.

```powershell
# Batch 4 — compound names × .ai/.com, throttled
$names=@('millwright','tailrace','headrace','alluvial','millstone','quernstone',
         'winnower','stonemill','tidemill','sluicegate')
# ... same pattern, Start-Sleep -Milliseconds 1700
```
✅ **Result — the payoff:**
| Domain | Status |
| --- | --- |
| `headrace.ai` | ✅ **AVAILABLE** |
| `quernstone.ai` | ✅ **AVAILABLE** |
| `tidemill.ai` | ✅ **AVAILABLE** |
| all 17 others (incl. every `.com`) | TAKEN |

**Total RDAP queries this session: 94.**

---

### 4. Planning documents

Created with the Write tool (not shell commands), since the Bash tool lacks `cat`/`tee` for heredocs:

| File | Purpose |
| --- | --- |
| `RESEARCH_COMPETITIVE.md` | Duckle + OrcaSheets teardown, naming/domain research |
| `IMPLEMENTATION_PLAN.md` | 9-phase plan, locked decisions, design system, IA, risks |
| `TASK_TRACKER.md` | Completed / pending / deferred / blocked register |
| `COMMANDS.md` | This file |

---

## Session 2 — Phase 0 onward

> ✅ **Started** on the user's "start". Actual commands run are logged below, after the
> conventions section. The block immediately following was the *plan*; it is kept for
> comparison with what was actually needed.

Commands queued for Phase 0, to be logged here with their real output once run:

```powershell
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
node -v; npm -v          # in a FRESH shell — winget does not refresh the current PATH
git init
git branch -M main
git add -A
git commit -m "Initial commit: planning documents"
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
npm install
npx astro add tailwind mdx sitemap
npm run dev
```

---

## Conventions for this log

- Append chronologically; never rewrite history.
- Record the command, its purpose, and the **actual outcome** — including failures. The two validation steps above are the reason the domain research is trustworthy; failures are the most valuable entries here.
- Redact secrets, tokens and keys. None have been used so far.

---

## Session 1 (continued) — Phases 0-5 implementation

### Phase 0 — toolchain

```powershell
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --disable-interactivity
# Node 24.19.0, npm 11.17.0. winget does NOT refresh the current shell's PATH:
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
# Every later PowerShell call prepends:  $env:Path += ";$env:ProgramFiles\nodejs"

git init; git branch -m main
git config user.name "Marun Mahadevu"; git config user.email "marun.mahadevu@gmail.com"
```
Note: `git init` writes its branch-name hint to stderr, which PowerShell 5.1 surfaces as an
error. The repo was created correctly.

### Reference scaffold (ground truth for Astro 7)

```powershell
npm create astro@latest . -- --template minimal --install no --git no --typescript strict --skip-houston --yes
```
Run in the scratchpad, not the project, because the project directory was non-empty.
Confirmed Astro 7 keeps the Astro 5 project shape, so the plan held.

### Dependency verification before pinning

```powershell
foreach($p in @('astro','@tailwindcss/vite','tailwindcss','@astrojs/mdx','@astrojs/sitemap','astro-icon','@iconify-json/lucide','@fontsource-variable/geist','@fontsource-variable/geist-mono')){
  npm view $p version }
npm view "@astrojs/mdx" peerDependencies --json
```
Found Astro at **7.3.3**, not the 5.x the plan assumed. `@astrojs/mdx@8.0.1` requires
`astro ^7.2.6` — compatible. **Dropped `astro-icon`** in favour of inlining Iconify paths
at build time: one fewer dependency and one fewer runtime fetch.

### Install

```powershell
npm install --no-fund --no-audit                      # 300 packages
npm install -D @iconify-json/lucide @iconify-json/simple-icons --no-fund --no-audit
npm install @astrojs/rss --no-fund --no-audit
npm install -D playwright --no-fund --no-audit
npx playwright install chromium
```

### Fonts — latin subset only

```powershell
Copy-Item "node_modules\@fontsource-variable\geist\files\geist-latin-wght-normal.woff2" "public\fonts\" -Force
Copy-Item "node_modules\@fontsource-variable\geist-mono\files\geist-mono-latin-wght-normal.woff2" "public\fonts\" -Force
```
28.7 KB + 22.6 KB. The packages ship no per-subset CSS, but the `@font-face` rules carry
`unicode-range`, so non-latin subsets are never fetched. Copied with stable filenames so
they can be preloaded (Vite would hash them). Repeatable via `npm run fonts:sync`.

### Build loop (used throughout)

```powershell
$env:ASTRO_TELEMETRY_DISABLED="1"
npm run build          # check-icons -> astro check -> astro build
npm run build:fast     # skip checks
```

### Visual verification

```powershell
# Preview runs as a background job; the screenshot script drives Chromium against it.
$job = Start-Job -ScriptBlock { Set-Location "E:\workspace_09212026\LocalETL_WebApp"; npx astro preview --port 4321 }
Start-Sleep -Seconds 7
node scripts/screenshot.mjs / /styleguide /pricing /security
node scripts/shot-el.mjs / "#architecture figure"     # single element, close up
Stop-Job $job; Remove-Job $job -Force
```
`screenshot.mjs` **exits non-zero on any request to a foreign origin**, so the
zero-third-party rule is enforced on every capture, not just asserted in the footer.

Defects this caught that a build could not:
- `extract · transform · load` overflowing the engine box in the architecture SVG
- pipeline canvas edges invisible at `--c-product-border` against the canvas
- SVG diagrams shrinking to ~7px labels below 620px → now pan instead
- product frames nearly dissolving into the dark page surface → lifted `--c-product-bg`

### Icon validation

```powershell
node scripts/check-icons.mjs      # now part of `npm run build`
```
Written after a build failed on `building-2` (lucide has `building-complex`). Icon.astro
throws on an unknown name, which is right but reports one per build; this reports all of
them at once. 38 of 40 brand slugs checked existed — Iceberg and Cassandra have no
simple-icons entry and render as text chips.

### Encoding check

```powershell
$bytes = [System.IO.File]::ReadAllBytes("dist\docs\quickstart.md")
[System.Text.Encoding]::UTF8.GetString($bytes)
```
The generated `.md` mirrors looked like mojibake under `Get-Content`. That is PowerShell
5.1 reading UTF-8 as ANSI, not a file defect — verified the bytes are clean UTF-8, no BOM.

### Commits

```powershell
# PowerShell has no bash heredoc; `git commit -F -` with <<'EOF' is a parser error.
# Write the message to a file, then:
git commit --quiet -F <path-to-message-file>
```

| Commit | Phase |
| --- | --- |
| `7881a3a` | 0 + 1 — foundation, toolchain, design system |
| `ba23557` | 2 — home page |
| `02e5e84` | 3 — features, how-it-works, integrations, download |
| `90a6f55` | 4 — pricing, security, solutions, about, contact |
| `0b1a3a0` | 5 — docs, blog, comparison pages |

---

### Phase 5 — content engine

```powershell
npm install @astrojs/rss --no-fund --no-audit

# Confirm the content-layer API before writing 14 content files against it
node -e "const l=require('astro/loaders'); console.log(Object.keys(l).join(', '))"
# => file, glob   (Astro 5's content layer, unchanged in 7)
```

Verifying the generated Markdown mirrors actually carry body text, rather than
assuming the route compiled correctly:

```powershell
Get-Content "dist\docs\quickstart.md" -TotalCount 20
Get-ChildItem "dist\docs\*.md","dist\blog\*.md" | Select-Object Name,@{n='Bytes';e={$_.Length}}
(Get-Content "dist\rss.xml" -Raw).Substring(0,400)
```
✅ 10 mirrors, 2.3–5.1 KB each, full body text present. RSS valid.

⚠️ The mirrors *looked* like mojibake (`â€”` instead of `—`). That is PowerShell 5.1
reading UTF-8 as ANSI, **not** a file defect. Verified properly before chasing it:

```powershell
$b = [System.IO.File]::ReadAllBytes("dist\docs\quickstart.md")
"BOM: " + ($b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF)
[System.Text.Encoding]::UTF8.GetString($b)
```
✅ Clean UTF-8, no BOM. Same check later confirmed `COMMANDS.md` survived its
`Add-Content -Encoding utf8` append intact.

**Lesson worth keeping:** in this shell, never diagnose an encoding problem from
`Get-Content` output. Decode the bytes explicitly.

### Route inventory (verification, end of Phase 5)

```powershell
Get-ChildItem dist -Recurse -Filter index.html |
  ForEach-Object { '/' + $_.DirectoryName.Replace((Resolve-Path dist).Path,'').TrimStart('\').Replace('\','/') } |
  Sort-Object
Get-ChildItem dist -Recurse -Include *.md,*.xml |
  ForEach-Object { $_.FullName.Replace((Resolve-Path dist).Path,'').Replace('\','/') } | Sort-Object
Get-ChildItem dist\_astro | Select-Object Name,@{n='KB';e={[math]::Round($_.Length/1KB,1)}}
```
✅ **42 routes** — 29 HTML, 10 Markdown mirrors, RSS, 2 sitemaps.
Shipped weight: **41.7 KB CSS, 2.4 KB JS** (uncompressed). The JS is Astro's
prefetch helper; every interactive component is `is:inline` or plain vanilla.

---

## Conventions that bit us, worth remembering

| Trap | What happens | Do this instead |
| --- | --- | --- |
| Bash heredoc in PowerShell | `git commit -F - <<'EOF'` is a parser error | Write the message to a file, `git commit -F <file>` |
| `winget install` and PATH | New binaries are invisible to the current shell | Re-read PATH from the registry, or prepend `$env:ProgramFiles\nodejs` |
| `Get-Content` on UTF-8 | Em dashes render as `â€"` | Decode bytes with `[System.Text.Encoding]::UTF8` |
| Native stderr | PowerShell 5.1 surfaces it as a terminating error (e.g. `git init` hints) | Check the actual result, not just the error stream |
| `rdap.org` rate limits | HTTP 429 after ~11 rapid queries | Throttle with `Start-Sleep -Milliseconds 1700` |
| The Bash tool | No coreutils on PATH — `mkdir`, `curl`, `head`, `wc` all missing | Use the PowerShell tool for everything |


---

## Phase 6 — SEO, AI discoverability, performance

```powershell
npm install -D lighthouse --no-fund --no-audit

# Lighthouse needs a Chrome binary; reuse the one Playwright already downloaded
# rather than installing another.
$chrome = Get-ChildItem "$env:LOCALAPPDATA\ms-playwright" -Recurse -Filter "chrome.exe" | Select-Object -First 1
$env:CHROME_PATH = $chrome.FullName

npx lighthouse "http://localhost:4321/" --quiet `
  --chrome-flags="--headless=new --no-sandbox" `
  --output=json --output-path=$out `
  --only-categories=performance,accessibility,best-practices,seo
```
✅ **100 / 100 / 100 / 100** on all six routes audited.

⚠️ Lighthouse exits non-zero on Windows *after* writing its report — a
temp-directory cleanup error, not an audit failure. Read the JSON report
rather than trusting the exit code.

```powershell
node scripts/gen-og.mjs          # 30 OG cards via the installed Playwright
node scripts/check-external.mjs
node scripts/check-perf.mjs
```
Measured: 2.4 kB JS, 41.7 kB CSS, LCP 60–116 ms, CLS 0.0000, 4–5 requests.

❌ **A regex mistake damaged two files.** While stripping now-duplicated
`description={...}` props, the pattern `[^}]*\}` stopped at the first brace
*inside* a `${BRAND.name}` template literal, truncating the opening tag in
`about.astro` and `download.astro`. Caught before the build; repaired by hand.

**Lesson:** never write a regex spanning an attribute value that may contain
template literals. Phase 7 used a deliberately narrower transformation —
matching only `<pre` followed by whitespace or `>`, and checking the tag for an
existing attribute before touching it — and it was clean across 7 files.

---

## Phase 7 — accessibility, QA, deploy

```powershell
npm install -D @axe-core/playwright axe-core --no-fund --no-audit
npx playwright install firefox webkit
```

### Full accessibility audit

```powershell
npm run preview                  # background job
node scripts/check-a11y.mjs
```

First run: **14 violations, 3 distinct rules** across 58 page-loads
(29 routes × 2 themes) — none of which the Lighthouse spot-check had surfaced:

| Rule | Impact | Count | Fix |
| --- | --- | --- | --- |
| `scrollable-region-focusable` | serious | 4 | `tabindex="0"` on 7 `<pre>` and 4 scroll containers |
| `empty-table-header` | minor | 8 | Named the empty corner `<th>` in comparison tables |
| `color-contrast` | serious | 2 | `--c-success` retuned |

The contrast fix needed two attempts. `#1f7a50` measured 4.99:1 **against
white** — but that badge sits on `bg-success/10` over `--c-subtle`, not white,
which darkens the backdrop and gives only 4.36:1. Recomputed against the real
rendered backdrop: `#1a6b45`, 5.30:1.

✅ Second run: **0 violations, all interactive elements focusable.**

### CSP, generated and verified

```powershell
node scripts/gen-headers.mjs     # now part of npm run build
node scripts/check-csp.mjs
```

✅ CSP allows **7 inline script hashes and no `'unsafe-inline'`** — only
possible because nothing third-party loads.

`astro preview` does not apply `dist/_headers`, so `check-csp.mjs` starts its
own server with the real headers and drives the theme toggle and the connector
filter behind them. An untested CSP silently kills inline scripts on deploy day.

### Links, claims, browsers

```powershell
node scripts/check-links.mjs     # 1505 links, 0 broken, 1 external destination
node scripts/check-claims.mjs    # 3 placeholders, 0 forbidden phrases
node scripts/check-browsers.mjs  # chromium + firefox + webkit
```

---

## Additional environment traps (Phases 6–7)

| Trap | What happens | Do this instead |
| --- | --- | --- |
| `Out-File -Encoding utf8` on PS 5.1 | Writes a BOM; git puts it in the commit subject line | `[System.IO.File]::WriteAllText($p, $s, (New-Object System.Text.UTF8Encoding $false))` |
| Inline `node -e "..."` containing JS regex | PowerShell parses `[`, `{` and `)` inside the string and fails | Write the script to a file and run it |
| Lighthouse on Windows | Exits non-zero after a successful run | Parse the JSON report; ignore the exit code |
| Contrast maths against white | The token may actually sit on a tinted wash | Compute against the real rendered backdrop |
| Long here-strings in PowerShell | Safety hooks may match text inside them | Write the content to a file, append with node |

---

## 2026-09-23 — Site ↔ product audit (read-only; nothing in either repo changed)

Findings and open questions: [QUESTIONS_site_product_sync.md](QUESTIONS_site_product_sync.md).

```powershell
# What the engine registers (54 components)
E:\workspace_09212026\ETL_Local_Tool\target\debug\etl.exe components
E:\workspace_09212026\ETL_Local_Tool\target\debug\etl.exe --help
E:\workspace_09212026\ETL_Local_Tool\target\debug\etl.exe run --help

# Sandbox proof for JSONL (both ways) and the Parquet source: pipelines and data in
# Claude's scratchpad, --workspace pointed there so no run history lands in the repo.
#   a: csv -> jsonl   b: jsonl -> parquet   c: parquet -> csv   => 12/12 rows, 0 differing
$etl = "E:\workspace_09212026\ETL_Local_Tool\target\debug\etl.exe"
$db  = "E:\workspace_09212026\ETL_Local_Tool\tools\duckdb\duckdb.exe"
& $etl run "$S\a_csv_to_jsonl.json"     --workspace $S --duckdb $db
& $etl run "$S\b_jsonl_to_parquet.json" --workspace $S --duckdb $db
& $etl run "$S\c_parquet_to_csv.json"   --workspace $S --duckdb $db

# Placeholder count (3: pricing.pro, pricing.team, demo.placeholder)
npm run -s check:claims
```

Code and test coverage were read with `grep`/`sed` over `crates/`, `apps/desktop/src`,
`frontend/src` and `crates/duckdb-engine/tests/end_to_end.rs`.

## 2026-09-23 — Site/product sync: re-audit after the Tool's Phase 10a–10c

Read-only, plus one doc rewritten. No site source changed.

```powershell
git status -sb
Get-ChildItem src -Recurse -File -Include *.ts,*.js,*.json,*.mjs   # where claims live
Get-Content src\data\connectors.ts                                 # 46 entries, all planned
Get-Content docs\CLAIMS.md
Select-String src\pages\features.astro, src\pages\how-it-works.astro -Pattern ...   # feature claims
```

Edited: `docs/QUESTIONS_site_product_sync.md` -- re-audited against 58 components and Phase 10c's
verification (12 site entries now verified, 1 with a caveat, 33 not built); question 2 of the
first audit dropped as answered by 10c; four new questions (S3 vs AWS, XML and REST/GraphQL,
docs pages, TSV/MariaDB). Eight questions in all, awaiting answers.

## 2026-09-23 — Answers recorded; sync plan written

Read-only in `src/`. Docs written: the answers in `QUESTIONS_site_product_sync.md`, and
`PLAN_site_product_sync.md`.

```bash
# Where status and claims live
sed -n 1,200p src/data/connectors.ts
grep -n "status\|available\|planned" src/components/sections/ConnectorGrid.astro src/pages/integrations.astro src/pages/llms*.ts
sed -n 1,138p src/pages/features.astro
sed -n 1,40p src/data/roadmap.ts

# Where each audited claim recurs across the site (feeds the plan's S2 table)
for p in "macOS" "lineage" "fan out" "audit trail" "chart" "on-device" "CDC" "schema drift" \
         "Python" "SQL editor" "pipeline\.yaml" "secret store|keychain" "serve --"; do
  grep -rliE "$p" src; done

# The eight answers, written under each "Answer:" line
awk '/^Answer:$/{...}' docs/QUESTIONS_site_product_sync.md

# What a push runs (verify + audit; GitHub Pages deploy is opt-in)
grep -nE "^on:|push|ENABLE_GITHUB_PAGES|if:" .github/workflows/deploy.yml
```

## 2026-09-23 — Sync S1: connector catalogue

```bash
# Edits scripted with python str.replace, each asserting its anchor occurs once:
#   src/data/connectors.ts, components/sections/ConnectorGrid.astro, pages/integrations.astro,
#   pages/llms.txt.ts, pages/llms-full.txt.ts, config/pages.ts
grep -c "status: 'working'" src/data/connectors.ts        # 13
grep -c "status: 'planned'" src/data/connectors.ts        # 36
export ASTRO_TELEMETRY_DISABLED=1
npm run build                                            # 32 pages; external + headers checks pass
npm run -s check                                         # 0 errors, 0 warnings
npx astro preview --port 4321                            # detaches; `astro preview stop` ends it
export MSYS_NO_PATHCONV=1                                # else Git Bash turns /integrations into a Windows path
THEMES=light,dark node scripts/screenshot.mjs /integrations
node scripts/shot-el.mjs / "#ingest"                     # the home page's connector grid
npm run -s check:links                                   # all internal links resolve
npm run -s check:a11y                                    # 62 page-loads, 0 violations
```

| Failure | Cause | Fix |
| --- | --- | --- |
| `screenshot.mjs /integrations` navigated to `http://localhost:4321C:/Users/...` | Git Bash (MSYS) path conversion rewrote the argument | `MSYS_NO_PATHCONV=1` |
| `shot-el.mjs / "#connectors"` crashed | No such id; the grid is in `#ingest` | Use `#ingest` |
| "are marked✓" | JSX dropped the space before the icon | `{' '}` |

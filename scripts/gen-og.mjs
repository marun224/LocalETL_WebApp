/**
 * Generates one 1200x630 OG card per route into public/og/.
 *
 * Rendered with Playwright, which is already a devDependency for visual
 * checks. The alternatives (satori + resvg, canvaskit-wasm) would each add a
 * rendering stack to produce images we generate once and commit — Chromium is
 * already here and gives exact CSS control.
 *
 * Run with `npm run og`, not on every build: the output is static and belongs
 * in version control so a deploy never depends on a browser being installed.
 *
 *   node scripts/gen-og.mjs
 */
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT = path.join(process.cwd(), 'public', 'og');
await mkdir(OUT, { recursive: true });

// --- Collect routes -------------------------------------------------------
// pages.ts is TypeScript; parse the fields we need rather than compiling it.
const pagesSrc = await readFile('src/config/pages.ts', 'utf8');
const entries = [];
for (const m of pagesSrc.matchAll(
  /path:\s*'([^']+)',\s*\n\s*title:\s*\n?\s*'([^']*)'/g
)) {
  entries.push({ path: m[1], title: m[2] });
}
// Titles spanning two lines need the looser pass as well.
for (const m of pagesSrc.matchAll(/path:\s*'([^']+)',\s*\n\s*title:\s*'([^']*)'/g)) {
  if (!entries.some((e) => e.path === m[1])) entries.push({ path: m[1], title: m[2] });
}

// Content collections, read straight from frontmatter.
const { readdir } = await import('node:fs/promises');
for (const [dir, prefix, kicker] of [
  ['src/content/docs', '/docs', 'Documentation'],
  ['src/content/blog', '/blog', 'Writing'],
  ['src/content/compare', '/compare', 'Comparison'],
]) {
  for (const f of await readdir(dir)) {
    if (!/\.mdx?$/.test(f)) continue;
    const src = await readFile(path.join(dir, f), 'utf8');
    const title = src.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
    entries.push({
      path: `${prefix}/${f.replace(/\.mdx?$/, '')}`,
      title: title ?? f,
      kicker,
    });
  }
}

const KICKERS = {
  '/': 'Local-first ETL & analytics',
  '/features': 'Product',
  '/how-it-works': 'Architecture',
  '/integrations': 'Product',
  '/security': 'Security',
  '/download': 'Get started',
  '/pricing': 'Pricing',
  '/about': 'About',
  '/contact': 'Contact',
  '/docs': 'Documentation',
  '/blog': 'Writing',
  '/solutions/data-engineers': 'Solutions',
  '/solutions/analysts': 'Solutions',
  '/solutions/enterprise': 'Solutions',
};

const fontSans = await readFile('public/fonts/geist-latin-wght-normal.woff2');
const fontMono = await readFile('public/fonts/geist-mono-latin-wght-normal.woff2');
const b64Sans = fontSans.toString('base64');
const b64Mono = fontMono.toString('base64');

const card = (title, kicker) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(data:font/woff2;base64,${b64Sans}) format('woff2-variations');font-weight:100 900}
@font-face{font-family:GM;src:url(data:font/woff2;base64,${b64Mono}) format('woff2-variations');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#10161e;font-family:G;display:flex;flex-direction:column;
     justify-content:space-between;padding:72px;position:relative;overflow:hidden}
.glow{position:absolute;inset:-40% 30% 55% -20%;background:radial-gradient(circle,#0e7c6655,transparent 65%)}
.brand{display:flex;align-items:center;gap:16px;position:relative}
.name{color:#e6edf3;font-size:30px;font-weight:600;letter-spacing:-.02em}
.kicker{font-family:GM;font-size:20px;color:#2dd4a7;text-transform:uppercase;letter-spacing:.1em;
        position:relative;margin-bottom:22px}
h1{color:#e6edf3;font-size:${title.length > 52 ? 62 : 74}px;line-height:1.08;font-weight:600;
   letter-spacing:-.03em;position:relative;max-width:1000px}
.foot{display:flex;justify-content:space-between;align-items:center;position:relative;
      border-top:1px solid #222c38;padding-top:26px}
.url{font-family:GM;font-size:22px;color:#8b98a8}
.tag{font-family:GM;font-size:20px;color:#8b98a8;display:flex;align-items:center;gap:10px}
.dot{width:9px;height:9px;border-radius:50%;background:#2dd4a7}
</style></head><body>
<div class="glow"></div>
<div class="brand">
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
    <path d="M2 7h9.5l4 4.5M2 16h9.5M2 25h9.5l4-4.5" stroke="#2dd4a7" stroke-width="2.1"
          stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.5 11.5h3.2v9h-3.2z" stroke="#2dd4a7" stroke-width="2.1" stroke-linejoin="round"/>
    <circle cx="25" cy="16" r="5.4" stroke="#2dd4a7" stroke-width="2.1"/>
  </svg>
  <span class="name">Headrace</span>
</div>
<div>
  <div class="kicker">${kicker}</div>
  <h1>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</h1>
</div>
<div class="foot">
  <span class="url">headrace.ai</span>
  <span class="tag"><span class="dot"></span>Pre-launch</span>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

let n = 0;
for (const e of entries) {
  const slug = e.path === '/' ? 'home' : e.path.replace(/^\//, '').replace(/\//g, '-');
  const kicker = e.kicker ?? KICKERS[e.path] ?? 'Headrace';

  await page.setContent(card(e.title, kicker), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `${slug}.png`) });
  n++;
}

// Fallback card for any route without its own.
await page.setContent(card('Local-first ETL and analytics', 'Headrace'), { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(OUT, 'default.png') });

await browser.close();
console.log(`✓ generated ${n + 1} OG cards into public/og/`);

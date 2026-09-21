/**
 * Screenshot individual elements by CSS selector, for close inspection.
 *   node scripts/shot-el.mjs /  "#architecture" "#ingest"
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const OUT = path.join(process.cwd(), '.screenshots');
const THEME = process.env.THEME ?? 'light';
const [route, ...selectors] = process.argv.slice(2);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: THEME,
});
await ctx.addInitScript((t) => {
  try {
    localStorage.setItem('theme', t);
  } catch {}
}, THEME);

const page = await ctx.newPage();
await page.goto(BASE + route, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

for (const sel of selectors) {
  const el = page.locator(sel).first();
  const name = sel.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  const file = path.join(OUT, `el-${name}.${THEME}.png`);
  await el.screenshot({ path: file });
  console.log(`✓ ${sel} → ${path.basename(file)}`);
}

await browser.close();

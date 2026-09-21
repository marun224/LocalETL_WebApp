/**
 * Visual verification helper (dev only).
 *
 * Renders routes from the local preview server to PNGs so changes can be
 * checked visually across themes and viewports.
 *
 *   node scripts/screenshot.mjs                       # defaults
 *   node scripts/screenshot.mjs /pricing /docs        # specific routes
 *   BASE=http://localhost:4322 node scripts/screenshot.mjs
 *
 * Playwright is a devDependency; none of this ships to the site.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const OUT = process.env.OUT ?? path.join(process.cwd(), '.screenshots');
const THEMES = (process.env.THEMES ?? 'light,dark').split(',');
const VIEWPORTS = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
};
const SIZES = (process.env.SIZES ?? 'desktop').split(',');

const routes = process.argv.slice(2);
if (routes.length === 0) routes.push('/', '/styleguide');

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const failures = [];

for (const size of SIZES) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({
      viewport: VIEWPORTS[size],
      deviceScaleFactor: 2,
      colorScheme: theme,
    });

    // Seed the theme the same way a returning visitor would have it.
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem('theme', t);
      } catch {}
    }, theme);

    const page = await ctx.newPage();

    // Fail loudly on console errors and any request to a foreign origin —
    // the zero-third-party rule is checked here too, not just at build time.
    page.on('pageerror', (e) => failures.push(`[${theme}] pageerror: ${e.message}`));
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.origin !== new URL(BASE).origin && url.protocol !== 'data:') {
        failures.push(`THIRD-PARTY REQUEST: ${req.url()}`);
      }
    });

    for (const route of routes) {
      const url = BASE + route;
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      if (!res || !res.ok()) {
        failures.push(`${route} → HTTP ${res?.status() ?? 'no response'}`);
        continue;
      }
      await page.evaluate(() => document.fonts.ready);

      const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
      const file = path.join(OUT, `${slug}.${size}.${theme}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✓ ${route.padEnd(28)} ${size}/${theme}`);
    }

    await ctx.close();
  }
}

await browser.close();

if (failures.length) {
  console.error('\n✗ Problems found:');
  for (const f of [...new Set(failures)]) console.error('  ' + f);
  process.exit(1);
}
console.log(`\nSaved to ${OUT}`);

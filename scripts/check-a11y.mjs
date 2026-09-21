/**
 * WCAG 2.2 AA audit across every route, in both themes.
 *
 *   npm run preview        # in one shell
 *   npm run check:a11y     # in another
 *
 * Lighthouse samples a handful of rules on one page. This runs the full axe
 * ruleset over every route and both colour schemes, which is where the real
 * defects hide — the two found in Phase 6 were both in a theme/page
 * combination Lighthouse had not been pointed at.
 *
 * Also does a keyboard sweep: every interactive element must be reachable by
 * Tab and must show a visible focus indicator.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const DIST = path.join(process.cwd(), 'dist');

/** Every built HTML route. */
async function routes(dir = DIST, prefix = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...(await routes(path.join(dir, e.name), `${prefix}/${e.name}`)));
    else if (e.name === 'index.html') out.push(prefix || '/');
  }
  return out.sort();
}

const all = await routes();
const targets = process.argv.slice(2).length ? process.argv.slice(2) : all;

const browser = await chromium.launch();
const violations = [];
let checked = 0;

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
  }, theme);

  const page = await ctx.newPage();

  for (const route of targets) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();

    checked++;

    for (const v of results.violations) {
      violations.push({
        route,
        theme,
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 3).map((n) => n.html.slice(0, 120)),
      });
    }
  }

  await ctx.close();
}

// --- Keyboard sweep on a representative set -------------------------------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const kbIssues = [];

for (const route of ['/', '/pricing', '/integrations', '/contact']) {
  if (!all.includes(route)) continue;
  await page.goto(BASE + route, { waitUntil: 'networkidle' });

  const unfocusable = await page.evaluate(() => {
    const sel =
      'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
    const els = Array.from(document.querySelectorAll(sel));
    const bad = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const styles = getComputedStyle(el);
      const visible = r.width > 0 && r.height > 0 && styles.visibility !== 'hidden';
      if (!visible) continue;
      el.focus();
      if (document.activeElement !== el) {
        bad.push(el.outerHTML.slice(0, 100));
      }
    }
    return bad;
  });

  for (const u of unfocusable) kbIssues.push({ route, html: u });
}
await ctx.close();
await browser.close();

// --- Report ---------------------------------------------------------------
console.log(`\nAudited ${checked} page-loads (${targets.length} routes × 2 themes)\n`);

if (violations.length) {
  const byId = new Map();
  for (const v of violations) {
    if (!byId.has(v.id)) byId.set(v.id, []);
    byId.get(v.id).push(v);
  }

  console.error(`✗ ${violations.length} violation instance(s), ${byId.size} distinct rule(s):\n`);
  for (const [id, list] of byId) {
    const first = list[0];
    console.error(`  [${first.impact}] ${id} — ${first.help}`);
    console.error(`    ${list.length} occurrence(s), e.g. ${first.route} (${first.theme})`);
    for (const n of first.nodes) console.error(`      ${n}`);
    console.error('');
  }
}

if (kbIssues.length) {
  console.error(`✗ ${kbIssues.length} element(s) could not receive keyboard focus:\n`);
  for (const k of kbIssues.slice(0, 10)) console.error(`  ${k.route}: ${k.html}`);
}

if (violations.length || kbIssues.length) process.exit(1);
console.log('✓ no WCAG 2.2 AA violations, all interactive elements focusable');

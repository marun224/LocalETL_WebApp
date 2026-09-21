/**
 * Measures the performance budget on a running preview server.
 *
 *   npm run preview           # in one shell
 *   npm run check:perf        # in another
 *
 * Reports real numbers per route — transferred bytes by type, request count,
 * LCP and CLS — and exits non-zero if a budget is breached. Lighthouse gives
 * a score; this gives the figures the score is derived from, which is what
 * you actually act on.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4321';

const BUDGET = {
  jsBytes: 80 * 1024,
  cssBytes: 60 * 1024,
  totalBytes: 600 * 1024,
  lcpMs: 1500,
  cls: 0.05,
  requests: 25,
};

const ROUTES = process.argv.slice(2);
if (ROUTES.length === 0) {
  ROUTES.push('/', '/features', '/integrations', '/pricing', '/docs/quickstart', '/blog');
}

const browser = await chromium.launch();
const rows = [];
const failures = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const bytes = { js: 0, css: 0, font: 0, image: 0, html: 0, other: 0 };
  let requests = 0;

  page.on('response', async (res) => {
    requests++;
    const type = res.request().resourceType();
    let len = Number(res.headers()['content-length'] ?? 0);
    if (!len) {
      try {
        len = (await res.body()).length;
      } catch {
        len = 0;
      }
    }
    if (type === 'script') bytes.js += len;
    else if (type === 'stylesheet') bytes.css += len;
    else if (type === 'font') bytes.font += len;
    else if (type === 'image') bytes.image += len;
    else if (type === 'document') bytes.html += len;
    else bytes.other += len;
  });

  await page.goto(BASE + route, { waitUntil: 'networkidle' });

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve({ lcp, cls }), 900);
      })
  );

  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  const row = {
    route,
    js: bytes.js,
    css: bytes.css,
    font: bytes.font,
    img: bytes.image,
    total,
    reqs: requests,
    lcp: Math.round(vitals.lcp),
    cls: Number(vitals.cls.toFixed(4)),
  };
  rows.push(row);

  const check = (name, value, limit, unit) => {
    if (value > limit) failures.push(`${route}: ${name} ${value}${unit} > ${limit}${unit}`);
  };
  check('JS', row.js, BUDGET.jsBytes, 'B');
  check('CSS', row.css, BUDGET.cssBytes, 'B');
  check('total', row.total, BUDGET.totalBytes, 'B');
  check('LCP', row.lcp, BUDGET.lcpMs, 'ms');
  check('CLS', row.cls, BUDGET.cls, '');
  check('requests', row.reqs, BUDGET.requests, '');

  await ctx.close();
}

await browser.close();

const kb = (n) => (n / 1024).toFixed(1).padStart(7);
console.log(
  '\nroute'.padEnd(32) +
    'JS kB'.padStart(8) +
    'CSS kB'.padStart(9) +
    'font kB'.padStart(9) +
    'total kB'.padStart(10) +
    'reqs'.padStart(6) +
    'LCP ms'.padStart(8) +
    'CLS'.padStart(8)
);
console.log('-'.repeat(90));
for (const r of rows) {
  console.log(
    r.route.padEnd(32) +
      kb(r.js) +
      kb(r.css).padStart(9) +
      kb(r.font).padStart(9) +
      kb(r.total).padStart(10) +
      String(r.reqs).padStart(6) +
      String(r.lcp).padStart(8) +
      r.cls.toFixed(4).padStart(8)
  );
}

if (failures.length) {
  console.error('\n✗ budget breaches:');
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('\n✓ all routes within budget');

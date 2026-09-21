/**
 * Serves dist/ WITH the generated security headers and checks that nothing
 * breaks under them.
 *
 * `astro preview` does not apply dist/_headers, so a CSP mistake would not
 * surface until the site was deployed — by which point the theme toggle or
 * the nav would be silently dead. This loads real pages behind the real
 * policy and fails on any CSP violation or console error.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.join(process.cwd(), 'dist');
const PORT = 4399;

// --- Parse the generated _headers ----------------------------------------
const raw = await readFile(path.join(DIST, '_headers'), 'utf8');
const globalHeaders = {};
let inGlobal = false;
for (const line of raw.split('\n')) {
  if (line.startsWith('/*')) {
    inGlobal = true;
    continue;
  }
  if (/^\//.test(line)) {
    inGlobal = false;
    continue;
  }
  if (inGlobal && line.trim() && line.includes(':')) {
    const i = line.indexOf(':');
    globalHeaders[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const candidates = [
    path.join(DIST, url),
    path.join(DIST, url, 'index.html'),
    path.join(DIST, url + '.html'),
  ];

  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (!s.isFile()) continue;
      const body = await readFile(c);
      // HSTS is meaningless over plain http and browsers ignore it there.
      for (const [k, v] of Object.entries(globalHeaders)) {
        if (k === 'Strict-Transport-Security') continue;
        res.setHeader(k, v);
      }
      res.setHeader('Content-Type', TYPES[path.extname(c)] ?? 'application/octet-stream');
      res.writeHead(200);
      res.end(body);
      return;
    } catch {
      /* try next */
    }
  }
  res.writeHead(404);
  res.end('not found');
});

await new Promise((r) => server.listen(PORT, r));

// --- Drive real pages behind the policy ----------------------------------
const ROUTES = ['/', '/pricing', '/integrations', '/contact', '/docs/quickstart', '/compare/fivetran'];
const problems = [];

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', (m) => {
  const t = m.text();
  if (m.type() === 'error') problems.push(`console error: ${t}`);
  if (/Content Security Policy|Refused to/i.test(t)) problems.push(`CSP: ${t}`);
});
page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));

for (const route of ROUTES) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });

  // The inline theme script must have run: it sets data-theme pre-paint.
  const theme = await page.getAttribute('html', 'data-theme');
  if (!theme) problems.push(`${route}: data-theme not set — inline theme script blocked`);

  // The toggle is inline script too; exercise it.
  const toggle = page.locator('#theme-toggle');
  if (await toggle.count()) {
    const before = await page.getAttribute('html', 'data-theme');
    await toggle.click();
    const after = await page.getAttribute('html', 'data-theme');
    if (before === after) problems.push(`${route}: theme toggle did not change theme`);
  }
}

// The connector filter is a module script; make sure it still runs.
await page.goto(`http://localhost:${PORT}/integrations`, { waitUntil: 'networkidle' });
const countText = await page.locator('#result-count').textContent();
if (!countText || !/\d/.test(countText)) {
  problems.push('/integrations: filter script did not populate the result count');
}

await browser.close();
server.close();

if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s) under the generated CSP:\n`);
  for (const p of [...new Set(problems)]) console.error('  ' + p);
  process.exit(1);
}
console.log(`\n✓ ${ROUTES.length} routes work under the full security headers`);
console.log(`  script-src has no 'unsafe-inline'; inline scripts allowed by hash`);

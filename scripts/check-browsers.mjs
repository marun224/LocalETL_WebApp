/**
 * Cross-browser smoke test: Chromium, Firefox and WebKit (Safari's engine).
 *
 * Checks the things most likely to differ between engines on this site —
 * the pre-paint theme script, the CSS-only nav dropdown, <details> accordions,
 * the vanilla-JS connector filter, and whether modern CSS
 * (color-mix, @custom-variant, text-wrap) actually applied.
 *
 *   npm run preview
 *   npm run check:browsers
 */
import { chromium, firefox, webkit } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const ENGINES = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
];

const failures = [];

for (const [name, engine] of ENGINES) {
  const browser = await engine.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  const fail = (msg) => failures.push(`[${name}] ${msg}`);

  // --- Home -------------------------------------------------------------
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  if (!(await page.getAttribute('html', 'data-theme'))) fail('data-theme not set before paint');

  const h1 = (await page.locator('h1').first().textContent())?.trim() ?? '';
  if (!h1.includes('From raw source')) fail(`h1 unexpected: "${h1.slice(0, 60)}"`);

  // Theme toggle
  const before = await page.getAttribute('html', 'data-theme');
  await page.locator('#theme-toggle').click();
  if ((await page.getAttribute('html', 'data-theme')) === before) fail('theme toggle inert');

  // Modern CSS actually applied — a fallback would render transparent/black.
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (!bodyBg || bodyBg === 'rgba(0, 0, 0, 0)') fail(`body background not applied (${bodyBg})`);

  const frameBg = await page.evaluate(() => {
    const el = document.querySelector('figure div');
    return el ? getComputedStyle(el).backgroundColor : null;
  });
  if (!frameBg || frameBg === 'rgba(0, 0, 0, 0)') fail('product frame background missing');

  // Fonts loaded (self-hosted woff2 with unicode-range).
  const fontOk = await page.evaluate(() =>
    document.fonts.check('600 16px "Geist Variable"')
  );
  if (!fontOk) fail('Geist Variable not loaded');

  // --- Accordion (native <details>) --------------------------------------
  const details = page.locator('#faq details').first();
  if (await details.count()) {
    await details.locator('summary').click();
    // First item ships open, so a click closes it.
    if (await details.evaluate((d) => d.open)) {
      await details.locator('summary').click();
      if (!(await details.evaluate((d) => d.open))) fail('accordion does not toggle');
    }
  }

  // --- Connector filter (vanilla JS) -------------------------------------
  await page.goto(BASE + '/integrations', { waitUntil: 'networkidle' });
  const initial = (await page.locator('#result-count').textContent()) ?? '';
  if (!/\d/.test(initial)) fail('connector count did not render');

  await page.fill('#connector-search', 'postgres');
  await page.waitForTimeout(150);
  const filtered = (await page.locator('#result-count').textContent()) ?? '';
  if (filtered === initial) fail('connector search did not filter');

  const visible = await page.locator('.connector-item:visible').count();
  if (visible === 0) fail('connector search hid everything');

  // --- Nav dropdown (CSS-only, focus-within) -----------------------------
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const navLink = page.locator('nav[aria-label="Main"] a[href="/features"]').first();
  if ((await navLink.count()) && !(await navLink.isVisible())) {
    // Hidden until hover is correct; check it reveals.
    await page.locator('nav[aria-label="Main"] button').first().hover();
    await page.waitForTimeout(200);
    if (!(await navLink.isVisible())) fail('nav dropdown does not open on hover');
  }

  if (errors.length) fail(`console/page errors: ${[...new Set(errors)].slice(0, 3).join(' | ')}`);

  await browser.close();
  console.log(`  ${name.padEnd(10)} checked`);
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} cross-browser problem(s):\n`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('\n✓ Chromium, Firefox and WebKit all behave correctly');

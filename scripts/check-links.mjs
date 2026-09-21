/**
 * Verifies every internal link resolves to something that was actually built.
 *
 * Runs against dist/ with no server, so it is fast and CI-safe. External links
 * are listed but not fetched — a network check would make the build flaky and
 * fail on rate limits rather than on our mistakes.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = async (p) => {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
};

/** Does this internal href correspond to a built file? */
async function resolves(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return exists(path.join(DIST, 'index.html'));

  const rel = clean.replace(/^\//, '');
  return (
    (await exists(path.join(DIST, rel))) ||
    (await exists(path.join(DIST, rel, 'index.html'))) ||
    (await exists(path.join(DIST, rel + '.html')))
  );
}

const files = await walk(DIST);
const broken = [];
const external = new Set();
const anchors = [];
let total = 0;

for (const file of files) {
  const src = await readFile(file, 'utf8');
  const from = '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '');

  for (const m of src.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = m[1].trim();
    total++;

    if (/^(https?:)?\/\//i.test(href)) {
      external.add(href);
      continue;
    }
    if (/^(mailto:|tel:)/i.test(href)) continue;
    if (href.startsWith('#')) {
      anchors.push({ from, href });
      continue;
    }
    if (!href.startsWith('/')) {
      broken.push({ from, href, why: 'relative link (use an absolute path)' });
      continue;
    }
    if (!(await resolves(href))) {
      broken.push({ from, href, why: 'no such page in dist/' });
    }
  }
}

console.log(`\nChecked ${total} links across ${files.length} pages`);
console.log(`  internal broken : ${broken.length}`);
console.log(`  external (not fetched) : ${external.size}`);
console.log(`  same-page anchors : ${anchors.length}\n`);

if (external.size) {
  console.log('External destinations:');
  for (const e of [...external].sort()) console.log('  ' + e);
  console.log('');
}

if (broken.length) {
  console.error('✗ broken internal links:\n');
  for (const b of broken) console.error(`  ${b.from}  →  ${b.href}   (${b.why})`);
  process.exit(1);
}

console.log('✓ all internal links resolve');

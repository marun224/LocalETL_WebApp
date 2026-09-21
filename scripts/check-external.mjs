/**
 * Fails the build if the site references any third-party origin.
 *
 * The footer claims "This site makes no third-party requests." That claim is
 * the product's own thesis demonstrated on its own website, so it needs to be
 * enforced rather than trusted — one `<link>` to Google Fonts added in six
 * months would quietly make the site a liar.
 *
 * Scans built HTML and CSS for resource-loading references. Outbound <a href>
 * links are fine: a link is something the visitor chooses to follow, not a
 * request the page makes on their behalf.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');

/** Origins the page may load resources from. Own origin only. */
const ALLOWED_PREFIXES = ['/', './', '../', 'data:', '#', 'mailto:', 'https://headrace.ai'];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(html|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

// Attributes that cause the browser to FETCH something.
const RESOURCE_ATTRS = /(?:src|srcset|data-src)\s*=\s*["']([^"']+)["']/gi;
const LINK_HREF = /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
const CSS_URL = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
const CSS_IMPORT = /@import\s+["']([^"']+)["']/gi;

const violations = [];

function check(file, url, kind) {
  const u = url.trim();
  if (!u) return;
  if (ALLOWED_PREFIXES.some((p) => u.startsWith(p))) return;
  if (!/^[a-z]+:\/\//i.test(u)) return; // relative path
  violations.push({ file: path.relative(process.cwd(), file), url: u, kind });
}

let files;
try {
  files = await walk(DIST);
} catch {
  console.error('✗ dist/ not found — run a build first.');
  process.exit(1);
}

for (const file of files) {
  const src = await readFile(file, 'utf8');

  for (const m of src.matchAll(RESOURCE_ATTRS)) check(file, m[1], 'src');
  for (const m of src.matchAll(CSS_URL)) check(file, m[1], 'css url()');
  for (const m of src.matchAll(CSS_IMPORT)) check(file, m[1], '@import');

  // <link> only matters when it actually fetches (stylesheet, preload, font).
  for (const m of src.matchAll(LINK_HREF)) {
    const tag = m[0];
    const href = m[1];
    const fetches =
      /rel\s*=\s*["'][^"']*\b(stylesheet|preload|prefetch|preconnect|dns-prefetch|modulepreload)\b/i.test(
        tag
      );
    if (fetches) check(file, href, 'link');
  }
}

if (violations.length) {
  console.error(`✗ ${violations.length} third-party resource reference(s) found:\n`);
  for (const v of violations) {
    console.error(`  [${v.kind}] ${v.url}\n      in ${v.file}`);
  }
  console.error(
    '\nThe site footer claims it makes no third-party requests.\n' +
      'Either remove the reference, or remove the claim.'
  );
  process.exit(1);
}

console.log(`✓ no third-party resource references (${files.length} files scanned)`);

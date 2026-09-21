/**
 * The pre-launch gate.
 *
 * Enumerates every non-real claim rendered into the built site by reading
 * `data-claim-status` out of the DOM, rather than by anyone remembering to
 * check a list. Also greps for the specific words we have committed never to
 * use without evidence.
 *
 * Exits 0 and reports. It does NOT fail the build — shipping with a known
 * placeholder is the user's decision to make, not a machine's. It only makes
 * sure the decision is an informed one.
 *
 *   npm run check:claims
 */
import { readdir, readFile } from 'node:fs/promises';
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

/**
 * Words that must never appear as an unqualified assertion. Each one is a
 * commitment recorded in CLAIMS.md.
 */
const FORBIDDEN = [
  { re: /\bSOC\s?2\b/gi, why: 'certification we do not hold' },
  { re: /\bISO\s?27001\b/gi, why: 'certification we do not hold' },
  { re: /\bHIPAA[- ]compliant\b/gi, why: 'compliance claim we cannot make' },
  { re: /\bGDPR[- ]compliant\b/gi, why: 'compliance claim we cannot make' },
  { re: /\btrusted by\s+[\d,]+/gi, why: 'adoption claim with no customers' },
  { re: /\b\d[\d,.]*\+?\s*(?:companies|teams|customers|users)\s+(?:use|trust)/gi, why: 'adoption claim' },
];

const files = await walk(DIST);
const placeholders = [];
const aspirational = [];
const forbidden = [];

for (const file of files) {
  const src = await readFile(file, 'utf8');
  const route = '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '');

  for (const m of src.matchAll(
    /data-claim-status="(placeholder|aspirational)"[^>]*data-claim-id="([^"]*)"/g
  )) {
    (m[1] === 'placeholder' ? placeholders : aspirational).push({ route, id: m[2] });
  }
  // Attribute order is not guaranteed; catch the reverse too.
  for (const m of src.matchAll(
    /data-claim-id="([^"]*)"[^>]*data-claim-status="(placeholder|aspirational)"/g
  )) {
    const list = m[2] === 'placeholder' ? placeholders : aspirational;
    if (!list.some((x) => x.route === route && x.id === m[1])) {
      list.push({ route, id: m[1] });
    }
  }

  // Strip tags so we only match visible prose, not class names or scripts.
  const text = src
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  for (const f of FORBIDDEN) {
    for (const m of text.matchAll(f.re)) {
      // The security page names these deliberately, to deny holding them.
      if (route.startsWith('/security') || route.startsWith('/llms')) continue;
      forbidden.push({ route, match: m[0].trim(), why: f.why });
    }
  }
}

console.log(`\nPre-launch claim audit — ${files.length} pages\n`);

console.log(`  placeholder claims : ${placeholders.length}`);
for (const p of placeholders) console.log(`      ${p.id.padEnd(24)} ${p.route}`);

console.log(`\n  aspirational claims: ${aspirational.length}`);
for (const a of aspirational) console.log(`      ${a.id.padEnd(24)} ${a.route}`);

if (forbidden.length) {
  console.error(`\n✗ ${forbidden.length} forbidden phrase(s) found:\n`);
  for (const f of forbidden) console.error(`      "${f.match}" on ${f.route} — ${f.why}`);
  process.exitCode = 1;
} else {
  console.log('\n  forbidden phrases  : 0');
}

if (placeholders.length) {
  console.log(
    `\n⚠ ${placeholders.length} placeholder(s) would ship. Each needs a real value,\n` +
      `  or removal, before launch. See CLAIMS.md.`
  );
} else {
  console.log('\n✓ no placeholders would ship');
}

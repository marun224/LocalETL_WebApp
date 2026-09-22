/**
 * Renames the whole project.
 *
 * The brand is provisional (open question Q1), so the cost of changing it was
 * always going to be paid once. This makes it one command instead of a
 * find-and-replace across 40+ files that would quietly miss the OG cards, the
 * external-origin allowlist and the generated llms.txt.
 *
 *   node scripts/rebrand.mjs --name Tidemill --domain tidemill.ai
 *   node scripts/rebrand.mjs --name Tidemill --domain tidemill.ai --slug tidemill
 *   node scripts/rebrand.mjs --name Tidemill --domain tidemill.ai --dry
 *
 * After running: `npm run og && npm run build && npm run check:links`
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// --- args -----------------------------------------------------------------
const args = process.argv.slice(2);
const arg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const NAME = arg('--name');
const DOMAIN = arg('--domain');
const SLUG = arg('--slug') ?? NAME?.toLowerCase();
const DRY = args.includes('--dry');

if (!NAME || !DOMAIN) {
  console.error(
    'Usage: node scripts/rebrand.mjs --name <Name> --domain <domain.tld> [--slug <slug>] [--dry]\n\n' +
      '  --name    Display name, e.g. Tidemill\n' +
      '  --slug    CLI/package name. Defaults to the lowercased name.\n' +
      '  --domain  Registrable domain, no protocol.\n' +
      '  --dry     Print what would change without writing.\n'
  );
  process.exit(1);
}

if (!/^[A-Z][A-Za-z0-9]*$/.test(NAME)) {
  console.error(`✗ --name "${NAME}" should be a single capitalised word, letters and digits only.`);
  process.exit(1);
}
if (!/^[a-z0-9-]+\.[a-z]{2,}$/.test(DOMAIN)) {
  console.error(`✗ --domain "${DOMAIN}" does not look like a bare domain (no protocol, no path).`);
  process.exit(1);
}

// --- read the current brand ----------------------------------------------
const brandSrc = await readFile('src/config/brand.ts', 'utf8');
const OLD_NAME = brandSrc.match(/name:\s*'([^']+)'/)?.[1];
const OLD_SLUG = brandSrc.match(/slug:\s*'([^']+)'/)?.[1];
const OLD_DOMAIN = brandSrc.match(/domain:\s*'([^']+)'/)?.[1];

if (!OLD_NAME || !OLD_SLUG || !OLD_DOMAIN) {
  console.error('✗ Could not read the current brand from src/config/brand.ts.');
  process.exit(1);
}

if (OLD_NAME === NAME && OLD_DOMAIN === DOMAIN) {
  console.log(`Nothing to do — already ${NAME} / ${DOMAIN}.`);
  process.exit(0);
}

console.log(`\n  ${OLD_NAME}  →  ${NAME}`);
console.log(`  ${OLD_SLUG}  →  ${SLUG}`);
console.log(`  ${OLD_DOMAIN}  →  ${DOMAIN}\n`);

// --- which files to touch -------------------------------------------------
const ROOTS = ['src', 'scripts', 'deploy', '.github'];

// Individually listed because their directories are not walked. Paths are
// repo-relative, so a file that moves must be updated here too.
const LOOSE_FILES = [
  'README.md',
  'docs/CONTRIBUTING.md',
  'package.json',
  'netlify.toml',
  'Dockerfile',
];
const EXT = /\.(astro|ts|tsx|js|mjs|json|md|mdx|css|yml|yaml|toml|conf)$/;

// Planning documents are a historical record of decisions made under the old
// name. Rewriting them would falsify the record, so they are left alone.
// They live in docs/, which is not walked — this set is belt and braces, and
// also guards them should they ever be added to LOOSE_FILES.
const SKIP = new Set([
  'IMPLEMENTATION_PLAN.md',
  'RESEARCH_COMPETITIVE.md',
  'COMMANDS.md',
  'TASK_TRACKER.md',
  'CLAIMS.md',
  // This file's own comments mention the old name as an example; rewriting
  // itself mid-run would be confusing rather than useful.
  'rebrand.mjs',
]);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXT.test(e.name) && !SKIP.has(e.name)) out.push(p);
  }
  return out;
}

const files = [...(await Promise.all(ROOTS.map(walk))).flat()];
for (const f of LOOSE_FILES) {
  if (SKIP.has(f)) continue;
  try {
    await stat(f);
    files.push(f);
  } catch {
    // A listed file that is not there means the list has drifted from the
    // repo — most likely the file moved. That happened to CONTRIBUTING.md when
    // the docs moved, and the silent skip here hid it, so say so loudly.
    console.warn(`  ! listed file not found, so NOT rewritten: ${f}`);
  }
}

// --- replace --------------------------------------------------------------
// Domain first: it contains the slug, so replacing the slug first would
// corrupt it (headrace.ai -> tidemill.ai only if done in this order).
const RULES = [
  [new RegExp(escape(OLD_DOMAIN), 'g'), DOMAIN],
  [new RegExp(`\\b${escape(OLD_NAME)}\\b`, 'g'), NAME],
  [new RegExp(`\\b${escape(OLD_SLUG)}\\b`, 'g'), SLUG],
];

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let changedFiles = 0;
let changedHits = 0;

for (const file of files) {
  const before = await readFile(file, 'utf8');
  let after = before;
  let hits = 0;

  for (const [re, to] of RULES) {
    after = after.replace(re, () => {
      hits++;
      return to;
    });
  }

  if (hits > 0) {
    changedFiles++;
    changedHits += hits;
    console.log(`  ${String(hits).padStart(4)}  ${file}`);
    if (!DRY) await writeFile(file, after);
  }
}

console.log(
  `\n${DRY ? 'Would change' : 'Changed'} ${changedHits} occurrence(s) in ${changedFiles} file(s).`
);

if (SKIP.size) {
  console.log(
    `\nLeft untouched (historical record of decisions made as ${OLD_NAME}):\n  ` +
      [...SKIP].join('\n  ')
  );
}

if (!DRY) {
  console.log(
    '\nNext:\n' +
      '  npm run og           # regenerate OG cards with the new name\n' +
      '  npm run build\n' +
      '  npm run check:links\n' +
      '\nStill manual:\n' +
      '  - public/favicon.svg colours, if the palette changes\n' +
      '  - the repository name and the GitHub org in src/config/site.js\n' +
      '  - buying the domain and clearing the trademark\n'
  );
}

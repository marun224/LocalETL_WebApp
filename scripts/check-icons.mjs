/**
 * Validates every <Icon name="..."> against the Iconify datasets.
 *
 * Icon.astro throws at build time on an unknown name, which is the right
 * behaviour but reports one failure per build. This finds all of them in
 * one pass, including dynamic names listed in src/data.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const lucide = require('@iconify-json/lucide/icons.json');
const simple = require('@iconify-json/simple-icons/icons.json');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(astro|ts|tsx|mdx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = await walk(path.join(process.cwd(), 'src'));
const bad = [];
const seen = new Set();

// <Icon name="x" />, name={`simple:${c.icon}`}, and icon: 'x' in data files
const patterns = [
  /<Icon\s[^>]*name=["']([^"'{}]+)["']/g,
  /\bicon:\s*['"]([a-z0-9:-]+)['"]/g,
  /\bicon=["']([a-z0-9:-]+)["']/g,
];

for (const file of files) {
  const src = await readFile(file, 'utf8');
  for (const re of patterns) {
    for (const m of src.matchAll(re)) {
      const name = m[1];
      const key = `${file}|${name}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const isBrand = name.startsWith('simple:');
      const bare = isBrand ? name.slice(7) : name;
      const set = isBrand ? simple : lucide;

      // Data files store brand slugs bare; try both sets before failing.
      const found = set.icons[bare] || (!isBrand && simple.icons[bare]);
      if (!found) bad.push({ file: path.relative(process.cwd(), file), name });
    }
  }
}

if (bad.length) {
  console.error(`✗ ${bad.length} unknown icon name(s):\n`);
  for (const b of bad) console.error(`  ${b.name.padEnd(24)} ${b.file}`);
  console.error('\nSearch names at https://icones.js.org/');
  process.exit(1);
}
console.log(`✓ all icon names resolve (${seen.size} references checked)`);

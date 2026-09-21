/**
 * Copies the latin font subsets out of @fontsource-variable into public/fonts.
 *
 * Only the latin files are copied: the site is English-only, and stable
 * filenames (rather than Vite-hashed ones) let BaseLayout preload them.
 * Run after bumping either fontsource package.
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const FILES = [
  ['@fontsource-variable/geist', 'geist-latin-wght-normal.woff2'],
  ['@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2'],
];

const dest = path.join(process.cwd(), 'public', 'fonts');
await mkdir(dest, { recursive: true });

for (const [pkg, file] of FILES) {
  const from = path.join(process.cwd(), 'node_modules', ...pkg.split('/'), 'files', file);
  await copyFile(from, path.join(dest, file));
  console.log(`✓ ${file}`);
}

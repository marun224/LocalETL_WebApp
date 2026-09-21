// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/config/site.js';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    // Emit `/about/index.html` style output so it works on any static host.
    format: 'directory',
    // Inline small stylesheets to cut a round trip; keeps the page dependency-free.
    inlineStylesheets: 'auto',
  },

  image: {
    // No remote image domains: every asset ships from our own origin.
    // See docs/ADR-0001 — the site must make zero third-party requests.
    domains: [],
    remotePatterns: [],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  devToolbar: {
    enabled: false,
  },
});

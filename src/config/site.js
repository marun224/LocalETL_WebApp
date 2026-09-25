/**
 * Site-level constants.
 *
 * This is `.js` rather than `.ts` on purpose: `astro.config.mjs` imports it at
 * config-load time, before the TypeScript pipeline is available.
 *
 * PLACEHOLDERS: every value marked TODO must be confirmed before launch.
 * See CLAIMS.md and IMPLEMENTATION_PLAN.md §12.
 */

export const SITE = {
  /**
   * Canonical origin, baked into canonicals, the sitemap, RSS and OG image
   * URLs at build time.
   *
   * SITE_URL overrides it so a preview deploy describes itself by its own
   * address rather than by a domain nobody owns yet. Set it in the host's
   * build environment; the default stays the intended production domain.
   */
  url: process.env.SITE_URL ?? 'https://headrace.ai', // TODO: confirm domain purchase

  /**
   * Site-wide crawler suppression, for deploys that are reachable by link but
   * should not be discoverable.
   *
   * The name is provisional and has had no trademark clearance, and pricing
   * still renders "Not set". Neither belongs in a search index. Set NOINDEX=1
   * in the build environment; drop it to let the site be indexed.
   */
  noindex: process.env.NOINDEX === '1',
  locale: 'en',
  lang: 'en-US',

  /**
   * Pre-launch mode.
   *
   * While true, the site says plainly that the product is not released yet
   * and shows intended capability as *intended*, never as shipped. Flip to
   * false on launch day and the honesty notices disappear on their own.
   *
   * This exists so "we haven't shipped yet" is a single switch rather than
   * a hunt through 18 pages.
   */
  preLaunch: true,

  /**
   * The public releases repository: installers only, while the source stays
   * private (see config/release.ts). Links say "releases", not "source".
   */
  github: 'https://github.com/marun224/headrace-releases',

  /** TODO: single contact domain to be confirmed. Open question Q4. */
  email: {
    hello: 'hello@headrace.ai',
    sales: 'sales@headrace.ai',
    security: 'security@headrace.ai',
  },

  /**
   * TODO: licence not chosen. Open question Q5.
   * Until decided, copy says "open source" generically and never names a licence.
   */
  license: null,

  /**
   * Deliberately empty and deliberately documented.
   *
   * The site makes ZERO third-party network requests: fonts are self-hosted,
   * there is no tag manager, no CDN, no tracker. A site arguing for data
   * sovereignty that phones home to four vendors is an argument against itself.
   * This is verified by `npm run check:external` (added in Phase 6).
   */
  thirdPartyScripts: [],
};

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
  url: 'https://headrace.ai', // TODO: confirm domain purchase
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

  /** TODO: repo does not exist yet. Open question Q3. */
  github: 'https://github.com/headrace/headrace',

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

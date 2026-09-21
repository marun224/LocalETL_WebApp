/**
 * THE SINGLE RENAME POINT.
 *
 * The brand name is PROVISIONAL. `headrace.ai` was verified available on
 * 2026-09-21 (see RESEARCH_COMPETITIVE.md §4), but it has NOT been purchased
 * and NO trademark clearance has been done.
 *
 * To rebrand: change the values in this file. Nothing else in `src/` hardcodes
 * the name. Run `npm run check` afterwards to confirm nothing dangled.
 */

export const BRAND = {
  /** Display name, as written in prose and headings. */
  name: 'Headrace',

  /** Lowercase machine form: CLI binary, package name, npm/pip handle. */
  slug: 'headrace',

  /** Registrable domain, without protocol. */
  domain: 'headrace.ai',

  /**
   * The metaphor, kept here so copy stays coherent across pages.
   * A headrace is the channel that carries water TO the mill wheel — the
   * intake. The village mill: you bring your own grain, the mill is in your
   * town, you keep the flour. That is local-first, stated as a 900-year-old
   * idea rather than a tech slogan.
   */
  tagline: 'From raw source to answered question — without your data leaving your hardware.',

  shortTagline: 'Local-first ETL and analytics.',

  /** One paragraph. Used in meta descriptions, llms.txt, and the footer. */
  description:
    'Headrace is a local-first ETL and analytics engine. Connect databases, warehouses, files and APIs; build pipelines on a canvas that compile to readable SQL; then ask questions in plain English or SQL — all running on hardware you already own.',
} as const;

export type Brand = typeof BRAND;

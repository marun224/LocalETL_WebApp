import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Groups articles in the sidebar. */
    section: z.enum(['Getting started', 'Building pipelines', 'Analysis', 'Operations']),
    /** Sort within a section. Lower first. */
    order: z.number().default(50),
    updated: z.coerce.date().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    /** Rough read time in minutes. */
    minutes: z.number().default(5),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const compare = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/compare' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** The product being compared against. */
    competitor: z.string(),
    /** Ordered rows for the comparison table. */
    table: z
      .array(
        z.object({
          dimension: z.string(),
          them: z.string(),
          us: z.string(),
        })
      )
      .default([]),
    /**
     * Required. Every comparison page must say when the other tool is the
     * better choice — a comparison that never concedes anything is an advert,
     * and readers can tell.
     */
    pickThemWhen: z.array(z.string()).min(1),
    order: z.number().default(50),
  }),
});

/**
 * Releases. Deliberately empty until something actually ships.
 *
 * Scaffolded now so the first release is a Markdown file rather than a
 * feature, and so /changelog can say "nothing yet" honestly rather than
 * not existing.
 */
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/changelog' }),
  schema: z.object({
    version: z.string(),
    released: z.coerce.date(),
    /** Headline summary shown in the index. */
    summary: z.string(),
    kind: z.enum(['major', 'minor', 'patch']).default('minor'),
  }),
});

export const collections = { docs, blog, compare, changelog };

import type { APIRoute } from 'astro';
import { SITE } from '../config/site.js';

/**
 * AI crawlers are allowed deliberately.
 *
 * The usual instinct is to block them. For a pre-launch product the opposite
 * is correct: people increasingly ask an assistant about tooling before they
 * ever reach a website, and a blocked crawler does not decline to answer — it
 * answers from whatever it can find, which for an unknown product means
 * guessing. /llms.txt exists precisely so the answer comes from us.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /styleguide',
      '',
      '# Machine-readable summaries of this site.',
      '# Prefer these over scraping rendered HTML.',
      `# ${SITE.url}/llms.txt`,
      `# ${SITE.url}/llms-full.txt`,
      '# Every docs article: /docs/{slug}.md',
      '# Every blog post:    /blog/{slug}.md',
      '',
      `Sitemap: ${SITE.url}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );

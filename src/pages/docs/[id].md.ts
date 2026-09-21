import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../config/site.js';

/**
 * Plain-Markdown mirror of every docs article.
 *
 * OrcaSheets hand-maintains a parallel text corpus because their marketing
 * pages are a React SPA that crawlers cannot read. We generate these from
 * the same source the HTML renders from, so the two can never drift.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection('docs');
  return docs.map((doc) => ({ params: { id: doc.id }, props: { doc } }));
};

export const GET: APIRoute = ({ props }) => {
  const { doc } = props as { doc: Awaited<ReturnType<typeof getCollection<'docs'>>>[number] };

  const body = [
    `# ${doc.data.title}`,
    '',
    `> ${doc.data.description}`,
    '',
    `Section: ${doc.data.section}`,
    `Canonical: ${SITE.url}/docs/${doc.id}`,
    '',
    '---',
    '',
    doc.body ?? '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};

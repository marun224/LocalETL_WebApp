import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../config/site.js';

/** Plain-Markdown mirror of every blog post. Generated, never hand-written. */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
};

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number] };

  const body = [
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `Published: ${post.data.published.toISOString().slice(0, 10)}`,
    `Canonical: ${SITE.url}/blog/${post.id}`,
    '',
    '---',
    '',
    post.body ?? '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};

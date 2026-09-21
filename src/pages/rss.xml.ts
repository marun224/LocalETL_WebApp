import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BRAND } from '../config/brand';
import { SITE } from '../config/site.js';

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );

  return rss({
    title: `${BRAND.name} — writing`,
    description: `Writing about local-first data tooling from ${BRAND.name}.`,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
    })),
    customData: `<language>en-gb</language>`,
  });
};

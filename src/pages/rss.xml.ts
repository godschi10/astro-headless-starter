// rss.xml.ts — G-will Chijioke (https://gwillchijioke.com)

import type { APIRoute } from 'astro';
import { gqlClient } from '../lib/wp/client';
import { GET_POSTS } from '../lib/wp/queries';
import { cached } from '../lib/cache';
import { SITE_NAME, SITE_URL, AUTHOR_EMAIL } from '../lib/config';

export const GET: APIRoute = async () => {
  const posts = await cached('rss-posts', async () => {
    if (!gqlClient) return [];
    const data = await gqlClient.request(GET_POSTS, { first: 20 });
    return data.posts?.nodes || [];
  }, 600000);

  const items = posts.map((post: any) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/${post.slug}</link>
      <guid>${SITE_URL}/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt?.replace(/<[^>]+>/g, '').trim() || '')}</description>
      ${post.author?.node?.name ? `<dc:creator>${escapeXml(post.author.node.name)}</dc:creator>` : ''}
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Latest articles from ${escapeXml(SITE_NAME)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

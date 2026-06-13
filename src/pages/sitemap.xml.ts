// sitemap.xml.ts — G-will Chijioke (https://gwillchijioke.com)

import type { APIRoute } from 'astro';
import { gqlClient } from '../lib/wp/client';
import { GET_POSTS, GET_ALL_PAGES, GET_CATEGORIES, GET_TAGS } from '../lib/wp/queries';
import { cached } from '../lib/cache';
import { SITE_URL } from '../lib/config';

export const GET: APIRoute = async () => {
  // ── Posts ──────────────────────────────────────────────────────────────────
  const posts = await cached( 'sitemap-posts', async () => {
    if ( !gqlClient ) return [];
    const data: any = await gqlClient.request( GET_POSTS, { first: 1000 } );
    return data.posts?.nodes || [];
  }, 600000 );

  // ── Pages ──────────────────────────────────────────────────────────────────
  // Uses GET_ALL_PAGES — defined in queries.ts.
  const pages = await cached( 'sitemap-pages', async () => {
    if ( !gqlClient ) return [];
    const data: any = await gqlClient.request( GET_ALL_PAGES, { first: 200 } );
    return ( data.pages?.nodes || [] ).filter( ( p: any ) => p.status === 'publish' );
  }, 600000 );

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = await cached( 'sitemap-categories', async () => {
    if ( !gqlClient ) return [];
    const data: any = await gqlClient.request( GET_CATEGORIES );
    return data.categories?.nodes || [];
  }, 600000 );

  // ── Tags ───────────────────────────────────────────────────────────────────
  const tags = await cached( 'sitemap-tags', async () => {
    if ( !gqlClient ) return [];
    const data: any = await gqlClient.request( GET_TAGS );
    return data.tags?.nodes || [];
  }, 600000 );

  // ── Build URL list ─────────────────────────────────────────────────────────
  const urls = [
    { loc: SITE_URL,           priority: '1.0' },
    { loc: `${ SITE_URL }/contact`, priority: '0.7' },
    ...posts.map( ( p: any ) => ( {
      loc:     `${ SITE_URL }/${ p.slug }`,
      lastmod: p.modified || p.date,
      priority: '0.8',
    } ) ),
    ...pages
      .filter( ( p: any ) => ![ 'search', 'contact' ].includes( p.slug ) )
      .map( ( p: any ) => ( {
        loc:     `${ SITE_URL }/${ p.slug }`,
        lastmod: p.modified || p.date,
        priority: '0.7',
      } ) ),
    ...categories
      .filter( ( c: any ) => c.count && c.count > 0 )
      .map( ( c: any ) => ( {
        loc:      `${ SITE_URL }/category/${ c.slug }`,
        priority: '0.6',
      } ) ),
    ...tags
      .filter( ( t: any ) => t.count && t.count > 0 )
      .map( ( t: any ) => ( {
        loc:      `${ SITE_URL }/tag/${ t.slug }`,
        priority: '0.4',
      } ) ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ urls.map( u => `  <url>
    <loc>${ u.loc }</loc>
    ${ 'lastmod' in u && u.lastmod ? `<lastmod>${ u.lastmod }</lastmod>` : '' }
    <priority>${ u.priority }</priority>
  </url>` ).join( '\n' ) }
</urlset>`;

  return new Response( xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  } );
};

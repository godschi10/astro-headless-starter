/**
 * search-index.json.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * Pre-renders /search-index.json at build time.
 * Fetches all published posts from WPGraphQL and outputs a MiniSearch-compatible
 * document array. SearchOverlay.astro loads this file client-side to power
 * the fuzzy search overlay without a server round-trip.
 *
 * Fields indexed: title (boost ×3), description/excerpt (boost ×2), categories (by name).
 * content is omitted to keep payload small — add it to GET_POSTS_FOR_SEARCH if needed.
 */

import type { APIRoute } from 'astro';
import { gqlClient } from '../lib/wp/client';
import { GET_POSTS_FOR_SEARCH } from '../lib/wp/queries';
import { cached } from '../lib/cache';
import { postsToSearchDocs } from '../lib/search';

export const GET: APIRoute = async () => {
  if ( !gqlClient ) {
    console.warn( '[search-index] gqlClient unavailable — returning empty index.' );
    return new Response( JSON.stringify( [] ), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    } );
  }

  let allPosts: any[] = [];
  let hasNextPage     = true;
  let after: string | null = null;

  while ( hasNextPage ) {
    const cacheKey = `search-index-${ after || 'start' }`;
    const data: any = await cached( cacheKey, () =>
      gqlClient!.request( GET_POSTS_FOR_SEARCH, { first: 100, after } ),
      600_000,
    );

    const nodes    = data?.posts?.nodes    ?? [];
    const pageInfo = data?.posts?.pageInfo ?? {};

    allPosts.push( ...nodes );
    hasNextPage = Boolean( pageInfo.hasNextPage );
    after       = pageInfo.endCursor ?? null;
  }

  const docs = postsToSearchDocs( allPosts );

  return new Response( JSON.stringify( docs ), {
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  } );
};

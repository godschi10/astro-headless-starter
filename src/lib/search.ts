/**
 * search.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * MiniSearch client-side index + WP REST server fallback.
 *
 * NOTE on PUBLIC_WP_SEARCH_URL:
 * The search URL is intentionally client-side public. The endpoint is
 * read-only and unauthenticated. Using the PUBLIC_ prefix makes this
 * explicit and safe.
 */

import MiniSearch from 'minisearch';

interface SearchDocument {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  content:     string;
  categories:  string[];
  date:        string;
}

let miniSearch: MiniSearch | null = null;

export function initSearch( docs: SearchDocument[] ): void {
  miniSearch = new MiniSearch( {
    fields:        [ 'title', 'description', 'content', 'categories' ],
    storeFields:   [ 'title', 'slug', 'description', 'date', 'categories' ],
    searchOptions: {
      boost:  { title: 3, description: 2 },
      fuzzy:  0.2,
      prefix: true,
    },
  } );
  miniSearch.addAll( docs );
}

export function searchClient( query: string ): Array<SearchDocument & { score: number }> {
  if ( !miniSearch ) return [];
  return miniSearch.search( query ) as any;
}

export async function searchServer( query: string ): Promise<{
  results: any[];
  total: number;
  total_pages: number;
}> {
  const searchUrl = import.meta.env.PUBLIC_WP_SEARCH_URL;
  if ( !searchUrl ) return { results: [], total: 0, total_pages: 0 };
  const res = await fetch(
    `${ searchUrl }?s=${ encodeURIComponent( query ) }&per_page=10`,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.json();
}

export function postsToSearchDocs( posts: any[] ): SearchDocument[] {
  return posts.map( ( p ) => ( {
    id:          String( p.databaseId ?? p.id ),
    slug:        p.slug,
    title:       typeof p.title === 'string' ? p.title : ( p.title?.rendered ?? '' ),
    description: typeof p.excerpt === 'string'
      ? p.excerpt.replace( /<[^>]+>/g, '' ).trim()
      : ( p.excerpt?.rendered?.replace( /<[^>]+>/g, '' ).trim() ?? '' ),
    content:     typeof p.content === 'string'
      ? p.content.replace( /<[^>]+>/g, '' )
      : ( p.content?.rendered?.replace( /<[^>]+>/g, '' ) ?? '' ),
    categories:  ( p.categories?.nodes ?? p.categories ?? [] ).map( ( c: any ) =>
      // Index by name so users can search "Technology", "Android", etc.
      typeof c === 'string' ? c : ( c.name ?? String( c.databaseId ?? c.id ?? '' ) )
    ),
    date: p.date,
  } ) );
}

/**
 * wp/client.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * GraphQL primary, REST fallback. Zod schemas validate all responses
 * at runtime so a bad WP response fails loudly at build time, not silently.
 */

import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';

// ── Environment ────────────────────────────────────────────────────────────────

const WP_GRAPHQL_URL = import.meta.env.WP_GRAPHQL_URL;
const WP_REST_URL    = import.meta.env.WP_REST_URL;
const WP_USER        = import.meta.env.WP_USER;
const WP_APP_PASS    = import.meta.env.WP_APP_PASS;

if ( !WP_USER || !WP_APP_PASS ) {
  throw new Error(
    '[wp/client] WP_USER and WP_APP_PASS are required.\n' +
    'Add them to .env (dev) or Cloudflare Pages environment variables (prod).\n' +
    'Create the password in WP admin → Tools → Headless API Keys.'
  );
}

if ( !WP_GRAPHQL_URL && !WP_REST_URL ) {
  throw new Error(
    '[wp/client] At least one of WP_GRAPHQL_URL or WP_REST_URL must be set.\n' +
    'WPGraphQL is recommended: install the WPGraphQL plugin and set WP_GRAPHQL_URL.'
  );
}

export const authHeader = 'Basic ' + btoa( `${WP_USER}:${WP_APP_PASS}` );

// ── GraphQL client ────────────────────────────────────────────────────────────

export const gqlClient = WP_GRAPHQL_URL
  ? new GraphQLClient( WP_GRAPHQL_URL, {
      headers: { Authorization: authHeader },
    } )
  : null;

// ── REST fetch wrapper ────────────────────────────────────────────────────────

export async function restFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if ( !WP_REST_URL ) {
    throw new Error( '[wp/client] WP_REST_URL is not set but a REST call was attempted.' );
  }

  const url = endpoint.startsWith( 'http' )
    ? endpoint
    : `${WP_REST_URL}${endpoint}`;

  const res = await fetch( url, {
    ...options,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  } );

  if ( !res.ok ) {
    throw new Error( `[wp/client] REST ${res.status}: ${res.statusText} — ${url}` );
  }

  return res.json() as Promise<T>;
}

// ── Concurrency limiter ───────────────────────────────────────────────────────

export async function withConcurrency<T, R>(
  items: T[],
  fn: ( item: T ) => Promise<R>,
  limit = 15
): Promise<R[]> {
  const results: R[] = [];
  for ( let i = 0; i < items.length; i += limit ) {
    const batch = items.slice( i, i + limit );
    results.push( ...( await Promise.all( batch.map( fn ) ) ) );
  }
  return results;
}

// ── JSON-LD safe serialiser ───────────────────────────────────────────────────
// JSON.stringify does NOT escape </script> — a value like `</script><script>xss`
// would break out of the script block. This is the fix used in androidscroll.

export function jsonLdStringify( obj: Record<string, unknown> ): string {
  return JSON.stringify( obj )
    .replace( /</g,  '\\u003c' )
    .replace( />/g,  '\\u003e' )
    .replace( /&/g,  '\\u0026' )
    .replace( /'/g,  '\\u0027' );
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

export const WpSeoSchema = z.object( {
  title:         z.string(),
  description:   z.string(),
  canonical:     z.string(),
  noindex:       z.boolean(),
  og:            z.record( z.string() ).optional(),
  twitter:       z.record( z.string() ).optional(),
  schema:        z.array( z.record( z.any() ) ).optional(),
  // GraphQL form
  ogTitle:        z.string().optional(),
  ogDescription:  z.string().optional(),
  ogImage:        z.string().optional(),
} );

export const WpPostSchema = z.object( {
  id:             z.number().optional(),          // REST
  databaseId:     z.number().optional(),          // GraphQL
  slug:           z.string(),
  title:          z.union( [
    z.object( { rendered: z.string() } ),         // REST
    z.string(),                                   // GraphQL
  ] ),
  content:        z.union( [
    z.object( { rendered: z.string() } ),         // REST
    z.string(),                                   // GraphQL
  ] ),
  excerpt:        z.union( [
    z.object( { rendered: z.string() } ),         // REST
    z.string(),                                   // GraphQL
  ] ).optional(),
  date:           z.string(),
  modified:       z.string().optional(),
  status:         z.string().optional(),
  categories:     z.array( z.any() ).optional(),
  tags:           z.array( z.any() ).optional(),
  seo:            WpSeoSchema.optional(),
  reading_time:   z.number().optional(),          // REST field name
  readingTime:    z.number().optional(),          // GraphQL field name
  breadcrumbs:    z.array( z.object( {
    title: z.string(),
    url:   z.string(),
  } ) ).optional(),
  featuredImage:  z.any().optional(),
  author:         z.any().optional(),
  _embedded:      z.record( z.any() ).optional(),
  acf:            z.record( z.any() ).optional(),
} );

export const WpCategorySchema = z.object( {
  id:          z.number().optional(),
  databaseId:  z.number().optional(),
  name:        z.string(),
  slug:        z.string(),
  parent:      z.union( [ z.number(), z.object( { node: z.any() } ) ] ).optional(),
  count:       z.number().optional(),
  description: z.string().optional(),
} );

export const WpTagSchema = z.object( {
  id:         z.number().optional(),
  databaseId: z.number().optional(),
  name:       z.string(),
  slug:       z.string(),
  count:      z.number().optional(),
} );

export const WpCommentSchema = z.object( {
  id:      z.number(),
  author:  z.string(),
  content: z.string(),
  date:    z.string(),
  parent:  z.number(),
  avatar:  z.string(),
  replies: z.number(),
} );

export const WpMenuItemSchema = z.object( {
  id:        z.number(),
  title:     z.string(),
  url:       z.string(),
  target:    z.string().optional(),
  classes:   z.array( z.string() ).optional(),
  parent:    z.number(),
  order:     z.number(),
  object_id: z.number().optional(),
  object:    z.string().optional(),
  type:      z.string().optional(),
} );

export const WpMenuSchema = z.object( {
  location: z.string().optional(),
  items:    z.array( WpMenuItemSchema ),
} );

// ── Types ─────────────────────────────────────────────────────────────────────

export type WpPost     = z.infer<typeof WpPostSchema>;
export type WpCategory = z.infer<typeof WpCategorySchema>;
export type WpTag      = z.infer<typeof WpTagSchema>;
export type WpComment  = z.infer<typeof WpCommentSchema>;
export type WpMenu     = z.infer<typeof WpMenuSchema>;
export type WpSeo      = z.infer<typeof WpSeoSchema>;

// ── Response validation helpers ───────────────────────────────────────────────
// Use .safeParse() so a single bad post does not abort the entire build.

export function validatePosts( data: unknown[] ): WpPost[] {
  return data.flatMap( ( item ) => {
    const result = WpPostSchema.safeParse( item );
    if ( result.success ) return [ result.data ];
    console.warn( '[wp/client] Post validation failed:', result.error.flatten() );
    return [];
  } );
}

export function validateCategories( data: unknown[] ): WpCategory[] {
  return data.flatMap( ( item ) => {
    const result = WpCategorySchema.safeParse( item );
    if ( result.success ) return [ result.data ];
    console.warn( '[wp/client] Category validation failed:', result.error.flatten() );
    return [];
  } );
}

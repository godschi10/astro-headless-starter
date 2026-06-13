/**
 * api/search.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * NOTE: This file is intentionally minimal.
 *
 * With output: 'static', there are no server-side API routes.
 * Search works via:
 *   1. Client-side MiniSearch index (SearchOverlay.astro) — built from all posts.
 *   2. Direct browser fetch to PUBLIC_WP_SEARCH_URL (WP REST) as fallback.
 *
 * If you need a server-side search API, switch output to 'hybrid' in astro.config.mjs,
 * add the @astrojs/cloudflare adapter, and uncomment the code below.
 */

// import type { APIRoute } from 'astro';
// export const prerender = false;
// export const GET: APIRoute = async ({ request }) => { ... };

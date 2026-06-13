/**
 * config.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  THE ONE FILE TO EDIT PER PROJECT.                                      │
 * │  Every other file in the starter is generic.                            │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Values come from .env (via import.meta.env) so they can be set per-environment
 * in Cloudflare Pages without touching source code. The exceptions are
 * SOCIAL_LINKS and FOOTER_LINKS — these are structured data and must be edited here.
 */

// ── Site identity ──────────────────────────────────────────────────────────────
export const SITE_URL  = import.meta.env.SITE_URL  || 'https://example.com';
export const SITE_NAME = import.meta.env.SITE_NAME || 'Your Site';
export const SITE_DESC = import.meta.env.SITE_DESC || '';
export const SITE_LANG = import.meta.env.SITE_LANG || 'en';

// ── Author (single-author site) ────────────────────────────────────────────────
export const AUTHOR_NAME      = import.meta.env.AUTHOR_NAME      || '';
export const AUTHOR_BIO       = import.meta.env.AUTHOR_BIO       || '';
export const AUTHOR_PAGE      = import.meta.env.AUTHOR_PAGE      || '/about';
export const AUTHOR_EMAIL     = import.meta.env.AUTHOR_EMAIL     || '';
export const AUTHOR_TWITTER   = import.meta.env.AUTHOR_TWITTER   || '';
export const AUTHOR_INSTAGRAM = import.meta.env.AUTHOR_INSTAGRAM || '';

// ── Comments ───────────────────────────────────────────────────────────────────
export const ENABLE_COMMENTS   = import.meta.env.ENABLE_COMMENTS !== 'false';
// COMMENTS_ENDPOINT is the WP REST URL for comments — no CF Worker needed.
export const COMMENTS_ENDPOINT = import.meta.env.COMMENTS_ENDPOINT || '';

// ── Forms ──────────────────────────────────────────────────────────────────────
export const FORM_ENDPOINT = import.meta.env.FORM_ENDPOINT || '';

// ── Analytics ──────────────────────────────────────────────────────────────────
export const MATOMO_URL     = import.meta.env.MATOMO_URL     || '';
export const MATOMO_SITE_ID = import.meta.env.MATOMO_SITE_ID || '';

// ── Dark mode ──────────────────────────────────────────────────────────────────
export const ENABLE_DARKMODE = import.meta.env.ENABLE_DARKMODE !== 'false';

// ── Media CDN (Cloudflare R2 or Bunny.net) ────────────────────────────────────
export const ENABLE_R2_IMAGES = import.meta.env.ENABLE_R2_IMAGES === 'true';
export const R2_PUBLIC_URL    = import.meta.env.R2_PUBLIC_URL    || '';

// ── AdSense (dormant until ENABLE_ADSENSE=true) ───────────────────────────────
export const ADSENSE_ENABLED = import.meta.env.ENABLE_ADSENSE === 'true';
export const ADSENSE_CLIENT  = import.meta.env.ADSENSE_CLIENT  || '';

export const ADSENSE_SLOTS = {
  inArticle:  import.meta.env.ADSENSE_SLOT_INARTICLE  || '',
  sidebar:    import.meta.env.ADSENSE_SLOT_SIDEBAR     || '',
  belowPost:  import.meta.env.ADSENSE_SLOT_BELOWPOST   || '',
  inFeed:     import.meta.env.ADSENSE_SLOT_INFEED      || '',
} as const;

export type AdSlotName = keyof typeof ADSENSE_SLOTS;

// ── Homepage pinned content ────────────────────────────────────────────────────
// Set to WP post databaseIds after publishing content.
// Leave as 0 / empty to auto-use latest posts.
export const FEATURED_POST_ID  = parseInt( import.meta.env.FEATURED_POST_ID  || '0', 10 );
export const POPULAR_POST_IDS  = ( import.meta.env.POPULAR_POST_IDS || '' )
  .split( ',' )
  .map( Number )
  .filter( Boolean );

// ── Table of contents: post IDs to exclude ────────────────────────────────────
export const TOC_EXCLUDED_IDS = ( import.meta.env.TOC_EXCLUDED_IDS || '' )
  .split( ',' )
  .map( Number )
  .filter( Boolean );

// ── Build performance ─────────────────────────────────────────────────────────
export const BUILD_CONCURRENCY = parseInt( import.meta.env.BUILD_CONCURRENCY || '15', 10 );

// ── Social links ───────────────────────────────────────────────────────────────
// Edit this array directly — one entry per social network you use.
// `d` is the SVG path for the icon (24x24 viewBox).
export const SOCIAL_LINKS: Array<{ name: string; href: string; d: string }> = [
  // Twitter / X
  // {
  //   name: 'X',
  //   href: 'https://x.com/yourhandle',
  //   d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.626L18.244 2.25ZM17.08 18.75h1.833L6.988 4.126H5.024L17.08 18.75Z',
  // },
  // Instagram
  // {
  //   name: 'Instagram',
  //   href: 'https://instagram.com/yourhandle',
  //   d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z',
  // },
];

// ── Footer navigation links ────────────────────────────────────────────────────
// Edit this array directly.
export const FOOTER_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Privacy',  href: '/privacy'  },
  { label: 'Contact',  href: '/contact'  },
];

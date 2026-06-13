/**
 * seo.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * Structured SEO tag generation. Uses jsonLdStringify() instead of
 * JSON.stringify() to prevent </script> injection in JSON-LD blocks.
 */

import { jsonLdStringify } from './wp/client';
import { SITE_NAME } from './config';

export interface SeoConfig {
  title?:       string;
  description?: string;
  canonical?:   string;
  noindex?:     boolean;
  og?:          Record<string, string>;
  twitter?:     Record<string, string>;
  schema?:      Array<Record<string, any>>;
  type?:        'website' | 'article';
  cover?:       string | null;
  coverAlt?:    string;
  authorName?:  string;
  published?:   string;
  modified?:    string;
}

export function generateSeoTags( config: SeoConfig ): string {
  const {
    title       = '',
    description = '',
    canonical   = '',
    noindex     = false,
    og          = {},
    twitter     = {},
    schema      = [],
    type        = 'website',
    cover       = null,
    coverAlt    = '',
    authorName  = '',
    published   = '',
    modified    = '',
  } = config;

  // SITE_NAME comes from config.ts — not hardcoded.
  const siteName = SITE_NAME;

  const tags: string[] = [];

  if ( title       ) tags.push( `<title>${ escHtml( title ) }</title>` );
  if ( description ) tags.push( `<meta name="description" content="${ escHtml( description ) }" />` );
  if ( canonical   ) tags.push( `<link rel="canonical" href="${ escHtml( canonical ) }" />` );

  tags.push( noindex
    ? '<meta name="robots" content="noindex, nofollow" />'
    : '<meta name="robots" content="index, follow" />'
  );

  // Open Graph
  tags.push( `<meta property="og:type" content="${ type }" />` );
  tags.push( `<meta property="og:site_name" content="${ escHtml( siteName ) }" />` );
  if ( title       ) tags.push( `<meta property="og:title"       content="${ escHtml( og.title       || title       ) }" />` );
  if ( description ) tags.push( `<meta property="og:description" content="${ escHtml( og.description || description ) }" />` );
  if ( canonical   ) tags.push( `<meta property="og:url"         content="${ escHtml( canonical ) }" />` );
  if ( cover       ) tags.push( `<meta property="og:image"       content="${ escHtml( cover ) }" />` );
  if ( coverAlt    ) tags.push( `<meta property="og:image:alt"   content="${ escHtml( coverAlt ) }" />` );

  // Twitter Card
  tags.push( '<meta name="twitter:card" content="summary_large_image" />' );
  if ( title       ) tags.push( `<meta name="twitter:title"       content="${ escHtml( twitter.title       || title       ) }" />` );
  if ( description ) tags.push( `<meta name="twitter:description" content="${ escHtml( twitter.description || description ) }" />` );
  if ( cover       ) tags.push( `<meta name="twitter:image"       content="${ escHtml( cover ) }" />` );

  // Article meta
  if ( type === 'article' ) {
    if ( published  ) tags.push( `<meta property="article:published_time" content="${ published  }" />` );
    if ( modified   ) tags.push( `<meta property="article:modified_time"  content="${ modified   }" />` );
    if ( authorName ) tags.push( `<meta property="article:author"          content="${ escHtml( authorName ) }" />` );
  }

  // JSON-LD Schema — use jsonLdStringify to escape </script>
  if ( schema.length > 0 ) {
    for ( const s of schema ) {
      tags.push( `<script type="application/ld+json">${ jsonLdStringify( s ) }</script>` );
    }
  } else {
    const defaultSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type':    type === 'article' ? 'BlogPosting' : 'WebPage',
      headline:    title,
      description: description,
      url:         canonical,
      ...( cover       && { image: { '@type': 'ImageObject', url: cover, caption: coverAlt } } ),
      ...( published   && { datePublished: published } ),
      ...( modified    && { dateModified:  modified  } ),
      ...( authorName  && { author: { '@type': 'Person', name: authorName } } ),
    };
    tags.push( `<script type="application/ld+json">${ jsonLdStringify( defaultSchema ) }</script>` );
  }

  return tags.join( '\n' );
}

function escHtml( str: string ): string {
  return str
    .replace( /&/g,  '&amp;'  )
    .replace( /</g,  '&lt;'   )
    .replace( />/g,  '&gt;'   )
    .replace( /"/g,  '&quot;' )
    .replace( /'/g,  '&#39;'  );
}

export function seoFromWp( wpSeo: any, overrides: Partial<SeoConfig> = {} ): SeoConfig {
  if ( !wpSeo ) return overrides;

  return {
    title:       wpSeo.title       || overrides.title,
    description: wpSeo.description || overrides.description,
    canonical:   wpSeo.canonical   || overrides.canonical,
    noindex:     wpSeo.noindex     || overrides.noindex || false,
    og:          {
      ...(wpSeo.ogTitle       && { title:       wpSeo.ogTitle       }),
      ...(wpSeo.ogDescription && { description: wpSeo.ogDescription }),
      ...(wpSeo.ogImage       && { image:        wpSeo.ogImage       }),
    },
    ...overrides,
  };
}

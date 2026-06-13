// @ts-check
// astro.config.mjs — G-will Chijioke (https://gwillchijioke.com)

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// NOTE: @astrojs/cloudflare adapter is NOT included here.
// This is a static site (output: 'static') deployed to Cloudflare Pages.
// Cloudflare Pages handles static files natively — no adapter required.
// Only add the adapter if you add SSR routes (prerender: false pages).

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',

  // Static generation — every page is pre-rendered at build time.
  // This is the correct mode for a headless WP blog: all content is
  // fetched from WP at build time via GraphQL/REST.
  output: 'static',

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [ tailwindcss() ],
  },

  image: {
    // Allow any remote image domain — images come from WP origin and R2 CDN.
    remotePatterns: [
      { protocol: 'https' },
    ],
  },

  integrations: [
    mdx(),
  ],
});

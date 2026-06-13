/**
 * Client sanitization — G-will Chijioke (https://gwillchijioke.com)
 */

/**
 * sanitize.ts — Client-side HTML sanitization using DOMPurify
 *
 * Replaces hand-rolled sanitizer with battle-tested library.
 * Server-side sanitization still uses sanitize-html in server-sanitize.ts.
 */

import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a', 'b', 'strong', 'i', 'em', 'u', 's', 'del', 'ins', 'mark',
      'small', 'sub', 'sup', 'abbr', 'cite', 'q', 'kbd', 'samp', 'var',
      'p', 'br', 'hr', 'wbr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'code',
      'div', 'span', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav',
      'figure', 'figcaption', 'picture', 'source', 'img',
      'video', 'audio', 'track',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      'details', 'summary',
      'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'g', 'use', 'defs',
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel', 'name',
      'src', 'srcset', 'alt', 'width', 'height', 'loading', 'decoding', 'fetchpriority', 'sizes',
      'media', 'type',
      'controls', 'poster', 'preload', 'loop', 'muted', 'autoplay',
      'kind', 'srclang', 'label', 'default',
      'colspan', 'rowspan', 'scope', 'headers',
      'span',
      'cite',
      'class', 'id', 'style', 'data-*', 'aria-*', 'role', 'tabindex',
      'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 'aria-hidden', 'focusable',
      'd', 'fill-rule', 'clip-rule',
      'cx', 'cy', 'r',
      'x', 'y', 'rx', 'ry',
    ],
    ALLOW_DATA_ATTR: true,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

export function decodeHtmlEntities(str: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

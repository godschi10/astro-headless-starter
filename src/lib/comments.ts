/**
 * Comments utilities — G-will Chijioke (https://gwillchijioke.com)
 */

/**
 * comments.ts — Client-side comment fetching and submission
 */

import type { WpComment } from './wp/client';

const WP_REST_URL = import.meta.env.WP_REST_URL;

export async function getComments(postId: number): Promise<WpComment[]> {
  const res = await fetch(
    `${WP_REST_URL}/headless/v1/comments?post_id=${postId}`,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.json();
}

export interface CommentSubmission {
  post_id: number;
  author: string;
  email: string;
  content: string;
  parent?: number;
  auth_type?: 'anonymous' | 'google' | 'wp';
  user_id?: number;
}

export async function submitComment(data: CommentSubmission): Promise<{
  success: boolean;
  message: string;
  comment_id?: number;
  spam?: boolean;
}> {
  const res = await fetch(`${WP_REST_URL}/headless/v1/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export function validateComment(data: CommentSubmission): string | null {
  if (!data.author || data.author.trim().length < 2) {
    return 'Name is required (min 2 characters).';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Please enter a valid email address.';
  }
  if (!data.content || data.content.trim().length < 5) {
    return 'Comment must be at least 5 characters.';
  }
  return null;
}

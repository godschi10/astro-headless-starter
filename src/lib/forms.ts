/**
 * Form utilities — G-will Chijioke (https://gwillchijioke.com)
 */

/**
 * forms.ts — Client-side form submission handler
 */

export interface FormSubmission {
  form_id: string;
  fields: Record<string, string | string[]>;
}

export interface FormResponse {
  success: boolean;
  message: string;
  comment_id?: number;
}

const FORM_ENDPOINT = import.meta.env.FORM_ENDPOINT;
const HONEYPOT_FIELD = import.meta.env.FORM_HONEYPOT_FIELD || 'website';

export async function submitForm(data: FormSubmission): Promise<FormResponse> {
  if (!FORM_ENDPOINT) {
    throw new Error('[forms] FORM_ENDPOINT not configured');
  }

  // Get nonce from WP
  const nonceRes = await fetch(`${FORM_ENDPOINT.replace('/forms/submit', '/nonce')}`);
  const nonceData = await nonceRes.json();

  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonceData.nonce,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export function createHoneypotField(): { name: string; value: string } {
  return { name: HONEYPOT_FIELD, value: '' };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

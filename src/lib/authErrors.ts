import type { AuthError } from '@supabase/supabase-js';

/** Supabase stores emails case-insensitively; normalize so signup and login match */
export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function formatAuthError(error: AuthError | null | undefined): string {
  if (!error) return 'Something went wrong. Please try again.';

  const raw = (error.message || '').trim();
  const m = raw.toLowerCase();

  if (m.includes('invalid login credentials') || m.includes('invalid credentials')) {
    return 'Could not sign you in. Check your email and password.';
  }
  if (m.includes('email not confirmed')) {
    return 'Email sign-in is blocked until the address is confirmed. In Supabase: Authentication → Providers → Email → disable "Confirm email" for password-only access.';
  }
  if (m.includes('user already registered') || m.includes('already been registered') || m.includes('already registered')) {
    return 'This email is already registered. Sign in instead, or use Forgot password.';
  }
  if (m.includes('email rate limit') || m.includes('rate limit')) {
    return 'Too many attempts. Wait a few minutes and try again.';
  }
  if (m.includes('signup_disabled') || m.includes('signups not allowed')) {
    return 'New sign-ups are disabled for this project. Contact support.';
  }

  return raw || 'Something went wrong. Please try again.';
}

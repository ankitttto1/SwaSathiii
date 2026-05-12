import { supabase } from './supabase';
import { normalizeAuthEmail } from './authErrors';

/**
 * Email/password flow expects instant sign-in after sign-up.
 * In Supabase Dashboard: Authentication → Providers → Email → turn OFF "Confirm email".
 */

function getEmailRedirectUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}${window.location.pathname}`;
}

export async function signUp(email: string, password: string, displayName: string) {
  const normalizedEmail = normalizeAuthEmail(email);
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: getEmailRedirectUrl(),
      data: { display_name: displayName.trim() },
    },
  });

  if (error) {
    return { data, error };
  }

  if (data.session) {
    return { data, error: null };
  }

  // When "Confirm email" is off, Supabase usually returns a session on signUp.
  // If not, sign in immediately with the same credentials (direct password flow).
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (signInError) {
    return { data, error: signInError };
  }

  return {
    data: { user: signInData.user, session: signInData.session },
    error: null,
  };
}

export async function signIn(email: string, password: string) {
  const normalizedEmail = normalizeAuthEmail(email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(email: string) {
  const normalizedEmail = normalizeAuthEmail(email);
  const { data, error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: getEmailRedirectUrl(),
  });
  return { data, error };
}

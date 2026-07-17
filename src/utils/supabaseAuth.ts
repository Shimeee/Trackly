import { supabase, supabaseConfigured } from './supabase';

export type VerifiedAccount = {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

function assertConfigured() {
  if (!supabaseConfigured) {
    throw new Error('Backend is not configured yet.');
  }
}

function toAccount(user: { user_metadata?: unknown; email?: string | null; created_at: string }, fallbackEmail: string): VerifiedAccount {
  const meta = (user.user_metadata || {}) as { first_name?: string; last_name?: string };
  return {
    firstName: meta.first_name || '',
    lastName: meta.last_name || '',
    email: user.email || fallbackEmail,
    createdAt: user.created_at,
  };
}

export async function signUpWithPassword(email: string, password: string, firstName: string, lastName: string): Promise<VerifiedAccount> {
  assertConfigured();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed. Please try again.');
  if (!data.session) throw new Error('Account created. Check your inbox to confirm your email, then sign in.');
  return toAccount(data.user, email);
}

export async function signInWithPassword(email: string, password: string): Promise<VerifiedAccount> {
  assertConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed. Please try again.');
  return toAccount(data.user, email);
}

import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { getDeviceCredentials } from './device-auth';

/**
 * Silent session: anonymous auth when enabled, otherwise per-device email/password.
 * Mirrors SHYNE SupabaseService.ensureSession().
 */
export async function ensureSupabaseSession(client: SupabaseClient): Promise<Session> {
  const { data: { session } } = await client.auth.getSession();
  if (session) return session;

  const { data: anonData, error: anonError } = await client.auth.signInAnonymously();
  if (!anonError && anonData.session) return anonData.session;

  return signInWithDeviceCredentials(client);
}

async function signInWithDeviceCredentials(client: SupabaseClient): Promise<Session> {
  const { email, password } = getDeviceCredentials();

  const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (!signInError && signInData.session) return signInData.session;

  const { data: signUpData, error: signUpError } = await client.auth.signUp({ email, password });
  if (signUpError) throw signUpError;
  if (!signUpData.session) {
    throw new Error(
      'Device sign-up succeeded but no session — disable Confirm email in Supabase Auth settings.',
    );
  }
  return signUpData.session;
}

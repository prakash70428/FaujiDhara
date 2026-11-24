import type { Session } from '@supabase/supabase-js';

import { fromSupabaseError, getSupabase } from '@/core/supabase';

/**
 * Login with phone OTP. The only file that calls supabase.auth.
 * Phone numbers arrive already normalised to E.164 (+91XXXXXXXXXX) by domain/phone.ts.
 */
export const authRepository = {
  async sendOtp(phoneE164: string): Promise<void> {
    const { error } = await getSupabase().auth.signInWithOtp({ phone: phoneE164 });
    if (error) throw fromSupabaseError(error);
  },

  async verifyOtp(phoneE164: string, code: string): Promise<Session> {
    const { data, error } = await getSupabase().auth.verifyOtp({
      phone: phoneE164,
      token: code,
      type: 'sms',
    });
    if (error) throw fromSupabaseError(error);
    if (!data.session) throw fromSupabaseError(new Error('No session after OTP verify'));
    return data.session;
  },

  /** The session saved on the device, if any (app start). */
  async getSession(): Promise<Session | null> {
    const { data, error } = await getSupabase().auth.getSession();
    if (error) throw fromSupabaseError(error);
    return data.session;
  },

  /** Calls back on login, logout and token refresh. Returns the unsubscribe function. */
  onSessionChange(callback: (session: Session | null) => void): () => void {
    const { data } = getSupabase().auth.onAuthStateChange((_event, session) => callback(session));
    return () => data.subscription.unsubscribe();
  },

  async signOut(): Promise<void> {
    // 'local' = log out this device only; the user's other phones stay logged in.
    const { error } = await getSupabase().auth.signOut({ scope: 'local' });
    if (error) throw fromSupabaseError(error);
  },
};

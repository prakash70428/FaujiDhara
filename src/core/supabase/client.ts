import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { AppError } from '../errors';

import { sessionStorage } from './sessionStorage';

/**
 * The one Supabase client for the whole app.
 *
 * Only `data/` files in features import this (rule: screen → hooks → data → Supabase).
 * The URL and publishable key are public by design; Row Level Security in
 * supabase/migrations is what protects the data.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False until .env.local is filled in. The app shows a setup screen instead of crashing. */
export const isSupabaseConfigured = Boolean(url && publishableKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !publishableKey) {
    throw new AppError('CONFIG', 'Supabase env vars missing. See .env.example.');
  }
  if (!client) {
    client = createClient(url, publishableKey, {
      auth: {
        storage: sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        // Phone OTP has no redirect URL to read a session from.
        detectSessionInUrl: false,
      },
    });
    watchAppState(client);
  }
  return client;
}

/**
 * Refresh the login token only while the app is on screen. In the background the
 * OS may freeze timers; when the app comes back, refreshing restarts immediately.
 */
function watchAppState(sb: SupabaseClient) {
  if (Platform.OS === 'web') return; // browsers handle tab visibility themselves
  AppState.addEventListener('change', (state) => {
    if (state === 'active') sb.auth.startAutoRefresh();
    else sb.auth.stopAutoRefresh();
  });
}

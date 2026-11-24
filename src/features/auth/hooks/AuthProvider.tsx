import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { AppError, toAppError } from '@/core/errors';
import { isSupabaseConfigured } from '@/core/supabase';

import { authRepository } from '../data/authRepository';
import { profileRepository } from '../data/profileRepository';
import type { AuthStatus, Profile } from '../domain/types';

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  profile: Profile | null;
  /** Set when status is 'error'. */
  error: AppError | null;
  /** Onboarding / edit screens call this after saving, so the app moves on at once. */
  setProfile: (profile: Profile) => void;
  /** Try loading the profile again (from the 'error' screen). */
  retry: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Read login state anywhere below <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}

/** Like useAuth, but for screens that only render when logged in with a profile. */
export function useSignedInUser(): { session: Session; profile: Profile } {
  const { session, profile } = useAuth();
  if (!session || !profile) throw new AppError('UNAUTHORIZED', 'Signed-in screen without user');
  return { session, profile };
}

/**
 * Owns the login state for the whole app.
 *
 * 1. Supabase tells us about the session (saved on the device, new login, logout,
 *    token refresh) through one listener.
 * 2. Whenever the logged-in user changes, we load their profile.
 * 3. `status` is derived from those two, and the root layout picks screens from it.
 */
/**
 * Result of loading one user's profile. Keyed by userId + attempt, so a result that
 * belongs to an older user or an older try is simply ignored (treated as "loading").
 */
type ProfileLoad =
  | { userId: string; attempt: number; kind: 'done'; profile: Profile | null }
  | { userId: string; attempt: number; kind: 'error'; error: AppError };

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [load, setLoad] = useState<ProfileLoad | null>(null);
  const [attempt, setAttempt] = useState(0);

  // 1. Session listener. Supabase fires it once at start with the saved session.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    return authRepository.onSessionChange((next) => {
      setSession(next);
      setSessionLoaded(true);
    });
  }, []);

  const userId = session?.user.id ?? null;

  // 2. Profile for the current user. Token refreshes keep the same userId → no refetch.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false; // ignore a slow answer if the user changed meanwhile
    profileRepository
      .getById(userId)
      .then((profile) => {
        if (!cancelled) setLoad({ userId, attempt, kind: 'done', profile });
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoad({ userId, attempt, kind: 'error', error: toAppError(e) });
      });
    return () => {
      cancelled = true;
    };
  }, [userId, attempt]);

  // Only trust a result for the current user and the current try.
  const current = load && load.userId === userId && load.attempt === attempt ? load : null;
  const profile = current?.kind === 'done' ? current.profile : null;
  const error = current?.kind === 'error' ? current.error : null;

  const status: AuthStatus = !isSupabaseConfigured
    ? 'unconfigured'
    : !sessionLoaded
      ? 'loading'
      : !userId
        ? 'signedOut'
        : !current
          ? 'loading'
          : current.kind === 'error'
            ? 'error'
            : profile
              ? 'ready'
              : 'needsProfile';

  const setProfile = useCallback(
    (p: Profile) => setLoad({ userId: p.id, attempt, kind: 'done', profile: p }),
    [attempt],
  );

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const signOut = useCallback(async () => {
    await authRepository.signOut();
    // The session listener fires with null, which shows the login screens.
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, profile, error, setProfile, retry, signOut }),
    [status, session, profile, error, setProfile, retry, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

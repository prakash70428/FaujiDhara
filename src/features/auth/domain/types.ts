/** Who the user is in the app. ADMIN is given only from the Supabase dashboard. */
export type UserRole = 'FAUJI' | 'KISAN' | 'ADMIN';

/** Roles a person can pick for themselves while signing up. */
export type SelfRole = Exclude<UserRole, 'ADMIN'>;

export type Profile = {
  id: string;
  role: UserRole;
  fullName: string;
  stateId: string;
  district: string;
  isVerified: boolean;
  createdAt: string;
};

/** What the onboarding / edit form sends. Role is only used on first save. */
export type ProfileInput = {
  role: SelfRole;
  fullName: string;
  stateId: string;
  district: string;
};

/**
 * Where the user is in the login journey. The root layout shows a different set of
 * screens for each one, so a logged-out user can never open the feed, and so on.
 */
export type AuthStatus =
  | 'loading' // reading the saved session on app start (splash stays up)
  | 'signedOut' // → login screens
  | 'needsProfile' // logged in, but no profile yet → onboarding
  | 'ready' // → the app
  | 'error' // logged in, but the profile could not be loaded (offline?) → retry screen
  | 'unconfigured'; // developer has not filled .env.local yet → setup screen

export const ROLE_INFO: Record<SelfRole, { title: string; subtitle: string }> = {
  FAUJI: {
    title: 'Fauji / Veteran',
    subtitle: 'Sena se retired ya serving. Zameen dena, kheti karna ya jodna chahte hain.',
  },
  KISAN: {
    title: 'Kisan',
    subtitle: 'Kheti karte hain. Zameen theke/batai pe lena ya saath kaam karna chahte hain.',
  },
};

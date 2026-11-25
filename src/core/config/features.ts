/**
 * Feature flags: switch finished-but-not-yet-released features on or off without
 * deleting code. Release builds set them in eas.json (`env`), local dev in .env.local.
 *
 * Expo only inlines EXPO_PUBLIC_* variables when they are read as
 * `process.env.EXPO_PUBLIC_NAME` literally, so each flag is spelled out below.
 */
const on = (value: string | undefined) => value === 'true' || value === '1';

const auth = on(process.env.EXPO_PUBLIC_FEATURE_AUTH);

export const FEATURES = {
  /** Phone OTP login, onboarding, profile tab (v1.1). */
  auth,
  /** Community feed (v1.2). Needs a logged-in user, so it is off without auth. */
  feed: auth && on(process.env.EXPO_PUBLIC_FEATURE_FEED),
  /** Khet listings (v1.3). Needs a logged-in user, so it is off without auth. */
  khet: auth && on(process.env.EXPO_PUBLIC_FEATURE_KHET),
} as const;

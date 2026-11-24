import { AuthShell } from '@/features/auth/components/AuthShell';
import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { useSaveProfile } from '@/features/auth/hooks/useSaveProfile';

/**
 * First-time setup after login: role, name, state, district.
 * Only reachable while the user has no profile (guard in src/app/_layout.tsx);
 * saving it flips the app to the main tabs automatically.
 */
export default function OnboardingScreen() {
  const { run, loading, error } = useSaveProfile();

  return (
    <AuthShell title="Apni pehchaan banayein" subtitle="Bas ek baar. Baad mein badal sakte hain.">
      <ProfileForm
        submitTitle="Shuru karein"
        loading={loading}
        serverError={error}
        onSubmit={(input) => void run(input)}
      />
    </AuthShell>
  );
}

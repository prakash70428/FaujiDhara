import { router } from 'expo-router';

import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { useSignedInUser } from '@/features/auth/hooks/AuthProvider';
import { useSaveProfile } from '@/features/auth/hooks/useSaveProfile';
import type { SelfRole } from '@/features/auth/domain/types';
import { Screen } from '@/shared/ui';

/** Change name, state or district. Role stays locked (the database enforces it too). */
export default function EditProfileScreen() {
  const { profile } = useSignedInUser();
  const { run, loading, error } = useSaveProfile();

  return (
    <Screen scroll className="w-full max-w-[560px] self-center pb-12">
      <ProfileForm
        initial={{
          // An ADMIN edits their name here too; the role picker just shows nothing selected.
          role: profile.role === 'ADMIN' ? undefined : (profile.role as SelfRole),
          fullName: profile.fullName,
          stateId: profile.stateId,
          district: profile.district,
        }}
        roleLocked
        submitTitle="Save karein"
        loading={loading}
        serverError={error}
        onSubmit={async (input) => {
          const saved = await run(input);
          if (saved) router.back();
        }}
      />
    </Screen>
  );
}

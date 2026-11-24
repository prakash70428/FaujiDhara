import { useCallback } from 'react';

import { AppError } from '@/core/errors';

import { profileRepository } from '../data/profileRepository';
import { cleanProfileInput, hasErrors, validateProfile } from '../domain/profileRules';
import type { ProfileInput } from '../domain/types';

import { useAuth } from './AuthProvider';
import { useAsyncAction } from './useAsyncAction';

/** Creates the profile (onboarding) or updates it (edit screen), then updates the app state. */
export function useSaveProfile() {
  const { session, profile, setProfile } = useAuth();

  const save = useCallback(
    async (input: ProfileInput) => {
      if (!session) throw new AppError('UNAUTHORIZED', 'Not logged in');
      if (hasErrors(validateProfile(input))) throw new AppError('VALIDATION', 'Invalid profile');
      const clean = cleanProfileInput(input);
      const saved = profile
        ? await profileRepository.update(session.user.id, clean)
        : await profileRepository.create(session.user.id, clean);
      setProfile(saved);
      return saved;
    },
    [session, profile, setProfile],
  );

  return useAsyncAction(save);
}

import type { ProfileInput } from './types';

export type ProfileErrors = Partial<Record<keyof ProfileInput, string>>;

const NAME = /^[\p{L}\p{M} .'-]+$/u; // letters in any script (Hindi too), spaces, . ' -

/**
 * Same limits as the CHECK constraints in supabase/migrations, so the user sees a
 * clear message on the phone before the database would reject the save.
 */
export function validateProfile(input: Partial<ProfileInput>): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = input.fullName?.trim() ?? '';
  const district = input.district?.trim() ?? '';

  if (!input.role) errors.role = 'Aap Fauji hain ya Kisan, chunein';
  if (name.length < 2) errors.fullName = 'Naam kam se kam 2 akshar ka ho';
  else if (name.length > 60) errors.fullName = 'Naam 60 akshar se chhota rakhein';
  else if (!NAME.test(name)) errors.fullName = 'Naam mein sirf akshar likhein';
  if (!input.stateId) errors.stateId = 'Apna rajya chunein';
  if (district.length < 2) errors.district = 'Zila (district) likhein';
  else if (district.length > 60) errors.district = 'Zila ka naam 60 akshar se chhota rakhein';

  return errors;
}

export function hasErrors(errors: ProfileErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Trims spaces and collapses double spaces before saving. */
export function cleanProfileInput(input: ProfileInput): ProfileInput {
  const tidy = (s: string) => s.trim().replace(/\s+/g, ' ');
  return { ...input, fullName: tidy(input.fullName), district: tidy(input.district) };
}

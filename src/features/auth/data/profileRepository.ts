import { fromSupabaseError, getSupabase } from '@/core/supabase';

import type { Profile, ProfileInput, UserRole } from '../domain/types';

/** A row exactly as the database stores it (snake_case). Never leaves this file. */
type ProfileRow = {
  id: string;
  role: UserRole;
  full_name: string;
  state_id: string;
  district: string;
  is_verified: boolean;
  created_at: string;
};

const COLUMNS = 'id, role, full_name, state_id, district, is_verified, created_at';

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    role: row.role,
    fullName: row.full_name,
    stateId: row.state_id,
    district: row.district,
    isVerified: row.is_verified,
    createdAt: row.created_at,
  };
}

export const profileRepository = {
  /** null = this user has logged in but not finished onboarding yet. */
  async getById(userId: string): Promise<Profile | null> {
    const { data, error } = await getSupabase()
      .from('profiles')
      .select(COLUMNS)
      .eq('id', userId)
      .maybeSingle<ProfileRow>();
    if (error) throw fromSupabaseError(error);
    return data ? toProfile(data) : null;
  },

  /** First save (onboarding). Role is set here once; the database blocks later changes. */
  async create(userId: string, input: ProfileInput): Promise<Profile> {
    const { data, error } = await getSupabase()
      .from('profiles')
      .insert({
        id: userId,
        role: input.role,
        full_name: input.fullName,
        state_id: input.stateId,
        district: input.district,
      })
      .select(COLUMNS)
      .single<ProfileRow>();
    if (error) throw fromSupabaseError(error);
    return toProfile(data);
  },

  /** Edit name and location. Role and verification are not sent, so they can't change. */
  async update(userId: string, input: Omit<ProfileInput, 'role'>): Promise<Profile> {
    const { data, error } = await getSupabase()
      .from('profiles')
      .update({ full_name: input.fullName, state_id: input.stateId, district: input.district })
      .eq('id', userId)
      .select(COLUMNS)
      .single<ProfileRow>();
    if (error) throw fromSupabaseError(error);
    return toProfile(data);
  },
};

import { AuthError, isAuthRetryableFetchError } from '@supabase/supabase-js';

import { AppError, toAppError, type AppErrorCode } from '../errors';

/** Shape of a PostgREST (database) error. Kept structural so we don't import internals. */
type DbError = { code?: string; message: string };

// Postgres / PostgREST codes we care about.
const DB_CODES: Record<string, AppErrorCode> = {
  '42501': 'FORBIDDEN', // RLS or our profiles_guard trigger said no
  '23514': 'VALIDATION', // CHECK constraint (e.g. name too short)
  '22P02': 'VALIDATION', // invalid enum / uuid text
  PGRST116: 'NOT_FOUND', // .single() found no row
};

// Supabase Auth error codes (error.code) → our codes.
const AUTH_CODES: Record<string, AppErrorCode> = {
  otp_expired: 'VALIDATION',
  otp_disabled: 'CONFIG',
  phone_provider_disabled: 'CONFIG',
  sms_send_failed: 'NETWORK',
  over_sms_send_rate_limit: 'RATE_LIMITED',
  over_request_rate_limit: 'RATE_LIMITED',
  session_not_found: 'UNAUTHORIZED',
  refresh_token_not_found: 'UNAUTHORIZED',
};

/**
 * Converts any Supabase error (auth or database) into our single AppError type.
 * Every `data/` function passes its errors through here, so screens never see raw
 * Supabase errors and can show one friendly message per AppError code.
 */
export function fromSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof AuthError) {
    if (isAuthRetryableFetchError(error)) return new AppError('NETWORK', error.message, error);
    const byCode = error.code ? AUTH_CODES[error.code] : undefined;
    if (byCode) return new AppError(byCode, error.message, error);
    if (error.status === 429) return new AppError('RATE_LIMITED', error.message, error);
    if (error.status === 401 || error.status === 403) {
      return new AppError('UNAUTHORIZED', error.message, error);
    }
    if (error.status && error.status >= 400 && error.status < 500) {
      return new AppError('VALIDATION', error.message, error);
    }
    return new AppError('UNKNOWN', error.message, error);
  }

  if (isDbError(error) && error.code && DB_CODES[error.code]) {
    return new AppError(DB_CODES[error.code]!, error.message, error);
  }

  return toAppError(error);
}

function isDbError(e: unknown): e is DbError {
  return typeof e === 'object' && e !== null && 'message' in e && 'code' in e;
}

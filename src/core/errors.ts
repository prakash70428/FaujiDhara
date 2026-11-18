/**
 * One error type for the whole app.
 *
 * Supabase, the network, and our own validation all throw different shapes of errors.
 * The data layer converts every one of them to AppError, so the UI only ever handles
 * one shape and can show a friendly message from `code`.
 */
export type AppErrorCode =
  | 'NETWORK' // internet nahi hai / server tak nahi pahunche
  | 'UNAUTHORIZED' // login nahi hai ya session khatam
  | 'FORBIDDEN' // login hai par permission nahi
  | 'NOT_FOUND'
  | 'VALIDATION' // user ne galat input diya
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

/** Messages shown to the user. Kept here so Hindi translations can replace them in Phase 9. */
const USER_MESSAGES: Record<AppErrorCode, string> = {
  NETWORK: 'Internet connection check karein aur dobara try karein.',
  UNAUTHORIZED: 'Kripya dobara login karein.',
  FORBIDDEN: 'Aapko ye karne ki permission nahi hai.',
  NOT_FOUND: 'Ye cheez nahi mili.',
  VALIDATION: 'Di gayi jaankari check karein.',
  UNKNOWN: 'Kuch gadbad ho gayi. Thodi der baad try karein.',
};

/** Converts anything that was thrown into an AppError. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof TypeError && /network|fetch/i.test(error.message)) {
    return new AppError('NETWORK', error.message, error);
  }
  const message = error instanceof Error ? error.message : String(error);
  return new AppError('UNKNOWN', message, error);
}

export function getUserMessage(error: unknown): string {
  return USER_MESSAGES[toAppError(error).code];
}

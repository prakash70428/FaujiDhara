/**
 * Indian mobile number rules. Pure functions: no React, no Supabase.
 *
 * Users type numbers in many ways: "98765 43210", "+91-9876543210", "09876543210".
 * We accept all of them and store ONE format (E.164: +919876543210), so the same
 * person never ends up with two accounts.
 */

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

/** Returns "+91XXXXXXXXXX", or null when the input is not a valid Indian mobile number. */
export function toE164IndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return INDIAN_MOBILE.test(digits) ? `+91${digits}` : null;
}

/** "+919876543210" → "+91 98765 43210", for showing on screen. */
export function formatIndianMobile(e164: string): string {
  const local = e164.replace(/^\+91/, '');
  return local.length === 10 ? `+91 ${local.slice(0, 5)} ${local.slice(5)}` : e164;
}

export const OTP_LENGTH = 6;

const OTP_PATTERN = new RegExp(String.raw`^\d{${OTP_LENGTH}}$`);

export function isValidOtp(code: string): boolean {
  return OTP_PATTERN.test(code);
}

/** Supabase lets a number ask for a new code once every 60 seconds. */
export const OTP_RESEND_SECONDS = 60;

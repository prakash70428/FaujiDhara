import { useCallback } from 'react';

import { AppError } from '@/core/errors';

import { authRepository } from '../data/authRepository';
import { isValidOtp, OTP_RESEND_SECONDS, toE164IndianMobile } from '../domain/phone';

import { useAsyncAction } from './useAsyncAction';
import { useCountdown } from './useCountdown';

/** Step 1: the number screen. Returns the normalised number once the SMS is sent. */
export function useSendOtp() {
  const send = useCallback(async (rawPhone: string) => {
    const phone = toE164IndianMobile(rawPhone);
    if (!phone) throw new AppError('VALIDATION', 'Invalid phone');
    await authRepository.sendOtp(phone);
    return phone;
  }, []);
  return useAsyncAction(send);
}

/**
 * Step 2: the code screen. On success Supabase stores the session and the
 * AuthProvider listener moves the app on by itself; no navigation needed here.
 */
export function useVerifyOtp(phone: string) {
  const countdown = useCountdown(OTP_RESEND_SECONDS);

  const verify = useCallback(
    async (code: string) => {
      if (!isValidOtp(code)) throw new AppError('VALIDATION', 'OTP must be 6 digits');
      await authRepository.verifyOtp(phone, code);
    },
    [phone],
  );

  const resendOtp = useCallback(async () => {
    await authRepository.sendOtp(phone);
    countdown.restart();
  }, [phone, countdown]);

  return {
    verify: useAsyncAction(verify),
    resend: useAsyncAction(resendOtp),
    secondsLeft: countdown.secondsLeft,
  };
}

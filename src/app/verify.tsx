import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthShell } from '@/features/auth/components/AuthShell';
import {
  formatIndianMobile,
  isValidOtp,
  OTP_LENGTH,
  toE164IndianMobile,
} from '@/features/auth/domain/phone';
import { useVerifyOtp } from '@/features/auth/hooks/usePhoneLogin';
import { Button, Input } from '@/shared/ui';

/**
 * Step 2 of login: type the SMS code. On success the AuthProvider sees the new session
 * and the root layout switches to onboarding or the app by itself.
 */
export default function VerifyScreen() {
  const params = useLocalSearchParams<{ phone?: string }>();
  // The number comes from the URL, so check it again: never trust a URL parameter.
  const phone = params.phone ? toE164IndianMobile(params.phone) : null;
  if (!phone) return <Redirect href="/login" />;
  return <VerifyForm phone={phone} />;
}

function VerifyForm({ phone }: { phone: string }) {
  const [code, setCode] = useState('');
  const { verify, resend, secondsLeft } = useVerifyOtp(phone);

  function submit(value = code) {
    if (isValidOtp(value)) void verify.run(value);
  }

  function onChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (verify.error) verify.clearError();
    if (digits.length === OTP_LENGTH) submit(digits); // auto-submit when SMS autofill pastes it
  }

  return (
    <AuthShell title="OTP daalein" subtitle={`${formatIndianMobile(phone)} par bheja gaya code`}>
      <Input
        label="6 ankon ka code"
        value={code}
        onChangeText={onChange}
        error={verify.error ?? undefined}
        keyboardType="number-pad"
        inputMode="numeric"
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        maxLength={OTP_LENGTH}
        autoFocus
        placeholder="••••••"
        className="h-14 text-center text-2xl tracking-[12px]"
      />

      <Button
        title="Login karein"
        size="lg"
        loading={verify.loading}
        disabled={!isValidOtp(code)}
        onPress={() => submit()}
      />

      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="py-2 active:opacity-60"
        >
          <Text className="text-sm font-semibold text-primary-700">Number badlein</Text>
        </Pressable>

        {secondsLeft > 0 ? (
          <Text className="text-sm text-ink-muted">Naya code {secondsLeft}s mein</Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            disabled={resend.loading}
            onPress={() => void resend.run()}
            className="py-2 active:opacity-60"
          >
            <Text className="text-sm font-semibold text-primary-700">
              {resend.loading ? 'Bhej rahe hain...' : 'Code dobara bhejein'}
            </Text>
          </Pressable>
        )}
      </View>
      {resend.error ? (
        <Text className="text-center text-sm text-danger">{resend.error}</Text>
      ) : null}
    </AuthShell>
  );
}

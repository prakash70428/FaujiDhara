import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { AuthShell } from '@/features/auth/components/AuthShell';
import { PhoneInput } from '@/features/auth/components/PhoneInput';
import { toE164IndianMobile } from '@/features/auth/domain/phone';
import { useSendOtp } from '@/features/auth/hooks/usePhoneLogin';
import { Button } from '@/shared/ui';

/** Step 1 of login: enter mobile number, get an SMS code. */
export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const { run, loading, error } = useSendOtp();

  const valid = toE164IndianMobile(phone) !== null;
  const fieldError =
    touched && !valid
      ? 'Sahi 10 ankon ka mobile number likhein (6, 7, 8 ya 9 se shuru)'
      : undefined;

  async function submit() {
    setTouched(true);
    if (!valid) return;
    const sentTo = await run(phone);
    if (sentTo) router.push({ pathname: '/verify', params: { phone: sentTo } });
  }

  return (
    <AuthShell
      title="Swagat hai"
      subtitle="Faujiyon aur Kisanon ko jodne wala app. Mobile number se login karein."
    >
      <PhoneInput
        value={phone}
        onChangeText={setPhone}
        error={fieldError}
        autoFocus
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      {error ? (
        <Text accessibilityRole="alert" className="text-center text-sm text-danger">
          {error}
        </Text>
      ) : null}
      <Button title="OTP bhejein" size="lg" loading={loading} onPress={submit} />
      <Text className="text-center text-xs text-ink-muted">
        Aapke number par 6 ankon ka code SMS se aayega. Aage badhkar aap FaujiDhara ki sharton aur
        privacy policy se sehmat hote hain.
      </Text>
    </AuthShell>
  );
}

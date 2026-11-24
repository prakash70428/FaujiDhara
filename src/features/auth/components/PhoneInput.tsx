import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

type PhoneInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  value: string;
  onChangeText: (digits: string) => void;
  error?: string;
};

/**
 * Mobile number field with a fixed +91 prefix. Keeps only digits (max 10), so the
 * user cannot type letters or spaces, and the number pad opens on phones.
 */
export function PhoneInput({ value, onChangeText, error, ...rest }: PhoneInputProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-ink">Mobile number</Text>
      <View
        className={cn(
          'h-14 flex-row items-center rounded-xl border bg-surface',
          error ? 'border-danger' : 'border-border',
        )}
      >
        <View className="h-full justify-center border-r border-border px-4">
          <Text className="text-lg font-semibold text-ink">+91</Text>
        </View>
        <TextInput
          accessibilityLabel="Mobile number"
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          inputMode="tel"
          autoComplete="tel-national"
          textContentType="telephoneNumber"
          maxLength={10}
          placeholder="98765 43210"
          placeholderTextColor={colors.ink.muted}
          className="h-full flex-1 px-4 text-lg tracking-wider text-ink"
          {...rest}
        />
      </View>
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}

import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  className?: string;
};

/** Text field with an optional label above it and an error message below it. */
export function Input({ label, error, className, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-ink">{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.ink.muted}
        className={cn(
          'h-12 rounded-xl border bg-surface px-4 text-base text-ink',
          error ? 'border-danger' : 'border-border focus:border-primary-600',
          className,
        )}
        {...rest}
      />
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}

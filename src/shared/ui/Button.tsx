import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

// Every variant's style lives in one map, so screens never hand-write button colors.
const containerByVariant: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-wheat-100 border border-wheat-400 active:bg-wheat-400',
  ghost: 'bg-transparent active:bg-primary-50',
  danger: 'bg-danger active:opacity-80',
};

const textByVariant: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-earth-700',
  ghost: 'text-primary-700',
  danger: 'text-white',
};

// lg = 56px tall: big touch target for users with rough hands or gloves in the field.
const containerBySize: Record<ButtonSize, string> = {
  md: 'h-12 px-5',
  lg: 'h-14 px-6',
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const spinnerColor = variant === 'primary' || variant === 'danger' ? '#fff' : colors.primary[600];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-xl',
        containerByVariant[variant],
        containerBySize[size],
        isDisabled && 'opacity-50',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text className={cn('text-base font-semibold', textByVariant[variant])}>{title}</Text>
      )}
    </Pressable>
  );
}

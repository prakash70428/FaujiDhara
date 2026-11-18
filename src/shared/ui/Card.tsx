import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

export type CardProps = ViewProps & {
  className?: string;
};

/** White rounded box used for posts, khet listings and crop info. */
export function Card({ className, ...rest }: CardProps) {
  return (
    <View className={cn('rounded-2xl border border-border bg-surface p-4', className)} {...rest} />
  );
}

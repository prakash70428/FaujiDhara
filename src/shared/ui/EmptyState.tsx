import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type EmptyStateProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
};

/** Shown when a list has nothing yet, so the user never sees a blank screen. */
export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
        <Ionicons name={icon} size={36} color={colors.primary[600]} />
      </View>
      <Text className="text-center text-lg font-semibold text-ink">{title}</Text>
      {message ? <Text className="text-center text-base text-ink-muted">{message}</Text> : null}
    </View>
  );
}

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

import { Button } from './Button';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ComingSoonProps = {
  icon: IconName;
  title: string;
  message: string;
  /** What the finished feature will do, one line each. */
  features: string[];
  /** Small label like "Agle update mein". */
  badge?: string;
  action?: { title: string; onPress: () => void };
};

/**
 * Placeholder for a tab whose feature is not released yet. It explains what is coming,
 * so the tab feels intentional (and passes store review) instead of empty.
 */
export function ComingSoon({
  icon,
  title,
  message,
  features,
  badge = 'Jald aa raha hai',
  action,
}: ComingSoonProps) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow items-center justify-center gap-5 p-6"
    >
      <View className="w-full max-w-[480px] items-center gap-5">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <Ionicons name={icon} size={36} color={colors.primary[600]} />
        </View>

        <View className="items-center gap-2">
          <View className="rounded-full bg-wheat-100 px-3 py-1">
            <Text className="text-xs font-semibold text-earth-700">{badge}</Text>
          </View>
          <Text className="text-center text-2xl font-bold text-ink">{title}</Text>
          <Text className="text-center text-base text-ink-muted">{message}</Text>
        </View>

        <View className="w-full gap-3 rounded-2xl border border-border bg-surface p-4">
          {features.map((f) => (
            <View key={f} className="flex-row items-start gap-3">
              <Ionicons name="checkmark-circle" size={20} color={colors.primary[600]} />
              <Text className="flex-1 text-sm text-ink">{f}</Text>
            </View>
          ))}
        </View>

        {action ? (
          <Button
            title={action.title}
            variant="secondary"
            onPress={action.onPress}
            className="w-full"
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

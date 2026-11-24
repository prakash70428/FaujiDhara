import { Pressable, ScrollView, Text } from 'react-native';

import type { GrowthStage } from '@/features/crops/domain/growth';
import { cn } from '@/shared/lib/cn';

type StageSelectorProps = {
  stages: readonly GrowthStage[];
  selected: string;
  onSelect: (key: string) => void;
};

/**
 * Segmented chips instead of a slider: React Native has no built-in slider,
 * and big tap targets are easier in the field than dragging a tiny thumb.
 */
export function StageSelector({ stages, selected, onSelect }: StageSelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {stages.map((s) => {
        const active = s.key === selected;
        return (
          <Pressable
            key={s.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(s.key)}
            className={cn(
              'h-10 justify-center rounded-full border px-4',
              active
                ? 'border-primary-600 bg-primary-600'
                : 'border-border bg-surface active:bg-primary-50',
            )}
          >
            <Text className={cn('text-sm font-semibold', active ? 'text-white' : 'text-ink')}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

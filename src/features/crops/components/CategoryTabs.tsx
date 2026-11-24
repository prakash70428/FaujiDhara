import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

import { CATEGORY_LABEL } from '../domain/format';
import type { PlantCategory } from '../domain/types';

import { CATEGORY_ICON } from './categoryIcon';

const ORDER: PlantCategory[] = ['vegetable', 'fruit', 'flower', 'spice'];

type CategoryTabsProps = {
  selected: PlantCategory;
  onSelect: (c: PlantCategory) => void;
  counts: Record<PlantCategory, number>;
};

export function CategoryTabs({ selected, onSelect, counts }: CategoryTabsProps) {
  return (
    <View className="flex-row gap-2">
      {ORDER.map((c) => {
        const active = c === selected;
        return (
          <Pressable
            key={c}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(c)}
            className={cn(
              'flex-1 items-center gap-1 rounded-2xl border py-2.5',
              active
                ? 'border-primary-600 bg-primary-600'
                : 'border-border bg-surface active:bg-primary-50',
            )}
          >
            <Ionicons
              name={CATEGORY_ICON[c]}
              size={20}
              color={active ? '#fff' : colors.primary[600]}
            />
            <Text className={cn('text-xs font-semibold', active ? 'text-white' : 'text-ink')}>
              {CATEGORY_LABEL[c].titleHi}
            </Text>
            <Text className={cn('text-[10px]', active ? 'text-primary-100' : 'text-ink-muted')}>
              {counts[c]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

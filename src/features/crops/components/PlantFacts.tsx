import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

import { formatMonths, LEVEL_LABEL, SEASON_LABEL, SUN_LABEL } from '../domain/format';
import type { Month, Plant } from '../domain/types';

type Fact = { icon: ComponentProps<typeof Ionicons>['name']; label: string; value: string };

const LIFECYCLE = {
  annual: 'Ek-varshiya',
  biennial: 'Do-varshiya',
  perennial: 'Bahu-varshiya',
} as const;

/** Quick farming facts in a 2-column grid. */
export function PlantFacts({ plant, sowMonths }: { plant: Plant; sowMonths: readonly Month[] }) {
  const facts: Fact[] = [
    { icon: 'calendar', label: 'Boai / ropai', value: formatMonths(sowMonths) },
    { icon: 'time', label: 'Fasal / katai', value: plant.harvest },
    {
      icon: 'partly-sunny',
      label: 'Mausam',
      value: plant.seasons.map((s) => SEASON_LABEL[s]).join(', '),
    },
    { icon: 'water', label: 'Paani', value: LEVEL_LABEL[plant.water] },
    { icon: 'sunny', label: 'Dhoop', value: SUN_LABEL[plant.sun] },
    { icon: 'repeat', label: 'Jeevan chakra', value: LIFECYCLE[plant.lifecycle] },
  ];

  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-2">
        {facts.map((f) => (
          <View
            key={f.label}
            className="min-w-[46%] flex-1 gap-1 rounded-xl border border-border bg-surface p-3"
          >
            <View className="flex-row items-center gap-1.5">
              <Ionicons name={f.icon} size={14} color={colors.primary[600]} />
              <Text className="text-xs text-ink-muted">{f.label}</Text>
            </View>
            <Text className="text-sm font-semibold text-ink">{f.value}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row gap-2 rounded-xl border border-border bg-surface p-3">
        <Ionicons name="layers" size={16} color={colors.earth[500]} />
        <View className="flex-1">
          <Text className="text-xs text-ink-muted">Mitti</Text>
          <Text className="text-sm font-semibold text-ink">{plant.soil}</Text>
        </View>
      </View>
    </View>
  );
}

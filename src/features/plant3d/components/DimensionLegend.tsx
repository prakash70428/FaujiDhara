import { Text, View } from 'react-native';

import { formatFeet } from '@/features/crops/domain/format';
import type { PlantDimensions } from '@/features/crops/domain/growth';
import type { RangeFt } from '@/features/crops/domain/types';

import { DIMENSION_COLORS } from '../domain/sceneLayout';

const ITEMS: { key: keyof PlantDimensions; color: string; label: string; where: string }[] = [
  { key: 'height', color: DIMENSION_COLORS.height, label: 'Oonchai', where: 'Zameen ke upar' },
  {
    key: 'spread',
    color: DIMENSION_COLORS.spread,
    label: 'Failaav (chaudai)',
    where: 'Zameen ke upar',
  },
  {
    key: 'rootDepth',
    color: DIMENSION_COLORS.rootDepth,
    label: 'Jad ki gehrai',
    where: 'Zameen ke neeche',
  },
  {
    key: 'rootSpread',
    color: DIMENSION_COLORS.rootSpread,
    label: 'Jad ka failaav',
    where: 'Zameen ke neeche',
  },
];

/** 2×2 grid; each color matches its line in the 3D view. */
export function DimensionLegend({ dims }: { dims: PlantDimensions }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {ITEMS.map((item) => (
        <View
          key={item.key}
          className="min-w-[46%] flex-1 rounded-xl border border-border bg-background p-3"
        >
          <View className="flex-row items-center gap-2">
            <View className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <Text className="text-xs text-ink-muted">{item.where}</Text>
          </View>
          <Text className="mt-1 text-xl font-bold text-ink">
            {formatFeet(dims[item.key] as RangeFt)}
          </Text>
          <Text className="text-sm text-ink-muted">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

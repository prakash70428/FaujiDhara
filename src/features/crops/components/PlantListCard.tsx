import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { formatFeet } from '../domain/format';
import type { Plant } from '../domain/types';

import { CATEGORY_ICON } from './categoryIcon';

type PlantListCardProps = { plant: Plant; sowNow: boolean; onPress: () => void };

/**
 * Light 2D card for the state lists. The heavy 3D view opens only on the detail screen:
 * 15 live 3D canvases in one list would overheat a budget phone.
 */
export function PlantListCard({ plant, sowNow, onPress }: PlantListCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${plant.nameHi}, ${plant.name}`}
      onPress={onPress}
      className="flex-1 gap-2 rounded-2xl border border-border bg-surface p-3 active:bg-primary-50"
    >
      <View className="flex-row items-start justify-between">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: plant.color }}
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-black/15">
            <Ionicons name={CATEGORY_ICON[plant.category]} size={18} color="#fff" />
          </View>
        </View>
        {sowNow ? (
          <Text className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
            Abhi boyein
          </Text>
        ) : null}
      </View>

      <View>
        <Text numberOfLines={1} className="text-base font-bold text-ink">
          {plant.nameHi}
        </Text>
        <Text numberOfLines={1} className="text-xs text-ink-muted">
          {plant.name}
        </Text>
      </View>

      <View className="gap-1">
        <View className="flex-row items-center gap-1">
          <Ionicons name="arrow-up" size={12} color="#43A047" />
          <Text className="text-xs text-ink">{formatFeet(plant.above.height)}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="arrow-down" size={12} color="#1E88E5" />
          <Text className="text-xs text-ink">{formatFeet(plant.roots.depth)} jad</Text>
        </View>
      </View>
    </Pressable>
  );
}

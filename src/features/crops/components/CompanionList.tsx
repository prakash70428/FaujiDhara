import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

import type { PlantLink } from '../hooks/usePlantDetail';

type CompanionListProps = {
  title: string;
  tone: 'good' | 'bad';
  links: PlantLink[];
  onOpen: (plantId: string) => void;
};

/** "Saathi paudhe" (grow together) or "Inse door rakhein" (keep apart), each with the reason. */
export function CompanionList({ title, tone, links, onOpen }: CompanionListProps) {
  if (links.length === 0) return null;
  const good = tone === 'good';

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Ionicons
          name={good ? 'people' : 'close-circle'}
          size={18}
          color={good ? colors.success : colors.danger}
        />
        <Text className="text-lg font-bold text-ink">{title}</Text>
      </View>
      {links.map(({ plant, why }) => (
        <Pressable
          key={plant.id}
          accessibilityRole="button"
          onPress={() => onOpen(plant.id)}
          className="flex-row items-center gap-3 rounded-xl border bg-surface p-3 active:bg-primary-50"
          style={{ borderColor: good ? '#C8E6C9' : '#FFCDD2' }}
        >
          <View className="h-9 w-9 rounded-full" style={{ backgroundColor: plant.color }} />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink">
              {plant.nameHi} <Text className="font-normal text-ink-muted">({plant.name})</Text>
            </Text>
            <Text className="text-sm text-ink-muted">{why}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.ink.muted} />
        </Pressable>
      ))}
    </View>
  );
}

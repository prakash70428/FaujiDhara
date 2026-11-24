import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

import type { IndianState } from '../domain/types';

type StateListItemProps = { state: IndianState; onPress: () => void };

export function StateListItem({ state, onPress }: StateListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${state.name}, ${state.region}`}
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 active:bg-primary-50"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
        <Text className="text-base font-bold text-primary-700">{state.name.charAt(0)}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-semibold text-ink">{state.name}</Text>
          <Text className="rounded-md bg-wheat-100 px-1.5 py-0.5 text-[11px] font-medium text-earth-700">
            {state.region}
          </Text>
        </View>
        <Text numberOfLines={1} className="text-sm text-ink-muted">
          {state.about}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.ink.muted} />
    </Pressable>
  );
}

import { ScrollView, Text, View } from 'react-native';

import { SEASON_GUIDE } from '../data/seasons';

/** Swipeable Rabi / Kharif / Zaid cards: the first thing a new farmer should know. */
export function SeasonGuide() {
  return (
    <View className="gap-2">
      <Text className="text-lg font-bold text-ink">Fasal ke 3 mausam</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {SEASON_GUIDE.map((s) => (
          <View
            key={s.key}
            className="w-64 gap-1.5 rounded-2xl border border-border bg-surface p-4"
          >
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <Text className="text-base font-bold text-ink">{s.title}</Text>
            </View>
            <Text className="text-sm text-ink">
              Boai <Text className="font-semibold">{s.sowing}</Text> • Katai{' '}
              <Text className="font-semibold">{s.harvest}</Text>
            </Text>
            <Text className="text-sm text-ink-muted">{s.weather}</Text>
            <Text className="text-sm text-ink-muted">Jaise: {s.examples}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

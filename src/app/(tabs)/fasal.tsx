import { router } from 'expo-router';
import { useState } from 'react';
import { SectionList, Text, View } from 'react-native';

import { SeasonGuide } from '@/features/crops/components/SeasonGuide';
import { StateListItem } from '@/features/crops/components/StateListItem';
import { useStateDirectory } from '@/features/crops/hooks/useStateDirectory';
import { colors } from '@/shared/theme/colors';
import { EmptyState, Input } from '@/shared/ui';

/** Fasal tab: season guide on top, then all 28 states and 8 UTs A→Z with search. */
export default function FasalScreen() {
  const [query, setQuery] = useState('');
  const sections = useStateDirectory(query);

  return (
    // NativeWind v4 doesn't map className on SectionList, so lists use plain style props.
    <SectionList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ gap: 8, padding: 16, paddingBottom: 40 }}
      sections={sections}
      keyExtractor={(s) => s.id}
      stickySectionHeadersEnabled={false}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View className="mb-2 gap-4">
          <SeasonGuide />
          <Input
            placeholder="Rajya ya ilaka dhoondhein (jaise: Punjab, South)"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            accessibilityLabel="Rajya dhoondhein"
          />
        </View>
      }
      renderSectionHeader={({ section }) => (
        <Text className="mt-2 text-sm font-bold uppercase tracking-wide text-ink-muted">
          {section.title}
        </Text>
      )}
      renderItem={({ item }) => (
        <StateListItem
          state={item}
          onPress={() =>
            router.push({ pathname: '/state/[stateId]', params: { stateId: item.id } })
          }
        />
      )}
      ListEmptyComponent={
        <EmptyState icon="search" title="Koi rajya nahi mila" message="Doosra naam try karein." />
      }
    />
  );
}

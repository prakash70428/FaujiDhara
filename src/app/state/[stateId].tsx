import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { CategoryTabs } from '@/features/crops/components/CategoryTabs';
import { PlantListCard } from '@/features/crops/components/PlantListCard';
import { CATEGORY_LABEL, monthName } from '@/features/crops/domain/format';
import type { PlantCategory } from '@/features/crops/domain/types';
import { useStateCrops } from '@/features/crops/hooks/useStateCrops';
import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';
import { Card, EmptyState } from '@/shared/ui';

/** One state/UT: category tabs, "sow this month" filter, and a 2-column grid of plants. */
export default function StateScreen() {
  const { stateId } = useLocalSearchParams<{ stateId: string }>();
  const [category, setCategory] = useState<PlantCategory>('vegetable');
  const [onlySowNow, setOnlySowNow] = useState(false);
  const { state, items, month } = useStateCrops(stateId, category, onlySowNow);

  const counts = useMemo(
    () => ({
      vegetable: state.crops.vegetable.length,
      fruit: state.crops.fruit.length,
      flower: state.crops.flower.length,
      spice: state.crops.spice.length,
    }),
    [state],
  );

  return (
    <>
      <Stack.Screen options={{ title: state.name }} />
      <FlatList
        // Plain style props: NativeWind v4 doesn't map className on virtualized lists.
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 40 }}
        columnWrapperStyle={{ gap: 12 }}
        data={items}
        numColumns={2}
        keyExtractor={(item) => item.plant.id}
        ListHeaderComponent={
          <View className="mb-1 gap-4">
            <Card className="gap-1">
              <Text className="text-xs font-semibold uppercase text-ink-muted">
                {state.kind === 'ut' ? 'Kendra Shasit Pradesh' : 'Rajya'} • {state.region}
              </Text>
              <Text className="text-base text-ink">{state.about}</Text>
              {state.note ? (
                <Text className="mt-1 text-sm text-earth-700">ⓘ {state.note}</Text>
              ) : null}
            </Card>

            <CategoryTabs selected={category} onSelect={setCategory} counts={counts} />

            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: onlySowNow }}
              onPress={() => setOnlySowNow((v) => !v)}
              className={cn(
                'flex-row items-center gap-2 self-start rounded-full border px-3 py-2',
                onlySowNow ? 'border-primary-600 bg-primary-50' : 'border-border bg-surface',
              )}
            >
              <Ionicons
                name={onlySowNow ? 'checkbox' : 'square-outline'}
                size={18}
                color={onlySowNow ? colors.primary[600] : colors.ink.muted}
              />
              <Text className="text-sm font-medium text-ink">
                Sirf {monthName(month)} mein boyi jaane wali
              </Text>
            </Pressable>

            <Text className="text-lg font-bold text-ink">
              {CATEGORY_LABEL[category].titleHi} ({items.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PlantListCard
            plant={item.plant}
            sowNow={item.sowNow}
            onPress={() =>
              router.push({
                pathname: '/plant/[plantId]',
                params: { plantId: item.plant.id, stateId: state.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title={`${monthName(month)} mein inme se kuch nahi boya jaata`}
            message="Filter hata kar poori list dekhein."
          />
        }
      />
    </>
  );
}

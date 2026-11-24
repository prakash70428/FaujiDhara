import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { CompanionList } from '@/features/crops/components/CompanionList';
import { ExpertTip } from '@/features/crops/components/ExpertTip';
import { PlantFacts } from '@/features/crops/components/PlantFacts';
import { CATEGORY_LABEL } from '@/features/crops/domain/format';
import { usePlantDetail } from '@/features/crops/hooks/usePlantDetail';
import { Plant3DCard } from '@/features/plant3d/components/Plant3DCard';
import { Screen } from '@/shared/ui';

/** Full plant guide: 3D model with measurements, farming facts, companions and field advice. */
export default function PlantScreen() {
  const { plantId, stateId } = useLocalSearchParams<{ plantId: string; stateId?: string }>();
  const { plant, sowMonths, companions, avoid } = usePlantDetail(plantId, stateId);

  // Companion taps replace this screen instead of stacking 10 plant screens deep.
  const openPlant = (id: string) =>
    router.replace({
      pathname: '/plant/[plantId]',
      params: { plantId: id, ...(stateId ? { stateId } : {}) },
    });

  return (
    <>
      <Stack.Screen options={{ title: plant.nameHi }} />
      <Screen scroll className="gap-5 pb-12">
        <View className="gap-1">
          <Text className="text-xs font-semibold uppercase text-primary-700">
            {CATEGORY_LABEL[plant.category].titleHi} • {CATEGORY_LABEL[plant.category].title}
          </Text>
          <Text className="text-3xl font-bold text-ink">{plant.nameHi}</Text>
          <Text className="text-base text-ink-muted">
            {plant.name} • <Text className="italic">{plant.scientific}</Text>
          </Text>
        </View>

        <Plant3DCard plant={plant} />

        <PlantFacts plant={plant} sowMonths={sowMonths} />

        <CompanionList
          title="Saathi paudhe (saath lagayein)"
          tone="good"
          links={companions}
          onOpen={openPlant}
        />
        <CompanionList title="Inse door rakhein" tone="bad" links={avoid} onOpen={openPlant} />

        <ExpertTip tip={plant.tip} />
      </Screen>
    </>
  );
}

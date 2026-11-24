import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { dimensionsAt, stagesFor } from '@/features/crops/domain/growth';
import type { Plant } from '@/features/crops/domain/types';
import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';
import { Card, ErrorBoundary } from '@/shared/ui';

import { toSceneSize } from '../domain/sceneLayout';

import { DimensionLegend } from './DimensionLegend';
import { Plant3DViewer } from './Plant3DViewer';
import { StageSelector } from './StageSelector';

/**
 * The full interactive card: 3D view, toggles, growth stages and the measurement legend.
 * It owns UI state only; all sizes come from the crop domain (dimensionsAt).
 */
/** From this window width (big tablet landscape, laptop) the controls move beside the 3D view. */
const WIDE_BREAKPOINT = 1024;

export function Plant3DCard({ plant }: { plant: Plant }) {
  const { width: windowWidth } = useWindowDimensions();
  const wide = windowWidth >= WIDE_BREAKPOINT;
  const stages = useMemo(() => stagesFor(plant), [plant]);
  const [stageKey, setStageKey] = useState(stages[stages.length - 1]!.key);
  const [xray, setXray] = useState(false);
  const [showHuman, setShowHuman] = useState(false);
  const [showDims, setShowDims] = useState(true);

  const stage = stages.find((s) => s.key === stageKey) ?? stages[stages.length - 1]!;
  const dims = useMemo(() => dimensionsAt(plant, stage), [plant, stage]);
  const matureDims = useMemo(
    () => dimensionsAt(plant, stages[stages.length - 1]!),
    [plant, stages],
  );
  const size = useMemo(() => toSceneSize(dims), [dims]);
  const matureSize = useMemo(() => toSceneSize(matureDims), [matureDims]);

  return (
    <Card className={cn('gap-4 p-3', wide && 'flex-row items-start')}>
      <View className={cn('gap-3', wide ? 'flex-1' : 'w-full')}>
        <ErrorBoundary fallback={<Viewer3DFallback />}>
          <Plant3DViewer
            plant={plant}
            size={size}
            matureSize={matureSize}
            xray={xray}
            showHuman={showHuman}
            showDimensions={showDims}
          />
        </ErrorBoundary>

        <Text className="text-center text-xs text-ink-muted">
          Ek ungli se ghumayein • do ungli se zoom • naap feet (ft) mein
        </Text>
      </View>

      <View className={cn('gap-4', wide && 'w-96')}>
        <View className="flex-row flex-wrap gap-2">
          <Toggle
            icon="scan"
            label="Mitti X-Ray"
            active={xray}
            onPress={() => setXray((v) => !v)}
          />
          <Toggle
            icon="resize"
            label="Naap"
            active={showDims}
            onPress={() => setShowDims((v) => !v)}
          />
          <Toggle
            icon="body"
            label="Insaan (5.5 ft)"
            active={showHuman}
            onPress={() => setShowHuman((v) => !v)}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink">Badhvar ki avastha</Text>
          <StageSelector stages={stages} selected={stage.key} onSelect={setStageKey} />
        </View>

        <DimensionLegend dims={dims} />
      </View>
    </Card>
  );
}

function Toggle({
  icon,
  label,
  active,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      onPress={onPress}
      className={cn(
        'h-10 flex-row items-center gap-1.5 rounded-full border px-3',
        active ? 'border-earth-500 bg-earth-100' : 'border-border bg-surface',
      )}
    >
      <Ionicons name={icon} size={16} color={active ? colors.earth[700] : colors.ink.muted} />
      <Text className={cn('text-sm font-medium', active ? 'text-earth-700' : 'text-ink-muted')}>
        {label}
      </Text>
    </Pressable>
  );
}

function Viewer3DFallback() {
  return (
    <View className="h-48 items-center justify-center gap-2 rounded-2xl bg-background p-6">
      <Ionicons name="cube-outline" size={32} color={colors.ink.muted} />
      <Text className="text-center text-sm text-ink-muted">
        Is phone par 3D nahi chal paaya. Neeche diye gaye naap poori jaankari dete hain.
      </Text>
    </View>
  );
}

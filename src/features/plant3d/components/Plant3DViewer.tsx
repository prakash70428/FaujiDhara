import Ionicons from '@expo/vector-icons/Ionicons';
import { Canvas } from '@react-three/fiber';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';

import type { Plant } from '@/features/crops/domain/types';
import { colors } from '@/shared/theme/colors';

import { OrbitController } from '../domain/orbit';
import { seedFromString } from '../domain/random';
import { CAMERA_FOV, frameScene, type SceneSize } from '../domain/sceneLayout';
import { useOrbitGestures } from '../hooks/useOrbitGestures';

import { PlantScene } from './scene/PlantScene';

type Plant3DViewerProps = {
  plant: Plant;
  /** Size at the chosen growth stage. */
  size: SceneSize;
  /** Mature size: fixes camera and soil so the plant visibly grows inside them. */
  matureSize: SceneSize;
  xray: boolean;
  showHuman: boolean;
  showDimensions: boolean;
  /** Fixed height in px. Leave empty to size from the screen (phone, tablet, laptop). */
  height?: number;
};

/**
 * Picks a canvas height that suits the device:
 * - phone (narrow): almost square, so the tall plant + roots get room;
 * - tablet / laptop: wider and shorter, but never taller than ~70% of the window,
 *   so the controls below stay reachable without scrolling far.
 */
export function responsiveViewerHeight(width: number, windowHeight: number): number {
  const ratio = width < 600 ? 1.05 : width < 900 ? 0.75 : 0.6;
  const max = Math.min(600, windowHeight * 0.7);
  return Math.round(Math.min(Math.max(width * ratio, 280), Math.max(max, 280)));
}

/**
 * The 3D canvas + touch layer + zoom/reset buttons.
 * '@react-three/fiber' picks its native (expo-gl) build on Android/iOS automatically
 * via the package's "react-native" field, and the WebGL build on web.
 */
export function Plant3DViewer({
  plant,
  size,
  matureSize,
  xray,
  showHuman,
  showDimensions,
  height: fixedHeight,
}: Plant3DViewerProps) {
  const { height: windowHeight } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));
  const height = fixedHeight ?? (width > 0 ? responsiveViewerHeight(width, windowHeight) : 320);
  const aspect = width > 0 ? width / height : 1;

  // One controller per viewer for its whole life (useState initializer runs once).
  const [controller] = useState(() => new OrbitController());
  const panHandlers = useOrbitGestures(controller);

  const framing = useMemo(
    () => frameScene(matureSize, showHuman, aspect),
    [matureSize, showHuman, aspect],
  );
  const seed = useMemo(() => seedFromString(plant.id), [plant.id]);

  return (
    <View
      onLayout={onLayout}
      style={{ height }}
      className="w-full overflow-hidden rounded-2xl bg-[#EEF3E6]"
    >
      <View className="flex-1" {...panHandlers}>
        {/* Wait for the first measure, so the camera is framed for the real screen shape. */}
        {width > 0 && (
          <Canvas
            frameloop="demand"
            dpr={[1, 1.5]} // cap pixel density: big GPU saving on high-res budget phones
            camera={{ fov: CAMERA_FOV, near: 0.05, far: 2000, position: [0, 0, framing.distance] }}
            gl={{ antialias: true, powerPreference: 'low-power' }}
          >
            <PlantScene
              plant={plant}
              seed={seed}
              size={size}
              framing={framing}
              xray={xray}
              showHuman={showHuman}
              showDimensions={showDimensions}
              controller={controller}
            />
          </Canvas>
        )}
      </View>

      <View className="absolute right-2 top-2 gap-2">
        <RoundButton icon="add" label="Zoom in" onPress={() => controller.zoomBy(0.8)} />
        <RoundButton icon="remove" label="Zoom out" onPress={() => controller.zoomBy(1.25)} />
        <RoundButton icon="refresh" label="View reset karein" onPress={() => controller.reset()} />
      </View>
    </View>
  );
}

function RoundButton({
  icon,
  label,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-white/90 active:bg-primary-50"
    >
      <Ionicons name={icon} size={20} color={colors.primary[700]} />
    </Pressable>
  );
}

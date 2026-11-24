import type { Plant } from '@/features/crops/domain/types';

import type { OrbitController } from '../../domain/orbit';
import type { Framing, SceneSize } from '../../domain/sceneLayout';

import { CameraRig } from './CameraRig';
import { DimensionLines } from './DimensionLines';
import { PlantBody } from './PlantBody';
import { Roots } from './Roots';
import { ScaleFigure } from './ScaleFigure';
import { SoilBlock } from './SoilBlock';

export type PlantSceneProps = {
  plant: Plant;
  seed: number;
  /** Size at the selected growth stage (what we draw). */
  size: SceneSize;
  framing: Framing;
  xray: boolean;
  showHuman: boolean;
  showDimensions: boolean;
  controller: OrbitController;
};

const SKY = '#EEF3E6';

/** Everything inside the 3D canvas: lights, soil, plant, roots, measurements, camera. */
export function PlantScene(p: PlantSceneProps) {
  const humanX = -(Math.max(p.size.spread, p.size.rootSpread) / 2 + 2.2);

  return (
    <>
      <color attach="background" args={[SKY]} />
      <hemisphereLight args={['#F4FAFF', '#6B4A2F', 1.1]} />
      <directionalLight position={[8, 14, 10]} intensity={1.6} />
      <directionalLight position={[-10, 6, -6]} intensity={0.35} />

      <CameraRig controller={p.controller} framing={p.framing} />

      {/* Opaque things first, then the see-through soil over them. */}
      <PlantBody plant={p.plant} size={p.size} seed={p.seed} />
      <Roots plant={p.plant} size={p.size} seed={p.seed} />
      {p.showHuman && <ScaleFigure x={humanX} />}
      <SoilBlock width={p.framing.soilWidth} depth={p.framing.soilDepth} xray={p.xray} />
      {p.showDimensions && <DimensionLines size={p.size} lineRadius={p.framing.lineRadius} />}
    </>
  );
}

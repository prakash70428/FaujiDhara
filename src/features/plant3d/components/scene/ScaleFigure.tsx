import { HUMAN_HEIGHT_FT } from '../../domain/sceneLayout';

import { GEO, mat, Segment } from './kit';

const SKIN = '#90A4AE';

/** A simple 5.5 ft person standing beside the plant, so size is easy to judge. */
export function ScaleFigure({ x }: { x: number }) {
  const h = HUMAN_HEIGHT_FT;
  const m = mat(SKIN);
  return (
    <group position={[x, 0, 0]}>
      <Segment from={[-0.25, 0, 0]} to={[-0.15, h * 0.47, 0]} radius={0.16} material={m} />
      <Segment from={[0.25, 0, 0]} to={[0.15, h * 0.47, 0]} radius={0.16} material={m} />
      <Segment from={[0, h * 0.45, 0]} to={[0, h * 0.8, 0]} radius={0.42} material={m} taper />
      <Segment from={[-0.45, h * 0.78, 0]} to={[-0.55, h * 0.45, 0]} radius={0.11} material={m} />
      <Segment from={[0.45, h * 0.78, 0]} to={[0.55, h * 0.45, 0]} radius={0.11} material={m} />
      <mesh geometry={GEO.sphere} material={m} position={[0, h * 0.9, 0]} scale={0.48} />
    </group>
  );
}

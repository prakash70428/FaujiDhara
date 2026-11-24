import * as THREE from 'three';

import { DIMENSION_COLORS, type SceneSize } from '../../domain/sceneLayout';

import { GEO, mat, Segment, type Vec3 } from './kit';

const OVERLAY = 10; // render after everything else, on top (CAD annotation style)
const UP = new THREE.Vector3(0, 1, 0);

/** Arrow cone at `at`, pointing along `dir`. */
function Arrowhead({ at, dir, r, color }: { at: Vec3; dir: Vec3; r: number; color: string }) {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(...dir).normalize());
  return (
    <mesh
      geometry={GEO.cone}
      material={mat(color, { overlay: true })}
      position={at}
      quaternion={q}
      scale={[r * 3, r * 9, r * 3]}
      renderOrder={OVERLAY}
    />
  );
}

/** Dimension line with arrowheads at both ends and faint extension lines to the measured edge. */
function DimLine({
  from,
  to,
  color,
  r,
  extFrom,
  extTo,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
  r: number;
  extFrom?: [Vec3, Vec3];
  extTo?: [Vec3, Vec3];
}) {
  const dir: Vec3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
  const back: Vec3 = [-dir[0], -dir[1], -dir[2]];
  const ext = mat(color, { overlay: true, opacity: 0.35 });

  return (
    <group>
      <Segment
        from={from}
        to={to}
        radius={r}
        material={mat(color, { overlay: true })}
        renderOrder={OVERLAY}
      />
      <Arrowhead at={to} dir={dir} r={r} color={color} />
      <Arrowhead at={from} dir={back} r={r} color={color} />
      {extFrom && (
        <Segment
          from={extFrom[0]}
          to={extFrom[1]}
          radius={r * 0.4}
          material={ext}
          renderOrder={OVERLAY}
        />
      )}
      {extTo && (
        <Segment
          from={extTo[0]}
          to={extTo[1]}
          radius={r * 0.4}
          material={ext}
          renderOrder={OVERLAY}
        />
      )}
    </group>
  );
}

type DimensionLinesProps = { size: SceneSize; lineRadius: number };

/**
 * Four measurements, each with its own color (matched by the legend under the viewer):
 * height (green), canopy width (orange), root depth (blue), root spread (purple).
 */
export function DimensionLines({ size, lineRadius: r }: DimensionLinesProps) {
  const { height: H, spread: W, rootDepth: D, rootSpread: RW } = size;
  const gap = Math.max(H + D, W) * 0.08;
  const right = W / 2 + gap;
  const left = -(Math.max(W, RW) / 2 + gap);

  return (
    <group>
      <DimLine
        from={[right, 0, 0]}
        to={[right, H, 0]}
        color={DIMENSION_COLORS.height}
        r={r}
        extTo={[
          [W / 2, H, 0],
          [right, H, 0],
        ]}
      />
      <DimLine
        from={[-W / 2, H + gap, 0]}
        to={[W / 2, H + gap, 0]}
        color={DIMENSION_COLORS.spread}
        r={r}
        extFrom={[
          [-W / 2, H * 0.6, 0],
          [-W / 2, H + gap, 0],
        ]}
        extTo={[
          [W / 2, H * 0.6, 0],
          [W / 2, H + gap, 0],
        ]}
      />
      <DimLine
        from={[left, 0, 0]}
        to={[left, -D, 0]}
        color={DIMENSION_COLORS.rootDepth}
        r={r}
        extTo={[
          [0, -D, 0],
          [left, -D, 0],
        ]}
      />
      <DimLine
        from={[-RW / 2, -D - gap, 0]}
        to={[RW / 2, -D - gap, 0]}
        color={DIMENSION_COLORS.rootSpread}
        r={r}
        extFrom={[
          [-RW / 2, -D * 0.5, 0],
          [-RW / 2, -D - gap, 0],
        ]}
        extTo={[
          [RW / 2, -D * 0.5, 0],
          [RW / 2, -D - gap, 0],
        ]}
      />
    </group>
  );
}

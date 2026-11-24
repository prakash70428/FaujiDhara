import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, onEllipsoid, PALETTE, pick, Segment, type Vec3 } from '../kit';

import { showsProduce, type FormProps } from './types';

/** Trunk + branches + a rounded crown of low-poly leaf clusters, with fruit/flowers on the surface. */
export function TreeForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;

  const model = useMemo(() => {
    const rng = createRng(seed);
    const trunkH = H * 0.36;
    const crownH = H - trunkH;
    const center: Vec3 = [0, trunkH + crownH / 2, 0];
    const radii: Vec3 = [W / 2, crownH / 2, W / 2];
    const blobR = Math.min(W, crownH) * 0.3;

    const blobs = Array.from({ length: 11 }, () => {
      const p = onEllipsoid(
        rng,
        center,
        [radii[0] - blobR * 0.6, radii[1] - blobR * 0.6, radii[2] - blobR * 0.6],
        -0.6,
      );
      return { p, r: blobR * between(rng, 0.8, 1.15), color: pick(rng, PALETTE.leaf) };
    });

    const branches = blobs.slice(0, 5).map((b) => b.p);
    const dotR = Math.max(0.12, Math.min(W, H) * 0.028);
    // Just outside the leaf clusters, so fruit/flowers are visible, not buried in leaves.
    const out = blobR * 0.35;
    const produce = Array.from({ length: 18 }, () =>
      onEllipsoid(rng, center, [radii[0] + out, radii[1] + out * 0.5, radii[2] + out], -0.5),
    );

    return { trunkH, crownH, blobs, branches, dotR, produce };
  }, [H, W, seed]);

  const trunkR = Math.max(0.06, W * 0.035);
  const branchBase: Vec3 = [0, model.trunkH + model.crownH * 0.15, 0];

  return (
    <group>
      <Segment
        from={[0, 0, 0]}
        to={branchBase}
        radius={trunkR}
        material={mat(PALETTE.bark)}
        taper
      />
      {model.branches.map((to, i) => (
        <Segment
          key={i}
          from={branchBase}
          to={to}
          radius={trunkR * 0.45}
          material={mat(PALETTE.bark)}
          taper
        />
      ))}
      {model.blobs.map((b, i) => (
        <mesh key={i} geometry={GEO.blob} material={mat(b.color)} position={b.p} scale={b.r} />
      ))}
      {showsProduce(plant) &&
        model.produce.map((p, i) => (
          <mesh
            key={i}
            geometry={GEO.sphere}
            material={mat(plant.color, { flat: false })}
            position={p}
            scale={model.dotR}
          />
        ))}
    </group>
  );
}

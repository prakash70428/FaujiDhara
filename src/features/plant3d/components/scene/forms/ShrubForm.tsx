import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, onEllipsoid, PALETTE, pick, Segment, type Vec3 } from '../kit';

import { showsProduce, type FormProps } from './types';

/** Several stems from the ground into a bushy, low crown (gulab, mirch, anar, tulsi). */
export function ShrubForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;

  const model = useMemo(() => {
    const rng = createRng(seed);
    const center: Vec3 = [0, H * 0.58, 0];
    const radii: Vec3 = [W / 2, H * 0.42, W / 2];
    const blobR = Math.min(W, H) * 0.26;

    const stems = Array.from({ length: 5 }, (_, i): Vec3 => {
      const a = (i / 5) * Math.PI * 2 + rng();
      return [Math.cos(a) * W * 0.22, H * between(rng, 0.45, 0.7), Math.sin(a) * W * 0.22];
    });
    const blobs = Array.from({ length: 10 }, () => ({
      p: onEllipsoid(
        rng,
        center,
        [radii[0] - blobR * 0.5, radii[1] - blobR * 0.5, radii[2] - blobR * 0.5],
        -0.7,
      ),
      r: blobR * between(rng, 0.75, 1.1),
      color: pick(rng, PALETTE.leaf),
    }));
    const dotR = Math.max(0.05, Math.min(W, H) * 0.045);
    // Just outside the leaf clusters, so fruit/flowers stay visible.
    const out = blobR * 0.4;
    const produce = Array.from({ length: 14 }, () =>
      onEllipsoid(rng, center, [radii[0] + out, radii[1] + out * 0.5, radii[2] + out], -0.4),
    );
    return { stems, blobs, dotR, produce };
  }, [H, W, seed]);

  const stemR = Math.max(0.02, Math.min(W, H) * 0.02);

  return (
    <group>
      {model.stems.map((to, i) => (
        <Segment
          key={i}
          from={[0, 0, 0]}
          to={to}
          radius={stemR}
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

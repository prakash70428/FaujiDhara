import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick } from '../kit';

import type { FormProps } from './types';

const ROUND_ROOTS = new Set(['beetroot', 'turnip']);

/**
 * Leafy top above ground, and the edible storage root BELOW ground (gajar, mooli, chukandar).
 * The storage root is part of the model — the fine feeder roots come from <Roots/>.
 */
export function RootCropForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W, rootDepth: D, rootSpread: RW } = size;

  const leaves = useMemo(() => {
    const rng = createRng(seed);
    return Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 + rng() * 0.4;
      const tilt = between(rng, 0.15, 0.55);
      return { a, tilt, len: H * between(rng, 0.8, 1), color: pick(rng, PALETTE.leaf) };
    });
  }, [H, seed]);

  const round = ROUND_ROOTS.has(plant.id);
  const r = Math.max(0.06, Math.min(RW * 0.3, W * 0.3, 0.35));
  const len = Math.max(r * 2, D * 0.5);

  return (
    <group>
      {leaves.map((l, i) => (
        <group key={i} rotation={[0, l.a, l.tilt]}>
          <mesh
            geometry={GEO.cone}
            material={mat(l.color)}
            position={[0, l.len / 2, 0]}
            scale={[Math.max(0.04, W * 0.12), l.len, Math.max(0.02, W * 0.05)]}
          />
        </group>
      ))}
      {round ? (
        <mesh
          geometry={GEO.sphere}
          material={mat(plant.color, { flat: false })}
          position={[0, -r * 0.7, 0]}
          scale={[r, r * 0.9, r]}
        />
      ) : (
        <mesh
          geometry={GEO.cone}
          material={mat(plant.color, { flat: false })}
          position={[0, -len / 2 + r * 0.2, 0]}
          rotation={[Math.PI, 0, 0]}
          scale={[r, len, r]}
        />
      )}
    </group>
  );
}

import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick, Segment, type Vec3 } from '../kit';

import { showsProduce, type FormProps } from './types';

type Leaf = { p: Vec3; rot: Vec3; s: Vec3; color: string };

/**
 * Two shapes in one, chosen by proportion:
 *  - tall herb (surajmukhi, sarson, saunf): central stalk, leaf pairs, bloom on top
 *  - rosette (palak, genda, ananas, strawberry): leaves fanning out from the base
 */
export function HerbForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;
  const tall = H > W * 1.6;

  const model = useMemo(() => {
    const rng = createRng(seed);
    const leaves: Leaf[] = [];
    const blooms: Vec3[] = [];
    const stalks: Vec3[] = [];

    if (tall) {
      const pairs = 6;
      for (let i = 0; i < pairs; i++) {
        const y = H * (0.12 + (i / pairs) * 0.7);
        const len = W * 0.42 * (1 - i / (pairs * 1.6));
        for (const side of [0, Math.PI]) {
          const a = side + i * 1.1;
          leaves.push({
            p: [Math.cos(a) * len * 0.5, y, Math.sin(a) * len * 0.5],
            rot: [0, -a, between(rng, 0.25, 0.5)],
            s: [len / 2, 0.02 + len * 0.02, len * 0.18],
            color: pick(rng, PALETTE.leaf),
          });
        }
      }
      stalks.push([0, H, 0]);
      blooms.push([0, H, 0]);
    } else {
      const count = 12;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rng() * 0.3;
        const len = W * 0.5 * between(rng, 0.75, 1);
        const tilt = between(rng, 0.45, 1.0);
        leaves.push({
          p: [Math.cos(a) * len * 0.45, H * 0.35 * tilt, Math.sin(a) * len * 0.45],
          rot: [0, -a, tilt * 0.9],
          s: [len / 2, 0.02 + len * 0.03, len * 0.2],
          color: pick(rng, PALETTE.leaf),
        });
      }
      for (let i = 0; i < 4; i++) {
        const a = rng() * Math.PI * 2;
        const top: Vec3 = [
          Math.cos(a) * W * 0.18,
          H * between(rng, 0.75, 1),
          Math.sin(a) * W * 0.18,
        ];
        stalks.push(top);
        blooms.push(top);
      }
    }
    return { leaves, blooms, stalks };
  }, [H, W, seed, tall]);

  const bloomR = Math.max(0.05, tall ? W * 0.16 : W * 0.08);
  const stalkR = Math.max(0.015, H * 0.012);

  return (
    <group>
      {model.stalks.map((top, i) => (
        <Segment
          key={i}
          from={[0, 0, 0]}
          to={top}
          radius={stalkR}
          material={mat(PALETTE.stem)}
          taper
        />
      ))}
      {model.leaves.map((l, i) => (
        <mesh
          key={i}
          geometry={GEO.blob}
          material={mat(l.color)}
          position={l.p}
          rotation={l.rot}
          scale={l.s}
        />
      ))}
      {showsProduce(plant) &&
        model.blooms.map((p, i) => (
          <mesh
            key={i}
            geometry={GEO.sphere}
            material={mat(plant.color, { flat: false })}
            position={p}
            scale={tall && plant.category === 'flower' ? [bloomR, bloomR * 0.35, bloomR] : bloomR}
          />
        ))}
    </group>
  );
}

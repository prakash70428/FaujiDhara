import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick, Segment, type Vec3 } from '../kit';

import type { FormProps } from './types';

/** Upright tube-like leaves, a bulb at the soil line, and a flower spike for bulb flowers. */
export function BulbForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;
  const isFlower = plant.category === 'flower' || plant.id === 'saffron';

  const model = useMemo(() => {
    const rng = createRng(seed);
    const leaves = Array.from({ length: 7 }, (): { top: Vec3; color: string } => {
      const a = rng() * Math.PI * 2;
      const lean = W * between(rng, 0.2, 0.5);
      return {
        top: [
          Math.cos(a) * lean,
          H * between(rng, isFlower ? 0.5 : 0.75, isFlower ? 0.75 : 1),
          Math.sin(a) * lean,
        ],
        color: pick(rng, PALETTE.leaf),
      };
    });
    const spike = Array.from({ length: 5 }, (_, i): Vec3 => [
      between(rng, -0.05, 0.05),
      H * (0.7 + i * 0.07),
      between(rng, -0.05, 0.05),
    ]);
    return { leaves, spike };
  }, [H, W, seed, isFlower]);

  const bulbR = Math.max(0.08, Math.min(W * 0.5, 0.35));
  const leafR = Math.max(0.015, bulbR * 0.12);
  const bloomR = Math.max(0.06, Math.min(H * 0.06, 0.3));

  return (
    <group>
      {model.leaves.map((l, i) => (
        <Segment key={i} from={[0, 0, 0]} to={l.top} radius={leafR} material={mat(l.color)} taper />
      ))}
      <mesh
        geometry={GEO.sphere}
        material={mat(isFlower ? '#C8A87A' : plant.color, { flat: false })}
        position={[0, -bulbR * 0.35, 0]}
        scale={[bulbR, bulbR * 0.9, bulbR]}
      />
      {isFlower && (
        <>
          <Segment
            from={[0, 0, 0]}
            to={[0, H, 0]}
            radius={leafR * 0.8}
            material={mat(PALETTE.stem)}
          />
          {model.spike.map((p, i) => (
            <mesh
              key={i}
              geometry={GEO.sphere}
              material={mat(plant.color, { flat: false })}
              position={p}
              scale={bloomR * (1 - i * 0.08)}
            />
          ))}
        </>
      )}
    </group>
  );
}

import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick, Segment, type Vec3 } from '../kit';

import type { FormProps } from './types';

const CULM = '#9E9D24';

/** Clump of blades (lemongrass, makka); very tall ones become bamboo culms. */
export function GrassForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;
  const bamboo = H > 10;

  const model = useMemo(() => {
    const rng = createRng(seed);
    const count = bamboo ? 9 : 26;
    const blades = Array.from({ length: count }, (): { base: Vec3; top: Vec3; color: string } => {
      const a = rng() * Math.PI * 2;
      const r0 = W * between(rng, 0, 0.12);
      const r1 = W * between(rng, 0.2, 0.5);
      return {
        base: [Math.cos(a) * r0, 0, Math.sin(a) * r0],
        top: [Math.cos(a) * r1, H * between(rng, 0.7, 1), Math.sin(a) * r1],
        color: pick(rng, PALETTE.leaf),
      };
    });
    return { blades };
  }, [H, W, seed, bamboo]);

  const bladeR = bamboo ? Math.max(0.1, H * 0.008) : Math.max(0.02, H * 0.012);
  const isCorn = plant.category === 'vegetable' && !bamboo;
  const cobR = Math.max(0.12, H * 0.025);

  return (
    <group>
      {model.blades.map((b, i) => (
        <group key={i}>
          <Segment
            from={b.base}
            to={b.top}
            radius={bladeR}
            material={mat(bamboo ? CULM : b.color)}
            taper
          />
          {bamboo && (
            <mesh geometry={GEO.blob} material={mat(b.color)} position={b.top} scale={W * 0.12} />
          )}
        </group>
      ))}
      {isCorn &&
        [0, 1].map((i) => (
          <mesh
            key={i}
            geometry={GEO.sphere}
            material={mat(plant.color, { flat: false })}
            position={[i === 0 ? 0.15 : -0.15, H * (0.45 + i * 0.1), 0]}
            scale={[cobR, cobR * 2.6, cobR]}
          />
        ))}
    </group>
  );
}

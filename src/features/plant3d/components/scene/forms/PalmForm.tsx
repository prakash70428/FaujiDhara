import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick, Segment, type Vec3 } from '../kit';

import type { FormProps } from './types';

/** Single trunk with a crown of arching fronds (nariyal, khajoor, kela, papita). */
export function PalmForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;

  const model = useMemo(() => {
    const rng = createRng(seed);
    const trunkTop: Vec3 = [W * 0.04, H * 0.8, 0];
    const frondLen = W / 2;
    const fronds = Array.from({ length: 12 }, (_, i) => ({
      yaw: (i / 12) * Math.PI * 2 + between(rng, -0.15, 0.15),
      droop: between(rng, 0.15, 0.85),
      color: pick(rng, PALETTE.leaf),
    }));
    const fruitR = Math.max(0.15, W * 0.05);
    const fruits = Array.from({ length: 7 }, (_, i): Vec3 => {
      const a = (i / 7) * Math.PI * 2;
      return [
        trunkTop[0] + Math.cos(a) * fruitR * 1.6,
        trunkTop[1] - fruitR * between(rng, 0.8, 2.2),
        Math.sin(a) * fruitR * 1.6,
      ];
    });
    return { trunkTop, frondLen, fronds, fruitR, fruits };
  }, [H, W, seed]);

  const trunkR = Math.max(0.12, H * 0.022);

  return (
    <group>
      <Segment
        from={[0, 0, 0]}
        to={model.trunkTop}
        radius={trunkR}
        material={mat(PALETTE.bark)}
        taper
      />
      <group position={model.trunkTop}>
        {model.fronds.map((f, i) => (
          <group key={i} rotation={[0, f.yaw, 0]}>
            <group rotation={[0, 0, -f.droop]}>
              <mesh
                geometry={GEO.blob}
                material={mat(f.color)}
                position={[model.frondLen / 2, 0, 0]}
                scale={[model.frondLen / 2, model.frondLen * 0.03 + 0.02, model.frondLen * 0.14]}
              />
            </group>
          </group>
        ))}
      </group>
      {model.fruits.map((p, i) => (
        <mesh
          key={i}
          geometry={GEO.sphere}
          material={mat(plant.color, { flat: false })}
          position={p}
          scale={model.fruitR}
        />
      ))}
    </group>
  );
}

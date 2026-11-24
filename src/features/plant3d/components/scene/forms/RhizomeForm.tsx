import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick, Segment, type Vec3 } from '../kit';

import type { FormProps } from './types';

/** Leafy pseudo-stems above, and the knobby horizontal rhizome just under the soil (adrak, haldi, elaichi). */
export function RhizomeForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W, rootSpread: RW } = size;

  const model = useMemo(() => {
    const rng = createRng(seed);
    const stems = Array.from(
      { length: 6 },
      (): { base: Vec3; top: Vec3; leafA: number; color: string } => {
        const a = rng() * Math.PI * 2;
        const r = W * between(rng, 0.05, 0.2);
        const base: Vec3 = [Math.cos(a) * r, 0, Math.sin(a) * r];
        return {
          base,
          top: [base[0] * 1.6, H * between(rng, 0.45, 0.65), base[2] * 1.6],
          leafA: a,
          color: pick(rng, PALETTE.leaf),
        };
      },
    );
    const knobs = Array.from({ length: 7 }, (_, i): Vec3 => {
      const x = -RW * 0.4 + (i / 6) * RW * 0.8;
      return [x, -between(rng, 0.12, 0.3), between(rng, -RW * 0.15, RW * 0.15)];
    });
    return { stems, knobs };
  }, [H, W, RW, seed]);

  const stemR = Math.max(0.02, W * 0.035);
  const leafLen = Math.max(0.3, H * 0.45);
  const knobR = Math.max(0.06, Math.min(RW * 0.1, 0.3));

  return (
    <group>
      {model.stems.map((s, i) => (
        <group key={i}>
          <Segment from={s.base} to={s.top} radius={stemR} material={mat(PALETTE.stem)} taper />
          <group position={s.top} rotation={[0, -s.leafA, 0.35]}>
            <mesh
              geometry={GEO.blob}
              material={mat(s.color)}
              position={[0, leafLen / 2, 0]}
              scale={[leafLen * 0.14, leafLen / 2, 0.03]}
            />
          </group>
        </group>
      ))}
      {model.knobs.map((p, i) => (
        <mesh
          key={i}
          geometry={GEO.blob}
          material={mat(plant.color)}
          position={p}
          scale={[knobR * 1.4, knobR, knobR]}
        />
      ))}
    </group>
  );
}

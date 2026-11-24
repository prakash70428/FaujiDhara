import { useMemo } from 'react';

import { between, createRng } from '../../../domain/random';
import { GEO, mat, PALETTE, pick, Segment, type Vec3 } from '../kit';

import type { FormProps } from './types';

const POST = '#8D6E63';

type Support = 'pole' | 'machaan' | 'ground';

/**
 * Climbers are drawn the way Indian farms actually grow them:
 *  - pole: tall + narrow (kali mirch on a tree, matar, sem) — leaves spiral up a support
 *  - machaan: square overhead pandal on 4 posts (lauki, karela, angoor, kiwi)
 *  - ground: low creepers spread on the soil (kaddu, tarbooz, shakarkandi)
 */
function supportFor(H: number, W: number): Support {
  if (H < 2.5) return 'ground';
  if (H > W * 1.5) return 'pole';
  return 'machaan';
}

export function VineForm({ plant, size, seed }: FormProps) {
  const { height: H, spread: W } = size;
  const support = supportFor(H, W);

  const model = useMemo(() => {
    const rng = createRng(seed);
    const leafR = Math.max(0.12, Math.min(W, Math.max(H, 2)) * 0.07);
    const leaves: { p: Vec3; color: string }[] = [];
    const fruits: Vec3[] = [];
    const half = W / 2;

    if (support === 'pole') {
      for (let i = 0; i < 18; i++) {
        const t = i / 17;
        const a = t * Math.PI * 7;
        const r = half * between(rng, 0.5, 1);
        leaves.push({
          p: [Math.cos(a) * r, H * t, Math.sin(a) * r],
          color: pick(rng, PALETTE.leaf),
        });
      }
      for (let i = 0; i < 6; i++) {
        const a = rng() * Math.PI * 2;
        fruits.push([
          Math.cos(a) * half * 0.8,
          H * between(rng, 0.3, 0.9),
          Math.sin(a) * half * 0.8,
        ]);
      }
    } else if (support === 'machaan') {
      // Leaves cover the pandal roof, plus a few climbing the central stem.
      const n = Math.min(40, Math.max(14, Math.round(W * W * 0.4)));
      for (let i = 0; i < n; i++) {
        leaves.push({
          p: [between(rng, -half, half), H + between(rng, -0.1, 0.3), between(rng, -half, half)],
          color: pick(rng, PALETTE.leaf),
        });
      }
      for (let i = 0; i < 5; i++) {
        leaves.push({
          p: [between(rng, -0.3, 0.3), (H * (i + 0.5)) / 5, between(rng, -0.3, 0.3)],
          color: pick(rng, PALETTE.leaf),
        });
      }
      for (let i = 0; i < 9; i++) {
        fruits.push([
          between(rng, -half * 0.8, half * 0.8),
          H - leafR * between(rng, 1.6, 3),
          between(rng, -half * 0.8, half * 0.8),
        ]);
      }
    } else {
      for (let i = 0; i < 22; i++) {
        const a = rng() * Math.PI * 2;
        const r = Math.sqrt(rng()) * W * 0.48;
        leaves.push({
          p: [Math.cos(a) * r, H * between(rng, 0.25, 0.6), Math.sin(a) * r],
          color: pick(rng, PALETTE.leaf),
        });
      }
      for (let i = 0; i < 4; i++) {
        const a = rng() * Math.PI * 2;
        const r = between(rng, 0.2, 0.4) * W;
        fruits.push([Math.cos(a) * r, 0, Math.sin(a) * r]);
      }
    }
    return { leafR, leaves, fruits };
  }, [H, W, seed, support]);

  const fruitR =
    support === 'ground'
      ? Math.max(0.15, Math.min(W * 0.045, 0.7))
      : Math.max(0.08, Math.min(W * 0.03, 0.35));
  const postR = Math.max(0.04, H * 0.012);
  const h = W / 2;
  const corners: Vec3[] = [
    [-h, 0, -h],
    [h, 0, -h],
    [h, 0, h],
    [-h, 0, h],
  ];
  const postMat = mat(POST);

  return (
    <group>
      {support === 'pole' && (
        <Segment
          from={[0, 0, 0]}
          to={[0, H, 0]}
          radius={Math.max(0.06, W * 0.06)}
          material={postMat}
        />
      )}
      {support === 'machaan' && (
        <>
          {corners.map((c, i) => {
            const next = corners[(i + 1) % 4]!;
            return (
              <group key={i}>
                <Segment from={c} to={[c[0], H, c[2]]} radius={postR} material={postMat} />
                <Segment
                  from={[c[0], H, c[2]]}
                  to={[next[0], H, next[2]]}
                  radius={postR * 0.5}
                  material={postMat}
                />
              </group>
            );
          })}
          <Segment
            from={[0, 0, 0]}
            to={[0, H, 0]}
            radius={postR * 0.5}
            material={mat(PALETTE.stem)}
          />
        </>
      )}
      {model.leaves.map((l, i) => (
        <mesh
          key={i}
          geometry={GEO.blob}
          material={mat(l.color)}
          position={l.p}
          scale={
            support === 'ground'
              ? [model.leafR * 1.4, model.leafR * 0.45, model.leafR * 1.4]
              : support === 'machaan'
                ? [model.leafR * 1.3, model.leafR * 0.5, model.leafR * 1.3]
                : model.leafR
          }
        />
      ))}
      {model.fruits.map((p, i) => (
        <mesh
          key={i}
          geometry={GEO.sphere}
          material={mat(plant.color, { flat: false })}
          position={support === 'ground' ? [p[0], fruitR * 0.8, p[2]] : p}
          scale={
            support === 'ground'
              ? [fruitR * 1.2, fruitR, fruitR * 1.2]
              : [fruitR, fruitR * 2.2, fruitR]
          }
        />
      ))}
    </group>
  );
}

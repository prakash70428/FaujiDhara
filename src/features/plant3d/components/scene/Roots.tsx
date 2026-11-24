import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import type { Plant } from '@/features/crops/domain/types';

import { between, createRng, type Rng } from '../../domain/random';
import type { SceneSize } from '../../domain/sceneLayout';

import { GEO, mat, PALETTE } from './kit';

type V = THREE.Vector3;
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function tube(points: V[], radius: number): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, 10, radius, 5, false);
}

/** One root wandering outward and downward to (endRadius, endDepth). */
function wanderingRoot(rng: Rng, start: V, endRadius: number, endDepth: number, radius: number) {
  const a = rng() * Math.PI * 2;
  const pts: V[] = [start];
  for (let i = 1; i <= 3; i++) {
    const t = i / 3;
    const r = endRadius * t * between(rng, 0.85, 1.1);
    const wob = between(rng, -0.25, 0.25);
    pts.push(
      v(Math.cos(a + wob) * r, start.y - endDepth * Math.pow(t, 0.9), Math.sin(a + wob) * r),
    );
  }
  return tube(pts, radius);
}

/**
 * Builds every root tube for the plant and MERGES them into one geometry:
 * 25 roots = 1 draw call, which keeps the GPU cost tiny.
 */
function buildRoots(plant: Plant, size: SceneSize, seed: number): THREE.BufferGeometry | null {
  const rng = createRng(seed + 7);
  const D = Math.max(0.15, size.rootDepth);
  const R = Math.max(0.15, size.rootSpread / 2);
  // Thickness scales with the whole root zone, so roots read clearly on a herb and on a tree.
  const thick = Math.max(0.015, (D + R) * 0.011);
  const parts: THREE.BufferGeometry[] = [];

  // Root crops grow fine roots from the bottom of the storage root.
  const startY =
    plant.form === 'root' ? -Math.max(D * 0.45, 0.1) : plant.form === 'bulb' ? -0.1 : 0;

  // How much depth is left below the starting point (never less than 30% of the root zone).
  const span = Math.max(D + startY, D * 0.3);

  if (plant.roots.type === 'taproot') {
    const main = [
      v(0, startY, 0),
      v(R * 0.05, startY - span * 0.35, 0),
      v(-R * 0.05, startY - span * 0.7, R * 0.04),
      v(0, startY - span, 0),
    ];
    parts.push(tube(main, thick * 2.4));
    for (let i = 0; i < 9; i++) {
      const drop = span * between(rng, 0.1, 0.75);
      parts.push(
        wanderingRoot(
          rng,
          v(0, startY - drop, 0),
          R * between(rng, 0.5, 1),
          (span - drop) * between(rng, 0.3, 0.6),
          thick,
        ),
      );
    }
  } else {
    const count = plant.roots.type === 'fibrous' ? 24 : 16;
    for (let i = 0; i < count; i++) {
      const start = v(between(rng, -0.05, 0.05) * R, startY, between(rng, -0.05, 0.05) * R);
      parts.push(
        wanderingRoot(rng, start, R * between(rng, 0.35, 1), span * between(rng, 0.5, 1), thick),
      );
    }
  }

  if (parts.length === 0) return null;
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return merged;
}

type RootsProps = { plant: Plant; size: SceneSize; seed: number };

export function Roots({ plant, size, seed }: RootsProps) {
  const geometry = useMemo(() => buildRoots(plant, size, seed), [plant, size, seed]);

  // We built this geometry by hand, so we free its GPU memory ourselves.
  useEffect(() => () => geometry?.dispose(), [geometry]);

  const tubers = useMemo(() => {
    if (plant.roots.type !== 'tuberous') return [];
    const rng = createRng(seed + 13);
    const D = size.rootDepth;
    const R = size.rootSpread / 2;
    const s = Math.max(0.08, Math.min(D * 0.16, 0.45));
    return Array.from({ length: 5 }, () => {
      const a = rng() * Math.PI * 2;
      const r = R * between(rng, 0.15, 0.7);
      return { p: [Math.cos(a) * r, -D * between(rng, 0.25, 0.6), Math.sin(a) * r] as const, s };
    });
  }, [plant.roots.type, size.rootDepth, size.rootSpread, seed]);

  const tuberColor = plant.category === 'vegetable' ? plant.color : '#A1887F';

  return (
    <group>
      {geometry && (
        <mesh geometry={geometry} material={mat(PALETTE.root, { flat: false, emissive: 0.15 })} />
      )}
      {tubers.map((t, i) => (
        <mesh
          key={i}
          geometry={GEO.sphere}
          material={mat(tuberColor, { flat: false })}
          position={[...t.p]}
          scale={[t.s * 1.3, t.s, t.s]}
        />
      ))}
    </group>
  );
}

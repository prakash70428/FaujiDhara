import * as THREE from 'three';

/**
 * Shared building blocks for every plant model.
 *
 * Performance: geometries and materials are created ONCE and reused by all meshes.
 * 50 leaves share 1 geometry + 1 material instead of 50 + 50 — that is the
 * difference between smooth and choppy on a mid-range Android GPU.
 */
export const GEO = {
  blob: new THREE.IcosahedronGeometry(1, 1), // low-poly leaf cluster
  sphere: new THREE.SphereGeometry(1, 12, 10),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 8),
  taper: new THREE.CylinderGeometry(0.55, 1, 1, 8), // trunks, stems
  cone: new THREE.ConeGeometry(1, 1, 10),
  box: new THREE.BoxGeometry(1, 1, 1),
};

type MatOptions = { flat?: boolean; opacity?: number; overlay?: boolean; emissive?: number };

const cache = new Map<string, THREE.MeshStandardMaterial>();

/** Cached material per color + options. Never disposed: there are only a few dozen. */
export function mat(color: string, opts: MatOptions = {}): THREE.MeshStandardMaterial {
  const { flat = true, opacity = 1, overlay = false, emissive = 0 } = opts;
  const key = `${color}|${flat}|${opacity}|${overlay}|${emissive}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      flatShading: flat,
      roughness: 0.82,
      metalness: 0.02,
      transparent: opacity < 1,
      opacity,
      // Overlays (dimension lines) draw on top of everything, like CAD annotations.
      depthTest: !overlay,
      depthWrite: opacity >= 1 && !overlay,
      emissive: new THREE.Color(color),
      emissiveIntensity: overlay ? 0.6 : emissive,
    });
    cache.set(key, m);
  }
  return m;
}

export const PALETTE = {
  leaf: ['#4E8F3A', '#3B7A2A', '#5FA347', '#447F34'],
  bark: '#6D4C3A',
  stem: '#5B8C3A',
  root: '#F1DEB8',
} as const;

export type Vec3 = [number, number, number];

const UP = new THREE.Vector3(0, 1, 0);

/** A cylinder stretched between two points: trunks, stems, posts, dimension lines. */
export function Segment({
  from,
  to,
  radius,
  material,
  taper = false,
  renderOrder,
}: {
  from: Vec3;
  to: Vec3;
  radius: number;
  material: THREE.Material;
  taper?: boolean;
  renderOrder?: number;
}) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const dir = b.clone().sub(a);
  const length = Math.max(dir.length(), 1e-4);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  const position = a.add(b).multiplyScalar(0.5);

  return (
    <mesh
      geometry={taper ? GEO.taper : GEO.cylinder}
      material={material}
      position={position}
      quaternion={quaternion}
      scale={[radius, length, radius]}
      renderOrder={renderOrder}
    />
  );
}

/** Point on an ellipsoid surface for a random direction — used to place fruits and flowers. */
export function onEllipsoid(rng: () => number, center: Vec3, r: Vec3, minY = -1): Vec3 {
  const theta = rng() * Math.PI * 2;
  const y = minY + rng() * (1 - minY); // -1..1, cut at minY so fruit sits on the visible part
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  return [
    center[0] + Math.cos(theta) * ring * r[0],
    center[1] + y * r[1],
    center[2] + Math.sin(theta) * ring * r[2],
  ];
}

export const pick = <T,>(rng: () => number, list: readonly T[]): T =>
  list[Math.floor(rng() * list.length)] as T;

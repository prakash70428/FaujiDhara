import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

import { GEO, mat } from './kit';

const TOPSOIL = '#6B4A2F';
const SUBSOIL = '#A07D55';
const GRASS = '#7CB342';
const FIELD = '#B9D59A';
const EDGE = '#4E342E';

type SoilBlockProps = {
  /** Square footprint, ft. */
  width: number;
  /** Depth below the ground line (y = 0), ft. */
  depth: number;
  /** X-ray: soil almost invisible so the roots stand out. */
  xray: boolean;
};

/**
 * A cut-out cube of earth under the plant: dark topsoil over lighter subsoil,
 * a thin grass line at y = 0 that separates "zameen ke upar" from "zameen ke neeche".
 */
export function SoilBlock({ width, depth, xray }: SoilBlockProps) {
  const top = Math.min(depth * 0.3, 1.5);
  const sub = Math.max(depth - top, 0.05);

  // Box outline for the CAD look. Built once per size and freed on change.
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(width, depth, width)),
    [width, depth],
  );
  useEffect(() => () => edges.dispose(), [edges]);

  const o = (normal: number, ray: number) => (xray ? ray : normal);

  return (
    <group>
      {/* Field around the block, so the plant sits in a landscape, not in a void. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.002, 0]}
        scale={[width * 3.2, width * 3.2, 1]}
      >
        <circleGeometry args={[0.5, 48]} />
        <meshStandardMaterial
          color={FIELD}
          transparent
          opacity={o(0.55, 0.25)}
          depthWrite={false}
        />
      </mesh>
      <mesh
        geometry={GEO.box}
        material={mat(GRASS, { opacity: o(0.5, 0.15) })}
        position={[0, -0.01, 0]}
        scale={[width, 0.04, width]}
      />
      <mesh
        geometry={GEO.box}
        material={mat(TOPSOIL, { opacity: o(0.5, 0.1) })}
        position={[0, -top / 2, 0]}
        scale={[width, top, width]}
      />
      <mesh
        geometry={GEO.box}
        material={mat(SUBSOIL, { opacity: o(0.38, 0.06) })}
        position={[0, -top - sub / 2, 0]}
        scale={[width, sub, width]}
      />
      <lineSegments geometry={edges} position={[0, -depth / 2, 0]}>
        <lineBasicMaterial color={EDGE} transparent opacity={xray ? 0.8 : 0.5} />
      </lineSegments>
    </group>
  );
}

import { mid, type PlantDimensions } from '@/features/crops/domain/growth';

/** Scene units are feet: 1 unit = 1 ft, so the model is drawn to real proportions. */
export type SceneSize = {
  /** Above-ground height. */
  height: number;
  /** Canopy/spread width. */
  spread: number;
  rootDepth: number;
  rootSpread: number;
};

export function toSceneSize(d: PlantDimensions): SceneSize {
  return {
    height: mid(d.height),
    spread: mid(d.spread),
    rootDepth: mid(d.rootDepth),
    rootSpread: mid(d.rootSpread),
  };
}

export const HUMAN_HEIGHT_FT = 5.5;

/** Colors shared by the 3D lines and the legend, so a user can match them at a glance. */
export const DIMENSION_COLORS = {
  height: '#43A047',
  spread: '#FB8C00',
  rootDepth: '#1E88E5',
  rootSpread: '#8E24AA',
} as const;

export type Framing = {
  /** Point the camera orbits around. */
  target: [number, number, number];
  /** Camera distance that fits the whole plant + roots on screen. */
  distance: number;
  /** Soil block footprint (square, ft) and depth. */
  soilWidth: number;
  soilDepth: number;
  /** Line thickness scaled to the scene, so lines look the same on a herb and a tree. */
  lineRadius: number;
};

const FOV_DEG = 40;

/**
 * Framing is computed from the MATURE size, not the current stage,
 * so the camera and soil stay still while the plant grows inside them.
 *
 * `aspect` = canvas width / height. The camera FOV is vertical, so on a tall, narrow
 * phone screen the horizontal view is much smaller. We fit the scene in BOTH directions
 * and keep whichever needs the camera farther away — so nothing is cut on any screen.
 */
export function frameScene(mature: SceneSize, showHuman: boolean, aspect = 1): Framing {
  const top = Math.max(mature.height, showHuman ? HUMAN_HEIGHT_FT : 0);
  const width = Math.max(mature.spread, mature.rootSpread, showHuman ? mature.spread + 4 : 0);
  const totalHeight = top + mature.rootDepth;
  const size = Math.max(totalHeight, width, 1.5);

  const halfFovV = ((FOV_DEG / 2) * Math.PI) / 180;
  const halfFovH = Math.atan(Math.tan(halfFovV) * Math.max(aspect, 0.1));
  const fitV = size / 2 / Math.tan(halfFovV);
  const fitH = size / 2 / Math.tan(halfFovH);
  // 1.6 = breathing room for the dimension lines and arrowheads around the plant.
  const distance = Math.max(fitV, fitH) * 1.6;

  return {
    target: [0, (top - mature.rootDepth) / 2, 0],
    distance,
    soilWidth: Math.max(mature.spread, mature.rootSpread, 1) * 1.35,
    soilDepth: mature.rootDepth * 1.2 + size * 0.04,
    lineRadius: size * 0.0045,
  };
}

export const CAMERA_FOV = FOV_DEG;

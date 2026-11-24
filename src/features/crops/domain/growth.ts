import type { Plant, RangeFt } from './types';

/**
 * Growth stages shown in the stage selector.
 * Perennials grow over years (1 / 3 / 5 saal / poora), seasonal crops over weeks.
 */
export type GrowthStage = {
  key: string;
  label: string;
  /** 0..1 share of mature size above the ground. */
  aboveFactor: number;
  /** 0..1 share of mature root size. Roots run ahead of the shoot early in life. */
  rootFactor: number;
};

const SEASONAL_STAGES: readonly GrowthStage[] = [
  { key: 'seedling', label: 'Paudh', aboveFactor: 0.18, rootFactor: 0.3 },
  { key: 'vegetative', label: 'Badhvar', aboveFactor: 0.55, rootFactor: 0.7 },
  { key: 'flowering', label: 'Phool', aboveFactor: 0.85, rootFactor: 0.92 },
  { key: 'harvest', label: 'Fasal taiyar', aboveFactor: 1, rootFactor: 1 },
];

const MIN_FACTOR = 0.12;

/** Share of mature size after `years`, with a soft curve (fast early, slow later). */
function perennialFactor(years: number, yearsToMature: number): number {
  const t = Math.min(1, years / Math.max(1, yearsToMature));
  return Math.max(MIN_FACTOR, Math.pow(t, 0.75));
}

export function stagesFor(plant: Plant): readonly GrowthStage[] {
  if (plant.lifecycle !== 'perennial' || !plant.yearsToMature) return SEASONAL_STAGES;

  const ytm = plant.yearsToMature;
  const yearStages = [1, 3, 5]
    .filter((y) => y < ytm)
    .map((y) => {
      const f = perennialFactor(y, ytm);
      return {
        key: `y${y}`,
        label: `${y} saal`,
        aboveFactor: f,
        rootFactor: Math.min(1, f * 1.15),
      };
    });

  return [
    ...yearStages,
    { key: 'mature', label: `Poora (${ytm}+ saal)`, aboveFactor: 1, rootFactor: 1 },
  ];
}

export function scaleRange([min, max]: RangeFt, factor: number): RangeFt {
  return [min * factor, max * factor];
}

/** Plant dimensions at a given stage. */
export function dimensionsAt(plant: Plant, stage: GrowthStage) {
  return {
    height: scaleRange(plant.above.height, stage.aboveFactor),
    spread: scaleRange(plant.above.spread, stage.aboveFactor),
    rootDepth: scaleRange(plant.roots.depth, stage.rootFactor),
    rootSpread: scaleRange(plant.roots.spread, stage.rootFactor),
  };
}

export type PlantDimensions = ReturnType<typeof dimensionsAt>;

/** Middle of a range: the single number the 3D model is drawn at. */
export function mid([min, max]: RangeFt): number {
  return (min + max) / 2;
}

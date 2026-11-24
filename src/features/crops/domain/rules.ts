import type { Month, Plant, Terrain } from './types';

/** Hills often sow on a different calendar (e.g. potato in March, not October). */
export function sowMonthsFor(plant: Plant, terrain: Terrain): readonly Month[] {
  return terrain === 'hills' && plant.sowHills ? plant.sowHills : plant.sow;
}

export function isSowingMonth(plant: Plant, month: Month, terrain: Terrain): boolean {
  return sowMonthsFor(plant, terrain).includes(month);
}

export function currentMonth(date = new Date()): Month {
  return (date.getMonth() + 1) as Month;
}

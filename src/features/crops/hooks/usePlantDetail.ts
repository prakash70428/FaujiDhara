import { useMemo } from 'react';

import { PLANTS_BY_ID } from '../data/plants';
import { cropRepository } from '../data/cropRepository';
import { sowMonthsFor } from '../domain/rules';
import type { Plant, Terrain } from '../domain/types';

export type PlantLink = { plant: Plant; why: string };

/** Plant + resolved companion/avoid plants, and sowing months for the state's terrain. */
export function usePlantDetail(plantId: string, stateId?: string) {
  return useMemo(() => {
    const plant = cropRepository.getPlant(plantId);
    const terrain: Terrain = stateId ? cropRepository.getState(stateId).terrain : 'plains';

    const resolve = (links: Plant['companions']): PlantLink[] =>
      links.flatMap(({ id, why }) => {
        const linked = PLANTS_BY_ID.get(id);
        return linked ? [{ plant: linked, why }] : [];
      });

    return {
      plant,
      terrain,
      sowMonths: sowMonthsFor(plant, terrain),
      companions: resolve(plant.companions),
      avoid: resolve(plant.avoid),
    };
  }, [plantId, stateId]);
}

import { useMemo } from 'react';

import { cropRepository } from '../data/cropRepository';
import { currentMonth, isSowingMonth } from '../domain/rules';
import type { PlantCategory } from '../domain/types';

/**
 * Everything the state screen needs: the state, the plants of the chosen category,
 * and which of them can be sown this month (for the badge and the filter).
 */
export function useStateCrops(stateId: string, category: PlantCategory, onlySowNow: boolean) {
  const state = useMemo(() => cropRepository.getState(stateId), [stateId]);
  const month = currentMonth();

  const all = useMemo(() => cropRepository.getStatePlants(stateId, category), [stateId, category]);

  const items = useMemo(
    () =>
      all
        .map((plant) => ({ plant, sowNow: isSowingMonth(plant, month, state.terrain) }))
        .filter((item) => !onlySowNow || item.sowNow),
    [all, month, state.terrain, onlySowNow],
  );

  return { state, items, month };
}

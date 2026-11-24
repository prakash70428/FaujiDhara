import { AppError } from '@/core/errors';

import type { IndianState, Plant, PlantCategory } from '../domain/types';

import { PLANTS_BY_ID } from './plants';
import { STATES } from './states';

/**
 * The only door to crop data. Today the data ships inside the app (works offline);
 * later this file can fetch from Supabase and no screen has to change.
 */
const STATES_BY_ID = new Map(STATES.map((s) => [s.id, s]));

const byName = (a: IndianState, b: IndianState) => a.name.localeCompare(b.name);

export const cropRepository = {
  /** 28 states and 8 UTs, each group sorted A→Z. */
  listStates(): { states: IndianState[]; uts: IndianState[] } {
    return {
      states: STATES.filter((s) => s.kind === 'state').sort(byName),
      uts: STATES.filter((s) => s.kind === 'ut').sort(byName),
    };
  },

  getState(id: string): IndianState {
    const state = STATES_BY_ID.get(id);
    if (!state) throw new AppError('NOT_FOUND', `State not found: ${id}`);
    return state;
  },

  getPlant(id: string): Plant {
    const plant = PLANTS_BY_ID.get(id);
    if (!plant) throw new AppError('NOT_FOUND', `Plant not found: ${id}`);
    return plant;
  },

  /** Plants of one category for a state, in the curated order. */
  getStatePlants(stateId: string, category: PlantCategory): Plant[] {
    return this.getState(stateId).crops[category].map((id) => this.getPlant(id));
  },
};

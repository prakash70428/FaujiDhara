import type { Plant } from '../../domain/types';

import { FLOWERS } from './flowers';
import { FRUITS } from './fruits';
import { SPICES } from './spices';
import { VEGETABLES } from './vegetables';

export const ALL_PLANTS: readonly Plant[] = [...VEGETABLES, ...FRUITS, ...FLOWERS, ...SPICES];

/** id → plant, built once. O(1) lookups for screens and companion links. */
export const PLANTS_BY_ID: ReadonlyMap<string, Plant> = new Map(ALL_PLANTS.map((p) => [p.id, p]));

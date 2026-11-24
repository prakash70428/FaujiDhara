import type { Plant } from '@/features/crops/domain/types';

import type { SceneSize } from '../../../domain/sceneLayout';

/** Every form (tree, palm, herb...) gets the same input, so PlantBody can swap them freely. */
export type FormProps = {
  plant: Plant;
  size: SceneSize;
  seed: number;
};

/** Plants where the leaf itself is the crop: no colored fruit/flower dots on the model. */
const LEAF_CROPS = new Set([
  'spinach',
  'methi',
  'amaranth',
  'mustard-greens',
  'bathua',
  'lettuce',
  'gongura',
  'curry-leaf',
  'mint',
  'bay-leaf',
  'lemongrass',
]);

export function showsProduce(plant: Plant): boolean {
  return !LEAF_CROPS.has(plant.id);
}

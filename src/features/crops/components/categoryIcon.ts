import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import type { PlantCategory } from '../domain/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** "nutrition" (fruit-veg icon) for sabzi, "flame" for masala ki garmi. */
export const CATEGORY_ICON: Record<PlantCategory, IconName> = {
  vegetable: 'nutrition',
  fruit: 'basket',
  flower: 'flower',
  spice: 'flame',
};

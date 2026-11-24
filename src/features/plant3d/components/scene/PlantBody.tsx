import type { ComponentType } from 'react';

import type { PlantForm } from '@/features/crops/domain/types';

import { BulbForm } from './forms/BulbForm';
import { GrassForm } from './forms/GrassForm';
import { HerbForm } from './forms/HerbForm';
import { PalmForm } from './forms/PalmForm';
import { RhizomeForm } from './forms/RhizomeForm';
import { RootCropForm } from './forms/RootCropForm';
import { ShrubForm } from './forms/ShrubForm';
import { TreeForm } from './forms/TreeForm';
import type { FormProps } from './forms/types';
import { VineForm } from './forms/VineForm';

/**
 * Form → 3D component. `Record<PlantForm, ...>` makes TypeScript fail the build
 * if someone adds a new form to the domain and forgets its model.
 *
 * Future: when a real .glb model exists for a plant, check for it here first
 * and fall back to the procedural form.
 */
const FORMS: Record<PlantForm, ComponentType<FormProps>> = {
  tree: TreeForm,
  palm: PalmForm,
  shrub: ShrubForm,
  herb: HerbForm,
  vine: VineForm,
  root: RootCropForm,
  bulb: BulbForm,
  rhizome: RhizomeForm,
  grass: GrassForm,
};

export function PlantBody(props: FormProps) {
  const Form = FORMS[props.plant.form];
  return <Form {...props} />;
}

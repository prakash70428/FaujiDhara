import type {
  Level,
  Lifecycle,
  Month,
  Plant,
  PlantCategory,
  PlantForm,
  RangeFt,
  RootType,
  Season,
} from '../../domain/types';

/**
 * Short field names keep 190+ plant entries readable, one block per plant.
 * All sizes are in feet: h/w = height/spread above ground, rd/rw = root depth/spread.
 */
export type PlantInput = {
  id: string;
  name: string;
  hi: string;
  sci: string;
  form: PlantForm;
  life: Lifecycle;
  h: RangeFt;
  w: RangeFt;
  rd: RangeFt;
  rw: RangeFt;
  rt: RootType;
  seasons: Season[];
  sow: Month[];
  sowHills?: Month[];
  harvest: string;
  ytm?: number;
  water: Level;
  sun: Plant['sun'];
  soil: string;
  color: string;
  /** [plantId, kyun] */
  pair?: [string, string][];
  avoid?: [string, string][];
  tip: string;
};

const ALL_YEAR: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export { ALL_YEAR };

export function definePlants(category: PlantCategory, inputs: PlantInput[]): Plant[] {
  return inputs.map((i) => ({
    id: i.id,
    category,
    name: i.name,
    nameHi: i.hi,
    scientific: i.sci,
    form: i.form,
    lifecycle: i.life,
    above: { height: i.h, spread: i.w },
    roots: { depth: i.rd, spread: i.rw, type: i.rt },
    seasons: i.seasons,
    sow: i.sow,
    sowHills: i.sowHills,
    harvest: i.harvest,
    yearsToMature: i.ytm,
    water: i.water,
    sun: i.sun,
    soil: i.soil,
    color: i.color,
    companions: (i.pair ?? []).map(([id, why]) => ({ id, why })),
    avoid: (i.avoid ?? []).map(([id, why]) => ({ id, why })),
    tip: i.tip,
  }));
}

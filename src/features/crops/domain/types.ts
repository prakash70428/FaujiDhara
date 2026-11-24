/**
 * Crop domain types. Pure TypeScript: no React, no Supabase, no 3D.
 * Both the Fasal screens and the 3D viewer read these shapes.
 */

export type PlantCategory = 'vegetable' | 'fruit' | 'flower' | 'spice';

/**
 * Body shape of the plant. The 3D viewer picks a model per form,
 * so adding a new plant never needs new 3D code, just the right form.
 */
export type PlantForm =
  | 'tree' // aam, amrood, imli
  | 'palm' // nariyal, khajoor
  | 'shrub' // gulab, anar, mirch
  | 'herb' // dhaniya, palak, genda
  | 'vine' // lauki, angoor, kali mirch (trellis/support pe)
  | 'root' // gajar, mooli, chukandar (khane wala hissa zameen ke andar)
  | 'bulb' // pyaz, lahsun, kesar, tulip
  | 'rhizome' // adrak, haldi
  | 'grass'; // lemongrass, makka, baans

export type RootType = 'taproot' | 'fibrous' | 'tuberous' | 'rhizome' | 'bulb';

export type Lifecycle = 'annual' | 'biennial' | 'perennial';

export type Season = 'rabi' | 'kharif' | 'zaid' | 'perennial';

export type Level = 'low' | 'medium' | 'high';

/** [min, max] in feet. A range, because real plants vary with variety, soil and care. */
export type RangeFt = readonly [number, number];

/** 1 = January ... 12 = December */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Companion = {
  id: string;
  /** Kyun saath mein achha hai (short, Hinglish). */
  why: string;
};

export type Plant = {
  id: string;
  category: PlantCategory;
  name: string; // English
  nameHi: string; // Hindi (Roman), e.g. "Bhindi"
  scientific: string;
  form: PlantForm;
  lifecycle: Lifecycle;
  /** Mature plant size above the ground. */
  above: { height: RangeFt; spread: RangeFt };
  /** Effective root zone below the ground (where most feeder roots are). */
  roots: { depth: RangeFt; spread: RangeFt; type: RootType };
  seasons: readonly Season[];
  /** Sowing/planting months for the plains. */
  sow: readonly Month[];
  /** Different sowing months in the hills, if any. */
  sowHills?: readonly Month[];
  /** e.g. "60–70 din" or "3–4 saal mein phal". */
  harvest: string;
  /** Perennials only: years until full size. Used for the 1/3/5 year growth stages. */
  yearsToMature?: number;
  water: Level;
  sun: 'full' | 'partial' | 'shade';
  soil: string;
  /** Signature color of the fruit/flower/produce for the 3D model and cards. */
  color: string;
  companions: readonly Companion[];
  avoid: readonly Companion[];
  /** Field-experience advice (Hinglish). */
  tip: string;
};

export type StateKind = 'state' | 'ut';

export type Terrain = 'plains' | 'hills' | 'islands';

export type IndianState = {
  id: string;
  name: string;
  nameHi: string;
  kind: StateKind;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | 'Islands';
  terrain: Terrain;
  /** One line on the farming character of the state. */
  about: string;
  /** Exactly 15 plant ids per category. A plant may appear in another category's list
   *  (e.g. methi is a vegetable in Haryana and a spice in Rajasthan). */
  crops: Record<PlantCategory, readonly string[]>;
  note?: string;
};

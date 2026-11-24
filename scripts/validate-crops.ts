/**
 * Data quality check for the crop catalog and state lists.
 * Run: npm run validate:crops
 *
 * Catches typos in plant ids, wrong list sizes, duplicates and impossible dimensions
 * before they reach a farmer's phone.
 */
import { ALL_PLANTS, PLANTS_BY_ID } from '../src/features/crops/data/plants';
import { STATES } from '../src/features/crops/data/states';
import type { PlantCategory } from '../src/features/crops/domain/types';

const errors: string[] = [];
const CATEGORIES: PlantCategory[] = ['vegetable', 'fruit', 'flower', 'spice'];

// 1. Plants: unique ids, sane ranges, valid companion links.
const seen = new Set<string>();
for (const p of ALL_PLANTS) {
  if (seen.has(p.id)) errors.push(`Duplicate plant id: ${p.id}`);
  seen.add(p.id);

  const ranges = {
    height: p.above.height,
    spread: p.above.spread,
    rootDepth: p.roots.depth,
    rootSpread: p.roots.spread,
  };
  for (const [key, [min, max]] of Object.entries(ranges)) {
    if (!(min > 0 && max >= min)) errors.push(`${p.id}: bad ${key} range [${min}, ${max}]`);
  }
  if (p.sow.length === 0) errors.push(`${p.id}: no sowing months`);

  const companionIds = new Set(p.companions.map((c) => c.id));
  for (const link of [...p.companions, ...p.avoid]) {
    if (!PLANTS_BY_ID.has(link.id)) errors.push(`${p.id}: unknown companion/avoid id "${link.id}"`);
    if (link.id === p.id) errors.push(`${p.id}: lists itself as companion/avoid`);
  }
  for (const a of p.avoid) {
    if (companionIds.has(a.id)) errors.push(`${p.id}: "${a.id}" is both companion and avoid`);
  }
}

// 2. States: 28 + 8, unique ids, 15 per list (or a note), known plant ids.
const states = STATES.filter((s) => s.kind === 'state').length;
const uts = STATES.filter((s) => s.kind === 'ut').length;
if (states !== 28) errors.push(`Expected 28 states, found ${states}`);
if (uts !== 8) errors.push(`Expected 8 UTs, found ${uts}`);

const stateIds = new Set<string>();
for (const s of STATES) {
  if (stateIds.has(s.id)) errors.push(`Duplicate state id: ${s.id}`);
  stateIds.add(s.id);

  for (const cat of CATEGORIES) {
    const list = s.crops[cat];
    const ok = list.length === 15 || (s.note && list.length >= 8 && list.length < 15);
    if (!ok) errors.push(`${s.id}.${cat}: ${list.length} items (need 15, or 8–14 with a note)`);
    if (new Set(list).size !== list.length) errors.push(`${s.id}.${cat}: duplicate ids`);
    for (const id of list) {
      if (!PLANTS_BY_ID.has(id)) errors.push(`${s.id}.${cat}: unknown plant id "${id}"`);
    }
  }
}

// 3. Every catalog plant is used by at least one state (no dead data).
const used = new Set(STATES.flatMap((s) => CATEGORIES.flatMap((c) => s.crops[c])));
for (const p of ALL_PLANTS) {
  if (!used.has(p.id)) errors.push(`${p.id}: not used in any state list`);
}

const counts = CATEGORIES.map((c) => `${c}: ${ALL_PLANTS.filter((p) => p.category === c).length}`);
console.log(`Plants: ${ALL_PLANTS.length} (${counts.join(', ')})`);
console.log(`States: ${states}, UTs: ${uts}`);

if (errors.length) {
  console.error(`\n✖ ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('✔ Crop data is valid');

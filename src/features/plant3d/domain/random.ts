/**
 * Seeded random numbers. The same plant always gets the same leaf and root layout,
 * so the model does not "jump" when the user changes growth stage or re-opens the screen.
 */
export type Rng = () => number;

export function seedFromString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: tiny, fast, good enough for visual layout. */
export function createRng(seed: number): Rng {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const between = (rng: Rng, min: number, max: number) => min + rng() * (max - min);

import type { Level, Month, PlantCategory, RangeFt, Season } from './types';

/** Under 1 ft we show inches (2–4 in), above that feet with one decimal (2.5–3 ft). */
export function formatFeet([min, max]: RangeFt): string {
  if (max < 1) {
    const a = Math.max(1, Math.round(min * 12));
    const b = Math.max(a, Math.round(max * 12));
    return a === b ? `${a} in` : `${a}–${b} in`;
  }
  const fmt = (n: number) => (n >= 10 ? String(Math.round(n)) : String(Math.round(n * 10) / 10));
  const a = fmt(min);
  const b = fmt(max);
  return a === b ? `${a} ft` : `${a}–${b} ft`;
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function monthName(m: Month): string {
  return MONTHS_SHORT[m - 1] ?? '';
}

/** [10, 11, 12] → "Oct–Dec", [2, 6] → "Feb, Jun", all 12 → "Saal bhar". */
export function formatMonths(months: readonly Month[]): string {
  if (months.length === 0) return '—';
  if (months.length === 12) return 'Saal bhar';
  const sorted = [...months].sort((a, b) => a - b);
  const groups: Month[][] = [];
  for (const m of sorted) {
    const last = groups[groups.length - 1];
    if (last && last[last.length - 1] === m - 1) last.push(m);
    else groups.push([m]);
  }
  return groups
    .map((g) =>
      g.length === 1 ? monthName(g[0]!) : `${monthName(g[0]!)}–${monthName(g[g.length - 1]!)}`,
    )
    .join(', ');
}

export const SEASON_LABEL: Record<Season, string> = {
  rabi: 'Rabi',
  kharif: 'Kharif',
  zaid: 'Zaid',
  perennial: 'Bahu-varshiya',
};

export const LEVEL_LABEL: Record<Level, string> = {
  low: 'Kam',
  medium: 'Madhyam',
  high: 'Zyada',
};

export const CATEGORY_LABEL: Record<PlantCategory, { title: string; titleHi: string }> = {
  vegetable: { title: 'Vegetables', titleHi: 'Sabziyan' },
  fruit: { title: 'Fruits', titleHi: 'Phal' },
  flower: { title: 'Flowers', titleHi: 'Phool' },
  spice: { title: 'Spices', titleHi: 'Masale' },
};

export const SUN_LABEL = {
  full: 'Poori dhoop',
  partial: 'Aadhi dhoop',
  shade: 'Chhaya',
} as const;

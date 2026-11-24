import type { Season } from '../domain/types';

/** The three Indian cropping seasons, shown at the top of the Fasal tab. */
export const SEASON_GUIDE: readonly {
  key: Exclude<Season, 'perennial'>;
  title: string;
  sowing: string;
  harvest: string;
  weather: string;
  examples: string;
  color: string;
}[] = [
  {
    key: 'kharif',
    title: 'Kharif (Barsaat)',
    sowing: 'Jun–Jul',
    harvest: 'Sep–Oct',
    weather: 'Garmi + zyada paani',
    examples: 'Dhaan, makka, kapaas, soyabean, bhindi',
    color: '#2E7D32',
  },
  {
    key: 'rabi',
    title: 'Rabi (Sardi)',
    sowing: 'Oct–Dec',
    harvest: 'Mar–May',
    weather: 'Badhvar mein thand, pakne mein garmi',
    examples: 'Gehun, chana, sarson, matar, aloo',
    color: '#1565C0',
  },
  {
    key: 'zaid',
    title: 'Zaid (Garmi)',
    sowing: 'Feb–Apr',
    harvest: 'May–Jun',
    weather: 'Garm aur sookha, kam din ki fasal',
    examples: 'Tarbooz, kharbooja, kheera, karela, moong',
    color: '#EF6C00',
  },
];

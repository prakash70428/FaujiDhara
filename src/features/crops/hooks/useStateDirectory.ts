import { useMemo } from 'react';

import { cropRepository } from '../data/cropRepository';
import type { IndianState } from '../domain/types';

export type StateSection = { title: string; data: IndianState[] };

function matches(state: IndianState, q: string): boolean {
  return (
    state.name.toLowerCase().includes(q) ||
    state.nameHi.toLowerCase().includes(q) ||
    state.region.toLowerCase().includes(q)
  );
}

/** Sections for the Fasal tab: "28 Rajya" and "8 Kendra Shasit Pradesh", filtered by search. */
export function useStateDirectory(query: string): StateSection[] {
  return useMemo(() => {
    const { states, uts } = cropRepository.listStates();
    const q = query.trim().toLowerCase();
    const filter = (list: IndianState[]) => (q ? list.filter((s) => matches(s, q)) : list);

    return [
      { title: `Rajya (${states.length})`, data: filter(states) },
      { title: `Kendra Shasit Pradesh (${uts.length})`, data: filter(uts) },
    ].filter((section) => section.data.length > 0);
  }, [query]);
}

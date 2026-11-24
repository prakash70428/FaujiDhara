import { useMemo } from 'react';

// Deliberate cross-feature import: the crops feature owns the list of states/UTs, and
// profiles.state_id must use the SAME ids so Fasal Calendar can open the user's state.
import { cropRepository } from '@/features/crops/data/cropRepository';

export type StateOption = { id: string; name: string; isUt: boolean };

export function useStateOptions(): StateOption[] {
  return useMemo(() => {
    const { states, uts } = cropRepository.listStates();
    return [
      ...states.map((s) => ({ id: s.id, name: s.name, isUt: false })),
      ...uts.map((s) => ({ id: s.id, name: s.name, isUt: true })),
    ];
  }, []);
}

export function useStateName(stateId: string | undefined): string | undefined {
  const options = useStateOptions();
  return options.find((o) => o.id === stateId)?.name;
}

import { EmptyState, Screen } from '@/shared/ui';

// Phase 5 will replace this with khet listings.
export default function KhetScreen() {
  return (
    <Screen>
      <EmptyState
        icon="leaf-outline"
        title="Koi khet listing nahi"
        message="Zameen bechne, theke ya batai ki listings yahan aayengi."
      />
    </Screen>
  );
}

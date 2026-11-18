import { EmptyState, Screen } from '@/shared/ui';

// Phase 6 will replace this with the state + month crop calendar.
export default function FasalScreen() {
  return (
    <Screen>
      <EmptyState
        icon="calendar-outline"
        title="Fasal Calendar jald aa raha hai"
        message="Apne state aur mahine ke hisab se sabzi, phal aur phool dekhein."
      />
    </Screen>
  );
}

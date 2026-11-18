import { EmptyState, Screen } from '@/shared/ui';

// Phase 4 will replace this with the real community feed.
export default function FeedScreen() {
  return (
    <Screen>
      <EmptyState
        icon="chatbubbles-outline"
        title="Abhi koi post nahi"
        message="Faujiyon aur kisanon ki posts yahan dikhengi."
      />
    </Screen>
  );
}

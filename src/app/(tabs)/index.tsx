import { Redirect } from 'expo-router';

import { FEATURES } from '@/core/config/features';
import { EmptyState, Screen } from '@/shared/ui';

// Phase 4 will replace this with the real community feed.
export default function FeedScreen() {
  // "/" is the first screen the app opens. Without the feed (v1.0) open Fasal instead.
  if (!FEATURES.feed) return <Redirect href="/fasal" />;
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

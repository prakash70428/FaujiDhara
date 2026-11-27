import { router } from 'expo-router';

import { FEATURES } from '@/core/config/features';
import { ComingSoon, EmptyState, Screen } from '@/shared/ui';

/** Community feed (Phase 4). Until it ships, explains what is coming. */
export default function FeedScreen() {
  if (!FEATURES.feed) {
    return (
      <ComingSoon
        icon="people-outline"
        title="Fauji–Kisan Community"
        message="Faujiyon aur kisanon ki apni jagah: anubhav baantein, sawaal poochein, ek-doosre se seekhein."
        features={[
          'Kheti ke anubhav aur tips, photo ke saath',
          'Sawaal poochein, apne ilaake ke log jawab dein',
          'Apne rajya aur zile ke posts pehle',
          'Verified Fauji profiles',
        ]}
        action={{ title: 'Tab tak Fasal Calendar dekhein', onPress: () => router.navigate('/') }}
      />
    );
  }

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

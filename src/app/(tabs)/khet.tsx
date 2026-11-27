import { router } from 'expo-router';

import { FEATURES } from '@/core/config/features';
import { ComingSoon, EmptyState, Screen } from '@/shared/ui';

/** Khet (land) listings (Phase 5). Until it ships, explains what is coming. */
export default function KhetScreen() {
  if (!FEATURES.khet) {
    return (
      <ComingSoon
        icon="map-outline"
        title="Khet Listings"
        message="Zameen dene wale aur kheti karne wale seedhe milenge, bina beech ke dalaal ke."
        features={[
          'Zameen theke, batai ya partnership par dein ya lein',
          'Rakba, mitti, paani ka source aur photos ke saath listing',
          'Rajya aur zile se filter',
          'Owner se seedha sampark',
        ]}
        action={{ title: 'Tab tak Fasal Calendar dekhein', onPress: () => router.navigate('/') }}
      />
    );
  }

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

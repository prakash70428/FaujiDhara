import { Link, Stack } from 'expo-router';
import { Text } from 'react-native';

import { EmptyState, Screen } from '@/shared/ui';

// Shown when a link/deep link points to a route that doesn't exist.
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Nahi mila' }} />
      <Screen className="items-center justify-center">
        <EmptyState icon="compass-outline" title="Ye page nahi mila" />
        <Link href="/" className="mb-8">
          <Text className="text-base font-semibold text-primary-700">Home pe jaayein</Text>
        </Link>
      </Screen>
    </>
  );
}

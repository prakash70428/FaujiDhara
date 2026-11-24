// Root layout: the first file Expo Router runs. It wraps every screen in the app.
import '../../global.css';

import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/shared/theme/colors';
import { ErrorFallback } from '@/shared/ui';

// Expo Router catches render errors in any screen below this layout and shows this instead.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorFallback error={error} retry={retry} />;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary[600] },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="state/[stateId]" options={{ title: 'Rajya' }} />
        <Stack.Screen name="plant/[plantId]" options={{ title: 'Paudha' }} />
      </Stack>
    </>
  );
}

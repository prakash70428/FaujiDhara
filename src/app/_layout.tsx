// Root layout: the first file Expo Router runs. It wraps every screen in the app.
import '../../global.css';

import { SplashScreen, Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FEATURES } from '@/core/config/features';
import { getUserMessage } from '@/core/errors';
import { AuthStatusScreen } from '@/features/auth/components/AuthShell';
import { AuthProvider, useAuth } from '@/features/auth/hooks/AuthProvider';
import { colors } from '@/shared/theme/colors';
import { Button, ErrorFallback } from '@/shared/ui';

// Keep the splash screen up until we know whether the user is logged in,
// so they never see the login screen flash before the app opens.
void SplashScreen.preventAutoHideAsync();

// Expo Router catches render errors in any screen below this layout and shows this instead.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorFallback error={error} retry={retry} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}

/**
 * Which screens exist depends on the login status. With the `auth` feature flag off
 * (v1.0), everyone is a 'guest' and only the offline screens exist.
 * `Stack.Protected` removes the
 * screens whose guard is false, and Expo Router redirects away from them on its own.
 * So a logged-out user cannot open the feed even with a deep link, and a logged-in
 * user never lands back on the login screen.
 */
function RootNavigator() {
  const auth = useAuth();
  const status = FEATURES.auth ? auth.status : 'guest';
  const { error, retry } = auth;
  const appOpen = status === 'ready' || status === 'guest';

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hide();
  }, [status]);

  if (status === 'loading') return null; // splash screen is still showing

  if (status === 'unconfigured') {
    return (
      <AuthStatusScreen
        icon="construct-outline"
        title="Supabase setup baaki hai"
        message="Project ke root mein .env.local banayein (.env.example dekhein) aur app dobara start karein. Poore steps: docs/phase-3-guide.md"
      />
    );
  }

  if (status === 'error') {
    return (
      <AuthStatusScreen
        icon="cloud-offline-outline"
        title="Profile load nahi hui"
        message={error ? getUserMessage(error) : 'Internet check karke dobara try karein.'}
      >
        <Button title="Dobara try karein" onPress={retry} />
      </AuthStatusScreen>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary[600] },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={status === 'signedOut'}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="verify" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={status === 'needsProfile'}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={appOpen}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="state/[stateId]" options={{ title: 'Rajya' }} />
        <Stack.Screen name="plant/[plantId]" options={{ title: 'Paudha' }} />
        <Stack.Screen name="about" options={{ title: 'App ke baare mein' }} />
      </Stack.Protected>

      <Stack.Protected guard={status === 'ready'}>
        <Stack.Screen name="edit-profile" options={{ title: 'Profile badlein' }} />
      </Stack.Protected>
    </Stack>
  );
}

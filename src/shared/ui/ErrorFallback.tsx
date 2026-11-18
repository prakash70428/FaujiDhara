import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { getUserMessage } from '@/core/errors';
import { colors } from '@/shared/theme/colors';

import { Button } from './Button';

type ErrorFallbackProps = {
  error: Error;
  retry: () => void;
};

/**
 * Shown instead of a white crash screen when a screen throws while rendering.
 * Expo Router passes `error` and `retry` (see src/app/_layout.tsx).
 */
export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-8">
      <Ionicons name="warning-outline" size={48} color={colors.danger} />
      <Text className="text-center text-xl font-semibold text-ink">Kuch gadbad ho gayi</Text>
      <Text className="text-center text-base text-ink-muted">{getUserMessage(error)}</Text>
      {__DEV__ ? (
        <Text className="text-center font-mono text-xs text-danger">{error.message}</Text>
      ) : null}
      <Button title="Dobara try karein" onPress={retry} />
    </View>
  );
}

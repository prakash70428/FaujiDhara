import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme/colors';

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/**
 * Frame for login, OTP and onboarding: brand on top, form below.
 * On tablets and laptops the form stays in a centred column (max ~480px), because a
 * full-width text field on a 1400px screen is hard to read and looks unfinished.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow items-center justify-center p-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-[480px] gap-6">
            <View className="items-center gap-2">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-600">
                <Ionicons name="leaf" size={32} color="#fff" />
              </View>
              <Text className="text-sm font-bold uppercase tracking-widest text-primary-700">
                FaujiDhara
              </Text>
            </View>

            <View className="gap-1">
              <Text className="text-center text-2xl font-bold text-ink">{title}</Text>
              {subtitle ? (
                <Text className="text-center text-base text-ink-muted">{subtitle}</Text>
              ) : null}
            </View>

            <View className="gap-4 rounded-2xl border border-border bg-surface p-5">
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Full-screen message with an optional action (setup missing, profile failed to load). */
export function AuthStatusScreen({
  icon,
  title,
  message,
  children,
}: {
  icon: 'construct-outline' | 'cloud-offline-outline';
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Ionicons name={icon} size={48} color={colors.primary[600]} />
        <Text className="text-center text-xl font-bold text-ink">{title}</Text>
        <Text className="max-w-[420px] text-center text-base text-ink-muted">{message}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
}

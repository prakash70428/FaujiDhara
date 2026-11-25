import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { APP_INFO } from '@/core/config/app';
import { colors } from '@/shared/theme/colors';
import { Card, Screen } from '@/shared/ui';

/** Version, what the app does with data, and the privacy policy link. */
export default function AboutScreen() {
  return (
    <Screen scroll className="w-full max-w-[640px] self-center pb-12">
      <Card className="items-center gap-2 py-6">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-600">
          <Ionicons name="leaf" size={32} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-ink">{APP_INFO.name}</Text>
        <Text className="text-sm text-ink-muted">Version {APP_INFO.version}</Text>
        <Text className="text-center text-base text-ink-muted">
          Faujiyon aur Kisanon ke liye kheti ki jaankari: har rajya ki fasal, mausam ke hisaab se
          buaai, aur paudhon ka asli naap 3D mein.
        </Text>
      </Card>

      <Card className="gap-3">
        <Fact icon="cloud-offline-outline" text="Poora app bina internet ke chalta hai." />
        <Fact
          icon="shield-checkmark-outline"
          text="Ye version aapki koi bhi personal jaankari nahi leta, na kisi ko bhejta hai."
        />
        <Fact
          icon="information-circle-outline"
          text="Fasal aur naap ki jaankari aam margdarshan hai. Apne ilaake ke krishi vibhag (KVK) se bhi salah lein."
        />
      </Card>

      <Card className="gap-1 p-2">
        <LinkRow
          icon="document-text-outline"
          label="Privacy Policy"
          url={APP_INFO.privacyPolicyUrl}
        />
        <LinkRow icon="logo-github" label="Source code" url={APP_INFO.sourceUrl} />
      </Card>
    </Screen>
  );
}

type IconName = ComponentProps<typeof Ionicons>['name'];

function Fact({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <Ionicons name={icon} size={20} color={colors.primary[600]} />
      <Text className="flex-1 text-sm text-ink">{text}</Text>
    </View>
  );
}

function LinkRow({ icon, label, url }: { icon: IconName; label: string; url: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => void Linking.openURL(url)}
      className="h-12 flex-row items-center gap-3 rounded-xl px-3 active:bg-primary-50"
    >
      <Ionicons name={icon} size={20} color={colors.primary[600]} />
      <Text className="flex-1 text-base text-ink">{label}</Text>
      <Ionicons name="open-outline" size={18} color={colors.ink.muted} />
    </Pressable>
  );
}

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Alert, Platform, Text, View } from 'react-native';

import { getUserMessage } from '@/core/errors';
import { formatIndianMobile } from '@/features/auth/domain/phone';
import { ROLE_INFO } from '@/features/auth/domain/types';
import { useAuth, useSignedInUser } from '@/features/auth/hooks/AuthProvider';
import { useStateName } from '@/features/auth/hooks/useStateOptions';
import { colors } from '@/shared/theme/colors';
import { Button, Card, Screen } from '@/shared/ui';

/** The logged-in user's profile, with edit and logout. */
export default function ProfileScreen() {
  const { session, profile } = useSignedInUser();
  const { signOut } = useAuth();
  const stateName = useStateName(profile.stateId) ?? profile.stateId;
  const [signingOut, setSigningOut] = useState(false);

  const roleTitle = profile.role === 'ADMIN' ? 'Admin' : ROLE_INFO[profile.role].title;
  const phone = session.user.phone ? formatIndianMobile(`+${session.user.phone}`) : '—';

  async function doSignOut() {
    setSigningOut(true);
    try {
      await signOut(); // the guard in _layout.tsx then shows the login screen
    } catch (e) {
      setSigningOut(false);
      showMessage('Logout nahi hua', getUserMessage(e));
    }
  }

  function confirmSignOut() {
    if (Platform.OS === 'web') {
      // Alert with buttons doesn't exist in browsers.
      if (window.confirm('Kya aap logout karna chahte hain?')) void doSignOut();
      return;
    }
    Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
      { text: 'Nahi', style: 'cancel' },
      { text: 'Haan, logout', style: 'destructive', onPress: () => void doSignOut() },
    ]);
  }

  return (
    <Screen scroll className="w-full max-w-[640px] self-center pb-12">
      <Card className="items-center gap-3 py-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-600">
          <Text className="text-3xl font-bold text-white">{initials(profile.fullName)}</Text>
        </View>
        <View className="items-center gap-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xl font-bold text-ink">{profile.fullName}</Text>
            {profile.isVerified ? (
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            ) : null}
          </View>
          <View className="rounded-full bg-primary-50 px-3 py-1">
            <Text className="text-xs font-semibold text-primary-700">{roleTitle}</Text>
          </View>
        </View>
      </Card>

      <Card className="gap-4">
        <Row icon="call-outline" label="Mobile" value={phone} />
        <Row icon="location-outline" label="Rajya" value={stateName} />
        <Row icon="map-outline" label="Zila" value={profile.district} />
        <Row
          icon={profile.isVerified ? 'shield-checkmark-outline' : 'shield-outline'}
          label="Verification"
          value={profile.isVerified ? 'Verified' : 'Abhi verified nahi (jald aa raha hai)'}
        />
      </Card>

      <Button
        title="Profile badlein"
        variant="secondary"
        onPress={() => router.push('/edit-profile')}
      />
      <Button title="Logout" variant="ghost" loading={signingOut} onPress={confirmSignOut} />
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} size={20} color={colors.primary[600]} />
      <Text className="w-24 text-sm text-ink-muted">{label}</Text>
      <Text className="flex-1 text-base text-ink">{value}</Text>
    </View>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
}

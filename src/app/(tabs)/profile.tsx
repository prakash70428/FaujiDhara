import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Alert, Linking, Platform, Pressable, Text, View } from 'react-native';

import { APP_INFO } from '@/core/config/app';
import { FEATURES } from '@/core/config/features';
import { getUserMessage } from '@/core/errors';
import { formatIndianMobile } from '@/features/auth/domain/phone';
import { ROLE_INFO } from '@/features/auth/domain/types';
import { useAuth, useSignedInUser } from '@/features/auth/hooks/AuthProvider';
import { useStateName } from '@/features/auth/hooks/useStateOptions';
import { colors } from '@/shared/theme/colors';
import { Button, Card, Screen } from '@/shared/ui';

/** Logged-in profile when login is on (v1.1+); a guest screen before that (v1.0). */
export default function ProfileScreen() {
  return FEATURES.auth ? <SignedInProfile /> : <GuestProfile />;
}

function GuestProfile() {
  return (
    <Screen scroll className="w-full max-w-[640px] self-center pb-12">
      <Card className="items-center gap-3 py-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <Ionicons name="person" size={36} color={colors.primary[600]} />
        </View>
        <Text className="text-xl font-bold text-ink">Mehmaan</Text>
        <Text className="text-center text-sm text-ink-muted">
          Abhi bina login ke poora Fasal Calendar aur 3D naap use kar sakte hain.
        </Text>
      </Card>

      <Card className="gap-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={18} color={colors.earth[700]} />
          <Text className="text-base font-bold text-ink">Login jald aa raha hai</Text>
        </View>
        <Text className="text-sm text-ink-muted">
          Agle update mein mobile number aur OTP se login hoga. Uske saath:
        </Text>
        {[
          'Fauji ya Kisan ki pehchaan wali profile',
          'Community mein post aur sawaal',
          'Khet listings dena aur dekhna',
          'Verified Fauji badge',
        ].map((f) => (
          <View key={f} className="flex-row items-start gap-3">
            <Ionicons name="checkmark-circle" size={18} color={colors.primary[600]} />
            <Text className="flex-1 text-sm text-ink">{f}</Text>
          </View>
        ))}
      </Card>

      <Card className="gap-1 p-2">
        <LinkRow
          icon="information-circle-outline"
          label="App ke baare mein"
          onPress={() => router.push('/about')}
        />
        <LinkRow
          icon="document-text-outline"
          label="Privacy Policy"
          external
          onPress={() => void Linking.openURL(APP_INFO.privacyPolicyUrl)}
        />
        <LinkRow
          icon="mail-outline"
          label={`Sampark: ${APP_INFO.contactEmail}`}
          external
          onPress={() => void Linking.openURL(`mailto:${APP_INFO.contactEmail}`)}
        />
      </Card>

      <Text className="text-center text-xs text-ink-muted">
        {APP_INFO.name} · Version {APP_INFO.version}
      </Text>
    </Screen>
  );
}

function LinkRow({
  icon,
  label,
  external,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  external?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={external ? 'link' : 'button'}
      onPress={onPress}
      className="h-12 flex-row items-center gap-3 rounded-xl px-3 active:bg-primary-50"
    >
      <Ionicons name={icon} size={20} color={colors.primary[600]} />
      <Text className="flex-1 text-base text-ink">{label}</Text>
      <Ionicons
        name={external ? 'open-outline' : 'chevron-forward'}
        size={18}
        color={colors.ink.muted}
      />
    </Pressable>
  );
}

/** The logged-in user's profile, with edit and logout. */
function SignedInProfile() {
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

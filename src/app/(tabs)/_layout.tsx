// Bottom tab bar. The (tabs) folder name is in brackets, so it is a "group":
// it organizes files but does not appear in the URL/route.
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { colors } from '@/shared/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

// Returns a named component (named so React DevTools and the linter can identify it).
function tabIcon(name: IconName) {
  return function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
    // React Navigation types color as ColorValue (can be null or a number);
    // the icon accepts only string colors. Our tint colors are always strings.
    const iconColor = typeof color === 'number' || color == null ? undefined : color;
    return <Ionicons name={name} color={iconColor} size={size} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.ink.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.primary[600] },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Feed', tabBarIcon: tabIcon('people') }} />
      <Tabs.Screen name="khet" options={{ title: 'Khet', tabBarIcon: tabIcon('leaf') }} />
      <Tabs.Screen
        name="fasal"
        options={{ title: 'Fasal Calendar', tabBarLabel: 'Fasal', tabBarIcon: tabIcon('calendar') }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}

import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';

import { ROLE_INFO, type SelfRole } from '../domain/types';

const ICONS: Record<SelfRole, 'shield-checkmark' | 'leaf'> = {
  FAUJI: 'shield-checkmark',
  KISAN: 'leaf',
};

const ROLES = Object.keys(ROLE_INFO) as SelfRole[];

type RolePickerProps = {
  value: SelfRole | undefined;
  onChange: (role: SelfRole) => void;
  error?: string;
  /** Role is fixed after signup (the database enforces it), so the edit screen locks it. */
  disabled?: boolean;
};

/** Two big cards instead of a dropdown: easy to tap, and the subtitle explains each role. */
export function RolePicker({ value, onChange, error, disabled }: RolePickerProps) {
  return (
    <View className="gap-2" accessibilityRole="radiogroup">
      <Text className="text-sm font-medium text-ink">Aap kaun hain?</Text>
      <View className="gap-3 sm:flex-row">
        {ROLES.map((role) => {
          const active = value === role;
          return (
            <Pressable
              key={role}
              accessibilityRole="radio"
              accessibilityState={{ checked: active, disabled }}
              disabled={disabled}
              onPress={() => onChange(role)}
              className={cn(
                'flex-row items-start gap-3 rounded-2xl border-2 p-4 sm:flex-1',
                active ? 'border-primary-600 bg-primary-50' : 'border-border bg-surface',
                disabled && !active && 'opacity-40',
              )}
            >
              <View
                className={cn(
                  'h-11 w-11 items-center justify-center rounded-full',
                  active ? 'bg-primary-600' : 'bg-primary-50',
                )}
              >
                <Ionicons
                  name={ICONS[role]}
                  size={22}
                  color={active ? '#fff' : colors.primary[600]}
                />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-base font-bold text-ink">{ROLE_INFO[role].title}</Text>
                <Text className="text-sm text-ink-muted">{ROLE_INFO[role].subtitle}</Text>
              </View>
              <Ionicons
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={active ? colors.primary[600] : colors.ink.muted}
              />
            </Pressable>
          );
        })}
      </View>
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}

import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Input } from '@/shared/ui';

import { hasErrors, validateProfile, type ProfileErrors } from '../domain/profileRules';
import type { ProfileInput, SelfRole } from '../domain/types';

import { RolePicker } from './RolePicker';
import { StatePicker } from './StatePicker';

type ProfileFormProps = {
  initial?: Partial<ProfileInput>;
  /** On the edit screen the role is shown but locked. */
  roleLocked?: boolean;
  submitTitle: string;
  loading: boolean;
  serverError: string | null;
  onSubmit: (input: ProfileInput) => void;
};

/**
 * Shared by onboarding and the edit-profile screen.
 * Errors show only after the first submit, so the user is not scolded while still typing.
 */
export function ProfileForm({
  initial,
  roleLocked,
  submitTitle,
  loading,
  serverError,
  onSubmit,
}: ProfileFormProps) {
  const [role, setRole] = useState<SelfRole | undefined>(initial?.role);
  const [fullName, setFullName] = useState(initial?.fullName ?? '');
  const [stateId, setStateId] = useState(initial?.stateId);
  const [district, setDistrict] = useState(initial?.district ?? '');
  const [submitted, setSubmitted] = useState(false);

  const input = { role, fullName, stateId, district };
  const errors: ProfileErrors = submitted ? validateProfile(input) : {};

  function submit() {
    setSubmitted(true);
    if (!role || !stateId || hasErrors(validateProfile(input))) return;
    onSubmit({ role, fullName, stateId, district });
  }

  return (
    <View className="gap-5">
      <RolePicker value={role} onChange={setRole} error={errors.role} disabled={roleLocked} />
      {roleLocked ? (
        <Text className="-mt-3 text-xs text-ink-muted">
          Role signup ke baad badla nahi ja sakta. Galti ho toh support se sampark karein.
        </Text>
      ) : null}
      <Input
        label="Poora naam"
        placeholder="Jaise: Subedar Ramesh Singh"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        maxLength={60}
      />
      <StatePicker value={stateId} onChange={setStateId} error={errors.stateId} />
      <Input
        label="Zila (District)"
        placeholder="Jaise: Jhunjhunu"
        value={district}
        onChangeText={setDistrict}
        error={errors.district}
        autoCapitalize="words"
        maxLength={60}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      {serverError ? (
        <Text accessibilityRole="alert" className="text-center text-sm text-danger">
          {serverError}
        </Text>
      ) : null}
      <Button title={submitTitle} size="lg" loading={loading} onPress={submit} />
    </View>
  );
}

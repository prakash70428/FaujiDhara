import { useState } from 'react';
import { Text } from 'react-native';

import { Button, Card, Input, Screen } from '@/shared/ui';

// Phase 3 will turn this into the real profile. For now it showcases the shared UI kit,
// so you can see every component on a phone and check the theme.
export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const nameError =
    name.length > 0 && name.trim().length < 2 ? 'Naam kam se kam 2 akshar ka ho' : undefined;

  function fakeSave() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <Screen scroll>
      <Card className="gap-1">
        <Text className="text-lg font-bold text-ink">UI Kit preview</Text>
        <Text className="text-sm text-ink-muted">
          Phase 2: shared components. Phase 3 mein yahan asli profile aayegi.
        </Text>
      </Card>

      <Card className="gap-4">
        <Input
          label="Aapka naam"
          placeholder="Jaise: Ramesh Singh"
          value={name}
          onChangeText={setName}
          error={nameError}
        />
        <Button title="Save karein" loading={loading} onPress={fakeSave} />
        <Button title="Secondary" variant="secondary" />
        <Button title="Ghost" variant="ghost" />
        <Button title="Bada button (lg)" size="lg" />
        <Button title="Disabled" disabled />
      </Card>
    </Screen>
  );
}

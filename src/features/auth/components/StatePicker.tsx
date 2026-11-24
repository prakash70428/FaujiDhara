import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';
import { colors } from '@/shared/theme/colors';
import { Input } from '@/shared/ui';

import { useStateOptions } from '../hooks/useStateOptions';

type StatePickerProps = {
  value: string | undefined;
  onChange: (stateId: string) => void;
  error?: string;
};

/**
 * A field that opens a full-screen, searchable list of 36 states/UTs.
 * Full screen instead of a dropdown: long lists are hard to scroll inside a small popup.
 */
export function StatePicker({ value, onChange, error }: StatePickerProps) {
  const options = useStateOptions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((o) => o.id === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-ink">Rajya / Kendra Shasit Pradesh</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Rajya chunein"
        onPress={() => setOpen(true)}
        className={cn(
          'h-12 flex-row items-center justify-between rounded-xl border bg-surface px-4',
          error ? 'border-danger' : 'border-border',
        )}
      >
        <Text className={cn('text-base', selected ? 'text-ink' : 'text-ink-muted')}>
          {selected?.name ?? 'Rajya chunein'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.ink.muted} />
      </Pressable>
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}

      <Modal visible={open} animationType="slide" onRequestClose={close}>
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center gap-2 border-b border-border p-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Band karein"
              onPress={close}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-primary-50"
            >
              <Ionicons name="close" size={24} color={colors.ink.DEFAULT} />
            </Pressable>
            <Text className="text-lg font-bold text-ink">Apna rajya chunein</Text>
          </View>
          <View className="px-4 pt-4">
            <Input
              placeholder="Khojein: Punjab, Bihar..."
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(o) => o.id}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="gap-1 p-4"
            renderItem={({ item }) => {
              const active = item.id === value;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    onChange(item.id);
                    close();
                  }}
                  className={cn(
                    'h-12 flex-row items-center justify-between rounded-xl px-4',
                    active ? 'bg-primary-50' : 'active:bg-primary-50',
                  )}
                >
                  <Text
                    className={cn('text-base', active ? 'font-bold text-primary-700' : 'text-ink')}
                  >
                    {item.name}
                    {item.isUt ? <Text className="text-sm text-ink-muted"> (UT)</Text> : null}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={20} color={colors.primary[600]} />
                  ) : null}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text className="p-6 text-center text-ink-muted">Koi rajya nahi mila</Text>
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

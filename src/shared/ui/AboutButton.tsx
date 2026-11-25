import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

/** Header-right "i" button that opens the About screen. */
export function AboutButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="App ke baare mein"
      hitSlop={8}
      onPress={() => router.push('/about')}
      className="mr-3 h-10 w-10 items-center justify-center rounded-full active:bg-white/20"
    >
      <Ionicons name="information-circle-outline" size={24} color="#fff" />
    </Pressable>
  );
}

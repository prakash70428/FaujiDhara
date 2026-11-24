import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

/** Field advice card + an honest note that numbers are typical, not exact. */
export function ExpertTip({ tip }: { tip: string }) {
  return (
    <View className="gap-3">
      <View className="gap-2 rounded-2xl border border-wheat-400 bg-wheat-100 p-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="ribbon" size={18} color={colors.earth[700]} />
          <Text className="text-base font-bold text-earth-700">Khet ki salah</Text>
        </View>
        <Text className="text-base leading-6 text-ink">{tip}</Text>
      </View>
      <Text className="text-xs leading-5 text-ink-muted">
        Naap aur mahine aam haalaat ke anumaan hain — kism, mitti aur mausam ke hisab se badal sakte
        hain. Apne nazdeeki Krishi Vigyan Kendra (KVK) se zaroor milayein.
      </Text>
    </View>
  );
}

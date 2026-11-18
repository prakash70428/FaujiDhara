import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

type ScreenProps = {
  children: ReactNode;
  /** Long content (forms, detail pages) scrolls. Lists use FlatList inside a non-scrolling Screen. */
  scroll?: boolean;
  className?: string;
};

/** Base wrapper for every screen: same background and padding everywhere. */
export function Screen({ children, scroll = false, className }: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName={cn('gap-4 p-4', className)}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View className={cn('flex-1 gap-4 bg-background p-4', className)}>{children}</View>;
}

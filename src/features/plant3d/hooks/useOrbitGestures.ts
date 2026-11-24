import { useState } from 'react';
import { PanResponder, type GestureResponderEvent } from 'react-native';

import type { OrbitController } from '../domain/orbit';

function pinchDistance(e: GestureResponderEvent): number | null {
  const t = e.nativeEvent.touches;
  if (t.length < 2) return null;
  const a = t[0]!;
  const b = t[1]!;
  return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
}

/**
 * Turns touches into orbit commands: one finger rotates/tilts, two fingers pinch-zoom.
 * Built on React Native's PanResponder (no extra library) — works on Android, iOS and web.
 * Created once per viewer (useState initializer), never re-created on re-render.
 */
export function useOrbitGestures(controller: OrbitController) {
  const [handlers] = useState(
    () =>
      PanResponder.create({
        // "Capture" so the gesture is ours even though the 3D canvas sits underneath.
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => controller.beginGesture(pinchDistance(e)),
        onPanResponderMove: (e, g) => {
          const d = pinchDistance(e);
          if (d !== null) controller.pinch(d);
          else controller.drag(g.dx, g.dy);
        },
      }).panHandlers,
  );
  return handlers;
}

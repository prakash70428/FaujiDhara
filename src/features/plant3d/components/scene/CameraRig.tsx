import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';

import type { OrbitController } from '../../domain/orbit';
import type { Framing } from '../../domain/sceneLayout';

type CameraRigProps = { controller: OrbitController; framing: Framing };

/**
 * Bridges the orbit controller and the three.js camera.
 * The canvas renders "on demand": frames are requested only while the camera is
 * still easing. When nothing moves, the GPU does no work — a big battery saver.
 */
export function CameraRig({ controller, framing }: CameraRigProps) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    controller.attach(invalidate);
    invalidate();
  }, [controller, invalidate, framing]);

  useFrame(() => {
    if (controller.step(camera, framing)) invalidate();
  });

  return null;
}

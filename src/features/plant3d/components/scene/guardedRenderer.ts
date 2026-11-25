import * as THREE from 'three';

type DefaultGLProps = Omit<THREE.WebGLRendererParameters, 'canvas'> & {
  canvas: THREE.WebGLRendererParameters['canvas'];
};

/**
 * Creates the three.js renderer with every draw call wrapped in try/catch.
 *
 * Why: on Android the 3D view runs on expo-gl, which does not implement every WebGL2
 * function. If three.js calls a missing one, the error is thrown inside the render loop,
 * which runs outside React. In a release build such an error closes the whole app.
 * With this guard the first failure is reported once, drawing stops, and the viewer
 * shows a fallback card instead of crashing.
 */
export function createGuardedRenderer(
  params: THREE.WebGLRendererParameters,
  onError: (error: Error) => void,
) {
  return (defaults: DefaultGLProps) => {
    let failed = false;
    const fail = (e: unknown) => {
      if (failed) return;
      failed = true;
      onError(e instanceof Error ? e : new Error(String(e)));
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ ...defaults, ...params });
    } catch (e) {
      fail(e);
      throw e; // R3F reports construction errors to the nearest ErrorBoundary itself
    }

    const render = renderer.render.bind(renderer);
    renderer.render = (scene, camera) => {
      if (failed) return;
      try {
        render(scene, camera);
      } catch (e) {
        fail(e);
      }
    };
    return renderer;
  };
}

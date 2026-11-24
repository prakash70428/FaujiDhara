import type { Framing } from './sceneLayout';

/** Anything with a position and lookAt — a three.js camera fits, but this file doesn't import three. */
export type CameraLike = {
  position: { set(x: number, y: number, z: number): unknown };
  lookAt(x: number, y: number, z: number): void;
};

type View = { yaw: number; pitch: number; zoom: number };

const LIMITS = {
  minPitch: -0.45, // a little below ground level, to look at roots from under the soil line
  maxPitch: 1.25,
  minZoom: 0.35,
  maxZoom: 2.2,
} as const;

// Near eye level, so the soil cross-section (roots) is visible, not just the grass top.
const DEFAULT_VIEW: View = { yaw: 0.7, pitch: 0.06, zoom: 1 };
const ROTATE_SPEED = 0.008; // radians per pixel dragged
const TILT_SPEED = 0.005;
const SMOOTH = 0.18; // easing per frame; higher = snappier
const AUTO_SPIN = 0.0045; // radians per frame during the intro
const EPS = 1e-4;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * All camera-orbit logic in one plain class: gestures and buttons call its methods,
 * the 3D loop calls step() every frame.
 *
 * Why a class and not React state: a drag fires ~60 events per second. Re-rendering
 * React for each one would stutter on mid-range Android. The class changes numbers
 * in place and only asks the canvas for a new frame (invalidate).
 */
export class OrbitController {
  private target: View = { ...DEFAULT_VIEW };
  private current: View = { ...DEFAULT_VIEW };
  private gesture = { yaw: 0, pitch: 0, zoom: 1, pinch: 0 };
  /** Until the first touch, the plant slowly spins to show it is 3D. */
  private interacted = false;
  private invalidate: (() => void) | null = null;

  /** The canvas gives us its "please draw a frame" function once it is ready. */
  attach(invalidate: () => void) {
    this.invalidate = invalidate;
  }

  private changed() {
    this.interacted = true;
    this.target.pitch = clamp(this.target.pitch, LIMITS.minPitch, LIMITS.maxPitch);
    this.target.zoom = clamp(this.target.zoom, LIMITS.minZoom, LIMITS.maxZoom);
    this.invalidate?.();
  }

  beginGesture(pinchDistance: number | null) {
    this.interacted = true;
    this.gesture = { ...this.target, pinch: pinchDistance ?? 0 };
  }

  /** One finger: drag sideways rotates, drag up/down tilts. dx/dy are total pixels since start. */
  drag(dx: number, dy: number) {
    this.target.yaw = this.gesture.yaw - dx * ROTATE_SPEED;
    this.target.pitch = this.gesture.pitch + dy * TILT_SPEED;
    this.changed();
  }

  /** Two fingers: spreading them apart zooms in. */
  pinch(distance: number) {
    if (this.gesture.pinch === 0) this.beginGesture(distance); // second finger landed mid-drag
    this.target.zoom = this.gesture.zoom * (this.gesture.pinch / Math.max(distance, 1));
    this.changed();
  }

  zoomBy(factor: number) {
    this.target.zoom *= factor;
    this.changed();
  }

  reset() {
    this.target = { ...DEFAULT_VIEW };
    this.changed();
  }

  /**
   * Eases the camera toward the target and places it. Returns true while still moving,
   * so the canvas keeps drawing only as long as needed (frameloop "demand").
   */
  step(camera: CameraLike, framing: Framing): boolean {
    if (!this.interacted) this.target.yaw += AUTO_SPIN;

    const c = this.current;
    const t = this.target;
    c.yaw += (t.yaw - c.yaw) * SMOOTH;
    c.pitch += (t.pitch - c.pitch) * SMOOTH;
    c.zoom += (t.zoom - c.zoom) * SMOOTH;

    const dist = framing.distance * c.zoom;
    const [tx, ty, tz] = framing.target;
    camera.position.set(
      tx + dist * Math.cos(c.pitch) * Math.sin(c.yaw),
      ty + dist * Math.sin(c.pitch),
      tz + dist * Math.cos(c.pitch) * Math.cos(c.yaw),
    );
    camera.lookAt(tx, ty, tz);

    return (
      !this.interacted ||
      Math.abs(t.yaw - c.yaw) > EPS ||
      Math.abs(t.pitch - c.pitch) > EPS ||
      Math.abs(t.zoom - c.zoom) > EPS
    );
  }
}

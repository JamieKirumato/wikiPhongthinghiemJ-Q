// Four display units represent one metre for the animated trajectory.
export const DISPLAY_GRAVITY = 9.81 * 4;

export function advanceAirFall(y: number, vy: number, dt: number) {
  return { y: y + vy * dt - 0.5 * DISPLAY_GRAVITY * dt * dt, vy: vy - DISPLAY_GRAVITY * dt };
}

export function itemKind(id: string) { return id.split('#')[0]; }

export function impactVolume(speed: number) {
  return Math.max(0.4, Math.min(1, Math.sqrt(Math.max(0, Number.isFinite(speed) ? speed : 0) / 8)));
}

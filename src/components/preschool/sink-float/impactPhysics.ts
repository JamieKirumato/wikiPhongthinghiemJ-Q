import { TankObject } from './types';

export function damageFromImpact(id: string, speed: number, previous?: TankObject['damage']): TankObject['damage'] {
  if (previous === 'broken') return previous;
  if (id === 'item-egg' && speed >= 4) return 'broken';
  if (id === 'item-egg' && speed >= 2.2) return 'cracked';
  if (id === 'item-apple' && speed >= 4.5) return 'bruised';
  return previous;
}

export function gestureVelocity(dx: number, dy: number, seconds: number) {
  if (seconds <= 0.01 || seconds > 0.16) return {vx: 0, vy: 0};
  const speed = Math.hypot(dx, dy) / seconds;
  if (speed < 250) return {vx: 0, vy: 0};
  return {vx: Math.max(-1200, Math.min(1200, dx / seconds)), vy: Math.max(-1200, Math.min(1200, dy / seconds))};
}

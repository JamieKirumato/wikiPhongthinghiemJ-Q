import { TankObject } from './types';
import { itemKind } from './playPhysics';

export function damageFromImpact(id: string, speed: number, previous?: TankObject['damage']): TankObject['damage'] {
  id = itemKind(id);
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

export function floorEggDamage(egg:TankObject,other:TankObject,dt:number,radius:number,otherRadius:number){
  if(itemKind(egg.id)!=='item-egg'||!egg.outsideTank||egg.status!=='grounded'||egg.damage==='broken'||!other.inTank||!other.outsideTank||other.vy>=-2.2)return egg.damage;
  if(Math.hypot(other.x-egg.x,other.z-egg.z)>=radius+otherRadius||other.y<=egg.y||other.y+other.vy*dt>egg.y+radius+otherRadius)return egg.damage;
  const soft=['item-duck','item-foam','item-leaf','item-pingpong'].includes(itemKind(other.id))?.2:1;
  const effectiveSpeed=Math.abs(other.vy)*Math.sqrt(Math.max(0,other.weightGrams)/50)*soft;
  return damageFromImpact(egg.id,effectiveSpeed,egg.damage);
}

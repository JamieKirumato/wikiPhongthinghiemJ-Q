import {TankDimensions,TankShape} from './types';
import {getFootprintArea} from './tankGeometry';
import {ML_PER_WORLD_VOLUME} from './salinity';
import {submergedFraction} from './buoyancy';

export type FlowTarget={x:number;y:number;worldX:number;worldZ:number;inside:boolean};
export type FloorSpill={x:number;z:number;ml:number};
export function waterCapacity(shape:TankShape,dims:TankDimensions,objects:Array<{y:number;radius:number;volume:number}>,sand:number){
  const rim=dims.height-.08;
  return Math.max(0,(rim-sand)*getFootprintArea(shape,dims)*ML_PER_WORLD_VOLUME-objects.reduce((sum,o)=>sum+o.volume*submergedFraction(o.y,o.radius,rim),0));
}
export function splitOverflow(volume:number,salt:number,capacity:number){
  const spilled=Math.max(0,volume-capacity),grams=volume>0?salt*spilled/volume:0;
  return {kept:volume-spilled,spilled,grams};
}
export function mergeSpill(spills:FloorSpill[],x:number,z:number,ml:number):FloorSpill[]{
  if(ml<=0)return spills;
  const index=spills.findIndex(s=>Math.hypot(s.x-x,s.z-z)<1.2);
  if(index<0)return [...spills,{x,z,ml}];
  return spills.map((s,i)=>i===index?{...s,ml:s.ml+ml}:s);
}

/** Equal generous targets: a large neighbour must not steal a small object's hand area. */
export function nearestHandTarget(candidates:Array<{id:string;x:number;y:number;radius:number}>,x:number,y:number){
  return candidates.filter(c=>Math.hypot(c.x-x,c.y-y)<=c.radius).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0]?.id;
}

import { TankDimensions, TankShape } from './types';
import { getFootprintArea } from './tankGeometry';
import { ML_PER_WORLD_VOLUME } from './salinity';
import { submergedFraction } from './buoyancy';

export const sandHeight = (dims:TankDimensions) => dims.height * .085;
export function addedWaterHeight(ml:number,shape:TankShape,dims:TankDimensions):number {
  return ml/(getFootprintArea(shape,dims)*ML_PER_WORLD_VOLUME);
}
/** Remove the same fraction of dissolved salt as water: scooping cannot concentrate brine. */
export function scoopWater(volumeMl:number,saltGrams:number,requestedMl:number) {
  const ml=Math.min(Math.max(0,volumeMl),Math.max(0,requestedMl));
  const grams=volumeMl>0 ? Math.max(0,saltGrams)*ml/volumeMl : 0;
  return {ml,grams};
}
export function maximumAddedWater(occupiedMl:number,shape:TankShape,dims:TankDimensions):number {
  return Math.max(0,(dims.height-.18-dims.waterHeight)*getFootprintArea(shape,dims)*ML_PER_WORLD_VOLUME-occupiedMl);
}
export function displacedWaterLevel(base:number,shape:TankShape,dims:TankDimensions,objects:Array<{y:number;radius:number;volume:number}>):number {
  let low=base,high=dims.height-.08;
  const area=getFootprintArea(shape,dims)*ML_PER_WORLD_VOLUME;
  for(let n=0;n<24;n++) {
    const level=(low+high)/2;
    const displacement=objects.reduce((sum,item)=>sum+item.volume*submergedFraction(item.y,item.radius,level),0)/area;
    if(level-base<displacement)low=level;else high=level;
  }
  return Math.max(base,Math.min(dims.height-.08,(low+high)/2));
}
export function advanceSinking(y:number,vy:number,dt:number,density:number,waterDensity:number):{y:number;vy:number} {
  const acceleration=19.62*Math.max(.01,1-waterDensity/density);
  const drag=density>=2 ? 9 : 4;
  const terminal=-acceleration/drag;
  const next=terminal+(vy-terminal)*Math.exp(-drag*dt);
  return {y:y+terminal*dt+(vy-terminal)*(1-Math.exp(-drag*dt))/drag,vy:next};
}

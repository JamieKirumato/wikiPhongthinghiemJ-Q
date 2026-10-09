import { TankDimensions, TankShape } from './types';
import { getFootprintArea } from './tankGeometry';
import { ML_PER_WORLD_VOLUME } from './salinity';
import { submergedFraction } from './buoyancy';

export const sandHeight = (dims:TankDimensions) => dims.height * .085;
/** Water uses the model's world scale; density still comes from the sample's mass/volume. */
export function modelDisplacementVolume(radius:number,sampleVolume:number):number {
  return Math.min(Math.max(0,sampleVolume),4*Math.PI*Math.max(0,radius)**3/3*ML_PER_WORLD_VOLUME);
}
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
export function displacedWaterLevel(base:number,shape:TankShape,dims:TankDimensions,objects:Array<{y:number;radius:number;volume:number;immersedVolume?:number}>):number {
  let low=base,high=dims.height-.08;
  const area=getFootprintArea(shape,dims)*ML_PER_WORLD_VOLUME;
  for(let n=0;n<24;n++) {
    const level=(low+high)/2;
    const displacement=objects.reduce((sum,item)=>sum+(item.immersedVolume ?? item.volume*submergedFraction(item.y,item.radius,level)),0)/area;
    if(level-base<displacement)low=level;else high=level;
  }
  return Math.max(base,Math.min(dims.height-.08,(low+high)/2));
}
/** Effective drag for representative classroom objects, not measured fall times.
 * Sample volume estimates cross-section; broad/irregular shapes resist more than spheres.
 */
export function sinkingDrag(id:string,massGrams:number,volumeMl:number):number {
  const kind=id.split('#')[0];
  const shapeFactor:Record<string,number>={'item-pebble':.8,'item-keys':2,'item-spoon':3,'item-egg':.5,'item-coin':8,'item-marble':1.2};
  const radiusCm=Math.cbrt(3*Math.max(.01,volumeMl)/(4*Math.PI));
  return Math.max(.8,Math.min(30,35*Math.PI*radiusCm*radiusCm*(shapeFactor[kind]??1)/Math.max(.1,massGrams)));
}
/** Entry splash loses most of its downward speed; underwater drag then separates objects visibly. */
export function waterEntryVelocity(vy:number,willFloat:boolean):number {
  if(vy>=0)return Math.min(vy,.4);
  return Math.max(willFloat?-2:-1,vy*(willFloat?.3:.16));
}
export function advanceSinking(y:number,vy:number,dt:number,density:number,waterDensity:number,effectiveDrag?:number):{y:number;vy:number} {
  const acceleration=19.62*Math.max(.01,1-waterDensity/density);
  const drag=effectiveDrag??(density>=2 ? 9 : 4);
  const terminal=-acceleration/drag;
  const next=terminal+(vy-terminal)*Math.exp(-drag*dt);
  return {y:y+terminal*dt+(vy-terminal)*(1-Math.exp(-drag*dt))/drag,vy:next};
}

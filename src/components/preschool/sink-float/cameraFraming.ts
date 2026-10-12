import { TankDimensions } from './types';

/** Fit the normal tank plus a little floor/headroom; compact remains half-size. */
export function tankCameraDistance(dims: TankDimensions, aspect: number, yaw: number, pitch: number) {
  const targetY = dims.height * .4;
  const tanVertical = Math.tan(20 * Math.PI / 180) * .88;
  const tanHorizontal = tanVertical * Math.max(.1, aspect);
  let distance = 0;
  for (const x of [-dims.width / 2, dims.width / 2]) {
    for (const y of [-targetY - .6, dims.height - targetY + .6]) {
      for (const z of [-dims.depth / 2, dims.depth / 2]) {
        const horizontal = x * Math.cos(yaw) - z * Math.sin(yaw);
        const vertical = -x * Math.sin(yaw) * Math.sin(pitch) + y * Math.cos(pitch) - z * Math.cos(yaw) * Math.sin(pitch);
        const depth = x * Math.sin(yaw) * Math.cos(pitch) + y * Math.sin(pitch) + z * Math.cos(yaw) * Math.cos(pitch);
        distance = Math.max(distance, depth + Math.abs(horizontal) / tanHorizontal, depth + Math.abs(vertical) / tanVertical);
      }
    }
  }
  return distance;
}

/** Frame the observed object's whole path between the sand and water surface. */
export function waterObservationDistance(base:number,dims:TankDimensions,waterLevel:number,aspect:number,yaw:number,pitch:number,target:{x:number;y:number;z:number},point:{x:number;z:number},radius:number) {
  let distance=base*(aspect<1?.9:.8);
  const tanVertical=Math.tan(20*Math.PI/180)*.9;
  const tanHorizontal=tanVertical*Math.max(.1,aspect);
  for(const x of [point.x-radius-target.x,point.x+radius-target.x])
    for(const y of [dims.height*.085-.05-target.y,waterLevel+radius*2+.08-target.y])
      for(const z of [point.z-radius-target.z,point.z+radius-target.z]){
        const horizontal=x*Math.cos(yaw)-z*Math.sin(yaw);
        const vertical=-x*Math.sin(yaw)*Math.sin(pitch)+y*Math.cos(pitch)-z*Math.cos(yaw)*Math.sin(pitch);
        const depth=x*Math.sin(yaw)*Math.cos(pitch)+y*Math.sin(pitch)+z*Math.cos(yaw)*Math.cos(pitch);
        distance=Math.max(distance,depth+Math.abs(horizontal)/tanHorizontal,depth+Math.abs(vertical)/tanVertical);
      }
  return distance;
}

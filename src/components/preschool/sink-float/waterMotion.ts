export interface WaterImpulse { x: number; z: number; time: number; strength: number }

export function waterEdgeFade(x:number,z:number,shape:string,width:number,depth:number):number {
  let distance = Math.min(width/2-Math.abs(x),depth/2-Math.abs(z));
  if(shape==='cylinder') distance=width/2-Math.hypot(x,z);
  if(shape==='triangle') {
    const sideLength=Math.hypot(width/2,depth);
    distance=Math.min(depth/2-z,(depth*x+width*z/2+width*depth/4)/sideLength,(-depth*x+width*z/2+width*depth/4)/sideLength);
  }
  const value=Math.max(0,Math.min(1,distance/.25));
  return value*value*(3-2*value);
}

/** Small travelling waves; the simulation's mean water level is unchanged. */
export function waterDisplacement(x: number, z: number, time: number, impulses: WaterImpulse[]): number {
  let height = Math.sin(x * 1.6 + time * 1.2) * Math.cos(z * 1.3 - time * .8) * .012;
  for (const impulse of impulses) {
    const age = time - impulse.time;
    if (age < 0 || age > 2.4) continue;
    const distance = Math.hypot(x - impulse.x, z - impulse.z);
    const front = distance - age * 2.8;
    height += Math.sin(front * 8) * Math.exp(-front * front * 2.5) * Math.exp(-age * 1.8)
      * Math.min(3, Math.max(0, impulse.strength)) * .035;
  }
  return Math.max(-.12, Math.min(.12, height));
}

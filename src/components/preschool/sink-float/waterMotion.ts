export interface WaterImpulse { x: number; z: number; time: number; strength: number }

/** A local entry depression followed by a dispersing, damped wave packet. */
export function contactWave(distance:number,age:number,strength:number):number {
  if(age<0||age>2.4)return 0;
  const front=distance-age*1.6;
  const width=.16+age*.1;
  const packet=Math.sin(front*18)*Math.exp(-front*front/(width*width))
    *(1-Math.exp(-age*20))*Math.exp(-age*1.5)/Math.sqrt(1+distance*3);
  const depression=-Math.exp(-distance*distance*14-age*9)*.04;
  return Math.min(3,Math.max(0,strength))*(packet*.025+depression);
}

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
  let height = Math.sin(x * 1.6 + time * 1.2) * Math.cos(z * 1.3 - time * .8) * .003;
  for (const impulse of impulses) {
    const age = time - impulse.time;
    if (age < 0 || age > 2.4) continue;
    const distance = Math.hypot(x - impulse.x, z - impulse.z);
    height += contactWave(distance,age,impulse.strength);
  }
  return Math.max(-.12, Math.min(.12, height));
}

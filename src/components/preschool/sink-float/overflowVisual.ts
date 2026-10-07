import {TankDimensions,TankShape} from './types';
/** Equal-height rims spill along every side; points also place the floor puddles. */
export function overflowOutlets(shape:TankShape,d:TankDimensions){
  if(shape==='cylinder')return Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,nx=Math.cos(a),nz=Math.sin(a);return {x:nx*d.width/2,z:nz*d.width/2,nx,nz};});
  const vertices=shape==='triangle'?[{x:0,z:-d.depth/2},{x:d.width/2,z:d.depth/2},{x:-d.width/2,z:d.depth/2}]:[{x:-d.width/2,z:-d.depth/2},{x:d.width/2,z:-d.depth/2},{x:d.width/2,z:d.depth/2},{x:-d.width/2,z:d.depth/2}];
  return vertices.flatMap((a,i)=>{const b=vertices[(i+1)%vertices.length],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);return [.3,.7].map(t=>({x:a.x+dx*t,z:a.z+dz*t,nx:dz/length,nz:-dx/length}));});
}

import * as THREE from 'three';
import {TankDimensions,TankShape} from './types';
import {clampToTankBoundary} from './tankGeometry';

// Only the visible mouth matters: no ray/plane intersection or spout orientation gate.
export function pitcherMouthPoint(x:number,y:number,camera:THREE.Camera,rect:{left:number;top:number;width:number;height:number},shape:TankShape,d:TankDimensions,tolerance=65){
  const vertices=shape==='cylinder'
    ?Array.from({length:48},(_,i)=>({x:Math.cos(i*Math.PI/24)*d.width/2,z:Math.sin(i*Math.PI/24)*d.depth/2}))
    :shape==='triangle'?[{x:0,z:-d.depth/2},{x:d.width/2,z:d.depth/2},{x:-d.width/2,z:d.depth/2}]
    :[{x:-d.width/2,z:-d.depth/2},{x:d.width/2,z:-d.depth/2},{x:d.width/2,z:d.depth/2},{x:-d.width/2,z:d.depth/2}];
  const project=(world:{x:number;z:number})=>{
    const p=new THREE.Vector3(world.x,d.height,world.z).project(camera);
    return {x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2,world};
  };
  const points=vertices.map(project),center=project({x:0,z:0});
  let distance=Infinity,closest={x:0,z:0};
  for(let i=0;i<points.length;i++){
    const a=points[i],b=points[(i+1)%points.length];
    const denominator=(a.y-b.y)*(center.x-b.x)+(b.x-a.x)*(center.y-b.y);
    if(Math.abs(denominator)>1e-8){
      const u=((a.y-b.y)*(x-b.x)+(b.x-a.x)*(y-b.y))/denominator;
      const v=((b.y-center.y)*(x-b.x)+(center.x-b.x)*(y-b.y))/denominator;
      const w=1-u-v;
      if(u>=0&&v>=0&&w>=0)return clampToTankBoundary(v*a.world.x+w*b.world.x,v*a.world.z+w*b.world.z,.15,shape,d);
    }
    const dx=b.x-a.x,dy=b.y-a.y;
    const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1)));
    const gap=Math.hypot(x-a.x-t*dx,y-a.y-t*dy);
    if(gap<distance){distance=gap;closest={x:a.world.x+t*(b.world.x-a.world.x),z:a.world.z+t*(b.world.z-a.world.z)};}
  }
  return distance<=tolerance?clampToTankBoundary(closest.x,closest.z,.15,shape,d):null;
}

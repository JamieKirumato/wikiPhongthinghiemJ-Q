import * as THREE from 'three';
import {TankDimensions,TankShape} from './types';
import {clampToTankBoundary} from './tankGeometry';
import {advanceAirFall} from './playPhysics';
export interface PreviewVelocity {vx:number;vy:number;sampledAt?:number;duration?:number}

export function boundedZoom(current:number,delta:number){return Math.max(.96,Math.min(1.65,current*Math.exp(Math.max(-300,Math.min(300,delta))*.001)));}

// All object releases stay within the tank, even when the pointer is outside.
export function releasePosition(ray:THREE.Ray,dims:TankDimensions,shape:TankShape,water:number,height:number,radius:number){
  const surface=Math.max(water+radius+.12,height),point=new THREE.Vector3();
  if(!ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-surface),point))point.set(0,surface,0);
  const safe=clampToTankBoundary(point.x,point.z,radius,shape,dims);
  return new THREE.Vector3(safe.x,surface,safe.z);
}

/** Keep the eventual water contact horizontally aligned with the child's finger.
 * With a tilted camera, a vertical fall can otherwise appear to drift sideways.
 */
export function alignDropToScreenX(position:THREE.Vector3,camera:THREE.Camera,targetNdcX:number,dims:TankDimensions,shape:TankShape,water:number,radius:number){
  const projected=new THREE.Vector3();
  let best=position.clone(),bestScore=Infinity;
  const score=(x:number,z:number)=>{
    const safe=clampToTankBoundary(x,z,radius,shape,dims);
    projected.set(safe.x,water+radius,safe.z).project(camera);
    const screenError=projected.x-targetNdcX;
    const travel=Math.hypot(safe.x-position.x,safe.z-position.z);
    const value=screenError*screenError*120+travel*travel*.012;
    if(value<bestScore){bestScore=value;best.set(safe.x,position.y,safe.z);}
  };
  score(position.x,position.z);
  for(let xi=0;xi<=24;xi++)for(let zi=0;zi<=12;zi++){
    score((xi/24-.5)*dims.width,(zi/12-.5)*dims.depth);
  }
  return best;
}

// Map the gesture onto the camera's screen plane, including its depth component.
export function throwVelocity(camera:THREE.Camera,velocity:{vx:number;vy:number}){
  const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
  return right.multiplyScalar(Math.max(-2.5,Math.min(2.5,velocity.vx*.003)))
    .addScaledVector(up,Math.max(-4,Math.min(4,-velocity.vy*.004)));
}

export function predictedContact(position:THREE.Vector3,velocity:THREE.Vector3,dims:TankDimensions,shape:TankShape,water:number,radius:number,drag=0){
  let last=position.clone();
  const horizontal=position.clone(),speed=velocity.clone();
  if(position.y-radius<=water){const safe=clampToTankBoundary(position.x,position.z,radius,shape,dims);return {point:new THREE.Vector3(safe.x,water,safe.z),inside:true};}
  const dt=1/120;
  for(let t=dt;t<=12;t+=dt){
    horizontal.x+=speed.x*dt;horizontal.z+=speed.z*dt;
    const safe=clampToTankBoundary(horizontal.x,horizontal.z,radius,shape,dims);
    if(safe.x!==horizontal.x)speed.x*=-.25;
    if(safe.z!==horizontal.z)speed.z*=-.25;
    horizontal.set(safe.x,0,safe.z);
    const fall=advanceAirFall(last.y,speed.y,dt,drag);speed.y=fall.vy;
    const next=new THREE.Vector3(horizontal.x,fall.y,horizontal.z);
    const level=water;
    if(next.y-radius<=level&&last.y-radius>=level){
      const fraction=(last.y-radius-level)/Math.max(1e-9,last.y-next.y);
      const hit=last.clone().lerp(next,fraction),safe=clampToTankBoundary(hit.x,hit.z,radius,shape,dims);
      return {point:new THREE.Vector3(safe.x,level,safe.z),inside:true};
    }
    last=next;
  }
  return null;
}

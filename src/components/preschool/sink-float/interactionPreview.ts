import * as THREE from 'three';
import {TankDimensions,TankShape} from './types';
import {clampToTankBoundary} from './tankGeometry';
import {DISPLAY_GRAVITY} from './playPhysics';

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

export function predictedContact(position:THREE.Vector3,velocity:THREE.Vector3,dims:TankDimensions,shape:TankShape,water:number,radius:number){
  let last=position.clone();
  const horizontal=position.clone(),speed=velocity.clone();
  for(let t=.02;t<=3;t+=.02){
    horizontal.x+=speed.x*.02;horizontal.z+=speed.z*.02;
    const safe=clampToTankBoundary(horizontal.x,horizontal.z,radius,shape,dims);
    if(safe.x!==horizontal.x)speed.x*=-.25;
    if(safe.z!==horizontal.z)speed.z*=-.25;
    horizontal.set(safe.x,0,safe.z);
    const next=new THREE.Vector3(horizontal.x,position.y+velocity.y*t-.5*DISPLAY_GRAVITY*t*t,horizontal.z);
    const level=water;
    if(next.y-radius<=level&&last.y-radius>=level){const safe=clampToTankBoundary(next.x,next.z,radius,shape,dims);return {point:new THREE.Vector3(safe.x,level,safe.z),inside:true};}
    last=next;
  }
  return null;
}

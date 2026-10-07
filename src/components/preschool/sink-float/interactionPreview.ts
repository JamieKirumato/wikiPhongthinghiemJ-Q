import * as THREE from 'three';
import {TankDimensions,TankShape} from './types';
import {clampToTankBoundary} from './tankGeometry';
import {DISPLAY_GRAVITY} from './playPhysics';

export function boundedZoom(current:number,delta:number){return Math.max(.96,Math.min(1.65,current*Math.exp(Math.max(-300,Math.min(300,delta))*.001)));}

// All object releases stay within the tank, even when the pointer is outside.
export function releasePosition(ray:THREE.Ray,dims:TankDimensions,shape:TankShape,water:number,_height:number,radius:number){
  const surface=Math.max(.01,water),point=new THREE.Vector3();
  if(!ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-surface),point))point.set(0,surface,0);
  const safe=clampToTankBoundary(point.x,point.z,radius,shape,dims);
  return new THREE.Vector3(safe.x,surface+radius+.12,safe.z);
}

export function predictedContact(position:THREE.Vector3,velocity:THREE.Vector3,dims:TankDimensions,shape:TankShape,water:number,radius:number){
  let last=position.clone();
  for(let t=.02;t<=3;t+=.02){
    const next=new THREE.Vector3(position.x+velocity.x*t,position.y+velocity.y*t-.5*DISPLAY_GRAVITY*t*t,position.z+velocity.z*t);
    const level=water;
    if(next.y-radius<=level&&last.y-radius>=level){const safe=clampToTankBoundary(next.x,next.z,radius,shape,dims);return {point:new THREE.Vector3(safe.x,level,safe.z),inside:true};}
    last=next;
  }
  return null;
}

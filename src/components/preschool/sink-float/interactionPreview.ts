import * as THREE from 'three';
import {TankDimensions,TankShape} from './types';
import {isPointInsideFootprint} from './tankGeometry';
import {DISPLAY_GRAVITY} from './playPhysics';

export function boundedZoom(current:number,delta:number){return Math.max(.96,Math.min(1.65,current*Math.exp(Math.max(-300,Math.min(300,delta))*.001)));}

// Visible water selects depth in the tank; visible floor selects positions outside it.
export function releasePosition(ray:THREE.Ray,dims:TankDimensions,shape:TankShape,water:number,height:number,radius:number){
  const surface=Math.max(.01,water),point=new THREE.Vector3();
  if(ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-surface),point)&&isPointInsideFootprint(point.x,point.z,shape,dims,-radius)){
    return new THREE.Vector3(point.x,Math.max(surface+radius+.65,height),point.z);
  }
  const floor=new THREE.Vector3();
  if(ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),.6),floor)&&floor.distanceTo(ray.origin)<50){
    // Do not silently move an outside pointer back inside the tank.
    if(!isPointInsideFootprint(floor.x,floor.z,shape,dims,-radius))return new THREE.Vector3(floor.x,Math.max(radius+.4,height),floor.z);
  }
  return null;
}

export function predictedContact(position:THREE.Vector3,velocity:THREE.Vector3,dims:TankDimensions,shape:TankShape,water:number,radius:number){
  let last=position.clone();
  for(let t=.02;t<=3;t+=.02){
    const next=new THREE.Vector3(position.x+velocity.x*t,position.y+velocity.y*t-.5*DISPLAY_GRAVITY*t*t,position.z+velocity.z*t);
    const inside=isPointInsideFootprint(next.x,next.z,shape,dims,-radius);
    const level=inside?water:-.6;
    if(next.y-radius<=level&&last.y-radius>=level)return {point:new THREE.Vector3(next.x,level,next.z),inside};
    last=next;
  }
  return null;
}

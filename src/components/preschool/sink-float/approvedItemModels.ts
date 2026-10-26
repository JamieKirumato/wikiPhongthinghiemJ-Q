import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {prepareApprovedMaterials} from './approvedMaterials';
import {disposeItemModel} from './itemModels';
import {itemKind} from './playPhysics';
import {ITEM_WORLD_SCALES} from './itemScale';
import {floatingCenterY} from './buoyancy';
import type {TankObject} from './types';

const files:Record<string,string>={
 'item-pingpong':'football-v3','item-duck':'duck-v6','item-egg':'egg-v6',
 'item-keys':'keys-v7','item-leaf':'leaf-v7','item-marble':'marble-v7','item-spoon':'spoon-v7'
};
const requests=new Map<string,Promise<THREE.Group>>();
const templates=new Map<string,THREE.Group>();
function load(kind:string){
 let request=requests.get(kind);
 if(!request){
  request=new GLTFLoader().loadAsync(`/assets/models/sink-float/${files[kind]}.glb`).then(gltf=>{
   prepareApprovedMaterials(gltf.scene,kind.replace('item-',''));templates.set(kind,gltf.scene);return gltf.scene;
  }).catch(error=>{requests.delete(kind);throw error;});requests.set(kind,request);
 }
 return request;
}
function install(group:THREE.Group,template:THREE.Group,id:string,size:number,radius:number){
 if(group.userData.disposed||group.userData.damage)return;
 const model=template.clone(true);
 model.traverse(child=>{if(child instanceof THREE.Mesh){child.geometry=child.geometry.clone();child.material=Array.isArray(child.material)?child.material.map(m=>m.clone()):child.material.clone();child.castShadow=true;child.receiveShadow=true;child.userData.itemId=id;}});
 const bounds=new THREE.Box3().setFromObject(model),extent=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
 const fit=2*radius/size/Math.max(extent.x,extent.y,extent.z);model.scale.multiplyScalar(fit);model.position.addScaledVector(center,-fit);
 model.updateMatrixWorld(true);
 const support:THREE.Vector3[]=[];
 model.traverse(child=>{if(child instanceof THREE.Mesh){const p=child.geometry.attributes.position;const step=Math.max(1,Math.floor(p.count/200));for(let i=0;i<p.count;i+=step)support.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(child.matrixWorld).multiplyScalar(size));}});
 group.children.forEach(disposeItemModel);group.clear();group.add(model);
 group.userData.support=support;group.userData.approvedModel=true;group.userData.visualSource=files[itemKind(id)];
}
export function attachApprovedModel(group:THREE.Group,id:string,size:number,radius:number){
 const kind=itemKind(id);if(!files[kind])return false;
 const template=templates.get(kind);
 if(template)install(group,template,id,size,radius);
 else void load(kind).then(model=>install(group,model,id,size,radius)).catch(()=>{if(!group.userData.disposed)group.userData.visualSource='mesh-fallback';});
 return true;
}
export function preloadApprovedModels(){return Promise.all(Object.keys(files).map(load));}

// Match the visible shape to its support surface without changing physical coordinates.
export function applyApprovedVisualPose(mesh:THREE.Group,item:TankObject,water:number,bed:number,now:number,waterDensity=1){

  const kind=itemKind(item.id),r=ITEM_WORLD_SCALES[kind]?.radius;
  if(!mesh.userData.approvedModel||item.damage||item.outsideTank||!r||!['item-duck','item-keys','item-leaf','item-marble','item-spoon','item-egg'].includes(kind))return;
  const smooth=(x:number)=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
  const wet=kind==='item-leaf'
    ?smooth((water+r-item.y)/Math.max(.04,water+r-floatingCenterY(r,water,item.weightGrams/item.volumeMl/waterDensity)))
    :smooth((water+r-item.y)/(2*r));
  const sinking=item.weightGrams/item.volumeMl>waterDensity;
  if(kind!=='item-marble'){
    const underwater=smooth((water-item.y)/(Math.max(.1,water-bed-r)*.7));
    const flat=kind==='item-leaf'||kind==='item-keys'||kind==='item-spoon';
    const tilt=flat?.08:kind==='item-egg'?.13:.025;
    const finalRoll=kind==='item-egg'?1.04:0;
    const blend=sinking?underwater:wet;
    const roll=THREE.MathUtils.degToRad(item.angle)*(1-blend)+finalRoll*blend;
    mesh.rotation.set(tilt+Math.sin(now*.0017)*.025*wet,flat?-.6:Math.sin(now*.0003)*.10,roll);
  }
  const points=mesh.userData.support as THREE.Vector3[]|undefined;
  if(!points?.length)return;
  const rot=new THREE.Matrix4().makeRotationFromQuaternion(mesh.quaternion).elements;
  let min=Infinity,max=-Infinity;
  for(const p of points){const y=rot[1]*p.x+rot[5]*p.y+rot[9]*p.z;min=Math.min(min,y);max=Math.max(max,y);}
  const ratio=item.weightGrams/item.volumeMl/waterDensity;
  const physicalRest=floatingCenterY(r,water,ratio);
  const restingOnBed=!sinking&&physicalRest<=bed+r&&item.y<=bed+r+.01;
  if(sinking||restingOnBed){
    const nearBed=smooth((bed+3*r-item.y)/(2*r));
    mesh.position.y+=(-r-min)*nearBed;
  }else{
    const immersion=kind==='item-leaf'?.008:(max-min)*(kind==='item-egg'?THREE.MathUtils.clamp((water-physicalRest+r)/(2*r),0,1):.18);
    mesh.position.y+=(water-min-immersion-physicalRest)*wet;
  }
  mesh.updateMatrixWorld(true);
  if(kind==='item-leaf')mesh.traverse(child=>{if(child.name.startsWith('Leaf_dew_water_drop')||child.name.startsWith('Leaf dew water drop'))child.visible=child.getWorldPosition(new THREE.Vector3()).y>water+.005;});
}

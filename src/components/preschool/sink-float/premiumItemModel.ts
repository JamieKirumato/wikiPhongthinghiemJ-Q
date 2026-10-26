import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createItemModel as createPrimitive, disposeItemModel as disposePrimitive } from './itemModels';
import { itemKind } from './playPhysics';

import {attachApprovedModel} from './approvedItemModels';

let apple: Promise<THREE.Group> | undefined;
const surfaceTextures=new Map<string,THREE.CanvasTexture>();
function surfaceTexture(kind:string) {
  const existing=surfaceTextures.get(kind);if(existing)return existing;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const context=canvas.getContext('2d')!,pixels=context.createImageData(256,256);
  let seed=7341;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    seed=(seed*1664525+1013904223)>>>0;
    const noise=(seed>>>16)/65535,spot=noise<.025?-24:0;
    const index=(y*256+x)*4;
    const base=kind==='item-egg'?[218,173,119]:[143,145,136];
    const grain=kind==='item-egg'?(noise-.5)*10+spot:(noise-.5)*60+Math.sin(x*.08+y*.09)*9;
    for(let c=0;c<3;c++)pixels.data[index+c]=base[c]+grain;
    pixels.data[index+3]=255;
  }
  context.putImageData(pixels,0,0);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  surfaceTextures.set(kind,texture);return texture;
}
function loadApple() {
  return apple ??= new GLTFLoader().loadAsync('/assets/models/apple/food_apple_01_1k.gltf')
    .then(gltf => gltf.scene).catch(error => { apple = undefined; throw error; });
}

/** Real meshes keep rotating with the scene. Photos remain in the object tray. */
export function createItemModel(id: string, size: number, _image?: string, radius = size * .5): THREE.Group {
  const group = createPrimitive(id, size);
  group.userData.visualSource = 'mesh';
  const kind=itemKind(id);
  group.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true; child.receiveShadow = true;
      if (child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = .7;
        if(kind==='item-egg'||kind==='item-pebble'){
          child.material.map=surfaceTexture(kind);child.material.color.setHex(0xffffff);
          child.material.vertexColors=false;child.material.roughness=kind==='item-egg'?.64:.88;
          child.material.bumpMap=child.material.map;child.material.bumpScale=kind==='item-egg'?.008:.018;
        }
      }
    }
  });
  attachApprovedModel(group,id,size,radius);
  if (itemKind(id) === 'item-apple') {
    void loadApple().then(template => {
      if (group.userData.disposed || group.userData.damage) return;
      const model = template.clone(true);
      model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          // Each placed object owns geometry/material; the cached textures are shared.
          child.geometry = child.geometry.clone();
          child.material = Array.isArray(child.material) ? child.material.map(m => m.clone()) : child.material.clone();
          child.castShadow = true; child.receiveShadow = true; child.userData.itemId = id;
        }
      });
      const bounds = new THREE.Box3().setFromObject(model);
      const extent = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      // Match the existing collision radius without changing educational physics.
      const fit = radius * 2 / size / Math.max(extent.x, extent.y, extent.z);
      model.scale.multiplyScalar(fit); model.position.addScaledVector(center, -fit);
      group.children.forEach(child => disposePrimitive(child)); group.clear(); group.add(model);
      group.userData.visualSource = 'poly-haven-apple';
    }).catch(() => { group.userData.visualSource = 'mesh-fallback'; });
  }
  return group;
}

export function disposeItemModel(group: THREE.Object3D) {
  group.userData.disposed = true;
  disposePrimitive(group);
}

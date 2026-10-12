import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createItemModel as createPrimitive, disposeItemModel as disposePrimitive } from './itemModels';
import { itemKind } from './playPhysics';

let apple: Promise<THREE.Group> | undefined;
function loadApple() {
  return apple ??= new GLTFLoader().loadAsync('/assets/models/apple/food_apple_01_1k.gltf')
    .then(gltf => gltf.scene).catch(error => { apple = undefined; throw error; });
}

/** Real meshes keep rotating with the scene. Photos remain in the object tray. */
export function createItemModel(id: string, size: number, _image?: string, radius = size * .5): THREE.Group {
  const group = createPrimitive(id, size);
  group.userData.visualSource = 'mesh';
  group.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true; child.receiveShadow = true;
      if (child.material instanceof THREE.MeshStandardMaterial) child.material.envMapIntensity = .7;
    }
  });
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

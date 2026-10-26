import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';

// One neutral setup is shared by the product viewer and the in-tank pilot.
export function configureObjectStudio(renderer:THREE.WebGLRenderer,scene:THREE.Scene,{center=new THREE.Vector3(),scale=1}={}){
  renderer.toneMapping=THREE.NeutralToneMapping;
  renderer.toneMappingExposure=1.0;
  RectAreaLightUniformsLib.init();
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const env=pmrem.fromScene(room,.035);scene.environment=env.texture;scene.environmentIntensity=.65;
  room.dispose();pmrem.dispose();
  const hemi=new THREE.HemisphereLight(0xffffff,0xd4d4d4,.45);
  const key=new THREE.RectAreaLight(0xffffff,5,4*scale,4*scale);key.position.set(-2.4,3.5,4).multiplyScalar(scale).add(center);key.lookAt(center);
  const fill=new THREE.RectAreaLight(0xffffff,3.3,4*scale,4*scale);fill.position.set(4,1.5,1.5).multiplyScalar(scale).add(center);fill.lookAt(center);
  scene.add(hemi,key,fill);
  return {dispose(){scene.remove(hemi,key,fill);env.dispose();}};
}

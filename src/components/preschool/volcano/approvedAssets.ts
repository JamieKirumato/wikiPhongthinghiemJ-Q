import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const APPROVED_VOLCANO_URL='/assets/volcano/blender-v3/volcano-approved-v3.glb';

/** Real Blender geometry, with glass composited over the classroom background. */
export async function loadApprovedVolcano(){
  const {scene}=await new GLTFLoader().loadAsync(APPROVED_VOLCANO_URL);
  const seen=new Set<THREE.Material>();
  scene.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    object.castShadow=object.receiveShadow=true;
    for(const source of Array.isArray(object.material)?object.material:[object.material]){
      if(seen.has(source))continue;seen.add(source);
      const material=source as THREE.MeshPhysicalMaterial,name=material.name;
      if(name.includes('Clear glass')||name.includes('transparent cup')){
        material.transmission=0;material.transparent=true;material.opacity=1;material.depthWrite=false;
        material.roughness=.07;material.envMapIntensity=1.1;material.side=THREE.DoubleSide;
        material.onBeforeCompile=shader=>{
          shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\nfloat edgeAlpha=pow(1.0-abs(dot(normal,normalize(vViewPosition))),2.0);diffuseColor.a*=0.035+0.6*edgeAlpha;');
        };
      }else if(name.includes('Clear vinegar')){
        material.transmission=0;material.transparent=true;material.opacity=.24;material.depthWrite=false;material.roughness=.09;
      }else if(name.includes('Cocoa clay details')){
        material.color.setRGB(.15,.052,.024);
      }else if(name.includes('Ruby transparent')){
        material.transmission=0;material.transparent=true;material.opacity=.9;material.roughness=.18;
      }
      material.needsUpdate=true;
    }
  });
  const take=(name:string)=>{
    const object=scene.getObjectByName(name);
    if(!object)throw new Error(`Missing Blender model part: ${name}`);
    return object.clone(true);
  };
  const dispose=()=>{
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
    scene.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);}});
    materials.forEach(material=>{for(const value of Object.values(material))if(value instanceof THREE.Texture)textures.add(value);material.dispose();});
    geometries.forEach(geometry=>geometry.dispose());textures.forEach(texture=>texture.dispose());
  };
  return{take,dispose};
}

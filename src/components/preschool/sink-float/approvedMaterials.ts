import * as THREE from 'three';
export function prepareApprovedMaterials(root:THREE.Object3D,kind:string){
  root.traverse(child=>{if(!(child instanceof THREE.Mesh))return;
    const materials=Array.isArray(child.material)?child.material:[child.material];
    for(const mat of materials){
      if(kind==='marble'&&mat.name.includes('solid clear marble glass')&&mat instanceof THREE.MeshPhysicalMaterial){
        mat.color.setRGB(1,1,1);mat.transmission=1;mat.thickness=.42;mat.ior=1.52;mat.roughness=.027;mat.attenuationDistance=8;mat.attenuationColor.setRGB(.985,.997,1);mat.dispersion=.025;mat.specularIntensity=.28;mat.envMapIntensity=.28;mat.side=THREE.FrontSide;mat.userData.marbleGlass=true;mat.needsUpdate=true;
      }
      if(kind==='leaf'&&mat.name.includes('clear dew')&&mat instanceof THREE.MeshPhysicalMaterial){
        mat.thickness=.035;mat.ior=1.333;mat.roughness=.025;mat.attenuationDistance=Infinity;mat.specularIntensity=.65;mat.needsUpdate=true;
      }
    }
  });
}
export function updateApprovedOptics(root:THREE.Object3D,water:number){
  root.traverse(child=>{if(!(child instanceof THREE.Mesh))return;
    const materials=Array.isArray(child.material)?child.material:[child.material];
    for(const mat of materials)if(mat.userData.marbleGlass){const p=child.getWorldPosition(new THREE.Vector3());const scale=child.getWorldScale(new THREE.Vector3()).x;const fraction=THREE.MathUtils.clamp((water-p.y+.5*scale)/Math.max(.001,scale),0,1);mat.ior=1.52/(1+.333*fraction);}
  });
}

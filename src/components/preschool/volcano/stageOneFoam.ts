import * as THREE from 'three';
import { StageOneState } from './stageOneModel';
import { ClaySurface, traceClayFlow } from './clayModel';

/** Qualitative fizz and finite wet traces. No implicit soap, heat or extra liquid. */
export function createStageOneFoam(scene: THREE.Scene, surface:()=>ClaySurface) {
  const geometry=new THREE.SphereGeometry(1,12,8);
  const bubbleMaterial=new THREE.MeshPhysicalMaterial({color:0xfffcf0,roughness:.13,transparent:true,opacity:.58,clearcoat:1,depthWrite:false});
  const bubbles=new THREE.InstancedMesh(geometry,bubbleMaterial,120);bubbles.frustumCulled=false;scene.add(bubbles);
  const wetBase=new THREE.MeshPhysicalMaterial({color:0xe4dfca,roughness:.11,transparent:true,opacity:.68,clearcoat:1,depthWrite:false,side:THREE.DoubleSide});
  const angles=[.5,1.2,2.4,3.5,4.65,5.65];
  const paths=angles.map((angle,index)=>{
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(73*6),3));
    const uv:number[]=[],indices:number[]=[];
    for(let j=0;j<=72;j++){uv.push(j/72,0,j/72,1);if(j<72){const k=j*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);
    const reach={value:0},m=wetBase.clone();
    m.onBeforeCompile=shader=>{shader.uniforms.uReach=reach;shader.vertexShader='varying vec2 vWetUv;\n'+shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvWetUv=uv;');shader.fragmentShader='uniform float uReach;varying vec2 vWetUv;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=1.0-smoothstep(max(0.0,uReach-.035),uReach,vWetUv.x);');};
    const mesh=new THREE.Mesh(g,m);mesh.receiveShadow=true;mesh.frustumCulled=false;scene.add(mesh);
    return{mesh,reach,angle,weight:.8+(index%3)*.2};
  });
  const puddleGeometry=new THREE.CircleGeometry(1,64),puddle=new THREE.Mesh(puddleGeometry,wetBase);puddle.rotation.x=-Math.PI/2;puddle.position.set(.09,.112,0);scene.add(puddle);
  const dummy=new THREE.Object3D(),clear=new THREE.Color(0xe9e5d1),red=new THREE.Color(),pink=new THREE.Color(0xf7a18d),white=new THREE.Color(0xfffcf0);
  let revision=-1,lastSurface:ClaySurface|undefined,lastGas=0,activity=0,clock=0;
  function rebuild(){
    const s=surface();if(s===lastSurface&&s.revision===revision)return;revision=s.revision;lastSurface=s;
    paths.forEach(path=>{
      const points=traceClayFlow(s,path.angle),position=path.mesh.geometry.getAttribute('position');
      points.forEach((point,j)=>{const width=(.018+j/72*.028)*(1+Math.sin(j*.7+path.angle)*.18);for(let side=0;side<2;side++){const sign=side?1:-1;position.setXYZ(j*2+side,point.x-Math.sin(point.angle)*width*sign,point.y,point.z+Math.cos(point.angle)*width*sign);}});
      position.needsUpdate=true;path.mesh.geometry.computeVertexNormals();path.mesh.geometry.computeBoundingSphere();
    });
  }
  return {
    update(state:StageOneState,waterY:number,dt:number){
      rebuild();const r=state.reaction;
      if(r.gasMl<lastGas||!r.reacted)activity=0;
      const rate=Math.max(0,r.gasMl-lastGas)/Math.max(.001,dt);lastGas=r.gasMl;activity=THREE.MathUtils.lerp(activity,rate,1-Math.exp(-dt*5));clock+=dt;
      const intensity=Math.min(1,r.foam*3+activity/650),count=r.reacted&&intensity>.003?Math.ceil(110*Math.sqrt(intensity)):0;
      bubbleMaterial.color.copy(white).lerp(pink,state.colorMix*.55);
      red.setHSL(.015,.9,.52-state.colorMix*.18,THREE.SRGBColorSpace);
      wetBase.color.copy(clear).lerp(red,1-Math.exp(-state.colorMix*8));wetBase.opacity=.44+state.colorMix*.45;
      const foamHeight=Math.min(.6,r.foam*3);
      for(let i=0;i<count;i++){
        const a=i*2.39996,radial=Math.sqrt(((i*17)%113)/113)*.32,phase=(clock*(.8+i%5*.1)+i*.618)%1,life=Math.sin(Math.PI*phase);
        const size=(.014+(i%6)*.005)*(.3+life*.75);
        dummy.position.set(.09+Math.cos(a)*radial,waterY+.018+foamHeight*(1-radial*1.3)+phase*.025,Math.sin(a)*radial);
        dummy.scale.set(size,size*(.85+life*.2),size);dummy.updateMatrix();bubbles.setMatrixAt(i,dummy.matrix);
      }
      bubbles.count=count;bubbles.instanceMatrix.needsUpdate=true;
      paths.forEach(path=>{path.reach.value=Math.min(1,state.runoffMl/12*path.weight);path.mesh.visible=path.reach.value>.008;path.mesh.material.color.copy(wetBase.color);path.mesh.material.opacity=wetBase.opacity;});
      const pool=Math.max(0,state.runoffMl-12);puddle.visible=pool>.05;
      const size=Math.min(1.85,.35+Math.sqrt(pool/50)*1.5);puddle.scale.set(size,size*.8,1);
    },
    dispose(){bubbles.removeFromParent();bubbles.dispose();geometry.dispose();bubbleMaterial.dispose();paths.forEach(p=>{p.mesh.removeFromParent();p.mesh.geometry.dispose();p.mesh.material.dispose();});puddle.removeFromParent();puddleGeometry.dispose();wetBase.dispose();},
  };
}

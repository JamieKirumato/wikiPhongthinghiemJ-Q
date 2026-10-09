import * as THREE from 'three';
import { WaterImpulse } from './waterMotion';

/** Animate only the skin of the water on the GPU; never move its mean level. */
export function configureWaterSurface(material: THREE.MeshPhongMaterial, width:number, depth:number, shape:string) {
  const uniforms={
    waterTime:{value:0},
    waterSize:{value:new THREE.Vector2(width,depth)},
    waterShape:{value:shape==='cylinder'?1:shape==='triangle'?2:0},
    waterImpulses:{value:Array.from({length:8},()=>new THREE.Vector4(0,0,0,0))},
    waterStir:{value:new THREE.Vector4(0,0,-10,0)}
  };
  material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>
uniform float waterTime;
uniform vec2 waterSize;
uniform int waterShape;
uniform vec4 waterImpulses[8];
uniform vec4 waterStir;
float waterWave(vec2 p) {
  float edge=min(waterSize.x*.5-abs(p.x),waterSize.y*.5-abs(p.y));
  if(waterShape==1) edge=waterSize.x*.5-length(p);
  if(waterShape==2) {
    float side=length(vec2(waterSize.x*.5,waterSize.y));
    edge=min(waterSize.y*.5-p.y,min((waterSize.y*p.x+waterSize.x*p.y*.5+waterSize.x*waterSize.y*.25)/side,(-waterSize.y*p.x+waterSize.x*p.y*.5+waterSize.x*waterSize.y*.25)/side));
  }
  float h=sin(p.x*1.6+waterTime*1.2)*cos(p.y*1.3-waterTime*.8)*.006;
  for(int i=0;i<8;i++) {
    vec4 impulse=waterImpulses[i];
    float age=waterTime-impulse.z;
    if(age>=0. && age<2.4 && impulse.w>0.) {
      float front=length(p-impulse.xy)-age*2.8;
      h+=sin(front*8.)*exp(-front*front*2.5-age*1.8)*min(3.,impulse.w)*.035;
    }
  }
  float stirAge=waterTime-waterStir.z;
  if(stirAge>=0. && stirAge<1.2 && waterStir.w>0.) {
    vec2 offset=p-waterStir.xy;
    float radius=length(offset);
    float whirl=atan(offset.y,offset.x);
    float fade=exp(-radius*radius*1.8)*(1.-smoothstep(0.,1.2,stirAge));
    h+=sin(whirl*3.-waterTime*8.+radius*7.)*.07*fade*waterStir.w;
    h+=sin(radius*17.-waterTime*12.)*.028*fade*waterStir.w;
  }
  return clamp(h,-.13,.13)*smoothstep(0.,.25,edge);
}
`);
    shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
float dx=(waterWave(position.xz+vec2(.02,0.))-waterWave(position.xz-vec2(.02,0.)))/.04;
float dz=(waterWave(position.xz+vec2(0.,.02))-waterWave(position.xz-vec2(0.,.02)))/.04;
objectNormal=normalize(vec3(-dx,1.,-dz));
`);
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
transformed.y+=waterWave(position.xz);
`);
  };
  material.customProgramCacheKey=()=> 'sink-float-water-waves-v2';
  material.userData.updateWater=(seconds:number,impulses:WaterImpulse[],stir?:{x:number;z:number;time:number;strength:number})=>{
    uniforms.waterTime.value=seconds;
    uniforms.waterStir.value.set(stir?.x??0,stir?.z??0,stir?.time??-10,stir?.strength??0);
    for(let i=0;i<8;i++) {
      const wave=impulses[i];
      uniforms.waterImpulses.value[i].set(wave?.x??0,wave?.z??0,wave?.time??0,wave?.strength??0);
    }
  };
}

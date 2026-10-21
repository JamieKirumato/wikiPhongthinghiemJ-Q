import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HeldTool, StageOneState, ToolZone } from './stageOneModel';
import { createStageOneFoam } from './stageOneFoam';

export type ScreenPoint={x:number;y:number};
export type SceneAnchors={bowl:ScreenPoint;crater:ScreenPoint;spoon:ScreenPoint;vinegar:ScreenPoint};
export interface StageOneSceneHandle {aim:(x:number,y:number)=>ToolZone|null; place:(zone:ToolZone)=>void; home:()=>void; pick:(tool:HeldTool)=>void}
interface Props {read:()=>StageOneState; scooping:()=>boolean; timeScale:()=>number; onAnchors:(value:SceneAnchors)=>void; locked?:boolean; onUnavailable?:()=>void}

function rockRadius(y:number,a:number){
  const t=Math.max(0,Math.min(1,(y-.12)/2.35));
  const shoulder=1.93-1.31*Math.pow(t,.72);
  const mass=1+.10*Math.sin(a*3+.6+t*.8)+.065*Math.sin(a*5-1-t*1.3)+.035*Math.sin(a*9+t*4);
  return shoulder*mass+.045*Math.sin(a*13-y*5)+.024*Math.sin(a*23+y*11);
}
function stoneTexture(){
  const texture=new THREE.TextureLoader().load('/assets/volcano/volcanic-rock-v1.webp');
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2,1.4);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}

export const StageOneScene=forwardRef<StageOneSceneHandle,Props>(function StageOneScene({read,scooping,timeScale,onAnchors,locked=false,onUnavailable},ref){
  const host=useRef<HTMLDivElement>(null);const live=useRef({read,scooping,timeScale,onAnchors,locked,onUnavailable});live.current={read,scooping,timeScale,onAnchors,locked,onUnavailable};
  const api=useRef<StageOneSceneHandle>({aim:()=>null,place:()=>{},home:()=>{},pick:()=>{}});
  useImperativeHandle(ref,()=>({aim:(x,y)=>api.current.aim(x,y),place:z=>api.current.place(z),home:()=>api.current.home(),pick:t=>api.current.pick(t)}),[]);
  useEffect(()=>{
    const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{live.current.onUnavailable?.();return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;el.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,80);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.minDistance=8;controls.maxDistance=34;controls.minPolarAngle=.65;controls.maxPolarAngle=1.21;
    const home=()=>{const spread=Math.max(.8,.53/Math.max(.3,camera.aspect));camera.position.set(2.4*spread,1.15+4.5*spread,10.7*spread);controls.target.set(0,1.15,.1);controls.update();};home();
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.05);scene.environment=env.texture;scene.environmentIntensity=.8;room.dispose();pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfff9e9,0x8c9290,1.1));const sun=new THREE.DirectionalLight(0xfff2da,2.5);sun.position.set(-4,8,5);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5});sun.shadow.bias=-.001;scene.add(sun);
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    function mesh(g:THREE.BufferGeometry,m:THREE.Material,p:THREE.Object3D=scene){geometries.add(g);materials.add(m);const o=new THREE.Mesh(g,m);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
    // The extended rectangular desk belongs to the photograph. This invisible
    // plane receives apparatus shadows only; it must never add another tabletop.
    const floor=mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.19}));floor.rotation.x=-Math.PI/2;floor.position.y=-.065;floor.castShadow=false;
    const slate=new THREE.MeshStandardMaterial({color:0x9baba3,roughness:.64});const tray=mesh(new THREE.CylinderGeometry(2.55,2.51,.13,96),slate);tray.position.y=.025;
    const rim=mesh(new THREE.TorusGeometry(2.51,.045,10,100),slate);rim.position.y=.12;rim.rotation.x=Math.PI/2;
    const stone=stoneTexture();const basalt=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,map:stone,bumpMap:stone,bumpScale:.09,roughness:.95,flatShading:true});
    const rows=32,segments=96,points:number[]=[],uv:number[]=[],colors:number[]=[],indices:number[]=[];const color=new THREE.Color();
    for(let j=0;j<=rows;j++)for(let i=0;i<=segments;i++){
      const a=i/segments*Math.PI*2,t=j/rows,y=.13+t*2.35,r=rockRadius(y,a);const lip=t>.94?(t-.94)/.06*(.045*Math.sin(a*5)+.024*Math.sin(a*11)):0;
      points.push(Math.cos(a)*r+t*t*.09,y+lip,Math.sin(a)*r);uv.push(i/segments,t);
      const strata=Math.sin(a*4-y*1.4)*.5+.5,patch=Math.sin(a*7-y*4)*Math.sin(a*4+y*5);
      const charred=Math.max(0,(t-.73)/.27);color.setRGB(.74+strata*.18+patch*.045-charred*.25,.70+strata*.17+patch*.028-charred*.25,.66+strata*.16+patch*.02-charred*.22);colors.push(color.r,color.g,color.b);
      if(j<rows&&i<segments){const k=j*(segments+1)+i;indices.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}
    }
    const rockGeometry=new THREE.BufferGeometry();rockGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));rockGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));rockGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));rockGeometry.setIndex(indices);rockGeometry.computeVertexNormals();mesh(rockGeometry,basalt);
    const darkRock=new THREE.MeshStandardMaterial({color:0x9b9690,map:stone,bumpMap:stone,bumpScale:.07,roughness:.95});
    const outcropMat=new THREE.MeshStandardMaterial({color:0xc6b39d,map:stone,bumpMap:stone,bumpScale:.11,roughness:1});
    for(let i=0;i<19;i++){const a=i*2.39996,y=.32+(i%7)/7*1.75,r=rockRadius(y,a)-.11;const b=mesh(new THREE.IcosahedronGeometry(.20+(i%4)*.045,0),outcropMat);b.position.set(Math.cos(a)*r+.04,y,Math.sin(a)*r);b.scale.set(1.25,.7+(i%3)*.2,.7);b.rotation.set(i*.47,i*.81,i*.13);}
    const mossMat=new THREE.MeshStandardMaterial({color:0x6e8760,roughness:1});
    for(let i=0;i<13;i++){const a=i*2.39996,r=1.78+(i%3)*.065;const patch=mesh(new THREE.IcosahedronGeometry(.12+(i%3)*.035,1),mossMat);patch.position.set(Math.cos(a)*r,.16,Math.sin(a)*r*.94);patch.scale.set(1.7,.28,1);}

    const craterWall=mesh(new THREE.CylinderGeometry(.55,.35,.65,64,1,true),darkRock);craterWall.position.set(.09,2.16,0);craterWall.material.side=THREE.DoubleSide;
    for(let i=0;i<29;i++){const a=i*2.39996,r=1.55+(i%5)*.085;const b=mesh(new THREE.IcosahedronGeometry(.09+(i%4)*.029,1),darkRock);b.position.set(Math.cos(a)*r,.13+((i%3)*.025),Math.sin(a)*r*.94);b.scale.set(1.4,.75,1);b.rotation.set(i*.4,i*.8,i*.2);}
    for(let i=0;i<17;i++){const a=i/17*Math.PI*2,r=.52+.035*Math.sin(i*2);const b=mesh(new THREE.IcosahedronGeometry(.13+(i%3)*.025,1),darkRock);b.position.set(.09+Math.cos(a)*r,2.43+Math.sin(i*3)*.025,Math.sin(a)*r);b.scale.set(1.2,.65,1);b.rotation.y=a;}
    const ceramic=new THREE.MeshStandardMaterial({color:0xf0eee2,roughness:.34});const cup=mesh(new THREE.CylinderGeometry(.37,.33,.45,48,1,true),ceramic);cup.position.set(.09,2.16,0);cup.material.side=THREE.DoubleSide;
    const lip=mesh(new THREE.TorusGeometry(.37,.02,10,64),ceramic);lip.position.set(.09,2.39,0);lip.rotation.x=Math.PI/2;
    const cupBottom=mesh(new THREE.CircleGeometry(.33,40),ceramic);cupBottom.rotation.x=-Math.PI/2;cupBottom.position.set(.09,1.955,0);
    const powderMat=new THREE.MeshStandardMaterial({color:0xfff9e9,roughness:1});const powder=mesh(new THREE.SphereGeometry(.3,30,16),powderMat);powder.position.set(.09,1.99,0);powder.scale.set(1,.18,1);
    const waterMat=new THREE.MeshPhysicalMaterial({color:0xd7dfc9,roughness:.13,transparent:true,opacity:.67});const water=mesh(new THREE.CircleGeometry(.335,48),waterMat);water.rotation.x=-Math.PI/2;water.position.set(.09,1.97,0);
    const bowlPosition=new THREE.Vector3(-2.62,.15,1.15),mouthPosition=new THREE.Vector3(.09,2.43,0);
    const bowl=mesh(new THREE.LatheGeometry([new THREE.Vector2(0,0),new THREE.Vector2(.34,0),new THREE.Vector2(.56,.24),new THREE.Vector2(.59,.38),new THREE.Vector2(.55,.39),new THREE.Vector2(.51,.26),new THREE.Vector2(.3,.06),new THREE.Vector2(0,.06)],64),new THREE.MeshStandardMaterial({color:0xe1d1ae,roughness:.63}));bowl.position.copy(bowlPosition);
    const stock=mesh(new THREE.SphereGeometry(.52,36,20),powderMat);stock.position.copy(bowlPosition).add(new THREE.Vector3(0,.31,0));stock.scale.y=.14;
    const steel=new THREE.MeshStandardMaterial({color:0xd9e2df,roughness:.23,metalness:.82});const spoon=new THREE.Group();scene.add(spoon);
    const spoonBowl=mesh(new THREE.SphereGeometry(.25,32,20,0,Math.PI*2,Math.PI/2,Math.PI/2),steel,spoon);spoonBowl.scale.set(.85,.3,1.25);spoonBowl.material.side=THREE.DoubleSide;
    const handle=mesh(new THREE.CapsuleGeometry(.045,.9,5,12),steel,spoon);handle.rotation.x=Math.PI/2;handle.position.set(0,-.015,.67);handle.scale.y=.9;
    const spoonPowder=mesh(new THREE.SphereGeometry(.19,24,14),powderMat,spoon);spoonPowder.position.set(0,.015,0);spoonPowder.scale.set(1,.33,1.35);
    const spoonRest=new THREE.Vector3(-2.27,.23,2.0);spoon.position.copy(spoonRest);spoon.rotation.y=-.4;
    const pitcher=new THREE.Group();scene.add(pitcher);const glass=new THREE.MeshPhysicalMaterial({color:0xcce6df,roughness:.08,metalness:.08,transparent:true,opacity:.38,side:THREE.DoubleSide});
    mesh(new THREE.CylinderGeometry(.34,.29,.84,48,1,true),glass,pitcher).position.y=.46;
    const glassBottom=mesh(new THREE.CylinderGeometry(.29,.29,.035,40),glass,pitcher);glassBottom.position.y=.045;
    const glassRim=mesh(new THREE.TorusGeometry(.34,.022,8,56),glass,pitcher);glassRim.position.y=.88;glassRim.rotation.x=Math.PI/2;
    const jugHandle=mesh(new THREE.TorusGeometry(.23,.047,10,40,Math.PI*1.65),glass,pitcher);jugHandle.position.set(.4,.51,0);jugHandle.scale.set(.85,1.3,1);jugHandle.rotation.z=-Math.PI*.82;
    const spout=mesh(new THREE.ConeGeometry(.12,.26,3,1,true),glass,pitcher);spout.position.set(-.34,.84,0);spout.rotation.z=-Math.PI*.36;spout.rotation.y=Math.PI;
    const pitcherWater=mesh(new THREE.CylinderGeometry(.305,.27,.68,40),new THREE.MeshPhysicalMaterial({color:0xe4e8d6,roughness:.13,transparent:true,opacity:.6}),pitcher);pitcherWater.position.y=.4;
    const label=mesh(new THREE.PlaneGeometry(.28,.25),new THREE.MeshStandardMaterial({color:0xfff6db,roughness:.8}),pitcher);label.position.set(0,.48,.326);
    // Raised leaf-shaped mark on the household vinegar cup; full text stays on the accessible control.
    const mark=mesh(new THREE.SphereGeometry(.05,12,8),new THREE.MeshStandardMaterial({color:0x6a8c78}),pitcher);mark.position.set(0,.48,.333);mark.scale.set(.55,1.1,.1);
    const pitcherRest=new THREE.Vector3(2.65,.13,1.27);pitcher.position.copy(pitcherRest);
    const foamEffects=createStageOneFoam(scene,rockRadius);
    const stream=mesh(new THREE.CylinderGeometry(.022,.032,1,12),new THREE.MeshPhysicalMaterial({color:0xe5eadd,transparent:true,opacity:.7,roughness:.1}));stream.castShadow=false;
    const grains=new THREE.InstancedMesh(new THREE.SphereGeometry(.014,5,4),powderMat,42);scene.add(grains);geometries.add(grains.geometry);const dummy=new THREE.Object3D();
    const ghost=new THREE.MeshBasicMaterial({visible:false});const bowlHit=mesh(new THREE.CircleGeometry(.76,36),ghost);bowlHit.rotation.x=-Math.PI/2;bowlHit.position.copy(bowlPosition).add(new THREE.Vector3(0,.4,0));
    const craterHit=mesh(new THREE.CircleGeometry(.62,40),ghost);craterHit.rotation.x=-Math.PI/2;craterHit.position.copy(mouthPosition);
    const hits=[bowlHit,craterHit];const raycaster=new THREE.Raycaster();let freePosition=new THREE.Vector3(0,2.7,.1);let lastAnchor=0,frame=0,previous=0;
    const place=(zone:ToolZone)=>{freePosition=zone==='bowl'?bowlPosition.clone().add(new THREE.Vector3(0,.75,0)):zone==='crater'?mouthPosition.clone().add(new THREE.Vector3(0,.35,0)):new THREE.Vector3(1.5,1.2,1.5);};
    api.current={home,pick:tool=>{freePosition.copy(tool==='spoon'?spoon.position:pitcher.position);},place,aim:(x,y)=>{
      const rect=el.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),camera);
      const intersection=raycaster.intersectObjects(hits,false)[0];if(intersection){const zone=intersection.object===bowlHit?'bowl':'crater';place(zone);return zone;}
      const point=new THREE.Vector3();raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-2.7),point);point.x=THREE.MathUtils.clamp(point.x,-3.7,3.7);point.z=THREE.MathUtils.clamp(point.z,-2.0,2.6);freePosition.copy(point);return 'tray';
    }};
    const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();if(w<600){camera.fov=46;}else camera.fov=36;camera.updateProjectionMatrix();if(w<600){bowlPosition.set(-1.25,.15,2.25);bowl.position.copy(bowlPosition);stock.position.copy(bowlPosition).add(new THREE.Vector3(0,.31,0));spoonRest.set(-1.05,.23,2.9);pitcherRest.set(1.75,.13,2.15);}else{bowlPosition.set(-2.62,.15,1.15);bowl.position.copy(bowlPosition);stock.position.copy(bowlPosition).add(new THREE.Vector3(0,.31,0));spoonRest.set(-2.27,.23,2);pitcherRest.set(2.65,.13,1.27);}bowlHit.position.copy(bowlPosition).add(new THREE.Vector3(0,.4,0));home();};const observer=new ResizeObserver(resize);observer.observe(el);resize();
    const project=(v:THREE.Vector3)=>{const p=v.clone().project(camera);return{x:(p.x+1)/2*el.clientWidth,y:(1-p.y)/2*el.clientHeight};};
    let animationTime=0;
    const tick=(now:number)=>{
      const dt=previous?Math.min((now-previous)/1000,.06):.016;previous=now;const state=live.current.read(),r=state.reaction;const simulationDt=dt*live.current.timeScale();animationTime+=simulationDt;const t=animationTime;
      controls.enabled=!live.current.locked&&!state.held;controls.update();const blend=1-Math.exp(-dt*14);
      const spoonGoal=state.held==='spoon'?freePosition.clone():spoonRest.clone();if(state.held==='spoon'&&state.target==='bowl')spoonGoal.y=bowlPosition.y+(live.current.scooping()?.33+.045*Math.sin(t*9):.88);
      spoon.position.lerp(spoonGoal,blend);spoon.rotation.x=THREE.MathUtils.lerp(spoon.rotation.x,state.held==='spoon'?-state.tilt*1.12:0,blend);spoon.rotation.y=THREE.MathUtils.lerp(spoon.rotation.y,state.held==='spoon'?0:-.4,blend);
      spoonPowder.visible=state.spoonGrams>.015;spoonPowder.scale.y=.08+state.spoonGrams/4*.34;stock.scale.y=.055+.09*state.sodaStockGrams/24;
      const pitcherGoal=state.held==='vinegar'?freePosition.clone():pitcherRest.clone();const angle=state.held==='vinegar'?state.tilt*.88:0;pitcher.rotation.z=THREE.MathUtils.lerp(pitcher.rotation.z,angle,blend);
      if(state.held==='vinegar'&&state.target==='crater'){const offset=new THREE.Vector3(-.4,.9,0).applyEuler(pitcher.rotation);pitcherGoal.copy(mouthPosition).add(new THREE.Vector3(0,.44,0)).sub(offset);}
      pitcher.position.lerp(pitcherGoal,blend);const liquidFraction=Math.max(0,state.vinegarMl/60);pitcherWater.visible=liquidFraction>.005;pitcherWater.scale.y=Math.max(.01,liquidFraction);pitcherWater.position.y=.06+.34*liquidFraction;pitcherWater.rotation.z=-pitcher.rotation.z*.88;
      powder.visible=r.sodaGrams>.02;powder.position.y=1.99+Math.min(r.liquidMl/120,.8)*.24;powder.scale.y=.05+Math.min(r.sodaGrams/8,1)*.22;
      water.visible=r.liquidMl>.05;water.position.y=1.975+Math.min(r.liquidMl/100,1)*.34;
      foamEffects.update(r,water.position.y,simulationDt);
      const hasMaterial=state.held==='spoon'?state.spoonGrams>.001:state.vinegarMl>.001;const flowing=state.pouring&&state.tilt>.25&&hasMaterial;
      const from=state.held==='spoon'?spoon.localToWorld(new THREE.Vector3(0,-.01,-.27)):pitcher.localToWorld(new THREE.Vector3(-.4,.9,0));
      const to=state.target==='crater'?new THREE.Vector3(.09,Math.max(2.0,water.position.y),0):new THREE.Vector3(from.x,.13,from.z);
      stream.visible=flowing&&state.held==='vinegar';if(stream.visible){const dir=from.clone().sub(to);stream.position.copy(from).add(to).multiplyScalar(.5);stream.scale.set(1,dir.length(),1);stream.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());}
      grains.visible=flowing&&state.held==='spoon';if(grains.visible){for(let i=0;i<42;i++){const f=(t*1.65+i/42)%1;dummy.position.copy(from).lerp(to,f*f);dummy.position.x+=Math.sin(i*12)*.035*f;dummy.position.z+=Math.cos(i*7)*.035*f;dummy.scale.setScalar(.7+(i%3)*.22);dummy.updateMatrix();grains.setMatrixAt(i,dummy.matrix);}grains.instanceMatrix.needsUpdate=true;}
      if(now-lastAnchor>140){live.current.onAnchors({bowl:project(bowlPosition.clone().add(new THREE.Vector3(0,.4,0))),crater:project(mouthPosition),spoon:project(spoonRest.clone().add(new THREE.Vector3(0,.1,.65))),vinegar:project(pitcherRest.clone().add(new THREE.Vector3(0,.55,0)))});lastAnchor=now;}
      renderer.render(scene,camera);frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();foamEffects.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());stone.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div ref={host} className="v1-webgl" role="img" aria-label="Núi đá ba chiều, miệng cốc mở, bát baking soda, thìa và cốc giấm trên bàn lớp học"/>;
});

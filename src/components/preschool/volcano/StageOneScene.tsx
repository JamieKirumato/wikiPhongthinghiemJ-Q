import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { loadApprovedVolcano } from './approvedAssets';
import { cupWaterY, HeldTool, StageOneState, ToolZone } from './stageOneModel';
import { createStageOneFoam } from './stageOneFoam';
import { clayOffset, ClayTool, sculptClay } from './clayModel';

export type ScreenPoint={x:number;y:number};
export type SceneAnchors={bowl:ScreenPoint;crater:ScreenPoint;spoon:ScreenPoint;vinegar:ScreenPoint;color?:ScreenPoint};
export interface StageOneSceneHandle {aim:(x:number,y:number)=>ToolZone|null;place:(zone:ToolZone)=>void;home:()=>void;pick:(tool:HeldTool)=>void;sculpt:(x:number,y:number,tool:ClayTool)=>boolean;capture:()=>string}
interface Props {read:()=>StageOneState;scooping:()=>boolean;timeScale:()=>number;onAnchors:(value:SceneAnchors)=>void;building?:boolean;locked?:boolean;onUnavailable?:()=>void}
type View={x:number;y:number;w:number;h:number};
function roundedShape(w:number,d:number,r:number){
  const s=new THREE.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);return s;
}
export const StageOneScene=forwardRef<StageOneSceneHandle,Props>(function StageOneScene({read,scooping,timeScale,onAnchors,building=false,locked=false,onUnavailable},ref){
  const [ready,setReady]=useState(false);
  const host=useRef<HTMLDivElement>(null),live=useRef({read,scooping,timeScale,onAnchors,building,locked,onUnavailable});live.current={read,scooping,timeScale,onAnchors,building,locked,onUnavailable};
  const api=useRef<StageOneSceneHandle>({aim:()=>null,place:()=>{},home:()=>{},pick:()=>{},sculpt:()=>false,capture:()=>''});
  useImperativeHandle(ref,()=>({aim:(x,y)=>api.current.aim(x,y),place:z=>api.current.place(z),home:()=>api.current.home(),pick:t=>api.current.pick(t),sculpt:(x,y,t)=>api.current.sculpt(x,y,t),capture:()=>api.current.capture()}),[]);
  useEffect(()=>{
    let cancelled=false,cleanup=()=>{};
    const initialize=async()=>{
    const approved=await loadApprovedVolcano();
    if(cancelled){approved.dispose();return;}
    const element=host.current;if(!element){approved.dispose();return;}const el:HTMLDivElement=element;let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});}catch{approved.dispose();live.current.onUnavailable?.();return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;renderer.autoClear=false;el.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),toolScene=new THREE.Scene(),root=new THREE.Group();scene.add(root);root.scale.y=1;
    const camera=new THREE.PerspectiveCamera(30,1,.1,80),toolCamera=new THREE.PerspectiveCamera(30,1,.1,50);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.minDistance=6.5;controls.maxDistance=24;controls.minPolarAngle=.83;controls.maxPolarAngle=1.29;
    let mainView:View={x:0,y:0,w:1,h:1},toolView:View={x:0,y:0,w:1,h:1};
    const home=()=>{const fit=Math.max(1,1.4/camera.aspect);camera.position.set(.85*fit,1.05+3.6*fit,7.7*fit);controls.target.set(0,1.1,0);controls.update();};
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();
    for(const world of [scene,toolScene]){
      world.environment=env.texture;world.environmentIntensity=.65;world.add(new THREE.HemisphereLight(0xffffff,0x928e7f,1.1));
      const sun=new THREE.DirectionalLight(0xfffaf0,2.5);sun.position.set(-4,8,5);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5});sun.shadow.bias=-.0005;sun.shadow.normalBias=.02;world.add(sun);
    }
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    const mesh=(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=root)=>{geometries.add(g);materials.add(m);const o=new THREE.Mesh(g,m);o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
    function slab(w:number,d:number,h:number,m:THREE.Material,parent:THREE.Object3D,y:number){const g=new THREE.ExtrudeGeometry(roundedShape(w,d,.2),{depth:h,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.03,curveSegments:10});g.rotateX(-Math.PI/2);const o=mesh(g,m,parent);o.position.y=y;return o;}
    const shadow=mesh(new THREE.PlaneGeometry(70,70),new THREE.ShadowMaterial({opacity:.18}),scene);shadow.rotation.x=-Math.PI/2;shadow.position.y=-.05;shadow.castShadow=false;
    root.add(approved.take('volcano-tray'),approved.take('volcano-decor'),approved.take('volcano-cup'));
    const mountain=approved.take('volcano-body') as THREE.Mesh<THREE.BufferGeometry,THREE.Material>;
    root.add(mountain);const bodyGeometry=mountain.geometry;
    const basePositions=new Float32Array(bodyGeometry.getAttribute('position').array);
    const whitePowder=new THREE.MeshStandardMaterial({color:0xfffdf4,roughness:1});
    const powder=mesh(new THREE.SphereGeometry(.36,32,16),whitePowder);powder.position.set(.09,1.82,0);powder.scale.set(1,.18,1);
    const waterMat=new THREE.MeshPhysicalMaterial({color:0xeeeede,roughness:.11,transparent:true,opacity:.66,clearcoat:1});
    const water=mesh(new THREE.CircleGeometry(.405,64),waterMat);water.rotation.x=-Math.PI/2;water.position.set(.09,1.79,0);
    const mouth=new THREE.Vector3(.09,2.61,0),mouthWorld=()=>root.localToWorld(mouth.clone());
    // The separate tool view preserves the approved composition while the volcano rotates.
    const matMaterial=new THREE.MeshStandardMaterial({color:0xb4ccbe,roughness:.68});slab(4.25,1.9,.055,matMaterial,toolScene,0);
    const bowlPosition=new THREE.Vector3(.12,.09,.05);
    const bowl=new THREE.Group();bowl.position.copy(bowlPosition);toolScene.add(bowl);
    bowl.add(approved.take('bowl'));
    const stock=approved.take('soda-stock');bowl.add(stock);
    function makeSpoon(){const g=approved.take('spoon');const p=mesh(new THREE.SphereGeometry(.18,20,12),whitePowder,g);p.name='powder';p.scale.set(1,.33,1.2);p.position.y=.012;return g;}
    const spoon=makeSpoon();scene.add(spoon);const sourceSpoon=makeSpoon();toolScene.add(sourceSpoon);const spoonRest=new THREE.Vector3(.2,.66,.01);
    const pitcher=approved.take('jug');scene.add(pitcher);const sourceJug=approved.take('jug');sourceJug.position.set(-1.22,.09,0);toolScene.add(sourceJug);
    const jugSpout=new THREE.Vector3(-.424,1.1,0);
    const bottleMat=new THREE.MeshPhysicalMaterial({color:0xb81520,roughness:.16,transparent:true,opacity:.9,clearcoat:1});
    const dropper=approved.take('dropper');scene.add(dropper);const sourceColor=approved.take('dropper');sourceColor.position.set(1.45,.09,.02);toolScene.add(sourceColor);
    const selection=mesh(new THREE.TorusGeometry(.43,.023,10,64),new THREE.MeshStandardMaterial({color:0xf1c553,roughness:.4}),toolScene);selection.rotation.x=Math.PI/2;selection.position.y=.1;
    const clayLump=approved.take('clay-lump');toolScene.add(clayLump);clayLump.position.set(-1.35,.04,.58);
    const stick=approved.take('modeling-stick');toolScene.add(stick);stick.position.set(0,.04,.64);
    const drop=mesh(new THREE.SphereGeometry(.037,16,12),bottleMat);drop.castShadow=false;
    const pigment=mesh(new THREE.CircleGeometry(.075,28),new THREE.MeshStandardMaterial({color:0xb41f1c,roughness:.2}));pigment.rotation.x=-Math.PI/2; pigment.castShadow=false;
    const bloom=mesh(new THREE.RingGeometry(.02,.1,40),new THREE.MeshBasicMaterial({color:0xd62e32,transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}));bloom.rotation.x=-Math.PI/2;
    const brush=mesh(new THREE.TorusGeometry(.2,.012,8,40),new THREE.MeshBasicMaterial({color:0xf1c553,depthTest:false}));brush.renderOrder=10;brush.visible=false;
    const foam=createStageOneFoam(root,()=>live.current.read().clay);
    const stream=mesh(new THREE.CylinderGeometry(.018,.028,1,12),new THREE.MeshPhysicalMaterial({color:0xf5faf6,transparent:true,opacity:.6,roughness:.1}),scene);stream.castShadow=false;
    const grains=new THREE.InstancedMesh(new THREE.SphereGeometry(.012,5,4),whitePowder,42);scene.add(grains);geometries.add(grains.geometry);const dummy=new THREE.Object3D();
    const ghost=new THREE.MeshBasicMaterial({visible:false}),craterHit=mesh(new THREE.CircleGeometry(.63,48),ghost);craterHit.rotation.x=-Math.PI/2;craterHit.position.copy(mouth);
    const raycaster=new THREE.Raycaster();let freePosition=mouthWorld().add(new THREE.Vector3(0,.4,0));
    const ray=(x:number,y:number)=>{const rect=el.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((x-rect.left-mainView.x)/mainView.w*2-1,-(y-rect.top-mainView.y)/mainView.h*2+1),camera);};
    const place=(zone:ToolZone)=>{freePosition=mouthWorld().add(new THREE.Vector3(0,zone==='crater'?.35:0,zone==='tray'?1.5:0));};
    api.current={home,place,pick:()=>{freePosition=mouthWorld().add(new THREE.Vector3(1,.5,.2));},capture:()=>renderer.domElement.toDataURL('image/png'),sculpt:(x,y,tool)=>{
      ray(x,y);const hit=raycaster.intersectObject(mountain,false)[0];if(!hit){brush.visible=false;return false;}
      const p=root.worldToLocal(hit.point.clone());sculptClay(live.current.read().clay,p.y,Math.atan2(p.z,p.x-.09),tool);brush.position.copy(p);brush.lookAt(p.clone().add(hit.face!.normal));brush.visible=true;return true;
    },aim:(x,y)=>{
      const rect=el.getBoundingClientRect();if(x-rect.left>=toolView.x&&y-rect.top>=toolView.y&&y-rect.top<=toolView.y+toolView.h&&live.current.read().held==='spoon'){return 'bowl';}
      ray(x,y);if(raycaster.intersectObject(craterHit,false).length){place('crater');return 'crater';}
      const p=new THREE.Vector3();if(raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-2.7),p)){p.x=THREE.MathUtils.clamp(p.x,-3,3);p.z=THREE.MathUtils.clamp(p.z,-2,2.5);freePosition.copy(p);}return 'tray';
    }};
    function resize(){
      const w=el.clientWidth,h=el.clientHeight,mobile=w<760;renderer.setSize(w,h,false);
      mainView=mobile?{x:0,y:h*.115,w,h:h*.55}:{x:0,y:h*.13,w:w*.68,h:h*.72};
      toolView=mobile?{x:w*.04,y:h*.655,w:w*.92,h:h*.175}:{x:w*.66,y:h*.40,w:w*.335,h:h*.36};
      camera.aspect=mainView.w/mainView.h;camera.updateProjectionMatrix();toolCamera.aspect=toolView.w/toolView.h;const toolDistance=Math.max(4.55/(2*Math.tan(Math.PI/12)*toolCamera.aspect),1.85/(2*Math.tan(Math.PI/12)));toolCamera.position.set(0,.35+toolDistance*.43,toolDistance*.9);toolCamera.lookAt(0,.35,0);toolCamera.updateProjectionMatrix();home();
    }
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    const project=(v:THREE.Vector3,cam:THREE.Camera,view:View)=>{const p=v.clone().project(cam);return{x:view.x+(p.x+1)/2*view.w,y:view.y+(1-p.y)/2*view.h};};
    let previous=0,frame=0,lastAnchor=0,time=0,lastDropAge=10,lastClay:StageOneState['clay']|undefined,revision=-1;const liquidRed=new THREE.Color(),dropOrigin=new THREE.Vector3(.09,3.15,0);
    const renderView=(world:THREE.Scene,cam:THREE.Camera,v:View)=>{renderer.setViewport(v.x,el.clientHeight-v.y-v.h,v.w,v.h);renderer.setScissor(v.x,el.clientHeight-v.y-v.h,v.w,v.h);renderer.render(world,cam);};
    const tick=(now:number)=>{
      const dt=previous?Math.min((now-previous)/1000,.06):.016;previous=now;const state=live.current.read(),r=state.reaction,simulationDt=dt*live.current.timeScale();time+=simulationDt;const blend=1-Math.exp(-dt*14);
      if(lastClay!==state.clay||revision!==state.clay.revision){
        lastClay=state.clay;revision=state.clay.revision;const position=bodyGeometry.getAttribute('position');
        for(let i=0;i<position.count;i++){
          const x=basePositions[i*3],y=basePositions[i*3+1],z=basePositions[i*3+2],a=Math.atan2(z,x-.09);
          const r=Math.hypot(x-.09,z)+clayOffset(state.clay,y,a);
          position.setXYZ(i,.09+Math.cos(a)*r,y,Math.sin(a)*r);
        }
        position.needsUpdate=true;bodyGeometry.computeVertexNormals();bodyGeometry.computeBoundingSphere();
      }
      controls.enabled=!live.current.locked&&!state.held&&!state.clayTool;controls.update();brush.visible=brush.visible&&!!state.clayTool;
      spoon.visible=state.held==='spoon'&&state.target!=='bowl';sourceSpoon.visible=state.held!=='spoon'||state.target==='bowl';
      sourceSpoon.position.copy(spoonRest);sourceSpoon.rotation.set(.2,2.65,-.45);if(state.held==='spoon'&&state.target==='bowl'){sourceSpoon.position.copy(bowlPosition).add(new THREE.Vector3(0,live.current.scooping()?.34+.04*Math.sin(time*9):.7,0));sourceSpoon.rotation.set(0,0,0);}
      spoon.position.lerp(freePosition,blend);spoon.rotation.x=-state.tilt*1.12;
      for(const g of [spoon,sourceSpoon]){const p=g.getObjectByName('powder')!;p.visible=state.spoonGrams>.015;p.scale.y=.08+state.spoonGrams/4*.34;}
      stock.scale.y=.3+.7*state.sodaStockGrams/24;bowl.visible=!live.current.building;stock.visible=!live.current.building&&state.sodaStockGrams>.005;
      pitcher.visible=state.held==='vinegar';sourceJug.visible=!pitcher.visible;pitcher.rotation.z=THREE.MathUtils.lerp(pitcher.rotation.z,state.tilt*.88,blend);
      const jugGoal=freePosition.clone();if(state.target==='crater'){const offset=jugSpout.clone().applyEuler(pitcher.rotation);jugGoal.copy(mouthWorld()).add(new THREE.Vector3(0,.4,0)).sub(offset);}pitcher.position.lerp(jugGoal,blend);
      const fraction=Math.max(0,state.vinegarMl/60);for(const g of [pitcher,sourceJug]){const liquid=g.getObjectByName('liquid')!;liquid.visible=fraction>.005;liquid.scale.y=Math.max(.01,fraction);liquid.position.y=.111;}pitcher.getObjectByName('liquid')!.rotation.z=-pitcher.rotation.z*.8;
      dropper.visible=state.held==='color';sourceColor.visible=!dropper.visible;const dropGoal=freePosition.clone();if(state.target==='crater')dropGoal.copy(mouthWorld()).add(new THREE.Vector3(0,1.1,0));dropper.position.lerp(dropGoal,blend);dropper.rotation.z=state.target==='crater'?Math.PI:0;
      if(live.current.building){sourceSpoon.visible=sourceJug.visible=sourceColor.visible=false;}clayLump.visible=stick.visible=live.current.building;selection.visible=!!state.held;selection.position.x=state.held==='vinegar'?-1.22:state.held==='color'?1.45:.12;
      powder.visible=r.sodaGrams>.02;powder.position.y=1.82+Math.min(r.liquidMl/120,.8)*.24;powder.scale.y=.05+Math.min(r.sodaGrams/8,1)*.22;
      water.visible=r.liquidMl-state.runoffMl>.05;water.position.y=cupWaterY(state);liquidRed.setHSL(.005,.87,.5-state.colorMix*.17,THREE.SRGBColorSpace);waterMat.color.set(0xeeeede).lerp(liquidRed,1-Math.exp(-state.colorMix*8));waterMat.opacity=.5+state.colorMix*.33;
      const landing=Math.max(water.position.y,powder.visible?powder.position.y+.36*powder.scale.y:1.78),age=state.colorDropAge;
      if(age<lastDropAge)dropOrigin.copy(root.worldToLocal(dropper.localToWorld(new THREE.Vector3(0,.855,0))));lastDropAge=age;drop.visible=age<.4;drop.position.copy(dropOrigin).lerp(new THREE.Vector3(.09,landing,0),Math.min(1,age/.4)**2);drop.scale.set(1,1.4,1);
      pigment.visible=state.colorDrops>0&&r.liquidMl<.05&&age>=.4;pigment.position.set(.09,landing+.006,0);pigment.scale.setScalar(Math.min(2,.7+state.colorDrops*.2));
      bloom.visible=age>=.4&&age<1.8&&r.liquidMl>.05;bloom.position.set(.09,water.position.y+.008,0);bloom.scale.setScalar(.4+Math.max(0,age-.4)*1.6);(bloom.material as THREE.MeshBasicMaterial).opacity=Math.max(0,.65-(age-.4)*.46);foam.update(state,water.position.y,simulationDt);
      const hasMaterial=state.held==='spoon'?state.spoonGrams>.001:state.vinegarMl>.001,flowing=state.held!=='color'&&state.pouring&&state.tilt>.25&&hasMaterial;
      const from=state.held==='spoon'?spoon.localToWorld(new THREE.Vector3(0,0,-.24)):pitcher.localToWorld(jugSpout.clone());const to=state.target==='crater'?root.localToWorld(new THREE.Vector3(.09,Math.max(1.79,water.position.y),0)):new THREE.Vector3(from.x,.15,from.z);
      stream.visible=flowing&&state.held==='vinegar';if(stream.visible){const dir=from.clone().sub(to);stream.position.copy(from).add(to).multiplyScalar(.5);stream.scale.set(1,dir.length(),1);stream.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());}
      grains.visible=flowing&&state.held==='spoon';if(grains.visible){for(let i=0;i<42;i++){const f=(time*1.6+i/42)%1;dummy.position.copy(from).lerp(to,f*f);dummy.position.x+=Math.sin(i*12)*.03*f;dummy.position.z+=Math.cos(i*7)*.03*f;dummy.scale.setScalar(.7+(i%3)*.2);dummy.updateMatrix();grains.setMatrixAt(i,dummy.matrix);}grains.instanceMatrix.needsUpdate=true;}
      renderer.setScissorTest(true);renderer.setViewport(0,0,el.clientWidth,el.clientHeight);renderer.setScissor(0,0,el.clientWidth,el.clientHeight);renderer.clear();renderView(scene,camera,mainView);renderer.clearDepth();renderView(toolScene,toolCamera,toolView);
      if(now-lastAnchor>140){live.current.onAnchors({crater:project(mouthWorld(),camera,mainView),bowl:project(bowlPosition.clone().add(new THREE.Vector3(0,.08,.4)),toolCamera,toolView),spoon:project(bowlPosition.clone().add(new THREE.Vector3(0,.08,.4)),toolCamera,toolView),vinegar:project(new THREE.Vector3(-1.22,.16,.4),toolCamera,toolView),color:project(new THREE.Vector3(1.45,.16,.4),toolCamera,toolView)});lastAnchor=now;}
      frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    setReady(true);
    cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();foam.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());approved.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
    };
    void initialize().catch(()=>{if(!cancelled)live.current.onUnavailable?.();});
    return()=>{cancelled=true;cleanup();};
  },[]);
  return <div ref={host} className="v1-webgl" role="img" aria-label="Núi đất nặn bất đối xứng trên khay chữ nhật xanh ngọc, cốc nhựa mở và dụng cụ giấm, bột, phẩm màu">{!ready&&<span className="v1-asset-loading" role="status" aria-label="Đang chuẩn bị núi lửa và dụng cụ"><i/></span>}</div>;
});

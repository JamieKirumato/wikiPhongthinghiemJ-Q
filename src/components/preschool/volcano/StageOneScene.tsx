import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { cupWaterY, HeldTool, StageOneState, ToolZone } from './stageOneModel';
import { createStageOneFoam } from './stageOneFoam';
import { CLAY_PATCHES, CLAY_ROWS, CLAY_SEGMENTS, clayRadius, ClayTool, sculptClay } from './clayModel';

export type ScreenPoint={x:number;y:number};
export type SceneAnchors={bowl:ScreenPoint;crater:ScreenPoint;spoon:ScreenPoint;vinegar:ScreenPoint;color?:ScreenPoint};
export interface StageOneSceneHandle {aim:(x:number,y:number)=>ToolZone|null;place:(zone:ToolZone)=>void;home:()=>void;pick:(tool:HeldTool)=>void;sculpt:(x:number,y:number,tool:ClayTool)=>boolean;capture:()=>string}
interface Props {read:()=>StageOneState;scooping:()=>boolean;timeScale:()=>number;onAnchors:(value:SceneAnchors)=>void;building?:boolean;locked?:boolean;onUnavailable?:()=>void}
type View={x:number;y:number;w:number;h:number};
function roundedShape(w:number,d:number,r:number){
  const s=new THREE.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);return s;
}
export const StageOneScene=forwardRef<StageOneSceneHandle,Props>(function StageOneScene({read,scooping,timeScale,onAnchors,building=false,locked=false,onUnavailable},ref){
  const host=useRef<HTMLDivElement>(null),live=useRef({read,scooping,timeScale,onAnchors,building,locked,onUnavailable});live.current={read,scooping,timeScale,onAnchors,building,locked,onUnavailable};
  const api=useRef<StageOneSceneHandle>({aim:()=>null,place:()=>{},home:()=>{},pick:()=>{},sculpt:()=>false,capture:()=>''});
  useImperativeHandle(ref,()=>({aim:(x,y)=>api.current.aim(x,y),place:z=>api.current.place(z),home:()=>api.current.home(),pick:t=>api.current.pick(t),sculpt:(x,y,t)=>api.current.sculpt(x,y,t),capture:()=>api.current.capture()}),[]);
  useEffect(()=>{
    const element=host.current;if(!element)return;const el:HTMLDivElement=element;let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});}catch{live.current.onUnavailable?.();return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;renderer.autoClear=false;el.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),toolScene=new THREE.Scene(),root=new THREE.Group();scene.add(root);root.scale.y=1.1;
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
    const jade=new THREE.MeshPhysicalMaterial({color:0x99b7a5,roughness:.25,clearcoat:.65});
    slab(5.25,4.35,.10,jade,root,.015);
    const rimPoints=roundedShape(5.15,4.25,.22).getPoints(100).map(p=>new THREE.Vector3(p.x,.15,-p.y));rimPoints.push(rimPoints[0]);mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints,true),160,.045,8,true),jade);
    const clay=new THREE.TextureLoader().load('/assets/volcano/clay-cocoa-v1.webp');clay.colorSpace=THREE.SRGBColorSpace;clay.wrapS=clay.wrapT=THREE.RepeatWrapping;clay.repeat.set(2,1.25);clay.anisotropy=8;
    const clayMaterial=new THREE.MeshStandardMaterial({color:0xc2aea0,map:clay,bumpMap:clay,bumpScale:.085,roughness:.96,vertexColors:true});
    const rows=CLAY_ROWS,segments=CLAY_SEGMENTS,points:number[]=[],uv:number[]=[],colors:number[]=[],indices:number[]=[];
    for(let j=0;j<=rows;j++)for(let i=0;i<=segments;i++){
      const a=i/segments*Math.PI*2,y=.13+j/rows*2.3,r=clayRadius(live.current.read().clay,y,a);points.push(.09+Math.cos(a)*r,y+(j===rows?.035*Math.sin(a*5)+.018*Math.sin(a*11):0),Math.sin(a)*r);uv.push(i/segments,j/rows);
      const shade=.91+.08*Math.sin(a*4+y*7)*Math.sin(a*3-y*4);colors.push(shade,shade,shade);
      if(j<rows&&i<segments){const k=j*(segments+1)+i;indices.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}
    }
    const bodyGeometry=new THREE.BufferGeometry();bodyGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));bodyGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));bodyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));bodyGeometry.setIndex(indices);bodyGeometry.computeVertexNormals();const mountain=mesh(bodyGeometry,clayMaterial);
    // Pressed pieces follow the same editable surface, including after undo.
    const pressedMaterial=new THREE.MeshStandardMaterial({color:0xcbb5a3,map:clay,bumpMap:clay,bumpScale:.055,roughness:.98,vertexColors:true});
    const pressed=CLAY_PATCHES.map((patch,index)=>{
      const positions:number[]=[],tex:number[]=[],shades:number[]=[],faces:number[]=[];
      for(let ring=0;ring<=7;ring++)for(let side=0;side<=32;side++){
        const phase=side/32*Math.PI*2,f=ring/7;
        const shape=1+.08*Math.sin(phase*3+index)+.04*Math.sin(phase*7-index);
        const a=patch.a+Math.cos(phase)*patch.width*.9*f*shape,y=patch.y+Math.sin(phase)*patch.height*.9*f*shape;
        positions.push(0,0,0);tex.push(a/(Math.PI*2),y/2.3);
        const shade=(.91+(index%4)*.045)*(1-.17*f**6);shades.push(shade,shade,shade);
        if(ring<7&&side<32){const k=ring*33+side;faces.push(k,k+1,k+33,k+1,k+34,k+33);}
      }
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(tex,2));g.setAttribute('color',new THREE.Float32BufferAttribute(shades,3));g.setIndex(faces);
      return{patch,index,object:mesh(g,pressedMaterial)};
    });
    const updatePressed=(surface:StageOneState['clay'])=>{pressed.forEach(({patch,index,object})=>{
      const position=object.geometry.getAttribute('position');
      for(let ring=0;ring<=7;ring++)for(let side=0;side<=32;side++){
        const phase=side/32*Math.PI*2,f=ring/7,shape=1+.08*Math.sin(phase*3+index)+.04*Math.sin(phase*7-index);
        const a=patch.a+Math.cos(phase)*patch.width*.9*f*shape,y=patch.y+Math.sin(phase)*patch.height*.9*f*shape;
        const r=clayRadius(surface,y,a)+.015+.026*(1-f*f);position.setXYZ(ring*33+side,.09+Math.cos(a)*r,y,Math.sin(a)*r);
      }
      position.needsUpdate=true;object.geometry.computeVertexNormals();object.geometry.computeBoundingSphere();
    });};
    const collarMaterial=new THREE.MeshStandardMaterial({map:clay,color:0xa48b79,bumpMap:clay,bumpScale:.06,roughness:.95,side:THREE.DoubleSide});
    const collar=mesh(new THREE.CylinderGeometry(.49,.34,.38,64,1,true),collarMaterial);collar.position.set(.09,2.24,0);
    const leafMaterial=new THREE.MeshStandardMaterial({color:0x467c50,roughness:.94});
    for(const angle of [.08,2.85])for(let i=0;i<4;i++){
      const rr=1.91+(i%2)*.12,a=angle+(i-1.5)*.09;
      const leaf=mesh(new THREE.SphereGeometry(.12,20,12),leafMaterial);leaf.position.set(.09+Math.cos(a)*rr,.29+i*.025,Math.sin(a)*rr);leaf.scale.set(.6,2.1+(i%2)*.5,1);leaf.rotation.set(.1*i,.0,(i-1.5)*.23);
    }
    const plastic=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.07,transparent:true,opacity:.13,clearcoat:1,envMapIntensity:1.5,side:THREE.DoubleSide,depthWrite:false});
    const transparentEdge=(material:THREE.MeshPhysicalMaterial)=>{material.opacity=1;material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\nfloat edgeAlpha=pow(1.0-abs(dot(normal,normalize(vViewPosition))),2.0);diffuseColor.a*=0.035+0.6*edgeAlpha;');};};transparentEdge(plastic);
    const cup=mesh(new THREE.CylinderGeometry(.38,.335,.45,64,1,true),plastic);cup.position.set(.09,2.35,0);cup.renderOrder=3;cup.castShadow=false;
    const plasticEdge=new THREE.MeshPhysicalMaterial({color:0xf3faf9,roughness:.13,transparent:true,opacity:.8,clearcoat:1});
    const lip=mesh(new THREE.TorusGeometry(.38,.014,10,64),plasticEdge);lip.position.set(.09,2.575,0);lip.rotation.x=Math.PI/2;lip.castShadow=false;
    const cupBottom=mesh(new THREE.CircleGeometry(.335,40),plastic);cupBottom.rotation.x=-Math.PI/2;cupBottom.position.set(.09,2.126,0);
    const whitePowder=new THREE.MeshStandardMaterial({color:0xfffdf4,roughness:1});
    const powder=mesh(new THREE.SphereGeometry(.31,32,16),whitePowder);powder.position.set(.09,2.16,0);powder.scale.set(1,.18,1);
    const waterMat=new THREE.MeshPhysicalMaterial({color:0xeeeede,roughness:.11,transparent:true,opacity:.66,clearcoat:1});
    const water=mesh(new THREE.CircleGeometry(.345,64),waterMat);water.rotation.x=-Math.PI/2;water.position.set(.09,2.145,0);
    const mouth=new THREE.Vector3(.09,2.61,0),mouthWorld=()=>root.localToWorld(mouth.clone());
    // The separate tool view preserves the approved composition while the volcano rotates.
    const matMaterial=new THREE.MeshStandardMaterial({color:0xb4ccbe,roughness:.68});slab(4.25,1.9,.055,matMaterial,toolScene,0);
    const bowlPosition=new THREE.Vector3(.12,.09,.05);
    const porcelain=new THREE.MeshPhysicalMaterial({color:0xfffcf1,roughness:.25,clearcoat:.5});
    const bowl=mesh(new THREE.LatheGeometry([new THREE.Vector2(0,0),new THREE.Vector2(.27,0),new THREE.Vector2(.49,.18),new THREE.Vector2(.56,.38),new THREE.Vector2(.53,.405),new THREE.Vector2(.47,.23),new THREE.Vector2(.26,.065),new THREE.Vector2(0,.065)],64),porcelain,toolScene);bowl.position.copy(bowlPosition);
    const stock=mesh(new THREE.ConeGeometry(.43,.29,40,5),whitePowder,toolScene);stock.position.copy(bowlPosition).add(new THREE.Vector3(0,.42,0));stock.scale.y=1;
    const steel=new THREE.MeshStandardMaterial({color:0xe1e6e8,roughness:.19,metalness:.95});
    function makeSpoon(){const g=new THREE.Group();const bowl=mesh(new THREE.SphereGeometry(.21,32,16,0,Math.PI*2,Math.PI/2,Math.PI/2),steel,g);bowl.scale.set(.85,.3,1.3);bowl.material.side=THREE.DoubleSide;const handle=mesh(new THREE.CapsuleGeometry(.036,.95,6,16),steel,g);handle.rotation.x=Math.PI/2;handle.position.set(0,0,.67);const p=mesh(new THREE.SphereGeometry(.18,20,12),whitePowder,g);p.name='powder';p.scale.set(1,.33,1.2);p.position.y=.012;return g;}
    const spoon=makeSpoon();scene.add(spoon);const sourceSpoon=makeSpoon();toolScene.add(sourceSpoon);const spoonRest=new THREE.Vector3(.2,.59,.01);
    const glass=new THREE.MeshPhysicalMaterial({color:0xf6ffff,roughness:.045,transparent:true,opacity:.24,clearcoat:1,envMapIntensity:1.8,side:THREE.DoubleSide,depthWrite:false});
    transparentEdge(glass);
    function makeJug(){
      const g=new THREE.Group();mesh(new THREE.LatheGeometry([new THREE.Vector2(.0,.03),new THREE.Vector2(.35,.03),new THREE.Vector2(.4,.15),new THREE.Vector2(.36,.8),new THREE.Vector2(.32,1),new THREE.Vector2(.4,1.1)],64),glass,g);
      const rim=mesh(new THREE.TorusGeometry(.4,.014,8,56),plasticEdge,g);rim.position.y=1.1;rim.rotation.x=Math.PI/2;
      const handle=mesh(new THREE.TorusGeometry(.29,.04,12,48,Math.PI*1.7),glass,g);handle.position.set(.42,.58,0);handle.rotation.z=-Math.PI*.85;handle.scale.set(.9,1.22,1);
      const spout=mesh(new THREE.ConeGeometry(.11,.23,3,1,true),glass,g);spout.position.set(-.39,1.03,0);spout.rotation.z=-Math.PI*.36;
      const liquid=mesh(new THREE.CylinderGeometry(.335,.34,.70,48),new THREE.MeshPhysicalMaterial({color:0xe8eee4,transparent:true,opacity:.27,roughness:.07,clearcoat:1}),g);liquid.name='liquid';liquid.position.y=.4;
      const base=mesh(new THREE.TorusGeometry(.35,.016,8,48),plasticEdge,g);base.rotation.x=Math.PI/2;base.position.y=.045;return g;
    }
    const pitcher=makeJug();scene.add(pitcher);const sourceJug=makeJug();sourceJug.position.set(-1.22,.09,0);toolScene.add(sourceJug);
    const bottleMat=new THREE.MeshPhysicalMaterial({color:0xb81520,roughness:.16,transparent:true,opacity:.9,clearcoat:1});
    function makeDropper(){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.16,.19,.39,32),bottleMat,g).position.y=.25;const cap=mesh(new THREE.CylinderGeometry(.165,.165,.17,32),porcelain,g);cap.position.y=.53;const tip=mesh(new THREE.ConeGeometry(.065,.25,24),porcelain,g);tip.position.y=.73;for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const ridge=mesh(new THREE.CylinderGeometry(.006,.006,.14,4),porcelain,g);ridge.position.set(Math.cos(a)*.166,.53,Math.sin(a)*.166);}return g;}
    const dropper=makeDropper();scene.add(dropper);const sourceColor=makeDropper();sourceColor.position.set(1.45,.09,.02);toolScene.add(sourceColor);
    const selection=mesh(new THREE.TorusGeometry(.43,.023,10,64),new THREE.MeshStandardMaterial({color:0xf1c553,roughness:.4}),toolScene);selection.rotation.x=Math.PI/2;selection.position.y=.1;
    const clayLump=mesh(new THREE.SphereGeometry(.24,32,16),new THREE.MeshStandardMaterial({color:0xc2aea0,map:clay,bumpMap:clay,bumpScale:.03,roughness:.95}),toolScene);clayLump.position.set(-1.35,.19,.58);clayLump.scale.set(1.1,.66,.8);
    const stick=mesh(new THREE.CapsuleGeometry(.045,1.05,5,12),new THREE.MeshStandardMaterial({color:0xc9a370,roughness:.8}),toolScene);stick.position.set(.0,.12,.64);stick.rotation.z=Math.PI/2;
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
      if(lastClay!==state.clay||revision!==state.clay.revision){lastClay=state.clay;revision=state.clay.revision;const position=bodyGeometry.getAttribute('position');for(let j=0;j<=rows;j++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,y=.13+j/rows*2.3,rr=clayRadius(state.clay,y,a);position.setXYZ(j*(segments+1)+i,.09+Math.cos(a)*rr,y+(j===rows?.035*Math.sin(a*5)+.018*Math.sin(a*11):0),Math.sin(a)*rr);}position.needsUpdate=true;bodyGeometry.computeVertexNormals();bodyGeometry.computeBoundingSphere();updatePressed(state.clay);}
      controls.enabled=!live.current.locked&&!state.held&&!state.clayTool;controls.update();brush.visible=brush.visible&&!!state.clayTool;
      spoon.visible=state.held==='spoon'&&state.target!=='bowl';sourceSpoon.visible=state.held!=='spoon'||state.target==='bowl';
      sourceSpoon.position.copy(spoonRest);sourceSpoon.rotation.set(.2,2.65,-.45);if(state.held==='spoon'&&state.target==='bowl'){sourceSpoon.position.copy(bowlPosition).add(new THREE.Vector3(0,live.current.scooping()?.34+.04*Math.sin(time*9):.7,0));sourceSpoon.rotation.set(0,0,0);}
      spoon.position.lerp(freePosition,blend);spoon.rotation.x=-state.tilt*1.12;
      for(const g of [spoon,sourceSpoon]){const p=g.getObjectByName('powder')!;p.visible=state.spoonGrams>.015;p.scale.y=.08+state.spoonGrams/4*.34;}
      stock.scale.y=.3+.7*state.sodaStockGrams/24;bowl.visible=!live.current.building;stock.visible=!live.current.building&&state.sodaStockGrams>.005;
      pitcher.visible=state.held==='vinegar';sourceJug.visible=!pitcher.visible;pitcher.rotation.z=THREE.MathUtils.lerp(pitcher.rotation.z,state.tilt*.88,blend);
      const jugGoal=freePosition.clone();if(state.target==='crater'){const offset=new THREE.Vector3(-.4,1.1,0).applyEuler(pitcher.rotation);jugGoal.copy(mouthWorld()).add(new THREE.Vector3(0,.4,0)).sub(offset);}pitcher.position.lerp(jugGoal,blend);
      const fraction=Math.max(0,state.vinegarMl/60);for(const g of [pitcher,sourceJug]){const liquid=g.getObjectByName('liquid')!;liquid.visible=fraction>.005;liquid.scale.y=Math.max(.01,fraction);liquid.position.y=.05+.35*fraction;}pitcher.getObjectByName('liquid')!.rotation.z=-pitcher.rotation.z*.8;
      dropper.visible=state.held==='color';sourceColor.visible=!dropper.visible;const dropGoal=freePosition.clone();if(state.target==='crater')dropGoal.copy(mouthWorld()).add(new THREE.Vector3(0,1.1,0));dropper.position.lerp(dropGoal,blend);dropper.rotation.z=state.target==='crater'?Math.PI:0;
      if(live.current.building){sourceSpoon.visible=sourceJug.visible=sourceColor.visible=false;}clayLump.visible=stick.visible=live.current.building;selection.visible=!!state.held;selection.position.x=state.held==='vinegar'?-1.22:state.held==='color'?1.45:.12;
      powder.visible=r.sodaGrams>.02;powder.position.y=2.16+Math.min(r.liquidMl/120,.8)*.24;powder.scale.y=.05+Math.min(r.sodaGrams/8,1)*.22;
      water.visible=r.liquidMl-state.runoffMl>.05;water.position.y=cupWaterY(state);liquidRed.setHSL(.005,.87,.5-state.colorMix*.17,THREE.SRGBColorSpace);waterMat.color.set(0xeeeede).lerp(liquidRed,1-Math.exp(-state.colorMix*8));waterMat.opacity=.5+state.colorMix*.33;
      const landing=Math.max(water.position.y,powder.visible?powder.position.y+.31*powder.scale.y:2.13),age=state.colorDropAge;
      if(age<lastDropAge)dropOrigin.copy(root.worldToLocal(dropper.localToWorld(new THREE.Vector3(0,.855,0))));lastDropAge=age;drop.visible=age<.4;drop.position.copy(dropOrigin).lerp(new THREE.Vector3(.09,landing,0),Math.min(1,age/.4)**2);drop.scale.set(1,1.4,1);
      pigment.visible=state.colorDrops>0&&r.liquidMl<.05&&age>=.4;pigment.position.set(.09,landing+.006,0);pigment.scale.setScalar(Math.min(2,.7+state.colorDrops*.2));
      bloom.visible=age>=.4&&age<1.8&&r.liquidMl>.05;bloom.position.set(.09,water.position.y+.008,0);bloom.scale.setScalar(.4+Math.max(0,age-.4)*1.6);(bloom.material as THREE.MeshBasicMaterial).opacity=Math.max(0,.65-(age-.4)*.46);foam.update(state,water.position.y,simulationDt);
      const hasMaterial=state.held==='spoon'?state.spoonGrams>.001:state.vinegarMl>.001,flowing=state.held!=='color'&&state.pouring&&state.tilt>.25&&hasMaterial;
      const from=state.held==='spoon'?spoon.localToWorld(new THREE.Vector3(0,0,-.24)):pitcher.localToWorld(new THREE.Vector3(-.4,1.1,0));const to=state.target==='crater'?root.localToWorld(new THREE.Vector3(.09,Math.max(2.15,water.position.y),0)):new THREE.Vector3(from.x,.15,from.z);
      stream.visible=flowing&&state.held==='vinegar';if(stream.visible){const dir=from.clone().sub(to);stream.position.copy(from).add(to).multiplyScalar(.5);stream.scale.set(1,dir.length(),1);stream.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());}
      grains.visible=flowing&&state.held==='spoon';if(grains.visible){for(let i=0;i<42;i++){const f=(time*1.6+i/42)%1;dummy.position.copy(from).lerp(to,f*f);dummy.position.x+=Math.sin(i*12)*.03*f;dummy.position.z+=Math.cos(i*7)*.03*f;dummy.scale.setScalar(.7+(i%3)*.2);dummy.updateMatrix();grains.setMatrixAt(i,dummy.matrix);}grains.instanceMatrix.needsUpdate=true;}
      renderer.setScissorTest(true);renderer.setViewport(0,0,el.clientWidth,el.clientHeight);renderer.setScissor(0,0,el.clientWidth,el.clientHeight);renderer.clear();renderView(scene,camera,mainView);renderer.clearDepth();renderView(toolScene,toolCamera,toolView);
      if(now-lastAnchor>140){live.current.onAnchors({crater:project(mouthWorld(),camera,mainView),bowl:project(bowlPosition.clone().add(new THREE.Vector3(0,.08,.4)),toolCamera,toolView),spoon:project(bowlPosition.clone().add(new THREE.Vector3(0,.08,.4)),toolCamera,toolView),vinegar:project(new THREE.Vector3(-1.22,.16,.4),toolCamera,toolView),color:project(new THREE.Vector3(1.45,.16,.4),toolCamera,toolView)});lastAnchor=now;}
      frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();foam.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());clay.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div ref={host} className="v1-webgl" role="img" aria-label="Núi đất nặn bất đối xứng trên khay chữ nhật xanh ngọc, cốc nhựa mở và dụng cụ giấm, bột, phẩm màu"/>;
});

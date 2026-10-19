import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface VolcanoVisual {foam:number; peakFoam:number; color:boolean; sodaGrams:number; liquidMl:number; reacted:boolean}
interface Props { read:()=>VolcanoVisual; onMouth?:(point:{x:number;y:number})=>void; resetView?:number; active?:boolean }

export function VolcanoScene({read,onMouth,resetView=0,active=true}:Props) {
  const host=useRef<HTMLDivElement>(null);
  const live=useRef({read,onMouth,active}); live.current={read,onMouth,active};
  const reset=useRef<()=>void>(()=>{});
  useEffect(()=>{reset.current();},[resetView]);
  useEffect(()=>{
    const element=host.current; if(!element)return;
    let renderer:THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;
    element.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(36,1,.1,80);
    const controls=new OrbitControls(camera,renderer.domElement);
    controls.enablePan=false;controls.enableDamping=true;controls.minDistance=7;controls.maxDistance=13;
    controls.minPolarAngle=.7;controls.maxPolarAngle=1.26;
    reset.current=()=>{camera.position.set(4.7,4.2,8.1);controls.target.set(0,1.05,0);controls.update();};reset.current();
    const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);
    scene.environment=environment.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfffcf0,0xb7a28c,1.1));
    const key=new THREE.DirectionalLight(0xfff4de,2.4);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;key.shadow.bias=-.001;scene.add(key);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.15}));floor.rotation.x=-Math.PI/2;floor.position.y=-.07;floor.receiveShadow=true;scene.add(floor);
    const model=new THREE.Group();scene.add(model);
    function mesh(geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0) {const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);object.castShadow=true;object.receiveShadow=true;model.add(object);return object;}
    const trayMat=new THREE.MeshStandardMaterial({color:0xe9e9db,roughness:.3,metalness:.05});
    const tray=mesh(new THREE.CylinderGeometry(2.35,2.26,.12,80),trayMat,0,.02);tray.scale.z=.84;
    const rim=mesh(new THREE.TorusGeometry(2.31,.055,10,100),trayMat,0,.11);rim.rotation.x=Math.PI/2;rim.scale.y=.84;
    const profile=[new THREE.Vector2(1.63,.12),new THREE.Vector2(1.56,.25),new THREE.Vector2(1.31,.63),new THREE.Vector2(1.05,1.05),new THREE.Vector2(.78,1.53),new THREE.Vector2(.56,2.02),new THREE.Vector2(.49,2.29),new THREE.Vector2(.36,2.31),new THREE.Vector2(.34,2.08),new THREE.Vector2(.34,.23)];
    const clayGeometry=new THREE.LatheGeometry(profile,100);const positions=clayGeometry.getAttribute('position');
    for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);const angle=Math.atan2(z,x);const noise=1+.025*Math.sin(angle*13+y*9)+.018*Math.sin(angle*23-y*6);if(Math.hypot(x,z)>.4&&y<2.28)positions.setXYZ(i,x*noise,y,z*noise);}
    clayGeometry.computeVertexNormals();
    const clay=new THREE.MeshStandardMaterial({color:0x9e5535,roughness:.97});mesh(clayGeometry,clay);
    mesh(new THREE.CylinderGeometry(.337,.32,1.9,48,1,true),new THREE.MeshStandardMaterial({color:0x513024,roughness:1,side:THREE.BackSide}),0,1.21);
    const bottom=mesh(new THREE.CircleGeometry(.32,48),new THREE.MeshStandardMaterial({color:0x422d23,roughness:1}),0,.265);bottom.rotation.x=-Math.PI/2;
    const cup=mesh(new THREE.CylinderGeometry(.335,.32,1.9,48,1,true),new THREE.MeshPhysicalMaterial({color:0xf7faf0,roughness:.1,transparent:true,opacity:.24,side:THREE.DoubleSide}),0,1.22);
    cup.castShadow=false;
    const powder=mesh(new THREE.CircleGeometry(.31,48),new THREE.MeshStandardMaterial({color:0xfff9ec,roughness:1}),0,.29);powder.rotation.x=-Math.PI/2;
    const liquidMat=new THREE.MeshStandardMaterial({color:0xf0e9dc,roughness:.22});
    const liquid=mesh(new THREE.CircleGeometry(.32,48),liquidMat,0,.3);liquid.rotation.x=-Math.PI/2;
    // Tiny earthy flecks give the clay surface a handmade texture without external assets.
    const fleckMat=new THREE.MeshStandardMaterial({color:0x8d6247,roughness:1});
    for(let i=0;i<50;i++){const a=i*2.39996;const y=.25+(i%17)/17*1.8;const r=1.63-(y-.12)*.53;const fleck=mesh(new THREE.SphereGeometry(.014+(i%3)*.006,5,4),fleckMat,Math.cos(a)*r,y,Math.sin(a)*r);fleck.scale.y=.45;}
    const foamMat=new THREE.MeshStandardMaterial({color:0xfff4dd,roughness:.46,metalness:0});
    const bubbleGeometry=new THREE.SphereGeometry(1,14,10);
    const bubbles=Array.from({length:105},()=>{const b=mesh(bubbleGeometry,foamMat);b.visible=false;return b;});
    const spillMat=new THREE.MeshStandardMaterial({color:0xe4d8be,roughness:.25});
    const spill=mesh(new THREE.CircleGeometry(1,64),spillMat,0,.1,.15);spill.rotation.x=-Math.PI/2;spill.visible=false;
    let frame=0,lastProjection=0;const mouth=new THREE.Vector3(0,2.34,0);
    const resize=()=>{const w=element.clientWidth,h=element.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const tick=(now:number)=>{
      const state=live.current.read();controls.enabled=live.current.active;controls.update();
      const foam=Math.max(0,Math.min(1.5,state.foam));const colored=state.color;
      foamMat.color.set(colored?0xec927c:0xfff5df);liquidMat.color.set(colored?0xe58772:0xe1e3c8);
      powder.visible=state.sodaGrams>.05&&state.liquidMl<1;liquid.visible=state.liquidMl>0;
      liquid.position.y=.32+Math.min(state.liquidMl/90,1)*1.63;
      for(let i=0;i<bubbles.length;i++){
        const b=bubbles[i];b.visible=foam>.012&&i<foam*270;if(!b.visible)continue;
        const a=i*2.39996;const pulse=1+.07*Math.sin(now*.004+i);const size=(.065+(i%5)*.018)*pulse;
        if(i<36){const r=.26*Math.sqrt((i%12)/12);const foamTop=Math.min(2.4+foam*.2,liquid.position.y+foam*8);b.position.set(Math.cos(a)*r,foamTop+(i%5)*.045+Math.sin(now*.002+i)*.035,Math.sin(a)*r);b.scale.setScalar(size*1.2);}
        else {const progress=((i-36)/69+now*.00009)%1;const strength=Math.max(0,foam-.2);b.visible=strength>.01;const down=progress*Math.min(1,strength*5);const y=2.34-down*2.15;const r=.43+down*1.22;const lane=(i%4)*1.57+.35;const width=Math.sin(i*17)*.12; b.position.set(Math.cos(lane+width)*r,y,Math.sin(lane+width)*r);b.scale.set(size*(1+foam*.4),size*.8,size*(1+foam*.4));}
      }
      spill.visible=state.peakFoam>.45;spillMat.color.set(colored?0xe69a84:0xe5debe);spill.scale.set(1.05+state.peakFoam*.35,.7+state.peakFoam*.24,1);spill.position.x=.15;
      if(now-lastProjection>100){const p=mouth.clone().project(camera);live.current.onMouth?.({x:(p.x+1)/2*element.clientWidth,y:(1-p.y)/2*element.clientHeight});lastProjection=now;}
      renderer.render(scene,camera);frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});environment.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div className="volcano-webgl" ref={host} role="img" aria-label="Núi lửa đất nặn ba chiều, cốc mở ở miệng núi và khay hứng bọt trên bàn thí nghiệm"/>;
}

import * as THREE from 'three';
import { disposeItemModel } from './itemModels';

export type BoatVisual = { hull:'ball'|'shallow'|'deep'; cargo:number; immersion:number; sinking:boolean };

export function createFoilBoat(state:BoatVisual, previousCargo:number):THREE.Group {
  const boat = new THREE.Group();
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#888';ctx.fillRect(0,0,256,256);
  // Fine wrinkles in real geometry and a bump texture catch the studio lights.
  for(let i=0;i<150;i++){
    ctx.strokeStyle=i%2?'#aaa':'#666';ctx.lineWidth=.6+(i%4)*.4;ctx.beginPath();
    const x=(i*97)%256,y=(i*53)%256;
    ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(i*4.3)*60,y+Math.cos(i*2.7)*70);ctx.stroke();
  }
  const bump=new THREE.CanvasTexture(canvas);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;
  boat.userData.bumpTexture=bump;
  const foil=new THREE.MeshPhysicalMaterial({color:0xc5cbd0,metalness:.92,roughness:.24,bumpMap:bump,bumpScale:.04,side:THREE.DoubleSide,envMapIntensity:.85});
  if(state.hull==='ball') {
    const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.35,3),foil);
    const p=ball.geometry.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=1+.08*Math.sin(x*48+y*61+z*34);p.setXYZ(i,x*n,y*n,z*n);}
    ball.geometry.computeVertexNormals();boat.add(ball);boat.userData.height=.7;
  } else {
    const height=state.hull==='deep'?.9:.54;
    boat.userData.height=height;
    const hull=new THREE.CylinderGeometry(1,.73,height,64,4,true);
    const p=hull.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i),angle=Math.atan2(z,x);
      const wrinkle=.012*Math.sin(angle*19+y*22)+.009*Math.sin(angle*43-y*17);
      p.setXYZ(i,x*(1+wrinkle),y+(y>height*.4?.022*Math.sin(angle*17):0),z*(1+wrinkle));
    }
    hull.computeVertexNormals();
    const wall=new THREE.Mesh(hull,foil);wall.scale.set(1.8,1,1);boat.add(wall);
    const bottom=new THREE.Mesh(new THREE.CylinderGeometry(.74,.74,.035,64),foil);bottom.scale.x=1.8;bottom.position.y=-height/2;boat.add(bottom);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.025,8,64),foil);rim.rotation.x=Math.PI/2;rim.scale.x=1.8;rim.position.y=height/2;boat.add(rim);
    const timber=new THREE.MeshStandardMaterial({color:0xd5a16b,roughness:.6});
    for(let i=0;i<state.cargo;i++){
      const block=new THREE.Mesh(new THREE.BoxGeometry(.49,.48,.46),timber);
      const target=-height/2+.27+Math.floor(i/4)*.48;
      block.position.set(-.78+(i%4)*.52,target+(i===state.cargo-1&&state.cargo>previousCargo?1.4:0),0);
      block.userData.cargoY=target;block.castShadow=true;block.receiveShadow=true;boat.add(block);
      for(let j=0;j<3;j++){
        const grain=new THREE.Mesh(new THREE.BoxGeometry(.455,.007,.004),new THREE.MeshBasicMaterial({color:0xb67f46}));
        grain.position.set(0,-.16+j*.12,.233);block.add(grain);
      }
    }
  }
  boat.traverse(child=>{if(child instanceof THREE.Mesh){child.castShadow=true;child.receiveShadow=true;}});
  return boat;
}

export function disposeFoilBoat(boat:THREE.Group) {
  disposeItemModel(boat);(boat.userData.bumpTexture as THREE.Texture)?.dispose();
}

export function animateFoilBoat(boat:THREE.Group,state:BoatVisual,waterHeight:number,floorHeight:number,time:number,dt:number) {
  const height=boat.userData.height as number;
  const resting=state.hull==='ball'?floorHeight+.35:floorHeight+height/2;
  const target=state.sinking?resting:waterHeight+height/2-height*state.immersion;
  boat.position.y+=(target-boat.position.y)*(1-Math.exp(-dt*(state.sinking?1.7:4)));
  boat.rotation.z=state.sinking?.07:Math.sin(time*1.3)*.012;
  boat.rotation.x=state.sinking?.025:Math.cos(time*.9)*.008;
  for(const child of boat.children)if(typeof child.userData.cargoY==='number')child.position.y+=(child.userData.cargoY-child.position.y)*(1-Math.exp(-dt*7));
}

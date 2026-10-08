import * as THREE from 'three';
import { itemKind } from './playPhysics';
const photoTextures=new Map<string,THREE.Texture>();

/** Small, rotatable solid models; tray illustrations remain the original assets. */
export function createItemModel(id: string, size: number, image?:string, radius=size*.5): THREE.Group {
  const kind = itemKind(id);
  const group = new THREE.Group();
  if(image && typeof document!=='undefined') {
    let texture=photoTextures.get(image);
    if(!texture){texture=new THREE.TextureLoader().load(image,loaded=>{
      for(const fit of loaded.userData.onReady||[])fit();
      loaded.userData.onReady=[];
    });texture.userData.onReady=[];texture.colorSpace=THREE.SRGBColorSpace;photoTextures.set(image,texture);}
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.12,depthWrite:true}));
    const fit=()=>{
      const bitmap=texture!.image as {width:number;height:number}|undefined;
      const ratio=bitmap&&bitmap.height ? bitmap.width/bitmap.height : 1;
      const height=2*radius/size/Math.max(1,ratio);
      sprite.scale.set(height*ratio,height,1);
    };
    fit();
    if(!texture.image)texture.userData.onReady.push(fit);
    sprite.userData.itemId=id;
    group.add(sprite);group.scale.setScalar(size);group.userData.itemId=id;
    group.userData.photoAsset=image;
    return group;
  }
  const material = (color: number, metalness = 0, roughness = 0.3) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const add = (geometry: THREE.BufferGeometry, color: number, position = [0, 0, 0], scale = [1, 1, 1], metal = 0) => {
    const mesh = new THREE.Mesh(geometry, material(color, metal));
    mesh.position.set(...position as [number, number, number]);
    mesh.scale.set(...scale as [number, number, number]);
    mesh.userData.itemId = id;
    group.add(mesh);
    return mesh;
  };
  const sphere = () => new THREE.SphereGeometry(0.45, 24, 18);
  if (kind === 'item-egg') {
    const geometry = sphere();
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const taper = 0.88 - Math.max(0, y) * 0.35;
      positions.setXYZ(i, positions.getX(i) * taper, y * 1.16, positions.getZ(i) * taper);
    }
    geometry.computeVertexNormals();
    add(geometry, 0xf4dfba);
  } else if (kind === 'item-marble') {
    add(sphere(),0x67b4d7);
    add(new THREE.TorusGeometry(.25,.045,8,24),0xf6c444).rotation.x=.6;
  } else if (kind === 'item-coin') {
    add(new THREE.CylinderGeometry(.44,.44,.05,32),0xc8a44b);
  } else if (kind === 'item-bottle') {
    add(new THREE.BoxGeometry(.48,.75,.36),0xfff7e6,[0,-.065,0]);
    add(new THREE.BoxGeometry(.485,.34,.365),0x49a1d0,[0,-.24,0]);
    const roof=new THREE.BufferGeometry();
    roof.setAttribute('position',new THREE.Float32BufferAttribute([
      -.24,.31,-.18, .24,.31,-.18, -.24,.31,.18, .24,.31,.18, -.24,.48,0, .24,.48,0
    ],3));
    roof.setIndex([0,1,5,0,5,4,2,4,5,2,5,3,0,4,2,1,3,5]);
    roof.computeVertexNormals();
    const foldedTop=add(roof,0x49a1d0);
    (foldedTop.material as THREE.MeshStandardMaterial).side=THREE.DoubleSide;
    add(new THREE.BoxGeometry(.48,.045,.025),0xfff7e6,[0,.49,0]);
    // Paper packaging, with a simple cow motif rather than bottle geometry.
    add(sphere(),0xffffff,[0,.06,.183],[.3,.2,.015]);
    add(sphere(),0x273849,[-.05,.08,.193],[.06,.06,.015]);
    add(sphere(),0x273849,[.05,.08,.193],[.06,.06,.015]);
  } else if (kind === 'item-apple') {
    add(sphere(), 0xe64242, [0, -0.02, 0], [1, 0.92, 1]);
    add(new THREE.CylinderGeometry(0.035, 0.045, 0.19, 8), 0x785032, [0, 0.43, 0]);
    const leaf = add(sphere(), 0x65ae3d, [0.17, 0.44, 0], [0.45, 0.075, 0.22]);
    leaf.rotation.z = 0.25;
  } else if (kind === 'item-duck') {
    add(sphere(), 0xffd52c, [0, -0.13, 0], [1.1, 0.7, 0.85]);
    add(sphere(), 0xffdf35, [0.1, 0.25, 0.16], [0.61, 0.61, 0.61]);
    add(sphere(), 0xff942f, [0.12, 0.19, 0.43], [0.4, 0.14, 0.36]);
    add(sphere(), 0x293443, [0.28, 0.32, 0.31], [0.07, 0.07, 0.07]);
    add(sphere(), 0x293443, [-0.08, 0.32, 0.37], [0.07, 0.07, 0.07]);
    add(sphere(), 0xf6be1e, [-0.24, -0.09, 0.25], [0.4, 0.32, 0.17]);
  } else if (kind === 'item-pebble') {
    const geometry = new THREE.SphereGeometry(0.46, 32, 24);
    const positions=geometry.getAttribute('position');
    const colors:number[]=[];
    for(let i=0;i<positions.count;i++) {
      const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
      const irregular=1+.045*Math.sin(x*8+y*5+z*11);
      positions.setXYZ(i,x*irregular,y*irregular,z*irregular);
      const shade=.55+.45*(y/.46+1)/2+.035*Math.sin(x*170+y*220+z*190);
      const color=new THREE.Color(0xb5aa95).multiplyScalar(shade);
      colors.push(color.r,color.g,color.b);
    }
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geometry.computeVertexNormals();
    const stone=add(geometry, 0x827b6d, [0, 0, 0], [1.08, 0.94, 0.98]);
    (stone.material as THREE.MeshStandardMaterial).roughness=.95;
    (stone.material as THREE.MeshStandardMaterial).color.setHex(0xffffff);
    (stone.material as THREE.MeshStandardMaterial).vertexColors=true;
  } else if (kind === 'item-wood') {
    add(new THREE.BoxGeometry(0.65, 0.65, 0.65), 0xc79156);
    for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.6, 0.006, 0.012), 0x996834, [0, 0.327, -0.2 + i * 0.13]);
  } else if (kind === 'item-foam') {
    add(new THREE.BoxGeometry(0.77, 0.42, 0.58), 0xfffdf5);
    for (let i = 0; i < 6; i++) add(sphere(), 0xdddfe0, [-0.26 + (i % 3) * 0.24, -0.11 + Math.floor(i / 3) * 0.22, 0.292], [0.035, 0.035, 0.01]);
  } else if (kind === 'item-pingpong') {
    add(sphere(), 0xfff8e5);
    // Twelve black pentagonal panels on the inflated football.
    const phi = (1 + Math.sqrt(5)) / 2;
    const centers: THREE.Vector3[] = [];
    for (const a of [-1, 1]) for (const b of [-phi, phi]) {
      centers.push(new THREE.Vector3(0,a,b), new THREE.Vector3(a,b,0), new THREE.Vector3(b,0,a));
    }
    for (const normal of centers) {
      normal.normalize();
      const u = new THREE.Vector3().crossVectors(normal, Math.abs(normal.y) < .9 ? new THREE.Vector3(0,1,0) : new THREE.Vector3(1,0,0)).normalize();
      const v = new THREE.Vector3().crossVectors(normal,u);
      const points = [normal.clone().multiplyScalar(.47)];
      for (let i=0;i<5;i++) {
        const angle = i*Math.PI*2/5;
        points.push(normal.clone().multiplyScalar(.42).addScaledVector(u,Math.cos(angle)*.165).addScaledVector(v,Math.sin(angle)*.165).normalize().multiplyScalar(.47));
      }
      const positions: number[] = [];
      for (let i=0;i<5;i++) positions.push(...points[0].toArray(), ...points[i+1].toArray(), ...points[(i+1)%5+1].toArray());
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
      geometry.computeVertexNormals();
      const panel = add(geometry,0x24292e);
      (panel.material as THREE.MeshStandardMaterial).side=THREE.DoubleSide;
    }
  } else if (kind === 'item-leaf') {
    const leaf = add(sphere(), 0x69ae42, [0, 0, 0], [1, 0.085, 0.5]);
    leaf.rotation.y = -0.35;
    add(new THREE.CylinderGeometry(0.012, 0.012, 0.85, 6), 0xc5d47a).rotation.z = Math.PI / 2;
  } else if (kind === 'item-spoon') {
    add(sphere(), 0xcbd8e3, [0, 0, -0.28], [0.42, 0.1, 0.52], 0.8);
    add(new THREE.BoxGeometry(0.075, 0.025, 0.55), 0xcbd8e3, [0, 0, 0.2], [1, 1, 1], 0.8);
  } else {
    const ring = add(new THREE.TorusGeometry(0.19, 0.04, 8, 24), 0xd5ae52, [0, 0.2, 0], [1, 1, 1], 0.7);
    ring.rotation.x = Math.PI / 2;
    for (let key=0;key<3;key++) {
      const x=(key-1)*.15;
      const color=key===1?0xd5ae52:0xcbd8e3;
      add(new THREE.BoxGeometry(0.07, 0.06, 0.5), color, [x, 0.2, 0.3], [1, 1, 1], 0.7);
      for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.11, 0.06, 0.055), color, [x+.035, 0.2, 0.34 + i * 0.085], [1, 1, 1], 0.7);
    }
  }
  group.scale.setScalar(size);
  group.userData.itemId = id;
  return group;
}

export function disposeItemModel(group: THREE.Object3D) {
  group.traverse(child => {
    if(child instanceof THREE.Sprite) child.material.dispose();
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(material => material.dispose());
    }
  });
}

export function applyItemDamage(group: THREE.Group, id: string, damage?: string) {
  if (!damage || group.userData.damage === damage) return;
  group.userData.damage = damage;
  if(group.userData.photoAsset)return;
  const size = group.scale.x;
  const add = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color, roughness: 0.8}));
    mesh.position.set(x, y, z); mesh.userData.itemId = id; group.add(mesh); return mesh;
  };
  if (damage === 'broken') {
    group.children.forEach(child => {child.visible = false;});
    const white = add(new THREE.SphereGeometry(0.5, 20, 12), 0xffefba, 0, -0.18, 0);
    white.scale.set(1.4, 0.09, 1.1);
    const yolk = add(new THREE.SphereGeometry(0.19, 16, 10), 0xffbc24, 0.08, -0.11, 0);
    yolk.scale.y = 0.4;
    for (let i = 0; i < 5; i++) {
      const a = i * 1.25;
      const shell = add(new THREE.SphereGeometry(0.18, 12, 6, 0, Math.PI), 0xffe4ba, Math.cos(a)*0.48, -0.08, Math.sin(a)*0.35);
      shell.rotation.set(i*0.5, a, 0.3); shell.scale.y = 0.45;
    }
  } else if (damage === 'cracked') {
    for (let i = 0; i < 3; i++) {
      const crack = add(new THREE.BoxGeometry(0.014, 0.19, 0.015), 0x69513d, (i-1)*0.05, i*0.1-0.15, 0.37);
      crack.rotation.z = i%2 ? -0.4 : 0.4;
    }
  } else {
    const bruise = add(new THREE.SphereGeometry(0.18, 16, 10), 0x8a4831, 0.12, -0.08, 0.4);
    bruise.scale.set(1, 0.8, 0.12);
  }
  group.scale.setScalar(size);
}

import * as THREE from 'three';

/** Small, rotatable solid models; tray illustrations remain the original assets. */
export function createItemModel(id: string, size: number): THREE.Group {
  const group = new THREE.Group();
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
  if (id === 'item-egg') {
    const geometry = sphere();
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const taper = 0.88 - Math.max(0, y) * 0.35;
      positions.setXYZ(i, positions.getX(i) * taper, y * 1.16, positions.getZ(i) * taper);
    }
    geometry.computeVertexNormals();
    add(geometry, 0xf4dfba);
  } else if (id === 'item-apple') {
    add(sphere(), 0xe64242, [0, -0.02, 0], [1, 0.92, 1]);
    add(new THREE.CylinderGeometry(0.035, 0.045, 0.19, 8), 0x785032, [0, 0.43, 0]);
    const leaf = add(sphere(), 0x65ae3d, [0.17, 0.44, 0], [0.45, 0.075, 0.22]);
    leaf.rotation.z = 0.25;
  } else if (id === 'item-duck') {
    add(sphere(), 0xffd52c, [0, -0.13, 0], [1.1, 0.7, 0.85]);
    add(sphere(), 0xffdf35, [0.1, 0.25, 0.16], [0.61, 0.61, 0.61]);
    add(sphere(), 0xff942f, [0.12, 0.19, 0.43], [0.4, 0.14, 0.36]);
    add(sphere(), 0x293443, [0.28, 0.32, 0.31], [0.07, 0.07, 0.07]);
    add(sphere(), 0x293443, [-0.08, 0.32, 0.37], [0.07, 0.07, 0.07]);
    add(sphere(), 0xf6be1e, [-0.24, -0.09, 0.25], [0.4, 0.32, 0.17]);
  } else if (id === 'item-pebble') {
    const geometry = new THREE.IcosahedronGeometry(0.46, 2);
    add(geometry, 0x8f9491, [0, 0, 0], [1.1, 0.7, 0.85]);
  } else if (id === 'item-wood') {
    add(new THREE.BoxGeometry(0.88, 0.3, 0.48), 0xc79156);
    for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.7, 0.006, 0.018), 0x996834, [0, 0.154, -0.16 + i * 0.1]);
  } else if (id === 'item-foam') {
    add(new THREE.BoxGeometry(0.77, 0.42, 0.58), 0xfffdf5);
    for (let i = 0; i < 6; i++) add(sphere(), 0xdddfe0, [-0.26 + (i % 3) * 0.24, -0.11 + Math.floor(i / 3) * 0.22, 0.292], [0.035, 0.035, 0.01]);
  } else if (id === 'item-pingpong') {
    add(sphere(), 0xfff8e5);
  } else if (id === 'item-leaf') {
    const leaf = add(sphere(), 0x69ae42, [0, 0, 0], [1, 0.085, 0.5]);
    leaf.rotation.y = -0.35;
    add(new THREE.CylinderGeometry(0.012, 0.012, 0.85, 6), 0xc5d47a).rotation.z = Math.PI / 2;
  } else if (id === 'item-spoon') {
    add(sphere(), 0xcbd8e3, [0, 0, -0.28], [0.42, 0.1, 0.52], 0.8);
    add(new THREE.BoxGeometry(0.075, 0.025, 0.55), 0xcbd8e3, [0, 0, 0.2], [1, 1, 1], 0.8);
  } else {
    const ring = add(new THREE.TorusGeometry(0.19, 0.04, 8, 24), 0xd5ae52, [0, 0.2, 0], [1, 1, 1], 0.7);
    ring.rotation.x = Math.PI / 2;
    add(new THREE.BoxGeometry(0.07, 0.06, 0.5), 0xd5ae52, [0, 0.2, 0.3], [1, 1, 1], 0.7);
    for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.16, 0.06, 0.055), 0xd5ae52, [0.06, 0.2, 0.34 + i * 0.085], [1, 1, 1], 0.7);
  }
  group.scale.setScalar(size);
  group.userData.itemId = id;
  return group;
}

export function disposeItemModel(group: THREE.Object3D) {
  group.traverse(child => {
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

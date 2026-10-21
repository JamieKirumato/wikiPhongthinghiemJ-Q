import * as THREE from 'three';

/** Reuse only the empty oak surface of the approved classroom plate via UVs. */
export function createTableTexture() {
  const texture = new THREE.TextureLoader().load('/assets/sink-float/scenes/classroom.webp');
  texture.colorSpace = THREE.SRGBColorSpace;
  // Bottom-origin UVs exclude the room above and the photographed front edge below.
  texture.offset.set(.05, .12);
  texture.repeat.set(.90, .29);
  texture.anisotropy = 8;
  return texture;
}

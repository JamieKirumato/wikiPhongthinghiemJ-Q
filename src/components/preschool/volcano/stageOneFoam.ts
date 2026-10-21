import * as THREE from 'three';
import { ReactionState } from './reaction';

/** Qualitative rendering driven by the existing gas/foam model; no extra reagent or gas. */
export function createStageOneFoam(scene: THREE.Scene, radius: (y: number, angle: number) => number) {
  const bubbleGeometry = new THREE.SphereGeometry(1, 12, 9);
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xfffcee, roughness: .24, metalness: 0, clearcoat: .75,
    clearcoatRoughness: .13,
  });
  const mouth = new THREE.InstancedMesh(bubbleGeometry, bubbleMaterial, 150);
  const runoff = new THREE.InstancedMesh(bubbleGeometry, bubbleMaterial, 260);
  mouth.castShadow = runoff.castShadow = true;
  mouth.frustumCulled = runoff.frustumCulled = false;
  mouth.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  runoff.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mouth, runoff);
  const wetMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe4dfca, transparent: true, opacity: .48, roughness: .12,
    clearcoat: 1, depthWrite: false, side: THREE.DoubleSide,
  });
  const paths = [.48, 1.52, 2.48, 3.8, 5.15];
  const fronts = paths.map(() => 0);
  const ribbons = paths.map((angle, index) => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [], uv: number[] = [], triangles: number[] = [];
    for (let j = 0; j <= 72; j++) {
      const t = j / 72, y = 2.43 - t * 2.29;
      const center = angle + Math.sin(t * 8 + index) * .045;
      const width = (.018 + t * .026) * (1 + Math.sin(t * 21 + index) * .23);
      for (const sign of [-1, 1]) {
        const a = center + sign * width;
        const r = t < .07 ? .37 + (radius(y, a) - .37) * t / .07 : radius(y, a) + .028;
        vertices.push(Math.cos(a) * r + (1 - t) * .09, y, Math.sin(a) * r);
        uv.push(t, sign);
      }
      if (j < 72) { const k = j * 2; triangles.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(triangles); geometry.computeVertexNormals();
    const reach = { value: 0 }, material = wetMaterial.clone();
    material.onBeforeCompile = shader => {
      shader.uniforms.uReach = reach;
      shader.vertexShader = 'varying vec2 vWetUv;\n' + shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvWetUv=uv;');
      shader.fragmentShader = 'uniform float uReach;varying vec2 vWetUv;\n' + shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a*=1.0-smoothstep(max(0.0,uReach-.06),uReach,vWetUv.x);');
    };
    const mesh = new THREE.Mesh(geometry, material); mesh.receiveShadow = true; scene.add(mesh);
    return { mesh, reach };
  });
  const puddleGeometry = new THREE.CircleGeometry(1, 64);
  const puddle = new THREE.Mesh(puddleGeometry, wetMaterial);
  puddle.rotation.x = -Math.PI / 2; puddle.position.set(.09, .105, 0); scene.add(puddle);
  const dummy = new THREE.Object3D();
  let lastGas = 0, activity = 0, visualFoam = 0, clock = 0, wetness = 0;

  return {
    update(r: ReactionState, waterY: number, dt: number) {
      if (r.gasMl < lastGas || !r.reacted) {
        activity = visualFoam = wetness = clock = 0; fronts.fill(0);
      }
      const gasRate = Math.max(0, r.gasMl - lastGas) / Math.max(.001, dt);
      lastGas = r.gasMl;
      activity = THREE.MathUtils.lerp(activity, gasRate, 1 - Math.exp(-dt * 5));
      visualFoam = THREE.MathUtils.lerp(visualFoam, r.foam, 1 - Math.exp(-dt * 7));
      clock += dt;
      const intensity = Math.min(1, visualFoam * 3.8 + activity / 600);
      const count = r.reacted && intensity > .004 ? Math.ceil(145 * Math.sqrt(intensity)) : 0;
      // Normalized foam is an illustration scale, not a calibrated liquid volume.
      // Show the developing cap early enough to observe above the rim, without a jet.
      const foamHeight = Math.min(.60, visualFoam * 3);
      for (let i = 0; i < count; i++) {
        const a = i * 2.39996, radial = Math.sqrt(((i * 17) % 149) / 149) * .32;
        const phase = (clock * (.55 + i % 5 * .07) + i * .618) % 1;
        const life = Math.sin(Math.PI * phase);
        const size = (.021 + (i % 6) * .007) * (.4 + life * .65);
        dummy.position.set(.09 + Math.cos(a) * radial, waterY + .018 + foamHeight * (1 - radial * 1.3) + phase * .035, Math.sin(a) * radial);
        dummy.scale.set(size, size * (.85 + life * .2), size); dummy.updateMatrix();
        mouth.setMatrixAt(i, dummy.matrix);
      }
      mouth.count = count; mouth.instanceMatrix.needsUpdate = true;
      // Runoff begins only when the calculated froth reaches the physical cup lip.
      const overflowing = Math.max(0, Math.min(1, (waterY + foamHeight - 2.40) * 4));
      let flowCount = 0;
      paths.forEach((angle, index) => {
        if (overflowing > .01) fronts[index] = Math.min(1, fronts[index] + dt * overflowing * (.16 + index * .012));
        ribbons[index].reach.value = fronts[index];
        ribbons[index].mesh.visible = fronts[index] > .003;
        const bubbleFlow = overflowing > .005 ? overflowing : intensity * .16;
        for (let j = 0; j < 52 && fronts[index] > .003; j++) {
          const seed = Math.sin((j + 1) * (index + 7) * 12.9898) * 43758.5453;
          const scatter = seed - Math.floor(seed);
          const phase = (clock * (.085 + index * .008) + scatter) % 1;
          const t = phase * fronts[index];
          const size = (.009 + scatter * scatter * .035) * Math.sqrt(bubbleFlow);
          const a = angle + Math.sin(t * 8 + index) * .045 + Math.sin(j * 7) * (.02 + t * .025);
          const y = 2.43 - t * 2.29;
          const rr = t < .07 ? .37 + (radius(y, a) - .37) * t / .07 : radius(y, a) + .035;
          dummy.position.set(Math.cos(a) * rr + (1 - t) * .09, y + size * .5, Math.sin(a) * rr);
          dummy.scale.set(size * (1 + scatter * .25), size * .65, size * (1.1 + scatter * .35)); dummy.updateMatrix();
          runoff.setMatrixAt(flowCount++, dummy.matrix);
        }
      });
      runoff.count = flowCount; runoff.instanceMatrix.needsUpdate = true;
      if (fronts.some(f => f >= .98)) wetness = Math.min(1, wetness + dt * overflowing * .08);
      puddle.visible = wetness > .002;
      puddle.scale.set(1.65 + wetness * .3, 1.25 + wetness * .25, 1);
    },
    dispose() {
      mouth.removeFromParent(); runoff.removeFromParent(); puddle.removeFromParent();
      mouth.dispose(); runoff.dispose(); bubbleGeometry.dispose(); bubbleMaterial.dispose();
      puddleGeometry.dispose(); wetMaterial.dispose();
      ribbons.forEach(({ mesh }) => { mesh.removeFromParent(); mesh.geometry.dispose(); mesh.material.dispose(); });
    },
  };
}

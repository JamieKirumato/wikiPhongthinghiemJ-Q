import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { TankDimensions, TankObject, TankScale, TankShape, InteractionMode, SaltWorkflowStep } from './types';
import { clampToTankBoundary, calculateWaterRise, isPointInsideFootprint, getTankDimensions } from './tankGeometry';
import { floatingCenterY, submergedFraction } from './buoyancy';
import { createItemModel, disposeItemModel, applyItemDamage } from './itemModels';
import { damageFromImpact, gestureVelocity } from './impactPhysics';
import { playImpact, unlockImpactAudio } from './impactAudio';
import { soundEngine } from '../../../utils/audioEffects';

export interface ThreeTankCanvasHandle {
  checkPointInWater: (screenX: number, screenY: number) => boolean;
  checkPointOverTankMouth: (screenX: number, screenY: number) => { isOver: boolean; point?: THREE.Vector3 };
  spawnSaltGrains: (count: number, center?: THREE.Vector3) => void;
  clearSaltGrains: () => void;
  projectScreenToWorld: (screenX: number, screenY: number, targetPlaneZ?: number) => THREE.Vector3 | null;
  dropOrThrowItemAtScreenPos: (
    item: TankObject,
    screenX: number,
    screenY: number,
    screenVelocity?: { vx: number; vy: number }
  ) => void;
  cancelActiveGesture: () => void;
  resetDefaultView: () => void;
  resetSideView: () => void;
  refreshObservations: () => void;
  stirAtScreenPoint: (x: number, y: number, strength?: number) => void;
  setSaltDissolveProgress: (progress: number) => void;
  toggleAutoRotate: (enabled?: boolean) => boolean;
}

interface ThreeTankCanvasProps {
  shape: TankShape;
  scale: TankScale;
  dims: TankDimensions;
  items: TankObject[];
  onUpdateItems: (items: TankObject[]) => void;
  waterDensity: number;
  interactionMode: InteractionMode;
  onInteractionModeChange: (mode: InteractionMode) => void;
  holdingItemId: string | null;
  carryingTrayItem?: boolean;
  onHoldItem: (id: string | null) => void;
  workflowStep: SaltWorkflowStep;
  onPourSaltAtPoint: (point: THREE.Vector3) => void;
  soundEnabled: boolean;
  onMessageUpdate: (msg: string) => void;
  showXRay: boolean;
  onItemObserved?: (itemId: string, status: 'floating' | 'sunk') => void;
}

// Cấu hình vật thể 3D thế giới (World Units)
const ITEM_WORLD_SCALES: Record<string, { size: number; radius: number }> = {
  'item-pebble': { size: 0.70, radius: 0.35 },
  'item-keys': { size: 0.78, radius: 0.39 },
  'item-spoon': { size: 0.88, radius: 0.44 },
  'item-egg': { size: 0.75, radius: 0.375 },
  'item-apple': { size: 0.90, radius: 0.45 },
  'item-wood': { size: 0.85, radius: 0.425 },
  'item-duck': { size: 0.98, radius: 0.49 },
  'item-pingpong': { size: 0.66, radius: 0.33 },
  'item-leaf': { size: 0.82, radius: 0.41 },
  'item-foam': { size: 0.86, radius: 0.43 }
};

export const ThreeTankCanvas = forwardRef<ThreeTankCanvasHandle, ThreeTankCanvasProps>(
  (
    {
      shape,
      scale,
      dims,
      items,
      onUpdateItems,
      waterDensity,
      interactionMode,
      onInteractionModeChange,
      carryingTrayItem = false,
      holdingItemId,
      onHoldItem,
      workflowStep,
      soundEnabled,
      onMessageUpdate,
      showXRay,
      onItemObserved
    },
    ref
  ) => {
    const [hoveredItemId,setHoveredItemId] = useState<string | null>(null);
    const mountRef = useRef<HTMLDivElement | null>(null);
    const observedCallbackRef = useRef(onItemObserved);
    observedCallbackRef.current = onItemObserved;

    // Three.js core
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animFrameIdRef = useRef<number | null>(null);
    const lastItemsFlushRef = useRef(0);

    // Groups & Meshes
    const tankGroupRef = useRef<THREE.Group | null>(null);
    const waterMeshRef = useRef<THREE.Mesh | null>(null);
    const waterSurfaceMeshRef = useRef<THREE.Mesh | null>(null);
    const objectsGroupRef = useRef<THREE.Group | null>(null);
    const itemMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
    const rippleEffectsRef = useRef<Array<{mesh: THREE.Mesh; age: number; strength: number}>>([]);
    const splashEffectsRef = useRef<Array<{mesh: THREE.Mesh; age: number; velocity: THREE.Vector3}>>([]);
    const squashUntilRef = useRef(new Map<string,number>());
    const dissolveProgressRef = useRef(0);
    const liveSaltCountRef = useRef(200);
    const saltParticlesGroupRef = useRef<THREE.Points | null>(null);
    const saltDataRef = useRef<{ positions: Float32Array; velocities: Float32Array } | null>(null);

    // Orbit angles
    const DEFAULT_YAW = 0.56;
    const DEFAULT_PITCH = 0.35;
    const DEFAULT_DISTANCE = 12.8;

    const orbitRef = useRef<{
      yaw: number;
      pitch: number;
      distance: number;
      isDragging: number; // 0: none, 1: orbiting, 2: dragging item
      startX: number;
      startY: number;
      targetYaw: number;
      targetPitch: number;
      isAutoRotating: boolean;
    }>({
      yaw: DEFAULT_YAW,
      pitch: DEFAULT_PITCH,
      distance: DEFAULT_DISTANCE,
      isDragging: 0,
      startX: 0,
      startY: 0,
      targetYaw: DEFAULT_YAW,
      targetPitch: DEFAULT_PITCH,
      isAutoRotating: false
    });

    const zoomRef = useRef(1);
    const heldIdRef = useRef<string | null>(null);
    const dragSamplesRef = useRef<Array<{x:number;y:number;t:number}>>([]);
    const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane());
    const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

    // Sync refs
    const itemsRef = useRef<TankObject[]>(items);
    useEffect(() => {
      itemsRef.current = items;
    }, [items]);

    const waterDensityRef = useRef<number>(waterDensity);
    useEffect(() => {
      waterDensityRef.current = waterDensity;
    }, [waterDensity]);

    const dimsRef = useRef<TankDimensions>(dims);
    useEffect(() => {
      dimsRef.current = dims;
    }, [dims]);

    const shapeRef = useRef<TankShape>(shape);
    useEffect(() => {
      shapeRef.current = shape;
    }, [shape]);

    const workflowStepRef = useRef<SaltWorkflowStep>(workflowStep);
    useEffect(() => {
      workflowStepRef.current = workflowStep;
    }, [workflowStep]);

    const interactionModeRef = useRef<InteractionMode>(interactionMode);
    useEffect(() => {
      interactionModeRef.current = interactionMode;
    }, [interactionMode]);

    // Helper: Project screen (x, y) to 3D world on vertical plane passing through targetPlaneZ facing camera
    const projectScreenToWorldInternal = useCallback(
      (screenX: number, screenY: number, targetPlaneZ: number = 0): THREE.Vector3 | null => {
        if (!mountRef.current || !cameraRef.current) return null;
        const rect = mountRef.current.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;

        const ndcX = ((screenX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((screenY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), cameraRef.current);

        const camDir = new THREE.Vector3();
        cameraRef.current.getWorldDirection(camDir);

        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
          camDir.negate(),
          new THREE.Vector3(0, dimsRef.current.height * 0.5, targetPlaneZ)
        );

        const result = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, result)) {
          return result;
        }
        return null;
      },
      []
    );

    const spawnWaterReaction = useCallback((x: number, z: number, strength: number, splash = true) => {
      const scene = sceneRef.current;
      if (!scene) return;
      const ripple = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.17, 40),
        new THREE.MeshBasicMaterial({ color: 0x43cddd, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.set(x, dimsRef.current.waterHeight + 0.05, z);
      ripple.renderOrder = 6;
      scene.add(ripple);
      rippleEffectsRef.current.push({mesh: ripple, age: 0, strength});
      if (splash) for (let i = 0; i < Math.min(16, 4 + Math.round(strength * 2)); i++) {
        const droplet = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6),
          new THREE.MeshBasicMaterial({color: 0x72dfea, transparent: true, opacity: 0.85}));
        droplet.position.copy(ripple.position);
        scene.add(droplet);
        const angle = i * 2.399;
        splashEffectsRef.current.push({mesh: droplet, age: 0, velocity: new THREE.Vector3(Math.cos(angle) * strength * 0.25, 1.3 + strength * 0.25, Math.sin(angle) * strength * 0.25)});
      }
    }, []);

    // IMPERATIVE API EXPOSED TO PARENT
    useImperativeHandle(ref, () => ({
      checkPointInWater: (screenX: number, screenY: number): boolean => {
        if (!mountRef.current || !cameraRef.current || !waterMeshRef.current) return false;
        const rect = mountRef.current.getBoundingClientRect();
        if (
          screenX < rect.left ||
          screenX > rect.right ||
          screenY < rect.top ||
          screenY > rect.bottom
        ) {
          return false;
        }

        const ndcX = ((screenX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((screenY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), cameraRef.current);

        const targets: THREE.Object3D[] = [];
        if (waterMeshRef.current) targets.push(waterMeshRef.current);
        if (waterSurfaceMeshRef.current) targets.push(waterSurfaceMeshRef.current);

        const intersects = raycaster.intersectObjects(targets, true);
        return intersects.length > 0;
      },

      checkPointOverTankMouth: (screenX: number, screenY: number) => {
        if (!mountRef.current || !cameraRef.current) return { isOver: false };
        const rect = mountRef.current.getBoundingClientRect();
        if (
          screenX < rect.left ||
          screenX > rect.right ||
          screenY < rect.top ||
          screenY > rect.bottom
        ) {
          return { isOver: false };
        }

        const ndcX = ((screenX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((screenY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), cameraRef.current);

        const topH = dimsRef.current.height;
        const topPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -topH);
        const hitPoint = new THREE.Vector3();

        if (raycaster.ray.intersectPlane(topPlane, hitPoint)) {
          const isInside = isPointInsideFootprint(
            hitPoint.x,
            hitPoint.z,
            shapeRef.current,
            dimsRef.current,
            0.4
          );
          if (isInside) {
            return { isOver: true, point: hitPoint };
          }
        }
        return { isOver: false };
      },

      spawnSaltGrains: (count: number, center?: THREE.Vector3) => {
        if (!saltDataRef.current || !saltParticlesGroupRef.current) return;
        const { positions, velocities } = saltDataRef.current;
        dissolveProgressRef.current = 0;
        liveSaltCountRef.current = Math.min(200, count);
        const d = dimsRef.current;
        const spawnX = center ? center.x : 0;
        const spawnY = d.height + 0.3;
        const spawnZ = center ? center.z : 0;

        for (let i = 0; i < count; i++) {
          const idx = (i % 200) * 3;
          positions[idx] = spawnX + (Math.random() - 0.5) * 0.8;
          positions[idx + 1] = spawnY + Math.random() * 0.5;
          positions[idx + 2] = spawnZ + (Math.random() - 0.5) * 0.8;

          velocities[idx] = (Math.random() - 0.5) * 0.25;
          velocities[idx + 1] = -(Math.random() * 2.2 + 2.4);
          velocities[idx + 2] = (Math.random() - 0.5) * 0.25;
        }
        saltParticlesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      },

      clearSaltGrains: () => {
        if (!saltDataRef.current || !saltParticlesGroupRef.current) return;
        const { positions, velocities } = saltDataRef.current;
        for (let i = 0; i < 200; i++) {
          positions[i * 3 + 1] = -999;
          velocities[i * 3] = 0;
          velocities[i * 3 + 1] = 0;
          velocities[i * 3 + 2] = 0;
        }
        saltParticlesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      },

      projectScreenToWorld: (screenX: number, screenY: number, targetPlaneZ: number = 0) => {
        return projectScreenToWorldInternal(screenX, screenY, targetPlaneZ);
      },

      dropOrThrowItemAtScreenPos: (
        item: TankObject,
        screenX: number,
        screenY: number,
        screenVelocity?: { vx: number; vy: number }
      ) => {
        if (interactionModeRef.current !== 'interact' || workflowStepRef.current !== 'idle') return;
        const d = dimsRef.current;
        const s = shapeRef.current;
        const scaleCfg = ITEM_WORLD_SCALES[item.id] || { size: 0.8, radius: 0.4 };
        const itemR = scaleCfg.radius;

        // Chiếu tia từ tọa độ màn hình vào không gian 3D
        // A horizontal release plane makes screen position choose both X and Z.
        const rect = mountRef.current!.getBoundingClientRect();
        raycasterRef.current.setFromCamera(new THREE.Vector2((screenX-rect.left)/rect.width*2-1, -(screenY-rect.top)/rect.height*2+1), cameraRef.current!);
        const handPoint = projectScreenToWorldInternal(screenX,screenY,0);
        const handHeight = Math.max(itemR-0.6,Math.min(d.height+4,handPoint?.y ?? d.height+1.1));
        const releasePlane = new THREE.Plane(new THREE.Vector3(0,1,0), -handHeight);
        const releasePoint = new THREE.Vector3();
        const hit = raycasterRef.current.ray.intersectPlane(releasePlane, releasePoint);
        let worldPos = hit && releasePoint.distanceTo(cameraRef.current!.position) < 35 ? releasePoint : projectScreenToWorldInternal(screenX, screenY, 0);
        if (!worldPos) {
          worldPos = new THREE.Vector3(0, d.height + 1.2, 0);
        }

        // Clamp Y hợp lý (trên đáy bể và không bay khỏi nóc trời)
        const dropY = Math.max(itemR - 0.6, Math.min(d.height + 4.0, worldPos.y));

        // Clamp footprint để vật rơi vào trong thành bể
        const clampedPos = { x: worldPos.x, z: worldPos.z };
        const startsOutside = !isPointInsideFootprint(worldPos.x, worldPos.z, s, d, -itemR);
        if (startsOutside) onMessageUpdate('Vật đang ở ngoài miệng bể. Con thử ném vào bể hoặc kéo vật lại nhé!');

        // Vận tốc ném cử chỉ từ cử chỉ tay (gesture velocity)
        let vx = 0;
        let vy = -0.5; // Nhẹ nhàng rơi xuống mặc định
        let vz = 0;

        if (screenVelocity) {
          const screenRight = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraRef.current!.quaternion);
          screenRight.y = 0;
          screenRight.normalize();
          const horizontalSpeed = Math.max(-4.0, Math.min(4.0, screenVelocity.vx * 0.005));
          vx = screenRight.x * horizontalSpeed;
          vz = screenRight.z * horizontalSpeed;
          // vy kéo lên ném bổng, kéo xuống ném thẳng vào nước
          vy = Math.max(-6.0, Math.min(6.0, -screenVelocity.vy * 0.006));
        }

        onUpdateItems(
          itemsRef.current.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  inTank: true,
                  x: clampedPos.x,
                  y: dropY,
                  z: clampedPos.z,
                  vx,
                  vy,
                  vz,
                  settled: false,
                  status: 'falling',
                  outsideTank: startsOutside
                }
              : i
          )
        );


      },

      cancelActiveGesture: () => {
        heldIdRef.current = null;
        orbitRef.current.isDragging = 0;
        orbitRef.current.isAutoRotating = false;
        onHoldItem(null);
      },

      resetDefaultView: () => {
        zoomRef.current = 1;
        orbitRef.current.targetYaw = DEFAULT_YAW;
        orbitRef.current.targetPitch = DEFAULT_PITCH;
        orbitRef.current.isAutoRotating = false;
      },

      refreshObservations: () => { itemsRef.current = itemsRef.current.map(item => item.inTank ? {...item, settled:false} : item); },
      resetSideView: () => {
        orbitRef.current.targetYaw = 0;
        orbitRef.current.targetPitch = 0.08;
        orbitRef.current.isAutoRotating = false;
      },
      setSaltDissolveProgress: (progress: number) => { dissolveProgressRef.current = progress; },
      stirAtScreenPoint: (x: number, y: number, strength = 1) => {
        const point = projectScreenToWorldInternal(x, y, 0);
        if (!point) return;
        spawnWaterReaction(point.x, point.z, strength, false);
        const data = saltDataRef.current;
        if (data) for (let i = 0; i < 200; i++) {
          const index = i * 3;
          if (data.positions[index + 1] < 0) continue;
          const dx = data.positions[index] - point.x;
          const dz = data.positions[index + 2] - point.z;
          data.velocities[index] = -dz * 0.8;
          data.velocities[index + 2] = dx * 0.8;
          data.velocities[index + 1] = 0.6 + Math.random() * 0.3;
        }
      },
      toggleAutoRotate: (enabled?: boolean) => {
        const next = enabled !== undefined ? enabled : !orbitRef.current.isAutoRotating;
        orbitRef.current.isAutoRotating = next;
        return next;
      }
    }));

    // 1. KHỞI TẠO THREE.JS SCENE, CAMERA, RENDERER
    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera: Giữ cố định FOV và distance để bể nhỏ thu nhỏ 50% thực tế, không auto-zoom
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      rendererRef.current = renderer;
      renderer.domElement.style.display = 'block';

      container.replaceChildren(renderer.domElement);

      // Ánh sáng trong trẻo
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.05);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
      dirLight.position.set(8, 14, 10);
      scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.65);
      rimLight.position.set(-8, 8, -10);
      scene.add(rimLight);

      // Groups
      const tankGroup = new THREE.Group();
      scene.add(tankGroup);
      tankGroupRef.current = tankGroup;

      const objectsGroup = new THREE.Group();
      scene.add(objectsGroup);
      objectsGroupRef.current = objectsGroup;

      // Visible tiled floor: missed throws remain part of the experiment.
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(32,32), new THREE.MeshStandardMaterial({color:0xeee7db,roughness:0.9}));
      floor.rotation.x = -Math.PI/2; floor.position.y = -0.61; scene.add(floor);
      const grid = new THREE.GridHelper(32,32,0xc5bba9,0xd8cebd); grid.position.y=-0.6; scene.add(grid);
      // Hạt muối rơi 3D
      const maxSaltCount = 200;
      const saltGeom = new THREE.BufferGeometry();
      const saltPositions = new Float32Array(maxSaltCount * 3);
      const saltVelocities = new Float32Array(maxSaltCount * 3);
      for (let i = 0; i < maxSaltCount; i++) {
        saltPositions[i * 3 + 1] = -999;
      }
      saltGeom.setAttribute('position', new THREE.BufferAttribute(saltPositions, 3));
      const saltMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.14,
        transparent: true,
        opacity: 0.95
      });
      const saltPoints = new THREE.Points(saltGeom, saltMat);
      saltPoints.renderOrder = 3;
      scene.add(saltPoints);
      saltParticlesGroupRef.current = saltPoints;
      saltDataRef.current = {
        positions: saltPositions,
        velocities: saltVelocities
      };

      const handleResize = () => {
        if (!mountRef.current || !renderer || !camera) return;
        const w = mountRef.current.clientWidth || 800;
        const h = mountRef.current.clientHeight || 520;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
        }
        rippleEffectsRef.current.forEach(effect => disposeItemModel(effect.mesh));
        splashEffectsRef.current.forEach(effect => disposeItemModel(effect.mesh));
        rippleEffectsRef.current = []; splashEffectsRef.current = [];
        itemMeshesRef.current.forEach(disposeItemModel);
        saltGeom.dispose(); saltMat.dispose();
        renderer.dispose();
        itemMeshesRef.current.clear();
        scene.clear();
      };
    }, []);

    // 2. DỰNG HÌNH HỌC BỂ KÍNH VÀ NƯỚC (RENDER ORDER & PALE CYAN TRANSPARENCY)
    useEffect(() => {
      const tankGroup = tankGroupRef.current;
      if (!tankGroup) return;

      while (tankGroup.children.length > 0) {
        const child = tankGroup.children[0];
        tankGroup.remove(child);
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }

      const { width: W, height: H, depth: D } = dims;

      // Kính trong suốt tinh khiết
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transmission: 0.95,
        opacity: 0.12,
        transparent: true,
        roughness: 0.04,
        ior: 1.5,
        metalness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const whiteFrameMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.1
      });

      const siliconeSealMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.2,
        metalness: 0.15
      });

      // Đáy cát (renderOrder: 0, depthWrite: true)
      const sandMaterial = new THREE.MeshStandardMaterial({
        color: 0xf6f1e4,
        roughness: 0.85,
        metalness: 0.05
      });

      // Khối nước PALE CYAN trong suốt, không ám tối
      const waterVolumeMat = new THREE.MeshBasicMaterial({
        color: 0xa5edf5,
        transparent: true,
        opacity: 0.16,
        toneMapped: false,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      // Mặt trên nước trong suốt nhấp nhô nhẹ
      const waterSurfaceMat = new THREE.MeshBasicMaterial({
        color: 0xc6f4f8,
        transparent: true,
        opacity: 0.18,
        toneMapped: false,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      if (shape === 'rectangle' || shape === 'square') {
        const basePad = new THREE.Mesh(new THREE.BoxGeometry(W + 0.6, 0.22, D + 0.6), whiteFrameMat);
        basePad.position.set(0, -0.11, 0);
        basePad.renderOrder = 0;
        tankGroup.add(basePad);

        const sealMesh = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.08, D + 0.12), siliconeSealMat);
        sealMesh.position.set(0, 0.04, 0);
        sealMesh.renderOrder = 0;
        tankGroup.add(sealMesh);

        const sandMesh = new THREE.Mesh(new THREE.BoxGeometry(W - 0.05, 0.1, D - 0.05), sandMaterial);
        sandMesh.position.set(0, 0.05, 0);
        sandMesh.renderOrder = 0;
        tankGroup.add(sandMesh);

        // 4 vách kính (renderOrder = 4 để không đè mất vật thể bên trong)
        const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glassMaterial);
        frontGlass.position.set(0, H / 2, D / 2);
        frontGlass.renderOrder = 4;
        tankGroup.add(frontGlass);

        const backGlass = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glassMaterial);
        backGlass.position.set(0, H / 2, -D / 2);
        backGlass.rotation.y = Math.PI;
        backGlass.renderOrder = 4;
        tankGroup.add(backGlass);

        const leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(D, H), glassMaterial);
        leftGlass.position.set(-W / 2, H / 2, 0);
        leftGlass.rotation.y = Math.PI / 2;
        leftGlass.renderOrder = 4;
        tankGroup.add(leftGlass);

        const rightGlass = new THREE.Mesh(new THREE.PlaneGeometry(D, H), glassMaterial);
        rightGlass.position.set(W / 2, H / 2, 0);
        rightGlass.rotation.y = -Math.PI / 2;
        rightGlass.renderOrder = 4;
        tankGroup.add(rightGlass);

        // Viền trắng
        const rimFront = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.08, 0.08), whiteFrameMat);
        rimFront.position.set(0, H, D / 2);
        rimFront.renderOrder = 4;
        tankGroup.add(rimFront);

        const rimBack = rimFront.clone();
        rimBack.position.set(0, H, -D / 2);
        tankGroup.add(rimBack);

        const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, D + 0.12), whiteFrameMat);
        rimLeft.position.set(-W / 2, H, 0);
        rimLeft.renderOrder = 4;
        tankGroup.add(rimLeft);

        const rimRight = rimLeft.clone();
        rimRight.position.set(W / 2, H, 0);
        tankGroup.add(rimRight);

        // Khối nước: renderOrder = 2
        const waterGeom = new THREE.BoxGeometry(W - 0.04, dims.waterHeight, D - 0.04);
        waterGeom.translate(0, dims.waterHeight / 2, 0);
        const waterMesh = new THREE.Mesh(waterGeom, waterVolumeMat);
        waterMesh.position.set(0, 0, 0);
        waterMesh.renderOrder = 2;
        tankGroup.add(waterMesh);
        waterMeshRef.current = waterMesh;

        // Mặt nước: renderOrder = 3
        const surfaceGeom = new THREE.PlaneGeometry(W - 0.05, D - 0.05);
        const surfaceMesh = new THREE.Mesh(surfaceGeom, waterSurfaceMat);
        surfaceMesh.rotation.x = -Math.PI / 2;
        surfaceMesh.position.set(0, dims.waterHeight, 0);
        surfaceMesh.renderOrder = 3;
        tankGroup.add(surfaceMesh);
        waterSurfaceMeshRef.current = surfaceMesh;

      } else if (shape === 'cylinder') {
        const radius = W / 2;

        const basePad = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.35, radius + 0.35, 0.22, 48), whiteFrameMat);
        basePad.position.set(0, -0.11, 0);
        basePad.renderOrder = 0;
        tankGroup.add(basePad);

        const sealMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.06, radius + 0.06, 0.08, 48), siliconeSealMat);
        sealMesh.position.set(0, 0.04, 0);
        sealMesh.renderOrder = 0;
        tankGroup.add(sealMesh);

        const sandMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius - 0.03, radius - 0.03, 0.1, 48), sandMaterial);
        sandMesh.position.set(0, 0.05, 0);
        sandMesh.renderOrder = 0;
        tankGroup.add(sandMesh);

        const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, H, 48, 1, true), glassMaterial);
        glassMesh.position.set(0, H / 2, 0);
        glassMesh.renderOrder = 4;
        tankGroup.add(glassMesh);

        const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.04, 16, 64), whiteFrameMat);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(0, H, 0);
        rimMesh.renderOrder = 4;
        tankGroup.add(rimMesh);

        const waterGeom = new THREE.CylinderGeometry(radius - 0.03, radius - 0.03, dims.waterHeight, 48);
        waterGeom.translate(0, dims.waterHeight / 2, 0);
        const waterMesh = new THREE.Mesh(waterGeom, waterVolumeMat);
        waterMesh.position.set(0, 0, 0);
        waterMesh.renderOrder = 2;
        tankGroup.add(waterMesh);
        waterMeshRef.current = waterMesh;

        const surfaceMesh = new THREE.Mesh(new THREE.CircleGeometry(radius - 0.04, 48), waterSurfaceMat);
        surfaceMesh.rotation.x = -Math.PI / 2;
        surfaceMesh.position.set(0, dims.waterHeight, 0);
        surfaceMesh.renderOrder = 3;
        tankGroup.add(surfaceMesh);
        waterSurfaceMeshRef.current = surfaceMesh;

      } else if (shape === 'triangle') {
        const A = new THREE.Vector3(0, 0, -D / 2);
        const B = new THREE.Vector3(-W / 2, 0, D / 2);
        const C = new THREE.Vector3(W / 2, 0, D / 2);

        const baseGeom = new THREE.BufferGeometry();
        const baseVertices = new Float32Array([
          A.x, -0.11, A.z - 0.25,
          B.x - 0.25, -0.11, B.z + 0.25,
          C.x + 0.25, -0.11, C.z + 0.25
        ]);
        baseGeom.setAttribute('position', new THREE.BufferAttribute(baseVertices, 3));
        baseGeom.computeVertexNormals();
        const baseMesh = new THREE.Mesh(baseGeom, whiteFrameMat);
        baseMesh.renderOrder = 0;
        tankGroup.add(baseMesh);

        const sandGeom = new THREE.BufferGeometry();
        const sandVertices = new Float32Array([
          A.x, 0.05, A.z,
          B.x, 0.05, B.z,
          C.x, 0.05, C.z
        ]);
        sandGeom.setAttribute('position', new THREE.BufferAttribute(sandVertices, 3));
        sandGeom.computeVertexNormals();
        const sandMesh = new THREE.Mesh(sandGeom, sandMaterial);
        sandMesh.renderOrder = 0;
        tankGroup.add(sandMesh);

        for (const [start, end] of [[A, B], [B, C], [C, A]]) {
          const wallGeometry = new THREE.BufferGeometry();
          wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
            start.x, 0, start.z, end.x, 0, end.z, end.x, H, end.z,
            start.x, 0, start.z, end.x, H, end.z, start.x, H, start.z
          ], 3));
          wallGeometry.computeVertexNormals();
          const wall = new THREE.Mesh(wallGeometry, glassMaterial);
          wall.renderOrder = 4;
          tankGroup.add(wall);
          const direction = new THREE.Vector3().subVectors(end, start);
          for (const level of [0.04, H]) {
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, direction.length(), 8), whiteFrameMat);
            rim.position.copy(start).add(end).multiplyScalar(0.5);
            rim.position.y = level;
            rim.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
            rim.renderOrder = 4;
            tankGroup.add(rim);
            direction.subVectors(end, start);
          }
        }

        const prismPositions: number[] = [
          A.x, 0, A.z,  B.x, 0, B.z,  C.x, 0, C.z,
          A.x, dims.waterHeight, A.z,  C.x, dims.waterHeight, C.z,  B.x, dims.waterHeight, B.z,
          B.x, 0, B.z,  C.x, 0, C.z,  C.x, dims.waterHeight, C.z,
          B.x, 0, B.z,  C.x, dims.waterHeight, C.z,  B.x, dims.waterHeight, B.z,
          A.x, 0, A.z,  A.x, dims.waterHeight, A.z,  B.x, dims.waterHeight, B.z,
          A.x, 0, A.z,  B.x, dims.waterHeight, B.z,  B.x, 0, B.z,
          C.x, 0, C.z,  C.x, dims.waterHeight, C.z,  A.x, dims.waterHeight, A.z,
          C.x, 0, C.z,  A.x, dims.waterHeight, A.z,  A.x, 0, A.z
        ];
        const waterGeom = new THREE.BufferGeometry();
        waterGeom.setAttribute('position', new THREE.Float32BufferAttribute(prismPositions, 3));
        waterGeom.computeVertexNormals();

        const waterMesh = new THREE.Mesh(waterGeom, waterVolumeMat);
        waterMesh.renderOrder = 2;
        tankGroup.add(waterMesh);
        waterMeshRef.current = waterMesh;

        const surfaceGeom = new THREE.BufferGeometry();
        const surfVertices = new Float32Array([
          A.x, 0, A.z,
          C.x, 0, C.z,
          B.x, 0, B.z
        ]);
        surfaceGeom.setAttribute('position', new THREE.BufferAttribute(surfVertices, 3));
        surfaceGeom.computeVertexNormals();
        const surfaceMesh = new THREE.Mesh(surfaceGeom, waterSurfaceMat);
        surfaceMesh.renderOrder = 3;
        tankGroup.add(surfaceMesh);
        waterSurfaceMeshRef.current = surfaceMesh;
      }
    }, [shape, scale, dims]);

    // 3. ĐỒNG BỘ CÁC VẬT THỂ 3D VÀO SCENE (SỬ DỤNG UNLIT MeshBasicMaterial BẢO TOÀN MÀU RỰC RỠ)
    useEffect(() => {
      const objectsGroup = objectsGroupRef.current;
      if (!objectsGroup) return;

      const currentMap = itemMeshesRef.current;
      const activeItemIds = new Set(items.filter((i) => i.inTank).map((i) => i.id));

      // Xóa mesh không còn trong bể
      for (const [id, mesh] of currentMap.entries()) {
        if (!activeItemIds.has(id)) {
          objectsGroup.remove(mesh);
          disposeItemModel(mesh);
          currentMap.delete(id);
        }
      }

      // Tạo hoặc cập nhật mesh bằng unlit MeshBasicMaterial (renderOrder: 1)
      items.forEach((item) => {
        if (!item.inTank) return;

        const scaleCfg = ITEM_WORLD_SCALES[item.id] || { size: 0.8, radius: 0.4 };
        const itemSize = scaleCfg.size;

        let mesh = currentMap.get(item.id);
        if (!mesh) {
          mesh = createItemModel(item.id, itemSize);
          mesh.renderOrder = 1;
          objectsGroup.add(mesh);
          currentMap.set(item.id, mesh);
        }

        applyItemDamage(mesh, item.id, item.damage);
        mesh.traverse(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.setHex(showXRay ? 0x523171 : 0x000000);
            child.material.emissiveIntensity = showXRay ? 0.35 : 0;
          }
        });
      });
    }, [items, showXRay]);

    // 4. VÒNG LẶP CHÍNH (RENDER LOOP & 3D PHYSICS ENGINE TỨC THỜI)
    useEffect(() => {
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
        lastTime = currentTime;

        const camera = cameraRef.current;
        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const orbit = orbitRef.current;
        const d = dimsRef.current;
        const s = shapeRef.current;
        const currentWaterDensity = waterDensityRef.current;

        // Camera Orbit (Tự xoay chỉ chạy khi ở chế độ orbit, không cầm đồ vật và không ở quy trình muối)
        if (
          orbit.isAutoRotating &&
          interactionModeRef.current === 'orbit' &&
          !holdingItemId &&
          workflowStepRef.current === 'idle'
        ) {
          orbit.targetYaw += 0.005;
        }
        orbit.yaw += (orbit.targetYaw - orbit.yaw) * 0.12;
        orbit.pitch += (orbit.targetPitch - orbit.pitch) * 0.12;

        // Fit all eight corners at the current angle. Always fit the NORMAL
        // tank so selecting 50% never auto-zooms the small tank back to full size.
        const fitDims = getTankDimensions(s, 'normal');
        const fitTargetY = fitDims.height * 0.4;
        const tanVertical = Math.tan(THREE.MathUtils.degToRad(20)) * 0.92;
        const tanHorizontal = tanVertical * (camera?.aspect || 1);
        let r = orbit.distance;
        for (const px of [-fitDims.width / 2, fitDims.width / 2]) {
          for (const py of [-fitTargetY, fitDims.height - fitTargetY]) {
            for (const pz of [-fitDims.depth / 2, fitDims.depth / 2]) {
              const horizontal = px * Math.cos(orbit.yaw) - pz * Math.sin(orbit.yaw);
              const vertical = -px * Math.sin(orbit.yaw) * Math.sin(orbit.pitch) + py * Math.cos(orbit.pitch) - pz * Math.cos(orbit.yaw) * Math.sin(orbit.pitch);
              const depth = px * Math.sin(orbit.yaw) * Math.cos(orbit.pitch) + py * Math.sin(orbit.pitch) + pz * Math.cos(orbit.yaw) * Math.cos(orbit.pitch);
              r = Math.max(r, depth + Math.abs(horizontal) / tanHorizontal, depth + Math.abs(vertical) / tanVertical);
            }
          }
        }
        r *= zoomRef.current;
        const targetY = d.height * 0.4;
        const cx = r * Math.sin(orbit.yaw) * Math.cos(orbit.pitch);
        const cy = targetY + r * Math.sin(orbit.pitch);
        const cz = r * Math.cos(orbit.yaw) * Math.cos(orbit.pitch);

        if (camera) {
          camera.position.set(cx, cy, cz);
          camera.lookAt(0, targetY, 0);
        }

        // TÍNH THỂ TÍCH PHẦN CHÌM THỰC TẾ (SUBMERGED VOLUME)
        const currentTankItems = itemsRef.current;
        let totalSubmergedVolumeMl = 0;

        currentTankItems.forEach((item) => {
          if (!item.inTank || item.outsideTank) return;
          const scaleCfg = ITEM_WORLD_SCALES[item.id] || { size: 0.8, radius: 0.4 };
          const itemR = scaleCfg.radius;

          if (item.y - itemR >= d.waterHeight) {
            return;
          } else if (item.y + itemR <= d.waterHeight) {
            totalSubmergedVolumeMl += item.volumeMl;
          } else {
            const frac = submergedFraction(item.y, itemR, d.waterHeight);
            totalSubmergedVolumeMl += item.volumeMl * frac;
          }
        });

        const waterRise = calculateWaterRise(totalSubmergedVolumeMl, s, d);
        const effectiveWaterHeight = d.waterHeight + waterRise;

        // Scale khối nước theo world Y chuẩn
        if (waterMeshRef.current) {
          waterMeshRef.current.scale.y = effectiveWaterHeight / d.waterHeight;
        }
        if (waterSurfaceMeshRef.current) {
          waterSurfaceMeshRef.current.position.y =
            effectiveWaterHeight + Math.sin(currentTime * 0.003) * 0.015;
        }

        rippleEffectsRef.current = rippleEffectsRef.current.filter(effect => {
          effect.age += dt;
          effect.mesh.scale.setScalar(1 + effect.age * (4 + effect.strength));
          effect.mesh.position.y = effectiveWaterHeight + 0.04;
          (effect.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 * (1 - effect.age / 1.3));
          if (effect.age > 1.3) { scene?.remove(effect.mesh); disposeItemModel(effect.mesh); return false; }
          return true;
        });
        splashEffectsRef.current = splashEffectsRef.current.filter(effect => {
          effect.age += dt; effect.velocity.y -= 7 * dt;
          effect.mesh.position.addScaledVector(effect.velocity, dt);
          if (effect.age > 1 || effect.mesh.position.y < effectiveWaterHeight) { scene?.remove(effect.mesh); disposeItemModel(effect.mesh); return false; }
          return true;
        });

        // Hạt muối rơi 3D
        if (saltDataRef.current && saltParticlesGroupRef.current) {
          const { positions, velocities } = saltDataRef.current;
          let needsUpdate = false;
          for (let i = 0; i < 200; i++) {
            const idx = i * 3;
            if (positions[idx + 1] >= 0.05) {
              if (i / liveSaltCountRef.current < dissolveProgressRef.current / 100) { positions[idx + 1] = -999; needsUpdate = true; continue; }
              positions[idx] += velocities[idx] * dt;
              positions[idx + 1] += velocities[idx + 1] * dt;
              positions[idx + 2] += velocities[idx + 2] * dt;

              velocities[idx + 1] -= 0.65 * dt;
              if (positions[idx + 1] > d.waterHeight) velocities[idx + 1] = -0.4;
              const bounded = clampToTankBoundary(positions[idx], positions[idx + 2], 0.02, s, d);
              positions[idx] = bounded.x; positions[idx + 2] = bounded.z;
              if (positions[idx + 1] <= 0.08) {
                positions[idx + 1] = 0.08;
                velocities[idx] = 0;
                velocities[idx + 1] = 0;
                velocities[idx + 2] = 0;
              }
              needsUpdate = true;
            }
          }
          if (needsUpdate) {
            saltParticlesGroupRef.current.geometry.attributes.position.needsUpdate = true;
          }
        }

        // PHYSICS CHÌM / NỔI TỨC THỜI CHO TỪNG VẬT
        let itemsChanged = false;
        const nextItems = currentTankItems.map((item) => {
          if (!item.inTank || item.id === holdingItemId) return item;

          const scaleCfg = ITEM_WORLD_SCALES[item.id] || { size: 0.8, radius: 0.4 };
          const itemR = scaleCfg.radius;

          const inside = isPointInsideFootprint(item.x, item.z, s, d, -itemR);
          if (!inside) {
            let nx = item.x + item.vx*dt, nz = item.z + item.vz*dt;
            let nextVx = item.vx, nextVz = item.vz;
            if (item.y-itemR < d.height && isPointInsideFootprint(nx,nz,s,d,-itemR)) {
              nx=item.x; nz=item.z; nextVx *= -0.35; nextVz *= -0.35;
              if (soundEnabled && Math.hypot(item.vx,item.vz)>0.6) playImpact('glass',Math.hypot(item.vx,item.vz));
            }
            const floorY=item.damage==='broken' ? -0.42 : itemR-0.6;
            let nextVy=item.vy-12*dt;
            const nextY=Math.max(floorY,item.y+nextVy*dt);
            const hitFloor=item.y>floorY+0.001 && nextY<=floorY;
            let damage=item.damage;
            if (hitFloor) {
              const speed=Math.hypot(nextVy,nextVx,nextVz);
              damage=damageFromImpact(item.id,speed,damage);
              if (item.id==='item-duck' || item.id==='item-foam') squashUntilRef.current.set(item.id,currentTime+350);
              if (soundEnabled) playImpact(damage==='broken'||damage==='cracked'?'egg':item.id==='item-apple'?'apple':'tile',speed);
              if (damage && damage!==item.damage) onMessageUpdate(`${item.name} ${damage==='broken'?'đã vỡ':damage==='cracked'?'đã nứt':'bị dập'} khi chạm sàn. Con có thể lấy vật mới để thử lại nhé.`);
              nextVy=damage==='broken'?0:Math.abs(nextVy)*0.12;
            } else if (nextY<=floorY) nextVy=0;
            const mesh=itemMeshesRef.current.get(item.id);
            if(mesh) {
              mesh.position.set(nx,nextY,nz); applyItemDamage(mesh,item.id,damage);
              const squeeze=Math.max(0,((squashUntilRef.current.get(item.id)||0)-currentTime)/350)*0.22;
              mesh.scale.set(scaleCfg.size*(1+squeeze*0.5),scaleCfg.size*(1-squeeze),scaleCfg.size*(1+squeeze*0.5));
            }
            itemsChanged=true;
            return {...item,x:nx,z:nz,y:nextY,vy:nextVy,vx:nextVx*(1-3*dt),vz:nextVz*(1-3*dt),damage,outsideTank:true,status:nextY<=floorY?'grounded' as const:'falling' as const};
          }
          const itemDensity = item.weightGrams / item.volumeMl;
          const willFloat = itemDensity < currentWaterDensity;

          let { x, y, z, vx, vy, vz, angle, vRot } = item;
          let status = item.status;
          let settled = item.settled;
          if (settled && status === 'floating' && !willFloat) settled = false;

          // Xử lý dìm (pushed)
          if (status === 'pushed') {
            y = 0.15 + itemR;
            vy = 0;
            const mesh = itemMeshesRef.current.get(item.id);
            if (mesh && camera) {
              mesh.position.set(x, y, z);
              mesh.quaternion.copy(camera.quaternion);
            }
            return item;
          }

          // Vật nằm dưới đáy nhưng độ mặn tăng đủ để nổi -> BẬT DẬY NỔI LÊN NGAY!
          if (settled && status === 'sunk' && willFloat) {
            itemsChanged = true;
            return {
              ...item,
              status: 'floating' as const,
              settled: false,
              vy: 0.2
            };
          }

          const isSubmerged = y - itemR <= effectiveWaterHeight;

          if (!isSubmerged) {
            // Rơi tự do trên không
            const gAir = 12.0;
            vy -= gAir * dt;
            y += vy * dt;
            x += vx * dt;
            z += vz * dt;
            angle += vRot * dt;

            if (y - itemR <= effectiveWaterHeight) {
              spawnWaterReaction(x, z, Math.min(6, Math.abs(vy)), true);
              if (soundEnabled) {
                playImpact('water', Math.abs(vy) * itemR * 2);
              }
              status = willFloat ? 'floating' : 'sunk';
            }
            itemsChanged = true;
          } else {
            // Nằm trong nước
            if (willFloat) {
              const submergedFraction = Math.min(1.0, Math.max(0.15, itemDensity / currentWaterDensity));
              // Vị trí cân bằng để quả trứng NỔI NHÔ HẲN LÊN KHỎI MẶT NƯỚC (visibly breaks surface)
              const targetY = floatingCenterY(itemR, effectiveWaterHeight, submergedFraction);

              const displacement = y - targetY;
              const springK = 28.0;
              const damping = 4.2;
              const forceY = -springK * displacement - damping * vy;

              vy += forceY * dt;
              y += vy * dt;

              vx *= 1 - 3.5 * dt;
              vz *= 1 - 3.5 * dt;
              x += vx * dt;
              z += vz * dt;

              if (Math.abs(displacement) < 0.05 && Math.abs(vy) < 0.08) {
                y = targetY + Math.sin(currentTime * 0.003 + x) * 0.02;
                vy = 0;
                if (!settled) {
                  settled = true;
                  observedCallbackRef.current?.(item.id, 'floating');
                }
              }

              status = 'floating';
              itemsChanged = true;
            } else {
              // Vật nặng chìm xuống đáy cát
              const sinkAccel = 9.8 * Math.max(0.015, 1 - currentWaterDensity / itemDensity);
              const dragCoeff = itemDensity >= 2.0 ? 1.8 : 0.9;
              const forceY = -sinkAccel - dragCoeff * vy;

              vy += forceY * dt;
              y += vy * dt;

              vx *= 1 - 4.0 * dt;
              vz *= 1 - 4.0 * dt;
              x += vx * dt;
              z += vz * dt;

              const bottomLimit = itemR + 0.08;
              if (y <= bottomLimit) {
                y = bottomLimit;
                if (Math.abs(vy) > 0.8 && soundEnabled) {
                  soundEngine.playSandThump();
                }
                vy = 0;
                vx = 0;
                vz = 0;
                vRot = 0;
                if (!settled) {
                  settled = true;
                  observedCallbackRef.current?.(item.id, 'sunk');
                }
              }
              status = 'sunk';
              itemsChanged = true;
            }
          }

          if (y - itemR > d.height && !isPointInsideFootprint(x, z, s, d, -itemR)) {
            const mesh = itemMeshesRef.current.get(item.id);
            if (mesh) mesh.position.set(x, y, z);
            return {...item, x, y, z, vx, vy, vz, settled: false, outsideTank: true};
          }
          // Giới hạn biên bể kính theo footprint thực tế
          const clamped = clampToTankBoundary(x, z, itemR, s, d);
          if ((clamped.x !== x || clamped.z !== z) && Math.hypot(vx,vz)>0.6 && soundEnabled) playImpact('glass',Math.hypot(vx,vz));
          if (clamped.x !== x) vx *= -0.25;
          if (clamped.z !== z) vz *= -0.25;
          x = clamped.x; z = clamped.z;

          const mesh = itemMeshesRef.current.get(item.id);
          if (mesh && camera) {
            mesh.position.set(x, y, z);
            mesh.rotation.set(0.05, Math.sin(currentTime * 0.0003 + x) * 0.12, THREE.MathUtils.degToRad(angle));
          }

          return {
            ...item,
            x,
            y,
            z,
            vx,
            vy,
            vz,
            angle,
            vRot,
            settled,
            status,
            outsideTank: false,
            observed: settled ? (status === 'floating' ? 'floating' : 'sunk') : item.observed
          };
        });

        if (itemsChanged) {
          itemsRef.current = nextItems;
          if (currentTime - lastItemsFlushRef.current >= 50) {
            lastItemsFlushRef.current = currentTime;
            itemsRef.current=nextItems;
            onUpdateItems(nextItems);
          }
        }

        // Cập nhật vị trí mesh đang kéo
        if (holdingItemId) {
          const heldMesh = itemMeshesRef.current.get(holdingItemId);
          const heldItem = currentTankItems.find((i) => i.id === holdingItemId);
          if (heldMesh && heldItem && camera) {
            heldMesh.position.set(heldItem.x, heldItem.y, heldItem.z);
            heldMesh.rotation.z = 0.08;
          }
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }

        animFrameIdRef.current = requestAnimationFrame(animate);
      };

      animFrameIdRef.current = requestAnimationFrame(animate);
      return () => {
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
        }
      };
    }, [dims, shape, holdingItemId, onUpdateItems, soundEnabled]);

    // 5. TƯƠNG TÁC CON TRỎ CHUỘT (STRICT MODES: INTERACT NEVER ROTATES, ORBIT NEVER PICKS/DROPS)
    const handlePointerDown = (e: React.PointerEvent) => {
      const mount = mountRef.current;
      if (!mount || !cameraRef.current) return;

      unlockImpactAudio();
      if (carryingTrayItem || heldIdRef.current) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const currentStep = workflowStepRef.current;

      // 1. Nếu đang trong quy trình muối: khóa camera và đồ vật
      if (currentStep !== 'idle') {
        if (currentStep === 'holdingSpoon') {
          onMessageUpdate('Đưa thìa vào miệng bể rồi giữ và kéo để nghiêng thìa nhé!');
        }
        return;
      }

      const rect = mount.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const mouseNdc = new THREE.Vector2(
        (mouseX / rect.width) * 2 - 1,
        -(mouseY / rect.height) * 2 + 1
      );

      raycasterRef.current.setFromCamera(mouseNdc, cameraRef.current);
      const meshes = Array.from(itemMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const itemId = hitMesh.userData.itemId;
        if (itemId) {
          if (itemsRef.current.find(i=>i.id===itemId)?.damage==='broken') {onMessageUpdate('Trứng đã vỡ. Con chọn Lấy vật mới để thử lại nhé.');return;}
          heldIdRef.current=itemId;
          dragSamplesRef.current=[{x:e.clientX,y:e.clientY,t:performance.now()}];
          onHoldItem(itemId);
          orbitRef.current.isDragging = 2; // Đang kéo đồ vật trong bể

          const hitPoint = intersects[0].point;
          dragPlaneRef.current.setFromNormalAndCoplanarPoint(
            cameraRef.current.getWorldDirection(new THREE.Vector3()).negate(),
            hitPoint
          );

          const itemObj = itemsRef.current.find((i) => i.id === itemId);
          if (itemObj) {
            onMessageUpdate(
              `Bé đang cầm "${itemObj.name}". Kéo lên cao để ném, hoặc kéo dìm xuống nước nhé!`
            );
          }
          return;
        }
      }

      const glassHits = raycasterRef.current.intersectObjects(tankGroupRef.current?.children.filter(o => (o as THREE.Mesh).material instanceof THREE.MeshPhysicalMaterial || o.position.y >= dimsRef.current.height-0.1) || [], true);
      if (glassHits.length) {
        orbitRef.current.isDragging=1; orbitRef.current.startX=e.clientX; orbitRef.current.startY=e.clientY;
        orbitRef.current.isAutoRotating=false; onInteractionModeChange('orbit');
        onMessageUpdate('Con đang xoay bể. Buông tay để cầm đồ vật; lăn chuột để nhìn gần hoặc xa nhé.');
      }

    };

    const handlePointerMove = (e: React.PointerEvent) => {
      const orbit = orbitRef.current;
      const mount = mountRef.current;
      if (!mount || !cameraRef.current) return;

      if (workflowStepRef.current !== 'idle') return;

      if (orbit.isDragging === 0 && !carryingTrayItem) {
        const rect=mount.getBoundingClientRect();
        raycasterRef.current.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),cameraRef.current);
        const hit=raycasterRef.current.intersectObjects(Array.from(itemMeshesRef.current.values()),true).find(hit=>itemsRef.current.find(item=>item.id===hit.object.userData.itemId)?.damage!=='broken');
        setHoveredItemId(hit?.object.userData.itemId || null);
      }

      // Xoay bể ở chế độ orbit
      if (orbit.isDragging === 1) {
        const dx = e.clientX - orbit.startX;
        const dy = e.clientY - orbit.startY;
        orbit.startX = e.clientX;
        orbit.startY = e.clientY;

        orbit.targetYaw -= dx * 0.008;
        orbit.yaw = orbit.targetYaw;
        orbit.targetPitch = Math.max(0.08, Math.min(1.2, orbit.targetPitch + dy * 0.008));
        orbit.pitch = orbit.targetPitch;
        return;
      }

      // Kéo đồ vật ở chế độ interact
      if (orbit.isDragging === 2 && heldIdRef.current) {
        const holdingItemId=heldIdRef.current!;
        const samples=dragSamplesRef.current; samples.push({x:e.clientX,y:e.clientY,t:performance.now()});
        while(samples.length>1 && performance.now()-samples[0].t>120) samples.shift();
        const rect = mount.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const mouseNdc = new THREE.Vector2(
          (mouseX / rect.width) * 2 - 1,
          -(mouseY / rect.height) * 2 + 1
        );

        raycasterRef.current.setFromCamera(mouseNdc, cameraRef.current);
        const intersectionPoint = new THREE.Vector3();

        if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersectionPoint)) {
          const d = dimsRef.current;
          const s = shapeRef.current;
          const scaleCfg = ITEM_WORLD_SCALES[holdingItemId] || { size: 0.8, radius: 0.4 };
          const itemR = scaleCfg.radius;

          const maxY = d.height + 2.4;
          const minY = itemR - 0.6;
          let clampedY = Math.max(minY, Math.min(maxY, intersectionPoint.y));

          const clampedPos = {x:Math.max(-12,Math.min(12,intersectionPoint.x)),z:Math.max(-12,Math.min(12,intersectionPoint.z))};
          const previous = itemsRef.current.find(i=>i.id===holdingItemId);
          const wasInside = previous && isPointInsideFootprint(previous.x,previous.z,s,d,-itemR);
          const nowInside = isPointInsideFootprint(clampedPos.x,clampedPos.z,s,d,-itemR);
          if (clampedY-itemR < d.height && wasInside !== nowInside) {
            if (wasInside) Object.assign(clampedPos,clampToTankBoundary(clampedPos.x,clampedPos.z,itemR,s,d));
            else if (previous) {clampedPos.x=previous.x;clampedPos.z=previous.z;}
          }
          if (isPointInsideFootprint(clampedPos.x,clampedPos.z,s,d,-itemR)) {
            clampedY=Math.max(itemR+0.08,clampedY);
          }

          const nextItems = itemsRef.current.map((item) =>
            item.id === holdingItemId
              ? {
                  ...item,
                  x: clampedPos.x,
                  y: clampedY,
                  z: clampedPos.z,
                  vx: 0,
                  vy: 0,
                  vz: 0,
                  settled: false,
                  outsideTank: !isPointInsideFootprint(clampedPos.x,clampedPos.z,s,d,-itemR)
                }
              : item
          );
          const heldMesh=itemMeshesRef.current.get(holdingItemId);
          heldMesh?.position.set(clampedPos.x,clampedY,clampedPos.z);
          itemsRef.current=nextItems;
          if (performance.now()-lastItemsFlushRef.current>=50) {
            lastItemsFlushRef.current=performance.now();
            onUpdateItems(nextItems);
          }
        }
      }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      const id=heldIdRef.current;
      if (orbitRef.current.isDragging===2 && id) {
        const samples=dragSamplesRef.current, first=samples[0], last=samples[samples.length-1];
        const v=e.type==='pointercancel'||!first||!last ? {vx:0,vy:0} : gestureVelocity(last.x-first.x,last.y-first.y,(performance.now()-first.t)/1000);
        const right=new THREE.Vector3(1,0,0).applyQuaternion(cameraRef.current!.quaternion);right.y=0;right.normalize();
        const next=itemsRef.current.map(item=>item.id===id?{...item,vx:right.x*v.vx*0.005,vz:right.z*v.vx*0.005,vy:-v.vy*0.006,settled:false,status:'falling' as const}:item);
        itemsRef.current=next; onUpdateItems(next); onMessageUpdate('Con vừa buông tay. Hãy quan sát vật sẽ đi đâu nhé!');
      }
      heldIdRef.current=null; orbitRef.current.isDragging=0; onHoldItem(null); onInteractionModeChange('interact');
      if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    };

    useEffect(() => {
      const mount=mountRef.current;if(!mount)return;
      const wheel=(e:WheelEvent)=>{if(workflowStepRef.current!=='idle')return;e.preventDefault();zoomRef.current=Math.max(0.7,Math.min(1.8,zoomRef.current*Math.exp(e.deltaY*0.001)));};
      mount.addEventListener('wheel',wheel,{passive:false});return()=>mount.removeEventListener('wheel',wheel);
    },[]);

    return (
      <div className="relative w-full h-full min-h-0 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100/70 via-sky-50/50 to-blue-100/60 dark:from-slate-950 dark:via-sky-950/40 dark:to-slate-900 border-2 border-sky-300/80 shadow-inner flex flex-col">
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={()=>setHoveredItemId(null)}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`w-full flex-1 min-h-0 touch-none select-none ${
            workflowStep !== 'idle'
              ? 'cursor-pointer'
              : holdingItemId || carryingTrayItem || interactionMode === 'orbit'
              ? 'cursor-grabbing'
              : hoveredItemId
              ? 'cursor-pointer'
              : 'cursor-default'
          }`}
        />
      </div>
    );
  }
);

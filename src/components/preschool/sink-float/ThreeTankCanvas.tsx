import {freshComparisonItem} from './comparisonTrial';
import { tankCameraDistance } from './cameraFraming';
import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { TankDimensions, TankObject, TankScale, TankShape, InteractionMode, SaltWorkflowStep } from './types';
import { resolveTankWall, clampToTankBoundary, isPointInsideFootprint, getTankDimensions } from './tankGeometry';
import { floatingCenterY } from './buoyancy';
import { createItemModel, disposeItemModel, applyItemDamage } from './itemModels';
import { damageFromImpact, gestureVelocity, floorEggDamage } from './impactPhysics';
import { playImpact, playWaterSwish, unlockImpactAudio } from './impactAudio';
import { WaterImpulse } from './waterMotion';
import { configureWaterSurface } from './waterSurfaceShader';
import { advanceAirFall, itemKind } from './playPhysics';
import { SceneBackdrop, SceneSetting } from './SceneBackdrop';
import { advanceSinking,sinkingDrag, displacedWaterLevel, sandHeight, modelDisplacementVolume } from './waterPhysics';
import {boundedZoom,releasePosition,predictedContact} from './interactionPreview';
import {FloorSpill,FlowTarget,nearestHandTarget} from './waterTransfer';
import {IntroAction,introPose} from './introGuide';

export interface ThreeTankCanvasHandle {
  flowTarget: (x:number,y:number,sourceHeight?:number)=>FlowTarget|null;
  floorPoint: (x:number,y:number)=>{x:number;z:number}|null;
  showIntroFrame: (action:IntroAction|null,progress:number)=>{x:number;y:number;carrying:boolean;fromTray:number;tool:string;toolFill:number;item:string|null}|null;
  checkPointInWater: (screenX: number, screenY: number) => boolean;
  checkPointOverTankMouth: (screenX: number, screenY: number) => { isOver: boolean; point?: THREE.Vector3 };
  spawnSaltGrains: (count: number, center?: THREE.Vector3) => void;
  clearSaltGrains: () => void;
  projectScreenToWorld: (screenX: number, screenY: number, targetPlaneZ?: number) => THREE.Vector3 | null;
  previewDropAtScreenPos: (item:TankObject,x:number,y:number,velocity?:{vx:number;vy:number})=>void;
  clearDropPreview: ()=>void;
  dropItemAtTankCenter: (item:TankObject)=>void;
  dropOrThrowItemAtScreenPos: (
    item: TankObject,
    screenX: number,
    screenY: number,
    screenVelocity?: { vx: number; vy: number }
  ) => void;
  dropComparisonItem: (item:TankObject)=>void;
  cancelActiveGesture: () => void;
  resetDefaultView: () => void;
  resetSideView: () => void;
  refreshObservations: () => void;
  stirAtScreenPoint: (x: number, y: number, strength?: number) => void;
  setSaltDissolveProgress: (progress: number) => void;
  toggleAutoRotate: (enabled?: boolean) => boolean;
}

interface ThreeTankCanvasProps {
  floorSpills?:FloorSpill[];
  overflowAt?:number;
  shape: TankShape;
  sceneSetting?: SceneSetting;
  inputLocked?: boolean;
  scale: TankScale;
  dims: TankDimensions;
  items: TankObject[];
  onUpdateItems: (items: TankObject[]) => void;
  waterDensity: number;
  waterLevel?: number;
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
export const ITEM_WORLD_SCALES: Record<string, { size: number; radius: number }> = {
  'item-pebble': { size: 1.0, radius: 0.5 },
  'item-keys': { size: 0.78, radius: 0.50 },
  'item-spoon': { size: 0.88, radius: 0.50 },
  'item-egg': { size: 1.05, radius: 0.525 },
  'item-apple': { size: 0.90, radius: 0.45 },
  'item-wood': { size: 0.85, radius: 0.49 },
  'item-duck': { size: 0.98, radius: 0.60 },
  'item-pingpong': { size: 0.96, radius: 0.48 },
  'item-leaf': { size: 0.82, radius: 0.41 },
  'item-bottle': { size: .85, radius: .58 },
  'item-coin': {size:.65,radius:.325},
  'item-marble': {size:.65,radius:.325}
};

export const ThreeTankCanvas = forwardRef<ThreeTankCanvasHandle, ThreeTankCanvasProps>(
  (
    {
      shape,
      floorSpills = [],
      overflowAt = 0,
      sceneSetting = 'laboratory',
      inputLocked = false,
      scale,
      dims,
      items,
      onUpdateItems,
      waterDensity,
      waterLevel = dims.waterHeight,
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
    const [dropPreview,setDropPreview]=useState<{x:number;y:number;inside:boolean}|null>(null);
    const overflowRef=useRef<THREE.Mesh|null>(null);
    const overflowTimeRef=useRef(overflowAt);overflowTimeRef.current=overflowAt;
    const puddlesRef=useRef<THREE.Group|null>(null);
    const spillsRef=useRef(floorSpills);spillsRef.current=floorSpills;
    const renderedSpillsRef=useRef<FloorSpill[]|null>(null);
    const dragOffsetRef=useRef(new THREE.Vector3());
    const [hoveredItemId,setHoveredItemId] = useState<string | null>(null);
    const waterImpulsesRef = useRef<WaterImpulse[]>([]);
    const baseWaterLevelRef=useRef(waterLevel);
    baseWaterLevelRef.current=waterLevel;
    const displayedWaterLevelRef=useRef(waterLevel);
    const lastWaterGestureRef = useRef({time:0,x:0,y:0});
    const activePointerRef = useRef<number | null>(null);
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
    const sandTextureRef=useRef<THREE.Texture|null>(null);
    const waterSurfaceMeshRef = useRef<THREE.Mesh | null>(null);
    const waterlineRef = useRef<THREE.LineSegments | null>(null);
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
    const DEFAULT_PITCH = 0.24;

    const orbitRef = useRef<{
      yaw: number;
      pitch: number;

      isDragging: number; // 0: none, 1: orbiting, 2: dragging item
      startX: number;
      startY: number;
      targetYaw: number;
      targetPitch: number;
      isAutoRotating: boolean;
    }>({
      yaw: DEFAULT_YAW,
      pitch: DEFAULT_PITCH,

      isDragging: 0,
      startX: 0,
      startY: 0,
      targetYaw: DEFAULT_YAW,
      targetPitch: DEFAULT_PITCH,
      isAutoRotating: false
    });

    const zoomRef = useRef(1);
    const introGroupRef=useRef<{action:IntroAction;group:THREE.Group;actor?:THREE.Group}|null>(null);
    const introWaterRef=useRef<number|null>(null);
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
      waterImpulsesRef.current.push({x,z,time:performance.now()/1000,strength});
      waterImpulsesRef.current = waterImpulsesRef.current.slice(-8);
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

    const floorPoint=(x:number,y:number)=>{
      if(!mountRef.current||!cameraRef.current)return null;
      const rect=mountRef.current.getBoundingClientRect();
      if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return null;
      const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),cameraRef.current);
      const hit=new THREE.Vector3();return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),.6),hit)?{x:hit.x,z:hit.z}:null;
    };
    const flowTarget=(x:number,y:number,sourceHeight?:number):FlowTarget|null=>{
      if(!mountRef.current||!cameraRef.current)return null;
      const rect=mountRef.current.getBoundingClientRect(),camera=cameraRef.current;
      if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return null;
      const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),camera);
      const point=new THREE.Vector3(),d=dimsRef.current,shape=shapeRef.current;
      const atRim=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-(sourceHeight??d.height)),point);
      const inside=!!atRim&&isPointInsideFootprint(point.x,point.z,shape,d,.4);
      if(!inside){if(!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),.6),point)||isPointInsideFootprint(point.x,point.z,shape,d,0))return null;}
      const target=new THREE.Vector3(point.x,inside?Math.max(sandHeight(d),displayedWaterLevelRef.current):-.585,point.z);
      const projected=target.clone().project(camera);
      return {x:rect.left+(projected.x+1)*rect.width/2,y:rect.top+(1-projected.y)*rect.height/2,worldX:target.x,worldZ:target.z,inside};
    };

    // IMPERATIVE API EXPOSED TO PARENT
    useImperativeHandle(ref, () => ({
      flowTarget,floorPoint,
      showIntroFrame:(action,progress)=>{
        const scene=sceneRef.current,camera=cameraRef.current,mount=mountRef.current;
        if(!scene||!camera||!mount)return null;
        if(!action){
          if(introGroupRef.current){scene.remove(introGroupRef.current.group);disposeItemModel(introGroupRef.current.group);introGroupRef.current=null;}
          introWaterRef.current=null;displayedWaterLevelRef.current=baseWaterLevelRef.current;
          orbitRef.current.targetYaw=DEFAULT_YAW;orbitRef.current.targetPitch=DEFAULT_PITCH;zoomRef.current=1;
          waterImpulsesRef.current=[];
          rippleEffectsRef.current.forEach(effect=>{scene.remove(effect.mesh);disposeItemModel(effect.mesh);});rippleEffectsRef.current=[];
          return null;
        }
        const d=dimsRef.current,pose=introPose(action,progress,d,baseWaterLevelRef.current);
        introWaterRef.current=baseWaterLevelRef.current+pose.waterOffset;
        if(introGroupRef.current?.action!==action){
          if(introGroupRef.current){scene.remove(introGroupRef.current.group);disposeItemModel(introGroupRef.current.group);}
          const group=new THREE.Group();group.userData.demoOnly=true;
          const actor=pose.item?createItemModel(pose.item,.9,itemsRef.current.find(i=>itemKind(i.id)===pose.item)?.image):undefined;
          if(actor)group.add(actor);
          if(action==='salt'||action==='stir')for(let i=0;i<24;i++){
            const grain=new THREE.Mesh(new THREE.SphereGeometry(.035,6,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true}));
            group.add(grain);
          }
          scene.add(group);introGroupRef.current={action,group,actor};
        }
        const demo=introGroupRef.current;
        if(demo?.actor){
          demo.actor.visible=pose.fromTray===0;demo.actor.position.set(pose.x,pose.y,pose.z);

        }
        if(demo&&(action==='salt'||action==='stir'))demo.group.children.forEach((grain,i)=>{
          if(!(grain instanceof THREE.Mesh))return;
          const t=action==='salt'?Math.max(0,(progress-.68)/.22):progress;
          grain.visible=action==='salt'?progress>.68:progress<.8;
          grain.position.set(Math.sin(i*2.4)*.6,action==='salt'?d.height+.4-(d.height+.4-baseWaterLevelRef.current)*Math.min(1,t+i*.01):baseWaterLevelRef.current-.3-Math.min(1.4,t*2),Math.cos(i*2.4)*.5);
          (grain.material as THREE.MeshBasicMaterial).opacity=action==='stir'?Math.max(0,1-progress/.8):1;
        });
        if(action==='rotate'){
          orbitRef.current.targetYaw=DEFAULT_YAW+Math.sin(progress*Math.PI*2)*.7;
          zoomRef.current=1+Math.sin(Math.max(0,progress-.55)*Math.PI*4)*.2;
        }else{orbitRef.current.targetYaw=DEFAULT_YAW;zoomRef.current=action==='outside'?1.15:1;}
        if(action==='stir'&&progress>.08&&progress<.82&&performance.now()-lastWaterGestureRef.current.time>180){
          lastWaterGestureRef.current.time=performance.now();spawnWaterReaction(pose.x,pose.z,.5,false);
        }
        const handY=(action==='pick'||action==='outside')&&progress>.56&&!pose.carrying?d.height+.9:pose.y;
        const point=new THREE.Vector3(pose.x,handY,pose.z).project(camera),rect=mount.getBoundingClientRect();
        return {x:rect.left+(point.x+1)*rect.width/2,y:rect.top+(1-point.y)*rect.height/2,carrying:pose.carrying,fromTray:pose.fromTray,tool:pose.tool,toolFill:pose.toolFill,item:pose.item};
      },
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

      clearDropPreview:()=>setDropPreview(null),
      dropItemAtTankCenter:(item)=>{
        if(inputLockedRef.current||workflowStepRef.current!=='idle')return;
        const next=itemsRef.current.map(i=>i.id===item.id?{...i,inTank:true,outsideTank:false,status:'falling' as const,settled:false,x:0,z:0,y:dimsRef.current.height+.8,vx:0,vy:0,vz:0}:i);
        itemsRef.current=next;onUpdateItems(next);setDropPreview(null);
      },
      previewDropAtScreenPos:(item,screenX,screenY,screenVelocity)=>{
        const mount=mountRef.current,camera=cameraRef.current;if(!mount||!camera||inputLockedRef.current)return;
        const rect=mount.getBoundingClientRect(),radius=(ITEM_WORLD_SCALES[itemKind(item.id)]||{radius:.4}).radius;
        raycasterRef.current.setFromCamera(new THREE.Vector2((screenX-rect.left)/rect.width*2-1,-(screenY-rect.top)/rect.height*2+1),camera);
        const hand=projectScreenToWorldInternal(screenX,screenY,0);
        const pos=releasePosition(raycasterRef.current.ray,dimsRef.current,shapeRef.current,displayedWaterLevelRef.current,Math.max(radius-.6,Math.min(dimsRef.current.height+4,hand?.y??dimsRef.current.height+1)),radius);
        if(!pos){setDropPreview(null);return;}
        const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);right.y=0;right.normalize();
        const vx=Math.max(-4,Math.min(4,(screenVelocity?.vx||0)*.005)),vy=Math.max(-6,Math.min(6,-(screenVelocity?.vy||0)*.006));
        const contact=predictedContact(pos,new THREE.Vector3(right.x*vx,vy,right.z*vx),dimsRef.current,shapeRef.current,displayedWaterLevelRef.current,radius);
        if(!contact){setDropPreview(null);return;}
        const projected=contact.point.project(camera);setDropPreview({x:(projected.x+1)*rect.width/2,y:(1-projected.y)*rect.height/2,inside:contact.inside});
      },
      dropComparisonItem:(item)=>{
        if(inputLockedRef.current||workflowStepRef.current!=='idle')return;
        setDropPreview(null);
        // Identical world-space release, independent of camera angle or viewport.
        onUpdateItems(itemsRef.current.map(i=>i.id===item.id?{...freshComparisonItem(item),inTank:true,status:'falling',y:dimsRef.current.height+.8}:freshComparisonItem(i)));
      },
      dropOrThrowItemAtScreenPos: (
        item: TankObject,
        screenX: number,
        screenY: number,
        screenVelocity?: { vx: number; vy: number }
      ) => {
        if (inputLockedRef.current || interactionModeRef.current !== 'interact' || workflowStepRef.current !== 'idle') return;
        const d = dimsRef.current;
        const s = shapeRef.current;
        const scaleCfg = ITEM_WORLD_SCALES[itemKind(item.id)] || { size: 0.8, radius: 0.4 };
        const itemR = scaleCfg.radius;

        // Chiếu tia từ tọa độ màn hình vào không gian 3D
        // A horizontal release plane makes screen position choose both X and Z.
        const rect = mountRef.current!.getBoundingClientRect();
        raycasterRef.current.setFromCamera(new THREE.Vector2((screenX-rect.left)/rect.width*2-1, -(screenY-rect.top)/rect.height*2+1), cameraRef.current!);
        const handPoint = projectScreenToWorldInternal(screenX,screenY,0);
        const handHeight = Math.max(itemR-0.6,Math.min(d.height+4,handPoint?.y ?? d.height+1.1));
        const worldPos=releasePosition(raycasterRef.current.ray,d,s,displayedWaterLevelRef.current,handHeight,itemR);
        if(!worldPos)return;
        setDropPreview(null);

        // Clamp Y hợp lý (trên đáy bể và không bay khỏi nóc trời)
        const dropY = Math.max(itemR - 0.6, Math.min(d.height + 4.0, worldPos.y));

        // Clamp footprint để vật rơi vào trong thành bể
        const clampedPos = { x: worldPos.x, z: worldPos.z };
        const startsOutside = false;
        if(dropY-itemR<d.height)Object.assign(clampedPos,resolveTankWall(worldPos.x,worldPos.z,itemR,s,d,!startsOutside));
        if (startsOutside) onMessageUpdate('Vật đang ở ngoài miệng bể. Con thử ném vào bể hoặc kéo vật lại nhé!');

        // Vận tốc ném cử chỉ từ cử chỉ tay (gesture velocity)
        let vx = 0;
        let vy = 0; // Release at rest; gravity accelerates the object.
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
        activePointerRef.current = null;
        setDropPreview(null);
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
        if (!isPointInsideFootprint(point.x, point.z, shapeRef.current, dimsRef.current)) return;
        if (performance.now() - lastWaterGestureRef.current.time < 90) return;
        lastWaterGestureRef.current.time = performance.now();
        spawnWaterReaction(point.x, point.z, strength, false);
        if (soundEnabled) playWaterSwish(strength);
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

    const playWaterContact = (_id: string, speed: number) => {
      if (!soundEnabled) return;
      playImpact('water', speed);
    };

    const carryingTrayRef=useRef(carryingTrayItem);carryingTrayRef.current=carryingTrayItem;
    const holdingItemRef = useRef(holdingItemId);
    holdingItemRef.current = holdingItemId;
    const inputLockedRef = useRef(inputLocked);
    inputLockedRef.current = inputLocked;
    const floorRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null>(null);
    const contactShadowRef = useRef<THREE.Mesh | null>(null);

    // Exact mesh hits first, then a generous screen-space hand target for small objects.
    const pickItemAtScreenPoint = (screenX: number, screenY: number) => {
      if (!mountRef.current || !cameraRef.current) return null;
      const rect = mountRef.current.getBoundingClientRect();
      raycasterRef.current.setFromCamera(new THREE.Vector2((screenX-rect.left)/rect.width*2-1, -(screenY-rect.top)/rect.height*2+1), cameraRef.current);
      const canPick = (id: string) => itemsRef.current.some(item => item.id === id && item.inTank && item.damage !== 'broken');
      const exact = raycasterRef.current.intersectObjects(Array.from(itemMeshesRef.current.values()), true).find(hit => canPick(hit.object.userData.itemId));
      if (exact) return { itemId: exact.object.userData.itemId as string, point: exact.point };
      let nearest: { itemId: string; point: THREE.Vector3 } | null = null;
      const candidates:Array<{id:string;x:number;y:number;radius:number;point:THREE.Vector3}>=[];
      for (const [id, mesh] of itemMeshesRef.current) {
        if (!canPick(id)) continue;
        mesh.updateWorldMatrix(true, true);
        const bounds = new THREE.Box3().setFromObject(mesh);
        const sphere = bounds.getBoundingSphere(new THREE.Sphere());
        const projected = sphere.center.clone().project(cameraRef.current);
        if (projected.z < -1 || projected.z > 1) continue;
        const dx = rect.left + (projected.x+1)*rect.width/2 - screenX;
        const dy = rect.top + (1-projected.y)*rect.height/2 - screenY;
        const edge = sphere.center.clone().addScaledVector(new THREE.Vector3(1,0,0).applyQuaternion(cameraRef.current.quaternion), sphere.radius).project(cameraRef.current);
        const radius = Math.max(38, Math.abs(edge.x - projected.x) * rect.width / 2 + 18);
        const gap = Math.hypot(dx, dy);
        if(gap<=radius)candidates.push({id,x:screenX+dx,y:screenY+dy,radius,point:sphere.center.clone()});
      }
      const id=nearestHandTarget(candidates,screenX,screenY);
      const selected=candidates.find(c=>c.id===id);
      nearest=selected?{itemId:selected.id,point:selected.point}:null;return nearest;
    };

    // 1. KHỞI TẠO THREE.JS SCENE, CAMERA, RENDERER
    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Fixed FOV; responsive framing uses the normal tank to preserve compact scale.
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

      // A quiet worktop still catches objects thrown outside the tank.
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(32,32), new THREE.MeshBasicMaterial({color:0xe6eee8,toneMapped:false}));
      floor.rotation.x = -Math.PI/2; floor.position.y = -0.61; scene.add(floor); floorRef.current = floor;
      // Soft contact shadow, outside the tank group so it never becomes a picking target.
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext('2d')!;
      const shadowGradient = shadowContext.createRadialGradient(64,64,12,64,64,64);
      shadowGradient.addColorStop(0, 'rgba(29,67,57,.25)');
      shadowGradient.addColorStop(.55, 'rgba(29,67,57,.14)');
      shadowGradient.addColorStop(1, 'rgba(29,67,57,0)');
      shadowContext.fillStyle = shadowGradient; shadowContext.fillRect(0,0,128,128);
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}));
      contactShadow.rotation.x = -Math.PI/2; contactShadow.position.y = -.595;
      scene.add(contactShadow); contactShadowRef.current = contactShadow;
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
        if(introGroupRef.current){disposeItemModel(introGroupRef.current.group);introGroupRef.current=null;}
        if(puddlesRef.current){disposeItemModel(puddlesRef.current);puddlesRef.current=null;}
        if(overflowRef.current){disposeItemModel(overflowRef.current);overflowRef.current=null;}
        sandTextureRef.current?.dispose();
        saltGeom.dispose(); saltMat.dispose();
        floor.geometry.dispose(); floor.material.dispose();
        contactShadow.geometry.dispose(); contactShadow.material.dispose(); shadowTexture.dispose();
        contactShadowRef.current = null;
        renderer.dispose();
        itemMeshesRef.current.clear();
        scene.clear();
      };
    }, []);

    useEffect(() => {
      floorRef.current?.material.color.setHex(sceneSetting === 'laboratory' ? 0xe6eee8 : 0xffedc7);
    }, [sceneSetting]);

    // 2. DỰNG HÌNH HỌC BỂ KÍNH VÀ NƯỚC (RENDER ORDER & PALE CYAN TRANSPARENCY)
    useEffect(() => {
      const tankGroup = tankGroupRef.current;
      if (!tankGroup) return;
      sandTextureRef.current?.dispose();

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
      contactShadowRef.current?.scale.set(W * 1.7, D * 1.9, 1);

      // Kính trong suốt tinh khiết
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd8eee8,
        transmission: 0.95,
        opacity: 0.12,
        transparent: true,
        roughness: 0.04,
        ior: 1.5,
        metalness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const whiteFrameMat = new THREE.MeshBasicMaterial({
        color: 0xfafcf7,
        toneMapped: false
      });
      const rimMaterial = new THREE.MeshBasicMaterial({color:0xc5d8d0,toneMapped:false});

      const siliconeSealMat = new THREE.MeshStandardMaterial({
        color: 0x539a91,
        roughness: 0.2,
        metalness: 0.15
      });

      // Đáy cát (renderOrder: 0, depthWrite: true)
      const sandCanvas=document.createElement('canvas'); sandCanvas.width=256; sandCanvas.height=256;
      const sandContext=sandCanvas.getContext('2d')!;
      sandContext.fillStyle='#dcc28f'; sandContext.fillRect(0,0,256,256);
      let seed=12345;
      for(let i=0;i<18000;i++) {seed=(seed*1664525+1013904223)>>>0;const x=(seed>>>16)%256;seed=(seed*1664525+1013904223)>>>0;const y=(seed>>>16)%256;sandContext.fillStyle=['#c7ad7a','#ead5aa','#bda273','#f1dfb7'][i%4];sandContext.fillRect(x,y,1.5,1.5);}
      const sandTexture=new THREE.CanvasTexture(sandCanvas); sandTexture.wrapS=sandTexture.wrapT=THREE.RepeatWrapping;sandTexture.repeat.set(2,2);sandTexture.colorSpace=THREE.SRGBColorSpace;
      sandTextureRef.current=sandTexture;
      const sandMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map:sandTexture,
        toneMapped: false
      });

      // Khối nước PALE CYAN trong suốt, không ám tối
      const waterVolumeMat = new THREE.MeshBasicMaterial({
        color: 0x99ddd7,
        transparent: true,
        opacity: 0.25,
        toneMapped: false,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      // Mặt trên nước trong suốt nhấp nhô nhẹ
      const waterSurfaceMat = new THREE.MeshPhongMaterial({
        color: 0x96ded8,
        specular: 0xe9ffff,
        shininess: 100,
        transparent: true,
        opacity: 0.2,
        toneMapped: false,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      configureWaterSurface(waterSurfaceMat,W,D,shape);
      if (shape === 'rectangle' || shape === 'square') {
        const basePad = new THREE.Mesh(new THREE.BoxGeometry(W + 0.6, 0.22, D + 0.6), whiteFrameMat);
        basePad.position.set(0, -0.11, 0);
        basePad.renderOrder = 0;
        tankGroup.add(basePad);

        const sealMesh = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.08, D + 0.12), siliconeSealMat);
        sealMesh.position.set(0, 0.04, 0);
        sealMesh.renderOrder = 0;
        tankGroup.add(sealMesh);

        const sandMesh = new THREE.Mesh(new THREE.BoxGeometry(W - 0.05, sandHeight(dims), D - 0.05), sandMaterial);
        sandMesh.position.set(0, sandHeight(dims)/2, 0);
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

        // Pale green glass edges stay readable against the bright surroundings.
        const rimFront = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.08, 0.08), rimMaterial);
        rimFront.position.set(0, H, D / 2);
        rimFront.renderOrder = 4;
        tankGroup.add(rimFront);

        const rimBack = rimFront.clone();
        rimBack.position.set(0, H, -D / 2);
        tankGroup.add(rimBack);

        const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, D + 0.12), rimMaterial);
        rimLeft.position.set(-W / 2, H, 0);
        rimLeft.renderOrder = 4;
        tankGroup.add(rimLeft);

        const rimRight = rimLeft.clone();
        rimRight.position.set(W / 2, H, 0);
        tankGroup.add(rimRight);

        // Khối nước: renderOrder = 2
        const waterGeom = new THREE.BoxGeometry(W - 0.04, dims.waterHeight, D - 0.04);
        waterGeom.translate(0, dims.waterHeight / 2, 0);
        const openTopMat = waterVolumeMat.clone();
        openTopMat.opacity = 0;
        const waterMesh = new THREE.Mesh(waterGeom, [waterVolumeMat,waterVolumeMat,openTopMat,waterVolumeMat,waterVolumeMat,waterVolumeMat]);
        waterMesh.position.set(0, 0, 0);
        waterMesh.renderOrder = 2;
        tankGroup.add(waterMesh);
        waterMeshRef.current = waterMesh;

        // Mặt nước: renderOrder = 3
        const surfaceGeom = new THREE.PlaneGeometry(W - 0.05, D - 0.05, 32, 24);
        surfaceGeom.rotateX(-Math.PI / 2);
        const surfaceMesh = new THREE.Mesh(surfaceGeom, waterSurfaceMat);
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

        const sandMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius - 0.03, radius - 0.03, sandHeight(dims), 48), sandMaterial);
        sandMesh.position.set(0, sandHeight(dims)/2, 0);
        sandMesh.renderOrder = 0;
        tankGroup.add(sandMesh);

        const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, H, 48, 1, true), glassMaterial);
        glassMesh.position.set(0, H / 2, 0);
        glassMesh.renderOrder = 4;
        tankGroup.add(glassMesh);

        const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.04, 16, 64), rimMaterial);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(0, H, 0);
        rimMesh.renderOrder = 4;
        tankGroup.add(rimMesh);

        const waterGeom = new THREE.CylinderGeometry(radius - 0.03, radius - 0.03, dims.waterHeight, 48, 1, true);
        waterGeom.translate(0, dims.waterHeight / 2, 0);
        const waterMesh = new THREE.Mesh(waterGeom, waterVolumeMat);
        waterMesh.position.set(0, 0, 0);
        waterMesh.renderOrder = 2;
        tankGroup.add(waterMesh);
        waterMeshRef.current = waterMesh;

        const roundSurface = new THREE.RingGeometry(0, radius - 0.04, 64, 20);
        roundSurface.rotateX(-Math.PI / 2);
        const surfaceMesh = new THREE.Mesh(roundSurface, waterSurfaceMat);
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
          A.x, sandHeight(dims), A.z,
          B.x, sandHeight(dims), B.z,
          C.x, sandHeight(dims), C.z,
          A.x,0,A.z,B.x,0,B.z,B.x,sandHeight(dims),B.z,A.x,0,A.z,B.x,sandHeight(dims),B.z,A.x,sandHeight(dims),A.z,
          B.x,0,B.z,C.x,0,C.z,C.x,sandHeight(dims),C.z,B.x,0,B.z,C.x,sandHeight(dims),C.z,B.x,sandHeight(dims),B.z,
          C.x,0,C.z,A.x,0,A.z,A.x,sandHeight(dims),A.z,C.x,0,C.z,A.x,sandHeight(dims),A.z,C.x,sandHeight(dims),C.z
        ]);
        sandGeom.setAttribute('position', new THREE.BufferAttribute(sandVertices, 3));
        const sandUV=[];
        for(let i=0;i<sandVertices.length;i+=3)sandUV.push((sandVertices[i]+W/2)/W,(sandVertices[i+2]+D/2)/D);
        sandGeom.setAttribute('uv',new THREE.Float32BufferAttribute(sandUV,2));
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
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, direction.length(), 8), rimMaterial);
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
        const triangleVertices: number[] = [];
        const subdivisions = 32;
        const vertex = (i:number,j:number) => [A.x+(B.x-A.x)*i/subdivisions+(C.x-A.x)*j/subdivisions,0,A.z+(B.z-A.z)*i/subdivisions+(C.z-A.z)*j/subdivisions];
        for(let i=0;i<subdivisions;i++) for(let j=0;j<subdivisions-i;j++) {
          triangleVertices.push(...vertex(i,j),...vertex(i,j+1),...vertex(i+1,j));
          if(i+j<subdivisions-1) triangleVertices.push(...vertex(i+1,j),...vertex(i,j+1),...vertex(i+1,j+1));
        }
        const surfVertices = new Float32Array(triangleVertices);
        surfaceGeom.setAttribute('position', new THREE.BufferAttribute(surfVertices, 3));
        surfaceGeom.computeVertexNormals();
        const surfaceMesh = new THREE.Mesh(surfaceGeom, waterSurfaceMat);
        surfaceMesh.renderOrder = 3;
        tankGroup.add(surfaceMesh);
        waterSurfaceMeshRef.current = surfaceMesh;
      }
      // Outline the actual surface geometry, including circular and triangular tanks.
      const surface = waterSurfaceMeshRef.current;
      if (surface) {
        const waterline = new THREE.LineSegments(new THREE.EdgesGeometry(surface.geometry),
          new THREE.LineBasicMaterial({color: 0x69b9c5, transparent: true, opacity: 0.12, depthWrite: false}));
        waterline.rotation.copy(surface.rotation);
        waterline.position.copy(surface.position);
        waterline.renderOrder = 4;
        tankGroup.add(waterline);
        waterlineRef.current = waterline;
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

        const scaleCfg = ITEM_WORLD_SCALES[itemKind(item.id)] || { size: 0.8, radius: 0.4 };
        const itemSize = scaleCfg.size;

        let mesh = currentMap.get(item.id);
        if (!mesh) {
          mesh = createItemModel(item.id, itemSize,item.image,scaleCfg.radius);
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
        const dt = Math.min(0.08, (currentTime - lastTime) / 1000);
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
          !holdingItemRef.current &&
          workflowStepRef.current === 'idle'
        ) {
          orbit.targetYaw += 0.005;
        }
        orbit.yaw += (orbit.targetYaw - orbit.yaw) * 0.12;
        orbit.pitch += (orbit.targetPitch - orbit.pitch) * 0.12;

        // Fit all eight corners at the current angle. Always fit the NORMAL
        // tank so selecting 50% never auto-zooms the small tank back to full size.
        const fitDims = getTankDimensions(s, 'normal');
        let r = tankCameraDistance(fitDims, camera?.aspect || 1, orbit.yaw, orbit.pitch);
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
        if(overflowTimeRef.current>0&&currentTime-overflowTimeRef.current<350){
          if(!overflowRef.current){const edge=clampToTankBoundary(0,d.depth,0,s,d);const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(edge.x,d.height-.08,edge.z),new THREE.Vector3(0,d.height*.45,d.depth*.7),new THREE.Vector3(0,-.58,d.depth*.7));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.075,8,false),new THREE.MeshBasicMaterial({color:0x8be5ef,transparent:true,opacity:.75}));scene?.add(mesh);overflowRef.current=mesh;}
        }else if(overflowRef.current){scene?.remove(overflowRef.current);disposeItemModel(overflowRef.current);overflowRef.current=null;}
        if(renderedSpillsRef.current!==spillsRef.current){
          if(puddlesRef.current){scene?.remove(puddlesRef.current);disposeItemModel(puddlesRef.current);}
          const group=new THREE.Group();
          for(const spill of spillsRef.current){
            const radius=Math.max(.18,Math.sqrt(spill.ml/180));
            const mesh=new THREE.Mesh(new THREE.CircleGeometry(radius,48),new THREE.MeshBasicMaterial({color:0x80d9e9,transparent:true,opacity:.65,depthWrite:false,side:THREE.DoubleSide}));
            mesh.rotation.x=-Math.PI/2;mesh.scale.y=.75;mesh.position.set(spill.x,-.585,spill.z);group.add(mesh);
          }
          scene?.add(group);puddlesRef.current=group;renderedSpillsRef.current=spillsRef.current;
        }
        const displacedObjects=currentTankItems.filter(item=>item.inTank&&!item.outsideTank).map(item=>{
          const radius=(ITEM_WORLD_SCALES[itemKind(item.id)]||{radius:.4}).radius;
          const volume=modelDisplacementVolume(radius,item.volumeMl);
          return {y:item.y,radius,volume,
          // A resting floater displaces its weight, independent of decorative bobbing.
          immersedVolume:item.status==='floating'&&item.weightGrams/item.volumeMl<currentWaterDensity&&item.id!==holdingItemRef.current ? volume*Math.min(1,item.weightGrams/item.volumeMl/currentWaterDensity) : undefined
        };});
        const hasWater=(introWaterRef.current??baseWaterLevelRef.current)>sandHeight(d)+.001;
        const desiredLevel=hasWater?displacedWaterLevel(introWaterRef.current??baseWaterLevelRef.current,s,d,displacedObjects):sandHeight(d);
        displayedWaterLevelRef.current+=(desiredLevel-displayedWaterLevelRef.current)*(1-Math.exp(-dt*6));
        const effectiveWaterHeight=displayedWaterLevelRef.current;

        // Scale khối nước theo world Y chuẩn
        if (waterMeshRef.current) {
          waterMeshRef.current.visible=hasWater;
          waterMeshRef.current.scale.y = effectiveWaterHeight / d.waterHeight;
        }
        if (waterSurfaceMeshRef.current) {
          waterSurfaceMeshRef.current.visible=hasWater;
          const seconds = currentTime / 1000;
          waterImpulsesRef.current = waterImpulsesRef.current.filter(impulse => seconds - impulse.time < 2.4);
          (waterSurfaceMeshRef.current.material as THREE.MeshPhongMaterial).userData.updateWater?.(seconds,waterImpulsesRef.current);
          waterSurfaceMeshRef.current.position.y = effectiveWaterHeight;
        }
        if (waterlineRef.current && waterSurfaceMeshRef.current) {
          waterlineRef.current.visible=hasWater;
          waterlineRef.current.position.y = waterSurfaceMeshRef.current.position.y + 0.006;
        }
        rippleEffectsRef.current = rippleEffectsRef.current.filter(effect => {
          effect.age += dt;
          effect.mesh.scale.setScalar(1 + effect.age * (4 + effect.strength));
          effect.mesh.position.y = effectiveWaterHeight + 0.04;
          const edgeRadius = 0.17 * effect.mesh.scale.x;
          const fits = [0,1,2,3,4,5,6,7].every(i => isPointInsideFootprint(effect.mesh.position.x+Math.cos(i*Math.PI/4)*edgeRadius,effect.mesh.position.z+Math.sin(i*Math.PI/4)*edgeRadius,s,d));
          (effect.mesh.material as THREE.MeshBasicMaterial).opacity = fits ? Math.max(0, 0.65 * (1 - effect.age / 1.3)) : 0;
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
          if (!item.inTank || item.id === holdingItemRef.current) return item;

          const scaleCfg = ITEM_WORLD_SCALES[itemKind(item.id)] || { size: 0.8, radius: 0.4 };
          const itemR = scaleCfg.radius;

          const inside = !item.outsideTank || isPointInsideFootprint(item.x,item.z,s,d,-itemR);
          if (!inside) {
            let nx = item.x + item.vx*dt, nz = item.z + item.vz*dt;
            let nextVx = item.vx, nextVz = item.vz;
            if (item.y-itemR < d.height && isPointInsideFootprint(nx,nz,s,d,-itemR)) {
              nx=item.x; nz=item.z; nextVx *= -0.35; nextVz *= -0.35;
              if (soundEnabled && Math.hypot(item.vx,item.vz)>0.6) playImpact('glass',Math.hypot(item.vx,item.vz));
            }
            const safe=resolveTankWall(nx,nz,itemR,s,d,false);
            if(item.y-itemR<d.height){nx=safe.x;nz=safe.z;}
            const floorY=item.damage==='broken' ? -0.42 : itemR-0.6;
            const falling = advanceAirFall(item.y, item.vy, dt);
            let nextVy=falling.vy;
            const nextY=Math.max(floorY,falling.y);
            const hitFloor=nextY<=floorY && (item.y>floorY+0.001 || item.status==='falling');
            let damage=item.damage;
            if (hitFloor) {
              const speed=Math.hypot(nextVy,nextVx,nextVz);
              damage=damageFromImpact(item.id,speed,damage);
              if (itemKind(item.id)==='item-duck' || itemKind(item.id)==='item-foam') squashUntilRef.current.set(item.id,currentTime+350);
              if (soundEnabled) playImpact(damage==='broken'||damage==='cracked'?'egg':['item-apple','item-duck','item-foam','item-leaf','item-pingpong'].includes(itemKind(item.id))?'apple':'tile',speed);
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
          if (!hasWater) {
            const floor=itemR+sandHeight(d);
            const safe=clampToTankBoundary(item.x,item.z,itemR,s,d);
            const falling=advanceAirFall(item.y,item.vy,dt);
            const y=Math.max(floor,falling.y),resting=y<=floor;
            const mesh=itemMeshesRef.current.get(item.id);
            if(mesh)mesh.position.set(safe.x,y,safe.z);
            if(y!==item.y||safe.x!==item.x||safe.z!==item.z||item.status!=='grounded')itemsChanged=true;
            return {...item,...safe,y,vy:resting?0:falling.vy,vx:0,vz:0,settled:resting,status:resting?'grounded' as const:'falling' as const};
          }
          const willFloat = itemDensity < currentWaterDensity;
          // Resting objects do not need spring integration or React updates every frame.
          if (item.settled && item.status==='sunk' && !willFloat) {
            const safe=clampToTankBoundary(item.x,item.z,itemR,s,d);
            const y=Math.max(item.y,itemR+sandHeight(d));
            const mesh=itemMeshesRef.current.get(item.id);
            if(mesh)mesh.position.set(safe.x,y,safe.z);
            if(safe.x!==item.x||safe.z!==item.z||y!==item.y){itemsChanged=true;return {...item,...safe,y};}
            return item;
          }
          if (item.settled && item.status==='floating' && willFloat && Math.hypot(item.vx,item.vz)<.02) {
            const targetY=Math.max(itemR+sandHeight(d),floatingCenterY(itemR,effectiveWaterHeight,Math.max(.01,itemDensity/currentWaterDensity)));
            const safe=clampToTankBoundary(item.x,item.z,itemR,s,d);
            const mesh=itemMeshesRef.current.get(item.id);
            if(mesh) mesh.position.set(safe.x,targetY+Math.sin(currentTime*.0015+safe.x)*.006,safe.z);
            if(Math.abs(targetY-item.y)>.005||safe.x!==item.x||safe.z!==item.z) {itemsChanged=true;return {...item,...safe,y:targetY,vy:0};}
            return item;
          }

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
            const falling = advanceAirFall(y, vy, dt);
            vy = falling.vy;
            y = falling.y;
            x += vx * dt;
            z += vz * dt;
            angle += vRot * dt;

            if (y - itemR <= effectiveWaterHeight) {
              spawnWaterReaction(x, z, Math.min(6, Math.abs(vy)), true);
              if (soundEnabled) {
                playWaterContact(item.id, Math.abs(vy));
              }
              vy *= 0.65; // Initial splash dissipates some speed; water drag slows the rest gradually.
              status = willFloat ? 'floating' : 'sunk';
            }
            itemsChanged = true;
          } else {
            // Also cover a release already touching the surface, not only an air crossing.
            if (status === 'falling' && !settled) {
              spawnWaterReaction(x, z, Math.min(6, Math.abs(vy)), true);
              if (soundEnabled) playWaterContact(item.id, Math.abs(vy));
              vy *= 0.65;
            }
            // Nằm trong nước
            if (willFloat) {
              const submergedFraction = Math.min(1.0, Math.max(0.01, itemDensity / currentWaterDensity));
              // Vị trí cân bằng để quả trứng NỔI NHÔ HẲN LÊN KHỎI MẶT NƯỚC (visibly breaks surface)
              const targetY = floatingCenterY(itemR, effectiveWaterHeight, submergedFraction);

              const displacement = y - targetY;
              const springK = 12.0;
              const damping = 5.0;
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
              const sinking=advanceSinking(y,vy,dt,itemDensity,currentWaterDensity,sinkingDrag(item.id,item.weightGrams,item.volumeMl));
              vy=sinking.vy; y=sinking.y;

              vx *= 1 - 4.0 * dt;
              vz *= 1 - 4.0 * dt;
              x += vx * dt;
              z += vz * dt;

              const bottomLimit = itemR + sandHeight(d);
              if (y <= bottomLimit) {
                y = bottomLimit;
                if (!settled && Math.abs(vy) > 0.15 && soundEnabled) {
                  playImpact('sand', Math.abs(vy));
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

          // A floating object rests on the sand when scooping leaves too little water.
          if(y<itemR+sandHeight(d)){y=itemR+sandHeight(d);vy=Math.max(0,vy);}
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

        for(const egg of nextItems){
          if(holdingItemRef.current===egg.id||itemKind(egg.id)!=='item-egg'||!egg.outsideTank||egg.status!=='grounded'||egg.damage==='broken')continue;
          for(const other of currentTankItems){
            if(other.id===egg.id||other.id===holdingItemRef.current)continue;
            const damage=floorEggDamage(egg,other,dt,.525,ITEM_WORLD_SCALES[itemKind(other.id)]?.radius||.4);
            if(damage!==egg.damage){egg.damage=damage;itemsChanged=true;const mesh=itemMeshesRef.current.get(egg.id);if(mesh)applyItemDamage(mesh,egg.id,damage);if(soundEnabled)playImpact('egg',Math.abs(other.vy));}
          }
        }
        if (itemsChanged) {
          itemsRef.current = nextItems;
          if (currentTime - lastItemsFlushRef.current >= 100) {
            lastItemsFlushRef.current = currentTime;
            itemsRef.current=nextItems;
            onUpdateItems(nextItems);
          }
        }

        // Cập nhật vị trí mesh đang kéo
        if (holdingItemRef.current) {
          const heldMesh = itemMeshesRef.current.get(holdingItemRef.current);
          const heldItem = currentTankItems.find((i) => i.id === holdingItemRef.current);
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
    }, [onUpdateItems, soundEnabled]);

    // 5. TƯƠNG TÁC CON TRỎ CHUỘT (STRICT MODES: INTERACT NEVER ROTATES, ORBIT NEVER PICKS/DROPS)
    const handlePointerDown = (e: React.PointerEvent) => {
      if (inputLockedRef.current) return;
      if (activePointerRef.current !== null) return;
      const mount = mountRef.current;
      if (!mount || !cameraRef.current) return;

      unlockImpactAudio();
      if (carryingTrayItem || heldIdRef.current) return;
      activePointerRef.current = e.pointerId;
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
      const hit = pickItemAtScreenPoint(e.clientX, e.clientY);
      if (hit) {
        const itemId = hit.itemId;
        if (itemId) {
          heldIdRef.current=itemId;
          dragSamplesRef.current=[{x:e.clientX,y:e.clientY,t:performance.now()}];
          onHoldItem(itemId);
          orbitRef.current.isDragging = 2; // Đang kéo đồ vật trong bể

          const hitPoint = hit.point;
          const grabbed=itemsRef.current.find(i=>i.id===itemId);
          dragOffsetRef.current.set(grabbed?.x||0,grabbed?.y||0,grabbed?.z||0).sub(hitPoint);

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
      const waterHit = waterSurfaceMeshRef.current ? raycasterRef.current.intersectObject(waterSurfaceMeshRef.current)[0] : undefined;
      const rimHits = raycasterRef.current.intersectObjects(tankGroupRef.current?.children.filter(o => o.position.y >= dimsRef.current.height-.1 && !((o as THREE.Mesh).material instanceof THREE.MeshPhysicalMaterial)) || [],true);
      // Looking through transparent walls must not block touching the visible water.
      if (waterHit && (!rimHits.length || waterHit.distance < rimHits[0].distance - .03)) {
        orbitRef.current.isDragging = 3;
        orbitRef.current.isAutoRotating = false;
        lastWaterGestureRef.current = {time:performance.now(),x:e.clientX,y:e.clientY};

        spawnWaterReaction(waterHit.point.x,waterHit.point.z,.8,false);
        if(soundEnabled) playWaterSwish(.8);
        return;
      }
      if (glassHits.length) {
        orbitRef.current.isDragging=1; orbitRef.current.startX=e.clientX; orbitRef.current.startY=e.clientY;
        orbitRef.current.isAutoRotating=false; onInteractionModeChange('orbit');
        onMessageUpdate('Con đang xoay bể. Buông tay để cầm đồ vật; lăn chuột để nhìn gần hoặc xa nhé.');
      }

    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (inputLockedRef.current) return;
      if (activePointerRef.current !== null && activePointerRef.current !== e.pointerId) return;
      const orbit = orbitRef.current;
      const mount = mountRef.current;
      if (!mount || !cameraRef.current) return;

      if (workflowStepRef.current !== 'idle') return;

      if (orbit.isDragging === 3) {
        const rect = mount.getBoundingClientRect();
        raycasterRef.current.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),cameraRef.current);
        const point = new THREE.Vector3();
        const waterPlane = new THREE.Plane(new THREE.Vector3(0,1,0),-(waterSurfaceMeshRef.current?.position.y ?? dimsRef.current.waterHeight));
        const last = lastWaterGestureRef.current;
        const now = performance.now();
        const movement = Math.hypot(e.clientX-last.x,e.clientY-last.y);

        if(now-last.time >= 90 && movement > 4 && raycasterRef.current.ray.intersectPlane(waterPlane,point)
          && isPointInsideFootprint(point.x,point.z,shapeRef.current,dimsRef.current)) {
          const strength = Math.min(3,movement/Math.max(.09,(now-last.time)/1000)/180);
          spawnWaterReaction(point.x,point.z,strength,false);
          if(soundEnabled) playWaterSwish(strength);
          lastWaterGestureRef.current = {time:now,x:e.clientX,y:e.clientY};
        }
        return;
      }

      if (orbit.isDragging === 0 && !carryingTrayItem) {
        const rect=mount.getBoundingClientRect();
        raycasterRef.current.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),cameraRef.current);
        const hit=pickItemAtScreenPoint(e.clientX,e.clientY);
        setHoveredItemId(hit?.itemId || null);

      }

      // Xoay bể ở chế độ orbit
      if (orbit.isDragging === 1) {
        const dx = e.clientX - orbit.startX;
        const dy = e.clientY - orbit.startY;
        orbit.startX = e.clientX;
        orbit.startY = e.clientY;

        orbit.targetYaw -= dx * 0.005;
        orbit.yaw = orbit.targetYaw;
        orbit.targetPitch = Math.max(0.18, Math.min(.95, orbit.targetPitch + dy * 0.004));
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
          intersectionPoint.add(dragOffsetRef.current);
          const d = dimsRef.current;
          const s = shapeRef.current;
          const scaleCfg = ITEM_WORLD_SCALES[itemKind(holdingItemId)] || { size: 0.8, radius: 0.4 };
          const itemR = scaleCfg.radius;

          const maxY = d.height + 2.4;
          const minY = itemR - 0.6;
          let clampedY = Math.max(minY, Math.min(maxY, intersectionPoint.y));

          const clampedPos = clampToTankBoundary(intersectionPoint.x,intersectionPoint.z,itemR,s,d);
          const previous = itemsRef.current.find(i=>i.id===holdingItemId);
          const wasInside = previous && !previous.outsideTank;
          const nowInside = isPointInsideFootprint(clampedPos.x,clampedPos.z,s,d,-itemR);
          if (clampedY-itemR < d.height) {
            if (wasInside) Object.assign(clampedPos,clampToTankBoundary(clampedPos.x,clampedPos.z,itemR,s,d));
            else Object.assign(clampedPos,resolveTankWall(clampedPos.x,clampedPos.z,itemR,s,d,false));
          }
          if (isPointInsideFootprint(clampedPos.x,clampedPos.z,s,d,-itemR)) {
            clampedY=Math.max(itemR+sandHeight(d),clampedY);
          }

          const surfaceY = waterSurfaceMeshRef.current?.position.y ?? d.waterHeight;
          const gestureNow = performance.now();
          if(previous && nowInside && clampedY-itemR <= surfaceY
            && Math.hypot(clampedPos.x-previous.x,clampedY-previous.y,clampedPos.z-previous.z) > .015
            && gestureNow-lastWaterGestureRef.current.time >= 90) {
            spawnWaterReaction(clampedPos.x,clampedPos.z,1.2,false);
            if(soundEnabled) playWaterSwish(1.2);
            lastWaterGestureRef.current.time = gestureNow;
          }
          if (previous && wasInside && nowInside && previous.y-itemR > surfaceY && clampedY-itemR <= surfaceY) {
            playWaterContact(holdingItemId, 2);
            spawnWaterReaction(clampedPos.x, clampedPos.z, 1.5, true);
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
                  outsideTank: false
                }
              : item
          );
          const firstSample=samples[0],velocity=firstSample?gestureVelocity(e.clientX-firstSample.x,e.clientY-firstSample.y,(performance.now()-firstSample.t)/1000):{vx:0,vy:0};
          const right=new THREE.Vector3(1,0,0).applyQuaternion(cameraRef.current.quaternion);right.y=0;right.normalize();
          const contact=predictedContact(new THREE.Vector3(clampedPos.x,clampedY,clampedPos.z),new THREE.Vector3(right.x*velocity.vx*.005,-velocity.vy*.006,right.z*velocity.vx*.005),d,s,surfaceY,itemR);
          if(contact){const projected=contact.point.project(cameraRef.current);setDropPreview({x:(projected.x+1)*rect.width/2,y:(1-projected.y)*rect.height/2,inside:contact.inside});}else setDropPreview(null);
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
      if (activePointerRef.current !== null && activePointerRef.current !== e.pointerId) return;
      activePointerRef.current = null;
      setDropPreview(null);
      const id=heldIdRef.current;
      if (orbitRef.current.isDragging===2 && id) {
        const samples=dragSamplesRef.current, first=samples[0], last=samples[samples.length-1];
        const v=e.type==='pointercancel'||!first||!last ? {vx:0,vy:0} : gestureVelocity(last.x-first.x,last.y-first.y,(performance.now()-first.t)/1000);
        const right=new THREE.Vector3(1,0,0).applyQuaternion(cameraRef.current!.quaternion);right.y=0;right.normalize();
        const next=itemsRef.current.map(item=>{
          if(item.id!==id)return item;
          const radius=(ITEM_WORLD_SCALES[itemKind(item.id)]||{radius:.4}).radius;
          const submerged=!item.outsideTank && item.y-radius<=displayedWaterLevelRef.current;
          const status:TankObject['status']=submerged ? (item.weightGrams/item.volumeMl<=waterDensityRef.current?'floating':'sunk'):'falling';
          const safe=clampToTankBoundary(item.x,item.z,radius,shapeRef.current,dimsRef.current);
          return {...item,x:safe.x,z:safe.z,outsideTank:false,vx:right.x*v.vx*0.005,vz:right.z*v.vx*0.005,vy:-v.vy*0.006,settled:false,status};
        });
        itemsRef.current=next; onUpdateItems(next); onMessageUpdate('Con vừa buông tay. Hãy quan sát vật sẽ đi đâu nhé!');
      }
      heldIdRef.current=null; orbitRef.current.isDragging=0; onHoldItem(null); onInteractionModeChange('interact');
      if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    };

    useEffect(() => {
      const mount=mountRef.current;if(!mount)return;
      const wheel=(e:WheelEvent)=>{if(inputLockedRef.current||workflowStepRef.current!=='idle'||holdingItemRef.current||carryingTrayRef.current)return;e.preventDefault();zoomRef.current=boundedZoom(zoomRef.current,e.deltaY);};
      mount.addEventListener('wheel',wheel,{passive:false});return()=>mount.removeEventListener('wheel',wheel);
    },[]);

    return (
      <div className="lab-canvas">
        <SceneBackdrop setting={sceneSetting}/>
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={()=>{setHoveredItemId(null);}}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative z-10 w-full flex-1 min-h-0 touch-none select-none ${
            workflowStep !== 'idle'
              ? 'cursor-pointer'
              : holdingItemId || carryingTrayItem || interactionMode === 'orbit'
              ? 'cursor-grabbing'
              : hoveredItemId
              ? 'cursor-grab'
              : 'cursor-default'
          }`}
        />
        {dropPreview&&<div data-drop-preview aria-hidden="true" className="absolute z-20 pointer-events-none" style={{left:dropPreview.x,top:dropPreview.y,transform:'translate(-50%,-100%)'}}><svg className="mx-auto text-sky-700" width="20" height="30" viewBox="0 0 20 30" fill="none"><path d="M10 2V25M6 21L10 25L14 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="w-12 h-5 rounded-[50%] border-[3px] border-dashed border-sky-600 bg-sky-200/40" /></div>}
      </div>
    );
  }
);

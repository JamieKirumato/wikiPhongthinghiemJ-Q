import {overflowOutlets} from './sink-float/overflowVisual';
import {freshComparisonItem} from './sink-float/comparisonTrial';
import { ComparisonTank } from './sink-float/ComparisonTank';
import { StartScreen } from './sink-float/StartScreen';
import { STUDENT_GUIDE, STUDENT_PROMPT } from './sink-float/introGuide';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  X,
  Compass,
  Eye,
  Waves
} from 'lucide-react';
import { unlockImpactAudio,setImpactEffectsVolume } from './sink-float/impactAudio';
import { gestureVelocity } from './sink-float/impactPhysics';
import { soundEngine } from '../../utils/audioEffects';
import { speechEngine } from '../../utils/speechUtils';

import {
  TankDimensions,
  TankObject,
  TankScale,
  TankShape,
  SaltWorkflowStep,
  InteractionMode,
  AgeGroup,
  ItemPrediction,
  ItemObserved
} from './sink-float/types';
import { getTankDimensions, clampToTankBoundary } from './sink-float/tankGeometry';
import { ThreeTankCanvas, ITEM_WORLD_SCALES, ThreeTankCanvasHandle } from './sink-float/ThreeTankCanvas';
import { brineDensity, waterVolumeMl, SALT_GRAMS_PER_SPOON, MAX_SALT_SPOONS } from './sink-float/salinity';
import { SaltWorkflow } from './sink-float/SaltWorkflow';
import { WaterPitcher } from './sink-float/WaterPitcher';
import {FloorMop} from './sink-float/FloorMop';
import {BucketSupply,fillBucketSupply,FloorSpill,mergeSpill,splitOverflow,waterCapacity} from './sink-float/waterTransfer';
import { WaterLadle } from './sink-float/WaterLadle';
// Temporarily hidden; restore only when requested.
const LADLE_ENABLED=false;
import { addedWaterHeight, sandHeight, scoopWater, modelDisplacementVolume } from './sink-float/waterPhysics';
import { BoatChallenge } from './sink-float/BoatChallenge';
import { RealLifeActivityCards } from './sink-float/RealLifeActivityCards';
import { basketSlots, replenishBasket } from './sink-float/basketInventory';
import { itemKind } from './sink-float/playPhysics';
import { SceneSetting } from './sink-float/SceneBackdrop';
import { ChildIntro } from './sink-float/ChildIntro';
import {ReflectionPanel} from './sink-float/ReflectionPanel';
import {eggComparison} from './sink-float/reflectionHistory';
import {TeacherExperienceSettings} from './sink-float/TeacherExperienceSettings';
import {TeacherPreparation, LESSONS, PreparationTab, TeacherLesson} from './sink-float/TeacherPreparation';
import {readExperience,selectedIntroGuide} from './sink-float/teacherExperience';
import { ObjectBasket } from './sink-float/ObjectBasket';
import './sink-float/labExperience.css';
import { GuidedDemoHand } from './sink-float/GuidedDemoHand';
import { TeacherObjectivesModal } from './sink-float/TeacherObjectivesModal';

export interface Props {
  onBackToTable?: () => void;
  isStandalone?: boolean;
}

export type ActivityMode = 'discovery' | 'egg-challenge' | 'boat-challenge' | 'real-life';

export interface TrialRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemIcon: string;
  itemImage: string;
  waterDensity: number;
  saltAmount: number;
  result: 'floating' | 'sunk';
  timestamp: number;
}

// 12 đồ vật quen thuộc để trẻ tự chọn và quan sát
const PLAY_ITEMS_PRESETS: TankObject[] = [
  {
    id: 'item-pebble',
    name: 'Hòn sỏi',
    icon: '🪨',
    image: '/assets/items/pebble.png',
    size: 0.7,
    weightGrams: 50,
    volumeMl: 20,
    floatsDefault: false,
    desc: 'Đá tự nhiên',
    densityNote: 'Đặc ruột và nặng hơn nước (D = 2.5 g/ml) nên nước không nâng nổi, chìm xuống đáy cát',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 0,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-keys',
    name: 'Chùm chìa khóa',
    icon: '🔑',
    image: '/assets/items/approved/keys.png',
    size: 0.78,
    weightGrams: 42,
    volumeMl: 10,
    floatsDefault: false,
    desc: 'Kim loại nặng',
    densityNote: 'Kim loại đặc rất nặng (D = 4.2 g/ml), rơi thẳng tắp và chìm sâu xuống đáy',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 15,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-spoon',
    name: 'Thìa inox',
    icon: '🥄',
    image: '/assets/items/approved/spoon.png',
    size: 0.88,
    weightGrams: 35,
    volumeMl: 7,
    floatsDefault: false,
    desc: 'Thép không gỉ',
    densityNote: 'Thép đặc nặng (D = 5.0 g/ml), chìm nhanh và nằm nghiêng dưới đáy cát',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: -20,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-egg',
    name: 'Quả trứng',
    icon: '🥚',
    image: '/assets/items/egg.png',
    size: 0.75,
    weightGrams: 55,
    volumeMl: 50,
    floatsDefault: false,
    desc: 'Trứng gà tươi',
    densityNote: 'Khối lượng riêng D = 1.10 g/ml. Nước ngọt chưa nâng được quả trứng, nhưng nước muối đặc hơn sẽ nâng trứng NỔI BỒNG BỀNH!',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 0,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-apple',
    name: 'Quả táo đỏ',
    icon: '🍎',
    image: '/assets/items/approved/apple.png',
    size: 0.9,
    weightGrams: 75,
    volumeMl: 90,
    floatsDefault: true,
    desc: 'Trái cây ruột xốp',
    densityNote: 'Ruột táo chứa khoảng 25% là các túi khí li ti (D = 0.83 g/ml), nước nâng quả táo nổi lên mặt nước',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 0,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-wood',
    name: 'Khối gỗ',
    icon: '🪵',
    image: '/assets/items/approved/wood.png',
    size: 0.85,
    weightGrams: 28,
    volumeMl: 45,
    floatsDefault: true,
    desc: 'Gỗ khô tự nhiên',
    densityNote: 'Nhẹ hơn nước (D = 0.62 g/ml), nước nâng khối gỗ nổi vững vàng',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 5,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-duck',
    name: 'Vịt cao su',
    icon: '🐥',
    image: '/assets/items/duck.png',
    size: 0.98,
    weightGrams: 12,
    volumeMl: 55,
    floatsDefault: true,
    desc: 'Cao su rỗng ruột',
    densityNote: 'Bên trong chứa đầy không khí (D = 0.22 g/ml), nước nâng vịt nổi bồng bềnh rất cao',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 0,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-pingpong',
    name: 'Bóng đá',
    icon: '⚪',
    image: '/assets/items/approved/football.png',
    size: 0.96,
    weightGrams: 430,
    volumeMl: 5500,
    floatsDefault: true,
    desc: 'Bóng đá bơm hơi, kín khí',
    densityNote: 'Bóng bơm hơi chứa không khí, khối lượng riêng trung bình nhỏ hơn nước',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 0,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-leaf',
    name: 'Chiếc lá',
    icon: '🍃',
    image: '/assets/items/approved/leaf.png',
    size: 0.82,
    weightGrams: 1,
    volumeMl: 5,
    floatsDefault: true,
    desc: 'Lá cây tự nhiên',
    densityNote: 'Bản mỏng rộng và nhẹ (D = 0.20 g/ml), lượn nhẹ nhàng trên bề mặt nước',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 10,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  },
  {
    id: 'item-bottle',
    name: 'Hộp sữa rỗng, kín',
    icon: '🧱',
    image: '/assets/items/approved/milk-carton.png',
    size: 0.86,
    weightGrams: 20,
    volumeMl: 180,
    floatsDefault: true,
    desc: 'Hộp sữa rỗng, đóng kín, chưa cắm ống hút',
    densityNote: 'Hộp rỗng kín chứa không khí; hộp đầy sữa hoặc hộp mở có thể cho kết quả khác',
    inTank: false,
    x: 0,
    y: 0.45,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    angle: 0,
    vRot: 0,
    settled: false,
    status: 'basket',
    observed: 'untested'
  }
];

// 4 món đồ quen thuộc nhất dành cho lứa tuổi 3 - 4
PLAY_ITEMS_PRESETS.push(
  {...PLAY_ITEMS_PRESETS[0],id:'item-coin',name:'Đồng xu',icon:'🪙',image:'/assets/items/approved/coin.png',size:.65,weightGrams:6,volumeMl:.8,desc:'Đồng xu kim loại',densityNote:'Kim loại đặc',floatsDefault:false},
  {...PLAY_ITEMS_PRESETS[0],id:'item-marble',name:'Vi thủy tinh',icon:'🔮',image:'/assets/items/approved/marble.png',size:.65,weightGrams:12,volumeMl:5,desc:'Vi thủy tinh đặc',densityNote:'Thủy tinh đặc',floatsDefault:false}
);
const AGE_3_4_ITEM_IDS = ['item-pebble', 'item-duck', 'item-apple', 'item-egg'];

// Bàn tay trẻ em cầm đồ vật di chuyển theo chuột khi kéo từ khay
const HeldObjectPreview: React.FC<{
  x: number;
  y: number;
  image: string;
  name: string;
}> = ({ x, y, image, name }) => (
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, -65%)',
      pointerEvents: 'none',
      zIndex: 9999
    }}
    className="fixed select-none filter drop-shadow-2xl"
  >
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Hình đồ vật bé đang cầm */}
      <img
        src={image}
        alt={name}
        className="absolute left-0 top-0 z-10 w-14 h-14 object-contain filter drop-shadow-md transform -rotate-12 pointer-events-none"
        draggable={false}
      />

    </div>
  </div>
);

export const SimSinkOrFloatLab: React.FC<Props> = ({ onBackToTable, isStandalone = false }) => {
  // Toàn màn hình & Container
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playSceneRef = useRef<HTMLDivElement | null>(null);
  const trayRef = useRef<HTMLDivElement | null>(null);

  // ThreeTankCanvas imperative ref
  const threeTankRef = useRef<ThreeTankCanvasHandle | null>(null);
  const pourTimeoutRef = useRef<number | null>(null);

  // Âm thanh & Giọng nói Cô Mimi
  const silentTest=typeof window!=='undefined'&&['127.0.0.1','localhost'].includes(window.location.hostname)&&new URLSearchParams(window.location.search).get('testAudio')==='off';
  const [soundEnabled] = useState<boolean>(!silentTest);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => speechEngine.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);


  // 1. CHẾ ĐỘ HOẠT ĐỘNG CHÍNH (ACTIVITY MODES)
  const [boatControlsHost, setBoatControlsHost] = useState<HTMLDivElement | null>(null);
  const [activityMode, setActivityMode] = useState<ActivityMode>('discovery');

  // Lời dẫn hướng dẫn của Cô Mimi (khoa học, thân thiện, câu hỏi mở)
  const [message, setMessage] = useState<string>(
    'Chào bé! Hãy chọn một đồ vật ở khay bên dưới thả vào bể nước xem nước có nâng đỡ được vật không nhé!'
  );

  // 2. CHẾ ĐỘ TƯƠNG TÁC NGHIÊM NGẶT (STRICT MODES): 'interact' vs 'orbit'
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('interact');

  // 3. HÌNH DẠNG VÀ KÍCH THƯỚC BỂ NƯỚC (Bể nhỏ bằng 50% mỗi chiều)
  const [tankShape, setTankShape] = useState<TankShape>('rectangle');
  const [tankScale, setTankScale] = useState<TankScale>('normal');
  const [overflowAt,setOverflowAt]=useState(0);
  const [floorSpills,setFloorSpills]=useState<FloorSpill[]>([]);
  const [bucketWater,setBucketWater]=useState<BucketSupply>({ml:0,grams:0,fullBuckets:[]});
  const bucketWaterRef=useRef(bucketWater);bucketWaterRef.current=bucketWater;
  const [ladleActive,setLadleActive]=useState(false);
  const [carriedBucketVisible,setCarriedBucketVisible]=useState(false);
  const [ladleGuideReady,setLadleGuideReady]=useState(false),[clothGuideReady,setClothGuideReady]=useState(false);
  const cleanupVoiceRef=useRef<HTMLAudioElement|null>(null);
  const cleanupGuidedRef=useRef({overflow:false,floor:false});
  const [clearClothBucketsToken,setClearClothBucketsToken]=useState(0);
  const floorCleanupRound=useRef(0),celebratingCleanup=useRef(false);
  const playCleanupGuide=(file:string,done:()=>void,effect=false)=>{
    if(silentTest||(effect?experience.effectsVolume<=0:!voiceEnabled)){done();return;}
    speechEngine.stop();
    const audio=new Audio(`/audio/vi/${file}.${effect?'wav':'mp3'}`);cleanupVoiceRef.current=audio;
    if(effect)audio.volume=experience.effectsVolume/100;
    const finish=()=>{if(cleanupVoiceRef.current!==audio)return;cleanupVoiceRef.current=null;done();};
    audio.onended=finish;audio.onerror=finish;void audio.play().catch(finish);
  };

  const bucketRef=useRef<HTMLDivElement|null>(null);
  const receivingBucketRef=useRef<HTMLDivElement|null>(null);
  const bucketReadyAfterRef=useRef(0);
  const floorSpillsRef=useRef(floorSpills);floorSpillsRef.current=floorSpills;
  const addFloorWater=(x:number,z:number,ml:number)=>{floorCleanupRound.current++;const next=mergeSpill(floorSpillsRef.current,x,z,ml);floorSpillsRef.current=next;setFloorSpills(next);};
  const completeFloorCleanup=()=>{
    if(floorSpillsRef.current.length||celebratingCleanup.current)return;
    celebratingCleanup.current=true;
    const round=floorCleanupRound.current;
    playCleanupGuide('floor-cleanup-complete',()=>playCleanupGuide('cleanup-applause',()=>{
      celebratingCleanup.current=false;
      if(round!==floorCleanupRound.current||floorSpillsRef.current.length)return;
      setClearClothBucketsToken(token=>token+1);
      const empty={ml:0,grams:0,fullBuckets:[]};bucketWaterRef.current=empty;setBucketWater(empty);
      setCarriedBucketVisible(false);setClothGuideReady(false);
      cleanupGuidedRef.current={overflow:false,floor:false};
    },true));
  };
  const overBucket=(x:number,y:number)=>{const r=bucketRef.current?.getBoundingClientRect();return !!r&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
  const [addedWaterMl,setAddedWaterMl]=useState(0);
  const addedWaterRef=useRef(0);
  const [removedSaltGrams,setRemovedSaltGrams]=useState(0);
  const removedSaltRef=useRef(0);
  const [pouringWater,setPouringWater]=useState(false);
  const [dimensions, setDimensions] = useState<TankDimensions>(() =>
    getTankDimensions('rectangle', 'normal')
  );

  useEffect(() => {
    const nextDims = getTankDimensions(tankShape, tankScale);
    setDimensions(nextDims);
    setAddedWaterMl(0);addedWaterRef.current=0;
    setRemovedSaltGrams(0);removedSaltRef.current=0;

    // Reproject và clamp an toàn vị trí các vật trong bể
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (!item.inTank) return item;
        const clamped = clampToTankBoundary(item.x, item.z, item.size / 2, tankShape, nextDims);
        const clampedY = Math.min(nextDims.height + 1.5, Math.max(item.size / 2 + 0.1, item.y));
        return {
          ...item,
          x: clamped.x,
          z: clamped.z,
          y: clampedY
        };
      })
    );
  }, [tankShape, tankScale]);

  // 4. QUY TRÌNH HÒA TAN MUỐI VÀ KHỐI LƯỢNG RIÊNG NƯỚC LIÊN TỤC
  const [spoonFraction, setSpoonFraction] = useState(1);
  const [pendingSaltSpoons,setPendingSaltSpoons]=useState(0);
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 đến 5 thìa
  const [activeStirProgress, setActiveStirProgress] = useState<number>(0); // 0 đến 100% của thìa hiện tại
  const [workflowStep, setWorkflowStep] = useState<SaltWorkflowStep>('idle');

  // Khối lượng riêng cập nhật LIÊN TỤC theo lượng muối tan (D >= 1.0)
  const dissolvedFraction = saltSpoons + activeStirProgress / 100 * pendingSaltSpoons;
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const waterDensity = brineDensity(Math.max(0,dissolvedFraction * SALT_GRAMS_PER_SPOON-removedSaltGrams), waterVolumeMl(tankShape, dimensions)+addedWaterMl);
  const tankCapacity=waterCapacity(tankShape,dimensions,items.filter(i=>i.inTank&&!i.outsideTank).map(i=>{
    const radius=ITEM_WORLD_SCALES[i.id.split('#')[0]]?.radius||i.size/2;
    const volume=modelDisplacementVolume(radius,i.volumeMl);
    return {y:i.y,radius,volume,
      immersedVolume:i.status==='floating'&&i.weightGrams/i.volumeMl<waterDensity&&i.id!==holdingItemId ? volume*Math.min(1,i.weightGrams/i.volumeMl/waterDensity) : undefined
    };
  }),sandHeight(dimensions));
  const capRef=useRef(tankCapacity);capRef.current=tankCapacity;
  const overflowSalt=(amount:number,volume:number)=>{
    const grams=volume>0?Math.max(0,dissolvedFraction*SALT_GRAMS_PER_SPOON-removedSaltRef.current)*amount/volume:0;
    removedSaltRef.current+=grams;setRemovedSaltGrams(removedSaltRef.current);
  };
  const spillOverRim=(ml:number)=>{
    const outlets=overflowOutlets(tankShape,dimensions);
    for(const edge of outlets)addFloorWater(edge.x+edge.nx*.65,edge.z+edge.nz*.65,ml/outlets.length);
    setOverflowAt(performance.now());
  };
  useEffect(()=>{
    if(overflowAt<=0||cleanupGuidedRef.current.overflow)return;
    cleanupGuidedRef.current.overflow=true;
    if(LADLE_ENABLED)playCleanupGuide('overflow-cleanup',()=>setLadleGuideReady(true));
    else setLadleGuideReady(true);
  },[overflowAt]);
  useEffect(()=>{
    if(!floorSpills.length||pouringWater||cleanupGuidedRef.current.floor||cleanupVoiceRef.current)return;
    if(overflowAt>0&&!ladleGuideReady)return;
    cleanupGuidedRef.current.floor=true;
    playCleanupGuide('floor-cleanup',()=>setClothGuideReady(true));
  },[floorSpills.length,pouringWater,ladleGuideReady,bucketWater.ml,bucketWater.fullBuckets.length]);
  useEffect(()=>()=>{cleanupVoiceRef.current?.pause();cleanupVoiceRef.current=null;},[]);
  // Displacement by a newly immersed object can overflow a previously full tank too.
  useEffect(()=>{
    const total=waterVolumeMl(tankShape,dimensions)+addedWaterRef.current;
    const overflow=splitOverflow(total,0,tankCapacity).spilled;
    if(overflow>.01){overflowSalt(overflow,total);addedWaterRef.current-=overflow;setAddedWaterMl(addedWaterRef.current);spillOverRim(overflow);}
  },[tankCapacity,tankShape,dimensions]);

  // 5. DANH SÁCH ĐỒ VẬT VÀ LỨA TUỔI
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('5-6');

  // 6. VÒNG LẶP HỌC TẬP (LEARNING LOOP): DỰ ĐOÁN & QUAN SÁT
  const [predictions, setPredictions] = useState<Record<string, ItemPrediction>>({});
  const [observations, setObservations] = useState<Record<string, ItemObserved>>({});

  const [eggSaltObserved, setEggSaltObserved] = useState<ItemObserved>('untested');

  // Lịch sử thử nghiệm bất biến (Immutable trial history mà không bị spam per-frame)
  const [trialHistory, setTrialHistory] = useState<TrialRecord[]>([]);

  // Bé chọn kết luận bằng tranh ảnh trước khi nghe giải thích
  const [showConclusionPicker, setShowConclusionPicker] = useState<boolean>(false);
  const observedEggPair = eggComparison(trialHistory);

  // Thử thách quả trứng (Egg challenge state & attempts)
  const [eggChallengeAttempts, setEggChallengeAttempts] = useState<number>(0);

  // 7. THẢ VẬT BẰNG TAY (HAND THROWING): KÉO TỪ KHAY VÀ CHẠM CHỌN
  const [draggingTrayItem, setDraggingTrayItem] = useState<TankObject | null>(null);
  const [dragCursorPos, setDragCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedTrayItem, setSelectedTrayItem] = useState<TankObject | null>(null);
  const [hasDippedFloater,setHasDippedFloater] = useState(false);

  const pointerVelocityRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const activeDragItemRef = useRef<TankObject | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const [experience,setExperience]=useState(readExperience);
  const [showExperienceSettings,setShowExperienceSettings]=useState(false);
  const [showPreparation,setShowPreparation]=useState(false);
  const [teacherConfigured,setTeacherConfigured]=useState(false);
  const [showTeacherControls,setShowTeacherControls]=useState(false);
  const [preparationTab,setPreparationTab]=useState<PreparationTab>('lesson');
  const [teacherLesson,setTeacherLesson]=useState<TeacherLesson>({mode:'discovery',age:'3-4',itemIds:[...AGE_3_4_ITEM_IDS]});
  const [started, setStarted] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [previewIntro, setPreviewIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(true);
  useEffect(()=>{
    setImpactEffectsVolume(silentTest?0:experience.effectsVolume/100);soundEngine.setVolume(silentTest?0:experience.effectsVolume/100);
    return ()=>{setImpactEffectsVolume(1);soundEngine.setVolume(1);};
  },[experience.effectsVolume,silentTest]);
  const introLocked = started && !introComplete;
  const gestureAllowedRef = useRef(false);
  gestureAllowedRef.current = !introLocked && !showPreparation && !showExperienceSettings && !showTeacherControls && !pouringWater && interactionMode === 'interact' && workflowStep === 'idle';

  // 8. HƯỚNG DẪN INLINE & BÀN TAY LÀM MẪU (GUIDED DEMO HAND)
  const [onboardingStep, setOnboardingStep] = useState<number>(1); // 1, 2, 3 hoặc 0 (đã xong)
  const [showDemoHand, setShowDemoHand] = useState<boolean>(false);

  // 9. CÁC MODAL HỌC TẬP
  const [showObservationBoard, setShowObservationBoard] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showTeacherObjectives, setShowTeacherObjectives] = useState<boolean>(false);
  const [isTeacherMode,setIsTeacherMode] = useState(false);
  const [showSecondTank,setShowSecondTank] = useState(false);
  const [comparisonMode,setComparisonMode]=useState(false);
  const [desktopComparison,setDesktopComparison]=useState(()=>window.matchMedia('(min-width: 1024px) and (any-pointer: fine)').matches);
  useEffect(()=>{
    const query=window.matchMedia('(min-width: 1024px) and (any-pointer: fine)');
    const update=()=>{setDesktopComparison(query.matches);if(!query.matches){setComparisonMode(false);setComparisonTrial(undefined);}};
    query.addEventListener('change',update);
    return ()=>query.removeEventListener('change',update);
  },[]);
  const [comparisonItemId,setComparisonItemId]=useState('item-egg');
  const [comparisonTrial,setComparisonTrial]=useState<{token:number;item:TankObject}|undefined>();
  const [sceneSetting, setSceneSetting] = useState<SceneSetting>('laboratory');
  const basketBatchRef = useRef(0);
  const showXRay = false;

  // 10. CHẾ ĐỘ ĐUA THẢ 2 VẬT CÙNG LÚC
  const [raceModeActive, setRaceModeActive] = useState<boolean>(false);
  const [raceSlotA, setRaceSlotA] = useState<string>('item-pebble');
  const [raceSlotB, setRaceSlotB] = useState<string>('item-duck');
  const [raceRunning, setRaceRunning] = useState<boolean>(false);

  const actionTimersRef = useRef(new Set<number>());
  const scheduleAction = (action: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      actionTimersRef.current.delete(timer);
      action();
    }, delay);
    actionTimersRef.current.add(timer);
  };

  // Dọn dẹp timers khi unmount
  useEffect(() => {
    return () => {
      actionTimersRef.current.forEach(clearTimeout);
      actionTimersRef.current.clear();
      dragCleanupRef.current?.();
      if (pourTimeoutRef.current) {
        clearTimeout(pourTimeoutRef.current);
        pourTimeoutRef.current = null;
      }
    };
  }, []);

  // Lắng nghe trạng thái nói của SpeechEngine
  useEffect(() => {
    const unsub = speechEngine.subscribeSpeakingState(setIsSpeaking);
    return () => unsub();
  }, []);

  // Chỉ đọc lời dẫn sau cử chỉ tương tác đầu tiên của người dùng
  useEffect(() => {
    if(cleanupVoiceRef.current)return;
    if (isTeacherMode && introComplete && hasUserInteracted && voiceEnabled && message) {
      speechEngine.speak(message);
    } else if (!isTeacherMode) {
      speechEngine.stop();
    }
  }, [message, voiceEnabled, hasUserInteracted, isTeacherMode, introComplete]);

  // Đánh dấu người dùng đã tương tác để cho phép phát âm thanh lời dẫn
  const markUserInteracted = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [hasUserInteracted]);

  const handleToggleVoice = () => {
    markUserInteracted();
    const next = speechEngine.toggleVoice();
    setVoiceEnabled(next);
  };

  const handleReplayVoice = () => {
    markUserInteracted();
    speechEngine.speak(message);
  };

  const handleToggleFullscreen = () => {
    markUserInteracted();
    setIsFullscreen(!isFullscreen);
  };

  // CHUYỂN ĐỔI CHẾ ĐỘ HOẠT ĐỘNG (DISCOVERY / EGG CHALLENGE / BOAT / REAL-LIFE)
  const handleSelectActivityMode = (mode: ActivityMode) => {
    markUserInteracted();
    threeTankRef.current?.cancelActiveGesture();
    threeTankRef.current?.clearSaltGrains();
    dragCleanupRef.current?.();
    activeDragItemRef.current = null;
    isDraggingRef.current = false;
    if (pourTimeoutRef.current) { clearTimeout(pourTimeoutRef.current); pourTimeoutRef.current = null; }
    setWorkflowStep('idle');
    setActiveStirProgress(0);
    setHoldingItemId(null);
    setComparisonMode(false);setActivityMode(mode);
    if(mode!=='discovery')setAdvanced(true);
    setSelectedTrayItem(null);
    setDraggingTrayItem(null);

    if (mode === 'discovery') {
      setMessage('Bé đang ở chế độ Khám Phá Tự Do! Hãy chọn đồ vật bất kỳ để khám phá xem nước nâng được vật nào nhé.');
    } else if (mode === 'egg-challenge') {
      setMessage('Thử Thách Quả Trứng: Làm cách nào để quả trứng tươi nổi bồng bềnh trên mặt nước? Bé hãy thử nghiệm nhé!');
    } else if (mode === 'boat-challenge') {
      setMessage('Thử Thách Thuyền Nhôm: Tại sao cùng một lượng nhôm, uốn thành thuyền lại nổi và chở được nhiều hàng?');
    } else if (mode === 'real-life') {
      setMessage('Khám phá thuyền, vật chứa khí và nước muối trong đời sống nhé!');
    }
  };

  const handleResetDefaultView = () => {
    markUserInteracted();
    threeTankRef.current?.resetDefaultView();
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã đưa bể về góc nhìn chuẩn đẹp nhất!');
  };

  // Về góc nhìn ngang thành bể (Side-View) theo API mở rộng của ThreeTankCanvas
  const handleResetSideView = () => {
    markUserInteracted();
    threeTankRef.current?.resetSideView();
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã chuyển sang góc nhìn ngang thành bể để quan sát sát mặt nước!');
  };

  // Dọn bể: vớt đồ vật trả về khay & dọn sạch hạt muối
  const handleResetAllTank = () => {
    markUserInteracted();
    actionTimersRef.current.forEach(clearTimeout);
    actionTimersRef.current.clear();
    setRaceRunning(false);
    setWorkflowStep('idle');
    setActiveStirProgress(0);
    setHasDippedFloater(false);
    if (pourTimeoutRef.current) {
      clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = null;
    }
    setItems((prev) =>
      prev.filter(i => !i.id.includes('#')).map((i) => ({
        ...i,
        inTank: false,
        x: 0,
        y: 0.45,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        outsideTank: false,
        damage: undefined,
        settled: false,
        status: 'basket'
      }))
    );
    setHoldingItemId(null);
    setSelectedTrayItem(null);
    setDraggingTrayItem(null);
    threeTankRef.current?.clearSaltGrains();
    if (soundEnabled) soundEngine.playNetScoop();
    setMessage('Đã vớt sạch đồ vật trong bể về khay! Bé có thể thử lại từ đầu.');
  };

  // CÂU HỎI MỞ KHI THẢ ĐỒ VẬT VÀO BỂ (KHÔNG TIẾT LỘ TRƯỚC KẾT QUẢ)
  const announceItemDropScience = (item: TankObject) => {
    setMessage(`Cùng quan sát ${item.name.toLowerCase()} nhé! Vật đang đi xuống hay ở trên mặt nước?`);
  };

  // XỬ LÝ KHI ĐỒ VẬT ĐÃ LẮNG ĐỌNG XONG (SETTLED) TRONG NƯỚC (QUAN SÁT THẬT)
  const handleItemObserved = useCallback(
    (itemId: string, result: 'floating' | 'sunk') => {
      setObservations((prev) => ({ ...prev, [itemId]: result }));

      const item = items.find((i) => i.id === itemId);
      const itemName = item?.name || 'Đồ vật';

      // 1. Thêm bản ghi bất biến vào lịch sử thử nghiệm (Immutable Trial History, tránh spam)
      setTrialHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.itemId === itemId && last.result === result && Math.abs(last.waterDensity - waterDensity) < 0.005) {
          return prev;
        }
        return [
          ...prev,
          {
            id: `${itemId}-${Date.now()}`,
            itemId,
            itemName,
            itemIcon: item?.icon || '📦',
            itemImage: item?.image || '',
            waterDensity,
            saltAmount: Math.round(dissolvedFraction * 100) / 100,
            result,
            timestamp: Date.now()
          }
        ];
      });

      // 2. Cập nhật quan sát trứng theo nước ngọt / nước muối
      if (itemKind(itemId) === 'item-egg') {
        if (waterDensity > 1.00001) {
          setEggSaltObserved(result);
          if (result === 'floating') {
            // Khi quả trứng thực sự nổi sau khi thêm muối: gợi ý bé chọn kết luận bằng tranh ảnh!
            setMessage('Con vừa thấy trứng nổi ở mặt nước. Con có thể mở bảng để nhìn lại nhé.');
          }
        } else {

        }

        // Tăng đếm số lần thử của thử thách quả trứng
        if (activityMode === 'egg-challenge') {
          setEggChallengeAttempts((prev) => prev + 1);
        }
      }

      // Hoàn thành onboarding bước 3 khi vật đầu tiên lắng đọng
      if (onboardingStep > 0) {
        setOnboardingStep(0);
      }

      // Phản hồi khích lệ tò mò dựa trên dự đoán (không phạt sai)
      const pred = predictions[itemId];

      if (!pred || pred === 'none') {
        if (result === 'floating') {
          setMessage(`${itemName} đang nổi bồng bềnh trên mặt nước! Lực nâng của nước đang đỡ lấy vật.`);
        } else {
          setMessage(`${itemName} đã chìm xuống đáy cát. Nước không nâng nổi vật này. Bé thử vật khác nhé!`);
        }
      } else {
        if (pred === 'curious') {
          setMessage(`Bé ơi cùng nhìn nào: ${itemName} ${result === 'floating' ? 'đang nổi bồng bềnh' : 'đã chìm xuống đáy cát'} rồi! Bé rất ham học hỏi!`);
        } else if ((pred === 'float' && result === 'floating') || (pred === 'sink' && result === 'sunk')) {
          setMessage(`Hoan hô! Đúng như bé dự đoán, ${itemName} ${result === 'floating' ? 'đã nổi trên mặt nước' : 'đã chìm xuống đáy cát'}!`);
        } else {
          setMessage(`Ồ! Hóa ra ${itemName} lại ${result === 'floating' ? 'nổi lên' : 'chìm xuống'} đấy! Quan sát thực tế thật là kỳ diệu!`);
        }
      }
    },
    [predictions, items, waterDensity, dissolvedFraction, onboardingStep, activityMode]
  );

  useEffect(() => {
    const cancel=(event:KeyboardEvent)=>{if(event.key!=='Escape')return;dragCleanupRef.current?.();activeDragItemRef.current=null;isDraggingRef.current=false;setSelectedTrayItem(null);setDraggingTrayItem(null);threeTankRef.current?.cancelActiveGesture();setInteractionMode('interact');};
    window.addEventListener('keydown',cancel);return()=>window.removeEventListener('keydown',cancel);
  },[]);

  // BẮT ĐẦU CẦM VÀ KÉO ĐỒ VẬT TỪ KHAY (HAND-BASED THROWING FROM TRAY)
  const handleTrayItemPointerDown = (e: React.PointerEvent, item: TankObject) => {
    e.preventDefault();
    if (introLocked || pouringWater) return;
    markUserInteracted();
    if (item.inTank) return;
    if (workflowStep !== 'idle') {
      setMessage('Đang trong quy trình hòa tan muối, bé làm xong hẵng thả đồ vật nhé!');
      return;
    }
    if (interactionMode === 'orbit' || holdingItemId) return;
    unlockImpactAudio();

    const startX = e.clientX;
    setDragCursorPos({ x: e.clientX, y: e.clientY });
    dragCleanupRef.current?.();
    containerRef.current?.setPointerCapture(e.pointerId);
    const startY = e.clientY;
    const startTime = performance.now();

    pointerVelocityRef.current = [{ x: startX, y: startY, t: startTime }];
    activeDragItemRef.current = item;
    setDraggingTrayItem(item);
    isDraggingRef.current = false;

    const onWindowPointerMove = (moveEvt: PointerEvent) => {
      if(moveEvt.pointerId!==e.pointerId)return;
      if (!activeDragItemRef.current || !gestureAllowedRef.current) return;
      const curX = moveEvt.clientX;
      const curY = moveEvt.clientY;
      const curT = performance.now();

      const dx = curX - startX;
      const dy = curY - startY;
      if (!isDraggingRef.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        isDraggingRef.current = true;
        setDraggingTrayItem(item);
        if (onboardingStep === 1) setOnboardingStep(2);
      }

      if (isDraggingRef.current) {
        setDragCursorPos({ x: curX, y: curY });
        const samples=pointerVelocityRef.current,first=samples[0];
        const velocity=first?gestureVelocity(curX-first.x,curY-first.y,(curT-first.t)/1000):{vx:0,vy:0};
        threeTankRef.current?.previewDropAtScreenPos(item,curX,curY,velocity);
        const history = pointerVelocityRef.current;
        history.push({ x: curX, y: curY, t: curT });
        while (history.length > 1 && curT - history[0].t > 150) {
          history.shift();
        }
      }
    };

    const onWindowPointerUp = (upEvt: PointerEvent) => {
      if(upEvt.pointerId!==e.pointerId)return;
      threeTankRef.current?.clearDropPreview();
      window.removeEventListener('blur',onBlur);
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);

      if (upEvt.type === 'pointercancel' || !activeDragItemRef.current || !gestureAllowedRef.current) {
        activeDragItemRef.current = null;
        isDraggingRef.current = false;
        setDraggingTrayItem(null);
        return;
      }

      const endX = upEvt.clientX;
      const endY = upEvt.clientY;

      if (isDraggingRef.current) {
        // Tính vận tốc ném từ cử chỉ tay
        const history = pointerVelocityRef.current;
        let vx = 0;
        let vy = 0;
        if (history.length >= 2) {
          const oldest = history[0];
          const latest = history[history.length - 1];
          const dt = (latest.t - oldest.t) / 1000;
          if (dt > 0.01) {
            const v = gestureVelocity(latest.x-oldest.x,latest.y-oldest.y,(performance.now()-oldest.t)/1000);
            vx=v.vx; vy=v.vy;
          }
        }

        const playRect = playSceneRef.current?.getBoundingClientRect();
        const isOverScene =
          playRect &&
          endX >= playRect.left - 40 &&
          endX <= playRect.right + 40 &&
          endY >= playRect.top - 80 &&
          endY <= playRect.bottom + 20;

        if (isOverScene) {
          // Thả ném vật vào không gian 3D Three.js
          threeTankRef.current?.dropOrThrowItemAtScreenPos(item, endX, endY, { vx, vy });
          announceItemDropScience(item);
          if (onboardingStep === 2) setOnboardingStep(3);
        } else {
          setMessage(`Bé đã thả "${item.name}" về lại khay.`);
        }

        setDraggingTrayItem(null);
        isDraggingRef.current = false;
      } else {
        // Chạm chọn rồi chạm bể
        setSelectedTrayItem((prev) => (prev?.id === item.id ? null : item));
        if (selectedTrayItem?.id !== item.id) {
          const scene=playSceneRef.current?.getBoundingClientRect();
          if(scene)threeTankRef.current?.previewDropAtScreenPos(item,scene.left+scene.width/2,scene.top+scene.height/2);
          setMessage(`Bé đã cầm "${item.name}"! Đưa tay đến chỗ muốn thả, hoặc kéo nhanh rồi buông để ném nhé!`);
          if (soundEnabled) soundEngine.playSpoonClink();
          if (onboardingStep === 1) setOnboardingStep(2);
        }
      }

      setDraggingTrayItem(null);
      activeDragItemRef.current = null;
    };

    const onBlur=()=>{dragCleanupRef.current?.();activeDragItemRef.current=null;isDraggingRef.current=false;setSelectedTrayItem(null);setDraggingTrayItem(null);};
    window.addEventListener('blur',onBlur);
    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
    dragCleanupRef.current = () => {
      threeTankRef.current?.clearDropPreview();
      window.removeEventListener('blur',onBlur);
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
      window.removeEventListener('blur',onBlur);
    };
  };

  // CHẠM VÀO BỂ ĐỂ THẢ VẬT ĐANG CẦM (KHI DÙNG CHẾ ĐỘ CHẠM CHỌN)
  const handleSceneClickToRelease = (e: React.MouseEvent) => {
    markUserInteracted();
    if (!selectedTrayItem || interactionMode !== 'interact' || workflowStep !== 'idle') return;

    threeTankRef.current?.dropOrThrowItemAtScreenPos(
      selectedTrayItem,
      e.clientX,
      e.clientY,
      { vx: 0, vy: 0 }
    );
    announceItemDropScience(selectedTrayItem);
    setSelectedTrayItem(null);
    if (onboardingStep === 2) setOnboardingStep(3);
  };

  // Hoàn thành tan 1 thìa muối (dựa vào waterDensity, không chỉ báo nổi ở spoons count)
  const handleSpoonCompleted = useCallback(() => {
    threeTankRef.current?.clearSaltGrains();
    threeTankRef.current?.refreshObservations();
    setSaltSpoons(previous => Math.min(MAX_SALT_SPOONS, previous + pendingSaltSpoons));
    setActiveStirProgress(0);
    setItems(previous => previous.map(item => item.inTank ? {...item, settled: false} : item));
    setMessage('Muối đã tan. Con thấy quả trứng thay đổi thế nào?');
    setPendingSaltSpoons(0);
  }, [pendingSaltSpoons]);

  // Thay nước ngọt ban đầu & dọn sạch hạt muối
  const handleResetSalt = useCallback(() => {
    setAddedWaterMl(0);addedWaterRef.current=0;
    setRemovedSaltGrams(0);removedSaltRef.current=0;
    markUserInteracted();
    if (pourTimeoutRef.current) {
      clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = null;
    }
    setSaltSpoons(0);setPendingSaltSpoons(0);
    setActiveStirProgress(0);
    setWorkflowStep('idle');
    threeTankRef.current?.clearSaltGrains();
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay nước mới tinh khiết! Nước trở lại là nước ngọt trong vắt.');
  }, [soundEnabled, markUserInteracted]);

  // Đổ muối vào miệng bể
  const handlePourSaltAtPoint = useCallback(
    (point: THREE.Vector3) => {
      if (workflowStep !== 'holdingSpoon'||pourTimeoutRef.current) return;

      setWorkflowStep('pouring');
      setMessage('Muối đang rơi vào nước. Con cùng quan sát nhé!');
      if (soundEnabled) soundEngine.playSaltPour();
      threeTankRef.current?.spawnSaltGrains(Math.round(40 * spoonFraction), point);
      setActiveStirProgress(progress=>progress*pendingSaltSpoons/(pendingSaltSpoons+spoonFraction));
      setPendingSaltSpoons(total=>Math.min(MAX_SALT_SPOONS-saltSpoons,total+spoonFraction));

      if (pourTimeoutRef.current) clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = window.setTimeout(() => {
        pourTimeoutRef.current=null;
        setWorkflowStep('scoopMode');

        setMessage('Thìa đã trống. Con có thể xúc thêm muối, hoặc chọn que khuấy.');
      }, 1400);
    },
    [workflowStep, soundEnabled, spoonFraction,saltSpoons,pendingSaltSpoons]
  );

  // Bắt đầu đua thả 2 vật
  const handleStartRace = () => {
    if (!gestureAllowedRef.current) return;
    markUserInteracted();
    const itemA = items.find((i) => i.id === raceSlotA);
    const itemB = items.find((i) => i.id === raceSlotB);
    if (!itemA || !itemB) return;

    setRaceRunning(true);
    setMessage('Chuẩn bị... 3... 2... 1... THẢ 2 VẬT CÙNG LÚC TỪ TRÊN CAO!');

    const { height: H } = dimensions;
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemA.id) {
          return {
            ...i,
            inTank: true,
            x: -dimensions.width * 0.22,
            y: H + 1.2,
            z: 0,
            vx: 0,
            vy: -0.2,
            vz: 0,
            settled: false,
            status: 'falling'
          };
        }
        if (i.id === itemB.id) {
          return {
            ...i,
            inTank: true,
            x: dimensions.width * 0.22,
            y: H + 1.2,
            z: 0,
            vx: 0,
            vy: -0.2,
            vz: 0,
            settled: false,
            status: 'falling'
          };
        }
        return i;
      })
    );

    scheduleAction(() => {
      setRaceRunning(false);
      setMessage('Con nhìn hai vật rồi kể lại: vật nào ở trên mặt nước, vật nào ở dưới đáy?');
    }, 2000);
  };

  // Danh sách đồ vật hiển thị theo lứa tuổi (3-4 tuổi: 4 món quen thuộc; 5-6 tuổi: cả 12 món)
  const basketPresets = isTeacherMode ? PLAY_ITEMS_PRESETS.filter(i => teacherLesson.itemIds.includes(i.id)) : activityMode==='egg-challenge' ? PLAY_ITEMS_PRESETS.filter(i=>i.id==='item-egg') : !advanced&&activityMode==='discovery' ? PLAY_ITEMS_PRESETS.filter(i=>['item-pebble','item-pingpong'].includes(i.id)) : PLAY_ITEMS_PRESETS;
  const displayItems = basketSlots(items, basketPresets);

  // Replenish real, uniquely identified objects; keep previous trials in the tank.
  useEffect(() => {
    if (!displayItems.length || !displayItems.every(item => item.inTank)) return;
    const batch = ++basketBatchRef.current;
    setItems(previous => replenishBasket(previous, basketPresets, batch));
  }, [items, ageGroup, teacherLesson, isTeacherMode]);

  const observedCount = Object.keys(observations).length;

  const startSession = (mode: 'student' | 'teacher') => {
    speechEngine.stop();speechEngine.setVoiceEnabled(mode==='student');setVoiceEnabled(mode==='student');
    setIsTeacherMode(mode==='teacher');
    setShowPreparation(mode==='teacher');setTeacherConfigured(false);setShowTeacherControls(false);setPreparationTab('lesson');
    setAdvanced(false);setComparisonMode(false);setPreviewIntro(false);setActivityMode('discovery');
    setMessage(STUDENT_PROMPT);setIntroComplete(mode==='teacher');setStarted(true);
  };
  const switchExploration = (next:boolean) => {
    if(pouringWater||holdingItemId||selectedTrayItem||draggingTrayItem||workflowStep!=='idle')return;
    threeTankRef.current?.cancelActiveGesture();handleResetSalt();handleResetAllTank();
    floorCleanupRound.current++;celebratingCleanup.current=false;setClearClothBucketsToken(token=>token+1);
    setAddedWaterMl(0);addedWaterRef.current=0;setBucketWater({ml:0,grams:0,fullBuckets:[]});bucketWaterRef.current={ml:0,grams:0,fullBuckets:[]};
    setComparisonTrial(undefined);setComparisonMode(false);setFloorSpills([]);setOverflowAt(0);setLadleGuideReady(false);setClothGuideReady(false);cleanupGuidedRef.current={overflow:false,floor:false};cleanupVoiceRef.current?.pause();cleanupVoiceRef.current=null;setAdvanced(next);setActivityMode('discovery');
    setMessage(next?'Con thử thay đổi nước rồi quan sát đồ vật nhé.':STUDENT_PROMPT);
  };
  const comparisonBusy=pouringWater||!!holdingItemId||!!selectedTrayItem||!!draggingTrayItem||workflowStep!=='idle';
  const openPreparation=(tab:PreparationTab)=>{if(comparisonBusy)return;setPreparationTab(tab);setShowPreparation(true);};
  const beginTeacherLesson=(lesson:TeacherLesson)=>{
    if(comparisonBusy)return;
    switchExploration(lesson.mode!=='discovery');
    handleSelectActivityMode(lesson.mode);
    setTeacherLesson(lesson);setTeacherConfigured(true);setAgeGroup(lesson.age);setShowSecondTank(false);
    setShowPreparation(false);setRaceModeActive(false);
    setOnboardingStep(0);setMessage(LESSONS.find(l=>l.mode===lesson.mode)?.objective||STUDENT_PROMPT);
  };
  const toggleComparison=()=>{
    if(comparisonBusy||!advanced||!desktopComparison)return;
    threeTankRef.current?.cancelActiveGesture();handleResetAllTank();
    setAddedWaterMl(0);addedWaterRef.current=0;setRemovedSaltGrams(0);removedSaltRef.current=0;
    setRaceModeActive(false);setRaceRunning(false);setComparisonTrial(undefined);setComparisonMode(!comparisonMode);setAdvanced(true);setActivityMode('discovery');
    setMessage('Giữ bể B là nước ngọt. Con thử thêm muối, khuấy ở bể A rồi so sánh.');
  };
  const releaseComparison=()=>{
    if(comparisonBusy)return;
    const item=PLAY_ITEMS_PRESETS.find(i=>i.id===comparisonItemId);if(!item)return;
    threeTankRef.current?.resetDefaultView();setInteractionMode('interact');
    threeTankRef.current?.dropComparisonItem(freshComparisonItem(item));
    setComparisonTrial(previous=>({token:(previous?.token??0)+1,item:freshComparisonItem(item)}));
    setMessage('Con nhìn vật trong hai bể nhé.');
  };
  if(!started)return <StartScreen onStart={startSession}/>;

  return (
    <div
      ref={containerRef}
      data-lab-experience
      data-teacher-mode={isTeacherMode}
      data-teacher-ready={teacherConfigured}
      onPointerMove={(event) => { if (selectedTrayItem) {setDragCursorPos({ x: event.clientX, y: event.clientY });threeTankRef.current?.previewDropAtScreenPos(selectedTrayItem,event.clientX,event.clientY);} }}
      onClick={markUserInteracted}
      className={`lab-experience select-none w-full flex flex-col font-sans text-slate-800 dark:text-slate-100 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-2 lg:p-3 overflow-hidden h-screen'
          : 'relative h-full min-h-0 overflow-hidden'
      }`}
    >
      {isTeacherMode&&showPreparation&&<TeacherPreparation tab={preparationTab} onTab={setPreparationTab} onClose={()=>setShowPreparation(false)} lesson={teacherLesson} onStart={beginTeacherLesson} items={PLAY_ITEMS_PRESETS} shape={tankShape} onShape={setTankShape} scale={tankScale} onScale={setTankScale} scene={sceneSetting} onScene={setSceneSetting}/>}
      {introLocked&&<div className={`absolute top-3 right-3 z-[110] flex items-center gap-2 rounded-2xl bg-white/95 p-3 shadow ${isTeacherMode?'left-3':''}`}>
        {isTeacherMode&&<p className="flex-1 text-sm font-bold">{previewIntro?'Xem thử hướng dẫn':STUDENT_PROMPT}</p>}
        <button aria-label="Tự thử ngay" className="min-h-[48px] min-w-[48px] px-3 rounded-xl bg-sky-100" onClick={()=>setIntroComplete(true)}>{isTeacherMode?'Tự thử ngay':'▶'}</button>
      </div>}
      {showExperienceSettings&&<TeacherExperienceSettings settings={experience} onChange={setExperience} voiceEnabled={voiceEnabled} onVoiceChange={enabled=>{speechEngine.stop();speechEngine.setVoiceEnabled(enabled);setVoiceEnabled(enabled);}} onClose={()=>setShowExperienceSettings(false)} onPreview={()=>{setShowExperienceSettings(false);setPreviewIntro(true);setAdvanced(true);setIntroComplete(!selectedIntroGuide(experience).length);}}/>}
      {introLocked && <ChildIntro guide={previewIntro?selectedIntroGuide(experience):STUDENT_GUIDE}
        onCleanup={()=>threeTankRef.current?.showIntroFrame(null,0)}
        onFrame={(action,p)=>{
          const frame=threeTankRef.current?.showIntroFrame(action,p);if(!frame)return null;
          const container=containerRef.current;
          const label=action==='outside'?'Cầm Quả táo đỏ':(action==='pick'||action==='student-drop')?'Cầm Quả táo đỏ':action==='pour'?'Cầm bình nước để rót vào bể':action==='scoop'?'Cầm gáo để múc nước ra khỏi bể':'Mở hũ muối';
          const source=container?.querySelector(`[aria-label="${label}"]`)?.getBoundingClientRect();
          const scene=playSceneRef.current?.getBoundingClientRect();
          if((action==='welcome'||action==='ready')&&scene){frame.x=scene.left+scene.width*.48;frame.y=scene.top+scene.height*.3;}
          if(source&&frame.fromTray>0){frame.x+=(source.left+source.width/2-frame.x)*frame.fromTray;frame.y+=(source.top+source.height/2-frame.y)*frame.fromTray;}
          if((action==='pour'||action==='scoop'||action==='salt')&&p<.05&&source){container?.querySelector(`[aria-label="${label}"]`)?.scrollIntoView({block:'nearest'});}
          if(scene){frame.x=Math.max(22,Math.min(window.innerWidth-22,frame.x));frame.y=Math.max(scene.top+22,Math.min(scene.bottom-28,frame.y));}
          return frame;
        }}
        onComplete={()=>{const aside=containerRef.current?.querySelector('aside');if(aside)aside.scrollTop=0;setIntroComplete(true);setHasUserInteracted(true);}}/>}
      {/* ======================================================== */}
      {/* 1. COMPACT TOP ROUTE & MASCOT BAR                        */}
      {/* ======================================================== */}


      {/* ======================================================== */}
      {/* 2. CHÍNH: 2 CỘT (TRÁI: BỂ 3D 75-80% | PHẢI: BẢNG ~240px) */}
      {/* ======================================================== */}
      <div {...(introLocked||showExperienceSettings||showPreparation ? {inert: ''} : {})} aria-hidden={introLocked||showExperienceSettings||showPreparation || undefined} className="lab-workspace">
        <header className="lab-heading">
          <span className="lab-mark" aria-hidden="true"><Waves size={23} strokeWidth={1.7}/></span>
          {isTeacherMode&&<div><span className="lab-eyebrow">PHÒNG KHÁM PHÁ</span><h2>Vật chìm, vật nổi</h2></div>}
        </header>
        {isTeacherMode&&<nav className="teacher-preparation-bar" aria-label="Chuẩn bị cho giáo viên">
          <span>{LESSONS.find(l=>l.mode===teacherLesson.mode)?.title} · {teacherLesson.age==='3-4'?'3–4':'5–6'} tuổi</span>
          <button disabled={comparisonBusy} onClick={()=>openPreparation('lesson')}>Chuẩn bị bài</button>
          <button disabled={comparisonBusy} onClick={()=>setShowExperienceSettings(true)}>Âm thanh và lời dẫn</button>
          <button disabled={comparisonBusy||comparisonMode||activityMode==='boat-challenge'} title={activityMode==='boat-challenge'?'Mẫu thuyền dùng bể riêng':undefined} onClick={()=>openPreparation('advanced')}>Giao diện chơi</button>
          <button disabled={comparisonBusy} onClick={()=>openPreparation('hands-on')}>Thực hành tại nhà</button>
          {teacherConfigured&&<button disabled={comparisonBusy} onClick={()=>setShowTeacherControls(true)}>Điều khiển</button>}
        </nav>}
        {/* CỘT TRÁI: KHU VỰC CHƠI CHÍNH (75-80%) */}
        <main className={`lab-main flex-1 min-w-0 flex h-full overflow-hidden gap-2 ${(showSecondTank&&isTeacherMode)||comparisonMode?'flex-col lg:flex-row':'flex-col'}`}>
          {/* HIỂN THỊ THEO ACTIVITY MODE */}
          {activityMode === 'boat-challenge' ? (
            /* THỬ THÁCH THUYỀN CHỞ HÀNG MỚI */
            <BoatChallenge controlsHost={boatControlsHost} soundEnabled={soundEnabled} onMessageUpdate={setMessage} />
          ) : activityMode === 'real-life' ? (
            /* KHÁM PHÁ THỰC TẾ & BÀI HỌC CUỘC SỐNG */
            <RealLifeActivityCards soundEnabled={soundEnabled} onMessageUpdate={setMessage} />
          ) : (
            /* BỂ 3D CHÌM NỔI (DÀNH CHO KHÁM PHÁ & THỬ THÁCH TRỨNG) */
            <div
              ref={playSceneRef}
              onClick={handleSceneClickToRelease}
              tabIndex={0}
              role="group"
              aria-label="Bể nước: nhấn Enter để thả vật đang cầm"
              onKeyDown={event => {
                if (event.key === 'Enter' && selectedTrayItem && gestureAllowedRef.current) {
                  threeTankRef.current?.dropItemAtTankCenter(selectedTrayItem);setSelectedTrayItem(null);
                }
              }}
              className={`lab-scene ${selectedTrayItem || draggingTrayItem ? 'lab-scene-ready' : ''}`}
            >
              {isTeacherMode&&comparisonMode&&<div className="absolute top-2 left-2 z-20 rounded-xl bg-white/95 px-3 py-2 font-bold text-sm">Bể A · {dissolvedFraction>0?'Nước muối':'Nước ngọt'}{workflowStep==='stirring'?' · Đang khuấy':''}</div>}
              <ThreeTankCanvas
                ref={threeTankRef}
                shape={tankShape}
                sceneSetting={sceneSetting}
                floorSpills={floorSpills}
                overflowAt={overflowAt}
                inputLocked={introLocked || pouringWater}
                waterLevel={dimensions.waterHeight+sandHeight(dimensions)+addedWaterHeight(addedWaterMl,tankShape,dimensions)}
                scale={tankScale}
                dims={dimensions}
                items={items}
                onUpdateItems={setItems}
                waterDensity={waterDensity}
                interactionMode={interactionMode}
                onInteractionModeChange={setInteractionMode}
                carryingTrayItem={!!selectedTrayItem || !!draggingTrayItem || !!activeDragItemRef.current}
                holdingItemId={holdingItemId}
                onHoldItem={setHoldingItemId}
                workflowStep={workflowStep}
                onPourSaltAtPoint={handlePourSaltAtPoint}
                soundEnabled={soundEnabled}
                onMessageUpdate={setMessage}
                showXRay={showXRay}
                onItemObserved={handleItemObserved}
                onDipFloater={()=>setHasDippedFloater(true)}
              />
              {!isTeacherMode&&!introLocked&&activityMode==='discovery'&&!advanced&&<div className="absolute top-3 left-3 z-20 max-w-[min(280px,68%)] rounded-2xl bg-white/95 px-3 py-2 shadow-lg border-2 border-amber-300 text-slate-900 pointer-events-none" role="status">
                <p className="text-xs font-black text-amber-800">🔎 Vòng khám phá ngắn</p>
                <p className="text-sm font-bold">{observations['item-pebble']!=='sunk'||!items.some(i=>i.id==='item-pebble'&&i.inTank)?'1. Sỏi nhỏ sẽ chìm hay nổi? Con thả thử nhé.':observations['item-pingpong']!=='floating'||!items.some(i=>i.id==='item-pingpong'&&i.inTank)?'2. Bóng lớn sẽ chìm hay nổi? Con thử xem.':!hasDippedFloater?'3. Con dìm bóng xuống nước rồi buông tay nhé.':'Con thấy bóng đi đâu khi buông tay?'}</p>
                {hasDippedFloater&&observations['item-pebble']==='sunk'&&observations['item-pingpong']==='floating'&&<button className="pointer-events-auto mt-2 min-h-[44px] rounded-xl bg-amber-400 px-3 font-black text-xs shadow-sm" onClick={()=>{handleResetAllTank();handleSelectActivityMode('egg-challenge');}}>🥚 Thử trứng và đổi nước</button>}
              </div>}
              {!isTeacherMode&&activityMode==='egg-challenge'&&<div className="absolute top-3 left-3 z-20 max-w-[min(290px,70%)] rounded-2xl bg-white/95 px-3 py-2 shadow-lg border-2 border-amber-300 text-sm font-bold text-slate-900">
                <p>🥚 Thả trứng vào nước ngọt. Sau đó thêm muối, khuấy và nhìn lại trứng.</p>
                {saltSpoons>0&&workflowStep==='idle'&&<button className="mt-2 min-h-[44px] rounded-xl bg-sky-200 px-3 font-black text-xs" onClick={handleResetSalt}>🚰 Đổi lại nước ngọt</button>}
              </div>}
              {LADLE_ENABLED&&(carriedBucketVisible||bucketWater.ml>0||bucketWater.fullBuckets.length>0)&&<div ref={bucketRef} data-water-bucket aria-label="Các xô hứng nước" className="lab-bucket absolute bottom-5 left-5 z-30 pointer-events-none flex flex-wrap items-end gap-2 max-w-[calc(100%-40px)]">
                {bucketWater.fullBuckets.map((_,index)=><div key={index} aria-label="Xô đã đầy" className="relative w-12">
                  <svg viewBox="0 0 120 120" width="48" height="48" aria-hidden="true"><path d="M17 43L27 99Q60 115 93 99L103 43" fill="#ffd59c" stroke="#b87838" strokeWidth="4"/><ellipse cx="60" cy="43" rx="43" ry="15" fill="#86dcea" stroke="#b87838" strokeWidth="4"/><path d="M23 38C15 5 105 5 97 38" fill="none" stroke="#d09450" strokeWidth="5"/></svg>
                </div>)}
                <div ref={receivingBucketRef} key={`receiving-${bucketWater.fullBuckets.length}`} aria-label={bucketWater.ml>0?'Xô đang hứng nước':'Xô trống tiếp theo'} className={`relative w-24 rounded-2xl ${bucketWater.fullBuckets.length>0?'bg-yellow-100/60 ring-4 ring-yellow-200/70':''}`}>
                  <svg viewBox="0 0 120 120" width="96" height="96" aria-hidden="true"><path d="M17 43 Q60 27 103 43 L93 99 Q60 115 27 99Z" fill="#ffd59c" stroke="#b87838" strokeWidth="4"/><ellipse cx="60" cy="43" rx="43" ry="15" fill="#fff0cf" stroke="#b87838" strokeWidth="4"/>{bucketWater.ml>0&&<ellipse cx="60" cy={85-Math.min(40,bucketWater.ml/15)} rx="35" ry="10" fill="#86dcea" stroke="#d6fbff" strokeWidth="3"/>}<path d="M23 38 C15 5 105 5 97 38" fill="none" stroke="#d09450" strokeWidth="5"/></svg>
                </div>
              </div>}
            </div>
          )}

          {(isTeacherMode||comparisonMode)&&<div className={showSecondTank||comparisonMode?'flex flex-1 min-w-0 min-h-0':'hidden'}><ComparisonTank visualOnly={true} presets={comparisonMode?PLAY_ITEMS_PRESETS:basketPresets} sceneSetting={sceneSetting} pairedShape={comparisonMode?tankShape:undefined} pairedScale={comparisonMode?tankScale:undefined} trial={comparisonMode?comparisonTrial:undefined}/></div>}
        </main>

        {/* ======================================================== */}
        {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN HỢP NHẤT (~240px - 260px)       */}
        {/* ======================================================== */}
        <aside aria-label="Đồ vật và dụng cụ khám phá" className="lab-dock">
          <div className="lab-utilities">
            <button aria-label={voiceEnabled ? 'Tắt âm thanh hướng dẫn' : 'Bật âm thanh hướng dẫn'} aria-pressed={voiceEnabled} onClick={handleToggleVoice} className="min-h-[52px] min-w-[52px] rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-700">{voiceEnabled ? <Volume2 className="w-7 h-7"/> : <VolumeX className="w-7 h-7"/>}</button>
            <button aria-label={isTeacherMode ? 'Chuyển sang khám phá của trẻ' : 'Mở chế độ giáo viên'} aria-pressed={isTeacherMode} disabled={pouringWater||!!holdingItemId||!!selectedTrayItem||!!draggingTrayItem||workflowStep!=='idle'} onClick={()=>{
              switchExploration(false);
              const next=!isTeacherMode;setIsTeacherMode(next);setShowPreparation(next);setTeacherConfigured(false);setShowTeacherControls(false);setPreparationTab('lesson');speechEngine.stop();speechEngine.setVoiceEnabled(!next);setVoiceEnabled(!next);setPreviewIntro(false);setIntroComplete(next);setAdvanced(false);
              if(!next){setActivityMode('discovery');setShowObservationBoard(false);setShowGuideModal(false);setShowTeacherObjectives(false);setShowConclusionPicker(false);setShowDemoHand(false);setRaceModeActive(false);setRaceRunning(false);actionTimersRef.current.forEach(clearTimeout);actionTimersRef.current.clear();dragCleanupRef.current?.();activeDragItemRef.current=null;setSelectedTrayItem(null);setDraggingTrayItem(null);threeTankRef.current?.cancelActiveGesture();setInteractionMode('interact');}
            }} className="min-h-[52px] min-w-[52px] rounded-2xl bg-white border border-amber-200 flex items-center justify-center gap-2 px-2 font-bold">{isTeacherMode ? '👶' : '🧑‍🏫'}{isTeacherMode && <span className="text-xs">Khám phá của trẻ</span>}</button>
          </div>
          {!comparisonMode&&(activityMode==='discovery'||activityMode==='egg-challenge') && <div className="lab-object-tray" ref={trayRef}>
            <ObjectBasket items={displayItems} selectedId={selectedTrayItem?.id||null} showLabels={false}
              onPick={(event,item)=>{if(item.damage){const fresh:TankObject={...item,inTank:false,outsideTank:false,damage:undefined,x:0,y:0.45,z:0,vx:0,vy:0,vz:0,status:'basket',settled:false};setItems(prev=>prev.map(i=>i.id===item.id?fresh:i));handleTrayItemPointerDown(event,fresh);}else handleTrayItemPointerDown(event,item);}}
              onKeyboardPick={item=>{if(!gestureAllowedRef.current)return;const fresh=item.damage?{...item,inTank:false,outsideTank:false,damage:undefined,status:'basket' as const}:item;if(item.damage)setItems(prev=>prev.map(i=>i.id===item.id?fresh:i));const scene=playSceneRef.current?.getBoundingClientRect();if(scene)setDragCursorPos({x:scene.left+scene.width/2,y:scene.top+scene.height*.18});setSelectedTrayItem(fresh);if(scene)threeTankRef.current?.previewDropAtScreenPos(fresh,scene.left+scene.width/2,scene.top+scene.height/2);markUserInteracted();setMessage('Con đang cầm vật. Đưa tay đến chỗ muốn thả nhé.');}}
            />
          </div>}
          {(selectedTrayItem||draggingTrayItem)&&<button onPointerDown={e=>e.stopPropagation()} onClick={()=>{dragCleanupRef.current?.();activeDragItemRef.current=null;isDraggingRef.current=false;setSelectedTrayItem(null);setDraggingTrayItem(null);threeTankRef.current?.clearDropPreview();}} className="min-h-[48px] rounded-2xl bg-orange-100 font-bold" aria-label="Đặt vật về khay"><span aria-hidden="true" className="text-2xl">🧺↩</span></button>}
          {!isTeacherMode&&advanced&&desktopComparison&&activityMode!=='boat-challenge'&&<button disabled={comparisonBusy} aria-label="So sánh nước" aria-pressed={comparisonMode} onClick={toggleComparison} className="min-h-[52px] rounded-2xl bg-violet-100 px-2 font-bold disabled:opacity-50">{isTeacherMode?(comparisonMode?'Về khám phá tự do':'So sánh nước'):<span aria-hidden="true" className="text-3xl">{comparisonMode?'🧺':'⚖️🌊'}</span>}</button>}
          {comparisonMode&&<div className="rounded-2xl bg-white border-2 border-violet-200 p-2 space-y-2">
            {isTeacherMode&&<p className="text-sm font-bold">Cùng vật · cùng bể · chỉ đổi muối</p>}
            {isTeacherMode?<select aria-label="Vật dùng để so sánh hai bể" value={comparisonItemId} disabled={comparisonBusy} onChange={e=>setComparisonItemId(e.target.value)} className="w-full min-h-[48px] rounded-xl bg-sky-50 px-2">{PLAY_ITEMS_PRESETS.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>:<div className="grid grid-cols-3 gap-1">{PLAY_ITEMS_PRESETS.map(item=><button key={item.id} aria-label={item.name} aria-pressed={comparisonItemId===item.id} disabled={comparisonBusy} onClick={()=>setComparisonItemId(item.id)} className={`rounded-xl bg-white p-1 ${comparisonItemId===item.id?'ring-2 ring-sky-500':''}`}><img src={item.image} alt="" className="w-12 h-12 object-contain"/></button>)}</div>}

            <button disabled={comparisonBusy} aria-label="Thả cùng vật vào hai bể" onClick={releaseComparison} className="w-full min-h-[52px] rounded-xl bg-violet-600 text-white font-bold disabled:opacity-50">{isTeacherMode?'Thả cùng vật vào hai bể':<span aria-hidden="true" className="text-3xl">⬇️⬇️</span>}</button>
            {isTeacherMode&&<p className="text-xs">Thử trước, rồi thêm muối và khuấy ở bể A. Bể B giữ nước ngọt; lượng nước giữ nguyên.</p>}
          </div>}
          {false&&isTeacherMode&&!comparisonMode&&<button aria-pressed={showSecondTank} onClick={()=>setShowSecondTank(!showSecondTank)} className="min-h-[48px] rounded-2xl bg-violet-100 font-bold">{showSecondTank?'Ẩn bể 2':'Thêm bể 2'}</button>}
          {false&&isTeacherMode&&<button aria-expanded={showGuideModal} onClick={()=>setShowGuideModal(!showGuideModal)} className="min-h-[48px] rounded-2xl bg-amber-100 font-bold">📖 Hướng dẫn</button>}
          {!isTeacherMode&&activityMode!=='boat-challenge'&&<button disabled={pouringWater||!!holdingItemId||!!selectedTrayItem||!!draggingTrayItem||workflowStep!=='idle'} aria-label={advanced?'Thả đồ vật':'Khám phá thêm'} aria-pressed={advanced} onClick={()=>switchExploration(!advanced)} className="min-h-[52px] rounded-2xl bg-sky-100 px-2 font-bold disabled:opacity-50">{isTeacherMode?(advanced?'🧺 Thả đồ vật':'🔎 Khám phá thêm'):<span aria-hidden="true" className="text-3xl">{advanced?'🧺':'🔎'}</span>}</button>}
          {activityMode!=='boat-challenge'&&<div className="lab-tools" aria-label="Dụng cụ thí nghiệm">
          {(advanced||ladleGuideReady) && !comparisonMode && (activityMode==='discovery'||activityMode==='egg-challenge') && <WaterPitcher
            disabled={comparisonMode || introLocked || pouringWater || !!holdingItemId || !!selectedTrayItem || !!draggingTrayItem || workflowStep!=='idle' || interactionMode==='orbit'}
            teacher={false} onActive={setPouringWater}
            flowRate={waterVolumeMl(tankShape,dimensions)*.1}
            getTarget={(x,y)=>threeTankRef.current?.pitcherTarget(x,y)||null}
            onSpill={addFloorWater}
            onFlow={(x,y)=>threeTankRef.current?.stirAtScreenPoint(x,y,.6)}
            checkMouth={(x,y)=>threeTankRef.current?.checkPointOverTankMouth(x,y).isOver ?? false}
            onAdd={amount=>{
              const base=waterVolumeMl(tankShape,dimensions),total=base+addedWaterRef.current+amount;
              const result=splitOverflow(total,0,capRef.current);
              overflowSalt(result.spilled,total);
              addedWaterRef.current=result.kept-base;setAddedWaterMl(addedWaterRef.current);
              if(result.spilled>0){spillOverRim(result.spilled);}
              return amount;
            }}/>
          }
          <div data-stir-tool-slot style={{gridColumn:1}} />
          {LADLE_ENABLED && (advanced||ladleGuideReady) && !comparisonMode && (activityMode==='discovery'||activityMode==='egg-challenge') && <WaterLadle
            highlighted={ladleGuideReady&&!ladleActive} isBucket={overBucket} canPourBucket={()=>performance.now()>=bucketReadyAfterRef.current} onCarriedOutside={setCarriedBucketVisible}
            disabled={comparisonMode || introLocked || pouringWater || !!holdingItemId || !!selectedTrayItem || !!draggingTrayItem || workflowStep!=='idle' || interactionMode==='orbit'}
            teacher={false} capacity={waterVolumeMl(tankShape,dimensions)*.2}
            onActive={active=>{setPouringWater(active);setLadleActive(active);}}
            checkWater={(x,y)=>waterVolumeMl(tankShape,dimensions)+addedWaterRef.current>.01 && (threeTankRef.current?.checkPointInWater(x,y) ?? false)}
            checkMouth={(x,y)=>threeTankRef.current?.checkPointOverTankMouth(x,y).isOver ?? false}
            onFlow={(x,y)=>threeTankRef.current?.stirAtScreenPoint(x,y,.5)}
            getTarget={(x,y)=>{
              if(overBucket(x,y)){const r=(receivingBucketRef.current||bucketRef.current)!.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*.4,worldX:0,worldZ:0,inside:false};}
              return threeTankRef.current?.flowTarget(x,y)||null;
            }}
            onDispose={(x,y,water)=>{
              if(overBucket(x,y)){
                const next=fillBucketSupply(bucketWaterRef.current,water);
                if(next.fullBuckets.length>bucketWaterRef.current.fullBuckets.length)bucketReadyAfterRef.current=performance.now()+700;
                bucketWaterRef.current=next;setBucketWater(next);
              }
              else {const target=threeTankRef.current?.flowTarget(x,y);if(target)addFloorWater(target.worldX,target.worldZ,water.ml);else {addedWaterRef.current+=water.ml;removedSaltRef.current=Math.max(0,removedSaltRef.current-water.grams);setAddedWaterMl(addedWaterRef.current);setRemovedSaltGrams(removedSaltRef.current);}}
            }}
            onTake={amount=>{
              const taken=scoopWater(waterVolumeMl(tankShape,dimensions)+addedWaterRef.current,Math.max(0,dissolvedFraction*SALT_GRAMS_PER_SPOON-removedSaltRef.current),amount);
              addedWaterRef.current-=taken.ml;removedSaltRef.current+=taken.grams;
              if(taken.ml>0){setAddedWaterMl(addedWaterRef.current);setRemovedSaltGrams(removedSaltRef.current);}
              return taken;
            }}
            onReturn={water=>{
              addedWaterRef.current+=water.ml;removedSaltRef.current=Math.max(0,removedSaltRef.current-water.grams);
              setAddedWaterMl(addedWaterRef.current);setRemovedSaltGrams(removedSaltRef.current);
            }}/>
          }
          {<FloorMop available={floorSpills.length>0} highlighted={clothGuideReady&&floorSpills.length>0}
            clearBucketsToken={clearClothBucketsToken} onWringComplete={completeFloorCleanup}
            disabled={introLocked||pouringWater||!!holdingItemId||!!selectedTrayItem||!!draggingTrayItem||workflowStep!=='idle'||interactionMode==='orbit'}
            teacher={false} onActive={setPouringWater}
            onClean={(x,y,capacity)=>{
              const point=threeTankRef.current?.floorPoint(x,y);if(!point)return 0;
              const spills=floorSpillsRef.current,index=spills.findIndex(spill=>Math.hypot(spill.x-point.x,spill.z-point.z)<Math.max(1,Math.sqrt(spill.ml/180)));
              if(index<0)return 0;
              const absorbed=Math.min(capacity,spills[index].ml);
              const next=spills.map((spill,i)=>i===index?{...spill,ml:spill.ml-absorbed}:spill).filter(spill=>spill.ml>.01);
              floorSpillsRef.current=next;setFloorSpills(next);return absorbed;
            }}/>}
          {(activityMode==='discovery'||activityMode==='egg-challenge') && (
          <SaltWorkflow toolsEnabled={advanced} key="salt-workflow" visualOnly={true}
            disabled={interactionMode === 'orbit' || pouringWater}
            saltSpoons={saltSpoons+pendingSaltSpoons}
            pendingSaltSpoons={pendingSaltSpoons}
            getToolAnchor={()=>threeTankRef.current?.toolAnchor()||null}
            spoonFraction={spoonFraction}
            onDoseChange={setSpoonFraction}
            onStirAtScreenPoint={(x,y) => threeTankRef.current?.stirAtScreenPoint(x,y,.35)}
            onPourAtScreenPoint={(x,y) => {
              const target=threeTankRef.current?.saltTarget(x,y);
              if(target)handlePourSaltAtPoint(target);
            }}
            checkPointOverMouth={(x,y)=>!!threeTankRef.current?.saltTarget(x,y)}
            activeStirProgress={activeStirProgress}
            currentDensity={waterDensity}
            workflowStep={workflowStep}
            onStepChange={(step) => { if (interactionMode === 'interact') { setSelectedTrayItem(null); setWorkflowStep(step); } }}
            onStirProgressUpdate={(progress) => { setActiveStirProgress(progress); threeTankRef.current?.setSaltDissolveProgress(progress); }}
            onSpoonCompleted={handleSpoonCompleted}
            onResetSalt={handleResetSalt}
            checkPointInWater={(x, y) => threeTankRef.current?.checkPointInWater(x, y) ?? false}
            soundEnabled={soundEnabled}
            onMessageUpdate={setMessage}
          />
          )}
          </div>}
          {isTeacherMode && showTeacherControls && <div role="dialog" aria-modal="true" aria-label="Điều khiển thí nghiệm" className="teacher-controls-backdrop" onKeyDown={e=>{if(e.key==='Escape')setShowTeacherControls(false);}}><section className="teacher-controls-panel"><header className="teacher-panel-heading"><h2>Điều khiển thí nghiệm</h2><button autoFocus aria-label="Đóng điều khiển" onClick={()=>setShowTeacherControls(false)}>✕</button></header><div className="teacher-panel-body">
              {/* Banner khi ở chế độ thử thách quả trứng */}
              {isTeacherMode && activityMode === 'egg-challenge' && (
                <div className="relative flex items-center gap-2 px-3 py-1 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                  <span>🥚</span>
                  <span>
                    {eggSaltObserved === 'floating' ? '🎉 Con đã làm trứng nổi!' : '🥚 Làm thế nào để trứng nổi?'}
                  </span>
                </div>
              )}

              {isTeacherMode && activityMode === 'egg-challenge' && eggChallengeAttempts > 1 && eggSaltObserved !== 'floating' && <button onClick={() => setMessage('Con thử thay đổi nước xem quả trứng có thay đổi không nhé.')} className="relative min-h-[44px] rounded-2xl bg-amber-100 px-4 font-bold">💡 Con muốn gợi ý?</button>}
              {/* Banner hướng dẫn khi đang cầm vật để chạm thả */}
              {isTeacherMode && selectedTrayItem && (
                <div className="relative flex items-center justify-between px-3 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg animate-bounce">
                  <span className="flex items-center gap-1.5">
                    <span>👉</span>
                    <span>Bé đang cầm {selectedTrayItem.name}: Chạm chỗ muốn thả hoặc chọn Đặt lại!</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrayItem(null);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px]"
                  >
                    Đặt lại ✕
                  </button>
                </div>
              )}

              {/* Hướng dẫn Onboarding ngắn gọn (1. Chọn -> 2. Ném -> 3. Quan sát) */}
              {isTeacherMode && onboardingStep > 0 && !selectedTrayItem && activityMode === 'discovery' && (
                <div className="relative flex items-center gap-2 px-3 py-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-400 shadow-md">
                  <span className="text-amber-500 font-black text-xs animate-pulse">
                    {onboardingStep === 1 && '👉 Bước 1: Chọn một món đồ ở khay dưới'}
                    {onboardingStep === 2 && '👆 Bước 2: Kéo ném vào bể nước'}
                    {onboardingStep === 3 && '👀 Bước 3: Quan sát xem chìm hay nổi'}
                  </span>
                  <button
                    onClick={() => setOnboardingStep(0)}
                    className="text-slate-400 hover:text-slate-600 text-xs ml-1"
                    title="Đóng gợi ý"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Three.js 3D Canvas */}
              {isTeacherMode && items.some(i=>i.damage) && <div className="relative flex flex-wrap gap-2">
                {items.filter(i=>i.damage).map(item=><button key={item.id} className="min-h-[48px] rounded-xl bg-amber-50 border border-amber-300 px-3 font-bold" onClick={(event)=>{event.stopPropagation();setItems(prev=>prev.map(i=>i.id===item.id?{...i,inTank:false,outsideTank:false,damage:undefined,x:0,y:0.45,z:0,vx:0,vy:0,vz:0,status:'basket',settled:false}:i));}}> {item.icon} {item.damage==='broken'?'Đã vỡ':item.damage==='cracked'?'Đã nứt':'Bị dập'} · Lấy vật mới</button>)}
              </div>}

      <div className="flex-shrink-0 w-full flex flex-col items-stretch gap-2 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-200/80 dark:border-slate-800 z-30">
        {onBackToTable && (
          <button
            onClick={onBackToTable}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition"
          >
            ← Bàn Thí Nghiệm
          </button>
        )}

        {/* Mascot Cô Mimi & Lời dẫn tiếng Việt khoa học */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-lg flex-shrink-0 shadow-sm animate-bounce">
            👩‍🏫
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Cô Mimi:
              </span>
              {isStandalone && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 font-bold">
                  Cùng khám phá
                </span>
              )}
              {workflowStep === 'stirring' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                  Khuấy đũa: {Math.round(activeStirProgress)}%
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-normal">
              {message}
            </p>
          </div>
        </div>

      </div>

          {!isTeacherMode&&<>
          {/* BỘ CHUYỂN CHẾ ĐỘ HOẠT ĐỘNG (COMPACT ACTIVITY MODE SELECTOR) */}
          <div className="p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-300 dark:border-amber-700 shadow-sm space-y-1">
            <span className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide block px-1">
              Chế Độ Khám Phá:
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-extrabold">
              <button
                onClick={() => handleSelectActivityMode('discovery')}
                className={`min-h-[48px] py-1.5 px-1.5 rounded-xl border flex items-center justify-center gap-1 transition ${
                  activityMode === 'discovery'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                }`}
              >
                <span>🔍</span>
                <span>Khám Phá</span>
              </button>

              <button
                onClick={() => handleSelectActivityMode('egg-challenge')}
                className={`min-h-[48px] py-1.5 px-1.5 rounded-xl border flex items-center justify-center gap-1 transition ${
                  activityMode === 'egg-challenge'
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs font-black'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                }`}
              >
                <span>🥚</span>
                <span>Đố Trứng</span>
              </button>

              <button
                onClick={() => handleSelectActivityMode('boat-challenge')}
                className={`min-h-[48px] py-1.5 px-1.5 rounded-xl border flex items-center justify-center gap-1 transition ${
                  activityMode === 'boat-challenge'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                }`}
              >
                <span>⛵</span>
                <span>Thuyền Nhôm</span>
              </button>

              <button
                onClick={() => handleSelectActivityMode('real-life')}
                className={`min-h-[48px] py-1.5 px-1.5 rounded-xl border flex items-center justify-center gap-1 transition ${
                  activityMode === 'real-life'
                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                }`}
              >
                <span>🌍</span>
                <span>Đời Sống</span>
              </button>
            </div>
          </div>

          </>}
          {activityMode === 'boat-challenge' && <div ref={setBoatControlsHost} />}
          {(activityMode === 'discovery' || activityMode === 'egg-challenge') && <>
          {/* CHẾ ĐỘ TƯƠNG TÁC NGHIÊM NGẶT (STRICT MODES) */}
          <div className="flex flex-col gap-1 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200 dark:border-slate-800 shadow-xs">
            <p className="px-2 py-2 text-xs font-bold text-sky-800">🖐 Giữ đồ vật để cầm · Giữ thành bể để xoay · Lăn chuột để nhìn gần/xa</p>

            <button
              onClick={handleResetAllTank}
              className="w-full py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1 transition"
              title="Vớt sạch đồ vật trong bể về khay"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Dọn Bể Về Khay</span>
            </button>
          </div>

          {(activityMode === 'discovery' || activityMode === 'egg-challenge') && <>
          {/* HŨ MUỐI THẦN KỲ LỚN (MỞ NẮP CẠNH BỂ) */}


          </>}
              {/* Thanh điều khiển góc nhìn và chế độ bên trong khung cảnh 3D */}
              {!isTeacherMode&&<>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetDefaultView}
                  className="min-h-[44px] px-2 py-1 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shadow-sm backdrop-blur-xs transition"
                  title="Góc nhìn mặc định"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">Góc Chuẩn</span>
                </button>

                <button
                  onClick={handleResetSideView}
                  className="min-h-[44px] px-2 py-1 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shadow-sm backdrop-blur-xs transition"
                  title="Góc nhìn ngang thành bể quan sát sát mặt nước"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Góc Ngang</span>
                </button>
              </div>


              </>}
                {/* Mở bảng quan sát */}
                <button
                  onClick={() => {setShowTeacherControls(false);setShowObservationBoard(true);}}
                  className="w-full min-h-[44px] px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[11px] font-black flex items-center gap-1 transition"
                >
                  <span>📋</span>
                  <span>Bảng Quan Sát ({observedCount})</span>
                </button>

          {trialHistory.length > 0 && <button onClick={() => {setShowTeacherControls(false);setShowConclusionPicker(true);}} className="min-h-[48px] w-full rounded-2xl bg-amber-100 text-amber-900 font-bold">🤔 Con kể lại điều đã thấy</button>}
          </>}
<details className="rounded-2xl bg-white p-2"><summary className="min-h-[44px] flex items-center font-bold text-sm cursor-pointer">🎧 Nghe và trợ giúp</summary>        {/* Nút hỗ trợ & Giọng nói */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nút xem bàn tay mẫu */}
          <button
            disabled={activityMode === 'boat-challenge' || activityMode === 'real-life'}
            onClick={() => {setShowTeacherControls(false);setShowDemoHand(true);}}
            className="min-h-[44px] px-2 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-[11px] flex items-center gap-1 shadow-2xs transition"
            title="Xem bàn tay làm mẫu"
          >
            <span>👆</span>
            <span className="hidden md:inline">Làm Mẫu</span>
          </button>

          <button
            onClick={handleReplayVoice}
            className={`min-h-[44px] p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isSpeaking
                ? 'bg-amber-400 text-slate-950 shadow-sm animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200'
            }`}
            title="Nghe lại lời Cô Mimi"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Nghe Lại</span>
          </button>

          <button
            onClick={handleToggleVoice}
            className="min-h-[44px] p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={voiceEnabled ? 'Tắt giọng nói' : 'Bật giọng nói'}
          >
            {voiceEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => {setShowTeacherControls(false);if(isTeacherMode)openPreparation('lesson');else setShowGuideModal(true);}}
            className="min-h-[44px] p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
            title="Hướng dẫn thí nghiệm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Hướng Dẫn</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="min-h-[44px] p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

</details>
          {(activityMode === 'discovery' || activityMode === 'egg-challenge') && <>
          {!isTeacherMode&&<>
          {/* ĐUA THẢ 2 VẬT CÙNG LÚC */}
          <div className="p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200 dark:border-slate-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>🏁</span>
                <span>Đua Thả 2 Vật:</span>
              </span>
              <button
                disabled={comparisonMode}
                    onClick={() => setRaceModeActive(!raceModeActive)}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-lg transition ${
                  raceModeActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {raceModeActive ? 'Đóng' : 'Mở'}
              </button>
            </div>

            {raceModeActive && (
              <div className="space-y-1 pt-1 text-xs">
                <div className="flex items-center gap-1">
                  <select
                    value={raceSlotA}
                    onChange={(e) => setRaceSlotA(e.target.value)}
                    className="flex-1 text-[10px] p-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.icon} {i.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] font-extrabold text-amber-500">VS</span>
                  <select
                    value={raceSlotB}
                    onChange={(e) => setRaceSlotB(e.target.value)}
                    className="flex-1 text-[10px] p-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.icon} {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleStartRace}
                  disabled={raceRunning}
                  className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs shadow-xs transition"
                >
                  {raceRunning ? 'Đang thả...' : 'Bắt Đầu Thả!'}
                </button>
              </div>
            )}
          </div>

          </>}
          {/* NGĂN KÉO MỞ RỘNG DÀNH CHO NGƯỜI LỚN & GIÁO VIÊN */}
          </>}
          </div></section></div>}
        </aside>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL: BẢNG QUAN SÁT TRANH ẢNH & LỊCH SỬ THỬ NGHIỆM    */}
      {/* ======================================================== */}
      {showObservationBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border-4 border-amber-300 dark:border-amber-600 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowObservationBoard(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl shadow-md">
                📋
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Bảng Quan Sát Của Nhà Khoa Học Nhí
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ghi lại kết quả các đồ vật bé đã thả vào bể nước
                </p>
              </div>
            </div>

            {/* So sánh đặc biệt: Quả trứng trước và sau khi cho muối */}
            {observedEggPair && <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-sky-50 dark:from-amber-950/40 dark:to-sky-950/40 border-2 border-amber-300 dark:border-amber-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥚</span>
                <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                  Cùng một quả trứng: Trước và sau
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">Trong Nước Ngọt Ban Đầu:</span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-300">
                    {observedEggPair.before.result === 'sunk' ? '⚓ Đã chìm' : '🫧 Đã nổi'}
                  </span>
                  <span className="text-[9px] text-slate-500">{observedEggPair.before.result === 'sunk' ? 'Trứng ở dưới đáy bể' : 'Trứng ở mặt nước'}</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 flex flex-col items-center text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-600">Khi Hòa Tan Thêm Muối:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {observedEggPair.after.result === 'floating' ? '🫧 Đã nổi' : '⚓ Đã chìm'}
                  </span>
                  <span className="text-[9px] text-slate-500">{observedEggPair.after.result === 'floating' ? 'Trứng ở mặt nước' : 'Trứng ở dưới đáy bể'}</span>
                </div>
              </div>
            </div>}

            {/* 2 cột đồ vật đã quan sát: Chìm vs Nổi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                  <span>⚓</span>
                  <span>Lần gần nhất: Vật chìm</span>
                </div>
                <div className="space-y-1.5">
                  {items
                    .filter((i) => observations[i.id] === 'sunk')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-700 shadow-2xs"
                      >
                        <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold truncate">{item.name}</div>
                          <div className="text-[9px] text-slate-500 truncate">{item.desc}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                          Chìm
                        </span>
                      </div>
                    ))}
                  {items.filter((i) => observations[i.id] === 'sunk').length === 0 && (
                    <p className="text-[10px] text-slate-400 italic py-2 text-center">
                      Chưa có vật chìm trong lần quan sát gần nhất
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 dark:text-emerald-200">
                  <span>🫧</span>
                  <span>Lần gần nhất: Vật nổi</span>
                </div>
                <div className="space-y-1.5">
                  {items
                    .filter((i) => observations[i.id] === 'floating')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-700 shadow-2xs"
                      >
                        <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold truncate">{item.name}</div>
                          <div className="text-[9px] text-slate-500 truncate">{item.desc}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Nổi
                        </span>
                      </div>
                    ))}
                  {items.filter((i) => observations[i.id] === 'floating').length === 0 && (
                    <p className="text-[10px] text-slate-400 italic py-2 text-center">
                      Chưa có vật nổi trong lần quan sát gần nhất
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lịch sử thử nghiệm bất biến (Immutable trial history) */}
            {trialHistory.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>📜</span>
                  <span>Lịch sử các lần thử ({trialHistory.length} lần):</span>
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                  {trialHistory.slice().reverse().map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-[10px] p-1.5 rounded-lg bg-white dark:bg-slate-700"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{t.itemIcon}</span>
                        <span className="font-bold">{t.itemName}</span>
                        <span className="text-slate-400">({t.waterDensity > 1.00001 ? `Muối đã tan: ${t.saltAmount} thìa` : 'Nước ngọt'})</span>
                      </div>
                      <span className={`font-black ${t.result === 'floating' ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {t.result === 'floating' ? '🫧 Nổi' : '⚓ Chìm'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowObservationBoard(false);
                  handleResetAllTank();
                  handleResetSalt();
                  setTrialHistory([]);
                  setEggChallengeAttempts(0);

                  setObservations({});
                  setPredictions({});

                  setEggSaltObserved('untested');
                  setOnboardingStep(1);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Thử Lại Từ Đầu 🔄
              </button>
              <button
                onClick={() => setShowObservationBoard(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Chơi Tiếp Nào! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL CHỌN KẾT LUẬN BẰNG TRANH ẢNH CHO BÉ             */}
      {/* ======================================================== */}
      {showConclusionPicker && <ReflectionPanel history={trialHistory} onClose={()=>setShowConclusionPicker(false)} onBoard={()=>{setShowConclusionPicker(false);setShowObservationBoard(true);}}/>}

      {/* ======================================================== */}
      {/* 6. MODAL HƯỚNG DẪN THÍ NGHIỆM                            */}
      {/* ======================================================== */}
      {!isTeacherMode && showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-4 border-amber-300 dark:border-amber-600 shadow-2xl p-5 space-y-3.5 relative">
            <button
              onClick={() => setShowGuideModal(false)}
              aria-label="Đóng hướng dẫn"
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl shadow-md">
                🎓
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Hướng dẫn cho giáo viên
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dự đoán · thử · quan sát · so sánh
                </p>
              </div>
            </div>

            <ol className="space-y-3 text-sm list-decimal pl-5">
              <li>Cho trẻ chọn vật và dự đoán: “Con nghĩ vật sẽ chìm hay nổi?”</li>
              <li>Giữ vật trong khay, kéo đến bể rồi buông. Để trẻ quan sát và thử lại.</li>
              <li>Mở “Khám phá thêm” để thêm nước, xúc muối và khuấy; so sánh cùng một vật trước và sau.</li>
            </ol>
            <p className="text-sm text-sky-800">Gợi mở: “Con thấy điều gì?” rồi cho trẻ tự nêu nhận xét.</p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL CHUẨN MỤC TIÊU SƯ PHẠM GDMN                     */}
      {/* ======================================================== */}
      {showTeacherObjectives && (
        <TeacherObjectivesModal onClose={() => setShowTeacherObjectives(false)} />
      )}

      {/* ======================================================== */}
      {/* 8. BÀN TAY LÀM MẪU (GUIDED DEMO HAND)                    */}
      {/* ======================================================== */}
      {isTeacherMode && showDemoHand && (
        <GuidedDemoHand sceneBounds={playSceneRef.current?.getBoundingClientRect()} trayBounds={trayRef.current?.getBoundingClientRect()} onClose={() => setShowDemoHand(false)} soundEnabled={soundEnabled} />
      )}

      {/* ======================================================== */}
      {/* 9. CON TRỎ BÀN TAY BÉ CẦM ĐỒ VẬT KHI KÉO TỪ KHAY         */}
      {/* ======================================================== */}
      {(draggingTrayItem || selectedTrayItem) && (
        <HeldObjectPreview
          x={dragCursorPos.x}
          y={dragCursorPos.y}
          image={(draggingTrayItem || selectedTrayItem)!.image}
          name={(draggingTrayItem || selectedTrayItem)!.name}
        />
      )}
    </div>
  );
};

export default SimSinkOrFloatLab;

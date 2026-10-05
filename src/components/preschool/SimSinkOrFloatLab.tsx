import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  Eye,
  Award
} from 'lucide-react';
import { unlockImpactAudio } from './sink-float/impactAudio';
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
import { ThreeTankCanvas, ThreeTankCanvasHandle } from './sink-float/ThreeTankCanvas';
import { brineDensity, waterVolumeMl, SALT_GRAMS_PER_SPOON, MAX_SALT_SPOONS } from './sink-float/salinity';
import { SaltWorkflow } from './sink-float/SaltWorkflow';
import { WaterPitcher } from './sink-float/WaterPitcher';
import { addedWaterHeight, maximumAddedWater, sandHeight } from './sink-float/waterPhysics';
import { BoatChallenge } from './sink-float/BoatChallenge';
import { RealLifeActivityCards } from './sink-float/RealLifeActivityCards';
import { basketSlots, replenishBasket } from './sink-float/basketInventory';
import { itemKind } from './sink-float/playPhysics';
import { SceneSetting } from './sink-float/SceneBackdrop';
import { ChildIntro } from './sink-float/ChildIntro';
import { ObjectBasket } from './sink-float/ObjectBasket';
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

// 10 món đồ chơi mẫu phong phú cho trẻ mầm non
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
    image: '/assets/items/keys.png',
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
    image: '/assets/items/spoon.png',
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
    image: '/assets/items/apple.png',
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
    image: '/assets/items/wood.png',
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
    name: 'Bóng bàn',
    icon: '⚪',
    image: '/assets/items/pingpong.png',
    size: 0.66,
    weightGrams: 3,
    volumeMl: 40,
    floatsDefault: true,
    desc: 'Nhựa rỗng chứa khí',
    densityNote: 'Siêu nhẹ và chứa đầy khí (D = 0.075 g/ml), nổi nhô hẳn lên trên mặt nước',
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
    image: '/assets/items/leaf.png',
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
    id: 'item-foam',
    name: 'Mẩu xốp',
    icon: '🧱',
    image: '/assets/items/foam.png',
    size: 0.86,
    weightGrams: 2,
    volumeMl: 35,
    floatsDefault: true,
    desc: 'Xốp bọt khí',
    densityNote: 'Cấu tạo từ hàng triệu bóng khí li ti (D = 0.057 g/ml), nổi sát trên bề mặt nước',
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
const AGE_3_4_ITEM_IDS = ['item-pebble', 'item-duck', 'item-apple', 'item-egg'];

// Bàn tay trẻ em cầm đồ vật di chuyển theo chuột khi kéo từ khay
const ToddlerHandPreview: React.FC<{
  x: number;
  y: number;
  image: string;
  name: string;
}> = ({ x, y, image, name }) => (
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-35px, -45px)',
      pointerEvents: 'none',
      zIndex: 9999
    }}
    className="fixed select-none filter drop-shadow-2xl"
  >
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Hình đồ vật bé đang cầm */}
      <img
        src={image}
        alt={name}
        className="absolute left-0 top-0 z-10 w-14 h-14 object-contain filter drop-shadow-md transform -rotate-12 pointer-events-none"
        draggable={false}
      />
      {/* Bàn tay trẻ em mũm mĩm cầm đồ vật */}
      <svg
        className="absolute left-5 top-5 w-24 h-24 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M 18 84 C 22 70 32 56 46 50 C 60 45 74 52 82 64 C 85 74 80 84 70 88 C 52 94 32 94 18 84 Z"
          fill="#fcd34d"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <ellipse
          cx="38"
          cy="42"
          rx="9"
          ry="14"
          fill="#fde68a"
          stroke="#f59e0b"
          strokeWidth="2.5"
          transform="rotate(-25 38 42)"
        />
        <circle cx="56" cy="38" r="7.5" fill="#fde68a" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="70" cy="46" r="7" fill="#fde68a" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="76" cy="58" r="6.5" fill="#fde68a" stroke="#f59e0b" strokeWidth="2.5" />
      </svg>
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
  const [soundEnabled] = useState<boolean>(true);
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
  const [addedWaterMl,setAddedWaterMl]=useState(0);
  const addedWaterRef=useRef(0);
  const [pouringWater,setPouringWater]=useState(false);
  const [dimensions, setDimensions] = useState<TankDimensions>(() =>
    getTankDimensions('rectangle', 'normal')
  );

  useEffect(() => {
    const nextDims = getTankDimensions(tankShape, tankScale);
    setDimensions(nextDims);
    setAddedWaterMl(0);addedWaterRef.current=0;

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
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 đến 5 thìa
  const [activeStirProgress, setActiveStirProgress] = useState<number>(0); // 0 đến 100% của thìa hiện tại
  const [workflowStep, setWorkflowStep] = useState<SaltWorkflowStep>('idle');

  // Khối lượng riêng cập nhật LIÊN TỤC theo lượng muối tan (D >= 1.0)
  const dissolvedFraction = saltSpoons + (workflowStep === 'stirring' ? activeStirProgress / 100 * spoonFraction : 0);
  const waterDensity = brineDensity(dissolvedFraction * SALT_GRAMS_PER_SPOON, waterVolumeMl(tankShape, dimensions)+addedWaterMl);

  // 5. DANH SÁCH ĐỒ VẬT VÀ LỨA TUỔI
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('3-4');

  // 6. VÒNG LẶP HỌC TẬP (LEARNING LOOP): DỰ ĐOÁN & QUAN SÁT
  const [predictions, setPredictions] = useState<Record<string, ItemPrediction>>({});
  const [observations, setObservations] = useState<Record<string, ItemObserved>>({});
  const [eggFreshObserved, setEggFreshObserved] = useState<ItemObserved>('untested');
  const [eggSaltObserved, setEggSaltObserved] = useState<ItemObserved>('untested');

  // Lịch sử thử nghiệm bất biến (Immutable trial history mà không bị spam per-frame)
  const [trialHistory, setTrialHistory] = useState<TrialRecord[]>([]);

  // Bé chọn kết luận bằng tranh ảnh trước khi nghe giải thích
  const [showConclusionPicker, setShowConclusionPicker] = useState<boolean>(false);
  const [chosenConclusion, setChosenConclusion] = useState<string | null>(null);

  // Thử thách quả trứng (Egg challenge state & attempts)
  const [eggChallengeAttempts, setEggChallengeAttempts] = useState<number>(0);

  // 7. THẢ VẬT BẰNG TAY (HAND THROWING): KÉO TỪ KHAY VÀ CHẠM CHỌN
  const [draggingTrayItem, setDraggingTrayItem] = useState<TankObject | null>(null);
  const [dragCursorPos, setDragCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedTrayItem, setSelectedTrayItem] = useState<TankObject | null>(null);

  const pointerVelocityRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const activeDragItemRef = useRef<TankObject | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const introLocked = !introComplete;
  const gestureAllowedRef = useRef(false);
  gestureAllowedRef.current = !introLocked && !pouringWater && interactionMode === 'interact' && workflowStep === 'idle';

  // 8. HƯỚNG DẪN INLINE & BÀN TAY LÀM MẪU (GUIDED DEMO HAND)
  const [onboardingStep, setOnboardingStep] = useState<number>(1); // 1, 2, 3 hoặc 0 (đã xong)
  const [showDemoHand, setShowDemoHand] = useState<boolean>(false);

  // 9. CÁC MODAL HỌC TẬP
  const [showObservationBoard, setShowObservationBoard] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showTeacherObjectives, setShowTeacherObjectives] = useState<boolean>(false);
  const [isTeacherMode,setIsTeacherMode] = useState(false);
  const [sceneSetting, setSceneSetting] = useState<SceneSetting>('laboratory');
  const basketBatchRef = useRef(0);
  const [showAdultPanel, setShowAdultPanel] = useState<boolean>(false);
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
    setActivityMode(mode);
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
            setMessage('Con thấy trứng khác lúc đầu thế nào? Con có thể mở bảng để so sánh nhé.');
          }
        } else {
          setEggFreshObserved(result);
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
    isDraggingRef.current = false;

    const onWindowPointerMove = (moveEvt: PointerEvent) => {
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
        const history = pointerVelocityRef.current;
        history.push({ x: curX, y: curY, t: curT });
        while (history.length > 1 && curT - history[0].t > 150) {
          history.shift();
        }
      }
    };

    const onWindowPointerUp = (upEvt: PointerEvent) => {
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
          setMessage(`Bé đã cầm "${item.name}"! Đưa tay đến chỗ muốn thả, hoặc kéo nhanh rồi buông để ném nhé!`);
          if (soundEnabled) soundEngine.playSpoonClink();
          if (onboardingStep === 1) setOnboardingStep(2);
        }
      }

      activeDragItemRef.current = null;
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
    dragCleanupRef.current = () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
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
    setSaltSpoons(previous => Math.min(MAX_SALT_SPOONS, previous + spoonFraction));
    setActiveStirProgress(0);
    setItems(previous => previous.map(item => item.inTank ? {...item, settled: false} : item));
    setMessage('Muối đã tan. Con thấy quả trứng thay đổi thế nào?');
  }, [spoonFraction]);

  // Thay nước ngọt ban đầu & dọn sạch hạt muối
  const handleResetSalt = useCallback(() => {
    setAddedWaterMl(0);addedWaterRef.current=0;
    markUserInteracted();
    if (pourTimeoutRef.current) {
      clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = null;
    }
    setSaltSpoons(0);
    setActiveStirProgress(0);
    setWorkflowStep('idle');
    threeTankRef.current?.clearSaltGrains();
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay nước mới tinh khiết! Nước trở lại là nước ngọt trong vắt.');
  }, [soundEnabled, markUserInteracted]);

  // Đổ muối vào miệng bể
  const handlePourSaltAtPoint = useCallback(
    (point: THREE.Vector3) => {
      if (workflowStep !== 'holdingSpoon') return;

      setWorkflowStep('pouring');
      setMessage('Muối đang rơi vào nước. Con cùng quan sát nhé!');
      if (soundEnabled) soundEngine.playSaltPour();
      threeTankRef.current?.spawnSaltGrains(Math.round(80 * spoonFraction), point);

      if (pourTimeoutRef.current) clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = window.setTimeout(() => {
        setWorkflowStep('stirring');
        setActiveStirProgress(0);
        setMessage('Con đưa đũa vào nước và khuấy vòng tròn để muối tan dần nhé!');
      }, 450);
    },
    [workflowStep, soundEnabled, spoonFraction]
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

  // Danh sách đồ vật hiển thị theo lứa tuổi (3-4 tuổi: 4 món quen thuộc; 5-6 tuổi: cả 10 món)
  const basketPresets = ageGroup === '3-4' ? PLAY_ITEMS_PRESETS.filter(i => AGE_3_4_ITEM_IDS.includes(i.id)) : PLAY_ITEMS_PRESETS;
  const displayItems = basketSlots(items, basketPresets);

  // Replenish real, uniquely identified objects; keep previous trials in the tank.
  useEffect(() => {
    if (!displayItems.every(item => item.inTank)) return;
    const batch = ++basketBatchRef.current;
    setItems(previous => replenishBasket(previous, basketPresets, batch));
  }, [items, ageGroup]);

  const observedCount = Object.keys(observations).length;

  return (
    <div
      ref={containerRef}
      onPointerMove={(event) => { if (selectedTrayItem) setDragCursorPos({ x: event.clientX, y: event.clientY }); }}
      onClick={markUserInteracted}
      className={`select-none transition-all duration-300 w-full flex flex-col font-sans bg-gradient-to-b from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950 text-slate-800 dark:text-slate-100 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-2 lg:p-3 overflow-hidden h-screen'
          : 'relative h-full min-h-0 rounded-3xl overflow-hidden border border-sky-200 dark:border-slate-800 shadow-xl'
      }`}
    >
      {introLocked && <ChildIntro onComplete={() => {setIntroComplete(true);setHasUserInteracted(true);}}/>}
      {/* ======================================================== */}
      {/* 1. COMPACT TOP ROUTE & MASCOT BAR                        */}
      {/* ======================================================== */}


      {/* ======================================================== */}
      {/* 2. CHÍNH: 2 CỘT (TRÁI: BỂ 3D 75-80% | PHẢI: BẢNG ~240px) */}
      {/* ======================================================== */}
      <div {...(introLocked ? {inert: ''} : {})} aria-hidden={introLocked || undefined} className="flex-1 min-h-0 flex flex-row items-stretch p-2 gap-2 overflow-hidden">
        {/* CỘT TRÁI: KHU VỰC CHƠI CHÍNH (75-80%) */}
        <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden space-y-1.5">
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
                  const rect = playSceneRef.current?.getBoundingClientRect();
                  if (rect) {threeTankRef.current?.dropOrThrowItemAtScreenPos(selectedTrayItem, rect.left+rect.width/2, rect.top+rect.height*0.18); setSelectedTrayItem(null);}
                }
              }}
              className="flex-1 min-h-0 relative rounded-3xl overflow-hidden border-2 border-sky-300/80 shadow-inner flex flex-col bg-sky-50"
            >
              <ThreeTankCanvas
                ref={threeTankRef}
                shape={tankShape}
                sceneSetting={sceneSetting}
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
              />


            </div>
          )}

        </main>

        {/* ======================================================== */}
        {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN HỢP NHẤT (~240px - 260px)       */}
        {/* ======================================================== */}
        <aside className="w-[148px] sm:w-[220px] lg:w-[252px] flex-shrink-0 flex flex-col h-full overflow-y-auto space-y-2 p-1 pb-5 [&>*]:shrink-0">
          <div className="flex items-center justify-between gap-2 sticky top-0 z-30 bg-sky-50/95 rounded-2xl p-1">
            <button aria-label={voiceEnabled ? 'Tắt âm thanh hướng dẫn' : 'Bật âm thanh hướng dẫn'} aria-pressed={voiceEnabled} onClick={handleToggleVoice} className="min-h-[52px] min-w-[52px] rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-700">{voiceEnabled ? <Volume2 className="w-7 h-7"/> : <VolumeX className="w-7 h-7"/>}</button>
            <button aria-label={isTeacherMode ? 'Chuyển sang khám phá của trẻ' : 'Mở chế độ giáo viên'} aria-pressed={isTeacherMode} onClick={()=>{
              const next=!isTeacherMode;setIsTeacherMode(next);setShowAdultPanel(next);
              if(!next){setActivityMode('discovery');setShowObservationBoard(false);setShowGuideModal(false);setShowTeacherObjectives(false);setShowConclusionPicker(false);setShowDemoHand(false);setRaceModeActive(false);setRaceRunning(false);actionTimersRef.current.forEach(clearTimeout);actionTimersRef.current.clear();dragCleanupRef.current?.();activeDragItemRef.current=null;setSelectedTrayItem(null);setDraggingTrayItem(null);threeTankRef.current?.cancelActiveGesture();setInteractionMode('interact');}
            }} className="min-h-[52px] min-w-[52px] rounded-2xl bg-white border border-amber-200 flex items-center justify-center gap-2 px-2 font-bold">{isTeacherMode ? '👶' : '🧑‍🏫'}{isTeacherMode && <span className="text-xs">Khám phá của trẻ</span>}</button>
          </div>
          {(activityMode==='discovery'||activityMode==='egg-challenge') && <div ref={trayRef}>
            <ObjectBasket items={displayItems} selectedId={selectedTrayItem?.id||null} showLabels={isTeacherMode}
              onPick={(event,item)=>{if(item.damage){const fresh:TankObject={...item,inTank:false,outsideTank:false,damage:undefined,x:0,y:0.45,z:0,vx:0,vy:0,vz:0,status:'basket',settled:false};setItems(prev=>prev.map(i=>i.id===item.id?fresh:i));handleTrayItemPointerDown(event,fresh);}else handleTrayItemPointerDown(event,item);}}
              onKeyboardPick={item=>{if(!gestureAllowedRef.current)return;const fresh=item.damage?{...item,inTank:false,outsideTank:false,damage:undefined,status:'basket' as const}:item;if(item.damage)setItems(prev=>prev.map(i=>i.id===item.id?fresh:i));setSelectedTrayItem(fresh);markUserInteracted();setMessage('Con đang cầm vật. Đưa tay đến chỗ muốn thả nhé.');}}
            />
          </div>}
          {isTeacherMode && <div className="text-sm px-2 text-sky-800">Đã rót thêm: {Math.round(addedWaterMl)} ml nước</div>}
          {(activityMode==='discovery'||activityMode==='egg-challenge') && <WaterPitcher
            disabled={introLocked || !!holdingItemId || !!selectedTrayItem || !!draggingTrayItem || workflowStep!=='idle' || interactionMode==='orbit'}
            teacher={isTeacherMode} onActive={setPouringWater}
            flowRate={waterVolumeMl(tankShape,dimensions)*.1}
            onFlow={(x,y)=>threeTankRef.current?.stirAtScreenPoint(x,y,.6)}
            checkMouth={(x,y)=>threeTankRef.current?.checkPointOverTankMouth(x,y).isOver ?? false}
            onAdd={amount=>{
              const occupied=items.filter(i=>i.inTank&&!i.outsideTank).reduce((sum,i)=>sum+i.volumeMl,0);
              const cap=maximumAddedWater(occupied,tankShape,{...dimensions,waterHeight:dimensions.waterHeight+sandHeight(dimensions)});
              const next=Math.min(cap,addedWaterRef.current+amount);
              const actual=Math.max(0,next-addedWaterRef.current);if(actual<=0)return 0;
              addedWaterRef.current=next;setAddedWaterMl(next);return actual;
            }}/>
          }
          {(activityMode==='discovery'||activityMode==='egg-challenge') && (
          <SaltWorkflow key="salt-workflow" visualOnly={!isTeacherMode}
            disabled={interactionMode === 'orbit' || pouringWater}
            saltSpoons={saltSpoons}
            spoonFraction={spoonFraction}
            onDoseChange={setSpoonFraction}
            onStirAtScreenPoint={(x,y) => threeTankRef.current?.stirAtScreenPoint(x,y)}
            onPourAtScreenPoint={(x,y) => {
              const hit = threeTankRef.current?.checkPointOverTankMouth(x,y);
              if (hit?.isOver && hit.point) handlePourSaltAtPoint(hit.point);
            }}
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
          {isTeacherMode && <>
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


                {/* Mở bảng quan sát */}
                <button
                  onClick={() => setShowObservationBoard(true)}
                  className="w-full min-h-[44px] px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[11px] font-black flex items-center gap-1 transition"
                >
                  <span>📋</span>
                  <span>Bảng Quan Sát ({observedCount})</span>
                </button>

          {trialHistory.length > 1 && <button onClick={() => {setChosenConclusion(null);setShowConclusionPicker(true);}} className="min-h-[48px] w-full rounded-2xl bg-amber-100 text-amber-900 font-bold">🤔 Con kể lại điều đã thấy</button>}
          </>}
<details className="rounded-2xl bg-white p-2"><summary className="min-h-[44px] flex items-center font-bold text-sm cursor-pointer">🎧 Nghe và trợ giúp</summary>        {/* Nút hỗ trợ & Giọng nói */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nút xem bàn tay mẫu */}
          <button
            disabled={activityMode === 'boat-challenge' || activityMode === 'real-life'}
            onClick={() => setShowDemoHand(true)}
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
            onClick={() => setShowGuideModal(true)}
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
          {/* ĐUA THẢ 2 VẬT CÙNG LÚC */}
          <div className="p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200 dark:border-slate-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>🏁</span>
                <span>Đua Thả 2 Vật:</span>
              </span>
              <button
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

          {/* NGĂN KÉO MỞ RỘNG DÀNH CHO NGƯỜI LỚN & GIÁO VIÊN */}
          </>}
          <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAdultPanel(!showAdultPanel)}
              className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                <span>🧑‍🏫</span>
                <span>Người Lớn &amp; Giáo Viên</span>
              </div>
              {showAdultPanel ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showAdultPanel && (
              <div className="p-2.5 pt-0 space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800">
                {/* Đổi lứa tuổi thích ứng */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
                  <button
                    onClick={() => setAgeGroup('3-4')}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      ageGroup === '3-4'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    3 - 4 Tuổi (4 Món)
                  </button>
                  <button
                    onClick={() => setAgeGroup('5-6')}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      ageGroup === '5-6'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    5 - 6 Tuổi (10 Món)
                  </button>
                </div>


                {/* Nút mở chuẩn sư phạm mầm non */}
                <button
                  onClick={() => setShowTeacherObjectives(true)}
                  className="w-full py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 border border-emerald-200 transition"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mục tiêu bài học</span>
                </button>

                {/* Chọn hình dạng bể 3D */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Hình dạng bể kính 3D:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                    <button
                      onClick={() => setTankShape('rectangle')}
                      className={`py-1 px-1.5 rounded-lg border transition ${
                        tankShape === 'rectangle'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200'
                      }`}
                    >
                      ▬ Chữ Nhật
                    </button>
                    <button
                      onClick={() => setTankShape('square')}
                      className={`py-1 px-1.5 rounded-lg border transition ${
                        tankShape === 'square'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200'
                      }`}
                    >
                      ◼ Lập Phương
                    </button>
                    <button
                      onClick={() => setTankShape('cylinder')}
                      className={`py-1 px-1.5 rounded-lg border transition ${
                        tankShape === 'cylinder'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200'
                      }`}
                    >
                      ⚪ Trụ Tròn
                    </button>
                    <button
                      onClick={() => setTankShape('triangle')}
                      className={`py-1 px-1.5 rounded-lg border transition ${
                        tankShape === 'triangle'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200'
                      }`}
                    >
                      ▲ Tam Giác
                    </button>
                  </div>
                </div>

                {/* Chọn kích thước bể */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Kích thước bể:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                    <button
                      onClick={() => setTankScale('normal')}
                      className={`py-1 px-1.5 rounded-lg border transition ${
                        tankScale === 'normal'
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200'
                      }`}
                    >
                      Bể To (100%)
                    </button>
                    <button
                      onClick={() => setTankScale('compact')}
                      className={`py-1 px-1.5 rounded-lg border transition ${
                        tankScale === 'compact'
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200'
                      }`}
                    >
                      Bể Nhỏ (50%)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold">Cảnh nền</span>
                  <div className="grid grid-cols-1 gap-2">
                    <button aria-pressed={sceneSetting === 'laboratory'} onClick={() => setSceneSetting('laboratory')} className={`min-h-[44px] rounded-xl border px-2 font-bold text-xs ${sceneSetting === 'laboratory' ? 'bg-sky-100 border-sky-500' : 'bg-white border-slate-200'}`}>🔬 Phòng thí nghiệm</button>
                    <button aria-pressed={sceneSetting === 'seaside'} onClick={() => setSceneSetting('seaside')} className={`min-h-[44px] rounded-xl border px-2 font-bold text-xs ${sceneSetting === 'seaside' ? 'bg-sky-100 border-sky-500' : 'bg-white border-slate-200'}`}>🌊 Bờ biển</button>
                  </div>
                </div>

                {/* Hướng dẫn sư phạm */}
                <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    💡 Gợi ý câu hỏi gợi mở cho trẻ:
                  </div>
                  <p>
                    "Theo con tại sao quả trứng lại nổi lên khi thêm muối? Nước muối có gì khác nước ngọt?"
                  </p>
                  <p className="text-[9px] text-slate-500 italic">
                    * Lưu ý: Lượng thìa muối ngoài đời thực tùy thuộc vào lượng nước trong cốc hay chậu của lớp học.
                  </p>
                </div>
              </div>
            )}
          </div>

          </>}
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
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-sky-50 dark:from-amber-950/40 dark:to-sky-950/40 border-2 border-amber-300 dark:border-amber-700 space-y-2">
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
                    {eggFreshObserved !== 'untested' ? (eggFreshObserved === 'sunk' ? '⚓ Đã chìm' : '🫧 Đã nổi') : 'Chưa quan sát'}
                  </span>
                  <span className="text-[9px] text-slate-500">Trứng ở dưới đáy bể</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 flex flex-col items-center text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-600">Khi Hòa Tan Thêm Muối:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {eggSaltObserved !== 'untested' ? (eggSaltObserved === 'floating' ? '🫧 Đã nổi bồng bềnh!' : '⚓ Đang chìm') : 'Hãy thêm muối quấy đều'}
                  </span>
                  <span className="text-[9px] text-slate-500">Trứng ở gần mặt nước</span>
                </div>
              </div>
            </div>

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
                  setChosenConclusion(null);
                  setObservations({});
                  setPredictions({});
                  setEggFreshObserved('untested');
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
      {showConclusionPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
          <div role="dialog" aria-modal="true" aria-label="Con kể lại điều đã thấy" className="w-full max-w-lg rounded-3xl bg-white border-4 border-amber-300 p-5 space-y-4">
            <div className="flex justify-between gap-3"><h3 className="text-lg font-black">🤔 Con thấy trứng thay đổi thế nào?</h3><button aria-label="Đóng phần kể lại" onClick={() => setShowConclusionPicker(false)} className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100">✕</button></div>
            <p>Cùng một quả trứng, mình đã thay đổi nước. Con chọn điều mình thấy nhé.</p>
            <div className="grid grid-cols-2 gap-3">
              {[{key:'changed', label:'Trứng từ đáy nổi lên',y:24},{key:'same',label:'Trứng vẫn ở đáy',y:90}].map(option => <button key={option.key} onClick={() => {setChosenConclusion(option.key);speechEngine.speak(eggFreshObserved === 'sunk' && eggSaltObserved === 'floating' ? 'Lúc đầu trứng ở đáy. Sau khi thêm muối, trứng nổi lên. Nước muối nâng đỡ quả trứng tốt hơn.' : 'Mình cùng nhìn lại hai lần thử nhé.');}} aria-pressed={chosenConclusion === option.key} className={`rounded-2xl border-2 p-3 font-bold ${chosenConclusion === option.key ? 'bg-amber-100 border-amber-500' : 'border-slate-200'}`}>
                <svg viewBox="0 0 120 120" className="w-full h-28" aria-hidden="true"><rect x="12" y="12" width="96" height="96" rx="6" fill="#e5faff" stroke="#75ccdc" strokeWidth="3"/><path d="M14 35H106" stroke="#56bbd1" strokeWidth="3"/><ellipse cx="60" cy={option.y} rx="11" ry="15" fill="#f1dbb8" stroke="#c5a77f"/></svg>{option.label}
              </button>)}
            </div>
            {chosenConclusion && <p className="rounded-2xl bg-sky-50 p-3 text-sm">{eggFreshObserved === 'sunk' && eggSaltObserved === 'floating' ? chosenConclusion === 'changed' ? 'Đúng với hai lần mình đã quan sát: trứng chìm trong nước ngọt và nổi sau khi thêm muối. Nước muối nâng đỡ quả trứng tốt hơn. Con thử thay nước ngọt xem điều gì xảy ra nhé!' : 'Mình nhìn lại nhé: lúc đầu trứng ở đáy, sau đó trứng đã nổi lên. Con có muốn thử lại để kiểm tra không?' : 'Mình chưa quan sát đủ cả hai lần. Con thử trứng trong nước ngọt, rồi thay đổi nước và nhìn lại nhé.'}</p>}
            <button onClick={() => {setShowConclusionPicker(false);setShowObservationBoard(true);}} className="min-h-[48px] w-full rounded-2xl bg-sky-100 font-bold">📋 Xem hai lần thử</button>
            <button onClick={() => setShowConclusionPicker(false)} className="min-h-[44px] w-full rounded-2xl bg-amber-300 font-bold">Con muốn thử tiếp</button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL HƯỚNG DẪN THÍ NGHIỆM                            */}
      {/* ======================================================== */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-4 border-amber-300 dark:border-amber-600 shadow-2xl p-5 space-y-3.5 relative">
            <button
              onClick={() => setShowGuideModal(false)}
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
                  Hướng Dẫn Khám Phá Thí Nghiệm
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dành cho bé mầm non &amp; Giáo viên
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-start gap-2.5">
                <span className="text-xl">1️⃣</span>
                <div>
                  <h4 className="font-black text-sky-900 dark:text-sky-200">
                    Cầm và Ném đồ vật vào bể:
                  </h4>
                  <p className="text-sky-700 dark:text-sky-300 mt-0.5 leading-relaxed">
                    Giữ một món đồ trong khay rồi kéo đến chỗ muốn thả. Buông nhẹ để thả, kéo nhanh rồi buông để ném. Vật có thể rơi vào nước hoặc ra sàn. Khi tay trống, giữ thành bể rồi kéo để xoay; lăn chuột để nhìn gần hoặc xa. Nhấn Esc để đặt vật đang cầm lại khay.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5">
                <span className="text-xl">2️⃣</span>
                <div>
                  <h4 className="font-black text-amber-900 dark:text-amber-200">
                    Xúc muối &amp; Khuấy tan:
                  </h4>
                  <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    Mở hũ muối, đưa thìa vào hũ rồi kéo để xúc. Đưa thìa tới miệng bể, giữ và kéo để nghiêng thìa. Khuấy đũa trong nước rồi quan sát điều thay đổi. Con có thể chọn nửa thìa hoặc đầy thìa.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-2.5">
                <span className="text-xl">3️⃣</span>
                <div>
                  <h4 className="font-black text-indigo-900 dark:text-indigo-200">
                    Xoay bể 360 độ &amp; Góc nhìn ngang:
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-300 mt-0.5 leading-relaxed">
                    Bấm <b>Xoay bể</b> để ngắm nhìn bể kính từ mọi phía. Bấm <b>Góc Ngang</b> để ngắm sát mặt nước xem vật nổi nhô lên như thế nào!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Bé Đã Hiểu Rồi! ✨
              </button>
            </div>
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
        <ToddlerHandPreview
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

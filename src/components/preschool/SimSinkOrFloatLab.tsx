import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Search,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  Sparkles,
  Hand
} from 'lucide-react';
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
import { SaltWorkflow } from './sink-float/SaltWorkflow';

export interface Props {
  onBackToTable?: () => void;
  isStandalone?: boolean;
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
    densityNote: 'Khối lượng riêng D = 1.10 g/ml. Nước ngọt không nâng nổi quả trứng, nhưng nước muối đặc hơn sẽ nâng trứng NỔI BỒNG BỀNH!',
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

  // ThreeTankCanvas imperative ref
  const threeTankRef = useRef<ThreeTankCanvasHandle | null>(null);
  const pourTimeoutRef = useRef<number | null>(null);

  // Âm thanh & Giọng nói Cô Mimi
  const [soundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => speechEngine.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const voiceNotice = speechEngine.getVoiceStatusMessage();

  // Lời dẫn hướng dẫn của Cô Mimi (khoa học, thân thiện, không dùng nặng/nhẹ sai nghĩa)
  const [message, setMessage] = useState<string>(
    'Chào bé! Hãy chọn đồ vật ở khay bên dưới thả vào bể nước xem nước có nâng đỡ được vật không nhé!'
  );

  // 1. CHẾ ĐỘ TƯƠNG TÁC NGHIÊM NGẶT (STRICT MODES): 'interact' vs 'orbit'
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('interact');

  // 2. HÌNH DẠNG VÀ KÍCH THƯỚC BỂ NƯỚC (Bể nhỏ bằng 50% mỗi chiều)
  const [tankShape, setTankShape] = useState<TankShape>('rectangle');
  const [tankScale, setTankScale] = useState<TankScale>('normal');
  const [dimensions, setDimensions] = useState<TankDimensions>(() =>
    getTankDimensions('rectangle', 'normal')
  );

  useEffect(() => {
    const nextDims = getTankDimensions(tankShape, tankScale);
    setDimensions(nextDims);

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

  // 3. QUY TRÌNH HÒA TAN MUỐI VÀ KHỐI LƯỢNG RIÊNG NƯỚC LIÊN TỤC
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 đến 5 thìa
  const [activeStirProgress, setActiveStirProgress] = useState<number>(0); // 0 đến 100% của thìa hiện tại
  const [workflowStep, setWorkflowStep] = useState<SaltWorkflowStep>('idle');

  // Khối lượng riêng cập nhật LIÊN TỤC theo lượng muối tan
  const dissolvedFraction = saltSpoons + (workflowStep === 'stirring' ? activeStirProgress / 100 : 0);
  const waterDensity = 1.0 + dissolvedFraction * 0.035;

  // 4. DANH SÁCH ĐỒ VẬT VÀ LỨA TUỔI
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('3-4');

  // 5. VÒNG LẶP HỌC TẬP (LEARNING LOOP): DỰ ĐOÁN & QUAN SÁT (KHÔNG BẬT TRƯỚC SẼ CHÌM / SẼ NỔI)
  const [predictions, setPredictions] = useState<Record<string, ItemPrediction>>({});
  const [observations, setObservations] = useState<Record<string, ItemObserved>>({});
  const [eggFreshObserved, setEggFreshObserved] = useState<ItemObserved>('untested');
  const [eggSaltObserved, setEggSaltObserved] = useState<ItemObserved>('untested');

  // 6. THẢ VẬT BẰNG TAY (HAND THROWING): KÉO TỪ KHAY VÀ CHẠM CHỌN
  const [draggingTrayItem, setDraggingTrayItem] = useState<TankObject | null>(null);
  const [dragCursorPos, setDragCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedTrayItem, setSelectedTrayItem] = useState<TankObject | null>(null);

  const pointerVelocityRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const activeDragItemRef = useRef<TankObject | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const gestureAllowedRef = useRef(false);
  gestureAllowedRef.current = interactionMode === 'interact' && workflowStep === 'idle';

  // 7. HƯỚNG DẪN INLINE NGẮN GỌN (SHORT GUIDED ONBOARDING: 1. CHỌN -> 2. NÉM -> 3. QUAN SÁT)
  const [onboardingStep, setOnboardingStep] = useState<number>(1); // 1, 2, 3 hoặc 0 (đã xong)

  // 8. BẢNG QUAN SÁT TRANH ẢNH & TỔNG KẾT
  const [showObservationBoard, setShowObservationBoard] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showAdultPanel, setShowAdultPanel] = useState<boolean>(false);
  const [showXRay, setShowXRay] = useState<boolean>(false);

  // 9. CHẾ ĐỘ ĐUA THẢ 2 VẬT CÙNG LÚC
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
    if (hasUserInteracted && voiceEnabled && message) {
      speechEngine.speak(message);
    }
  }, [message, voiceEnabled, hasUserInteracted]);

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

  // CHUYỂN CHẾ ĐỘ NGHIÊM NGẶT: HỦY MỌI CỬ CHỈ ĐANG DỞ ĐỂ KHÔNG BỊ NÉM NHẦM
  const handleSwitchInteractionMode = (mode: InteractionMode) => {
    markUserInteracted();
    if (mode === interactionMode) return;
    threeTankRef.current?.cancelActiveGesture();
    dragCleanupRef.current?.();
    activeDragItemRef.current = null;
    setSelectedTrayItem(null);
    setDraggingTrayItem(null);
    isDraggingRef.current = false;
    setInteractionMode(mode);

    if (mode === 'orbit') {
      setMessage('Bé đang ở chế độ xoay bể 360 độ! Kéo chuột để ngắm nhìn bể nước từ mọi phía nhé.');
    } else {
      setMessage('Bé đang ở chế độ Cầm và Ném! Hãy chọn đồ vật ở khay để thả vào bể nước nhé.');
    }
  };

  // Về góc nhìn mặc định
  const handleResetDefaultView = () => {
    markUserInteracted();
    threeTankRef.current?.resetDefaultView();
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã đưa bể về góc nhìn chuẩn đẹp nhất!');
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
      prev.map((i) => ({
        ...i,
        inTank: false,
        x: 0,
        y: 0.45,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
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

  // LỜI DẪN KHOA HỌC CHUẨN XÁC KHI THẢ ĐỒ VẬT VÀO BỂ
  const announceItemDropScience = (item: TankObject) => {
    setMessage('Cùng quan sát '+ item.name.toLowerCase() +' nhé! Con thấy vật đi xuống hay ở trên mặt nước?');
  };

  // XỬ LÝ KHI ĐỒ VẬT ĐÃ LẮNG ĐỌNG XONG (SETTLED) TRONG NƯỚC
  const handleItemObserved = useCallback(
    (itemId: string, result: 'floating' | 'sunk') => {
      setObservations((prev) => ({ ...prev, [itemId]: result }));

      // Cập nhật quan sát trứng theo nước ngọt / nước muối
      if (itemId === 'item-egg') {
        if (waterDensity > 1.00001) {
          setEggSaltObserved(result);
        } else {
          setEggFreshObserved(result);
        }
      }

      // Hoàn thành onboarding bước 3 khi vật đầu tiên lắng đọng
      if (onboardingStep === 2 || onboardingStep === 3) {
        setOnboardingStep(0);
      }

      // Phản hồi khen ngợi bé theo dự đoán (luôn khích lệ óc tò mò, không có phạt sai)
      const pred = predictions[itemId];
      const item = items.find((i) => i.id === itemId);
      const itemName = item?.name || 'Đồ vật';

      if (!pred || pred === 'none') {
        setMessage(itemName + (result === 'floating' ? ' đang nổi trên mặt nước. Nước đang nâng đỡ vật!' : ' đã chìm xuống đáy. Mình thử một vật khác nhé!'));
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
    [predictions, items, waterDensity, onboardingStep]
  );

  // BẮT ĐẦU CẦM VÀ KÉO ĐỒ VẬT TỪ KHAY (HAND-BASED THROWING FROM TRAY)
  const handleTrayItemPointerDown = (e: React.PointerEvent, item: TankObject) => {
    e.preventDefault();
    markUserInteracted();
    if (item.inTank) return;
    if (workflowStep !== 'idle') {
      setMessage('Đang trong quy trình hòa tan muối, bé làm xong hẵng thả đồ vật nhé!');
      return;
    }
    if (interactionMode !== 'interact') {
      setMessage('Bé hãy chuyển sang chế độ "Cầm và ném" để thả đồ vật nhé!');
      return;
    }

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
            vx = (latest.x - oldest.x) / dt;
            vy = (latest.y - oldest.y) / dt;
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
        // Cử chỉ chạm / bấm ngắn: Chọn vật để chạm thả (tap-select then tap scene)
        setSelectedTrayItem((prev) => (prev?.id === item.id ? null : item));
        if (selectedTrayItem?.id !== item.id) {
          setMessage(`Bé đã cầm "${item.name}"! Giờ hãy chạm vào bể nước để ném đồ vật vào nhé!`);
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
      { vx: 0, vy: -1.2 }
    );
    announceItemDropScience(selectedTrayItem);
    setSelectedTrayItem(null);
    if (onboardingStep === 2) setOnboardingStep(3);
  };

  // Dìm vật đang nổi xuống đáy rồi thả ra để phóng vọt lên
  const handlePushDownItem = (item: TankObject) => {
    if (!gestureAllowedRef.current) return;
    markUserInteracted();
    if (!item.inTank) return;
    const itemDensity = item.weightGrams / item.volumeMl;
    if (itemDensity >= waterDensity) return;

    if (soundEnabled) soundEngine.playBubbleGlug();
    setMessage(`Bé vừa ấn dìm ${item.name} xuống đáy! Nước đẩy rất mạnh. Xem nó phóng vọt lên nhé!`);

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, y: 0.15 + item.size / 2, vy: 0, status: 'pushed', settled: false } : i
      )
    );

    scheduleAction(() => {
      if (soundEnabled) soundEngine.playBuoyantPop();
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, vy: 5.8, status: 'floating', settled: false } : i))
      );
      setMessage(`🚀 VÈOOO! Lực đẩy của nước phóng vọt ${item.name} lên mặt nước!`);
    }, 350);
  };

  // Hoàn thành tan 1 thìa muối
  const handleSpoonCompleted = useCallback(() => {
    threeTankRef.current?.clearSaltGrains();
    setSaltSpoons((prev) => {
      const next = Math.min(5, prev + 1);
      if (next >= 3) {
        setMessage(
          `🎉 HOAN HÔ! Muối đã tan hết (+${next} thìa)! Nước muối đậm đặc hơn và đã nâng quả trứng nổi bồng bềnh!`
        );
      } else {
        setMessage(`✨ Muối đã tan hoàn toàn (+${next} thìa)! Nước đang đậm đặc dần lên.`);
      }
      return next;
    });
    setActiveStirProgress(0);
  }, []);

  // Thay nước ngọt ban đầu & dọn sạch hạt muối
  const handleResetSalt = useCallback(() => {
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

  // Đổ muối vào miệng bể (kiểm tra chuẩn qua mặt phẳng y = height footprint)
  const handlePourSaltAtPoint = useCallback(
    (point: THREE.Vector3) => {
      if (workflowStep !== 'holdingSpoon') return;

      setWorkflowStep('pouring');
      if (soundEnabled) soundEngine.playSaltPour();
      threeTankRef.current?.spawnSaltGrains(40, point);

      if (pourTimeoutRef.current) clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = window.setTimeout(() => {
        setWorkflowStep('stirring');
        setActiveStirProgress(0);
        setMessage('Muối đang chìm dưới đáy bể! Bé hãy di chuột khuấy đũa vòng tròn trong nước để hòa tan muối nhé!');
      }, 450);
    },
    [workflowStep, soundEnabled]
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
      const aDensity = itemA.weightGrams / itemA.volumeMl;
      const bDensity = itemB.weightGrams / itemB.volumeMl;
      const aFloats = aDensity < waterDensity;
      const bFloats = bDensity < waterDensity;

      setMessage(
        `🏁 KẾT QUẢ: ${itemA.name} ${aFloats ? 'NỔI' : 'CHÌM'}, còn ${itemB.name} ${
          bFloats ? 'NỔI' : 'CHÌM'
        }! To hay nhỏ không quyết định, mà do chất liệu và túi khí bên trong vật!`
      );
    }, 2000);
  };

  // Danh sách đồ vật hiển thị theo lứa tuổi (3-4 tuổi: 4 món quen thuộc; 5-6 tuổi: cả 10 món)
  const displayItems =
    ageGroup === '3-4' ? items.filter((i) => AGE_3_4_ITEM_IDS.includes(i.id)) : items;

  // Số lượng vật đã quan sát
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
      {/* ======================================================== */}
      {/* 1. COMPACT TOP ROUTE & MASCOT BAR (CÔ MIMI HƯỚNG DẪN)    */}
      {/* ======================================================== */}
      <header className="flex-shrink-0 w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-200/80 dark:border-slate-800 z-30">
        {/* Nút quay lại bàn thí nghiệm (nếu có) */}
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

      </header>

      {/* ======================================================== */}
      {/* 2. CHÍNH: 2 CỘT (TRÁI: BỂ 3D 75-80% | PHẢI: BẢNG ~240px) */}
      {/* ======================================================== */}
      <div className="flex-1 min-h-0 flex flex-row items-stretch p-2 gap-2 overflow-hidden">
        {/* CỘT TRÁI: KHU VỰC CHƠI CHÍNH (75-80%) */}
        <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden space-y-1.5">
          {/* KHỐI 3D THREE.JS CANVAS VÀ PLAY SCENE */}
          <div
            ref={playSceneRef}
            onClick={handleSceneClickToRelease}
            className="flex-1 min-h-0 relative rounded-3xl overflow-hidden border-2 border-sky-300/80 shadow-inner flex flex-col bg-sky-50"
          >
            {/* Banner hướng dẫn khi đang cầm vật để chạm thả */}
            {selectedTrayItem && (
              <div className="absolute top-2 inset-x-4 z-30 flex items-center justify-between px-3 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg animate-bounce">
                <span className="flex items-center gap-1.5">
                  <span>👉</span>
                  <span>Bé đang cầm {selectedTrayItem.name}: Chạm vào bể nước để ném vào!</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrayItem(null);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px]"
                >
                  Hủy ✕
                </button>
              </div>
            )}

            {/* Hướng dẫn Onboarding ngắn gọn (1. Chọn -> 2. Ném -> 3. Quan sát) */}
            {onboardingStep > 0 && !selectedTrayItem && (
              <div className="absolute top-2 left-2 z-20 flex items-center gap-2 px-3 py-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-400 shadow-md">
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
            <ThreeTankCanvas
              ref={threeTankRef}
              shape={tankShape}
              scale={tankScale}
              dims={dimensions}
              items={items}
              onUpdateItems={setItems}
              waterDensity={waterDensity}
              interactionMode={interactionMode}
              onInteractionModeChange={setInteractionMode}
              holdingItemId={holdingItemId}
              onHoldItem={setHoldingItemId}
              workflowStep={workflowStep}
              onPourSaltAtPoint={handlePourSaltAtPoint}
              soundEnabled={soundEnabled}
              onMessageUpdate={setMessage}
              showXRay={showXRay}
              onItemObserved={handleItemObserved}
            />

            {/* Nút dìm các vật đang nổi trong bể */}
            {items.some((i) => i.inTank && i.status === 'floating') && (
              <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center gap-1.5 flex-wrap pointer-events-auto">
                <span className="text-[10px] font-bold text-white bg-slate-900/70 px-2 py-1 rounded-lg backdrop-blur-xs">
                  👇 Thử dìm vật:
                </span>
                {items
                  .filter((i) => i.inTank && i.status === 'floating')
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePushDownItem(item);
                      }}
                      className="px-2 py-1 rounded-xl bg-sky-500/90 hover:bg-sky-600 text-white text-[11px] font-bold shadow-md transition flex items-center gap-1 backdrop-blur-xs"
                      title={`Ấn dìm ${item.name} xuống đáy xem bắn vọt lên!`}
                    >
                      <span>{item.icon}</span>
                      <span>Dìm {item.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 3. KHAY ĐỒ CHƠI MẪU NẰM NGANG Ở ĐÁY KHÔNG LÀM CUỘN TRANG */}
          {/* ======================================================== */}
          <div className="flex-shrink-0 w-full p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-300 dark:border-amber-700 shadow-md flex flex-col space-y-1.5">
            <div className="flex items-center justify-between px-1 flex-wrap gap-1">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Khay Đồ Vật (Bé chạm hoặc kéo ném vào bể):</span>
              </span>

              <div className="flex items-center gap-1.5">
                {/* Mở bảng quan sát */}
                <button
                  onClick={() => setShowObservationBoard(true)}
                  className="px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[11px] font-black flex items-center gap-1 transition"
                >
                  <span>📋</span>
                  <span>Bảng Quan Sát ({observedCount})</span>
                </button>
              </div>
            </div>

            {/* Dãy cuộn ngang các món đồ (không cuộn trang web) */}
            <div className="w-full flex items-stretch gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin">
              {displayItems.map((item) => {
                const isObserved = observations[item.id] !== undefined;
                const obsResult = observations[item.id];
                const pred = predictions[item.id];
                const isSelected = selectedTrayItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onPointerDown={(e) => handleTrayItemPointerDown(e, item)}
                    className={`flex-shrink-0 w-24 p-2 rounded-2xl border-2 flex flex-col items-center justify-between transition-all select-none ${
                      item.inTank
                        ? 'opacity-35 bg-slate-100 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-200 dark:bg-amber-950/80 border-amber-500 scale-105 shadow-md cursor-grab'
                        : 'bg-white dark:bg-slate-800 border-amber-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-md cursor-grab active:cursor-grabbing hover:-translate-y-0.5'
                    }`}
                    style={{ minHeight: '104px' }}
                    title={`Chạm hoặc kéo "${item.name}" thả vào bể nước`}
                  >
                    {/* Hình ảnh đồ vật */}
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain filter drop-shadow pointer-events-none"
                        draggable={false}
                      />
                    </div>

                    {/* Tên đồ vật */}
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full text-center mt-1">
                      {item.name}
                    </span>

                    {/* VÒNG LẶP HỌC TẬP: TUYỆT ĐỐI KHÔNG BẬT "SẼ CHÌM / SẼ NỔI" TRƯỚC! */}
                    {isObserved ? (
                      <div
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-2xs ${
                          obsResult === 'floating'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-300'
                        }`}
                      >
                        {obsResult === 'floating' ? 'Đã thấy: Nổi 🫧' : 'Đã thấy: Chìm ⚓'}
                      </div>
                    ) : (
                      /* Chưa quan sát: Nút dự đoán thân thiện [Chìm ⚓ / Nổi 🫧 / Thử ❓] */
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPredictions((prev) => ({ ...prev, [item.id]: 'sink' }));
                            if (soundEnabled) soundEngine.playSpoonClink();
                          }}
                          className={`p-1 rounded-lg text-[9px] font-extrabold transition ${
                            pred === 'sink'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Bé đoán vật này sẽ chìm"
                        >
                          ⚓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPredictions((prev) => ({ ...prev, [item.id]: 'float' }));
                            if (soundEnabled) soundEngine.playSpoonClink();
                          }}
                          className={`p-1 rounded-lg text-[9px] font-extrabold transition ${
                            pred === 'float'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Bé đoán vật này sẽ nổi"
                        >
                          🫧
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPredictions((prev) => ({ ...prev, [item.id]: 'curious' }));
                            if (soundEnabled) soundEngine.playSpoonClink();
                          }}
                          className={`p-1 rounded-lg text-[9px] font-extrabold transition ${
                            pred === 'curious'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Bé muốn tự thử xem sao"
                        >
                          ❓
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ======================================================== */}
        {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN HỢP NHẤT (~240px - 260px)       */}
        {/* ======================================================== */}
        <aside className="w-[148px] sm:w-[220px] lg:w-[248px] flex-shrink-0 flex flex-col h-full overflow-y-auto space-y-2.5 p-1">
          {/* THANH CHỌN CHẾ ĐỘ NGHIÊM NGẶT (STRICT MODES) & ĐIỀU KHIỂN NHANH */}
          <div className="flex-shrink-0 flex flex-col gap-2 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200 dark:border-slate-800 shadow-xs flex-wrap z-20">
            {/* Chế độ tương tác */}
            <div className="flex flex-col w-full gap-2">
              <button
                disabled={workflowStep !== 'idle'}
                onClick={() => handleSwitchInteractionMode('interact')}
                className={`w-full min-h-12 px-3 py-3 rounded-xl text-sm font-black flex items-center gap-1.5 transition ${
                  interactionMode === 'interact'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="Cầm và ném đồ vật vào bể (không xoay bể)"
              >
                <Hand className="w-4 h-4" />
                <span>Cầm và ném</span>
              </button>

              <button
                disabled={workflowStep !== 'idle'}
                onClick={() => handleSwitchInteractionMode('orbit')}
                className={`w-full min-h-12 px-3 py-3 rounded-xl text-sm font-black flex items-center gap-1.5 transition ${
                  interactionMode === 'orbit'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="Xoay ngắm nhìn bể 360 độ (không nhặt đồ vật)"
              >
                <Compass className="w-4 h-4" />
                <span>Xoay bể</span>
              </button>
            </div>

            {/* Thao tác bể */}
            <div className="flex flex-col w-full gap-2">
              <button
                onClick={handleResetDefaultView}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition"
                title="Đưa bể về góc nhìn mặc định chuẩn đẹp nhất"
              >
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Góc Chuẩn</span>
              </button>

              <button
                onClick={handleResetAllTank}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 transition"
                title="Vớt sạch đồ vật trong bể về khay"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Dọn Bể</span>
              </button>
            </div>
          </div>


        {/* Mascot Voice Controls & Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleReplayVoice}
            className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
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
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
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
            className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
            title="Hướng dẫn thí nghiệm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Hướng Dẫn</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
          {/* 1. HŨ MUỐI THẦN KỲ LỚN (MỞ NẮP CẠNH BỂ) */}
          <SaltWorkflow
            disabled={interactionMode === 'orbit'}
            saltSpoons={saltSpoons}
            activeStirProgress={activeStirProgress}
            currentDensity={waterDensity}
            workflowStep={workflowStep}
            onStepChange={(step) => { if (interactionMode === 'interact') { setSelectedTrayItem(null); setWorkflowStep(step); } }}
            onStirProgressUpdate={setActiveStirProgress}
            onSpoonCompleted={handleSpoonCompleted}
            onResetSalt={handleResetSalt}
            checkPointInWater={(x, y) => threeTankRef.current?.checkPointInWater(x, y) ?? false}
            soundEnabled={soundEnabled}
            onMessageUpdate={setMessage}
          />

          {/* 3. BẢNG MỞ RỘNG DÀNH CHO NGƯỜI LỚN / GIÁO VIÊN MẦM NON */}
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
              <div className="p-2.5 pt-0 space-y-3 text-xs border-t border-slate-100 dark:border-slate-800">
                {/* Đổi lứa tuổi nhanh */}
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


          {/* 2. CÁC TÍNH NĂNG VUI NHỘN: ĐUA THẢ 2 VẬT & SOI KHÍ */}
          <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>🏁</span>
                <span>Đua Thả 2 Vật:</span>
              </span>
              <button
                onClick={() => setRaceModeActive(!raceModeActive)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                  raceModeActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {raceModeActive ? 'Đang mở' : 'Mở đua'}
              </button>
            </div>

            {raceModeActive && (
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-1">
                  <select
                    value={raceSlotA}
                    onChange={(e) => setRaceSlotA(e.target.value)}
                    className="flex-1 text-[11px] p-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.icon} {i.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] font-extrabold text-amber-500">VS</span>
                  <select
                    value={raceSlotB}
                    onChange={(e) => setRaceSlotB(e.target.value)}
                    className="flex-1 text-[11px] p-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
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

            {/* Kính lúp soi túi khí ruột xốp */}
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-purple-500" />
                <span>Kính soi túi khí:</span>
              </span>
              <button
                onClick={() => setShowXRay(!showXRay)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                  showXRay
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {showXRay ? 'Đang bật' : 'Bật'}
              </button>
            </div>
          </div>


                {voiceNotice && <p className="text-xs text-amber-800">{voiceNotice}</p>}
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
                  <p className="text-[9px] text-slate-500 leading-tight">
                    * Bể nhỏ bằng 50% mỗi chiều, thể tích nước bằng 1/8 bể to. Đồ vật giữ nguyên kích thước.
                  </p>
                </div>

                {/* Số liệu vật lý & Khối lượng riêng */}
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 space-y-1">
                  <span className="text-[10px] font-black text-sky-900 dark:text-sky-200 block">
                    Thông số khối lượng riêng (D):
                  </span>
                  <div className="text-[9px] font-mono space-y-0.5 text-slate-700 dark:text-slate-300">
                    <div>• Nước ngọt: 1.000 g/ml</div>
                    <div>• Nước hiện tại: {waterDensity.toFixed(3)} g/ml</div>
                    <div>• Quả trứng: 1.100 g/ml (nổi khi D &gt; 1.1)</div>
                    <div>• Quả táo: 0.830 g/ml</div>
                    <div>• Hòn sỏi: 2.500 g/ml</div>
                  </div>
                </div>

                {/* Hướng dẫn sư phạm */}
                <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    💡 Hướng dẫn gợi mở cho trẻ:
                  </div>
                  <p>
                    Tránh giải thích đơn giản "nặng thì chìm, nhẹ thì nổi". Hãy hướng dẫn trẻ quan sát: nước nâng đỡ đồ vật; vật có ruột rỗng hoặc xốp chứa khí sẽ nổi; nước muối đặc hơn nên nâng quả trứng lên tốt hơn!
                  </p>
                  <p className="text-[9px] text-slate-500 italic">
                    * Lưu ý: Lượng thìa muối ngoài đời thực tùy thuộc vào lượng nước trong cốc hay chậu của lớp học.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL: BẢNG QUAN SÁT TRANH ẢNH & TỔNG KẾT KHÁM PHÁ     */}
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
                  Bí Mật Quả Trứng Thần Kỳ:
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">Trong Nước Ngọt Ban Đầu:</span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-300">{eggFreshObserved !== 'untested' ? (eggFreshObserved === 'sunk' ? '⚓ Đã chìm' : '🫧 Đã nổi') : 'Chưa quan sát'}</span>
                  <span className="text-[9px] text-slate-500">Nước ngọt chưa nâng được quả trứng này</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 flex flex-col items-center text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-600">Khi Hòa Tan Thêm Muối:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{eggSaltObserved !== 'untested' ? (eggSaltObserved === 'floating' ? '🫧 Đã nổi' : '⚓ Đã chìm') : 'Hãy thử thêm muối'}</span>
                  <span className="text-[9px] text-slate-500">Nước muối đặc hơn nâng trứng lên</span>
                </div>
              </div>
            </div>

            {/* 2 cột đồ vật đã quan sát: Chìm vs Nổi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cột các vật đã chìm */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                  <span>⚓</span>
                  <span>Các vật chìm xuống đáy cát:</span>
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
                      Bé chưa thả vật nào bị chìm
                    </p>
                  )}
                </div>
              </div>

              {/* Cột các vật đã nổi */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 dark:text-emerald-200">
                  <span>🫧</span>
                  <span>Các vật nổi bồng bềnh:</span>
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
                      Bé chưa thả vật nào nổi
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Phần "Khám phá xong: Điều gì thay đổi?" */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
              <div className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1">
                <span>🤔</span>
                <span>Điều gì đã thay đổi khi cô và bé cho thêm muối vào nước?</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {eggSaltObserved === 'floating' ? 'Nước muối đã nâng quả trứng nổi lên. Con thấy trứng khác lúc trong nước ngọt thế nào?' : 'Con đã thấy vật nào chìm, vật nào nổi? Mình có thể thử thêm muối để tiếp tục khám phá.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowObservationBoard(false);
                  handleResetAllTank();
                  handleResetSalt();
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
      {/* 5. MODAL HƯỚNG DẪN THÍ NGHIỆM                            */}
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
                    Bé chạm hoặc kéo các món đồ dưới khay (sỏi, trứng, vịt cao su, táo...) ném vào bể để xem vật chìm hay nổi.
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
                    Bấm <b>Cầm Thìa Xúc Muối</b> ở hũ muối bên phải, đổ vào bể rồi khuấy đũa trong nước. Khi đủ mặn, quả trứng sẽ kỳ diệu nổi lên!
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-2.5">
                <span className="text-xl">3️⃣</span>
                <div>
                  <h4 className="font-black text-indigo-900 dark:text-indigo-200">
                    Xoay bể 360 độ:
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-300 mt-0.5 leading-relaxed">
                    Bấm <b>Xoay bể</b> để ngắm nhìn bể kính từ mọi phía. Bấm <b>Góc Chuẩn</b> để quay lại góc nhìn ban đầu.
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
      {/* 6. CON TRỎ BÀN TAY BÉ CẦM ĐỒ VẬT KHI KÉO TỪ KHAY          */}
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

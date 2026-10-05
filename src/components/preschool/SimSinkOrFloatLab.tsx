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
  Box,
  Layers,
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
  InteractionMode
} from './sink-float/types';
import { getTankDimensions, clampToTankBoundary } from './sink-float/tankGeometry';
import { ThreeTankCanvas, ThreeTankCanvasHandle } from './sink-float/ThreeTankCanvas';
import { SaltWorkflow } from './sink-float/SaltWorkflow';

export interface Props {
  onBackToTable?: () => void;
  isStandalone?: boolean;
}

// Danh sách 10 món đồ chơi mẫu phong phú cho trẻ mầm non
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
    densityNote: 'Đặc ruột và nặng hơn nước (D = 2.5 g/ml) nên chìm nghỉm ngay lập tức xuống đáy cát',
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
    status: 'basket'
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
    status: 'basket'
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
    status: 'basket'
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
    densityNote: 'Khối lượng riêng D = 1.10 g/ml. Trong nước ngọt sẽ chìm, nhưng sẽ NỔI BỒNG BỀNH khi nước đủ muối!',
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
    status: 'basket'
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
    densityNote: 'Ruột táo chứa khoảng 25% là các túi khí li ti (D = 0.83 g/ml) nên nổi bồng bềnh',
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
    status: 'basket'
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
    densityNote: 'Nhẹ hơn nước (D = 0.62 g/ml), nổi vững vàng và chìm khoảng một nửa thân',
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
    status: 'basket'
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
    densityNote: 'Bên trong chứa đầy không khí (D = 0.22 g/ml); khi dìm xuống sẽ bắn vọt lên như tên lửa!',
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
    status: 'basket'
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
    densityNote: 'Siêu nhẹ (D = 0.075 g/ml), nổi nhô hẳn lên trên mặt nước và dập dềnh êm dịu',
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
    status: 'basket'
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
    status: 'basket'
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
    status: 'basket'
  }
];

export const SimSinkOrFloatLab: React.FC<Props> = ({ isStandalone = false }) => {
  // Toàn màn hình & Container
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ThreeTankCanvas imperative ref
  const threeTankRef = useRef<ThreeTankCanvasHandle | null>(null);
  const pourTimeoutRef = useRef<number | null>(null);

  // Âm thanh & Giọng nói Cô Mimi
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => speechEngine.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Lời nhắn của giáo viên / mascot
  const [message, setMessage] = useState<string>(
    'Chào bé! Hãy chọn đồ vật ở khay bên dưới thả vào bể nước xem chìm hay nổi nhé!'
  );

  // Hướng dẫn mầm non
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // 1. HÌNH DẠNG VÀ KÍCH THƯỚC BỂ
  const [tankShape, setTankShape] = useState<TankShape>('rectangle');
  const [tankScale, setTankScale] = useState<TankScale>('normal');
  const [showShapeMenu, setShowShapeMenu] = useState<boolean>(false);

  // Kích thước thế giới thực tế
  const [dimensions, setDimensions] = useState<TankDimensions>(() =>
    getTankDimensions('rectangle', 'normal')
  );

  // Cập nhật dimensions khi đổi shape hoặc scale (Đồ vật giữ nguyên kích thước thế giới)
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

  // 2. CHẾ ĐỘ TƯƠNG TÁC: XOAY 360° HOẶC KÉO/THẢ VẬT
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('interact');

  // 3. QUY TRÌNH HÒA TAN MUỐI VÀ KHỐI LƯỢNG RIÊNG LIÊN TỤC
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 đến 5 thìa
  const [activeStirProgress, setActiveStirProgress] = useState<number>(0); // 0 đến 100% của thìa hiện tại
  const [workflowStep, setWorkflowStep] = useState<SaltWorkflowStep>('idle');

  // Khối lượng riêng cập nhật LIÊN TỤC theo phần muối đã tan (không cần chờ 100%)
  const dissolvedFraction = saltSpoons + (workflowStep === 'stirring' ? activeStirProgress / 100 : 0);
  const waterDensity = 1.0 + dissolvedFraction * 0.035;

  // 4. DANH SÁCH ĐỒ VẬT VÀ TRẠNG THÁI
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [isToyTrayCollapsed, setIsToyTrayCollapsed] = useState<boolean>(false);
  const [showXRay, setShowXRay] = useState<boolean>(false);

  // 5. CHẾ ĐỘ ĐUA THẢ 2 VẬT CÙNG LÚC
  const [raceModeActive, setRaceModeActive] = useState<boolean>(false);
  const [raceSlotA, setRaceSlotA] = useState<string>('item-pebble');
  const [raceSlotB, setRaceSlotB] = useState<string>('item-duck');
  const [raceRunning, setRaceRunning] = useState<boolean>(false);
  const actionTimersRef = useRef(new Set<number>());
  const scheduleAction = (action: () => void, delay: number) => {
    const timer = window.setTimeout(() => { actionTimersRef.current.delete(timer); action(); }, delay);
    actionTimersRef.current.add(timer);
  };

  // Hủy timeout khi unmount
  useEffect(() => {
    return () => {
      actionTimersRef.current.forEach(clearTimeout);
      actionTimersRef.current.clear();
      if (pourTimeoutRef.current) {
        clearTimeout(pourTimeoutRef.current);
        pourTimeoutRef.current = null;
      }
    };
  }, []);

  // Đăng ký giọng nói
  useEffect(() => {
    const unsub = speechEngine.subscribeSpeakingState(setIsSpeaking);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (voiceEnabled && message) {
      speechEngine.speak(message);
    }
  }, [message, voiceEnabled]);

  const handleToggleVoice = () => {
    const next = speechEngine.toggleVoice();
    setVoiceEnabled(next);
  };

  const handleReplayVoice = () => {
    speechEngine.speak(message);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Dọn bể: vớt tất cả đồ vật trả về khay & dọn sạch hạt muối
  const handleResetAllTank = () => {
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
    threeTankRef.current?.clearSaltGrains();
    if (soundEnabled) soundEngine.playNetScoop();
    setMessage('Đã vớt sạch đồ vật trong bể! Khay đồ chơi đã sẵn sàng để bé thử lại.');
  };

  // Thả nhanh 1 vật từ khay vào bể nước từ độ cao trên không
  const handleDropItemFromTray = (item: TankObject) => {
    if (item.inTank) return;

    const { width: W, height: H } = dimensions;
    const dropX = (Math.random() - 0.5) * (W * 0.45);
    const dropZ = (Math.random() - 0.5) * (W * 0.3);
    const dropY = H + 1.2;

    const itemDensity = item.weightGrams / item.volumeMl;
    const willFloat = itemDensity < waterDensity;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inTank: true,
              x: dropX,
              y: dropY,
              z: dropZ,
              vx: (Math.random() - 0.5) * 0.4,
              vy: -0.5,
              vz: (Math.random() - 0.5) * 0.4,
              settled: false,
              status: 'falling'
            }
          : i
      )
    );

    if (item.id === 'item-egg') {
      if (willFloat) {
        setMessage('Kỳ diệu quá! Nước muối đủ mặn nên quả trứng NỔI BỒNG BỀNH trên mặt nước!');
      } else {
        setMessage('Quả trứng chìm xuống đáy vì nặng hơn nước! Bé hãy xúc 3 thìa muối quấy tan xem nhé.');
      }
    } else if (willFloat) {
      setMessage(`Bé thả ${item.name}: Vật này nhẹ hơn nước nên nổi bồng bềnh!`);
    } else {
      setMessage(`Bé thả ${item.name}: Vật này nặng hơn nước nên chìm nghỉm xuống đáy!`);
    }
  };

  // Dìm vật đang nổi xuống đáy rồi thả ra để phóng vọt lên
  const handlePushDownItem = (item: TankObject) => {
    if (!item.inTank) return;
    const itemDensity = item.weightGrams / item.volumeMl;
    if (itemDensity >= waterDensity) return;

    if (soundEnabled) soundEngine.playBubbleGlug();
    setMessage(`Bé vừa ấn dìm ${item.name} xuống đáy! Lực đẩy nước giằng rất mạnh. Xem nó phóng vọt lên nhé!`);

    // Đặt trạng thái pushed tại đáy
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, y: 0.15 + item.size / 2, vy: 0, status: 'pushed', settled: false } : i
      )
    );

    // Tự động phóng vọt lên sau 350ms
    scheduleAction(() => {
      if (soundEnabled) soundEngine.playBuoyantPop();
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, vy: 5.8, status: 'floating', settled: false } : i))
      );
      setMessage(`🚀 VÈOOO! ${item.name} phóng vọt từ đáy lên mặt nước thật kỳ diệu!`);
    }, 350);
  };

  // Hoàn thành tan 1 thìa muối
  const handleSpoonCompleted = useCallback(() => {
    setSaltSpoons((prev) => {
      const next = Math.min(5, prev + 1);
      if (next >= 3) {
        setMessage(
          `🎉 HOAN HÔ! Muối đã tan hết (+${next} thìa)! Nước đã đủ đậm đặc để quả trứng nổi bồng bềnh!`
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
    if (pourTimeoutRef.current) {
      clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = null;
    }
    setSaltSpoons(0);
    setActiveStirProgress(0);
    setWorkflowStep('idle');
    threeTankRef.current?.clearSaltGrains();
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay nước mới tinh khiết! Nước trở lại bình thường và trong vắt.');
  }, [soundEnabled]);

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
        setMessage('Muối đang chìm dưới đáy bể! Bé hãy di chuột quấy đũa vòng tròn trong nước để hòa tan muối nhé!');
      }, 450);
    },
    [workflowStep, soundEnabled]
  );

  // Bắt đầu đua thả 2 vật
  const handleStartRace = () => {
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
        }! To hay nhỏ không quyết định, mà do chất liệu bên trong!`
      );
    }, 2000);
  };

  return (
    <div
      ref={containerRef}
      className={`select-none transition-all duration-300 w-full flex flex-col font-sans ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-2 sm:p-4 flex flex-col justify-between overflow-y-auto'
          : 'relative space-y-3'
      }`}
    >
      {/* 1. TOP FRIENDLY MASCOT BAR (Cô Mimi hướng dẫn mầm non) */}
      <div className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200/90 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl flex-shrink-0 shadow-md animate-bounce">
            👩‍🏫
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                Cô Mimi Hướng Dẫn:
              </span>
              {isStandalone && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                  Bản HTML Độc Lập
                </span>
              )}
              {workflowStep === 'stirring' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-bounce">
                  🥄 Quấy Đũa Hòa Tan Muối ({Math.round(activeStirProgress)}%)
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono font-bold">
                Nước: {waterDensity.toFixed(3)} g/ml
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {message}
            </p>
          </div>
        </div>

        {/* Mascot Voice Controls & Guide Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleReplayVoice}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isSpeaking
                ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
            }`}
            title="Nghe lại lời Cô Mimi"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Nghe Lại</span>
          </button>

          <button
            onClick={handleToggleVoice}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={voiceEnabled ? 'Tắt giọng nói' : 'Bật giọng nói'}
          >
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition"
            title="Xem hướng dẫn thí nghiệm"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hướng Dẫn</span>
          </button>
        </div>
      </div>

      {/* 2. KHU VỰC THÍ NGHIỆM CHÍNH: BỂ KÍNH 3D VÀ HŨ MUỐI MỞ CẠNH BỂ */}
      <div className="w-full flex flex-col lg:flex-row items-stretch gap-3">
        {/* KHỐI BỂ KÍNH 3D THREE.JS */}
        <div className="flex-1 flex flex-col space-y-2 relative min-w-0">
          {/* Thanh công cụ phụ ngay trên bể */}
          <div className="w-full flex items-center justify-between gap-2 z-20 flex-wrap">
            {/* Chế độ tương tác: Xoay 360° vs Kéo/Thả đồ vật */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md">
              <button
                onClick={() => setInteractionMode('interact')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  interactionMode === 'interact'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="Chế độ cầm kéo và thả đồ vật"
              >
                <Hand className="w-4 h-4" />
                <span>Kéo/Thả Vật</span>
              </button>

              <button
                onClick={() => setInteractionMode('orbit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  interactionMode === 'orbit'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="Chế độ xoay quan sát bể 360 độ"
              >
                <Compass className="w-4 h-4" />
                <span>Xoay Bể 360°</span>
              </button>

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              <button
                onClick={handleResetAllTank}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition"
                title="Dọn sạch đồ vật về khay"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                <span>Dọn Bể</span>
              </button>
            </div>

            {/* Menu Chọn Hình Dạng & Kích Thước Bể */}
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setShowShapeMenu(!showShapeMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-xs font-black text-slate-800 dark:text-white hover:bg-slate-100 transition"
              >
                <Box className="w-4 h-4 text-emerald-500" />
                <span>
                  Bể:{' '}
                  {tankShape === 'rectangle'
                    ? 'Chữ Nhật'
                    : tankShape === 'square'
                    ? 'Lập Phương'
                    : tankShape === 'cylinder'
                    ? 'Trụ Tròn'
                    : 'Tam Giác'}{' '}
                  ({tankScale === 'compact' ? 'Nhỏ 50%' : 'To 100%'})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Shape Menu Popup */}
              {showShapeMenu && (
                <div className="absolute right-0 top-11 z-40 p-3 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-400 shadow-2xl space-y-3 w-64 animate-fadeIn">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Chọn Hình Dạng Bể:</span>
                    </span>
                    <button
                      onClick={() => setShowShapeMenu(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setTankShape('rectangle');
                        setShowShapeMenu(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                        tankShape === 'rectangle'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">▬</span>
                      <span>Chữ Nhật</span>
                    </button>
                    <button
                      onClick={() => {
                        setTankShape('square');
                        setShowShapeMenu(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                        tankShape === 'square'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">◼</span>
                      <span>Lập Phương</span>
                    </button>
                    <button
                      onClick={() => {
                        setTankShape('cylinder');
                        setShowShapeMenu(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                        tankShape === 'cylinder'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">⚪</span>
                      <span>Trụ Tròn</span>
                    </button>
                    <button
                      onClick={() => {
                        setTankShape('triangle');
                        setShowShapeMenu(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                        tankShape === 'triangle'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">▲</span>
                      <span>Tam Giác</span>
                    </button>
                  </div>

                  <div className="border-t pt-2 space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Kích Thước Bể:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setTankScale('normal');
                          setShowShapeMenu(false);
                        }}
                        className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                          tankScale === 'normal'
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        To (100%)
                      </button>
                      <button
                        onClick={() => {
                          setTankScale('compact');
                          setShowShapeMenu(false);
                        }}
                        className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                          tankScale === 'compact'
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        Nhỏ (50%)
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Bể nhỏ bằng 50% mỗi chiều, chứa được 1/8 lượng nước so với bể to.
                    </p>
                  </div>
                </div>
              )}

              {/* Các nút công cụ phụ: Đua thả, Soi khí, Toàn màn hình */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRaceModeActive(!raceModeActive)}
                  className={`p-2 rounded-xl text-xs font-bold transition ${
                    raceModeActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                  title="Đua thả 2 vật cùng lúc từ trên cao"
                >
                  <span>🏁</span>
                </button>

                <button
                  onClick={() => setShowXRay(!showXRay)}
                  className={`p-2 rounded-xl text-xs font-bold transition ${
                    showXRay
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                  title="Kính lúp soi túi khí bên trong vật"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                >
                  <span className="text-xs">{soundEnabled ? '🔊' : '🔇'}</span>
                </button>

                <button
                  onClick={handleToggleFullscreen}
                  className="p-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* ĐUA THẢ OVERLAY BAR */}
          {raceModeActive && (
            <div className="w-full p-2 rounded-2xl bg-amber-50 dark:bg-slate-900 border-2 border-amber-400 shadow-md flex items-center justify-between gap-2 flex-wrap z-10">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                <span>🏁 Đua Thả 2 Vật Cùng Lúc:</span>
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={raceSlotA}
                  onChange={(e) => setRaceSlotA(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-800 font-bold border border-amber-300"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.icon} {i.name}
                    </option>
                  ))}
                </select>
                <span className="font-extrabold text-amber-500 text-xs">VS</span>
                <select
                  value={raceSlotB}
                  onChange={(e) => setRaceSlotB(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-800 font-bold border border-amber-300"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.icon} {i.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStartRace}
                  disabled={raceRunning}
                  className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-xs transition"
                >
                  {raceRunning ? 'Đang thả...' : 'Bắt Đầu Thả!'}
                </button>
              </div>
            </div>
          )}

          {/* CANVAS 3D THREE.JS RENDERER */}
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
          />

          {/* Nút hành động dìm đồ vật đang nổi */}
          {items.some((i) => i.inTank && i.status === 'floating') && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                👇 Thử dìm vật đang nổi:
              </span>
              {items
                .filter((i) => i.inTank && i.status === 'floating')
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePushDownItem(item)}
                    className="px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
                    title={`Ấn dìm ${item.name} xuống đáy để xem nó bắn vọt lên!`}
                  >
                    <span>{item.icon}</span>
                    <span>Dìm {item.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* KHỐI HŨ MUỐI LỚN MỞ NẮP ĐẶT CẠNH BỂ (CÙNG NHÌN THẤY CẢ BỂ VÀ HŨ) */}
        <SaltWorkflow
          saltSpoons={saltSpoons}
          activeStirProgress={activeStirProgress}
          currentDensity={waterDensity}
          workflowStep={workflowStep}
          onStepChange={setWorkflowStep}
          onStirProgressUpdate={setActiveStirProgress}
          onSpoonCompleted={handleSpoonCompleted}
          onResetSalt={handleResetSalt}
          checkPointInWater={(x, y) => threeTankRef.current?.checkPointInWater(x, y) ?? false}
          soundEnabled={soundEnabled}
          onMessageUpdate={setMessage}
        />
      </div>

      {/* 3. KHAY ĐỒ CHƠI MẪU (10 MÓN) CÓ HIỂN THỊ DỰ ĐOÁN CHÌM/NỔI THEO NƯỚC HIỆN TẠI */}
      <div className="w-full max-w-5xl mx-auto px-1 flex flex-col items-center">
        {isToyTrayCollapsed ? (
          <button
            onClick={() => setIsToyTrayCollapsed(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl border-2 border-white transition transform hover:scale-105"
          >
            <span>🧺</span>
            <span>Mở Khay Đồ Chơi (10 Món)</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full p-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-300 dark:border-amber-700 shadow-xl space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Khay Đồ Chơi: Bấm hoặc kéo đồ vật để thả vào bể nước</span>
              </span>
              <button
                onClick={() => setIsToyTrayCollapsed(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded-lg hover:bg-slate-100 transition"
              >
                <span>Thu nhỏ</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 overflow-x-auto py-1 px-1">
              {items.map((item) => {
                const itemDensity = item.weightGrams / item.volumeMl;
                const willFloatNow = itemDensity < waterDensity;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleDropItemFromTray(item)}
                    disabled={item.inTank}
                    className={`relative flex flex-col items-center justify-between p-2 rounded-2xl border transition-all duration-200 ${
                      item.inTank
                        ? 'opacity-40 bg-slate-100 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-b from-white to-amber-50 dark:from-slate-800 dark:to-slate-850 hover:to-amber-100 border-amber-200 dark:border-slate-700 hover:border-amber-400 shadow-xs hover:shadow-md hover:-translate-y-1 cursor-pointer'
                    }`}
                    style={{ minHeight: '100px' }}
                    title={`Bấm để thả "${item.name}" vào bể`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain filter drop-shadow select-none pointer-events-none"
                        draggable={false}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate max-w-full text-center">
                      {item.name}
                    </span>

                    <div
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-2xs ${
                        willFloatNow
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {willFloatNow ? 'Sẽ Nổi 🫧' : 'Sẽ Chìm ⚓'}
                    </div>

                    {item.inTank && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. MODAL HƯỚNG DẪN DÀNH CHO GIÁO VIÊN VÀ BÉ MẦM NON */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-4 border-amber-300 dark:border-amber-600 shadow-2xl p-5 space-y-4 relative">
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
                  Dành cho bé từ 3 - 6 tuổi &amp; Giáo viên mầm non
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-start gap-3">
                <span className="text-2xl">🧸</span>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-sky-900 dark:text-sky-200">
                    1. Chọn đồ vật ở khay đồ chơi
                  </h4>
                  <p className="text-xs text-sky-700 dark:text-sky-300 mt-0.5 leading-relaxed">
                    Bé bấm vào bất kỳ món đồ nào dưới khay (hòn sỏi, thìa inox, quả trứng, quả táo, vịt cao su...) để thả vào bể nước xem vật chìm hay nổi.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <span className="text-2xl">🧂</span>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                    2. Xúc muối &amp; Quấy tan làm trứng nổi
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    Bấm <b>Cầm Thìa Xúc Muối</b> ở hũ muối lớn bên cạnh, di thìa đổ vào bể rồi dùng đũa quấy đều trong nước. Khi đủ mặn, quả trứng sẽ kỳ diệu nổi lên!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                    3. Bể kính 3D thật &amp; Xoay 360 độ
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                    Bé có thể kéo chuột để xoay vòng quanh bể ngắm nhìn chiều sâu, mặt nước và đáy cát; bấm <b>Góc Mặc Định</b> để trở về góc nhìn đẹp nhất.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  speechEngine.speak(
                    'Chào bé! Hãy chọn đồ vật thả vào bể nước, bấm hũ muối để xúc muối quấy tan hoặc bấm tự xoay 360 độ để ngắm nhìn bể cá nhé!'
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs hover:bg-amber-200 transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>Cô Mimi Đọc</span>
              </button>

              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Bé Đã Hiểu Rồi! ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimSinkOrFloatLab;

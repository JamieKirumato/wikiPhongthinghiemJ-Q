import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  AlertTriangle, 
  Waves, 
  Flame, 
  Ship, 
  Search, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  Lightbulb,
  ArrowUp,
  Trophy
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  onBackToTable?: () => void;
}

// 10+ Preschool Familiar Items for the Sensory Play Tank
export interface TankObject {
  id: string;
  name: string;
  icon: string;
  weightGrams: number;
  volumeMl: number; // Volume for Archimedes displacement
  floats: boolean;
  desc: string;
  densityNote: string;
  // Dynamic physics states
  inTank: boolean;
  xPercent: number; // 10% to 90%
  yPos: number; // pixel position in tank (top=0 to bottom=360)
  vy: number;
  status: 'basket' | 'falling' | 'floating' | 'sunk' | 'pushed';
}

const PLAY_ITEMS_PRESETS: TankObject[] = [
  { id: 'item-pebble', name: 'Hòn sỏi', icon: '🪨', weightGrams: 50, volumeMl: 20, floats: false, desc: 'Đá tự nhiên', densityNote: 'Đặc và nặng hơn nước nên chìm sâu xuống đáy', inTank: false, xPercent: 20, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-spoon', name: 'Thìa inox', icon: '🥄', weightGrams: 35, volumeMl: 8, floats: false, desc: 'Kim loại đặc', densityNote: 'Kim loại đặc nặng hơn nước nên chìm nhanh', inTank: false, xPercent: 35, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-pingpong', name: 'Bóng bàn', icon: '⚪', weightGrams: 3, volumeMl: 40, floats: true, desc: 'Nhựa rỗng chứa khí', densityNote: 'Bên trong chứa đầy không khí; dìm xuống đáy sẽ bắn vọt lên!', inTank: false, xPercent: 50, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-duck', name: 'Vịt cao su', icon: '🐥', weightGrams: 12, volumeMl: 55, floats: true, desc: 'Cao su rỗng ruột', densityNote: 'Nổi bồng bềnh dập dềnh theo từng con sóng nước', inTank: false, xPercent: 65, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-wood', name: 'Khối gỗ', icon: '🪵', weightGrams: 28, volumeMl: 45, floats: true, desc: 'Gỗ khô', densityNote: 'Khối lượng riêng nhỏ hơn nước nên nổi lơ lửng ở mặt nước', inTank: false, xPercent: 80, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-leaf', name: 'Chiếc lá tươi', icon: '🍃', weightGrams: 1, volumeMl: 5, floats: true, desc: 'Lá cây', densityNote: 'Diện tích rộng và cực nhẹ nên nằm êm dịu trên mặt nước', inTank: false, xPercent: 25, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-foam', name: 'Mẩu xốp', icon: '🧱', weightGrams: 2, volumeMl: 35, floats: true, desc: 'Xốp nhẹ', densityNote: 'Cấu trúc triệu lỗ khí li ti, siêu nổi', inTank: false, xPercent: 40, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-apple', name: 'Quả táo', icon: '🍎', weightGrams: 75, volumeMl: 90, floats: true, desc: 'Trái cây ruột xốp', densityNote: 'Ruột táo chứa 25% là túi khí nên nổi và làm mực nước dâng cao', inTank: false, xPercent: 55, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-egg', name: 'Quả trứng', icon: '🥚', weightGrams: 55, volumeMl: 48, floats: false, desc: 'Trứng gà tươi', densityNote: 'Đặc ruột nên chìm nghỉm trong nước lọc bình thường', inTank: false, xPercent: 70, yPos: 40, vy: 0, status: 'basket' },
  { id: 'item-keys', name: 'Chùm chìa khóa', icon: '🔑', weightGrams: 42, volumeMl: 10, floats: false, desc: 'Kim loại nặng', densityNote: 'Kim loại đặc chìm thẳng tắp phát ra tiếng tõm', inTank: false, xPercent: 85, yPos: 40, vy: 0, status: 'basket' }
];

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

interface BubbleParticle {
  id: number;
  x: number;
  y: number;
  vy: number;
  size: number;
  wobble: number;
  alpha: number;
}

interface Passenger {
  id: string;
  name: string;
  icon: string;
  weightGrams: number;
  type: 'friend' | 'stone';
}

const PASSENGERS_POOL: Passenger[] = [
  { id: 'p-bear', name: 'Gấu Bông Mimi', icon: '🐻', weightGrams: 15, type: 'friend' },
  { id: 'p-bunny', name: 'Bạn Thỏ Trắng', icon: '🐰', weightGrams: 15, type: 'friend' },
  { id: 'p-duck', name: 'Vịt Cao Su', icon: '🐥', weightGrams: 10, type: 'friend' },
  { id: 'p-stone-s', name: 'Hòn sỏi nhỏ', icon: '🪨', weightGrams: 20, type: 'stone' },
  { id: 'p-stone-m', name: 'Hòn sỏi to', icon: '🪨', weightGrams: 40, type: 'stone' }
];

export const SimSinkOrFloatLab: React.FC<Props> = () => {
  // Main Tab: 'part1-improved' vs 'part2-discovery'
  const [activeTab, setActiveTab] = useState<'part1-improved' | 'part2-discovery'>('part1-improved');

  // Sub-mode within Part 1: 'tank' vs 'lava-lamp'
  const [part1Mode, setPart1Mode] = useState<'tank' | 'lava-lamp'>('tank');

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mascot guidance message
  const [message, setMessage] = useState<string>(
    'Chào các bạn nhỏ! Bé hãy tự tay cầm đồ vật trong Giỏ đồ chơi nhúng vào bể nước xem điều gì kỳ diệu xảy ra nhé!'
  );

  // =========================================================================
  // PART 1A: TACTILE WATER TANK PHYSICS STATE
  // =========================================================================
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [holdingPos, setHoldingPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [submergingItemId, setSubmergingItemId] = useState<string | null>(null);
  const [showXRay, setShowXRay] = useState(false);
  const [activeTool, setActiveTool] = useState<'hand' | 'net'>('hand');

  // Drop race mode: comparing 2 items dropped simultaneously
  const [raceModeActive, setRaceModeActive] = useState<boolean>(false);
  const [raceSlotA, setRaceSlotA] = useState<string>('item-pebble');
  const [raceSlotB, setRaceSlotB] = useState<string>('item-pingpong');
  const [raceRunning, setRaceRunning] = useState<boolean>(false);

  // Tank DOM measurement
  const tankRef = useRef<HTMLDivElement | null>(null);

  // Water level constants
  const BASE_WATER_SURFACE_Y = 120; // Default surface pixel line in 380px tall tank
  const TANK_BOTTOM_Y = 320;

  // Calculate Archimedes water displacement (mực nước dâng)
  const totalVolumeInWater = items
    .filter((i) => i.inTank)
    .reduce((sum, i) => sum + i.volumeMl, 0);
  const waterLevelRisePx = Math.min(45, Math.round(totalVolumeInWater * 0.14));
  const currentWaterSurfaceY = BASE_WATER_SURFACE_Y - waterLevelRisePx;

  // =========================================================================
  // DYNAMIC WAVE & PARTICLE SIMULATION (SPRING WAVE NODES)
  // =========================================================================
  const [waveSprings, setWaveSprings] = useState<number[]>(() => Array(40).fill(0));
  const waveVelocities = useRef<number[]>(Array(40).fill(0));
  const [splashParticles, setSplashParticles] = useState<SplashParticle[]>([]);
  const [bubbles, setBubbles] = useState<BubbleParticle[]>([]);

  // Trigger splash particles and wave impact at a specific x-position
  const createWaterSplash = (xPx: number, isHeavy: boolean) => {
    if (soundEnabled) {
      soundEngine.playWaterSplash(isHeavy);
    }

    // 1. Disturb wave springs near xPx
    if (tankRef.current) {
      const tankWidth = tankRef.current.clientWidth || 500;
      const nodeIndex = Math.min(39, Math.max(0, Math.floor((xPx / tankWidth) * 40)));
      waveVelocities.current[nodeIndex] = isHeavy ? 28 : 14;
      if (nodeIndex > 0) waveVelocities.current[nodeIndex - 1] = isHeavy ? 18 : 9;
      if (nodeIndex < 39) waveVelocities.current[nodeIndex + 1] = isHeavy ? 18 : 9;
    }

    // 2. Spawn 15-25 water droplets
    const count = isHeavy ? 24 : 14;
    const newParticles: SplashParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) / 1.3 + Math.PI * 0.15; // Shoot upward
      const speed = Math.random() * (isHeavy ? 7 : 4.5) + 2;
      newParticles.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 20 - 10),
        y: currentWaterSurfaceY,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed),
        size: Math.random() * (isHeavy ? 6 : 4) + 2.5,
        alpha: 0.9,
        life: 1
      });
    }
    setSplashParticles((prev) => [...prev, ...newParticles]);

    // 3. Spawn underwater bubbles if sinking
    if (isHeavy) {
      const newBubbles: BubbleParticle[] = [];
      for (let i = 0; i < 8; i++) {
        newBubbles.push({
          id: Date.now() + Math.random(),
          x: xPx + (Math.random() * 24 - 12),
          y: currentWaterSurfaceY + 20 + i * 15,
          vy: -(Math.random() * 1.5 + 1),
          size: Math.random() * 5 + 3,
          wobble: Math.random() * 10,
          alpha: 0.8
        });
      }
      setBubbles((prev) => [...prev, ...newBubbles]);
      if (soundEnabled) soundEngine.playBubbleGlug();
    }
  };

  // Main Animation Physics Loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // 1. Update wave springs (Euler Spring Dampening)
      const tension = 0.025;
      const dampening = 0.04;
      const spread = 0.22;

      setWaveSprings((prevSprings) => {
        const next = [...prevSprings];
        const vels = waveVelocities.current;

        for (let i = 0; i < next.length; i++) {
          const force = -tension * next[i] - dampening * vels[i];
          vels[i] += force;
          next[i] += vels[i];
        }

        // Pass momentum to neighbors
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < next.length; i++) {
            if (i > 0) {
              const leftDelta = spread * (next[i] - next[i - 1]);
              vels[i - 1] += leftDelta;
              next[i - 1] += leftDelta;
            }
            if (i < next.length - 1) {
              const rightDelta = spread * (next[i] - next[i + 1]);
              vels[i + 1] += rightDelta;
              next[i + 1] += rightDelta;
            }
          }
        }
        return next;
      });

      // 2. Update splash particles
      setSplashParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.35, // Gravity
            alpha: p.alpha - 0.035,
            life: p.life - 0.035
          }))
          .filter((p) => p.life > 0)
      );

      // 3. Update underwater bubbles
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y + b.vy,
            x: b.x + Math.sin(b.y * 0.1 + b.wobble) * 0.6,
            alpha: b.alpha - 0.015
          }))
          .filter((b) => b.y > currentWaterSurfaceY && b.alpha > 0)
      );

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [currentWaterSurfaceY]);

  // =========================================================================
  // HAND INTERACTION: PICK UP, HOLD, DIP, AND RELEASE
  // =========================================================================
  const handleStartHold = (item: TankObject, e: React.PointerEvent) => {
    e.preventDefault();
    if (activeTool === 'net') {
      // Net tool scoops item back to basket
      handleScoopItem(item.id);
      return;
    }

    setHoldingItemId(item.id);

    if (tankRef.current) {
      const rect = tankRef.current.getBoundingClientRect();
      setHoldingPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    setMessage(`Bé đang cầm "${item.name} ${item.icon}". Hãy đưa lại gần mặt nước và tự tay thả xem nhé!`);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!holdingItemId || !tankRef.current) return;
    const rect = tankRef.current.getBoundingClientRect();
    const currX = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const currY = Math.max(10, Math.min(rect.height - 10, e.clientY - rect.top));

    setHoldingPos({ x: currX, y: currY });

    // Detect if touching water surface
    if (Math.abs(currY - currentWaterSurfaceY) < 15) {
      if (soundEnabled && Math.random() < 0.15) {
        soundEngine.playGentleDip();
      }
    }
  };

  const handlePointerUp = () => {
    if (!holdingItemId || !tankRef.current) return;
    const item = items.find((i) => i.id === holdingItemId);
    if (!item) {
      setHoldingItemId(null);
      return;
    }

    const tankWidth = tankRef.current.clientWidth || 500;
    const dropXPercent = Math.min(90, Math.max(10, Math.round((holdingPos.x / tankWidth) * 100)));
    const droppedFromAir = holdingPos.y < currentWaterSurfaceY;

    // Splash effect and audio
    createWaterSplash(holdingPos.x, !item.floats);

    // Calculate final resting Y position
    const finalYPos = item.floats
      ? currentWaterSurfaceY - (item.id === 'item-wood' ? 5 : item.id === 'item-leaf' ? 8 : 12)
      : TANK_BOTTOM_Y;

    // Update item position in tank
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inTank: true,
              xPercent: dropXPercent,
              yPos: finalYPos,
              status: item.floats ? 'floating' : 'sunk'
            }
          : i
      )
    );

    // Pedagogical message
    if (item.floats) {
      setMessage(
        `💧 ${item.name} ${droppedFromAir ? 'rơi tõm xuống nước' : 'được nhúng xuống'} nhưng đã NỔI BỒNG BỀNH! ${item.densityNote}.`
      );
      if (soundEnabled) soundEngine.playWaterDrop();
    } else {
      setMessage(
        `⚓ ${item.name} rơi thẳng xuống đáy và CHÌM NGHỈM! ${item.densityNote}.`
      );
    }

    setHoldingItemId(null);
  };

  // =========================================================================
  // SPECIAL INTERACTION: DÌM BÓNG XUỐNG ĐÁY & BẬT VỌT LÊN (PUSH DOWN & POP UP)
  // =========================================================================
  const handlePushDownItem = (item: TankObject, e: React.PointerEvent) => {
    e.stopPropagation();
    if (!item.floats || !item.inTank) return;

    setSubmergingItemId(item.id);
    setMessage(`Bé đang dùng ngón tay ấn dìm ${item.name} xuống đáy nước! Nước đang sinh lực đẩy rất mạnh! Buông tay ra xem nào!`);

    if (soundEnabled) {
      soundEngine.playBubbleGlug();
    }

    // Set item temporarily pushed down to near bottom
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, yPos: TANK_BOTTOM_Y - 30, status: 'pushed' } : i))
    );
  };

  const handleReleaseSubmergedItem = () => {
    if (!submergingItemId) return;
    const item = items.find((i) => i.id === submergingItemId);
    if (!item) {
      setSubmergingItemId(null);
      return;
    }

    // Sound: Buoyant pop rocket!
    if (soundEnabled) {
      soundEngine.playBuoyantPop();
    }

    // Create splash at surface
    if (tankRef.current) {
      const tankWidth = tankRef.current.clientWidth || 500;
      createWaterSplash((item.xPercent / 100) * tankWidth, false);
    }

    // Shoot back up to surface with harmonic bounce
    const finalYPos = currentWaterSurfaceY - (item.id === 'item-wood' ? 5 : item.id === 'item-leaf' ? 8 : 12);

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              yPos: finalYPos,
              status: 'floating'
            }
          : i
      )
    );

    setMessage(
      `🚀 VÈO... BẬT LÊN RỒI! ${item.name} bị dìm xuống đáy đã phóng vút lên mặt nước! Lực đẩy của nước quá mạnh mẽ!`
    );
    setSubmergingItemId(null);
  };

  // Scoop item out with net tool
  const handleScoopItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (soundEnabled) {
      soundEngine.playNetScoop();
    }

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, inTank: false, status: 'basket', yPos: 40 } : i))
    );
    setMessage(`Bé đã dùng vợt lưới vớt ${item.name} cất lại vào giỏ đồ chơi!`);
  };

  const handleResetAllTank = () => {
    setItems(PLAY_ITEMS_PRESETS);
    setHoldingItemId(null);
    setSubmergingItemId(null);
    if (soundEnabled) soundEngine.playNetScoop();
    setMessage('Đã vớt sạch bể nước! Giỏ đồ chơi đã đầy đủ các món để bé thử nghiệm lại.');
  };

  // =========================================================================
  // DROP RACE: SIMULTANEOUS DROP COMPARISON (SO SÁNH 2 VẬT CÙNG LÚC)
  // =========================================================================
  const handleStartRace = () => {
    const itemA = items.find((i) => i.id === raceSlotA);
    const itemB = items.find((i) => i.id === raceSlotB);
    if (!itemA || !itemB) return;

    setRaceRunning(true);
    setMessage('Chuẩn bị... 3... 2... 1... THẢ CÙNG LÚC!');

    setTimeout(() => {
      if (tankRef.current) {
        const tankWidth = tankRef.current.clientWidth || 500;
        createWaterSplash(tankWidth * 0.35, !itemA.floats);
        createWaterSplash(tankWidth * 0.65, !itemB.floats);
      }

      setItems((prev) =>
        prev.map((i) => {
          if (i.id === itemA.id) {
            return {
              ...i,
              inTank: true,
              xPercent: 35,
              yPos: itemA.floats ? currentWaterSurfaceY - 10 : TANK_BOTTOM_Y,
              status: itemA.floats ? 'floating' : 'sunk'
            };
          }
          if (i.id === itemB.id) {
            return {
              ...i,
              inTank: true,
              xPercent: 65,
              yPos: itemB.floats ? currentWaterSurfaceY - 10 : TANK_BOTTOM_Y,
              status: itemB.floats ? 'floating' : 'sunk'
            };
          }
          return i;
        })
      );

      setRaceRunning(false);
      setMessage(
        `🏁 KẾT QUẢ ĐUA: ${itemA.name} ${itemA.floats ? 'NỔI' : 'CHÌM'}, còn ${itemB.name} ${itemB.floats ? 'NỔI' : 'CHÌM'}! Bé thấy chưa, to hay nhỏ không quyết định, mà do chất liệu và không khí bên trong!`
      );
    }, 700);
  };

  // =========================================================================
  // LAVA LAMP (PART 1B) & RESCUE RAFT (PART 2) COMPATIBILITY STATES
  // =========================================================================
  const [lavaStep, setLavaStep] = useState<number>(0);
  const [isLavaBubbling, setIsLavaBubbling] = useState<boolean>(false);
  const [nightLightOn, setNightLightOn] = useState<boolean>(false);

  const handleNextLavaStep = () => {
    if (lavaStep === 0) {
      setLavaStep(1);
      setMessage('Bước 1: Rót nước vào bình! Nước trong suốt nằm ở nửa dưới.');
      if (soundEnabled) soundEngine.playWaterSplash(false);
    } else if (lavaStep === 1) {
      setLavaStep(2);
      setMessage('Bước 2: Rót dầu ăn vào bình! Dầu ăn nhẹ hơn nước nên nổi thành lớp màu vàng phía trên!');
      if (soundEnabled) soundEngine.playWaterSplash(false);
    } else if (lavaStep === 2) {
      setLavaStep(3);
      setMessage('Bước 3: Nhỏ giọt màu thực phẩm! Giọt màu nặng hơn dầu nên rơi xuyên qua lớp dầu xuống đáy nước.');
      if (soundEnabled) soundEngine.playWaterDrop();
    } else if (lavaStep === 3) {
      setLavaStep(4);
      setIsLavaBubbling(true);
      setMessage('Bước 4: Thả viên sủi C vào! Khí sủi bọt đẩy các giọt màu bay lên mặt dầu, vỡ khí lại chìm xuống tạo đèn dung nham!');
      if (soundEnabled) soundEngine.playMagicChime();
    }
  };

  const handleResetLava = () => {
    setLavaStep(0);
    setIsLavaBubbling(false);
    setMessage('Đã rửa sạch bình! Bé bấm nút để bắt đầu chế tạo đèn dung nham mới nhé.');
  };

  // Part 2: Rescue Raft State
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: string]: number }>({
    foil: 1, straws: 2, sticks: 2, foam: 1, caps: 2
  });
  const [onboardPassengers, setOnboardPassengers] = useState<Passenger[]>([]);
  const [raftLaunched, setRaftLaunched] = useState<boolean>(false);
  const [raftSunk, setRaftSunk] = useState<boolean>(false);
  const [journeySuccess, setJourneySuccess] = useState<boolean>(false);

  const totalBuoyancy = (selectedMaterials.foil || 0) * 20 +
    (selectedMaterials.straws || 0) * 15 +
    (selectedMaterials.sticks || 0) * 10 +
    (selectedMaterials.foam || 0) * 35 +
    (selectedMaterials.caps || 0) * 12;
  const totalWeight = onboardPassengers.reduce((sum, p) => sum + p.weightGrams, 0);
  const isOverloaded = totalWeight > totalBuoyancy;

  const handleAddMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [matKey]: (prev[matKey] || 0) + 1 }));
    if (soundEnabled) soundEngine.playWaterDrop();
  };
  const handleRemoveMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [matKey]: Math.max(0, (prev[matKey] || 0) - 1) }));
  };
  const handleAddPassenger = (passenger: Passenger) => {
    if (onboardPassengers.length >= 6) return;
    const newPassengers = [...onboardPassengers, { ...passenger, id: `${passenger.id}-${Date.now()}` }];
    setOnboardPassengers(newPassengers);
    if (soundEnabled) soundEngine.playWaterDrop();
  };
  const handleRemovePassenger = (idx: number) => {
    setOnboardPassengers(onboardPassengers.filter((_, i) => i !== idx));
    setRaftLaunched(false);
  };
  const handleLaunchRaft = () => {
    if (onboardPassengers.length === 0) return;
    setRaftLaunched(true);
    if (isOverloaded) {
      setRaftSunk(true);
      setJourneySuccess(false);
      if (soundEnabled) soundEngine.playWaterSplash(true);
    } else {
      setRaftSunk(false);
      setJourneySuccess(true);
      if (soundEnabled) soundEngine.playSuccessFanfare();
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border-2 border-emerald-500 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn select-none">
      {/* 1. Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wide">
              Thí nghiệm 1 • Mầm non (3 - 6 tuổi)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold font-mono">
              Khoa học Tương tác Thực Nghiệm
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Waves className="w-6 h-6 text-amber-300 animate-pulse" />
            <span>Thí nghiệm Sự Chìm, Nổi của Vật</span>
          </h2>
        </div>

        {/* Tab switchers: Phần 1 (Cải tiến) vs Phần 2 (Khám phá) */}
        <div className="flex items-center gap-2 p-1.5 bg-black/25 rounded-2xl">
          <button
            onClick={() => setActiveTab('part1-improved')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition ${
              activeTab === 'part1-improved'
                ? 'bg-white text-emerald-800 shadow-lg scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Phần 1: Bể Nước Chìm Nổi Tương Tác</span>
          </button>

          <button
            onClick={() => setActiveTab('part2-discovery')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition ${
              activeTab === 'part2-discovery'
                ? 'bg-amber-400 text-slate-900 shadow-lg scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Ship className="w-4 h-4 text-slate-900" />
            <span>Phần 2: Xưởng Chế Tạo Bè Cứu Hộ</span>
          </button>
        </div>
      </div>

      {/* 2. Mascot Guidance Bar */}
      <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-sky-950/40 border-b border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0 animate-bounce">
            👩‍🏫
          </div>
          <p className="text-emerald-950 dark:text-emerald-200 font-medium text-xs sm:text-sm">
            <strong>Cô Mimi dẫn dắt:</strong> {message}
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 shadow-2xs font-mono font-semibold"
          title={soundEnabled ? 'Tắt âm thanh nước' : 'Bật âm thanh nước'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Âm thanh: Bật</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Âm thanh: Tắt</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Main Playground Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {activeTab === 'part1-improved' ? (
          <div className="space-y-6">
            {/* Top Toolbar: Tank vs Lava Lamp & Tool toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPart1Mode('tank')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow-xs ${
                    part1Mode === 'tank'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Waves className="w-4 h-4" />
                  <span>Bể Thử Nghiệm Chìm Nổi Trực Quan</span>
                </button>

                <button
                  onClick={() => setPart1Mode('lava-lamp')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow-xs ${
                    part1Mode === 'lava-lamp'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>Chế Tạo Đèn Dung Nham (Lava Lamp)</span>
                </button>
              </div>

              {part1Mode === 'tank' && (
                <div className="flex items-center gap-2">
                  {/* Tool Selection: Hand vs Net Scoop */}
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
                    <button
                      onClick={() => setActiveTool('hand')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                        activeTool === 'hand'
                          ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Dùng bàn tay tự do cầm, nhúng và dìm đồ vật"
                    >
                      <span>🖐️ Bàn tay nhúng</span>
                    </button>

                    <button
                      onClick={() => setActiveTool('net')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                        activeTool === 'net'
                          ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Dùng vợt lưới vớt đồ vật trong bể cất lại vào giỏ"
                    >
                      <span>🧺 Vợt vớt đồ</span>
                    </button>
                  </div>

                  {/* Drop Race toggle */}
                  <button
                    onClick={() => setRaceModeActive(!raceModeActive)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                      raceModeActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{raceModeActive ? 'Tắt Cuộc Đua' : 'Đua Thả 2 Vật'}</span>
                  </button>
                </div>
              )}
            </div>

            {part1Mode === 'tank' ? (
              /* ========================================================================= */
              /* THE REALISTIC TACTILE WATER TANK (BỂ NƯỚC VẬT LÝ SIÊU THỰC)              */
              /* ========================================================================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Physics Water Tank (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Drop Race Dual Bridge (if active) */}
                  {raceModeActive && (
                    <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-400 dark:border-purple-800 flex items-center justify-between gap-3 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-purple-900 dark:text-purple-200">Vật A:</span>
                          <select
                            value={raceSlotA}
                            onChange={(e) => setRaceSlotA(e.target.value)}
                            className="text-xs font-mono font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-purple-300 rounded-lg text-slate-800 dark:text-slate-200"
                          >
                            {items.map((i) => (
                              <option key={i.id} value={i.id}>{i.icon} {i.name} ({i.floats ? 'Nổi' : 'Chìm'})</option>
                            ))}
                          </select>
                        </div>

                        <span className="text-xs font-bold text-purple-600">VS</span>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-purple-900 dark:text-purple-200">Vật B:</span>
                          <select
                            value={raceSlotB}
                            onChange={(e) => setRaceSlotB(e.target.value)}
                            className="text-xs font-mono font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-purple-300 rounded-lg text-slate-800 dark:text-slate-200"
                          >
                            {items.map((i) => (
                              <option key={i.id} value={i.id}>{i.icon} {i.name} ({i.floats ? 'Nổi' : 'Chìm'})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleStartRace}
                        disabled={raceRunning}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs font-mono shadow-md transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Thả Cùng Lúc! 🚀</span>
                      </button>
                    </div>
                  )}

                  {/* The Interactive Physics Glass Tank */}
                  <div
                    ref={tankRef}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="relative w-full h-[380px] rounded-3xl border-4 border-sky-400/80 dark:border-sky-500/50 bg-gradient-to-b from-sky-100/40 via-sky-200/30 to-blue-300/40 dark:from-slate-950 dark:via-blue-950/40 dark:to-blue-900/40 overflow-hidden shadow-2xl flex flex-col justify-end touch-none cursor-default"
                  >
                    {/* Top Air Atmosphere */}
                    <div className="absolute top-2 left-4 text-[10px] font-mono font-bold text-sky-700/70 dark:text-sky-300/70 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none">
                      <span>☁️ Không khí (Bé có thể cầm vật thả từ đây)</span>
                    </div>

                    {/* Archimedes Water Displacement Ruler (Thước đo mực nước bên thành bể) */}
                    <div className="absolute top-10 right-3 flex flex-col items-end gap-1 pointer-events-none z-20">
                      <div className="px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-sky-300 dark:border-sky-700 text-[10px] font-mono text-sky-900 dark:text-sky-200 shadow-xs">
                        📏 Mực nước: <strong className="text-emerald-600">+{waterLevelRisePx}mm</strong> (Vật chiếm chỗ)
                      </div>
                    </div>

                    {/* Dynamic Spring Wave Surface SVG */}
                    <div
                      style={{ top: `${currentWaterSurfaceY}px` }}
                      className="absolute left-0 right-0 h-4 pointer-events-none z-10 transition-[top] duration-500"
                    >
                      <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 40">
                        {/* Wave curve path */}
                        <path
                          d={(() => {
                            let p = `M 0 ${20 + (waveSprings[0] || 0)}`;
                            for (let i = 1; i < 40; i++) {
                              const x = (i / 39) * 400;
                              const y = 20 + (waveSprings[i] || 0);
                              p += ` L ${x} ${y}`;
                            }
                            p += ` L 400 60 L 0 60 Z`;
                            return p;
                          })()}
                          fill="rgba(56, 189, 248, 0.45)"
                        />
                        {/* Shimmering surface line */}
                        <path
                          d={(() => {
                            let p = `M 0 ${20 + (waveSprings[0] || 0)}`;
                            for (let i = 1; i < 40; i++) {
                              const x = (i / 39) * 400;
                              const y = 20 + (waveSprings[i] || 0);
                              p += ` L ${x} ${y}`;
                            }
                            return p;
                          })()}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.85)"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>

                    {/* Water Body (Chất lỏng trong suốt với ánh sáng tán xạ) */}
                    <div
                      style={{ top: `${currentWaterSurfaceY + 16}px` }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-sky-400/30 via-sky-500/35 to-blue-600/40 pointer-events-none transition-[top] duration-500"
                    >
                      {/* Ambient bubbles */}
                      <div className="absolute bottom-8 left-16 w-3 h-3 rounded-full bg-white/40 animate-ping" />
                      <div className="absolute bottom-16 right-24 w-2 h-2 rounded-full bg-white/50 animate-pulse" />
                      <div className="absolute bottom-28 left-48 w-4 h-4 rounded-full bg-white/20 animate-bounce" />
                    </div>

                    {/* Underwater Sandy Bed (Đáy bể rải cát) */}
                    <div className="absolute bottom-0 left-0 right-0 h-9 bg-gradient-to-t from-amber-200/90 via-amber-100/70 to-transparent dark:from-amber-950/80 dark:via-slate-900 border-t border-amber-300/40 flex items-center justify-center text-[10px] font-mono text-amber-900 dark:text-amber-200 pointer-events-none z-10">
                      🏖️ Đáy bể cát mịn (Vật chìm nghỉm tại đây)
                    </div>

                    {/* Splash Water Droplet Particles */}
                    {splashParticles.map((sp) => (
                      <div
                        key={sp.id}
                        style={{
                          left: `${sp.x}px`,
                          top: `${sp.y}px`,
                          width: `${sp.size}px`,
                          height: `${sp.size}px`,
                          opacity: sp.alpha
                        }}
                        className="absolute rounded-full bg-sky-300 dark:bg-white shadow-xs pointer-events-none z-30"
                      />
                    ))}

                    {/* Underwater Bubbles */}
                    {bubbles.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          left: `${b.x}px`,
                          top: `${b.y}px`,
                          width: `${b.size}px`,
                          height: `${b.size}px`,
                          opacity: b.alpha
                        }}
                        className="absolute rounded-full border border-white/80 bg-white/40 shadow-xs pointer-events-none z-20"
                      />
                    ))}

                    {/* Render Objects Inside Tank */}
                    <div className="relative w-full h-full z-20 pointer-events-auto">
                      {items
                        .filter((i) => i.inTank && i.id !== holdingItemId)
                        .map((item) => {
                          const isSubmerged = item.status === 'pushed';

                          return (
                            <div
                              key={item.id}
                              onPointerDown={(e) => {
                                if (activeTool === 'net') {
                                  handleScoopItem(item.id);
                                } else if (item.floats) {
                                  handlePushDownItem(item, e);
                                } else {
                                  handleStartHold(item, e);
                                }
                              }}
                              onPointerUp={handleReleaseSubmergedItem}
                              style={{
                                position: 'absolute',
                                left: `${item.xPercent}%`,
                                top: `${item.yPos}px`,
                                transition: isSubmerged ? 'all 0.15s ease' : 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                              }}
                              className={`group cursor-grab active:cursor-grabbing flex flex-col items-center -translate-x-1/2 ${
                                isSubmerged ? 'scale-125' : 'hover:scale-115'
                              }`}
                              title={
                                activeTool === 'net'
                                  ? 'Bấm để vớt vào giỏ'
                                  : item.floats
                                  ? 'ẤN GIỮ ĐỂ DÌM XUỐNG ĐÁY & BUÔNG TAY ĐỂ BẮN LÊN!'
                                  : 'Bấm để cầm lên thử nghiệm lại'
                              }
                            >
                              {/* Submerge indicator arrows when held underwater */}
                              {isSubmerged && (
                                <div className="mb-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-mono font-black animate-bounce flex items-center gap-1 shadow-md">
                                  <ArrowUp className="w-3 h-3 text-red-600 animate-pulse" />
                                  <span>BUÔNG TAY ĐỂ BẮN LÊN!</span>
                                </div>
                              )}

                              {/* Object Icon */}
                              <span className="text-4xl filter drop-shadow-md select-none transform transition-transform">
                                {item.icon}
                              </span>

                              {/* Object Tag */}
                              <span
                                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs mt-1 whitespace-nowrap transition-colors ${
                                  item.floats
                                    ? 'bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-950 dark:text-sky-200'
                                    : 'bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                                }`}
                              >
                                {item.name} ({item.floats ? 'NỔI' : 'CHÌM'})
                              </span>

                              {/* Floating Push Hint */}
                              {item.floats && !isSubmerged && (
                                <div className="text-[8px] font-mono text-sky-700 dark:text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded shadow-2xs mt-0.5">
                                  👇 Ấn dìm bóng
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Dragged / Held Item Floating with Hand Cursor */}
                    {holdingItemId && (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${holdingPos.x}px`,
                          top: `${holdingPos.y}px`,
                          transform: 'translate(-50%, -50%) scale(1.3) rotate(8deg)'
                        }}
                        className="pointer-events-none z-50 flex flex-col items-center filter drop-shadow-2xl"
                      >
                        <span className="text-5xl animate-pulse">
                          {items.find((i) => i.id === holdingItemId)?.icon}
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-lg mt-1">
                          🖐️ Thả tay để nhúng!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => setShowXRay(!showXRay)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-semibold transition ${
                        showXRay
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{showXRay ? 'Tắt Kính Lúp X-Ray' : 'Bật Kính Lúp X-Ray (Soi cấu trúc rỗng/đặc)'}</span>
                    </button>

                    <button
                      onClick={handleResetAllTank}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-semibold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Vớt tất cả về giỏ đồ chơi</span>
                    </button>
                  </div>
                </div>

                {/* Right: The Preschool Toy Basket (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 rounded-3xl bg-amber-50/70 dark:bg-[#0f172a] border-2 border-amber-300 dark:border-amber-700 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>🧺 Giỏ Đồ Chơi Của Bé</span>
                      </h3>
                      <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-950">
                        {items.filter((i) => !i.inTank).length} món đồ
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Bé hãy bấm giữ và kéo bất kỳ món đồ nào thả vào bể nước nhé!
                    </p>

                    {/* Toy Basket Grid */}
                    <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {items.map((item) => {
                        const isInTank = item.inTank;

                        return (
                          <div
                            key={item.id}
                            onPointerDown={(e) => {
                              if (!isInTank) handleStartHold(item, e);
                            }}
                            className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                              isInTank
                                ? 'opacity-35 bg-slate-100 dark:bg-slate-900 border-dashed border-slate-300 cursor-default'
                                : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 hover:border-amber-500 hover:scale-105 shadow-xs cursor-grab active:cursor-grabbing'
                            }`}
                          >
                            <span className="text-3xl mb-1">{item.icon}</span>
                            <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                              {item.name}
                            </div>
                            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                              {item.weightGrams}g • {item.desc}
                            </span>

                            {showXRay && (
                              <div className="mt-1 text-[8px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-1 rounded">
                                {item.floats ? '🔍 Có túi khí' : '🔍 Đặc ruột'}
                              </div>
                            )}

                            {isInTank && (
                              <span className="mt-1 text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                ✓ Đang trong bể
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tactile Learning Tip Box */}
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs space-y-2">
                    <div className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>Trải nghiệm xúc giác cho bé:</span>
                    </div>
                    <ul className="text-slate-600 dark:text-slate-300 text-[11px] space-y-1.5 leading-relaxed">
                      <li>• <strong>Thả từ trên cao:</strong> Nước bắn tung tóe và sóng dập dềnh!</li>
                      <li>• <strong>Ấn dìm quả bóng bàn:</strong> Cảm nhận lực đẩy Archimedes; buông tay để bóng bắn vút lên!</li>
                      <li>• <strong>Quan sát thước đo:</strong> Thả vật to (như quả táo) thì nước dâng cao hơn vật nhỏ.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* SUB-MODE 1B: CHẾ TẠO ĐÈN DUNG NHAM (LAVA LAMP)                           */
              /* ========================================================================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left side: Lava Lamp Flask (6 cols) */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
                  <div
                    className={`relative w-48 h-[380px] rounded-3xl border-4 transition-all duration-500 overflow-hidden flex flex-col justify-end p-2 ${
                      nightLightOn
                        ? 'border-amber-400 bg-slate-950 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-xl'
                    }`}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-400 dark:bg-slate-600 rounded-b-md" />

                    {lavaStep === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                        <Flame className="w-8 h-8 text-slate-300 mb-2" />
                        <span>Bình thủy tinh đang rỗng. Bấm "Bước tiếp theo" để thêm nước!</span>
                      </div>
                    )}

                    {lavaStep >= 1 && (
                      <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-sky-400/40 border-t border-sky-300/50 flex items-center justify-center text-[10px] font-mono text-sky-800 dark:text-sky-200">
                        Lớp Nước Lọc (Nặng hơn)
                      </div>
                    )}

                    {lavaStep >= 2 && (
                      <div className="absolute bottom-[35%] left-0 right-0 h-[60%] bg-amber-300/35 border-t border-amber-300/60 flex items-center justify-center text-[10px] font-mono text-amber-800 dark:text-amber-300">
                        Lớp Dầu Ăn (Nhẹ hơn nổi lên)
                      </div>
                    )}

                    {lavaStep >= 3 && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute bottom-3 left-6 w-5 h-5 rounded-full bg-red-500/80 shadow-xs" />
                        <div className="absolute bottom-4 left-16 w-6 h-6 rounded-full bg-purple-600/80 shadow-xs" />
                        <div className="absolute bottom-2 right-8 w-5 h-5 rounded-full bg-orange-500/80 shadow-xs" />
                      </div>
                    )}

                    {isLavaBubbling && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white shadow-md animate-pulse" />
                        <div className="absolute bottom-6 left-8 w-7 h-7 rounded-full bg-red-500 animate-bounce transition-all opacity-85 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                        <div className="absolute bottom-14 right-10 w-9 h-9 rounded-full bg-purple-600 animate-pulse transition-all opacity-85 shadow-[0_0_14px_rgba(168,85,247,0.8)]" />
                        <div className="absolute top-28 left-16 w-8 h-8 rounded-full bg-orange-500 animate-bounce transition-all opacity-85 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-800 rounded-b-2xl" />
                  </div>

                  <button
                    onClick={() => setNightLightOn(!nightLightOn)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition shadow-sm ${
                      nightLightOn
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>{nightLightOn ? 'Đang bật Chế độ Đèn Ngủ Dạ Quang ✨' : 'Bật Chế độ Đèn Ngủ Dạ Quang'}</span>
                  </button>
                </div>

                {/* Right side: Instructions */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>4 Bước Chế Tạo Đèn Dung Nham</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                        Bước {lavaStep}/4
                      </span>
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 1 ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                        <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">1</span>
                        <span>Rót nước lọc vào 1/3 bình (Nước nặng nằm dưới)</span>
                      </div>
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 2 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">2</span>
                        <span>Rót dầu ăn đầy bình (Dầu nhẹ hơn nổi lên trên)</span>
                      </div>
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 3 ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">3</span>
                        <span>Nhỏ giọt màu (Giọt màu chìm qua dầu vào nước)</span>
                      </div>
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 4 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">4</span>
                        <span>Thả viên sủi C (Bọt khí đẩy giọt màu trồi sủi bọt chu kỳ)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {lavaStep < 4 ? (
                        <button
                          onClick={handleNextLavaStep}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs font-mono shadow-md transition"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Thực Hiện Bước Tiếp Theo ({lavaStep + 1}/4)</span>
                        </button>
                      ) : (
                        <div className="flex-1 p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center font-mono">
                          🎉 Đèn Dung Nham đang hoạt động rực rỡ!
                        </div>
                      )}
                      <button onClick={handleResetLava} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* PHẦN 2: SẢN PHẨM KHÁM PHÁ (CHẾ TẠO BÈ CỨU HỘ VƯỢT SÔNG)                 */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Ship className="w-5 h-5 text-emerald-600" />
                  <span>Xưởng Chế Tạo Bè Cứu Hộ Vượt Sông</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lắp ráp các vật liệu nổi để tạo chiếc bè chở được số lượng hành khách hoặc đồ vật (sỏi) qua sông.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                  Sức chở: {totalBuoyancy}g | Tải thực: {totalWeight}g
                </span>
                <button
                  onClick={() => { setOnboardPassengers([]); setRaftLaunched(false); }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: River Simulation with Floating Raft (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative w-full h-[380px] rounded-3xl border-4 border-emerald-500/50 bg-gradient-to-b from-sky-200 via-sky-300/60 to-blue-400/50 dark:from-slate-900 dark:via-sky-950/40 dark:to-blue-900/60 overflow-hidden shadow-xl p-4 flex flex-col justify-between">
                  <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-emerald-600 to-emerald-700/80 border-r-2 border-emerald-800/40 flex flex-col items-center justify-center p-2 z-10">
                    <span className="text-[10px] font-bold text-white font-mono [writing-mode:vertical-lr] tracking-widest">
                      🚩 BẾN XUẤT PHÁT
                    </span>
                  </div>

                  <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-emerald-600 to-emerald-700/80 border-l-2 border-emerald-800/40 flex flex-col items-center justify-center p-2 z-10">
                    <span className="text-[10px] font-bold text-white font-mono [writing-mode:vertical-lr] tracking-widest">
                      🏁 BỜ BÊN KIA
                    </span>
                  </div>

                  {isOverloaded && (
                    <div className="relative z-20 mx-auto px-3 py-1.5 rounded-full bg-rose-500/90 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg animate-bounce">
                      <AlertTriangle className="w-4 h-4" />
                      <span>CẢNH BÁO: Quá tải! Nước tràn làm chìm bè!</span>
                    </div>
                  )}

                  {/* The Raft */}
                  <div
                    style={{
                      transform: raftLaunched
                        ? journeySuccess
                          ? 'translateX(140px)'
                          : 'translateX(70px) translateY(80px) rotate(15deg)'
                        : 'translateX(0px)',
                      transition: 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    className={`relative z-20 mx-auto my-auto w-64 p-3 rounded-2xl border-4 transition-all ${
                      raftSunk
                        ? 'bg-blue-900/80 border-rose-500 opacity-60'
                        : isOverloaded
                        ? 'bg-amber-100 dark:bg-amber-900/60 border-rose-500 ring-4 ring-rose-400/40'
                        : 'bg-amber-200/90 dark:bg-amber-900/80 border-amber-600 dark:border-amber-500 shadow-2xl'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-center font-bold text-amber-900 dark:text-amber-200 border-b border-amber-400/40 pb-1 mb-2">
                      BÈ CỨU HỘ ({totalBuoyancy}g sức nâng)
                    </div>

                    <div className="min-h-[70px] grid grid-cols-3 gap-1.5 items-center justify-center p-1 bg-white/40 dark:bg-black/20 rounded-xl">
                      {onboardPassengers.length === 0 ? (
                        <div className="col-span-3 text-center text-[10px] text-amber-900/70 dark:text-amber-300 italic py-2">
                          Chưa có hành khách. Hãy xếp ở bảng bên phải!
                        </div>
                      ) : (
                        onboardPassengers.map((p, idx) => (
                          <div
                            key={p.id}
                            onClick={() => handleRemovePassenger(idx)}
                            className="p-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-700 flex flex-col items-center cursor-pointer hover:bg-rose-100 transition shadow-2xs group"
                            title="Bấm để đưa khách rời bè"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">{p.icon}</span>
                            <span className="text-[8px] font-mono text-slate-700 dark:text-slate-300">{p.weightGrams}g</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="relative z-20 flex items-center justify-center gap-3">
                    <button
                      onClick={handleLaunchRaft}
                      disabled={raftLaunched && journeySuccess}
                      className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs font-mono shadow-lg transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{raftLaunched && journeySuccess ? 'ĐÃ SANG BỜ AN TOÀN' : 'KHỞI HÀNH QUA SÔNG'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Materials & Passengers (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>1. Vật Liệu Ghép Bè</span>
                    <span className="text-emerald-600 text-[10px] font-mono">+ Sức nâng</span>
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                      <span>🧱 Tấm xốp EVA (+35g)</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('foam')} className="p-1 rounded bg-slate-100"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.foam || 0}</span>
                        <button onClick={() => handleAddMaterial('foam')} className="p-1 rounded bg-slate-100"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                      <span>🥤 Ống hút nhựa (+15g)</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('straws')} className="p-1 rounded bg-slate-100"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.straws || 0}</span>
                        <button onClick={() => handleAddMaterial('straws')} className="p-1 rounded bg-slate-100"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                      <span>🔘 Nắp chai nhựa (+12g)</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('caps')} className="p-1 rounded bg-slate-100"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.caps || 0}</span>
                        <button onClick={() => handleAddMaterial('caps')} className="p-1 rounded bg-slate-100"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                      <span>🪵 Que kem gỗ (+10g)</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('sticks')} className="p-1 rounded bg-slate-100"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.sticks || 0}</span>
                        <button onClick={() => handleAddMaterial('sticks')} className="p-1 rounded bg-slate-100"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>2. Xếp Hành Khách / Sỏi Lên Bè</span>
                    <span className="text-sky-600 text-[10px] font-mono">Bấm để xếp</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {PASSENGERS_POOL.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAddPassenger(p)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex flex-col items-center justify-center transition hover:scale-105 shadow-xs"
                      >
                        <span className="text-2xl">{p.icon}</span>
                        <span className="text-[10px] font-medium text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">{p.name}</span>
                        <span className="text-[9px] font-mono text-slate-500">+{p.weightGrams}g</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RotateCcw, 
  Play, 
  Search, 
  Volume2, 
  VolumeX, 
  ArrowUp,
  Trophy,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  onBackToTable?: () => void;
}

// 10 Preschool Familiar Items for the Sensory Play Tank
export interface TankObject {
  id: string;
  name: string;
  icon: string;
  weightGrams: number;
  volumeMl: number; // Volume for Archimedes displacement
  floatsDefault: boolean; // floats in fresh water
  desc: string;
  densityNote: string;
  // Dynamic physics states
  inTank: boolean;
  x: number; // pixel x position in tank
  y: number; // pixel y position in tank
  vx: number; // px/s
  vy: number; // px/s
  angle: number; // degrees
  vRot: number; // deg/s
  settled: boolean;
  status: 'basket' | 'falling' | 'floating' | 'sunk' | 'pushed';
}

const PLAY_ITEMS_PRESETS: TankObject[] = [
  { id: 'item-pebble', name: 'Hòn sỏi', icon: '🪨', weightGrams: 50, volumeMl: 20, floatsDefault: false, desc: 'Đá tự nhiên', densityNote: 'Đặc ruột và nặng hơn nước ngọt nên chìm thẳng xuống đáy', inTank: false, x: 120, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-spoon', name: 'Thìa inox', icon: '🥄', weightGrams: 35, volumeMl: 7, floatsDefault: false, desc: 'Kim loại phẳng', densityNote: 'Kim loại đặc nặng, chao đảo liệng nhẹ khi chìm xuống', inTank: false, x: 170, y: 50, vx: 0, vy: 0, angle: -15, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-pingpong', name: 'Bóng bàn', icon: '⚪', weightGrams: 3, volumeMl: 40, floatsDefault: true, desc: 'Nhựa rỗng chứa khí', densityNote: 'Rất nhẹ và chứa đầy không khí; dìm xuống đáy sẽ phóng vọt lên!', inTank: false, x: 220, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-duck', name: 'Vịt cao su', icon: '🐥', weightGrams: 12, volumeMl: 55, floatsDefault: true, desc: 'Cao su rỗng ruột', densityNote: 'Rất nhẹ, dập dềnh bồng bềnh theo từng đợt sóng nước', inTank: false, x: 270, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-wood', name: 'Khối gỗ', icon: '🪵', weightGrams: 28, volumeMl: 45, floatsDefault: true, desc: 'Gỗ khô', densityNote: 'Nhẹ hơn nước ngọt, nổi vững chãi chìm khoảng một nửa', inTank: false, x: 320, y: 50, vx: 0, vy: 0, angle: 5, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-leaf', name: 'Chiếc lá tươi', icon: '🍃', weightGrams: 1, volumeMl: 5, floatsDefault: true, desc: 'Lá cây tự nhiên', densityNote: 'Bản rộng và siêu nhẹ, lượn êm dịu nằm trên mặt nước', inTank: false, x: 370, y: 50, vx: 0, vy: 0, angle: 10, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-foam', name: 'Mẩu xốp', icon: '🧱', weightGrams: 2, volumeMl: 35, floatsDefault: true, desc: 'Xốp bọt biển', densityNote: 'Hàng triệu lỗ khí li ti, nổi sát trên bề mặt nước', inTank: false, x: 420, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-apple', name: 'Quả táo', icon: '🍎', weightGrams: 75, volumeMl: 90, floatsDefault: true, desc: 'Trái cây ruột xốp', densityNote: 'Ruột táo chứa tới 25% túi khí nên nổi được trên mặt nước', inTank: false, x: 470, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-egg', name: 'Quả trứng', icon: '🥚', weightGrams: 55, volumeMl: 50, floatsDefault: false, desc: 'Trứng gà tươi', densityNote: 'Nặng hơn nước ngọt nên chìm, nhưng sẽ NỔI BỒNG BỀNH khi nước đủ mặn!', inTank: false, x: 520, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-keys', name: 'Chùm chìa khóa', icon: '🔑', weightGrams: 42, volumeMl: 10, floatsDefault: false, desc: 'Kim loại nặng', densityNote: 'Kim loại đặc, rơi thẳng tắp tạo tiếng tõm và va cát', inTank: false, x: 570, y: 50, vx: 0, vy: 0, angle: 25, vRot: 0, settled: false, status: 'basket' }
];

interface SurfaceRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface WaterDroplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
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

interface SandDustParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

interface SaltParticle {
  id: number;
  x: number;
  y: number;
  vy: number;
  size: number;
  alpha: number;
}

export const SimSinkOrFloatLab: React.FC<Props> = () => {
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mascot guidance message
  const [message, setMessage] = useState<string>(
    'Chào các bạn nhỏ! Bé hãy chọn một đồ vật ở Khay đồ chơi để thả vào bể nước, hoặc ấn dìm quả bóng xuống đáy xem nhé!'
  );

  // Tools & modes
  const [activeTool, setActiveTool] = useState<'hand' | 'net'>('hand');
  const [showXRay, setShowXRay] = useState(false);

  // Items in simulation
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const itemsRef = useRef<TankObject[]>(PLAY_ITEMS_PRESETS);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [holdingPos, setHoldingPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [submergingItemId, setSubmergingItemId] = useState<string | null>(null);

  // Pointer fling tracking
  const pointerHistory = useRef<{ x: number; y: number; time: number }[]>([]);
  const lastStirSoundTime = useRef<number>(0);
  const lastCavitationTime = useRef<number>(0);

  // Salinity State & Realistic Hands-on Animation (Spoon + Stirring rod)
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 to 5 spoons
  const waterDensity = 1.00 + saltSpoons * 0.035; // 1.00 -> 1.175 g/cm³
  const [saltAnimation, setSaltAnimation] = useState<'idle' | 'scooping' | 'pouring' | 'stirring'>('idle');
  const [spoonPos, setSpoonPos] = useState<{ x: number; y: number; rotation: number }>({ x: 0, y: 0, rotation: 0 });
  const [stirringRodAngle, setStirringRodAngle] = useState<number>(0);

  // Drop race mode: comparing 2 items dropped simultaneously
  const [raceModeActive, setRaceModeActive] = useState<boolean>(false);
  const [raceSlotA, setRaceSlotA] = useState<string>('item-pebble');
  const [raceSlotB, setRaceSlotB] = useState<string>('item-pingpong');
  const [raceRunning, setRaceRunning] = useState<boolean>(false);

  // Tank DOM measurement & water geometry constants
  const tankRef = useRef<HTMLDivElement | null>(null);
  const BASE_WATER_SURFACE_Y = 160; // Natural surface level in 480px tall tank
  const TANK_BOTTOM_Y = 410; // Sand bed collision plane

  // Archimedes water displacement (mực nước dâng)
  const totalVolumeInWater = items
    .filter((i) => i.inTank)
    .reduce((sum, i) => sum + i.volumeMl, 0);
  const waterLevelRisePx = Math.min(38, Math.round(totalVolumeInWater * 0.1));
  const currentWaterSurfaceY = BASE_WATER_SURFACE_Y - waterLevelRisePx;
  // The visual wave path sits at currentWaterSurfaceY + 20px
  const visualWaterLineY = currentWaterSurfaceY + 20;

  // Wave springs & Particle systems
  const [waveSprings, setWaveSprings] = useState<number[]>(() => Array(40).fill(0));
  const waveVelocities = useRef<number[]>(Array(40).fill(0));
  const [surfaceRipples, setSurfaceRipples] = useState<SurfaceRipple[]>([]);
  const [waterDroplets, setWaterDroplets] = useState<WaterDroplet[]>([]);
  const [bubbles, setBubbles] = useState<BubbleParticle[]>([]);
  const [sandDust, setSandDust] = useState<SandDustParticle[]>([]);
  const [saltParticles, setSaltParticles] = useState<SaltParticle[]>([]);

  // Toggle Fullscreen mode
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Water splash ripples & sound
  const createWaterSplash = useCallback((xPx: number, isHeavy: boolean, impactSpeed: number = 100) => {
    if (soundEnabled) {
      soundEngine.playWaterSplash(isHeavy || impactSpeed > 250);
    }

    // 1. Disturb wave springs near impact
    if (tankRef.current) {
      const tankWidth = tankRef.current.clientWidth || 700;
      const nodeIndex = Math.min(39, Math.max(0, Math.floor((xPx / tankWidth) * 40)));
      const baseForce = Math.min(35, Math.max(12, impactSpeed * 0.1));
      waveVelocities.current[nodeIndex] = baseForce;
      if (nodeIndex > 0) waveVelocities.current[nodeIndex - 1] = baseForce * 0.7;
      if (nodeIndex < 39) waveVelocities.current[nodeIndex + 1] = baseForce * 0.7;
      if (nodeIndex > 1) waveVelocities.current[nodeIndex - 2] = baseForce * 0.4;
      if (nodeIndex < 38) waveVelocities.current[nodeIndex + 2] = baseForce * 0.4;
    }

    // 2. Realistic Concentric Surface Ripples
    const newRipples: SurfaceRipple[] = [
      {
        id: Date.now() + Math.random(),
        x: xPx,
        y: visualWaterLineY,
        radius: 4,
        maxRadius: isHeavy ? 50 : 32,
        alpha: 0.85
      }
    ];
    setSurfaceRipples((prev) => [...prev.slice(-8), ...newRipples]);

    // 3. 2-3 gentle droplets for heavy drops
    if (isHeavy || impactSpeed > 220) {
      const newDroplets: WaterDroplet[] = [];
      for (let i = 0; i < 3; i++) {
        newDroplets.push({
          id: Date.now() + Math.random(),
          x: xPx + (Math.random() * 14 - 7),
          y: visualWaterLineY - 4,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -(Math.random() * 2.5 + 1.2),
          alpha: 0.8
        });
      }
      setWaterDroplets((prev) => [...prev.slice(-6), ...newDroplets]);
    }

    // 4. Spawn cavitation bubbles trailing ONLY during water impact
    const bubbleCount = isHeavy ? 6 : 3;
    const newBubbles: BubbleParticle[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 24 - 12),
        y: visualWaterLineY + 12 + i * 14,
        vy: -(Math.random() * 1.5 + 0.8),
        size: Math.random() * 4 + 2,
        wobble: Math.random() * 10,
        alpha: 0.85
      });
    }
    setBubbles((prev) => [...prev.slice(-25), ...newBubbles]);
    if (isHeavy && soundEnabled) soundEngine.playBubbleGlug();
  }, [visualWaterLineY, soundEnabled]);

  // Sand bed dust puff
  const createSandBedDust = useCallback((xPx: number) => {
    if (soundEnabled) {
      soundEngine.playSandThump();
    }
    const newPuffs: SandDustParticle[] = [];
    for (let i = 0; i < 12; i++) {
      newPuffs.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 26 - 13),
        y: TANK_BOTTOM_Y - 5,
        vx: (Math.random() - 0.5) * 30,
        vy: -(Math.random() * 20 + 8),
        size: Math.random() * 6 + 3,
        alpha: 0.7,
        life: 1.0
      });
    }
    setSandDust((prev) => [...prev.slice(-25), ...newPuffs]);
  }, [soundEnabled, TANK_BOTTOM_Y]);

  // 60 FPS 2D PHYSICS ENGINE LOOP
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // 1. Wave Springs Update
      const tension = 0.028;
      const dampening = 0.038;
      const spread = 0.24;

      setWaveSprings((prevSprings) => {
        const next = [...prevSprings];
        const vels = waveVelocities.current;

        for (let i = 0; i < next.length; i++) {
          const force = -tension * next[i] - dampening * vels[i];
          vels[i] += force;
          next[i] += vels[i];
        }

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

      // 2. Surface Ripples
      setSurfaceRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            radius: r.radius + 1.2,
            alpha: r.alpha - 0.025
          }))
          .filter((r) => r.alpha > 0 && r.radius < r.maxRadius)
      );

      // Droplets
      setWaterDroplets((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: d.x + d.vx,
            y: d.y + d.vy,
            vy: d.vy + 0.35,
            alpha: d.alpha - 0.04
          }))
          .filter((d) => d.y < visualWaterLineY + 6 && d.alpha > 0)
      );

      // 3. Sand dust
      setSandDust((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: d.x + d.vx * dt,
            y: d.y + d.vy * dt,
            size: d.size + 0.12,
            alpha: d.alpha - 0.018,
            life: d.life - 0.02
          }))
          .filter((d) => d.life > 0 && d.alpha > 0)
      );

      // 4. Underwater Cavitation Bubbles (float up and disappear at water surface)
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y + b.vy,
            x: b.x + Math.sin(b.y * 0.1 + b.wobble) * 0.6,
            alpha: b.alpha - 0.014
          }))
          .filter((b) => b.y > visualWaterLineY && b.alpha > 0)
      );

      // 5. Salt Particles
      setSaltParticles((prev) =>
        prev
          .map((s) => ({
            ...s,
            y: s.y + s.vy,
            alpha: s.alpha - 0.018
          }))
          .filter((s) => s.y < TANK_BOTTOM_Y && s.alpha > 0)
      );

      // 6. Tank Objects Physics Step
      const currentTankItems = itemsRef.current;
      let hasChanges = false;
      const nextItems = currentTankItems.map((item) => {
        if (!item.inTank || item.id === holdingItemId) return item;
        if (item.status === 'pushed') return item;

        const currentDensity = item.weightGrams / item.volumeMl;
        const willFloatInCurrentLiquid = currentDensity < waterDensity;

        // Immobile once settled on sand bed unless buoyancy changes
        if (item.settled && item.status === 'sunk') {
          if (willFloatInCurrentLiquid) {
            hasChanges = true;
            return {
              ...item,
              status: 'floating' as const,
              settled: false,
              vy: -140
            };
          }
          return item;
        }

        let { x, y, vx, vy, angle, vRot } = item;
        let status = item.status;
        let settled = item.settled;

        // Physical water contact boundary: bottom of item hits visual surface
        const isSubmerged = y >= visualWaterLineY - 14;

        if (!isSubmerged) {
          // Free fall in air
          const gAir = 680;
          vy += gAir * dt;
          vx *= 1 - 0.4 * dt;
          y += vy * dt;
          x += vx * dt;
          angle += vRot * dt;

          if (y >= visualWaterLineY - 14) {
            createWaterSplash(x, !willFloatInCurrentLiquid, Math.abs(vy));
            status = willFloatInCurrentLiquid ? 'floating' : 'sunk';
          }
          hasChanges = true;
        } else {
          // In Water
          const fluidDragY = -5.8 * vy;
          const fluidDragX = -6.2 * vx;

          const equilibriumSubmergedFraction = Math.min(1, currentDensity / waterDensity);
          // ACCURATE WATERLINE RESTING DEPTH:
          // The bottom of the object dips comfortably into the water, eliminating the mid-air floating gap!
          const equilibriumY = visualWaterLineY + (equilibriumSubmergedFraction * 24 - 8);

          if (willFloatInCurrentLiquid) {
            // Harmonic bobbing at waterline
            const displacement = y - equilibriumY;
            const springK = 35;
            const restoringForce = -springK * displacement;

            vy += (restoringForce + fluidDragY) * dt;
            y += vy * dt;
            vx += fluidDragX * dt;
            x += vx * dt;

            if (y < visualWaterLineY - 20 && vy < 0) {
              vy *= 0.5;
            }

            angle += (0 - angle) * 4 * dt;
            vRot *= 0.85;

            if (Math.abs(vy) < 1.5 && Math.abs(displacement) < 1.0) {
              y = equilibriumY;
              vy = 0;
            }
            status = 'floating';
            hasChanges = true;
          } else {
            // Sinking downwards
            const gravityDown = 320;
            const buoyancyFactor = (waterDensity * item.volumeMl - item.weightGrams);
            const archimedesAccel = (buoyancyFactor / item.weightGrams) * 360;
            vy += (gravityDown + archimedesAccel + fluidDragY) * dt;

            // REALISTIC BUBBLES: Only spawn trailing bubbles while actively sinking through water column
            if (vy > 40 && y < TANK_BOTTOM_Y - 25 && currentTime - lastCavitationTime.current > 160) {
              setBubbles((prev) => [
                ...prev.slice(-20),
                {
                  id: Date.now() + Math.random(),
                  x: x + (Math.random() * 12 - 6),
                  y: y + 8,
                  vy: -(Math.random() * 1.6 + 0.8),
                  size: Math.random() * 3.5 + 2,
                  wobble: Math.random() * 10,
                  alpha: 0.75
                }
              ]);
              lastCavitationTime.current = currentTime;
            }

            // Hydrodynamic fluttering wobble while descending
            if (y < TANK_BOTTOM_Y - 14) {
              if (item.id === 'item-spoon') {
                angle = Math.sin(currentTime * 0.007) * 20;
                vx = Math.cos(currentTime * 0.007) * 14;
              } else if (item.id === 'item-leaf') {
                angle = Math.sin(currentTime * 0.004) * 15;
                vx = Math.cos(currentTime * 0.004) * 8;
              } else {
                angle += (0 - angle) * 2 * dt;
                vx += fluidDragX * dt;
              }
              y += vy * dt;
              x += vx * dt;
            }

            // Sand bed collision
            if (y >= TANK_BOTTOM_Y - 14) {
              if (vy > 35) {
                createSandBedDust(x);
                vy = -vy * 0.15;
                y = TANK_BOTTOM_Y - 14;
              } else {
                y = TANK_BOTTOM_Y - 14;
                vy = 0;
                vx = 0;
                vRot = 0;
                settled = true;
              }
            }
            status = 'sunk';
            hasChanges = true;
          }
        }

        // Clamp walls
        const tankWidth = tankRef.current?.clientWidth || 700;
        if (x < 35) {
          x = 35;
          vx = -vx * 0.3;
        } else if (x > tankWidth - 35) {
          x = tankWidth - 35;
          vx = -vx * 0.3;
        }

        return {
          ...item,
          x,
          y,
          vx,
          vy,
          angle,
          vRot,
          settled,
          status
        };
      });

      if (hasChanges) {
        setItems(nextItems);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [visualWaterLineY, waterDensity, holdingItemId, createWaterSplash, createSandBedDust, TANK_BOTTOM_Y]);

  // Hand interactions: drag, drop, and throw
  const handleStartHold = (item: TankObject, e: React.PointerEvent) => {
    e.preventDefault();
    if (activeTool === 'net') {
      handleScoopItem(item.id);
      return;
    }

    setHoldingItemId(item.id);

    if (tankRef.current) {
      const rect = tankRef.current.getBoundingClientRect();
      const currX = e.clientX - rect.left;
      const currY = e.clientY - rect.top;
      setHoldingPos({ x: currX, y: currY });
      pointerHistory.current = [{ x: currX, y: currY, time: performance.now() }];
    }

    setMessage(`Bé đang cầm "${item.name} ${item.icon}". Bé có thể giơ cao thả rơi tự do hoặc vung nhẹ tay để ném vào bể nhé!`);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!tankRef.current) return;
    const rect = tankRef.current.getBoundingClientRect();
    const currX = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const currY = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    const now = performance.now();
    pointerHistory.current.push({ x: currX, y: currY, time: now });
    if (pointerHistory.current.length > 5) {
      pointerHistory.current.shift();
    }

    if (holdingItemId) {
      setHoldingPos({ x: currX, y: currY });
    } else if (activeTool === 'hand' && e.buttons === 1) {
      // Finger stirring
      if (currY >= visualWaterLineY - 20 && currY <= TANK_BOTTOM_Y) {
        const tankWidth = rect.width || 700;
        const nodeIndex = Math.min(39, Math.max(0, Math.floor((currX / tankWidth) * 40)));
        waveVelocities.current[nodeIndex] = 12;

        setItems((prev) =>
          prev.map((i) => {
            if (i.inTank && i.status === 'floating' && Math.abs(i.x - currX) < 60) {
              return { ...i, vx: i.vx + (currX > i.x ? -15 : 15) };
            }
            return i;
          })
        );

        if (soundEnabled && now - lastStirSoundTime.current > 180) {
          soundEngine.playWaterStir();
          lastStirSoundTime.current = now;
        }
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

    let flingVx = 0;
    let flingVy = 0;
    const history = pointerHistory.current;
    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dtSec = (last.time - first.time) / 1000;
      if (dtSec > 0.01) {
        flingVx = Math.min(450, Math.max(-450, (last.x - first.x) / dtSec));
        flingVy = Math.min(500, Math.max(-450, (last.y - first.y) / dtSec));
      }
    }

    const droppedFromAir = holdingPos.y < visualWaterLineY;
    const currentDensity = item.weightGrams / item.volumeMl;
    const willFloat = currentDensity < waterDensity;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inTank: true,
              x: holdingPos.x,
              y: holdingPos.y,
              vx: flingVx * 0.75,
              vy: Math.max(flingVy * 0.75, droppedFromAir ? 60 : 0),
              status: willFloat ? 'floating' : 'sunk'
            }
          : i
      )
    );

    if (!droppedFromAir || Math.abs(holdingPos.y - visualWaterLineY) < 25) {
      createWaterSplash(holdingPos.x, !willFloat, Math.max(80, Math.abs(flingVy)));
    }

    if (willFloat) {
      setMessage(`💧 ${item.name} rơi xuống và NỔI BỒNG BỀNH trên mặt nước! ${item.densityNote}.`);
      if (soundEnabled) soundEngine.playWaterDrop();
    } else {
      setMessage(`⚓ ${item.name} rơi xuống và CHÌM XUỐNG ĐÁY! ${item.densityNote}.`);
    }

    setHoldingItemId(null);
  };

  // Push down floating item & Pop up rocket
  const handlePushDownItem = (item: TankObject, e: React.PointerEvent) => {
    e.stopPropagation();
    if (!item.inTank) return;
    const currentDensity = item.weightGrams / item.volumeMl;
    const willFloat = currentDensity < waterDensity;
    if (!willFloat) return;

    setSubmergingItemId(item.id);
    setMessage(`Bé đang ấn dìm ${item.name} xuống đáy nước! Nước đang đẩy ngược lại rất mạnh. Bé hãy buông tay ra xem nào!`);

    if (soundEnabled) {
      soundEngine.playBubbleGlug();
    }

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, y: TANK_BOTTOM_Y - 25, vy: 0, status: 'pushed' } : i))
    );
  };

  const handleReleaseSubmergedItem = () => {
    if (!submergingItemId) return;
    const item = items.find((i) => i.id === submergingItemId);
    if (!item) {
      setSubmergingItemId(null);
      return;
    }

    if (soundEnabled) {
      soundEngine.playBuoyantPop();
    }

    // Rocket upwards
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              vy: -430,
              status: 'floating'
            }
          : i
      )
    );

    // Trailing bubbles behind rocket
    const newBubbles: BubbleParticle[] = [];
    for (let k = 0; k < 8; k++) {
      newBubbles.push({
        id: Date.now() + Math.random(),
        x: item.x + (Math.random() * 20 - 10),
        y: TANK_BOTTOM_Y - 15 - k * 18,
        vy: -(Math.random() * 2 + 1.2),
        size: Math.random() * 5 + 3,
        wobble: Math.random() * 8,
        alpha: 0.9
      });
    }
    setBubbles((prev) => [...prev, ...newBubbles]);

    setMessage(`🚀 VÈO... BẬT LÊN RỒI! ${item.name} bị dìm xuống đáy đã phóng vút lên mặt nước! Lực đẩy của nước quá mạnh mẽ!`);
    setSubmergingItemId(null);
  };

  // =========================================================================
  // REALISTIC HANDS-ON SALT EXPERIMENT (SPOON SCOOP + POUR + STIRRING ROD)
  // =========================================================================
  const handleTriggerAddSalt = () => {
    if (saltAnimation !== 'idle') return;
    if (saltSpoons >= 5) {
      setMessage('Bể nước đã bão hòa muối biển cực đậm đặc! Nước mặn đến mức có thể nâng được nhiều vật nặng.');
      return;
    }

    const tankWidth = tankRef.current?.clientWidth || 700;
    const pourTargetX = tankWidth * 0.5;

    // Step 1: Hand holding spoon scoops salt from jar
    setSaltAnimation('scooping');
    setSpoonPos({ x: tankWidth * 0.2, y: 70, rotation: -10 });
    setMessage('Bàn tay đang cầm thìa xúc muối từ hũ đưa vào bể nước...');
    if (soundEnabled) soundEngine.playSpoonClink();

    // Step 2: Spoon moves to center and pours salt crystals
    setTimeout(() => {
      setSaltAnimation('pouring');
      setSpoonPos({ x: pourTargetX, y: 65, rotation: 42 });
      if (soundEnabled) soundEngine.playSaltPour();

      // Spawn falling salt crystals
      const newSalt: SaltParticle[] = [];
      for (let i = 0; i < 28; i++) {
        newSalt.push({
          id: Date.now() + Math.random(),
          x: pourTargetX + (Math.random() * 36 - 18),
          y: 75 + Math.random() * 20,
          vy: Math.random() * 3.5 + 2.5,
          size: Math.random() * 3 + 1.5,
          alpha: 0.95
        });
      }
      setSaltParticles((prev) => [...prev, ...newSalt]);
    }, 700);

    // Step 3: Stirring rod dips into water and stirs in circular loop
    setTimeout(() => {
      setSaltAnimation('stirring');
      setMessage('Đũa khuấy đang xoay tròn trong nước để hòa tan các hạt muối...');
      if (soundEnabled) soundEngine.playWaterStir();

      // Create gentle swirling ripples at surface
      const nodeCenter = Math.floor(40 * 0.5);
      waveVelocities.current[nodeCenter] = 16;
      waveVelocities.current[nodeCenter - 1] = 12;
      waveVelocities.current[nodeCenter + 1] = 12;

      // Animate stirring rod rotation
      let angle = 0;
      const stirInterval = setInterval(() => {
        angle += 45;
        setStirringRodAngle(angle);
      }, 90);

      // Step 4: Finish dissolving, update salinity and check egg
      setTimeout(() => {
        clearInterval(stirInterval);
        const nextSpoons = saltSpoons + 1;
        setSaltSpoons(nextSpoons);
        setSaltAnimation('idle');

        const newDensity = 1.00 + nextSpoons * 0.035;
        const eggItem = itemsRef.current.find((i) => i.id === 'item-egg');

        if (nextSpoons >= 3 && eggItem && eggItem.inTank) {
          setMessage(
            `🧂 KỲ DIỆU CHƯA! Đã hòa tan ${nextSpoons} thìa muối! Nước mặn đặc hơn quả trứng, nâng Quả Trứng TỰ NỔI LÊN MẶT NƯỚC giống như hiện tượng ở Biển Chết!`
          );
          if (soundEnabled) soundEngine.playMagicChime();
        } else {
          setMessage(
            `🧂 Bé vừa hòa tan thêm 1 thìa muối! Nước đặc hơn một chút (tỷ trọng ${newDensity.toFixed(2)}). Nước càng mặn thì sức nâng càng lớn!`
          );
        }
      }, 1600);
    }, 1800);
  };

  const handleResetSalt = () => {
    if (saltAnimation !== 'idle') return;
    setSaltSpoons(0);
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay bằng nước ngọt tinh khiết mới! Quả trứng lại chìm nghỉm xuống đáy cát.');
  };

  // Scoop item out with net tool
  const handleScoopItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (soundEnabled) {
      soundEngine.playNetScoop();
    }

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, inTank: false, status: 'basket', y: 50, vy: 0, vx: 0 } : i))
    );
    setMessage(`Bé đã dùng vợt vớt ${item.name} cất lại vào khay đồ chơi!`);
  };

  const handleResetAllTank = () => {
    setItems(PLAY_ITEMS_PRESETS);
    setHoldingItemId(null);
    setSubmergingItemId(null);
    if (soundEnabled) soundEngine.playNetScoop();
    setMessage('Đã vớt sạch bể nước! Khay đồ chơi đã đầy đủ để bé thử nghiệm lại.');
  };

  // Quick drop item from Toy Shelf into Tank
  const handleDropItemFromShelf = (item: TankObject) => {
    if (item.inTank) return;
    const tankWidth = tankRef.current?.clientWidth || 700;
    const dropX = Math.random() * (tankWidth * 0.6) + tankWidth * 0.2;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inTank: true,
              x: dropX,
              y: 45,
              vx: (Math.random() - 0.5) * 40,
              vy: 70,
              status: 'falling'
            }
          : i
      )
    );
    setMessage(`Bé vừa thả ${item.name} ${item.icon} từ trên cao rơi vào bể nước!`);
  };

  // Drop race: 2 items dropped simultaneously
  const handleStartRace = () => {
    const itemA = items.find((i) => i.id === raceSlotA);
    const itemB = items.find((i) => i.id === raceSlotB);
    if (!itemA || !itemB) return;

    const tankWidth = tankRef.current?.clientWidth || 700;

    setRaceRunning(true);
    setMessage('Chuẩn bị... 3... 2... 1... THẢ 2 VẬT CÙNG LÚC TỪ TRÊN CAO!');

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemA.id) {
          return {
            ...i,
            inTank: true,
            x: tankWidth * 0.35,
            y: 40,
            vx: 0,
            vy: 0,
            status: 'falling'
          };
        }
        if (i.id === itemB.id) {
          return {
            ...i,
            inTank: true,
            x: tankWidth * 0.65,
            y: 40,
            vx: 0,
            vy: 0,
            status: 'falling'
          };
        }
        return i;
      })
    );

    setTimeout(() => {
      setRaceRunning(false);
      const aDensity = itemA.weightGrams / itemA.volumeMl;
      const bDensity = itemB.weightGrams / itemB.volumeMl;
      const aFloats = aDensity < waterDensity;
      const bFloats = bDensity < waterDensity;

      setMessage(
        `🏁 KẾT QUẢ ĐUA: ${itemA.name} ${aFloats ? 'NỔI' : 'CHÌM'}, còn ${itemB.name} ${bFloats ? 'NỔI' : 'CHÌM'}! To hay nhỏ không quyết định, mà do chất liệu và không khí bên trong!`
      );
    }, 1600);
  };

  return (
    <div 
      ref={containerRef}
      className={`select-none transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md p-3 sm:p-5 flex flex-col justify-between overflow-y-auto' 
          : 'space-y-4'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. DEDICATED TOOLBAR (THANH ĐIỀU KHIỂN RIÊNG BIỆT - GỌN GÀNG, TẬP TRUNG)    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0c121e] border-2 border-emerald-500/70 rounded-2xl p-3 shadow-md space-y-3">
        {/* Top Control Bar: Tools, Salt Shaker, Drop Race, Audio, Fullscreen */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Group A: Salt Experiment Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl">
              <span className="text-xl ml-1">🧂</span>
              <button
                onClick={handleTriggerAddSalt}
                disabled={saltAnimation !== 'idle' || saltSpoons >= 5}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono shadow-xs transition"
                title="Xúc thìa muối đổ vào bể và khuấy tan"
              >
                <span>Thêm Muối ({saltSpoons}/5 thìa)</span>
              </button>

              {saltSpoons > 0 && (
                <button
                  onClick={handleResetSalt}
                  disabled={saltAnimation !== 'idle'}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold hover:bg-amber-100 transition"
                  title="Thay bằng nước ngọt"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tool: Hand vs Net */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono">
              <button
                onClick={() => setActiveTool('hand')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeTool === 'hand'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Cầm nắm, ném và khuấy nước bằng tay"
              >
                <span>🖐️ Tay cầm</span>
              </button>

              <button
                onClick={() => setActiveTool('net')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeTool === 'net'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Vợt vớt đồ vật trong bể về khay"
              >
                <span>🧺 Vợt vớt</span>
              </button>
            </div>
          </div>

          {/* Group B: Compare Race & X-Ray & Utility buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRaceModeActive(!raceModeActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                raceModeActive
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{raceModeActive ? 'Đóng Đua Thả' : 'Đua Thả 2 Vật'}</span>
            </button>

            <button
              onClick={() => setShowXRay(!showXRay)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                showXRay
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{showXRay ? 'Tắt X-Ray' : 'Kính Lúp X-Ray (Túi khí)'}</span>
            </button>

            <button
              onClick={handleResetAllTank}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold transition"
              title="Vớt toàn bộ đồ vật về khay"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dọn bể</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold shadow-xs transition"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to Toàn màn hình'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Thu nhỏ</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Toàn màn hình</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Drop Race bridge (if enabled) */}
        {raceModeActive && (
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-purple-900 dark:text-purple-200">Vật A:</span>
                <select
                  value={raceSlotA}
                  onChange={(e) => setRaceSlotA(e.target.value)}
                  className="text-xs font-mono font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-purple-300 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                  ))}
                </select>
              </div>

              <span className="text-xs font-bold text-purple-600">VS</span>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-purple-900 dark:text-purple-200">Vật B:</span>
                <select
                  value={raceSlotB}
                  onChange={(e) => setRaceSlotB(e.target.value)}
                  className="text-xs font-mono font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-purple-300 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleStartRace}
              disabled={raceRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs font-mono shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Thả cùng lúc!</span>
            </button>
          </div>
        )}

        {/* Khay Đồ Chơi (Toy Shelf): Horizontally scrollable or clean grid of 10 items */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <span>🧺 Khay đồ chơi của bé:</span>
              <span className="text-slate-400 font-normal">(Bấm hoặc kéo thả trực tiếp vào bể nước)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Còn {items.filter(i => !i.inTank).length}/10 món trên khay
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
            {items.map((item) => {
              const isInTank = item.inTank;
              const willFloat = (item.weightGrams / item.volumeMl) < waterDensity;

              return (
                <div
                  key={item.id}
                  onPointerDown={(e) => {
                    if (!isInTank) handleStartHold(item, e);
                  }}
                  onClick={() => {
                    if (!isInTank) handleDropItemFromShelf(item);
                  }}
                  className={`flex-shrink-0 w-24 p-2 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                    isInTank
                      ? 'opacity-35 bg-slate-100 dark:bg-slate-900 border-dashed border-slate-300 cursor-default'
                      : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 hover:border-emerald-500 hover:scale-105 shadow-2xs cursor-grab active:cursor-grabbing'
                  }`}
                  title={isInTank ? 'Đang trong bể' : 'Bấm để thả rơi hoặc kéo thả vào bể'}
                >
                  <span className="text-3xl mb-0.5">{item.icon}</span>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {item.weightGrams}g
                  </span>

                  {showXRay && (
                    <span className="mt-0.5 text-[8px] font-mono font-bold text-purple-700 dark:text-purple-300">
                      {willFloat ? 'Túi khí' : 'Đặc ruột'}
                    </span>
                  )}
                  {isInTank && (
                    <span className="mt-0.5 text-[8px] font-mono text-emerald-600 font-bold">
                      ✓ Trong bể
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE CLEAN, NATURAL, LARGE PHYSICS WATER TANK (KHUNG MÔ PHỎNG TRỌNG TÂM)  */}
      {/* ========================================================================= */}
      <div
        ref={tankRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-full rounded-3xl border-4 border-sky-400/80 dark:border-sky-500/50 bg-gradient-to-b from-sky-100/40 via-sky-200/30 to-blue-300/40 dark:from-slate-950 dark:via-blue-950/40 dark:to-blue-900/40 overflow-hidden shadow-2xl flex flex-col justify-end touch-none cursor-default ${
          isFullscreen ? 'flex-1 min-h-[480px]' : 'h-[460px] sm:h-[480px]'
        }`}
      >
        {/* Subtle Waterline Ruler etched on glass edge (Thước đo mực nước kính trong suốt tinh tế) */}
        <div className="absolute top-24 left-3 flex flex-col gap-2 pointer-events-none opacity-40 text-[9px] font-mono text-sky-800 dark:text-sky-200 z-10">
          <div className="flex items-center gap-1">
            <span className="w-3 border-t border-sky-600" />
            <span>500ml</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 border-t border-sky-600" />
            <span>400ml</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 border-t border-sky-600" />
            <span>300ml</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 border-t border-sky-600" />
            <span>200ml</span>
          </div>
        </div>

        {/* Dynamic Spring Wave Surface SVG */}
        <div
          style={{ top: `${currentWaterSurfaceY}px` }}
          className="absolute left-0 right-0 h-4 pointer-events-none z-20 transition-[top] duration-500"
        >
          <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 40">
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
              fill={saltSpoons > 2 ? 'rgba(45, 212, 191, 0.45)' : 'rgba(56, 189, 248, 0.45)'}
            />
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
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Water Body (Clean, clear water with subtle mineral tint depending on salinity) */}
        <div
          style={{ top: `${visualWaterLineY}px` }}
          className={`absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-700 ${
            saltSpoons > 2
              ? 'bg-gradient-to-b from-teal-400/35 via-cyan-500/40 to-blue-600/50'
              : 'bg-gradient-to-b from-sky-400/30 via-sky-500/35 to-blue-600/40'
          }`}
        />

        {/* Natural Sandy Bed at bottom (Đáy cát vàng tự nhiên, không chữ chú thích thừa) */}
        <div className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-t from-amber-300 via-amber-200/80 to-transparent dark:from-amber-950 dark:via-amber-900/60 border-t border-amber-300/40 pointer-events-none z-15" />

        {/* Concentric Surface Ripple Rings */}
        {surfaceRipples.map((r) => (
          <div
            key={r.id}
            style={{
              left: `${r.x}px`,
              top: `${r.y}px`,
              width: `${r.radius * 2}px`,
              height: `${r.radius * 0.65}px`,
              opacity: r.alpha,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full border border-white/80 pointer-events-none z-20 shadow-xs"
          />
        ))}

        {/* Subtle Water Droplets */}
        {waterDroplets.map((d) => (
          <div
            key={d.id}
            style={{
              left: `${d.x}px`,
              top: `${d.y}px`,
              width: '3.5px',
              height: '3.5px',
              opacity: d.alpha
            }}
            className="absolute rounded-full bg-sky-200 dark:bg-white pointer-events-none z-30 shadow-2xs"
          />
        ))}

        {/* Sand Bed Dust Particles on Impact */}
        {sandDust.map((sd) => (
          <div
            key={sd.id}
            style={{
              left: `${sd.x}px`,
              top: `${sd.y}px`,
              width: `${sd.size}px`,
              height: `${sd.size}px`,
              opacity: sd.alpha
            }}
            className="absolute rounded-full bg-amber-400/70 dark:bg-amber-300/60 filter blur-[0.5px] pointer-events-none z-25"
          />
        ))}

        {/* Underwater Cavitation Bubbles (ONLY during descent or buoyant launch) */}
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
            className="absolute rounded-full border border-white/80 bg-white/40 shadow-xs pointer-events-none z-25"
          />
        ))}

        {/* Falling Salt Crystals during pouring */}
        {saltParticles.map((sp) => (
          <div
            key={sp.id}
            style={{
              left: `${sp.x}px`,
              top: `${sp.y}px`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              opacity: sp.alpha
            }}
            className="absolute rounded-sm bg-white shadow-sm pointer-events-none z-30 rotate-45"
          />
        ))}

        {/* REALISTIC HAND-HELD SPOON & STIRRING ANIMATION OVERLAY */}
        {saltAnimation !== 'idle' && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {/* Hand + Spoon */}
            {(saltAnimation === 'scooping' || saltAnimation === 'pouring') && (
              <div
                style={{
                  left: `${spoonPos.x}px`,
                  top: `${spoonPos.y}px`,
                  transform: `translate(-50%, -50%) rotate(${spoonPos.rotation}deg)`,
                  transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className="absolute flex items-center filter drop-shadow-xl"
              >
                <span className="text-5xl">🥄</span>
                <span className="text-3xl -ml-2 -mt-4">🖐️</span>
              </div>
            )}

            {/* Stirring Rod dipping into water and rotating */}
            {saltAnimation === 'stirring' && (
              <div
                style={{
                  left: '50%',
                  top: `${visualWaterLineY + 20}px`,
                  transform: `translate(-50%, -50%) rotate(${stirringRodAngle}deg)`,
                  transition: 'transform 0.08s linear'
                }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-2.5 h-32 bg-gradient-to-b from-sky-100 via-white/80 to-slate-200 rounded-full border border-sky-400 shadow-lg" />
                <div className="w-8 h-8 rounded-full border-2 border-white/70 animate-ping opacity-60 -mt-4" />
              </div>
            )}
          </div>
        )}

        {/* Render Physics Objects Inside Tank */}
        <div className="relative w-full h-full z-25 pointer-events-auto">
          {items
            .filter((i) => i.inTank && i.id !== holdingItemId)
            .map((item) => {
              const isSubmerged = item.status === 'pushed';
              const itemDensity = item.weightGrams / item.volumeMl;
              const currentFloats = itemDensity < waterDensity;

              return (
                <div
                  key={item.id}
                  onPointerDown={(e) => {
                    if (activeTool === 'net') {
                      handleScoopItem(item.id);
                    } else if (currentFloats) {
                      handlePushDownItem(item, e);
                    } else {
                      handleStartHold(item, e);
                    }
                  }}
                  onPointerUp={handleReleaseSubmergedItem}
                  style={{
                    position: 'absolute',
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    transform: `translate(-50%, -50%) rotate(${item.angle}deg)`,
                    transition: isSubmerged ? 'all 0.1s ease' : 'none'
                  }}
                  className={`group cursor-grab active:cursor-grabbing flex flex-col items-center select-none ${
                    isSubmerged ? 'scale-125' : 'hover:scale-110'
                  }`}
                  title={
                    activeTool === 'net'
                      ? 'Bấm để vớt vào khay'
                      : currentFloats
                      ? 'ẤN GIỮ ĐỂ DÌM XUỐNG ĐÁY & BUÔNG TAY ĐỂ BẮN VỌT LÊN!'
                      : 'Bấm giữ để cầm lên ném lại'
                  }
                >
                  {/* Submerge indicator arrows */}
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

                  {/* Floating Hint */}
                  {currentFloats && !isSubmerged && (
                    <div className="text-[8px] font-mono text-sky-800 dark:text-sky-200 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-900/80 px-1 rounded shadow-2xs mt-0.5 pointer-events-none">
                      👇 Ấn dìm
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Dragged / Held Item in air */}
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
              🖐️ Thả rơi hoặc vung tay ném!
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. Ô GIẢI THÍCH SƯ PHẠM (ĐẶT PHÍA DƯỚI - RÕ RÀNG, DỄ HIỂU, TẬP TRUNG)    */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
            👩‍🏫
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Cô Mimi Dẫn Dắt &amp; Giải Thích:</span>
            </h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Compact Knowledge Badge for Teachers/Parents */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
            <span>Mực nước dâng: </span>
            <strong className="text-emerald-600 font-bold">+{waterLevelRisePx}mm</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs font-mono text-amber-900 dark:text-amber-200 shadow-2xs">
            <span>Nước: </span>
            <strong className="font-bold">{saltSpoons === 0 ? 'Nước ngọt' : `Nước muối (${saltSpoons} thìa)`}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

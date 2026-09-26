import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Trophy,
  Beaker
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
  { id: 'item-pebble', name: 'Hòn sỏi', icon: '🪨', weightGrams: 50, volumeMl: 20, floatsDefault: false, desc: 'Đá tự nhiên', densityNote: 'Đặc và nặng hơn nước (d = 2.5 g/cm³), chìm thẳng xuống đáy', inTank: false, x: 120, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-spoon', name: 'Thìa inox', icon: '🥄', weightGrams: 35, volumeMl: 7, floatsDefault: false, desc: 'Kim loại phẳng', densityNote: 'Kim loại nặng (d = 5.0 g/cm³), chao đảo liệng nghiêng khi chìm', inTank: false, x: 170, y: 50, vx: 0, vy: 0, angle: -15, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-pingpong', name: 'Bóng bàn', icon: '⚪', weightGrams: 3, volumeMl: 40, floatsDefault: true, desc: 'Nhựa rỗng chứa khí', densityNote: 'Siêu nhẹ (d = 0.08 g/cm³), bập bềnh cao; dìm xuống đáy sẽ phóng vọt lên!', inTank: false, x: 220, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-duck', name: 'Vịt cao su', icon: '🐥', weightGrams: 12, volumeMl: 55, floatsDefault: true, desc: 'Cao su rỗng ruột', densityNote: 'Rất nhẹ (d = 0.22 g/cm³), dập dềnh bồng bềnh theo từng đợt sóng nước', inTank: false, x: 270, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-wood', name: 'Khối gỗ', icon: '🪵', weightGrams: 28, volumeMl: 45, floatsDefault: true, desc: 'Gỗ khô', densityNote: 'Nhẹ hơn nước (d = 0.62 g/cm³), nổi vững chãi chìm khoảng một nửa', inTank: false, x: 320, y: 50, vx: 0, vy: 0, angle: 5, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-leaf', name: 'Chiếc lá tươi', icon: '🍃', weightGrams: 1, volumeMl: 5, floatsDefault: true, desc: 'Lá cây tự nhiên', densityNote: 'Bản rộng và siêu nhẹ (d = 0.20 g/cm³), lượn êm dịu nằm trên mặt nước', inTank: false, x: 370, y: 50, vx: 0, vy: 0, angle: 10, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-foam', name: 'Mẩu xốp', icon: '🧱', weightGrams: 2, volumeMl: 35, floatsDefault: true, desc: 'Xốp bọt biển', densityNote: 'Hàng triệu lỗ khí li ti (d = 0.06 g/cm³), nổi sát trên bề mặt', inTank: false, x: 420, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-apple', name: 'Quả táo', icon: '🍎', weightGrams: 75, volumeMl: 90, floatsDefault: true, desc: 'Trái cây ruột xốp', densityNote: 'Ruột táo chứa 25% túi khí (d = 0.83 g/cm³), nổi sâu làm nước dâng cao', inTank: false, x: 470, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-egg', name: 'Quả trứng', icon: '🥚', weightGrams: 55, volumeMl: 50, floatsDefault: false, desc: 'Trứng gà tươi', densityNote: 'Nặng hơn nước ngọt (d = 1.10 g/cm³) nên CHÌM, nhưng sẽ NỔI trong nước muối!', inTank: false, x: 520, y: 50, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-keys', name: 'Chùm chìa khóa', icon: '🔑', weightGrams: 42, volumeMl: 10, floatsDefault: false, desc: 'Kim loại nặng', densityNote: 'Kim loại đặc (d = 4.2 g/cm³), rơi thẳng tắp phát ra tiếng tõm và va cát', inTank: false, x: 570, y: 50, vx: 0, vy: 0, angle: 25, vRot: 0, settled: false, status: 'basket' }
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
    'Chào các bạn nhỏ! Bé hãy tự tay cầm đồ vật thả rơi từ trên cao vào bể nước, hoặc ấn dìm bóng xuống đáy xem nhé!'
  );

  // =========================================================================
  // 10 PHYSICS & ENGINE STATES
  // =========================================================================
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const itemsRef = useRef<TankObject[]>(PLAY_ITEMS_PRESETS);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [holdingPos, setHoldingPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [submergingItemId, setSubmergingItemId] = useState<string | null>(null);
  const [showXRay, setShowXRay] = useState(false);
  const [activeTool, setActiveTool] = useState<'hand' | 'salt' | 'net'>('hand');

  // Pointer fling velocity tracking
  const pointerHistory = useRef<{ x: number; y: number; time: number }[]>([]);
  const lastStirSoundTime = useRef<number>(0);

  // Feature 10: Salt Water Salinity Density State
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 to 5 spoons
  const waterDensity = 1.00 + saltSpoons * 0.035; // 1.00 -> 1.175 g/cm³

  // Drop race mode: comparing 2 items dropped simultaneously
  const [raceModeActive, setRaceModeActive] = useState<boolean>(false);
  const [raceSlotA, setRaceSlotA] = useState<string>('item-pebble');
  const [raceSlotB, setRaceSlotB] = useState<string>('item-pingpong');
  const [raceRunning, setRaceRunning] = useState<boolean>(false);

  // Tank DOM measurement
  const tankRef = useRef<HTMLDivElement | null>(null);

  // Water level constants
  const BASE_WATER_SURFACE_Y = 125; // Default surface line in 380px tall tank
  const TANK_BOTTOM_Y = 320; // Sand bed collision plane

  // Calculate Archimedes water displacement (mực nước dâng)
  const totalVolumeInWater = items
    .filter((i) => i.inTank)
    .reduce((sum, i) => sum + i.volumeMl, 0);
  const waterLevelRisePx = Math.min(42, Math.round(totalVolumeInWater * 0.12));
  const currentWaterSurfaceY = BASE_WATER_SURFACE_Y - waterLevelRisePx;

  // Wave springs & Particle systems
  const [waveSprings, setWaveSprings] = useState<number[]>(() => Array(40).fill(0));
  const waveVelocities = useRef<number[]>(Array(40).fill(0));
  const [splashParticles, setSplashParticles] = useState<SplashParticle[]>([]);
  const [bubbles, setBubbles] = useState<BubbleParticle[]>([]);
  const [sandDust, setSandDust] = useState<SandDustParticle[]>([]);
  const [saltParticles, setSaltParticles] = useState<SaltParticle[]>([]);

  // =========================================================================
  // WATER IMPACT SPLASH, CRATER & BUBBLES
  // =========================================================================
  const createWaterSplash = useCallback((xPx: number, isHeavy: boolean, impactSpeed: number = 100) => {
    if (soundEnabled) {
      soundEngine.playWaterSplash(isHeavy || impactSpeed > 250);
    }

    // 1. Disturb wave springs near xPx (Impact crater)
    if (tankRef.current) {
      const tankWidth = tankRef.current.clientWidth || 600;
      const nodeIndex = Math.min(39, Math.max(0, Math.floor((xPx / tankWidth) * 40)));
      const baseForce = Math.min(42, Math.max(14, impactSpeed * 0.12));
      waveVelocities.current[nodeIndex] = baseForce;
      if (nodeIndex > 0) waveVelocities.current[nodeIndex - 1] = baseForce * 0.7;
      if (nodeIndex < 39) waveVelocities.current[nodeIndex + 1] = baseForce * 0.7;
      if (nodeIndex > 1) waveVelocities.current[nodeIndex - 2] = baseForce * 0.4;
      if (nodeIndex < 38) waveVelocities.current[nodeIndex + 2] = baseForce * 0.4;
    }

    // 2. Spawn Splash Crown droplets
    const count = Math.min(32, Math.max(10, Math.round((impactSpeed / 20) * (isHeavy ? 1.4 : 1.0))));
    const newParticles: SplashParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) * 0.75 + Math.PI * 0.125;
      const speed = Math.random() * (isHeavy ? 6.5 : 4.5) + 2.5;
      newParticles.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 24 - 12),
        y: currentWaterSurfaceY,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed),
        size: Math.random() * (isHeavy ? 5.5 : 3.8) + 2.5,
        alpha: 0.95,
        life: 1
      });
    }
    setSplashParticles((prev) => [...prev.slice(-40), ...newParticles]);

    // 3. Spawn cavitation bubbles trailing underwater
    const bubbleCount = isHeavy ? 10 : 5;
    const newBubbles: BubbleParticle[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 26 - 13),
        y: currentWaterSurfaceY + 15 + i * 12,
        vy: -(Math.random() * 1.6 + 0.8),
        size: Math.random() * 4.5 + 2.5,
        wobble: Math.random() * 10,
        alpha: 0.85
      });
    }
    setBubbles((prev) => [...prev.slice(-30), ...newBubbles]);
    if (isHeavy && soundEnabled) soundEngine.playBubbleGlug();
  }, [currentWaterSurfaceY, soundEnabled]);

  // Sand bed dust cloud puff
  const createSandBedDust = useCallback((xPx: number) => {
    if (soundEnabled) {
      soundEngine.playSandThump();
    }
    const newPuffs: SandDustParticle[] = [];
    for (let i = 0; i < 14; i++) {
      newPuffs.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 28 - 14),
        y: TANK_BOTTOM_Y - 4,
        vx: (Math.random() - 0.5) * 35,
        vy: -(Math.random() * 25 + 10),
        size: Math.random() * 7 + 4,
        alpha: 0.75,
        life: 1.0
      });
    }
    setSandDust((prev) => [...prev.slice(-30), ...newPuffs]);
  }, [soundEnabled, TANK_BOTTOM_Y]);

  // =========================================================================
  // 60 FPS 2D PHYSICS ENGINE LOOP (requestAnimationFrame)
  // =========================================================================
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // 1. Wave Springs Update (Euler Dampened Wave Equation)
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

        // Propagate ripple wave momentum to adjacent nodes
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

      // 2. Splash droplets physics (gravity & velocity)
      setSplashParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.38, // Gravity
            alpha: p.alpha - 0.032,
            life: p.life - 0.032
          }))
          .filter((p) => p.life > 0)
      );

      // 3. Sand dust cloud physics (rising & slow fade)
      setSandDust((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: d.x + d.vx * dt,
            y: d.y + d.vy * dt,
            size: d.size + 0.15,
            alpha: d.alpha - 0.016,
            life: d.life - 0.02
          }))
          .filter((d) => d.life > 0 && d.alpha > 0)
      );

      // 4. Underwater Cavitation Bubbles (wobbling upwards)
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y + b.vy,
            x: b.x + Math.sin(b.y * 0.1 + b.wobble) * 0.7,
            alpha: b.alpha - 0.015
          }))
          .filter((b) => b.y > currentWaterSurfaceY && b.alpha > 0)
      );

      // 5. Salt Crystal Particles (dissolving into brine)
      setSaltParticles((prev) =>
        prev
          .map((s) => ({
            ...s,
            y: s.y + s.vy,
            alpha: s.alpha - 0.02
          }))
          .filter((s) => s.y < TANK_BOTTOM_Y && s.alpha > 0)
      );

      // 6. Tank Objects 2D Physics Step
      const currentTankItems = itemsRef.current;
      let hasChanges = false;
      const nextItems = currentTankItems.map((item) => {
        // Skip items in basket or currently held by hand
        if (!item.inTank || item.id === holdingItemId) return item;

        // Skip items currently being pressed down by finger
        if (item.status === 'pushed') return item;

        let { x, y, vx, vy, angle, vRot, status } = item;
        const currentDensity = item.weightGrams / item.volumeMl;
        const willFloatInCurrentLiquid = currentDensity < waterDensity;

        const isSubmerged = y >= currentWaterSurfaceY - 10;

        if (!isSubmerged) {
          // ================= IN AIR (FREE FALL) =================
          const gAir = 680; // px/s^2
          vy += gAir * dt;
          vx *= 1 - 0.4 * dt; // Slight air drag
          y += vy * dt;
          x += vx * dt;
          angle += vRot * dt;

          // Check if hitting water surface this frame
          if (y >= currentWaterSurfaceY - 10) {
            // Impact with water surface!
            createWaterSplash(x, !willFloatInCurrentLiquid, Math.abs(vy));
            status = willFloatInCurrentLiquid ? 'floating' : 'sunk';
          }
          hasChanges = true;
        } else {
          // ================= UNDERWATER / AT WATER SURFACE =================
          // Hydrodynamic Fluid Drag: F_drag = - 0.5 * Cd * rho * v^2 - beta * v
          const fluidDragY = -5.8 * vy;
          const fluidDragX = -6.2 * vx;

          // Buoyancy vs Gravity:
          // Net buoyant acceleration: a_b = (rho_liquid * V - m) * g_scale / m
          const buoyancyFactor = (waterDensity * item.volumeMl - item.weightGrams);
          const archimedesAccel = (buoyancyFactor / item.weightGrams) * 360;

          // Equilibrium waterline Y for floating items
          const equilibriumSubmergedFraction = Math.min(1, currentDensity / waterDensity);
          const equilibriumY = currentWaterSurfaceY + (equilibriumSubmergedFraction * 24 - 16);

          if (willFloatInCurrentLiquid) {
            // Floating item: Damped Harmonic Bobbing around equilibrium waterline
            const displacement = y - equilibriumY;
            const springK = 35; // Waterline harmonic spring
            const restoringForce = -springK * displacement;
            
            vy += (restoringForce + fluidDragY) * dt;
            y += vy * dt;
            vx += fluidDragX * dt;
            x += vx * dt;

            // Restrict from flying too high above surface unless propelled
            if (y < currentWaterSurfaceY - 24 && vy < 0) {
              vy *= 0.5;
            }

            // Hydrodynamic leveling of floating objects
            angle += (0 - angle) * 4 * dt;
            vRot *= 0.85;

            // Settle check
            if (Math.abs(vy) < 1.5 && Math.abs(displacement) < 1.0) {
              y = equilibriumY;
              vy = 0;
            }
            status = 'floating';
            hasChanges = true;
          } else {
            // Sinking item: descends with terminal velocity
            const gravityDown = 320;
            const terminalDecel = archimedesAccel; // negative value opposing gravity
            vy += (gravityDown + terminalDecel + fluidDragY) * dt;
            
            // Hydrodynamic Fluttering Wobble (Especially Spoon and Flat Objects)
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

            // Check Sand Bed Collision
            if (y >= TANK_BOTTOM_Y - 14) {
              if (vy > 35) {
                // Soft rebound and sand dust puff!
                createSandBedDust(x);
                vy = -vy * 0.18; // Inelastic sand bounce
              } else {
                y = TANK_BOTTOM_Y - 14;
                vy = 0;
                vx = 0;
              }
            }
            status = 'sunk';
            hasChanges = true;
          }
        }

        // Clamp tank horizontal walls
        const tankWidth = tankRef.current?.clientWidth || 600;
        if (x < 30) {
          x = 30;
          vx = -vx * 0.3;
        } else if (x > tankWidth - 30) {
          x = tankWidth - 30;
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
  }, [currentWaterSurfaceY, waterDensity, holdingItemId, createWaterSplash, createSandBedDust, TANK_BOTTOM_Y]);

  // =========================================================================
  // HAND INTERACTION: PICK UP, THROW WITH MOMENTUM & DRENCH
  // =========================================================================
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

    setMessage(`Bé đang cầm "${item.name} ${item.icon}". Bé có thể giơ cao thả rơi tự do hoặc vung tay ném vào bể nhé!`);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!tankRef.current) return;
    const rect = tankRef.current.getBoundingClientRect();
    const currX = Math.max(25, Math.min(rect.width - 25, e.clientX - rect.left));
    const currY = Math.max(15, Math.min(rect.height - 15, e.clientY - rect.top));

    // Record pointer history for fling / throw velocity
    const now = performance.now();
    pointerHistory.current.push({ x: currX, y: currY, time: now });
    if (pointerHistory.current.length > 5) {
      pointerHistory.current.shift();
    }

    if (holdingItemId) {
      setHoldingPos({ x: currX, y: currY });
    } else if (activeTool === 'hand' && e.buttons === 1) {
      // Feature 7: Water Stirring & Finger Touch Ripple
      if (currY >= currentWaterSurfaceY - 15 && currY <= TANK_BOTTOM_Y) {
        const tankWidth = rect.width || 600;
        const nodeIndex = Math.min(39, Math.max(0, Math.floor((currX / tankWidth) * 40)));
        waveVelocities.current[nodeIndex] = 12;

        // Push nearby floating items with finger water current
        setItems((prev) =>
          prev.map((i) => {
            if (i.inTank && i.status === 'floating' && Math.abs(i.x - currX) < 55) {
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

    // Compute Throw / Fling Release Velocity
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

    const droppedFromAir = holdingPos.y < currentWaterSurfaceY;
    const currentDensity = item.weightGrams / item.volumeMl;
    const willFloat = currentDensity < waterDensity;

    // Update item position and assign throw velocity
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

    // If released directly in/at water, create splash
    if (!droppedFromAir || Math.abs(holdingPos.y - currentWaterSurfaceY) < 20) {
      createWaterSplash(holdingPos.x, !willFloat, Math.max(80, Math.abs(flingVy)));
    }

    // Pedagogical message
    if (willFloat) {
      setMessage(
        `💧 ${item.name} ${droppedFromAir ? 'rơi tõm xuống nước' : 'được nhúng xuống'} nhưng đã NỔI BỒNG BỀNH! ${item.densityNote}.`
      );
      if (soundEnabled) soundEngine.playWaterDrop();
    } else {
      setMessage(
        `⚓ ${item.name} rơi xuống nước và CHÌM XUỐNG ĐÁY! ${item.densityNote}.`
      );
    }

    setHoldingItemId(null);
  };

  // =========================================================================
  // FEATURE 3 & 4: PUSH DOWN BALL & POP UP ROCKET
  // =========================================================================
  const handlePushDownItem = (item: TankObject, e: React.PointerEvent) => {
    e.stopPropagation();
    if (!item.inTank) return;
    const currentDensity = item.weightGrams / item.volumeMl;
    const willFloat = currentDensity < waterDensity;
    if (!willFloat) return;

    setSubmergingItemId(item.id);
    setMessage(`Bé đang dùng ngón tay ấn dìm ${item.name} xuống đáy nước! Nước đang sinh lực đẩy rất mạnh! Buông tay ra xem nào!`);

    if (soundEnabled) {
      soundEngine.playBubbleGlug();
    }

    // Set item pushed down to near bottom
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

    // Sound: Buoyant pop rocket!
    if (soundEnabled) {
      soundEngine.playBuoyantPop();
    }

    // Launch item upwards with explosive buoyancy!
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              vy: -420, // Rocket upwards!
              status: 'floating'
            }
          : i
      )
    );

    // Spawn bubbles in its wake
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

    setMessage(
      `🚀 VÈO... BẬT LÊN RỒI! ${item.name} bị dìm xuống đáy đã phóng vút lên mặt nước! Lực đẩy Ác-si-mét quá mạnh mẽ!`
    );
    setSubmergingItemId(null);
  };

  // =========================================================================
  // FEATURE 10: SALT WATER DENSITY EXPERIMENT (THÊM MUỐI ĐỔI TỶ TRỌNG)
  // =========================================================================
  const handleAddSalt = () => {
    if (saltSpoons >= 5) {
      setMessage('Bể nước đã bão hòa muối biển cực đậm đặc (tỷ trọng 1.175 g/cm³)!');
      return;
    }
    const nextSpoons = saltSpoons + 1;
    setSaltSpoons(nextSpoons);

    if (soundEnabled) soundEngine.playSaltPour();

    // Spawn falling salt crystals
    const tankWidth = tankRef.current?.clientWidth || 600;
    const newSalt: SaltParticle[] = [];
    for (let i = 0; i < 25; i++) {
      newSalt.push({
        id: Date.now() + Math.random(),
        x: tankWidth * 0.25 + Math.random() * (tankWidth * 0.5),
        y: 20 + Math.random() * 60,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 3 + 1.5,
        alpha: 0.95
      });
    }
    setSaltParticles((prev) => [...prev, ...newSalt]);

    const newDensity = 1.00 + nextSpoons * 0.035;

    // Check if Egg will now float!
    const eggItem = items.find((i) => i.id === 'item-egg');
    if (nextSpoons >= 3 && eggItem && eggItem.inTank) {
      setMessage(
        `🧂 KỲ DIỆU CHƯA! Đã hòa tan ${nextSpoons} thìa muối! Tỷ trọng nước tăng lên ${newDensity.toFixed(3)} g/cm³, LỚN HƠN tỷ trọng Quả Trứng (1.10 g/cm³)! Lực đẩy nâng quả trứng TỰ ĐỘNG BƠI NỔI LÊN MẶT NƯỚC như ở Biển Chết!`
      );
      if (soundEnabled) soundEngine.playMagicChime();
    } else {
      setMessage(
        `🧂 Bé vừa hòa tan thêm 1 thìa muối biển! Tỷ trọng nước tăng lên ${newDensity.toFixed(3)} g/cm³. Nước càng mặn thì sức nâng càng lớn!`
      );
    }
  };

  const handleResetSalt = () => {
    setSaltSpoons(0);
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay nước ngọt tinh khiết mới (tỷ trọng 1.000 g/cm³)! Quả trứng lại chìm nghỉm xuống đáy cát.');
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

    const tankWidth = tankRef.current?.clientWidth || 600;

    setRaceRunning(true);
    setMessage('Chuẩn bị... 3... 2... 1... THẢ CÙNG LÚC TỪ TRÊN CAO!');

    // Position both in air above water and drop simultaneously!
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemA.id) {
          return {
            ...i,
            inTank: true,
            x: tankWidth * 0.35,
            y: 35,
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
            y: 35,
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
        `🏁 KẾT QUẢ ĐUA: ${itemA.name} ${aFloats ? 'NỔI' : 'CHÌM'}, còn ${itemB.name} ${bFloats ? 'NỔI' : 'CHÌM'}! Bé thấy chưa, to hay nhỏ không quyết định, mà do tỷ trọng chất liệu và không khí bên trong!`
      );
    }, 1500);
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
              Động cơ Vật lý & Thủy động học 2D
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
            <span>Phần 1: Bể Nước Vật Lý Siêu Thực</span>
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
                <div className="flex items-center flex-wrap gap-2">
                  {/* Tool Selection: Hand vs Salt Shaker vs Net Scoop */}
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
                    <button
                      onClick={() => setActiveTool('hand')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                        activeTool === 'hand'
                          ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Cầm nắm, quăng ném, nhúng và khuấy nước bằng tay"
                    >
                      <span>🖐️ Tay nhúng & ném</span>
                    </button>

                    <button
                      onClick={() => { setActiveTool('salt'); handleAddSalt(); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                        activeTool === 'salt'
                          ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Rắc muối biển để tăng tỷ trọng nước (làm trứng nổi lên)"
                    >
                      <span>🧂 Thêm Muối ({saltSpoons}/5)</span>
                    </button>

                    <button
                      onClick={() => setActiveTool('net')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-bold ${
                        activeTool === 'net'
                          ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Vợt lưới vớt đồ vật trong bể cất lại vào giỏ"
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
              /* THE REALISTIC TACTILE WATER TANK WITH 2D PHYSICS ENGINE                    */
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
                              <option key={i.id} value={i.id}>{i.icon} {i.name} ({i.weightGrams / i.volumeMl < waterDensity ? 'Nổi' : 'Chìm'})</option>
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
                              <option key={i.id} value={i.id}>{i.icon} {i.name} ({i.weightGrams / i.volumeMl < waterDensity ? 'Nổi' : 'Chìm'})</option>
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
                        <span>Thả Rơi Cùng Lúc! 🚀</span>
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
                    {/* Feature 9: Underwater Caustics Light Simulation */}
                    <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-20 overflow-hidden z-10">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="caustics" width="120" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 0 40 Q 30 10, 60 40 T 120 40" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.6" />
                            <path d="M 0 20 Q 30 50, 60 20 T 120 20" fill="none" stroke="#38bdf8" strokeWidth="1.8" opacity="0.5" />
                            <path d="M 0 60 Q 40 30, 80 60 T 120 60" fill="none" stroke="#fef08a" strokeWidth="1.2" opacity="0.4" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#caustics)" />
                      </svg>
                    </div>

                    {/* Top Air Atmosphere Label */}
                    <div className="absolute top-2 left-4 text-[10px] font-mono font-bold text-sky-700/80 dark:text-sky-300/80 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none z-10">
                      <span>☁️ Không khí (Bé giơ cao thả rơi tự do hoặc vung tay ném tại đây)</span>
                    </div>

                    {/* Archimedes & Salinity Density Gauges */}
                    <div className="absolute top-9 right-3 flex flex-col items-end gap-1 pointer-events-none z-20">
                      <div className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-sky-300 dark:border-sky-700 text-[10px] font-mono text-sky-900 dark:text-sky-200 shadow-sm flex items-center gap-1.5">
                        <span>📏 Mực nước dâng:</span>
                        <strong className="text-emerald-600 font-bold">+{waterLevelRisePx}mm</strong>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-amber-50/90 dark:bg-amber-950/80 backdrop-blur border border-amber-300 dark:border-amber-700 text-[10px] font-mono text-amber-900 dark:text-amber-200 shadow-sm flex items-center gap-1.5">
                        <Beaker className="w-3 h-3 text-amber-600" />
                        <span>Tỷ trọng nước:</span>
                        <strong className="text-amber-700 dark:text-amber-300 font-bold">{waterDensity.toFixed(3)} g/cm³</strong>
                      </div>
                    </div>

                    {/* Feature 2: Dynamic Spring Wave Surface SVG */}
                    <div
                      style={{ top: `${currentWaterSurfaceY}px` }}
                      className="absolute left-0 right-0 h-4 pointer-events-none z-20 transition-[top] duration-500"
                    >
                      <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 40">
                        {/* Wave body path */}
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
                          stroke="rgba(255, 255, 255, 0.9)"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>

                    {/* Water Body (Chất lỏng trong suốt với màu sắc biến thiên theo độ mặn) */}
                    <div
                      style={{ top: `${currentWaterSurfaceY + 16}px` }}
                      className={`absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-700 ${
                        saltSpoons > 2
                          ? 'bg-gradient-to-b from-teal-400/35 via-cyan-500/40 to-blue-600/50'
                          : 'bg-gradient-to-b from-sky-400/30 via-sky-500/35 to-blue-600/40'
                      }`}
                    >
                      {/* Ambient micro-bubbles */}
                      <div className="absolute bottom-8 left-16 w-3 h-3 rounded-full bg-white/40 animate-ping" />
                      <div className="absolute bottom-16 right-24 w-2 h-2 rounded-full bg-white/50 animate-pulse" />
                      <div className="absolute bottom-28 left-48 w-4 h-4 rounded-full bg-white/20 animate-bounce" />
                    </div>

                    {/* Feature 5: Underwater Sandy Bed (Đáy bể rải cát & bụi cát va chạm) */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-amber-300 via-amber-200/80 to-transparent dark:from-amber-950 dark:via-amber-900/60 border-t border-amber-300/40 flex items-center justify-between px-4 text-[10px] font-mono text-amber-950 dark:text-amber-200 pointer-events-none z-15">
                      <span>🏖️ Đáy bể cát mịn (Vật chìm nghỉm tại đây)</span>
                      <span className="text-[9px] opacity-75">Va chạm tạo bụi cát</span>
                    </div>

                    {/* Feature 2: Splash Water Droplet Particles */}
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

                    {/* Feature 5: Sand Bed Dust Particles */}
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

                    {/* Feature 8: Underwater Cavitation Bubbles */}
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

                    {/* Feature 10: Falling Salt Crystals */}
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

                    {/* Feature 1, 3, 4: Render Physics Objects Inside Tank */}
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
                                isSubmerged ? 'scale-125' : 'hover:scale-115'
                              }`}
                              title={
                                activeTool === 'net'
                                  ? 'Bấm để vớt vào giỏ'
                                  : currentFloats
                                  ? 'ẤN GIỮ ĐỂ DÌM XUỐNG ĐÁY & BUÔNG TAY ĐỂ BẮN VỌT LÊN!'
                                  : 'Bấm giữ để cầm lên ném thử nghiệm lại'
                              }
                            >
                              {/* Submerge indicator arrows when held underwater */}
                              {isSubmerged && (
                                <div className="mb-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-mono font-black animate-bounce flex items-center gap-1 shadow-md">
                                  <ArrowUp className="w-3 h-3 text-red-600 animate-pulse" />
                                  <span>BUÔNG TAY ĐỂ BẮN LÊN!</span>
                                </div>
                              )}

                              {/* Object Icon with Hydrodynamic Tilt */}
                              <span className="text-4xl filter drop-shadow-md select-none transform transition-transform">
                                {item.icon}
                              </span>

                              {/* Object Tag */}
                              <span
                                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs mt-1 whitespace-nowrap transition-colors ${
                                  currentFloats
                                    ? 'bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-950 dark:text-sky-200'
                                    : 'bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                                }`}
                              >
                                {item.name} ({currentFloats ? 'NỔI' : 'CHÌM'})
                              </span>

                              {/* Floating Push Hint */}
                              {currentFloats && !isSubmerged && (
                                <div className="text-[8px] font-mono text-sky-700 dark:text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded shadow-2xs mt-0.5 pointer-events-none">
                                  👇 Ấn dìm bóng
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Feature 6: Dragged / Held Item with Fling Trajectory Indicator */}
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

                  {/* Bottom Controls Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowXRay(!showXRay)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-semibold transition ${
                          showXRay
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{showXRay ? 'Tắt Kính Lúp X-Ray' : 'Bật Kính Lúp X-Ray (Soi túi khí)'}</span>
                      </button>

                      {saltSpoons > 0 && (
                        <button
                          onClick={handleResetSalt}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-mono font-semibold transition"
                          title="Thay bằng nước ngọt tinh khiết"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Đổi Nước Ngọt (Xả muối)</span>
                        </button>
                      )}
                    </div>

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
                  {/* Salt Shaker Card (Feature 10) */}
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-900 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🧂</span>
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                            Hũ Muối Biển Tinh Khiết
                          </h4>
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                            Đã thêm: {saltSpoons}/5 thìa muối
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleAddSalt}
                          disabled={saltSpoons >= 5}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono shadow-xs flex items-center gap-1 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm</span>
                        </button>
                        {saltSpoons > 0 && (
                          <button
                            onClick={() => setSaltSpoons(Math.max(0, saltSpoons - 1))}
                            className="p-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-1">
                      <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <span>💡 Hiện tượng Biển Chết:</span>
                      </div>
                      <p className="leading-relaxed">
                        Thả <strong>Quả Trứng 🥚</strong> vào bể nước ngọt thì chìm. Thêm từ <strong>3 thìa muối</strong> trở lên, nước mặn đặc nâng quả trứng <strong>tự nổi bồng bềnh</strong>!
                      </p>
                    </div>
                  </div>

                  {/* Toy Basket Grid */}
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

                    <div className="grid grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
                      {items.map((item) => {
                        const isInTank = item.inTank;
                        const itemDensity = item.weightGrams / item.volumeMl;
                        const willFloat = itemDensity < waterDensity;

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
                                {willFloat ? '🔍 Có túi khí / Nhẹ' : '🔍 Đặc ruột / Nặng'}
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
                      <span>Trải nghiệm tương tác chân thực cho bé:</span>
                    </div>
                    <ul className="text-slate-600 dark:text-slate-300 text-[11px] space-y-1.5 leading-relaxed">
                      <li>• <strong>Vung tay ném & thả cao:</strong> Nước bắn tung tóe, va vào cát đáy bể phát ra tiếng va chạm!</li>
                      <li>• <strong>Ấn dìm quả bóng bàn:</strong> Cảm nhận sức nâng Ác-si-mét; buông tay để bóng bắn vọt lên!</li>
                      <li>• <strong>Khuấy nước bằng tay:</strong> Kéo ngón tay qua mặt nước để tạo sóng dập dềnh xô đẩy các vật nổi!</li>
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

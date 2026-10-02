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
  Sparkles,
  Beaker
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  onBackToTable?: () => void;
}

export interface TankObject {
  id: string;
  name: string;
  icon: string;
  weightGrams: number;
  volumeMl: number;
  floatsDefault: boolean;
  desc: string;
  densityNote: string;
  inTank: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vRot: number;
  settled: boolean;
  status: 'basket' | 'falling' | 'floating' | 'sunk' | 'pushed';
}

const PLAY_ITEMS_PRESETS: TankObject[] = [
  { id: 'item-pebble', name: 'Hòn sỏi', icon: '🪨', weightGrams: 50, volumeMl: 20, floatsDefault: false, desc: 'Đá tự nhiên', densityNote: 'Đặc ruột và nặng hơn nước ngọt nên chìm thẳng xuống đáy', inTank: false, x: 140, y: 60, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-spoon', name: 'Thìa inox', icon: '🥄', weightGrams: 35, volumeMl: 7, floatsDefault: false, desc: 'Kim loại phẳng', densityNote: 'Kim loại đặc nặng, chao đảo liệng nhẹ khi chìm', inTank: false, x: 200, y: 60, vx: 0, vy: 0, angle: -15, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-pingpong', name: 'Bóng bàn', icon: '⚪', weightGrams: 3, volumeMl: 40, floatsDefault: true, desc: 'Nhựa rỗng chứa khí', densityNote: 'Rất nhẹ và chứa đầy không khí; dìm xuống đáy sẽ phóng vọt lên!', inTank: false, x: 260, y: 60, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-duck', name: 'Vịt cao su', icon: '🐥', weightGrams: 12, volumeMl: 55, floatsDefault: true, desc: 'Cao su rỗng ruột', densityNote: 'Rất nhẹ, dập dềnh bồng bềnh theo từng đợt sóng nước', inTank: false, x: 320, y: 60, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-wood', name: 'Khối gỗ', icon: '🪵', weightGrams: 28, volumeMl: 45, floatsDefault: true, desc: 'Gỗ khô', densityNote: 'Nhẹ hơn nước ngọt, nổi vững chãi chìm khoảng một nửa', inTank: false, x: 380, y: 60, vx: 0, vy: 0, angle: 5, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-leaf', name: 'Chiếc lá tươi', icon: '🍃', weightGrams: 1, volumeMl: 5, floatsDefault: true, desc: 'Lá cây tự nhiên', densityNote: 'Bản rộng và siêu nhẹ, lượn êm dịu nằm trên mặt nước', inTank: false, x: 440, y: 60, vx: 0, vy: 0, angle: 10, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-foam', name: 'Mẩu xốp', icon: '🧱', weightGrams: 2, volumeMl: 35, floatsDefault: true, desc: 'Xốp bọt biển', densityNote: 'Hàng triệu lỗ khí li ti, nổi sát trên bề mặt nước', inTank: false, x: 500, y: 60, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-apple', name: 'Quả táo', icon: '🍎', weightGrams: 75, volumeMl: 90, floatsDefault: true, desc: 'Trái cây ruột xốp', densityNote: 'Ruột táo chứa tới 25% túi khí nên nổi được trên mặt nước', inTank: false, x: 560, y: 60, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-egg', name: 'Quả trứng', icon: '🥚', weightGrams: 55, volumeMl: 50, floatsDefault: false, desc: 'Trứng gà tươi', densityNote: 'Nặng hơn nước ngọt nên chìm, nhưng sẽ NỔI BỒNG BỀNH khi nước đủ mặn!', inTank: false, x: 620, y: 60, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-keys', name: 'Chùm chìa khóa', icon: '🔑', weightGrams: 42, volumeMl: 10, floatsDefault: false, desc: 'Kim loại nặng', densityNote: 'Kim loại đặc, rơi thẳng tắp tạo tiếng tõm và va cát', inTank: false, x: 680, y: 60, vx: 0, vy: 0, angle: 25, vRot: 0, settled: false, status: 'basket' }
];

interface SurfaceRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
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

// Dedicated Aquarium Scoop Net Icon
const AquariumNetIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
    {/* Angled Handle */}
    <path d="M 21 3 L 14 10" strokeWidth="2.5" strokeLinecap="round" className="stroke-amber-500" />
    {/* Metal Hoop Ring */}
    <circle cx="9.5" cy="14.5" r="5" strokeWidth="1.8" className="stroke-sky-500" />
    {/* Net Mesh Pouch */}
    <path d="M 6 12 Q 9.5 17 13 12" strokeWidth="1" strokeDasharray="1.5 1.5" className="stroke-emerald-500" />
    <path d="M 6 17 Q 9.5 12 13 17" strokeWidth="1" strokeDasharray="1.5 1.5" className="stroke-emerald-500" />
    <path d="M 9.5 9.5 Q 14 14.5 9.5 19.5" strokeWidth="1" strokeDasharray="1.5 1.5" className="stroke-emerald-500" />
  </svg>
);

// Realistic Hand Holding Stainless Steel Spoon Component
const RealisticHandSpoon: React.FC<{
  x: number;
  y: number;
  rotation: number;
  isPouring: boolean;
}> = ({ x, y, rotation, isPouring }) => (
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      transition: 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
    }}
    className="absolute pointer-events-none z-45 filter drop-shadow-2xl select-none"
  >
    <svg width="150" height="95" viewBox="0 0 150 95" fill="none">
      {/* Spoon Handle (Stainless steel polished chrome) */}
      <path
        d="M 140 55 L 56 38 Q 48 36 42 35"
        stroke="url(#metalShineGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Spoon Bowl (deep concave oval) */}
      <ellipse cx="32" cy="35" rx="24" ry="15" fill="url(#metalBowlGrad)" stroke="#94a3b8" strokeWidth="2" />
      
      {/* Salt Pile mound inside spoon */}
      {!isPouring ? (
        <ellipse cx="32" cy="32" rx="18" ry="10" fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.25))" />
      ) : (
        /* Emptying tilted bowl with salt grains tumbling out */
        <g>
          <ellipse cx="26" cy="35" rx="12" ry="7" fill="#f8fafc" />
          <circle cx="16" cy="46" r="3" fill="#ffffff" />
          <circle cx="20" cy="54" r="2.5" fill="#ffffff" />
          <circle cx="14" cy="62" r="3" fill="#ffffff" />
        </g>
      )}

      {/* Hand Fingers Gripping Handle */}
      <path d="M 145 68 Q 120 54 105 50 Q 95 48 88 46" stroke="#f59e0b" strokeWidth="13" strokeLinecap="round" />
      <path d="M 145 68 Q 120 54 105 50 Q 95 48 88 46" stroke="#fcd34d" strokeWidth="11" strokeLinecap="round" />
      {/* Thumb pressing on top */}
      <ellipse cx="96" cy="42" rx="10" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" transform="rotate(-15 96 42)" />
      {/* Index Finger curled around handle */}
      <ellipse cx="84" cy="45" rx="7" ry="5.5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" transform="rotate(10 84 45)" />
      <ellipse cx="74" cy="48" rx="6.5" ry="5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" transform="rotate(15 74 48)" />

      <defs>
        <linearGradient id="metalShineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="metalBowlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Realistic Hand Holding Glass Stirring Rod Component
const RealisticStirringHand: React.FC<{
  x: number;
  y: number;
  angle: number;
}> = ({ x, y, angle }) => (
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50%, -45%) rotate(${Math.sin((angle * Math.PI) / 180) * 16}deg)`,
      transition: 'transform 0.08s linear'
    }}
    className="absolute pointer-events-none z-45 filter drop-shadow-2xl select-none flex flex-col items-center"
  >
    <svg width="100" height="190" viewBox="0 0 100 190" fill="none">
      {/* Laboratory glass stirring rod */}
      <rect x="47" y="32" width="7" height="150" rx="3.5" fill="url(#glassRodGrad)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
      <circle cx="50.5" cy="30" r="5" fill="#38bdf8" opacity="0.85" />
      <circle cx="50.5" cy="180" r="4.5" fill="#38bdf8" opacity="0.85" />

      {/* Hand holding top of rod */}
      <path d="M 92 50 Q 72 35 56 32" stroke="#f59e0b" strokeWidth="13" strokeLinecap="round" />
      <path d="M 92 50 Q 72 35 56 32" stroke="#fcd34d" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="50" cy="34" rx="8" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <ellipse cx="52" cy="44" rx="7" ry="5.5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" />

      <defs>
        <linearGradient id="glassRodGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="50%" stopColor="rgba(56,189,248,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
        </linearGradient>
      </defs>
    </svg>

    {/* Effervescent vortex rings and micro-bubbles in water */}
    <div className="w-14 h-7 rounded-full border-2 border-white/80 animate-ping opacity-60 -mt-6 pointer-events-none" />
  </div>
);

export const SimSinkOrFloatLab: React.FC<Props> = () => {
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mascot guidance message
  const [message, setMessage] = useState<string>(
    'Chào các bạn nhỏ! Bé hãy chọn một đồ vật ở Khay bên phải để thả vào bể nước, hoặc ấn dìm quả bóng xuống đáy xem nhé!'
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

  // Aquarium Net Scooping Animation State & Pointer Tracking
  interface NetScoopAnim {
    itemId: string;
    itemIcon: string;
    itemName: string;
    x: number;
    y: number;
    phase: 'dipping' | 'lifting' | 'returning';
  }
  const [netScoopAnim, setNetScoopAnim] = useState<NetScoopAnim | null>(null);
  const [netCursorPos, setNetCursorPos] = useState<{ x: number; y: number }>({ x: 400, y: 250 });
  const [isHoveringTank, setIsHoveringTank] = useState<boolean>(false);

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
  const [tankDimensions, setTankDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 520 });

  // Update tank dimensions on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (tankRef.current) {
        setTankDimensions({
          width: tankRef.current.clientWidth || 800,
          height: tankRef.current.clientHeight || 520
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  const BASE_WATER_SURFACE_Y = 175; // Surface plane in ~520px tall tank
  const TANK_BOTTOM_Y = 460; // Sand bed collision plane

  // Archimedes water displacement (mực nước dâng)
  const totalVolumeInWater = items
    .filter((i) => i.inTank)
    .reduce((sum, i) => sum + i.volumeMl, 0);
  const waterLevelRisePx = Math.min(36, Math.round(totalVolumeInWater * 0.09));
  const currentWaterSurfaceY = BASE_WATER_SURFACE_Y - waterLevelRisePx;

  // Wave springs & Particle systems
  const [waveSprings, setWaveSprings] = useState<number[]>(() => Array(40).fill(0));
  const waveVelocities = useRef<number[]>(Array(40).fill(0));
  const [surfaceRipples, setSurfaceRipples] = useState<SurfaceRipple[]>([]);
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

    // 1. Disturb wave springs near impact - GENTLE force
    if (tankRef.current) {
      const tankWidth = tankDimensions.width || 800;
      const nodeIndex = Math.min(39, Math.max(0, Math.floor((xPx / tankWidth) * 40)));
      const baseForce = Math.min(18, Math.max(6, impactSpeed * 0.06));
      waveVelocities.current[nodeIndex] = baseForce;
      if (nodeIndex > 0) waveVelocities.current[nodeIndex - 1] = baseForce * 0.6;
      if (nodeIndex < 39) waveVelocities.current[nodeIndex + 1] = baseForce * 0.6;
    }

    // 2. Realistic Concentric Surface Ripples
    const newRipples: SurfaceRipple[] = [
      {
        id: Date.now() + Math.random(),
        x: xPx,
        y: currentWaterSurfaceY,
        radius: 4,
        maxRadius: isHeavy ? 45 : 28,
        alpha: 0.8
      }
    ];
    setSurfaceRipples((prev) => [...prev.slice(-6), ...newRipples]);

    // 3. Spawn cavitation bubbles trailing ONLY during water impact
    const bubbleCount = isHeavy ? 5 : 2;
    const newBubbles: BubbleParticle[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 20 - 10),
        y: currentWaterSurfaceY + 12 + i * 14,
        vy: -(Math.random() * 1.4 + 0.7),
        size: Math.random() * 4 + 2,
        wobble: Math.random() * 8,
        alpha: 0.8
      });
    }
    setBubbles((prev) => [...prev.slice(-20), ...newBubbles]);
    if (isHeavy && soundEnabled) soundEngine.playBubbleGlug();
  }, [currentWaterSurfaceY, soundEnabled, tankDimensions.width]);

  // Sand bed dust puff
  const createSandBedDust = useCallback((xPx: number) => {
    if (soundEnabled) {
      soundEngine.playSandThump();
    }
    const newPuffs: SandDustParticle[] = [];
    for (let i = 0; i < 10; i++) {
      newPuffs.push({
        id: Date.now() + Math.random(),
        x: xPx + (Math.random() * 24 - 12),
        y: TANK_BOTTOM_Y - 5,
        vx: (Math.random() - 0.5) * 25,
        vy: -(Math.random() * 18 + 6),
        size: Math.random() * 5 + 3,
        alpha: 0.65,
        life: 0.9
      });
    }
    setSandDust((prev) => [...prev.slice(-20), ...newPuffs]);
  }, [soundEnabled, TANK_BOTTOM_Y]);

  // 60 FPS 2D PHYSICS ENGINE LOOP (CALM, SMOOTH WAVE MECHANICS)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // 1. Calm, Gentle Wave Springs Update (Low tension, high dampening = NO fast frantic shaking!)
      const tension = 0.005; // Soft wave elasticity
      const dampening = 0.09; // High dampening settles water quickly and smoothly
      const spread = 0.1;

      setWaveSprings((prevSprings) => {
        const next = [...prevSprings];
        const vels = waveVelocities.current;

        for (let i = 0; i < next.length; i++) {
          const force = -tension * next[i] - dampening * vels[i];
          vels[i] += force;
          next[i] += vels[i];
        }

        // Single smooth propagation pass
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

        // Very gentle, calm, slow breathing idle swell
        next[0] += Math.sin(currentTime * 0.0012) * 0.25;

        return next;
      });

      // 2. Surface Ripples
      setSurfaceRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            radius: r.radius + 0.9,
            alpha: r.alpha - 0.02
          }))
          .filter((r) => r.alpha > 0 && r.radius < r.maxRadius)
      );

      // 3. Sand dust
      setSandDust((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: d.x + d.vx * dt,
            y: d.y + d.vy * dt,
            size: d.size + 0.1,
            alpha: d.alpha - 0.016,
            life: d.life - 0.02
          }))
          .filter((d) => d.life > 0 && d.alpha > 0)
      );

      // 4. Underwater Cavitation Bubbles (disappear gently at surface)
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y + b.vy,
            x: b.x + Math.sin(b.y * 0.1 + b.wobble) * 0.5,
            alpha: b.alpha - 0.012
          }))
          .filter((b) => b.y > currentWaterSurfaceY && b.alpha > 0)
      );

      // 5. Salt Particles
      setSaltParticles((prev) =>
        prev
          .map((s) => ({
            ...s,
            y: s.y + s.vy,
            alpha: s.alpha - 0.016
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
              vy: -130
            };
          }
          return item;
        }

        let { x, y, vx, vy, angle, vRot } = item;
        let status = item.status;
        let settled = item.settled;

        // Physical contact: Object bottom enters water surface
        const isSubmerged = y >= currentWaterSurfaceY - 8;

        if (!isSubmerged) {
          // Free fall in air
          const gAir = 680;
          vy += gAir * dt;
          vx *= 1 - 0.4 * dt;
          y += vy * dt;
          x += vx * dt;
          angle += vRot * dt;

          if (y >= currentWaterSurfaceY - 8) {
            createWaterSplash(x, !willFloatInCurrentLiquid, Math.abs(vy));
            status = willFloatInCurrentLiquid ? 'floating' : 'sunk';
          }
          hasChanges = true;
        } else {
          // In Water
          const fluidDragY = -5.8 * vy;
          const fluidDragX = -6.2 * vx;

          const equilibriumSubmergedFraction = Math.min(1, currentDensity / waterDensity);
          // ZERO WHITE GAP: Center rests so that the lower half of emoji is comfortably submerged in blue water
          const equilibriumY = currentWaterSurfaceY + (equilibriumSubmergedFraction * 20 + 2);

          if (willFloatInCurrentLiquid) {
            // Calm harmonic bobbing at waterline
            const displacement = y - equilibriumY;
            const springK = 32;
            const restoringForce = -springK * displacement;

            vy += (restoringForce + fluidDragY) * dt;
            y += vy * dt;
            vx += fluidDragX * dt;
            x += vx * dt;

            if (y < currentWaterSurfaceY - 18 && vy < 0) {
              vy *= 0.5;
            }

            angle += (0 - angle) * 3 * dt;
            vRot *= 0.85;

            if (Math.abs(vy) < 1.2 && Math.abs(displacement) < 0.8) {
              y = equilibriumY;
              vy = 0;
            }
            status = 'floating';
            hasChanges = true;
          } else {
            // Sinking downwards
            const gravityDown = 310;
            const buoyancyFactor = (waterDensity * item.volumeMl - item.weightGrams);
            const archimedesAccel = (buoyancyFactor / item.weightGrams) * 350;
            vy += (gravityDown + archimedesAccel + fluidDragY) * dt;

            // REALISTIC BUBBLES: Only spawn trailing bubbles while actively sinking through water column
            if (vy > 40 && y < TANK_BOTTOM_Y - 25 && currentTime - lastCavitationTime.current > 180) {
              setBubbles((prev) => [
                ...prev.slice(-18),
                {
                  id: Date.now() + Math.random(),
                  x: x + (Math.random() * 10 - 5),
                  y: y + 6,
                  vy: -(Math.random() * 1.5 + 0.7),
                  size: Math.random() * 3.5 + 2,
                  wobble: Math.random() * 8,
                  alpha: 0.75
                }
              ]);
              lastCavitationTime.current = currentTime;
            }

            // Hydrodynamic fluttering wobble while descending
            if (y < TANK_BOTTOM_Y - 14) {
              if (item.id === 'item-spoon') {
                angle = Math.sin(currentTime * 0.006) * 18;
                vx = Math.cos(currentTime * 0.006) * 12;
              } else if (item.id === 'item-leaf') {
                angle = Math.sin(currentTime * 0.004) * 14;
                vx = Math.cos(currentTime * 0.004) * 7;
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
        const tankWidth = tankDimensions.width || 800;
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
  }, [currentWaterSurfaceY, waterDensity, holdingItemId, createWaterSplash, createSandBedDust, TANK_BOTTOM_Y, tankDimensions.width]);

  // Hand drag, drop, and throw
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
    setNetCursorPos({ x: currX, y: currY });
    pointerHistory.current.push({ x: currX, y: currY, time: now });
    if (pointerHistory.current.length > 5) {
      pointerHistory.current.shift();
    }

    if (holdingItemId) {
      setHoldingPos({ x: currX, y: currY });
    } else if (activeTool === 'hand' && e.buttons === 1) {
      // Gentle finger stirring
      if (currY >= currentWaterSurfaceY - 15 && currY <= TANK_BOTTOM_Y) {
        const tankWidth = rect.width || 800;
        const nodeIndex = Math.min(39, Math.max(0, Math.floor((currX / tankWidth) * 40)));
        waveVelocities.current[nodeIndex] = 8; // Gentle disturbance

        setItems((prev) =>
          prev.map((i) => {
            if (i.inTank && i.status === 'floating' && Math.abs(i.x - currX) < 60) {
              return { ...i, vx: i.vx + (currX > i.x ? -12 : 12) };
            }
            return i;
          })
        );

        if (soundEnabled && now - lastStirSoundTime.current > 200) {
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
        flingVx = Math.min(420, Math.max(-420, (last.x - first.x) / dtSec));
        flingVy = Math.min(480, Math.max(-420, (last.y - first.y) / dtSec));
      }
    }

    const droppedFromAir = holdingPos.y < currentWaterSurfaceY;
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

    if (!droppedFromAir || Math.abs(holdingPos.y - currentWaterSurfaceY) < 25) {
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

  // REALISTIC HAND-HELD SPOON SCOOP & STIRRING ANIMATION
  const handleTriggerAddSalt = () => {
    if (saltAnimation !== 'idle') return;
    if (saltSpoons >= 5) {
      setMessage('Bể nước đã bão hòa muối biển cực đậm đặc! Nước mặn đến mức có thể nâng được nhiều vật nặng.');
      return;
    }

    const tankWidth = tankDimensions.width || 800;
    const pourTargetX = tankWidth * 0.5;

    // Step 1: Hand holding spoon scoops salt from jar
    setSaltAnimation('scooping');
    setSpoonPos({ x: tankWidth * 0.25, y: 70, rotation: -12 });
    setMessage('Bàn tay đang cầm thìa xúc muối từ hũ đưa vào bể nước...');
    if (soundEnabled) soundEngine.playSpoonClink();

    // Step 2: Spoon moves to center above tank and pours salt crystals
    setTimeout(() => {
      setSaltAnimation('pouring');
      setSpoonPos({ x: pourTargetX, y: 65, rotation: 50 });
      if (soundEnabled) soundEngine.playSaltPour();

      // Spawn falling salt crystals into water
      const newSalt: SaltParticle[] = [];
      for (let i = 0; i < 35; i++) {
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

      // Disturbed ripples at pouring spot
      const nodeCenter = Math.floor(40 * 0.5);
      waveVelocities.current[nodeCenter] = 12;
    }, 750);

    // Step 3: Stirring rod dips into water and stirs in circular loop
    setTimeout(() => {
      setSaltAnimation('stirring');
      setMessage('Bàn tay cầm đũa khuấy đang xoay tròn để hòa tan muối biển trong nước...');
      if (soundEnabled) soundEngine.playWaterStir();

      let startTime = performance.now();
      const stirInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const currentAngle = (elapsed / 1800) * 360 * 3;
        setStirringRodAngle(currentAngle);
        if (Math.random() < 0.25) {
          waveVelocities.current[Math.floor(40 * 0.5)] = (Math.random() - 0.5) * 8;
        }
      }, 30);

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
            `🧂 Bé vừa hòa tan thêm 1 thìa muối! Nước đặc hơn một chút (tỷ trọng ${newDensity.toFixed(2)} g/cm³). Nước càng mặn thì sức nâng càng lớn!`
          );
        }
      }, 1800);
    }, 1800);
  };

  const handleResetSalt = () => {
    if (saltAnimation !== 'idle') return;
    setSaltSpoons(0);
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay bằng nước ngọt tinh khiết mới! Quả trứng lại chìm nghỉm xuống đáy cát.');
  };

  // Scoop item out with net tool - Smooth, tactile multi-phase animation
  const handleScoopItem = (itemId: string) => {
    if (netScoopAnim) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (soundEnabled) {
      soundEngine.playNetScoop();
    }

    // Phase 1: Net swoops down under the item
    setNetScoopAnim({
      itemId: item.id,
      itemIcon: item.icon,
      itemName: item.name,
      x: item.x,
      y: item.y + 10,
      phase: 'dipping'
    });

    setMessage(`🧺 Đang luồn vợt xuống dưới vớt ${item.name} lên...`);

    // Phase 2: Net scoops up item out of the water with splash
    setTimeout(() => {
      setNetScoopAnim((prev) => (prev ? { ...prev, y: currentWaterSurfaceY - 40, phase: 'lifting' } : null));
      if (soundEnabled) soundEngine.playWaterSplash(false);
      createWaterSplash(item.x, false, 80);

      // Phase 3: Net glides towards top-right / Toy Shelf
      setTimeout(() => {
        const tankW = tankDimensions.width || 800;
        setNetScoopAnim((prev) => (prev ? { ...prev, x: tankW - 40, y: 35, phase: 'returning' } : null));

        // Phase 4: Drop item safely back into Toy Shelf
        setTimeout(() => {
          setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, inTank: false, status: 'basket', y: 60, vy: 0, vx: 0 } : i))
          );
          setNetScoopAnim(null);
          setMessage(`Bé đã dùng vợt vớt ${item.name} cất lại gọn gàng vào khay đồ chơi!`);
        }, 450);
      }, 550);
    }, 350);
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
    const tankWidth = tankDimensions.width || 800;
    const dropX = Math.random() * (tankWidth * 0.6) + tankWidth * 0.2;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inTank: true,
              x: dropX,
              y: 50,
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

    const tankWidth = tankDimensions.width || 800;

    setRaceRunning(true);
    setMessage('Chuẩn bị... 3... 2... 1... THẢ 2 VẬT CÙNG LÚC TỪ TRÊN CAO!');

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemA.id) {
          return {
            ...i,
            inTank: true,
            x: tankWidth * 0.35,
            y: 45,
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
            y: 45,
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

  const tankW = tankDimensions.width || 800;
  const tankH = tankDimensions.height || 520;

  return (
    <div 
      ref={containerRef}
      className={`select-none transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-slate-950 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto' 
          : 'space-y-4'
      }`}
    >
      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN LAYOUT: TANK (LEFT) & DEDICATED SIDE TOOLBAR (RIGHT)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: THE CLEAN, FULL-CANVAS PHYSICAL WATER TANK (8 / 12 cols)     */}
        {/* ========================================================================= */}
        <div className="xl:col-span-8 flex flex-col space-y-3">
          {/* Header Bar above tank: Minimalist title + Fullscreen toggle */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <span>Bể Thử Nghiệm Chìm Nổi Trực Quan</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition"
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold shadow-xs transition"
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

          {/* The Physics Glass Aquarium Tank */}
          <div
            ref={tankRef}
            onPointerEnter={() => setIsHoveringTank(true)}
            onPointerLeave={() => setIsHoveringTank(false)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (saltAnimation === 'idle' && saltSpoons < 5) {
                handleTriggerAddSalt();
              }
            }}
            className={`relative w-full rounded-3xl border-4 border-sky-400/90 dark:border-sky-500/70 bg-gradient-to-b from-sky-50/60 via-cyan-50/40 to-blue-100/30 dark:from-[#0a101d] dark:via-[#0c1626] dark:to-[#0e1d33] overflow-hidden shadow-2xl flex flex-col justify-end touch-none select-none ${
              activeTool === 'net' ? 'cursor-none' : 'cursor-default'
            } ${isFullscreen ? 'flex-1 min-h-[540px]' : 'h-[500px] sm:h-[530px]'}`}
          >
            {/* UNIFIED SOLID WATER BODY: SVG SPANNING EXACTLY FROM WAVE LINE TO BOTTOM */}
            {/* CRYSTAL-CLEAR TRANSPARENT WATER: VIVIDLY REVEALS ALL OBJECTS AND SANDY BED */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-10" 
              viewBox={`0 0 ${tankW} ${tankH}`}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Crystal clear transparent freshwater gradient */}
                <linearGradient id="solidWaterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.25" />
                  <stop offset="25%" stopColor="#7dd3fc" stopOpacity="0.32" />
                  <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.52" />
                </linearGradient>
                {/* Crystal clear emerald saltwater gradient */}
                <linearGradient id="solidSaltWaterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.28" />
                  <stop offset="25%" stopColor="#5eead4" stopOpacity="0.36" />
                  <stop offset="65%" stopColor="#2dd4bf" stopOpacity="0.46" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.56" />
                </linearGradient>
              </defs>

              {/* Solid continuous water body starting precisely at the wave curve */}
              <path
                d={(() => {
                  let p = `M 0 ${currentWaterSurfaceY + (waveSprings[0] || 0)}`;
                  for (let i = 1; i < 40; i++) {
                    const x = (i / 39) * tankW;
                    const y = currentWaterSurfaceY + (waveSprings[i] || 0);
                    p += ` L ${x} ${y}`;
                  }
                  p += ` L ${tankW} ${tankH} L 0 ${tankH} Z`;
                  return p;
                })()}
                fill={saltSpoons > 2 ? 'url(#solidSaltWaterGradient)' : 'url(#solidWaterGradient)'}
              />

              {/* Clean glistening surface wave stroke */}
              <path
                d={(() => {
                  let p = `M 0 ${currentWaterSurfaceY + (waveSprings[0] || 0)}`;
                  for (let i = 1; i < 40; i++) {
                    const x = (i / 39) * tankW;
                    const y = currentWaterSurfaceY + (waveSprings[i] || 0);
                    p += ` L ${x} ${y}`;
                  }
                  return p;
                })()}
                fill="none"
                stroke="rgba(255, 255, 255, 0.92)"
                strokeWidth="2.5"
              />
            </svg>

            {/* Natural Sandy Bed at bottom - NO TEXT */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-300 via-amber-200/90 to-transparent dark:from-amber-950 dark:via-amber-900/60 border-t border-amber-300/40 pointer-events-none z-15" />

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

            {/* Interactive Net Cursor following pointer */}
            {activeTool === 'net' && isHoveringTank && !holdingItemId && !netScoopAnim && (
              <div
                style={{
                  left: `${netCursorPos.x}px`,
                  top: `${netCursorPos.y}px`,
                  transform: 'translate(-30%, -70%)'
                }}
                className="absolute pointer-events-none z-35 filter drop-shadow-md select-none transition-none"
              >
                <svg width="70" height="70" viewBox="0 0 64 64" fill="none">
                  {/* Handle */}
                  <line x1="62" y1="2" x2="36" y2="28" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="62" y1="2" x2="36" y2="28" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                  {/* Metal Hoop Ring */}
                  <ellipse cx="24" cy="40" rx="17" ry="13" fill="rgba(14, 165, 233, 0.12)" stroke="#0ea5e9" strokeWidth="3" />
                  {/* Net Grid Mesh */}
                  <path d="M 10 38 Q 24 54 38 38" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M 10 44 Q 24 58 38 44" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M 24 28 Q 14 42 24 54" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                </svg>
              </div>
            )}

            {/* Dynamic Scooping Net Animation */}
            {netScoopAnim && (
              <div
                style={{
                  left: `${netScoopAnim.x}px`,
                  top: `${netScoopAnim.y}px`,
                  transform: 'translate(-40%, -75%)',
                  transition: netScoopAnim.phase === 'dipping' ? 'all 0.35s cubic-bezier(0.2, 0.8, 0.4, 1)' : 'all 0.5s ease-out'
                }}
                className="absolute pointer-events-none z-45 filter drop-shadow-xl select-none"
              >
                <div className="relative">
                  {/* Scoop Net SVG */}
                  <svg width="88" height="88" viewBox="0 0 64 64" fill="none">
                    <line x1="62" y1="2" x2="36" y2="28" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                    <line x1="62" y1="2" x2="36" y2="28" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="24" cy="40" rx="18" ry="14" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="3.5" />
                    <path d="M 8 40 Q 24 64 40 40" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
                    <path d="M 12 36 Q 24 50 36 36" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                    <path d="M 12 44 Q 24 56 36 44" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                    <path d="M 24 28 Q 14 44 24 58" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                  </svg>

                  {/* Item nested inside the net bag */}
                  <div className="absolute top-[32px] left-[14px] text-3xl transform rotate-6 animate-pulse">
                    {netScoopAnim.itemIcon}
                  </div>

                  {/* Water splash droplets falling off net when lifted */}
                  {netScoopAnim.phase === 'lifting' && (
                    <div className="absolute -bottom-2 left-6 flex gap-1 text-sm animate-bounce">
                      <span>💧</span>
                      <span>💦</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* REALISTIC HAND-HELD SPOON SCOOP & STIRRING ANIMATION OVERLAY */}
            {saltAnimation !== 'idle' && (
              <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                {(saltAnimation === 'scooping' || saltAnimation === 'pouring') && (
                  <RealisticHandSpoon
                    x={spoonPos.x}
                    y={spoonPos.y}
                    rotation={spoonPos.rotation}
                    isPouring={saltAnimation === 'pouring'}
                  />
                )}

                {saltAnimation === 'stirring' && (
                  <RealisticStirringHand
                    x={(tankDimensions.width || 800) * 0.5 + Math.cos((stirringRodAngle * Math.PI) / 180) * 35}
                    y={currentWaterSurfaceY + 15 + Math.sin((stirringRodAngle * Math.PI) / 180) * 12}
                    angle={stirringRodAngle}
                  />
                )}
              </div>
            )}

            {/* Render Physics Objects Inside Tank */}
            <div className="relative w-full h-full z-25 pointer-events-auto">
              {items
                .filter((i) => i.inTank && i.id !== holdingItemId && (!netScoopAnim || netScoopAnim.itemId !== i.id))
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
                        <div className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black animate-bounce flex items-center gap-1 shadow-md">
                          <ArrowUp className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                          <span>BUÔNG TAY ĐỂ BẮN LÊN!</span>
                        </div>
                      )}

                      {/* Object Icon */}
                      <span className="text-4xl filter drop-shadow-md select-none transform transition-transform">
                        {item.icon}
                      </span>

                      {/* Floating Push Hint on Hover */}
                      {currentFloats && !isSubmerged && (
                        <div className="text-[9px] font-mono text-white bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded shadow-xs mt-0.5 pointer-events-none">
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
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DEDICATED SIDE TOOLBAR (THANH TOOLBAR BÊN CẠNH)             */}
        {/* ========================================================================= */}
        <div className="xl:col-span-4 flex flex-col space-y-3">
          
          {/* Card 1: Water Indicators & Explanations (Tách riêng từ màn hình chính) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c121e] border-2 border-sky-400/80 dark:border-sky-700 shadow-md space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-sky-500" />
                <span>Trạng Thái &amp; Thông Số Nước</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                saltSpoons > 0 ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
              }`}>
                {saltSpoons === 0 ? '💧 Nước ngọt' : `🧂 Nước muối (${saltSpoons} thìa)`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">📏 Mực nước dâng:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">+{waterLevelRisePx} mm</strong>
                <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">Do các vật chiếm chỗ đẩy nước dâng</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">⚖️ Tỷ trọng nước:</span>
                <strong className="text-amber-700 dark:text-amber-300 font-bold text-sm">{waterDensity.toFixed(3)} g/cm³</strong>
                <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">Độ đặc của nước tăng khi thêm muối</span>
              </div>
            </div>
          </div>

          {/* Card 2: Salt Shaker & Hands-on Spoon Action */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-900 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧂</span>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Hũ Muối Biển Tinh Khiết
                  </h4>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                    Đã hòa tan: {saltSpoons}/5 thìa muối
                  </span>
                </div>
              </div>

              {saltSpoons > 0 && (
                <button
                  onClick={handleResetSalt}
                  disabled={saltAnimation !== 'idle'}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-mono font-semibold hover:bg-amber-100 transition shadow-2xs flex items-center gap-1"
                  title="Thay bằng nước ngọt"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xả muối</span>
                </button>
              )}
            </div>

            {/* Interactive Drag & Click Spoon Handle - Synchronized with Tay Ném */}
            <div
              draggable={saltAnimation === 'idle' && saltSpoons < 5}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', 'salt-spoon');
              }}
              onClick={handleTriggerAddSalt}
              className={`p-2.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-100/70 dark:bg-amber-950/40 flex items-center justify-between cursor-pointer hover:bg-amber-200/70 transition select-none ${
                saltAnimation !== 'idle' || saltSpoons >= 5 ? 'opacity-50 pointer-events-none' : 'hover:scale-[1.02]'
              }`}
              title="Bấm hoặc kéo thìa xúc muối thả vào bể nước"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🥄</span>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-950 dark:text-amber-200 block">
                    Thìa Xúc Muối (Bấm / Kéo)
                  </span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-sans block">
                    Kéo thả vào bể hoặc bấm nút
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold">
                {saltSpoons}/5
              </span>
            </div>

            <button
              onClick={handleTriggerAddSalt}
              disabled={saltAnimation !== 'idle' || saltSpoons >= 5}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>🥄 Xúc Thìa Muối Đổ Vào Bể ({saltSpoons}/5)</span>
            </button>
          </div>

          {/* Card 3: Interactive Tool Selectors */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTool('hand')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTool === 'hand'
                    ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>🖐️ Tay ném</span>
              </button>

              <button
                onClick={() => setActiveTool('net')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTool === 'net'
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <AquariumNetIcon className="w-4 h-4" />
                <span>Vợt vớt đồ</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowXRay(!showXRay)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-1 ${
                  showXRay
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{showXRay ? 'Tắt X-Ray' : 'Soi Túi Khí (X-Ray)'}</span>
              </button>

              <button
                onClick={() => setRaceModeActive(!raceModeActive)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-1 ${
                  raceModeActive
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{raceModeActive ? 'Đóng Đua' : 'Đua Thả 2 Vật'}</span>
              </button>
            </div>

            {/* Drop race bridge */}
            {raceModeActive && (
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <select
                    value={raceSlotA}
                    onChange={(e) => setRaceSlotA(e.target.value)}
                    className="text-xs font-mono font-bold px-1.5 py-1 bg-white dark:bg-slate-900 border border-purple-300 rounded text-slate-800 dark:text-slate-200 w-[45%]"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                    ))}
                  </select>
                  <span className="text-xs font-bold text-purple-600">VS</span>
                  <select
                    value={raceSlotB}
                    onChange={(e) => setRaceSlotB(e.target.value)}
                    className="text-xs font-mono font-bold px-1.5 py-1 bg-white dark:bg-slate-900 border border-purple-300 rounded text-slate-800 dark:text-slate-200 w-[45%]"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleStartRace}
                  disabled={raceRunning}
                  className="w-full py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-1 shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Thả Rơi Cùng Lúc!</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 4: Toy Shelf (Khay Đồ Chơi 10 Món) */}
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-[#0f172a] border-2 border-amber-300 dark:border-amber-700/80 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1">
                <span>🧺 Khay Đồ Chơi Của Bé</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-950">
                  {items.filter(i => !i.inTank).length}/10 món
                </span>
                <button
                  onClick={handleResetAllTank}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 transition"
                  title="Vớt tất cả về khay"
                >
                  Dọn bể
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Bấm để thả ngay hoặc bấm giữ kéo ném vào bể:
            </p>

            {/* 10 Items 2-Column Grid */}
            <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
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
                    className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                      isInTank
                        ? 'opacity-35 bg-slate-100 dark:bg-slate-900 border-dashed border-slate-300 cursor-default'
                        : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 hover:border-emerald-500 hover:scale-102 shadow-2xs cursor-grab active:cursor-grabbing'
                    }`}
                    title={isInTank ? 'Đang trong bể' : 'Bấm để thả rơi hoặc kéo thả vào bể'}
                  >
                    <span className="text-2xl mb-0.5">{item.icon}</span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {item.weightGrams}g
                    </span>

                    {showXRay && (
                      <span className="text-[8px] font-mono font-bold text-purple-700 dark:text-purple-300">
                        {willFloat ? 'Túi khí' : 'Đặc ruột'}
                      </span>
                    )}
                    {isInTank && (
                      <span className="text-[8px] font-mono text-emerald-600 font-bold">
                        ✓ Trong bể
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM FULL-WIDTH: Ô GIẢI THÍCH SƯ PHẠM CỦA CÔ MIMI                       */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
          👩‍🏫
        </div>
        <div className="space-y-0.5 flex-1">
          <h4 className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Cô Mimi Dẫn Dắt &amp; Giải Thích:</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

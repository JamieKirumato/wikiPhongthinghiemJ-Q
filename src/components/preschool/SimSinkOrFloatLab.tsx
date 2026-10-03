import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Plus,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';
import { speechEngine } from '../../utils/speechUtils';

export interface Props {
  onBackToTable?: () => void;
  isStandalone?: boolean;
}

export interface TankObject {
  id: string;
  name: string;
  icon: string;
  image: string;
  size: number;
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
  { id: 'item-pebble', name: 'Hòn sỏi', icon: '🪨', image: '/assets/items/pebble.png', size: 62, weightGrams: 50, volumeMl: 20, floatsDefault: false, desc: 'Đá tự nhiên', densityNote: 'Đặc ruột và nặng hơn nước nên chìm nghỉm ngay lập tức xuống đáy', inTank: false, x: 120, y: 120, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-keys', name: 'Chùm chìa khóa', icon: '🔑', image: '/assets/items/keys.png', size: 70, weightGrams: 42, volumeMl: 10, floatsDefault: false, desc: 'Kim loại nặng', densityNote: 'Kim loại đặc nặng, rơi thẳng tắp và chìm ngay xuống đáy cát', inTank: false, x: 190, y: 120, vx: 0, vy: 0, angle: 15, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-spoon', name: 'Thìa inox', icon: '🥄', image: '/assets/items/spoon.png', size: 80, weightGrams: 35, volumeMl: 7, floatsDefault: false, desc: 'Kim loại phẳng', densityNote: 'Kim loại nặng đặc, chìm nhanh xuống đáy cát', inTank: false, x: 260, y: 120, vx: 0, vy: 0, angle: -15, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-egg', name: 'Quả trứng', icon: '🥚', image: '/assets/items/egg.png', size: 64, weightGrams: 55, volumeMl: 50, floatsDefault: false, desc: 'Trứng gà tươi', densityNote: 'Nặng hơn nước ngọt nên chìm, nhưng sẽ NỔI BỒNG BỀNH khi nước đủ mặn!', inTank: false, x: 330, y: 120, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-apple', name: 'Quả táo đỏ', icon: '🍎', image: '/assets/items/apple.png', size: 78, weightGrams: 75, volumeMl: 90, floatsDefault: true, desc: 'Trái cây ruột xốp', densityNote: 'Ruột táo chứa nhiều túi khí nhỏ nên nổi bồng bềnh trên mặt nước', inTank: false, x: 400, y: 120, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-wood', name: 'Khối gỗ', icon: '🪵', image: '/assets/items/wood.png', size: 74, weightGrams: 28, volumeMl: 45, floatsDefault: true, desc: 'Gỗ khô', densityNote: 'Nhẹ hơn nước ngọt, nổi vững chãi chìm khoảng một nửa', inTank: false, x: 470, y: 120, vx: 0, vy: 0, angle: 5, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-duck', name: 'Vịt cao su', icon: '🐥', image: '/assets/items/duck.png', size: 86, weightGrams: 12, volumeMl: 55, floatsDefault: true, desc: 'Cao su rỗng ruột', densityNote: 'Rất nhẹ; khi kéo dìm xuống nước sẽ cảm nhận lực đẩy Acsimet giằng ngược lên!', inTank: false, x: 540, y: 120, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-pingpong', name: 'Bóng bàn', icon: '⚪', image: '/assets/items/pingpong.png', size: 56, weightGrams: 3, volumeMl: 40, floatsDefault: true, desc: 'Nhựa rỗng chứa khí', densityNote: 'Siêu nhẹ và chứa đầy không khí; dìm xuống đáy sẽ phóng vọt lên như tên lửa!', inTank: false, x: 610, y: 120, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-leaf', name: 'Chiếc lá', icon: '🍃', image: '/assets/items/leaf.png', size: 72, weightGrams: 1, volumeMl: 5, floatsDefault: true, desc: 'Lá cây tự nhiên', densityNote: 'Bản rộng và siêu nhẹ, lượn êm dịu trên mặt nước', inTank: false, x: 680, y: 120, vx: 0, vy: 0, angle: 10, vRot: 0, settled: false, status: 'basket' },
  { id: 'item-foam', name: 'Mẩu xốp', icon: '🧱', image: '/assets/items/foam.png', size: 76, weightGrams: 2, volumeMl: 35, floatsDefault: true, desc: 'Xốp bọt biển', densityNote: 'Hàng triệu lỗ khí li ti, nổi sát trên bề mặt nước', inTank: false, x: 750, y: 120, vx: 0, vy: 0, angle: 0, vRot: 0, settled: false, status: 'basket' }
];

interface SurfaceRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface SplashDroplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
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

export const SimSinkOrFloatLab: React.FC<Props> = ({ isStandalone = false }) => {
  // Container & Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio & Speech
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => speechEngine.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Friendly Mascot Message (Short, 1-line for preschool kids)
  const [message, setMessage] = useState<string>(
    'Chào bé! Hãy chọn đồ vật ở khay bên dưới thả vào bể nước xem chìm hay nổi nhé!'
  );

  // Guide modal for teachers & parents
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Collapsible Floating Panels
  const [isToyTrayCollapsed, setIsToyTrayCollapsed] = useState<boolean>(false);
  const [isSaltPanelCollapsed, setIsSaltPanelCollapsed] = useState<boolean>(false);

  // Tools & modes
  const [activeTool, setActiveTool] = useState<'hand' | 'net'>('hand');
  const [showXRay, setShowXRay] = useState(false);

  // Items in simulation
  const [items, setItems] = useState<TankObject[]>(PLAY_ITEMS_PRESETS);
  const itemsRef = useRef<TankObject[]>(PLAY_ITEMS_PRESETS);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Dragging & Interaction States
  const [holdingItemId, setHoldingItemId] = useState<string | null>(null);
  const [holdingPointerPos, setHoldingPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [submergingItemId, setSubmergingItemId] = useState<string | null>(null);

  // Pointer fling tracking
  const pointerHistory = useRef<{ x: number; y: number; time: number }[]>([]);
  const lastStirSoundTime = useRef<number>(0);
  const lastCavitationTime = useRef<number>(0);

  // Salinity State
  const [saltSpoons, setSaltSpoons] = useState<number>(0); // 0 to 5 spoons
  const waterDensity = 1.00 + saltSpoons * 0.035; // 1.00 -> 1.175 g/cm³

  // Drop race mode: comparing 2 items dropped simultaneously
  const [raceModeActive, setRaceModeActive] = useState<boolean>(false);
  const [raceSlotA, setRaceSlotA] = useState<string>('item-pebble');
  const [raceSlotB, setRaceSlotB] = useState<string>('item-duck');
  const [raceRunning, setRaceRunning] = useState<boolean>(false);

  // Tank DOM measurement & water geometry constants
  const tankRef = useRef<HTMLDivElement | null>(null);
  const [tankDimensions, setTankDimensions] = useState<{ width: number; height: number }>({ width: 960, height: 600 });

  // Update tank dimensions on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (tankRef.current) {
        setTankDimensions({
          width: tankRef.current.clientWidth || 960,
          height: tankRef.current.clientHeight || 600
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  // LOWER WATER LEVEL GEOMETRY: Water surface at ~52% of tank height
  // Generous headroom (> 290px) above water for kids to fling, throw, and drop!
  const BASE_WATER_SURFACE_Y = Math.round((tankDimensions.height || 600) * 0.52);
  const TANK_BOTTOM_Y = (tankDimensions.height || 600) - 55; // Sand bed collision plane

  // Archimedes water displacement (mực nước dâng)
  const totalVolumeInWater = items
    .filter((i) => i.inTank)
    .reduce((sum, i) => sum + i.volumeMl, 0);
  const waterLevelRisePx = Math.min(30, Math.round(totalVolumeInWater * 0.07));
  const currentWaterSurfaceY = BASE_WATER_SURFACE_Y - waterLevelRisePx;

  // Particle systems
  const [waveSprings, setWaveSprings] = useState<number[]>(() => Array(48).fill(0));
  const waveVelocities = useRef<number[]>(Array(48).fill(0));
  const [surfaceRipples, setSurfaceRipples] = useState<SurfaceRipple[]>([]);
  const [splashDroplets, setSplashDroplets] = useState<SplashDroplet[]>([]);
  const [bubbles, setBubbles] = useState<BubbleParticle[]>([]);
  const [sandDust, setSandDust] = useState<SandDustParticle[]>([]);
  const [saltParticles, setSaltParticles] = useState<SaltParticle[]>([]);

  // Speech subscription
  useEffect(() => {
    const unsub = speechEngine.subscribeSpeakingState(setIsSpeaking);
    return () => unsub();
  }, []);

  // Voice narration whenever message changes
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

  // Water splash fountain & droplets scaled by impact velocity and object weight
  const createWaterSplash = useCallback((xPx: number, isHeavy: boolean, impactSpeed: number = 100, itemSize: number = 60, weightGrams: number = 30) => {
    if (soundEnabled) {
      soundEngine.playWaterSplash(isHeavy || impactSpeed > 280);
    }

    // 1. Disturb wave springs near impact - scaled by impact speed & weight
    if (tankRef.current) {
      const tankWidth = tankDimensions.width || 960;
      const nodeIndex = Math.min(47, Math.max(0, Math.floor((xPx / tankWidth) * 48)));
      const weightFactor = Math.min(2.5, Math.max(0.6, weightGrams / 35));
      const baseForce = Math.min(26, Math.max(8, (impactSpeed * 0.05) * weightFactor));
      
      waveVelocities.current[nodeIndex] = baseForce;
      if (nodeIndex > 0) waveVelocities.current[nodeIndex - 1] = baseForce * 0.65;
      if (nodeIndex < 47) waveVelocities.current[nodeIndex + 1] = baseForce * 0.65;
      if (nodeIndex > 1) waveVelocities.current[nodeIndex - 2] = baseForce * 0.35;
      if (nodeIndex < 46) waveVelocities.current[nodeIndex + 2] = baseForce * 0.35;
    }

    // 2. Realistic Concentric Surface Ripples
    const newRipples: SurfaceRipple[] = [
      {
        id: Date.now() + Math.random(),
        x: xPx,
        y: currentWaterSurfaceY,
        radius: 6,
        maxRadius: Math.min(65, Math.max(30, (impactSpeed * 0.12) + (itemSize * 0.4))),
        alpha: 0.85
      }
    ];
    setSurfaceRipples((prev) => [...prev.slice(-8), ...newRipples]);

    // 3. Dynamic Water Splash Droplets (Water Fountain Particles shooting into the air!)
    const dropletCount = Math.min(24, Math.max(4, Math.round((impactSpeed * 0.035) * (weightGrams / 25))));
    const newDroplets: SplashDroplet[] = [];
    const colors = ['#e0f2fe', '#bae6fd', '#7dd3fc', '#ffffff'];

    for (let i = 0; i < dropletCount; i++) {
      const upwardV = -(Math.random() * (impactSpeed * 0.38 + 120) + 70);
      const horizontalV = (Math.random() - 0.5) * (Math.min(280, impactSpeed * 0.4 + 90));
      newDroplets.push({
        id: Date.now() + Math.random() + i,
        x: xPx + (Math.random() - 0.5) * (itemSize * 0.7),
        y: currentWaterSurfaceY - 4,
        vx: horizontalV,
        vy: upwardV,
        radius: Math.random() * 3.5 + 2,
        alpha: 0.95,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setSplashDroplets((prev) => [...prev.slice(-36), ...newDroplets]);

    // 4. Cavitation bubbles under water surface
    const bubbleCount = isHeavy ? 6 : 2;
    const newBubbles: BubbleParticle[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: Date.now() + Math.random() + i,
        x: xPx + (Math.random() * 26 - 13),
        y: currentWaterSurfaceY + 12 + i * 12,
        vy: -(Math.random() * 1.5 + 0.8),
        size: Math.random() * 4.5 + 2.5,
        wobble: Math.random() * 8,
        alpha: 0.85
      });
    }
    setBubbles((prev) => [...prev.slice(-25), ...newBubbles]);
    if (isHeavy && soundEnabled) soundEngine.playBubbleGlug();
  }, [currentWaterSurfaceY, soundEnabled, tankDimensions.width]);

  // Sand bed dust puff
  const createSandBedDust = useCallback((xPx: number) => {
    if (soundEnabled) {
      soundEngine.playSandThump();
    }
    const newPuffs: SandDustParticle[] = [];
    for (let i = 0; i < 12; i++) {
      newPuffs.push({
        id: Date.now() + Math.random() + i,
        x: xPx + (Math.random() * 30 - 15),
        y: TANK_BOTTOM_Y - 5,
        vx: (Math.random() - 0.5) * 35,
        vy: -(Math.random() * 22 + 8),
        size: Math.random() * 6 + 3,
        alpha: 0.7,
        life: 1.0
      });
    }
    setSandDust((prev) => [...prev.slice(-24), ...newPuffs]);
  }, [soundEnabled, TANK_BOTTOM_Y]);

  // 60 FPS 2D PHYSICS ENGINE LOOP (FAST SINKING FOR HEAVY OBJECTS, VIBRANT SPLASH, SMOOTH BUOYANCY)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // 1. Water Wave Springs Update
      const tension = 0.006;
      const dampening = 0.085;
      const spread = 0.12;

      setWaveSprings((prevSprings) => {
        const next = [...prevSprings];
        const vels = waveVelocities.current;

        for (let i = 0; i < next.length; i++) {
          const force = -tension * next[i] - dampening * vels[i];
          vels[i] += force;
          next[i] += vels[i];
        }

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

        // Slow calm idle swell
        next[0] += Math.sin(currentTime * 0.0014) * 0.22;
        return next;
      });

      // 2. Surface Ripples
      setSurfaceRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            radius: r.radius + 1.2,
            alpha: r.alpha - 0.02
          }))
          .filter((r) => r.alpha > 0 && r.radius < r.maxRadius)
      );

      // 3. Splash Droplets (Gravity pulls arched fountain droplets back down)
      setSplashDroplets((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: d.x + d.vx * dt,
            y: d.y + d.vy * dt,
            vy: d.vy + 680 * dt, // Gravity on water drops
            alpha: d.alpha - 0.016
          }))
          .filter((d) => d.alpha > 0 && (d.vy < 0 || d.y < currentWaterSurfaceY + 6))
      );

      // 4. Sand dust
      setSandDust((prev) =>
        prev
          .map((d) => ({
            ...d,
            x: d.x + d.vx * dt,
            y: d.y + d.vy * dt,
            size: d.size + 0.12,
            alpha: d.alpha - 0.018,
            life: d.life - 0.022
          }))
          .filter((d) => d.life > 0 && d.alpha > 0)
      );

      // 5. Underwater Cavitation Bubbles
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y + b.vy,
            x: b.x + Math.sin(b.y * 0.12 + b.wobble) * 0.6,
            alpha: b.alpha - 0.014
          }))
          .filter((b) => b.y > currentWaterSurfaceY && b.alpha > 0)
      );

      // 6. Salt Particles
      setSaltParticles((prev) =>
        prev
          .map((s) => ({
            ...s,
            y: s.y + s.vy,
            alpha: s.alpha - 0.018
          }))
          .filter((s) => s.y < TANK_BOTTOM_Y && s.alpha > 0)
      );

      // 7. Tank Objects Physics Step
      const currentTankItems = itemsRef.current;
      let hasChanges = false;
      const nextItems = currentTankItems.map((item) => {
        if (!item.inTank || item.id === holdingItemId) return item;
        if (item.status === 'pushed') return item;

        const currentDensity = item.weightGrams / item.volumeMl;
        const willFloatInCurrentLiquid = currentDensity < waterDensity;

        // Immobile once settled on sand bed unless salinity increased enough to float it!
        if (item.settled && item.status === 'sunk') {
          if (willFloatInCurrentLiquid) {
            hasChanges = true;
            return {
              ...item,
              status: 'floating' as const,
              settled: false,
              vy: -150
            };
          }
          return item;
        }

        let { x, y, vx, vy, angle, vRot } = item;
        let status = item.status;
        let settled = item.settled;

        // Physical contact: Object bottom enters water surface
        const itemHalfHeight = item.size * 0.45;
        const isSubmerged = (y + itemHalfHeight) >= currentWaterSurfaceY;

        if (!isSubmerged) {
          // Free fall in air: Strong gravity
          const gAir = 720;
          vy += gAir * dt;
          vx *= 1 - 0.3 * dt;
          y += vy * dt;
          x += vx * dt;
          angle += vRot * dt;

          if ((y + itemHalfHeight) >= currentWaterSurfaceY) {
            // Water Entry Splash!
            createWaterSplash(x, !willFloatInCurrentLiquid, Math.abs(vy), item.size, item.weightGrams);
            status = willFloatInCurrentLiquid ? 'floating' : 'sunk';
          }
          hasChanges = true;
        } else {
          // In Water Physics
          const equilibriumSubmergedFraction = Math.min(1, currentDensity / waterDensity);
          const equilibriumY = currentWaterSurfaceY + (equilibriumSubmergedFraction * (item.size * 0.4) - item.size * 0.2);

          if (willFloatInCurrentLiquid) {
            // FLOATING OBJECT: Responsive, springy bobbing at waterline
            const fluidDragY = -5.0 * vy;
            const fluidDragX = -5.5 * vx;
            const displacement = y - equilibriumY;
            const springK = 38;
            const restoringForce = -springK * displacement;

            vy += (restoringForce + fluidDragY) * dt;
            y += vy * dt;
            vx += fluidDragX * dt;
            x += vx * dt;

            // Dampen exit when bobbing above water
            if (y < currentWaterSurfaceY - item.size * 0.4 && vy < 0) {
              vy *= 0.6;
            }

            angle += (0 - angle) * 3.5 * dt;
            vRot *= 0.85;

            if (Math.abs(vy) < 1.0 && Math.abs(displacement) < 0.6) {
              y = equilibriumY;
              vy = 0;
            }
            status = 'floating';
            hasChanges = true;
          } else {
            // SINKING OBJECT: HEAVY OBJECTS (Keys, Pebble, Spoon) PLUNGE RAPIDLY!
            // Notice: Keys (~4.2 g/cm³) and pebble (~2.5 g/cm³) have high net gravitational acceleration!
            const isHeavyDense = currentDensity >= 2.0;
            const waterDownAccel = isHeavyDense ? 680 : 380;
            const fluidDragCoeff = isHeavyDense ? -2.2 : -4.8;
            const fluidDragY = fluidDragCoeff * vy;

            vy += (waterDownAccel + fluidDragY) * dt;

            // Spawn trailing bubbles while plunging through water
            if (vy > 60 && y < TANK_BOTTOM_Y - 20 && currentTime - lastCavitationTime.current > 140) {
              setBubbles((prev) => [
                ...prev.slice(-20),
                {
                  id: Date.now() + Math.random(),
                  x: x + (Math.random() * 12 - 6),
                  y: y + itemHalfHeight * 0.5,
                  vy: -(Math.random() * 1.6 + 0.8),
                  size: Math.random() * 3.8 + 2.2,
                  wobble: Math.random() * 8,
                  alpha: 0.8
                }
              ]);
              lastCavitationTime.current = currentTime;
            }

            // Descending motion
            if (y < TANK_BOTTOM_Y - itemHalfHeight) {
              if (item.id === 'item-spoon') {
                angle = Math.sin(currentTime * 0.007) * 20;
                vx = Math.cos(currentTime * 0.007) * 14;
              } else {
                angle += (0 - angle) * 2.5 * dt;
                vx *= 1 - 4.5 * dt;
              }
              y += vy * dt;
              x += vx * dt;
            }

            // Sand bed collision
            if (y >= TANK_BOTTOM_Y - itemHalfHeight) {
              if (vy > 40) {
                createSandBedDust(x);
                vy = -vy * 0.12;
                y = TANK_BOTTOM_Y - itemHalfHeight;
              } else {
                y = TANK_BOTTOM_Y - itemHalfHeight;
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
        const tankWidth = tankDimensions.width || 960;
        const halfW = item.size * 0.5;
        if (x < halfW + 10) {
          x = halfW + 10;
          vx = -vx * 0.3;
        } else if (x > tankWidth - halfW - 10) {
          x = tankWidth - halfW - 10;
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
  }, [currentWaterSurfaceY, waterDensity, holdingItemId, createWaterSplash, createSandBedDust, TANK_BOTTOM_Y, tankDimensions.width, tankDimensions.height]);

  // Hand drag, drop, and throw with BUOYANCY DRAG RESISTANCE
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
      setHoldingPointerPos({ x: currX, y: currY });
      pointerHistory.current = [{ x: currX, y: currY, time: performance.now() }];
    }

    setMessage(`Bé đang cầm "${item.name}". Bé có thể giơ lên cao thả rơi, hoặc kéo dìm xuống nước xem lực đẩy nhé!`);
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
      setHoldingPointerPos({ x: currX, y: currY });

      // Spawn effervescent bubbling when dragging buoyant items underwater
      const holdingItem = items.find((i) => i.id === holdingItemId);
      if (holdingItem && currY > currentWaterSurfaceY + 20) {
        const itemDensity = holdingItem.weightGrams / holdingItem.volumeMl;
        if (itemDensity < waterDensity && now - lastCavitationTime.current > 120) {
          setBubbles((prev) => [
            ...prev.slice(-24),
            {
              id: Date.now() + Math.random(),
              x: currX + (Math.random() * 20 - 10),
              y: currY + 10,
              vy: -(Math.random() * 1.8 + 1.0),
              size: Math.random() * 4.5 + 2.0,
              wobble: Math.random() * 8,
              alpha: 0.85
            }
          ]);
          lastCavitationTime.current = now;
        }
      }
    } else if (activeTool === 'hand' && e.buttons === 1) {
      // Gentle water surface stirring with finger
      if (currY >= currentWaterSurfaceY - 20 && currY <= TANK_BOTTOM_Y) {
        const tankWidth = rect.width || 960;
        const nodeIndex = Math.min(47, Math.max(0, Math.floor((currX / tankWidth) * 48)));
        waveVelocities.current[nodeIndex] = 10;

        setItems((prev) =>
          prev.map((i) => {
            if (i.inTank && i.status === 'floating' && Math.abs(i.x - currX) < 70) {
              return { ...i, vx: i.vx + (currX > i.x ? -15 : 15) };
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

  // Releasing the dragged item: calculates release velocity & buoyancy rocket launch
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
        flingVx = Math.min(480, Math.max(-480, (last.x - first.x) / dtSec));
        flingVy = Math.min(520, Math.max(-480, (last.y - first.y) / dtSec));
      }
    }

    const currentDensity = item.weightGrams / item.volumeMl;
    const willFloat = currentDensity < waterDensity;

    // Calculate effective item release position taking buoyancy resistance into account
    let finalReleaseX = holdingPointerPos.x;
    let finalReleaseY = holdingPointerPos.y;

    if (holdingPointerPos.y > currentWaterSurfaceY && willFloat) {
      // Released underwater: BUOYANCY RESISTANCE POP!
      const depth = holdingPointerPos.y - currentWaterSurfaceY;
      const buoyancyRatio = Math.max(0, (waterDensity - currentDensity) / waterDensity);
      const resistanceFactor = 1 / (1 + 0.007 * depth * buoyancyRatio);
      finalReleaseY = currentWaterSurfaceY + depth * resistanceFactor;

      // Rocket launch upward!
      const launchVy = -(280 + 380 * buoyancyRatio);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                inTank: true,
                x: finalReleaseX,
                y: finalReleaseY,
                vx: flingVx * 0.6,
                vy: launchVy,
                settled: false,
                status: 'floating'
              }
            : i
        )
      );

      if (soundEnabled) soundEngine.playBuoyantPop();
      setMessage(`💧 Bé thả ${item.name} dưới nước: Lực đẩy đẩy vọt nó lên mặt nước!`);

      // Spawn pop bubble burst
      const popBubbles: BubbleParticle[] = [];
      for (let k = 0; k < 10; k++) {
        popBubbles.push({
          id: Date.now() + Math.random() + k,
          x: finalReleaseX + (Math.random() * 24 - 12),
          y: finalReleaseY + k * 6,
          vy: -(Math.random() * 2.2 + 1.2),
          size: Math.random() * 5 + 2.5,
          wobble: Math.random() * 8,
          alpha: 0.9
        });
      }
      setBubbles((prev) => [...prev.slice(-25), ...popBubbles]);

    } else if (holdingPointerPos.y > currentWaterSurfaceY && !willFloat) {
      // Released underwater: HEAVY OBJECT SINKS IMMEDIATELY!
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                inTank: true,
                x: finalReleaseX,
                y: finalReleaseY,
                vx: flingVx * 0.5,
                vy: Math.max(260, flingVy),
                settled: false,
                status: 'sunk'
              }
            : i
        )
      );
      setMessage(`⚓ Bé thả ${item.name} dưới nước: Vật nặng chìm nghỉm ngay xuống đáy!`);

    } else {
      // Dropped from AIR above water
      const isDroppedFromHigh = holdingPointerPos.y < currentWaterSurfaceY - 80;
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                inTank: true,
                x: finalReleaseX,
                y: finalReleaseY,
                vx: flingVx * 0.75,
                vy: Math.max(flingVy * 0.75, isDroppedFromHigh ? 70 : 40),
                settled: false,
                status: willFloat ? 'floating' : 'sunk'
              }
            : i
        )
      );

      // Splash if dropped near water surface or thrown
      if (holdingPointerPos.y >= currentWaterSurfaceY - 30) {
        createWaterSplash(finalReleaseX, !willFloat, Math.max(100, Math.abs(flingVy)), item.size, item.weightGrams);
      }

      if (willFloat) {
        setMessage(`💧 ${item.name} rơi xuống và NỔI BỒNG BỀNH trên mặt nước!`);
        if (soundEnabled) soundEngine.playWaterDrop();
      } else {
        setMessage(`⚓ ${item.name} rơi xuống và CHÌM XUỐNG ĐÁY!`);
      }
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
    setMessage(`Bé đang ấn dìm ${item.name} xuống đáy! Nước đẩy ngược lại rất mạnh. Bé hãy buông tay ra nhé!`);

    if (soundEnabled) {
      soundEngine.playBubbleGlug();
    }

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, y: TANK_BOTTOM_Y - 30, vy: 0, status: 'pushed' } : i))
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
              vy: -480,
              status: 'floating'
            }
          : i
      )
    );

    const newBubbles: BubbleParticle[] = [];
    for (let k = 0; k < 12; k++) {
      newBubbles.push({
        id: Date.now() + Math.random() + k,
        x: item.x + (Math.random() * 24 - 12),
        y: TANK_BOTTOM_Y - 20 + k * 8,
        vy: -(Math.random() * 2.2 + 1.2),
        size: Math.random() * 5 + 3,
        wobble: Math.random() * 8,
        alpha: 0.9
      });
    }
    setBubbles((prev) => [...prev.slice(-25), ...newBubbles]);

    setMessage(`🚀 VÈOOO! ${item.name} phóng vọt từ đáy lên mặt nước thật kỳ diệu!`);
    setSubmergingItemId(null);
  };

  // Quick drop item from Shelf into Tank from high air position
  const handleDropItemFromShelf = (item: TankObject) => {
    if (item.inTank) return;
    const tankWidth = tankDimensions.width || 960;
    const dropX = Math.random() * (tankWidth * 0.5) + tankWidth * 0.25;

    const currentDensity = item.weightGrams / item.volumeMl;
    const willFloat = currentDensity < waterDensity;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inTank: true,
              x: dropX,
              y: 70, // Dropped from high up in air!
              vx: (Math.random() - 0.5) * 30,
              vy: 90,
              settled: false,
              status: 'falling'
            }
          : i
      )
    );

    if (item.id === 'item-egg') {
      if (willFloat) {
        setMessage(`Kỳ diệu quá! Quả trứng đang NỔI BỒNG BỀNH vì nước muối mặn có sức nâng lớn!`);
      } else {
        setMessage(`Quả trứng chìm xuống đáy vì nặng hơn nước ngọt. Bé thử bấm thêm 3 thìa muối xem nhé!`);
      }
    } else if (willFloat) {
      setMessage(`Bé thả ${item.name}: Vật này nhẹ nên nổi bồng bềnh trên mặt nước!`);
    } else {
      setMessage(`Bé thả ${item.name}: Vật này đặc nặng nên chìm nghỉm xuống đáy cát!`);
    }
  };

  // Scoop item back to shelf
  const handleScoopItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !item.inTank) return;

    if (soundEnabled) soundEngine.playNetScoop();

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              inTank: false,
              x: PLAY_ITEMS_PRESETS.find((p) => p.id === itemId)?.x || 100,
              y: 60,
              vx: 0,
              vy: 0,
              angle: 0,
              settled: false,
              status: 'basket'
            }
          : i
      )
    );
    setMessage(`Đã vớt ${item.name} trả về khay đồ chơi!`);
  };

  // Reset entire tank
  const handleResetAllTank = () => {
    setItems(PLAY_ITEMS_PRESETS);
    setHoldingItemId(null);
    setSubmergingItemId(null);
    if (soundEnabled) soundEngine.playNetScoop();
    setMessage('Đã dọn sạch bể nước! Khay đồ chơi đã đầy đủ để bé thử nghiệm lại.');
  };

  // Salt addition
  const handleAddSaltSpoon = () => {
    if (saltSpoons >= 5) {
      setMessage('Nước đã đạt độ mặn tối đa (giống Biển Chết) rồi bé ơi!');
      return;
    }

    const nextSpoons = saltSpoons + 1;
    setSaltSpoons(nextSpoons);

    if (soundEnabled) soundEngine.playSaltPour();

    // Spawn falling salt crystal grains
    const newSalt: SaltParticle[] = [];
    const tankWidth = tankDimensions.width || 960;
    for (let i = 0; i < 28; i++) {
      newSalt.push({
        id: Date.now() + Math.random() + i,
        x: tankWidth * 0.5 + (Math.random() - 0.5) * 200,
        y: currentWaterSurfaceY - 10 + Math.random() * 20,
        vy: Math.random() * 60 + 40,
        size: Math.random() * 3 + 1.8,
        alpha: 0.95
      });
    }
    setSaltParticles((prev) => [...prev.slice(-40), ...newSalt]);

    if (nextSpoons >= 3) {
      setMessage(`🧂 Đã thêm thìa muối thứ ${nextSpoons}! Nước rất mặn và đặc. Hãy nhìn quả trứng xem nó có nổi lên không nào!`);
    } else {
      setMessage(`🧂 Bé vừa rắc thêm 1 thìa muối! Nước đang đậm đặc dần lên.`);
    }
  };

  const handleResetSalt = () => {
    setSaltSpoons(0);
    if (soundEnabled) soundEngine.playWaterSplash(false);
    setMessage('Đã thay nước ngọt mới! Nước trở lại bình thường và trong vắt.');
  };

  // Drop race: 2 items dropped simultaneously from high up
  const handleStartRace = () => {
    const itemA = items.find((i) => i.id === raceSlotA);
    const itemB = items.find((i) => i.id === raceSlotB);
    if (!itemA || !itemB) return;

    const tankWidth = tankDimensions.width || 960;
    setRaceRunning(true);
    setMessage('Chuẩn bị... 3... 2... 1... THẢ 2 VẬT CÙNG LÚC TỪ TRÊN CAO!');

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemA.id) {
          return {
            ...i,
            inTank: true,
            x: tankWidth * 0.35,
            y: 50,
            vx: 0,
            vy: 0,
            settled: false,
            status: 'falling'
          };
        }
        if (i.id === itemB.id) {
          return {
            ...i,
            inTank: true,
            x: tankWidth * 0.65,
            y: 50,
            vx: 0,
            vy: 0,
            settled: false,
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
        `🏁 KẾT QUẢ: ${itemA.name} ${aFloats ? 'NỔI' : 'CHÌM'}, còn ${itemB.name} ${bFloats ? 'NỔI' : 'CHÌM'}! To hay nhỏ không quyết định, mà do chất liệu bên trong!`
      );
    }, 1800);
  };

  // Active Drag Display Position with Buoyancy Resistance calculation
  const holdingItem = items.find((i) => i.id === holdingItemId);
  let activeDisplayX = holdingPointerPos.x;
  let activeDisplayY = holdingPointerPos.y;
  let isUnderBuoyantStrain = false;

  if (holdingItem && holdingPointerPos.y > currentWaterSurfaceY) {
    const itemDensity = holdingItem.weightGrams / holdingItem.volumeMl;
    const willFloat = itemDensity < waterDensity;
    if (willFloat) {
      const depth = holdingPointerPos.y - currentWaterSurfaceY;
      const buoyancyRatio = Math.max(0, (waterDensity - itemDensity) / waterDensity);
      // Buoyancy spring resistance formula
      const resistanceFactor = 1 / (1 + 0.007 * depth * buoyancyRatio);
      activeDisplayY = currentWaterSurfaceY + depth * resistanceFactor;
      // Micro-tremor vibration under water pushback force
      const vibration = Math.sin(performance.now() * 0.035) * 3.5 * buoyancyRatio;
      activeDisplayX = holdingPointerPos.x + vibration;
      isUnderBuoyantStrain = depth > 30;
    }
  }

  const tankW = tankDimensions.width || 960;

  return (
    <div
      ref={containerRef}
      className={`select-none transition-all duration-300 w-full flex flex-col font-sans ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-2 sm:p-4 flex flex-col justify-between overflow-hidden'
          : 'relative space-y-3'
      }`}
    >
      {/* 1. TOP FRIENDLY MASCOT BAR (1-line, Preschool style with Cô Mimi) */}
      <div className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-lg flex-shrink-0 shadow-xs animate-bounce">
            👩‍🏫
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                Cô Mimi Hướng Dẫn:
              </span>
              {isStandalone && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                  Bản Full Màn Hình
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
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
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
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

      {/* 2. THE FULL-WIDTH PHYSICAL WATER TANK (IMMERSIVE INTERACTIVE CANVAS) */}
      <div
        ref={tankRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[580px] sm:h-[620px] lg:h-[660px] rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-400/60 dark:border-sky-700/60 bg-gradient-to-b from-sky-100 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-950 cursor-default touch-none"
      >
        {/* ================================================================= */}
        {/* TOP FLOATING TOOLS DOCK (TOP-LEFT INSIDE TANK)                    */}
        {/* ================================================================= */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-700/60 shadow-lg">
          <button
            onClick={handleResetAllTank}
            className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center gap-1 transition shadow-xs"
            title="Vớt sạch đồ vật trong bể về khay"
          >
            <RotateCcw className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Dọn Bể</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'hand' ? 'net' : 'hand')}
            className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              activeTool === 'net'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title={activeTool === 'net' ? 'Đang dùng Vợt Lưới. Bấm để dùng Tay' : 'Đang dùng Tay. Bấm để dùng Vợt Lưới'}
          >
            <span>{activeTool === 'net' ? '🕸️ Vợt' : '🖐️ Tay'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
          >
            <span className="text-xs">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>

          <button
            onClick={() => setRaceModeActive(!raceModeActive)}
            className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              raceModeActive
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title="Đua thả 2 vật cùng lúc từ trên cao"
          >
            <span>🏁</span>
            <span className="hidden sm:inline">Đua Thả</span>
          </button>

          <button
            onClick={() => setShowXRay(!showXRay)}
            className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              showXRay
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title="Kính lúp soi túi khí và ruột đồ vật"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Soi Khí</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isFullscreen ? 'Thu nhỏ màn hình' : 'Mở toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* ================================================================= */}
        {/* TOP-RIGHT FLOATING SALINITY PANEL (COLLAPSIBLE)                    */}
        {/* ================================================================= */}
        <div className="absolute top-3 right-3 z-30 flex flex-col items-end">
          {isSaltPanelCollapsed ? (
            <button
              onClick={() => setIsSaltPanelCollapsed(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xl border-2 border-white transition animate-pulse"
              title="Mở bảng pha muối"
            >
              <span className="text-base">🧂</span>
              <span>Độ mặn: {saltSpoons > 0 ? `+${saltSpoons} thìa` : 'Nước ngọt'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-300/80 dark:border-amber-700/80 shadow-2xl space-y-2 max-w-[240px]">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="font-extrabold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <span>🧂 Hũ Muối Thần Kỳ</span>
                </span>
                <button
                  onClick={() => setIsSaltPanelCollapsed(true)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
                  title="Thu gọn"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Đã pha:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{saltSpoons} / 5 thìa muối</span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300"
                  style={{ width: `${(saltSpoons / 5) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={handleAddSaltSpoon}
                  disabled={saltSpoons >= 5}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Thìa</span>
                </button>
                {saltSpoons > 0 && (
                  <button
                    onClick={handleResetSalt}
                    className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-xs font-semibold"
                    title="Xả muối về nước ngọt"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RACE OVERLAY BAR (SHOWN WHEN RACE MODE IS ACTIVE)                 */}
        {/* ================================================================= */}
        {raceModeActive && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-400 shadow-2xl flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800 dark:text-white">Đua Thả 2 Vật:</span>
            <select
              value={raceSlotA}
              onChange={(e) => setRaceSlotA(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 font-bold border border-sky-300"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
              ))}
            </select>
            <span className="font-extrabold text-amber-500 text-sm">VS</span>
            <select
              value={raceSlotB}
              onChange={(e) => setRaceSlotB(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 font-bold border border-sky-300"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
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
        )}

        {/* ================================================================= */}
        {/* AIR SPACE (UPPER HALF): Cloud accents & Air labels                */}
        {/* ================================================================= */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden"
          style={{ height: `${currentWaterSurfaceY}px` }}
        >
          {/* Subtle floating cloud animations */}
          <div className="absolute top-8 left-12 w-28 h-10 rounded-full bg-white/40 blur-sm animate-pulse" />
          <div className="absolute top-14 right-20 w-36 h-12 rounded-full bg-white/35 blur-sm animate-pulse" />

          {/* Air Zone Tag */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-xs text-[11px] font-bold text-sky-800/60 dark:text-sky-300/60">
            🌤️ Không gian trên không (Thả hoặc ném từ đây)
          </div>
        </div>

        {/* ================================================================= */}
        {/* WATER BODY (LOWER HALF): Fluid gradients, waves, sand bed         */}
        {/* ================================================================= */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none transition-all duration-300"
          style={{ top: `${currentWaterSurfaceY}px` }}
        >
          {/* Water Surface SVG Dynamic Wave Line */}
          <svg className="absolute -top-3 left-0 w-full h-7 overflow-visible pointer-events-none">
            <path
              d={waveSprings.reduce((acc, yOffset, idx) => {
                const nodeX = (idx / (waveSprings.length - 1)) * tankW;
                const nodeY = 12 + yOffset;
                return idx === 0 ? `M ${nodeX} ${nodeY}` : `${acc} L ${nodeX} ${nodeY}`;
              }, '') + ` L ${tankW} 30 L 0 30 Z`}
              fill="rgba(56, 189, 248, 0.45)"
            />
            <path
              d={waveSprings.reduce((acc, yOffset, idx) => {
                const nodeX = (idx / (waveSprings.length - 1)) * tankW;
                const nodeY = 10 + yOffset;
                return idx === 0 ? `M ${nodeX} ${nodeY}` : `${acc} L ${nodeX} ${nodeY}`;
              }, '')}
              fill="none"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="2.5"
            />
          </svg>

          {/* Translucent water depth gradient */}
          <div className="w-full h-full bg-gradient-to-b from-sky-400/45 via-blue-500/50 to-indigo-700/65 dark:from-sky-600/40 dark:via-blue-800/50 dark:to-indigo-950/80 backdrop-blur-[1px] relative">
            {/* Water Caustics Shimmer Effect */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.8)_0%,transparent_60%)]" />

            {/* Salinity visual tint if salty */}
            {saltSpoons > 0 && (
              <div
                className="absolute inset-0 bg-amber-300/10 pointer-events-none transition-opacity duration-500"
                style={{ opacity: saltSpoons * 0.18 }}
              />
            )}
          </div>

          {/* Sand Bed (Bottom 55px) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-amber-300 via-amber-200 to-amber-100 dark:from-amber-950 dark:via-amber-900/60 dark:to-amber-800/40 border-t-2 border-amber-300/80"
          >
            {/* Tiny pebbles along bottom */}
            <div className="absolute top-1 left-16 w-3 h-2 rounded-full bg-stone-400 opacity-60" />
            <div className="absolute top-2 left-44 w-2.5 h-2 rounded-full bg-stone-500 opacity-50" />
            <div className="absolute top-1 right-32 w-4 h-2 rounded-full bg-stone-400 opacity-60" />
            <div className="absolute top-2 right-64 w-2 h-1.5 rounded-full bg-stone-600 opacity-50" />
          </div>
        </div>

        {/* ================================================================= */}
        {/* PARTICLES & EFFECTS: Ripples, Splash Droplets, Bubbles, Sand      */}
        {/* ================================================================= */}
        {/* 1. Concentric Water Surface Ripples */}
        {surfaceRipples.map((r) => (
          <div
            key={r.id}
            style={{
              left: `${r.x}px`,
              top: `${r.y}px`,
              width: `${r.radius * 2}px`,
              height: `${r.radius * 0.7}px`,
              opacity: r.alpha,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full border-2 border-white/80 pointer-events-none"
          />
        ))}

        {/* 2. Splash Droplets (Water fountain droplets flying in air) */}
        {splashDroplets.map((d) => (
          <div
            key={d.id}
            style={{
              left: `${d.x}px`,
              top: `${d.y}px`,
              width: `${d.radius * 2}px`,
              height: `${d.radius * 2}px`,
              backgroundColor: d.color,
              opacity: d.alpha,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full shadow-xs pointer-events-none"
          />
        ))}

        {/* 3. Underwater Cavitation Bubbles */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            style={{
              left: `${b.x}px`,
              top: `${b.y}px`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              opacity: b.alpha,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full bg-white/80 border border-sky-200/90 pointer-events-none shadow-xs"
          />
        ))}

        {/* 4. Sand dust puffs */}
        {sandDust.map((d) => (
          <div
            key={d.id}
            style={{
              left: `${d.x}px`,
              top: `${d.y}px`,
              width: `${d.size * 2}px`,
              height: `${d.size * 2}px`,
              opacity: d.alpha,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full bg-amber-200/60 blur-[2px] pointer-events-none"
          />
        ))}

        {/* 5. Salt crystals pouring */}
        {saltParticles.map((s) => (
          <div
            key={s.id}
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.alpha,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute rounded-full bg-white shadow-xs pointer-events-none"
          />
        ))}

        {/* ================================================================= */}
        {/* TANK OBJECTS RENDER (LARGE, HIGH RESOLUTION 3D TRANSPARENT SPRITES)*/}
        {/* ================================================================= */}
        {items.map((item) => {
          if (!item.inTank || item.id === holdingItemId) return null;

          const currentDensity = item.weightGrams / item.volumeMl;
          const willFloat = currentDensity < waterDensity;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handleStartHold(item, e)}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.size}px`,
                height: `${item.size}px`,
                transform: `translate(-50%, -50%) rotate(${item.angle}deg)`,
                transition: item.status === 'pushed' ? 'top 0.15s ease-out' : 'none'
              }}
              className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center group hover:scale-105 transition-transform"
            >
              {/* Realistic 3D Object Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain filter drop-shadow-lg select-none pointer-events-none"
                draggable={false}
              />

              {/* X-Ray Air Pocket Badge */}
              {showXRay && (
                <div className="absolute -top-6 px-1.5 py-0.5 rounded-md bg-purple-900/90 text-[10px] text-purple-200 font-bold whitespace-nowrap shadow-md pointer-events-none">
                  {willFloat ? 'Chứa túi khí 🫧' : 'Đặc ruột 🧱'}
                </div>
              )}

              {/* Push down button for floating objects (to shoot upward like rocket) */}
              {willFloat && item.status === 'floating' && (
                <button
                  onPointerDown={(e) => handlePushDownItem(item, e)}
                  onPointerUp={handleReleaseSubmergedItem}
                  className="absolute -bottom-5 px-1.5 py-0.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold shadow-md opacity-80 group-hover:opacity-100 transition whitespace-nowrap"
                  title="Ấn dìm xuống đáy để xem nó bắn vọt lên!"
                >
                  👇 Dìm
                </button>
              )}
            </div>
          );
        })}

        {/* ================================================================= */}
        {/* CURRENTLY DRAGGED OBJECT (WITH BUOYANCY SPRING STRAIN AURA)        */}
        {/* ================================================================= */}
        {holdingItem && (
          <div
            style={{
              left: `${activeDisplayX}px`,
              top: `${activeDisplayY}px`,
              width: `${holdingItem.size}px`,
              height: `${holdingItem.size}px`,
              transform: 'translate(-50%, -50%) scale(1.12)'
            }}
            className="absolute z-40 pointer-events-none flex flex-col items-center justify-center filter drop-shadow-2xl"
          >
            {/* Visual Buoyant Strain Resistance Glow */}
            {isUnderBuoyantStrain && (
              <div className="absolute inset-0 rounded-full border-4 border-sky-300 animate-ping opacity-75" />
            )}

            <img
              src={holdingItem.image}
              alt={holdingItem.name}
              className="w-full h-full object-contain select-none"
              draggable={false}
            />

            {/* Elastic string indicator between mouse and object if resisting buoyancy */}
            {isUnderBuoyantStrain && (
              <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-extrabold shadow-md whitespace-nowrap animate-bounce">
                🫧 Lực Đẩy Đang Chống Lại!
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* BOTTOM FLOATING TOY TRAY (COLLAPSIBLE CAROUSEL DOCK)              */}
        {/* ================================================================= */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-3 flex flex-col items-center">
          {isToyTrayCollapsed ? (
            <button
              onClick={() => setIsToyTrayCollapsed(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-2xl border-2 border-white transition transform hover:scale-105"
            >
              <span>🧺</span>
              <span>Khay Đồ Chơi (10 Món)</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-300 dark:border-amber-700 shadow-2xl space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <span>🧺 Khay Đồ Chơi: Bé hãy bấm hoặc kéo đồ vật thả vào bể nước</span>
                </span>
                <button
                  onClick={() => setIsToyTrayCollapsed(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span>Thu nhỏ khay</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal Scrollable/Flex Toy Shelf */}
              <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1 px-1 scrollbar-thin">
                {items.map((item) => {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleDropItemFromShelf(item)}
                      onPointerDown={(e) => handleStartHold(item, e)}
                      disabled={item.inTank}
                      className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all duration-200 flex-shrink-0 ${
                        item.inTank
                          ? 'opacity-35 bg-slate-100 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                          : 'bg-gradient-to-b from-white to-amber-50 dark:from-slate-800 dark:to-slate-850 hover:to-amber-100 border-amber-200 dark:border-slate-700 hover:border-amber-400 shadow-xs hover:shadow-md hover:-translate-y-1 cursor-grab active:cursor-grabbing'
                      }`}
                      style={{ width: '68px', height: '78px' }}
                      title={`Bấm hoặc kéo "${item.name}" thả vào bể`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain filter drop-shadow select-none pointer-events-none"
                          draggable={false}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate max-w-[62px]">
                        {item.name}
                      </span>

                      {/* In-tank status dot */}
                      {item.inTank && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. GUIDE MODAL FOR PRESCHOOLERS, TEACHERS & PARENTS                  */}
      {/* ===================================================================== */}
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
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Hướng Dẫn Khám Phá Thí Nghiệm
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dành cho bé từ 3 - 6 tuổi &amp; Giáo viên mầm non
                </p>
              </div>
            </div>

            {/* 3 Step Cards */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-start gap-3">
                <span className="text-2xl">🧸</span>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-sky-900 dark:text-sky-200">
                    1. Chọn đồ vật ở khay đồ chơi
                  </h4>
                  <p className="text-xs text-sky-700 dark:text-sky-300 mt-0.5 leading-relaxed">
                    Bé dùng tay chọn bất kỳ món đồ nào trong khay bên dưới (hòn sỏi, chìa khóa, vịt cao su, bóng bàn...).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <span className="text-2xl">🌊</span>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                    2. Thả rơi hoặc ném vào bể nước
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    Giơ đồ vật lên cao rồi thả để xem nước bắn tung tóe! Quan sát xem vật sẽ chìm xuống đáy hay nổi bồng bềnh.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                    3. Thử thách thú vị: Dìm bóng &amp; Rắc muối
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                    - Kéo dìm quả bóng bàn xuống đáy rồi buông tay để nó phóng vọt lên mặt nước!<br/>
                    - Thêm 3 thìa muối vào bể để xem quả trứng đang chìm tự động nổi lên!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  speechEngine.speak('Chào bé! Bước một: hãy chọn một đồ vật trong khay. Bước hai: thả hoặc ném vào bể nước. Bước ba: thử dìm quả bóng xuống đáy xem nó phóng vọt lên nhé!');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs hover:bg-amber-200 transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>Cô Mimi Đọc Hướng Dẫn</span>
              </button>

              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition"
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

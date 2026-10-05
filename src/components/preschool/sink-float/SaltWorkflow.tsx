import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SaltWorkflowStep } from './types';
import { soundEngine } from '../../../utils/audioEffects';
import { MAX_SALT_SPOONS } from './salinity';
import { RotateCcw, Sparkles } from 'lucide-react';

interface SaltWorkflowProps {
  disabled?: boolean;
  spoonFraction?: number;
  onDoseChange?: (fraction: number) => void;
  onStirAtScreenPoint?: (x: number, y: number) => void;
  onPourAtScreenPoint?: (x: number, y: number) => void;
  saltSpoons: number; // Số thìa đã tan 100% (0 đến 5)
  activeStirProgress: number; // 0 đến 100% của thìa hiện tại
  currentDensity: number; // Khối lượng riêng hiện tại (g/cm³)
  workflowStep: SaltWorkflowStep;
  onStepChange: (step: SaltWorkflowStep) => void;
  onStirProgressUpdate: (progress: number) => void;
  onSpoonCompleted: () => void;
  onResetSalt: () => void;
  checkPointInWater: (screenX: number, screenY: number) => boolean;
  soundEnabled: boolean;
  onMessageUpdate: (msg: string) => void;
}

// Bàn tay cầm thìa inox chân thực đi theo chuột
export const RealisticHandSpoon: React.FC<{
  x: number;
  y: number;
  hasSalt: boolean;
  isPouring: boolean;
  amount?: number;
}> = ({ x, y, hasSalt, isPouring, amount = 1 }) => (
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-30px, -34px) rotate(${isPouring ? 48 : -14}deg)`,
      transformOrigin: '30px 34px',
      transition: 'transform 0.22s ease-out'
    }}
    className="fixed pointer-events-none z-50 filter drop-shadow-2xl select-none"
  >
    <svg width="150" height="96" viewBox="0 0 150 96" fill="none">
      {/* Cán thìa kim loại bóng */}
      <path
        d="M 140 56 L 56 38 Q 48 36 40 34"
        stroke="url(#metalShineGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Lòng thìa */}
      <ellipse cx="30" cy="34" rx="24" ry="15" fill="url(#metalBowlGrad)" stroke="#94a3b8" strokeWidth="2" />

      {/* Ụ muối trắng tinh vun cao trên thìa */}
      {hasSalt && !isPouring && (
        <g>
          <ellipse cx="30" cy="31" rx={18 * Math.sqrt(amount)} ry={10 * amount} fill="#ffffff" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))" />
          <ellipse cx="30" cy="28" rx="11" ry="6" fill="#f8fafc" />
          <circle cx="27" cy="27" r="1.5" fill="#e2e8f0" />
          <circle cx="33" cy="29" r="1.5" fill="#e2e8f0" />
        </g>
      )}

      {/* Muối đang rơi khi nghiêng thìa */}
      {isPouring && (
        <g>
          <ellipse cx="24" cy="36" rx="11" ry="6" fill="#f8fafc" />
          <circle cx="14" cy="50" r="3.2" fill="#ffffff" />
          <circle cx="18" cy="60" r="2.8" fill="#ffffff" />
          <circle cx="11" cy="68" r="3" fill="#ffffff" />
          <circle cx="21" cy="74" r="2.2" fill="#ffffff" />
        </g>
      )}

      {/* Ngón tay cầm cán thìa */}
      <path d="M 145 68 Q 120 54 105 48 Q 96 46 88 44" stroke="#f59e0b" strokeWidth="13" strokeLinecap="round" />
      <path d="M 145 68 Q 120 54 105 48 Q 96 46 88 44" stroke="#fcd34d" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="96" cy="40" rx="9" ry="5.5" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" transform="rotate(-15 96 40)" />
      <ellipse cx="85" cy="44" rx="7" ry="5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" transform="rotate(10 85 44)" />

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

// Bàn tay cầm đũa thủy tinh khuấy nước
export const RealisticStirringHand: React.FC<{
  x: number;
  y: number;
  angle: number;
  isInWater: boolean;
}> = ({ x, y, angle, isInWater }) => (
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50px, -190px) rotate(${Math.sin((angle * Math.PI) / 180) * 12}deg)`,
      transformOrigin: '50px 190px',
      transition: 'transform 0.05s linear'
    }}
    className="fixed w-[100px] h-[200px] pointer-events-none z-50 filter drop-shadow-2xl select-none"
  >
    <svg width="100" height="200" viewBox="0 0 100 200" fill="none">
      {/* Đũa thủy tinh phòng thí nghiệm có phát quang nhẹ */}
      <rect
        x="46"
        y="30"
        width="7.5"
        height="160"
        rx="3.75"
        fill="url(#glassRodGrad)"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="28" r="5" fill="#38bdf8" opacity="0.9" />
      <circle cx="50" cy="190" r="4.5" fill="#38bdf8" opacity="0.9" />

      {/* Tay cầm đầu que đũa */}
      <path d="M 90 50 Q 70 34 54 32" stroke="#f59e0b" strokeWidth="13" strokeLinecap="round" />
      <path d="M 90 50 Q 70 34 54 32" stroke="#fcd34d" strokeWidth="10.5" strokeLinecap="round" />
      <ellipse cx="50" cy="34" rx="8" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />

      <defs>
        <linearGradient id="glassRodGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="45%" stopColor="rgba(56,189,248,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
        </linearGradient>
      </defs>
    </svg>

    {/* Vòng xoáy nước sủi bọt khi đũa đang ở trong nước */}
    {isInWater && (
      <div className="absolute left-[22px] bottom-[-4px] w-14 h-7 rounded-full border-2 border-cyan-200 animate-ping opacity-80 pointer-events-none" />
    )}
  </div>
);

export const SaltWorkflow: React.FC<SaltWorkflowProps> = ({
  disabled = false,
  spoonFraction = 1,
  onDoseChange,
  onStirAtScreenPoint,
  onPourAtScreenPoint,
  saltSpoons,
  activeStirProgress,
  currentDensity,
  workflowStep,
  onStepChange,
  onStirProgressUpdate,
  onSpoonCompleted,
  onResetSalt,
  checkPointInWater,
  soundEnabled,
  onMessageUpdate
}) => {
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJarOpen, setIsJarOpen] = useState(false);
  const scoopStartRef = useRef<{x:number;y:number} | null>(null);
  const pourStartRef = useRef<{x:number;y:number} | null>(null);
  const stirringStartedRef = useRef(0);
  const lastVisualStirRef = useRef(0);
  const progressRef = useRef(activeStirProgress);
  progressRef.current = activeStirProgress;
  const [stirWobble, setStirWobble] = useState<number>(0);
  const [isHoveringJarMouth, setIsHoveringJarMouth] = useState<boolean>(false);
  const [isInWaterState, setIsInWaterState] = useState<boolean>(false);

  // Theo dõi chính xác vị trí trước đó và trạng thái trong/ngoài nước để không nhảy bước
  const lastStirPosRef = useRef<{ x: number; y: number; wasInside: boolean }>({
    x: 0,
    y: 0,
    wasInside: false
  });

  const lastSoundTimeRef = useRef<number>(0);
  const jarMouthRef = useRef<HTMLDivElement | null>(null);
  const pourTimeoutRef = useRef<number | null>(null);

  // Hủy timeout đổ muối khi unmount hoặc reset
  useEffect(() => {
    return () => {
      if (pourTimeoutRef.current) {
        clearTimeout(pourTimeoutRef.current);
        pourTimeoutRef.current = null;
      }
    };
  }, []);

  // Lắng nghe di chuột toàn trang khi đang trong quy trình xúc / khuấy muối
  useEffect(() => {
    if (workflowStep === 'idle' && !isJarOpen) {
      lastStirPosRef.current = { x: 0, y: 0, wasInside: false };
      return;
    }

    const handleWindowPointerMove = (e: PointerEvent) => {
      const px = e.clientX;
      const py = e.clientY;
      setPointerPos({ x: px, y: py });

      // 1. Kiểm tra hover vào miệng hũ muối khi đang ở scoopMode
      if ((workflowStep === 'scoopMode' || workflowStep === 'idle') && jarMouthRef.current) {
        const jarRect = jarMouthRef.current.getBoundingClientRect();
        const inJar =
          px >= jarRect.left - 20 &&
          px <= jarRect.right + 20 &&
          py >= jarRect.top - 20 &&
          py <= jarRect.bottom + 20;
        setIsHoveringJarMouth(inJar);
        if (inJar && saltSpoons < MAX_SALT_SPOONS) {
          if (!scoopStartRef.current) scoopStartRef.current = {x: px, y: py};
          if (Math.hypot(px - scoopStartRef.current.x, py - scoopStartRef.current.y) > 24) {
            scoopStartRef.current = null;
            handleScoopClick();
          }
        } else scoopStartRef.current = null;
      }

      // 2. Xử lý khuấy nước khi đang ở bước 'stirring'
      // KIỂM TRA BẰNG RAYCASTER 3D QUA CALLBACK checkPointInWater (ĐÚNG Ở MỌI GÓC NHÌN VÀ 4 LOẠI BỂ)
      if (workflowStep === 'holdingSpoon' && pourStartRef.current && Math.hypot(px-pourStartRef.current.x, py-pourStartRef.current.y)>12) {
        onPourAtScreenPoint?.(px,py);
      }
      if (workflowStep === 'stirring') {
        const isInsideWater = checkPointInWater(px, py);
        setIsInWaterState(isInsideWater);

        if (isInsideWater && lastStirPosRef.current.wasInside) {
          // CHỈ TÍNH QUÃNG ĐƯỜNG KHI CẢ ĐIỂM TRƯỚC VÀ ĐIỂM NÀY ĐỀU Ở TRONG NƯỚC
          // Đảm bảo: "Chỉ chuyển động trong nước mới tăng tiến trình; vào/ra vùng không tạo bước nhảy."
          const dx = px - lastStirPosRef.current.x;
          const dy = py - lastStirPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Lọc các bước nhảy bất thường (> 70px)
          if (dist > 1.5 && dist < 70) {
            setStirWobble((prev) => prev + dist * 0.6);

            // Âm thanh khuấy nước
            const now = performance.now();
            if (now - lastSoundTimeRef.current > 180) {
              if (soundEnabled) soundEngine.playWaterStir();
              lastSoundTimeRef.current = now;
            }

            const nowStir = performance.now();
            if (!stirringStartedRef.current) stirringStartedRef.current = nowStir;
            if (nowStir - lastVisualStirRef.current > 110) {
              onStirAtScreenPoint?.(px, py); lastVisualStirRef.current = nowStir;
            }
            const deltaProgress = dist * 0.18;
            const previousProgress = progressRef.current;
            const nextProgress = Math.min(nowStir - stirringStartedRef.current > 1500 ? 100 : 95, previousProgress + deltaProgress);
            progressRef.current = nextProgress;
            onStirProgressUpdate(nextProgress);

            if (nextProgress >= 100 && previousProgress < 100) {
              if (soundEnabled) soundEngine.playMagicChime();
              onSpoonCompleted();
              onStepChange('idle');
              stirringStartedRef.current = 0;
              scoopStartRef.current = null;
              lastStirPosRef.current = { x: px, y: py, wasInside: false };
            }
          }
        }

        lastStirPosRef.current = {
          x: px,
          y: py,
          wasInside: isInsideWater
        };
      }
    };

    const handleTiltStart = (event: PointerEvent) => {
      if (workflowStep === 'holdingSpoon') pourStartRef.current = {x: event.clientX, y: event.clientY};
    };
    const handleTiltEnd = (event: PointerEvent) => { if (pourStartRef.current) onPourAtScreenPoint?.(event.clientX, event.clientY); pourStartRef.current = null; };
    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerdown', handleTiltStart);
    window.addEventListener('pointerup', handleTiltEnd);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerdown', handleTiltStart);
      window.removeEventListener('pointerup', handleTiltEnd);
    };
  }, [
    workflowStep, isJarOpen, saltSpoons, onStirAtScreenPoint, onPourAtScreenPoint,
    checkPointInWater,
    activeStirProgress,
    onStirProgressUpdate,
    onSpoonCompleted,
    onStepChange,
    soundEnabled
  ]);

  // Click xúc muối từ hũ
  const handleScoopClick = () => {
    if (workflowStep !== 'scoopMode' && workflowStep !== 'idle') return;
    if (saltSpoons >= MAX_SALT_SPOONS) {
      onMessageUpdate('Mình đã dùng hết phần muối cho lượt này. Con có thể thay nước để thử lại nhé.');
      return;
    }

    if (soundEnabled) soundEngine.playSpoonClink();
    onStepChange('holdingSpoon');
    onMessageUpdate('Thìa đã có muối. Đưa thìa vào miệng bể rồi giữ và kéo để nghiêng thìa nhé!');
  };

  const handleResetWithCleanup = useCallback(() => {
    if (pourTimeoutRef.current) {
      clearTimeout(pourTimeoutRef.current);
      pourTimeoutRef.current = null;
    }
    lastStirPosRef.current = { x: 0, y: 0, wasInside: false };
    onResetSalt();
  }, [onResetSalt]);

  const isMaxSpoons = saltSpoons >= MAX_SALT_SPOONS;

  if (!isJarOpen || disabled) {
    return (
      <div className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-3xl bg-white/90 border-2 border-amber-300 shadow-lg self-start lg:self-stretch">
        <button
          disabled={disabled}
          className="p-3 rounded-2xl hover:bg-amber-100 text-amber-900 font-bold flex flex-col items-center gap-1"
          onClick={(event) => {
            setIsJarOpen(true);
            setPointerPos({ x: event.clientX, y: event.clientY });
            if (!isMaxSpoons) onStepChange('scoopMode');
            onMessageUpdate('Hũ muối đã mở. Con đưa thìa vào hũ rồi kéo để xúc muối nhé.');
          }}
          aria-label="Mở hũ muối"
        >
          <span className="text-4xl">🧂</span>
          <span className="text-xs">Mở hũ muối</span>
        </button>
        <span className="text-[10px] text-slate-500">Đã tan: {saltSpoons}/{MAX_SALT_SPOONS} thìa</span>
      </div>
    );
  }

  return (
    <>
      {/* 1. HŨ MUỐI LỚN MỞ NẮP ĐẶT CẠNH BỂ (LUÔN NHÌN THẤY CẢ BỂ VÀ HŨ) */}
      <div className="flex flex-col items-center p-3 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-amber-300 dark:border-amber-700 shadow-xl space-y-2.5 max-w-[240px] flex-shrink-0 transition-all">
        <button aria-label="Đóng hũ muối" disabled={workflowStep === 'stirring' || workflowStep === 'pouring'} onClick={() => {setIsJarOpen(false); onStepChange('idle');}} className="self-end text-xs font-bold text-slate-500 disabled:opacity-30">Đóng ✕</button>
        <div className="w-full text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
            <span className="text-base">🧂</span>
            <span>Hũ muối của bé</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            Đã hòa tan: <span className="font-extrabold text-amber-600">{saltSpoons} / {MAX_SALT_SPOONS}</span> thìa
          </div>
          <div className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
            {currentDensity > 1 ? 'Nước đang mặn hơn' : 'Nước ngọt'}
          </div>
        </div>

        {/* Khối Hũ Muối Thủy Tinh Lớn */}
        <div
          ref={jarMouthRef}
          onClick={handleScoopClick}
          role="button"
          aria-label="Xúc một thìa muối"
          tabIndex={workflowStep === 'scoopMode' || workflowStep === 'idle' ? 0 : -1}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleScoopClick(); } }}
          className={`relative w-36 h-48 flex flex-col items-center justify-end rounded-3xl transition-transform ${
            workflowStep === 'scoopMode'
              ? 'cursor-pointer hover:scale-105 active:scale-95'
              : 'cursor-default'
          }`}
          title={
            workflowStep === 'scoopMode'
              ? 'Kéo thìa trong hũ hoặc chạm để xúc muối'
              : 'Hũ muối thí nghiệm'
          }
        >
          {/* Nắp hũ đã mở đặt lệch cạnh trên */}
          <div className="absolute top-0 right-2 -rotate-12 w-24 h-6 rounded-xl bg-amber-800 border-2 border-amber-600 shadow-md flex items-center justify-center z-10">
            <span className="text-[9px] font-bold text-amber-200">NẮP ĐÃ MỞ</span>
          </div>

          {/* Cổ và miệng hũ muối thủy tinh */}
          <div
            className={`w-28 h-5 rounded-t-xl border-x-2 border-t-2 border-sky-300/80 bg-sky-100/50 relative transition-all ${
              isHoveringJarMouth && workflowStep === 'scoopMode'
                ? 'ring-4 ring-amber-400 bg-amber-100/60 animate-pulse'
                : ''
            }`}
          >
            <div className="absolute inset-x-2 bottom-0 h-2 rounded-t-full bg-white/90 shadow-inner" />
          </div>

          {/* Thân hũ thủy tinh trong suốt chứa đầy muối tinh */}
          <div className="w-36 h-[152px] rounded-b-3xl border-4 border-sky-300/80 bg-gradient-to-b from-sky-50/40 via-white/80 to-slate-100 relative overflow-hidden shadow-2xl flex flex-col justify-end p-2.5">
            <div className="w-full h-28 rounded-t-2xl bg-gradient-to-b from-white via-slate-50 to-slate-200 border-t-2 border-slate-200 shadow-inner flex flex-col items-center justify-center p-1.5 relative">
              <span className="text-[10px] font-black text-amber-900 tracking-wider">MUỐI TINH</span>
              <span className="text-[8px] text-amber-700 font-medium">Muối trắng</span>

              <div className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-sky-200 opacity-70 animate-ping" />
              <div
                className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-amber-200 opacity-70 animate-ping"
                style={{ animationDelay: '0.6s' }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
          </div>

          {workflowStep === 'scoopMode' && (
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow-lg animate-bounce whitespace-nowrap z-20">
              🥄 Kéo thìa trong hũ để xúc
            </div>
          )}
        </div>

        {/* Nút điều khiển quy trình */}
        <div className="w-full space-y-1.5 pt-1">
          {onDoseChange && (workflowStep === 'idle' || workflowStep === 'scoopMode') && (
            <div className="flex gap-1" aria-label="Lượng muối trong thìa">
              {[0.5, 1].map(amount => <button key={amount} onClick={() => onDoseChange(amount)} aria-pressed={spoonFraction === amount} className={`min-h-[44px] flex-1 rounded-xl font-bold text-xs border-2 ${spoonFraction === amount ? 'bg-amber-300 border-amber-500' : 'bg-white border-amber-100'}`}>{amount === 0.5 ? '🥄 Nửa thìa' : '🥄 Đầy thìa'}</button>)}
            </div>
          )}
          {workflowStep === 'idle' && (
            <button
              onClick={() => {
                if (isMaxSpoons) {
                  onMessageUpdate('Mình đã dùng hết phần muối cho lượt này. Con thay nước để thử lại nhé.');
                  return;
                }
                onStepChange('scoopMode');
                onMessageUpdate('Bé hãy di chuột đưa thìa vào miệng hũ muối để xúc đúng 1 thìa nhé!');
              }}
              disabled={isMaxSpoons}
              className={`w-full py-2 px-3 rounded-2xl font-black text-xs shadow-md border-2 border-white flex items-center justify-center gap-1.5 transition ${
                isMaxSpoons
                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{isMaxSpoons ? 'Đã Tối Đa Muối' : 'Cầm Thìa Xúc Muối'}</span>
            </button>
          )}

          {workflowStep === 'holdingSpoon' && (
            <div className="w-full py-1.5 px-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold text-center animate-pulse">
              🥄 Đưa thìa vào miệng bể, giữ và kéo để nghiêng thìa
            </div>
          )}

          {workflowStep === 'pouring' && (
            <div className="w-full py-1.5 px-2 rounded-xl bg-amber-400 text-slate-950 text-[10px] font-extrabold text-center animate-pulse">
              ⏳ Đang đổ muối vào nước...
            </div>
          )}

          {workflowStep === 'stirring' && (
            <div className="w-full space-y-1 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200">
                <span>Khuấy tan muối:</span>
                <span>{Math.round(activeStirProgress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-75"
                  style={{ width: `${activeStirProgress}%` }}
                />
              </div>
              <p className="text-[9px] text-emerald-700 dark:text-emerald-300 text-center leading-tight">
                {isInWaterState ? '✨ Đang khuấy trong nước...' : '⚠️ Hãy di đũa VÀO TRONG NƯỚC'}
              </p>
            </div>
          )}

          {(saltSpoons > 0 || workflowStep !== 'idle') && (
            <button
              onClick={handleResetWithCleanup}
              className="w-full py-1 px-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center gap-1 transition"
              title="Xả hết muối và thay nước ngọt trong vắt ban đầu"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Thay Nước Ngọt Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. BÀN TAY CẦM THÌA DI THEO CHUỘT KHI ĐANG XÚC HOẶC ĐỔ MUỐI */}
      {(workflowStep === 'scoopMode' || workflowStep === 'holdingSpoon' || workflowStep === 'pouring') && (
        <RealisticHandSpoon
          x={pointerPos.x}
          y={pointerPos.y}
          hasSalt={workflowStep === 'holdingSpoon' || workflowStep === 'pouring'}
          isPouring={workflowStep === 'pouring'}
          amount={spoonFraction}
        />
      )}

      {/* 3. BÀN TAY CẦM ĐŨA DI THEO CHUỘT KHI ĐANG QUẤY NƯỚC */}
      {workflowStep === 'stirring' && (
        <RealisticStirringHand
          x={pointerPos.x}
          y={pointerPos.y}
          angle={stirWobble}
          isInWater={isInWaterState}
        />
      )}
    </>
  );
};

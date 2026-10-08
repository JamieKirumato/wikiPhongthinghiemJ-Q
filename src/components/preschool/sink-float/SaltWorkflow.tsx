import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SaltWorkflowStep } from './types';
import { soundEngine } from '../../../utils/audioEffects';
import { MAX_SALT_SPOONS } from './salinity';
import { RotateCcw, Sparkles } from 'lucide-react';

interface SaltWorkflowProps {
  disabled?: boolean;
  visualOnly?: boolean;
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

const SaltJar = ({open=false}:{open?:boolean}) => <svg viewBox="0 0 120 150" className="w-full h-full" aria-hidden="true">
  <defs><linearGradient id="saltGlass"><stop stopColor="#cde7ed" stopOpacity=".65"/><stop offset=".35" stopColor="white" stopOpacity=".2"/><stop offset="1" stopColor="#aacbd4" stopOpacity=".6"/></linearGradient></defs>
  <path d="M29 30L29 43Q15 49 15 65V128Q15 140 30 140H90Q105 140 105 128V65Q105 49 91 43V30Z" fill="url(#saltGlass)" stroke="#8daeb6" strokeWidth="2"/>
  <path d="M20 80Q42 68 60 76Q80 81 100 73V127Q100 135 90 135H30Q20 135 20 127Z" fill="#f5f3eb" stroke="#d2d0c7"/>
  {Array.from({length:100},(_,i)=><circle key={i} cx={24+(i*37%73)} cy={84+(i*19%46)} r={.7+(i%3)*.35} fill={i%3?'#ffffff':'#c9c7c0'}/>)}
  <ellipse cx="60" cy="31" rx="31" ry="7" fill={open?'#dae5e5':'#c69d64'} stroke="#8c7654" strokeWidth="2"/>
  {!open&&<rect x="27" y="16" width="66" height="16" rx="5" fill="#b9925d" stroke="#887045"/>}
  <path d="M25 57V118" stroke="white" strokeWidth="6" opacity=".8" strokeLinecap="round"/>
  {open&&<path d="M78 12L111 19L108 30L75 23Z" fill="#b9925d" stroke="#887045"/>}
</svg>;

// Bàn tay cầm thìa inox chân thực đi theo chuột
export const RealisticHandSpoon: React.FC<{
  x: number;
  y: number;
  hasSalt: boolean;
  isPouring: boolean;
  amount?: number;
}> = ({ x, y, hasSalt, isPouring, amount = 1 }) => createPortal(
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-30px, -34px) rotate(${isPouring ? 48 : -14}deg)`,
      transformOrigin: '30px 34px',
      transition: 'transform 0.22s ease-out'
    }}
    className="fixed pointer-events-none z-[80] filter drop-shadow-2xl select-none"
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
          <circle cx="14" cy="50" r="2" fill="#ffffff"><animate attributeName="cy" values="42;92" dur=".55s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur=".55s" repeatCount="indefinite"/></circle>
        </g>
      )}


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
  </div>, document.body
);

// Bàn tay cầm đũa thủy tinh khuấy nước
export const RealisticStirringHand: React.FC<{
  x: number;
  y: number;
  angle: number;
  isInWater: boolean;
}> = ({ x, y, angle, isInWater }) => createPortal(
  <div
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50px, -190px) rotate(${Math.sin((angle * Math.PI) / 180) * 12}deg)`,
      transformOrigin: '50px 190px',
      transition: 'transform 0.05s linear'
    }}
    className="fixed w-[100px] h-[200px] pointer-events-none z-[80] filter drop-shadow-2xl select-none"
  >
    <svg width="100" height="200" viewBox="0 0 100 200" fill="none">
      {/* Đũa thủy tinh phòng thí nghiệm có phát quang nhẹ */}
      <rect
        x="46"
        y="30"
        width="7.5"
        height="160"
        rx="3.75"
        fill="url(#woodRodGrad)"
        stroke="#93642e"
        strokeWidth="1.5"
      />
      <path d="M49 38V178M52 52V167" stroke="#a87436" opacity=".45"/>
      <circle cx="50" cy="28" r="5" fill="#b98543" opacity="0.9" />
      <circle cx="50" cy="190" r="4.5" fill="#b98543" opacity="0.9" />


      <defs>
        <linearGradient id="woodRodGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c79755" />
          <stop offset="45%" stopColor="#edcb8e" />
          <stop offset="100%" stopColor="#c79755" />
        </linearGradient>
      </defs>
    </svg>

    {/* Vòng xoáy nước sủi bọt khi đũa đang ở trong nước */}
    {isInWater && (
      <svg className="absolute left-[-10px] bottom-[-18px] w-[120px] h-[52px]" viewBox="0 0 120 52" aria-hidden="true"><g transform={`translate(60 26) scale(1 .38) rotate(${angle})`} fill="none" stroke="#77bbc8" strokeWidth="2" opacity=".7"><path d="M0 0C12-15 29 0 15 17C-9 43-45 10-27-20C-3-60 58-30 46 14"/><path d="M-43 5A44 44 0 0 1 12-42" stroke="white"/></g></svg>
    )}
  </div>, document.body
);

export const SaltWorkflow: React.FC<SaltWorkflowProps> = ({
  disabled = false,
  visualOnly = false,
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
  const saltTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [jarPosition, setJarPosition] = useState({top: 64, right: 12});
  useEffect(() => {
    if (!visualOnly || !isJarOpen) return;
    const place = () => {
      const rect = saltTriggerRef.current?.getBoundingClientRect();
      if (rect) setJarPosition({top: Math.max(64, Math.min(rect.top - 290, window.innerHeight - 320)), right: Math.max(12, window.innerWidth - rect.right)});
    };
    place(); window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [visualOnly, isJarOpen]);
  const scoopStartRef = useRef<{x:number;y:number} | null>(null);
  const stirringStartedRef = useRef(0);
  const lastVisualMotionRef = useRef(0);
  const lastVisualStirRef = useRef(0);
  const progressRef = useRef(activeStirProgress);
  progressRef.current = activeStirProgress;
  const [stirWobble, setStirWobble] = useState<number>(0);
  const [isHoveringJarMouth, setIsHoveringJarMouth] = useState<boolean>(false);
  const [isInWaterState, setIsInWaterState] = useState<boolean>(false);
  const stirIdleTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(stirIdleTimer.current)clearTimeout(stirIdleTimer.current);},[]);
  useEffect(()=>{if(workflowStep!=='stirring'){setIsInWaterState(false);if(stirIdleTimer.current)clearTimeout(stirIdleTimer.current);}},[workflowStep]);

  useEffect(()=>{
    const cancel=(event:KeyboardEvent)=>{if(event.key==='Escape'&&(workflowStep==='scoopMode'||workflowStep==='holdingSpoon')){scoopStartRef.current=null;setIsJarOpen(false);onStepChange('idle');onMessageUpdate('Đã cất thìa và trả muối về hũ.');}};
    window.addEventListener('keydown',cancel);return()=>window.removeEventListener('keydown',cancel);
  },[workflowStep,onStepChange,onMessageUpdate]);

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
      if(workflowStep==='pouring')return;
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
          scoopStartRef.current = null;
          handleScoopClick();
        } else scoopStartRef.current = null;
      }

      // 2. Xử lý khuấy nước khi đang ở bước 'stirring'
      // KIỂM TRA BẰNG RAYCASTER 3D QUA CALLBACK checkPointInWater (ĐÚNG Ở MỌI GÓC NHÌN VÀ 4 LOẠI BỂ)
      if (workflowStep === 'holdingSpoon') {
        onPourAtScreenPoint?.(px,py);
      }
      if (workflowStep === 'stirring') {
        const isInsideWater = checkPointInWater(px, py);
        if(!isInsideWater)setIsInWaterState(false);

        if (isInsideWater && lastStirPosRef.current.wasInside) {
          // CHỈ TÍNH QUÃNG ĐƯỜNG KHI CẢ ĐIỂM TRƯỚC VÀ ĐIỂM NÀY ĐỀU Ở TRONG NƯỚC
          // Đảm bảo: "Chỉ chuyển động trong nước mới tăng tiến trình; vào/ra vùng không tạo bước nhảy."
          const dx = px - lastStirPosRef.current.x;
          const dy = py - lastStirPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Lọc các bước nhảy bất thường (> 70px)
          if (dist > 1.5 && dist < 70) {
            setIsInWaterState(true);
            if(stirIdleTimer.current)clearTimeout(stirIdleTimer.current);
            stirIdleTimer.current=setTimeout(()=>setIsInWaterState(false),140);
            setStirWobble((prev) => prev + dist * 0.6);

            // Âm thanh khuấy nước
            const now = performance.now();
            if (now - lastSoundTimeRef.current > 180) {
              if (soundEnabled) soundEngine.playWaterStir();
              lastSoundTimeRef.current = now;
            }

            const nowStir = performance.now();
            if (!stirringStartedRef.current) {stirringStartedRef.current = nowStir;lastVisualMotionRef.current=nowStir;}
            if (nowStir - lastVisualStirRef.current > 110) {
              onStirAtScreenPoint?.(px, py); lastVisualStirRef.current = nowStir;
            }
            const elapsed = Math.min(80, Math.max(0, nowStir-lastVisualMotionRef.current));
            lastVisualMotionRef.current=nowStir;
            const duration = saltSpoons < 1 ? 3000 : saltSpoons < 2 ? 5000 : 8000;
            const deltaProgress = Math.min(dist * 0.2, elapsed * 100 / duration);
            const previousProgress = progressRef.current;
            const nextProgress = Math.min(nowStir - stirringStartedRef.current >= duration ? 100 : 95, previousProgress + deltaProgress);
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

    window.addEventListener('pointermove', handleWindowPointerMove);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);


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
    onMessageUpdate('Thìa đã có muối. Đưa thìa lên miệng bể, thìa sẽ tự nghiêng để thả muối nhé!');
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

  if (visualOnly) return <>
    <div className="lab-salt">
      <button ref={saltTriggerRef} aria-label="Mở hũ muối" aria-expanded={isJarOpen} disabled={disabled || isJarOpen} className="lab-salt-trigger flex items-center justify-center" onClick={event=>{setIsJarOpen(true);setPointerPos({x:event.clientX,y:event.clientY});if(!isMaxSpoons){onDoseChange?.(1);onStepChange('scoopMode');}onMessageUpdate('Hũ muối đã mở. Con đưa thìa vào hũ rồi kéo để xúc muối nhé.');}}><span className="block w-12 h-14"><SaltJar/></span></button>
      {isJarOpen && createPortal(<div className="lab-salt-popover" style={jarPosition} role="group" aria-label="Hũ muối đang mở">
        <button aria-label="Đóng hũ muối" disabled={workflowStep==='pouring'||workflowStep==='stirring'} className="self-end min-h-[44px] min-w-[44px] rounded-full text-xl" onClick={()=>{setIsJarOpen(false);onStepChange('idle');}}>✕</button>
        <div ref={jarMouthRef} role="button" aria-label="Xúc một thìa muối" tabIndex={0} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();handleScoopClick();}}} className="relative w-28 h-36 cursor-pointer drop-shadow-lg"><SaltJar open/>
        </div>
        {(workflowStep==='holdingSpoon'||workflowStep==='scoopMode')&&<button aria-label="Cất thìa" className="min-h-[48px] rounded-xl bg-white px-3 font-bold" onClick={()=>{setIsJarOpen(false);scoopStartRef.current=null;onStepChange('idle');}}><span aria-hidden="true" className="text-2xl">↩</span></button>}
        {workflowStep==='stirring'&&<div role="progressbar" aria-label="Muối đang tan" aria-valuenow={Math.round(activeStirProgress)} aria-valuemin={0} aria-valuemax={100} className="w-full h-3 rounded-full bg-sky-100 overflow-hidden"><div className="h-full rounded-full bg-cyan-400" style={{width:`${activeStirProgress}%`}}/></div>}
        {isMaxSpoons&&<button aria-label="Thay nước ngọt" className="min-h-[52px] min-w-[52px] text-3xl" onClick={handleResetWithCleanup}>🚰</button>}
      </div>, document.body)}
    </div>
    {(workflowStep==='scoopMode'||workflowStep==='holdingSpoon'||workflowStep==='pouring')&&<RealisticHandSpoon x={pointerPos.x} y={pointerPos.y} hasSalt={workflowStep==='holdingSpoon'||workflowStep==='pouring'} isPouring={workflowStep==='pouring'} amount={spoonFraction}/>}
    {workflowStep==='stirring'&&<RealisticStirringHand x={pointerPos.x} y={pointerPos.y} angle={stirWobble} isInWater={isInWaterState}/>}
  </>;

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
          <div className={`w-36 h-44 rounded-2xl ${isHoveringJarMouth?'ring-4 ring-amber-300':''}`}><SaltJar open/></div>

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
              🥄 Đưa thìa lên miệng bể để tự thả muối
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

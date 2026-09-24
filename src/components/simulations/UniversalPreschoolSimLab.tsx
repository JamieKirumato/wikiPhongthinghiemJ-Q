import React, { useState, useEffect, useRef } from 'react';
import { SIMULATION_CATALOG } from '../../data/simulationCatalogData';
import { PRESCHOOL_EXPLORATION_MAP } from '../../data/preschoolExplorationData';
import { SimulationCatalogItem } from '../../types/curriculum';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Compass,
  Lightbulb,
  Award,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ColorMixerSim } from './ColorMixerSim';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  simId: string;
  onSelectOtherSim?: (simId: string) => void;
  onClose?: () => void;
}

export const UniversalPreschoolSimLab: React.FC<Props> = ({
  simId,
  onSelectOtherSim,
  onClose
}) => {
  // Find current catalog item
  const currentItem: SimulationCatalogItem =
    SIMULATION_CATALOG.find((item) => item.id === simId) ||
    SIMULATION_CATALOG.find((item) => item.id === 'sim-mn-01')!;

  const profile = PRESCHOOL_EXPLORATION_MAP[currentItem.id] || PRESCHOOL_EXPLORATION_MAP['sim-mn-01'];

  // Play mode: 'guided' (4-step standard) | 'sandbox' (free exploration)
  const [playMode, setPlayMode] = useState<'guided' | 'sandbox'>('sandbox');

  // Guided mode state
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const [guidedCompleted, setGuidedCompleted] = useState<boolean>(false);

  // Sound enable
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Discovery badge unlocked in this session
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);
  const [showBadgeNotification, setShowBadgeNotification] = useState<boolean>(false);

  // Dynamic reaction message from mascot Mimi
  const [mascotMessage, setMascotMessage] = useState<string>('');

  // Audio Context synthesizer for interactive preschool sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (freq: number = 520, type: OscillatorType = 'sine', duration: number = 0.25) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const triggerBadgeUnlock = () => {
    if (!badgeUnlocked) {
      setBadgeUnlocked(true);
      setShowBadgeNotification(true);
      playChime(659, 'triangle', 0.4);
      setTimeout(() => playChime(880, 'triangle', 0.5), 180);
      setTimeout(() => setShowBadgeNotification(false), 5000);
    }
  };

  // Guided step completion tracking
  const [guidedStepDone, setGuidedStepDone] = useState<boolean[]>([false, false, false, false]);

  // Reset states when changing experiment
  useEffect(() => {
    setGuidedStep(0);
    setGuidedCompleted(false);
    setGuidedStepDone([false, false, false, false]);
    setBadgeUnlocked(false);
    setShowBadgeNotification(false);
    setMascotMessage(profile.teacherPrompt);
  }, [simId, profile]);

  // =========================================================================
  // STATE REGISTRY FOR SIMULATIONS (SIM-SPECIFIC REACTIVE STATES)
  // =========================================================================

  // Generic value for slider/parameter
  const [simParam1, setSimParam1] = useState<number>(50);
  const [simParam2, setSimParam2] = useState<number>(50);
  const [simParam3, setSimParam3] = useState<number>(50);
  const [simChoice, setSimChoice] = useState<number>(0);
  const [simToggle, setSimToggle] = useState<boolean>(false);
  const [simActionTrigger, setSimActionTrigger] = useState<number>(0);

  // Sync default values on sim change
  useEffect(() => {
    setSimParam1(50);
    setSimParam2(50);
    setSimParam3(50);
    setSimChoice(0);
    setSimToggle(false);
    setSimActionTrigger(0);
    setGuidedStepDone([false, false, false, false]);
  }, [simId]);

  // Step Action Handlers: Make each step directly PLAYABLE on the simulation canvas
  const handleExecuteStepAction = (stepIdx: number) => {
    const sId = currentItem.id;
    playChime(440 + stepIdx * 120, 'triangle', 0.3);

    setGuidedStepDone((prev) => {
      const next = [...prev];
      next[stepIdx] = true;
      return next;
    });

    if (sId === 'sim-mn-01') {
      if (stepIdx === 0) {
        setSimParam1(10); setSimParam2(10); setSimParam3(10);
        setMascotMessage('Bước 1: Cốc nước trong suốt đã sẵn sàng trên bàn thí nghiệm!');
      } else if (stepIdx === 1) {
        setSimParam1(95); setSimParam2(0); setSimParam3(0);
        setMascotMessage('Bước 2: Bé vừa nhỏ màu Đỏ rực rỡ vào cốc nước đầu tiên!');
      } else if (stepIdx === 2) {
        setSimParam1(95); setSimParam2(85); setSimParam3(0);
        setMascotMessage('Bước 3: Khuấy đều Đỏ và Vàng biến thành màu Cam tuyệt đẹp!');
      } else {
        setSimParam1(100); setSimParam2(100); setSimParam3(100);
        setMascotMessage('Bước 4: Kỳ diệu! Hòa trộn cả 3 màu tạo nên Ánh Sáng Trắng rạng rỡ!');
        triggerBadgeUnlock();
        setGuidedCompleted(true);
      }
    } else if (sId === 'sim-mn-02') {
      if (stepIdx === 0) {
        setSimChoice(0);
        setMascotMessage('Bước 1: Bể nước trong veo đã chuẩn bị xong, chờ bé thả đồ vật!');
      } else if (stepIdx === 1) {
        setSimChoice(0); // Quả bóng nhựa
        setMascotMessage('Bước 2: Bé thả quả bóng nhựa nhẹ tênh: Quả bóng nổi bồng bềnh!');
      } else if (stepIdx === 2) {
        setSimChoice(3); // Hòn sỏi
        setMascotMessage('Bước 3: Bé thả hòn sỏi nặng: Hòn sỏi chìm vèo xuống đáy bể!');
      } else {
        setSimChoice(1); // Chiếc lá
        setMascotMessage('Bước 4: Hoan hô! Bé đã hiểu: Vật nhẹ nổi bồng bềnh, vật nặng chìm nghỉm!');
        triggerBadgeUnlock();
        setGuidedCompleted(true);
      }
    } else if (sId === 'sim-mn-03') {
      if (stepIdx === 0) {
        setSimParam1(15); setSimParam2(50);
        setMascotMessage('Bước 1: Lắp thanh bập bênh vững chãi!');
      } else if (stepIdx === 1) {
        setSimParam1(25);
        setMascotMessage('Bước 2: Đặt bạn Gấu béo lên bên trái: Cầu bập bênh nghiêng hẳn sang trái!');
      } else if (stepIdx === 2) {
        setSimParam1(60); // 3 rabbits = balance!
        setMascotMessage('Bước 3: Đặt 3 bạn Thỏ lên bên phải: BẬP BÊNH THĂNG BẰNG HOÀN HẢO!');
      } else {
        setSimParam1(60);
        setMascotMessage('Bước 4: Tuyệt vời! Bé đã tìm ra bí quyết thăng bằng cho bập bênh!');
        triggerBadgeUnlock();
        setGuidedCompleted(true);
      }
    } else if (sId === 'sim-mn-04') {
      if (stepIdx === 0) {
        setSimParam1(85);
        setMascotMessage('Bước 1: Bật ngọn đèn pin chiếu chùm sáng lên tường!');
      } else if (stepIdx === 1) {
        setSimParam1(80);
        setMascotMessage('Bước 2: Đặt Khủng long ở xa đèn: Chiếc bóng trên tường nhỏ xíu.');
      } else if (stepIdx === 2) {
        setSimParam1(20);
        setMascotMessage('Bước 3: Kéo Khủng long lại sát ngọn đèn: Chiếc bóng phóng to khổng lồ!');
      } else {
        setSimParam1(20);
        setMascotMessage('Bước 4: Bé đã khám phá: Vật càng gần nguồn sáng, bóng in trên tường càng to lớn!');
        triggerBadgeUnlock();
        setGuidedCompleted(true);
      }
    } else if (sId === 'sim-mn-05') {
      if (stepIdx === 0) {
        setSimChoice(0);
        setMascotMessage('Bước 1: Chuẩn bị 5 cốc nước thủy tinh với mực nước khác nhau!');
      } else if (stepIdx === 1) {
        setSimChoice(0);
        playChime(261.6, 'triangle', 0.4);
        setMascotMessage('Bước 2: Gõ cốc đầy nước nhất: Nốt Đồ phát ra tiếng trầm ấm!');
      } else if (stepIdx === 2) {
        setSimChoice(4);
        playChime(392.0, 'triangle', 0.4);
        setMascotMessage('Bước 3: Gõ cốc ít nước nhất: Nốt Sol vang lên thanh trong vút cao!');
      } else {
        setSimChoice(2);
        playChime(329.6, 'triangle', 0.5);
        setMascotMessage('Bước 4: Bé là một nhạc trưởng tí hon! Mực nước khác nhau tạo nên âm thanh khác nhau.');
        triggerBadgeUnlock();
        setGuidedCompleted(true);
      }
    } else {
      if (stepIdx === 0) {
        setSimParam1(25);
        setMascotMessage(`Bước 1 đã thực hiện: ${currentItem.procedure[0]}`);
      } else if (stepIdx === 1) {
        setSimParam1(55);
        setMascotMessage(`Bước 2 đã thực hiện: ${currentItem.procedure[1]}`);
      } else if (stepIdx === 2) {
        setSimParam1(90);
        setMascotMessage(`Bước 3 đã thực hiện: ${currentItem.procedure[2]}`);
      } else {
        setSimParam1(100);
        setMascotMessage(`Bước 4 hoàn thành! ${currentItem.procedure[3]}`);
        triggerBadgeUnlock();
        setGuidedCompleted(true);
      }
    }
  };

  const getPlayableActionButtonText = (sId: string, stepIdx: number) => {
    if (sId === 'sim-mn-01') {
      const texts = ['🚰 Bấm Rót Nước Vào Cốc', '🧪 Bấm Nhỏ Màu Đỏ Vào Cốc', '🥄 Bấm Khuấy Hòa Màu Cam', '🏆 Bấm Tổng Hợp Ánh Sáng Trắng'];
      return texts[stepIdx] || 'Chạm để thực hiện';
    }
    if (sId === 'sim-mn-02') {
      const texts = ['🌊 Bấm Chuẩn Bị Bể Nước', '⚽ Bấm Thả Quả Bóng (Nổi)', '🪨 Bấm Thả Hòn Sỏi (Chìm)', '🏆 Bấm Nhận Huy Hiệu Khoa Học'];
      return texts[stepIdx] || 'Chạm để thực hiện';
    }
    if (sId === 'sim-mn-03') {
      const texts = ['🪵 Bấm Lắp Cầu Bập Bênh', '🐻 Bấm Đặt Bạn Gấu Nặng', '🐰 Bấm Đặt 3 Bạn Thỏ Cân Bằng', '🏆 Bấm Nhận Huy Hiệu Thăng Bằng'];
      return texts[stepIdx] || 'Chạm để thực hiện';
    }
    if (sId === 'sim-mn-04') {
      const texts = ['🔦 Bấm Bật Đèn Pin', '🦖 Bấm Đặt Khủng Long Ở Xa', '🔍 Bấm Kéo Khủng Long Lại Gần', '🏆 Bấm Nhận Huy Hiệu Ảo Thuật'];
      return texts[stepIdx] || 'Chạm để thực hiện';
    }
    if (sId === 'sim-mn-05') {
      const texts = ['🥛 Bấm Rót 5 Cốc Nước', '🎵 Bấm Gõ Cốc Trầm (Đồ)', '🎶 Bấm Gõ Cốc Bổng (Sol)', '🏆 Bấm Nhận Huy Hiệu Nhạc Trưởng'];
      return texts[stepIdx] || 'Chạm để thực hiện';
    }
    const generic = ['👉 Bấm Thực Hiện Bước 1', '👉 Bấm Thao Tác Bước 2', '👉 Bấm Khám Phá Bước 3', '🏆 Bấm Hoàn Thành & Nhận Sao'];
    return generic[stepIdx] || 'Chạm để thực hiện';
  };

  // Handle guided next step
  const handleNextGuidedStep = () => {
    playChime(440 + guidedStep * 110, 'sine', 0.2);
    if (guidedStep < currentItem.procedure.length - 1) {
      setGuidedStep(guidedStep + 1);
      setMascotMessage(currentItem.procedure[guidedStep + 1]);
    } else {
      setGuidedCompleted(true);
      triggerBadgeUnlock();
      setMascotMessage(`Hoan hô! Bé đã hoàn thành xuất sắc 4 bước chuẩn của thí nghiệm "${currentItem.title}"!`);
    }
  };

  const handleResetSim = () => {
    setGuidedStep(0);
    setGuidedCompleted(false);
    setGuidedStepDone([false, false, false, false]);
    setSimParam1(50);
    setSimParam2(50);
    setSimParam3(50);
    setSimChoice(0);
    setSimToggle(false);
    setSimActionTrigger(0);
    setMascotMessage(profile.teacherPrompt);
    playChime(350, 'sine', 0.15);
  };

  // All preschool experiments list for quick switching
  const preschoolCatalog = SIMULATION_CATALOG.filter((i) => i.levelId === 'mam-non');

  // =========================================================================
  // DYNAMIC EXPERIMENT RENDERERS (SVG/HTML ANIMATED SCENES)
  // =========================================================================
  const renderExperimentScene = () => {
    const sId = currentItem.id;

    // SIM 1: Hòa trộn màu sắc RGB
    if (sId === 'sim-mn-01') {
      const r = Math.round((simParam1 / 100) * 255);
      const g = Math.round((simParam2 / 100) * 255);
      const b = Math.round((simParam3 / 100) * 255);
      const mixedColor = `rgb(${r}, ${g}, ${b})`;

      return (
        <div className="flex flex-col items-center justify-center p-6 min-h-[300px] w-full">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Spotlight 1: Red */}
            <div
              className="absolute w-36 h-36 rounded-full blur-md mix-blend-screen transition-all duration-200"
              style={{
                backgroundColor: `rgb(${r}, 0, 0)`,
                transform: 'translate(-28px, -24px)',
                opacity: r > 10 ? 0.9 : 0.05
              }}
            />
            {/* Spotlight 2: Green */}
            <div
              className="absolute w-36 h-36 rounded-full blur-md mix-blend-screen transition-all duration-200"
              style={{
                backgroundColor: `rgb(0, ${g}, 0)`,
                transform: 'translate(28px, -24px)',
                opacity: g > 10 ? 0.9 : 0.05
              }}
            />
            {/* Spotlight 3: Blue */}
            <div
              className="absolute w-36 h-36 rounded-full blur-md mix-blend-screen transition-all duration-200"
              style={{
                backgroundColor: `rgb(0, 0, ${b})`,
                transform: 'translate(0px, 32px)',
                opacity: b > 10 ? 0.9 : 0.05
              }}
            />
            {/* Mixed Core Orb */}
            <div
              className="z-10 w-28 h-28 rounded-3xl shadow-2xl border-4 border-white/40 flex flex-col items-center justify-center transition-all duration-200 scale-100 hover:scale-105"
              style={{ backgroundColor: mixedColor }}
            >
              <Sparkles className="w-8 h-8 text-white drop-shadow-md animate-pulse" />
              <span className="text-[11px] font-bold text-white drop-shadow px-2 py-0.5 rounded bg-black/30 mt-1">
                {r > 200 && g > 200 && b > 200
                  ? 'Trắng sáng'
                  : r > 180 && g > 180 && b < 80
                  ? 'Vàng nắng'
                  : r > 180 && b > 180 && g < 80
                  ? 'Tím mộng mơ'
                  : g > 180 && b > 180 && r < 80
                  ? 'Xanh lơ Cyan'
                  : 'Màu kỳ diệu'}
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              Đỏ: {r}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Lục: {g}
            </span>
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Lam: {b}
            </span>
          </div>
        </div>
      );
    }

    // SIM 2: Vật chìm hay nổi trong bể nước
    if (sId === 'sim-mn-02') {
      const items = [
        { name: 'Quả bóng nhựa', floats: true, yPercent: 12, icon: '⚽', desc: 'Nhẹ & rỗng' },
        { name: 'Chiếc lá xanh', floats: true, yPercent: 15, icon: '🍃', desc: 'Rất mỏng nhẹ' },
        { name: 'Mẩu xốp', floats: true, yPercent: 10, icon: '🧽', desc: 'Xốp chứa không khí' },
        { name: 'Hòn sỏi', floats: false, yPercent: 88, icon: '🪨', desc: 'Đặc & nặng' },
        { name: 'Chìa khóa sắt', floats: false, yPercent: 90, icon: '🔑', desc: 'Kim loại chìm' }
      ];
      const selectedItem = items[simChoice % items.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px] w-full">
          {/* Glass Water Tank */}
          <div className="relative w-72 sm:w-80 h-56 rounded-2xl border-4 border-sky-300/80 bg-gradient-to-b from-sky-400/10 via-sky-500/20 to-sky-600/40 overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Water Surface Wave */}
            <div className="absolute top-10 left-0 right-0 h-4 bg-sky-400/40 border-b border-sky-300/60 animate-pulse flex items-center justify-center">
              <span className="text-[10px] text-sky-200 font-mono">Mặt nước dập dềnh ~ ~ ~</span>
            </div>

            {/* Dropped Floating / Sinking Item */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out flex flex-col items-center"
              style={{
                top: `${selectedItem.yPercent}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-4xl filter drop-shadow animate-bounce" style={{ animationDuration: '2.5s' }}>
                {selectedItem.icon}
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white border border-slate-700 mt-1 whitespace-nowrap shadow">
                {selectedItem.name}: {selectedItem.floats ? 'NỔI BỒNG BỀNH' : 'CHÌM NGHỈM'}
              </span>
            </div>

            {/* Bubbles */}
            <div className="absolute bottom-2 left-6 w-3 h-3 rounded-full bg-white/40 animate-ping" />
            <div className="absolute bottom-5 right-10 w-2 h-2 rounded-full bg-white/50 animate-pulse" />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {items.map((it, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSimChoice(idx);
                  playChime(it.floats ? 600 : 250, 'sine', 0.25);
                  setMascotMessage(
                    it.floats
                      ? `Bé thả ${it.name}: Vật nhẹ chứa không khí nên nổi bồng bềnh!`
                      : `Bé thả ${it.name}: Vật đặc nặng hơn nước nên chìm sâu xuống đáy!`
                  );
                  if (idx === 4) triggerBadgeUnlock();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  simChoice === idx
                    ? 'bg-sky-500 text-white shadow-md scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{it.icon}</span>
                <span>{it.name}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // SIM 3: Cầu bập bênh thăng bằng
    if (sId === 'sim-mn-03') {
      const bearWeight = 3;
      const rabbitCount = Math.max(1, Math.round((simParam1 / 100) * 5));
      const distanceBear = Math.round((simParam2 / 100) * 4) + 1; // 1 to 5
      const distanceRabbit = 4;

      const torqueLeft = bearWeight * distanceBear;
      const torqueRight = rabbitCount * distanceRabbit;
      const diff = torqueLeft - torqueRight;
      // angle tilt between -18 and 18 deg
      const tiltAngle = Math.max(-18, Math.min(18, diff * 3));
      const isBalanced = Math.abs(tiltAngle) < 3;

      if (isBalanced && !badgeUnlocked) {
        triggerBadgeUnlock();
      }

      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px] w-full">
          <div className="relative w-80 h-56 flex flex-col items-center justify-end pb-8">
            {/* Seesaw plank */}
            <div
              className="relative w-72 h-4 bg-amber-600 rounded-full shadow-lg transition-transform duration-500 ease-out flex items-center justify-between px-2"
              style={{ transform: `rotate(${-tiltAngle}deg)`, transformOrigin: 'center center' }}
            >
              {/* Left Side: Bear */}
              <div
                className="absolute flex flex-col items-center transition-all duration-300"
                style={{ left: `${35 - distanceBear * 6}%`, bottom: '12px' }}
              >
                <span className="text-4xl drop-shadow">🐻</span>
                <span className="text-[10px] font-bold text-white bg-slate-900/80 px-1.5 rounded">Gấu béo</span>
              </div>

              {/* Right Side: Rabbits */}
              <div
                className="absolute flex items-center gap-0.5 transition-all duration-300"
                style={{ right: '10px', bottom: '12px' }}
              >
                {Array.from({ length: rabbitCount }).map((_, i) => (
                  <span key={i} className="text-2xl drop-shadow">
                    🐰
                  </span>
                ))}
                <span className="text-[10px] font-bold text-white bg-slate-900/80 px-1.5 rounded">
                  {rabbitCount} bạn Thỏ
                </span>
              </div>
            </div>

            {/* Fulcrum Pivot Triangle */}
            <div className="w-0 h-0 border-x-[22px] border-x-transparent border-b-[40px] border-b-slate-600 drop-shadow" />
            <div className="w-48 h-2 bg-emerald-700/80 rounded-full mt-0.5" />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold mt-2">
            {isBalanced ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                THĂNG BẰNG HOÀN HẢO! CẢ 2 BÊN BẰNG NHAU!
              </span>
            ) : tiltAngle > 0 ? (
              <span className="text-amber-400">Bên bạn Gấu nặng hơn đang hạ xuống</span>
            ) : (
              <span className="text-sky-400">Đàn thỏ đông hơn đang kéo bập bênh xuống</span>
            )}
          </div>
        </div>
      );
    }

    // SIM 4: Chiếc bóng tinh nghịch
    if (sId === 'sim-mn-04') {
      const distPercent = simParam1; // 10 (gần đèn) to 90 (gần tường)
      const shadowScale = 2.6 - (distPercent / 100) * 1.8; // 2.6x to 0.8x
      const shadowBlur = Math.round((distPercent / 100) * 8) + 1;

      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px] w-full">
          <div className="relative w-80 h-56 bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex items-center justify-between px-6 shadow-2xl">
            {/* Flashlight */}
            <div className="flex flex-col items-center">
              <span className="text-3xl filter drop-shadow">🔦</span>
              <span className="text-[10px] font-mono text-amber-300">Đèn pin</span>
            </div>

            {/* Light beam cone */}
            <div
              className="absolute left-14 top-1/2 -translate-y-1/2 w-48 h-36 bg-gradient-to-r from-amber-300/40 via-amber-200/20 to-transparent pointer-events-none"
              style={{ clipPath: 'polygon(0% 45%, 100% 0%, 100% 100%, 0% 55%)' }}
            />

            {/* Dinosaur Toy draggable position */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-200 flex flex-col items-center"
              style={{ left: `${25 + (distPercent / 100) * 35}%` }}
            >
              <span className="text-3xl filter drop-shadow-md">🦖</span>
              <span className="text-[9px] font-bold text-white bg-slate-800 px-1 rounded">Khủng long</span>
            </div>

            {/* Wall & Projected Shadow */}
            <div className="w-16 h-full border-l-4 border-slate-700 bg-slate-900/90 flex items-center justify-center relative overflow-hidden">
              <div
                className="text-black filter transition-all duration-200 font-bold select-none"
                style={{
                  transform: `scale(${shadowScale})`,
                  filter: `blur(${shadowBlur}px) opacity(0.85)`
                }}
              >
                🦖
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-300 font-mono">
            Kích thước bóng: <strong className="text-amber-400">{(shadowScale * 100).toFixed(0)}%</strong> (Kéo lại gần
            đèn bóng to khổng lồ!)
          </div>
        </div>
      );
    }

    // SIM 5: Âm thanh cốc nước thủy tinh
    if (sId === 'sim-mn-05') {
      const glasses = [
        { note: 'Đồ', freq: 261.6, water: 85, color: 'bg-red-500' },
        { note: 'Rê', freq: 293.7, water: 68, color: 'bg-amber-500' },
        { note: 'Mi', freq: 329.6, water: 50, color: 'bg-yellow-400' },
        { note: 'Pha', freq: 349.2, water: 35, color: 'bg-emerald-500' },
        { note: 'Sol', freq: 392.0, water: 18, color: 'bg-sky-500' }
      ];

      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px] w-full">
          <div className="flex items-end justify-center gap-3 sm:gap-4 h-48 py-4">
            {glasses.map((g, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playChime(g.freq, 'triangle', 0.4);
                  setMascotMessage(`Bé gõ cốc nốt "${g.note}": Cốc ${g.water > 50 ? 'nhiều' : 'ít'} nước phát âm ${g.water > 50 ? 'trầm ấm' : 'thanh trong'}!`);
                  setSimChoice(idx);
                  if (idx === 4) triggerBadgeUnlock();
                }}
                className={`relative w-12 sm:w-14 h-36 border-2 border-slate-400/80 rounded-b-xl bg-white/10 hover:border-sky-400 cursor-pointer transition-all transform hover:-translate-y-2 flex flex-col justify-end overflow-hidden shadow-lg ${
                  simChoice === idx ? 'ring-2 ring-sky-400 scale-105' : ''
                }`}
              >
                {/* Water Column */}
                <div
                  className={`w-full ${g.color} opacity-70 transition-all duration-300 relative flex items-center justify-center`}
                  style={{ height: `${g.water}%` }}
                >
                  <span className="text-[10px] font-bold text-white drop-shadow font-mono">{g.water}%</span>
                </div>
                {/* Note Label */}
                <div className="absolute top-2 left-0 right-0 text-center font-bold text-xs text-white">
                  {g.note}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl">🥢</span>
            <span className="text-xs text-slate-300">Nhấp vào từng cốc để chiếc đũa gõ giai điệu vui tai!</span>
          </div>
        </div>
      );
    }

    // SIM 16: Quả trứng chìm hay nổi trong nước muối
    if (sId === 'sim-mn-16') {
      const saltSpoons = Math.round((simParam1 / 100) * 6); // 0 to 6 spoons
      // 0: sinks (85%), 3: levitates (50%), >= 5: floats (15%)
      let eggY = 82;
      let statusText = 'Trứng chìm nghỉm ở đáy cốc';
      if (saltSpoons >= 5) {
        eggY = 16;
        statusText = 'Trứng nổi hẳn lên bề mặt nước!';
      } else if (saltSpoons >= 3) {
        eggY = 48;
        statusText = 'Trứng lơ lửng kỳ diệu giữa cốc!';
      }

      if (saltSpoons >= 5 && !badgeUnlocked) triggerBadgeUnlock();

      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px] w-full">
          {/* Glass Cup */}
          <div className="relative w-44 h-56 border-4 border-slate-300 rounded-b-3xl bg-sky-400/15 overflow-hidden flex flex-col justify-end shadow-2xl">
            {/* Brine opacity based on salt */}
            <div
              className="absolute inset-0 bg-white/20 transition-opacity"
              style={{ opacity: saltSpoons * 0.12 }}
            />
            {/* Waterline */}
            <div className="absolute top-8 left-0 right-0 h-2 bg-sky-300/40" />

            {/* Egg */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out flex flex-col items-center"
              style={{ top: `${eggY}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-5xl filter drop-shadow-lg">🥚</span>
            </div>

            {/* Floating salt particles */}
            {Array.from({ length: saltSpoons * 2 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white animate-pulse absolute"
                style={{
                  left: `${15 + (i * 14) % 70}%`,
                  bottom: `${10 + (i * 12) % 65}%`
                }}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-1.5">
            <span className="text-xs font-bold text-amber-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
              Đã thêm: {saltSpoons} thìa muối ăn 🧂
            </span>
            <span className="text-xs text-slate-300 font-medium">{statusText}</span>
          </div>
        </div>
      );
    }

    // SIM 26: Thuyền giấy và thuyền đất sét
    if (sId === 'sim-mn-26') {
      const isBoatShape = simChoice === 1; // 0: Vo tròn (Chìm), 1: Nặn thuyền (Nổi)
      const passengers = Math.round((simParam1 / 100) * 5); // 0 to 5 bears
      const isOverloaded = isBoatShape && passengers >= 5;

      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px] w-full">
          {/* Water Tub */}
          <div className="relative w-72 sm:w-80 h-52 border-4 border-sky-400 rounded-2xl bg-gradient-to-b from-sky-400/20 to-sky-600/40 overflow-hidden shadow-inner flex flex-col justify-end">
            <div className="absolute top-10 left-0 right-0 h-3 bg-sky-300/40 animate-pulse" />

            {/* Clay Object */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 flex flex-col items-center"
              style={{
                top: !isBoatShape || isOverloaded ? '82%' : '18%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {!isBoatShape ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-amber-800 border-2 border-amber-950 shadow-2xl flex items-center justify-center text-white text-xs font-bold">
                    100g
                  </div>
                  <span className="text-[10px] text-white bg-slate-900 px-1 rounded mt-1">Vo tròn: Chìm</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Passengers in boat */}
                  <div className="flex items-center -space-x-1 mb-0.5">
                    {Array.from({ length: passengers }).map((_, i) => (
                      <span key={i} className="text-xl drop-shadow">
                        🧸
                      </span>
                    ))}
                  </div>
                  {/* Clay Boat Shape */}
                  <div className="w-32 h-10 bg-amber-800 rounded-b-3xl border-2 border-amber-950 shadow-xl flex items-center justify-center text-white text-xs font-bold px-2">
                    Thuyền đất sét ({passengers} bạn)
                  </div>
                  <span className="text-[10px] text-white bg-slate-900 px-1 rounded mt-1">
                    {isOverloaded ? 'Quá tải: Nước tràn chìm!' : 'Lòng trũng rỗng: Nổi!'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                setSimChoice(0);
                playChime(250, 'sine', 0.2);
                setMascotMessage('Vo đất sét tròn đặc: Khối lượng riêng lớn nên chìm nghỉm!');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                !isBoatShape ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Vo tròn khối đặc 🟤
            </button>
            <button
              onClick={() => {
                setSimChoice(1);
                playChime(600, 'triangle', 0.25);
                setMascotMessage('Nặn thành thuyền lòng trũng rỗng: Thể tích tăng làm thuyền nổi bồng bềnh!');
                triggerBadgeUnlock();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isBoatShape ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Nặn thành thuyền rỗng 🛶
            </button>
          </div>
        </div>
      );
    }

    // =========================================================================
    // GENERAL ADAPTIVE SANDBOX RENDERER FOR OTHER PRESCHOOL EXPERIMENTS
    // =========================================================================
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px] w-full">
        {/* Dynamic Canvas / Animated Graphic Card */}
        <div className="relative w-80 sm:w-96 h-56 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1627] to-slate-900 border-2 border-slate-700/80 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Top header badge */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
              {profile.domainLabel.split(':')[0]}
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {profile.whatIfChallenge.badgeName}
            </span>
          </div>

          {/* Central Interactive Animation Graphic */}
          <div className="flex flex-col items-center justify-center my-auto z-10">
            <div
              className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 to-emerald-400 shadow-xl flex items-center justify-center text-4xl transform transition-transform duration-300 cursor-pointer hover:rotate-6 active:scale-95"
              onClick={() => {
                setSimActionTrigger((prev) => prev + 1);
                playChime(500 + (simActionTrigger % 5) * 80, 'sine', 0.2);
                triggerBadgeUnlock();
              }}
            >
              {sId === 'sim-mn-06'
                ? '🧲'
                : sId === 'sim-mn-07'
                ? '🫧'
                : sId === 'sim-mn-08'
                ? '🌱'
                : sId === 'sim-mn-09'
                ? '🔍'
                : sId === 'sim-mn-10'
                ? '🍋'
                : sId === 'sim-mn-11'
                ? '🎈'
                : sId === 'sim-mn-12'
                ? '📏'
                : sId === 'sim-mn-13'
                ? '🪭'
                : sId === 'sim-mn-14'
                ? '💧'
                : sId === 'sim-mn-15'
                ? '🎨'
                : sId === 'sim-mn-17'
                ? '🕶️'
                : sId === 'sim-mn-18'
                ? '🌉'
                : sId === 'sim-mn-19'
                ? '🪞'
                : sId === 'sim-mn-20'
                ? '⚖️'
                : sId === 'sim-mn-21'
                ? '🎸'
                : sId === 'sim-mn-22'
                ? '🥄'
                : sId === 'sim-mn-23'
                ? '🧥'
                : sId === 'sim-mn-24'
                ? '🌿'
                : sId === 'sim-mn-25'
                ? '🏎️'
                : sId === 'sim-mn-27'
                ? '🌈'
                : sId === 'sim-mn-28'
                ? '👁️'
                : sId === 'sim-mn-29'
                ? '🏰'
                : sId === 'sim-mn-30'
                ? '📯'
                : '✨'}
            </div>
            <div className="mt-2 text-xs font-bold text-white text-center">
              {currentItem.title}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Trạng thái: {simActionTrigger > 0 ? `Đã kích hoạt ${simActionTrigger} lần` : 'Sẵn sàng tương tác'}
            </div>
          </div>

          {/* Bottom dynamic reactive bar */}
          <div className="z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
            <span>Tham số: {simParam1}%</span>
            <span>Bé chạm tay để thử nghiệm</span>
          </div>

          {/* Background decorative particles */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              setSimActionTrigger((prev) => prev + 1);
              playChime(650, 'triangle', 0.25);
              setMascotMessage(profile.variableTuning.options[0]?.outcome || 'Bé quan sát hiện tượng đổi thay!');
              triggerBadgeUnlock();
            }}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Thực Hiện Thao Tác</span>
          </button>
          <button
            onClick={() => {
              setSimToggle(!simToggle);
              playChime(520, 'sine', 0.2);
              setMascotMessage(profile.spatialLayout.outcome);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <span>Đổi Vị Trí / Bố Cục</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0b101c] border-2 border-emerald-500/80 rounded-2xl overflow-hidden shadow-2xl text-slate-200 animate-fadeIn">
      {/* 1. Header Bar */}
      <div className="px-5 py-3.5 bg-[#0f172a] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
            #{currentItem.stt}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mầm non: {profile.ageGroup}
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {profile.domainLabel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {currentItem.title}
            </h2>
          </div>
        </div>

        {/* Top Controls: Switcher & Sounds */}
        <div className="flex items-center gap-2">
          {/* Quick experiment picker */}
          <select
            value={currentItem.id}
            onChange={(e) => {
              if (onSelectOtherSim) onSelectOtherSim(e.target.value);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {preschoolCatalog.map((sim) => (
              <option key={sim.id} value={sim.id}>
                #{sim.stt}. {sim.title.slice(0, 32)}...
              </option>
            ))}
          </select>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={handleResetSim}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Đặt lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Đóng
            </button>
          )}
        </div>
      </div>

      {/* 2. Mode Toggle Tabs: [Kịch Bản Chuẩn 4 Bước] vs [Khám Phá Tự Do (Sandbox)] */}
      <div className="px-5 py-2.5 bg-[#090d16] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPlayMode('guided');
              playChime(480, 'sine', 0.15);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
              playMode === 'guided'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Kịch Bản Chuẩn (4 Bước)</span>
          </button>

          <button
            onClick={() => {
              setPlayMode('sandbox');
              playChime(580, 'sine', 0.15);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
              playMode === 'sandbox'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>2. Không Gian Khám Phá (Sandbox)</span>
          </button>
        </div>

        {/* Badge status pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition ${
            badgeUnlocked
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Huy hiệu: {profile.whatIfChallenge.badgeName}</span>
          {badgeUnlocked && <span>✓ Đã nhận!</span>}
        </div>
      </div>

      {/* 3. Main Workspace: Interactive Scene + Controls */}
      {playMode === 'sandbox' && currentItem.id === 'sim-mn-01' ? (
        <div className="p-4 sm:p-6 bg-[#0b0f17]">
          <ColorMixerSim />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Side: Visual Interactive Stage (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-b from-[#0b101c] to-[#070b14] relative">
            {/* Badge celebration overlay */}
            {showBadgeNotification && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
                <Sparkles className="w-5 h-5 fill-current" />
                <span>Chúc mừng bé đã mở khóa: "{profile.whatIfChallenge.badgeName}"!</span>
              </div>
            )}

            {/* Render Scene */}
            <div className="flex-1 flex items-center justify-center">
              {renderExperimentScene()}
            </div>

            {/* Mascot Speech Bubble (Mimi Tò Mò) */}
            <div className="m-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                🐵
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 font-mono uppercase">
                    Bạn Mimi Tò Mò mách nhỏ:
                  </span>
                  <button
                    onClick={() => soundEngine.speakText(mascotMessage)}
                    className="flex items-center gap-1 text-[10px] text-amber-300/80 hover:text-amber-200 font-mono"
                    title="Nghe Mimi nói"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{mascotMessage}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Controls / Step Guide (5 Cols) */}
          <div className="lg:col-span-5 p-5 space-y-5 bg-[#0e1526]">
            {playMode === 'guided' ? (
              /* ================= GUIDED MODE PANEL ================= */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Tiến trình 4 bước chuẩn mực:
                  </span>
                  <span className="text-xs font-mono text-sky-400 font-bold">
                    Bước {guidedStep + 1} / {currentItem.procedure.length}
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-2.5">
                  {currentItem.procedure.map((step, idx) => {
                    const isCurrent = idx === guidedStep;
                    const isDone = guidedStepDone[idx];

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setGuidedStep(idx);
                          playChime(400 + idx * 80, 'sine', 0.15);
                          setMascotMessage(step);
                        }}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed transition ${
                          isCurrent
                            ? 'bg-sky-950/40 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                            : isDone
                            ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900/20 border-slate-800/60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : isCurrent
                                  ? 'bg-sky-500 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </span>
                            <span className={isCurrent ? 'font-semibold text-white' : ''}>
                              {step}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.speakText(step);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title="Nghe cô giáo đọc bước này"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Interactive Play Button for Active Step */}
                        {isCurrent && (
                          <div className="mt-3 pt-2.5 border-t border-sky-500/30 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-amber-300 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Bé chạm nút này để thao tác:</span>
                              </span>
                              {isDone && (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                  ✓ ĐÃ LÀM XONG
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExecuteStepAction(idx);
                              }}
                              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold font-mono transition shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                                isDone
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white animate-pulse'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{getPlayableActionButtonText(currentItem.id, idx)}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Next Step Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleNextGuidedStep}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono transition shadow-lg flex items-center justify-center gap-2 ${
                      guidedCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    <span>{guidedCompleted ? 'Lặp Lại Từ Đầu' : 'Tiếp Tục Bước Kế Tiếp'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Teacher Preparation Checklist */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-mono text-slate-400 uppercase text-[10px] font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chuẩn bị đồ dùng thực tế:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.materials.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]"
                      >
                        • {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
            /* ================= SANDBOX EXPLORATION PANEL ================= */
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Góc nhìn Khám phá & Tùy biến biến số:</span>
                </span>
              </div>

              {/* 1. Variable Tuning Slider */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">{profile.variableTuning.name}:</span>
                  <span className="text-emerald-400 font-bold">{simParam1}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simParam1}
                  onChange={(e) => {
                    setSimParam1(Number(e.target.value));
                    playChime(300 + Number(e.target.value) * 4, 'sine', 0.05);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[11px] text-slate-400 italic">
                  {profile.variableTuning.description}
                </p>

                {/* Quick Presets / Options */}
                <div className="space-y-1.5 pt-1">
                  {profile.variableTuning.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSimParam1(optIdx === 0 ? 15 : optIdx === 1 ? 55 : 95);
                        playChime(500 + optIdx * 100, 'triangle', 0.2);
                        setMascotMessage(opt.outcome);
                        if (optIdx === 2) triggerBadgeUnlock();
                      }}
                      className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 transition flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Spatial Layout & Gesture Dynamic Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    playChime(550, 'sine', 0.2);
                    setMascotMessage(profile.spatialLayout.outcome);
                    triggerBadgeUnlock();
                  }}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition space-y-1 group"
                >
                  <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                    Đổi bố cục / Vị trí:
                  </div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {profile.spatialLayout.action}
                  </div>
                </button>

                <button
                  onClick={() => {
                    playChime(620, 'triangle', 0.2);
                    setMascotMessage(profile.gestureDynamics.outcome);
                    triggerBadgeUnlock();
                  }}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition space-y-1 group"
                >
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    Đổi thao tác / Động tác:
                  </div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {profile.gestureDynamics.action}
                  </div>
                </button>
              </div>

              {/* 3. What-If Challenge Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
                  <Lightbulb className="w-4 h-4" />
                  <span>Thử thách: "Điều gì sẽ xảy ra nếu...?"</span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {profile.whatIfChallenge.question}
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setMascotMessage(profile.whatIfChallenge.discoveryOutcome);
                      triggerBadgeUnlock();
                      playChime(750, 'triangle', 0.35);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Xem Lời Giải Kỳ Diệu</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
};

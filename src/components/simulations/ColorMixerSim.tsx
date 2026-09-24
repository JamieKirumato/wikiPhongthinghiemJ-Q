import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Code,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Trophy,
  BookOpen,
  FlaskConical,
  Paintbrush,
  Droplet
} from 'lucide-react';
import { SIMULATIONS } from '../../data/curriculumData';
import { CodeInspectorModal } from './CodeInspectorModal';
import { MagicFlaskCanvas } from './preschool/MagicFlaskCanvas';
import { ColorCodexView } from './preschool/ColorCodexView';
import { ColoringBookMiniGame } from './preschool/ColoringBookMiniGame';
import {
  INITIAL_PRESCHOOL_MISSIONS,
  INITIAL_COLOR_CODEX,
  PreschoolMission,
  CodexColor,
  calcColorDistance
} from '../../types/preschoolLab';
import { soundEngine } from '../../utils/audioEffects';

export const ColorMixerSim: React.FC = () => {
  // Navigation tabs within Preschool Lab
  const [activeTab, setActiveTab] = useState<'sandbox' | 'missions' | 'codex' | 'coloring'>('missions');

  // Liquid RGB in flask
  const [r, setR] = useState<number>(20);
  const [g, setG] = useState<number>(180);
  const [b, setB] = useState<number>(40);

  // Dropper animation state
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [droppingColor, setDroppingColor] = useState<string>('#ff3333');

  // Missions & Codex states
  const [missions, setMissions] = useState<PreschoolMission[]>(INITIAL_PRESCHOOL_MISSIONS);
  const [activeMissionIndex, setActiveMissionIndex] = useState<number>(0);
  const [codex, setCodex] = useState<CodexColor[]>(INITIAL_COLOR_CODEX);
  const [recentlyUnlockedColor, setRecentlyUnlockedColor] = useState<CodexColor | null>(null);

  // Karpathy inspect modal
  const [showCode, setShowCode] = useState<boolean>(false);

  const mixedColor = `rgb(${r}, ${g}, ${b})`;
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

  const simData = SIMULATIONS.find((s) => s.id === 'sim-color-mixer')!;
  const currentMission = missions[activeMissionIndex];

  // Calculate mission match accuracy
  const targetDistance = currentMission
    ? calcColorDistance([r, g, b], currentMission.targetRgb)
    : 999;
  const maxDistance = 441; // sqrt(255^2 * 3)
  const matchPercent = Math.max(0, Math.min(100, Math.round((1 - targetDistance / maxDistance) * 100)));
  const isMissionPassed = currentMission && targetDistance <= currentMission.tolerance;

  // Trigger drop animation and sound
  const handleDrop = (colorName: 'red' | 'green' | 'blue') => {
    soundEngine.playWaterDrop();
    setIsDropping(true);

    if (colorName === 'red') {
      setDroppingColor('#ef4444');
      setR((prev) => Math.min(255, prev + 45));
    } else if (colorName === 'green') {
      setDroppingColor('#22c55e');
      setG((prev) => Math.min(255, prev + 45));
    } else {
      setDroppingColor('#38bdf8');
      setB((prev) => Math.min(255, prev + 45));
    }

    setTimeout(() => setIsDropping(false), 350);
  };

  // Reset flask liquid
  const handleClearFlask = () => {
    setR(30);
    setG(30);
    setB(30);
  };

  // Check mission completion
  useEffect(() => {
    if (isMissionPassed && !currentMission.completed) {
      soundEngine.playSuccessFanfare();
      setMissions((prev) =>
        prev.map((m, idx) => (idx === activeMissionIndex ? { ...m, completed: true } : m))
      );
    }
  }, [isMissionPassed, activeMissionIndex, currentMission]);

  // Scan Codex for new color discovery
  useEffect(() => {
    codex.forEach((item) => {
      if (!item.unlocked) {
        const dist = calcColorDistance([r, g, b], item.targetRgb);
        if (dist <= item.tolerance) {
          // Unlock color!
          soundEngine.playMagicChime();
          setCodex((prev) =>
            prev.map((c) => (c.id === item.id ? { ...c, unlocked: true } : c))
          );
          setRecentlyUnlockedColor(item);
          setTimeout(() => setRecentlyUnlockedColor(null), 4000);
        }
      }
    });
  }, [r, g, b, codex]);

  const completedMissionsCount = missions.filter((m) => m.completed).length;

  return (
    <div className="bg-[#101623] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#131c2e]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white text-base shadow-sm">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm sm:text-base">
                Phòng Lab Pha Màu Kỳ Diệu
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                Mầm non (3-6 tuổi)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Hệ thống Nhiệm vụ Kép: Cốt Lõi ⭐ & Khám Phá Mix-Match 🎨
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(true)}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition font-mono"
            title="Xem mã nguồn TypeScript & Vật lý màu sắc"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect Code</span>
          </button>
        </div>
      </div>

      {/* Lab Mode Selector Tabs */}
      <div className="bg-[#0b0f17] border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('missions')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'missions'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Thử Thách Cốt Lõi</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
            {completedMissionsCount}/{missions.length} ⭐
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'sandbox'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
          <span>Thực Nghiệm Tự Do</span>
        </button>

        <button
          onClick={() => setActiveTab('codex')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'codex'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sổ Tay 12 Màu Bí Ẩn</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('coloring')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'coloring'
              ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Xưởng Tô Tranh</span>
        </button>
      </div>

      {/* Recently Unlocked Floating Toast Banner */}
      {recentlyUnlockedColor && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white px-4 py-2 flex items-center justify-between text-xs font-medium animate-bounce shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>
              🎉 <strong>MỞ KHÓA MÀU MỚI:</strong> Bé vừa tự tay tạo ra{' '}
              <strong className="underline">{recentlyUnlockedColor.name}</strong> ({recentlyUnlockedColor.realWorldItem})!
            </span>
          </div>
          <span className="font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded">
            +1 Điểm Sổ Tay
          </span>
        </div>
      )}

      {/* Main Body */}
      <div className="p-5 sm:p-6">
        {/* TAB 1: CORE MISSIONS */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            {/* Mission Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {missions.map((m, idx) => {
                const isActive = activeMissionIndex === idx;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMissionIndex(idx);
                      soundEngine.playWaterDrop();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 select-none ${
                      isActive
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-md text-amber-200'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{m.characterEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold line-clamp-1">{m.characterName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        {m.completed ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Xong ⭐
                          </span>
                        ) : (
                          'Chưa xong'
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Mission Card & Story */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentMission.characterEmoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                      {currentMission.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-medium">
                      Mục tiêu màu sắc: {currentMission.targetColorName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => soundEngine.speakText(currentMission.audioPrompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
                  title="Nghe cô giáo đọc nhiệm vụ"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Đọc nhiệm vụ</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-black/20 p-3 rounded-xl border border-slate-800">
                "{currentMission.storyPrompt}"
              </p>

              {/* Progress & Target Match Comparison Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Độ khớp màu mục tiêu: <strong className="text-amber-400 font-mono">{matchPercent}%</strong>
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{currentMission.hint}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isMissionPassed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-amber-500 to-sky-400'
                    }`}
                    style={{ width: `${matchPercent}%` }}
                  />
                </div>
              </div>

              {/* Mission Passed Banner */}
              {isMissionPassed && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>
                      Tuyệt vời! Bé đã pha chế thành công màu cho {currentMission.characterName}!
                    </span>
                  </div>
                  <span className="font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    {currentMission.rewardBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Lab Workspace: Flask & Droppers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Magic Flask Area */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#080d16] border border-slate-800/80 rounded-2xl relative">
                <MagicFlaskCanvas
                  r={r}
                  g={g}
                  b={b}
                  isDropping={isDropping}
                  droppingColor={droppingColor}
                />

                {/* Swatch info */}
                <div className="mt-2 flex items-center gap-2.5 font-mono text-xs">
                  <span className="text-slate-400">Màu trong bình:</span>
                  <span
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: mixedColor }}
                  />
                  <span className="text-slate-200 font-semibold">{hexColor}</span>
                  <button
                    onClick={handleClearFlask}
                    className="p-1 text-slate-500 hover:text-white rounded bg-slate-800/80 hover:bg-slate-700 transition"
                    title="Đổ sạch bình nước"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3 Magic Droppers Controls */}
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-medium">
                  Bé hãy chạm vào từng <strong>Ống nhỏ giọt</strong> để thả từng giọt màu vào bình:
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Red Dropper */}
                  <button
                    onClick={() => handleDrop('red')}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-950/20 border-2 border-red-500/40 hover:border-red-400 hover:bg-red-900/30 active:scale-95 transition shadow-lg group select-none"
                  >
                    <Droplet className="w-8 h-8 text-red-500 group-hover:scale-110 transition drop-shadow fill-red-500" />
                    <span className="mt-2 font-bold text-red-400 text-xs">Ống Đỏ</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">Nhỏ giọt</span>
                  </button>

                  {/* Green / Yellow Dropper */}
                  <button
                    onClick={() => handleDrop('green')}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/30 active:scale-95 transition shadow-lg group select-none"
                  >
                    <Droplet className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition drop-shadow fill-emerald-500" />
                    <span className="mt-2 font-bold text-emerald-400 text-xs">Ống Vàng/Lục</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">Nhỏ giọt</span>
                  </button>

                  {/* Blue Dropper */}
                  <button
                    onClick={() => handleDrop('blue')}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-sky-950/20 border-2 border-sky-500/40 hover:border-sky-400 hover:bg-sky-900/30 active:scale-95 transition shadow-lg group select-none"
                  >
                    <Droplet className="w-8 h-8 text-sky-500 group-hover:scale-110 transition drop-shadow fill-sky-500" />
                    <span className="mt-2 font-bold text-sky-400 text-xs">Ống Lam</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">Nhỏ giọt</span>
                  </button>
                </div>

                {/* Fine tuning sliders */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-500 font-mono uppercase">
                    Hoặc trượt chỉnh chi tiết tỉ lệ màu:
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 w-10">Đỏ:</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={r}
                        onChange={(e) => setR(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded cursor-pointer accent-red-500"
                      />
                      <span className="text-slate-400 w-8 text-right">{r}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 w-10">Lục:</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={g}
                        onChange={(e) => setG(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded cursor-pointer accent-emerald-500"
                      />
                      <span className="text-slate-400 w-8 text-right">{g}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 w-10">Lam:</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={b}
                        onChange={(e) => setB(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded cursor-pointer accent-sky-500"
                      />
                      <span className="text-slate-400 w-8 text-right">{b}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FREE SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-300">
                Ở chế độ này, bé được tự do pha trộn 3 nguồn sáng để khám phá thế giới muôn màu!
              </span>
              <button
                onClick={handleClearFlask}
                className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm sạch bình</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-6 bg-[#080d16] border border-slate-800/80 rounded-2xl">
                <MagicFlaskCanvas
                  r={r}
                  g={g}
                  b={b}
                  isDropping={isDropping}
                  droppingColor={droppingColor}
                />
                <div className="mt-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span>Mã màu RGB:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                    rgb({r}, {g}, {b})
                  </span>
                  <span>{hexColor}</span>
                </div>
              </div>

              {/* Droppers & Presets */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDrop('red')}
                    className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 hover:bg-red-900/30 text-red-400 font-bold text-xs flex flex-col items-center gap-1.5"
                  >
                    <Droplet className="w-6 h-6 fill-red-500" />
                    <span>Thêm Đỏ (+45)</span>
                  </button>
                  <button
                    onClick={() => handleDrop('green')}
                    className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 hover:bg-emerald-900/30 text-emerald-400 font-bold text-xs flex flex-col items-center gap-1.5"
                  >
                    <Droplet className="w-6 h-6 fill-emerald-500" />
                    <span>Thêm Lục (+45)</span>
                  </button>
                  <button
                    onClick={() => handleDrop('blue')}
                    className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/40 hover:bg-sky-900/30 text-sky-400 font-bold text-xs flex flex-col items-center gap-1.5"
                  >
                    <Droplet className="w-6 h-6 fill-sky-500" />
                    <span>Thêm Lam (+45)</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500 uppercase block mb-2">
                    Các tổ hợp màu kỳ diệu trong tự nhiên:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => { setR(255); setG(230); setB(20); soundEngine.playWaterDrop(); }}
                      className="p-2 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-left hover:bg-yellow-500/20 transition"
                    >
                      🌻 Vàng Hoa Cúc (Đỏ + Lục)
                    </button>
                    <button
                      onClick={() => { setR(255); setG(130); setB(10); soundEngine.playWaterDrop(); }}
                      className="p-2 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 text-left hover:bg-orange-500/20 transition"
                    >
                      🍊 Quả Cam Ngọt (Đỏ + Vàng)
                    </button>
                    <button
                      onClick={() => { setR(160); setG(30); setB(220); soundEngine.playWaterDrop(); }}
                      className="p-2 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-left hover:bg-purple-500/20 transition"
                    >
                      🪻 Tím Oải Hương (Đỏ + Lam)
                    </button>
                    <button
                      onClick={() => { setR(255); setG(255); setB(255); soundEngine.playWaterDrop(); }}
                      className="p-2 rounded bg-white/10 border border-white/30 text-white text-left hover:bg-white/20 transition"
                    >
                      ☀️ Ánh Sáng Trắng (Đỏ + Lục + Lam)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THE 12 COLOR CODEX */}
        {activeTab === 'codex' && (
          <ColorCodexView
            codex={codex}
            onSelectColorToFlask={(targetRgb) => {
              setR(targetRgb[0]);
              setG(targetRgb[1]);
              setB(targetRgb[2]);
              setActiveTab('sandbox');
            }}
          />
        )}

        {/* TAB 4: COLORING MINI GAME */}
        {activeTab === 'coloring' && (
          <ColoringBookMiniGame currentMixedColor={mixedColor} />
        )}
      </div>

      {/* Andrej Karpathy Inspect Code Modal */}
      <CodeInspectorModal
        simulation={simData}
        isOpen={showCode}
        onClose={() => setShowCode(false)}
      />
    </div>
  );
};

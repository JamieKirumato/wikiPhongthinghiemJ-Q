import React, { useState, useEffect } from 'react';
import { Ship, Play, RotateCcw, AlertTriangle, Volume2, VolumeX, Sparkles, Tv, Monitor } from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';
import { speechEngine } from '../../utils/speechUtils';

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

export const SimRescueRaftLab: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: string]: number }>({
    foil: 1, straws: 2, sticks: 2, foam: 1, caps: 2
  });
  const [onboardPassengers, setOnboardPassengers] = useState<Passenger[]>([]);
  const [raftLaunched, setRaftLaunched] = useState<boolean>(false);
  const [raftSunk, setRaftSunk] = useState<boolean>(false);
  const [journeySuccess, setJourneySuccess] = useState<boolean>(false);
  const [isClassroomMode, setIsClassroomMode] = useState<boolean>(false);

  // Speech synthesis state
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => speechEngine.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(
    'Chào mừng các bạn nhỏ! Bé hãy lắp ghép vật liệu nổi và mời các bạn thú lên bè để cùng vượt sông nhé!'
  );

  const totalBuoyancy = (selectedMaterials.foil || 0) * 20 +
    (selectedMaterials.straws || 0) * 15 +
    (selectedMaterials.sticks || 0) * 10 +
    (selectedMaterials.foam || 0) * 35 +
    (selectedMaterials.caps || 0) * 12;
  const totalWeight = onboardPassengers.reduce((sum, p) => sum + p.weightGrams, 0);
  const isOverloaded = totalWeight > totalBuoyancy;

  // Subscribe to speaking state
  useEffect(() => {
    const unsub = speechEngine.subscribeSpeakingState(setIsSpeaking);
    return () => unsub();
  }, []);

  // Speak message whenever it changes
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

  const handleAddMaterial = (matKey: string, matName: string, liftGrams: number) => {
    setSelectedMaterials((prev) => ({ ...prev, [matKey]: (prev[matKey] || 0) + 1 }));
    soundEngine.playWaterDrop();
    setMessage(`Bé đã gắn thêm ${matName}, sức nâng của chiếc bè tăng thêm ${liftGrams} gam rồi đấy!`);
  };

  const handleRemoveMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [matKey]: Math.max(0, (prev[matKey] || 0) - 1) }));
  };

  const handleAddPassenger = (passenger: Passenger) => {
    if (onboardPassengers.length >= 6) {
      setMessage('Chiếc bè đã kín chỗ ngồi rồi! Bé hãy bấm "Khởi hành qua sông" để xuất phát nhé.');
      return;
    }
    setOnboardPassengers((prev) => [...prev, { ...passenger, id: `${passenger.id}-${Date.now()}` }]);
    soundEngine.playWaterDrop();
    setMessage(`Chào đón ${passenger.name} lên bè! Bè đang chở thêm ${passenger.weightGrams} gam.`);
  };

  const handleRemovePassenger = (idx: number) => {
    const removed = onboardPassengers[idx];
    setOnboardPassengers((prev) => prev.filter((_, i) => i !== idx));
    setRaftLaunched(false);
    if (removed) {
      setMessage(`Đã đưa ${removed.name} rời bè về bờ.`);
    }
  };

  const handleLaunchRaft = () => {
    if (onboardPassengers.length === 0) {
      setMessage('Chưa có hành khách nào trên bè cả. Bé hãy chọn các bạn thú ở bảng bên phải nhé!');
      return;
    }
    setRaftLaunched(true);
    if (isOverloaded) {
      setRaftSunk(true);
      setJourneySuccess(false);
      soundEngine.playWaterSplash(true);
      setMessage(`Ôi nguy rồi! Chiếc bè chở quá tải ${totalWeight - totalBuoyancy} gam nên đã bị chìm! Bé hãy gắn thêm phao xốp hoặc giảm bớt đồ vật nặng nhé!`);
    } else {
      setRaftSunk(false);
      setJourneySuccess(true);
      soundEngine.playSuccessFanfare();
      setMessage(`Hoan hô! Chiếc bè vững chãi đã đưa ${onboardPassengers.length} bạn nhỏ vượt sông an toàn sang bờ bên kia rồi!`);
    }
  };

  const handleReset = () => {
    setOnboardPassengers([]);
    setRaftLaunched(false);
    setRaftSunk(false);
    setJourneySuccess(false);
    setMessage('Xưởng đã chuẩn bị vật liệu mới, bé hãy lắp ráp chiếc bè tiếp theo nhé!');
  };

  return (
    <div className={`bg-white dark:bg-[#0c121e] border-2 border-emerald-500 rounded-3xl p-5 shadow-xl space-y-6 transition-all ${
      isClassroomMode ? 'ring-4 ring-emerald-500/20 max-w-6xl mx-auto' : ''
    }`}>
      {/* Header and top controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Ship className="w-5 h-5 text-emerald-600" />
            <span>Xưởng Chế Tạo Bè Cứu Hộ Vượt Sông (STEAM Khám Phá)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lắp ráp các vật liệu nổi để tạo chiếc bè chở được số lượng hành khách hoặc đồ vật qua sông an toàn.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-mono px-3 py-1.5 rounded-full font-bold transition ${
            isOverloaded
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400'
              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
          }`}>
            Sức nâng: {totalBuoyancy}g | Tải thực tế: {totalWeight}g
          </span>

          {/* Voice Narration Toggle */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-mono font-semibold transition ${
              voiceEnabled
                ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title={voiceEnabled ? 'Đang bật giọng Cô Mimi' : 'Đang tắt giọng Cô Mimi'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceEnabled ? 'Giọng Cô Mimi 🔊' : 'Giọng Mimi 🔇'}</span>
          </button>

          {/* Classroom Mode Toggle */}
          <button
            onClick={() => setIsClassroomMode(!isClassroomMode)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-mono font-semibold transition ${
              isClassroomMode
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-bold'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Chế độ Lớp học: Phóng to sông và nút bấm cho màn hình tương tác"
          >
            {isClassroomMode ? <Tv className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isClassroomMode ? 'Lớp học: BẬT 🎓' : 'Chế độ Lớp học 🎓'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* River Simulation (Full or 7 cols) */}
        <div className={`${isClassroomMode ? 'lg:col-span-7' : 'lg:col-span-7'} space-y-3`}>
          <div className="relative w-full h-[420px] rounded-3xl border-4 border-emerald-500/50 bg-gradient-to-b from-sky-200 via-sky-300/60 to-blue-400/50 dark:from-slate-900 dark:via-sky-950/40 dark:to-blue-900/60 overflow-hidden shadow-xl p-4 flex flex-col justify-between">
            <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-emerald-600 to-emerald-700/80 border-r-2 border-emerald-800/40 flex flex-col items-center justify-center p-2 z-10 shadow-md">
              <span className="text-[10px] font-bold text-white font-mono [writing-mode:vertical-lr] tracking-widest">
                🚩 BẾN XUẤT PHÁT
              </span>
            </div>

            <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-emerald-600 to-emerald-700/80 border-l-2 border-emerald-800/40 flex flex-col items-center justify-center p-2 z-10 shadow-md">
              <span className="text-[10px] font-bold text-white font-mono [writing-mode:vertical-lr] tracking-widest">
                🏁 BỜ BÊN KIA
              </span>
            </div>

            {isOverloaded && (
              <div className="relative z-20 mx-auto px-4 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg animate-bounce">
                <AlertTriangle className="w-4 h-4" />
                <span>CẢNH BÁO: Quá tải {totalWeight - totalBuoyancy}g! Bè sẽ bị chìm nếu khởi hành!</span>
              </div>
            )}

            {/* The Raft */}
            <div
              style={{
                transform: raftLaunched
                  ? journeySuccess
                    ? 'translateX(160px)'
                    : 'translateX(80px) translateY(90px) rotate(16deg)'
                  : 'translateX(0px)',
                transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className={`relative z-20 mx-auto my-auto w-64 p-3 rounded-2xl border-4 transition-all ${
                raftSunk
                  ? 'bg-blue-950/80 border-rose-500 opacity-60'
                  : isOverloaded
                  ? 'bg-amber-100 dark:bg-amber-900/60 border-rose-500 ring-4 ring-rose-400/40'
                  : 'bg-amber-200/90 dark:bg-amber-900/80 border-amber-600 dark:border-amber-500 shadow-2xl'
              }`}
            >
              <div className="text-[10px] font-mono text-center font-bold text-amber-900 dark:text-amber-200 border-b border-amber-400/40 pb-1 mb-2 flex items-center justify-center gap-1.5">
                <Ship className="w-3 h-3" />
                <span>BÈ CỨU HỘ ({totalBuoyancy}g sức nâng)</span>
              </div>

              <div className="min-h-[75px] grid grid-cols-3 gap-1.5 items-center justify-center p-1.5 bg-white/40 dark:bg-black/20 rounded-xl">
                {onboardPassengers.length === 0 ? (
                  <div className="col-span-3 text-center text-[10px] text-amber-900/70 dark:text-amber-300 italic py-3 font-medium">
                    Chưa có hành khách.<br />Hãy bấm chọn ở bảng bên phải!
                  </div>
                ) : (
                  onboardPassengers.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => handleRemovePassenger(idx)}
                      className="p-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 border border-amber-300 dark:border-amber-700 flex flex-col items-center cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-950/50 transition shadow-2xs group hover:scale-105 active:scale-95"
                      title="Bấm để đưa khách rời bè"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                      <span className="text-[8px] font-mono font-bold text-slate-700 dark:text-slate-300">{p.weightGrams}g</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Launch button */}
            <div className="relative z-20 flex items-center justify-center gap-3">
              <button
                onClick={handleLaunchRaft}
                disabled={raftLaunched && journeySuccess}
                className="flex items-center gap-2 py-3 px-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono shadow-xl transition hover:scale-102 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{raftLaunched && journeySuccess ? '🎉 ĐÃ SANG BỜ AN TOÀN!' : 'KHỞI HÀNH QUA SÔNG 🚀'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls & Material Panel */}
        <div className={`${isClassroomMode ? 'lg:col-span-5' : 'lg:col-span-5'} space-y-4`}>
          {/* Card 1: Materials */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
            <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>1. Vật Liệu Ghép Bè</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">+ Sức nâng</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <span className="font-bold">🧱 Tấm xốp EVA</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono font-semibold">+35g sức nâng</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('foam')} className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-sm">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.foam || 0}</span>
                  <button onClick={() => handleAddMaterial('foam', 'Tấm xốp EVA', 35)} className="w-7 h-7 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-sm">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <span className="font-bold">🥤 Ống hút nhựa</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono font-semibold">+15g sức nâng</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('straws')} className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-sm">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.straws || 0}</span>
                  <button onClick={() => handleAddMaterial('straws', 'Ống hút nhựa', 15)} className="w-7 h-7 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-sm">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <span className="font-bold">🔘 Nắp chai nhựa</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono font-semibold">+12g sức nâng</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('caps')} className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-sm">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.caps || 0}</span>
                  <button onClick={() => handleAddMaterial('caps', 'Nắp chai nhựa', 12)} className="w-7 h-7 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-sm">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <span className="font-bold">🪵 Que kem gỗ</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono font-semibold">+10g sức nâng</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('sticks')} className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-sm">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.sticks || 0}</span>
                  <button onClick={() => handleAddMaterial('sticks', 'Que kem gỗ', 10)} className="w-7 h-7 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-sm">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Passenger Pool */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
            <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>2. Chọn Hành Khách / Tải Trọng</span>
              <span className="text-sky-600 dark:text-sky-400 text-[10px] font-mono font-bold">Bấm để xếp lên bè</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {PASSENGERS_POOL.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAddPassenger(p)}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex flex-col items-center justify-center transition hover:scale-105 active:scale-95 shadow-2xs group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">{p.name}</span>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold">+{p.weightGrams}g</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Guidance / Mascot Bar with Speech Feedback */}
      <div className={`p-4 rounded-3xl border shadow-md flex items-center gap-3.5 transition-all ${
        isClassroomMode
          ? 'bg-gradient-to-r from-emerald-100/90 via-teal-100/80 to-sky-100/90 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border-2 border-emerald-400 dark:border-emerald-600'
          : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 border-emerald-200 dark:border-emerald-800'
      }`}>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0 relative ${
          isSpeaking ? 'animate-bounce ring-4 ring-emerald-400/40' : ''
        }`}>
          <span>👩‍🏫</span>
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 animate-ping" />
          )}
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Thuyền Trưởng Mimi Hướng Dẫn:</span>
              {isSpeaking && (
                <span className="flex items-center gap-0.5 ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse delay-150" />
                  <span className="ml-1">Đang nói...</span>
                </span>
              )}
            </h4>

            {/* Replay Voice button */}
            <button
              onClick={handleReplayVoice}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-slate-700 text-xs font-mono font-bold transition shadow-2xs hover:scale-105 active:scale-95"
              title="Bấm để nghe Thuyền Trưởng Mimi đọc lại lời giải thích"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Nghe cô nói lại 🔊</span>
            </button>
          </div>

          <p className={`text-slate-800 dark:text-slate-200 font-medium leading-relaxed ${
            isClassroomMode ? 'text-sm sm:text-base font-semibold' : 'text-xs sm:text-sm'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Ship, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

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

  const totalBuoyancy = (selectedMaterials.foil || 0) * 20 +
    (selectedMaterials.straws || 0) * 15 +
    (selectedMaterials.sticks || 0) * 10 +
    (selectedMaterials.foam || 0) * 35 +
    (selectedMaterials.caps || 0) * 12;
  const totalWeight = onboardPassengers.reduce((sum, p) => sum + p.weightGrams, 0);
  const isOverloaded = totalWeight > totalBuoyancy;

  const handleAddMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [matKey]: (prev[matKey] || 0) + 1 }));
    soundEngine.playWaterDrop();
  };
  const handleRemoveMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [matKey]: Math.max(0, (prev[matKey] || 0) - 1) }));
  };
  const handleAddPassenger = (passenger: Passenger) => {
    if (onboardPassengers.length >= 6) return;
    setOnboardPassengers((prev) => [...prev, { ...passenger, id: `${passenger.id}-${Date.now()}` }]);
    soundEngine.playWaterDrop();
  };
  const handleRemovePassenger = (idx: number) => {
    setOnboardPassengers((prev) => prev.filter((_, i) => i !== idx));
    setRaftLaunched(false);
  };
  const handleLaunchRaft = () => {
    if (onboardPassengers.length === 0) return;
    setRaftLaunched(true);
    if (isOverloaded) {
      setRaftSunk(true);
      setJourneySuccess(false);
      soundEngine.playWaterSplash(true);
    } else {
      setRaftSunk(false);
      setJourneySuccess(true);
      soundEngine.playSuccessFanfare();
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border-2 border-emerald-500 rounded-3xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Ship className="w-5 h-5 text-emerald-600" />
            <span>Xưởng Chế Tạo Bè Cứu Hộ Vượt Sông (STEAM Khám Phá)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lắp ráp các vật liệu nổi để tạo chiếc bè chở được số lượng hành khách hoặc đồ vật (sỏi) qua sông an toàn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
            Sức nâng: {totalBuoyancy}g | Tải thực tế: {totalWeight}g
          </span>
          <button
            onClick={() => { setOnboardPassengers([]); setRaftLaunched(false); setRaftSunk(false); setJourneySuccess(false); }}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* River Simulation */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative w-full h-[400px] rounded-3xl border-4 border-emerald-500/50 bg-gradient-to-b from-sky-200 via-sky-300/60 to-blue-400/50 dark:from-slate-900 dark:via-sky-950/40 dark:to-blue-900/60 overflow-hidden shadow-xl p-4 flex flex-col justify-between">
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
              <div className="relative z-20 mx-auto px-3.5 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg animate-bounce">
                <AlertTriangle className="w-4 h-4" />
                <span>CẢNH BÁO: Quá tải! Bè sẽ bị chìm nếu khởi hành!</span>
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
              <div className="text-[10px] font-mono text-center font-bold text-amber-900 dark:text-amber-200 border-b border-amber-400/40 pb-1 mb-2">
                BÈ CỨU HỘ ({totalBuoyancy}g sức nâng)
              </div>

              <div className="min-h-[75px] grid grid-cols-3 gap-1.5 items-center justify-center p-1.5 bg-white/40 dark:bg-black/20 rounded-xl">
                {onboardPassengers.length === 0 ? (
                  <div className="col-span-3 text-center text-[10px] text-amber-900/70 dark:text-amber-300 italic py-3">
                    Chưa có hành khách. Hãy chọn ở bảng bên phải!
                  </div>
                ) : (
                  onboardPassengers.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => handleRemovePassenger(idx)}
                      className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-700 flex flex-col items-center cursor-pointer hover:bg-rose-100 transition shadow-2xs group"
                      title="Bấm để đưa khách rời bè"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
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
                <span>{raftLaunched && journeySuccess ? '🎉 ĐÃ SANG BỜ AN TOÀN!' : 'KHỞI HÀNH QUA SÔNG 🚀'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>1. Vật Liệu Ghép Bè</span>
              <span className="text-emerald-600 text-[10px] font-mono">+ Sức nâng</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                <span>🧱 Tấm xốp EVA (+35g)</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('foam')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.foam || 0}</span>
                  <button onClick={() => handleAddMaterial('foam')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                <span>🥤 Ống hút nhựa (+15g)</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('straws')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.straws || 0}</span>
                  <button onClick={() => handleAddMaterial('straws')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                <span>🔘 Nắp chai nhựa (+12g)</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('caps')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.caps || 0}</span>
                  <button onClick={() => handleAddMaterial('caps')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border">
                <span>🪵 Que kem gỗ (+10g)</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveMaterial('sticks')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{selectedMaterials.sticks || 0}</span>
                  <button onClick={() => handleAddMaterial('sticks')} className="px-2 py-0.5 rounded bg-slate-100 font-bold">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>2. Chọn Hành Khách / Tải Trọng</span>
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
                  <span className="text-[10px] font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">{p.name}</span>
                  <span className="text-[9px] font-mono text-slate-500">+{p.weightGrams}g</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CodexColor } from '../../../types/preschoolLab';
import { Lock, Volume2 } from 'lucide-react';
import { soundEngine } from '../../../utils/audioEffects';

interface Props {
  codex: CodexColor[];
  onSelectColorToFlask?: (rgb: [number, number, number]) => void;
}

export const ColorCodexView: React.FC<Props> = ({ codex, onSelectColorToFlask }) => {
  const unlockedCount = codex.filter((c) => c.unlocked).length;
  const progressPercent = Math.round((unlockedCount / codex.length) * 100);

  const handleCardClick = (color: CodexColor) => {
    if (color.unlocked) {
      soundEngine.playMagicChime();
      soundEngine.speakText(`${color.name}. Giống như ${color.realWorldItem}!`);
      if (onSelectColorToFlask) {
        onSelectColorToFlask(color.targetRgb);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Progress Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Sổ Tay Thu Thập 12 Sắc Màu Bí Ẩn
              </h3>
              <p className="text-[11px] text-slate-400">
                Hãy tự do pha màu trong bình để mở khóa tất cả các màu bí ẩn xung quanh em!
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-400">
              {unlockedCount} / {codex.length} Màu
            </span>
            <span className="text-[10px] text-slate-500 block">({progressPercent}%)</span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 12 Color Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {codex.map((item) => {
          const isUnlocked = item.unlocked;

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative overflow-hidden select-none ${
                isUnlocked
                  ? 'bg-slate-900/90 border-slate-700 hover:border-slate-500 hover:scale-[1.03] shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? (
                <div className="space-y-2">
                  {/* Color Swatch Orb */}
                  <div
                    className="w-12 h-12 mx-auto rounded-full shadow-lg border-2 border-white/30 flex items-center justify-center text-lg transition transform group-hover:rotate-12"
                    style={{ backgroundColor: item.hex }}
                  >
                    <span>{item.itemEmoji}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-100 text-xs flex items-center justify-center gap-1">
                      <span>{item.name}</span>
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.realWorldItem}
                    </p>
                  </div>

                  <span className="inline-block text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Đã mở khóa
                  </span>
                </div>
              ) : (
                /* Locked State */
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                    <Lock className="w-5 h-5 text-slate-500" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-500 text-xs font-mono">
                      Màu Bí Ẩn ?
                    </h4>
                    <p className="text-[10px] text-slate-600 line-clamp-1 mt-0.5 italic">
                      Hãy tự phối màu để tìm!
                    </p>
                  </div>

                  <span className="inline-block text-[9px] font-mono text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                    Chưa mở khóa
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

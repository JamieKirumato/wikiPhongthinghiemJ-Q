import React, { useState } from 'react';
import { Sparkles, Code, RotateCcw } from 'lucide-react';
import { SIMULATIONS } from '../../data/curriculumData';
import { CodeInspectorModal } from './CodeInspectorModal';

export const ColorMixerSim: React.FC = () => {
  const [r, setR] = useState<number>(255);
  const [g, setG] = useState<number>(180);
  const [b, setB] = useState<number>(20);
  const [showCode, setShowCode] = useState<boolean>(false);

  const mixedColor = `rgb(${r}, ${g}, ${b})`;
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

  const simData = SIMULATIONS.find(s => s.id === 'sim-color-mixer')!;

  const handleReset = () => {
    setR(255);
    setG(180);
    setB(20);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Sim Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#141d2e]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-200 text-sm">Mô phỏng 1: Khối Trộn Màu Sắc Tương Tác</span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Mầm non (3-6t)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 transition"
            title="Đặt lại"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowCode(true)}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 px-3 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition font-mono"
          >
            <Code className="w-3.5 h-3.5" />
            Inspect Code
          </button>
        </div>
      </div>

      {/* Sim Body */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visualizer Area */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0b0f17] border border-slate-800/80 rounded-xl relative overflow-hidden min-h-[260px]">
          {/* Overlapping Spotlights simulation */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Red Light */}
            <div
              className="absolute w-28 h-28 rounded-full blur-sm transition-all duration-150 mix-blend-screen"
              style={{
                backgroundColor: `rgb(${r}, 0, 0)`,
                transform: 'translate(-20px, -20px)',
                opacity: r > 0 ? 0.85 : 0.05
              }}
            />
            {/* Green Light */}
            <div
              className="absolute w-28 h-28 rounded-full blur-sm transition-all duration-150 mix-blend-screen"
              style={{
                backgroundColor: `rgb(0, ${g}, 0)`,
                transform: 'translate(20px, -20px)',
                opacity: g > 0 ? 0.85 : 0.05
              }}
            />
            {/* Blue Light */}
            <div
              className="absolute w-28 h-28 rounded-full blur-sm transition-all duration-150 mix-blend-screen"
              style={{
                backgroundColor: `rgb(0, 0, ${b})`,
                transform: 'translate(0px, 20px)',
                opacity: b > 0 ? 0.85 : 0.05
              }}
            />

            {/* Central Pure Mixed Color Orb */}
            <div
              className="z-10 w-24 h-24 rounded-2xl shadow-2xl border-2 border-white/20 transition-all duration-200 flex items-center justify-center"
              style={{ backgroundColor: mixedColor }}
            >
              <Sparkles className="w-6 h-6 text-white drop-shadow" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Màu thu được:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
              {hexColor}
            </span>
            <span className="text-slate-500">rgb({r}, {g}, {b})</span>
          </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-medium">
            Kéo các thanh trượt để thay đổi cường độ 3 nguồn sáng cơ bản:
          </div>

          {/* Red Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-red-400 font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Đỏ (Red)
              </span>
              <span className="text-slate-400">{r} / 255</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Green Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Xanh lục (Green)
              </span>
              <span className="text-slate-400">{g} / 255</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={g}
              onChange={(e) => setG(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Blue Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-sky-400 font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Xanh lam (Blue)
              </span>
              <span className="text-slate-400">{b} / 255</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-500 font-mono mb-2 uppercase">Thử nhanh các màu quen thuộc:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setR(255); setG(255); setB(0); }}
                className="text-xs px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition"
              >
                Vàng nắng (Đỏ + Lục)
              </button>
              <button
                onClick={() => { setR(255); setG(0); setB(255); }}
                className="text-xs px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-500/30 transition"
              >
                Màu Cánh Sen (Đỏ + Lam)
              </button>
              <button
                onClick={() => { setR(0); setG(255); setB(255); }}
                className="text-xs px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
              >
                Xanh lơ Cyan (Lục + Lam)
              </button>
              <button
                onClick={() => { setR(255); setG(255); setB(255); }}
                className="text-xs px-2.5 py-1 rounded bg-white/20 text-white border border-white/30 hover:bg-white/30 transition"
              >
                Trắng (Cả 3 màu cực đại)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Inspector Modal */}
      <CodeInspectorModal
        simulation={simData}
        isOpen={showCode}
        onClose={() => setShowCode(false)}
      />
    </div>
  );
};

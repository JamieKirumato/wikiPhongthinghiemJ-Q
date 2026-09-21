import React, { useState } from 'react';
import { Scale, Code, CheckCircle2, AlertCircle } from 'lucide-react';
import { SIMULATIONS } from '../../data/curriculumData';
import { CodeInspectorModal } from './CodeInspectorModal';

export const BalanceScaleSim: React.FC = () => {
  // Left fraction: a / b
  const [numLeft, setNumLeft] = useState<number>(2);
  const [denomLeft, setDenomLeft] = useState<number>(4);

  // Right fraction: c / d
  const [numRight, setNumRight] = useState<number>(1);
  const [denomRight, setDenomRight] = useState<number>(2);

  const [showCode, setShowCode] = useState<boolean>(false);

  const valLeft = numLeft / denomLeft;
  const valRight = numRight / denomRight;
  const diff = valLeft - valRight;
  const isBalanced = Math.abs(diff) < 0.0001;

  // Tilt angle between -15 deg and +15 deg
  const tiltDeg = Math.max(-14, Math.min(14, -diff * 28));

  const simData = SIMULATIONS.find(s => s.id === 'sim-balance-fraction')!;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Sim Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#141d2e]">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-200 text-sm">Mô phỏng 2: Cân Thăng Bằng & Trực Quan Phân Số</span>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">Tiểu học (Lớp 4)</span>
        </div>
        <button
          onClick={() => setShowCode(true)}
          className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 px-3 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition font-mono"
        >
          <Code className="w-3.5 h-3.5" />
          Inspect Code
        </button>
      </div>

      {/* Sim Content */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Balance Scale SVG */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0b0f17] border border-slate-800/80 rounded-xl relative min-h-[260px] select-none">
          <svg viewBox="0 0 320 200" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Base stand */}
            <polygon points="135,190 185,190 165,110 155,110" fill="#334155" />
            <circle cx="160" cy="110" r="7" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />

            {/* Tilting Lever Beam */}
            <g
              style={{
                transform: `rotate(${tiltDeg}deg)`,
                transformOrigin: '160px 110px',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Beam line */}
              <rect x="30" y="107" width="260" height="6" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />
              {/* Left & Right hooks */}
              <circle cx="45" cy="110" r="4" fill="#38bdf8" />
              <circle cx="275" cy="110" r="4" fill="#f59e0b" />

              {/* Left hanging strings & pan */}
              <line x1="45" y1="110" x2="30" y2="155" stroke="#475569" strokeWidth="1.5" />
              <line x1="45" y1="110" x2="60" y2="155" stroke="#475569" strokeWidth="1.5" />
              <path d="M 20 155 Q 45 165 70 155 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

              {/* Left Pan Content (Fraction Value) */}
              <text x="45" y="148" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {numLeft}/{denomLeft}
              </text>

              {/* Right hanging strings & pan */}
              <line x1="275" y1="110" x2="260" y2="155" stroke="#475569" strokeWidth="1.5" />
              <line x1="275" y1="110" x2="290" y2="155" stroke="#475569" strokeWidth="1.5" />
              <path d="M 250 155 Q 275 165 300 155 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />

              {/* Right Pan Content (Fraction Value) */}
              <text x="275" y="148" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {numRight}/{denomRight}
              </text>
            </g>
          </svg>

          {/* Status Badge */}
          <div className="mt-2 flex items-center gap-2">
            {isBalanced ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cân bằng! Hai phân số bằng nhau ({numLeft}/{denomLeft} = {numRight}/{denomRight})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {valLeft > valRight ? `Vế trái (${numLeft}/${denomLeft}) lớn hơn` : `Vế phải (${numRight}/${denomRight}) lớn hơn`}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-4 text-xs">
          {/* Left Fraction Controls */}
          <div className="p-3 bg-sky-950/20 border border-sky-800/40 rounded-lg space-y-2">
            <div className="font-semibold text-sky-300 flex justify-between items-center">
              <span>Đĩa cân bên Trái: {numLeft}/{denomLeft} = {valLeft.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Tử số (lấy mấy phần): {numLeft}</label>
                <input
                  type="range"
                  min="1"
                  max={denomLeft}
                  value={numLeft}
                  onChange={(e) => setNumLeft(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-sky-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Mẫu số (chia ra): {denomLeft}</label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={denomLeft}
                  onChange={(e) => {
                    const newDenom = Number(e.target.value);
                    setDenomLeft(newDenom);
                    if (numLeft > newDenom) setNumLeft(newDenom);
                  }}
                  className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Right Fraction Controls */}
          <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg space-y-2">
            <div className="font-semibold text-amber-300 flex justify-between items-center">
              <span>Đĩa cân bên Phải: {numRight}/{denomRight} = {valRight.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Tử số: {numRight}</label>
                <input
                  type="range"
                  min="1"
                  max={denomRight}
                  value={numRight}
                  onChange={(e) => setNumRight(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Mẫu số: {denomRight}</label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={denomRight}
                  onChange={(e) => {
                    const newDenom = Number(e.target.value);
                    setDenomRight(newDenom);
                    if (numRight > newDenom) setNumRight(newDenom);
                  }}
                  className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Quick equivalence presets */}
          <div className="flex gap-2">
            <button
              onClick={() => { setNumLeft(2); setDenomLeft(4); setNumRight(1); setDenomRight(2); }}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
            >
              2/4 = 1/2
            </button>
            <button
              onClick={() => { setNumLeft(3); setDenomLeft(6); setNumRight(4); setDenomRight(8); }}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
            >
              3/6 = 4/8
            </button>
            <button
              onClick={() => { setNumLeft(2); setDenomLeft(3); setNumRight(4); setDenomRight(6); }}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
            >
              2/3 = 4/6
            </button>
          </div>
        </div>
      </div>

      <CodeInspectorModal
        simulation={simData}
        isOpen={showCode}
        onClose={() => setShowCode(false)}
      />
    </div>
  );
};

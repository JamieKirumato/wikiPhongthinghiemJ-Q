import React, { useState } from 'react';
import { Paintbrush, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../../utils/audioEffects';

interface Props {
  currentMixedColor: string; // e.g. "rgb(255, 140, 20)"
}

export const ColoringBookMiniGame: React.FC<Props> = ({ currentMixedColor }) => {
  // Painting parts state
  const [parts, setParts] = useState<{ [key: string]: string }>({
    sun: '#ffffff',
    sunRays: '#ffffff',
    butterflyLeftWing: '#ffffff',
    butterflyRightWing: '#ffffff',
    butterflyBody: '#ffffff',
    flowerPetals: '#ffffff',
    flowerCenter: '#ffffff',
    leaf: '#ffffff',
  });

  const handlePaintPart = (partKey: string) => {
    soundEngine.playWaterDrop();
    setParts((prev) => ({
      ...prev,
      [partKey]: currentMixedColor,
    }));
  };

  const handleReset = () => {
    setParts({
      sun: '#ffffff',
      sunRays: '#ffffff',
      butterflyLeftWing: '#ffffff',
      butterflyRightWing: '#ffffff',
      butterflyBody: '#ffffff',
      flowerPetals: '#ffffff',
      flowerCenter: '#ffffff',
      leaf: '#ffffff',
    });
  };

  return (
    <div className="space-y-4">
      {/* Workshop Header */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
            <Paintbrush className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">
              Xưởng Vẽ Ma Thuật Của Bé
            </h3>
            <p className="text-[11px] text-slate-400">
              Hãy dùng màu bé vừa tự pha trong bình để chấm cọ tô màu cho bạn Bướm và Hoa nhé!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Current brush color preview */}
          <div className="flex items-center gap-2 bg-[#0b0f17] px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-[11px] text-slate-400">Màu cọ vẽ:</span>
            <div
              className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: currentMixedColor }}
            />
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            title="Tô lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Coloring Canvas */}
      <div className="flex items-center justify-center p-6 bg-[#080d16] border border-slate-800 rounded-2xl relative select-none">
        <svg
          viewBox="0 0 400 300"
          className="w-full max-w-[420px] h-auto cursor-pointer drop-shadow-xl"
        >
          {/* Background outline sky */}
          <rect
            x="5"
            y="5"
            width="390"
            height="290"
            rx="16"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* 1. Sun & Sunrays */}
          <g onClick={() => handlePaintPart('sunRays')}>
            <line x1="60" y1="20" x2="60" y2="10" stroke={parts.sunRays} strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="35" x2="22" y2="28" stroke={parts.sunRays} strokeWidth="3" strokeLinecap="round" />
            <line x1="90" y1="35" x2="98" y2="28" stroke={parts.sunRays} strokeWidth="3" strokeLinecap="round" />
            <line x1="18" y1="60" x2="8" y2="60" stroke={parts.sunRays} strokeWidth="3" strokeLinecap="round" />
            <line x1="102" y1="60" x2="112" y2="60" stroke={parts.sunRays} strokeWidth="3" strokeLinecap="round" />
          </g>
          <circle
            cx="60"
            cy="60"
            r="26"
            fill={parts.sun}
            stroke="#475569"
            strokeWidth="2.5"
            onClick={() => handlePaintPart('sun')}
            className="hover:opacity-90 transition"
          />
          {/* Sun smile */}
          <circle cx="52" cy="54" r="2.5" fill="#1e293b" />
          <circle cx="68" cy="54" r="2.5" fill="#1e293b" />
          <path d="M 52 66 Q 60 74 68 66" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

          {/* 2. Cute Flower at bottom-left */}
          {/* Flower stem & leaf */}
          <path d="M 100 280 Q 95 240 100 200" fill="none" stroke="#334155" strokeWidth="4" />
          <path
            d="M 100 240 Q 130 225 125 245 Q 115 255 100 240 Z"
            fill={parts.leaf}
            stroke="#475569"
            strokeWidth="2"
            onClick={() => handlePaintPart('leaf')}
            className="hover:opacity-90 transition"
          />
          {/* Flower Petals */}
          <g onClick={() => handlePaintPart('flowerPetals')} className="hover:opacity-90 transition">
            <circle cx="100" cy="180" r="16" fill={parts.flowerPetals} stroke="#475569" strokeWidth="2" />
            <circle cx="120" cy="195" r="16" fill={parts.flowerPetals} stroke="#475569" strokeWidth="2" />
            <circle cx="112" cy="220" r="16" fill={parts.flowerPetals} stroke="#475569" strokeWidth="2" />
            <circle cx="88" cy="220" r="16" fill={parts.flowerPetals} stroke="#475569" strokeWidth="2" />
            <circle cx="80" cy="195" r="16" fill={parts.flowerPetals} stroke="#475569" strokeWidth="2" />
          </g>
          {/* Flower Center */}
          <circle
            cx="100"
            cy="200"
            r="14"
            fill={parts.flowerCenter}
            stroke="#475569"
            strokeWidth="2"
            onClick={(e) => {
              e.stopPropagation();
              handlePaintPart('flowerCenter');
            }}
          />

          {/* 3. Magical Butterfly */}
          {/* Left Wing */}
          <path
            d="M 270 140 C 220 90, 190 120, 220 170 C 200 190, 230 220, 270 175 Z"
            fill={parts.butterflyLeftWing}
            stroke="#475569"
            strokeWidth="2.5"
            onClick={() => handlePaintPart('butterflyLeftWing')}
            className="hover:opacity-90 transition"
          />
          {/* Right Wing */}
          <path
            d="M 270 140 C 320 90, 350 120, 320 170 C 340 190, 310 220, 270 175 Z"
            fill={parts.butterflyRightWing}
            stroke="#475569"
            strokeWidth="2.5"
            onClick={() => handlePaintPart('butterflyRightWing')}
            className="hover:opacity-90 transition"
          />
          {/* Butterfly Body */}
          <ellipse
            cx="270"
            cy="155"
            rx="7"
            ry="25"
            fill={parts.butterflyBody}
            stroke="#475569"
            strokeWidth="2"
            onClick={() => handlePaintPart('butterflyBody')}
          />
          {/* Antennae */}
          <path d="M 268 132 Q 255 115 250 118" fill="none" stroke="#475569" strokeWidth="2" />
          <circle cx="249" cy="119" r="2" fill="#94a3b8" />
          <path d="M 272 132 Q 285 115 290 118" fill="none" stroke="#475569" strokeWidth="2" />
          <circle cx="291" cy="119" r="2" fill="#94a3b8" />
        </svg>
      </div>

      <div className="text-center text-xs text-slate-400">
        💡 <strong className="text-slate-300">Cách chơi:</strong> Bấm vào bình nước để pha ra màu sắc em thích, sau đó bấm trực tiếp vào Cánh bướm, Bông hoa hoặc Mặt trời để tô màu!
      </div>
    </div>
  );
};

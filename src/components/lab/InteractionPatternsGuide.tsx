import React, { useState } from 'react';
import { INTERACTION_PATTERNS } from '../../data/simulationCatalogData';
import {
  SlidersHorizontal,
  Move,
  Atom,
  Timer,
  Code2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';

export const InteractionPatternsGuide: React.FC = () => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(INTERACTION_PATTERNS[0].id);

  const activePattern =
    INTERACTION_PATTERNS.find((p) => p.id === selectedPatternId) || INTERACTION_PATTERNS[0];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'SlidersHorizontal':
        return <SlidersHorizontal className="w-5 h-5 text-sky-400" />;
      case 'Move':
        return <Move className="w-5 h-5 text-amber-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-emerald-400" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-purple-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Mô Hình Sư Phạm First-Principles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tracking-tight">
            Đề Xuất Các Dạng Tương Tác Trong Thí Nghiệm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Để mô phỏng không biến thành một bộ phim hoạt hình thụ động, người học cần được trao các công cụ tương tác thực thụ. Dưới đây là <strong>6 dạng tương tác cốt lõi</strong> được chuẩn hóa cho toàn bộ thí nghiệm từ Mầm non đến THPT.
          </p>
        </div>
      </div>

      {/* Grid of 6 Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {INTERACTION_PATTERNS.map((pattern) => {
          const isSelected = selectedPatternId === pattern.id;

          return (
            <button
              key={pattern.id}
              onClick={() => setSelectedPatternId(pattern.id)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-850/90 border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.12)]'
                  : 'bg-[#0b0f17]/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400" />
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {renderIcon(pattern.icon)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {pattern.id.replace('pattern-', 'DẠNG ')}
                  </span>
                </div>

                <h3 className="font-semibold text-xs sm:text-sm text-slate-100 leading-snug">
                  {pattern.name}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {pattern.tagline}
                </p>
              </div>

              <div className="flex items-center text-[11px] text-sky-400 font-mono gap-1 pt-1 border-t border-slate-800/60">
                <span>Xem chi tiết sư phạm</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pattern Detailed Inspection Panel */}
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              {renderIcon(activePattern.icon)}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">{activePattern.name}</h3>
              <p className="text-xs text-sky-400 font-mono">{activePattern.tagline}</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono border border-slate-800 self-start sm:self-auto">
            Chuẩn tương tác STEM GDPT 2018
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Column 1: UI Description & Pedagogy */}
          <div className="space-y-3.5">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Thao tác kỹ thuật của người học:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {activePattern.description}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-sky-950/20 border border-sky-500/20 space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Giá trị sư phạm & Tư duy First-Principles:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {activePattern.pedagogy}
              </p>
            </div>
          </div>

          {/* Column 2: Applied Examples in Curriculum */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-400 mb-1">
              Ví dụ áp dụng trong chương trình học:
            </div>
            <ul className="space-y-2">
              {activePattern.examples.map((ex, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

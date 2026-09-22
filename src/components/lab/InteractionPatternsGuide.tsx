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
  CheckCircle2
} from 'lucide-react';

export const InteractionPatternsGuide: React.FC = () => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(INTERACTION_PATTERNS[0].id);

  const activePattern =
    INTERACTION_PATTERNS.find((p) => p.id === selectedPatternId) || INTERACTION_PATTERNS[0];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'SlidersHorizontal':
        return <SlidersHorizontal className="w-5 h-5 text-sky-500" />;
      case 'Move':
        return <Move className="w-5 h-5 text-amber-500" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-emerald-500" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-purple-500" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-cyan-500" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl transition-colors">
      {/* Title */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
          Đề Xuất Các Dạng Tương Tác Trong Thí Nghiệm
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Để mô phỏng không biến thành video thụ động, người học cần được trao các công cụ tương tác thực thụ. Bấm chọn từng dạng bên trái để xem bảng nội dung minh họa thao tác và giá trị sư phạm ở bên phải.
        </p>
      </div>

      {/* 2-Column Split: Left Selector & Right Inspection Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: 6 Interaction Patterns List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-400 dark:text-slate-500 px-1">
            Chọn Dạng Tương Tác (1 đến 6):
          </div>

          <div className="space-y-2">
            {INTERACTION_PATTERNS.map((pattern, idx) => {
              const isSelected = selectedPatternId === pattern.id;

              return (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-slate-800/90 border-sky-500 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-slate-50/70 dark:bg-[#0b0f17]/70 border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 bottom-2 left-0 w-1 bg-sky-500 rounded-r" />
                  )}

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0 mt-0.5">
                    {renderIcon(pattern.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        DẠNG {idx + 1}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-semibold flex items-center gap-0.5">
                          Đang xem <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {pattern.name.split('(')[0].replace(/^\d+\.\s*/, '')}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {pattern.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inspection Board with Technical Details & Pedagogy (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors">
          {/* Header of Active Pattern */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                {renderIcon(activePattern.icon)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  {activePattern.name}
                </h3>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-mono">
                  {activePattern.tagline}
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-800 whitespace-nowrap hidden sm:inline-block">
              Chuẩn GDPT 2018
            </span>
          </div>

          {/* Block 1: Technical Execution */}
          <div className="space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-500" />
              <span>Thao tác kỹ thuật của người học:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {activePattern.description}
            </p>
          </div>

          {/* Block 2: Pedagogy */}
          <div className="space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Giá trị sư phạm & Phương pháp tiếp cận:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
              {activePattern.pedagogy}
            </p>
          </div>

          {/* Block 3: Curriculum Examples */}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Ví dụ áp dụng trong chương trình học GDPT:</span>
            </div>
            <div className="space-y-1.5">
              {activePattern.examples.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 transition-colors text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5 font-bold">
                    {exIdx + 1}
                  </span>
                  <span className="leading-relaxed">{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

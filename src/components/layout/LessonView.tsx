import React from 'react';
import { Lesson, Subject } from '../../types/curriculum';
import { Lightbulb, BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ColorMixerSim } from '../simulations/ColorMixerSim';
import { BalanceScaleSim } from '../simulations/BalanceScaleSim';
import { ElectricCircuitSim } from '../simulations/ElectricCircuitSim';
import { PendulumCalculusSim } from '../simulations/PendulumCalculusSim';

interface Props {
  lesson: Lesson;
  subject?: Subject;
  onNavigateToSimLab: (simId?: string) => void;
}

export const LessonView: React.FC<Props> = ({ lesson, subject, onNavigateToSimLab }) => {
  const renderSimulation = () => {
    switch (lesson.simulationId) {
      case 'sim-color-mixer':
        return <ColorMixerSim />;
      case 'sim-balance-fraction':
        return <BalanceScaleSim />;
      case 'sim-electric-circuit':
        return <ElectricCircuitSim />;
      case 'sim-pendulum-calculus':
        return <PendulumCalculusSim />;
      default:
        return (
          <div className="p-8 text-center bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
            <Sparkles className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Mô phỏng tương tác cho bài học này đang được chuẩn bị...
            </p>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6 max-w-4xl transition-colors">
      {/* Lesson Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {subject?.name || 'Môn học'}
          </span>
          <span>•</span>
          <span className="text-sky-600 dark:text-sky-400">Kết nối tri thức với cuộc sống</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {lesson.title}
        </h1>
      </div>

      {/* Karpathy First-Principles Callout Box */}
      <div className="bg-amber-50/80 dark:bg-gradient-to-r dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl shadow-sm dark:shadow-md space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs tracking-wider uppercase font-mono">
          <Lightbulb className="w-4 h-4" />
          <span>Bản Chất Nguyên Lý Sơ Khởi (First-Principles)</span>
        </div>
        <div className="text-sm text-amber-900 dark:text-amber-200/90 font-medium italic">
          "{lesson.firstPrinciples.coreQuestion}"
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {lesson.firstPrinciples.intuition}
        </p>
        <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-amber-200/60 dark:border-slate-800/60">
          <strong className="text-slate-800 dark:text-slate-300">Ý nghĩa thực tiễn: </strong>
          {lesson.firstPrinciples.whyItMatters}
        </div>
      </div>

      {/* Embedded Interactive Simulation Widget */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-200 text-base">
              Thực Nghiệm Tương Tác
            </h2>
          </div>
          {lesson.simulationId && (
            <button
              onClick={() => onNavigateToSimLab(lesson.simulationId)}
              className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-mono font-medium"
            >
              <span>Mở trong Thư viện mô phỏng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* The Live Interactive Sim */}
        {renderSimulation()}
      </div>

      {/* Theory & Learning Guide */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h2 className="font-semibold text-slate-900 dark:text-slate-200 text-base">
            Hướng Dẫn & Tóm Tắt Trọng Tâm
          </h2>
        </div>

        {/* Formula Display if any */}
        {lesson.keyFormulaLatex && (
          <div className="p-4 bg-slate-100 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-emerald-700 dark:text-emerald-400 text-sm overflow-x-auto text-center">
            <div className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider">
              Công thức định luật / Quy tắc cốt lõi:
            </div>
            <div className="text-base py-1 font-semibold">
              {lesson.keyFormulaLatex}
            </div>
          </div>
        )}

        {/* Summary Bullet Points */}
        <ul className="space-y-2.5">
          {lesson.summary.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

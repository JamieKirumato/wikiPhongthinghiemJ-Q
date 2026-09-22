import React, { useState } from 'react';
import { getGradePhilosophy, GradePhilosophy } from '../../data/gradePhilosophyData';
import { Sparkles, CheckCircle2, Lightbulb, HeartHandshake, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  gradeId: string;
}

export const GradePhilosophyCard: React.FC<Props> = ({ gradeId }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'mandatory' | 'recommended' | 'attitudes'>('all');

  const philosophy: GradePhilosophy | undefined = getGradePhilosophy(gradeId);

  if (!philosophy) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                Khung Triết Lý Giáo Dục {philosophy.gradeName} ({philosophy.ageRange})
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono">
                Chuẩn GDPT 2018
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Định hướng sư phạm cốt lõi, chuẩn đầu ra bắt buộc và phẩm chất cần rèn luyện
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-mono"
        >
          <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1 animate-fadeIn">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === 'all'
                  ? 'bg-sky-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Xem tất cả 4 trụ cột
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === 'general'
                  ? 'bg-sky-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              1. Đặc điểm triết lý chung
            </button>
            <button
              onClick={() => setActiveTab('mandatory')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === 'mandatory'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              2. Điều bắt buộc cần học
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === 'recommended'
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              3. Điều nên học / nắm được
            </button>
            <button
              onClick={() => setActiveTab('attitudes')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === 'attitudes'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              4. Thái độ cần có
            </button>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Đặc điểm chung triết lý giáo dục */}
            {(activeTab === 'all' || activeTab === 'general') && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-xs uppercase font-mono tracking-wider">
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  <span>1. Đặc điểm chung triết lý giáo dục</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {philosophy.generalPhilosophy.summary}
                </p>
                <div className="space-y-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">Nguyên tắc cốt lõi:</span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {philosophy.generalPhilosophy.corePrinciples.map((principle, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0 mt-1.5" />
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 2. Điều bắt buộc học sinh cần học */}
            {(activeTab === 'all' || activeTab === 'mandatory') && (
              <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase font-mono tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>2. Điều bắt buộc học sinh cần học (Chuẩn tối thiểu)</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {philosophy.mandatoryLearnings.summary}
                </p>
                <div className="space-y-1.5 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">Yêu cầu cần đạt chuẩn:</span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {philosophy.mandatoryLearnings.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Điều học sinh nên học / nắm được */}
            {(activeTab === 'all' || activeTab === 'recommended') && (
              <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase font-mono tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>3. Điều học sinh nên học / nắm được (Mở rộng & Khuyến khích)</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {philosophy.recommendedLearnings.summary}
                </p>
                <div className="space-y-1.5 pt-1.5 border-t border-amber-200/60 dark:border-amber-800/40">
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold">Khuyến khích phát triển:</span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {philosophy.recommendedLearnings.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 4. Thái độ học sinh cần có */}
            {(activeTab === 'all' || activeTab === 'attitudes') && (
              <div className="p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase font-mono tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>4. Thái độ học sinh cần có (Phẩm chất & Tâm thế)</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {philosophy.requiredAttitudes.summary}
                </p>
                <div className="space-y-1.5 pt-1.5 border-t border-rose-200/60 dark:border-rose-800/40">
                  <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-semibold">Phẩm chất hình thành:</span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {philosophy.requiredAttitudes.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

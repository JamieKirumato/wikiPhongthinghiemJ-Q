import React from 'react';
import { BookOpen, FlaskConical, ShieldCheck, X } from 'lucide-react';

interface Props {
  activeView: 'curriculum' | 'simulations';
  setActiveView: (view: 'curriculum' | 'simulations') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<Props> = ({
  activeView,
  setActiveView,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Vertical Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#080d17] border-r border-slate-200 dark:border-slate-800/90 flex flex-col justify-between transition-all duration-200 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Area: Logo & App Title */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/10 to-emerald-500/10 dark:from-sky-500/20 dark:to-emerald-500/20 border border-sky-500/30 dark:border-sky-500/40 flex items-center justify-center text-sky-600 dark:text-sky-400 font-mono font-bold text-xl shadow-sm">
                K
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight font-mono">
                    K-12 WIKI & LAB
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-mono border border-sky-300 dark:border-sky-500/20 font-semibold">
                    v2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  First-Principles • Andrej Karpathy
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Area: Vertical Navigation Tabs */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-4">
          <div className="px-3 text-[10px] uppercase font-mono font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
            Điều Hướng Chính
          </div>

          <div className="space-y-2">
            {/* Vertical Tab 1: Tổng quan chương trình */}
            <button
              onClick={() => {
                setActiveView('curriculum');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                activeView === 'curriculum'
                  ? 'bg-sky-50 dark:bg-sky-500/15 border-sky-500 text-sky-950 dark:text-sky-200 shadow-sm'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-800'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  activeView === 'curriculum'
                    ? 'bg-sky-600 text-white dark:bg-sky-500/20 dark:text-sky-300 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    Tổng quan chương trình
                  </span>
                  {activeView === 'curriculum' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  Cây bài học, mục lục SGK Kết nối tri thức & mô phỏng nhúng
                </p>
              </div>
            </button>

            {/* Vertical Tab 2: Thư viện mô phỏng */}
            <button
              onClick={() => {
                setActiveView('simulations');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                activeView === 'simulations'
                  ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-sm'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-800'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  activeView === 'simulations'
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-transparent'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    Thư viện mô phỏng
                  </span>
                  <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono border border-emerald-300 dark:border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    70 lab
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  70 thí nghiệm K-12 & 6 dạng tương tác First-Principles
                </p>
              </div>
            </button>
          </div>

          {/* Philosophy Note */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-gradient-to-br dark:from-amber-950/20 dark:to-slate-900 border border-amber-200 dark:border-amber-500/20 space-y-1.5 text-xs mt-6">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Triết lý Andrej Karpathy</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "Don't just memorize formulas. Build the intuition, sweep parameters, and inspect the code."
            </p>
          </div>
        </div>

        {/* Clean minimal footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 text-center font-mono">
          First-Principles Science Lab
        </div>
      </aside>
    </>
  );
};

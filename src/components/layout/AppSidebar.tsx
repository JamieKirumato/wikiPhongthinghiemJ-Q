import React from 'react';
import { BookOpen, FlaskConical, Search, ExternalLink, Sparkles, Layers, ShieldCheck, X } from 'lucide-react';

interface Props {
  activeView: 'curriculum' | 'simulations';
  setActiveView: (view: 'curriculum' | 'simulations') => void;
  onOpenSearch: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<Props> = ({
  activeView,
  setActiveView,
  onOpenSearch,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Vertical Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#080d17] border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Area: Logo & App Title */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-mono font-bold text-xl shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                K
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-100 text-sm tracking-tight font-mono">
                    K-12 WIKI & LAB
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20">
                    v2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  First-Principles • Andrej Karpathy
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={() => {
              onOpenSearch();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
              <span>Tìm kiếm bài học, lab...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded text-slate-400 border border-slate-700 font-mono">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Center Area: Vertical Navigation Tabs */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation Group */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1 text-[10px] uppercase font-mono font-semibold text-slate-500 tracking-wider">
              Điều Hướng Chính
            </div>

            {/* Vertical Tab 1: Tổng quan chương trình */}
            <button
              onClick={() => {
                setActiveView('curriculum');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                activeView === 'curriculum'
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.12)]'
                  : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-800'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  activeView === 'curriculum'
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-100">
                    Tổng quan chương trình
                  </span>
                  {activeView === 'curriculum' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
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
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                activeView === 'simulations'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                  : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-800'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  activeView === 'simulations'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-100">
                    Thư viện mô phỏng
                  </span>
                  <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  Danh mục 24+ thí nghiệm K-12 & 6 dạng tương tác First-Principles
                </p>
              </div>
            </button>
          </div>

          {/* Quick Stats Panel */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 font-semibold">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Hệ Thống GDPT 2018</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono">
              <div className="p-2 rounded-lg bg-[#0b0f17] border border-slate-800">
                <div className="text-base font-bold text-sky-400">4</div>
                <div className="text-[10px] text-slate-500">Cấp học K-12</div>
              </div>
              <div className="p-2 rounded-lg bg-[#0b0f17] border border-slate-800">
                <div className="text-base font-bold text-emerald-400">24+</div>
                <div className="text-[10px] text-slate-500">Thí nghiệm</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 text-center pt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Học từ bản chất nguyên lý gốc</span>
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/20 to-slate-900 border border-amber-500/20 space-y-1.5 text-xs">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Triết lý Andrej Karpathy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "Don't just memorize formulas. Build the intuition, sweep parameters, and inspect the code."
            </p>
          </div>
        </div>

        {/* Bottom Area: Official Sources */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060a12] space-y-2">
          <a
            href="https://hanhtrangso.nxbgd.vn/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 text-xs text-slate-300 hover:text-sky-300 transition group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px]">Nguồn: Hành Trang Số</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
          </a>
          <div className="text-[10px] text-slate-500 text-center font-mono">
            SGK Kết nối tri thức với cuộc sống
          </div>
        </div>
      </aside>
    </>
  );
};

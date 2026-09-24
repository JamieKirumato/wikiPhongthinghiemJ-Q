import React, { useState } from 'react';
import { BookOpen, FlaskConical, X, Sparkles, ChevronDown } from 'lucide-react';

export type ActiveViewType = 'curriculum' | 'simulations' | 'preschool-products';

interface Props {
  activeView: ActiveViewType;
  setActiveView: (view: ActiveViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<Props> = ({
  activeView,
  setActiveView,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [isSimExpanded, setIsSimExpanded] = useState<boolean>(true);
  const isSimSectionActive = activeView === 'simulations' || activeView === 'preschool-products';
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
                  Wiki Thí Nghiệm & Mô Phỏng
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
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsSimExpanded(true);
                  setActiveView('preschool-products');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isSimSectionActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-sm'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-800'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    isSimSectionActive
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
                    70 thí nghiệm K-12 & 6 dạng tương tác thực nghiệm
                  </p>
                </div>
                <div className="mt-1 text-slate-400">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSimExpanded ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} />
                </div>
              </button>

              {/* Sub-tabs ngay bên dưới "Thư viện mô phỏng" */}
              {isSimExpanded && (
                <div className="ml-4 pl-3 border-l-2 border-emerald-400/50 dark:border-emerald-500/30 space-y-1.5 pt-1 animate-fadeIn">
                  {/* Tab nhỏ: Sản phẩm Mầm non */}
                  <button
                    onClick={() => {
                      setActiveView('preschool-products');
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      activeView === 'preschool-products'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-950 dark:text-amber-200 font-semibold shadow-xs ring-1 ring-amber-500/30'
                        : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${
                      activeView === 'preschool-products'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          Sản phẩm Mầm non
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-bold border border-amber-300 dark:border-amber-700">
                          3 Lab
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        Cải tiến online & Khám phá tư duy
                      </p>
                    </div>
                  </button>

                  {/* Tab nhỏ 2: Kho 70 mô phỏng K-12 */}
                  <button
                    onClick={() => {
                      setActiveView('simulations');
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all ${
                      activeView === 'simulations'
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-[11px] font-medium">Kho 70 mô phỏng K-12</span>
                    <span className="text-[9px] text-slate-400 font-mono">70 lab</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { Menu, Search, ExternalLink, BookOpen, FlaskConical } from 'lucide-react';

interface Props {
  activeView: 'curriculum' | 'simulations';
  onOpenSearch: () => void;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<Props> = ({
  activeView,
  onOpenSearch,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0b0f17]/90 backdrop-blur border-b border-slate-800/90 h-14">
      <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Mở menu điều hướng"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 hidden sm:inline">K-12 Platform</span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            {activeView === 'curriculum' ? (
              <span className="flex items-center gap-1.5 text-sky-300 font-semibold bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Tổng quan chương trình</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                <span>Thư viện mô phỏng</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-lg transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Tìm kiếm bài học...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 rounded text-slate-400 border border-slate-700 font-mono">
              Ctrl+K
            </kbd>
          </button>

          <a
            href="https://hanhtrangso.nxbgd.vn/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 px-2.5 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
            title="Nguồn học liệu Hành Trang Số"
          >
            <span className="text-[11px]">Hành Trang Số</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};

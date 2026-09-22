import React from 'react';
import { Menu, Search, ExternalLink, BookOpen, FlaskConical, Sun, Moon } from 'lucide-react';

interface Props {
  activeView: 'curriculum' | 'simulations';
  onOpenSearch: () => void;
  onOpenMobileSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<Props> = ({
  activeView,
  onOpenSearch,
  onOpenMobileSidebar,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800/90 h-14 transition-colors">
      <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Active view indicator (No K-12 Platform text) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Mở menu điều hướng"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            {activeView === 'curriculum' ? (
              <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-semibold bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-200 dark:border-sky-500/20">
                <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Tổng quan chương trình</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Thư viện mô phỏng (70 thí nghiệm)</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Exactly 1 search bar, next to "Bộ sách giáo khoa" & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* The Single Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition"
            title="Tìm kiếm bài học hoặc thí nghiệm (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Tìm kiếm bài học...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] bg-white dark:bg-slate-800 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Button: "Bộ sách giáo khoa" (links to Hành Trang Số) */}
          <a
            href="https://hanhtrangso.nxbgd.vn/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition font-medium"
            title="Nguồn học liệu Hành Trang Số (NXBGDVN)"
          >
            <span className="text-[11px] whitespace-nowrap">Bộ sách giáo khoa</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            title={theme === 'light' ? 'Chuyển sang Chế độ Tối' : 'Chuyển sang Chế độ Sáng (Mặc định)'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

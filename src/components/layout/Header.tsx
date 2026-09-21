import React from 'react';
import { BookOpen, FlaskConical, Search, ExternalLink } from 'lucide-react';

interface Props {
  activeView: 'curriculum' | 'simulations';
  setActiveView: (view: 'curriculum' | 'simulations') => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<Props> = ({ activeView, setActiveView, onOpenSearch }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Slogan */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold text-lg">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-base tracking-tight font-mono">K-12 WIKI & LAB</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20">
                Karpathy Style
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Học hiểu bản chất First-Principles • SGK Kết nối tri thức
            </p>
          </div>
        </div>

        {/* Central View Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('curriculum')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'curriculum'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tổng quan chương trình</span>
          </button>
          <button
            onClick={() => setActiveView('simulations')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'simulations'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Thư viện mô phỏng</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>

        {/* Actions */}
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
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 px-2.5 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
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

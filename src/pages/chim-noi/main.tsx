import React from 'react';
import ReactDOM from 'react-dom/client';
import { SimSinkOrFloatLab } from '../../components/preschool/SimSinkOrFloatLab';
import { ArrowLeft } from 'lucide-react';

const StandaloneChimNoiApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100 text-slate-800 antialiased font-sans select-none">
      {/* Top Standalone Header Bar */}
      <header className="w-full px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-sky-200/80 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition"
            title="Quay lại Trang Chủ Wiki"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang Chủ Wiki</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <h1 className="font-extrabold text-sm sm:text-base text-sky-950 dark:text-sky-100 flex items-center gap-1.5">
              <span>Thí Nghiệm: Sự Chìm &amp; Nổi Của Vật</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                HTML Độc Lập
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick links to other standalone labs */}
          <div className="hidden md:flex items-center gap-1 text-xs">
            <span className="text-slate-500 mr-1 text-[11px]">Lab khác:</span>
            <a href="/pha-mau.html" className="px-2 py-1 rounded-lg hover:bg-white text-purple-700 font-medium">Pha Màu</a>
            <a href="/den-dung-nham.html" className="px-2 py-1 rounded-lg hover:bg-white text-rose-700 font-medium">Đèn Dung Nham</a>
            <a href="/be-cuu-sinh.html" className="px-2 py-1 rounded-lg hover:bg-white text-teal-700 font-medium">Bè Cứu Sinh</a>
            <a href="/do-luong.html" className="px-2 py-1 rounded-lg hover:bg-white text-amber-700 font-medium">Đo Lường</a>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
            title="Làm mới trang để bắt đầu lại thí nghiệm"
          >
            🔄 <span>Làm Mới</span>
          </button>
        </div>
      </header>

      {/* Main Full-width Interactive Experiment Canvas */}
      <main className="flex-1 w-full flex flex-col p-2 sm:p-4">
        <SimSinkOrFloatLab isStandalone={true} />
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StandaloneChimNoiApp />
  </React.StrictMode>
);

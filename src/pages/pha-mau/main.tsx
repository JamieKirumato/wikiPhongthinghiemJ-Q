import React from 'react';
import ReactDOM from 'react-dom/client';
import { SimColorMixerLab } from '../../components/preschool/SimColorMixerLab';
import '../../index.css';
import { ArrowLeft } from 'lucide-react';

const StandalonePhaMauApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100 via-pink-50 to-amber-50 text-slate-800 antialiased font-sans select-none">
      <header className="w-full px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-purple-200/80 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang Chủ Wiki</span>
          </a>
          <h1 className="font-extrabold text-sm sm:text-base text-purple-950 flex items-center gap-1.5">
            <span>🎨 Thí Nghiệm: Pha Màu Nước Kỳ Diệu</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-300">
              HTML Độc Lập
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="/chim-noi.html" className="text-xs px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 font-bold">
            🌊 Xem Chìm Nổi
          </a>
        </div>
      </header>
      <main className="flex-1 w-full p-2 sm:p-4">
        <SimColorMixerLab />
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StandalonePhaMauApp />
  </React.StrictMode>
);

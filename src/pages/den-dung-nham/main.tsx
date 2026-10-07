import React from 'react';
import ReactDOM from 'react-dom/client';
import { SimLavaLampLab } from '../../components/preschool/SimLavaLampLab';
import '../../index.css';
import { ArrowLeft } from 'lucide-react';

const StandaloneLavaApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white antialiased font-sans select-none">
      <header className="w-full px-4 py-2 bg-slate-900/90 backdrop-blur-md border-b border-purple-800/80 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang Chủ Wiki</span>
          </a>
          <h1 className="font-extrabold text-sm sm:text-base text-rose-300 flex items-center gap-1.5">
            <span>🌋 Thí Nghiệm: Đèn Dung Nham Sủi Bọt</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-700">
              Thử tại nhà
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="/chim-noi.html" className="text-xs px-2.5 py-1 rounded-lg bg-sky-900 text-sky-200 hover:bg-sky-800 font-bold">
            🌊 Xem Chìm Nổi
          </a>
        </div>
      </header>
      <main className="flex-1 w-full p-2 sm:p-4">
        <SimLavaLampLab />
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StandaloneLavaApp />
  </React.StrictMode>
);

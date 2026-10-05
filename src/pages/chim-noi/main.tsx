import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import { SimSinkOrFloatLab } from '../../components/preschool/SimSinkOrFloatLab';
const StandaloneChimNoiApp: React.FC = () => (
  <div className="h-[100dvh] flex flex-col overflow-hidden bg-sky-50 text-slate-800 font-sans">
    <header className="h-11 shrink-0 px-3 flex items-center justify-between bg-white border-b border-sky-100">
      <h1 className="font-extrabold text-sky-900">🌊 Vật chìm, vật nổi</h1>
      <a href="/" className="text-sm font-semibold px-3 py-2 rounded-xl text-sky-700 hover:bg-sky-50">← Trang chủ</a>
    </header>
    <main className="flex-1 min-h-0 p-1 sm:p-2"><SimSinkOrFloatLab isStandalone /></main>
  </div>
);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode><StandaloneChimNoiApp /></React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import { SimSinkOrFloatLab } from '../../components/preschool/SimSinkOrFloatLab';
const StandaloneChimNoiApp: React.FC = () => (
  <div className="h-[100dvh] flex flex-col overflow-hidden bg-sky-50 text-slate-800 font-sans">
    <h1 className="sr-only">Vật chìm, vật nổi</h1>
    <main className="flex-1 min-h-0 sm:p-2"><SimSinkOrFloatLab isStandalone onBackToTable={()=>window.location.assign('/')} /></main>
  </div>
);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode><StandaloneChimNoiApp /></React.StrictMode>
);

import React, { useState, useEffect } from 'react';
import { SIMULATIONS } from '../../data/curriculumData';
import { FlaskConical, Play, Sparkles, X } from 'lucide-react';
import { ColorMixerSim } from '../simulations/ColorMixerSim';
import { BalanceScaleSim } from '../simulations/BalanceScaleSim';
import { ElectricCircuitSim } from '../simulations/ElectricCircuitSim';
import { PendulumCalculusSim } from '../simulations/PendulumCalculusSim';
import { InteractionPatternsGuide } from './InteractionPatternsGuide';
import { SimulationCatalogTable } from './SimulationCatalogTable';

interface Props {
  focusSimId?: string;
}

export const SimulationLabGrid: React.FC<Props> = ({ focusSimId }) => {
  const [activeSimId, setActiveSimId] = useState<string | null>(focusSimId || null);

  useEffect(() => {
    if (focusSimId) {
      setActiveSimId(focusSimId);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }, [focusSimId]);

  const activeSim = SIMULATIONS.find((s) => s.id === activeSimId);

  const renderSimComponent = (id: string) => {
    switch (id) {
      case 'sim-color-mixer':
        return <ColorMixerSim />;
      case 'sim-balance-fraction':
        return <BalanceScaleSim />;
      case 'sim-electric-circuit':
        return <ElectricCircuitSim />;
      case 'sim-pendulum-calculus':
        return <PendulumCalculusSim />;
      default:
        return null;
    }
  };

  const handleRunLiveSim = (simId: string) => {
    setActiveSimId(simId);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 transition-colors">
      {/* 1. Lab Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>K-12 First-Principles Interactive Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
          Thư Viện Mô Phỏng & Phòng Lab Thực Nghiệm
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Xây dựng trực giác khoa học sâu sắc từ Mầm non đến Lớp 12 theo triết lý của <strong>Andrej Karpathy</strong>: Trực quan hóa bản chất, tự do điều khiển tham số và mở tung mã nguồn logic.
        </p>
      </div>

      {/* 2. Active Focus Simulator Workspace (If Running) */}
      {activeSim && (
        <section className="p-6 bg-white dark:bg-slate-900/95 border-2 border-emerald-500 rounded-2xl shadow-xl dark:shadow-2xl space-y-4 animate-fadeIn ring-2 ring-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono font-semibold">
                  {activeSim.gradeLabel} • {activeSim.subjectName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  Phòng Lab Tương Tác Trực Tiếp
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeSim.title}</h2>
            </div>

            <button
              onClick={() => setActiveSimId(null)}
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition self-start sm:self-auto font-mono"
            >
              <X className="w-3.5 h-3.5" />
              <span>Thu nhỏ phòng Lab</span>
            </button>
          </div>

          <div>{renderSimComponent(activeSim.id)}</div>
        </section>
      )}

      {/* 3. Section 1: Các Dạng Tương Tác Trong Thí Nghiệm (2 Cột Trái - Phải) */}
      <section>
        <InteractionPatternsGuide />
      </section>

      {/* 4. Section 2: Danh Mục Thí Nghiệm Chuẩn GDPT 2018 (Mầm non - THPT) */}
      <section>
        <SimulationCatalogTable onRunLiveSimulation={handleRunLiveSim} />
      </section>

      {/* 5. Section 3: Thẻ Khởi Động Nhanh Các Mô Phỏng Tương Tác Sẵn Có */}
      <section className="space-y-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-base flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Phòng Lab Tương Tác Nổi Bật (Live Simulation Engines)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Nhấp vào để khởi động ngay giao diện thí nghiệm tương tác và bóc tách mã nguồn thời gian thực.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SIMULATIONS.map((sim) => {
            const isSelected = activeSimId === sim.id;

            return (
              <div
                key={sim.id}
                className={`flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/70 border rounded-xl p-4 hover:border-red-500 dark:hover:border-red-500 transition space-y-3 ${
                  isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent">
                      {sim.gradeLabel}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{sim.subjectName}</span>
                  </div>

                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-snug">
                    {sim.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {sim.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRunLiveSim(sim.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-xs font-semibold font-mono transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Khởi động Lab</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

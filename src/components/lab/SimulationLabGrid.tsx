import React, { useState } from 'react';
import { SIMULATIONS } from '../../data/curriculumData';
import { LevelId } from '../../types/curriculum';
import { FlaskConical, Play } from 'lucide-react';
import { ColorMixerSim } from '../simulations/ColorMixerSim';
import { BalanceScaleSim } from '../simulations/BalanceScaleSim';
import { ElectricCircuitSim } from '../simulations/ElectricCircuitSim';
import { PendulumCalculusSim } from '../simulations/PendulumCalculusSim';

interface Props {
  focusSimId?: string;
}

export const SimulationLabGrid: React.FC<Props> = ({ focusSimId }) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<LevelId | 'all'>('all');
  const [activeSimId, setActiveSimId] = useState<string | null>(focusSimId || null);

  const filteredSimulations = SIMULATIONS.filter((sim) => {
    if (selectedLevelFilter === 'all') return true;
    return sim.levelId === selectedLevelFilter;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Lab Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>K-12 Interactive Simulation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight font-mono">
          Thư Viện Mô Phỏng First-Principles
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Áp dụng triết lý của <strong>Andrej Karpathy</strong>: Thay vì học vẹt công thức, học sinh tương tác trực tiếp với các biến số vật lý/toán học và mở tung mã nguồn logic để hiểu bản chất sâu sắc từ Mầm non đến Lớp 12.
        </p>
      </div>

      {/* Level Filters */}
      <div className="flex items-center justify-center gap-2 flex-wrap pb-2 border-b border-slate-800">
        <button
          onClick={() => setSelectedLevelFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition ${
            selectedLevelFilter === 'all'
              ? 'bg-sky-500 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          [Tất cả cấp học]
        </button>
        <button
          onClick={() => setSelectedLevelFilter('mam-non')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition ${
            selectedLevelFilter === 'mam-non'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          [Mầm non]
        </button>
        <button
          onClick={() => setSelectedLevelFilter('tieu-hoc')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition ${
            selectedLevelFilter === 'tieu-hoc'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          [Tiểu học]
        </button>
        <button
          onClick={() => setSelectedLevelFilter('thcs')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition ${
            selectedLevelFilter === 'thcs'
              ? 'bg-sky-600 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          [THCS]
        </button>
        <button
          onClick={() => setSelectedLevelFilter('thpt')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition ${
            selectedLevelFilter === 'thpt'
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          [THPT]
        </button>
      </div>

      {/* Active Focus Simulator If Selected */}
      {activeSim && (
        <div className="p-6 bg-slate-900/90 border-2 border-sky-500/40 rounded-2xl shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                {activeSim.gradeLabel} • {activeSim.subjectName}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{activeSim.title}</h2>
            </div>
            <button
              onClick={() => setActiveSimId(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
            >
              Thu nhỏ về danh sách
            </button>
          </div>

          <div>{renderSimComponent(activeSim.id)}</div>
        </div>
      )}

      {/* Grid of Simulation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredSimulations.map((sim) => {
          const isSelected = activeSimId === sim.id;

          return (
            <div
              key={sim.id}
              className={`flex flex-col justify-between bg-slate-900/70 border rounded-xl p-5 hover:border-slate-700 transition space-y-4 ${
                isSelected ? 'border-sky-500/60 ring-1 ring-sky-500/30' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {sim.gradeLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{sim.subjectName}</span>
                </div>

                <h3 className="font-semibold text-slate-100 text-sm leading-snug">
                  {sim.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {sim.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sim.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#0b0f17] text-slate-400 border border-slate-800/80 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSimId(sim.id);
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 text-xs font-semibold transition font-mono"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Khởi động thí nghiệm</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

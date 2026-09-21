import React from 'react';
import { LevelId } from '../../types/curriculum';
import { LEVELS } from '../../data/curriculumData';

interface Props {
  selectedLevel: LevelId;
  onSelectLevel: (level: LevelId) => void;
}

export const LevelTabs: React.FC<Props> = ({ selectedLevel, onSelectLevel }) => {
  return (
    <div className="border-b border-slate-800 bg-[#0d131f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3">
          {LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => onSelectLevel(level.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'bg-sky-950/30 border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.12)]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400" />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-semibold text-sm ${
                      isSelected ? 'text-sky-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    {level.shortName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">
                    {level.ageRange.split('(')[0].trim()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                  {level.badge}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

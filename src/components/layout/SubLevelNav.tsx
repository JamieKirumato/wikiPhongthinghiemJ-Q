import React from 'react';
import { Grade, Subject, LevelInfo } from '../../types/curriculum';
import { Sparkles, Calculator, FlaskConical, Atom, Waves, Zap, Binary, Cpu, Code, Pi, Sigma } from 'lucide-react';

interface Props {
  levelInfo: LevelInfo;
  grades: Grade[];
  selectedGradeId: string;
  onSelectGrade: (gradeId: string) => void;
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
}

const renderSubjectIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
    case 'Calculator': return <Calculator className="w-3.5 h-3.5" />;
    case 'FlaskConical': return <FlaskConical className="w-3.5 h-3.5" />;
    case 'Atom': return <Atom className="w-3.5 h-3.5" />;
    case 'Waves': return <Waves className="w-3.5 h-3.5" />;
    case 'Zap': return <Zap className="w-3.5 h-3.5" />;
    case 'Binary': return <Binary className="w-3.5 h-3.5" />;
    case 'Cpu': return <Cpu className="w-3.5 h-3.5" />;
    case 'Code': return <Code className="w-3.5 h-3.5" />;
    case 'Pi': return <Pi className="w-3.5 h-3.5" />;
    case 'Sigma': return <Sigma className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
};

export const SubLevelNav: React.FC<Props> = ({
  levelInfo,
  grades,
  selectedGradeId,
  onSelectGrade,
  subjects,
  selectedSubjectId,
  onSelectSubject,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-[#0e1422] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">
        {/* Level Overview Philosophy Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-xs shadow-sm dark:shadow-none">
          <div className="flex items-start md:items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-mono font-semibold text-[11px] whitespace-nowrap">
              Triết lý {levelInfo.shortName}
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-snug">
              {levelInfo.philosophy}
            </p>
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">
            Nguồn: <strong className="text-slate-700 dark:text-slate-300">{levelInfo.bookSeries}</strong>
          </span>
        </div>

        {/* Grade Pills & Subject Chips */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase mr-1">Khối:</span>
            {grades.map((grade) => {
              const isSelected = selectedGradeId === grade.id;
              return (
                <button
                  key={grade.id}
                  onClick={() => onSelectGrade(grade.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    isSelected
                      ? 'bg-sky-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {grade.name}
                </button>
              );
            })}
          </div>

          {subjects.length > 0 && (
            <>
              <div className="hidden sm:block h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

              {/* Subject Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase mr-1">Môn:</span>
                {subjects.map((sub) => {
                  const isSelected = selectedSubjectId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSubject(sub.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-800 dark:text-sky-300 shadow-sm'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {renderSubjectIcon(sub.icon)}
                      <span>{sub.name}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

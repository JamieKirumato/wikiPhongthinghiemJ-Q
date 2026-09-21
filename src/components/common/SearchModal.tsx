import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, FlaskConical } from 'lucide-react';
import { LESSONS, SIMULATIONS } from '../../data/curriculumData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectSimulation: (simId: string) => void;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectSimulation,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const matchedLessons = LESSONS.filter(
    (l) =>
      l.title.toLowerCase().includes(normalizedQuery) ||
      l.firstPrinciples.coreQuestion.toLowerCase().includes(normalizedQuery) ||
      l.summary.some((s) => s.toLowerCase().includes(normalizedQuery))
  );

  const matchedSims = SIMULATIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(normalizedQuery) ||
      s.description.toLowerCase().includes(normalizedQuery) ||
      s.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-fadeIn">
        {/* Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <Search className="w-5 h-5 text-slate-400 ml-1" />
          <input
            autoFocus
            type="text"
            placeholder="Tìm bài học, công thức, mô phỏng (ví dụ: ohm, phân số, con lắc, màu sắc...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Lessons */}
          <div>
            <span className="text-[11px] font-mono text-slate-500 uppercase px-2 mb-1.5 block">
              Bài học trong chương trình ({matchedLessons.length})
            </span>
            {matchedLessons.length === 0 ? (
              <p className="px-2 text-slate-500 italic">Không tìm thấy bài học phù hợp</p>
            ) : (
              <div className="space-y-1">
                {matchedLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 flex items-start gap-2.5 transition text-slate-300"
                  >
                    <BookOpen className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-200">{lesson.title}</div>
                      <div className="text-slate-400 text-[11px] line-clamp-1">
                        {lesson.firstPrinciples.coreQuestion}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Simulations */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase px-2 mb-1.5 block">
              Mô phỏng tương tác ({matchedSims.length})
            </span>
            {matchedSims.length === 0 ? (
              <p className="px-2 text-slate-500 italic">Không tìm thấy mô phỏng phù hợp</p>
            ) : (
              <div className="space-y-1">
                {matchedSims.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => {
                      onSelectSimulation(sim.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 flex items-start gap-2.5 transition text-slate-300"
                  >
                    <FlaskConical className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-emerald-300">{sim.title}</div>
                      <div className="text-slate-400 text-[11px]">{sim.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/60 text-[11px] text-slate-500 flex justify-between font-mono">
          <span>Nhấn ESC để đóng</span>
          <span>Tìm kiếm tức thì</span>
        </div>
      </div>
    </div>
  );
};

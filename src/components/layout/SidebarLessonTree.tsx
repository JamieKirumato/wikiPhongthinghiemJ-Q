import React from 'react';
import { Chapter, Lesson } from '../../types/curriculum';
import { Folder, FileText, Sparkles, BookCheck } from 'lucide-react';

interface Props {
  chapters: Chapter[];
  lessons: Lesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  subjectName: string;
}

export const SidebarLessonTree: React.FC<Props> = ({
  chapters,
  lessons,
  selectedLessonId,
  onSelectLesson,
  subjectName,
}) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-[#0c101a] border-r border-slate-800 p-4 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <BookCheck className="w-4 h-4 text-sky-400" />
          <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-300 font-mono">
            {subjectName || 'Mục lục bài học'}
          </h3>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
          Kết nối tri thức
        </span>
      </div>

      {/* Chapters list */}
      <div className="space-y-4 text-xs">
        {chapters.length === 0 ? (
          <p className="text-slate-500 italic py-4">Đang cập nhật nội dung chương trình...</p>
        ) : (
          chapters.map((chap) => {
            const chapLessons = lessons.filter((l) => l.chapterId === chap.id);

            return (
              <div key={chap.id} className="space-y-1">
                {/* Chapter Title */}
                <div className="flex items-start gap-1.5 py-1 text-slate-400 font-semibold leading-snug">
                  <Folder className="w-3.5 h-3.5 text-sky-500/80 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] font-mono text-slate-300">{chap.title}</span>
                </div>

                {/* Lessons in Chapter */}
                <div className="pl-4 space-y-0.5 border-l border-slate-800/80 ml-1.5">
                  {chapLessons.map((lesson) => {
                    const isSelected = selectedLessonId === lesson.id;
                    const hasSim = !!lesson.simulationId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full text-left flex items-start gap-2 p-1.5 rounded transition ${
                          isSelected
                            ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
                        <span className="flex-1 line-clamp-2 leading-tight">
                          {lesson.title}
                        </span>
                        {hasSim && (
                          <span
                            title="Có mô phỏng tương tác"
                            className="p-0.5 text-emerald-400 bg-emerald-500/10 rounded flex-shrink-0"
                          >
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

import React, { useState, useMemo } from 'react';
import { SGK_DATA, SgkBook, SgkGrade } from '../../data/sgkData';
import { SgkBookLessonModal } from './SgkBookLessonModal';
import { BookOpen, Search, ListFilter, ArrowRight } from 'lucide-react';

interface Props {
  gradeId: string;
}

export const SgkBookBrowser: React.FC<Props> = ({ gradeId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingBook, setInspectingBook] = useState<SgkBook | null>(null);

  // Map system gradeId to SGK gradeId
  const normalizedGradeId = useMemo(() => {
    if (gradeId.startsWith('mn-') || gradeId === 'mam-non') return 'mam-non';
    if (gradeId === 'th-lop-1' || gradeId === 'lop-1') return 'lop-1';
    if (gradeId === 'th-lop-2' || gradeId === 'lop-2') return 'lop-2';
    if (gradeId === 'th-lop-3' || gradeId === 'lop-3') return 'lop-3';
    if (gradeId === 'th-lop-4' || gradeId === 'lop-4') return 'lop-4';
    if (gradeId === 'th-lop-5' || gradeId === 'lop-5') return 'lop-5';
    return gradeId;
  }, [gradeId]);

  // Find SGK data for current grade
  const currentGradeData: SgkGrade | undefined = useMemo(() => {
    return SGK_DATA.find((g) => g.gradeId === normalizedGradeId);
  }, [normalizedGradeId]);

  // Extract all unique subjects for this grade
  const availableSubjects = useMemo(() => {
    if (!currentGradeData) return [];
    const subjects = new Set<string>();
    currentGradeData.books.forEach((b) => {
      if (b.subject) subjects.add(b.subject);
    });
    return Array.from(subjects).sort();
  }, [currentGradeData]);

  // Reset subject filter when grade changes
  React.useEffect(() => {
    setSelectedSubject('all');
    setSearchQuery('');
  }, [gradeId]);

  // Filter books by subject and search query
  const filteredBooks = useMemo(() => {
    if (!currentGradeData) return [];
    return currentGradeData.books.filter((b) => {
      const matchSubject = selectedSubject === 'all' || b.subject === selectedSubject;
      const matchQuery =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchQuery;
    });
  }, [currentGradeData, selectedSubject, searchQuery]);

  if (!currentGradeData || currentGradeData.books.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 transition-colors">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
              Kho Sách Giáo Khoa {currentGradeData.name} (Hành Trang Số)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono font-bold">
              {currentGradeData.totalBooks} cuốn
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Bấm vào bất kỳ cuốn sách nào để xem toàn bộ danh mục bài học từ bài 1 đến bài cuối cùng theo bộ sách.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Lọc tên sách, bộ sách..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Small Subject Tabs (Các tab nhỏ hiển thị môn học) */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
          <ListFilter className="w-3.5 h-3.5" />
          <span>Danh sách môn học theo SGK:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              selectedSubject === 'all'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tất cả môn ({currentGradeData.books.length})
          </button>

          {availableSubjects.map((sub) => {
            const count = currentGradeData.books.filter((b) => b.subject === sub).length;
            const isSelected = selectedSubject === sub;

            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 text-sky-800 dark:text-sky-300 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{sub}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
        {filteredBooks.map((book) => (
          <div
            key={book.bookId}
            onClick={() => setInspectingBook(book)}
            className="group cursor-pointer p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f17]/70 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md transition flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.name}
                  className="w-14 h-20 object-cover rounded-md border border-slate-200 dark:border-slate-800 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-14 h-20 rounded-md bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 flex-shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1 min-w-0 flex-1">
                <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300">
                  {book.subject}
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {book.name}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">
                  {book.series}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 dark:text-slate-400">
                {book.totalLessons} bài học
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Xem mục lục <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal displaying full table of lessons */}
      <SgkBookLessonModal
        book={inspectingBook}
        onClose={() => setInspectingBook(null)}
      />
    </div>
  );
};

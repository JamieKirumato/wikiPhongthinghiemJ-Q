import React, { useState, useMemo } from 'react';
import { SgkBook } from '../../data/sgkData';
import { X, Search, BookOpen, ExternalLink } from 'lucide-react';

interface Props {
  book: SgkBook | null;
  onClose: () => void;
}

export const SgkBookLessonModal: React.FC<Props> = ({ book, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLessons = useMemo(() => {
    if (!book) return [];
    if (!searchQuery.trim()) return book.lessons;
    const q = searchQuery.toLowerCase();
    return book.lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.chapter.toLowerCase().includes(q) ||
        (l.activities && l.activities.some((a) => a.toLowerCase().includes(q)))
    );
  }, [book, searchQuery]);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-start gap-4">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.name}
                className="w-16 h-22 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-14 h-18 rounded-lg bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-sky-600 flex-shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {book.subject}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {book.series}
                </span>
                {book.totalPages && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {book.totalPages} trang SGK
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {book.name}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Mục lục phân phối nội dung chính thức theo bộ sách: <strong>{book.totalLessons} bài học</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start flex-shrink-0">
            <a
              href={`https://hanhtrangso.nxbgd.vn/sach-dien-tu/sach-${book.bookId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold shadow-sm transition"
              title="Mở toàn bộ sách điện tử trên nền tảng Hành Trang Số"
            >
              <span>Mở sách gốc</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search within book lessons */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học, chủ đề, số trang trong cuốn sách này..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
            {filteredLessons.length} / {book.totalLessons} bài
          </span>
        </div>

        {/* Table of Lessons */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredLessons.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs italic">
              Không tìm thấy bài học nào phù hợp với từ khóa "{searchQuery}".
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-900 text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14">STT</th>
                    <th className="py-2.5 px-3 w-28">Mã bài</th>
                    <th className="py-2.5 px-4">Tên bài học</th>
                    <th className="py-2.5 px-3 text-center w-24">Trang</th>
                    <th className="py-2.5 px-3 text-center w-32">Mở bài</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredLessons.map((lesson) => {
                    const readUrl = `https://hanhtrangso.nxbgd.vn/ebook/read/sach-${book.bookId}?page=${lesson.page || 1}`;
                    return (
                      <tr
                        key={lesson.stt}
                        className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                      >
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-500">
                          {lesson.stt}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-sky-700 dark:text-sky-400">
                          {lesson.code}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {lesson.title}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500 text-xs">
                          {lesson.page ? `Tr. ${lesson.page}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <a
                            href={readUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-mono text-xs font-semibold transition"
                            title={`Mở trang ${lesson.page || 1} của sách trên Hành Trang Số`}
                          >
                            <span>Mở bài</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Nguồn: Hành Trang Số (NXB Giáo Dục Việt Nam)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 transition shadow-sm"
          >
            Đóng bảng mục lục
          </button>
        </div>
      </div>
    </div>
  );
};

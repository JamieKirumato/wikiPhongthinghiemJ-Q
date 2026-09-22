import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  FlaskConical,
  ExternalLink,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Play,
  ArrowRight
} from 'lucide-react';
import { SGK_DATA, SgkBook } from '../../data/sgkData';
import { SIMULATION_CATALOG } from '../../data/simulationCatalogData';
import { LESSONS } from '../../data/curriculumData';
import { SgkBookLessonModal } from '../curriculum/SgkBookLessonModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectSimulation: (simId: string) => void;
  onNavigateToGrade?: (gradeId: string) => void;
}

export interface SearchableSgkLesson {
  id: string;
  stt: number;
  title: string;
  code: string;
  chapter: string;
  page?: number | null;
  bookId: number;
  bookName: string;
  subject: string;
  series: string;
  gradeId: string;
  gradeName: string;
  imageUrl?: string;
  book: SgkBook;
  readUrl: string;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectSimulation,
  onNavigateToGrade,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'sgk' | 'sims'>('all');
  const [inspectingBook, setInspectingBook] = useState<SgkBook | null>(null);

  // Flatten all SGK lessons once
  const allSgkLessons: SearchableSgkLesson[] = useMemo(() => {
    const list: SearchableSgkLesson[] = [];
    for (const grade of SGK_DATA) {
      for (const book of grade.books) {
        for (const lesson of book.lessons) {
          list.push({
            id: `${book.bookId}-${lesson.stt}-${lesson.code}`,
            stt: lesson.stt,
            title: lesson.title,
            code: lesson.code,
            chapter: lesson.chapter,
            page: lesson.page,
            bookId: book.bookId,
            bookName: book.name,
            subject: book.subject,
            series: book.series,
            gradeId: grade.gradeId,
            gradeName: grade.name,
            imageUrl: book.imageUrl,
            book,
            readUrl: `https://hanhtrangso.nxbgd.vn/ebook/read/sach-${book.bookId}?page=${lesson.page || 1}`,
          });
        }
      }
    }
    return list;
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        if (inspectingBook) {
          setInspectingBook(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, inspectingBook]);

  // Reset query and selected tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveTab('all');
      setInspectingBook(null);
    }
  }, [isOpen]);

  // Query filtering logic
  const normalizedTokens = useMemo(() => {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }, [query]);

  // Filter SGK lessons
  const matchedSgkLessons = useMemo(() => {
    if (normalizedTokens.length === 0) return [];
    return allSgkLessons.filter((item) => {
      const targetStr = `${item.title} ${item.code} ${item.chapter} ${item.bookName} ${item.subject} ${item.gradeName}`.toLowerCase();
      return normalizedTokens.every((token) => targetStr.includes(token));
    });
  }, [allSgkLessons, normalizedTokens]);

  // Filter Simulation Catalog
  const matchedSims = useMemo(() => {
    if (normalizedTokens.length === 0) return [];
    return SIMULATION_CATALOG.filter((sim) => {
      const targetStr = `${sim.title} ${sim.purpose} ${sim.extractedFrom.subject} ${sim.extractedFrom.grade} ${sim.extractedFrom.lesson} ${sim.extractedFrom.textbook} ${sim.interactionPatternName} ${sim.firstPrinciplesNote || ''}`.toLowerCase();
      return normalizedTokens.every((token) => targetStr.includes(token));
    });
  }, [normalizedTokens]);

  // Filter Core First Principles Lessons
  const matchedCoreLessons = useMemo(() => {
    if (normalizedTokens.length === 0) return [];
    return LESSONS.filter((lesson) => {
      const targetStr = `${lesson.title} ${lesson.firstPrinciples.coreQuestion} ${lesson.summary.join(' ')}`.toLowerCase();
      return normalizedTokens.every((token) => targetStr.includes(token));
    });
  }, [normalizedTokens]);

  if (!isOpen) return null;

  const quickFilterKeywords = [
    'Toán 1',
    'Tiếng Việt 1',
    'Khoa học 4',
    'Mầm non',
    'Con lắc đơn',
    'Định luật Ohm',
    'Phân số',
    'Màu sắc',
    'Mạch điện',
    'Tin học'
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
          
          {/* 1. Search Input Bar */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/80 dark:bg-[#131b2e]">
            <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 ml-1 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Tìm bài học, sách, công thức, mô phỏng (ví dụ: cộng phạm vi 10, con lắc, ohm, phân số, màu sắc...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition"
                title="Xóa nội dung tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Đóng (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Filter Tabs (Khi có kết quả tìm kiếm) */}
          {query.trim() && (
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-xs font-mono">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  activeTab === 'all'
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Tất cả ({matchedSgkLessons.length + matchedSims.length + matchedCoreLessons.length})
              </button>
              <button
                onClick={() => setActiveTab('sgk')}
                className={`px-3 py-1 rounded-lg transition font-medium flex items-center gap-1.5 ${
                  activeTab === 'sgk'
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Bài học SGK ({matchedSgkLessons.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('sims')}
                className={`px-3 py-1 rounded-lg transition font-medium flex items-center gap-1.5 ${
                  activeTab === 'sims'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <FlaskConical className="w-3 h-3" />
                <span>Mô phỏng thí nghiệm ({matchedSims.length})</span>
              </button>
            </div>
          )}

          {/* 3. Search Results & Empty State */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
            {/* When Query is Empty: Show Guide & Quick Tags */}
            {!query.trim() && (
              <div className="space-y-5 py-4">
                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>Tìm kiếm toàn diện trong toàn bộ hệ thống</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hệ thống đã chỉ mục <strong>139 đầu sách giáo khoa</strong> của NXB Giáo dục Việt Nam (từ Mầm non đến Lớp 5) cùng <strong>70 mô phỏng thí nghiệm tương tác</strong> (từ Mầm non đến Lớp 12).
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                    <span>• {allSgkLessons.length.toLocaleString('vi-VN')} bài học SGK</span>
                    <span>• 70 mô phỏng thực nghiệm</span>
                    <span>• Đầy đủ link đọc trực tiếp trên Hành Trang Số</span>
                  </div>
                </div>

                {/* Quick Keyword Chips */}
                <div className="space-y-2">
                  <span className="font-mono text-slate-400 dark:text-slate-500 uppercase text-[11px] font-semibold block">
                    Gợi ý từ khóa tìm kiếm nhanh:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickFilterKeywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => setQuery(kw)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-700 transition font-mono"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* When Query is Provided But No Results */}
            {query.trim() &&
              matchedSgkLessons.length === 0 &&
              matchedSims.length === 0 &&
              matchedCoreLessons.length === 0 && (
                <div className="text-center py-12 space-y-2 text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">
                    Không tìm thấy bài học hoặc mô phỏng nào với từ khóa "{query}"
                  </p>
                  <p className="text-xs">
                    Hãy thử tìm kiếm theo tên môn học (Toán, Tiếng Việt, KHTN), tên khối lớp (Lớp 1, Lớp 5), hoặc chủ đề thí nghiệm.
                  </p>
                </div>
              )}

            {/* SECTION A: Bài học Sách Giáo Khoa (Hành Trang Số) */}
            {(activeTab === 'all' || activeTab === 'sgk') && matchedSgkLessons.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex items-center gap-2 font-mono font-bold text-sky-700 dark:text-sky-300 uppercase text-[11px]">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Bài học Sách Giáo Khoa ({matchedSgkLessons.length})</span>
                  </div>
                  {matchedSgkLessons.length > 35 && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Hiển thị 35 kết quả đầu tiên
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {matchedSgkLessons.slice(0, 35).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-850 hover:border-sky-400 dark:hover:border-sky-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                            {item.gradeName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.subject}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800/60 text-slate-500">
                            {item.code}
                          </span>
                          {item.page && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              Trang {item.page}
                            </span>
                          )}
                        </div>

                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {item.title}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.bookName}</span>
                          <span>•</span>
                          <span className="line-clamp-1">{item.chapter}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        {/* 1. Mở bài học trực tiếp trên Hành Trang Số */}
                        <a
                          href={item.readUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-[11px] font-medium shadow-sm transition"
                          title={`Mở bài học này (Trang ${item.page || 1}) trên Hành Trang Số`}
                        >
                          <span>Mở bài học</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {/* 2. Xem mục lục sách trong Modal */}
                        <button
                          onClick={() => setInspectingBook(item.book)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition"
                          title="Xem toàn bộ mục lục của cuốn sách này"
                        >
                          <BookOpen className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">Mục lục</span>
                        </button>

                        {/* 3. Chuyển tới khối lớp nếu có callback */}
                        {onNavigateToGrade && (
                          <button
                            onClick={() => {
                              onNavigateToGrade(item.gradeId);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                            title="Chuyển đến trang SGK của khối này"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION B: Mô Phỏng Thí Nghiệm (70 Thí Nghiệm Chuẩn) */}
            {(activeTab === 'all' || activeTab === 'sims') && matchedSims.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <div className="flex items-center gap-2 font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px]">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Mô Phỏng Thí Nghiệm ({matchedSims.length})</span>
                  </div>
                  {matchedSims.length > 20 && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Hiển thị 20 kết quả đầu tiên
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {matchedSims.slice(0, 20).map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => {
                        onSelectSimulation(sim.liveSimId || sim.id);
                        onClose();
                      }}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-850 hover:border-emerald-500 dark:hover:border-emerald-500 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            #{sim.stt} • {sim.extractedFrom.grade}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {sim.extractedFrom.subject}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40">
                            {sim.interactionPatternName}
                          </span>
                        </div>

                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {sim.title}
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                          {sim.purpose}
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono">
                          Nguồn: {sim.extractedFrom.lesson} • {sim.extractedFrom.textbook}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono text-[11px] font-semibold group-hover:bg-emerald-600 group-hover:text-white transition">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Khám phá Lab</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION C: Bài học Cốt Lõi Trọng Tâm */}
            {(activeTab === 'all' || activeTab === 'sgk') && matchedCoreLessons.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 font-mono font-bold text-purple-700 dark:text-purple-400 uppercase text-[11px] border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Bài học cốt lõi trọng tâm ({matchedCoreLessons.length})</span>
                </div>

                <div className="space-y-2">
                  {matchedCoreLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        onSelectLesson(lesson.id);
                        onClose();
                      }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-850 hover:border-purple-400 transition flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {lesson.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {lesson.firstPrinciples.coreQuestion}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Modal Footer */}
          <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <span>Nhấn <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">ESC</kbd> để đóng</span>
              <span>•</span>
              <span className="hidden sm:inline">Tìm kiếm tức thì theo thời gian thực</span>
            </div>
            <div className="text-right">
              {query.trim() && (
                <span>
                  Tổng: {matchedSgkLessons.length + matchedSims.length + matchedCoreLessons.length} kết quả
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SgkBookLessonModal opened directly from Search */}
      {inspectingBook && (
        <div className="fixed inset-0 z-[60]">
          <SgkBookLessonModal
            book={inspectingBook}
            onClose={() => setInspectingBook(null)}
          />
        </div>
      )}
    </>
  );
};

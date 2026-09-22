import React, { useState, useMemo } from 'react';
import { SIMULATION_CATALOG } from '../../data/simulationCatalogData';
import { LevelId, SimulationCatalogItem } from '../../types/curriculum';
import {
  Search,
  Play,
  FileCode,
  Filter,
  CheckCircle2,
  X,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Props {
  onRunLiveSimulation: (simId: string) => void;
}

export const SimulationCatalogTable: React.FC<Props> = ({ onRunLiveSimulation }) => {
  const [levelFilter, setLevelFilter] = useState<LevelId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<SimulationCatalogItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Filter items
  const filteredCatalog = useMemo(() => {
    return SIMULATION_CATALOG.filter((item) => {
      const matchesLevel = levelFilter === 'all' || item.levelId === levelFilter;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesLevel;

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.purpose.toLowerCase().includes(query) ||
        item.extractedFrom.subject.toLowerCase().includes(query) ||
        item.extractedFrom.lesson.toLowerCase().includes(query) ||
        item.extractedFrom.grade.toLowerCase().includes(query) ||
        item.interactionPatternName.toLowerCase().includes(query) ||
        String(item.stt).includes(query);

      return matchesLevel && matchesSearch;
    });
  }, [levelFilter, searchQuery]);

  // Reset to page 1 whenever filters change
  const handleLevelChange = (lvl: LevelId | 'all') => {
    setLevelFilter(lvl);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  // Pagination slice
  const totalPages = Math.ceil(filteredCatalog.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCatalog.slice(start, start + pageSize);
  }, [filteredCatalog, currentPage, pageSize]);

  const getLevelBadge = (levelId: LevelId) => {
    switch (levelId) {
      case 'mam-non':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
            Mầm non
          </span>
        );
      case 'tieu-hoc':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
            Tiểu học
          </span>
        );
      case 'thcs':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30">
            THCS
          </span>
        );
      case 'thpt':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
            THPT
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl transition-colors">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
            Danh Mục Thí Nghiệm Theo Cấp Học (Mầm non - THPT)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Toàn bộ 170 thí nghiệm được trích xuất trực tiếp từ chương trình GDPT 2018 (SGK Kết nối tri thức với cuộc sống), phân loại theo cấp học, mục đích và quy trình tiến hành chuẩn mực.
          </p>
        </div>

        {/* Search input in table */}
        <div className="relative w-full lg:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Lọc tên thí nghiệm, bài học, STT..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Cấp:</span>
          </span>

          <button
            onClick={() => handleLevelChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              levelFilter === 'all'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả ({SIMULATION_CATALOG.length})
          </button>

          <button
            onClick={() => handleLevelChange('mam-non')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              levelFilter === 'mam-non'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            [1] Mầm non ({SIMULATION_CATALOG.filter((i) => i.levelId === 'mam-non').length})
          </button>

          <button
            onClick={() => handleLevelChange('tieu-hoc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              levelFilter === 'tieu-hoc'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            [2] Tiểu học ({SIMULATION_CATALOG.filter((i) => i.levelId === 'tieu-hoc').length})
          </button>

          <button
            onClick={() => handleLevelChange('thcs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              levelFilter === 'thcs'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            [3] THCS ({SIMULATION_CATALOG.filter((i) => i.levelId === 'thcs').length})
          </button>

          <button
            onClick={() => handleLevelChange('thpt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
              levelFilter === 'thpt'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            [4] THPT ({SIMULATION_CATALOG.filter((i) => i.levelId === 'thpt').length})
          </button>
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <span>Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
          >
            <option value={15}>15 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={30}>30 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-[#0e1422] text-[11px] uppercase font-mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-3 font-semibold text-center w-14">STT</th>
              <th className="py-3.5 px-4 font-semibold min-w-[200px] w-64">Tên thí nghiệm</th>
              <th className="py-3.5 px-4 font-semibold min-w-[240px]">Mục đích</th>
              <th className="py-3.5 px-4 font-semibold min-w-[280px]">Cách tiến hành</th>
              <th className="py-3.5 px-4 font-semibold min-w-[220px] w-64">Trích xuất từ</th>
              <th className="py-3.5 px-3 font-semibold text-center w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                  Không tìm thấy thí nghiệm nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group align-top"
                >
                  {/* Cột 1: STT */}
                  <td className="py-4 px-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 inline-flex items-center justify-center text-slate-700 dark:text-slate-300">
                      {item.stt}
                    </span>
                  </td>

                  {/* Cột 2: Tên thí nghiệm */}
                  <td className="py-4 px-4 space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getLevelBadge(item.levelId)}
                      {item.hasLiveSim && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Live Lab
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Dạng: <strong className="text-slate-700 dark:text-slate-300">{item.interactionPatternName.split('(')[0]}</strong>
                    </div>
                  </td>

                  {/* Cột 3: Mục đích */}
                  <td className="py-4 px-4 leading-relaxed text-slate-600 dark:text-slate-300">
                    <p className="line-clamp-4">{item.purpose}</p>
                    {item.firstPrinciplesNote && (
                      <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300/90 italic flex items-start gap-1">
                        <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
                        <span>{item.firstPrinciplesNote}</span>
                      </div>
                    )}
                  </td>

                  {/* Cột 4: Cách tiến hành */}
                  <td className="py-4 px-4">
                    <ol className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                      {item.procedure.slice(0, 3).map((step, sIdx) => (
                        <li key={sIdx} className="line-clamp-2 leading-relaxed">
                          • {step}
                        </li>
                      ))}
                      {item.procedure.length > 3 && (
                        <li className="text-[10px] text-sky-600 dark:text-sky-400 font-mono pt-0.5">
                          + {item.procedure.length - 3} bước khác (bấm Kịch bản)
                        </li>
                      )}
                    </ol>
                  </td>

                  {/* Cột 5: Trích xuất từ */}
                  <td className="py-4 px-4 space-y-1 font-mono text-[11px]">
                    <div className="text-sky-700 dark:text-sky-300 font-medium">
                      {item.extractedFrom.subject} ({item.extractedFrom.grade})
                    </div>
                    <div className="text-slate-800 dark:text-slate-300 text-xs font-sans font-medium leading-tight">
                      {item.extractedFrom.lesson}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Nguồn: {item.extractedFrom.textbook}
                    </div>
                  </td>

                  {/* Cột 6: Thao tác */}
                  <td className="py-4 px-3 text-center space-y-1.5">
                    {item.hasLiveSim && item.liveSimId ? (
                      <button
                        onClick={() => onRunLiveSimulation(item.liveSimId!)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold font-mono transition shadow-sm"
                        title="Khởi động phòng lab mô phỏng ngay"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Chạy Lab</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => setSelectedItemForModal(item)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-mono transition"
                    >
                      <FileCode className="w-3 h-3 text-slate-500" />
                      <span>Kịch bản</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3 pt-2">
        <div>
          Hiển thị <strong>{filteredCatalog.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filteredCatalog.length)}</strong> trên tổng số <strong>{filteredCatalog.length}</strong> thí nghiệm
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Trang tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Blueprint Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0d131f] border border-slate-300 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-800 dark:text-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs flex items-center justify-center font-bold text-sky-600 dark:text-sky-400">
                    #{selectedItemForModal.stt}
                  </span>
                  {getLevelBadge(selectedItemForModal.levelId)}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {selectedItemForModal.extractedFrom.subject} • {selectedItemForModal.extractedFrom.grade}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedItemForModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItemForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <div className="text-xs uppercase font-mono font-semibold text-slate-500 dark:text-slate-400">
                1. Mục đích thí nghiệm:
              </div>
              <p className="text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {selectedItemForModal.purpose}
              </p>
            </div>

            {/* Detailed Procedure */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-mono font-semibold text-slate-500 dark:text-slate-400">
                2. Quy trình các bước thực hiện (Procedure):
              </div>
              <div className="space-y-2">
                {selectedItemForModal.procedure.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Variables & Interaction Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-mono text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold">
                  Dạng tương tác áp dụng:
                </div>
                <div className="font-medium text-sky-600 dark:text-sky-300">
                  {selectedItemForModal.interactionPatternName}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-mono text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold">
                  Các biến số đo lường chính:
                </div>
                <div className="line-clamp-2 text-slate-700 dark:text-slate-300">
                  {selectedItemForModal.keyVariables?.join(', ') || 'Tham số vật lý thời gian thực'}
                </div>
              </div>
            </div>

            {/* Extracted From Info */}
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-slate-500 dark:text-slate-400">Trích xuất từ chương trình:</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {selectedItemForModal.extractedFrom.lesson}
              </div>
              <div className="text-slate-500 text-[11px]">
                {selectedItemForModal.extractedFrom.subject} • {selectedItemForModal.extractedFrom.grade} • {selectedItemForModal.extractedFrom.textbook}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:text-white text-xs font-mono transition"
              >
                Đóng
              </button>
              {selectedItemForModal.hasLiveSim && selectedItemForModal.liveSimId && (
                <button
                  onClick={() => {
                    const simId = selectedItemForModal.liveSimId!;
                    setSelectedItemForModal(null);
                    onRunLiveSimulation(simId);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Khởi động mô phỏng ngay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

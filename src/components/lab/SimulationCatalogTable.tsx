import React, { useState } from 'react';
import { SIMULATION_CATALOG } from '../../data/simulationCatalogData';
import { LevelId, SimulationCatalogItem } from '../../types/curriculum';
import {
  Table,
  Search,
  Play,
  FileCode,
  Filter,
  CheckCircle2,
  X,
  Lightbulb
} from 'lucide-react';

interface Props {
  onRunLiveSimulation: (simId: string) => void;
}

export const SimulationCatalogTable: React.FC<Props> = ({ onRunLiveSimulation }) => {
  const [levelFilter, setLevelFilter] = useState<LevelId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<SimulationCatalogItem | null>(null);

  // Filter items
  const filteredCatalog = SIMULATION_CATALOG.filter((item) => {
    const matchesLevel = levelFilter === 'all' || item.levelId === levelFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesLevel;

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.purpose.toLowerCase().includes(query) ||
      item.extractedFrom.subject.toLowerCase().includes(query) ||
      item.extractedFrom.lesson.toLowerCase().includes(query) ||
      item.extractedFrom.grade.toLowerCase().includes(query) ||
      item.interactionPatternName.toLowerCase().includes(query);

    return matchesLevel && matchesSearch;
  });

  const getLevelBadge = (levelId: LevelId) => {
    switch (levelId) {
      case 'mam-non':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Mầm non
          </span>
        );
      case 'tieu-hoc':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Tiểu học
          </span>
        );
      case 'thcs':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
            THCS
          </span>
        );
      case 'thpt':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
            THPT
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
            <Table className="w-3.5 h-3.5" />
            <span>K-12 Simulation Master Catalog</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tracking-tight">
            Bảng Danh Mục Thí Nghiệm Theo Cấp Học (Mầm non - THPT)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Toàn bộ danh mục thí nghiệm được trích xuất trực tiếp từ các bài học trong chương trình giáo dục phổ thông (GDPT 2018), phân loại theo cấp học, mục đích và quy trình tiến hành chuẩn mực.
          </p>
        </div>

        {/* Search input in table */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Lọc thí nghiệm, bài học..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs font-mono text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          <span>Cấp học:</span>
        </span>

        <button
          onClick={() => setLevelFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
            levelFilter === 'all'
              ? 'bg-sky-500 text-white font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          Tất cả cấp học ({SIMULATION_CATALOG.length})
        </button>

        <button
          onClick={() => setLevelFilter('mam-non')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
            levelFilter === 'mam-non'
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          [1] Mầm non (3-6 tuổi) ({SIMULATION_CATALOG.filter((i) => i.levelId === 'mam-non').length})
        </button>

        <button
          onClick={() => setLevelFilter('tieu-hoc')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
            levelFilter === 'tieu-hoc'
              ? 'bg-amber-600 text-white font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          [2] Tiểu học (Lớp 1-5) ({SIMULATION_CATALOG.filter((i) => i.levelId === 'tieu-hoc').length})
        </button>

        <button
          onClick={() => setLevelFilter('thcs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
            levelFilter === 'thcs'
              ? 'bg-sky-600 text-white font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          [3] THCS (Lớp 6-9) ({SIMULATION_CATALOG.filter((i) => i.levelId === 'thcs').length})
        </button>

        <button
          onClick={() => setLevelFilter('thpt')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
            levelFilter === 'thpt'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          [4] THPT (Lớp 10-12) ({SIMULATION_CATALOG.filter((i) => i.levelId === 'thpt').length})
        </button>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090d16]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0e1422] text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-3 font-semibold text-center w-14">Số TT</th>
              <th className="py-3.5 px-4 font-semibold min-w-[200px] w-64">Tên thí nghiệm</th>
              <th className="py-3.5 px-4 font-semibold min-w-[240px]">Mục đích</th>
              <th className="py-3.5 px-4 font-semibold min-w-[280px]">Cách tiến hành</th>
              <th className="py-3.5 px-4 font-semibold min-w-[220px] w-64">Trích xuất từ</th>
              <th className="py-3.5 px-3 font-semibold text-center w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredCatalog.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                  Không tìm thấy thí nghiệm nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredCatalog.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-850/50 transition-colors group align-top"
                >
                  {/* Cột 1: STT */}
                  <td className="py-4 px-3 text-center font-mono font-bold text-slate-400">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 inline-flex items-center justify-center text-slate-300">
                      {item.stt}
                    </span>
                  </td>

                  {/* Cột 2: Tên thí nghiệm */}
                  <td className="py-4 px-4 space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getLevelBadge(item.levelId)}
                      {item.hasLiveSim && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Live Lab
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-100 text-sm leading-snug group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Dạng: <strong className="text-slate-300">{item.interactionPatternName}</strong>
                    </div>
                  </td>

                  {/* Cột 3: Mục đích */}
                  <td className="py-4 px-4 leading-relaxed text-slate-300">
                    <p className="line-clamp-4">{item.purpose}</p>
                    {item.firstPrinciplesNote && (
                      <div className="mt-2 text-[11px] text-amber-300/90 italic flex items-start gap-1">
                        <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                        <span>{item.firstPrinciplesNote}</span>
                      </div>
                    )}
                  </td>

                  {/* Cột 4: Cách tiến hành */}
                  <td className="py-4 px-4">
                    <ol className="space-y-1 text-slate-300 text-[11px]">
                      {item.procedure.slice(0, 3).map((step, sIdx) => (
                        <li key={sIdx} className="line-clamp-2 leading-relaxed">
                          • {step}
                        </li>
                      ))}
                      {item.procedure.length > 3 && (
                        <li className="text-[10px] text-sky-400 font-mono pt-0.5">
                          + {item.procedure.length - 3} bước khác (nhấn xem chi tiết)
                        </li>
                      )}
                    </ol>
                  </td>

                  {/* Cột 5: Trích xuất từ */}
                  <td className="py-4 px-4 space-y-1 font-mono text-[11px]">
                    <div className="text-sky-300 font-medium">
                      {item.extractedFrom.subject} ({item.extractedFrom.grade})
                    </div>
                    <div className="text-slate-300 text-xs font-sans font-medium leading-tight">
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
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold font-mono transition shadow-sm"
                        title="Khởi động phòng lab mô phỏng ngay"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Chạy Lab</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => setSelectedItemForModal(item)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-mono transition"
                    >
                      <FileCode className="w-3 h-3 text-slate-400" />
                      <span>Kịch bản</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2 pt-1">
        <div>
          Hiển thị <strong>{filteredCatalog.length}</strong> / <strong>{SIMULATION_CATALOG.length}</strong> thí nghiệm trong danh mục
        </div>
        <div className="flex items-center gap-2">
          <span>Chuẩn hóa GDPT 2018</span>
          <span>•</span>
          <span className="text-sky-400">First-Principles Methodology</span>
        </div>
      </div>

      {/* Detail Blueprint Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0d131f] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 font-mono text-xs flex items-center justify-center font-bold text-sky-400">
                    #{selectedItemForModal.stt}
                  </span>
                  {getLevelBadge(selectedItemForModal.levelId)}
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedItemForModal.extractedFrom.subject} • {selectedItemForModal.extractedFrom.grade}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {selectedItemForModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItemForModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <div className="text-xs uppercase font-mono font-semibold text-slate-400">
                1. Mục đích thí nghiệm:
              </div>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {selectedItemForModal.purpose}
              </p>
            </div>

            {/* Detailed Procedure */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-mono font-semibold text-slate-400">
                2. Quy trình tiến hành các bước (Procedure):
              </div>
              <div className="space-y-2">
                {selectedItemForModal.procedure.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Variables & Interaction Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-mono text-slate-400 uppercase text-[11px] font-semibold">
                  Dạng tương tác áp dụng:
                </div>
                <div className="font-medium text-sky-300">
                  {selectedItemForModal.interactionPatternName}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-mono text-slate-400 uppercase text-[11px] font-semibold">
                  Các biến số đo lường chính:
                </div>
                <div className="text-slate-300 line-clamp-2">
                  {selectedItemForModal.keyVariables?.join(', ') || 'Tham số vật lý thời gian thực'}
                </div>
              </div>
            </div>

            {/* Extracted From Info */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-slate-400">Trích xuất từ chương trình:</div>
              <div className="text-emerald-400 font-semibold">
                {selectedItemForModal.extractedFrom.lesson}
              </div>
              <div className="text-slate-500 text-[11px]">
                {selectedItemForModal.extractedFrom.subject} • {selectedItemForModal.extractedFrom.grade} • {selectedItemForModal.extractedFrom.textbook}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition"
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

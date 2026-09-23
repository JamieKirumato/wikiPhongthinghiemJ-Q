import React, { useState, useMemo } from 'react';
import { SIMULATION_CATALOG } from '../../data/simulationCatalogData';
import { LevelId, SimulationCatalogItem, PreschoolDomain } from '../../types/curriculum';
import {
  Search,
  Play,
  FileCode,
  Filter,
  CheckCircle2,
  X,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Compass,
  Table as TableIcon,
  LayoutGrid,
  Award,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

interface Props {
  onRunLiveSimulation: (simId: string) => void;
}

export const SimulationCatalogTable: React.FC<Props> = ({ onRunLiveSimulation }) => {
  const [levelFilter, setLevelFilter] = useState<LevelId | 'all'>('mam-non'); // Default to mam-non to showcase preschool improvements
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<SimulationCatalogItem | null>(null);
  const [modalTab, setModalTab] = useState<'baseline' | 'exploration'>('baseline');

  // Preschool specific filters & view mode
  const [preschoolViewMode, setPreschoolViewMode] = useState<'table' | 'cards'>('table');
  const [preschoolDomainFilter, setPreschoolDomainFilter] = useState<PreschoolDomain | 'all'>('all');
  const [preschoolAgeFilter, setPreschoolAgeFilter] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Filter items
  const filteredCatalog = useMemo(() => {
    return SIMULATION_CATALOG.filter((item) => {
      const matchesLevel = levelFilter === 'all' || item.levelId === levelFilter;
      const query = searchQuery.toLowerCase().trim();

      // Preschool sub-filters
      let matchesPreschoolDomain = true;
      let matchesPreschoolAge = true;

      if (levelFilter === 'mam-non' || item.levelId === 'mam-non') {
        if (preschoolDomainFilter !== 'all') {
          matchesPreschoolDomain = item.preschoolProfile?.domain === preschoolDomainFilter;
        }
        if (preschoolAgeFilter !== 'all') {
          matchesPreschoolAge = item.preschoolProfile?.ageGroup === preschoolAgeFilter;
        }
      }

      if (!matchesPreschoolDomain || !matchesPreschoolAge) return false;

      if (!query) return matchesLevel;

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.purpose.toLowerCase().includes(query) ||
        item.extractedFrom.subject.toLowerCase().includes(query) ||
        item.extractedFrom.lesson.toLowerCase().includes(query) ||
        item.extractedFrom.grade.toLowerCase().includes(query) ||
        item.interactionPatternName.toLowerCase().includes(query) ||
        item.preschoolProfile?.domainLabel.toLowerCase().includes(query) ||
        item.preschoolProfile?.whatIfChallenge.badgeName.toLowerCase().includes(query) ||
        String(item.stt).includes(query);

      return matchesLevel && matchesSearch;
    });
  }, [levelFilter, searchQuery, preschoolDomainFilter, preschoolAgeFilter]);

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
            Mầm non (3-6t)
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
      {/* 1. Header & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              Danh Mục Thí Nghiệm & Phòng Lab (Mầm non - THPT)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Live Lab 30/30 Mầm non
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Tích hợp song song <strong>Hướng nhìn Cơ bản (Quy trình chuẩn GDMN)</strong> và <strong>Hướng nhìn Khám phá (Tùy biến tham số & Sandbox What-If)</strong> với 100% khả năng Khởi động Lab thời gian thực.
          </p>
        </div>

        {/* Search input in table */}
        <div className="relative w-full lg:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Lọc tên thí nghiệm, bài học, huy hiệu..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
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

      {/* 2. Level Filter Tabs */}
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
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              levelFilter === 'mam-non'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>[1] Mầm non (30/30 Live Lab)</span>
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

        {/* View mode toggle (Table vs Cards) & Page size */}
        <div className="flex items-center gap-3">
          {levelFilter === 'mam-non' && (
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <button
                onClick={() => setPreschoolViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                  preschoolViewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Bảng danh mục chuẩn"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Bảng Chuẩn</span>
              </button>
              <button
                onClick={() => setPreschoolViewMode('cards')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                  preschoolViewMode === 'cards'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Ma trận thẻ Khám phá & Sandbox"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Thẻ Khám Phá</span>
              </button>
            </div>
          )}

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
              <option value={10}>10 / trang</option>
              <option value={15}>15 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={30}>30 / trang</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Preschool Sub-Toolbar: 5 Domains of GDMN & Age Selector */}
      {levelFilter === 'mam-non' && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* 5 Domains GDMN Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lĩnh vực GDMN:</span>
              </span>

              <button
                onClick={() => {
                  setPreschoolDomainFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  preschoolDomainFilter === 'all'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Tất cả (5 Lĩnh vực)
              </button>

              <button
                onClick={() => {
                  setPreschoolDomainFilter('nhan-thuc');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  preschoolDomainFilter === 'nhan-thuc'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Nhận thức & Khoa học
              </button>

              <button
                onClick={() => {
                  setPreschoolDomainFilter('the-chat');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  preschoolDomainFilter === 'the-chat'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Thể chất & Vận động
              </button>

              <button
                onClick={() => {
                  setPreschoolDomainFilter('tham-my');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  preschoolDomainFilter === 'tham-my'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Thẩm mỹ & Màu sắc
              </button>

              <button
                onClick={() => {
                  setPreschoolDomainFilter('tinh-cam-xa-hoi');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  preschoolDomainFilter === 'tinh-cam-xa-hoi'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Kỹ năng sống & Xã hội
              </button>
            </div>

            {/* Age Group Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Độ tuổi:
              </span>
              <select
                value={preschoolAgeFilter}
                onChange={(e) => {
                  setPreschoolAgeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Tất cả (3 - 6 tuổi)</option>
                <option value="3 - 4 tuổi">Mẫu giáo bé (3 - 4 tuổi)</option>
                <option value="4 - 5 tuổi">Mẫu giáo nhỡ (4 - 5 tuổi)</option>
                <option value="5 - 6 tuổi">Mẫu giáo lớn (5 - 6 tuổi)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Content: Table View OR Cards Exploration View */}
      {preschoolViewMode === 'cards' && levelFilter === 'mam-non' ? (
        /* ================= CARDS / EXPLORATION MATRIX VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 italic">
              Không tìm thấy thí nghiệm nào phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            paginatedItems.map((item) => {
              const p = item.preschoolProfile;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c121e] border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
                >
                  <div className="space-y-2.5">
                    {/* Header tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                          #{item.stt}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          {p?.ageGroup || '3 - 6 tuổi'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {p?.whatIfChallenge.badgeName || 'Khám phá'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.purpose}
                    </p>

                    {/* 3 Exploration Pillars Preview */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                      <div className="text-sky-600 dark:text-sky-400 font-semibold font-mono flex items-center gap-1">
                        <Compass className="w-3 h-3" />
                        <span>Tùy biến: {p?.variableTuning.name}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 italic line-clamp-1">
                        • {p?.variableTuning.options[0]?.label} → {p?.variableTuning.options[0]?.outcome}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => onRunLiveSimulation(item.liveSimId || item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Chạy Lab</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItemForModal(item);
                        setModalTab('exploration');
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono transition"
                      title="Xem kịch bản chi tiết"
                    >
                      <FileCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ================= STANDARD TABLE VIEW ================= */
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-[#0e1422] text-[11px] uppercase font-mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-3 font-semibold text-center w-14">STT</th>
                <th className="py-3.5 px-4 font-semibold min-w-[200px] w-64">Tên thí nghiệm</th>
                <th className="py-3.5 px-4 font-semibold min-w-[240px]">Mục đích & Gợi mở</th>
                <th className="py-3.5 px-4 font-semibold min-w-[280px]">Cách tiến hành</th>
                <th className="py-3.5 px-4 font-semibold min-w-[220px] w-64">Lĩnh vực & Bài học</th>
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
                    className="hover:outline hover:outline-1 hover:outline-emerald-500 dark:hover:outline-emerald-500 transition-all group align-top"
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
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Dạng: <strong className="text-slate-700 dark:text-slate-300">{item.interactionPatternName.split('(')[0]}</strong>
                      </div>
                    </td>

                    {/* Cột 3: Mục đích & Gợi mở */}
                    <td className="py-4 px-4 leading-relaxed text-slate-600 dark:text-slate-300 space-y-1.5">
                      <p className="line-clamp-3">{item.purpose}</p>
                      {item.preschoolProfile?.teacherPrompt && (
                        <div className="text-[11px] text-sky-700 dark:text-sky-300/90 italic flex items-start gap-1">
                          <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-sky-500" />
                          <span>Cô hỏi: "{item.preschoolProfile.teacherPrompt}"</span>
                        </div>
                      )}
                      {item.firstPrinciplesNote && !item.preschoolProfile && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-300/90 italic flex items-start gap-1">
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
                          <li className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono pt-0.5">
                            + {item.procedure.length - 3} bước khác (nhấn Kịch bản)
                          </li>
                        )}
                      </ol>
                    </td>

                    {/* Cột 5: Lĩnh vực & Bài học */}
                    <td className="py-4 px-4 space-y-1 font-mono text-[11px]">
                      {item.preschoolProfile ? (
                        <div className="text-emerald-700 dark:text-emerald-300 font-semibold">
                          {item.preschoolProfile.domainLabel.split(':')[0]}
                        </div>
                      ) : (
                        <div className="text-sky-700 dark:text-sky-300 font-medium">
                          {item.extractedFrom.subject} ({item.extractedFrom.grade})
                        </div>
                      )}
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
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition shadow-sm"
                          title="Khởi động phòng lab mô phỏng ngay"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Chạy Lab</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => {
                          setSelectedItemForModal(item);
                          setModalTab('baseline');
                        }}
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
      )}

      {/* 5. Pagination Controls */}
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

      {/* 6. Detail Blueprint Modal (Dual Tabs: Baseline & Exploration) */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0d131f] border border-slate-300 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-800 dark:text-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400">
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

            {/* Modal Tabs: [1. Kịch bản Chuẩn] vs [2. Góc nhìn Khám phá] */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => setModalTab('baseline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  modalTab === 'baseline'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Hướng nhìn Cơ bản (Chuẩn GDMN)</span>
              </button>

              <button
                onClick={() => setModalTab('exploration')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  modalTab === 'exploration'
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>2. Hướng nhìn Khám phá (Sandbox & Tùy biến)</span>
              </button>
            </div>

            {modalTab === 'baseline' ? (
              /* TAB 1: KỊCH BẢN CHUẨN */
              <div className="space-y-4">
                {/* Purpose */}
                <div className="space-y-1.5">
                  <div className="text-xs uppercase font-mono font-semibold text-slate-500 dark:text-slate-400">
                    Mục đích thí nghiệm:
                  </div>
                  <p className="text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    {selectedItemForModal.purpose}
                  </p>
                </div>

                {/* Teacher Prompts & Materials (If preschool) */}
                {selectedItemForModal.preschoolProfile && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 space-y-1">
                      <div className="font-mono text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px]">
                        Lời thoại gợi mở của cô giáo:
                      </div>
                      <p className="italic text-slate-700 dark:text-slate-300">
                        "{selectedItemForModal.preschoolProfile.teacherPrompt}"
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-mono text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                        Chuẩn bị đồ dùng thực tế:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedItemForModal.preschoolProfile.materials.map((m, mIdx) => (
                          <span key={mIdx} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px]">
                            • {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Procedure */}
                <div className="space-y-2">
                  <div className="text-xs uppercase font-mono font-semibold text-slate-500 dark:text-slate-400">
                    Quy trình 4 bước thực hiện chuẩn mực:
                  </div>
                  <div className="space-y-2">
                    {selectedItemForModal.procedure.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: GÓC NHÌN KHÁM PHÁ (SANDBOX) */
              <div className="space-y-4">
                {selectedItemForModal.preschoolProfile ? (
                  <>
                    {/* Trục 1: Tùy biến tham số */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Trục 1: Tùy biến Tham số / Giá trị ({selectedItemForModal.preschoolProfile.variableTuning.name})</span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedItemForModal.preschoolProfile.variableTuning.options.map((opt, oIdx) => (
                          <div key={oIdx} className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{opt.label}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">→ {opt.outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trục 2 & 3: Sắp xếp & Động tác */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="font-mono text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px]">
                          Trục 2: Thay đổi Bố cục / Vị trí:
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedItemForModal.preschoolProfile.spatialLayout.action}
                        </p>
                        <p className="text-slate-500 text-[11px] italic">
                          → {selectedItemForModal.preschoolProfile.spatialLayout.outcome}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="font-mono text-purple-600 dark:text-purple-400 font-bold uppercase text-[10px]">
                          Trục 3: Thay đổi Thao tác / Động tác:
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedItemForModal.preschoolProfile.gestureDynamics.action}
                        </p>
                        <p className="text-slate-500 text-[11px] italic">
                          → {selectedItemForModal.preschoolProfile.gestureDynamics.outcome}
                        </p>
                      </div>
                    </div>

                    {/* Thử thách What-If */}
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-amber-700 dark:text-amber-300 font-bold uppercase flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Thử thách "Điều gì sẽ xảy ra nếu...?"</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold text-[10px] flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>Huy hiệu: {selectedItemForModal.preschoolProfile.whatIfChallenge.badgeName}</span>
                        </span>
                      </div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedItemForModal.preschoolProfile.whatIfChallenge.question}
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                        Kết quả đảm bảo: {selectedItemForModal.preschoolProfile.whatIfChallenge.discoveryOutcome}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs italic">
                    Chế độ Khám phá chuyên sâu được tối ưu sẵn cho khối Mầm non.
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-mono text-slate-500">
                Mã thí nghiệm: #{selectedItemForModal.id}
              </span>

              <div className="flex items-center gap-2">
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
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Khởi động phòng Lab ngay</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

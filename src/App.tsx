import React, { useState, useEffect } from 'react';
import { LevelId } from './types/curriculum';
import { LEVELS, GRADES, SUBJECTS, LESSONS } from './data/curriculumData';
import { AppSidebar } from './components/layout/AppSidebar';
import { Header } from './components/layout/Header';
import { LevelTabs } from './components/layout/LevelTabs';
import { SubLevelNav } from './components/layout/SubLevelNav';
import { SimulationLabGrid } from './components/lab/SimulationLabGrid';
import { SearchModal } from './components/common/SearchModal';
import { AiReaderModal } from './components/common/AiReaderModal';
import { GradePhilosophyCard } from './components/curriculum/GradePhilosophyCard';
import { SgkBookBrowser } from './components/curriculum/SgkBookBrowser';
import { SimulationCatalogTable } from './components/lab/SimulationCatalogTable';

export const App: React.FC = () => {
  // Navigation view state: 'curriculum' vs 'simulations'
  const [activeView, setActiveView] = useState<'curriculum' | 'simulations'>('curriculum');

  // Theme state: Default is 'light' as requested
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('wiki_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Apply theme class to document.documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wiki_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Hierarchy Selection States - Default to Preschool (Mầm non) as requested
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>('mam-non');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('mn-4-5');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('mn-kham-pha');

  // Focus Simulation ID (for when clicking "Mở trong Thư viện mô phỏng")
  const [focusSimId, setFocusSimId] = useState<string | undefined>(undefined);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When Level changes, auto-select first grade & subject of that level
  const handleSelectLevel = (levelId: LevelId) => {
    setSelectedLevelId(levelId);
    const availableGrades = GRADES.filter((g) => g.levelId === levelId);
    if (availableGrades.length > 0) {
      const firstGrade = availableGrades[0];
      setSelectedGradeId(firstGrade.id);

      const availableSubjects = SUBJECTS.filter((s) => s.gradeId === firstGrade.id);
      if (availableSubjects.length > 0) {
        setSelectedSubjectId(availableSubjects[0].id);
      }
    }
  };

  // When Grade changes, auto-select first subject
  const handleSelectGrade = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    const availableSubjects = SUBJECTS.filter((s) => s.gradeId === gradeId);
    if (availableSubjects.length > 0) {
      setSelectedSubjectId(availableSubjects[0].id);
    }
  };

  // When Subject changes
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  // Direct selection from Search modal
  const handleSelectLessonFromSearch = (lessonId: string) => {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return;
    const subject = SUBJECTS.find((s) => s.id === lesson.simulationId || s.gradeId === selectedGradeId);
    if (subject) {
      const grade = GRADES.find((g) => g.id === subject.gradeId);
      if (grade) {
        setSelectedLevelId(grade.levelId);
        setSelectedGradeId(grade.id);
        setSelectedSubjectId(subject.id);
      }
    }
    setActiveView('curriculum');
  };

  const handleSelectSimulationFromSearch = (simId: string) => {
    setFocusSimId(simId);
    setActiveView('simulations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to grade SGK view from search
  const handleNavigateToGradeFromSearch = (gradeId: string) => {
    if (gradeId === 'mam-non') {
      setSelectedLevelId('mam-non');
      setSelectedGradeId('mn-4-5');
    } else if (gradeId === 'lop-1') {
      setSelectedLevelId('tieu-hoc');
      setSelectedGradeId('th-lop-1');
    } else if (gradeId === 'lop-2') {
      setSelectedLevelId('tieu-hoc');
      setSelectedGradeId('th-lop-2');
    } else if (gradeId === 'lop-3') {
      setSelectedLevelId('tieu-hoc');
      setSelectedGradeId('th-lop-3');
    } else if (gradeId === 'lop-4') {
      setSelectedLevelId('tieu-hoc');
      setSelectedGradeId('th-lop-4');
    } else if (gradeId === 'lop-5') {
      setSelectedLevelId('tieu-hoc');
      setSelectedGradeId('th-lop-5');
    }
    setActiveView('curriculum');
    setTimeout(() => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  };

  // Filtered lists for current state
  const currentLevelInfo = LEVELS.find((l) => l.id === selectedLevelId)!;
  const currentGrades = GRADES.filter((g) => g.levelId === selectedLevelId);
  const currentSubjects = SUBJECTS.filter((s) => s.gradeId === selectedGradeId);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-200 antialiased transition-colors duration-150 relative">
      {/* 1. Vertical Navigation Sidebar (Left side of screen) */}
      <AppSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Right Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Header
          activeView={activeView}
          onSelectView={setActiveView}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Content View Switcher */}
        {activeView === 'curriculum' ? (
          /* TAB 1: Tổng quan chương trình (Thanh công cụ nội dung vẫn giữ nguyên) */
          <div className="flex-1 flex flex-col">
            {/* Level Tabs: [Mầm non] [Tiểu học] [THCS] [THPT] */}
            <LevelTabs
              selectedLevel={selectedLevelId}
              onSelectLevel={handleSelectLevel}
            />

            {/* SubLevel Bar: Grade pills + Subject chips + Philosophy */}
            <SubLevelNav
              levelInfo={currentLevelInfo}
              grades={currentGrades}
              selectedGradeId={selectedGradeId}
              onSelectGrade={handleSelectGrade}
              subjects={currentSubjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={handleSelectSubject}
            />

            {/* Main Curriculum Content Area */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
              {/* 1. Khung Triết lý giáo dục 4 trụ cột của khối đang chọn */}
              <GradePhilosophyCard gradeId={selectedGradeId} />

              {/* Nếu đang chọn cấp Mầm non, hiển thị ngay bảng 30 thí nghiệm tương tác */}
              {selectedLevelId === 'mam-non' && (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-mono flex items-center gap-2">
                        <span>🌟 Kho 30 Hoạt Động Thí Nghiệm & Khám Phá Mầm Non</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Tổ chức chuẩn hóa theo 5 Lĩnh vực GDMN với 2 hướng tiếp cận: <strong>Cơ bản</strong> (kịch bản chuẩn) &amp; <strong>Khám phá</strong> (Sandbox What-If) cùng 100% Chạy Lab.
                      </p>
                    </div>
                  </div>
                  <SimulationCatalogTable
                    onRunLiveSimulation={(simId) => {
                      setFocusSimId(simId);
                      setActiveView('simulations');
                    }}
                  />
                </div>
              )}

              {/* 2. Kho sách giáo khoa và danh mục bài học từ bài 1 đến bài cuối của khối */}
              <SgkBookBrowser gradeId={selectedGradeId} />
            </div>
          </div>
        ) : (
          /* TAB 2: Thư viện mô phỏng (Đề xuất Dạng tương tác 2 cột + Bảng danh mục 170 thí nghiệm + Live Lab) */
          <div className="flex-1">
            <SimulationLabGrid focusSimId={focusSimId} />
          </div>
        )}

      </div>

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLessonFromSearch}
        onSelectSimulation={handleSelectSimulationFromSearch}
        onNavigateToGrade={handleNavigateToGradeFromSearch}
      />

      {/* Floating Action Button: AI Đọc & System Diagnostics */}
      <AiReaderModal
        activeView={activeView}
        selectedLevelId={selectedLevelId}
        selectedGradeId={selectedGradeId}
        selectedSubjectId={selectedSubjectId}
        theme={theme}
      />
    </div>
  );
};

export default App;

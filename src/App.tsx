import React, { useState, useEffect } from 'react';
import { LevelId } from './types/curriculum';
import { LEVELS, GRADES, SUBJECTS, CHAPTERS, LESSONS } from './data/curriculumData';
import { Header } from './components/layout/Header';
import { LevelTabs } from './components/layout/LevelTabs';
import { SubLevelNav } from './components/layout/SubLevelNav';
import { SidebarLessonTree } from './components/layout/SidebarLessonTree';
import { LessonView } from './components/layout/LessonView';
import { SimulationLabGrid } from './components/lab/SimulationLabGrid';
import { SearchModal } from './components/common/SearchModal';

export const App: React.FC = () => {
  // Navigation view state: 'curriculum' vs 'simulations'
  const [activeView, setActiveView] = useState<'curriculum' | 'simulations'>('curriculum');

  // Hierarchy Selection States
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>('thcs');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('thcs-lop-8');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('thcs-khtn-8');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('lesson-thcs-dien-tro-ohm');

  // Focus Simulation ID (for when clicking "Mở trong Thư viện mô phỏng")
  const [focusSimId, setFocusSimId] = useState<string | undefined>(undefined);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

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
        const chap = CHAPTERS.find((c) => c.subjectId === availableSubjects[0].id);
        if (chap) {
          const les = LESSONS.find((l) => l.chapterId === chap.id);
          if (les) setSelectedLessonId(les.id);
        }
      }
    }
  };

  // When Grade changes, auto-select first subject
  const handleSelectGrade = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    const availableSubjects = SUBJECTS.filter((s) => s.gradeId === gradeId);
    if (availableSubjects.length > 0) {
      setSelectedSubjectId(availableSubjects[0].id);
      const chap = CHAPTERS.find((c) => c.subjectId === availableSubjects[0].id);
      if (chap) {
        const les = LESSONS.find((l) => l.chapterId === chap.id);
        if (les) setSelectedLessonId(les.id);
      }
    }
  };

  // When Subject changes, auto-select first lesson
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const chap = CHAPTERS.find((c) => c.subjectId === subjectId);
    if (chap) {
      const les = LESSONS.find((l) => l.chapterId === chap.id);
      if (les) setSelectedLessonId(les.id);
    }
  };

  // Navigate to Simulation Lab from a lesson
  const handleNavigateToSimLab = (simId?: string) => {
    setFocusSimId(simId);
    setActiveView('simulations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct selection from Search modal
  const handleSelectLessonFromSearch = (lessonId: string) => {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return;
    const chapter = CHAPTERS.find((c) => c.id === lesson.chapterId);
    if (!chapter) return;
    const subject = SUBJECTS.find((s) => s.id === chapter.subjectId);
    if (!subject) return;
    const grade = GRADES.find((g) => g.id === subject.gradeId);
    if (!grade) return;

    setSelectedLevelId(grade.levelId);
    setSelectedGradeId(grade.id);
    setSelectedSubjectId(subject.id);
    setSelectedLessonId(lesson.id);
    setActiveView('curriculum');
  };

  const handleSelectSimulationFromSearch = (simId: string) => {
    handleNavigateToSimLab(simId);
  };

  // Filtered lists for current state
  const currentLevelInfo = LEVELS.find((l) => l.id === selectedLevelId)!;
  const currentGrades = GRADES.filter((g) => g.levelId === selectedLevelId);
  const currentSubjects = SUBJECTS.filter((s) => s.gradeId === selectedGradeId);
  const currentChapters = CHAPTERS.filter((c) => c.subjectId === selectedSubjectId);
  const currentLessons = LESSONS.filter((l) =>
    currentChapters.some((c) => c.id === l.chapterId)
  );
  const activeLesson =
    LESSONS.find((l) => l.id === selectedLessonId) || currentLessons[0] || LESSONS[0];
  const activeSubject = SUBJECTS.find((s) => s.id === selectedSubjectId);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-200">
      {/* 1. Header with Mode Toggle & Search */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Main Workspace */}
      {activeView === 'curriculum' ? (
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

          {/* Two-Column Wiki Workspace */}
          <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
            {/* Left Column: Lesson Tree */}
            <SidebarLessonTree
              chapters={currentChapters}
              lessons={currentLessons}
              selectedLessonId={activeLesson.id}
              onSelectLesson={setSelectedLessonId}
              subjectName={activeSubject?.name || ''}
            />

            {/* Right Column: Lesson Content + Embedded Simulator */}
            <LessonView
              lesson={activeLesson}
              subject={activeSubject}
              onNavigateToSimLab={handleNavigateToSimLab}
            />
          </div>
        </div>
      ) : (
        /* Mode 2: Dedicated Simulation Lab Grid */
        <SimulationLabGrid focusSimId={focusSimId} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#080c14] py-6 text-xs text-slate-500 text-center font-mono space-y-1">
        <div>
          K-12 Wiki & Interactive Simulator • Xây dựng theo triết lý First-Principles của Andrej Karpathy
        </div>
        <div className="text-[11px] text-slate-600">
          Chương trình giáo dục phổ thông Việt Nam (GDPT 2018) • Bộ sách Kết nối tri thức với cuộc sống (Hành Trang Số)
        </div>
      </footer>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLessonFromSearch}
        onSelectSimulation={handleSelectSimulationFromSearch}
      />
    </div>
  );
};
export default App;

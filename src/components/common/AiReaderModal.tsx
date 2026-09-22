import React, { useState } from 'react';
import { SIMULATION_CATALOG, INTERACTION_PATTERNS } from '../../data/simulationCatalogData';
import { LEVELS, GRADES, SUBJECTS, CHAPTERS, LESSONS } from '../../data/curriculumData';
import {
  Bot,
  Copy,
  Check,
  X,
  Terminal,
  Sparkles,
  MessageSquarePlus
} from 'lucide-react';

interface Props {
  activeView: 'curriculum' | 'simulations';
  selectedLevelId: string;
  selectedGradeId: string;
  selectedSubjectId: string;
  selectedLessonId: string;
  theme: 'light' | 'dark';
}

export const AiReaderModal: React.FC<Props> = ({
  activeView,
  selectedLevelId,
  selectedGradeId,
  selectedSubjectId,
  selectedLessonId,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sims' | 'curriculum' | 'patterns'>('all');

  // Selected entities
  const activeLevel = LEVELS.find((l) => l.id === selectedLevelId);
  const activeGrade = GRADES.find((g) => g.id === selectedGradeId);
  const activeSubject = SUBJECTS.find((s) => s.id === selectedSubjectId);
  const activeLesson = LESSONS.find((l) => l.id === selectedLessonId);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Structured summary for AI
  const fullSystemSchema = {
    website_name: "K-12 Wiki & Interactive Lab (GDPT 2018)",
    pedagogy: "Andrej Karpathy First-Principles Learning Engine",
    deployment_url: "https://wiki-phongthinghiem-j-q-5fv1.vercel.app/",
    github_repository: "https://github.com/JamieKirumato/wikiPhongthinghiemJ-Q",
    system_state: {
      current_view: activeView,
      active_theme: theme,
      active_level: activeLevel?.name,
      active_grade: activeGrade?.name,
      active_subject: activeSubject?.name,
      active_lesson: activeLesson?.title,
    },
    statistics: {
      total_simulations: SIMULATION_CATALOG.length, // 170
      preschool_simulations: SIMULATION_CATALOG.filter((s) => s.levelId === 'mam-non').length, // 30
      primary_simulations: SIMULATION_CATALOG.filter((s) => s.levelId === 'tieu-hoc').length, // 40
      lower_secondary_simulations: SIMULATION_CATALOG.filter((s) => s.levelId === 'thcs').length, // 50
      upper_secondary_simulations: SIMULATION_CATALOG.filter((s) => s.levelId === 'thpt').length, // 50
      interaction_patterns_count: INTERACTION_PATTERNS.length, // 6
    },
    interaction_patterns: INTERACTION_PATTERNS.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      pedagogy: p.pedagogy,
      examples: p.examples
    })),
    curriculum_overview: {
      levels_count: LEVELS.length,
      grades_count: GRADES.length,
      subjects_count: SUBJECTS.length,
      chapters_count: CHAPTERS.length,
      lessons_count: LESSONS.length,
    },
    simulations_catalog: SIMULATION_CATALOG.map((s) => ({
      stt: s.stt,
      id: s.id,
      title: s.title,
      level: s.levelId,
      purpose: s.purpose,
      procedure: s.procedure,
      extracted_from: s.extractedFrom,
      interaction_pattern: s.interactionPatternName,
      has_live_sim: s.hasLiveSim,
      key_variables: s.keyVariables,
      first_principles_note: s.firstPrinciplesNote
    }))
  };

  const fullJsonString = JSON.stringify(fullSystemSchema, null, 2);

  // Formatted bug report prompt template for AI
  const bugReportTemplate = `### YÊU CẦU CHỈNH SỬA / BÁO CÁO CHO AI
**Trang web**: https://wiki-phongthinghiem-j-q-5fv1.vercel.app/
**Trạng thái hiện tại**:
- Tab đang xem: ${activeView === 'curriculum' ? 'Tổng quan chương trình' : 'Thư viện mô phỏng'}
- Cấp học: ${activeLevel?.name || 'Chưa chọn'}
- Khối lớp: ${activeGrade?.name || 'Chưa chọn'}
- Môn học: ${activeSubject?.name || 'Chưa chọn'}
- Bài học: ${activeLesson?.title || 'Chưa chọn'}

**Vị trí cần chỉnh sửa**:
[Điền tên thí nghiệm STT số ... hoặc bài học cần sửa tại đây]

**Lỗi phát hiện hoặc Nội dung muốn bổ sung**:
[Mô tả chi tiết nội dung bạn muốn AI chỉnh sửa hoặc bổ sung]

---
(Dữ liệu mã trang web kèm theo đã được trích xuất từ nút "AI đọc")`;

  const getDisplayText = () => {
    switch (activeTab) {
      case 'all':
        return fullJsonString;
      case 'sims':
        return JSON.stringify(fullSystemSchema.simulations_catalog, null, 2);
      case 'curriculum':
        return JSON.stringify({
          active_lesson: activeLesson,
          levels: LEVELS,
          grades: GRADES,
          subjects: SUBJECTS,
          lessons: LESSONS
        }, null, 2);
      case 'patterns':
        return JSON.stringify(fullSystemSchema.interaction_patterns, null, 2);
    }
  };

  const displayText = getDisplayText();

  return (
    <>
      {/* 1. Floating Action Button at Bottom-Right Screen */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-mono text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 group"
          title="Mở chế độ đọc mã trang web dành cho AI"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="tracking-wide">AI đọc</span>
        </button>
      </div>

      {/* 2. Full-Screen AI Inspector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b0f19] border border-slate-700 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-200 font-mono">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070a12] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-500/40 text-sky-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                      CỔNG DỮ LIỆU DÀNH CHO AI (AI READER & DIAGNOSTICS)
                    </h3>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live 170 Labs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Toàn bộ cấu trúc trang web được mã hóa thành JSON/Markdown để AI đọc, hiểu và sửa lỗi ngay lập tức.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="px-4 sm:px-5 py-3 border-b border-slate-800/80 bg-[#0d1322] flex items-center justify-between flex-wrap gap-2 text-xs">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeTab === 'all'
                      ? 'bg-sky-500 text-white font-bold'
                      : 'bg-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  Toàn bộ dữ liệu
                </button>
                <button
                  onClick={() => setActiveTab('sims')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeTab === 'sims'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  170 Thí nghiệm
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeTab === 'curriculum'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  Cây bài học
                </button>
                <button
                  onClick={() => setActiveTab('patterns')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeTab === 'patterns'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  6 Dạng tương tác
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(displayText, 'data')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition shadow-sm"
                >
                  {copiedSection === 'data' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã chép mã!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép dữ liệu cho AI</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopy(bugReportTemplate, 'report')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  {copiedSection === 'report' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã chép mẫu sửa lỗi!</span>
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Mẫu gửi AI sửa lỗi</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="px-4 sm:px-5 py-2 bg-[#080c14] border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span>View: <strong className="text-sky-400">{activeView}</strong></span>
                <span>•</span>
                <span>Thí nghiệm: <strong className="text-emerald-400">{SIMULATION_CATALOG.length} labs</strong></span>
                <span>•</span>
                <span>Mầm non: <strong className="text-slate-200">30</strong></span>
                <span>Tiểu học: <strong className="text-slate-200">40</strong></span>
                <span>THCS: <strong className="text-slate-200">50</strong></span>
                <span>THPT: <strong className="text-slate-200">50</strong></span>
              </div>
              <div className="text-[10px] text-slate-500">
                JSON Machine-Readable Format
              </div>
            </div>

            {/* Code Body Viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-5 bg-[#05070d] text-slate-300 text-xs leading-relaxed selection:bg-sky-500 selection:text-white">
              <pre className="font-mono whitespace-pre-wrap break-all">
                <code>{displayText}</code>
              </pre>
            </div>

            {/* Modal Footer Instructions */}
            <div className="p-3 border-t border-slate-800 bg-[#070a12] text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Mẹo: Bạn có thể nhấn <strong>"Sao chép dữ liệu cho AI"</strong> rồi dán thẳng vào ô chat để yêu cầu AI sửa hoặc thêm bất kỳ mục nào.</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

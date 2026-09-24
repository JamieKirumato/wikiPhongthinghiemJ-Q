import React, { useState } from 'react';
import { PRESCHOOL_PRODUCT_EXPERIMENTS, PreschoolProductExperiment } from '../../data/preschoolProductsData';
import { SimSinkOrFloatLab } from './SimSinkOrFloatLab';
import { SimColorMixerLab } from './SimColorMixerLab';
import { SimMeasurementLab } from './SimMeasurementLab';
import {
  Sparkles,
  Play,
  FileCode,
  Waves,
  Palette,
  Ruler,
  X,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface Props {
  initialExperimentId?: string;
}

export const PreschoolProductsView: React.FC<Props> = ({ initialExperimentId }) => {
  // Active running lab (if null, lab panel is collapsed)
  const [activeSimId, setActiveSimId] = useState<string | null>(initialExperimentId || 'mn-prod-01');

  // Modal for detailed pedagogy script
  const [modalItem, setModalItem] = useState<PreschoolProductExperiment | null>(null);
  const [modalTab, setModalTab] = useState<'part1' | 'part2'>('part1');

  const handleRunLab = (expId: string) => {
    setActiveSimId(expId);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const renderSimComponent = (id: string) => {
    switch (id) {
      case 'mn-prod-01':
        return <SimSinkOrFloatLab onBackToTable={() => setActiveSimId(null)} />;
      case 'mn-prod-02':
        return <SimColorMixerLab onBackToTable={() => setActiveSimId(null)} />;
      case 'mn-prod-03':
        return <SimMeasurementLab onBackToTable={() => setActiveSimId(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chuyên Đề Nghiên Cứu & Phát Triển Sản Phẩm Mầm Non</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold font-mono text-xs">
              3 Thí nghiệm chọn lọc
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Sản Phẩm Thí Nghiệm & Mô Phỏng Mầm Non
          </h1>

          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-sans">
            Tổ chức theo 2 hướng tiếp cận sư phạm đột phá:{' '}
            <strong className="text-amber-300">Phần 1 - Sản phẩm cải tiến</strong> (tái hiện hoạt động trực tiếp của giáo viên lên môi trường online tương tác thời gian thực) và{' '}
            <strong className="text-amber-300">Phần 2 - Sản phẩm khám phá</strong> (nâng cao năng lực tư duy, yêu cầu trẻ vận dụng kiến thức chế tạo và giải quyết vấn đề).
          </p>
        </div>
      </div>

      {/* 2. Interactive Live Lab Workspace (If Running) */}
      {activeSimId && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#0c121e] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase px-2">
                Đang chạy phòng Lab:
              </span>

              {PRESCHOOL_PRODUCT_EXPERIMENTS.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveSimId(exp.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    activeSimId === exp.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {exp.id === 'mn-prod-01' && <Waves className="w-3.5 h-3.5" />}
                  {exp.id === 'mn-prod-02' && <Palette className="w-3.5 h-3.5" />}
                  {exp.id === 'mn-prod-03' && <Ruler className="w-3.5 h-3.5" />}
                  <span>{exp.title}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveSimId(null)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition font-mono self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Thu nhỏ phòng Lab</span>
            </button>
          </div>

          {/* Render Active Simulation Component */}
          {renderSimComponent(activeSimId)}
        </section>
      )}

      {/* 3. The Core Table: BẢNG MÔ TẢ CÁC THÍ NGHIỆM ĐANG LÀM */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Bảng Mô Tả Các Thí Nghiệm Mầm Non Đang Làm</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bản mô tả chuẩn hóa theo cấu trúc Danh mục thí nghiệm &amp; phòng lab, phân chia rõ Yêu cầu Cơ bản, Yêu cầu Nâng cao và 2 Hướng sản phẩm.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3/3 Thí nghiệm sẵn sàng Chạy Lab</span>
          </div>
        </div>

        {/* Standard Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-md">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-[#0e1422] text-[11px] uppercase font-mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-3 font-semibold text-center w-14">STT</th>
                <th className="py-3.5 px-4 font-semibold min-w-[220px] w-64">Tên thí nghiệm</th>
                <th className="py-3.5 px-4 font-semibold min-w-[240px]">Mục đích &amp; Lời dẫn dắt</th>
                <th className="py-3.5 px-4 font-semibold min-w-[280px]">Yêu cầu sư phạm (Cơ bản &amp; Nâng cao)</th>
                <th className="py-3.5 px-4 font-semibold min-w-[240px]">Hướng Sản phẩm (Phần 1 &amp; 2)</th>
                <th className="py-3.5 px-3 font-semibold text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {PRESCHOOL_PRODUCT_EXPERIMENTS.map((item) => (
                <tr
                  key={item.id}
                  className="hover:outline hover:outline-1 hover:outline-emerald-500 dark:hover:outline-emerald-500 transition-all group align-top"
                >
                  {/* Cột 1: STT */}
                  <td className="py-4 px-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 inline-flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold">
                      #{item.stt}
                    </span>
                  </td>

                  {/* Cột 2: Tên thí nghiệm & Phân loại */}
                  <td className="py-4 px-4 space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        {item.ageRange}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Live Lab
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                      {item.title}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {item.domain}
                    </div>

                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                      🏷️ {item.tag}
                    </div>
                  </td>

                  {/* Cột 3: Mục đích & Lời dẫn dắt của cô */}
                  <td className="py-4 px-4 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    <p className="line-clamp-3">{item.purpose}</p>

                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-900 dark:text-sky-200 italic flex items-start gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-sky-600" />
                      <span>Cô hỏi: "{item.teacherPrompt}"</span>
                    </div>
                  </td>

                  {/* Cột 4: Yêu cầu sư phạm (Cơ bản & Nâng cao) */}
                  <td className="py-4 px-4 space-y-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Yêu cầu cơ bản:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.basicRequirement}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                      <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 text-[10px] uppercase font-mono">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>Yêu cầu nâng cao:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.advancedRequirement}
                      </p>
                    </div>
                  </td>

                  {/* Cột 5: Hướng Sản phẩm (Phần 1: Cải tiến & Phần 2: Khám phá) */}
                  <td className="py-4 px-4 space-y-2 text-[11px]">
                    <div className="space-y-1">
                      <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 font-mono text-[10px]">
                        <Sparkles className="w-3 h-3 text-sky-500" />
                        <span>Phần 1: Cải tiến Online</span>
                      </div>
                      <ul className="text-slate-600 dark:text-slate-400 text-[10px] space-y-0.5">
                        {item.part1Description.features.slice(0, 2).map((feat, fIdx) => (
                          <li key={fIdx} className="line-clamp-2">• {feat.split(':')[0]}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono text-[10px]">
                        <Compass className="w-3 h-3 text-amber-500" />
                        <span>Phần 2: Khám phá Tư duy</span>
                      </div>
                      <ul className="text-slate-600 dark:text-slate-400 text-[10px] space-y-0.5">
                        {item.part2Description.features.slice(0, 2).map((feat, fIdx) => (
                          <li key={fIdx} className="line-clamp-2">• {feat.split(':')[0]}</li>
                        ))}
                      </ul>
                    </div>
                  </td>

                  {/* Cột 6: Thao tác */}
                  <td className="py-4 px-3 text-center space-y-2">
                    <button
                      onClick={() => handleRunLab(item.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition shadow-sm hover:scale-[1.02]"
                      title="Chạy phòng lab trực tiếp"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Chạy Lab</span>
                    </button>

                    <button
                      onClick={() => {
                        setModalItem(item);
                        setModalTab('part1');
                      }}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-mono transition"
                    >
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kịch bản</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Pedagogical Script Modal (Bản mô tả chi tiết tương tự Danh mục thí nghiệm) */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c121e] border-2 border-slate-300 dark:border-slate-700 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 p-6 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold">
                    Kịch Bản Chi Tiết #{modalItem.stt}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {modalItem.domain}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {modalItem.title}
                </h3>
              </div>

              <button
                onClick={() => setModalItem(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Phần 1 vs Phần 2 */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                onClick={() => setModalTab('part1')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono transition ${
                  modalTab === 'part1'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Phần 1: Sản Phẩm Cải Tiến (Online)
              </button>

              <button
                onClick={() => setModalTab('part2')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono transition ${
                  modalTab === 'part2'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Phần 2: Sản Phẩm Khám Phá (Tư Duy Cao)
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="space-y-4 text-xs leading-relaxed">
              {modalTab === 'part1' ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200">
                    <div className="font-bold text-xs uppercase font-mono mb-1">
                      {modalItem.part1Description.title}
                    </div>
                    <p>{modalItem.part1Description.concept}</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      {modalItem.part1Description.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs font-mono uppercase text-slate-800 dark:text-slate-200">
                      Các Bước Tiến Hành Chuẩn Hóa:
                    </h4>
                    <div className="space-y-1.5">
                      {modalItem.procedure.part1.map((step, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200">
                    <div className="font-bold text-xs uppercase font-mono mb-1">
                      {modalItem.part2Description.title}
                    </div>
                    <p>{modalItem.part2Description.concept}</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      {modalItem.part2Description.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs font-mono uppercase text-slate-800 dark:text-slate-200">
                      Thử Thách Khám Phá &amp; Vận Dụng Nguyên Lý:
                    </h4>
                    <div className="space-y-1.5">
                      {modalItem.procedure.part2.map((step, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Materials list */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-bold text-xs font-mono uppercase text-slate-800 dark:text-slate-200">
                  Dụng Cụ &amp; Vật Liệu Trực Quan:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {modalItem.materials.map((mat, mIdx) => (
                    <li key={mIdx}>• {mat}</li>
                  ))}
                </ul>
              </div>

              {/* Pedagogical Outcome */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs">
                <strong>Kết quả đầu ra sư phạm:</strong> {modalItem.pedagogicalOutcome}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Chuẩn GDMN mới • Tích hợp STEAM
              </span>
              <button
                onClick={() => {
                  handleRunLab(modalItem.id);
                  setModalItem(null);
                }}
                className="flex items-center gap-2 py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow-md transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Khởi Động Lab Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

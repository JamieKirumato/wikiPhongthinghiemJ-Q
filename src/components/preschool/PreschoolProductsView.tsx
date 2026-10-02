import React, { useState } from 'react';
import { PRESCHOOL_PRODUCT_EXPERIMENTS, PreschoolProductExperiment } from '../../data/preschoolProductsData';
import { SimSinkOrFloatLab } from './SimSinkOrFloatLab';
import { SimRescueRaftLab } from './SimRescueRaftLab';
import { SimLavaLampLab } from './SimLavaLampLab';
import { SimColorMixerLab } from './SimColorMixerLab';
import { SimMeasurementLab } from './SimMeasurementLab';
import {
  Sparkles,
  Waves,
  Palette,
  Ruler,
  Ship,
  Flame,
  Layers,
  BookOpen,
  CheckCircle2,
  Award,
  Compass,
  Play,
  FileCode,
  X
} from 'lucide-react';

interface Props {
  initialExperimentId?: string;
}

const PRESCHOOL_MINI_TABS = [
  { id: 'exp-sink-tank', title: 'Bể Thử Nghiệm Chìm Nổi', icon: Waves, tag: 'Thí nghiệm 1A' },
  { id: 'exp-rescue-raft', title: 'Xưởng Chế Tạo Bè Cứu Hộ', icon: Ship, tag: 'Thí nghiệm 1B' },
  { id: 'exp-lava-lamp', title: 'Chế Tạo Đèn Dung Nham', icon: Flame, tag: 'Thí nghiệm 1C' },
  { id: 'exp-color-mixer', title: 'Hòa Trộn Màu Sắc', icon: Palette, tag: 'Thí nghiệm 2' },
  { id: 'exp-measurement', title: 'Đo Lường & So Sánh', icon: Ruler, tag: 'Thí nghiệm 3' },
];

export const PreschoolProductsView: React.FC<Props> = ({ initialExperimentId }) => {
  // Active running lab (defaults to primary sink or float lab)
  const [activeSimId, setActiveSimId] = useState<string>(initialExperimentId || 'exp-sink-tank');

  // Modal for detailed pedagogy script
  const [modalItem, setModalItem] = useState<PreschoolProductExperiment | null>(null);
  const [modalTab, setModalTab] = useState<'part1' | 'part2'>('part1');

  const handleRunLab = (expId: string) => {
    if (expId === 'mn-prod-01') {
      setActiveSimId('exp-sink-tank');
    } else if (expId === 'mn-prod-02') {
      setActiveSimId('exp-color-mixer');
    } else if (expId === 'mn-prod-03') {
      setActiveSimId('exp-measurement');
    } else {
      setActiveSimId(expId);
    }
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const renderSimComponent = (id: string) => {
    switch (id) {
      case 'exp-sink-tank':
      case 'mn-prod-01':
        return <SimSinkOrFloatLab onBackToTable={() => setActiveSimId('exp-sink-tank')} />;
      case 'exp-rescue-raft':
        return <SimRescueRaftLab />;
      case 'exp-lava-lamp':
        return <SimLavaLampLab />;
      case 'exp-color-mixer':
      case 'mn-prod-02':
        return <SimColorMixerLab onBackToTable={() => setActiveSimId('exp-sink-tank')} />;
      case 'exp-measurement':
      case 'mn-prod-03':
        return <SimMeasurementLab onBackToTable={() => setActiveSimId('exp-sink-tank')} />;
      default:
        return <SimSinkOrFloatLab onBackToTable={() => setActiveSimId('exp-sink-tank')} />;
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-4 space-y-5 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chuyên Đề Thí Nghiệm Khoa Học Mầm Non (3 - 6 Tuổi)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kho Mô Phỏng Thí Nghiệm Mầm Non Trực Quan
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-sans">
            Mỗi tab bên dưới là một thí nghiệm tương tác riêng biệt. Bé và giáo viên có thể chuyển đổi linh hoạt để trải nghiệm mô phỏng toàn màn hình.
          </p>
        </div>
      </div>

      {/* 2. Primary Mini-Tabs Bar (Tách thành nhiều tab nhỏ, mỗi tab là 1 thí nghiệm) */}
      <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-[#0c121e] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
        {PRESCHOOL_MINI_TABS.map((tab, index) => {
          const isSelected = activeSimId === tab.id || (activeSimId === 'mn-prod-01' && tab.id === 'exp-sink-tank') || (activeSimId === 'mn-prod-02' && tab.id === 'exp-color-mixer') || (activeSimId === 'mn-prod-03' && tab.id === 'exp-measurement');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSimId(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold font-mono text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md scale-102 ring-2 ring-emerald-400/40'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300 animate-pulse' : 'text-slate-500'}`} />
              <span>{index + 1}. {tab.title}</span>
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Interactive Live Lab Workspace */}
      <section className="w-full">
        {renderSimComponent(activeSimId)}
      </section>

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

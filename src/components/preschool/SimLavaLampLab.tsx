import React, { useState } from 'react';
import { Flame, Play, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

export const SimLavaLampLab: React.FC = () => {
  const [lavaStep, setLavaStep] = useState<number>(0);
  const [isLavaBubbling, setIsLavaBubbling] = useState<boolean>(false);
  const [nightLightOn, setNightLightOn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(
    'Bình thủy tinh đang rỗng. Bé hãy bấm "Thực hiện bước tiếp theo" để bắt đầu chế tạo đèn dung nham nhé!'
  );

  const handleNextLavaStep = () => {
    if (lavaStep === 0) {
      setLavaStep(1);
      setMessage('Bước 1: Rót nước lọc vào bình! Nước nặng hơn nên nằm ở nửa dưới.');
      soundEngine.playWaterSplash(false);
    } else if (lavaStep === 1) {
      setLavaStep(2);
      setMessage('Bước 2: Rót dầu ăn vào bình! Dầu ăn nhẹ hơn nước nên nổi thành lớp vàng óng phía trên!');
      soundEngine.playWaterSplash(false);
    } else if (lavaStep === 2) {
      setLavaStep(3);
      setMessage('Bước 3: Nhỏ giọt màu thực phẩm! Giọt màu nặng hơn dầu nên chìm xuyên qua lớp dầu xuống đáy nước.');
      soundEngine.playWaterDrop();
    } else if (lavaStep === 3) {
      setLavaStep(4);
      setIsLavaBubbling(true);
      setMessage('Bước 4: Thả viên sủi C vào! Bọt khí sủi tăm đẩy các giọt màu bay lên mặt dầu, vỡ khí lại chìm xuống tạo đèn dung nham tuyệt đẹp!');
      soundEngine.playMagicChime();
    }
  };

  const handleResetLava = () => {
    setLavaStep(0);
    setIsLavaBubbling(false);
    setMessage('Đã rửa sạch bình! Bé bấm nút để bắt đầu chế tạo đèn dung nham mới nhé.');
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border-2 border-amber-500 rounded-3xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Chế Tạo Đèn Dung Nham (Lava Lamp - Tỷ Trọng Chất Lỏng)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Khám phá hiện tượng phân tầng chất lỏng giữa Dầu ăn và Nước, kết hợp viên sủi tạo bọt tuần hoàn.
          </p>
        </div>

        <button
          onClick={handleResetLava}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm lại từ đầu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Lava Lamp Flask */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
          <div
            className={`relative w-52 h-[420px] rounded-3xl border-4 transition-all duration-500 overflow-hidden flex flex-col justify-end p-2 ${
              nightLightOn
                ? 'border-amber-400 bg-slate-950 shadow-[0_0_60px_rgba(245,158,11,0.6)]'
                : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-xl'
            }`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-400 dark:bg-slate-600 rounded-b-md" />

            {lavaStep === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                <Flame className="w-8 h-8 text-slate-300 mb-2" />
                <span>Bình thủy tinh đang rỗng. Bấm "Thực hiện bước tiếp theo" để thêm nước!</span>
              </div>
            )}

            {lavaStep >= 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-sky-400/40 border-t border-sky-300/50 flex items-center justify-center text-[11px] font-mono text-sky-800 dark:text-sky-200 font-bold">
                Lớp Nước Lọc (Nặng hơn nằm dưới)
              </div>
            )}

            {lavaStep >= 2 && (
              <div className="absolute bottom-[35%] left-0 right-0 h-[60%] bg-amber-300/40 border-t border-amber-300/60 flex items-center justify-center text-[11px] font-mono text-amber-800 dark:text-amber-300 font-bold">
                Lớp Dầu Ăn (Nhẹ hơn nổi lên trên)
              </div>
            )}

            {lavaStep >= 3 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-3 left-6 w-5 h-5 rounded-full bg-red-500/80 shadow-xs" />
                <div className="absolute bottom-4 left-16 w-6 h-6 rounded-full bg-purple-600/80 shadow-xs" />
                <div className="absolute bottom-2 right-8 w-5 h-5 rounded-full bg-orange-500/80 shadow-xs" />
              </div>
            )}

            {isLavaBubbling && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white shadow-md animate-pulse" />
                <div className="absolute bottom-6 left-8 w-8 h-8 rounded-full bg-red-500 animate-bounce transition-all opacity-85 shadow-[0_0_15px_rgba(239,68,68,0.9)]" />
                <div className="absolute bottom-14 right-10 w-10 h-10 rounded-full bg-purple-600 animate-pulse transition-all opacity-85 shadow-[0_0_16px_rgba(168,85,247,0.9)]" />
                <div className="absolute top-28 left-16 w-9 h-9 rounded-full bg-orange-500 animate-bounce transition-all opacity-85 shadow-[0_0_15px_rgba(249,115,22,0.9)]" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-800 rounded-b-2xl" />
          </div>

          <button
            onClick={() => setNightLightOn(!nightLightOn)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition shadow-sm ${
              nightLightOn
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{nightLightOn ? 'Đang bật Chế độ Đèn Ngủ Dạ Quang ✨' : 'Bật Chế độ Đèn Ngủ Dạ Quang'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>4 Bước Chế Tạo Đèn Dung Nham</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                Bước {lavaStep}/4
              </span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 1 ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Rót nước lọc vào 1/3 bình (Nước nặng nằm dưới)</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 2 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Rót dầu ăn đầy bình (Dầu nhẹ hơn nổi lên trên)</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 3 ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Nhỏ giọt màu (Giọt màu chìm qua dầu vào nước)</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${lavaStep >= 4 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Thả viên sủi C (Bọt khí đẩy giọt màu trồi sủi bọt chu kỳ)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              {lavaStep < 4 ? (
                <button
                  onClick={handleNextLavaStep}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs font-mono shadow-md transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Thực Hiện Bước Tiếp Theo ({lavaStep + 1}/4)</span>
                </button>
              ) : (
                <div className="flex-1 p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center font-mono">
                  🎉 Đèn Dung Nham đang hoạt động rực rỡ!
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <strong>Cô Mimi hướng dẫn:</strong> {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

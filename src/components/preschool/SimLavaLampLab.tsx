import React, { useState, useEffect } from 'react';
import { Flame, Play, RotateCcw, Volume2, VolumeX, Sparkles, Monitor, Tv, Droplets } from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';
import { speechEngine } from '../../utils/speechUtils';

export const SimLavaLampLab: React.FC = () => {
  const [lavaStep, setLavaStep] = useState<number>(0);
  const [isLavaBubbling, setIsLavaBubbling] = useState<boolean>(false);
  const [nightLightOn, setNightLightOn] = useState<boolean>(false);
  const [isClassroomMode, setIsClassroomMode] = useState<boolean>(false);

  // Speech synthesizer state
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => speechEngine.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const [message, setMessage] = useState<string>(
    'Bình thủy tinh đang rỗng. Bé hãy chọn nguyên liệu hoặc bấm "Thực hiện bước tiếp theo" để cùng chế tạo đèn dung nham nhé!'
  );

  // Subscribe to speaking state
  useEffect(() => {
    const unsub = speechEngine.subscribeSpeakingState(setIsSpeaking);
    return () => unsub();
  }, []);

  // Speak message whenever it changes
  useEffect(() => {
    if (voiceEnabled && message) {
      speechEngine.speak(message);
    }
  }, [message, voiceEnabled]);

  const handleToggleVoice = () => {
    const next = speechEngine.toggleVoice();
    setVoiceEnabled(next);
  };

  const handleReplayVoice = () => {
    speechEngine.speak(message);
  };

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

  const handleIngredientClick = (stepIndex: number) => {
    if (stepIndex === 1 && lavaStep === 0) {
      setLavaStep(1);
      setMessage('Bước 1: Rót nước lọc vào bình! Nước nặng hơn nên nằm ở nửa dưới.');
      soundEngine.playWaterSplash(false);
    } else if (stepIndex === 2 && lavaStep === 1) {
      setLavaStep(2);
      setMessage('Bước 2: Rót dầu ăn vào bình! Dầu ăn nhẹ hơn nước nên nổi thành lớp vàng óng phía trên!');
      soundEngine.playWaterSplash(false);
    } else if (stepIndex === 3 && lavaStep === 2) {
      setLavaStep(3);
      setMessage('Bước 3: Nhỏ giọt màu thực phẩm! Giọt màu nặng hơn dầu nên chìm xuyên qua lớp dầu xuống đáy nước.');
      soundEngine.playWaterDrop();
    } else if (stepIndex === 4 && lavaStep === 3) {
      setLavaStep(4);
      setIsLavaBubbling(true);
      setMessage('Bước 4: Thả viên sủi C vào! Bọt khí sủi tăm đẩy các giọt màu bay lên mặt dầu, vỡ khí lại chìm xuống tạo đèn dung nham tuyệt đẹp!');
      soundEngine.playMagicChime();
    }
  };

  const handleToggleNightLight = () => {
    const nextState = !nightLightOn;
    setNightLightOn(nextState);
    if (nextState) {
      soundEngine.playMagicChime();
      setMessage('Ồ, bé đã bật chế độ dạ quang, chiếc đèn lung linh như ngọn hải đăng trong đêm tối!');
    } else {
      setMessage('Đã chuyển về ánh sáng phòng thí nghiệm ban ngày.');
    }
  };

  const handleResetLava = () => {
    setLavaStep(0);
    setIsLavaBubbling(false);
    setMessage('Đã rửa sạch bình! Bé chọn nguyên liệu để bắt đầu chế tạo đèn dung nham mới nhé.');
  };

  const INGREDIENTS = [
    { step: 1, name: 'Ca Nước Lọc', icon: '💧', desc: 'Nặng hơn, chìm dưới' },
    { step: 2, name: 'Chai Dầu Ăn', icon: '🌻', desc: 'Nhẹ hơn, nổi ở trên' },
    { step: 3, name: 'Màu Thực Phẩm', icon: '🎨', desc: 'Xuyên qua dầu vào nước' },
    { step: 4, name: 'Viên Sủi Bọt C', icon: '💊', desc: 'Kích hoạt bọt khí tuần hoàn' }
  ];

  return (
    <div className={`bg-white dark:bg-[#0c121e] border-2 border-amber-500 rounded-3xl p-5 shadow-xl space-y-6 transition-all ${
      isClassroomMode ? 'ring-4 ring-amber-500/20 max-w-6xl mx-auto' : ''
    }`}>
      {/* Top Header & Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Chế Tạo Đèn Dung Nham (Lava Lamp - Tỷ Trọng Chất Lỏng)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Khám phá hiện tượng phân tầng chất lỏng giữa Dầu ăn và Nước, kết hợp viên sủi tạo bọt tuần hoàn.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Voice narration toggle */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-mono font-semibold transition ${
              voiceEnabled
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title={voiceEnabled ? 'Đang bật giọng Cô Mimi' : 'Đang tắt giọng Cô Mimi'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceEnabled ? 'Giọng Cô Mimi 🔊' : 'Giọng Mimi 🔇'}</span>
          </button>

          {/* Classroom / Presentation Mode */}
          <button
            onClick={() => setIsClassroomMode(!isClassroomMode)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-mono font-semibold transition ${
              isClassroomMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Chế độ Lớp học: Mở rộng cỡ chữ và nút bấm lớn cho Smart TV hoặc Bảng tương tác"
          >
            {isClassroomMode ? <Tv className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isClassroomMode ? 'Lớp học: BẬT 🎓' : 'Chế độ Lớp học 🎓'}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetLava}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className={`grid gap-6 items-center ${isClassroomMode ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 lg:grid-cols-12'}`}>
        {/* Lava Lamp Flask */}
        <div className={`${isClassroomMode ? 'lg:col-span-6' : 'lg:col-span-6'} flex flex-col items-center justify-center space-y-4`}>
          <div
            className={`relative rounded-3xl border-4 transition-all duration-500 overflow-hidden flex flex-col justify-end p-2 ${
              isClassroomMode ? 'w-64 h-[460px]' : 'w-52 h-[420px]'
            } ${
              nightLightOn
                ? 'border-amber-400 bg-slate-950 shadow-[0_0_70px_rgba(245,158,11,0.7)]'
                : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-xl'
            }`}
          >
            {/* Flask top neck */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-400 dark:bg-slate-600 rounded-b-md" />

            {lavaStep === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                <Flame className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2 animate-pulse" />
                <span className="font-medium">Bình thủy tinh đang rỗng.<br />Bé hãy chạm vào Ca Nước Lọc để bắt đầu nhé!</span>
              </div>
            )}

            {lavaStep >= 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-sky-400/50 border-t border-sky-300/50 flex flex-col items-center justify-center text-[11px] font-mono text-sky-900 dark:text-sky-100 font-bold transition-all">
                <span>💧 Lớp Nước Lọc</span>
                <span className="text-[9px] font-normal opacity-90">(Nặng hơn nên nằm dưới)</span>
              </div>
            )}

            {lavaStep >= 2 && (
              <div className="absolute bottom-[35%] left-0 right-0 h-[60%] bg-amber-300/50 border-t border-amber-300/60 flex flex-col items-center justify-center text-[11px] font-mono text-amber-950 dark:text-amber-100 font-bold transition-all">
                <span>🌻 Lớp Dầu Ăn</span>
                <span className="text-[9px] font-normal opacity-90">(Nhẹ hơn nên nổi ở trên)</span>
              </div>
            )}

            {lavaStep >= 3 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-3 left-6 w-5 h-5 rounded-full bg-red-500/80 shadow-xs animate-pulse" />
                <div className="absolute bottom-4 left-16 w-6 h-6 rounded-full bg-purple-600/80 shadow-xs animate-pulse delay-75" />
                <div className="absolute bottom-2 right-8 w-5 h-5 rounded-full bg-orange-500/80 shadow-xs animate-pulse delay-150" />
              </div>
            )}

            {isLavaBubbling && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white shadow-md animate-pulse" />
                <div className="absolute bottom-6 left-8 w-8 h-8 rounded-full bg-red-500 animate-bounce transition-all opacity-85 shadow-[0_0_15px_rgba(239,68,68,0.9)]" />
                <div className="absolute bottom-14 right-10 w-10 h-10 rounded-full bg-purple-600 animate-pulse transition-all opacity-85 shadow-[0_0_16px_rgba(168,85,247,0.9)]" />
                <div className="absolute top-28 left-16 w-9 h-9 rounded-full bg-orange-500 animate-bounce transition-all opacity-85 shadow-[0_0_15px_rgba(249,115,22,0.9)]" />
                <div className="absolute top-16 right-12 w-6 h-6 rounded-full bg-amber-400 animate-pulse transition-all opacity-85 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
              </div>
            )}

            {/* Flask base */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-800 rounded-b-2xl" />
          </div>

          {/* Night light toggle button */}
          <button
            onClick={handleToggleNightLight}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition shadow-sm hover:scale-105 active:scale-95 ${
              nightLightOn
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 shadow-amber-400/50'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{nightLightOn ? '✨ Đang Bật Đèn Ngủ Dạ Quang' : 'Bật Chế Độ Đèn Ngủ Dạ Quang ✨'}</span>
          </button>
        </div>

        {/* Instructions & Interactive Touch Ingredients */}
        <div className={`${isClassroomMode ? 'lg:col-span-6' : 'lg:col-span-6'} space-y-4`}>
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-500" />
                <span>4 Bước Thí Nghiệm &amp; Khay Nguyên Liệu</span>
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                Tiến độ: {lavaStep}/4
              </span>
            </h3>

            {/* Touch Ingredient Cards (Direct Tap for Kids) */}
            <div className="grid grid-cols-2 gap-2.5">
              {INGREDIENTS.map((ing) => {
                const isCompleted = lavaStep >= ing.step;
                const isNext = lavaStep === ing.step - 1;

                return (
                  <button
                    key={ing.step}
                    onClick={() => handleIngredientClick(ing.step)}
                    disabled={!isNext}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 shadow-xs'
                        : isNext
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-200 ring-2 ring-amber-400/50 shadow-md hover:scale-102 cursor-pointer animate-pulse'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{ing.icon}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isNext
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {isCompleted ? '✓ Đã rót' : isNext ? 'Bấm để thêm' : `Bước ${ing.step}`}
                      </span>
                    </div>
                    <div className="font-bold text-xs">{ing.name}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{ing.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Next Step Action Button */}
            <div className="pt-1 flex items-center gap-2">
              {lavaStep < 4 ? (
                <button
                  onClick={handleNextLavaStep}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm font-mono shadow-md transition hover:scale-101 active:scale-98"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Thực Hiện Bước Tiếp Theo ({lavaStep + 1}/4)</span>
                </button>
              ) : (
                <div className="flex-1 p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold text-center font-mono flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>🎉 Đèn Dung Nham đang hoạt động rực rỡ!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Guidance / Mascot Bar with Speech Feedback */}
      <div className={`p-4 rounded-3xl border shadow-md flex items-center gap-3.5 transition-all ${
        isClassroomMode
          ? 'bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 dark:from-slate-900 dark:via-amber-950/40 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-600'
          : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900 border-amber-200 dark:border-amber-800'
      }`}>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0 relative ${
          isSpeaking ? 'animate-bounce ring-4 ring-amber-400/40' : ''
        }`}>
          <span>👩‍🏫</span>
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-ping" />
          )}
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-xs font-bold font-mono text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Cô Mimi Dẫn Dắt &amp; Giải Thích:</span>
              {isSpeaking && (
                <span className="flex items-center gap-0.5 ml-2 text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                  <span className="w-1 h-3 bg-amber-500 rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-amber-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-amber-500 rounded-full animate-pulse delay-150" />
                  <span className="ml-1">Đang đọc bài...</span>
                </span>
              )}
            </h4>

            {/* Replay Voice button */}
            <button
              onClick={handleReplayVoice}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-slate-700 text-xs font-mono font-bold transition shadow-2xs hover:scale-105 active:scale-95"
              title="Bấm để nghe Cô Mimi đọc lại lời giải thích"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Nghe cô nói lại 🔊</span>
            </button>
          </div>

          <p className={`text-slate-800 dark:text-slate-200 font-medium leading-relaxed ${
            isClassroomMode ? 'text-sm sm:text-base font-semibold' : 'text-xs sm:text-sm'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

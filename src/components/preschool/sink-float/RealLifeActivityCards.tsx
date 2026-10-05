import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { speechEngine } from '../../../utils/speechUtils';
import { soundEngine } from '../../../utils/audioEffects';

interface RealLifeActivityCardsProps {
  soundEnabled: boolean;
  onMessageUpdate: (msg: string) => void;
}

interface ActivityCard {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  childExplanation: string;
  classroomTip: string;
}

const CARDS: ActivityCard[] = [
  {id:'ship', title:'Chiếc thuyền chở hàng',icon:'🚢',shortDesc:'Cùng một vật liệu, hình dạng thuyền giúp chở hàng thế nào?',
    childExplanation:'Thân thuyền rỗng chiếm chỗ nhiều nước. Nước nâng đỡ thuyền và hàng. Khi chở quá nhiều, nước có thể tràn vào.',
    classroomTip:'Người lớn chuẩn bị chậu nước nông và đất nặn. Trẻ thử cùng một miếng đất nặn: vo thành viên, rồi tạo lòng thuyền. Quan sát và điều chỉnh mép thuyền nếu nước tràn vào.'},
  {id:'life-vest',title:'Chiếc phao chứa khí',icon:'🦺',shortDesc:'Con tìm những vật rỗng hoặc có nhiều bọt khí quanh mình nhé.',
    childExplanation:'Phao có phần chứa khí hoặc xốp. Khi đặt trong nước, nước giúp nâng đỡ phao. Con thử quan sát một vật rỗng kín nhé.',
    classroomTip:'Cùng người lớn thử hai chai nhựa kín giống nhau trong chậu: một chai rỗng và một chai chứa thêm nước. Quan sát chai nào ngập sâu hơn; không quy định mọi chai đầy nước đều chìm. Phao đồ chơi không thay thế áo phao phù hợp và sự giám sát của người lớn.'},
  {id:'salt-water',title:'Nước ngọt và nước muối',icon:'🌊',shortDesc:'Cùng một quả trứng, thay đổi nước có làm nó đổi vị trí không?',
    childExplanation:'Khi hòa tan đủ muối, nước có thể nâng đỡ quả trứng tốt hơn. Con thử thêm ít muối từng lần và nhìn thật kỹ nhé.',
    classroomTip:'Người lớn chuẩn bị hai cốc trong suốt, nước và một quả trứng. Thử nước ngọt trước, rồi hòa tan muối từng ít một ở cốc thứ hai. Kết quả phụ thuộc lượng nước, muối và quả trứng; số thìa trong game không phải công thức thí nghiệm thật.'},
];

export const RealLifeActivityCards: React.FC<RealLifeActivityCardsProps> = ({
  soundEnabled,
  onMessageUpdate
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('ship');
  const selectedCard = CARDS.find((c) => c.id === selectedCardId) || CARDS[0];

  const handleSelectCard = (card: ActivityCard) => {
    setSelectedCardId(card.id);
    if (soundEnabled) soundEngine.playSpoonClink();
    onMessageUpdate(card.title + ': ' + card.shortDesc);
  };

  const handleSpeak = (text: string) => {
    speechEngine.speak(text);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-sky-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-3 sm:p-4 rounded-3xl select-none overflow-y-auto space-y-3">
      {/* 1. TIÊU ĐỀ KHÁM PHÁ THỰC TẾ */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">
              Vật Chìm Vật Nổi Trong Đời Sống Thực Tế
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Kết nối quan sát trong phòng thí nghiệm với những hiện tượng xung quanh bé
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSpeak(selectedCard.childExplanation)}
          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs flex items-center gap-1 transition"
          title="Cô Mimi đọc giải thích"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cô Mimi Đọc</span>
        </button>
      </div>

      {/* 2. CHỌN 3 THẺ HOẠT ĐỘNG THỰC TẾ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CARDS.map((card) => {
          const isSelected = card.id === selectedCardId;
          return (
            <button
              key={card.id}
              onClick={() => handleSelectCard(card)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                isSelected
                  ? 'bg-amber-50 border-amber-400 dark:bg-amber-950/60 dark:border-amber-600 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <span className="text-3xl mb-1">{card.icon}</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-1">
                {card.title}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {card.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. NỘI DUNG CHI TIẾT CỦA THẺ ĐANG CHỌN */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 shadow-md space-y-3">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
          <span className="text-2xl">{selectedCard.icon}</span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-amber-900 dark:text-amber-300">
              {selectedCard.title}
            </h4>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {selectedCard.shortDesc}
            </p>
          </div>
        </div>

        {/* Lời giải thích khoa học nhẹ nhàng cho trẻ */}
        <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-sky-900 dark:text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Giải thích dành cho bé:</span>
          </div>
          <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
            {selectedCard.childExplanation}
          </p>
        </div>

        {/* Gợi ý hoạt động thực hành cho giáo viên và phụ huynh */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-200">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>💡 Hoạt động thực hành tại lớp học / tại nhà:</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            {selectedCard.classroomTip}
          </p>
        </div>
      </div>

      {/* 4. GỢI Ý THÍ NGHIỆM MỞ RỘNG (HANDS-ON EXTENSIONS) */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>4 Thí nghiệm trải nghiệm thực tế cô và bé có thể làm ngay:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <b>1. Quả cam còn vỏ vs bóc vỏ:</b> Con dự đoán rồi thử cùng một quả cam trước và sau khi bóc vỏ. Vị trí trong nước có thay đổi không?
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <b>2. Đất nặn kỳ diệu:</b> Dùng cùng một miếng đất nặn: thử dạng viên rồi làm thuyền có mép cao. Con quan sát, điều chỉnh và thử lại nhé.
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <b>3. Trứng và nước muối:</b> Thử trứng trong nước ngọt rồi hòa tan từng ít muối. Dùng lượng nước như nhau và quan sát sau mỗi lần; không có số thìa cố định cho mọi cốc.
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <b>4. Chai nước có nắp:</b> Thử hai chai kín giống nhau: chai rỗng và chai có thêm nước. Con thấy chai nào ngập sâu hơn?
          </div>
        </div>
      </div>
    </div>
  );
};

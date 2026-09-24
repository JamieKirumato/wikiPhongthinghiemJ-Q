import React, { useState } from 'react';
import { 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Scale, 
  Beaker, 
  Clock,
  Compass,
  Lightbulb
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  onBackToTable?: () => void;
}

// Items to measure with ruler in Part 1
interface MeasureItem {
  id: string;
  name: string;
  icon: string;
  lengthCm: number;
  widthPx: number;
  category: 'stationery' | 'nature';
}

const MEASURE_ITEMS: MeasureItem[] = [
  { id: 'item-pencil', name: 'Bút chì màu', icon: '✏️', lengthCm: 8, widthPx: 160, category: 'stationery' },
  { id: 'item-eraser', name: 'Cục tẩy', icon: '🧼', lengthCm: 4, widthPx: 80, category: 'stationery' },
  { id: 'item-leaf', name: 'Chiếc lá phong', icon: '🍁', lengthCm: 11, widthPx: 220, category: 'nature' },
  { id: 'item-book', name: 'Quyển truyện tranh', icon: '📖', lengthCm: 16, widthPx: 320, category: 'stationery' }
];

// Context challenges for Part 2
interface MeasurementChallenge {
  id: string;
  title: string;
  situation: string;
  goal: string;
  bestToolId: string;
  options: {
    id: string;
    name: string;
    icon: string;
    timeToComplete: string;
    availability: string;
    isOptimal: boolean;
    reason: string;
  }[];
}

const MEASUREMENT_CHALLENGES: MeasurementChallenge[] = [
  {
    id: 'ch-classroom',
    title: 'Tình huống 1: Đo chiều dài sàn lớp học',
    situation: 'Cô giáo cần biết chiều dài sàn lớp học để trải chiếc thảm nhung múa hát chuẩn bị cho ngày hội.',
    goal: 'Tìm chiều dài từ góc cửa đến sân khấu múa của lớp.',
    bestToolId: 'footsteps',
    options: [
      {
        id: 'footsteps',
        name: 'Bước chân nối tiếp của bé',
        icon: '👣',
        timeToComplete: '15 giây (Rất nhanh)',
        availability: 'Sẵn có ngay trên cơ thể bé',
        isOptimal: true,
        reason: 'Chính xác! Đôi chân luôn sẵn có, bé chỉ cần bước đi nối tiếp tự nhiên là đếm được ngay số bước mà không cần đi tìm đồ nghề!'
      },
      {
        id: 'ruler-15cm',
        name: 'Cây thước kẻ học sinh 15cm',
        icon: '📏',
        timeToComplete: '25 phút (Rất lâu)',
        availability: 'Có trong cặp sách',
        isOptimal: false,
        reason: 'Thước kẻ quá ngắn! Sàn lớp dài 8 mét, bé sẽ phải chắp nối thước hơn 50 lần, vừa mất thì giờ vừa rất dễ nhầm lẫn!'
      },
      {
        id: 'beaker',
        name: 'Ca đong nước chia vạch ml',
        icon: '🥛',
        timeToComplete: 'Không đo được',
        availability: 'Có trong bếp',
        isOptimal: false,
        reason: 'Ca đong chỉ dùng để đo thể tích nước hoặc sữa, không thể dùng đo chiều dài sàn nhà được!'
      },
      {
        id: 'scale',
        name: 'Cân thăng bằng',
        icon: '⚖️',
        timeToComplete: 'Không đo được',
        availability: 'Ở góc học tập',
        isOptimal: false,
        reason: 'Cân dùng để đo xem vật nào nặng hay nhẹ, không đo được độ dài sàn phòng.'
      }
    ]
  },
  {
    id: 'ch-milk',
    title: 'Tình huống 2: Đong đúng 200ml sữa tươi làm bánh',
    situation: 'Bé giúp cô đầu bếp đong đúng 200ml sữa tươi béo ngậy để đổ vào âu bột làm bánh kem.',
    goal: 'Lấy đúng thể tích 200ml chất lỏng.',
    bestToolId: 'beaker-ml',
    options: [
      {
        id: 'beaker-ml',
        name: 'Ca đong chia vạch ml',
        icon: '🥛',
        timeToComplete: '5 giây (Chuẩn xác nhất)',
        availability: 'Sẵn ngay trên bàn bếp',
        isOptimal: true,
        reason: 'Chính xác! Ca đong có sẵn các vạch số ml rõ ràng, chỉ cần rót sữa tới đúng vạch 200ml là hoàn thành nhanh nhất!'
      },
      {
        id: 'hand-palm',
        name: 'Dùng lòng bàn tay vốc sữa',
        icon: '✋',
        timeToComplete: 'Không làm được',
        availability: 'Sẵn có',
        isOptimal: false,
        reason: 'Sữa là chất lỏng sẽ chảy tuột qua kẽ ngón tay làm bẩn sàn và không biết được bao nhiêu ml!'
      },
      {
        id: 'ruler',
        name: 'Cây thước kẻ thẳng',
        icon: '📏',
        timeToComplete: 'Không đo được',
        availability: 'Có trên bàn',
        isOptimal: false,
        reason: 'Thước kẻ phẳng không thể hứng và đong được thể tích chất lỏng.'
      },
      {
        id: 'scale-table',
        name: 'Cân đĩa thăng bằng',
        icon: '⚖️',
        timeToComplete: 'Phức tạp, dễ đổ',
        availability: 'Có ở góc khoa học',
        isOptimal: false,
        reason: 'Cần cốc hứng rồi trừ bì rất lâu và phức tạp đối với lứa tuổi mầm non.'
      }
    ]
  },
  {
    id: 'ch-fruits',
    title: 'Tình huống 3: So sánh quả dưa hấu và chùm nho',
    situation: 'Bé đi siêu thị cùng mẹ, muốn biết nhanh xem quả dưa hấu hay chùm nho nặng hơn.',
    goal: 'Biết ngay quả nào nặng hơn một cách trực quan.',
    bestToolId: 'balance-scale',
    options: [
      {
        id: 'balance-scale',
        name: 'Cân thăng bằng bập bênh',
        icon: '⚖️',
        timeToComplete: '3 giây (Thấy ngay)',
        availability: 'Sẵn tại quầy hoa quả',
        isOptimal: true,
        reason: 'Chính xác! Đặt mỗi quả lên một đĩa cân, bên đĩa dưa hấu hạ sát xuống đáy còn chùm nho bay lên cao là biết ngay!'
      },
      {
        id: 'ruler-fruit',
        name: 'Thước kẻ đo chiều dài',
        icon: '📏',
        timeToComplete: 'Không chính xác',
        availability: 'Có trong túi',
        isOptimal: false,
        reason: 'Thước chỉ đo kích thước to nhỏ; có những quả to nhưng lại xốp nhẹ hơn quả đặc!'
      },
      {
        id: 'steps',
        name: 'Đếm bước chân',
        icon: '👣',
        timeToComplete: 'Không đo được',
        availability: 'Sẵn có',
        isOptimal: false,
        reason: 'Bước chân chỉ dùng để đo khoảng cách đi lại, không so sánh được cân nặng.'
      },
      {
        id: 'water-overflow',
        name: 'Bể nước tràn đo dung tích',
        icon: '🌊',
        timeToComplete: '20 phút (Ướt nhèm)',
        availability: 'Phải đi tìm xô nước',
        isOptimal: false,
        reason: 'Quá rườm rà, làm ướt hoa quả và không đo trực tiếp được trọng lượng.'
      }
    ]
  },
  {
    id: 'ch-bear-waist',
    title: 'Tình huống 4: Đo vòng bụng bạn Gấu Bông may đai',
    situation: 'Bạn Gấu bông được tặng chiếc áo mới, cô cần đo vòng bụng tròn xoe của bạn để cắt may dải đai lưng.',
    goal: 'Đo chu vi vòng cung tròn quanh thân gấu.',
    bestToolId: 'soft-tape',
    options: [
      {
        id: 'soft-tape',
        name: 'Sợi len mềm / Thước dây mềm',
        icon: '🧵',
        timeToComplete: '10 giây (Dễ ôm trọn)',
        availability: 'Có sẵn trong giỏ đồ chơi',
        isOptimal: true,
        reason: 'Tuyệt vời! Sợi dây mềm mại uốn cong vòng quanh bụng tròn của bạn Gấu cực kỳ dễ dàng và đo chuẩn xác!'
      },
      {
        id: 'wood-ruler',
        name: 'Thước kẻ gỗ cứng thẳng đơ',
        icon: '📏',
        timeToComplete: 'Không đo được',
        availability: 'Có trên bàn',
        isOptimal: false,
        reason: 'Thước gỗ cứng không thể bẻ cong được, nếu cố uốn sẽ làm gãy thước!'
      },
      {
        id: 'water-cup',
        name: 'Ca đong nước',
        icon: '🥛',
        timeToComplete: 'Không làm được',
        availability: 'Có trong bếp',
        isOptimal: false,
        reason: 'Không thể nhét bạn gấu bông vào ca nước được, bạn gấu sẽ bị ướt sũng!'
      },
      {
        id: 'foot-step',
        name: 'Bước chân bé',
        icon: '👣',
        timeToComplete: 'Không đo được',
        availability: 'Sẵn có',
        isOptimal: false,
        reason: 'Bụng bạn gấu nhỏ hơn bàn chân của bé, không dùng bước chân để đo được.'
      }
    ]
  }
];

export const SimMeasurementLab: React.FC<Props> = () => {
  // Main Tab: 'part1-improved' vs 'part2-discovery'
  const [activeTab, setActiveTab] = useState<'part1-improved' | 'part2-discovery'>('part1-improved');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Chào bé! Hôm nay cô và bé cùng học cách đo đạc thông minh: dùng đúng công cụ nhanh nhất và sẵn có nhất nhé!'
  );

  // =========================================================================
  // PART 1: BASIC MEASUREMENT LAB STATE
  // =========================================================================
  const [part1Tool, setPart1Tool] = useState<'ruler' | 'beaker' | 'balance'>('ruler');

  // Ruler state
  const [selectedMeasureItem, setSelectedMeasureItem] = useState<MeasureItem>(MEASURE_ITEMS[0]);

  // Beaker state
  const [liquidMl, setLiquidMl] = useState<number>(100);

  // Balance scale state
  const [leftWeight, setLeftWeight] = useState<number>(100); // grams
  const [rightWeight, setRightWeight] = useState<number>(50); // grams

  // =========================================================================
  // PART 2: OPTIMAL TOOL SELECTION CHALLENGE STATE
  // =========================================================================
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState<number>(0);
  const currentChallenge = MEASUREMENT_CHALLENGES[selectedChallengeIdx];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<{
    isOptimal: boolean;
    reason: string;
  } | null>(null);

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    const opt = currentChallenge.options.find((o) => o.id === optId);
    if (!opt) return;

    setChallengeResult({
      isOptimal: opt.isOptimal,
      reason: opt.reason
    });

    if (opt.isOptimal) {
      if (soundEnabled) soundEngine.playMagicChime();
      setMascotMessage(`🎉 CHÍNH XÁC! Bé chọn công cụ rất thông minh! ${opt.reason}`);
    } else {
      setMascotMessage(`Bé xem lại tiêu chí "Sẵn có & Nhanh nhất" nhé: ${opt.reason}`);
    }
  };

  const handleNextChallenge = () => {
    setSelectedChallengeIdx((prev) => (prev + 1) % MEASUREMENT_CHALLENGES.length);
    setSelectedOptionId(null);
    setChallengeResult(null);
    setMascotMessage('Hãy đọc kỹ tình huống tiếp theo và tìm công cụ đo nhanh nhất nhé!');
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border-2 border-emerald-500 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wide">
              Thí nghiệm 3 • Mầm non (4 - 6 tuổi)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold font-mono">
              Làm quen Biểu tượng Toán & Đo lường
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Ruler className="w-6 h-6 text-amber-300" />
            <span>Thí nghiệm Về Đo Lường Thông Minh</span>
          </h2>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl">
          <button
            onClick={() => setActiveTab('part1-improved')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === 'part1-improved'
                ? 'bg-white text-indigo-900 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phần 1: Trạm Đo Lường Trực Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('part2-discovery')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === 'part2-discovery'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-slate-900" />
            <span>Phần 2: Thử Thách Chọn Công Cụ Nhanh Nhất</span>
          </button>
        </div>
      </div>

      {/* 2. Mascot Guidance Bar */}
      <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
            🦉
          </div>
          <p className="text-blue-950 dark:text-blue-200 font-medium">
            <strong>Bác Cú Thông Thái hướng dẫn:</strong> {mascotMessage}
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* 3. Main Body */}
      <div className="p-4 sm:p-6">
        {activeTab === 'part1-improved' ? (
          /* ========================================================================= */
          /* PHẦN 1: SẢN PHẨM CẢI TIẾN (TRẠM THỰC HÀNH ĐO LƯỜNG TRỰC QUAN ONLINE)       */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Tool switcher pills */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPart1Tool('ruler')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    part1Tool === 'ruler'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                  <span>Trạm 1: Đo Chiều Dài (cm)</span>
                </button>

                <button
                  onClick={() => setPart1Tool('beaker')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    part1Tool === 'beaker'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Beaker className="w-4 h-4" />
                  <span>Trạm 2: Đong Dung Tích (ml)</span>
                </button>

                <button
                  onClick={() => setPart1Tool('balance')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    part1Tool === 'balance'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Trạm 3: Cân Thăng Bằng (So Sánh Nặng - Nhẹ)</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                Thực hành đo lường cơ bản cho mầm non
              </span>
            </div>

            {part1Tool === 'ruler' && (
              /* --- TRẠM 1: ĐO CHIỀU DÀI VỚI THƯỚC KẺ --- */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center space-y-8 min-h-[300px]">
                    {/* Item being measured */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
                        <span>Vật đang đo:</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedMeasureItem.name}</span>
                      </div>

                      <div
                        style={{ width: `${selectedMeasureItem.widthPx}px` }}
                        className="h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-600 flex items-center justify-between px-3 shadow-md transition-all"
                      >
                        <span className="text-2xl">{selectedMeasureItem.icon}</span>
                        <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
                          {selectedMeasureItem.lengthCm} cm
                        </span>
                      </div>
                    </div>

                    {/* The Ruler */}
                    <div className="w-full max-w-[400px] h-16 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 dark:from-amber-900/80 dark:to-amber-950 rounded-xl border-2 border-amber-500 shadow-lg relative flex items-end pb-1 px-4">
                      {/* 20 Centimeter marks */}
                      <div className="w-full flex justify-between items-end">
                        {Array.from({ length: 21 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className={`w-0.5 bg-slate-900 dark:bg-slate-100 ${i % 5 === 0 ? 'h-6' : 'h-3'}`} />
                            {i % 2 === 0 && (
                              <span className="text-[9px] font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {i}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200">
                      Chọn Đồ Vật Để Đo
                    </h4>
                    <div className="space-y-2">
                      {MEASURE_ITEMS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedMeasureItem(item);
                            setMascotMessage(`Bé đã đặt cây thước đo "${item.name}". Chiều dài của vật là đúng ${item.lengthCm} centimet!`);
                            if (soundEnabled) soundEngine.playWaterDrop();
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                            selectedMeasureItem.id === item.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs text-slate-800 dark:text-slate-200">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                            {item.lengthCm} cm
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {part1Tool === 'beaker' && (
              /* --- TRẠM 2: ĐONG DUNG TÍCH (ML) --- */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
                  {/* Beaker representation */}
                  <div className="relative w-48 h-72 rounded-b-3xl border-4 border-slate-400 dark:border-slate-600 bg-white/40 dark:bg-slate-900/60 shadow-xl overflow-hidden flex flex-col justify-end p-2">
                    {/* Water Level */}
                    <div
                      style={{ height: `${(liquidMl / 250) * 100}%`, transition: 'height 0.5s ease' }}
                      className="w-full bg-sky-400/60 dark:bg-sky-500/50 rounded-b-2xl border-t-2 border-sky-300 relative flex items-center justify-center"
                    >
                      <span className="text-xs font-mono font-bold text-sky-950 dark:text-sky-100">
                        {liquidMl} ml
                      </span>
                    </div>

                    {/* Vạch ml marks */}
                    <div className="absolute inset-y-4 left-3 flex flex-col justify-between text-[10px] font-mono text-slate-500">
                      <span>- 250 ml (Đầy ca)</span>
                      <span>- 200 ml</span>
                      <span>- 150 ml</span>
                      <span>- 100 ml</span>
                      <span>- 50 ml</span>
                    </div>
                  </div>

                  <div className="text-sm font-bold font-mono text-sky-700 dark:text-sky-300">
                    Thể tích đo được: {liquidMl} ml
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200">
                      Rót Nước Đong Thể Tích
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Bấm vào các nút dưới đây để rót mức nước mong muốn:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[50, 100, 150, 200, 250].map((ml) => (
                        <button
                          key={ml}
                          onClick={() => {
                            setLiquidMl(ml);
                            setMascotMessage(`Bé vừa đong chính xác ${ml}ml chất lỏng vào ca đong!`);
                            if (soundEnabled) soundEngine.playWaterDrop();
                          }}
                          className={`p-3 rounded-xl border text-center transition font-mono font-bold text-xs ${
                            liquidMl === ml
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                          }`}
                        >
                          Rót {ml} ml
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {part1Tool === 'balance' && (
              /* --- TRẠM 3: CÂN THĂNG BẰNG --- */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[300px]">
                  {/* Balance Scale graphic */}
                  <div className="relative w-80 h-52 flex flex-col items-center justify-end">
                    {/* Pivot Pillar */}
                    <div className="w-4 h-32 bg-slate-700 rounded-t-md relative z-10" />
                    <div className="w-24 h-4 bg-slate-800 rounded-md" />

                    {/* Beam (tilt according to weights) */}
                    <div
                      style={{
                        transform: `rotate(${Math.max(-20, Math.min(20, (rightWeight - leftWeight) * 0.3))}deg)`,
                        transition: 'transform 0.6s ease'
                      }}
                      className="absolute top-10 w-72 h-3 bg-amber-500 rounded-full flex items-center justify-between px-2"
                    >
                      {/* Left Pan */}
                      <div className="relative -top-2 flex flex-col items-center">
                        <div className="w-0.5 h-16 bg-slate-500" />
                        <div className="w-20 h-5 bg-slate-400 rounded-b-xl border-2 border-slate-600 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md">
                          🍎 {leftWeight}g
                        </div>
                      </div>

                      {/* Center fulcrum */}
                      <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white" />

                      {/* Right Pan */}
                      <div className="relative -top-2 flex flex-col items-center">
                        <div className="w-0.5 h-16 bg-slate-500" />
                        <div className="w-20 h-5 bg-slate-400 rounded-b-xl border-2 border-slate-600 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md">
                          🪨 {rightWeight}g
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-4">
                    {leftWeight > rightWeight
                      ? '👈 Đĩa bên Trái (Quả Táo) NẶNG HƠN nên hạ xuống!'
                      : leftWeight < rightWeight
                      ? '👉 Đĩa bên Phải (Hòn Sỏi) NẶNG HƠN nên hạ xuống!'
                      : '⚖️ Hai bên BẰNG NHAU (Cân thăng bằng)'}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200">
                      Tùy Biến Trọng Lượng Đĩa Cân
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Đĩa Trái (Táo): {leftWeight}g</span>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          step="10"
                          value={leftWeight}
                          onChange={(e) => setLeftWeight(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                      </div>

                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Đĩa Phải (Sỏi): {rightWeight}g</span>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          step="10"
                          value={rightWeight}
                          onChange={(e) => setRightWeight(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* PHẦN 2: SẢN PHẨM KHÁM PHÁ (CHỌN CÔNG CỤ ĐO PHÙ HỢP HOÀN CẢNH: SẴN - DỄ - NHANH) */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* 3 Criteria Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-amber-950 dark:text-amber-200 font-medium">
                  <strong>3 Tiêu chí vàng chọn công cụ đo:</strong> 1. Sẵn có ngay • 2. Công cụ dễ thao tác • 3. Có cách đo nhanh nhất!
                </span>
              </div>
              <button
                onClick={handleNextChallenge}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-mono transition self-start sm:self-auto"
              >
                Đổi Tình Huống Tiếp Theo ➡️
              </button>
            </div>

            {/* Current Challenge Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  Tình huống thực tế {selectedChallengeIdx + 1}/4
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentChallenge.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {currentChallenge.situation}
                </p>
                <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                  🎯 Mục tiêu của bé: {currentChallenge.goal}
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentChallenge.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                        isSelected
                          ? opt.isOptimal
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-400/50'
                            : 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-400/50'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-blue-400 hover:scale-[1.01]'
                      }`}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{opt.name}</span>
                          {isSelected && (
                            <span className={opt.isOptimal ? 'text-emerald-600' : 'text-rose-500'}>
                              {opt.isOptimal ? '✓ Đúng nhất' : '✕ Chưa tối ưu'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {opt.timeToComplete}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Độ sẵn có: {opt.availability}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Result explanation box */}
              {challengeResult && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 animate-fadeIn ${
                    challengeResult.isOptimal
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-950 dark:text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {challengeResult.isOptimal ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Phân tích vì sao đây là lựa chọn xuất sắc:</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Chưa đạt tiêu chí tối ưu:</span>
                      </>
                    )}
                  </div>
                  <p>{challengeResult.reason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

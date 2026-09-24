import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  AlertTriangle, 
  Waves, 
  Flame, 
  Ship, 
  Search, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  Lightbulb
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  onBackToTable?: () => void;
}

// Items for Part 1 - Sink or Float tank
interface SinkItem {
  id: string;
  name: string;
  icon: string;
  weightGrams: number;
  floats: boolean;
  desc: string;
  densityNote: string;
  inTank: boolean;
}

const INITIAL_SINK_ITEMS: SinkItem[] = [
  { id: 'item-pebble', name: 'Hòn sỏi', icon: '🪨', weightGrams: 45, floats: false, desc: 'Đá tự nhiên', densityNote: 'Đặc, nặng hơn nước nên chìm sâu xuống đáy', inTank: false },
  { id: 'item-spoon', name: 'Thìa inox', icon: '🥄', weightGrams: 35, floats: false, desc: 'Kim loại', densityNote: 'Kim loại đặc nặng hơn nước nên chìm', inTank: false },
  { id: 'item-pingpong', name: 'Bóng bàn', icon: '⚪', weightGrams: 3, floats: true, desc: 'Nhựa rỗng ruột', densityNote: 'Bên trong chứa đầy không khí nên nổi bồng bềnh', inTank: false },
  { id: 'item-foam', name: 'Mẩu xốp', icon: '🧱', weightGrams: 2, floats: true, desc: 'Xốp xốp nhẹ', densityNote: 'Cấu trúc nhiều túi khí li ti, siêu nhẹ nên nổi trên mặt', inTank: false },
  { id: 'item-leaf', name: 'Chiếc lá', icon: '🍃', weightGrams: 1, floats: true, desc: 'Lá cây tươi', densityNote: 'Diện tích bề mặt rộng và nhẹ nên nằm nổi trên mặt nước', inTank: false },
  { id: 'item-wood', name: 'Khối gỗ', icon: '🪵', weightGrams: 20, floats: true, desc: 'Gỗ khô', densityNote: 'Khối lượng riêng nhỏ hơn nước nên nổi lưng chừng', inTank: false },
  { id: 'item-apple', name: 'Quả táo', icon: '🍎', weightGrams: 60, floats: true, desc: 'Trái cây', densityNote: 'Trong ruột táo có 25% thể tích là khí nên nổi', inTank: false },
  { id: 'item-egg', name: 'Quả trứng', icon: '🥚', weightGrams: 50, floats: false, desc: 'Trứng gà tươi', densityNote: 'Đặc ruột nên chìm trong nước lọc bình thường', inTank: false }
];


interface Passenger {
  id: string;
  name: string;
  icon: string;
  weightGrams: number;
  type: 'friend' | 'stone';
}

const PASSENGERS_POOL: Passenger[] = [
  { id: 'p-bear', name: 'Gấu Bông Mimi', icon: '🐻', weightGrams: 15, type: 'friend' },
  { id: 'p-bunny', name: 'Bạn Thỏ Trắng', icon: '🐰', weightGrams: 15, type: 'friend' },
  { id: 'p-duck', name: 'Vịt Cao Su', icon: '🐥', weightGrams: 10, type: 'friend' },
  { id: 'p-stone-s', name: 'Hòn sỏi nhỏ', icon: '🪨', weightGrams: 20, type: 'stone' },
  { id: 'p-stone-m', name: 'Hòn sỏi to', icon: '🪨', weightGrams: 40, type: 'stone' }
];

export const SimSinkOrFloatLab: React.FC<Props> = () => {
  // Main Tab: 'part1-improved' (Sản phẩm Cải tiến) vs 'part2-discovery' (Sản phẩm Khám phá)
  const [activeTab, setActiveTab] = useState<'part1-improved' | 'part2-discovery'>('part1-improved');

  // Sub-mode for Part 1: 'tank' vs 'lava-lamp'
  const [part1Mode, setPart1Mode] = useState<'tank' | 'lava-lamp'>('tank');

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mascot guidance message
  const [message, setMessage] = useState<string>('Chào các bạn nhỏ! Hãy cùng cô khám phá xem vật nào chìm, vật nào nổi nhé!');

  // =========================================================================
  // PART 1A: SINK OR FLOAT TANK STATE
  // =========================================================================
  const [tankItems, setTankItems] = useState<SinkItem[]>(INITIAL_SINK_ITEMS);
  const [selectedItemToDrop, setSelectedItemToDrop] = useState<SinkItem | null>(null);
  const [showXRay, setShowXRay] = useState<boolean>(false);

  const handleSelectPredict = (item: SinkItem) => {
    setSelectedItemToDrop(item);
    setMessage(`Bé thử đoán xem: "${item.name} ${item.icon}" sẽ chìm nghỉm hay nổi bồng bềnh?`);
  };

  const handleDropItem = (predict: 'sink' | 'float') => {
    if (!selectedItemToDrop) return;

    // Update item status
    setTankItems((prev) =>
      prev.map((i) => (i.id === selectedItemToDrop.id ? { ...i, inTank: true } : i))
    );

    if (soundEnabled) {
      soundEngine.playWaterDrop();
    }

    const isCorrect = (predict === 'float' && selectedItemToDrop.floats) || (predict === 'sink' && !selectedItemToDrop.floats);
    if (isCorrect) {
      setMessage(`🎉 Bé đoán rất giỏi! ${selectedItemToDrop.name} ${selectedItemToDrop.floats ? 'nổi bồng bềnh trên mặt nước' : 'chìm xuống đáy'} vì ${selectedItemToDrop.densityNote}!`);
      if (soundEnabled) soundEngine.playMagicChime();
    } else {
      setMessage(`Ồ! ${selectedItemToDrop.name} ${selectedItemToDrop.floats ? 'thực ra nổi trên mặt nước' : 'thực ra chìm xuống đáy'}! Vì ${selectedItemToDrop.densityNote}.`);
    }
  };

  const handleResetTank = () => {
    setTankItems(INITIAL_SINK_ITEMS);
    setSelectedItemToDrop(null);
    setMessage('Đã làm sạch bể nước! Bé hãy chọn vật để thử nghiệm tiếp nhé.');
  };

  // =========================================================================
  // PART 1B: LAVA LAMP SIMULATOR STATE
  // =========================================================================
  const [lavaStep, setLavaStep] = useState<number>(0); // 0: rỗng, 1: có nước, 2: có dầu, 3: nhỏ màu, 4: thả sủi C
  const [isLavaBubbling, setIsLavaBubbling] = useState<boolean>(false);
  const [nightLightOn, setNightLightOn] = useState<boolean>(false);

  const handleNextLavaStep = () => {
    if (lavaStep === 0) {
      setLavaStep(1);
      setMessage('Bước 1: Rót nước vào bình! Nước trong suốt nằm ở nửa dưới.');
      if (soundEnabled) soundEngine.playWaterDrop();
    } else if (lavaStep === 1) {
      setLavaStep(2);
      setMessage('Bước 2: Rót dầu ăn vào bình! Dầu ăn nhẹ hơn nước nên nổi thành lớp màu vàng phía trên!');
      if (soundEnabled) soundEngine.playWaterDrop();
    } else if (lavaStep === 2) {
      setLavaStep(3);
      setMessage('Bước 3: Nhỏ giọt màu thực phẩm! Giọt màu nặng hơn dầu nên rơi xuyên qua lớp dầu xuống đáy nước.');
      if (soundEnabled) soundEngine.playWaterDrop();
    } else if (lavaStep === 3) {
      setLavaStep(4);
      setIsLavaBubbling(true);
      setMessage('Bước 4: Thả viên sủi C vào! Khí sủi bọt đẩy các giọt màu bay lên mặt dầu, vỡ khí lại chìm xuống tạo đèn dung nham tuyệt đẹp!');
      if (soundEnabled) soundEngine.playMagicChime();
    }
  };

  const handleResetLava = () => {
    setLavaStep(0);
    setIsLavaBubbling(false);
    setMessage('Đã rửa sạch bình! Bé bấm nút để bắt đầu chế tạo đèn dung nham mới nhé.');
  };

  // =========================================================================
  // PART 2: RESCUE RAFT DISCOVERY LAB STATE
  // =========================================================================
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: string]: number }>({
    foil: 1, // Giấy bạc
    straws: 2, // Ống hút
    sticks: 2, // Que kem
    foam: 1, // Tấm xốp
    caps: 2 // Nắp chai
  });

  const [onboardPassengers, setOnboardPassengers] = useState<Passenger[]>([]);
  const [raftLaunched, setRaftLaunched] = useState<boolean>(false);
  const [raftSunk, setRaftSunk] = useState<boolean>(false);
  const [journeySuccess, setJourneySuccess] = useState<boolean>(false);

  // Calculate total buoyancy capacity of raft
  const totalBuoyancy = (selectedMaterials.foil || 0) * 20 +
    (selectedMaterials.straws || 0) * 15 +
    (selectedMaterials.sticks || 0) * 10 +
    (selectedMaterials.foam || 0) * 35 +
    (selectedMaterials.caps || 0) * 12;

  // Calculate total passenger weight
  const totalWeight = onboardPassengers.reduce((sum, p) => sum + p.weightGrams, 0);

  // Sink threshold: if totalWeight > totalBuoyancy
  const isOverloaded = totalWeight > totalBuoyancy;

  const handleAddMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [matKey]: (prev[matKey] || 0) + 1
    }));
    if (soundEnabled) soundEngine.playWaterDrop();
  };

  const handleRemoveMaterial = (matKey: string) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [matKey]: Math.max(0, (prev[matKey] || 0) - 1)
    }));
  };

  const handleAddPassenger = (passenger: Passenger) => {
    if (onboardPassengers.length >= 6) {
      setMessage('Bè đã chật chỗ rồi, không thể chở thêm bạn nữa!');
      return;
    }
    const newPassengers = [...onboardPassengers, { ...passenger, id: `${passenger.id}-${Date.now()}` }];
    setOnboardPassengers(newPassengers);
    
    const newWeight = newPassengers.reduce((sum, p) => sum + p.weightGrams, 0);
    if (newWeight > totalBuoyancy) {
      setMessage(`⚠️ Ôi không! Bè đang chở ${newWeight}g nhưng chỉ nâng được ${totalBuoyancy}g! Nước sắp tràn vào chìm bè! Hãy thêm xốp hoặc nắp chai để tăng sức nâng nhé!`);
    } else {
      setMessage(`Đã đón ${passenger.name} lên bè! Tổng trọng lượng: ${newWeight}g / Sức chở tối đa: ${totalBuoyancy}g.`);
    }
    if (soundEnabled) soundEngine.playWaterDrop();
  };

  const handleRemovePassenger = (idx: number) => {
    const newPassengers = onboardPassengers.filter((_, i) => i !== idx);
    setOnboardPassengers(newPassengers);
    setRaftLaunched(false);
    setRaftSunk(false);
    setJourneySuccess(false);
  };

  const handleLaunchRaft = () => {
    if (onboardPassengers.length === 0) {
      setMessage('Chưa có hành khách nào trên bè! Hãy xếp bạn gấu hoặc sỏi lên trước khi qua sông nhé.');
      return;
    }

    setRaftLaunched(true);
    if (isOverloaded) {
      setRaftSunk(true);
      setJourneySuccess(false);
      setMessage(`💥 Ôi không! Chiếc bè quá tải (${totalWeight}g > ${totalBuoyancy}g), nước tràn vào làm bè chìm nghỉm giữa sông! Bé hãy gia cố thêm tấm xốp hoặc nắp chai nhé!`);
    } else {
      setRaftSunk(false);
      setJourneySuccess(true);
      setMessage(`🎉 Hoan hô! Chiếc bè kiên cố đã chở an toàn tất cả ${onboardPassengers.length} hành khách qua bờ sông bên kia! Bé là kỹ sư đóng tàu nhí tài ba!`);
      if (soundEnabled) soundEngine.playMagicChime();
    }
  };

  const handleResetRaft = () => {
    setOnboardPassengers([]);
    setRaftLaunched(false);
    setRaftSunk(false);
    setJourneySuccess(false);
    setMessage('Đã đưa bè về bến xuất phát! Bé hãy tiếp tục thử nghiệm tải trọng mới nhé.');
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border-2 border-emerald-500 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wide">
              Thí nghiệm 1 • Mầm non (3 - 6 tuổi)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold font-mono">
              Phát triển Khoa học & STEAM
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Waves className="w-6 h-6 text-amber-300" />
            <span>Thí nghiệm Sự Chìm, Nổi của Vật</span>
          </h2>
        </div>

        {/* Tab switchers: Phần 1 (Cải tiến) vs Phần 2 (Khám phá) */}
        <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl">
          <button
            onClick={() => setActiveTab('part1-improved')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === 'part1-improved'
                ? 'bg-white text-emerald-800 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phần 1: Sản phẩm Cải tiến</span>
          </button>

          <button
            onClick={() => setActiveTab('part2-discovery')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === 'part2-discovery'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Ship className="w-3.5 h-3.5 text-slate-900" />
            <span>Phần 2: Sản phẩm Khám phá</span>
          </button>
        </div>
      </div>

      {/* 2. Mascot Guidance Bar */}
      <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
            👩‍🏫
          </div>
          <p className="text-emerald-950 dark:text-emerald-200 font-medium">
            <strong>Cô Mimi hướng dẫn:</strong> {message}
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* 3. Main Interactive Body */}
      <div className="p-4 sm:p-6">
        {activeTab === 'part1-improved' ? (
          /* ========================================================================= */
          /* PHẦN 1: SẢN PHẨM CẢI TIẾN (TÁI HIỆN ONLINE: CHÌM NỔI + ĐÈN DUNG NHAM)    */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Mode selection within Part 1 */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPart1Mode('tank')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                    part1Mode === 'tank'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Waves className="w-4 h-4" />
                  <span>Bể Thử Nghiệm Chìm Nổi Trực Quan</span>
                </button>

                <button
                  onClick={() => setPart1Mode('lava-lamp')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                    part1Mode === 'lava-lamp'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>Chế Tạo Đèn Dung Nham (Lava Lamp)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                * Tái hiện hoạt động trực tiếp của giáo viên & trẻ để khám phá online nhanh hơn
              </div>
            </div>

            {part1Mode === 'tank' ? (
              /* --- SUB-MODE 1A: BỂ THỬ NGHIỆM CHÌM NỔI --- */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left side: Physics Water Tank (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative w-full h-[360px] rounded-2xl border-4 border-sky-400/60 dark:border-sky-500/40 bg-gradient-to-b from-sky-50/50 via-sky-100/30 to-blue-200/50 dark:from-slate-900 dark:via-blue-950/30 dark:to-blue-900/40 overflow-hidden shadow-inner flex flex-col justify-end p-4">
                    {/* Air section (top) */}
                    <div className="absolute top-2 left-4 text-[10px] font-mono text-sky-700/60 dark:text-sky-300/60 uppercase tracking-widest">
                      Không khí
                    </div>

                    {/* Water surface line */}
                    <div className="absolute top-[90px] left-0 right-0 h-1 bg-sky-400/80 dark:bg-sky-400/60 flex items-center justify-between px-3">
                      <span className="text-[9px] font-mono text-sky-800 dark:text-sky-200 bg-white/70 dark:bg-slate-900/80 px-1 rounded">
                        Mặt nước ~ 0 cm
                      </span>
                      <span className="text-[9px] font-mono text-sky-700 dark:text-sky-300">
                        Sóng nước êm dịu 〰️
                      </span>
                    </div>

                    {/* Water body with subtle bubble animations */}
                    <div className="absolute top-[92px] bottom-0 left-0 right-0 bg-gradient-to-b from-sky-400/20 via-sky-500/25 to-blue-600/30 pointer-events-none">
                      <div className="absolute bottom-6 left-12 w-2 h-2 rounded-full bg-white/40 animate-ping" />
                      <div className="absolute bottom-16 right-20 w-3 h-3 rounded-full bg-white/30 animate-pulse" />
                    </div>

                    {/* Tank Bottom (Sandy bed) */}
                    <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-amber-200/80 to-amber-100/60 dark:from-amber-950/60 dark:to-slate-900 border-t border-amber-300/40 flex items-center justify-center text-[10px] font-mono text-amber-800 dark:text-amber-300">
                      Đáy bể nước
                    </div>

                    {/* Render Dropped Items Inside Tank */}
                    <div className="relative z-10 w-full h-full">
                      {tankItems.filter((i) => i.inTank).map((item, idx) => {
                        return (
                          <div
                            key={item.id}
                            style={{
                              position: 'absolute',
                              left: `${15 + (idx % 5) * 18}%`,
                              top: item.floats ? '72px' : '285px',
                              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                            className="group cursor-pointer flex flex-col items-center"
                            onClick={() => setMessage(`Bé đang quan sát ${item.name}: ${item.densityNote}`)}
                          >
                            <span className="text-3xl filter drop-shadow hover:scale-125 transition-transform">
                              {item.icon}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-xs mt-0.5 whitespace-nowrap">
                              {item.name} ({item.floats ? 'NỔI' : 'CHÌM'})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tank Controls */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => setShowXRay(!showXRay)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono transition ${
                        showXRay
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{showXRay ? 'Tắt Kính Lúp X-Ray' : 'Bật Kính Lúp X-Ray (Soi cấu trúc rỗng)'}</span>
                    </button>

                    <button
                      onClick={handleResetTank}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm sạch bể nước</span>
                    </button>
                  </div>
                </div>

                {/* Right side: Items Palette & Prediction (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Khay Đồ Vật Thí Nghiệm</span>
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-mono">
                        Chọn 1 vật để thả
                      </span>
                    </h3>

                    {/* Grid of items */}
                    <div className="grid grid-cols-4 gap-2">
                      {tankItems.map((item) => (
                        <button
                          key={item.id}
                          disabled={item.inTank}
                          onClick={() => handleSelectPredict(item)}
                          className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                            item.inTank
                              ? 'opacity-30 bg-slate-200 dark:bg-slate-800 border-transparent cursor-not-allowed'
                              : selectedItemToDrop?.id === item.id
                              ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/50'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:scale-105'
                          }`}
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Prediction Area */}
                    {selectedItemToDrop && !selectedItemToDrop.inTank && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedItemToDrop.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {selectedItemToDrop.name} ({selectedItemToDrop.desc})
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400">
                              Bé đoán vật này sẽ thế nào khi thả vào nước?
                            </div>
                          </div>
                        </div>

                        {showXRay && (
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 text-[10px] font-mono border border-purple-300 dark:border-purple-800">
                            🔍 <strong>Soi X-Ray:</strong> {selectedItemToDrop.densityNote}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleDropItem('float')}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs font-mono shadow-xs transition"
                          >
                            <span>🌊 Đoán SẼ NỔI</span>
                          </button>
                          <button
                            onClick={() => handleDropItem('sink')}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs font-mono shadow-xs transition"
                          >
                            <span>⚓ Đoán SẼ CHÌM</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      <span>Nguyên lý rút ra cho trẻ:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      • <strong>Vật chìm:</strong> Vật đặc, nặng hơn nước (sắt, đá) không đủ lực nâng nên rơi xuống đáy.<br />
                      • <strong>Vật nổi:</strong> Vật nhẹ, rỗng có túi khí (bóng bàn, xốp, gỗ) được nước nâng bồng bềnh!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* --- SUB-MODE 1B: CHẾ TẠO ĐÈN DUNG NHAM (LAVA LAMP) --- */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left side: Lava Lamp Flask (6 cols) */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
                  <div
                    className={`relative w-48 h-[380px] rounded-3xl border-4 transition-all duration-500 overflow-hidden flex flex-col justify-end p-2 ${
                      nightLightOn
                        ? 'border-amber-400 bg-slate-950 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-xl'
                    }`}
                  >
                    {/* Top cap of flask */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-400 dark:bg-slate-600 rounded-b-md" />

                    {/* Empty state prompt */}
                    {lavaStep === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                        <Flame className="w-8 h-8 text-slate-300 mb-2" />
                        <span>Bình thủy tinh đang rỗng. Bấm "Bước tiếp theo" để thêm nước!</span>
                      </div>
                    )}

                    {/* Step 1: Water Layer at bottom (35% height) */}
                    {lavaStep >= 1 && (
                      <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-sky-400/40 border-t border-sky-300/50 flex items-center justify-center text-[10px] font-mono text-sky-800 dark:text-sky-200">
                        Lớp Nước Lọc (Nặng hơn)
                      </div>
                    )}

                    {/* Step 2: Oil Layer at top (60% height) */}
                    {lavaStep >= 2 && (
                      <div className="absolute bottom-[35%] left-0 right-0 h-[60%] bg-amber-300/35 border-t border-amber-300/60 flex items-center justify-center text-[10px] font-mono text-amber-800 dark:text-amber-300">
                        Lớp Dầu Ăn (Nhẹ hơn nổi lên)
                      </div>
                    )}

                    {/* Step 3: Color Drops sinking through oil */}
                    {lavaStep >= 3 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Drops sitting in water */}
                        <div className="absolute bottom-3 left-6 w-5 h-5 rounded-full bg-red-500/80 shadow-xs" />
                        <div className="absolute bottom-4 left-16 w-6 h-6 rounded-full bg-purple-600/80 shadow-xs" />
                        <div className="absolute bottom-2 right-8 w-5 h-5 rounded-full bg-orange-500/80 shadow-xs" />
                      </div>
                    )}

                    {/* Step 4: Effervescent bubbling reaction (Lava flow) */}
                    {isLavaBubbling && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Effervescent tablet at bottom */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white shadow-md animate-pulse" />

                        {/* Rising colored lava blobs */}
                        <div className="absolute bottom-6 left-8 w-7 h-7 rounded-full bg-red-500 animate-bounce transition-all opacity-85 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                        <div className="absolute bottom-14 right-10 w-9 h-9 rounded-full bg-purple-600 animate-pulse transition-all opacity-85 shadow-[0_0_14px_rgba(168,85,247,0.8)]" />
                        <div className="absolute top-28 left-16 w-8 h-8 rounded-full bg-orange-500 animate-bounce transition-all opacity-85 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                        <div className="absolute top-16 right-12 w-6 h-6 rounded-full bg-pink-500 animate-pulse transition-all opacity-85 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                      </div>
                    )}

                    {/* Base stand */}
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-800 rounded-b-2xl" />
                  </div>

                  {/* Night light toggle */}
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

                {/* Right side: 4-Step Instructions (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>4 Bước Chế Tạo Đèn Dung Nham</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                        Bước {lavaStep}/4
                      </span>
                    </h3>

                    {/* Step progress pills */}
                    <div className="space-y-2">
                      <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition ${
                        lavaStep >= 1 ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-200 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}>
                        <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center font-mono text-[10px]">1</span>
                        <span>Rót nước lọc vào 1/3 bình (Nước nặng hơn nằm dưới đáy)</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition ${
                        lavaStep >= 2 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}>
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-mono text-[10px]">2</span>
                        <span>Rót dầu ăn đầy bình (Dầu ăn nhẹ hơn nên nổi bồng bềnh phía trên)</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition ${
                        lavaStep >= 3 ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-900 dark:text-purple-200 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}>
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center font-mono text-[10px]">3</span>
                        <span>Nhỏ vài giọt màu thực phẩm (Giọt màu chìm qua dầu, đọng lại trong nước)</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition ${
                        lavaStep >= 4 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}>
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-mono text-[10px]">4</span>
                        <span>Thả viên sủi C vào (Bọt khí đẩy giọt màu trồi lên rồi rơi xuống chu kỳ)</span>
                      </div>
                    </div>

                    {/* Step button */}
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
                        <div className="flex-1 p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center font-mono">
                          🎉 Đèn Dung Nham đang hoạt động rực rỡ!
                        </div>
                      )}

                      <button
                        onClick={handleResetLava}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                        title="Rửa bình làm lại"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* PHẦN 2: SẢN PHẨM KHÁM PHÁ (CHẾ TẠO BÈ CỨU HỘ VƯỢT SÔNG CHỞ SỎI/HÀNH KHÁCH) */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Ship className="w-5 h-5 text-emerald-600" />
                  <span>Xưởng Chế Tạo Bè Cứu Hộ Vượt Sông</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thử thách tư duy: Lắp ráp các vật liệu nổi để tạo bè chở được số lượng hành khách hoặc đồ vật (sỏi) qua sông an toàn.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                  Sức chở: {totalBuoyancy}g | Tải thực: {totalWeight}g
                </span>
                <button
                  onClick={handleResetRaft}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: River Simulation with Floating Raft (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative w-full h-[380px] rounded-2xl border-4 border-emerald-500/50 bg-gradient-to-b from-sky-200 via-sky-300/60 to-blue-400/50 dark:from-slate-900 dark:via-sky-950/40 dark:to-blue-900/60 overflow-hidden shadow-xl p-4 flex flex-col justify-between">
                  {/* Two River Banks */}
                  <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-emerald-600 to-emerald-700/80 border-r-2 border-emerald-800/40 flex flex-col items-center justify-center p-2 z-10">
                    <span className="text-[10px] font-bold text-white font-mono [writing-mode:vertical-lr] tracking-widest">
                      🚩 BẾN XUẤT PHÁT
                    </span>
                  </div>

                  <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-emerald-600 to-emerald-700/80 border-l-2 border-emerald-800/40 flex flex-col items-center justify-center p-2 z-10">
                    <span className="text-[10px] font-bold text-white font-mono [writing-mode:vertical-lr] tracking-widest">
                      🏁 BỜ BÊN KIA
                    </span>
                  </div>

                  {/* Flowing Water Surface */}
                  <div className="absolute inset-0 left-16 right-16 flex items-center justify-center pointer-events-none opacity-40">
                    <span className="text-4xl animate-pulse">〰️ 〰️ 〰️</span>
                  </div>

                  {/* Warning banner if overloaded */}
                  {isOverloaded && (
                    <div className="relative z-20 mx-auto px-3 py-1.5 rounded-full bg-rose-500/90 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg animate-bounce">
                      <AlertTriangle className="w-4 h-4" />
                      <span>CẢNH BÁO: Quá tải! Nước sắp tràn làm chìm bè!</span>
                    </div>
                  )}

                  {/* The Interactive Raft */}
                  <div
                    style={{
                      transform: raftLaunched
                        ? journeySuccess
                          ? 'translateX(140px)'
                          : 'translateX(70px) translateY(80px) rotate(15deg)'
                        : 'translateX(0px)',
                      transition: 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    className={`relative z-20 mx-auto my-auto w-64 p-3 rounded-2xl border-4 transition-all ${
                      raftSunk
                        ? 'bg-blue-900/80 border-rose-500 opacity-60'
                        : isOverloaded
                        ? 'bg-amber-100 dark:bg-amber-900/60 border-rose-500 ring-4 ring-rose-400/40'
                        : 'bg-amber-200/90 dark:bg-amber-900/80 border-amber-600 dark:border-amber-500 shadow-2xl'
                    }`}
                  >
                    {/* Raft Structure Materials Preview */}
                    <div className="text-[9px] font-mono text-center font-bold text-amber-900 dark:text-amber-200 border-b border-amber-400/40 pb-1 mb-2">
                      BÈ CỨU HỘ ({totalBuoyancy}g sức nâng)
                    </div>

                    {/* Passenger slots */}
                    <div className="min-h-[70px] grid grid-cols-3 gap-1.5 items-center justify-center p-1 bg-white/40 dark:bg-black/20 rounded-xl">
                      {onboardPassengers.length === 0 ? (
                        <div className="col-span-3 text-center text-[10px] text-amber-900/70 dark:text-amber-300 italic py-2">
                          Chưa có hành khách. Hãy chọn ở bảng bên phải!
                        </div>
                      ) : (
                        onboardPassengers.map((p, idx) => (
                          <div
                            key={p.id}
                            onClick={() => handleRemovePassenger(idx)}
                            className="p-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-700 flex flex-col items-center cursor-pointer hover:bg-rose-100 transition shadow-2xs group"
                            title="Nhấn để đưa khách rời bè"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">{p.icon}</span>
                            <span className="text-[8px] font-mono text-slate-700 dark:text-slate-300">{p.weightGrams}g</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Waterline visual indicator */}
                    <div className="mt-2 pt-1 border-t border-amber-400/60 flex items-center justify-between text-[9px] font-mono">
                      <span className="text-slate-700 dark:text-slate-300">Mớn nước:</span>
                      <span className={isOverloaded ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                        {Math.min(100, Math.round((totalWeight / totalBuoyancy) * 100))}% {isOverloaded ? '(NGẬP)' : '(AN TOÀN)'}
                      </span>
                    </div>
                  </div>

                  {/* Launch button */}
                  <div className="relative z-20 flex items-center justify-center gap-3">
                    <button
                      onClick={handleLaunchRaft}
                      disabled={raftLaunched && journeySuccess}
                      className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs font-mono shadow-lg transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{raftLaunched && journeySuccess ? 'ĐÃ SANG BỜ AN TOÀN' : 'KHỞI HÀNH QUA SÔNG'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Materials Selection & Passenger Boarding (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. Raft Crafting Materials */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>1. Vật Liệu Lắp Ráp Bè</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
                      + Tăng sức nâng
                    </span>
                  </h4>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🧱</span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Tấm xốp EVA</div>
                          <div className="text-[10px] text-slate-500">+35g sức nổi / tấm</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('foam')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.foam || 0}</span>
                        <button onClick={() => handleAddMaterial('foam')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🥤</span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Ống hút nhựa</div>
                          <div className="text-[10px] text-slate-500">+15g sức nổi / bó</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('straws')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.straws || 0}</span>
                        <button onClick={() => handleAddMaterial('straws')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔘</span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Nắp chai nhựa rỗng</div>
                          <div className="text-[10px] text-slate-500">+12g sức nổi / cái</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('caps')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.caps || 0}</span>
                        <button onClick={() => handleAddMaterial('caps')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🪵</span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Que kem gỗ</div>
                          <div className="text-[10px] text-slate-500">+10g tạo sàn bè</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRemoveMaterial('sticks')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Minus className="w-3 h-3" /></button>
                        <span className="font-mono font-bold w-4 text-center">{selectedMaterials.sticks || 0}</span>
                        <button onClick={() => handleAddMaterial('sticks')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Board Passengers & Stones */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>2. Xếp Hành Khách / Vật Tải</span>
                    <span className="text-sky-600 dark:text-sky-400 text-[10px] font-mono">
                      Bấm để xếp lên bè
                    </span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {PASSENGERS_POOL.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAddPassenger(p)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex flex-col items-center justify-center transition hover:scale-105 shadow-xs"
                      >
                        <span className="text-2xl">{p.icon}</span>
                        <span className="text-[10px] font-medium text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">{p.name}</span>
                        <span className="text-[9px] font-mono text-slate-500">+{p.weightGrams}g</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

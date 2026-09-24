import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Shirt, 
  Award, 
  Volume2, 
  VolumeX, 
  Droplet
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEffects';

interface Props {
  onBackToTable?: () => void;
}

// Color definitions for Part 1
interface PrimaryColor {
  id: string;
  name: string;
  hex: string;
  type: 'primary' | 'modifier';
  r: number;
  g: number;
  b: number;
}

const PRIMARY_COLORS: PrimaryColor[] = [
  { id: 'c-red', name: 'Đỏ', hex: '#ef4444', type: 'primary', r: 239, g: 68, b: 68 },
  { id: 'c-yellow', name: 'Vàng', hex: '#eab308', type: 'primary', r: 234, g: 179, b: 8 },
  { id: 'c-blue', name: 'Xanh lam', hex: '#3b82f6', type: 'primary', r: 59, g: 130, b: 246 },
  { id: 'c-white', name: 'Trắng (Làm sáng)', hex: '#ffffff', type: 'modifier', r: 255, g: 255, b: 255 },
  { id: 'c-black', name: 'Đen (Làm đậm)', hex: '#1e293b', type: 'modifier', r: 30, g: 41, b: 59 }
];

// Themes for Part 2
interface FashionTheme {
  id: string;
  title: string;
  icon: string;
  description: string;
  requiredGroup: string;
  requiredColors: { name: string; hex: string }[];
  accentColor: string;
}

const FASHION_THEMES: FashionTheme[] = [
  {
    id: 'spring',
    title: 'Lễ Hội Mùa Xuân Ấm Áp',
    icon: '🌸',
    description: 'Bé hãy phối trang phục đón Tết rực rỡ với nhóm màu nóng ấm áp: Đỏ, Cam, Vàng!',
    requiredGroup: 'Màu Nóng (Warm tones)',
    requiredColors: [
      { name: 'Đỏ thắm', hex: '#ef4444' },
      { name: 'Cam tươi', hex: '#f97316' },
      { name: 'Vàng mai', hex: '#eab308' },
      { name: 'Hồng đào', hex: '#f43f5e' }
    ],
    accentColor: '#f97316'
  },
  {
    id: 'ocean',
    title: 'Thám Hiểm Biển Xanh & Rừng Sâu',
    icon: '🌊',
    description: 'Bé hãy phối trang phục dã ngoại mát dịu với nhóm màu thiên nhiên: Xanh lam, Xanh ngọc, Xanh lá!',
    requiredGroup: 'Màu Lạnh & Thiên Nhiên (Cool tones)',
    requiredColors: [
      { name: 'Xanh lam', hex: '#0284c7' },
      { name: 'Xanh lá', hex: '#22c55e' },
      { name: 'Xanh ngọc', hex: '#06b6d4' },
      { name: 'Xanh cốm', hex: '#84cc16' }
    ],
    accentColor: '#0284c7'
  },
  {
    id: 'space',
    title: 'Phi Hành Gia Khám Phá Vũ Trụ',
    icon: '🚀',
    description: 'Bé hãy phối trang phục thám hiểm các vì sao với nhóm màu huyền bí: Tím ngân hà, Xanh thẫm, Trắng bạc!',
    requiredGroup: 'Màu Vũ Trụ & Tương Lai',
    requiredColors: [
      { name: 'Tím huyền bí', hex: '#9333ea' },
      { name: 'Xanh vũ trụ', hex: '#1e3a8a' },
      { name: 'Tím hồng', hex: '#c026d3' },
      { name: 'Trắng ánh kim', hex: '#f1f5f9' }
    ],
    accentColor: '#9333ea'
  }
];

export const SimColorMixerLab: React.FC<Props> = () => {
  // Main Tab: 'part1-improved' vs 'part2-discovery'
  const [activeTab, setActiveTab] = useState<'part1-improved' | 'part2-discovery'>('part1-improved');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Chào mừng bé đến với Thế giới Màu sắc! Bé hãy nhỏ các giọt màu vào cốc nước thần kỳ nhé!'
  );

  // =========================================================================
  // PART 1: MAGIC COLOR FLASK STATE
  // =========================================================================
  const [dropsInFlask, setDropsInFlask] = useState<PrimaryColor[]>([]);
  const [isStirred, setIsStirred] = useState<boolean>(false);
  const [savedColors, setSavedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Cam tươi', hex: '#f97316' },
    { name: 'Xanh lá', hex: '#22c55e' },
    { name: 'Tím mộng mơ', hex: '#a855f7' }
  ]);

  // Compute mixed color
  const computeMixedColor = (): { hex: string; name: string; formula: string } => {
    if (dropsInFlask.length === 0) {
      return { hex: '#f8fafc', name: 'Nước lọc trong suốt', formula: 'Chưa nhỏ màu' };
    }

    let avgR = dropsInFlask.reduce((s, c) => s + c.r, 0) / dropsInFlask.length;
    let avgG = dropsInFlask.reduce((s, c) => s + c.g, 0) / dropsInFlask.length;
    let avgB = dropsInFlask.reduce((s, c) => s + c.b, 0) / dropsInFlask.length;

    // Detect basic combinations
    const hasRed = dropsInFlask.some((c) => c.id === 'c-red');
    const hasYellow = dropsInFlask.some((c) => c.id === 'c-yellow');
    const hasBlue = dropsInFlask.some((c) => c.id === 'c-blue');
    const hasWhite = dropsInFlask.some((c) => c.id === 'c-white');
    const hasBlack = dropsInFlask.some((c) => c.id === 'c-black');

    let name = 'Màu pha đặc biệt';
    let formula = dropsInFlask.map((c) => c.name).join(' + ');

    if (hasRed && hasYellow && !hasBlue) {
      name = hasWhite ? 'Màu Cam sữa pastel' : 'Màu Cam rực rỡ';
      avgR = 249; avgG = 115; avgB = 22;
      if (hasWhite) { avgR = 254; avgG = 180; avgB = 120; }
    } else if (hasYellow && hasBlue && !hasRed) {
      name = hasWhite ? 'Màu Xanh ngọc dịu dàng' : 'Màu Xanh lá cây tươi mát';
      avgR = 34; avgG = 197; avgB = 94;
      if (hasWhite) { avgR = 110; avgG = 231; avgB = 183; }
    } else if (hasRed && hasBlue && !hasYellow) {
      name = hasWhite ? 'Màu Tím hoa cà sáng' : 'Màu Tím quý phái';
      avgR = 168; avgG = 85; avgB = 247;
      if (hasWhite) { avgR = 216; avgG = 180; avgB = 254; }
    } else if (hasRed && hasYellow && hasBlue) {
      name = 'Màu Nâu đất';
      avgR = 120; avgG = 53; avgB = 15;
    } else if (dropsInFlask.length === 1) {
      name = `Màu ${dropsInFlask[0].name} thuần khiết`;
    }

    if (hasBlack && dropsInFlask.length > 1) {
      avgR = Math.max(20, avgR * 0.6);
      avgG = Math.max(20, avgG * 0.6);
      avgB = Math.max(20, avgB * 0.6);
      name += ' (Tông trầm)';
    }

    const hex = `rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)})`;
    return { hex, name, formula };
  };

  const mixedColorInfo = computeMixedColor();

  const handleAddDrop = (color: PrimaryColor) => {
    if (dropsInFlask.length >= 6) {
      setMascotMessage('Cốc đã đầy màu rồi! Bé hãy nhấn "Khuấy đều" hoặc làm sạch cốc để pha lại nhé.');
      return;
    }
    const newDrops = [...dropsInFlask, color];
    setDropsInFlask(newDrops);
    setIsStirred(false);

    if (soundEnabled) soundEngine.playWaterDrop();
    setMascotMessage(`Bé vừa nhỏ thêm giọt màu ${color.name}! Giọt màu đang loang nhẹ trong nước.`);
  };

  const handleStir = () => {
    if (dropsInFlask.length === 0) return;
    setIsStirred(true);
    if (soundEnabled) soundEngine.playMagicChime();
    setMascotMessage(`✨ Biến hình! Các giọt màu hòa quyện tạo thành: ${mixedColorInfo.name} (${mixedColorInfo.formula})!`);
  };

  const handleSaveColor = () => {
    if (!isStirred || dropsInFlask.length === 0) return;
    if (!savedColors.some((c) => c.name === mixedColorInfo.name)) {
      setSavedColors((prev) => [...prev, { name: mixedColorInfo.name, hex: mixedColorInfo.hex }]);
      setMascotMessage(`🎨 Tuyệt vời! Đã lưu "${mixedColorInfo.name}" vào Khay Màu Thời Trang của bé!`);
      if (soundEnabled) soundEngine.playMagicChime();
    }
  };

  const handleResetFlask = () => {
    setDropsInFlask([]);
    setIsStirred(false);
    setMascotMessage('Đã rửa sạch cốc nước! Bé hãy chọn những giọt màu mới để pha chế nhé.');
  };

  // =========================================================================
  // PART 2: FASHION DESIGNER STUDIO STATE
  // =========================================================================
  const [selectedThemeId, setSelectedThemeId] = useState<string>('spring');
  const currentTheme = FASHION_THEMES.find((t) => t.id === selectedThemeId) || FASHION_THEMES[0];

  // Colors applied to outfit pieces
  const [outfitColors, setOutfitColors] = useState<{
    hat: string;
    shirt: string;
    skirt: string;
    shoes: string;
    bow: string;
  }>({
    hat: '#f97316',
    shirt: '#ef4444',
    skirt: '#eab308',
    shoes: '#ffffff',
    bow: '#f43f5e'
  });

  const [activeBrushColor, setActiveBrushColor] = useState<string>('#ef4444');
  const [fashionFeedback, setFashionFeedback] = useState<string | null>(null);
  const [fashionAward, setFashionAward] = useState<boolean>(false);

  const handleApplyColor = (piece: 'hat' | 'shirt' | 'skirt' | 'shoes' | 'bow') => {
    setOutfitColors((prev) => ({
      ...prev,
      [piece]: activeBrushColor
    }));
    if (soundEnabled) soundEngine.playWaterDrop();
  };

  const handleEvaluateOutfit = () => {
    // Check if the outfit uses colors from current theme
    const themeHexes = currentTheme.requiredColors.map((c) => c.hex.toLowerCase());
    const usedColors = Object.values(outfitColors).map((c) => c.toLowerCase());

    const matchCount = usedColors.filter((c) => themeHexes.includes(c) || c === '#ffffff').length;

    if (matchCount >= 3) {
      setFashionAward(true);
      setFashionFeedback(
        `🏆 XUẤT SẮC! Bộ trang phục phối màu hoàn hảo theo chủ đề "${currentTheme.title}" với tông màu ${currentTheme.requiredGroup}! Bé xứng đáng là Nhà Thiết Kế Thời Trang Mầm Non Tài Ba!`
      );
      if (soundEnabled) soundEngine.playMagicChime();
    } else {
      setFashionAward(false);
      setFashionFeedback(
        `Bộ trang phục rất dễ thương! Nhưng để đạt giải Nhất chủ đề "${currentTheme.title}", bé hãy dùng thêm các màu trong bảng yêu cầu (${currentTheme.requiredColors.map((c) => c.name).join(', ')}) nhé!`
      );
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border-2 border-emerald-500 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono font-bold tracking-wide">
              Thí nghiệm 2 • Mầm non (3 - 6 tuổi)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-300 text-purple-950 text-xs font-bold font-mono">
              Phát triển Thẩm mỹ & Cảm thụ Nghệ thuật
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-300" />
            <span>Thí nghiệm Hòa Trộn Màu Sắc</span>
          </h2>
        </div>

        {/* Tab switchers: Phần 1 (Cải tiến) vs Phần 2 (Khám phá) */}
        <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl">
          <button
            onClick={() => setActiveTab('part1-improved')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === 'part1-improved'
                ? 'bg-white text-rose-800 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phần 1: Cốc Pha Màu Ma Thuật</span>
          </button>

          <button
            onClick={() => setActiveTab('part2-discovery')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === 'part2-discovery'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-slate-900" />
            <span>Phần 2: Xưởng Thiết Kế Thời Trang</span>
          </button>
        </div>
      </div>

      {/* 2. Mascot Guidance Bar */}
      <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-800/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
            👩‍🎨
          </div>
          <p className="text-rose-950 dark:text-rose-200 font-medium">
            <strong>Cô Họa Sĩ hướng dẫn:</strong> {mascotMessage}
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* 3. Main Interactive Body */}
      <div className="p-4 sm:p-6">
        {activeTab === 'part1-improved' ? (
          /* ========================================================================= */
          /* PHẦN 1: SẢN PHẨM CẢI TIẾN (CỐC PHA MÀU MA THUẬT ONLINE)                  */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side: The Magic Flask (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-center space-y-4">
              <div className="relative w-64 h-80 rounded-3xl border-4 border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 shadow-2xl overflow-hidden flex flex-col justify-end p-4">
                {/* Liquid body */}
                <div
                  style={{
                    backgroundColor: isStirred ? mixedColorInfo.hex : '#e0f2fe',
                    height: `${Math.max(30, Math.min(90, 20 + dropsInFlask.length * 12))}%`,
                    transition: 'all 0.8s ease'
                  }}
                  className="w-full rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center"
                >
                  {/* Floating unmixed drops if not stirred */}
                  {!isStirred && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 flex-wrap p-4">
                      {dropsInFlask.map((d, i) => (
                        <div
                          key={i}
                          style={{ backgroundColor: d.hex }}
                          className="w-7 h-7 rounded-full shadow-lg border-2 border-white animate-bounce"
                          title={d.name}
                        />
                      ))}
                    </div>
                  )}

                  {/* Surface shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 rounded-t-full" />

                  {/* Stirred result title */}
                  {isStirred && dropsInFlask.length > 0 && (
                    <div className="relative z-10 p-2 rounded-xl bg-black/40 backdrop-blur text-white text-center">
                      <div className="font-bold text-sm">{mixedColorInfo.name}</div>
                      <div className="text-[10px] font-mono opacity-80">{mixedColorInfo.formula}</div>
                    </div>
                  )}
                </div>

                {/* Rim measurement marks */}
                <div className="absolute top-12 left-2 flex flex-col gap-3 text-[9px] font-mono text-slate-400">
                  <span>- 200ml</span>
                  <span>- 150ml</span>
                  <span>- 100ml</span>
                  <span>- 50ml</span>
                </div>
              </div>

              {/* Action Buttons for Flask */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStir}
                  disabled={dropsInFlask.length === 0}
                  className="flex items-center gap-2 py-2 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs font-mono shadow-md transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Khuấy Đều Cốc Màu ✨</span>
                </button>

                <button
                  onClick={handleSaveColor}
                  disabled={!isStirred}
                  className="flex items-center gap-2 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs font-mono shadow-md transition"
                >
                  <Palette className="w-4 h-4" />
                  <span>Lưu Vào Khay Màu</span>
                </button>

                <button
                  onClick={handleResetFlask}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  title="Rửa sạch cốc"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side: Color Droppers & Saved Palette (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* 1. Droppers */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-xs font-mono uppercase text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>1. Ống Bóp Nhỏ Giọt Màu Cơ Bản</span>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                    Nhỏ vào cốc nước
                  </span>
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  {PRIMARY_COLORS.filter((c) => c.type === 'primary').map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleAddDrop(c)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition flex flex-col items-center shadow-xs bg-white dark:bg-slate-900 group"
                    >
                      <div
                        style={{ backgroundColor: c.hex }}
                        className="w-9 h-9 rounded-full shadow-md mb-1.5 flex items-center justify-center text-white"
                      >
                        <Droplet className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">Màu gốc</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Màu biến sắc (Điều chỉnh sáng / tối):
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIMARY_COLORS.filter((c) => c.type === 'modifier').map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleAddDrop(c)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-102 transition flex items-center gap-2 bg-white dark:bg-slate-900 shadow-2xs"
                      >
                        <div
                          style={{ backgroundColor: c.hex }}
                          className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                        />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Color Formulas Cheatsheet */}
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs space-y-1.5">
                <div className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Công Thức Pha Màu Chuẩn Của Bé:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-purple-950 dark:text-purple-200 pt-1">
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-800">
                    🔴 Đỏ + 🟡 Vàng = <strong className="text-orange-500">Cam 🟠</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-800">
                    🟡 Vàng + 🔵 Lam = <strong className="text-green-600">Lá 🟢</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-800">
                    🔴 Đỏ + 🔵 Lam = <strong className="text-purple-600">Tím 🟣</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* PHẦN 2: SẢN PHẨM KHÁM PHÁ (XƯỞNG THIẾT KẾ THỜI TRANG THEO CHỦ ĐỀ)        */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Theme Selector */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-slate-500">
                1. Chọn Chủ Đề Thiết Kế Thời Trang:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {FASHION_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedThemeId(theme.id);
                      setFashionFeedback(null);
                      setFashionAward(false);
                      setMascotMessage(`Bé đã chọn chủ đề "${theme.title}". ${theme.description}`);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 ${
                      selectedThemeId === theme.id
                        ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-400/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 bg-white dark:bg-[#0f172a]'
                    }`}
                  >
                    <span className="text-2xl">{theme.icon}</span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {theme.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {theme.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Fashion Model (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative w-full h-[400px] rounded-3xl border-4 border-purple-300 dark:border-purple-800 bg-gradient-to-b from-purple-50/40 via-pink-50/30 to-rose-100/50 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-950 flex flex-col items-center justify-center p-6 shadow-inner">
                  {/* Studio Spotlight */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-purple-200 text-[10px] font-mono font-bold text-purple-900 dark:text-purple-300 shadow-xs">
                    🌟 SÀN DIỄN: {currentTheme.title}
                  </div>

                  {/* Character Illustration with Click-to-Color Parts */}
                  <div className="relative flex flex-col items-center space-y-2 mt-4">
                    {/* 1. Hat */}
                    <div
                      onClick={() => handleApplyColor('hat')}
                      style={{ backgroundColor: outfitColors.hat }}
                      className="w-20 h-10 rounded-t-full border-2 border-slate-800 shadow-md cursor-pointer hover:scale-110 transition flex items-center justify-center text-[10px] font-bold text-white group"
                      title="Nhấn để tô màu Mũ"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition">Tô Mũ</span>
                    </div>

                    {/* Character Face */}
                    <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-slate-800 flex items-center justify-center relative shadow-sm">
                      <div className="flex gap-4">
                        <span className="w-2 h-2 rounded-full bg-slate-900" />
                        <span className="w-2 h-2 rounded-full bg-slate-900" />
                      </div>
                      <div className="absolute bottom-3 w-4 h-1.5 rounded-full bg-rose-400" />
                    </div>

                    {/* 2. Bow / Accessory */}
                    <div
                      onClick={() => handleApplyColor('bow')}
                      style={{ backgroundColor: outfitColors.bow }}
                      className="w-10 h-5 rounded-full border-2 border-slate-800 cursor-pointer hover:scale-125 transition flex items-center justify-center text-[8px] text-white shadow-xs group"
                      title="Nhấn để tô màu Nơ"
                    >
                      🎀
                    </div>

                    {/* 3. Shirt */}
                    <div
                      onClick={() => handleApplyColor('shirt')}
                      style={{ backgroundColor: outfitColors.shirt }}
                      className="w-32 h-20 rounded-xl border-2 border-slate-800 shadow-md cursor-pointer hover:scale-105 transition flex items-center justify-center text-xs font-bold text-white group"
                      title="Nhấn để tô màu Áo"
                    >
                      <span className="drop-shadow">Áo Thiết Kế</span>
                    </div>

                    {/* 4. Skirt / Pants */}
                    <div
                      onClick={() => handleApplyColor('skirt')}
                      style={{ backgroundColor: outfitColors.skirt }}
                      className="w-28 h-16 rounded-b-2xl border-2 border-slate-800 shadow-md cursor-pointer hover:scale-105 transition flex items-center justify-center text-xs font-bold text-white group"
                      title="Nhấn để tô màu Váy"
                    >
                      <span className="drop-shadow">Váy Xòe</span>
                    </div>

                    {/* 5. Shoes */}
                    <div className="flex gap-6 pt-1">
                      <div
                        onClick={() => handleApplyColor('shoes')}
                        style={{ backgroundColor: outfitColors.shoes }}
                        className="w-10 h-6 rounded-lg border-2 border-slate-800 cursor-pointer hover:scale-110 transition flex items-center justify-center text-[8px] text-slate-800 shadow-xs"
                        title="Tô Giày"
                      >
                        👟
                      </div>
                      <div
                        onClick={() => handleApplyColor('shoes')}
                        style={{ backgroundColor: outfitColors.shoes }}
                        className="w-10 h-6 rounded-lg border-2 border-slate-800 cursor-pointer hover:scale-110 transition flex items-center justify-center text-[8px] text-slate-800 shadow-xs"
                        title="Tô Giày"
                      >
                        👟
                      </div>
                    </div>
                  </div>

                  {/* Evaluate button */}
                  <div className="absolute bottom-3 flex items-center gap-3">
                    <button
                      onClick={handleEvaluateOutfit}
                      className="flex items-center gap-2 py-2 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono shadow-lg transition"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>Trình Diễn Thời Trang & Chấm Điểm 🏆</span>
                    </button>
                  </div>
                </div>

                {/* Feedback Box */}
                {fashionFeedback && (
                  <div
                    className={`p-4 rounded-2xl border text-xs font-medium space-y-1 animate-fadeIn ${
                      fashionAward
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-200'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-950 dark:text-rose-200'
                    }`}
                  >
                    <p>{fashionFeedback}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Palette of Theme & Custom Mixed Colors (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Theme Palette */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>2. Gam Màu Yêu Cầu Cho Chủ Đề</span>
                    <span className="text-purple-600 dark:text-purple-400 text-[10px] font-mono">
                      Nhấn chọn cọ màu
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {currentTheme.requiredColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setActiveBrushColor(c.hex);
                          setMascotMessage(`Đã chấm cọ vào màu ${c.name}! Bé hãy bấm vào Áo, Váy, Mũ hoặc Giày để tô màu nhé.`);
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 transition ${
                          activeBrushColor.toLowerCase() === c.hex.toLowerCase()
                            ? 'border-purple-600 ring-2 ring-purple-400 bg-white dark:bg-slate-900 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60'
                        }`}
                      >
                        <div
                          style={{ backgroundColor: c.hex }}
                          className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Màu Bé Đã Pha Từ Phần 1:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {savedColors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveBrushColor(c.hex);
                            setMascotMessage(`Bé đang dùng màu tự pha: "${c.name}".`);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                            activeBrushColor === c.hex
                              ? 'border-purple-600 ring-2 ring-purple-400 bg-white dark:bg-slate-900'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div style={{ backgroundColor: c.hex }} className="w-4 h-4 rounded-full border" />
                          <span className="font-mono text-[11px]">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Active Brush preview */}
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Cọ vẽ đang chọn:</span>
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: activeBrushColor }}
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                    />
                    <span className="font-mono font-bold text-purple-900 dark:text-purple-200">{activeBrushColor}</span>
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

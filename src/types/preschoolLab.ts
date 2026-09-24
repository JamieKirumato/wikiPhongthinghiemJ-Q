export interface PreschoolMission {
  id: string;
  title: string;
  characterName: string;
  characterEmoji: string;
  storyPrompt: string;
  audioPrompt: string;
  hint: string;
  targetRgb: [number, number, number];
  targetHex: string;
  targetColorName: string;
  tolerance: number; // Max Euclidean distance in RGB color space (e.g. 50-80)
  completed: boolean;
  rewardBadge: string;
}

export interface CodexColor {
  id: string;
  name: string;
  targetRgb: [number, number, number];
  hex: string;
  description: string;
  realWorldItem: string; // e.g. "Lá cây tươi", "Cà rốt mọng", "Quả cà chua"
  itemEmoji: string;
  unlocked: boolean;
  tolerance: number;
}

export const INITIAL_PRESCHOOL_MISSIONS: PreschoolMission[] = [
  {
    id: 'mission-frog-green',
    title: 'Nhiệm Vụ 1: Đánh Thức Chú Ếch Cốm',
    characterName: 'Chú Ếch Cốm',
    characterEmoji: '🐸',
    storyPrompt: 'Ôi bạn Ếch bị mất màu da rồi! Bé hãy phối màu Xanh Lam và màu Vàng để tạo ra màu Xanh Lá Cây tặng bạn ấy nhé!',
    audioPrompt: 'Bé hãy phối màu xanh lam và màu vàng để tạo ra màu xanh lá cây cho bạn ếch nhé!',
    hint: 'Gợi ý: Dùng nhiều màu Xanh lam và thêm màu Vàng/Lục',
    targetRgb: [40, 200, 50],
    targetHex: '#28C832',
    targetColorName: 'Xanh Lá Cây (Green)',
    tolerance: 70,
    completed: false,
    rewardBadge: '⭐ Bậc Thầy Rừng Xanh'
  },
  {
    id: 'mission-rabbit-orange',
    title: 'Nhiệm Vụ 2: Quả Cam Chín Mọng Cho Bạn Thỏ',
    characterName: 'Bạn Thỏ Trắng',
    characterEmoji: '🐰',
    storyPrompt: 'Bạn Thỏ đang đói bụng muốn ăn một quả cam ngọt. Bé hãy pha màu Đỏ và màu Vàng để làm chín quả Cam trên cành nào!',
    audioPrompt: 'Bé hãy pha màu đỏ và màu vàng để làm chín quả cam cho bạn thỏ nào!',
    hint: 'Gợi ý: Kết hợp thật nhiều màu Đỏ và màu Vàng rực rỡ',
    targetRgb: [255, 140, 0],
    targetHex: '#FF8C00',
    targetColorName: 'Màu Cam Rực Rỡ (Orange)',
    tolerance: 65,
    completed: false,
    rewardBadge: '⭐ Nông Dân Thu Hoạch'
  },
  {
    id: 'mission-fairy-purple',
    title: 'Nhiệm Vụ 3: Chiếc Váy Dạ Hội Màu Tím',
    characterName: 'Nàng Tiên Hoa',
    characterEmoji: '🧚‍♀️',
    storyPrompt: 'Nàng Tiên chuẩn bị đi dạ hội hoa đêm nay. Bé hãy hòa trộn màu Đỏ nồng nàn và màu Xanh Lam huyền bí để nhuộm váy Tím lấp lánh!',
    audioPrompt: 'Bé hãy hòa màu đỏ và màu xanh lam để may váy màu tím cho nàng tiên nhé!',
    hint: 'Gợi ý: Hòa màu Đỏ và màu Xanh Lam với lượng bằng nhau',
    targetRgb: [160, 40, 220],
    targetHex: '#A028DC',
    targetColorName: 'Màu Tím Thần Tiên (Purple)',
    tolerance: 70,
    completed: false,
    rewardBadge: '⭐ Nhà May Phép Thuật'
  },
  {
    id: 'mission-sun-white',
    title: 'Nhiệm Vụ 4: Gọi Thần Mặt Trời Thức Giấc',
    characterName: 'Thần Mặt Trời',
    characterEmoji: '☀️',
    storyPrompt: 'Màn đêm bao trùm muôn loài, bé hãy thắp sáng cả 3 nguồn ánh sáng Đỏ, Lục, Lam lên mức tối đa để gọi ánh sáng Trắng ban mai!',
    audioPrompt: 'Bé hãy bật cả ba nguồn ánh sáng lên cao nhất để gọi ánh sáng trắng ban mai nào!',
    hint: 'Gợi ý: Đẩy cả 3 nguồn sáng Đỏ, Lục, Lam lên mức cao nhất (255)',
    targetRgb: [240, 240, 240],
    targetHex: '#FFFFFF',
    targetColorName: 'Ánh Sáng Trắng Ban Mai (White Light)',
    tolerance: 60,
    completed: false,
    rewardBadge: '🏆 Huy Hiệu Ánh Sáng Vĩnh Cửu'
  }
];

export const INITIAL_COLOR_CODEX: CodexColor[] = [
  {
    id: 'codex-red',
    name: 'Đỏ Cà Chua',
    targetRgb: [255, 30, 30],
    hex: '#FF1E1E',
    description: 'Màu nguyên bản rực cháy của nguồn sáng',
    realWorldItem: 'Quả cà chua mọng nước',
    itemEmoji: '🍅',
    unlocked: true, // Red is unlocked by default
    tolerance: 60
  },
  {
    id: 'codex-green',
    name: 'Xanh Lá Tươi',
    targetRgb: [40, 220, 40],
    hex: '#28DC28',
    description: 'Màu của sự sống và cây cỏ non',
    realWorldItem: 'Chiếc lá non đón nắng',
    itemEmoji: '🍃',
    unlocked: true,
    tolerance: 60
  },
  {
    id: 'codex-blue',
    name: 'Xanh Đại Dương',
    targetRgb: [20, 60, 255],
    hex: '#143CFF',
    description: 'Màu của biển sâu thẳm và bầu trời',
    realWorldItem: 'Sóng biển đại dương',
    itemEmoji: '🌊',
    unlocked: true,
    tolerance: 60
  },
  {
    id: 'codex-yellow',
    name: 'Vàng Nắng Mai',
    targetRgb: [255, 230, 20],
    hex: '#FFE614',
    description: 'Hòa trộn giữa ánh sáng Đỏ và Xanh lục',
    realWorldItem: 'Hoa hướng dương khoe sắc',
    itemEmoji: '🌻',
    unlocked: false,
    tolerance: 55
  },
  {
    id: 'codex-orange',
    name: 'Cam Mọng Nước',
    targetRgb: [255, 130, 10],
    hex: '#FF820A',
    description: 'Nhiều Đỏ và một phần Lục',
    realWorldItem: 'Quả cam ngọt lịm',
    itemEmoji: '🍊',
    unlocked: false,
    tolerance: 55
  },
  {
    id: 'codex-purple',
    name: 'Tím Hoa Cà',
    targetRgb: [160, 30, 220],
    hex: '#A01EDC',
    description: 'Bản giao hưởng giữa Đỏ và Lam',
    realWorldItem: 'Cánh hoa oải hương',
    itemEmoji: '🪻',
    unlocked: false,
    tolerance: 60
  },
  {
    id: 'codex-cyan',
    name: 'Xanh Ngọc Lơ',
    targetRgb: [20, 230, 240],
    hex: '#14E6F0',
    description: 'Ánh sáng Lục và Lam hòa hợp',
    realWorldItem: 'Viên ngọc bích lấp lánh',
    itemEmoji: '💎',
    unlocked: false,
    tolerance: 55
  },
  {
    id: 'codex-pink',
    name: 'Hồng Kẹo Bông',
    targetRgb: [255, 105, 180],
    hex: '#FF69B4',
    description: 'Đỏ phối với một ít Lam và Lục',
    realWorldItem: 'Kẹo bông gòn ngọt ngào',
    itemEmoji: '🍭',
    unlocked: false,
    tolerance: 55
  },
  {
    id: 'codex-brown',
    name: 'Nâu Gỗ Rừng',
    targetRgb: [139, 69, 19],
    hex: '#8B4513',
    description: 'Sự pha trộn trầm ấm của đất mẹ',
    realWorldItem: 'Thân cây gỗ sồi',
    itemEmoji: '🪵',
    unlocked: false,
    tolerance: 60
  },
  {
    id: 'codex-lime',
    name: 'Xanh Chanh Cốm',
    targetRgb: [170, 255, 20],
    hex: '#AAFF14',
    description: 'Rất nhiều Lục điểm xuyết ánh Đỏ vàng',
    realWorldItem: 'Quả chanh cốm tươi',
    itemEmoji: '🍋',
    unlocked: false,
    tolerance: 55
  },
  {
    id: 'codex-gold',
    name: 'Vàng Hoàng Gia',
    targetRgb: [218, 165, 32],
    hex: '#DAA520',
    description: 'Sắc vàng óng ánh của kho báu',
    realWorldItem: 'Vương miện công chúa',
    itemEmoji: '👑',
    unlocked: false,
    tolerance: 50
  },
  {
    id: 'codex-white',
    name: 'Trắng Tinh Khôi',
    targetRgb: [250, 250, 250],
    hex: '#FAFAFA',
    description: 'Toàn bộ 3 màu cơ bản đạt đỉnh',
    realWorldItem: 'Đám mây bồng bềnh',
    itemEmoji: '☁️',
    unlocked: false,
    tolerance: 50
  }
];

// Helper: Calculate Color Euclidean Distance
export function calcColorDistance(
  c1: [number, number, number],
  c2: [number, number, number]
): number {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

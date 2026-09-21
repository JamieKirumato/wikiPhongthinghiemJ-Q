import { LevelInfo, Grade, Subject, Chapter, Lesson, SimulationItem } from '../types/curriculum';

export const LEVELS: LevelInfo[] = [
  {
    id: 'mam-non',
    name: 'Giáo dục Mầm non',
    shortName: 'Mầm non',
    ageRange: '3 - 6 tuổi',
    badge: 'Khám phá Giác quan & Logic sơ khởi',
    description: 'Xây dựng trực giác nguyên sơ về thế giới: hình khối, màu sắc, số lượng, trọng lượng và các mối quan hệ nhân - quả trực quan.',
    philosophy: 'Mầm non là giai đoạn xây dựng neural network sinh học đầu tiên của con người. Mọi khái niệm phải được cảm nhận bằng mắt thấy, tay chạm, tai nghe thay vì ngôn ngữ trừu tượng.',
    bookSeries: 'Chương trình GDMN & Học liệu Kết nối tri thức',
  },
  {
    id: 'tieu-hoc',
    name: 'Giáo dục Tiểu học',
    shortName: 'Tiểu học',
    ageRange: 'Lớp 1 - Lớp 5 (6 - 11 tuổi)',
    badge: 'Mô hình hóa Toán học & Khoa học sơ cấp',
    description: 'Chuyển đổi từ trực quan cảm tính sang các mô hình trừu tượng: trục số, phân số hình học, đo lường, quy luật tự nhiên và logic máy tính.',
    philosophy: 'Mỗi phép tính toán hay hiện tượng khoa học đều bắt nguồn từ nhu cầu thực tiễn: chia đều cái bánh (phân số), đo đạc đất đai (hình học), quan sát mặt trời (thời gian).',
    bookSeries: 'Bộ sách Kết nối tri thức với cuộc sống (NXBGDVN)',
  },
  {
    id: 'thcs',
    name: 'Trung học cơ sở',
    shortName: 'THCS',
    ageRange: 'Lớp 6 - Lớp 9 (11 - 15 tuổi)',
    badge: 'Tư duy Thực nghiệm & Bản chất Hạt / Lực',
    description: 'Đi sâu vào bản chất thế giới vi mô và vĩ mô: electron, nguyên tử, lực tương tác Newton, năng lượng bảo toàn và thuật toán lập trình.',
    philosophy: 'Khoa học tự nhiên không phải là ghi nhớ định nghĩa. Đó là quá trình xây dựng giả thuyết, làm thí nghiệm, đo đạc dữ liệu và phát hiện quy luật phổ quát.',
    bookSeries: 'Bộ sách Kết nối tri thức với cuộc sống (NXBGDVN)',
  },
  {
    id: 'thpt',
    name: 'Trung học phổ thông',
    shortName: 'THPT',
    ageRange: 'Lớp 10 - Lớp 12 (15 - 18 tuổi)',
    badge: 'First Principles & Vi tích phân / Mô hình sâu',
    description: 'Tiếp cận toán - lý - hóa hiện đại từ các phương trình vi phân, trường sóng, động học phân tử, cấu trúc DNA và nền tảng Trí tuệ nhân tạo.',
    philosophy: 'Hiểu cội nguồn mọi định luật: Vận tốc là đạo hàm vị trí, gia tốc là độ biến thiên vận tốc. Khi mở tung hộp đen và viết lại code mô phỏng, bạn thực sự làm chủ tri thức.',
    bookSeries: 'Bộ sách Kết nối tri thức với cuộc sống (NXBGDVN)',
  }
];

export const GRADES: Grade[] = [
  // Mầm non
  { id: 'mn-3-4', name: '3 - 4 tuổi (Mẫu giáo bé)', levelId: 'mam-non', order: 1 },
  { id: 'mn-4-5', name: '4 - 5 tuổi (Mẫu giáo nhỡ)', levelId: 'mam-non', order: 2 },
  { id: 'mn-5-6', name: '5 - 6 tuổi (Tiền tiểu học)', levelId: 'mam-non', order: 3 },

  // Tiểu học
  { id: 'th-lop-1', name: 'Lớp 1', levelId: 'tieu-hoc', order: 1 },
  { id: 'th-lop-2', name: 'Lớp 2', levelId: 'tieu-hoc', order: 2 },
  { id: 'th-lop-3', name: 'Lớp 3', levelId: 'tieu-hoc', order: 3 },
  { id: 'th-lop-4', name: 'Lớp 4', levelId: 'tieu-hoc', order: 4 },
  { id: 'th-lop-5', name: 'Lớp 5', levelId: 'tieu-hoc', order: 5 },

  // THCS
  { id: 'thcs-lop-6', name: 'Lớp 6', levelId: 'thcs', order: 1 },
  { id: 'thcs-lop-7', name: 'Lớp 7', levelId: 'thcs', order: 2 },
  { id: 'thcs-lop-8', name: 'Lớp 8', levelId: 'thcs', order: 3 },
  { id: 'thcs-lop-9', name: 'Lớp 9', levelId: 'thcs', order: 4 },

  // THPT
  { id: 'thpt-lop-10', name: 'Lớp 10', levelId: 'thpt', order: 1 },
  { id: 'thpt-lop-11', name: 'Lớp 11', levelId: 'thpt', order: 2 },
  { id: 'thpt-lop-12', name: 'Lớp 12', levelId: 'thpt', order: 3 },
];

export const SUBJECTS: Subject[] = [
  // Mầm non
  { id: 'mn-kham-pha', name: 'Khám phá Khoa học & Tự nhiên', gradeId: 'mn-4-5', icon: 'Sparkles', description: 'Cảm nhận màu sắc, nước, ánh sáng và vạn vật xung quanh' },
  { id: 'mn-toan-so-dang', name: 'Làm quen với Toán', gradeId: 'mn-5-6', icon: 'Binary', description: 'Đếm số lượng, so sánh lớn nhỏ, phân loại hình dạng' },
  
  // Tiểu học
  { id: 'th-toan-4', name: 'Toán học 4', gradeId: 'th-lop-4', icon: 'Calculator', description: 'Phân số, số đo diện tích, hình học và giải bài toán có lời văn' },
  { id: 'th-khoa-hoc-4', name: 'Khoa học 4', gradeId: 'th-lop-4', icon: 'FlaskConical', description: 'Nước, không khí, ánh sáng, nhiệt và sự sống' },
  { id: 'th-tin-hoc-4', name: 'Tin học 4', gradeId: 'th-lop-4', icon: 'Cpu', description: 'Tư duy thuật toán, thông tin và lập trình trực quan Scratch' },

  // THCS (Lớp 8 & Lớp 6)
  { id: 'thcs-khtn-8', name: 'Khoa học tự nhiên 8', gradeId: 'thcs-lop-8', icon: 'Atom', description: 'Phản ứng hóa học, Điện học, Cơ học lực và áp suất' },
  { id: 'thcs-toan-8', name: 'Toán học 8', gradeId: 'thcs-lop-8', icon: 'Pi', description: 'Hằng đẳng thức, Đa thức, Định lí Thalès, Hàm số bậc nhất' },
  { id: 'thcs-tin-8', name: 'Tin học 8', gradeId: 'thcs-lop-8', icon: 'Code', description: 'Thuật toán và tư duy lập trình xử lý dữ liệu' },

  // THPT (Lớp 10 & 11)
  { id: 'thpt-vat-li-10', name: 'Vật lí 10', gradeId: 'thpt-lop-10', icon: 'Zap', description: 'Chuyển động, Động lực học Newton, Năng lượng & Công' },
  { id: 'thpt-vat-li-11', name: 'Vật lí 11', gradeId: 'thpt-lop-11', icon: 'Waves', description: 'Dao động cơ, Sóng cơ, Điện trường & Dòng điện không đổi' },
  { id: 'thpt-toan-11', name: 'Toán học 11', gradeId: 'thpt-lop-11', icon: 'Sigma', description: 'Hàm số lượng giác, Cấp số nhân, Giới hạn & Đạo hàm' },
  { id: 'thpt-tin-11', name: 'Tin học 11', gradeId: 'thpt-lop-11', icon: 'Cpu', description: 'Lập trình Python, Cấu trúc dữ liệu & Thuật toán' }
];

export const CHAPTERS: Chapter[] = [
  // Mầm non
  { id: 'chap-mn-mau-sac', title: 'Chủ đề: Thế giới màu sắc & Thị giác', subjectId: 'mn-kham-pha', order: 1 },
  { id: 'chap-mn-so-luong', title: 'Chủ đề: Số lượng và Cân bằng', subjectId: 'mn-toan-so-dang', order: 1 },

  // Tiểu học - Toán 4
  { id: 'chap-th-phan-so', title: 'Chủ đề 8: Phân số và các phép tính', subjectId: 'th-toan-4', order: 1 },
  { id: 'chap-th-hinh-hoc', title: 'Chủ đề 9: Hình học và đo lường', subjectId: 'th-toan-4', order: 2 },

  // THCS - KHTN 8
  { id: 'chap-thcs-dien', title: 'Chương V: Điện (Mạch điện, Tác dụng & Định luật Ohm)', subjectId: 'thcs-khtn-8', order: 1 },
  { id: 'chap-thcs-phan-ung', title: 'Chương I: Phản ứng hóa học và Bảo toàn khối lượng', subjectId: 'thcs-khtn-8', order: 2 },

  // THPT - Vật lí 11
  { id: 'chap-thpt-dao-dong', title: 'Chương I: Dao động điều hòa & Năng lượng', subjectId: 'thpt-vat-li-11', order: 1 },
  { id: 'chap-thpt-song', title: 'Chương II: Sóng cơ và Giao thoa sóng', subjectId: 'thpt-vat-li-11', order: 2 },
  // THPT - Vật lí 10
  { id: 'chap-thpt-dong-hoc', title: 'Chương II: Động học & Vi tích phân chuyển động', subjectId: 'thpt-vat-li-10', order: 1 },
];

export const LESSONS: Lesson[] = [
  // MẦM NON
  {
    id: 'lesson-mn-tron-mau',
    title: 'Khám phá: Điều kỳ diệu khi hòa trộn màu sắc',
    chapterId: 'chap-mn-mau-sac',
    order: 1,
    firstPrinciples: {
      coreQuestion: 'Từ đâu mà chúng ta nhìn thấy hàng triệu màu sắc khác nhau trong tự nhiên?',
      intuition: 'Mắt con người có 3 loại thụ thể nhạy cảm với 3 màu chính: Đỏ (Red), Lục (Green), Lam (Blue). Khi ánh sáng với các bước sóng khác nhau hòa trộn vào nhau, não bộ chúng ta tự động tổng hợp thành những màu sắc rực rỡ như vàng, tím, cam hay trắng tinh khiết.',
      whyItMatters: 'Hiểu về màu sắc giúp trẻ phát triển năng lực thẩm mỹ, nhận biết tín hiệu cảnh báo trong đời sống và đặt nền móng cho quang học vật lý sau này.'
    },
    summary: [
      'Ba màu gốc kỳ diệu: Đỏ (Red), Vàng/Lục (Green), Xanh lam (Blue).',
      'Đỏ + Lam = Tím bí ẩn.',
      'Đỏ + Vàng/Lục = Cam ấm áp hoặc Vàng rực rỡ.',
      'Khi cả 3 chùm ánh sáng hội tụ tối đa = Ánh sáng Trắng của Mặt Trời!'
    ],
    simulationId: 'sim-color-mixer'
  },

  // TIỂU HỌC - TOÁN 4
  {
    id: 'lesson-th-phan-so',
    title: 'Bài 53: Khái niệm phân số & Phép chia cái bánh',
    chapterId: 'chap-th-phan-so',
    order: 1,
    firstPrinciples: {
      coreQuestion: 'Tại sao số tự nhiên (1, 2, 3...) là chưa đủ đối với thế giới thực?',
      intuition: 'Khi bạn có 1 cái bánh pizza nhưng phải chia đều cho 4 người bạn, không ai nhận được trọn vẹn 1 cái bánh cả. Để mô tả chính xác phần thức ăn mỗi người có, loài người phát minh ra phân số: 1 phần trên tổng số 4 phần bằng nhau, ký hiệu là 1/4.',
      whyItMatters: 'Phân số là bước nhảy vọt đầu tiên của trí tuệ loài người từ việc đếm các vật rời rạc sang việc đo lường các đại lượng liên tục.'
    },
    summary: [
      'Tử số (trên gạch ngang): Số phần bằng nhau ta đang lấy.',
      'Mẫu số (dưới gạch ngang): Tổng số phần bằng nhau được chia ra từ 1 đơn vị trọn vẹn.',
      'Mẫu số tuyệt đối không bao giờ được bằng 0 (vì ta không thể chia một vật cho con số không).'
    ],
    keyFormulaLatex: '\\text{Phân số} = \\frac{\\text{Số phần đang xét}}{\\text{Tổng số phần bằng nhau}}',
    simulationId: 'sim-balance-fraction'
  },

  // THCS - KHOA HỌC TỰ NHIÊN 8
  {
    id: 'lesson-thcs-dien-tro-ohm',
    title: 'Bài 23: Tác dụng dòng điện & Định luật Ohm trực quan',
    chapterId: 'chap-thcs-dien',
    order: 1,
    firstPrinciples: {
      coreQuestion: 'Dòng điện thực chất là gì và tại sao bóng đèn lại phát sáng khi có dòng điện chạy qua?',
      intuition: 'Kim loại chứa biển electron tự do. Điện áp (Hiệu điện thế U) giống như một máy bơm tạo áp lực đẩy các electron trôi dạt có hướng. Điện trở R là sự cản trở: khi electron va chạm với các ion mạng tinh thể của dây dẫn, động năng của chúng biến thành nhiệt năng làm dây tóc nóng đỏ phát sáng.',
      whyItMatters: 'Định luật Ohm là nền tảng của toàn bộ nền văn minh điện tử: từ chiếc bóng đèn dây tóc đơn giản cho đến chip máy tính chứa hàng tỉ transistor ngày nay.'
    },
    summary: [
      'Cường độ dòng điện I (Ampe) đo lưu lượng điện tích chạy qua tiết diện dây trong 1 giây.',
      'Hiệu điện thế U (Volt) là thế năng điện thúc đẩy dòng điện.',
      'Điện trở R (Ohm) là lực cản trở dòng electron trong vật dẫn.',
      'Định luật Ohm: I = U / R. Khi tăng U thì I tăng; khi tăng R thì I giảm.'
    ],
    keyFormulaLatex: 'I = \\frac{U}{R} \\quad \\Longleftrightarrow \\quad P = U \\cdot I = I^2 \\cdot R',
    simulationId: 'sim-electric-circuit'
  },

  // THPT - VẬT LÍ 11
  {
    id: 'lesson-thpt-dao-dong-dieu-hoa',
    title: 'Bài 1: Dao động điều hòa & Phương trình vi tích phân',
    chapterId: 'chap-thpt-dao-dong',
    order: 1,
    firstPrinciples: {
      coreQuestion: 'Tại sao nhịp tim, con lắc đồng hồ, dây đàn ghita và sóng điện từ đều tuân theo hàm Sin/Cos?',
      intuition: 'Bất cứ khi nào một hệ vật lý có một vị trí cân bằng và một lực kéo vật trở về cân bằng tỷ lệ thuận với độ lệch (F = -k.x), phương trình vi phân chuyển động Newton F = m.a luôn dẫn tới nghiệm hàm lượng giác điều hòa x(t) = A.cos(ωt + φ). Đó là lời giải tự nhiên duy nhất của quy luật bảo toàn năng lượng!',
      whyItMatters: 'Hiểu dao động điều hòa là chìa khóa để hiểu toàn bộ vật lý hiện đại: cơ lượng tử, cấu trúc nguyên tử, sóng âm, sóng ánh sáng và xử lý tín hiệu số trong AI.'
    },
    summary: [
      'Vận tốc v(t) là đạo hàm bậc nhất của li độ x(t): v(t) = x\'(t) = -ωA sin(ωt + φ). Vận tốc sớm pha π/2 so với li độ.',
      'Gia tốc a(t) là đạo hàm bậc hai của li độ: a(t) = v\'(t) = -ω² x(t). Gia tốc luôn ngược pha với li độ và hướng về vị trí cân bằng.',
      'Bảo toàn cơ năng: Tổng động năng Wđ và thế năng Wt luôn không đổi trong dao động tự do không ma sát: E = 1/2 m v² + 1/2 k x² = const.'
    ],
    keyFormulaLatex: 'a(t) = \\frac{d^2x}{dt^2} = -\\omega^2 x(t) \\implies x(t) = A\\cos(\\omega t + \\varphi)',
    simulationId: 'sim-pendulum-calculus'
  }
];

export const SIMULATIONS: SimulationItem[] = [
  {
    id: 'sim-color-mixer',
    title: 'Trộn Màu Sắc Tương Tác & Thụ Thể Thị Giác',
    levelId: 'mam-non',
    subjectName: 'Khám phá Khoa học',
    gradeLabel: '3 - 6 tuổi',
    description: 'Trải nghiệm trực quan hòa trộn 3 nguồn sáng Đỏ - Xanh lá - Xanh lam để tạo ra mọi màu sắc trong vũ trụ.',
    tags: ['Mầm non', 'Thị giác', 'Màu sắc RGB', 'Quang học'],
    firstPrinciplesExplanation: 'Não bộ người có 3 loại tế bào nón thị giác nhạy cảm với bước sóng Đỏ (650nm), Lục (530nm), Lam (460nm). Hòa trộn 3 màu này ở các cường độ khác nhau đánh lừa não bộ nhận biết bất kỳ sắc thái màu nào trong tự nhiên.',
    mathLatex: '\\vec{Color} = r \\cdot \\vec{R} + g \\cdot \\vec{G} + b \\cdot \\vec{B}',
    codeSnippet: `// Mô phỏng hòa trộn màu sắc (RGB Additive Mixing)
function mixColors(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return \`rgb(\${clamp(r)}, \${clamp(g)}, \${clamp(b)})\`;
}
// Khi r=255, g=255, b=0 => Màu Vàng rực rỡ!
// Khi r=255, g=255, b=255 => Ánh sáng Trắng tự nhiên.`
  },
  {
    id: 'sim-balance-fraction',
    title: 'Cân Đĩa Thăng Bằng & Bản Chất Phân Số',
    levelId: 'tieu-hoc',
    subjectName: 'Toán học 4',
    gradeLabel: 'Lớp 4',
    description: 'Kéo thả các quả cân và phân chia cái bánh trên đĩa cân để trực quan hóa sự cân bằng phương trình và phân số.',
    tags: ['Tiểu học', 'Phân số', 'Cân bằng', 'Đại số sơ cấp'],
    firstPrinciplesExplanation: 'Dấu bằng (=) trong toán học không chỉ là "kết quả sau dấu tính", mà là một chiếc cân đòn bẩy thăng bằng tuyệt đối: Khối lượng bên trái PHẢI LUÔN BẰNG khối lượng bên phải.',
    mathLatex: '\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c',
    codeSnippet: `// Mô phỏng đòn bẩy cân bằng theo mômen lực
function calculateTorque(weightsLeft: number[], weightsRight: number[]) {
  const torqueLeft = weightsLeft.reduce((acc, w) => acc + w, 0);
  const torqueRight = weightsRight.reduce((acc, w) => acc + w, 0);
  const diff = torqueLeft - torqueRight;
  const tiltAngle = Math.max(-0.3, Math.min(0.3, diff * 0.05));
  return { isBalanced: diff === 0, tiltAngle };
}`
  },
  {
    id: 'sim-electric-circuit',
    title: 'Phòng Lab Mạch Điện DC & Định Luật Ohm Trực Quan',
    levelId: 'thcs',
    subjectName: 'Khoa học tự nhiên 8',
    gradeLabel: 'Lớp 8',
    description: 'Thay đổi hiệu điện thế U và điện trở R để quan sát trực tiếp vận tốc trôi của các electron và độ sáng của bóng đèn.',
    tags: ['THCS', 'Điện học', 'Định luật Ohm', 'Electron'],
    firstPrinciplesExplanation: 'Dòng điện thực chất là dòng electron mang điện tích âm dịch chuyển ngược chiều điện trường. Tốc độ trôi v_d tỷ lệ thuận với cường độ dòng điện: I = n.q.v_d.A. Khi tăng điện trở, electron va chạm nhiều hơn, dòng điện giảm xuống.',
    mathLatex: 'I = \\frac{U}{R}, \\quad P = I^2 \\cdot R = \\frac{U^2}{R}',
    codeSnippet: `// Mô phỏng chuyển động hạt electron theo định luật Ohm
class ElectronParticle {
  x: number = Math.random() * circuitLength;
  speed: number = 0;

  update(voltage: number, resistance: number, dt: number) {
    const current = voltage / Math.max(1, resistance);
    this.speed = current * 2.5; // Vận tốc trôi tỉ lệ với dòng điện
    this.x = (this.x + this.speed * dt) % circuitLength;
  }
}`
  },
  {
    id: 'sim-pendulum-calculus',
    title: 'Con Lắc Đơn Phi Tuyến & Vi Tích Phân Thời Gian Thực',
    levelId: 'thpt',
    subjectName: 'Vật lí 11',
    gradeLabel: 'Lớp 11',
    description: 'Mô phỏng con lắc đơn phi tuyến chính xác bằng tích phân Runge-Kutta / Euler-Cromer, vẽ đồ thị x(t), v(t), a(t) và bảo toàn cơ năng.',
    tags: ['THPT', 'Vi tích phân', 'Con lắc đơn', 'Động học', 'Cơ năng'],
    firstPrinciplesExplanation: 'Phương trình vi phân cấp hai của con lắc đơn: d²θ/dt² + (g/L)sin(θ) = 0. Với góc nhỏ, sin(θ) ≈ θ tạo nên dao động điều hòa điều kiện lý tưởng. Khi góc lớn, con lắc là hệ phi tuyến kỳ thú!',
    mathLatex: '\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\sin(\\theta) = 0, \\quad E = \\frac{1}{2}m L^2 \\omega^2 + mgL(1 - \\cos\\theta) = const',
    codeSnippet: `// Tích phân Euler-Cromer giải phương trình vi phân chuyển động
function stepPendulum(theta: number, omega: number, length: number, g: number, dt: number) {
  // Gia tốc góc alpha = - (g / L) * sin(theta)
  const alpha = - (g / length) * Math.sin(theta);
  // Cập nhật vận tốc góc omega
  const newOmega = omega + alpha * dt;
  // Cập nhật góc lệch theta
  const newTheta = theta + newOmega * dt;
  return { theta: newTheta, omega: newOmega, alpha };
}`
  }
];

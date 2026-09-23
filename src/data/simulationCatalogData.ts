import { InteractionPattern, SimulationCatalogItem, PreschoolExplorationData } from '../types/curriculum';
import { PRESCHOOL_EXPLORATION_MAP } from './preschoolExplorationData';

export const INTERACTION_PATTERNS: InteractionPattern[] = [
  {
    id: 'pattern-slider',
    name: '1. Điều Khiển Biến Số Thời Gian Thực (Continuous Parameter Sweeping)',
    tagline: 'Kéo trượt tham số để quan sát sự chuyển pha và phản hồi động học',
    description: 'Người học trực tiếp kéo các thanh trượt (slider) đại diện cho các biến số độc lập (như Hiệu điện thế U, Điện trở R, Chiều dài dây l, Gia tốc trọng trường g, Khối lượng m, Nhiệt độ T). Toàn bộ hệ thống đồ thị, véc-tơ lực và hình ảnh mô phỏng sẽ tính toán lại ngay tức thì sau mỗi chu kỳ khung hình (60 FPS).',
    pedagogy: 'Giúp người học xóa bỏ tư duy học vẹt công thức tĩnh để chuyển sang tư duy hàm số f(x) và độ nhạy của hệ thống (sensitivity analysis): "Khi biến số A tăng gấp đôi, biến số B sẽ thay đổi tuyến tính hay phi tuyến tính?".',
    examples: [
      'Điều chỉnh điện áp U và điện trở R trong Định luật Ohm để thấy vận tốc trôi của electron.',
      'Thay đổi chiều dài l của con lắc đơn để quan sát sự biến thiên của chu kỳ T = 2π√(l/g).',
      'Kéo thể tích V của ống xilanh khí để quan sát áp suất P tăng vọt theo định luật Boyle.'
    ],
    icon: 'SlidersHorizontal',
    accentColor: 'text-sky-500 border-sky-500/30 bg-sky-500/10'
  },
  {
    id: 'pattern-drag-drop',
    name: '2. Kéo - Thả & Lắp Ráp Linh Kiện Thực Nghiệm (Drag & Drop Component Assembly)',
    tagline: 'Thao tác ghép nối thực tế không giới hạn, không lo hỏng hóc hay rủi ro cháy nổ',
    description: 'Người học tự do kéo các phần tử vật lý, hóa chất hoặc khối toán học từ thanh công cụ (toolbox) và thả vào không gian thí nghiệm: đặt quả cân lên đĩa cân, cắm dây nối cực âm/dương của pin vào bóng đèn, rót dung dịch vào ống nghiệm.',
    pedagogy: 'Tái tạo trọn vẹn cảm giác xúc giác (kinesthetic learning) và quy trình thực nghiệm của một phòng lab thực thụ, giúp học sinh rèn luyện tư duy thiết kế hệ thống và kỹ năng giải quyết sự cố (troubleshooting) khi mạch điện bị hở hoặc cân bị lệch.',
    examples: [
      'Kéo các quả cân phân số 1/2, 1/4, 1/8 lên đĩa cân để trực quan hóa sự cân bằng phương trình.',
      'Lắp ráp mạch điện nối tiếp/song song với nguồn điện, ampe kế, vôn kế và công tắc K.',
      'Thả các vật liệu khác nhau (gỗ, sắt, xốp) vào bể nước để kiểm tra tính nổi - chìm Archimedes.'
    ],
    icon: 'Move',
    accentColor: 'text-amber-500 border-amber-500/30 bg-amber-500/10'
  },
  {
    id: 'pattern-particle-sandbox',
    name: '3. Hệ Hạt Vi Mô & Sandbox Động Học (Microscopic Kinetic Sandbox)',
    tagline: 'Trực quan hóa thế giới hạ nguyên tử mà mắt thường không thể thấy',
    description: 'Mô phỏng hàng trăm đến hàng nghìn phần tử rời rạc (electron, ion, phân tử khí lý tưởng, hạt keo Brownian) chuyển động và tương tác theo các định luật bảo toàn động lượng và lực tương tác trường.',
    pedagogy: 'Xây dựng "Atomic Intuition" (Trực giác nguyên tử) theo đúng tinh thần Richard Feynman: Mọi thứ trong vũ trụ đều cấu tạo từ các hạt chuyển động không ngừng. Thay vì tưởng tượng trừu tượng, học sinh trực tiếp nhìn thấy nhiệt độ chính là động năng hỗn loạn của phân tử.',
    examples: [
      'Quan sát dòng trôi có hướng của electron trong dây dẫn kim loại khi có điện trường ngoài.',
      'Mô phỏng va chạm của các phân tử khí vào thành bình kín để sinh ra áp suất chất khí.',
      'Trộn các chùm hạt ánh sáng photon Đỏ, Lục, Lam vào tế bào hình nón của mắt người.'
    ],
    icon: 'Atom',
    accentColor: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
  },
  {
    id: 'pattern-time-control',
    name: '4. Điều Khiển Dòng Thời Gian & Tua Chậm Vi Phân (Time-Step Control & Slow-Motion)',
    tagline: 'Dừng thời gian, tua ngược hoặc bước từng tick vi phân dt để soi rõ bản chất',
    description: 'Cung cấp thanh điều khiển dòng thời gian: Nút Play/Pause, Tốc độ tua chậm (0.1x, 0.25x, 0.5x, 1x), và đặc biệt là nút "Bước từng tick dt" (Step Forward 16ms) để phân tích từng trạng thái chuyển tiếp vi mô.',
    pedagogy: 'Nhiều hiện tượng vật lý - hóa học diễn ra quá nhanh (như va chạm đàn hồi cực ngắn, xung điện, phản ứng nổ) khiến mắt người bỏ lỡ các bước chuyển hóa năng lượng. Việc kiểm soát dòng thời gian giúp học sinh quan sát rõ từng khoảnh khắc biến thiên của véc-tơ gia tốc và thế năng/động năng.',
    examples: [
      'Dừng con lắc đơn đúng tại điểm biên cực đại để thấy vận tốc bằng 0 và gia tốc đạt giá trị lớn nhất.',
      'Tua chậm 0.1x khoảnh khắc hai viên bi va chạm đàn hồi để kiểm tra định luật bảo toàn động lượng.',
      'Bước từng khung hình quá trình thoi vô sắc kéo các nhiễm sắc thể về hai cực trong nguyên phân.'
    ],
    icon: 'Timer',
    accentColor: 'text-purple-500 border-purple-500/30 bg-purple-500/10'
  },
  {
    id: 'pattern-code-inspector',
    name: '5. Mở Tung Hộp Đen & Inspect Mã Nguồn (Code Inspector & White-Box Physics)',
    tagline: 'Tư duy thuật toán: Hiểu cách máy tính mô phỏng và tính toán các định luật khoa học',
    description: 'Bên cạnh mô phỏng đồ họa, hệ thống luôn tích hợp nút "Inspect Code" để học sinh mở xem phương trình toán học giải tích LaTeX và đoạn mã nguồn thuật toán TypeScript tính toán vật lý (như tích phân Euler-Cromer, thuật toán Runge-Kutta, phép chiếu vector).',
    pedagogy: 'Kết nối Khoa học tự nhiên với Tư duy máy tính (Computational Thinking). Học sinh không chỉ là người tiêu thụ nội dung mà được khích lệ trở thành người sáng tạo công nghệ, hiểu cách máy tính số hóa và tính toán quy luật của tự nhiên.',
    examples: [
      'Xem thuật toán tích phân vi phân giải phương trình con lắc d²θ/dt² = -(g/L)sin(θ).',
      'Xem hàm JavaScript tính định luật Ohm I = U / R và công suất tiêu tán P = I² * R.',
      'Xem cách tính toán trọng tâm đòn bẩy dựa trên phương trình mômen lực torque = F * d.'
    ],
    icon: 'Code2',
    accentColor: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10'
  },
  {
    id: 'pattern-poe-challenge',
    name: '6. Dự Đoán - Thử Nghiệm - Giải Thích (Predict - Observe - Explain / POE Sandbox)',
    tagline: 'Kích hoạt tư duy phản biện bằng cách thử thách trực giác trước khi kích hoạt',
    description: 'Trước khi người học nhấn nút thả rơi hoặc chạy phản ứng, hệ thống sẽ đưa ra câu hỏi dự đoán tương tác (ví dụ: "Theo em, viên bi sắt và chiếc lông chim trong ống chân không vật nào sẽ chạm đáy trước?"). Sau khi học sinh chọn dự đoán, mô phỏng sẽ kích hoạt để đối chiếu kết quả thực nghiệm.',
    pedagogy: 'Phá vỡ các ngộ nhận trực giác thâm căn cố đế (misconceptions) trong nhận thức của học sinh. Sự bất ngờ khi kết quả thực nghiệm trái ngược với dự đoán cảm tính sẽ tạo ra cú hích nhận thức sâu sắc và bền vững.',
    examples: [
      'Dự đoán góc lệch của đĩa cân khi thêm đồng thời phân số 1/3 và 1/6.',
      'Dự đoán độ sáng của hai bóng đèn mắc nối tiếp so với khi mắc song song.',
      'Thử thách điều chỉnh góc bắn pháo để quả đạn chạm đúng mục tiêu trong chuyển động ném xiên.'
    ],
    icon: 'HelpCircle',
    accentColor: 'text-rose-500 border-rose-500/30 bg-rose-500/10'
  }
];

// Helper to construct catalog items cleanly
const createItem = (
  stt: number,
  id: string,
  title: string,
  purpose: string,
  procedure: string[],
  subject: string,
  grade: string,
  lesson: string,
  textbook: string,
  levelId: 'mam-non' | 'tieu-hoc' | 'thcs' | 'thpt',
  interactionPatternId: string,
  interactionPatternName: string,
  hasLiveSim = false,
  liveSimId?: string,
  keyVariables?: string[],
  firstPrinciplesNote?: string,
  preschoolProfile?: PreschoolExplorationData
): SimulationCatalogItem => {
  const isPreschool = levelId === 'mam-non';
  const resolvedHasLiveSim = isPreschool ? true : hasLiveSim;
  const resolvedLiveSimId = isPreschool ? (liveSimId || id) : liveSimId;
  const resolvedPreschoolProfile = isPreschool ? (preschoolProfile || PRESCHOOL_EXPLORATION_MAP[id]) : undefined;

  return {
    stt,
    id,
    title,
    purpose,
    procedure,
    extractedFrom: { subject, grade, lesson, textbook },
    levelId,
    interactionPatternId,
    interactionPatternName,
    hasLiveSim: resolvedHasLiveSim,
    liveSimId: resolvedLiveSimId,
    keyVariables,
    firstPrinciplesNote,
    preschoolProfile: resolvedPreschoolProfile
  };
};

export const SIMULATION_CATALOG: SimulationCatalogItem[] = [
  // =========================================================================
  // CẤP 1: MẦM NON (30 THÍ NGHIỆM: STT 1 -> 30)
  // =========================================================================
  createItem(
    1, 'sim-mn-01', 'Hòa trộn màu sắc ánh sáng & Khám phá thị giác',
    'Giúp trẻ hiểu cách từ 3 màu cơ bản (Đỏ, Lục, Lam) pha trộn thành mọi màu sắc rực rỡ và ánh sáng trắng.',
    ['Bước 1: Bật 3 nguồn sáng Đỏ, Lục, Lam lên màn chiếu trắng.', 'Bước 2: Kéo thanh điều chỉnh cường độ từng màu.', 'Bước 3: Pha Đỏ + Lam tạo màu Tím; Đỏ + Lục tạo màu Vàng.', 'Bước 4: Đẩy cả 3 màu cực đại để thấy ánh sáng Trắng.'],
    'Khám phá Khoa học', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Thế giới màu sắc quanh bé', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Điều khiển biến số thời gian thực (Slider)', true, 'sim-color-mixer',
    ['Cường độ Đỏ (0-255)', 'Cường độ Lục (0-255)', 'Cường độ Lam (0-255)'],
    'Não bộ có 3 loại tế bào nón thị giác tổng hợp quang phổ ánh sáng.'
  ),
  createItem(
    2, 'sim-mn-02', 'Vật chìm hay nổi trong bể nước',
    'Hình thành trực giác sơ khai về khối lượng riêng: vật đặc/nặng chìm xuống, vật nhẹ/rỗng nổi bồng bềnh.',
    ['Bước 1: Chọn các đồ vật: quả bóng, hòn sỏi, chiếc lá, chìa khóa, mẩu xốp.', 'Bước 2: Dự đoán vật nào chìm, vật nào nổi.', 'Bước 3: Thả từng đồ vật vào bể nước trong suốt.', 'Bước 4: Quan sát vị trí dừng lại của vật ở đáy hay mặt nước.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Nước và thế giới đồ vật', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Kéo - Thả vật thể (Drag & Drop)', false, undefined,
    ['Loại vật liệu', 'Mức nước dâng', 'Độ nổi/chìm'],
    'Tiền thân của lực đẩy Archimedes: tương quan giữa trọng lượng và sức đẩy của nước.'
  ),
  createItem(
    3, 'sim-mn-03', 'Cầu bập bênh thăng bằng & So sánh nặng nhẹ',
    'Trẻ khám phá tương quan trọng lượng và khoảng cách: bên nặng hơn sẽ hạ xuống, bên nhẹ hơn nâng lên cao.',
    ['Bước 1: Đặt các con thú bông lên hai đầu bập bênh.', 'Bước 2: Quan sát bập bênh nghiêng về phía con thú nặng hơn.', 'Bước 3: Thêm số lượng con thú nhỏ để bập bênh nằm ngang.', 'Bước 4: Dịch chuyển con vật lại gần hoặc ra xa trục quay.'],
    'Làm quen với Toán', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: So sánh to - nhỏ, nặng - nhẹ', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Kéo - Thả & Cân bằng (Drag & Drop)', false, undefined,
    ['Khối lượng hai bên', 'Khoảng cách đến trục', 'Góc nghiêng'],
    'Tiền thân của định luật mômen lực: cân bằng phụ thuộc cả khối lượng và cánh tay đòn.'
  ),
  createItem(
    4, 'sim-mn-04', 'Chiếc bóng tinh nghịch dưới nguồn sáng',
    'Khám phá bóng tối hình thành khi ánh sáng bị cản; kéo vật lại gần ngọn đèn thì bóng to ra, ra xa thì bóng nhỏ lại.',
    ['Bước 1: Bật ngọn đèn pin chiếu lên tường trắng trong phòng tối.', 'Bước 2: Đặt con khủng long đồ chơi vào giữa đèn và tường.', 'Bước 3: Kéo đồ chơi lại gần ngọn đèn và quan sát bóng phóng to.', 'Bước 4: Kéo đồ chơi lùi về phía tường và quan sát bóng thu nhỏ.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Nguồn sáng và chiếc bóng diệu kỳ', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Điều khiển biến số khoảng cách (Slider)', false, undefined,
    ['Khoảng cách đèn - vật', 'Kích thước bóng đổ'],
    'Định luật truyền thẳng của ánh sáng tạo ra vùng bóng râm hình học.'
  ),
  createItem(
    5, 'sim-mn-05', 'Âm thanh trầm bổng từ cốc nước thủy tinh',
    'Cảm nhận liên hệ giữa lượng nước trong cốc và cao độ âm thanh: cốc nhiều nước tiếng trầm, cốc ít nước tiếng thanh.',
    ['Bước 1: Xếp 5 chiếc cốc giống hệt nhau thành hàng ngang.', 'Bước 2: Rót nước vào các cốc từ vơi đến đầy.', 'Bước 3: Dùng chiếc đũa gõ nhẹ vào từng thành cốc để lắng nghe âm.', 'Bước 4: Gõ liên hoàn tạo thành giai điệu Đồ-Rê-Mi vui tai.'],
    'Cảm thụ Âm nhạc', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Âm thanh vui nhộn quanh bé', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Tương tác rót nước & Gõ âm thanh', false, undefined,
    ['Cột nước trong cốc', 'Tần số rung động', 'Cao độ âm thanh'],
    'Khối lượng nước và cột không khí dao động quyết định tần số âm f.'
  ),
  createItem(
    6, 'sim-mn-06', 'Nam châm thần kỳ hút sắt & kim loại',
    'Trẻ nhận biết nam châm có lực vô hình hút được đinh sắt, kẹp ghim nhưng không hút gỗ, nhựa, vải.',
    ['Bước 1: Rải các vật dụng nhỏ: kẹp giấy, thìa nhôm, cúc nhựa, mẩu gỗ, chìa khóa.', 'Bước 2: Cầm thanh nam châm rê chuột lướt qua các đồ vật.', 'Bước 3: Quan sát kẹp giấy nhảy vọt lên dính chặt vào cực nam châm.', 'Bước 4: Phân loại đồ vật thành nhóm bị hút và nhóm không bị hút.'],
    'Khám phá Khoa học', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Điều kỳ diệu của nam châm', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Kéo - Thả thanh nam châm', false, undefined,
    ['Vật liệu nhiễm từ', 'Khoảng cách hút'],
    'Khái niệm sơ khai về trường lực tác dụng không cần tiếp xúc trực tiếp.'
  ),
  createItem(
    7, 'sim-mn-07', 'Bong bóng xà phòng & Màng căng mặt ngoài',
    'Khám phá vì sao bong bóng luôn luôn có hình cầu tròn trịa hoàn hảo dù que thổi hình tròn, hình vuông hay hình sao.',
    ['Bước 1: Nhúng que thổi hình tròn, hình vuông và hình tam giác vào chậu xà phòng.', 'Bước 2: Thổi nhẹ một luồng hơi tạo ra bong bóng bay lơ lửng.', 'Bước 3: Quan sát bong bóng luôn tự co về hình cầu tròn hoàn hảo.', 'Bước 4: Chạm ngón tay khô vào làm vỡ bóng; nhúng ngón tay ướt xà phòng thì bóng không vỡ.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Nước xà phòng kỳ diệu', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Điều chỉnh lực thổi và độ dẻo màng', false, undefined,
    ['Hình dạng que thổi', 'Hình dạng quả bóng (Hình cầu)'],
    'Lực căng bề mặt luôn kéo màng chất lỏng về diện tích tiếp xúc nhỏ nhất: hình cầu.'
  ),
  createItem(
    8, 'sim-mn-08', 'Hạt mầm vươn mình tìm ánh sáng',
    'Trẻ quan sát sự nảy mầm của hạt giống và hiện tượng ngọn cây uốn cong về phía khe cửa có ánh nắng Mặt Trời.',
    ['Bước 1: Đặt hạt đậu đã ngâm nước vào chậu đất xốp.', 'Bước 2: Đậy hộp kín có khoét một lỗ thủng nhỏ ở góc bên phải.', 'Bước 3: Kéo thanh thời gian trôi qua 3 ngày: hạt nứt vỏ, đâm rễ mầm.', 'Bước 4: Ngày thứ 5: Thân cây vươn dài và uốn cong chuẩn xác về phía lỗ ánh sáng.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Sự kỳ diệu của cây xanh', 'GD Mầm non mới',
    'mam-non', 'pattern-time-control', 'Tua nhanh dòng thời gian sinh trưởng', false, undefined,
    ['Vị trí nguồn sáng', 'Góc uốn của thân cây'],
    'Tính hướng sáng (Phototropism) do hormone auxin phân bố không đều khi có ánh sáng một phía.'
  ),
  createItem(
    9, 'sim-mn-09', 'Chiếc kính lúp & Thế giới siêu nhỏ',
    'Khám phá thấu kính lồi giúp phóng to các chi tiết mắt thường không thấy rõ: gân lá, mắt côn trùng, sợi vải.',
    ['Bước 1: Đặt một chiếc lá bàng và một chú kiến nhỏ lên bàn quan sát.', 'Bước 2: Dùng chuột di chuyển kính lúp lại gần chiếc lá.', 'Bước 3: Điều chỉnh khoảng cách kính lúp để tìm tiêu cự nhìn rõ nhất.', 'Bước 4: Đếm các đường gân lá li ti và các đốt chân của chú kiến.'],
    'Khám phá Khoa học', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Bé làm nhà thám hiểm tí hon', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Khoảng cách tiêu cự & Độ phóng đại', false, undefined,
    ['Khoảng cách thấu kính', 'Độ phóng to ảnh ảo'],
    'Thấu kính hội tụ tạo ảnh ảo cùng chiều và phóng đại khi vật nằm trong tiêu cự.'
  ),
  createItem(
    10, 'sim-mn-10', 'Pha nước chanh & Sự hòa tan của đường',
    'Trẻ phân biệt được chất hòa tan (đường, muối tan biến mất vào nước) và chất không hòa tan (hạt chanh chìm xuống đáy).',
    ['Bước 1: Rót nước lọc vào cốc thủy tinh.', 'Bước 2: Cho một thìa đường cát trắng vào cốc và khuấy đều bằng thìa.', 'Bước 3: Quan sát các hạt đường biến mất hoàn toàn vào trong nước.', 'Bước 4: Vắt chanh vào cốc: hạt chanh không tan mà chìm xuống dưới.'],
    'Khám phá Khoa học', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Nước hòa tan những gì?', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Kéo thìa đường & Khuấy dung dịch', false, undefined,
    ['Chất tan', 'Dung môi nước', 'Vị ngọt nước đường'],
    'Phân tử chất tan phân tán đồng đều xen kẽ giữa các phân tử dung môi.'
  ),
  createItem(
    11, 'sim-mn-11', 'Tĩnh điện vui nhộn từ quả bóng bay',
    'Nhận biết hiện tượng nhiễm điện do cọ xát: Quả bóng cọ vào tóc hút được các mẩu giấy vụn và làm tóc dựng đứng.',
    ['Bước 1: Cọ xát quả bóng cao su vào mái tóc khô nhiều lần.', 'Bước 2: Đưa quả bóng lại gần các mẩu giấy nhỏ trên bàn.', 'Bước 3: Quan sát các mẩu giấy nhảy múa và dính chặt vào quả bóng.', 'Bước 4: Đưa quả bóng lại gần gương phẳng: quả bóng tự dính trên mặt gương.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Hiện tượng kỳ thú quanh bé', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Cọ xát quả bóng & Hút giấy', false, undefined,
    ['Độ cọ xát', 'Điện tích tĩnh', 'Số mẩu giấy bị hút'],
    'Sự chuyển dịch electron tự do tạo nên điện tích trái dấu hút vật trung hòa.'
  ),
  createItem(
    12, 'sim-mn-12', 'Đo chiều dài bằng que tính đồ chơi',
    'Hình thành trực giác đo lường sơ khai: Chiều dài một vật bằng bao nhiêu lần một đơn vị que tính xếp nối tiếp.',
    ['Bước 1: Đặt chiếc bút chì, quyển truyện tranh và hộp màu lên bàn.', 'Bước 2: Kéo các que tính dài 5cm xếp nối đuôi nhau từ đầu đến cuối quyển sách.', 'Bước 3: Đếm số que tính đã dùng (ví dụ: đúng 4 que tính).', 'Bước 4: Kết luận chiều dài quyển sách bằng 4 que tính.'],
    'Làm quen với Toán', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Tập đo độ dài các vật', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Xếp nối tiếp đơn vị đo', false, undefined,
    ['Số que tính', 'Độ dài vật thể'],
    'Bản chất của phép đo là so sánh đại lượng cần đo với một đơn vị chuẩn.'
  ),
  createItem(
    13, 'sim-mn-13', 'Sức gió từ chiếc quạt giấy',
    'Trẻ nhận biết không khí có mặt ở khắp nơi dù không nhìn thấy; khi chuyển động tạo thành gió làm bay chong chóng.',
    ['Bước 1: Đặt chong chóng giấy và chiếc thuyền xốp nhẹ trên bàn.', 'Bước 2: Cầm quạt giấy phẩy nhẹ: Chong chóng bắt đầu quay từ từ.', 'Bước 3: Kéo thanh tăng tốc độ quạt: Gió mạnh làm chong chóng quay tít mù.', 'Bước 4: Hướng quạt đẩy chiếc thuyền xốp trượt đi trên mặt bàn.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Không khí và gió', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Tốc độ quạt & Tốc độ quay chong chóng', false, undefined,
    ['Vận tốc luồng khí', 'Lực đẩy của gió'],
    'Gió là dòng dịch chuyển của các khối phân tử không khí mang động năng.'
  ),
  createItem(
    14, 'sim-mn-14', 'Giọt nước biến mất trên sân nắng (Bay hơi)',
    'Khám phá sự bay hơi của nước: Giọt nước đọng trên mặt đất dưới trời nắng sẽ khô dần và biến thành hơi nước trong không khí.',
    ['Bước 1: Chấm một giọt nước tròn trên phiến đá dưới ánh nắng Mặt Trời.', 'Bước 2: Quan sát giọt nước mỏng dần và co nhỏ lại theo thời gian.', 'Bước 3: Tăng nhiệt độ nắng: Giọt nước bốc hơi nhanh gấp đôi.', 'Bước 4: Chấm một giọt nước khác trong bóng râm mát để so sánh tốc độ khô.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Nước bốc hơi đi đâu?', 'GD Mầm non mới',
    'mam-non', 'pattern-time-control', 'Tua thời gian bay hơi & Nhiệt độ', false, undefined,
    ['Nhiệt độ sân đá', 'Kích thước giọt nước', 'Thời gian bay hơi'],
    'Nhiệt năng cung cấp động năng cho phân tử nước thắng lực liên kết và thoát vào không khí.'
  ),
  createItem(
    15, 'sim-mn-15', 'Tranh màu ma thuật trên đĩa sữa (Hiệu ứng xà phòng)',
    'Trẻ kinh ngạc quan sát giọt nước rửa bát làm các hạt màu thực phẩm bùng nổ và hòa trộn cuộn tròn trên mặt đĩa sữa.',
    ['Bước 1: Đổ một lớp sữa tươi mỏng vào đĩa sâu lòng.', 'Bước 2: Nhỏ các giọt màu Đỏ, Xanh, Vàng vào giữa đĩa sữa.', 'Bước 3: Nhúng tăm bông có chấm nước rửa bát vào chính giữa.', 'Bước 4: Quan sát các vệt màu nổ tung, tự động cuộn xoáy thành hoa văn kỳ diệu.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Bức tranh sữa biết nhảy múa', 'GD Mầm non mới',
    'mam-non', 'pattern-particle-sandbox', 'Tương tác giọt xà phòng & Xoáy màu', false, undefined,
    ['Sức căng bề mặt', 'Chất hoạt động bề mặt', 'Dòng xoáy màu sắc'],
    'Xà phòng phá vỡ sức căng bề mặt của sữa và liên kết chất béo, tạo dòng đối lưu Marangoni.'
  ),
  createItem(
    16, 'sim-mn-16', 'Quả trứng chìm hay nổi trong nước muối',
    'Khám phá sự thay đổi lực đẩy của nước khi thêm muối: Trứng chìm trong nước lọc nhưng nổi lơ lửng trong nước muối đậm đặc.',
    ['Bước 1: Thả quả trứng gà vào cốc nước lọc: quả trứng chìm nghỉm dưới đáy.', 'Bước 2: Múc từng thìa muối đổ vào cốc và khuấy tan.', 'Bước 3: Sau 3 thìa muối: quả trứng bắt đầu nhấc mình khỏi đáy cốc.', 'Bước 4: Đến thìa muối thứ 5: quả trứng nổi hẳn lên bề mặt cốc nước.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Quả trứng nổi kỳ diệu', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Thêm muối & Độ nổi của trứng', false, undefined,
    ['Lượng muối hòa tan', 'Khối lượng riêng dung dịch', 'Độ nổi quả trứng'],
    'Hòa tan muối làm tăng khối lượng riêng của nước cho tới khi lớn hơn khối lượng riêng của trứng.'
  ),
  createItem(
    17, 'sim-mn-17', 'Kính lọc màu & Thế giới đổi màu',
    'Trẻ cầm tấm nhựa trong màu Đỏ, Lam, Vàng nhìn ra cảnh vật để thấy cảnh vật biến sắc và các hình vẽ bí mật hiện ra.',
    ['Bước 1: Chọn tấm kính lọc màu Đỏ đặt trước mắt.', 'Bước 2: Nhìn bức tranh có các nét vẽ lẫn lộn đỏ và xanh lam.', 'Bước 3: Quan sát nét vẽ màu đỏ biến mất, chỉ còn nét vẽ màu xanh hiện rõ.', 'Bước 4: Đổi sang tấm kính màu Xanh để khám phá bức tranh biến hóa ngược lại.'],
    'Khám phá Khoa học', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Đôi mắt kính màu thần kỳ', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Đặt tấm lọc màu trước mắt', false, undefined,
    ['Màu tấm lọc', 'Màu ánh sáng truyền qua'],
    'Tấm lọc màu chỉ cho ánh sáng có bước sóng trùng với màu của nó đi qua, hấp thụ các màu khác.'
  ),
  createItem(
    18, 'sim-mn-18', 'Đôi chân thăng bằng trên cầu gỗ hẹp',
    'Trẻ khám phá cách dang hai tay sang ngang giúp giữ thăng bằng cơ thể tốt hơn khi đi trên cầu hẹp.',
    ['Bước 1: Điều khiển bạn nhỏ bước đi trên thanh cầu gỗ hẹp bắc qua con suối nhỏ.', 'Bước 2: Khi bạn nhỏ khép hai tay lại: cơ thể lắc lư mạnh và dễ ngã.', 'Bước 3: Nhấn nút dang rộng hai tay sang ngang: cơ thể vững vàng thăng bằng.', 'Bước 4: Hoàn thành bước đi hết thanh gỗ an toàn sang bờ bên kia.'],
    'Phát triển Thể chất', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Bé rèn luyện thăng bằng', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Góc dang tay & Độ nghiêng trọng tâm', false, undefined,
    ['Góc dang tay', 'Vị trí trọng tâm', 'Độ ổn định thăng bằng'],
    'Dang rộng tay làm tăng mômen quán tính quanh trục đứng, giảm tốc độ lắc lư và hạ thấp trọng tâm.'
  ),
  createItem(
    19, 'sim-mn-19', 'Gương phẳng và ảnh phản chiếu của bé',
    'Trẻ nhận biết hình ảnh trong gương phẳng là hình ảnh giống hệt mình nhưng bị đổi chiều trái - phải.',
    ['Bước 1: Bạn nhỏ đứng trước chiếc gương soi lớn trong phòng.', 'Bước 2: Bạn nhỏ giơ tay phải lên vẫy chào.', 'Bước 3: Quan sát người bạn trong gương giơ tay ở phía đối diện (tay trái của hình ảnh).', 'Bước 4: Tiến lại gần hoặc lùi xa gương để quan sát ảnh trong gương cũng di chuyển theo.'],
    'Khám phá Bản thân', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Bé soi gương thấy ai?', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Khoảng cách bé - gương phẳng', false, undefined,
    ['Khoảng cách vật - gương', 'Khoảng cách ảnh - gương', 'Đối xứng trái - phải'],
    'Định luật phản xạ ánh sáng tạo ra ảnh ảo đối xứng trục qua mặt gương phẳng.'
  ),
  createItem(
    20, 'sim-mn-20', 'Đất nặn biến hình & Bảo toàn khối lượng',
    'Hình thành trực giác bảo toàn sơ khai: Viên đất nặn dù vê tròn, bóp dẹp hay kéo dài thì lượng đất vẫn không đổi.',
    ['Bước 1: Đặt viên đất sét tròn nặng 100g lên đĩa cân.', 'Bước 2: Dùng tay bóp dẹp viên đất sét thành chiếc bánh dẹt.', 'Bước 3: Đặt chiếc bánh dẹt lên cân: kim cân vẫn chỉ chính xác 100g.', 'Bước 4: Chia nhỏ viên đất thành 5 viên bi con đặt lên cân: tổng khối lượng vẫn là 100g.'],
    'Làm quen với Toán', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Khối lượng không đổi khi đổi hình', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Nặn biến hình khối đất sét', false, undefined,
    ['Hình dạng viên đất', 'Khối lượng đo được (100g)'],
    'Bảo toàn khối lượng: Sự thay đổi hình học không làm thay đổi lượng vật chất cấu thành.'
  ),
  createItem(
    21, 'sim-mn-21', 'Âm thanh rung động của dây chun buộc hộp',
    'Trẻ nhận biết âm thanh sinh ra từ sự rung động: Gảy sợi dây chun thấy dây rung mờ đi và phát ra tiếng bưng bưng.',
    ['Bước 1: Căng một sợi dây chun co giãn quanh hộp carton rỗng.', 'Bước 2: Dùng ngón tay gảy nhẹ sợi dây chun: Quan sát dây rung nhanh và phát ra tiếng kêu.', 'Bước 3: Dùng ngón tay giữ chặt sợi dây chun: Dây ngừng rung và âm thanh tắt ngấm.', 'Bước 4: Kéo căng sợi dây chun hơn nữa: Tiếng gảy phát ra cao và trong hơn.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Âm thanh từ đâu ra?', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Độ căng dây & Tần số rung', false, undefined,
    ['Độ căng dây chun', 'Tốc độ rung', 'Cao độ âm thanh'],
    'Mọi nguồn âm đều bắt nguồn từ dao động cơ học của vật thể.'
  ),
  createItem(
    22, 'sim-mn-22', 'Dẫn nhiệt thìa kim loại và thìa gỗ trong nước ấm',
    'Trẻ cảm nhận sự truyền nhiệt: Cán thìa nhôm nhanh chóng ấm lên, trong khi cán thìa gỗ vẫn mát rượi.',
    ['Bước 1: Cắm đồng thời 1 chiếc thìa nhôm và 1 chiếc thìa gỗ vào bát nước nóng.', 'Bước 2: Đặt đầu ngón tay chạm vào đầu cán của hai chiếc thìa.', 'Bước 3: Sau 30 giây: Cán thìa nhôm ấm nóng rõ rệt, còn cán thìa gỗ không đổi nhiệt độ.', 'Bước 4: Giải thích lý do vì sao đũa nấu ăn thường được làm bằng gỗ hoặc nhựa.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Đồ vật nào dẫn nhiệt tốt?', 'GD Mầm non mới',
    'mam-non', 'pattern-time-control', 'Thời gian truyền nhiệt & Nhiệt độ cán', false, undefined,
    ['Chất liệu thìa (Nhôm vs Gỗ)', 'Nhiệt độ cảm nhận'],
    'Kim loại có các electron tự do dẫn nhiệt nhanh hơn hàng nghìn lần so với gỗ có cấu trúc xốp.'
  ),
  createItem(
    23, 'sim-mn-23', 'Giữ ấm cơ thể bằng chiếc áo bông xốp',
    'Khám phá lớp không khí đứng yên trong bông xốp chính là chiếc chăn giữ ấm tốt nhất cho bé vào mùa đông.',
    ['Bước 1: Đặt hai bình nước ấm 40°C trong phòng lạnh mùa đông.', 'Bước 2: Bình A bọc lớp áo bông xốp dày; Bình B để trần không bọc.', 'Bước 3: Kéo thời gian trôi qua 1 tiếng đồng hồ.', 'Bước 4: Đo nhiệt kế: Bình B đã nguội ngắt còn 20°C, Bình A vẫn ấm áp 37°C.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Giữ ấm khi trời lạnh', 'GD Mầm non mới',
    'mam-non', 'pattern-time-control', 'Thời gian giữ nhiệt mùa đông', false, undefined,
    ['Lớp áo bọc ngoài', 'Nhiệt độ bình nước'],
    'Không khí đứng yên là chất cách nhiệt tự nhiên tuyệt vời nhất.'
  ),
  createItem(
    24, 'sim-mn-24', 'Gieo hạt trên bông ẩm và trên sỏi khô',
    'Nhận biết điều kiện để hạt nảy mầm: Hạt cần có nước ẩm và không khí; gieo trên sỏi khô hạt sẽ không nảy mầm.',
    ['Bước 1: Chuẩn bị khay A lót bông gòn tẩm nước ẩm; khay B rải sỏi đá khô cong.', 'Bước 2: Gieo 5 hạt đỗ xanh vào mỗi khay.', 'Bước 3: Đặt cả hai khay ở nơi có ánh sáng và không khí thoáng mát.', 'Bước 4: Sau 2 ngày: Hạt ở khay A đâm chồi xanh mơn mởn, hạt ở khay B vẫn nằm yên khô cứng.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Cây cần gì để nảy mầm?', 'GD Mầm non mới',
    'mam-non', 'pattern-time-control', 'Thời gian nảy mầm 3 ngày', false, undefined,
    ['Độ ẩm của giá thể', 'Tỷ lệ nảy mầm'],
    'Nước kích hoạt enzyme thủy phân tinh bột trong phôi mầm giải phóng năng lượng sinh trưởng.'
  ),
  createItem(
    25, 'sim-mn-25', 'Bánh xe lăn trên cát và lăn trên sàn gạch',
    'Cảm nhận lực ma sát cản trở chuyển động: Xe đẩy trên sàn gạch trơn trượt nhẹ tênh, đẩy trên cát lún rất nặng.',
    ['Bước 1: Đặt chiếc ô tô đồ chơi trên sàn gạch men nhẵn bóng.', 'Bước 2: Đẩy nhẹ một lực: Ô tô phóng vèo đi rất xa.', 'Bước 3: Chuyển ô tô sang bãi cát lún nhấp nhô và đẩy cùng lực đó.', 'Bước 4: Ô tô dừng lại ngay sau vài centimet do cát cản bánh xe.'],
    'Khám phá Khoa học', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Bánh xe lăn đi đâu?', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Lực đẩy & Mặt đường di chuyển', false, undefined,
    ['Độ gồ ghề mặt đường', 'Quãng đường xe lăn'],
    'Lực ma sát lăn và ma sát cản trở chuyển động của bánh xe trên bề mặt mềm.'
  ),
  createItem(
    26, 'sim-mn-26', 'Thuyền giấy gấp và thuyền đất sét',
    'Khám phá hình dáng quyết định sự nổi: Cùng một lượng đất sét vo tròn thì chìm, nặn thành chiếc thuyền trũng thì nổi.',
    ['Bước 1: Thả một viên đất sét vo tròn vào nước: Đất sét chìm thẳng xuống đáy.', 'Bước 2: Vớt viên đất sét lên, dùng ngón tay ấn trũng tạo hình chiếc thuyền có viền cao.', 'Bước 3: Đặt chiếc thuyền đất sét nhẹ nhàng lên mặt nước: Thuyền nổi bồng bềnh!', 'Bước 4: Đặt thêm 3 chú thú bông nhỏ vào thuyền đất sét mà thuyền vẫn không chìm.'],
    'Khám phá Khoa học', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Chiếc thuyền của bé', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Nặn dáng thuyền & Thả trôi', false, undefined,
    ['Hình dạng ruột rỗng', 'Thể tích chiếm chỗ'],
    'Tăng thể tích chiếm chỗ làm tăng lực đẩy Archimedes của nước thắng trọng lượng vật.'
  ),
  createItem(
    27, 'sim-mn-27', 'Cầu vồng nhân tạo từ bình xịt nước dưới nắng',
    'Trẻ tự tay tạo ra dải cầu vồng 7 màu bằng cách đứng quay lưng về phía Mặt Trời và xịt làn sương nước mịn.',
    ['Bước 1: Chọn vị trí đứng có ánh nắng chiếu từ sau lưng tới trước mặt.', 'Bước 2: Cầm bình xịt phun ra một làn sương nước li ti vào không khí.', 'Bước 3: Quan sát dải màu cầu vồng lung linh uốn cong xuất hiện trong màn sương mù.', 'Bước 4: Đếm các dải màu chính: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.'],
    'Khám phá Thiên nhiên', 'Mẫu giáo 5 - 6 tuổi', 'Chủ đề: Cầu vồng sau cơn mưa', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Góc phun sương & Góc chiếu nắng', false, undefined,
    ['Góc tán sắc 42 độ', 'Quang phổ 7 sắc cầu vồng'],
    'Mỗi giọt nước đóng vai trò như một lăng kính phản xạ và khúc xạ tán sắc ánh sáng mặt trời.'
  ),
  createItem(
    28, 'sim-mn-28', 'Ngửi mùi thơm & Vị giác chua - ngọt - mặn',
    'Trẻ phân biệt các giác quan: Chiếc mũi ngửi mùi hương hoa, chiếc lưỡi nếm vị chua của chanh và ngọt của kẹo.',
    ['Bước 1: Đưa bông hoa hồng lại gần chiếc mũi: Bé nhận biết mùi hương ngào ngạt.', 'Bước 2: Chấm một giọt mật ong lên đầu lưỡi: Vị giác cảm nhận vị ngọt lịm.', 'Bước 3: Chấm một giọt nước chanh: Vị chua làm mắt nháy tít.', 'Bước 4: Ghép nối đúng hình ảnh các món ăn với cơ quan giác quan tương ứng.'],
    'Khám phá Giác quan', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Năm giác quan kỳ diệu', 'GD Mầm non mới',
    'mam-non', 'pattern-drag-drop', 'Ghép nối vị giác và khứu giác', false, undefined,
    ['Thụ thể vị giác', 'Tín hiệu thần kinh về não'],
    'Hóa thụ thể trên chồi vị giác và tế bào khứu giác gửi xung tín hiệu lên vỏ não.'
  ),
  createItem(
    29, 'sim-mn-29', 'Cát ướt xây lâu đài và cát khô rời rạc',
    'Khám phá vai trò của nước liên kết hạt cát: Cát khô trôi qua kẽ tay, cát ẩm kết dính nặn thành lâu đài tráng lệ.',
    ['Bước 1: Đổ một xô cát khô cong vào khuôn: Nhấc khuôn ra cát sụp đổ tan tành.', 'Bước 2: Rót thêm một lượng nước vừa đủ vào cát và nhào trộn đều.', 'Bước 3: Dùng xẻng nén cát ẩm vào khuôn lâu đài rồi nhấc khuôn lên.', 'Bước 4: Lâu đài cát sừng sững kiên cố với các tháp nhọn hoàn hảo.'],
    'Khám phá Tự nhiên', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Bé chơi với cát và nước', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Độ ẩm cát & Độ bền lâu đài', false, undefined,
    ['Lượng nước liên kết', 'Cầu mao dẫn chất lỏng'],
    'Lực căng bề mặt của màng nước mỏng tạo cầu nối mao dẫn liên kết các hạt cát rời rạc.'
  ),
  createItem(
    30, 'sim-mn-30', 'Thổi còi to - nhỏ theo sức của hơi thở',
    'Trẻ cảm nhận tương quan năng lượng: Thổi hơi nhẹ còi kêu khẽ lí nhí, lấy hơi sâu thổi mạnh còi vang dội.',
    ['Bước 1: Cầm chiếc còi nhựa đưa lên miệng.', 'Bước 2: Thổi một luồng hơi nhẹ: Chiếc còi phát ra âm thanh êm dịu nhỏ nhẹ.', 'Bước 3: Hít một hơi thật sâu rồi thổi mạnh dứt khoát.', 'Bước 4: Quan sát sóng âm hiển thị dao động biên độ cực lớn vang khắp phòng.'],
    'Cảm thụ Âm nhạc', 'Mẫu giáo 4 - 5 tuổi', 'Chủ đề: Hơi thở và tiếng còi', 'GD Mầm non mới',
    'mam-non', 'pattern-slider', 'Áp lực hơi thở & Độ to của âm (dB)', false, undefined,
    ['Cường độ luồng khí', 'Biên độ sóng âm', 'Độ to âm thanh'],
    'Năng lượng cung cấp quyết định biên độ dao động của cột khí trong còi (Biên độ càng lớn âm càng to).'
  ),

  // =========================================================================
  // CẤP 2: TIỂU HỌC (10 THÍ NGHIỆM: STT 1 -> 10)
  // =========================================================================
  createItem(
    1, 'sim-th-01', 'Cân đĩa thăng bằng & Bản chất Phân số đại số',
    'Xóa tan cảm giác trừu tượng khi học phân số: Dấu bằng (=) chính là chiếc cân thăng bằng bảo toàn giá trị lượng số.',
    ['Bước 1: Chọn đĩa bên trái có 1 chiếc bánh trọn vẹn (giá trị 1).', 'Bước 2: Kéo các lát bánh 1/2, 1/4, 1/8 đặt lên đĩa bên phải.', 'Bước 3: Quan sát kim cân lệch khi tổng hai bên chưa bằng nhau.', 'Bước 4: Thêm lát 1/4 và 1/8 để cân thăng bằng tuyệt đối: 1 = 1/2 + 1/4 + 1/4.'],
    'Toán học 4', 'Lớp 4', 'Bài 53: Khái niệm phân số & Phân số bằng nhau', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Kéo - Thả linh kiện & Cân bằng (Drag & Drop)', true, 'sim-balance-fraction',
    ['Khối lượng đĩa trái (LHS)', 'Khối lượng đĩa phải (RHS)', 'Góc lệch kim cân'],
    'Phương trình toán học là một cái cân bảo toàn giá trị đại số hai vế.'
  ),
  createItem(
    2, 'sim-th-02', 'Vòng tuần hoàn của nước trong tự nhiên',
    'Mô phỏng 3 trạng thái của nước và các quá trình bay hơi, ngưng tụ, tạo mây và mưa theo chu trình nhiệt Mặt Trời.',
    ['Bước 1: Tăng cường độ chiếu sáng của Mặt Trời chiếu xuống biển xanh.', 'Bước 2: Quan sát phân tử nước nhận nhiệt bốc hơi bay lên khí quyển.', 'Bước 3: Hạ nhiệt độ trên cao làm hơi nước ngưng tụ thành mây đen trĩu nặng.', 'Bước 4: Nhấn nút tạo mưa để nước rơi xuống núi rồi chảy về đại dương.'],
    'Khoa học 4', 'Lớp 4', 'Bài 2: Sự chuyển thể của nước và vòng tuần hoàn', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-particle-sandbox', 'Hệ hạt vi mô & Điều khiển nhiệt độ', false, undefined,
    ['Nhiệt độ (°C)', 'Tốc độ bay hơi', 'Lượng mưa ngưng tụ'],
    'Bảo toàn vật chất: Nước luân chuyển liên tục qua trao đổi nhiệt năng.'
  ),
  createItem(
    3, 'sim-th-03', 'Mạch điện kín thắp sáng bóng đèn pin',
    'Nhận biết điều kiện để có dòng điện: Phải tạo thành một đường dẫn khép kín từ cực dương qua bóng đèn về cực âm của pin.',
    ['Bước 1: Kéo viên pin 1.5V, bóng đèn và công tắc K ra bàn thí nghiệm.', 'Bước 2: Kéo dây điện nối cực dương của pin vào đuôi bóng đèn.', 'Bước 3: Nối cực còn lại của đèn qua công tắc K rồi về cực âm viên pin.', 'Bước 4: Đóng công tắc K: Quan sát mạch kín được thiết lập và bóng đèn phát sáng.'],
    'Khoa học 5', 'Lớp 5', 'Bài 14: Năng lượng điện và Mạch điện đơn giản', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Kéo - Thả & Lắp ráp linh kiện', false, undefined,
    ['Trạng thái công tắc K', 'Điện áp pin (V)', 'Độ sáng bóng đèn'],
    'Dòng điện chỉ có thể chạy liên tục khi có một vòng tuần hoàn kín.'
  ),
  createItem(
    4, 'sim-th-04', 'Đòn bẩy & Mặt phẳng nghiêng sơ cấp',
    'Chứng minh quy tắc vàng về cơ học: Được lợi về lực thì thiệt hại về đường đi (F.d = const khi bỏ qua ma sát).',
    ['Bước 1: Đặt khối đá nặng 50kg lên mặt phẳng nghiêng có góc dốc thay đổi.', 'Bước 2: Giảm góc nghiêng của tấm ván để thấy lực kéo F giảm rõ rệt.', 'Bước 3: Chuyển sang mô hình đòn bẩy: Dịch điểm tựa O lại gần tảng đá.', 'Bước 4: Ấn vào đầu xa của đòn bẩy để nâng tảng đá lên nhẹ nhàng.'],
    'Khoa học 5', 'Lớp 5', 'Bài 18: Máy cơ đơn giản quanh em', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc nghiêng & Cánh tay đòn', false, undefined,
    ['Góc nghiêng (°)', 'Chiều dài cánh tay đòn (m)', 'Lực kéo F (N)'],
    'Công cơ học A = F.s bảo toàn khi nâng vật lên cùng một độ cao.'
  ),
  createItem(
    5, 'sim-th-05', 'Khúc xạ ánh sáng - Chiếc đũa gãy trong cốc nước',
    'Giải thích hiện tượng chiếc đũa cắm xiên trong cốc nước trông như bị bẻ gãy ở mặt phân cách giữa không khí và nước.',
    ['Bước 1: Cắm chiếc đũa thẳng nghiêng một góc vào chiếc cốc rỗng.', 'Bước 2: Rót nước từ từ vào cốc nước trong suốt.', 'Bước 3: Quan sát tia sáng phản xạ từ đầu đũa bị gập góc khi đi ra không khí.', 'Bước 4: Bật tính năng tia ảo để thấy ảnh của chiếc đũa bị nâng lên cao.'],
    'Khoa học 4', 'Lớp 4', 'Bài 11: Ánh sáng và sự truyền ánh sáng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Kéo trượt góc tới của tia sáng', false, undefined,
    ['Góc tới i', 'Góc khúc xạ r', 'Độ lệch hình ảnh chiếc đũa'],
    'Vận tốc ánh sáng trong nước chậm hơn trong không khí dẫn đến hiện tượng gập góc khúc xạ.'
  ),
  createItem(
    6, 'sim-th-06', 'Thước đo phân số & Trục số trực quan',
    'Giúp học sinh hình dung phân số như một vị trí chính xác trên trục số thực liên tục; hiểu rút gọn và quy đồng mẫu số.',
    ['Bước 1: Chọn trục số từ 0 đến 1 chia làm 12 vạch đều nhau.', 'Bước 2: Di chuyển con trỏ đến vị trí 6/12: Hệ thống hiển thị phân số rút gọn 1/2.', 'Bước 3: Thêm điểm thứ hai tại 2/3 (tức 8/12) và quan sát quy đồng tự động.', 'Bước 4: So sánh độ dài hình học để kết luận 6/12 < 8/12.'],
    'Toán học 4', 'Lớp 4', 'Bài 56: Rút gọn phân số và Quy đồng mẫu số', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Điều khiển con trỏ trục số thực', false, undefined,
    ['Tử số', 'Mẫu số', 'Tọa độ trục số x'],
    'Mọi phân số đều biểu diễn một độ dài hình học chính xác trên trục số thực.'
  ),
  createItem(
    7, 'sim-th-07', 'Sự nở vì nhiệt của chất lỏng trong nhiệt kế',
    'Quan sát chất lỏng nở ra khi nóng lên và co lại khi lạnh đi, nguyên lý hoạt động của chiếc nhiệt kế đo độ ẩm/nhiệt độ.',
    ['Bước 1: Đặt bình cầu chứa nước màu có cắm ống thủy tinh nhỏ vào chậu nước lạnh.', 'Bước 2: Đánh dấu ngấn nước màu ban đầu ở vạch 20°C.', 'Bước 3: Chuyển bình cầu sang chậu nước sôi 80°C.', 'Bước 4: Quan sát cột nước màu nhanh chóng dâng cao trong ống thủy tinh.'],
    'Khoa học 4', 'Lớp 4', 'Bài 15: Nhiệt độ và Sự truyền nhiệt', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Nhiệt độ nước & Độ cao cột chất lỏng', false, undefined,
    ['Nhiệt độ (°C)', 'Thể tích chất lỏng dâng lên'],
    'Khi nhiệt độ tăng, các phân tử chuyển động hỗn loạn mạnh hơn làm tăng khoảng cách trung bình.'
  ),
  createItem(
    8, 'sim-th-08', 'Nam châm & Kim la bàn chỉ hướng Bắc - Nam',
    'Khám phá từ trường Trái Đất: Kim la bàn tự do luôn quay về hướng Bắc - Nam địa lý do tương tác với địa từ trường.',
    ['Bước 1: Đặt một kim la bàn có trục quay tự do trên bàn.', 'Bước 2: Xoay vỏ la bàn theo hướng bất kỳ: Kim nam châm tự động quay về hướng Bắc.', 'Bước 3: Đưa một thanh nam châm lại gần: Kim la bàn bị lệch khỏi hướng Bắc.', 'Bước 4: Rút thanh nam châm ra xa: Kim lập tức định hướng trở lại Bắc - Nam.'],
    'Khoa học 5', 'Lớp 5', 'Bài 12: Nam châm và La bàn chỉ hướng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Xoay la bàn & Tương tác nam châm', false, undefined,
    ['Góc xoay la bàn', 'Hướng từ trường Bắc - Nam'],
    'Trái Đất là một nam châm khổng lồ với cực Nam từ trường nằm gần cực Bắc địa lý.'
  ),
  createItem(
    9, 'sim-th-09', 'Cây thoát hơi nước qua lỗ khí của lá',
    'Chứng minh cây hút nước từ rễ và thoát hơi nước qua lá: Trùm túi nilon quanh cành lá thấy đọng đầy những giọt nước.',
    ['Bước 1: Chọn một chậu cây xanh tươi tốt.', 'Bước 2: Dùng túi nilon trong suốt trùm kín một cành lá và buộc chặt cuống.', 'Bước 3: Đặt chậu cây ngoài trời nắng trong 2 giờ.', 'Bước 4: Quan sát thành túi nilon mờ đi và đọng lại rất nhiều giọt nước nhỏ li ti.'],
    'Khoa học 4', 'Lớp 4', 'Bài 20: Nhu cầu sống của thực vật', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian thoát hơi nước dưới nắng', false, undefined,
    ['Cường độ ánh sáng', 'Lượng nước ngưng tụ'],
    'Thoát hơi nước tạo sức hút kéo cột nước và muối khoáng từ rễ lên nuôi toàn bộ thân lá.'
  ),
  createItem(
    10, 'sim-th-10', 'Tính dẫn nhiệt của kim loại, nhựa và gỗ',
    'So sánh tốc độ truyền nhiệt của ba thanh vật liệu: Thanh đồng làm chảy sáp rơi đinh sắt nhanh nhất, gỗ chậm nhất.',
    ['Bước 1: Gắn 3 chiếc đinh nhỏ bằng sáp nến vào 3 thanh Đồng, Nhựa, Gỗ cùng kích thước.', 'Bước 2: Đun nóng đầu đối diện của 3 thanh bằng ngọn đèn cồn.', 'Bước 3: Quan sát nhiệt truyền dọc theo thân từng thanh vật liệu.', 'Bước 4: Đinh ở thanh đồng rơi xuống đầu tiên sau 10s; đinh ở thanh gỗ không rơi.'],
    'Khoa học 4', 'Lớp 4', 'Bài 16: Vật dẫn nhiệt tốt và vật dẫn nhiệt kém', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian chảy sáp rơi đinh', false, undefined,
    ['Vật liệu thanh (Đồng, Nhựa, Gỗ)', 'Thời gian rơi đinh'],
    'Hệ số dẫn nhiệt của kim loại vượt trội nhờ mạng tinh thể và mật độ electron dẫn tự do cao.'
  ),

// =========================================================================
  // CẤP 3: THCS (20 THÍ NGHIỆM: STT 1 -> 20)
  // =========================================================================
  createItem(
    1, 'sim-thcs-01', 'Phòng Lab Mạch Điện DC & Định Luật Ohm Trực Quan',
    'Làm sáng tỏ bản chất của định luật Ohm: Cường độ dòng điện I = U / R, trực quan hóa dòng trôi của các hạt electron.',
    ['Bước 1: Mở mạch điện DC gồm nguồn điện biến thiên, biến trở R, ampe kế và bóng đèn.', 'Bước 2: Kéo thanh trượt điện áp U từ 1V lên 24V: Quan sát tốc độ trôi của electron tăng nhanh.', 'Bước 3: Tăng điện trở R từ 2Ω lên 50Ω: Dòng điện I giảm dần, bóng đèn mờ đi.', 'Bước 4: Quan sát đồ thị đặc tuyến Volt - Ampe (I theo U) là đường thẳng dốc 1/R.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 23: Tác dụng của dòng điện & Định luật Ohm', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Điều khiển biến số liên tục (Continuous Slider)', true, 'sim-electric-circuit',
    ['Hiệu điện thế U (V)', 'Điện trở R (Ω)', 'Dòng điện I (A)', 'Công suất P (W)'],
    'Dòng điện là dòng dịch chuyển có hướng của electron dưới tác dụng của điện trường.'
  ),
  createItem(
    2, 'sim-thcs-02', 'Định luật bảo toàn khối lượng trong phản ứng hóa học',
    'Chứng minh định luật Lomonosov - Lavoisier: Tổng khối lượng các chất tham gia luôn bằng tổng khối lượng sản phẩm.',
    ['Bước 1: Đặt bình nón chứa dung dịch BaCl2 và ống nghiệm chứa Na2SO4 lên cân điện tử có nắp kín.', 'Bước 2: Ghi lại khối lượng ban đầu m = 152.35 gam.', 'Bước 3: Nghiêng bình nón để hai chất trộn vào nhau tạo kết tủa trắng BaSO4.', 'Bước 4: Quan sát số chỉ cân điện tử sau phản ứng: Vẫn giữ nguyên chính xác 152.35 gam.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 6: Định luật bảo toàn khối lượng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-poe-challenge', 'Dự đoán - Thực nghiệm - Kiểm chứng (POE)', false, undefined,
    ['Khối lượng trước m1', 'Khối lượng sau m2', 'Hiện tượng kết tủa BaSO4'],
    'Phản ứng hóa học chỉ sắp xếp lại liên kết; số lượng và loại nguyên tử hoàn toàn bảo toàn.'
  ),
  createItem(
    3, 'sim-thcs-03', 'Áp suất chất lỏng & Lực đẩy Archimedes (FA = d.V)',
    'Trực quan hóa độ chênh lệch áp suất thủy tĩnh giữa đáy dưới và mặt trên của vật chìm sinh ra lực đẩy Ác-si-mét.',
    ['Bước 1: Treo khối kim loại vào lực kế trong không khí (lực kế chỉ P = 5N).', 'Bước 2: Nhúng ngập dần khối kim loại vào bình tràn chứa nước.', 'Bước 3: Lực kế giảm xuống còn 3N; lượng nước tràn ra đúng bằng 2N.', 'Bước 4: Thay đổi chất lỏng sang dầu ăn và nước muối để kiểm chứng FA = d.V.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 16: Áp suất chất lỏng & Lực đẩy Archimedes', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Kéo thả vật thể & Đo cảm biến lực', false, undefined,
    ['Thể tích V (m³)', 'Trọng lượng riêng chất lỏng d', 'Lực đẩy FA (N)'],
    'Lực đẩy Archimedes bằng trọng lượng khối chất lỏng bị vật chiếm chỗ.'
  ),
  createItem(
    4, 'sim-thcs-04', 'Khúc xạ ánh sáng & Tạo ảnh qua Thấu kính hội tụ',
    'Vẽ và tính toán đường đi của 3 tia sáng đặc biệt qua quang tâm O, tiêu điểm F để dựng ảnh thật hoặc ảnh ảo.',
    ['Bước 1: Đặt ngọn nến sáng trước thấu kính hội tụ có tiêu cự f = 10cm.', 'Bước 2: Di chuyển khoảng cách d từ nến đến thấu kính (d > 2f, f < d < 2f, d < f).', 'Bước 3: Di chuyển màn hứng phía sau thấu kính để tìm vị trí ảnh sắc nét nhất.', 'Bước 4: Kiểm chứng công thức liên hệ tiêu cự: 1/f = 1/d + 1/d\'.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 5: Khúc xạ ánh sáng và Thấu kính', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khoảng cách vật d & Dựng 3 tia sáng', false, undefined,
    ['Khoảng cách vật d (cm)', 'Khoảng cách ảnh d\' (cm)', 'Tiêu cự f (cm)', 'Độ phóng đại k'],
    'Định luật khúc xạ ánh sáng Snell-Descartes tại hai mặt cong thấu kính uốn hội tụ chùm tia.'
  ),
  createItem(
    5, 'sim-thcs-05', 'Mô phỏng phân bào nguyên phân & Nhiễm sắc thể',
    'Mô phỏng 4 kỳ của quá trình nguyên phân để hiểu cơ chế bảo tồn bộ nhiễm sắc thể lưỡng bội 2n của tế bào mẹ.',
    ['Bước 1: Chọn tế bào nhân thực có bộ NST 2n = 4.', 'Bước 2: Nhấn bắt đầu chu kỳ: Quan sát DNA nhân đôi tạo các NST kép đính ở tâm động.', 'Bước 3: Tua chậm 0.25x tại kỳ giữa khi các NST xếp thẳng hàng ở mặt phẳng xích đạo.', 'Bước 4: Bước từng khung hình dt ở kỳ sau khi thoi vô sắc kéo các crômatit về hai cực.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 38: Nguyên phân và Giảm phân', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Điều khiển thời gian & Phóng đại vi mô', false, undefined,
    ['Kỳ phân bào (Đầu, Giữa, Sau, Cuối)', 'Số crômatit', 'Bộ NST 2n'],
    'Cơ chế nhân đôi bán bảo tồn và phân ly đồng đều duy trì tính ổn định của vật chất di truyền.'
  ),
  createItem(
    6, 'sim-thcs-06', 'Đo tốc độ bằng cổng quang điện & Đồng hồ hiện số',
    'Phương pháp đo tốc độ hiện đại trong phòng lab: Đo vận tốc tức thời v = s / Δt bằng cảm biến hồng ngoại ngắt chùm tia.',
    ['Bước 1: Đặt xe trượt có tấm chắn sáng rộng s = 2cm trên máng dẫn nghiêng.', 'Bước 2: Cài đặt hai cổng quang điện A và B cách nhau L = 50cm.', 'Bước 3: Thả xe trượt tự do qua cổng A và cổng B.', 'Bước 4: Đồng hồ hiện số ghi lại ΔtA, ΔtB; học sinh tính vA, vB và gia tốc a.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 9: Đo tốc độ chuyển động', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Cảm biến hồng ngoại & Ghi nhận thời gian', false, undefined,
    ['Bề rộng tấm chắn s (m)', 'Thời gian chắn sáng Δt (ms)', 'Tốc độ v (m/s)'],
    'Vận tốc tức thời là đạo hàm của độ dời theo thời gian khi khoảng thời gian tiến về 0.'
  ),
  createItem(
    7, 'sim-thcs-07', 'Định luật đòn bẩy Archimedes (F1.d1 = F2.d2)',
    'Khảo sát điều kiện cân bằng của đòn bẩy quanh trục quay cố định: Tổng các mômen lực làm quay theo chiều kim đồng hồ bằng ngược chiều kim đồng hồ.',
    ['Bước 1: Treo quả nặng P1 = 2N ở khoảng cách d1 = 20cm tính từ trục quay O.', 'Bước 2: Treo quả nặng P2 = 4N ở khoảng cách d2 = 10cm ở phía bên kia.', 'Bước 3: Quan sát đòn bẩy nằm ngang thăng bằng tuyệt đối: 2N x 20cm = 4N x 10cm.', 'Bước 4: Dịch chuyển P2 ra xa: Đòn bẩy quay nghiêng theo chiều mômen lớn hơn.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 19: Đòn bẩy và Tác dụng làm quay của lực', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khối lượng quả cân & Khoảng cách cánh tay đòn', false, undefined,
    ['Lực F1, F2 (N)', 'Cánh tay đòn d1, d2 (m)', 'Mômen lực M = F.d'],
    'Điều kiện cân bằng mômen lực: Σ M = 0 quanh trục quay.'
  ),
  createItem(
    8, 'sim-thcs-08', 'Sự truyền nhiệt & Dòng đối lưu trong chất lỏng',
    'Trực quan hóa dòng đối lưu: Nước nóng ở đáy nở ra nhẹ bốc lên, nước lạnh ở trên nặng chìm xuống tạo vòng tuần hoàn.',
    ['Bước 1: Đặt vài hạt thuốc tím KMnO4 xuống đáy ống nghiệm chứa nước.', 'Bước 2: Dùng ngọn đèn cồn hơ nóng đúng phần đáy có thuốc tím.', 'Bước 3: Quan sát các dòng màu tím mang nước nóng cuộn thẳng đứng lên mặt nước.', 'Bước 4: Tại mặt nước, dòng nước tím tản ra hai bên và chìm xuống đáy theo chu kỳ.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 28: Sự truyền nhiệt và Đối lưu', 'SGK Kết nối tri thức',
    'thcs', 'pattern-particle-sandbox', 'Dòng đối lưu nhiệt của phân tử chất lỏng', false, undefined,
    ['Nhiệt độ đáy ống (°C)', 'Vận tốc dòng đối lưu'],
    'Đối lưu là hình thức truyền nhiệt chủ yếu trong chất lưu nhờ chênh lệch khối lượng riêng do nhiệt.'
  ),
  createItem(
    9, 'sim-thcs-09', 'Tán sắc ánh sáng qua lăng kính tam giác Newton',
    'Phân tích chùm ánh sáng trắng qua lăng kính quang học và hợp dải 7 màu trở lại thành ánh sáng trắng bằng lăng kính đảo ngược.',
    ['Bước 1: Chiếu chùm sáng trắng hẹp qua lăng kính tam giác bằng thủy tinh crown.', 'Bước 2: Đo góc lệch của tia Đỏ (nhỏ nhất) và tia Tím (lớn nhất) trên màn ảnh.', 'Bước 3: Đặt một lăng kính thứ hai cùng loại ngược chiều chắn ngang dải 7 màu.', 'Bước 4: Quan sát chùm sáng sau khi qua lăng kính thứ hai tổng hợp lại thành ánh sáng trắng.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 6: Tán sắc ánh sáng và Màu sắc', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc tới i1 & Chiết suất n(λ)', false, undefined,
    ['Bước sóng λ', 'Chiết suất lăng kính n', 'Góc lệch D'],
    'Ánh sáng trắng là tập hợp của vô số ánh sáng đơn sắc có bước sóng liên tục từ đỏ đến tím.'
  ),
  createItem(
    10, 'sim-thcs-10', 'Phản ứng trung hòa Axit - Bazơ (HCl + NaOH)',
    'Quan sát sự đổi màu của chỉ thị phenolphtalein khi chuẩn độ: Dung dịch bazơ mất màu hồng khi đạt điểm trung hòa pH = 7.',
    ['Bước 1: Rót 20ml dung dịch NaOH 0.1M vào bình nón và nhỏ 2 giọt phenolphtalein (dung dịch có màu hồng cánh sen).', 'Bước 2: Mở khóa buret nhỏ từng giọt dung dịch axit HCl 0.1M vào bình nón.', 'Bước 3: Lắc đều bình và theo dõi giá trị pH giảm dần từ 13 về 7.', 'Bước 4: Đúng giọt HCl làm pH = 7: Màu hồng cánh sen biến mất hoàn toàn thành không màu.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 11: Axit, Bazơ và Phản ứng trung hòa', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Thể tích axit nhỏ giọt & Đường cong pH', false, undefined,
    ['Thể tích HCl (ml)', 'Giá trị pH dung dịch', 'Màu chất chỉ thị'],
    'Bản chất phản ứng trung hòa: H⁺ + OH⁻ -> H2O giải phóng năng lượng liên kết.'
  ),
  createItem(
    11, 'sim-thcs-11', 'Quang hợp ở rong đuôi chó giải phóng khí O2',
    'Chứng minh quang hợp tạo ra khí oxy: Càng đưa đèn lại gần thì số bọt khí oxy thoát ra từ cành rong càng nhiều.',
    ['Bước 1: Đặt cành rong đuôi chó vào ống nghiệm ngập nước úp ngược trong phễu thủy tinh.', 'Bước 2: Chiếu đèn sợi đốt cách cành rong 50cm: Đếm được 10 bọt khí/phút.', 'Bước 3: Dịch chuyển đèn lại gần cách 10cm: Số bọt khí tăng vọt lên 45 bọt khí/phút.', 'Bước 4: Đưa que đóm còn tàn đỏ vào miệng ống nghiệm: Que đóm bùng cháy sáng (chứng minh có khí O2).'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 21: Quang hợp ở thực vật', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khoảng cách nguồn sáng & Tốc độ sủi bọt khí', false, undefined,
    ['Cường độ ánh sáng (Lux)', 'Tốc độ thoát bọt khí O2'],
    'Phương trình quang hợp: 6CO2 + 6H2O + Quang năng -> C6H12O6 + 6O2.'
  ),
  createItem(
    12, 'sim-thcs-12', 'Từ phổ & Đường sức từ của nam châm chữ U',
    'Rắc mạt sắt xung quanh nam châm chữ U và gõ nhẹ để thấy các đường cong từ phổ nối liền cực Bắc (N) sang cực Nam (S).',
    ['Bước 1: Đặt tấm kính trong suốt lên trên thanh nam châm hình chữ U.', 'Bước 2: Rắc đều một lớp mạt sắt mỏng lên bề mặt kính.', 'Bước 3: Gõ nhẹ vào mép kính: Các hạt mạt sắt tự xoay và sắp xếp thành các đường cong cong đều đặn.', 'Bước 4: Trong lòng chữ U: Các đường sức từ gần như song song đều nhau (từ trường đều).'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 18: Từ trường và Đường sức từ', 'SGK Kết nối tri thức',
    'thcs', 'pattern-particle-sandbox', 'Hạt mạt sắt tự sắp xếp theo từ trường', false, undefined,
    ['Cường độ từ trường B', 'Chiều đường sức từ (Ra Bắc vào Nam)'],
    'Mỗi hạt mạt sắt bị từ hóa trở thành một nam châm nhỏ tự sắp xếp dọc theo véc-tơ cảm ứng từ B.'
  ),
  createItem(
    13, 'sim-thcs-13', 'Giao thoa & Cộng hưởng sóng âm trong ống khí',
    'Tìm các điểm bụng sóng và nút sóng âm bằng cách điều chỉnh mực nước trong ống cộng hưởng khi đặt âm thoa ở miệng ống.',
    ['Bước 1: Đặt một âm thoa có tần số f = 512 Hz đang dao động ngay phía trên miệng ống thủy tinh.', 'Bước 2: Từ từ hạ thấp mực nước trong ống để thay đổi chiều dài cột không khí.', 'Bước 3: Tại chiều dài L = 16.5cm: Âm thanh phát ra đột ngột vang to cực đại (hiện tượng cộng hưởng).', 'Bước 4: Tiếp tục hạ nước đến L = 49.5cm: Xuất hiện đỉnh cộng hưởng thứ hai.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 14: Sóng âm và Sự cộng hưởng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Mực nước trong ống & Cường độ âm thanh (dB)', false, undefined,
    ['Chiều dài cột khí L (cm)', 'Bước sóng âm λ', 'Tần số cộng hưởng'],
    'Cộng hưởng sóng dừng trong ống một đầu bịt kín: L = (2k + 1) * λ / 4.'
  ),
  createItem(
    14, 'sim-thcs-14', 'Chưng cất phân đoạn hỗn hợp rượu và nước',
    'Tách hai chất lỏng tan vào nhau dựa trên nhiệt độ sôi khác biệt: Rượu sôi ở 78.3°C bay hơi trước, nước sôi ở 100°C ở lại.',
    ['Bước 1: Rót hỗn hợp nước và cồn 40° vào bình cầu có gắn nhiệt kế và ống sinh hàn.', 'Bước 2: Bật ngọn lửa đèn cồn đun sôi hỗn hợp từ từ.', 'Bước 3: Theo dõi nhiệt kế dừng lại ở 78.3°C: Hơi rượu bốc lên gặp ống sinh hàn ngưng tụ thành giọt cồn nguyên chất.', 'Bước 4: Khi rượu bay hơi hết, nhiệt kế mới tiếp tục tăng vọt lên 100°C.'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 16: Tách chất bằng phương pháp chưng cất', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Nhiệt độ chưng cất & Lượng cồn ngưng tụ', false, undefined,
    ['Nhiệt độ sôi rượu (78.3°C)', 'Nhiệt độ sôi nước (100°C)', 'Độ cồn thu được'],
    'Tách chất dựa trên độ bay hơi và áp suất hơi bão hòa khác nhau của các cấu tử ở cùng áp suất.'
  ),
  createItem(
    15, 'sim-thcs-15', 'Mô hình xoắn kép ADN & Phiên mã mARN',
    'Tương tác lắp ghép 4 loại nucleotide theo nguyên tắc bổ sung A - T, G - X và cơ chế tổng hợp chuỗi mARN bổ sung.',
    ['Bước 1: Kéo các nucleotide tự do A, T, G, X vào mạch khuôn ADN.', 'Bước 2: Kiểm tra nguyên tắc bổ sung: Adenin chỉ liên kết với Timin (2 liên kết H), Guanin với Xitôzin (3 liên kết H).', 'Bước 3: Kích hoạt enzyme ARN polimeraza trượt dọc gen để phiên mã.', 'Bước 4: Mạch mARN tách ra mang bộ ba mã sao đi ra tế bào chất.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 39: Cấu trúc ADN và Quá trình phiên mã', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Lắp ghép nucleotide A-T-G-X', false, undefined,
    ['Trình tự nucleotide', 'Số liên kết hydro', 'Mã di truyền codon'],
    'Nguyên tắc bổ sung hình thành liên kết hydro đặc thù đảm bảo truyền đạt chính xác thông tin di truyền.'
  ),
  createItem(
    16, 'sim-thcs-16', 'Điện trở phụ thuộc chiều dài, tiết diện và vật liệu',
    'Kiểm chứng công thức R = ρ.l / S: Tăng chiều dài dây gấp đôi làm R tăng gấp đôi; tăng tiết diện gấp đôi làm R giảm một nửa.',
    ['Bước 1: Mắc đoạn dây Nikelin dài l = 1m, tiết diện S = 0.1 mm² vào mạch điện.', 'Bước 2: Đo điện trở R1 = 4.4 Ω.', 'Bước 3: Thay bằng đoạn dây dài l = 2m cùng loại: Điện trở tăng lên đúng 8.8 Ω.', 'Bước 4: Thay bằng đoạn dây có tiết diện S = 0.2 mm²: Điện trở giảm còn 4.4 Ω.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 24: Điện trở của dây dẫn', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Chiều dài l & Tiết diện S của dây dẫn', false, undefined,
    ['Chiều dài l (m)', 'Tiết diện S (mm²)', 'Điện trở suất ρ', 'Điện trở R (Ω)'],
    'Điện trở xuất phát từ xác suất va chạm của electron với các ion mạng tinh thể dọc theo chiều dài.'
  ),
  createItem(
    17, 'sim-thcs-17', 'Sự nhiễm điện do cọ xát & Điện nghiệm lá kim loại',
    'Khảo sát tĩnh điện học: Đưa thanh thủy tinh cọ xát vào lụa lại gần quả cầu điện nghiệm làm hai lá kim loại xòe rộng.',
    ['Bước 1: Cọ xát thanh thủy tinh vào mảnh lụa để thanh nhiễm điện dương.', 'Bước 2: Chạm thanh thủy tinh vào núm kim loại của điện nghiệm.', 'Bước 3: Điện tích truyền xuống hai lá nhôm mỏng phía dưới: Hai lá mang điện cùng dấu đẩy nhau xòe ra.', 'Bước 4: Dùng ngón tay chạm vào núm kim loại: Điện tích truyền xuống đất, hai lá nhôm lập tức khép lại.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 20: Hiện tượng nhiễm điện', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Cọ xát thanh thủy tinh & Góc xòe lá nhôm', false, undefined,
    ['Lượng điện tích truyền', 'Góc xòe của hai lá kim loại'],
    'Định luật Coulomb: Hai điện tích cùng dấu đẩy nhau bằng lực tỷ lệ thuận với tích độ lớn điện tích.'
  ),
  createItem(
    18, 'sim-thcs-18', 'Khảo sát hệ số ma sát trượt và ma sát lăn',
    'Kéo khối gỗ trượt trên bàn có gắn lực kế: So sánh lực ma sát trượt với lực ma sát lăn khi đặt thêm các con lăn bên dưới.',
    ['Bước 1: Đặt khối gỗ nặng 500g lên mặt bàn và móc lực kế vào đầu khối gỗ.', 'Bước 2: Kéo lực kế chuyển động đều: Lực kế chỉ lực ma sát trượt F_trượt = 1.5N.', 'Bước 3: Đặt 3 chiếc bút chì tròn xuống dưới làm con lăn.', 'Bước 4: Kéo chuyển động đều: Lực kế giảm vọt chỉ còn F_lăn = 0.15N (nhỏ hơn 10 lần).'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 40: Lực ma sát và Tác dụng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Lực kéo & Hệ số ma sát trượt/lăn', false, undefined,
    ['Áp lực N (N)', 'Hệ số ma sát μ', 'Lực ma sát F_ms (N)'],
    'Ma sát lăn nhỏ hơn ma sát trượt nhiều lần nhờ triệt tiêu sự trượt bề mặt vi mô.'
  ),
  createItem(
    19, 'sim-thcs-19', 'Khúc xạ qua bản mặt song song & Độ dời ngang',
    'Chiếu tia laser xiên góc qua bản thủy tinh hai mặt song song: Tia ló truyền song song với tia tới nhưng bị dời một đoạn e.',
    ['Bước 1: Chiếu tia laser đỏ với góc tới i = 45° vào mặt trước bản thủy tinh dày d = 5cm.', 'Bước 2: Quan sát tia khúc xạ bị bẻ cong lại gần pháp tuyến trong thủy tinh.', 'Bước 3: Tại mặt sau, tia sáng khúc xạ ra không khí bị bẻ gập góc bằng đúng góc tới i = 45°.', 'Bước 4: Đo độ dời ngang e giữa tia ló và đường kéo dài của tia tới.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 5: Khúc xạ ánh sáng qua bản thủy tinh', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc tới i & Bề dày bản song song d', false, undefined,
    ['Bề dày d (cm)', 'Chiết suất n', 'Độ dời ngang e (cm)'],
    'Do hai mặt phân cách song song, góc khúc xạ ở mặt trước bằng góc tới ở mặt sau nên tia ló song song tia tới.'
  ),
  createItem(
    20, 'sim-thcs-20', 'Phương trình cân bằng nhiệt (Q tỏa = Q thu)',
    'Thả miếng đồng nóng 100°C vào cốc nước lạnh 20°C: Đo nhiệt độ cân bằng t_cb và kiểm chứng bảo toàn năng lượng nhiệt.',
    ['Bước 1: Cân miếng đồng m1 = 200g, đun nóng trong nước sôi đến 100°C.', 'Bước 2: Cân cốc nước m2 = 300g ở nhiệt độ ban đầu t2 = 20°C.', 'Bước 3: Thả nhanh miếng đồng vào cốc nước và khuấy đều bằng nhiệt kế.', 'Bước 4: Nhiệt kế dừng lại ở nhiệt độ cân bằng t_cb = 24.8°C; tính Q_tỏa = Q_thu.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 29: Nhiệt lượng và Cân bằng nhiệt', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khối lượng chất & Nhiệt độ ban đầu', false, undefined,
    ['Nhiệt dung riêng c1, c2', 'Nhiệt độ cân bằng t_cb (°C)', 'Nhiệt lượng Q (J)'],
    'Định luật bảo toàn năng lượng: Tổng nhiệt lượng các vật nóng tỏa ra bằng tổng nhiệt lượng các vật lạnh thu vào.'
  ),

// =========================================================================
  // CẤP 4: THPT (10 THÍ NGHIỆM: STT 1 -> 10)
  // =========================================================================
  createItem(
    1, 'sim-thpt-01', 'Con lắc đơn phi tuyến & Vi tích phân thời gian thực',
    'Giải phương trình vi phân d²θ/dt² + (g/L)sin(θ) = 0 bằng thuật toán tích phân số Euler-Cromer, vẽ quỹ đạo pha và bảo toàn cơ năng.',
    ['Bước 1: Kéo quả nặng con lắc lệch khỏi vị trí cân bằng một góc ban đầu θ0 bất kỳ (5° đến 90°).', 'Bước 2: Thả dao động và quan sát đồ thị li độ góc θ(t) và vận tốc góc ω(t) vẽ thời gian thực.', 'Bước 3: Mở biểu đồ cột năng lượng: Động năng và thế năng bù trừ nhau để tổng cơ năng luôn không đổi.', 'Bước 4: Bấm "Code Inspector" để bóc tách mã nguồn thuật toán vi tích phân chạy trong trình duyệt.'],
    'Vật lí 11', 'Lớp 11', 'Bài 1: Dao động điều hòa & Phương trình vi phân', 'SGK Kết nối tri thức',
    'thpt', 'pattern-code-inspector', 'Inspect Mã Nguồn & Vi tích phân (White-Box)', true, 'sim-pendulum-calculus',
    ['Chiều dài dây l (m)', 'Góc ban đầu θ0 (rad)', 'Cơ năng E = const'],
    'Phương trình vi phân cấp hai xuất phát từ định luật II Newton F = m.d²x/dt².'
  ),
  createItem(
    2, 'sim-thpt-02', 'Giao thoa sóng cơ mặt nước & Sóng dừng trên dây',
    'Trực quan hóa hiện tượng giao thoa sóng khi hai nguồn kết hợp gặp nhau: Cực đại giao thoa có biên độ gấp đôi, cực tiểu triệt tiêu hoàn toàn.',
    ['Bước 1: Khởi động hai mũi kim dao động đồng pha nhấp nhô trên mặt chậu nước ảo.', 'Bước 2: Thay đổi tần số dao động f (10Hz - 50Hz) và khoảng cách d giữa hai nguồn sóng.', 'Bước 3: Quan sát vân giao thoa Hyperbol hiển thị trên mặt nước: các dải sáng cực đại và dải tối cực tiểu.', 'Bước 4: Chuyển sang chế độ sóng dừng: Điều chỉnh tần số để tạo các nút và bụng sóng ổn định trên dây.'],
    'Vật lí 11', 'Lớp 11', 'Bài 8: Giao thoa sóng & Sóng dừng trên dây', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Tần số f (Hz) & Bước sóng λ thời gian thực', false, undefined,
    ['Bước sóng λ (cm)', 'Hiệu đường đi d1 - d2', 'Biên độ tổng hợp A'],
    'Nguyên lý chồng chất sóng (Superposition Principle): Dao động tổng hợp là tổng đại số các hàm sóng thành phần.'
  ),
  createItem(
    3, 'sim-thpt-03', 'Định luật khí lý tưởng Boyle - Mariotte (P.V = const)',
    'Chứng minh định luật đẳng nhiệt ở cấp độ vi mô: Nén thể tích xilanh còn 1/2 làm tần suất phân tử va chạm thành bình tăng gấp đôi, áp suất tăng gấp đôi.',
    ['Bước 1: Nạp 200 phân tử khí lý tưởng vào xilanh kín có áp kế và nhiệt kế.', 'Bước 2: Giữ nhiệt độ T không đổi ở 300K.', 'Bước 3: Kéo pít-tông nén thể tích V từ 10 lít xuống còn 5 lít.', 'Bước 4: Đếm số vụ va chạm phân tử vào thành xilanh và quan sát áp suất P tăng từ 1 atm lên 2 atm.'],
    'Vật lí 12', 'Lớp 12', 'Bài 3: Định luật Boyle và Thuyết động học phân tử', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Hệ hạt vi mô & Xilanh động học', false, undefined,
    ['Thể tích V (L)', 'Áp suất P (atm)', 'Nhiệt độ T (K)', 'Số phân tử N'],
    'Áp suất chất khí là mật độ xung lượng truyền từ các phân tử va đập vào diện tích thành bình trong 1 giây.'
  ),
  createItem(
    4, 'sim-thpt-04', 'Hiện tượng cảm ứng điện từ Faraday & Định luật Lenz',
    'Khám phá định luật Faraday: Dòng điện cảm ứng xuất hiện khi từ thông biến thiên; chiều dòng điện chống lại sự biến thiên (e = -dΦ/dt).',
    ['Bước 1: Đưa thanh nam châm cực Bắc (N) lại gần cuộn dây đồng có mắc điện kế nhạy G.', 'Bước 2: Quan sát kim điện kế lệch sang phải khi từ thông tăng lên.', 'Bước 3: Giữ thanh nam châm đứng yên tuyệt đối trong lòng cuộn dây: Kim trở về số 0.', 'Bước 4: Rút thanh nam châm ra xa: Kim điện kế đổi chiều lệch sang trái (định luật Lenz).'],
    'Vật lí 11/12', 'Lớp 11/12', 'Bài 16: Từ trường và Cảm ứng điện từ', 'SGK Kết nối tri thức',
    'thpt', 'pattern-drag-drop', 'Kéo nam châm & Đo biến thiên từ thông dΦ/dt', false, undefined,
    ['Từ thông Φ = B.S.cos(α)', 'Tốc độ dịch chuyển v', 'Suất điện động cảm ứng ec (V)'],
    'Bảo toàn năng lượng trong điện từ: Dòng điện cảm ứng sinh từ trường chống lại chuyển động của nam châm.'
  ),
  createItem(
    5, 'sim-thpt-05', 'Va chạm đàn hồi & Bảo toàn động lượng trên đệm khí',
    'Kiểm chứng định luật bảo toàn động lượng m1.v1 + m2.v2 = const và khảo sát chuyển hóa động năng trong va chạm 1 chiều.',
    ['Bước 1: Bật bơm khí đệm không khí triệt tiêu hoàn toàn lực ma sát trên ray dẫn.', 'Bước 2: Cài đặt khối lượng hai xe m1 = 1kg, m2 = 2kg, chọn va chạm đàn hồi.', 'Bước 3: Cho xe 1 chuyển động v1 = 2m/s va chạm với xe 2 đứng yên.', 'Bước 4: Dùng nút "Tua chậm 0.1x" và "Step dt" đo vận tốc sau va chạm, đối chiếu hệ phương trình bảo toàn.'],
    'Vật lí 10', 'Lớp 10', 'Bài 28: Động lượng và Định luật bảo toàn', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Tua chậm vi phân & Khảo sát động lượng', false, undefined,
    ['Khối lượng m1, m2 (kg)', 'Vận tốc trước v1, v2', 'Vận tốc sau v1\', v2\''],
    'Bảo toàn động lượng xuất phát trực tiếp từ tính đồng nhất của không gian (Định lý Noether).'
  ),
  createItem(
    6, 'sim-thpt-06', 'Quang phổ vạch nguyên tử Hydro & Mẫu nguyên tử Bohr',
    'Mô phỏng bước nhảy lượng tử của electron giữa các mức năng lượng gián đoạn En = -13.6 / n² (eV) và sự phát xạ photon ánh sáng đơn sắc.',
    ['Bước 1: Kéo electron ở trạng thái cơ bản n = 1 hấp thụ một photon ánh sáng thích hợp.', 'Bước 2: Quan sát electron nhảy vọt lên quỹ đạo dừng kích thích n = 3.', 'Bước 3: Sau ~10⁻⁸s, electron nhảy về mức n = 2 và phát xạ photon màu Đỏ bước sóng 656.3 nm (vạch H-alpha).', 'Bước 4: Bật màn quang phổ để ghi nhận các vạch phát xạ màu đặc trưng trong dãy Ban-me.'],
    'Vật lí 12', 'Lớp 12', 'Bài 21: Mẫu nguyên tử Bohr & Quang phổ vạch', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Sandbox lượng tử & Bước nhảy photon', false, undefined,
    ['Số lượng tử n (1, 2, 3...)', 'Năng lượng En (eV)', 'Bước sóng photon λ (nm)'],
    'Cơ học lượng tử: Năng lượng ở thế giới vi mô bị lượng tử hóa thành từng gói rời rạc h.f thay vì liên tục.'
  ),
  createItem(
    7, 'sim-thpt-07', 'Tốc độ phản ứng hóa học & Năng lượng hoạt hóa Arrhenius',
    'Khảo sát ảnh hưởng của nhiệt độ, nồng độ và chất xúc tác đến phân bố năng lượng Maxwell-Boltzmann và số va chạm hiệu quả giữa các phân tử.',
    ['Bước 1: Thiết lập buồng phản ứng gồm các phân tử chất A và B với nồng độ ban đầu.', 'Bước 2: Tăng nhiệt độ hỗn hợp: Đồ thị Maxwell-Boltzmann dịch sang phải, số hạt vượt ngưỡng hoạt hóa tăng vọt.', 'Bước 3: Thêm hạt chất xúc tác: Quan sát hàng rào năng lượng hoạt hóa Ea bị hạ thấp xuống.', 'Bước 4: Theo dõi đường cong đồ thị nồng độ sản phẩm theo thời gian để tính hằng số tốc độ k.'],
    'Hóa học 10', 'Lớp 10', 'Bài 16: Tốc độ phản ứng hóa học', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Buồng va chạm phân tử & Hàng rào năng lượng Ea', false, undefined,
    ['Nhiệt độ T (K)', 'Năng lượng hoạt hóa Ea', 'Hằng số tốc độ k = A.exp(-Ea/RT)'],
    'Chỉ những phân tử có động năng lớn hơn hàng rào thế năng hoạt hóa Ea mới phản ứng tạo sản phẩm.'
  ),
  createItem(
    8, 'sim-thpt-08', 'Chuyển động ném xiên & Tầm bay xa đạn đạo',
    'Khảo sát quỹ đạo Parabol của vật ném xiên: Phân tích chuyển động thành hai thành phần độc lập Ox (đẳng tốc) và Oy (rơi tự do).',
    ['Bước 1: Đặt súng đại bác ở mặt đất với vận tốc đầu nòng v0 = 25 m/s.', 'Bước 2: Kéo thanh trượt thay đổi góc bắn α từ 10° đến 80°.', 'Bước 3: Nhấn nút bắn đạn: Quan sát quỹ đạo Parabol vẽ đường cong mượt mà trên không gian.', 'Bước 4: Kiểm chứng tầm xa đạt cực đại L_max khi góc bắn đúng bằng α = 45°.'],
    'Vật lí 10', 'Lớp 10', 'Bài 12: Chuyển động ném', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Góc bắn α & Vận tốc ban đầu v0', false, undefined,
    ['Góc bắn α (°)', 'Tầm cao H (m)', 'Tầm xa L = v0².sin(2α)/g (m)'],
    'Tính độc lập của các chuyển động thành phần theo phương Ox và Oy theo định luật quán tính Galileo.'
  ),
  createItem(
    9, 'sim-thpt-09', 'Đo gia tốc rơi tự do g bằng cổng quang điện',
    'Thí nghiệm thực hành đo chính xác hằng số gia tốc trọng trường g = 2h / t² với sai số dưới 1% bằng nam châm điện thả rơi bi thép.',
    ['Bước 1: Gắn viên bi thép vào nam châm điện ở độ cao h1 = 0.5m so với cổng quang điện.', 'Bước 2: Bấm nút ngắt điện nam châm: Bi rơi tự do và đồng hồ hiện số ghi thời gian rơi t chính xác đến 0.0001s.', 'Bước 3: Thay đổi độ cao rơi h2 = 0.8m, h3 = 1.0m và lặp lại phép đo 5 lần.', 'Bước 4: Vẽ đồ thị h theo t²: Độ dốc đường thẳng là g/2 -> Suy ra giá trị thực nghiệm g = 9.80 m/s².'],
    'Vật lí 10', 'Lớp 10', 'Bài 11: Thực hành Đo gia tốc rơi tự do', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Thời gian rơi chính xác microsecond', false, undefined,
    ['Độ cao rơi h (m)', 'Thời gian rơi t (s)', 'Gia tốc g = 2h/t²'],
    'Trong chân không không có ma sát, mọi vật bất kể khối lượng đều rơi với cùng một gia tốc trọng trường g.'
  ),
  createItem(
    10, 'sim-thpt-10', 'Con lắc lò xo & Thế năng đàn hồi (1/2 k x²)',
    'Khảo sát dao động điều hòa của con lắc lò xo nằm ngang: Sự chuyển hóa liên tục giữa động năng (1/2 mv²) và thế năng đàn hồi.',
    ['Bước 1: Kéo quả nặng lệch khỏi vị trí cân bằng một đoạn x0 = 10cm làm giãn lò xo.', 'Bước 2: Thả dao động và quan sát đồ thị hàm sin của li độ x(t) và lực phục hồi F = -k.x.', 'Bước 3: Thay đổi độ cứng lò xo k (từ 20 N/m lên 100 N/m): Quan sát tần số dao động ω = √(k/m) tăng nhanh.', 'Bước 4: Đồ thị năng lượng dạng thanh: Cơ năng E = 1/2 k A² luôn là đường thẳng bảo toàn tuyệt đối.'],
    'Vật lí 11', 'Lớp 11', 'Bài 2: Phương trình dao động điều hòa', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Độ cứng k & Biên độ ban đầu A', false, undefined,
    ['Độ cứng k (N/m)', 'Khối lượng m (kg)', 'Tần số góc ω = √(k/m)', 'Cơ năng E'],
    'Lực đàn hồi tuân theo định luật Hooke F = -k.x tạo nên dao động điều hòa điều kiện lý tưởng.'
  )
];

import { InteractionPattern, SimulationCatalogItem } from '../types/curriculum';

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
    tagline: 'Triết lý Andrej Karpathy: "If you cannot write the code to simulate it, you don’t understand it"',
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
  firstPrinciplesNote?: string
): SimulationCatalogItem => ({
  stt,
  id,
  title,
  purpose,
  procedure,
  extractedFrom: { subject, grade, lesson, textbook },
  levelId,
  interactionPatternId,
  interactionPatternName,
  hasLiveSim,
  liveSimId,
  keyVariables,
  firstPrinciplesNote
});

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
  // CẤP 2: TIỂU HỌC (40 THÍ NGHIỆM: STT 31 -> 70)
  // =========================================================================
  createItem(
    31, 'sim-th-01', 'Cân đĩa thăng bằng & Bản chất Phân số đại số',
    'Xóa tan cảm giác trừu tượng khi học phân số: Dấu bằng (=) chính là chiếc cân thăng bằng bảo toàn giá trị lượng số.',
    ['Bước 1: Chọn đĩa bên trái có 1 chiếc bánh trọn vẹn (giá trị 1).', 'Bước 2: Kéo các lát bánh 1/2, 1/4, 1/8 đặt lên đĩa bên phải.', 'Bước 3: Quan sát kim cân lệch khi tổng hai bên chưa bằng nhau.', 'Bước 4: Thêm lát 1/4 và 1/8 để cân thăng bằng tuyệt đối: 1 = 1/2 + 1/4 + 1/4.'],
    'Toán học 4', 'Lớp 4', 'Bài 53: Khái niệm phân số & Phân số bằng nhau', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Kéo - Thả linh kiện & Cân bằng (Drag & Drop)', true, 'sim-balance-fraction',
    ['Khối lượng đĩa trái (LHS)', 'Khối lượng đĩa phải (RHS)', 'Góc lệch kim cân'],
    'Phương trình toán học là một cái cân bảo toàn giá trị đại số hai vế.'
  ),
  createItem(
    32, 'sim-th-02', 'Vòng tuần hoàn của nước trong tự nhiên',
    'Mô phỏng 3 trạng thái của nước và các quá trình bay hơi, ngưng tụ, tạo mây và mưa theo chu trình nhiệt Mặt Trời.',
    ['Bước 1: Tăng cường độ chiếu sáng của Mặt Trời chiếu xuống biển xanh.', 'Bước 2: Quan sát phân tử nước nhận nhiệt bốc hơi bay lên khí quyển.', 'Bước 3: Hạ nhiệt độ trên cao làm hơi nước ngưng tụ thành mây đen trĩu nặng.', 'Bước 4: Nhấn nút tạo mưa để nước rơi xuống núi rồi chảy về đại dương.'],
    'Khoa học 4', 'Lớp 4', 'Bài 2: Sự chuyển thể của nước và vòng tuần hoàn', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-particle-sandbox', 'Hệ hạt vi mô & Điều khiển nhiệt độ', false, undefined,
    ['Nhiệt độ (°C)', 'Tốc độ bay hơi', 'Lượng mưa ngưng tụ'],
    'Bảo toàn vật chất: Nước luân chuyển liên tục qua trao đổi nhiệt năng.'
  ),
  createItem(
    33, 'sim-th-03', 'Mạch điện kín thắp sáng bóng đèn pin',
    'Nhận biết điều kiện để có dòng điện: Phải tạo thành một đường dẫn khép kín từ cực dương qua bóng đèn về cực âm của pin.',
    ['Bước 1: Kéo viên pin 1.5V, bóng đèn và công tắc K ra bàn thí nghiệm.', 'Bước 2: Kéo dây điện nối cực dương của pin vào đuôi bóng đèn.', 'Bước 3: Nối cực còn lại của đèn qua công tắc K rồi về cực âm viên pin.', 'Bước 4: Đóng công tắc K: Quan sát mạch kín được thiết lập và bóng đèn phát sáng.'],
    'Khoa học 5', 'Lớp 5', 'Bài 14: Năng lượng điện và Mạch điện đơn giản', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Kéo - Thả & Lắp ráp linh kiện', false, undefined,
    ['Trạng thái công tắc K', 'Điện áp pin (V)', 'Độ sáng bóng đèn'],
    'Dòng điện chỉ có thể chạy liên tục khi có một vòng tuần hoàn kín.'
  ),
  createItem(
    34, 'sim-th-04', 'Đòn bẩy & Mặt phẳng nghiêng sơ cấp',
    'Chứng minh quy tắc vàng về cơ học: Được lợi về lực thì thiệt hại về đường đi (F.d = const khi bỏ qua ma sát).',
    ['Bước 1: Đặt khối đá nặng 50kg lên mặt phẳng nghiêng có góc dốc thay đổi.', 'Bước 2: Giảm góc nghiêng của tấm ván để thấy lực kéo F giảm rõ rệt.', 'Bước 3: Chuyển sang mô hình đòn bẩy: Dịch điểm tựa O lại gần tảng đá.', 'Bước 4: Ấn vào đầu xa của đòn bẩy để nâng tảng đá lên nhẹ nhàng.'],
    'Khoa học 5', 'Lớp 5', 'Bài 18: Máy cơ đơn giản quanh em', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc nghiêng & Cánh tay đòn', false, undefined,
    ['Góc nghiêng (°)', 'Chiều dài cánh tay đòn (m)', 'Lực kéo F (N)'],
    'Công cơ học A = F.s bảo toàn khi nâng vật lên cùng một độ cao.'
  ),
  createItem(
    35, 'sim-th-05', 'Khúc xạ ánh sáng - Chiếc đũa gãy trong cốc nước',
    'Giải thích hiện tượng chiếc đũa cắm xiên trong cốc nước trông như bị bẻ gãy ở mặt phân cách giữa không khí và nước.',
    ['Bước 1: Cắm chiếc đũa thẳng nghiêng một góc vào chiếc cốc rỗng.', 'Bước 2: Rót nước từ từ vào cốc nước trong suốt.', 'Bước 3: Quan sát tia sáng phản xạ từ đầu đũa bị gập góc khi đi ra không khí.', 'Bước 4: Bật tính năng tia ảo để thấy ảnh của chiếc đũa bị nâng lên cao.'],
    'Khoa học 4', 'Lớp 4', 'Bài 11: Ánh sáng và sự truyền ánh sáng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Kéo trượt góc tới của tia sáng', false, undefined,
    ['Góc tới i', 'Góc khúc xạ r', 'Độ lệch hình ảnh chiếc đũa'],
    'Vận tốc ánh sáng trong nước chậm hơn trong không khí dẫn đến hiện tượng gập góc khúc xạ.'
  ),
  createItem(
    36, 'sim-th-06', 'Thước đo phân số & Trục số trực quan',
    'Giúp học sinh hình dung phân số như một vị trí chính xác trên trục số thực liên tục; hiểu rút gọn và quy đồng mẫu số.',
    ['Bước 1: Chọn trục số từ 0 đến 1 chia làm 12 vạch đều nhau.', 'Bước 2: Di chuyển con trỏ đến vị trí 6/12: Hệ thống hiển thị phân số rút gọn 1/2.', 'Bước 3: Thêm điểm thứ hai tại 2/3 (tức 8/12) và quan sát quy đồng tự động.', 'Bước 4: So sánh độ dài hình học để kết luận 6/12 < 8/12.'],
    'Toán học 4', 'Lớp 4', 'Bài 56: Rút gọn phân số và Quy đồng mẫu số', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Điều khiển con trỏ trục số thực', false, undefined,
    ['Tử số', 'Mẫu số', 'Tọa độ trục số x'],
    'Mọi phân số đều biểu diễn một độ dài hình học chính xác trên trục số thực.'
  ),
  createItem(
    37, 'sim-th-07', 'Sự nở vì nhiệt của chất lỏng trong nhiệt kế',
    'Quan sát chất lỏng nở ra khi nóng lên và co lại khi lạnh đi, nguyên lý hoạt động của chiếc nhiệt kế đo độ ẩm/nhiệt độ.',
    ['Bước 1: Đặt bình cầu chứa nước màu có cắm ống thủy tinh nhỏ vào chậu nước lạnh.', 'Bước 2: Đánh dấu ngấn nước màu ban đầu ở vạch 20°C.', 'Bước 3: Chuyển bình cầu sang chậu nước sôi 80°C.', 'Bước 4: Quan sát cột nước màu nhanh chóng dâng cao trong ống thủy tinh.'],
    'Khoa học 4', 'Lớp 4', 'Bài 15: Nhiệt độ và Sự truyền nhiệt', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Nhiệt độ nước & Độ cao cột chất lỏng', false, undefined,
    ['Nhiệt độ (°C)', 'Thể tích chất lỏng dâng lên'],
    'Khi nhiệt độ tăng, các phân tử chuyển động hỗn loạn mạnh hơn làm tăng khoảng cách trung bình.'
  ),
  createItem(
    38, 'sim-th-08', 'Nam châm & Kim la bàn chỉ hướng Bắc - Nam',
    'Khám phá từ trường Trái Đất: Kim la bàn tự do luôn quay về hướng Bắc - Nam địa lý do tương tác với địa từ trường.',
    ['Bước 1: Đặt một kim la bàn có trục quay tự do trên bàn.', 'Bước 2: Xoay vỏ la bàn theo hướng bất kỳ: Kim nam châm tự động quay về hướng Bắc.', 'Bước 3: Đưa một thanh nam châm lại gần: Kim la bàn bị lệch khỏi hướng Bắc.', 'Bước 4: Rút thanh nam châm ra xa: Kim lập tức định hướng trở lại Bắc - Nam.'],
    'Khoa học 5', 'Lớp 5', 'Bài 12: Nam châm và La bàn chỉ hướng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Xoay la bàn & Tương tác nam châm', false, undefined,
    ['Góc xoay la bàn', 'Hướng từ trường Bắc - Nam'],
    'Trái Đất là một nam châm khổng lồ với cực Nam từ trường nằm gần cực Bắc địa lý.'
  ),
  createItem(
    39, 'sim-th-09', 'Cây thoát hơi nước qua lỗ khí của lá',
    'Chứng minh cây hút nước từ rễ và thoát hơi nước qua lá: Trùm túi nilon quanh cành lá thấy đọng đầy những giọt nước.',
    ['Bước 1: Chọn một chậu cây xanh tươi tốt.', 'Bước 2: Dùng túi nilon trong suốt trùm kín một cành lá và buộc chặt cuống.', 'Bước 3: Đặt chậu cây ngoài trời nắng trong 2 giờ.', 'Bước 4: Quan sát thành túi nilon mờ đi và đọng lại rất nhiều giọt nước nhỏ li ti.'],
    'Khoa học 4', 'Lớp 4', 'Bài 20: Nhu cầu sống của thực vật', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian thoát hơi nước dưới nắng', false, undefined,
    ['Cường độ ánh sáng', 'Lượng nước ngưng tụ'],
    'Thoát hơi nước tạo sức hút kéo cột nước và muối khoáng từ rễ lên nuôi toàn bộ thân lá.'
  ),
  createItem(
    40, 'sim-th-10', 'Tính dẫn nhiệt của kim loại, nhựa và gỗ',
    'So sánh tốc độ truyền nhiệt của ba thanh vật liệu: Thanh đồng làm chảy sáp rơi đinh sắt nhanh nhất, gỗ chậm nhất.',
    ['Bước 1: Gắn 3 chiếc đinh nhỏ bằng sáp nến vào 3 thanh Đồng, Nhựa, Gỗ cùng kích thước.', 'Bước 2: Đun nóng đầu đối diện của 3 thanh bằng ngọn đèn cồn.', 'Bước 3: Quan sát nhiệt truyền dọc theo thân từng thanh vật liệu.', 'Bước 4: Đinh ở thanh đồng rơi xuống đầu tiên sau 10s; đinh ở thanh gỗ không rơi.'],
    'Khoa học 4', 'Lớp 4', 'Bài 16: Vật dẫn nhiệt tốt và vật dẫn nhiệt kém', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian chảy sáp rơi đinh', false, undefined,
    ['Vật liệu thanh (Đồng, Nhựa, Gỗ)', 'Thời gian rơi đinh'],
    'Hệ số dẫn nhiệt của kim loại vượt trội nhờ mạng tinh thể và mật độ electron dẫn tự do cao.'
  ),
  createItem(
    41, 'sim-th-11', 'Chiếc bóng Mặt Trời thay đổi theo giờ trong ngày',
    'Khám phá chuyển động biểu kiến của Mặt Trời: Buổi sáng bóng dài về phía Tây, buổi trưa bóng ngắn nhất, chiều dài về phía Đông.',
    ['Bước 1: Cắm một chiếc cọc thẳng đứng giữa bãi đất trống phẳng.', 'Bước 2: Kéo thanh trượt thời gian từ 6:00 sáng đến 18:00 chiều.', 'Bước 3: Quan sát bóng cọc quay thành đường vòng cung và thay đổi độ dài.', 'Bước 4: Đồng hồ mặt trời (Sundial) cổ đại được chế tạo chính từ quy luật này.'],
    'Khoa học 5', 'Lớp 5', 'Bài 24: Mặt Trời và Trái Đất', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Giờ trong ngày & Chiều dài bóng cọc', false, undefined,
    ['Góc nâng Mặt Trời', 'Chiều dài bóng cọc (m)'],
    'Trái Đất tự quay quanh trục từ Tây sang Đông tạo nên chuyển động biểu kiến của Mặt Trời.'
  ),
  createItem(
    42, 'sim-th-12', 'Đo dung tích chất lỏng bằng bình chia độ',
    'Học sinh rèn luyện kỹ năng đọc thể tích chính xác: Đặt mắt ngang với đáy màng cong của mặt nước lõm trong bình.',
    ['Bước 1: Rót nước từ bình chứa vào một ống đong chia vạch millilit (ml).', 'Bước 2: Di chuyển tầm mắt lên cao hơn hoặc thấp hơn mức nước để thấy sai số thị giác.', 'Bước 3: Đặt mắt ngang bằng với điểm thấp nhất của mặt khum cong chất lỏng.', 'Bước 4: Đọc số đo chính xác 150ml.'],
    'Toán học 3 - 4', 'Lớp 3 - 4', 'Bài: Đơn vị đo dung tích Mililit & Lít', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc nhìn con mắt & Thể tích đọc được', false, undefined,
    ['Đáy màng cong (Meniscus)', 'Dung tích đo chính xác'],
    'Hiện tượng mao dẫn làm cong mép nước tiếp xúc với thành thủy tinh tạo màng khum.'
  ),
  createItem(
    43, 'sim-th-13', 'Âm thanh truyền qua chất rắn, chất lỏng và không khí',
    'Chứng minh âm thanh truyền tốt nhất qua chất rắn: Áp tai xuống mặt bàn nghe tiếng gõ rõ hơn nhiều so với nghe qua không khí.',
    ['Bước 1: Bạn nhỏ gõ nhẹ chiếc bút chì lên góc bàn bên kia.', 'Bước 2: Bạn đứng thẳng nghe: Âm thanh rất nhỏ và mờ nhạt qua không khí.', 'Bước 3: Bạn áp một bên tai sát vào mặt bàn gỗ.', 'Bước 4: Nghe thấy tiếng gõ bút chì truyền qua thớ gỗ cực kỳ to, đanh và rõ nét.'],
    'Khoa học 4', 'Lớp 4', 'Bài 13: Âm thanh và Sự truyền âm thanh', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Áp tai vào bàn & So sánh độ to', false, undefined,
    ['Môi trường truyền âm (Rắn, Khí)', 'Vận tốc truyền âm'],
    'Mật độ phân tử trong chất rắn cao và liên kết chặt chẽ hơn nên truyền sóng cơ học nhanh hơn.'
  ),
  createItem(
    44, 'sim-th-14', 'Tách chất ra khỏi hỗn hợp (Lọc cát & Lắng cặn)',
    'Học sinh phân biệt hỗn hợp không đồng nhất và dung dịch đồng nhất; thực hành phương pháp lọc tách chất rắn.',
    ['Bước 1: Khuấy đều cát mịn và nước tạo thành cốc nước đục ngầu.', 'Bước 2: Gấp giấy lọc hình phễu đặt lên bình tam giác hứng.', 'Bước 3: Rót từ từ hỗn hợp nước cát qua phễu lọc có giấy lọc.', 'Bước 4: Cát bị giữ lại trên mặt giấy lọc, nước trong vắt chảy xuống bình dưới.'],
    'Khoa học 5', 'Lớp 5', 'Bài 9: Hỗn hợp và Dung dịch', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Rót hỗn hợp qua phễu lọc', false, undefined,
    ['Chất rắn không tan', 'Kích thước lỗ giấy lọc', 'Nước lọc trong suốt'],
    'Tách chất dựa trên sự khác biệt về kích thước hạt: Hạt cát lớn hơn lỗ mao quản giấy lọc.'
  ),
  createItem(
    45, 'sim-th-15', 'Chuỗi thức ăn sinh thái đồng cỏ (Toán & Khoa học)',
    'Mô hình hóa dòng năng lượng sinh thái: Cỏ xanh -> Châu chấu -> Ếch đồng -> Rắn -> Đại bàng.',
    ['Bước 1: Kéo thả các sinh vật vào đúng mắt xích dinh dưỡng.', 'Bước 2: Quan sát mũi tên năng lượng đi từ sinh vật sản xuất sang sinh vật tiêu thụ.', 'Bước 3: Thử giảm đột ngột số lượng ếch đồng: Châu chấu sinh sôi phá hoại cỏ.', 'Bước 4: Hệ thống tự động cân bằng lại khi bổ sung loài săn mồi.'],
    'Khoa học 4', 'Lớp 4', 'Bài 23: Chuỗi thức ăn trong tự nhiên', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Lắp ráp chuỗi thức ăn', false, undefined,
    ['Bậc dinh dưỡng', 'Số lượng cá thể từng loài'],
    'Nguyên lý tháp năng lượng 10%: Năng lượng giảm dần qua mỗi bậc dinh dưỡng.'
  ),
  createItem(
    46, 'sim-th-16', 'Nấm men sinh khí CO2 làm nở bột bánh mì',
    'Khám phá quá trình lên men sinh học: Men nở tiêu thụ đường sinh ra khí carbon dioxide làm bột phồng xốp.',
    ['Bước 1: Cho nấm men, đường và nước ấm vào chai thủy tinh.', 'Bước 2: Lồng một quả bóng bay mỏng vào miệng chai.', 'Bước 3: Đặt chai vào chậu nước ấm 35°C trong 30 phút.', 'Bước 4: Khí CO2 sinh ra từ phản ứng lên men từ từ thổi phồng quả bóng bay.'],
    'Khoa học 5', 'Lớp 5', 'Bài 21: Vi sinh vật quanh em', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian lên men & Độ phồng bóng', false, undefined,
    ['Nhiệt độ lên men', 'Lượng khí CO2 sinh ra'],
    'Hô hấp kỵ khí của nấm men: C6H12O6 -> 2 C2H5OH + 2 CO2 giải phóng bọt khí.'
  ),
  createItem(
    47, 'sim-th-17', 'Cây nến cháy trong lọ kín và vai trò của oxy',
    'Chứng minh sự cháy cần khí oxy: Nến úp cốc thủy tinh sẽ lụi tàn dần khi lượng oxy trong cốc bị tiêu thụ hết.',
    ['Bước 1: Thắp sáng một ngọn nến nhỏ trên đĩa chứa nước màu.', 'Bước 2: Úp ngược chiếc cốc thủy tinh lên ngọn nến.', 'Bước 3: Sau vài giây: Ngọn lửa lụi dần rồi tắt hẳn.', 'Bước 4: Nước màu trong đĩa bị hút dâng lên chiếm khoảng 1/5 thể tích cốc (tương ứng tỉ lệ oxy).'],
    'Khoa học 4', 'Lớp 4', 'Bài 8: Không khí cần cho sự cháy', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian nến cháy & Mức nước dâng', false, undefined,
    ['Thể tích khí oxy trong không khí (21%)', 'Mức nước dâng'],
    'Sự cháy là phản ứng oxy hóa mãnh liệt tiêu thụ O2 sinh ra CO2 và hơi nước.'
  ),
  createItem(
    48, 'sim-th-18', 'Ròng rọc cố định và ròng rọc động',
    'So sánh lợi ích cơ học: Ròng rọc cố định chỉ đổi hướng lực kéo; ròng rọc động giúp giảm 1/2 lực kéo cần thiết.',
    ['Bước 1: Kéo vật nặng 100N bằng ròng rọc cố định: Lực kéo hiển thị đúng 100N.', 'Bước 2: Mắc thêm một ròng rọc động vào vật nặng.', 'Bước 3: Kéo dây: Lực kế hiển thị giảm xuống chỉ còn 50N.', 'Bước 4: Đổi lại quãng đường dây kéo phải dài gấp đôi độ cao nâng vật.'],
    'Khoa học 5', 'Lớp 5', 'Bài 19: Ròng rọc trong đời sống', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Độ cao nâng & Lực kéo hiển thị', false, undefined,
    ['Số ròng rọc động', 'Lực kéo F', 'Quãng đường kéo s'],
    'Định luật vàng về cơ học: Giảm 2 lần về lực thì quãng đường phải đi dài gấp 2 lần.'
  ),
  createItem(
    49, 'sim-th-19', 'Vận tốc xe trượt trên mặt dốc nghiêng',
    'Khám phá mối liên hệ giữa độ dốc và gia tốc: Dốc càng nghiêng thì xe trượt xuống chân dốc càng nhanh.',
    ['Bước 1: Cài đặt tấm ván nghiêng góc 15° và đặt xe trượt ở đỉnh dốc.', 'Bước 2: Thả xe chạy tự do: Đồng hồ bấm giờ ghi nhận thời gian t = 2.0s.', 'Bước 3: Tăng góc dốc lên 45° và thả lại xe trượt.', 'Bước 4: Xe lao xuống với tốc độ chóng mặt, thời gian rút ngắn còn t = 1.0s.'],
    'Khoa học 4 - 5', 'Lớp 4 - 5', 'Bài: Lực và Chuyển động của vật', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc dốc nghiêng & Vận tốc xe', false, undefined,
    ['Góc nghiêng α', 'Gia tốc a = g.sin(α)', 'Thời gian trượt'],
    'Thành phần trọng lực dọc theo mặt phẳng nghiêng Px = P.sin(α) sinh ra gia tốc chuyển động.'
  ),
  createItem(
    50, 'sim-th-20', 'Mô hình hóa tỷ số phần trăm bằng lưới 100 ô',
    'Xây dựng trực giác phần trăm trực quan: 25% chính là tô màu 25 ô trên tổng số 100 ô vuông bằng nhau.',
    ['Bước 1: Mở lưới vuông 10x10 gồm đúng 100 ô nhỏ.', 'Bước 2: Tô màu 25 ô vuông: Hệ thống hiển thị tương đương 25% = 25/100 = 1/4 = 0.25.', 'Bước 3: Kéo thanh trượt tô màu lên 50 ô: Hệ thống hiển thị 50% = 1/2.', 'Bước 4: Tô kín toàn bộ 100 ô: Biểu thị 100% trọn vẹn 1 đơn vị.'],
    'Toán học 5', 'Lớp 5', 'Bài 38: Khái niệm Tỉ số phần trăm', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Số ô tô màu & Tỉ số phần trăm (%)', false, undefined,
    ['Số ô tô màu', 'Phần trăm (%)', 'Phân số tương ứng'],
    'Phần trăm là một phân số đặc biệt có mẫu số chuẩn hóa cố định bằng 100.'
  ),
  createItem(
    51, 'sim-th-21', 'Nước hòa tan muối nhưng không hòa tan dầu ăn',
    'Trẻ khám phá tính phân cực của chất lỏng: Muối tan vào nước, dầu ăn nhẹ hơn nổi lên thành lớp riêng.',
    ['Bước 1: Rót nước và dầu ăn vào cùng một cốc thủy tinh.', 'Bước 2: Quan sát dầu ăn nổi lên trên tạo thành hai lớp phân cách rõ rệt.', 'Bước 3: Rắc muối tinh vào cốc: Muối chìm xuyên qua dầu rơi xuống nước và tan biến.', 'Bước 4: Nhỏ thêm giọt xà phòng và khuấy: Hỗn hợp tạo thành nhũ tương đục.'],
    'Khoa học 5', 'Lớp 5', 'Bài 10: Sự hòa tan của các chất lỏng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Thêm muối & Dầu ăn vào nước', false, undefined,
    ['Độ tan', 'Phân lớp chất lỏng'],
    'Nước là dung môi phân cực hòa tan chất ion (muối) nhưng không hòa tan chất không phân cực (dầu).'
  ),
  createItem(
    52, 'sim-th-22', 'Gió sinh ra từ sự chênh lệch nhiệt độ không khí',
    'Mô phỏng nguyên nhân sinh ra gió: Không khí nóng nhẹ bay lên, không khí lạnh nặng tràn sang chiếm chỗ.',
    ['Bước 1: Đốt một ngọn nến bên trong hộp đối lưu có hai ống khói.', 'Bước 2: Đặt một que hương đang tỏa khói ở miệng ống khói đối diện.', 'Bước 3: Quan sát dòng khói hương bị hút chui xuống hộp rồi bốc lên ở ống khói có nến.', 'Bước 4: Giải thích hiện tượng gió biển ban ngày và gió đất ban đêm.'],
    'Khoa học 4', 'Lớp 4', 'Bài 6: Gió, bão và các hiện tượng thời tiết', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-particle-sandbox', 'Dòng đối lưu của phân tử không khí', false, undefined,
    ['Độ chênh lệch nhiệt độ', 'Vận tốc dòng gió'],
    'Sự chênh lệch áp suất khí quyển do đốt nóng không đều là động cơ sinh ra gió trên Trái Đất.'
  ),
  createItem(
    53, 'sim-th-23', 'Cơ quan hô hấp & Sự co giãn của phổi',
    'Mô hình chai nhựa cắt đáy có bóng cao su đại diện cho cơ hoành và hai lá phổi trong lồng ngực.',
    ['Bước 1: Cầm màng cao su đáy chai kéo xuống phía dưới (mô phỏng cơ hoành hạ xuống).', 'Bước 2: Áp suất trong chai giảm: Không khí tràn vào làm hai quả bóng bên trong phồng to (Hít vào).', 'Bước 3: Đẩy màng cao su lên phía trên (cơ hoành nâng lên).', 'Bước 4: Áp suất tăng đẩy không khí ra ngoài làm hai quả bóng xẹp lép (Thở ra).'],
    'Khoa học 5', 'Lớp 5', 'Bài 26: Cơ quan hô hấp và Sự thở ở người', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Kéo màng cơ hoành & Thể tích phổi', false, undefined,
    ['Áp suất khoang ngực', 'Thể tích phổi hít/thở'],
    'Định luật Boyle áp dụng cho sinh học: Tăng thể tích lồng ngực làm giảm áp suất phế nang hút khí vào.'
  ),
  createItem(
    54, 'sim-th-24', 'Lực ma sát khi phanh hãm xe đạp',
    'Khám phá cơ chế má phanh cao su kẹp chặt vào vành kim loại tạo ra ma sát trượt biến động năng thành nhiệt.',
    ['Bước 1: Cho bánh xe đạp quay tít mù ở tốc độ cao.', 'Bước 2: Bóp nhẹ tay phanh: Má phanh cao su chạm nhẹ vào vành bánh xe.', 'Bước 3: Bóp chặt tay phanh dứt khoát: Lực ma sát cực đại làm bánh xe dừng khựng lại ngay lập tức.', 'Bước 4: Dùng tay chạm vào má phanh: Cảm nhận má phanh nóng ran lên.'],
    'Khoa học 5', 'Lớp 5', 'Bài 17: Năng lượng và Ma sát trong cuộc sống', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Lực bóp phanh & Thời gian dừng bánh xe', false, undefined,
    ['Lực ép má phanh', 'Nhiệt năng tỏa ra'],
    'Định luật bảo toàn năng lượng: Động năng của xe biến thành nhiệt năng do công của lực ma sát.'
  ),
  createItem(
    55, 'sim-th-25', 'Khả năng giữ nước: Đất sét, đất cát và đất thịt',
    'Rót cùng 100ml nước vào 3 loại đất: Đất cát chảy tuột qua ngay, đất sét giữ nước không chảy, đất thịt thoát nước vừa phải.',
    ['Bước 1: Đặt 3 phễu chứa cùng một lượng Đất cát, Đất thịt và Đất sét.', 'Bước 2: Rót đồng thời 100ml nước vào cả 3 phễu.', 'Bước 3: Quan sát cốc hứng phía dưới: Cốc đất cát hứng được 85ml nước rất nhanh.', 'Bước 4: Cốc đất thịt hứng được 40ml nước; cốc đất sét chỉ nhỏ vài giọt chậm chạp.'],
    'Khoa học 4', 'Lớp 4', 'Bài 25: Đất và Vai trò của đất', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian thấm nước qua các loại đất', false, undefined,
    ['Kích thước hạt đất', 'Lượng nước giữ lại'],
    'Độ xốp và kích thước khoảng trống giữa các hạt khoáng quyết định khả năng mao dẫn và thấm nước.'
  ),
  createItem(
    56, 'sim-th-26', 'Gương cầu lồi gắn ở khúc cua đường đèo',
    'Giải thích tại sao ở ngã rẽ đường đèo luôn lắp gương cầu lồi: Vùng nhìn thấy của gương lồi rộng hơn nhiều so với gương phẳng.',
    ['Bước 1: Đặt một chiếc gương phẳng ở ngã tư đường: Vùng quan sát phía sau bị hẹp.', 'Bước 2: Thay thế bằng chiếc gương cầu lồi có bề mặt cong ra ngoài.', 'Bước 3: Quan sát vùng nhìn thấy mở rộng bao quát toàn bộ khúc cua khuất tầm nhìn.', 'Bước 4: Bác tài xế nhìn thấy xe đi ngược chiều từ xa để chủ động giảm tốc.'],
    'Khoa học 5', 'Lớp 5', 'Bài: Ánh sáng và Các loại gương', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc quan sát vùng nhìn thấy của gương', false, undefined,
    ['Độ cong gương cầu', 'Góc mở vùng quan sát'],
    'Gương cầu lồi tạo ảnh ảo nhỏ hơn vật nên cho thị trường (vùng nhìn thấy) rộng hơn gương phẳng.'
  ),
  createItem(
    57, 'sim-th-27', 'Khối lượng riêng của quả táo nổi trên nước',
    'Xác định khối lượng bằng cân và thể tích bằng bình tràn để tính khối lượng riêng D = m / V của quả táo.',
    ['Bước 1: Cân quả táo trên cân đĩa: Ghi nhận m = 180 gam.', 'Bước 2: Đổ đầy nước vào bình tràn có vòi dẫn ra cốc đong.', 'Bước 3: Thả quả táo vào bình tràn và dùng que nhấn chìm hoàn toàn quả táo.', 'Bước 4: Đo thể tích nước tràn ra cốc đong V = 200 ml -> Tính D = 180 / 200 = 0.9 g/ml (< 1g/ml nên nổi).'],
    'Toán & Khoa học 5', 'Lớp 5', 'Bài: Khối lượng và Thể tích vật thể', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Cân khối lượng & Đo thể tích nước tràn', false, undefined,
    ['Khối lượng m (g)', 'Thể tích V (cm³)', 'Khối lượng riêng D'],
    'Vật có khối lượng riêng nhỏ hơn khối lượng riêng của nước (1g/cm³) sẽ luôn nổi.'
  ),
  createItem(
    58, 'sim-th-28', 'Truyền ánh sáng qua kính trong, kính mờ và bìa đen',
    'Phân loại vật cho ánh sáng truyền qua hoàn toàn (trong suốt), truyền qua một phần (mờ) và không truyền qua (vật cản).',
    ['Bước 1: Bật chùm sáng chiếu vào màn chắn.', 'Bước 2: Đặt tấm kính trong suốt vào giữa: Toàn bộ chùm sáng đi qua rõ nét.', 'Bước 3: Thay bằng tấm kính mờ: Ánh sáng bị tán xạ chỉ lờ mờ đi qua một phần.', 'Bước 4: Đặt tấm bìa carton đen: Toàn bộ ánh sáng bị chặn lại tạo bóng tối phía sau.'],
    'Khoa học 4', 'Lớp 4', 'Bài 11: Vật cho ánh sáng truyền qua', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Thay đổi vật liệu cản sáng', false, undefined,
    ['Độ trong suốt vật liệu', 'Cường độ sáng truyền qua'],
    'Cấu trúc mạng tinh thể và mức độ hấp thụ/tán xạ photon quyết định tính quang học của chất.'
  ),
  createItem(
    59, 'sim-th-29', 'Mạch điện hai công tắc cầu thang',
    'Lắp ráp mạch điện logic thực tế: Đứng ở tầng 1 bật đèn sáng, lên tầng 2 tắt đèn và ngược lại.',
    ['Bước 1: Lắp mạch điện gồm nguồn điện, 1 bóng đèn và 2 công tắc 3 cực ở vị trí Tầng 1 và Tầng 2.', 'Bước 2: Bấm công tắc Tầng 1: Mạch kín được thiết lập, bóng đèn sáng.', 'Bước 3: Lên đến Tầng 2 bấm công tắc Tầng 2: Mạch hở, bóng đèn tắt.', 'Bước 4: Bấm lại công tắc Tầng 1: Mạch lại được đóng kín trở lại.'],
    'Khoa học 5', 'Lớp 5', 'Bài 15: Ứng dụng an toàn của điện năng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Đóng/ngắt công tắc cầu thang', false, undefined,
    ['Trạng thái công tắc 1, 2', 'Độ sáng bóng đèn'],
    'Mạch logic XOR (Exclusive OR): Trạng thái đèn sáng khi hai công tắc ở cùng nhánh tiếp điểm.'
  ),
  createItem(
    60, 'sim-th-30', 'Chu kỳ biến thái của loài bướm',
    'Mô phỏng 4 giai đoạn sinh trưởng của loài bướm: Trứng -> Sâu bướm ăn lá -> Nhộng kén -> Bướm xinh đẹp xòe cánh.',
    ['Bước 1: Bướm mẹ đẻ những quả trứng nhỏ li ti dưới mặt lá.', 'Bước 2: Tua thời gian: Trứng nở thành sâu bướm phàm ăn lớn nhanh như thổi.', 'Bước 3: Sâu bướm nhả tơ bọc kín mình thành chiếc kén nhộng bất động.', 'Bước 4: Vỏ kén nứt ra: Chú bướm rực rỡ chui ra phơi khô đôi cánh rồi bay lượn.'],
    'Khoa học 5', 'Lớp 5', 'Bài 32: Sự sinh sản của côn trùng', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Tua chu kỳ biến thái hoàn toàn', false, undefined,
    ['Giai đoạn biến thái', 'Thời gian sinh trưởng'],
    'Biến thái hoàn toàn (Holometabolism) giúp sâu non và bướm trưởng thành không cạnh tranh nguồn thức ăn.'
  ),
  createItem(
    61, 'sim-th-31', 'Sự gỉ sét của đinh sắt trong nước và không khí',
    'Chứng minh đinh sắt chỉ bị gỉ khi có đồng thời cả khí oxy và độ ẩm nước: Để đinh trong dầu ăn không bao giờ gỉ.',
    ['Bước 1: Ống 1 để đinh sắt trong không khí ẩm bình thường.', 'Bước 2: Ống 2 để đinh sắt ngập trong dầu ăn ngăn cách hoàn toàn với không khí.', 'Bước 3: Ống 3 để đinh sắt trong bình có chất hút ẩm khô cong.', 'Bước 4: Sau 5 ngày: Chỉ có đinh ở Ống 1 bị gỉ nâu đỏ; đinh ở Ống 2 và 3 sáng bóng.'],
    'Khoa học 5', 'Lớp 5', 'Bài: Sự biến đổi hóa học của kim loại', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thời gian ăn mòn 5 ngày', false, undefined,
    ['Môi trường (Ẩm, Khô, Dầu)', 'Mức độ gỉ sét'],
    'Quá trình oxy hóa chậm kim loại: 4Fe + 3O2 + xH2O -> 2Fe2O3.xH2O (gỉ sắt).'
  ),
  createItem(
    62, 'sim-th-32', 'Lực từ của nam châm: Cùng cực đẩy, khác cực hút',
    'Khám phá quy tắc tương tác từ: Đưa hai cực Bắc (N) lại gần nhau thấy lực đẩy dội ngược lại, cực N hút cực S.',
    ['Bước 1: Đặt một thanh nam châm trên xe trượt nhỏ.', 'Bước 2: Cầm thanh nam châm thứ hai đưa cực N lại gần cực N của xe trượt.', 'Bước 3: Quan sát xe trượt bị đẩy lùi ra xa mà không cần chạm vào nhau.', 'Bước 4: Đổi đầu đưa cực S lại gần cực N: Xe trượt bị hút dính chặt ngay lập tức.'],
    'Khoa học 5', 'Lớp 5', 'Bài 12: Tính chất của nam châm', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Kéo đẩy cực nam châm N-S', false, undefined,
    ['Khoảng cách tương tác d', 'Chiều lực từ (Hút/Đẩy)'],
    'Định luật tương tác từ trường: Các đường sức từ cùng chiều chèn ép nhau tạo lực đẩy.'
  ),
  createItem(
    63, 'sim-th-33', 'Đo diện tích hình bất kỳ bằng lưới ô vuông',
    'Phương pháp xấp xỉ tích phân sơ cấp: Đếm số ô vuông trọn vẹn và ghép các nửa ô vuông để ước lượng diện tích chiếc lá.',
    ['Bước 1: Đặt một chiếc lá phong lên giấy kẻ ô ly 1cm x 1cm.', 'Bước 2: Vẽ đường viền quanh chiếc lá.', 'Bước 3: Đếm số ô vuông nguyên vẹn nằm trọn vẹn bên trong (ví dụ: 24 ô = 24 cm²).', 'Bước 4: Đếm các ô bị cắt một phần và lấy trung bình cộng -> Tổng diện tích xấp xỉ 32 cm².'],
    'Toán học 4 - 5', 'Lớp 4 - 5', 'Bài: Diện tích hình phẳng bất kỳ', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Kích thước ô lưới xấp xỉ', false, undefined,
    ['Số ô nguyên', 'Số ô bán phần', 'Diện tích xấp xỉ (cm²)'],
    'Khái niệm tổng Riemann sơ khai: Khi ô lưới càng nhỏ, tổng diện tích ô vuông càng tiến tới diện tích thực.'
  ),
  createItem(
    64, 'sim-th-34', 'Hiện tượng Nhật thực & Nguyệt thực sơ cấp',
    'Mô phỏng vị trí 3 thiên thể: Mặt Trời, Trái Đất, Mặt Trăng thẳng hàng tạo bóng tối che khuất nhau.',
    ['Bước 1: Xếp Mặt Trăng đi vào giữa Mặt Trời và Trái Đất.', 'Bước 2: Quan sát bóng tối của Mặt Trăng đổ lên bề mặt Trái Đất (Nhật thực).', 'Bước 3: Xếp Trái Đất đi vào giữa Mặt Trời và Mặt Trăng.', 'Bước 4: Mặt Trăng đi vào vùng bóng tối của Trái Đất chuyển sang màu đỏ đồng (Nguyệt thực).'],
    'Khoa học 5', 'Lớp 5', 'Bài 25: Trái Đất, Mặt Trăng và Mặt Trời', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc quay quỹ đạo Mặt Trăng', false, undefined,
    ['Vị trí 3 thiên thể', 'Vùng bóng tối (Umbra)', 'Vùng bóng nửa tối (Penumbra)'],
    'Định luật truyền thẳng ánh sáng tạo vùng bóng tối và bóng nửa tối hình học của các thiên thể.'
  ),
  createItem(
    65, 'sim-th-35', 'Âm thoa rung động tạo sóng gợn trên mặt nước',
    'Trực quan hóa sự dao động của âm thanh: Gõ âm thoa nhúng vào chậu nước thấy nước bắn tung tóe thành các vòng sóng tròn.',
    ['Bước 1: Dùng búa cao su gõ mạnh vào một nhánh của âm thoa kim loại.', 'Bước 2: Lắng nghe âm thanh ngân nga của âm thoa phát ra.', 'Bước 3: Nhẹ nhàng nhúng đầu hai nhánh âm thoa chạm vào mặt cốc nước.', 'Bước 4: Nước lập tức bắn tung tóe thành hàng trăm giọt nhỏ li ti tạo các gợn sóng đồng tâm.'],
    'Khoa học 4', 'Lớp 4', 'Bài 13: Sự rung động và Âm thanh', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-drag-drop', 'Gõ âm thoa & Nhúng vào nước', false, undefined,
    ['Biên độ rung âm thoa', 'Độ văng bắn của giọt nước'],
    'Dao động cơ học của nhánh kim loại truyền động lượng sang các phân tử nước lân cận.'
  ),
  createItem(
    66, 'sim-th-36', 'Đo thân nhiệt: Nhiệt kế thủy ngân & Nhiệt kế điện tử',
    'Học sinh thực hành kỹ năng đo thân nhiệt đúng cách: Vẩy nhiệt kế thủy ngân xuống dưới 35°C trước khi kẹp nách.',
    ['Bước 1: Cầm nhiệt kế thủy ngân lắc vẩy mạnh cổ tay xuống dưới vạch 35°C.', 'Bước 2: Kẹp nhiệt kế vào nách trong 5 phút.', 'Bước 3: Rút nhiệt kế ra giữ thẳng tầm mắt đọc vạch thủy ngân dâng lên 37.0°C.', 'Bước 4: So sánh với thao tác đo trán bằng nhiệt kế hồng ngoại điện tử chỉ trong 1 giây.'],
    'Khoa học 4', 'Lớp 4', 'Bài 15: Sử dụng nhiệt kế y tế an toàn', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Thời gian kẹp nhiệt kế (Phút)', false, undefined,
    ['Vạch thủy ngân', 'Thân nhiệt người bình thường (36.5 - 37.2°C)'],
    'Ống thắt hẹp ở đáy nhiệt kế thủy ngân ngăn cột thủy ngân tự tụt xuống khi rút khỏi cơ thể.'
  ),
  createItem(
    67, 'sim-th-37', 'Thời gian rơi của tờ giấy phẳng và tờ giấy vo tròn',
    'Khám phá lực cản không khí: Hai vật nặng bằng nhau nhưng tờ giấy phẳng rơi chậm lượn lờ, tờ giấy vo tròn rơi nhanh như đá.',
    ['Bước 1: Cầm hai tờ giấy A4 giống hệt nhau có cùng khối lượng.', 'Bước 2: Giữ nguyên tờ giấy A phẳng; vo tròn tờ giấy B thành một viên bi giấy chặt.', 'Bước 3: Thả đồng thời hai tờ giấy rơi từ cùng một độ cao 2 mét.', 'Bước 4: Viên bi giấy chạm đất trước; tờ giấy phẳng bay bồng bềnh rơi sau 3 giây.'],
    'Khoa học 4', 'Lớp 4', 'Bài 7: Không khí có lực cản', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-time-control', 'Thả rơi đồng thời & Đo thời gian', false, undefined,
    ['Diện tích tiếp xúc không khí', 'Lực cản không khí F_cản'],
    'Lực cản của không khí tỷ lệ thuận với diện tích bề mặt tiếp xúc của vật thể chuyển động.'
  ),
  createItem(
    68, 'sim-th-38', 'Dung dịch bão hòa đường ở các nhiệt độ khác nhau',
    'Khám phá độ tan phụ thuộc nhiệt độ: Nước sôi hòa tan được nhiều đường hơn nước lạnh; khi nguội đường kết tinh lại.',
    ['Bước 1: Cho đường vào cốc nước lạnh 20°C cho đến khi đường không tan được nữa (bão hòa).', 'Bước 2: Đun nóng cốc nước lên 80°C: Lớp đường lắng dưới đáy tan biến hết.', 'Bước 3: Cho thêm 3 thìa đường nữa: Đường tiếp tục tan vào nước nóng.', 'Bước 4: Để cốc nguội từ từ: Xuất hiện các tinh thể đường óng ánh kết tinh bám vào que cắm.'],
    'Khoa học 5', 'Lớp 5', 'Bài 10: Sự hòa tan và Kết tinh chất rắn', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Nhiệt độ nước & Khối lượng đường hòa tan', false, undefined,
    ['Nhiệt độ dung môi (°C)', 'Độ tan S (g/100g nước)'],
    'Nhiệt năng cung cấp năng lượng bẻ gãy mạng tinh thể rắn giúp phân tán nhiều phân tử hơn.'
  ),
  createItem(
    69, 'sim-th-39', 'Bánh răng truyền chuyển động quay ngược chiều',
    'Khám phá cơ cấu truyền động: Hai bánh răng ăn khớp luôn quay ngược chiều nhau; bánh to quay chậm, bánh nhỏ quay nhanh.',
    ['Bước 1: Ghép ăn khớp bánh răng A (20 răng) với bánh răng B (10 răng).', 'Bước 2: Quay bánh răng A theo chiều kim đồng hồ.', 'Bước 3: Quan sát bánh răng B tự động quay ngược chiều kim đồng hồ.', 'Bước 4: Đếm số vòng: Khi bánh răng A quay 1 vòng thì bánh răng B quay đúng 2 vòng.'],
    'Khoa học 5 / Tin học', 'Lớp 5', 'Bài: Lắp ráp cơ cấu chuyển động', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Tốc độ quay & Tỉ số truyền bánh răng', false, undefined,
    ['Số răng Z1, Z2', 'Tỉ số truyền i = Z1 / Z2'],
    'Định luật bảo toàn vận tốc dài tại điểm tiếp xúc ăn khớp: v = ω1.r1 = ω2.r2.'
  ),
  createItem(
    70, 'sim-th-40', 'Tán xạ ánh sáng trắng qua lăng kính đồ chơi',
    'Tái hiện thí nghiệm kinh điển: Chiếu chùm ánh sáng trắng mặt trời qua lăng kính thủy tinh phân tách thành dải 7 màu.',
    ['Bước 1: Chiếu một khe sáng hẹp màu trắng vào mặt bên của lăng kính thủy tinh tam giác.', 'Bước 2: Xoay góc nghiêng của lăng kính để tìm góc lệch thích hợp.', 'Bước 3: Đặt màn chắn phía sau lăng kính: Quan sát dải màu cầu vồng trải dài liên tục.', 'Bước 4: Ánh sáng đỏ lệch ít nhất, ánh sáng tím lệch nhiều nhất.'],
    'Khoa học 4', 'Lớp 4', 'Bài 12: Ánh sáng trắng và Ánh sáng màu', 'SGK Kết nối tri thức',
    'tieu-hoc', 'pattern-slider', 'Góc tới của chùm sáng qua lăng kính', false, undefined,
    ['Góc lệch dải màu', 'Quang phổ liên tục 7 màu'],
    'Chiết suất của thủy tinh biến thiên theo bước sóng ánh sáng (n_tím > n_đỏ) bẻ cong các màu ở các góc khác nhau.'
  ),

  // =========================================================================
  // CẤP 3: THCS (50 THÍ NGHIỆM: STT 71 -> 120)
  // =========================================================================
  createItem(
    71, 'sim-thcs-01', 'Phòng Lab Mạch Điện DC & Định Luật Ohm Trực Quan',
    'Làm sáng tỏ bản chất của định luật Ohm: Cường độ dòng điện I = U / R, trực quan hóa dòng trôi của các hạt electron.',
    ['Bước 1: Mở mạch điện DC gồm nguồn điện biến thiên, biến trở R, ampe kế và bóng đèn.', 'Bước 2: Kéo thanh trượt điện áp U từ 1V lên 24V: Quan sát tốc độ trôi của electron tăng nhanh.', 'Bước 3: Tăng điện trở R từ 2Ω lên 50Ω: Dòng điện I giảm dần, bóng đèn mờ đi.', 'Bước 4: Quan sát đồ thị đặc tuyến Volt - Ampe (I theo U) là đường thẳng dốc 1/R.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 23: Tác dụng của dòng điện & Định luật Ohm', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Điều khiển biến số liên tục (Continuous Slider)', true, 'sim-electric-circuit',
    ['Hiệu điện thế U (V)', 'Điện trở R (Ω)', 'Dòng điện I (A)', 'Công suất P (W)'],
    'Dòng điện là dòng dịch chuyển có hướng của electron dưới tác dụng của điện trường.'
  ),
  createItem(
    72, 'sim-thcs-02', 'Định luật bảo toàn khối lượng trong phản ứng hóa học',
    'Chứng minh định luật Lomonosov - Lavoisier: Tổng khối lượng các chất tham gia luôn bằng tổng khối lượng sản phẩm.',
    ['Bước 1: Đặt bình nón chứa dung dịch BaCl2 và ống nghiệm chứa Na2SO4 lên cân điện tử có nắp kín.', 'Bước 2: Ghi lại khối lượng ban đầu m = 152.35 gam.', 'Bước 3: Nghiêng bình nón để hai chất trộn vào nhau tạo kết tủa trắng BaSO4.', 'Bước 4: Quan sát số chỉ cân điện tử sau phản ứng: Vẫn giữ nguyên chính xác 152.35 gam.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 6: Định luật bảo toàn khối lượng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-poe-challenge', 'Dự đoán - Thực nghiệm - Kiểm chứng (POE)', false, undefined,
    ['Khối lượng trước m1', 'Khối lượng sau m2', 'Hiện tượng kết tủa BaSO4'],
    'Phản ứng hóa học chỉ sắp xếp lại liên kết; số lượng và loại nguyên tử hoàn toàn bảo toàn.'
  ),
  createItem(
    73, 'sim-thcs-03', 'Áp suất chất lỏng & Lực đẩy Archimedes (FA = d.V)',
    'Trực quan hóa độ chênh lệch áp suất thủy tĩnh giữa đáy dưới và mặt trên của vật chìm sinh ra lực đẩy Ác-si-mét.',
    ['Bước 1: Treo khối kim loại vào lực kế trong không khí (lực kế chỉ P = 5N).', 'Bước 2: Nhúng ngập dần khối kim loại vào bình tràn chứa nước.', 'Bước 3: Lực kế giảm xuống còn 3N; lượng nước tràn ra đúng bằng 2N.', 'Bước 4: Thay đổi chất lỏng sang dầu ăn và nước muối để kiểm chứng FA = d.V.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 16: Áp suất chất lỏng & Lực đẩy Archimedes', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Kéo thả vật thể & Đo cảm biến lực', false, undefined,
    ['Thể tích V (m³)', 'Trọng lượng riêng chất lỏng d', 'Lực đẩy FA (N)'],
    'Lực đẩy Archimedes bằng trọng lượng khối chất lỏng bị vật chiếm chỗ.'
  ),
  createItem(
    74, 'sim-thcs-04', 'Khúc xạ ánh sáng & Tạo ảnh qua Thấu kính hội tụ',
    'Vẽ và tính toán đường đi của 3 tia sáng đặc biệt qua quang tâm O, tiêu điểm F để dựng ảnh thật hoặc ảnh ảo.',
    ['Bước 1: Đặt ngọn nến sáng trước thấu kính hội tụ có tiêu cự f = 10cm.', 'Bước 2: Di chuyển khoảng cách d từ nến đến thấu kính (d > 2f, f < d < 2f, d < f).', 'Bước 3: Di chuyển màn hứng phía sau thấu kính để tìm vị trí ảnh sắc nét nhất.', 'Bước 4: Kiểm chứng công thức liên hệ tiêu cự: 1/f = 1/d + 1/d\'.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 5: Khúc xạ ánh sáng và Thấu kính', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khoảng cách vật d & Dựng 3 tia sáng', false, undefined,
    ['Khoảng cách vật d (cm)', 'Khoảng cách ảnh d\' (cm)', 'Tiêu cự f (cm)', 'Độ phóng đại k'],
    'Định luật khúc xạ ánh sáng Snell-Descartes tại hai mặt cong thấu kính uốn hội tụ chùm tia.'
  ),
  createItem(
    75, 'sim-thcs-05', 'Mô phỏng phân bào nguyên phân & Nhiễm sắc thể',
    'Mô phỏng 4 kỳ của quá trình nguyên phân để hiểu cơ chế bảo tồn bộ nhiễm sắc thể lưỡng bội 2n của tế bào mẹ.',
    ['Bước 1: Chọn tế bào nhân thực có bộ NST 2n = 4.', 'Bước 2: Nhấn bắt đầu chu kỳ: Quan sát DNA nhân đôi tạo các NST kép đính ở tâm động.', 'Bước 3: Tua chậm 0.25x tại kỳ giữa khi các NST xếp thẳng hàng ở mặt phẳng xích đạo.', 'Bước 4: Bước từng khung hình dt ở kỳ sau khi thoi vô sắc kéo các crômatit về hai cực.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 38: Nguyên phân và Giảm phân', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Điều khiển thời gian & Phóng đại vi mô', false, undefined,
    ['Kỳ phân bào (Đầu, Giữa, Sau, Cuối)', 'Số crômatit', 'Bộ NST 2n'],
    'Cơ chế nhân đôi bán bảo tồn và phân ly đồng đều duy trì tính ổn định của vật chất di truyền.'
  ),
  createItem(
    76, 'sim-thcs-06', 'Đo tốc độ bằng cổng quang điện & Đồng hồ hiện số',
    'Phương pháp đo tốc độ hiện đại trong phòng lab: Đo vận tốc tức thời v = s / Δt bằng cảm biến hồng ngoại ngắt chùm tia.',
    ['Bước 1: Đặt xe trượt có tấm chắn sáng rộng s = 2cm trên máng dẫn nghiêng.', 'Bước 2: Cài đặt hai cổng quang điện A và B cách nhau L = 50cm.', 'Bước 3: Thả xe trượt tự do qua cổng A và cổng B.', 'Bước 4: Đồng hồ hiện số ghi lại ΔtA, ΔtB; học sinh tính vA, vB và gia tốc a.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 9: Đo tốc độ chuyển động', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Cảm biến hồng ngoại & Ghi nhận thời gian', false, undefined,
    ['Bề rộng tấm chắn s (m)', 'Thời gian chắn sáng Δt (ms)', 'Tốc độ v (m/s)'],
    'Vận tốc tức thời là đạo hàm của độ dời theo thời gian khi khoảng thời gian tiến về 0.'
  ),
  createItem(
    77, 'sim-thcs-07', 'Định luật đòn bẩy Archimedes (F1.d1 = F2.d2)',
    'Khảo sát điều kiện cân bằng của đòn bẩy quanh trục quay cố định: Tổng các mômen lực làm quay theo chiều kim đồng hồ bằng ngược chiều kim đồng hồ.',
    ['Bước 1: Treo quả nặng P1 = 2N ở khoảng cách d1 = 20cm tính từ trục quay O.', 'Bước 2: Treo quả nặng P2 = 4N ở khoảng cách d2 = 10cm ở phía bên kia.', 'Bước 3: Quan sát đòn bẩy nằm ngang thăng bằng tuyệt đối: 2N x 20cm = 4N x 10cm.', 'Bước 4: Dịch chuyển P2 ra xa: Đòn bẩy quay nghiêng theo chiều mômen lớn hơn.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 19: Đòn bẩy và Tác dụng làm quay của lực', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khối lượng quả cân & Khoảng cách cánh tay đòn', false, undefined,
    ['Lực F1, F2 (N)', 'Cánh tay đòn d1, d2 (m)', 'Mômen lực M = F.d'],
    'Điều kiện cân bằng mômen lực: Σ M = 0 quanh trục quay.'
  ),
  createItem(
    78, 'sim-thcs-08', 'Sự truyền nhiệt & Dòng đối lưu trong chất lỏng',
    'Trực quan hóa dòng đối lưu: Nước nóng ở đáy nở ra nhẹ bốc lên, nước lạnh ở trên nặng chìm xuống tạo vòng tuần hoàn.',
    ['Bước 1: Đặt vài hạt thuốc tím KMnO4 xuống đáy ống nghiệm chứa nước.', 'Bước 2: Dùng ngọn đèn cồn hơ nóng đúng phần đáy có thuốc tím.', 'Bước 3: Quan sát các dòng màu tím mang nước nóng cuộn thẳng đứng lên mặt nước.', 'Bước 4: Tại mặt nước, dòng nước tím tản ra hai bên và chìm xuống đáy theo chu kỳ.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 28: Sự truyền nhiệt và Đối lưu', 'SGK Kết nối tri thức',
    'thcs', 'pattern-particle-sandbox', 'Dòng đối lưu nhiệt của phân tử chất lỏng', false, undefined,
    ['Nhiệt độ đáy ống (°C)', 'Vận tốc dòng đối lưu'],
    'Đối lưu là hình thức truyền nhiệt chủ yếu trong chất lưu nhờ chênh lệch khối lượng riêng do nhiệt.'
  ),
  createItem(
    79, 'sim-thcs-09', 'Tán sắc ánh sáng qua lăng kính tam giác Newton',
    'Phân tích chùm ánh sáng trắng qua lăng kính quang học và hợp dải 7 màu trở lại thành ánh sáng trắng bằng lăng kính đảo ngược.',
    ['Bước 1: Chiếu chùm sáng trắng hẹp qua lăng kính tam giác bằng thủy tinh crown.', 'Bước 2: Đo góc lệch của tia Đỏ (nhỏ nhất) và tia Tím (lớn nhất) trên màn ảnh.', 'Bước 3: Đặt một lăng kính thứ hai cùng loại ngược chiều chắn ngang dải 7 màu.', 'Bước 4: Quan sát chùm sáng sau khi qua lăng kính thứ hai tổng hợp lại thành ánh sáng trắng.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 6: Tán sắc ánh sáng và Màu sắc', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc tới i1 & Chiết suất n(λ)', false, undefined,
    ['Bước sóng λ', 'Chiết suất lăng kính n', 'Góc lệch D'],
    'Ánh sáng trắng là tập hợp của vô số ánh sáng đơn sắc có bước sóng liên tục từ đỏ đến tím.'
  ),
  createItem(
    80, 'sim-thcs-10', 'Phản ứng trung hòa Axit - Bazơ (HCl + NaOH)',
    'Quan sát sự đổi màu của chỉ thị phenolphtalein khi chuẩn độ: Dung dịch bazơ mất màu hồng khi đạt điểm trung hòa pH = 7.',
    ['Bước 1: Rót 20ml dung dịch NaOH 0.1M vào bình nón và nhỏ 2 giọt phenolphtalein (dung dịch có màu hồng cánh sen).', 'Bước 2: Mở khóa buret nhỏ từng giọt dung dịch axit HCl 0.1M vào bình nón.', 'Bước 3: Lắc đều bình và theo dõi giá trị pH giảm dần từ 13 về 7.', 'Bước 4: Đúng giọt HCl làm pH = 7: Màu hồng cánh sen biến mất hoàn toàn thành không màu.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 11: Axit, Bazơ và Phản ứng trung hòa', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Thể tích axit nhỏ giọt & Đường cong pH', false, undefined,
    ['Thể tích HCl (ml)', 'Giá trị pH dung dịch', 'Màu chất chỉ thị'],
    'Bản chất phản ứng trung hòa: H⁺ + OH⁻ -> H2O giải phóng năng lượng liên kết.'
  ),
  createItem(
    81, 'sim-thcs-11', 'Quang hợp ở rong đuôi chó giải phóng khí O2',
    'Chứng minh quang hợp tạo ra khí oxy: Càng đưa đèn lại gần thì số bọt khí oxy thoát ra từ cành rong càng nhiều.',
    ['Bước 1: Đặt cành rong đuôi chó vào ống nghiệm ngập nước úp ngược trong phễu thủy tinh.', 'Bước 2: Chiếu đèn sợi đốt cách cành rong 50cm: Đếm được 10 bọt khí/phút.', 'Bước 3: Dịch chuyển đèn lại gần cách 10cm: Số bọt khí tăng vọt lên 45 bọt khí/phút.', 'Bước 4: Đưa que đóm còn tàn đỏ vào miệng ống nghiệm: Que đóm bùng cháy sáng (chứng minh có khí O2).'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 21: Quang hợp ở thực vật', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khoảng cách nguồn sáng & Tốc độ sủi bọt khí', false, undefined,
    ['Cường độ ánh sáng (Lux)', 'Tốc độ thoát bọt khí O2'],
    'Phương trình quang hợp: 6CO2 + 6H2O + Quang năng -> C6H12O6 + 6O2.'
  ),
  createItem(
    82, 'sim-thcs-12', 'Từ phổ & Đường sức từ của nam châm chữ U',
    'Rắc mạt sắt xung quanh nam châm chữ U và gõ nhẹ để thấy các đường cong từ phổ nối liền cực Bắc (N) sang cực Nam (S).',
    ['Bước 1: Đặt tấm kính trong suốt lên trên thanh nam châm hình chữ U.', 'Bước 2: Rắc đều một lớp mạt sắt mỏng lên bề mặt kính.', 'Bước 3: Gõ nhẹ vào mép kính: Các hạt mạt sắt tự xoay và sắp xếp thành các đường cong cong đều đặn.', 'Bước 4: Trong lòng chữ U: Các đường sức từ gần như song song đều nhau (từ trường đều).'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 18: Từ trường và Đường sức từ', 'SGK Kết nối tri thức',
    'thcs', 'pattern-particle-sandbox', 'Hạt mạt sắt tự sắp xếp theo từ trường', false, undefined,
    ['Cường độ từ trường B', 'Chiều đường sức từ (Ra Bắc vào Nam)'],
    'Mỗi hạt mạt sắt bị từ hóa trở thành một nam châm nhỏ tự sắp xếp dọc theo véc-tơ cảm ứng từ B.'
  ),
  createItem(
    83, 'sim-thcs-13', 'Giao thoa & Cộng hưởng sóng âm trong ống khí',
    'Tìm các điểm bụng sóng và nút sóng âm bằng cách điều chỉnh mực nước trong ống cộng hưởng khi đặt âm thoa ở miệng ống.',
    ['Bước 1: Đặt một âm thoa có tần số f = 512 Hz đang dao động ngay phía trên miệng ống thủy tinh.', 'Bước 2: Từ từ hạ thấp mực nước trong ống để thay đổi chiều dài cột không khí.', 'Bước 3: Tại chiều dài L = 16.5cm: Âm thanh phát ra đột ngột vang to cực đại (hiện tượng cộng hưởng).', 'Bước 4: Tiếp tục hạ nước đến L = 49.5cm: Xuất hiện đỉnh cộng hưởng thứ hai.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 14: Sóng âm và Sự cộng hưởng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Mực nước trong ống & Cường độ âm thanh (dB)', false, undefined,
    ['Chiều dài cột khí L (cm)', 'Bước sóng âm λ', 'Tần số cộng hưởng'],
    'Cộng hưởng sóng dừng trong ống một đầu bịt kín: L = (2k + 1) * λ / 4.'
  ),
  createItem(
    84, 'sim-thcs-14', 'Chưng cất phân đoạn hỗn hợp rượu và nước',
    'Tách hai chất lỏng tan vào nhau dựa trên nhiệt độ sôi khác biệt: Rượu sôi ở 78.3°C bay hơi trước, nước sôi ở 100°C ở lại.',
    ['Bước 1: Rót hỗn hợp nước và cồn 40° vào bình cầu có gắn nhiệt kế và ống sinh hàn.', 'Bước 2: Bật ngọn lửa đèn cồn đun sôi hỗn hợp từ từ.', 'Bước 3: Theo dõi nhiệt kế dừng lại ở 78.3°C: Hơi rượu bốc lên gặp ống sinh hàn ngưng tụ thành giọt cồn nguyên chất.', 'Bước 4: Khi rượu bay hơi hết, nhiệt kế mới tiếp tục tăng vọt lên 100°C.'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 16: Tách chất bằng phương pháp chưng cất', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Nhiệt độ chưng cất & Lượng cồn ngưng tụ', false, undefined,
    ['Nhiệt độ sôi rượu (78.3°C)', 'Nhiệt độ sôi nước (100°C)', 'Độ cồn thu được'],
    'Tách chất dựa trên độ bay hơi và áp suất hơi bão hòa khác nhau của các cấu tử ở cùng áp suất.'
  ),
  createItem(
    85, 'sim-thcs-15', 'Mô hình xoắn kép ADN & Phiên mã mARN',
    'Tương tác lắp ghép 4 loại nucleotide theo nguyên tắc bổ sung A - T, G - X và cơ chế tổng hợp chuỗi mARN bổ sung.',
    ['Bước 1: Kéo các nucleotide tự do A, T, G, X vào mạch khuôn ADN.', 'Bước 2: Kiểm tra nguyên tắc bổ sung: Adenin chỉ liên kết với Timin (2 liên kết H), Guanin với Xitôzin (3 liên kết H).', 'Bước 3: Kích hoạt enzyme ARN polimeraza trượt dọc gen để phiên mã.', 'Bước 4: Mạch mARN tách ra mang bộ ba mã sao đi ra tế bào chất.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 39: Cấu trúc ADN và Quá trình phiên mã', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Lắp ghép nucleotide A-T-G-X', false, undefined,
    ['Trình tự nucleotide', 'Số liên kết hydro', 'Mã di truyền codon'],
    'Nguyên tắc bổ sung hình thành liên kết hydro đặc thù đảm bảo truyền đạt chính xác thông tin di truyền.'
  ),
  createItem(
    86, 'sim-thcs-16', 'Điện trở phụ thuộc chiều dài, tiết diện và vật liệu',
    'Kiểm chứng công thức R = ρ.l / S: Tăng chiều dài dây gấp đôi làm R tăng gấp đôi; tăng tiết diện gấp đôi làm R giảm một nửa.',
    ['Bước 1: Mắc đoạn dây Nikelin dài l = 1m, tiết diện S = 0.1 mm² vào mạch điện.', 'Bước 2: Đo điện trở R1 = 4.4 Ω.', 'Bước 3: Thay bằng đoạn dây dài l = 2m cùng loại: Điện trở tăng lên đúng 8.8 Ω.', 'Bước 4: Thay bằng đoạn dây có tiết diện S = 0.2 mm²: Điện trở giảm còn 4.4 Ω.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 24: Điện trở của dây dẫn', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Chiều dài l & Tiết diện S của dây dẫn', false, undefined,
    ['Chiều dài l (m)', 'Tiết diện S (mm²)', 'Điện trở suất ρ', 'Điện trở R (Ω)'],
    'Điện trở xuất phát từ xác suất va chạm của electron với các ion mạng tinh thể dọc theo chiều dài.'
  ),
  createItem(
    87, 'sim-thcs-17', 'Sự nhiễm điện do cọ xát & Điện nghiệm lá kim loại',
    'Khảo sát tĩnh điện học: Đưa thanh thủy tinh cọ xát vào lụa lại gần quả cầu điện nghiệm làm hai lá kim loại xòe rộng.',
    ['Bước 1: Cọ xát thanh thủy tinh vào mảnh lụa để thanh nhiễm điện dương.', 'Bước 2: Chạm thanh thủy tinh vào núm kim loại của điện nghiệm.', 'Bước 3: Điện tích truyền xuống hai lá nhôm mỏng phía dưới: Hai lá mang điện cùng dấu đẩy nhau xòe ra.', 'Bước 4: Dùng ngón tay chạm vào núm kim loại: Điện tích truyền xuống đất, hai lá nhôm lập tức khép lại.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 20: Hiện tượng nhiễm điện', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Cọ xát thanh thủy tinh & Góc xòe lá nhôm', false, undefined,
    ['Lượng điện tích truyền', 'Góc xòe của hai lá kim loại'],
    'Định luật Coulomb: Hai điện tích cùng dấu đẩy nhau bằng lực tỷ lệ thuận với tích độ lớn điện tích.'
  ),
  createItem(
    88, 'sim-thcs-18', 'Khảo sát hệ số ma sát trượt và ma sát lăn',
    'Kéo khối gỗ trượt trên bàn có gắn lực kế: So sánh lực ma sát trượt với lực ma sát lăn khi đặt thêm các con lăn bên dưới.',
    ['Bước 1: Đặt khối gỗ nặng 500g lên mặt bàn và móc lực kế vào đầu khối gỗ.', 'Bước 2: Kéo lực kế chuyển động đều: Lực kế chỉ lực ma sát trượt F_trượt = 1.5N.', 'Bước 3: Đặt 3 chiếc bút chì tròn xuống dưới làm con lăn.', 'Bước 4: Kéo chuyển động đều: Lực kế giảm vọt chỉ còn F_lăn = 0.15N (nhỏ hơn 10 lần).'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 40: Lực ma sát và Tác dụng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Lực kéo & Hệ số ma sát trượt/lăn', false, undefined,
    ['Áp lực N (N)', 'Hệ số ma sát μ', 'Lực ma sát F_ms (N)'],
    'Ma sát lăn nhỏ hơn ma sát trượt nhiều lần nhờ triệt tiêu sự trượt bề mặt vi mô.'
  ),
  createItem(
    89, 'sim-thcs-19', 'Khúc xạ qua bản mặt song song & Độ dời ngang',
    'Chiếu tia laser xiên góc qua bản thủy tinh hai mặt song song: Tia ló truyền song song với tia tới nhưng bị dời một đoạn e.',
    ['Bước 1: Chiếu tia laser đỏ với góc tới i = 45° vào mặt trước bản thủy tinh dày d = 5cm.', 'Bước 2: Quan sát tia khúc xạ bị bẻ cong lại gần pháp tuyến trong thủy tinh.', 'Bước 3: Tại mặt sau, tia sáng khúc xạ ra không khí bị bẻ gập góc bằng đúng góc tới i = 45°.', 'Bước 4: Đo độ dời ngang e giữa tia ló và đường kéo dài của tia tới.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 5: Khúc xạ ánh sáng qua bản thủy tinh', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc tới i & Bề dày bản song song d', false, undefined,
    ['Bề dày d (cm)', 'Chiết suất n', 'Độ dời ngang e (cm)'],
    'Do hai mặt phân cách song song, góc khúc xạ ở mặt trước bằng góc tới ở mặt sau nên tia ló song song tia tới.'
  ),
  createItem(
    90, 'sim-thcs-20', 'Phương trình cân bằng nhiệt (Q tỏa = Q thu)',
    'Thả miếng đồng nóng 100°C vào cốc nước lạnh 20°C: Đo nhiệt độ cân bằng t_cb và kiểm chứng bảo toàn năng lượng nhiệt.',
    ['Bước 1: Cân miếng đồng m1 = 200g, đun nóng trong nước sôi đến 100°C.', 'Bước 2: Cân cốc nước m2 = 300g ở nhiệt độ ban đầu t2 = 20°C.', 'Bước 3: Thả nhanh miếng đồng vào cốc nước và khuấy đều bằng nhiệt kế.', 'Bước 4: Nhiệt kế dừng lại ở nhiệt độ cân bằng t_cb = 24.8°C; tính Q_tỏa = Q_thu.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 29: Nhiệt lượng và Cân bằng nhiệt', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khối lượng chất & Nhiệt độ ban đầu', false, undefined,
    ['Nhiệt dung riêng c1, c2', 'Nhiệt độ cân bằng t_cb (°C)', 'Nhiệt lượng Q (J)'],
    'Định luật bảo toàn năng lượng: Tổng nhiệt lượng các vật nóng tỏa ra bằng tổng nhiệt lượng các vật lạnh thu vào.'
  ),
  createItem(
    91, 'sim-thcs-21', 'Tác dụng nhiệt & Tác dụng phát sáng của dòng điện',
    'Khảo sát dòng điện chạy qua dây mayso làm dây nóng đỏ và làm nổ dây chì bảo vệ khi xảy ra đoản mạch (ngắn mạch).',
    ['Bước 1: Mắc đoạn dây mayso vào nguồn điện có cầu chì bảo vệ.', 'Bước 2: Tăng dần hiệu điện thế U: Dây mayso ấm lên rồi phát ra ánh sáng đỏ rực.', 'Bước 3: Chạm trực tiếp hai đầu dây nối gây đoản mạch (ngắn mạch): Dòng điện tăng vọt.', 'Bước 4: Dây chì trong cầu chì lập tức nóng chảy đứt đoạn bảo vệ mạch điện an toàn.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 22: Tác dụng nhiệt và phát sáng của dòng điện', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Cường độ dòng điện & Nhiệt độ dây mayso', false, undefined,
    ['Dòng điện I (A)', 'Nhiệt lượng Jun - Len-xơ Q = I².R.t', 'Nhiệt độ nóng chảy dây chì'],
    'Năng lượng điện trường truyền cho electron va chạm biến thành nhiệt năng của mạng tinh thể kim loại.'
  ),
  createItem(
    92, 'sim-thcs-22', 'Tác dụng từ của ống dây có dòng điện (Nam châm điện)',
    'Khảo sát từ trường của cuộn dây có lõi sắt: Tăng số vòng dây và dòng điện làm lực hút đinh sắt tăng lên vượt trội.',
    ['Bước 1: Quấn 100 vòng dây đồng quanh một đinh sắt lớn tạo thành nam châm điện.', 'Bước 2: Cấp dòng điện I = 1A: Nam châm điện hút được 5 chiếc kẹp giấy.', 'Bước 3: Tăng dòng điện lên I = 3A: Số kẹp giấy bị hút tăng lên 18 chiếc.', 'Bước 4: Ngắt công tắc điện: Toàn bộ kẹp giấy lập tức rơi rụng xuống đất.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 19: Nam châm điện và Ứng dụng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Số vòng dây N & Dòng điện I (Ampe)', false, undefined,
    ['Số vòng dây N', 'Dòng điện I (A)', 'Lực hút từ F_từ (N)'],
    'Từ trường trong lòng ống dây tỷ lệ thuận với mật độ vòng dây và cường độ dòng điện B = μ.μ0.n.I.'
  ),
  createItem(
    93, 'sim-thcs-23', 'Hiện tượng cảm ứng điện từ khi ngắt mạch',
    'Khám phá dòng điện cảm ứng xuất hiện trong cuộn dây phụ khi đóng hoặc ngắt dòng điện trong cuộn dây sơ cấp.',
    ['Bước 1: Lồng cuộn dây sơ cấp A vào trong lòng cuộn dây thứ cấp B có nối điện kế G.', 'Bước 2: Đóng công tắc mạch cuộn A: Kim điện kế G lệch sang phải rồi trở về 0.', 'Bước 3: Giữ dòng điện ổn định trong cuộn A: Kim điện kế G đứng yên ở vạch số 0.', 'Bước 4: Ngắt công tắc mạch cuộn A: Kim điện kế G lệch sang trái dứt khoát.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 14: Hiện tượng cảm ứng điện từ', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Khoảnh khắc đóng/ngắt công tắc', false, undefined,
    ['Độ biến thiên từ thông dΦ/dt', 'Suất điện động cảm ứng'],
    'Dòng điện cảm ứng chỉ sinh ra khi có sự biến thiên từ thông gửi qua tiết diện cuộn dây kín.'
  ),
  createItem(
    94, 'sim-thcs-24', 'Phản ứng kim loại sắt Fe với dung dịch CuSO4',
    'Thí nghiệm kim loại mạnh đẩy kim loại yếu: Đinh sắt sáng bóng nhúng vào dung dịch đồng sunfat xanh lam bám lớp đồng đỏ.',
    ['Bước 1: Rót 10ml dung dịch CuSO4 màu xanh lam vào ống nghiệm.', 'Bước 2: Thả một chiếc đinh sắt đã cạo sạch gỉ vào ống nghiệm.', 'Bước 3: Sau 5 phút: Lớp kim loại đồng Cu màu đỏ bám phủ kín bề mặt đinh sắt.', 'Bước 4: Màu xanh lam của dung dịch nhạt dần do Fe tan ra tạo dung dịch FeSO4.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 15: Dãy hoạt động hóa học của kim loại', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Thời gian phản ứng & Lớp đồng bám', false, undefined,
    ['Thế oxy hóa khử', 'Phương trình: Fe + CuSO4 -> FeSO4 + Cu'],
    'Kim loại có tính khử mạnh hơn (Fe) cho electron cho ion kim loại có tính oxy hóa mạnh hơn (Cu²⁺).'
  ),
  createItem(
    95, 'sim-thcs-25', 'Điều chế & Thu khí Hydro H2 bằng đẩy nước',
    'Phản ứng giữa kẽm Zn và axit clohidric HCl; thu khí hydro nhẹ không tan trong nước bằng phương pháp dời chỗ nước.',
    ['Bước 1: Cho vài viên kẽm Zn vào bình tam giác chứa dung dịch axit HCl.', 'Bước 2: Khí H2 sủi bọt thoát ra mãnh liệt dẫn qua ống dẫn thủy tinh.', 'Bước 3: Úp ngược ống nghiệm chứa đầy nước vào chậu nước để hứng bọt khí H2 dâng lên.', 'Bước 4: Bịt miệng ống nghiệm chứa đầy khí H2 rồi đốt trên ngọn lửa: Nghe tiếng nổ "bốp" nhỏ giòn tan.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 10: Điều chế khí Hydro và Khí Oxy', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Lắp ráp hệ ống nghiệm thu khí đẩy nước', false, undefined,
    ['Lượng khí H2 sinh ra (ml)', 'Độ tinh khiết khí Hydro'],
    'Khí hydro nhẹ nhất trong các chất khí (d = 2/29) và rất ít tan trong nước nên thu được bằng đẩy nước.'
  ),
  createItem(
    96, 'sim-thcs-26', 'Sự thăng hoa và ngưng kết của Tinh thể Iot',
    'Quan sát chất rắn chuyển thẳng thành chất khí không qua trạng thái lỏng: Tinh thể Iot tím bốc hơi tím ngắt rồi kết tinh lại.',
    ['Bước 1: Đặt vài mảnh tinh thể Iot màu tím đen vào đáy bình nón.', 'Bước 2: Đặt một bình cầu đáy tròn chứa nước đá lạnh lên trên miệng bình nón.', 'Bước 3: Hơ nhẹ đáy bình nón: Iot rắn bốc hơi tím ngắt cuộn tròn trong bình.', 'Bước 4: Gặp đáy bình lạnh, hơi Iot ngưng kết trực tiếp thành các tinh thể tím lấp lánh hình kim.'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 10: Sự chuyển thể của các chất', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Nhiệt độ đáy bình & Khối lượng tinh thể ngưng kết', false, undefined,
    ['Nhiệt độ thăng hoa', 'Trạng thái Rắn -> Khí -> Rắn'],
    'Hiện tượng thăng hoa xảy ra khi áp suất hơi bão hòa của pha rắn đạt bằng áp suất khí quyển trước điểm nóng chảy.'
  ),
  createItem(
    97, 'sim-thcs-27', 'Đo tiêu cự thấu kính phân kỳ bằng hệ ghép',
    'Khắc phục vấn đề thấu kính phân kỳ luôn cho ảnh ảo: Ghép với thấu kính hội tụ để tạo ảnh thật trên màn chắn hứng được.',
    ['Bước 1: Bố trí thấu kính hội tụ L1 tạo ảnh thật sắc nét S1\' trên màn chắn.', 'Bước 2: Chèn thấu kính phân kỳ L2 vào giữa L1 và màn chắn.', 'Bước 3: Dịch chuyển màn chắn lùi ra xa để hứng lại ảnh thật rõ nét S2\'.', 'Bước 4: Áp dụng công thức thấu kính tính ra tiêu cự f2 âm của thấu kính phân kỳ.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 7: Thấu kính phân kỳ và Phương pháp đo tiêu cự', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Vị trí 2 thấu kính & Màn chắn', false, undefined,
    ['Khoảng cách vật thật d', 'Khoảng cách ảnh thật d\'', 'Tiêu cự thấu kính phân kỳ f < 0'],
    'Ảnh thật của thấu kính hội tụ đóng vai trò là vật ảo đối với thấu kính phân kỳ đặt phía sau.'
  ),
  createItem(
    98, 'sim-thcs-28', 'Chuyển hóa quang năng thành hóa năng trong lục lạp',
    'Mô phỏng chuỗi truyền electron trên màng thylakoid: Năng lượng photon kích thích hạt diệp lục quang phân ly nước.',
    ['Bước 1: Chiếu chùm photon ánh sáng vào phức hệ quang hợp Photosystem II.', 'Bước 2: Diệp lục hấp thụ năng lượng giải phóng electron năng lượng cao.', 'Bước 3: Phân tử nước bị bẻ gãy giải phóng proton H+ vào xoang và khí O2 bay ra.', 'Bước 4: Bơm proton ATP Synthase quay tròn tổng hợp các phân tử năng lượng ATP và NADPH.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 22: Cơ chế quang hợp ở tế bào thực vật', 'SGK Kết nối tri thức',
    'thcs', 'pattern-particle-sandbox', 'Dòng hạt photon & Bơm proton ATP Synthase', false, undefined,
    ['Bước sóng ánh sáng hấp thụ (430nm, 660nm)', 'Lượng ATP tạo thành'],
    'Quang năng được tích lũy dưới dạng liên kết hóa học cao năng trong phân tử ATP và NADPH.'
  ),
  createItem(
    99, 'sim-thcs-29', 'Di truyền Men-đen: Lai một cặp tính trạng',
    'Thực nghiệm quy luật phân ly: Lai đậu Hà Lan hoa đỏ thuần chủng với hoa trắng, đời F1 100% đỏ, đời F2 tỷ lệ 3 đỏ : 1 trắng.',
    ['Bước 1: Cho giao phấn giữa cây hoa đỏ đồng hợp (AA) và hoa trắng (aa).', 'Bước 2: Thu hoạch thế hệ F1: 100% cây con mang kiểu gen dị hợp (Aa) đều nở hoa đỏ.', 'Bước 3: Cho các cây F1 tự thụ phấn tạo ra 1000 hạt thế hệ F2.', 'Bước 4: Thống kê kết quả: 752 cây hoa đỏ và 248 cây hoa trắng (tỉ lệ xấp xỉ 3:1).'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 36: Di truyền học Men-đen', 'SGK Kết nối tri thức',
    'thcs', 'pattern-poe-challenge', 'Dự đoán tỉ lệ kiểu hình đời F2', false, undefined,
    ['Alen trội A, Alen lặn a', 'Tỉ lệ kiểu gen 1AA:2Aa:1aa', 'Tỉ lệ kiểu hình 3:1'],
    'Quy luật phân ly: Mỗi tính trạng do một cặp nhân tố di truyền quy định, phân ly đồng đều vào các giao tử.'
  ),
  createItem(
    100, 'sim-thcs-30', 'Động cơ điện một chiều DC & Lực từ Lorentz',
    'Khảo sát nguyên lý quay của khung dây dẫn mang dòng điện đặt trong từ trường: Hai cạnh đối diện chịu hai lực từ ngược chiều.',
    ['Bước 1: Đặt khung dây đồng hình chữ nhật giữa hai cực Bắc - Nam của nam châm.', 'Bước 2: Cấp dòng điện DC qua cổ góp chổi than vào khung dây.', 'Bước 3: Quy tắc bàn tay trái: Lực từ tác dụng lên cạnh trái hướng lên, cạnh phải hướng xuống.', 'Bước 4: Cặp lực ngẫu lực từ làm khung dây quay tít đều đặn quanh trục.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 16: Động cơ điện một chiều', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Dòng điện I & Tốc độ quay của động cơ (RPM)', false, undefined,
    ['Cảm ứng từ B (Tesla)', 'Dòng điện I (A)', 'Mômen lực từ M (N.m)'],
    'Lực từ Ampere F = I.B.l.sin(α) tác dụng lên các cạnh đối diện của khung dây sinh ngẫu lực quay.'
  ),
  createItem(
    101, 'sim-thcs-31', 'Đo công & Công suất kéo vật lên dốc',
    'Tính toán công cơ học A = F.s và công suất P = A / t khi kéo một vật nặng lên mặt phẳng nghiêng trong các khoảng thời gian khác nhau.',
    ['Bước 1: Dùng lực kế kéo khối gỗ nặng 2kg lên dốc nghiêng dài 1.2m với lực kéo F = 12N.', 'Bước 2: Kéo chậm trong thời gian t1 = 6 giây -> Công A = 14.4 J, Công suất P1 = 2.4 W.', 'Bước 3: Kéo nhanh cùng khối gỗ trong thời gian t2 = 2 giây.', 'Bước 4: Công A vẫn giữ nguyên 14.4 J, nhưng công suất tăng vọt lên P2 = 7.2 W.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 17: Công cơ học và Công suất', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Thời gian kéo vật & Công suất đạt được (Watt)', false, undefined,
    ['Công thực hiện A (J)', 'Thời gian t (s)', 'Công suất P (W)'],
    'Công suất là tốc độ thực hiện công của một lực hay một cỗ máy trong một đơn vị thời gian.'
  ),
  createItem(
    102, 'sim-thcs-32', 'Hiện tượng phản xạ toàn phần trong sợi quang học',
    'Tìm góc khúc xạ tới hạn i_gh: Khi góc tới i > i_gh thì ánh sáng không ló ra ngoài mà bị phản xạ 100% bên trong lõi sợi quang.',
    ['Bước 1: Chiếu tia laser từ trong khối bán nguyệt thủy tinh (n = 1.5) ra không khí (n = 1.0).', 'Bước 2: Tăng dần góc tới i từ 0° lên 40°: Tia khúc xạ bẻ sát mặt phân cách.', 'Bước 3: Tại góc tới hạn i_gh = arcsin(1/1.5) = 41.8°: Tia khúc xạ đi là là mặt phân cách.', 'Bước 4: Tăng i = 45°: Toàn bộ chùm tia bị phản xạ ngược lại vào trong lòng khối thủy tinh.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 8: Hiện tượng phản xạ toàn phần', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc tới i & Cường độ tia phản xạ/khúc xạ', false, undefined,
    ['Góc giới hạn i_gh', 'Chiết suất tỉ đối n21', 'Cáp quang truyền dữ liệu'],
    'Khi ánh sáng truyền từ môi trường chiết quang hơn sang kém hơn và góc tới i >= i_gh, năng lượng phản xạ bảo toàn 100%.'
  ),
  createItem(
    103, 'sim-thcs-33', 'Tác dụng hóa học của dòng điện: Mạ đồng chìa khóa',
    'Điện phân dung dịch CuSO4 với cực dương bằng đồng và cực âm là chiếc chìa khóa sắt cần mạ.',
    ['Bước 1: Nối thanh đồng nguyên chất vào cực dương (+) của nguồn điện một chiều.', 'Bước 2: Nối chiếc chìa khóa sắt đã đánh bóng vào cực âm (-) của nguồn điện.', 'Bước 3: Nhúng cả hai điện cực vào bình chứa dung dịch CuSO4 và đóng mạch điện.', 'Bước 4: Sau 10 phút: Các ion Cu²⁺ chạy về cực âm nhận electron bám thành lớp đồng bóng đỏ đều trên chìa khóa.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 22: Tác dụng hóa học của dòng điện', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Thời gian mạ & Bề dày lớp đồng bám', false, undefined,
    ['Dòng điện I (A)', 'Khối lượng m = k.I.t (Định luật Faraday)'],
    'Sự chuyển dời có hướng của ion dương về catot và ion âm về anot trong dung dịch điện phân.'
  ),
  createItem(
    104, 'sim-thcs-34', 'Phản ứng vôi sống CaO với nước tỏa nhiệt sôi',
    'Thí nghiệm hóa học tỏa nhiệt mãnh liệt: Thả cục vôi sống CaO vào bát nước thấy nước sôi sùng sục và bốc khói mù mịt.',
    ['Bước 1: Đặt cục vôi sống canxi oxit CaO trắng tinh vào bát sứ chịu nhiệt có cắm nhiệt kế.', 'Bước 2: Nhỏ vài ml nước lọc vào cục vôi sống.', 'Bước 3: Sau vài giây: Cục vôi nở bung thành bột nhuyễn vôi tôi Ca(OH)2.', 'Bước 4: Nhiệt độ vọt lên trên 100°C làm nước sôi sùng sục bốc hơi nghi ngút.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 12: Oxit và Phản ứng tỏa nhiệt', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Lượng nước thêm vào & Nhiệt độ phản ứng', false, undefined,
    ['Nhiệt lượng tỏa ra ΔH < 0', 'Phương trình: CaO + H2O -> Ca(OH)2'],
    'Năng lượng giải phóng từ việc tạo liên kết mới trong tinh thể Ca(OH)2 lớn hơn năng lượng bẻ gãy liên kết ban đầu.'
  ),
  createItem(
    105, 'sim-thcs-35', 'Khí CO2 làm đục nước vôi trong Ca(OH)2',
    'Thổi hơi thở vào cốc nước vôi trong để kiểm tra sản phẩm hô hấp: Khí carbon dioxide tạo kết tủa canxi cacbonat trắng đục.',
    ['Bước 1: Rót dung dịch nước vôi trong suốt Ca(OH)2 vào cốc thủy tinh.', 'Bước 2: Cầm ống hút thổi hơi thở đều đặn vào đáy cốc.', 'Bước 3: Sau 30 giây: Cốc nước chuyển từ trong suốt sang vẩn đục như nước vo gạo.', 'Bước 4: Tiếp tục thổi khí CO2 dư kéo dài: Kết tủa tan dần trở lại thành dung dịch trong suốt Ca(HCO3)2.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 13: Muối và Sự tạo kết tủa', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Thời gian sục khí CO2 & Độ đục dung dịch', false, undefined,
    ['Kết tủa CaCO3', 'Phản ứng tan kết tủa: CaCO3 + CO2 + H2O -> Ca(HCO3)2'],
    'Phản ứng đặc trưng nhận biết khí CO2: CO2 + Ca(OH)2 -> CaCO3↓ + H2O.'
  ),
  createItem(
    106, 'sim-thcs-36', 'Đo áp suất rễ cây đẩy nước lên cao (Hiện tượng ứ giọt)',
    'Quan sát hiện tượng ứ giọt mép lá vào ban đêm khi độ ẩm không khí bão hòa và áp suất rễ chủ động đẩy nước lên ngọn.',
    ['Bước 1: Cắt ngang thân một cây cà chua non đang sinh trưởng mạnh trong chậu.', 'Bước 2: Dùng ống cao su nối chặt vết cắt thân cây với một ống thủy tinh dựng đứng.', 'Bước 3: Đặt cây trong phòng tối ẩm ướt qua đêm.', 'Bước 4: Sáng hôm sau: Cột nước trong ống thủy tinh dâng cao 50cm do áp suất rễ bơm đẩy liên tục.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 24: Vận chuyển các chất trong cây', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Thời gian đo áp suất rễ qua đêm', false, undefined,
    ['Chiều cao cột nước dâng', 'Áp suất thẩm thấu rễ cây'],
    'Cơ chế hấp thụ chủ động ion khoáng vào mạch gỗ tạo gradien thẩm thấu hút nước từ đất vào rễ.'
  ),
  createItem(
    107, 'sim-thcs-37', 'Nhịp tim & Đo huyết áp bằng huyết áp kế',
    'Khảo sát chu kỳ hoạt động của tim (0.8s) và thực hành đo huyết áp tâm thu (tối đa) và huyết áp tâm trương (tối thiểu).',
    ['Bước 1: Quấn bao cao su của huyết áp kế quanh bắp tay người được đo.', 'Bước 2: Bóp bóng bơm khí căng đến áp suất 160 mmHg để chặn động mạch cánh tay.', 'Bước 3: Xả van khí từ từ kết hợp đặt ống nghe dưới bao quấn.', 'Bước 4: Nghe tiếng đập Korotkoff đầu tiên (Huyết áp tâm thu 120 mmHg) và tiếng đập biến mất (Huyết áp tâm trương 80 mmHg).'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 30: Hệ tuần hoàn và Vệ sinh tim mạch', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Áp lực bao quấn & Tiếng đập mạch máu', false, undefined,
    ['Huyết áp tâm thu (120 mmHg)', 'Huyết áp tâm trương (80 mmHg)', 'Nhịp tim (BPM)'],
    'Sự co bóp chu kỳ của cơ tâm thất bơm máu vào động mạch chủ tạo sóng xung áp lực thủy tĩnh.'
  ),
  createItem(
    108, 'sim-thcs-38', 'Đo bước sóng âm bằng hiện tượng cộng hưởng ống Kundt',
    'Rắc bột xốp mịn vào trong ống thủy tinh kín có loa phát âm: Bột xốp dồn lại thành từng đụn đều đặn tại các nút sóng.',
    ['Bước 1: Nối máy phát âm tần số f = 1000 Hz vào loa ở một đầu ống Kundt.', 'Bước 2: Đầu kia của ống là một pít-tông di động phản xạ sóng âm.', 'Bước 3: Di chuyển pít-tông đến vị trí cộng hưởng: Bột xốp lập tức nhảy múa và tụ lại thành các đụn cố định.', 'Bước 4: Đo khoảng cách giữa hai đụn bột liền kề bằng đúng một nửa bước sóng: d = λ / 2 -> Tính vận tốc âm v = λ.f.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 11: Sóng âm và Đo bước sóng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Tần số máy phát f & Vị trí pít-tông', false, undefined,
    ['Khoảng cách hai nút sóng λ/2', 'Vận tốc truyền âm v (m/s)'],
    'Sóng dừng âm học là sự giao thoa giữa sóng âm tới và sóng âm phản xạ tạo các nút và bụng áp suất.'
  ),
  createItem(
    109, 'sim-thcs-39', 'Xác định khối lượng riêng của vật rắn bất kỳ',
    'Dùng cân đòn đo khối lượng m và bình tràn đo thể tích V để tính khối lượng riêng D = m / V của viên đá cuội gồ ghề.',
    ['Bước 1: Đặt viên đá lên đĩa cân đòn: Thăng bằng với các quả cân tổng cộng m = 78.5 gam.', 'Bước 2: Đổ nước vào ống đong chia độ đến vạch ban đầu V1 = 100 ml.', 'Bước 3: Buộc chỉ thả chìm viên đá vào ống đong: Mực nước dâng lên vạch V2 = 130 ml.', 'Bước 4: Tính thể tích viên đá V = V2 - V1 = 30 cm³ -> Khối lượng riêng D = 78.5 / 30 = 2.62 g/cm³.'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 5: Đo khối lượng và Thể tích', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Cân khối lượng & Thả vào ống đong', false, undefined,
    ['Khối lượng m (g)', 'Thể tích V (cm³)', 'Khối lượng riêng D (g/cm³)'],
    'Khối lượng riêng là đặc tính bản chất của chất cấu tạo nên vật thể, không phụ thuộc hình dạng kích thước.'
  ),
  createItem(
    110, 'sim-thcs-40', 'Sự nở dài của thanh kim loại khi nhiệt độ tăng',
    'Đo độ nở dài vi mô Δl = α.l0.Δt của thanh đồng và thanh sắt khi được đun nóng bằng ngọn lửa đèn cồn.',
    ['Bước 1: Cố định một đầu thanh đồng dài l0 = 500mm; đầu kia tì vào kim chỉ thị phóng đại cơ học.', 'Bước 2: Ghi nhận vị trí kim ở nhiệt độ phòng 25°C.', 'Bước 3: Đốt nóng đều thanh đồng bằng ngọn đèn cồn lên 125°C (tăng 100°C).', 'Bước 4: Kim chỉ thị quay góc lớn tương ứng độ dãn dài Δl = 0.85mm; thanh sắt cùng điều kiện chỉ dãn 0.60mm.'],
    'Khoa học tự nhiên 6', 'Lớp 6', 'Bài 11: Sự nở vì nhiệt của chất rắn', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Nhiệt độ đun nóng & Độ dãn dài Δl (mm)', false, undefined,
    ['Hệ số nở dài α', 'Độ biến thiên nhiệt độ Δt', 'Độ dãn dài Δl'],
    'Thế năng tương tác bất đối xứng giữa các ion mạng tinh thể làm tăng khoảng cách cân bằng khi tăng nhiệt độ.'
  ),
  createItem(
    111, 'sim-thcs-41', 'Định luật Jun - Len-xơ (Q = I².R.t)',
    'Kiểm chứng nhiệt lượng tỏa ra trên dây dẫn tỷ lệ thuận với bình phương cường độ dòng điện, điện trở và thời gian dòng chạy qua.',
    ['Bước 1: Nhúng dây điện trở R vào bình nhiệt lượng kế chứa 200g dầu hỏa có cắm nhiệt kế.', 'Bước 2: Cấp dòng điện I1 = 1A trong thời gian t = 5 phút: Nhiệt độ dầu tăng 2°C.', 'Bước 3: Tăng dòng điện gấp đôi I2 = 2A trong cùng thời gian t = 5 phút.', 'Bước 4: Nhiệt độ dầu tăng vọt lên 8°C (tăng gấp 4 lần = 2²), kiểm chứng tỉ lệ I².'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 12: Định luật Jun - Len-xơ', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Dòng điện I & Độ tăng nhiệt độ bình dầu', false, undefined,
    ['Dòng điện I (A)', 'Điện trở R (Ω)', 'Nhiệt lượng tỏa ra Q (J)'],
    'Công của lực điện trường dịch chuyển electron biến thành nhiệt năng do va chạm với mạng tinh thể kim loại.'
  ),
  createItem(
    112, 'sim-thcs-42', 'Phản ứng cháy của lưu huỳnh S trong khí Oxy',
    'So sánh sự cháy của lưu huỳnh trong không khí và trong oxy nguyên chất: Cháy trong oxy với ngọn lửa xanh biếc chói lòa.',
    ['Bước 1: Lấy một mẩu lưu huỳnh màu vàng cho vào muôi sắt đốt trên ngọn lửa đèn cồn.', 'Bước 2: Lưu huỳnh cháy ngoài không khí với ngọn lửa màu xanh mờ nhạt.', 'Bước 3: Đưa nhanh muôi sắt vào bình chứa khí oxy O2 nguyên chất.', 'Bước 4: Lưu huỳnh bùng cháy mãnh liệt với ngọn lửa xanh biếc sáng lóa và tạo khói trắng khí SO2.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 9: Tính chất hóa học của Phi kim', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Đưa muôi lưu huỳnh vào bình Oxy', false, undefined,
    ['Nồng độ Oxy O2', 'Màu sắc ngọn lửa', 'Phương trình: S + O2 -> SO2'],
    'Nồng độ chất phản ứng tăng làm tăng tần số va chạm hiệu quả giữa các phân tử theo thuyết động học.'
  ),
  createItem(
    113, 'sim-thcs-43', 'Tính chất tẩy màu của khí Clo ẩm',
    'Chứng minh khí clo khô không tẩy màu, nhưng clo ẩm tẩy màu cánh hoa rực rỡ do sinh ra axit hipocloro HClO có tính oxy hóa cực mạnh.',
    ['Bước 1: Thả một dải giấy màu khô vào bình chứa khí clo Cl2 khô có nắp đậy kín.', 'Bước 2: Quan sát dải giấy màu giữ nguyên màu sắc ban đầu (khí clo khô không tẩy màu).', 'Bước 3: Tẩm vài giọt nước ướt dải giấy màu thứ hai rồi thả vào bình clo.', 'Bước 4: Sau vài giây dải giấy màu bị tẩy trắng tinh do phản ứng sinh ra axit HClO.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 23: Clo và Hợp chất của Clo', 'SGK Kết nối tri thức',
    'thcs', 'pattern-drag-drop', 'Thả dải giấy khô và ẩm vào bình Clo', false, undefined,
    ['Khí Cl2 ẩm', 'Axit hipocloro HClO', 'Tính oxy hóa tẩy màu'],
    'Phản ứng tự oxy hóa - khử: Cl2 + H2O <-> HCl + HClO; gốc [O] nguyên tử trong HClO phá hủy chất màu.'
  ),
  createItem(
    114, 'sim-thcs-44', 'Khảo sát gia tốc chuyển động biến đổi đều',
    'Xe trượt chạy trên máng nghiêng có gắn băng ghi thời gian: Đo khoảng cách giữa các dấu chấm để chứng minh vận tốc tăng dần đều.',
    ['Bước 1: Luồn dải băng giấy qua máy gõ thời gian (gõ 50 chấm/giây, chu kỳ T = 0.02s).', 'Bước 2: Buộc đầu băng giấy vào đuôi xe trượt và thả xe chạy xuống máng nghiêng.', 'Bước 3: Đo khoảng cách giữa các chấm liên tiếp trên băng giấy: s1, s2, s3, s4 tăng dần đều.', 'Bước 4: Hiệu khoảng cách liên tiếp Δs = a.T² = const chứng minh chuyển động có gia tốc không đổi.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 8: Đồ thị quãng đường - thời gian', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Gõ chấm thời gian thực 50Hz', false, undefined,
    ['Khoảng cách giữa các chấm', 'Gia tốc a = const', 'Đồ thị vận tốc v(t)'],
    'Chuyển động thẳng biến đổi đều có gia tốc là hằng số: s(t) = v0.t + 1/2 a.t².'
  ),
  createItem(
    115, 'sim-thcs-45', 'Cân bằng của vật rắn chịu tác dụng của 3 lực',
    'Khảo sát quy tắc hợp lực đồng quy: Ba sợi dây kéo một vòng tròn nhỏ cân bằng khi véc-tơ tổng ba lực triệt tiêu (F1 + F2 + F3 = 0).',
    ['Bước 1: Móc 3 lực kế vào một vòng khuyên nhỏ trên mặt phẳng nằm ngang.', 'Bước 2: Kéo 3 lực kế theo 3 hướng khác nhau sao cho vòng khuyên đứng yên thăng bằng.', 'Bước 3: Đọc số chỉ các lực kế F1 = 3N, F2 = 4N hợp với nhau góc 90°.', 'Bước 4: Lực kế thứ ba F3 chỉ đúng 5N và hướng ngược chiều với véc-tơ hợp lực của F1 và F2.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 18: Tác dụng của nhiều lực lên vật', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc kéo & Độ lớn 3 lực kế', false, undefined,
    ['Định lý hình bình hành lực', 'Điều kiện cân bằng Σ F = 0'],
    'Điều kiện cân bằng lực của chất điểm: Hợp lực của hai lực bất kỳ phải trực đối với lực thứ ba.'
  ),
  createItem(
    116, 'sim-thcs-46', 'Sự phản xạ âm - Tiếng vang và vật liệu cách âm',
    'Khám phá điều kiện nghe thấy tiếng vang: Âm phản xạ phải đến tai người chậm hơn âm trực tiếp ít nhất 1/15 giây (khoảng cách tối thiểu 11.3m).',
    ['Bước 1: Bạn nhỏ đứng trước vách đá dựng đứng cách xa d = 20 mét.', 'Bước 2: Hét to một tiếng "A": Âm thanh truyền đi gặp vách đá phản xạ trở lại sau t = 2d / v = 0.12s.', 'Bước 3: Tai người nghe rõ tiếng vang vọng lại sắc nét.', 'Bước 4: Ốp mút xốp tổ ong lên vách đá: Âm thanh bị hấp thụ hoàn toàn, không còn tiếng vang.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 13: Phản xạ âm và Tiếng vang', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Khoảng cách vách đá d & Thời gian trễ tiếng vang', false, undefined,
    ['Khoảng cách tối thiểu d >= 11.3m', 'Hệ số hấp thụ âm thanh'],
    'Tai người chỉ phân biệt được hai âm thanh rời rạc khi chúng cách nhau tối thiểu 0.067 giây (lưu ảnh thính giác).'
  ),
  createItem(
    117, 'sim-thcs-47', 'Khúc xạ ánh sáng & Độ sâu biểu kiến của đáy bể',
    'Giải thích tại sao nhìn xuống đáy bể bơi nước trong veo luôn có cảm giác đáy bể nông hơn độ sâu thực tế 1/3.',
    ['Bước 1: Đặt một đồng xu dưới đáy chậu nước có độ sâu thực tế h = 30cm.', 'Bước 2: Nhìn nghiêng từ không khí vào đồng xu qua mặt nước.', 'Bước 3: Quan sát chùm tia sáng khúc xạ làm đồng xu dâng lên vị trí ảnh ảo ở độ sâu biểu kiến h\'.', 'Bước 4: Kiểm chứng công thức khúc xạ gần đúng với góc nhỏ: h\' = h / n = 30 / 1.33 = 22.5cm.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 5: Hiện tượng khúc xạ ánh sáng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Góc nhìn & Độ sâu biểu kiến h\'', false, undefined,
    ['Độ sâu thực h (cm)', 'Độ sâu ảo h\' (cm)', 'Chiết suất nước n = 4/3'],
    'Tia sáng từ đáy bể bị khúc xạ bẻ gãy xa pháp tuyến khi ra không khí làm giao điểm tia ảo dâng cao.'
  ),
  createItem(
    118, 'sim-thcs-48', 'Phân giải tinh bột bằng enzim amilaza trong nước bọt',
    'Thí nghiệm tiêu hóa hóa học: Enzim amilaza cắt tinh bột thành đường mantozo; thử bằng dung dịch Iot mất màu xanh tím.',
    ['Bước 1: Chuẩn bị hai ống nghiệm chứa hồ tinh bột: Ống A thêm nước bọt; Ống B thêm nước lọc.', 'Bước 2: Đặt cả hai ống vào nồi cách thủy ấm 37°C trong 15 phút.', 'Bước 3: Nhỏ vài giọt dung dịch thuốc thử Iot vào cả hai ống.', 'Bước 4: Ống B chuyển màu xanh tím đặc trưng của tinh bột; Ống A không đổi màu vì tinh bột đã bị thủy phân thành đường.'],
    'Khoa học tự nhiên 8', 'Lớp 8', 'Bài 31: Hệ tiêu hóa và Dinh dưỡng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Thời gian ủ enzym 15 phút ở 37°C', false, undefined,
    ['Enzym amilaza', 'Nhiệt độ tối ưu 37°C', 'Thuốc thử tinh bột Iot'],
    'Enzyme sinh học xúc tác đặc hiệu bẻ gãy liên kết alpha-1,4-glicozit ở nhiệt độ thân nhiệt thích hợp.'
  ),
  createItem(
    119, 'sim-thcs-49', 'Cảm ứng ở thực vật: Tính hướng sáng và hướng trọng lực',
    'Quan sát hạt đậu nảy mầm đặt nằm ngang: Rễ luôn bẻ góc 90° đâm thẳng xuống đất, chồi uốn cong vươn thẳng lên trời.',
    ['Bước 1: Gieo hạt đậu nảy mầm trong hộp tối trên khay thạch nằm ngang.', 'Bước 2: Quay ngang thân hạt đậu 90° để rễ và chồi nằm song song mặt đất.', 'Bước 3: Tua thời gian trôi qua 24 giờ trong bóng tối hoàn toàn.', 'Bước 4: Rễ cây uốn cong chuẩn xác 90° hướng xuống tâm Trái Đất; thân chồi uốn cong 90° hướng thẳng lên trên.'],
    'Khoa học tự nhiên 7', 'Lớp 7', 'Bài 33: Cảm ứng ở thực vật', 'SGK Kết nối tri thức',
    'thcs', 'pattern-time-control', 'Tua thời gian 24 giờ uốn cong sinh trưởng', false, undefined,
    ['Hướng trọng lực g', 'Hormone thực vật Auxin'],
    'Sỏi thạch (Statoliths) lắng xuống đáy tế bào rễ dẫn hướng dòng phân bố auxin ức chế giãn tế bào mặt dưới.'
  ),
  createItem(
    120, 'sim-thcs-50', 'Bảo toàn cơ năng con lắc Max-oen (Maxwell Wheel)',
    'Quan sát đĩa bánh xe Max-oen tự cuộn lên hạ xuống trên dây treo: Thế năng trọng trường chuyển hóa hoàn toàn thành động năng quay.',
    ['Bước 1: Cuộn hai sợi dây treo quanh trục của đĩa bánh xe Max-oen lên đến độ cao cực đại h.', 'Bước 2: Buông tay thả tự do: Bánh xe quay tít cuộn xuống đáy, thế năng giảm thành động năng quay và tịnh tiến cực đại.', 'Bước 3: Nhờ quán tính quay, bánh xe tự cuốn dây trèo ngược lên đỉnh cao xấp xỉ ban đầu.', 'Bước 4: Quá trình lặp đi lặp lại tuần hoàn minh chứng định luật bảo toàn cơ năng.'],
    'Khoa học tự nhiên 9', 'Lớp 9', 'Bài 25: Định luật bảo toàn cơ năng', 'SGK Kết nối tri thức',
    'thcs', 'pattern-slider', 'Độ cao thả h & Vận tốc góc quay ω', false, undefined,
    ['Thế năng m.g.h', 'Động năng tịnh tiến 1/2 m.v²', 'Động năng quay 1/2 I.ω²'],
    'Tổng cơ năng E = W_thế + W_động_tịnh_tiến + W_động_quay luôn là hằng số bảo toàn khi bỏ qua ma sát.'
  ),

  // =========================================================================
  // CẤP 4: THPT (50 THÍ NGHIỆM: STT 121 -> 170)
  // =========================================================================
  createItem(
    121, 'sim-thpt-01', 'Con lắc đơn phi tuyến & Vi tích phân thời gian thực',
    'Giải phương trình vi phân d²θ/dt² + (g/L)sin(θ) = 0 bằng thuật toán tích phân số Euler-Cromer, vẽ quỹ đạo pha và bảo toàn cơ năng.',
    ['Bước 1: Kéo quả nặng con lắc lệch khỏi vị trí cân bằng một góc ban đầu θ0 bất kỳ (5° đến 90°).', 'Bước 2: Thả dao động và quan sát đồ thị li độ góc θ(t) và vận tốc góc ω(t) vẽ thời gian thực.', 'Bước 3: Mở biểu đồ cột năng lượng: Động năng và thế năng bù trừ nhau để tổng cơ năng luôn không đổi.', 'Bước 4: Bấm "Code Inspector" để bóc tách mã nguồn thuật toán vi tích phân chạy trong trình duyệt.'],
    'Vật lí 11', 'Lớp 11', 'Bài 1: Dao động điều hòa & Phương trình vi phân', 'SGK Kết nối tri thức',
    'thpt', 'pattern-code-inspector', 'Inspect Mã Nguồn & Vi tích phân (White-Box)', true, 'sim-pendulum-calculus',
    ['Chiều dài dây l (m)', 'Góc ban đầu θ0 (rad)', 'Cơ năng E = const'],
    'Phương trình vi phân cấp hai xuất phát từ định luật II Newton F = m.d²x/dt².'
  ),
  createItem(
    122, 'sim-thpt-02', 'Giao thoa sóng cơ mặt nước & Sóng dừng trên dây',
    'Trực quan hóa hiện tượng giao thoa sóng khi hai nguồn kết hợp gặp nhau: Cực đại giao thoa có biên độ gấp đôi, cực tiểu triệt tiêu hoàn toàn.',
    ['Bước 1: Khởi động hai mũi kim dao động đồng pha nhấp nhô trên mặt chậu nước ảo.', 'Bước 2: Thay đổi tần số dao động f (10Hz - 50Hz) và khoảng cách d giữa hai nguồn sóng.', 'Bước 3: Quan sát vân giao thoa Hyperbol hiển thị trên mặt nước: các dải sáng cực đại và dải tối cực tiểu.', 'Bước 4: Chuyển sang chế độ sóng dừng: Điều chỉnh tần số để tạo các nút và bụng sóng ổn định trên dây.'],
    'Vật lí 11', 'Lớp 11', 'Bài 8: Giao thoa sóng & Sóng dừng trên dây', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Tần số f (Hz) & Bước sóng λ thời gian thực', false, undefined,
    ['Bước sóng λ (cm)', 'Hiệu đường đi d1 - d2', 'Biên độ tổng hợp A'],
    'Nguyên lý chồng chất sóng (Superposition Principle): Dao động tổng hợp là tổng đại số các hàm sóng thành phần.'
  ),
  createItem(
    123, 'sim-thpt-03', 'Định luật khí lý tưởng Boyle - Mariotte (P.V = const)',
    'Chứng minh định luật đẳng nhiệt ở cấp độ vi mô: Nén thể tích xilanh còn 1/2 làm tần suất phân tử va chạm thành bình tăng gấp đôi, áp suất tăng gấp đôi.',
    ['Bước 1: Nạp 200 phân tử khí lý tưởng vào xilanh kín có áp kế và nhiệt kế.', 'Bước 2: Giữ nhiệt độ T không đổi ở 300K.', 'Bước 3: Kéo pít-tông nén thể tích V từ 10 lít xuống còn 5 lít.', 'Bước 4: Đếm số vụ va chạm phân tử vào thành xilanh và quan sát áp suất P tăng từ 1 atm lên 2 atm.'],
    'Vật lí 12', 'Lớp 12', 'Bài 3: Định luật Boyle và Thuyết động học phân tử', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Hệ hạt vi mô & Xilanh động học', false, undefined,
    ['Thể tích V (L)', 'Áp suất P (atm)', 'Nhiệt độ T (K)', 'Số phân tử N'],
    'Áp suất chất khí là mật độ xung lượng truyền từ các phân tử va đập vào diện tích thành bình trong 1 giây.'
  ),
  createItem(
    124, 'sim-thpt-04', 'Hiện tượng cảm ứng điện từ Faraday & Định luật Lenz',
    'Khám phá định luật Faraday: Dòng điện cảm ứng xuất hiện khi từ thông biến thiên; chiều dòng điện chống lại sự biến thiên (e = -dΦ/dt).',
    ['Bước 1: Đưa thanh nam châm cực Bắc (N) lại gần cuộn dây đồng có mắc điện kế nhạy G.', 'Bước 2: Quan sát kim điện kế lệch sang phải khi từ thông tăng lên.', 'Bước 3: Giữ thanh nam châm đứng yên tuyệt đối trong lòng cuộn dây: Kim trở về số 0.', 'Bước 4: Rút thanh nam châm ra xa: Kim điện kế đổi chiều lệch sang trái (định luật Lenz).'],
    'Vật lí 11/12', 'Lớp 11/12', 'Bài 16: Từ trường và Cảm ứng điện từ', 'SGK Kết nối tri thức',
    'thpt', 'pattern-drag-drop', 'Kéo nam châm & Đo biến thiên từ thông dΦ/dt', false, undefined,
    ['Từ thông Φ = B.S.cos(α)', 'Tốc độ dịch chuyển v', 'Suất điện động cảm ứng ec (V)'],
    'Bảo toàn năng lượng trong điện từ: Dòng điện cảm ứng sinh từ trường chống lại chuyển động của nam châm.'
  ),
  createItem(
    125, 'sim-thpt-05', 'Va chạm đàn hồi & Bảo toàn động lượng trên đệm khí',
    'Kiểm chứng định luật bảo toàn động lượng m1.v1 + m2.v2 = const và khảo sát chuyển hóa động năng trong va chạm 1 chiều.',
    ['Bước 1: Bật bơm khí đệm không khí triệt tiêu hoàn toàn lực ma sát trên ray dẫn.', 'Bước 2: Cài đặt khối lượng hai xe m1 = 1kg, m2 = 2kg, chọn va chạm đàn hồi.', 'Bước 3: Cho xe 1 chuyển động v1 = 2m/s va chạm với xe 2 đứng yên.', 'Bước 4: Dùng nút "Tua chậm 0.1x" và "Step dt" đo vận tốc sau va chạm, đối chiếu hệ phương trình bảo toàn.'],
    'Vật lí 10', 'Lớp 10', 'Bài 28: Động lượng và Định luật bảo toàn', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Tua chậm vi phân & Khảo sát động lượng', false, undefined,
    ['Khối lượng m1, m2 (kg)', 'Vận tốc trước v1, v2', 'Vận tốc sau v1\', v2\''],
    'Bảo toàn động lượng xuất phát trực tiếp từ tính đồng nhất của không gian (Định lý Noether).'
  ),
  createItem(
    126, 'sim-thpt-06', 'Quang phổ vạch nguyên tử Hydro & Mẫu nguyên tử Bohr',
    'Mô phỏng bước nhảy lượng tử của electron giữa các mức năng lượng gián đoạn En = -13.6 / n² (eV) và sự phát xạ photon ánh sáng đơn sắc.',
    ['Bước 1: Kéo electron ở trạng thái cơ bản n = 1 hấp thụ một photon ánh sáng thích hợp.', 'Bước 2: Quan sát electron nhảy vọt lên quỹ đạo dừng kích thích n = 3.', 'Bước 3: Sau ~10⁻⁸s, electron nhảy về mức n = 2 và phát xạ photon màu Đỏ bước sóng 656.3 nm (vạch H-alpha).', 'Bước 4: Bật màn quang phổ để ghi nhận các vạch phát xạ màu đặc trưng trong dãy Ban-me.'],
    'Vật lí 12', 'Lớp 12', 'Bài 21: Mẫu nguyên tử Bohr & Quang phổ vạch', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Sandbox lượng tử & Bước nhảy photon', false, undefined,
    ['Số lượng tử n (1, 2, 3...)', 'Năng lượng En (eV)', 'Bước sóng photon λ (nm)'],
    'Cơ học lượng tử: Năng lượng ở thế giới vi mô bị lượng tử hóa thành từng gói rời rạc h.f thay vì liên tục.'
  ),
  createItem(
    127, 'sim-thpt-07', 'Tốc độ phản ứng hóa học & Năng lượng hoạt hóa Arrhenius',
    'Khảo sát ảnh hưởng của nhiệt độ, nồng độ và chất xúc tác đến phân bố năng lượng Maxwell-Boltzmann và số va chạm hiệu quả giữa các phân tử.',
    ['Bước 1: Thiết lập buồng phản ứng gồm các phân tử chất A và B với nồng độ ban đầu.', 'Bước 2: Tăng nhiệt độ hỗn hợp: Đồ thị Maxwell-Boltzmann dịch sang phải, số hạt vượt ngưỡng hoạt hóa tăng vọt.', 'Bước 3: Thêm hạt chất xúc tác: Quan sát hàng rào năng lượng hoạt hóa Ea bị hạ thấp xuống.', 'Bước 4: Theo dõi đường cong đồ thị nồng độ sản phẩm theo thời gian để tính hằng số tốc độ k.'],
    'Hóa học 10', 'Lớp 10', 'Bài 16: Tốc độ phản ứng hóa học', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Buồng va chạm phân tử & Hàng rào năng lượng Ea', false, undefined,
    ['Nhiệt độ T (K)', 'Năng lượng hoạt hóa Ea', 'Hằng số tốc độ k = A.exp(-Ea/RT)'],
    'Chỉ những phân tử có động năng lớn hơn hàng rào thế năng hoạt hóa Ea mới phản ứng tạo sản phẩm.'
  ),
  createItem(
    128, 'sim-thpt-08', 'Chuyển động ném xiên & Tầm bay xa đạn đạo',
    'Khảo sát quỹ đạo Parabol của vật ném xiên: Phân tích chuyển động thành hai thành phần độc lập Ox (đẳng tốc) và Oy (rơi tự do).',
    ['Bước 1: Đặt súng đại bác ở mặt đất với vận tốc đầu nòng v0 = 25 m/s.', 'Bước 2: Kéo thanh trượt thay đổi góc bắn α từ 10° đến 80°.', 'Bước 3: Nhấn nút bắn đạn: Quan sát quỹ đạo Parabol vẽ đường cong mượt mà trên không gian.', 'Bước 4: Kiểm chứng tầm xa đạt cực đại L_max khi góc bắn đúng bằng α = 45°.'],
    'Vật lí 10', 'Lớp 10', 'Bài 12: Chuyển động ném', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Góc bắn α & Vận tốc ban đầu v0', false, undefined,
    ['Góc bắn α (°)', 'Tầm cao H (m)', 'Tầm xa L = v0².sin(2α)/g (m)'],
    'Tính độc lập của các chuyển động thành phần theo phương Ox và Oy theo định luật quán tính Galileo.'
  ),
  createItem(
    129, 'sim-thpt-09', 'Đo gia tốc rơi tự do g bằng cổng quang điện',
    'Thí nghiệm thực hành đo chính xác hằng số gia tốc trọng trường g = 2h / t² với sai số dưới 1% bằng nam châm điện thả rơi bi thép.',
    ['Bước 1: Gắn viên bi thép vào nam châm điện ở độ cao h1 = 0.5m so với cổng quang điện.', 'Bước 2: Bấm nút ngắt điện nam châm: Bi rơi tự do và đồng hồ hiện số ghi thời gian rơi t chính xác đến 0.0001s.', 'Bước 3: Thay đổi độ cao rơi h2 = 0.8m, h3 = 1.0m và lặp lại phép đo 5 lần.', 'Bước 4: Vẽ đồ thị h theo t²: Độ dốc đường thẳng là g/2 -> Suy ra giá trị thực nghiệm g = 9.80 m/s².'],
    'Vật lí 10', 'Lớp 10', 'Bài 11: Thực hành Đo gia tốc rơi tự do', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Thời gian rơi chính xác microsecond', false, undefined,
    ['Độ cao rơi h (m)', 'Thời gian rơi t (s)', 'Gia tốc g = 2h/t²'],
    'Trong chân không không có ma sát, mọi vật bất kể khối lượng đều rơi với cùng một gia tốc trọng trường g.'
  ),
  createItem(
    130, 'sim-thpt-10', 'Con lắc lò xo & Thế năng đàn hồi (1/2 k x²)',
    'Khảo sát dao động điều hòa của con lắc lò xo nằm ngang: Sự chuyển hóa liên tục giữa động năng (1/2 mv²) và thế năng đàn hồi.',
    ['Bước 1: Kéo quả nặng lệch khỏi vị trí cân bằng một đoạn x0 = 10cm làm giãn lò xo.', 'Bước 2: Thả dao động và quan sát đồ thị hàm sin của li độ x(t) và lực phục hồi F = -k.x.', 'Bước 3: Thay đổi độ cứng lò xo k (từ 20 N/m lên 100 N/m): Quan sát tần số dao động ω = √(k/m) tăng nhanh.', 'Bước 4: Đồ thị năng lượng dạng thanh: Cơ năng E = 1/2 k A² luôn là đường thẳng bảo toàn tuyệt đối.'],
    'Vật lí 11', 'Lớp 11', 'Bài 2: Phương trình dao động điều hòa', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Độ cứng k & Biên độ ban đầu A', false, undefined,
    ['Độ cứng k (N/m)', 'Khối lượng m (kg)', 'Tần số góc ω = √(k/m)', 'Cơ năng E'],
    'Lực đàn hồi tuân theo định luật Hooke F = -k.x tạo nên dao động điều hòa điều kiện lý tưởng.'
  ),
  createItem(
    131, 'sim-thpt-11', 'Giao thoa ánh sáng khe Young & Đo bước sóng λ',
    'Xác minh lưỡng tính sóng - hạt của ánh sáng: Chiếu chùm laser qua hai khe hẹp song song tạo hệ vân giao thoa sáng - tối đều đặn.',
    ['Bước 1: Chiếu chùm laser đỏ qua hai khe hẹp cách nhau khoảng cách a = 0.25 mm.', 'Bước 2: Đặt màn quan sát cách mặt phẳng hai khe khoảng cách D = 1.5 mét.', 'Bước 3: Dùng thước trắc vi quang học đo khoảng cách giữa 5 khoảng vân liên tiếp 4i.', 'Bước 4: Tính bước sóng ánh sáng λ = a.i / D = 650 nm; đổi nguồn laser xanh để thấy khoảng vân i co hẹp lại.'],
    'Vật lí 11', 'Lớp 11', 'Bài 10: Thực hành Đo bước sóng ánh sáng', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Khoảng cách khe a & Khoảng cách màn D', false, undefined,
    ['Khoảng vân i = λ.D/a', 'Bước sóng ánh sáng λ (nm)'],
    'Hiện tượng giao thoa là bằng chứng không thể chối cãi về bản chất sóng của ánh sáng.'
  ),
  createItem(
    132, 'sim-thpt-12', 'Định luật vạn vật hấp dẫn & Quỹ đạo vệ tinh Kepler',
    'Mô phỏng chuyển động của vệ tinh quanh Trái Đất: Vận tốc vũ trụ cấp 1 (7.9 km/s) cho quỹ đạo tròn; lớn hơn cho quỹ đạo Elip.',
    ['Bước 1: Đặt vệ tinh ở độ cao 300km so với bề mặt Trái Đất.', 'Bước 2: Cấp vận tốc ban đầu v = 5.0 km/s: Lực hút trọng trường kéo vệ tinh rơi cắm xuống đất.', 'Bước 3: Tăng vận tốc v = 7.9 km/s: Vệ tinh chuyển động tròn đều quanh Trái Đất vĩnh cửu.', 'Bước 4: Tăng v = 9.5 km/s: Quỹ đạo biến thành đường Elip tuân theo 3 định luật Kepler.'],
    'Vật lí 10', 'Lớp 10', 'Bài 21: Lực hấp dẫn và Chuyển động vệ tinh', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Vận tốc phóng ban đầu v (km/s)', false, undefined,
    ['Vận tốc vũ trụ cấp 1 (7.9 km/s)', 'Quỹ đạo Elip', 'Lực hấp dẫn F = G.M.m/r²'],
    'Lực hấp dẫn đóng vai trò là lực hướng tâm duy trì chuyển động quỹ đạo cong kín của thiên thể.'
  ),
  createItem(
    133, 'sim-thpt-13', 'Phản ứng este hóa giữa rượu etylic và axit axetic',
    'Khảo sát phản ứng thuận nghịch tạo este etyl axetat có mùi thơm hoa quả: Vai trò xúc tác của axit sunfuric đặc H2SO4.',
    ['Bước 1: Rót vào ống nghiệm 2ml C2H5OH, 2ml CH3COOH và 1ml H2SO4 đặc.', 'Bước 2: Lắp ống sinh hàn không khí và đun cách thủy ở 65 - 70°C trong 10 phút.', 'Bước 3: Rót hỗn hợp sau phản ứng vào cốc chứa dung dịch NaCl bão hòa.', 'Bước 4: Este etyl axetat CH3COOC2H5 nhẹ không tan nổi lên thành lớp dầu thơm phía trên.'],
    'Hóa học 11/12', 'Lớp 11/12', 'Bài 1: Este và Phản ứng este hóa', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Nhiệt độ đun & Cân bằng chuyển dịch', false, undefined,
    ['Hằng số cân bằng Kc', 'Hiệu suất este hóa H%'],
    'Phản ứng este hóa là phản ứng thuận nghịch thu nhiệt; xúc tác H2SO4 đặc hút nước làm chuyển dịch cân bằng.'
  ),
  createItem(
    134, 'sim-thpt-14', 'Khảo sát đặc tuyến Volt - Ampe của Diode bán dẫn P-N',
    'Vẽ đường cong I-V phi tuyến tính của tiếp giáp P-N: Dẫn điện tốt khi phân cực thuận (U > 0.7V), khóa dòng khi phân cực ngược.',
    ['Bước 1: Mắc diode Si bán dẫn nối tiếp với điện trở bảo vệ và nguồn điện DC.', 'Bước 2: Tăng dần điện áp thuận U từ 0V đến 1.0V: Dòng điện I bắt đầu tăng vọt khi U vượt ngưỡng 0.65V.', 'Bước 3: Đảo cực nguồn điện phân cực ngược: Dòng điện I giảm về 0 (chỉ có dòng rỉ nanoampe).', 'Bước 4: Diode đóng vai trò là chiếc van 1 chiều cho dòng điện, nền tảng của chip bán dẫn vi xử lý.'],
    'Vật lí 11', 'Lớp 11', 'Bài 19: Dòng điện trong chất bán dẫn', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Điện áp U & Dòng điện I qua tiếp giáp P-N', false, undefined,
    ['Điện áp ngưỡng U_th = 0.7V', 'Dòng bão hòa ngược I_s', 'Đặc tuyến Shockley'],
    'Hàng rào thế năng tại vùng nghèo tiếp giáp P-N chỉ cho phép hạt dẫn đa số vượt qua khi phân cực thuận.'
  ),
  createItem(
    135, 'sim-thpt-15', 'Chu trình Calvin & Pha tối quang hợp ở thực vật C3, C4',
    'Mô phỏng con đường cố định CO2: Enzym Rubisco gắn CO2 vào chất nhận RuBP tạo hợp chất 3-PGA rồi khử thành đường Glucozơ.',
    ['Bước 1: Phân tử khí CO2 khuếch tán vào chất nền stroma của lục lạp.', 'Bước 2: Enzym Rubisco xúc tác phản ứng cố định CO2 vào RuBP (Ribulose 1,5-bisphosphate).', 'Bước 3: Tiêu thụ năng lượng ATP và NADPH từ pha sáng để khử 3-PGA thành G3P.', 'Bước 4: Hai phân tử G3P kết hợp tạo nên một phân tử đường Glucozơ C6H12O6.'],
    'Sinh học 10/11', 'Lớp 10/11', 'Bài 12: Quang hợp ở thực vật C3, C4 và CAM', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Chu trình phân tử Calvin & Tiêu thụ ATP', false, undefined,
    ['Enzym Rubisco', 'Nồng độ CO2', 'Hiệu suất quang hợp'],
    'Chu trình Calvin là cỗ máy sinh học đồng hóa carbon vô cơ thành chất hữu cơ nuôi sống sinh quyển.'
  ),
  createItem(
    136, 'sim-thpt-16', 'Cân bằng hóa học & Nguyên lý Le Chatelier (NO2 / N2O4)',
    'Quan sát sự chuyển dịch cân bằng khí 2NO2 (nâu đỏ) <-> N2O4 (không màu): Nén áp suất làm màu nâu nhạt đi rõ rệt.',
    ['Bước 1: Nạp hỗn hợp khí NO2 và N2O4 vào ống tiêm kín (ống có màu nâu đỏ nhạt).', 'Bước 2: Đẩy nhanh pít-tông nén thể tích khí xuống 1/2: Màu nâu đỏ thoạt đầu đậm lên do nồng độ tăng.', 'Bước 3: Sau vài giây: Cân bằng chuyển dịch theo chiều giảm số phân tử khí (chiều thuận tạo N2O4).', 'Bước 4: Màu sắc ống tiêm nhạt dần rõ rệt minh chứng nguyên lý Le Chatelier.'],
    'Hóa học 11', 'Lớp 11', 'Bài 1: Khái niệm về Cân bằng hóa học', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Áp suất P & Độ đậm màu khí NO2', false, undefined,
    ['Phản ứng tỏa nhiệt ΔH < 0', 'Hằng số cân bằng Kp'],
    'Nguyên lý Le Chatelier: Khi chịu tác động từ bên ngoài, hệ cân bằng tự chuyển dịch theo chiều chống lại tác động đó.'
  ),
  createItem(
    137, 'sim-thpt-17', 'Dao động điện từ tự do trong mạch LC lý tưởng',
    'Mô phỏng sự chuyển hóa qua lại giữa năng lượng điện trường trong tụ điện và năng lượng từ trường trong cuộn cảm.',
    ['Bước 1: Nạp điện cho tụ điện C đến điện áp cực đại U0.', 'Bước 2: Chuyển khóa K đóng mạch tụ điện với cuộn thuần cảm L.', 'Bước 3: Điện tích q(t) phóng qua cuộn cảm sinh dòng điện i(t) trễ pha π/2.', 'Bước 4: Đồ thị năng lượng: Năng lượng điện trường WC = q²/(2C) và năng lượng từ trường WL = 1/2 L.i² bù trừ bảo toàn.'],
    'Vật lí 12', 'Lớp 12', 'Bài 1: Mạch dao động LC', 'SGK Kết nối tri thức',
    'thpt', 'pattern-code-inspector', 'Mã nguồn vi phân LC & Đồ thị dao động', false, undefined,
    ['Tần số dao động riêng ω = 1/√(L.C)', 'Năng lượng điện từ W = const'],
    'Phương trình vi phân mạch LC: d²q/dt² + (1/LC)q = 0 có nghiệm điều hòa tương tự con lắc cơ học.'
  ),
  createItem(
    138, 'sim-thpt-18', 'Tán xạ hạt alpha Rutherford & Cấu trúc nguyên tử',
    'Bắn chùm hạt alpha qua lá vàng siêu mỏng: Đa số hạt đi xuyên thẳng, một số ít bị lệch góc lớn chứng minh có hạt nhân đặc ở tâm.',
    ['Bước 1: Phóng chùm hạt alpha mang điện tích dương +2e vào lá vàng mỏng có độ dày vài nghìn nguyên tử.', 'Bước 2: Quan sát 99.9% hạt alpha bay xuyên thẳng không bị cản trở (nguyên tử có cấu tạo rỗng).', 'Bước 3: Một vài hạt alpha bay gần hạt nhân vàng (+79e) bị lực đẩy tĩnh điện bẻ cong góc lớn.', 'Bước 4: Cực kỳ hiếm (1/8000 hạt) bật ngược trở lại chứng minh toàn bộ khối lượng tập trung ở hạt nhân tí hon.'],
    'Vật lí 12 / Hóa 10', 'Lớp 12 / 10', 'Bài 2: Hạt nhân nguyên tử và Tán xạ Rutherford', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Chùm hạt alpha & Lực đẩy Coulomb hạt nhân', false, undefined,
    ['Tán xạ góc lớn θ > 90°', 'Kích thước hạt nhân ~ 10⁻¹⁵ m'],
    'Lực đẩy tĩnh điện Coulomb giữa hai hạt mang điện cùng dấu làm chùm hạt tán xạ theo tiết diện tán xạ Rutherford.'
  ),
  createItem(
    139, 'sim-thpt-19', 'Đo suất điện động và điện trở trong của nguồn điện',
    'Vẽ đường đặc tuyến ngoài U = E - I.r: Xác định chính xác suất điện động E và điện trở trong r của pin con thỏ.',
    ['Bước 1: Mắc mạch điện gồm pin cần đo, biến trở R, ampe kế và vôn kế đo hai cực của pin.', 'Bước 2: Thay đổi giá trị biến trở R để thu thập 5 cặp số liệu (I, U).', 'Bước 3: Vẽ đồ thị đường thẳng U theo I cắt trục tung tại giá trị suất điện động E = 1.52V.', 'Bước 4: Độ dốc của đường thẳng chính là điện trở trong r = 0.45 Ω của viên pin.'],
    'Vật lí 11', 'Lớp 11', 'Bài 12: Thực hành Đo suất điện động và Điện trở trong', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Biến trở R & Thu thập bảng số liệu (I, U)', false, undefined,
    ['Suất điện động E (V)', 'Điện trở trong r (Ω)', 'Độ sụt áp U_ngoài'],
    'Định luật Ohm cho toàn mạch: Cường độ dòng điện tỷ lệ với suất điện động và tỷ lệ nghịch với điện trở toàn phần.'
  ),
  createItem(
    140, 'sim-thpt-20', 'Mạch điện xoay chiều RLC nối tiếp & Cộng hưởng điện',
    'Khảo sát hiện tượng cộng hưởng điện khi ZL = ZC: Tổng trở mạch cực tiểu Z = R, dòng điện đạt cực đại và u cùng pha với i.',
    ['Bước 1: Mắc đoạn mạch RLC nối tiếp với nguồn điện xoay chiều có tần số f thay đổi được.', 'Bước 2: Thay đổi tần số f từ 20Hz đến 200Hz: Quan sát kim ampe kế tăng dần rồi giảm xuống.', 'Bước 3: Tại tần số cộng hưởng f0 = 1 / (2π√LC): Cường độ dòng điện I đạt giá trị cực đại I_max = U / R.', 'Bước 4: Điện áp tức thời trên cuộn cảm uL và tụ điện uC ngược pha nhau triệt tiêu hoàn toàn.'],
    'Vật lí 12', 'Lớp 12', 'Bài 14: Mạch có R, L, C mắc nối tiếp', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Tần số nguồn điện f & Đồ thị biên độ dòng điện', false, undefined,
    ['Cảm kháng ZL = ωL', 'Dung kháng ZC = 1/(ωC)', 'Hệ số công suất cos(φ) = 1'],
    'Hiện tượng cộng hưởng điện xảy ra khi tần số dao động cưỡng bức bằng tần số dao động riêng của mạch.'
  ),
  createItem(
    141, 'sim-thpt-21', 'Hiện tượng quang điện ngoài & Giới hạn quang điện',
    'Thí nghiệm Hertz và phương trình Einstein: Chiếu ánh sáng có bước sóng nhỏ hơn giới hạn λ0 làm bật electron khỏi mặt kim loại.',
    ['Bước 1: Chiếu ánh sáng đỏ vào tấm kẽm tích điện âm: Tấm kẽm không mất điện tích.', 'Bước 2: Thay nguồn sáng bằng chùm tia tử ngoại UV: Kim điện nghiệm lập tức khép lại (electron bị bật ra).', 'Bước 3: Tăng cường độ chùm tia tử ngoại: Tốc độ bật electron tăng nhưng vận tốc ban đầu cực đại không đổi.', 'Bước 4: Kiểm chứng phương trình Einstein: h.f = A + 1/2 m.v_max².'],
    'Vật lí 12', 'Lớp 12', 'Bài 30: Hiện tượng quang điện & Thuyết lượng tử ánh sáng', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Bước sóng chùm sáng λ & Điện thế hãm Uh', false, undefined,
    ['Công thoát kim loại A (eV)', 'Giới hạn quang điện λ0 = h.c / A', 'Động năng ban đầu cực đại'],
    'Mỗi photon khi bị hấp thụ sẽ truyền toàn bộ năng lượng h.f cho một electron duy nhất.'
  ),
  createItem(
    142, 'sim-thpt-22', 'Nguyên lý I Nhiệt động lực học (ΔU = A + Q)',
    'Khảo sát sự biến thiên nội năng của khối khí trong xilanh khi vừa bị nén cơ học vừa trao đổi nhiệt với môi trường.',
    ['Bước 1: Nén pít-tông thực hiện công A = 100J lên khối khí trong xilanh.', 'Bước 2: Khối khí truyền nhiệt lượng Q = -40J ra môi trường làm mát.', 'Bước 3: Tính biến thiên nội năng ΔU = A + Q = 100 - 40 = 60J.', 'Bước 4: Nhiệt kế cắm trong xilanh chỉ nhiệt độ khối khí tăng tương ứng độ tăng nội năng.'],
    'Vật lí 12', 'Lớp 12', 'Bài 4: Các nguyên lý của Nhiệt động lực học', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Công thực hiện A & Nhiệt lượng trao đổi Q', false, undefined,
    ['Độ biến thiên nội năng ΔU', 'Công A', 'Nhiệt lượng Q'],
    'Định luật bảo toàn và chuyển hóa năng lượng áp dụng cho các hệ vĩ mô trao đổi nhiệt và công.'
  ),
  createItem(
    143, 'sim-thpt-23', 'Khúc xạ & Góc lệch cực tiểu qua lăng kính tam giác',
    'Khảo sát đường đi của tia sáng đơn sắc qua lăng kính: Tìm góc tới i để góc lệch D giữa tia ló và tia tới đạt cực tiểu.',
    ['Bước 1: Chiếu tia sáng đơn sắc vào mặt bên lăng kính có góc chiết quang A = 60°.', 'Bước 2: Thay đổi góc tới i1 từ 30° đến 80°: Theo dõi góc lệch D giảm dần rồi tăng lên.', 'Bước 3: Tại vị trí góc lệch cực tiểu D_min: Đường đi của tia sáng đối xứng qua mặt phẳng phân giác lăng kính.', 'Bước 4: Kiểm chứng công thức tính chiết suất: sin((A + D_min)/2) = n . sin(A/2).'],
    'Vật lí 11', 'Lớp 11', 'Bài 7: Lăng kính và Khúc xạ', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Góc tới i1 & Góc lệch D qua lăng kính', false, undefined,
    ['Góc chiết quang A', 'Góc lệch cực tiểu D_min', 'Chiết suất lăng kính n'],
    'Góc lệch qua lăng kính đạt cực tiểu khi đường đi của tia sáng có tính đối xứng đảo ngược thời gian.'
  ),
  createItem(
    144, 'sim-thpt-24', 'Điện trường & Điện thế giữa hai bản tụ phẳng (U = E.d)',
    'Trực quan hóa các đường sức điện trường đều song song và các mặt đẳng thế giữa hai bản tụ điện mang điện tích trái dấu.',
    ['Bước 1: Đặt hai bản kim loại phẳng song song cách nhau khoảng cách d = 5cm.', 'Bước 2: Cấp hiệu điện thế U = 100V giữa hai bản.', 'Bước 3: Hiển thị các đường sức điện: Là các đường thẳng song song cách đều hướng từ bản dương sang bản âm.', 'Bước 4: Dùng đầu dò điện thế đo điện thế tại các điểm khác nhau: V giảm đều đặn theo công thức U = E.d.'],
    'Vật lí 11', 'Lớp 11', 'Bài 17: Điện trường đều và Điện thế', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Hiệu điện thế U & Khoảng cách hai bản d', false, undefined,
    ['Cường độ điện trường E = U/d (V/m)', 'Điện dung tụ điện C = ε.S / (4πkd)'],
    'Điện trường tĩnh là trường thế; hiệu điện thế giữa hai điểm bằng tích phân đường của cường độ điện trường.'
  ),
  createItem(
    145, 'sim-thpt-25', 'Chuyển động của hạt mang điện trong điện trường và từ trường',
    'Khảo sát quỹ đạo Parabol trong điện trường đều (máy gia tốc) và quỹ đạo tròn xoắn ốc trong từ trường đều (máy Cyclotron).',
    ['Bước 1: Bắn electron với vận tốc v0 vào điện trường đều giữa hai bản tụ: Quỹ đạo uốn cong Parabol.', 'Bước 2: Bật từ trường đều B vuông góc với vận tốc electron: Lực từ Lorentz bẻ cong electron thành vòng tròn kín.', 'Bước 3: Đo bán kính quỹ đạo tròn R = m.v / (q.B) phụ thuộc tỉ lệ nghịch với cường độ từ trường B.', 'Bước 4: Ứng dụng trong máy quang phổ khối lượng để cân khối lượng các hạt đồng vị.'],
    'Vật lí 11/12', 'Lớp 11/12', 'Bài 20: Lực Lorentz và Chuyển động hạt mang điện', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Điện trường E, Từ trường B & Bán kính quỹ đạo R', false, undefined,
    ['Lực Lorentz F = q.v.B', 'Bán kính xyclotron R', 'Tần số xyclotron f = qB / (2πm)'],
    'Lực từ luôn vuông góc với vận tốc nên không sinh công, chỉ làm thay đổi hướng chuyển động của hạt.'
  ),
  createItem(
    146, 'sim-thpt-26', 'Hiện tượng tự cảm khi đóng ngắt mạch cuộn cảm',
    'Khảo sát suất điện động tự cảm chống lại sự tăng hoặc giảm của dòng điện trong chính mạch điện đó (e_tc = -L.di/dt).',
    ['Bước 1: Mắc song song hai nhánh: Nhánh 1 gồm đèn 1 nối tiếp điện trở R; Nhánh 2 gồm đèn 2 nối tiếp cuộn cảm L.', 'Bước 2: Đóng công tắc điện: Đèn 1 sáng ngay lập tức, đèn 2 sáng lên từ từ sau 1 giây.', 'Bước 3: Giải thích: Cuộn cảm L sinh suất điện động tự cảm cản trở sự tăng của dòng điện.', 'Bước 4: Ngắt công tắc: Đèn neon mắc song song với cuộn cảm lóe sáng một cái rồi mới tắt.'],
    'Vật lí 11', 'Lớp 11', 'Bài 25: Hiện tượng tự cảm', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Khoảnh khắc đóng/ngắt mạch tự cảm', false, undefined,
    ['Độ tự cảm L (Henry)', 'Suất điện động tự cảm e_tc = -L.di/dt'],
    'Từ trường sinh ra bởi chính dòng điện trong cuộn dây tạo ra từ thông tự cảm chống lại sự biến thiên dòng điện.'
  ),
  createItem(
    147, 'sim-thpt-27', 'Chu kỳ bán rã & Định luật phân rã phóng xạ hạt nhân',
    'Mô phỏng phân rã ngẫu nhiên của 1000 hạt nhân phóng xạ theo thời gian: Sau mỗi chu kỳ T, số hạt nhân chưa phân rã giảm một nửa.',
    ['Bước 1: Bắt đầu với N0 = 1000 hạt nhân phóng xạ C-14 có chu kỳ bán rã T = 5730 năm.', 'Bước 2: Bấm nút chạy thời gian: Từng hạt nhân phân rã ngẫu nhiên phát ra hạt beta.', 'Bước 3: Sau t = T (5730 năm): Đếm số hạt nhân còn lại xấp xỉ N = 500 hạt (50%).', 'Bước 4: Sau t = 2T: Số hạt còn lại xấp xỉ 250 hạt (25%); đồ thị phân rã tuân theo hàm mũ N(t) = N0.2^(-t/T).'],
    'Vật lí 12', 'Lớp 12', 'Bài 36: Phóng xạ và Phân rã hạt nhân', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Phân rã xác suất của hệ hạt nhân', false, undefined,
    ['Chu kỳ bán rã T', 'Hằng số phóng xạ λ = ln(2)/T', 'Định luật phân rã N(t) = N0.e^(-λt)'],
    'Phân rã phóng xạ là quá trình lượng tử thuần túy xác suất; không thể dự đoán hạt nào sẽ phân rã tiếp theo.'
  ),
  createItem(
    148, 'sim-thpt-28', 'Phản ứng chuẩn độ Axit - Bazơ bằng buret',
    'Xác định chính xác nồng độ dung dịch HCl bằng dung dịch chuẩn NaOH 0.100M với chỉ thị màu phenolphtalein.',
    ['Bước 1: Dùng pipet lấy đúng 10.00 ml dung dịch HCl cần đo cho vào bình tam giác.', 'Bước 2: Nạp đầy dung dịch chuẩn NaOH 0.100M vào buret đến vạch 0.', 'Bước 3: Mở khóa buret nhỏ từng giọt NaOH vào bình tam giác và lắc đều.', 'Bước 4: Đúng giọt dung dịch làm dung dịch chuyển sang màu hồng nhạt bền vững trong 30s: Đọc thể tích V_NaOH = 12.50 ml.'],
    'Hóa học 11', 'Lớp 11', 'Bài 2: Phương pháp Chuẩn độ Axit - Bazơ', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Thể tích nhỏ giọt từng 0.05ml & Điểm tương đương', false, undefined,
    ['Thể tích NaOH tiêu tốn V_td', 'Nồng độ mol C_HCl = C_NaOH . V_NaOH / V_HCl'],
    'Định luật đương lượng tại điểm tương đương: Số mol ion H⁺ bằng đúng số mol ion OH⁻ phản ứng.'
  ),
  createItem(
    149, 'sim-thpt-29', 'Pin điện hóa Volta & Thế điện cực chuẩn của kim loại',
    'Khảo sát pin Galvani kẽm - đồng (Zn - Cu): Đo suất điện động chuẩn E°_pin = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = 1.10 V.',
    ['Bước 1: Nhúng thanh kẽm Zn vào cốc dung dịch ZnSO4 1M; thanh đồng Cu vào cốc CuSO4 1M.', 'Bước 2: Nối hai cốc bằng cầu muối KCl bảo đảm cân bằng điện tích.', 'Bước 3: Nối hai thanh kim loại qua một vôn kế điện tử.', 'Bước 4: Vôn kế chỉ chính xác suất điện động chuẩn E° = 1.10V; electron chạy từ cực âm Zn sang cực dương Cu.'],
    'Hóa học 12', 'Lớp 12', 'Bài 12: Pin điện hóa và Thế điện cực chuẩn', 'SGK Kết nối tri thức',
    'thpt', 'pattern-drag-drop', 'Lắp ráp pin điện hóa Zn-Cu & Cầu muối', false, undefined,
    ['Thế điện cực E°(Zn²⁺/Zn) = -0.76V', 'E°(Cu²⁺/Cu) = +0.34V', 'Suất điện động E° = 1.10V'],
    'Năng lượng tự do Gibbs của phản ứng oxy hóa khử tự diễn biến chuyển hóa thành điện năng.'
  ),
  createItem(
    150, 'sim-thpt-30', 'Điện phân dung dịch CuSO4 với cực dương tan',
    'Khảo sát hiện tượng cực dương tan: Đồng ở anot tan ra và bám đều lên catot với khối lượng tính bằng định luật Faraday.',
    ['Bước 1: Nhúng hai thanh đồng nguyên chất vào bình điện phân dung dịch CuSO4.', 'Bước 2: Cấp dòng điện DC có cường độ không đổi I = 2A trong thời gian t = 30 phút.', 'Bước 3: Cân lại hai điện cực: Khối lượng thanh anot giảm đúng bằng khối lượng thanh catot tăng thêm.', 'Bước 4: Kiểm chứng công thức định luật Faraday: m = A.I.t / (n.F).'],
    'Hóa học 12', 'Lớp 12', 'Bài 13: Hiện tượng điện phân và Ứng dụng', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Dòng điện I & Thời gian điện phân t', false, undefined,
    ['Khối lượng bám m (g)', 'Hằng số Faraday F = 96500 C/mol'],
    'Năng lượng điện cưỡng bức phản ứng oxy hóa khử không tự diễn biến xảy ra tại bề mặt hai điện cực.'
  ),
  createItem(
    151, 'sim-thpt-31', 'Tính chất lưỡng tính của Amino Axit (Glyxin)',
    'Chứng minh phân tử amino axit vừa tác dụng được với dung dịch axit mạnh vừa tác dụng được với dung dịch bazơ mạnh.',
    ['Bước 1: Rót dung dịch glyxin H2N-CH2-COOH vào hai ống nghiệm A và B.', 'Bước 2: Cho dung dịch axit HCl vào ống A: Nhóm amino -NH2 nhận proton tạo muối amoni Cl⁻[H3N⁺-CH2-COOH].', 'Bước 3: Cho dung dịch bazơ NaOH vào ống B: Nhóm cacboxyl -COOH nhường proton tạo muối natri H2N-CH2-COONa.', 'Bước 4: Kết luận tính chất lưỡng tính xuất phát từ hai nhóm chức trái ngược nhau trong cùng một phân tử.'],
    'Hóa học 12', 'Lớp 12', 'Bài 5: Amino axit và Tính chất lưỡng tính', 'SGK Kết nối tri thức',
    'thpt', 'pattern-drag-drop', 'Nhỏ axit và bazơ vào dung dịch Glyxin', false, undefined,
    ['Điểm đẳng điện pI', 'Ion lưỡng cực H3N⁺-CH2-COO⁻'],
    'Dạng tồn tại chủ yếu của amino axit trong nước là ion lưỡng cực có tính đệm pH.'
  ),
  createItem(
    152, 'sim-thpt-32', 'Mô hình dịch mã tổng hợp chuỗi polipeptit tại Ribôxôm',
    'Mô phỏng quá trình dịch mã: Phức hệ tARN mang axit amin đến khớp mã bộ ba codon trên mARN hình thành liên kết peptit.',
    ['Bước 1: Tiểu phần nhỏ ribôxôm gắn vào mARN tại bộ ba mở đầu AUG (Met).', 'Bước 2: tARN mang axit amin thứ nhất có anticodon đối mã khớp bổ sung với codon mARN.', 'Bước 3: Hình thành liên kết peptit giữa hai axit amin; ribôxôm dịch chuyển một bộ ba tiếp theo.', 'Bước 4: Khi gặp một trong 3 bộ ba kết thúc (UAA, UAG, UGA), chuỗi polipeptit được giải phóng hoàn tất.'],
    'Sinh học 12', 'Lớp 12', 'Bài 2: Quá trình Dịch mã và Tổng hợp Protein', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Khớp mã codon-anticodon tại Riboxom', false, undefined,
    ['Bộ ba mở đầu AUG', 'Bộ ba kết thúc (UAA/UAG/UGA)', 'Liên kết peptit -CO-NH-'],
    'Thông tin di truyền được dịch mã chính xác từ ngôn ngữ 4 nucleotide sang ngôn ngữ 20 axit amin.'
  ),
  createItem(
    153, 'sim-thpt-33', 'Dòng điện trong chất khí & Phóng điện tia lửa',
    'Khảo sát sự ion hóa chất khí: Khi điện trường vượt qua ngưỡng đánh thủng (3.10⁶ V/m), chất khí phóng tia lửa điện như sấm sét.',
    ['Bước 1: Đặt hai quả cầu kim loại cách nhau khoảng cách d = 2cm trong không khí.', 'Bước 2: Tăng dần hiệu điện thế U giữa hai quả cầu: Ở điện áp thấp không có dòng điện chạy qua.', 'Bước 3: Khi hiệu điện thế đạt U = 60 kV: Điện trường vượt ngưỡng đánh thủng điện môi.', 'Bước 4: Xuất hiện tia lửa điện ngoằn ngoèo phát sáng kèm tiếng nổ tách lách cách (mô phỏng tia sét).'],
    'Vật lí 11', 'Lớp 11', 'Bài 15: Dòng điện trong chất khí', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Hiệu điện thế đánh thủng U (kV)', false, undefined,
    ['Điện trường tới hạn E_thủng ~ 30 kV/cm', 'Quá trình ion hóa tuyết tuyết'],
    'Hiện tượng thác lũ electron: Electron tự do được gia tốc va chạm làm ion hóa hàng loạt phân tử khí trung hòa.'
  ),
  createItem(
    154, 'sim-thpt-34', 'Hiện tượng dính ướt & Hiện tượng mao dẫn trong ống nhỏ',
    'Quan sát hiện tượng mao dẫn: Cắm ống thủy tinh đường kính trong càng nhỏ vào cốc nước thì cột nước dâng lên càng cao.',
    ['Bước 1: Cắm đồng thời 3 ống mao dẫn có bán kính trong r1 = 1mm, r2 = 0.5mm, r3 = 0.2mm vào chậu nước.', 'Bước 2: Nước dính ướt thành thủy tinh tạo mặt khum lõm.', 'Bước 3: Lực căng bề mặt kéo cột nước dâng cao trong ống; ống r3 dâng cao nhất.', 'Bước 4: Kiểm chứng công thức Jurin: Chiều cao cột chất lỏng h = 2σ / (ρ.g.r).'],
    'Vật lí 10', 'Lớp 10', 'Bài 34: Hiện tượng căng bề mặt và Mao dẫn', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Bán kính ống mao dẫn r & Chiều cao cột nước h', false, undefined,
    ['Hệ số căng mặt ngoài σ', 'Bán kính mao dẫn r (mm)', 'Độ cao dâng Jurin h'],
    'Lực hút dính ướt giữa phân tử nước và thủy tinh lớn hơn lực hút cố kết giữa các phân tử nước với nhau.'
  ),
  createItem(
    155, 'sim-thpt-35', 'Hiệu ứng Doppler âm thanh khi nguồn âm chuyển động',
    'Giải thích tại sao tiếng còi xe cấp cứu khi tiến lại gần có cao độ cao hơn, khi chạy ra xa nghe trầm hẳn xuống.',
    ['Bước 1: Chiếc xe cứu thương phát còi có tần số cố định f0 = 800 Hz.', 'Bước 2: Khi xe đứng yên: Các mặt sóng hình tròn đồng tâm lan truyền đều đặn.', 'Bước 3: Cho xe chạy về phía trước với vận tốc v = 72 km/h (20 m/s): Các mặt sóng phía trước bị dồn ép sít sao.', 'Bước 4: Người quan sát phía trước nghe tần số cao f\' = 850 Hz; người phía sau nghe tần số thấp f" = 755 Hz.'],
    'Vật lí 11', 'Lớp 11', 'Bài 9: Sóng âm & Hiệu ứng Doppler', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Vận tốc nguồn âm v & Tần số cảm nhận f\'', false, undefined,
    ['Tần số nguồn f0', 'Tần số quan sát f\' = f0 . v_âm / (v_âm - v_nguồn)'],
    'Sự chuyển động tương đối làm thay đổi khoảng cách giữa các đỉnh sóng liên tiếp đi tới máy thu.'
  ),
  createItem(
    156, 'sim-thpt-36', 'Sự phân cực ánh sáng qua hai kính lọc Polaroid',
    'Chứng minh sóng ánh sáng là sóng ngang: Hai kính lọc phân cực đặt vuông góc trục quang học chặn hoàn toàn chùm ánh sáng.',
    ['Bước 1: Chiếu chùm ánh sáng tự nhiên qua kính lọc phân cực thứ nhất P1: Ánh sáng trở thành phân cực thẳng.', 'Bước 2: Đặt kính phân cực thứ hai P2 phía sau song song trục với P1: Ánh sáng truyền qua 100%.', 'Bước 3: Xoay kính P2 một góc α từ 0° đến 90°: Cường độ sáng giảm dần theo định luật Malus I = I0.cos²(α).', 'Bước 4: Khi góc xoay α = 90°: Hai trục vuông góc nhau triệt tiêu hoàn toàn chùm ánh sáng (tối đen).'],
    'Vật lí 12', 'Lớp 12', 'Bài 11: Sự phân cực của ánh sáng', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Góc xoay kính phân cực α (°)', false, undefined,
    ['Định luật Malus I = I0.cos²(α)', 'Sóng ánh sáng là sóng ngang'],
    'Véc-tơ cường độ điện trường E luôn dao động vuông góc với phương truyền sóng ánh sáng.'
  ),
  createItem(
    157, 'sim-thpt-37', 'Giao thoa ánh sáng trắng trên màng mỏng xà phòng',
    'Giải thích màu sắc sặc sỡ trên bong bóng xà phòng và váng dầu: Giao thoa giữa tia phản xạ mặt trên và mặt dưới của màng mỏng.',
    ['Bước 1: Tạo một màng xà phòng mỏng dựng đứng trên khung dây kim loại.', 'Bước 2: Dưới tác dụng của trọng lực, màng nước chảy dồn xuống đáy tạo thành nêm mỏng có độ dày d tăng dần từ trên xuống.', 'Bước 3: Chiếu chùm ánh sáng trắng vào màng: Xuất hiện các vân màu cầu vồng nằm ngang rực rỡ.', 'Bước 4: Đỉnh trên cùng của màng quá mỏng (d << λ) xuất hiện dải tối đen trước khi màng vỡ.'],
    'Vật lí 12', 'Lớp 12', 'Bài 12: Giao thoa màng mỏng', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Độ dày màng mỏng d (nm)', false, undefined,
    ['Hiệu quang trình ΔL = 2n.d + λ/2', 'Màu sắc giao thoa bù trừ'],
    'Hiện tượng lật pha π khi phản xạ tại môi trường chiết quang hơn kết hợp độ dày biến thiên sinh giao thoa màu sắc.'
  ),
  createItem(
    158, 'sim-thpt-38', 'Con lắc thuận nghịch & Đo chính xác gia tốc trọng trường g',
    'Sử dụng con lắc Kater có hai mũi dao treo đối diện: Điều chỉnh quả nặng để hai chu kỳ dao động thuận và nghịch trùng khớp.',
    ['Bước 1: Treo con lắc tại mũi dao thứ nhất O1, đo chu kỳ T1 = 2.0042 s.', 'Bước 2: Lộn ngược con lắc treo tại mũi dao thứ hai O2, đo chu kỳ T2 = 2.0125 s.', 'Bước 3: Tinh chỉnh vị trí quả nặng con chạy trên thanh kim loại cho đến khi T1 = T2 = T0 = 2.0068 s.', 'Bước 4: Áp dụng công thức con lắc đơn tương đương tính ra g = 4π².L / T0² với sai số cực nhỏ 10⁻⁴.'],
    'Vật lí 10/11', 'Lớp 10/11', 'Bài: Dao động con lắc vật lý Kater', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Vị trí quả nặng con chạy & Chu kỳ T1, T2', false, undefined,
    ['Khoảng cách hai trục quay L', 'Chu kỳ thuận nghịch trùng khớp T0', 'Gia tốc g'],
    'Định lý Huygens về con lắc vật lý: Điểm treo và tâm dao động có tính đối xứng thuận nghịch qua lại.'
  ),
  createItem(
    159, 'sim-thpt-39', 'Đo momen quán tính của đĩa tròn và trụ rỗng',
    'Khảo sát định luật II Newton cho chuyển động quay M = I.γ: Momen quán tính của trụ rỗng (m.R²) lớn hơn đĩa đặc (1/2 m.R²).',
    ['Bước 1: Cho đĩa tròn đặc khối lượng m, bán kính R lăn không trượt xuống dốc nghiêng.', 'Bước 2: Cho một trụ rỗng có cùng khối lượng m và bán kính R lăn xuống cùng con dốc.', 'Bước 3: Quan sát đĩa đặc luôn lao xuống chân dốc trước trụ rỗng.', 'Bước 4: Giải thích: Trụ rỗng có toàn bộ khối lượng ở xa trục nên mômen quán tính lớn hơn, tích lũy nhiều động năng quay hơn.'],
    'Vật lí 10', 'Lớp 10', 'Bài: Động học và Động lực học vật rắn quay', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Thả lăn đồng thời đĩa đặc và trụ rỗng', false, undefined,
    ['Momen quán tính I = ∫ r².dm', 'Gia tốc góc γ = M / I'],
    'Mômen quán tính đặc trưng cho mức quán tính của vật thể trong chuyển động quay quanh trục.'
  ),
  createItem(
    160, 'sim-thpt-40', 'Dao động tắt dần & Hiện tượng cộng hưởng cơ',
    'Khảo sát con lắc chịu lực cản nhớt: Biên độ suy giảm theo hàm mũ e^(-γt) và hiện tượng biên độ dao động vọt cực đại khi f_ngoài = f_riêng.',
    ['Bước 1: Kích thích con lắc lò xo dao động trong không khí, nước và dầu nhờn.', 'Bước 2: Quan sát trong dầu nhờn biên độ tắt nhanh nhất sau 2 chu kỳ.', 'Bước 3: Tác dụng một ngoại lực tuần hoàn F = F0.cos(2πft) lên con lắc.', 'Bước 4: Quét tần số f: Tại f = f0 biên độ dao động vọt lên khổng lồ (Cộng hưởng cơ học phá vỡ cầu).'],
    'Vật lí 11', 'Lớp 11', 'Bài 4: Dao động tắt dần và Dao động cưỡng bức', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Tần số ngoại lực f & Biên độ cộng hưởng A', false, undefined,
    ['Hệ số cản nhớt γ', 'Tần số cộng hưởng cơ f0', 'Đồ thị biên độ vọt đỉnh'],
    'Cộng hưởng xảy ra khi tần số ngoại lực cưỡng bức trùng với tần số dao động tự do riêng của hệ thống.'
  ),
  createItem(
    161, 'sim-thpt-41', 'Khí thực & Phương trình trạng thái Van der Waals',
    'Khảo sát độ sai lệch của khí thực so với khí lý tưởng ở áp suất cao và nhiệt độ thấp do thể tích bản thân phân tử b và lực hút phân tử a.',
    ['Bước 1: Nén khí ở áp suất cao P > 100 atm: Đồ thị đường cong P-V sai lệch rõ rệt so với định luật Boyle.', 'Bước 2: Bật thông số hiệu chỉnh thể tích b (thể tích riêng bị chiếm chỗ bởi các phân tử).', 'Bước 3: Bật thông số hiệu chỉnh áp suất a/V² (lực hút liên phân tử Van der Waals).', 'Bước 4: Khớp chính xác phương trình (P + a/V²)(V - b) = R.T với dữ liệu thực nghiệm khí CO2.'],
    'Vật lí 12', 'Lớp 12', 'Bài: Khí thực và Chuyển pha chất khí', 'SGK Kết nối tri thức',
    'thpt', 'pattern-code-inspector', 'Phương trình Van der Waals & Khí thực', false, undefined,
    ['Hằng số a (lực hút liên phân tử)', 'Hằng số b (thể tích riêng phân tử)', 'Điểm tới hạn'],
    'Phân tử khí thực có kích thước hữu hạn và có lực hút tĩnh điện tương hỗ lẫn nhau ở khoảng cách gần.'
  ),
  createItem(
    162, 'sim-thpt-42', 'Hiệu ứng nhiệt của phản ứng & Nhiệt tạo thành chuẩn',
    'Đo nhiệt lượng tỏa ra bằng nhiệt lượng kế để tính biến thiên entanpi chuẩn ΔrH°298 của phản ứng trung hòa HCl + NaOH.',
    ['Bước 1: Rót 50ml HCl 1M (25°C) và 50ml NaOH 1M (25°C) vào bình nhiệt lượng kế xốp cách nhiệt.', 'Bước 2: Đậy nắp kín, khuấy đều và theo dõi nhiệt độ tăng vọt lên 31.7°C.', 'Bước 3: Tính nhiệt lượng tỏa ra q = m.c.Δt = 100g x 4.18 J/g.K x 6.7 K = 2800 J.', 'Bước 4: Tính biến thiên entanpi chuẩn của phản ứng: ΔrH°298 = -57.3 kJ/mol (phản ứng tỏa nhiệt).'],
    'Hóa học 10', 'Lớp 10', 'Bài 17: Biến thiên Entanpi trong phản ứng hóa học', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Độ tăng nhiệt kế Δt & Biến thiên entanpi ΔH', false, undefined,
    ['Entanpi tạo thành chuẩn ΔfH°', 'Phản ứng tỏa nhiệt ΔrH° < 0'],
    'Định luật Hess: Biến thiên entanpi của phản ứng chỉ phụ thuộc trạng thái đầu và cuối, không phụ thuộc đường đi.'
  ),
  createItem(
    163, 'sim-thpt-43', 'Ăn mòn điện hóa học & Bảo vệ catot cho vỏ tàu biển',
    'Mô phỏng cơ chế gắn các tấm kẽm Zn lên vỏ tàu biển bằng thép (Fe): Kẽm có tính khử mạnh hơn bị ăn mòn thay thế để bảo vệ sắt.',
    ['Bước 1: Nhúng tấm thép vào chậu nước biển (dung dịch điện ly NaCl): Sắt bị ăn mòn rỉ sét nhanh chóng.', 'Bước 2: Hàn một khối kẽm Zn kim loại tiếp xúc trực tiếp với tấm thép.', 'Bước 3: Quan sát pin điện hóa hình thành: Kẽm đóng vai trò anot bị oxy hóa tan ra (Zn -> Zn²⁺ + 2e).', 'Bước 4: Tấm thép đóng vai trò catot được bảo vệ nguyên vẹn sáng bóng vĩnh viễn.'],
    'Hóa học 12', 'Lớp 12', 'Bài 14: Ăn mòn kim loại và Phương pháp chống ăn mòn', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Thời gian ăn mòn & Sự tiêu hao khối kẽm', false, undefined,
    ['Phương pháp điện cực hy sinh', 'Anot kẽm Zn tan', 'Catot sắt Fe được bảo vệ'],
    'Bảo vệ bằng phương pháp điện hóa: Kim loại có thế điện cực chuẩn âm hơn bị oxy hóa ưu tiên.'
  ),
  createItem(
    164, 'sim-thpt-44', 'Truyền xung thần kinh trên sợi trục có bao miêlin',
    'So sánh tốc độ dẫn truyền điện thế hoạt động: Sợi trục không có bao miêlin truyền liên tục chậm chạp (1 m/s), có bao miêlin nhảy cóc siêu nhanh (120 m/s).',
    ['Bước 1: Kích thích một xung điện vào đầu sợi trục thần kinh không có bao miêlin.', 'Bước 2: Quan sát dòng ion Na+ và K+ đóng mở liên tục qua từng điểm màng tế bào với tốc độ chậm chạp.', 'Bước 3: Chuyển sang sợi trục có bao miêlin cách điện ngắt quãng bởi các eo Ranvier.', 'Bước 4: Xung điện nhảy cóc thần tốc từ eo Ranvier này sang eo Ranvier khác với tốc độ gấp 100 lần.'],
    'Sinh học 11', 'Lớp 11', 'Bài 29: Điện thế hoạt động và Dẫn truyền xung thần kinh', 'SGK Kết nối tri thức',
    'thpt', 'pattern-time-control', 'Dẫn truyền xung thần kinh nhảy cóc', false, undefined,
    ['Kênh ion Na+/K+ phụ thuộc điện thế', 'Bao miêlin cách điện', 'Dẫn truyền nhảy cóc Saltatory'],
    'Bao miêlin giàu lipid cách điện triệt để ngăn dòng rỉ ion, ép điện thế hoạt động tái sinh tại các eo Ranvier.'
  ),
  createItem(
    165, 'sim-thpt-45', 'Cấu trúc không gian bậc 1, 2, 3, 4 của phân tử Protein',
    'Mô phỏng 3D quá trình cuộn gập chuỗi polypeptide: Từ chuỗi axit amin thẳng hình thành xoắn alpha, gấp nếp beta và khối cầu chức năng.',
    ['Bước 1: Xem cấu trúc bậc 1: Trình tự các axit amin liên kết với nhau bằng liên kết peptit.', 'Bước 2: Hình thành cấu trúc bậc 2: Liên kết hydro giữa các liên kết peptit tạo xoắn alpha và phiến gấp beta.', 'Bước 3: Cuộn gập cấu trúc bậc 3: Cầu đisunfua -S-S-, tương tác kỵ nước và liên kết ion tạo khối 3D.', 'Bước 4: Ghép 4 chuỗi tạo cấu trúc bậc 4 hoàn chỉnh của phân tử huyết sắc tố Hemoglobin.'],
    'Sinh học 10', 'Lớp 10', 'Bài 5: Các phân tử sinh học trong tế bào', 'SGK Kết nối tri thức',
    'thpt', 'pattern-drag-drop', 'Xoay 3D cấu trúc cuộn gập protein', false, undefined,
    ['Liên kết peptit', 'Xoắn alpha & Phiến beta', 'Cầu disunfua', 'Cấu hình 3D hoạt tính'],
    'Trình tự axit amin bậc 1 chứa đựng toàn bộ thông tin mã hóa hướng dẫn cách chuỗi protein tự cuộn gập 3D.'
  ),
  createItem(
    166, 'sim-thpt-46', 'Hô hấp tế bào: Đường phân, chu trình Crep & Chuỗi truyền e',
    'Theo dõi dòng phân rã 1 phân tử Glucose qua 3 giai đoạn sinh hóa giải phóng trọn vẹn 30 - 32 phân tử ATP năng lượng.',
    ['Bước 1: Giai đoạn đường phân ở tế bào chất: 1 Glucose bẻ đôi thành 2 Pyruvate thu 2 ATP và 2 NADH.', 'Bước 2: Oxy hóa Pyruvate và chu trình Crep trong chất nền ti thể: Giải phóng khí CO2 và thu 2 ATP, 8 NADH, 2 FADH2.', 'Bước 3: Chuỗi truyền electron hô hấp trên màng trong ti thể: Oxy đóng vai trò là chất nhận electron cuối cùng tạo H2O.', 'Bước 4: Bơm proton hóa thẩm thẩm thấu sinh ra 26-28 ATP qua enzym ATP Synthase.'],
    'Sinh học 10', 'Lớp 10', 'Bài 14: Quá trình phân giải và Hô hấp tế bào', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Dòng năng lượng ATP trong ti thể', false, undefined,
    ['C6H12O6 + 6O2 -> 6CO2 + 6H2O', 'Hiệu suất thu nhận 32 ATP'],
    'Thuyết hóa thẩm thấu Mitchell: Chênh lệch nồng độ proton qua màng là động cơ dẫn động quay turbine ATP Synthase.'
  ),
  createItem(
    167, 'sim-thpt-47', 'Máy phát điện xoay chiều 3 pha & Từ trường quay',
    'Mô phỏng 3 cuộn dây đặt lệch nhau 120° trên stato: Nam châm quay ở rôto sinh ra hệ 3 dòng điện xoay chiều lệch pha 2π/3.',
    ['Bước 1: Bố trí 3 cuộn dây giống hệt nhau gắn cố định trên stato lệch nhau góc 120°.', 'Bước 2: Nam châm điện rôto quay tròn đều với tốc độ n vòng/giây.', 'Bước 3: Từ thông qua 3 cuộn dây biến thiên hình sin lệch pha nhau 2π/3.', 'Bước 4: Ba suất điện động cảm ứng sinh ra hệ thống điện 3 pha cung cấp hiệu quả cho toàn bộ lưới điện quốc gia.'],
    'Vật lí 12', 'Lớp 12', 'Bài 17: Máy phát điện xoay chiều ba pha', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Tốc độ quay rôto & Đồ thị 3 pha e1, e2, e3', false, undefined,
    ['Góc lệch pha 2π/3 (120°)', 'Từ trường quay tổng hợp', 'Đấu dây hình sao và tam giác'],
    'Tổng véc-tơ cảm ứng từ của 3 cuộn dây lệch nhau 120° tạo nên từ trường quay có độ lớn không đổi.'
  ),
  createItem(
    168, 'sim-thpt-48', 'Máy biến áp & Truyền tải điện năng đi xa',
    'Khảo sát nguyên lý U1 / U2 = N1 / N2 và chứng minh tăng điện áp lên 10 lần giúp giảm hao phí nhiệt đường dây 100 lần.',
    ['Bước 1: Máy biến áp có số vòng cuộn sơ cấp N1 = 500 vòng, cuộn thứ cấp N2 = 5000 vòng (tăng áp 10 lần).', 'Bước 2: Cấp điện áp xoay chiều U1 = 220V: Điện áp thứ cấp đo được U2 = 2200V.', 'Bước 3: Truyền tải điện qua đường dây có điện trở R = 10 Ω: Công suất hao phí ΔP = P².R / U².', 'Bước 4: Khi tăng áp U lên gấp 10 lần: Công suất hao phí tỏa nhiệt trên đường dây giảm đúng 100 lần.'],
    'Vật lí 12', 'Lớp 12', 'Bài 16: Máy biến áp và Truyền tải điện năng', 'SGK Kết nối tri thức',
    'thpt', 'pattern-slider', 'Tỷ số vòng dây N2/N1 & Công suất hao phí ΔP', false, undefined,
    ['Tỷ số biến áp U1/U2 = N1/N2 = I2/I1', 'Hao phí đường dây ΔP ~ 1/U²'],
    'Từ thông biến thiên chung chạy trong lõi thép khép kín cảm ứng suất điện động tỷ lệ thuận với số vòng dây.'
  ),
  createItem(
    169, 'sim-thpt-49', 'Sóng điện từ & Sự truyền sóng trong viễn thông',
    'Mô phỏng sóng điện từ lan truyền trong không gian: Véc-tơ điện trường E và véc-tơ cảm ứng từ B luôn vuông góc với nhau và vuông góc phương truyền.',
    ['Bước 1: Dao động điện tích trong anten phát bức xạ sóng điện từ truyền ra không gian với vận tốc ánh sáng c = 3.10⁸ m/s.', 'Bước 2: Quan sát véc-tơ điện trường E dao động theo trục thẳng đứng, véc-tơ B dao động theo trục nằm ngang.', 'Bước 3: Cả hai dao động luôn đồng pha và vuông góc phương truyền tia Ox tạo tam diện thuận.', 'Bước 4: Anten thu đặt cùng phương với véc-tơ E hấp thụ năng lượng sóng tái tạo tín hiệu âm thanh/hình ảnh.'],
    'Vật lí 12', 'Lớp 12', 'Bài 22: Sóng điện từ và Thông tin liên lạc', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Trường điện từ dao động 3D lan truyền', false, undefined,
    ['Véc-tơ E vuông góc véc-tơ B', 'Vận tốc sóng c = 3.10⁸ m/s', 'Phương trình Maxwell'],
    'Trường điện từ biến thiên theo không gian và thời gian tự duy trì và lan truyền không cần môi trường vật chất.'
  ),
  createItem(
    170, 'sim-thpt-50', 'Phản ứng phân hạch Urani & Phản ứng nhiệt hạch',
    'Mô phỏng phản ứng dây chuyền hạt nhân U-235 hấp thụ neutron chậm nổ tung giải phóng 200 MeV và 3 neutron kích hoạt lò phản ứng hạt nhân.',
    ['Bước 1: Bắn một hạt neutron chậm nhiệt vào hạt nhân Uranium U-235.', 'Bước 2: Hạt nhân U-236 kích thích dao động mạnh và phân hạch nứt đôi thành Kr-92 và Ba-141.', 'Bước 3: Giải phóng năng lượng khổng lồ 200 MeV cùng 3 hạt neutron nhanh mới.', 'Bước 4: Dùng thanh điều khiển bằng Cadmi hấp thụ bớt neutron để hệ số nhân k = 1 (duy trì phản ứng dây chuyền êm dịu trong nhà máy điện nguyên tử).'],
    'Vật lí 12', 'Lớp 12', 'Bài 38: Phản ứng phân hạch và Phản ứng nhiệt hạch', 'SGK Kết nối tri thức',
    'thpt', 'pattern-particle-sandbox', 'Phản ứng dây chuyền hạt nhân & Thanh điều khiển', false, undefined,
    ['Độ hụt khối Δm', 'Hệ số nhân neutron k', 'Năng lượng tỏa ra E = Δm.c² ~ 200 MeV'],
    'Định luật tương đương khối lượng - năng lượng Einstein E = m.c²: Độ hụt khối chuyển hóa thành động năng các mảnh phân hạch.'
  )
];

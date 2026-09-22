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
    accentColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
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
    accentColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
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
    accentColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
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
    accentColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
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
    accentColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
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
    accentColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  }
];

export const SIMULATION_CATALOG: SimulationCatalogItem[] = [
  // ==========================================
  // CẤP 1: MẦM NON (3 - 6 TUỔI)
  // ==========================================
  {
    stt: 1,
    id: 'sim-mn-01',
    title: 'Hòa trộn màu sắc ánh sáng & Khám phá thị giác',
    purpose: 'Giúp trẻ hiểu cách từ 3 màu cơ bản (Đỏ, Xanh lá, Xanh lam) có thể pha trộn để tạo ra mọi màu sắc rực rỡ trong tự nhiên và ánh sáng trắng tinh khiết.',
    procedure: [
      'Bước 1: Bật nguồn 3 bóng đèn màu Đỏ (Red), Lục (Green), Lam (Blue) lên màn chiếu trắng.',
      'Bước 2: Kéo thanh điều chỉnh độ sáng của từng nguồn màu để quan sát giao thoa tại vùng trung tâm.',
      'Bước 3: Pha trộn Đỏ + Lam để tạo ra màu Tím thần kỳ; pha Đỏ + Lục để tạo màu Vàng.',
      'Bước 4: Đẩy cả 3 nguồn sáng lên mức tối đa để khám phá hiện tượng ánh sáng trắng xuất hiện.'
    ],
    extractedFrom: {
      subject: 'Khám phá Khoa học',
      grade: 'Mẫu giáo 4 - 5 tuổi',
      lesson: 'Chủ đề: Thế giới màu sắc quanh bé',
      textbook: 'Chương trình Giáo dục Mầm non mới'
    },
    levelId: 'mam-non',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển biến số thời gian thực (Slider)',
    hasLiveSim: true,
    liveSimId: 'sim-color-mixer',
    keyVariables: ['Cường độ ánh sáng Đỏ (0-255)', 'Cường độ ánh sáng Lục (0-255)', 'Cường độ ánh sáng Lam (0-255)'],
    firstPrinciplesNote: 'Mắt người có 3 tế bào nón thị giác. Não bộ tổng hợp tín hiệu từ 3 kênh này thành quang phổ màu.'
  },
  {
    stt: 2,
    id: 'sim-mn-02',
    title: 'Thí nghiệm Vật chìm - Vật nổi trong bể nước',
    purpose: 'Hình thành trực giác sơ khai về khối lượng riêng và lực đẩy của nước: vật nặng/đặc sẽ chìm xuống đáy, vật nhẹ/rỗng sẽ nổi bồng bềnh.',
    procedure: [
      'Bước 1: Chọn các đồ vật từ hộp đồ chơi: quả bóng nhựa, hòn sỏi, chiếc lá cây, chìa khóa kim loại, khối gỗ xốp.',
      'Bước 2: Dự đoán đồ vật nào sẽ chìm, đồ vật nào sẽ nổi.',
      'Bước 3: Dùng chuột kéo từng đồ vật thả vào bể nước trong suốt.',
      'Bước 4: Quan sát bong bóng nước sủi lên và vị trí dừng lại của vật (đáy bể, lơ lửng, hay mặt nước).'
    ],
    extractedFrom: {
      subject: 'Khám phá Tự nhiên',
      grade: 'Mẫu giáo 5 - 6 tuổi',
      lesson: 'Chủ đề: Khám phá nước và thế giới đồ vật',
      textbook: 'Chương trình Giáo dục Mầm non mới'
    },
    levelId: 'mam-non',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Kéo - Thả vật thể (Drag & Drop)',
    hasLiveSim: false,
    keyVariables: ['Loại vật liệu', 'Độ nổi/chìm', 'Mức nước dâng'],
    firstPrinciplesNote: 'Khái niệm tiền thân của lực đẩy Archimedes: Lực đẩy của nước thắng hay thua trọng lượng của vật.'
  },
  {
    stt: 3,
    id: 'sim-mn-03',
    title: 'Cầu bập bênh thăng bằng & So sánh nặng nhẹ',
    purpose: 'Trẻ khám phá khái niệm cân bằng và tương quan trọng lượng: bên nào nặng hơn sẽ hạ xuống thấp, bên nào nhẹ hơn sẽ nâng lên cao.',
    procedure: [
      'Bước 1: Đặt các con vật đồ chơi ngộ nghĩnh (voi con, thỏ trắng, gấu bông) lên hai đầu cầu bập bênh.',
      'Bước 2: Quan sát bập bênh nghiêng về phía con vật nặng hơn.',
      'Bước 3: Thêm số lượng thỏ bông lên một đầu cho đến khi cầu bập bênh nằm ngang thăng bằng tuyệt đối.',
      'Bước 4: Thử dịch chuyển con vật lại gần hoặc ra xa trục quay giữa bập bênh để nhận biết sức nâng thay đổi.'
    ],
    extractedFrom: {
      subject: 'Làm quen với Toán',
      grade: 'Mẫu giáo 4 - 5 tuổi',
      lesson: 'Chủ đề: So sánh to - nhỏ, nặng - nhẹ, cao - thấp',
      textbook: 'Chương trình Giáo dục Mầm non mới'
    },
    levelId: 'mam-non',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Kéo - Thả & Cân bằng (Drag & Drop)',
    hasLiveSim: false,
    keyVariables: ['Khối lượng hai bên', 'Góc nghiêng đòn bẩy', 'Vị trí khoảng cách đến trục'],
    firstPrinciplesNote: 'Tiền thân của định luật mômen lực: Cân bằng không chỉ phụ thuộc khối lượng mà còn phụ thuộc khoảng cách.'
  },
  {
    stt: 4,
    id: 'sim-mn-04',
    title: 'Chiếc bóng tinh nghịch dưới nguồn sáng',
    purpose: 'Khám phá hiện tượng đổ bóng: Khi vật cản ánh sáng, bóng đen xuất hiện phía sau; kéo vật lại gần ngọn đèn thì bóng to lên, ra xa thì bóng nhỏ lại.',
    procedure: [
      'Bước 1: Bật ngọn đèn pin chiếu vào bức tường trắng trong phòng tối.',
      'Bước 2: Đặt một chú khủng long đồ chơi vào giữa nguồn sáng và bức tường.',
      'Bước 3: Dùng chuột kéo chú khủng long tiến lại gần ngọn đèn pin và quan sát chiếc bóng trên tường phóng to khổng lồ.',
      'Bước 4: Kéo chú khủng long lùi dần về phía bức tường và quan sát chiếc bóng thu nhỏ lại sắc nét.'
    ],
    extractedFrom: {
      subject: 'Khám phá Khoa học',
      grade: 'Mẫu giáo 5 - 6 tuổi',
      lesson: 'Chủ đề: Nguồn sáng và chiếc bóng diệu kỳ',
      textbook: 'Chương trình Giáo dục Mầm non mới'
    },
    levelId: 'mam-non',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển biến số khoảng cách (Slider)',
    hasLiveSim: false,
    keyVariables: ['Khoảng cách đèn pin - vật thể', 'Kích thước bóng đổ', 'Góc chiếu sáng'],
    firstPrinciplesNote: 'Định luật truyền thẳng của ánh sáng: Ánh sáng không bẻ cong qua vật cản, tạo nên vùng tối hình học.'
  },
  {
    stt: 5,
    id: 'sim-mn-05',
    title: 'Âm thanh trầm bổng từ những chiếc cốc nước thủy tinh',
    purpose: 'Trẻ cảm nhận sự liên hệ giữa lượng nước trong cốc và cao độ âm thanh phát ra khi gõ: cốc nhiều nước tiếng trầm ấm, cốc ít nước tiếng trong trẻo vút cao.',
    procedure: [
      'Bước 1: Sắp xếp 5 chiếc ly thủy tinh giống hệt nhau thành hàng ngang.',
      'Bước 2: Rót nước vào các ly theo mức tăng dần từ vơi đến đầy (tương ứng các nốt Đồ - Rê - Mi - Pha - Son).',
      'Bước 3: Dùng chiếc đũa nhỏ gõ nhẹ vào từng thành ly để lắng nghe âm thanh phát ra.',
      'Bước 4: Thử gõ liên hoàn các ly để tạo thành một giai điệu bài hát vui tươi thiếu nhi.'
    ],
    extractedFrom: {
      subject: 'Cảm thụ Âm nhạc & Khám phá',
      grade: 'Mẫu giáo 5 - 6 tuổi',
      lesson: 'Chủ đề: Âm thanh vui nhộn xung quanh bé',
      textbook: 'Chương trình Giáo dục Mầm non mới'
    },
    levelId: 'mam-non',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Tương tác rót nước & Gõ âm thanh',
    hasLiveSim: false,
    keyVariables: ['Cột nước trong cốc', 'Tần số rung động', 'Cao độ âm thanh (Pitch)'],
    firstPrinciplesNote: 'Sự dao động cơ học của vật thể: Cột không khí và khối lượng nước dao động quyết định tần số âm f.'
  },

  // ==========================================
  // CẤP 2: TIỂU HỌC (LỚP 1 - LỚP 5)
  // ==========================================
  {
    stt: 6,
    id: 'sim-th-01',
    title: 'Cân đĩa thăng bằng & Bản chất Phân số đại số',
    purpose: 'Xóa tan cảm giác trừu tượng khi học phân số: Thể hiện dấu bằng (=) chính là chiếc cân thăng bằng, phân số là các phần chia đều của một đơn vị bánh trọn vẹn.',
    procedure: [
      'Bước 1: Chọn đĩa bánh bên trái có 1 chiếc bánh trọn vẹn (giá trị 1).',
      'Bước 2: Kéo các lát bánh phân số 1/2, 1/4, 1/8 từ khay đựng đặt lên đĩa cân bên phải.',
      'Bước 3: Quan sát kim chỉ cân lệch khi tổng hai bên chưa bằng nhau.',
      'Bước 4: Tiếp tục thêm lát 1/4 và 1/8 để thấy cân trở về trạng thái nằm ngang thăng bằng: 1 = 1/2 + 1/4 + 1/4.'
    ],
    extractedFrom: {
      subject: 'Toán học 4',
      grade: 'Lớp 4',
      lesson: 'Bài 53: Khái niệm phân số & Phân số bằng nhau',
      textbook: 'SGK Toán 4 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'tieu-hoc',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Kéo - Thả linh kiện & Cân bằng (Drag & Drop)',
    hasLiveSim: true,
    liveSimId: 'sim-balance-fraction',
    keyVariables: ['Khối lượng đĩa trái (LHS)', 'Khối lượng đĩa phải (RHS)', 'Góc lệch kim cân'],
    firstPrinciplesNote: 'Phương trình toán học là một cái cân. Hai vế phải bảo toàn giá trị lượng số tuyệt đối.'
  },
  {
    stt: 7,
    id: 'sim-th-02',
    title: 'Vòng tuần hoàn của nước trong tự nhiên',
    purpose: 'Mô phỏng 3 trạng thái của nước (Rắn - Lỏng - Khí) và các quá trình bay hơi, ngưng tụ, tạo mây và mưa theo chu trình nhiệt độ Mặt Trời.',
    procedure: [
      'Bước 1: Tăng cường độ chiếu sáng Mặt Trời chiếu rọi xuống mặt biển xanh.',
      'Bước 2: Quan sát các hạt phân tử nước trên bề mặt nhận nhiệt năng, chuyển động nhanh và bay hơi bay lên không trung.',
      'Bước 3: Hạ nhiệt độ tầng khí quyển trên cao để quan sát hơi nước ngưng tụ thành các đám mây trắng rồi chuyển sang mây đen.',
      'Bước 4: Nhấn nút tạo mưa để nước rơi xuống núi đồi, tạo thành sông suối rồi chảy ngược về biển cả.'
    ],
    extractedFrom: {
      subject: 'Khoa học 4',
      grade: 'Lớp 4',
      lesson: 'Bài 2: Sự chuyển thể của nước và vòng tuần hoàn của nước',
      textbook: 'SGK Khoa học 4 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'tieu-hoc',
    interactionPatternId: 'pattern-particle-sandbox',
    interactionPatternName: 'Hệ hạt vi mô & Điều khiển nhiệt độ (Sandbox)',
    hasLiveSim: false,
    keyVariables: ['Nhiệt độ môi trường (°C)', 'Tốc độ bay hơi', 'Lượng mưa ngưng tụ'],
    firstPrinciplesNote: 'Bảo toàn vật chất: Nước không tự sinh ra hay mất đi, chỉ biến đổi trạng thái qua trao đổi nhiệt.'
  },
  {
    stt: 8,
    id: 'sim-th-03',
    title: 'Lắp ráp mạch điện kín thắp sáng bóng đèn pin',
    purpose: 'Học sinh nhận biết điều kiện để có dòng điện chạy qua: phải tạo thành một mạch kín liên tục từ cực dương qua tải tiêu thụ về cực âm của nguồn điện.',
    procedure: [
      'Bước 1: Kéo một viên pin 1.5V, một bóng đèn dây tóc và công tắc K ra bàn thí nghiệm.',
      'Bước 2: Dùng chuột kéo các sợi dây điện nối cực dương của pin vào một cực của bóng đèn.',
      'Bước 3: Nối cực còn lại của bóng đèn qua công tắc K rồi nối trở lại cực âm của viên pin.',
      'Bước 4: Nhấn đóng công tắc K: Quan sát mạch kín được thiết lập và bóng đèn rực sáng.'
    ],
    extractedFrom: {
      subject: 'Khoa học 5',
      grade: 'Lớp 5',
      lesson: 'Bài 14: Năng lượng điện và Mạch điện thắp sáng đơn giản',
      textbook: 'SGK Khoa học 5 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'tieu-hoc',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Kéo - Thả & Lắp ráp linh kiện (Drag & Drop)',
    hasLiveSim: false,
    keyVariables: ['Trạng thái công tắc K (Đóng/Mở)', 'Điện áp pin (V)', 'Độ sáng bóng đèn'],
    firstPrinciplesNote: 'Điện tích chỉ có thể dịch chuyển liên tục tuần hoàn khi có một con đường dẫn khép kín trọn vẹn.'
  },
  {
    stt: 9,
    id: 'sim-th-04',
    title: 'Đòn bẩy & Mặt phẳng nghiêng sơ cấp',
    purpose: 'Chứng minh nguyên lý "Được lợi về lực thì thiệt hại về đường đi": Dùng đòn bẩy hoặc mặt phẳng nghiêng giúp nâng vật nặng dễ dàng hơn nhiều so với nâng thẳng đứng.',
    procedure: [
      'Bước 1: Đặt một tảng đá nặng 50kg lên mặt phẳng nghiêng có góc dốc có thể thay đổi.',
      'Bước 2: Kéo thanh trượt giảm góc nghiêng của tấm ván để quan sát lực kéo cần thiết F giảm đi rõ rệt.',
      'Bước 3: Chuyển sang mô hình đòn bẩy: Dịch điểm tựa O lại gần tảng đá.',
      'Bước 4: Dùng lực tay ấn vào đầu xa của đòn bẩy để nâng tảng đá lên nhẹ nhàng.'
    ],
    extractedFrom: {
      subject: 'Khoa học 5',
      grade: 'Lớp 5',
      lesson: 'Bài 18: Máy cơ đơn giản quanh em (Mặt phẳng nghiêng, đòn bẩy)',
      textbook: 'SGK Khoa học 5 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'tieu-hoc',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển biến số góc dốc & cánh tay đòn',
    hasLiveSim: false,
    keyVariables: ['Góc nghiêng (°)', 'Chiều dài cánh tay đòn (m)', 'Lực kéo tối thiểu F (N)'],
    firstPrinciplesNote: 'Định luật vàng về cơ học: Công nâng cơ học A = F * s luôn bảo toàn khi bỏ qua ma sát.'
  },
  {
    stt: 10,
    id: 'sim-th-05',
    title: 'Khúc xạ ánh sáng qua mặt nước - Hiện tượng chiếc đũa gãy',
    purpose: 'Giải thích tại sao chiếc đũa cắm vào cốc nước lại trông như bị gãy khúc ở mặt phân cách giữa không khí và nước.',
    procedure: [
      'Bước 1: Đặt một chiếc đũa thẳng cắm xiên vào một chiếc cốc rỗng trong suốt.',
      'Bước 2: Nhấn nút rót nước từ từ vào cốc nước.',
      'Bước 3: Quan sát đường đi của các tia sáng phản xạ từ đầu đũa bị bẻ gãy góc khi đi từ nước ra ngoài không khí.',
      'Bước 4: Bật tính năng "Mắt người nhìn" để thấy vị trí ảnh ảo của chiếc đũa bị nâng lên cao hơn so với đáy thực tế.'
    ],
    extractedFrom: {
      subject: 'Khoa học 4',
      grade: 'Lớp 4',
      lesson: 'Bài 11: Ánh sáng và sự truyền ánh sáng qua các chất',
      textbook: 'SGK Khoa học 4 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'tieu-hoc',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Kéo trượt góc tới của tia sáng (Slider)',
    hasLiveSim: false,
    keyVariables: ['Góc tới của tia sáng i', 'Chiết suất môi trường n', 'Độ lệch hình ảnh'],
    firstPrinciplesNote: 'Ánh sáng truyền với vận tốc khác nhau trong các môi trường khác nhau, dẫn tới hiện tượng bẻ gãy tia sáng.'
  },
  {
    stt: 11,
    id: 'sim-th-06',
    title: 'Thước đo phân số & Trục số trực quan',
    purpose: 'Giúp học sinh hình dung phân số như một vị trí chính xác trên trục số thực liên tục, hiểu bản chất của rút gọn và quy đồng mẫu số.',
    procedure: [
      'Bước 1: Chọn một trục số từ 0 đến 1 được chia làm 12 vạch đều nhau.',
      'Bước 2: Di chuyển điểm con trỏ đến vị trí 6/12, hệ thống tự động hiển thị phân số rút gọn tương đương là 1/2.',
      'Bước 3: Thêm một điểm thứ hai tại 2/3 (tức 8/12) và quan sát hệ thống quy đồng mẫu số tự động.',
      'Bước 4: So sánh trực quan độ dài đoạn thẳng từ gốc 0 đến hai điểm để rút ra kết luận 6/12 < 8/12.'
    ],
    extractedFrom: {
      subject: 'Toán học 4',
      grade: 'Lớp 4',
      lesson: 'Bài 56: Rút gọn phân số và Quy đồng mẫu số',
      textbook: 'SGK Toán 4 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'tieu-hoc',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển con trỏ trục số thời gian thực',
    hasLiveSim: false,
    keyVariables: ['Tử số', 'Mẫu số', 'Tọa độ hình học trên trục số x'],
    firstPrinciplesNote: 'Số học và Hình học là hai mặt của một đồng xu: Mọi phân số đều biểu diễn một độ dài hình học chính xác.'
  },

  // ==========================================
  // CẤP 3: THCS (LỚP 6 - LỚP 9)
  // ==========================================
  {
    stt: 12,
    id: 'sim-thcs-01',
    title: 'Phòng Lab Mạch Điện DC & Định Luật Ohm Trực Quan',
    purpose: 'Làm sáng tỏ bản chất của định luật Ohm: Cường độ dòng điện I tỉ lệ thuận với hiệu điện thế U và tỉ lệ nghịch với điện trở R, trực quan hóa dòng trôi electron.',
    procedure: [
      'Bước 1: Mở mạch điện DC gồm nguồn điện biến thiên, biến trở R, ampe kế và bóng đèn dây tóc.',
      'Bước 2: Kéo thanh trượt điện áp U từ 1V lên 24V: Quan sát tốc độ trôi của các electron tăng nhanh và bóng đèn rực sáng.',
      'Bước 3: Tăng giá trị điện trở R từ 2Ω lên 50Ω: Quan sát các electron va chạm nhiều hơn với mạng tinh thể, dòng điện I giảm dần.',
      'Bước 4: Quan sát đồ thị đặc tuyến Volt - Ampe (I theo U) là đường thẳng đi qua gốc tọa độ với độ dốc bằng 1/R.'
    ],
    extractedFrom: {
      subject: 'Khoa học tự nhiên 8',
      grade: 'Lớp 8',
      lesson: 'Bài 23: Tác dụng của dòng điện & Định luật Ohm',
      textbook: 'SGK KHTN 8 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thcs',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển biến số liên tục (Continuous Slider)',
    hasLiveSim: true,
    liveSimId: 'sim-electric-circuit',
    keyVariables: ['Hiệu điện thế U (Volt)', 'Điện trở R (Ohm)', 'Dòng điện I (Ampe)', 'Công suất P (Watt)'],
    firstPrinciplesNote: 'Định luật Ohm I = U/R mô tả sự cân bằng giữa lực điện trường đẩy electron và lực cản va chạm ion mạng.'
  },
  {
    stt: 13,
    id: 'sim-thcs-02',
    title: 'Định luật bảo toàn khối lượng trong phản ứng hóa học',
    purpose: 'Chứng minh định luật Lomonosov - Lavoisier: Tổng khối lượng các chất tham gia phản ứng luôn bằng tổng khối lượng các sản phẩm tạo thành trong bình kín.',
    procedure: [
      'Bước 1: Đặt bình nón chứa dung dịch BaCl2 và ống nghiệm nhỏ chứa Na2SO4 lên cân điện tử có nắp đậy kín.',
      'Bước 2: Ghi lại số chỉ khối lượng ban đầu của cân điện tử (ví dụ: 152.35 gam).',
      'Bước 3: Dùng chuột nhấn nghiêng bình nón để hai dung dịch hòa vào nhau, tạo thành kết tủa trắng BaSO4.',
      'Bước 4: Quan sát số chỉ trên màn hình cân điện tử: Con số vẫn giữ nguyên chính xác 152.35 gam.'
    ],
    extractedFrom: {
      subject: 'Khoa học tự nhiên 8',
      grade: 'Lớp 8',
      lesson: 'Bài 6: Tính theo phương trình hóa học & Bảo toàn khối lượng',
      textbook: 'SGK KHTN 8 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thcs',
    interactionPatternId: 'pattern-poe-challenge',
    interactionPatternName: 'Dự đoán - Thực nghiệm - Kiểm chứng (POE)',
    hasLiveSim: false,
    keyVariables: ['Khối lượng trước phản ứng m1', 'Khối lượng sau phản ứng m2', 'Hiện tượng kết tủa'],
    firstPrinciplesNote: 'Phản ứng hóa học chỉ sắp xếp lại liên kết giữa các nguyên tử; số lượng và loại nguyên tử hoàn toàn không đổi.'
  },
  {
    stt: 14,
    id: 'sim-thcs-03',
    title: 'Áp suất chất lỏng & Lực đẩy Archimedes (FA = d * V)',
    purpose: 'Trực quan hóa độ chênh lệch áp suất thủy tĩnh ở mặt trên và mặt dưới của vật chìm, dẫn tới lực đẩy Acsimet hướng thẳng đứng từ dưới lên trên.',
    procedure: [
      'Bước 1: Treo một khối kim loại có thể tích V vào một lực kế trong không khí (lực kế chỉ trọng lượng P).',
      'Bước 2: Kéo khối kim loại nhúng ngập từ từ vào bình tràn chứa nước.',
      'Bước 3: Quan sát lực kế giảm số chỉ: Phần giảm đi đúng bằng trọng lượng của lượng nước tràn ra cốc đong.',
      'Bước 4: Thay đổi chất lỏng sang dầu ăn hoặc nước muối để kiểm tra công thức FA = d_chất_lỏng * V_vật.'
    ],
    extractedFrom: {
      subject: 'Khoa học tự nhiên 8',
      grade: 'Lớp 8',
      lesson: 'Bài 16: Áp suất chất lỏng & Lực đẩy Archimedes',
      textbook: 'SGK KHTN 8 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thcs',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Kéo thả vật thể & Đo lường cảm biến',
    hasLiveSim: false,
    keyVariables: ['Độ sâu h (m)', 'Thể tích chiếm chỗ V (m³)', 'Trọng lượng riêng chất lỏng d', 'Lực đẩy FA (N)'],
    firstPrinciplesNote: 'Lực đẩy Archimedes thực chất là hợp lực của áp suất thủy tĩnh đáy dưới (lớn hơn) trừ áp suất đáy trên.'
  },
  {
    stt: 15,
    id: 'sim-thcs-04',
    title: 'Khúc xạ ánh sáng & Tạo ảnh qua Thấu kính hội tụ',
    purpose: 'Vẽ và tính toán đường đi của 3 tia sáng đặc biệt qua quang tâm O, tiêu điểm F để dựng ảnh thật hoặc ảnh ảo của vật sáng qua thấu kính.',
    procedure: [
      'Bước 1: Đặt một ngọn nến sáng trước một thấu kính hội tụ có tiêu cự f = 10cm.',
      'Bước 2: Di chuyển khoảng cách d từ ngọn nến đến thấu kính (d > 2f, d = 2f, f < d < 2f, d < f).',
      'Bước 3: Kéo màn chắn phía sau thấu kính để tìm vị trí hứng được ảnh sắc nét nhất.',
      'Bước 4: Bật hiển thị 3 tia sáng đặc biệt để kiểm chứng công thức thấu kính 1/f = 1/d + 1/d\'.'
    ],
    extractedFrom: {
      subject: 'Khoa học tự nhiên 9',
      grade: 'Lớp 9',
      lesson: 'Bài 5: Hiện tượng khúc xạ ánh sáng và Thấu kính',
      textbook: 'SGK KHTN 9 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thcs',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển khoảng cách vật & Dựng tia sáng',
    hasLiveSim: false,
    keyVariables: ['Khoảng cách vật d (cm)', 'Khoảng cách ảnh d\' (cm)', 'Tiêu cự f (cm)', 'Độ phóng đại k'],
    firstPrinciplesNote: 'Định luật khúc xạ Snell-Descartes tại hai mặt cong của thấu kính uốn cong chùm tia sáng hội tụ về tiêu điểm.'
  },
  {
    stt: 16,
    id: 'sim-thcs-05',
    title: 'Mô phỏng phân bào nguyên phân & Nhiễm sắc thể',
    purpose: 'Mô phỏng 4 kỳ của quá trình nguyên phân (Kỳ đầu, Kỳ giữa, Kỳ sau, Kỳ cuối) để hiểu cơ chế bảo tồn bộ nhiễm sắc thể lưỡng bội 2n của tế bào mẹ.',
    procedure: [
      'Bước 1: Chọn tế bào nhân thực có bộ nhiễm sắc thể giả định 2n = 4.',
      'Bước 2: Nhấn nút bắt đầu chu kỳ: Quan sát DNA nhân đôi tạo thành các nhiễm sắc thể kép đính ở tâm động.',
      'Bước 3: Sử dụng thanh tua chậm (Slow-motion 0.25x) tại kỳ giữa để quan sát các NST xếp thành 1 hàng ở mặt phẳng xích đạo.',
      'Bước 4: Bước từng khung hình dt ở kỳ sau khi thoi vô sắc co rút tách rời các crômatit chị em về hai cực đối diện.'
    ],
    extractedFrom: {
      subject: 'Khoa học tự nhiên 9',
      grade: 'Lớp 9',
      lesson: 'Bài 38: Nguyên phân và giảm phân trong tế bào',
      textbook: 'SGK KHTN 9 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thcs',
    interactionPatternId: 'pattern-time-control',
    interactionPatternName: 'Điều khiển thời gian & Phóng đại vi mô',
    hasLiveSim: false,
    keyVariables: ['Giai đoạn phân bào (Kỳ)', 'Số lượng crômatit', 'Chiều dài thoi phân bào'],
    firstPrinciplesNote: 'Bảo tồn mã di truyền: Cơ chế sao chép bán bảo tồn và chia đều vật chất di truyền đảm bảo tính đồng nhất gen.'
  },
  {
    stt: 17,
    id: 'sim-thcs-06',
    title: 'Đo tốc độ chuyển động bằng cổng quang điện & Đồng hồ hiện số',
    purpose: 'Học sinh hiểu phương pháp đo tốc độ trong phòng thí nghiệm vật lý hiện đại: Tính vận tốc tức thời v = s / Δt bằng cảm biến hồng ngoại ngắt chùm tia.',
    procedure: [
      'Bước 1: Đặt máng nghiêng có gắn xe trượt và tấm chắn sáng rộng s = 2cm.',
      'Bước 2: Cài đặt hai cổng quang điện A và B cách nhau khoảng cách L = 50cm trên máng dẫn.',
      'Bước 3: Thả xe trượt chuyển động tự do từ đỉnh dốc qua cổng A và cổng B.',
      'Bước 4: Đồng hồ hiện số ghi lại thời gian chắn sáng ΔtA và ΔtB; học sinh tính vA, vB và gia tốc a của xe.'
    ],
    extractedFrom: {
      subject: 'Khoa học tự nhiên 7',
      grade: 'Lớp 7',
      lesson: 'Bài 9: Đo tốc độ chuyển động',
      textbook: 'SGK KHTN 7 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thcs',
    interactionPatternId: 'pattern-time-control',
    interactionPatternName: 'Cảm biến hồng ngoại & Ghi nhận thời gian thực',
    hasLiveSim: false,
    keyVariables: ['Bề rộng tấm chắn s', 'Thời gian chắn sáng Δt (ms)', 'Tốc độ tức thời v (m/s)'],
    firstPrinciplesNote: 'Vận tốc là giới hạn của độ dời chia cho khoảng thời gian khi khoảng thời gian tiến dần về 0 (định nghĩa đạo hàm).'
  },

  // ==========================================
  // CẤP 4: THPT (LỚP 10 - LỚP 12)
  // ==========================================
  {
    stt: 18,
    id: 'sim-thpt-01',
    title: 'Con lắc đơn phi tuyến & Vi tích phân thời gian thực',
    purpose: 'Giải phương trình vi phân chuyển động d²θ/dt² + (g/L)sin(θ) = 0 bằng thuật toán tích phân số Euler-Cromer, vẽ đồ thị pha (θ, ω) và khảo sát cơ năng.',
    procedure: [
      'Bước 1: Kéo quả nặng của con lắc đơn lệch khỏi vị trí cân bằng một góc ban đầu θ0 bất kỳ (từ góc nhỏ 5° đến góc lớn 90°).',
      'Bước 2: Nhấn nút thả dao động và quan sát đồ thị hàm li độ góc θ(t) và vận tốc góc ω(t) vẽ trực tiếp thời gian thực.',
      'Bước 3: Mở biểu đồ cột năng lượng: Động năng Wđ và thế năng Wt biến thiên bù trừ nhau để tổng cơ năng E luôn là đường thẳng nằm ngang.',
      'Bước 4: Nhấn nút "Code Inspector" để bóc tách mã nguồn thuật toán vi tích phân chạy trong trình duyệt.'
    ],
    extractedFrom: {
      subject: 'Vật lí 11',
      grade: 'Lớp 11',
      lesson: 'Bài 1: Dao động điều hòa & Phương trình vi phân chuyển động',
      textbook: 'SGK Vật lí 11 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-code-inspector',
    interactionPatternName: 'Inspect Mã Nguồn & Vi tích phân (White-Box)',
    hasLiveSim: true,
    liveSimId: 'sim-pendulum-calculus',
    keyVariables: ['Chiều dài dây l (m)', 'Góc lệch ban đầu θ0 (rad)', 'Khối lượng m (kg)', 'Hệ số ma sát cản không khí'],
    firstPrinciplesNote: 'Định luật II Newton F = m*a dưới dạng vi phân: Vận tốc là đạo hàm bậc nhất của vị trí, gia tốc là đạo hàm bậc hai.'
  },
  {
    stt: 19,
    id: 'sim-thpt-02',
    title: 'Giao thoa sóng cơ trên mặt nước & Sóng dừng trên dây',
    purpose: 'Trực quan hóa hiện tượng giao thoa sóng khi hai nguồn kết hợp gặp nhau: Cực đại giao thoa có biên độ gấp đôi, cực tiểu giao thoa sóng triệt tiêu hoàn toàn.',
    procedure: [
      'Bước 1: Khởi động hai mũi kim dao động đồng pha nhấp nhô trên mặt chậu nước ảo.',
      'Bước 2: Thay đổi tần số dao động f (10Hz - 50Hz) và khoảng cách d giữa hai nguồn sóng.',
      'Bước 3: Quan sát vân giao thoa Hyperbol hiển thị trên mặt nước: các dải sáng cực đại (d1 - d2 = k*λ) và dải tối cực tiểu (d1 - d2 = (k + 0.5)*λ).',
      'Bước 4: Chuyển sang chế độ "Sóng dừng trên sợi dây đàn": Điều chỉnh tần số để tìm các nút sóng và bụng sóng ổn định.'
    ],
    extractedFrom: {
      subject: 'Vật lí 11',
      grade: 'Lớp 11',
      lesson: 'Bài 8: Giao thoa sóng & Sóng dừng trên dây',
      textbook: 'SGK Vật lí 11 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-slider',
    interactionPatternName: 'Điều khiển tần số f & Bước sóng λ thời gian thực',
    hasLiveSim: false,
    keyVariables: ['Bước sóng λ (cm)', 'Tần số f (Hz)', 'Hiệu đường đi d1 - d2', 'Biên độ tổng hợp A'],
    firstPrinciplesNote: 'Nguyên lý chồng chất sóng (Superposition Principle): Dao động tổng hợp là tổng đại số của các hàm sóng thành phần.'
  },
  {
    stt: 20,
    id: 'sim-thpt-03',
    title: 'Định luật khí lý tưởng Boyle - Mariotte & Động học phân tử',
    purpose: 'Chứng minh định luật đẳng nhiệt P * V = const ở cấp độ vi mô: Khi nén thể tích xilanh còn 1/2, tần suất phân tử va chạm vào thành xilanh tăng gấp đôi, làm áp suất tăng gấp đôi.',
    procedure: [
      'Bước 1: Nạp 200 phân tử khí lý tưởng vào một xilanh kín có gắn áp kế và nhiệt kế.',
      'Bước 2: Giữ nhiệt độ T không đổi ở 300K.',
      'Bước 3: Dùng chuột kéo pít-tông nén thể tích V từ 10 lít xuống còn 5 lít.',
      'Bước 4: Đếm số vụ va chạm của các phân tử khí vào thành bình trong 1 giây và quan sát kim áp kế P tăng từ 1 atm lên đúng 2 atm.'
    ],
    extractedFrom: {
      subject: 'Vật lí 12',
      grade: 'Lớp 12',
      lesson: 'Bài 3: Định luật Boyle và Thuyết động học phân tử chất khí',
      textbook: 'SGK Vật lí 12 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-particle-sandbox',
    interactionPatternName: 'Hệ hạt vi mô & Xilanh động học (Sandbox)',
    hasLiveSim: false,
    keyVariables: ['Thể tích V (lít)', 'Áp suất P (atm)', 'Nhiệt độ tuyệt đối T (Kelvin)', 'Số phân tử N'],
    firstPrinciplesNote: 'Áp suất chất khí không phải đại lượng huyền bí; nó là mật độ xung lượng trung bình truyền từ các hạt va đập vào diện tích thành bình.'
  },
  {
    stt: 21,
    id: 'sim-thpt-04',
    title: 'Hiện tượng cảm ứng điện từ Faraday & Định luật Lenz',
    purpose: 'Khám phá định luật Faraday: Dòng điện cảm ứng xuất hiện trong cuộn dây khi và chỉ khi từ thông gửi qua cuộn dây biến thiên theo thời gian (e = -dΦ/dt).',
    procedure: [
      'Bước 1: Cầm thanh nam châm thẳng đưa cực Bắc (N) lại gần một cuộn dây đồng kín có mắc điện kế nhạy G.',
      'Bước 2: Quan sát kim điện kế lệch sang phải khi từ thông tăng lên.',
      'Bước 3: Giữ thanh nam châm đứng yên tuyệt đối bên trong lòng cuộn dây: Quan sát kim điện kế lập tức trở về vạch số 0 (không có dòng điện).',
      'Bước 4: Rút thanh nam châm ra xa cuộn dây: Kim điện kế đổi chiều lệch sang trái (định luật Lenz về chiều dòng điện chống lại sự biến thiên từ thông).'
    ],
    extractedFrom: {
      subject: 'Vật lí 11 / 12',
      grade: 'Lớp 11 / 12',
      lesson: 'Bài 16: Từ trường và Hiện tượng cảm ứng điện từ',
      textbook: 'SGK Vật lí 11/12 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-drag-drop',
    interactionPatternName: 'Kéo thả nam châm & Đo biến thiên từ thông dΦ/dt',
    hasLiveSim: false,
    keyVariables: ['Từ thông Φ = B*S*cos(α)', 'Tốc độ dịch chuyển nam châm v', 'Suất điện động cảm ứng ec (V)'],
    firstPrinciplesNote: 'Nguyên lý bảo toàn năng lượng trong điện từ: Dòng điện cảm ứng sinh ra từ trường chống lại chuyển động của nam châm.'
  },
  {
    stt: 22,
    id: 'sim-thpt-05',
    title: 'Va chạm đàn hồi & Bảo toàn động lượng trên đệm không khí',
    purpose: 'Kiểm chứng định luật bảo toàn động lượng m1*v1 + m2*v2 = const và phân tích sự chuyển hóa giữa động năng và biến dạng đàn hồi trong va chạm 1 chiều.',
    procedure: [
      'Bước 1: Bật bơm khí đệm không khí để triệt tiêu hoàn toàn lực ma sát giữa xe trượt và ray dẫn.',
      'Bước 2: Cài đặt khối lượng hai xe m1 = 1kg và m2 = 2kg, chọn chế độ va chạm đàn hồi hoàn toàn.',
      'Bước 3: Cho xe 1 chuyển động với vận tốc v1 = 2m/s đâm vào xe 2 đang đứng yên.',
      'Bước 4: Sử dụng nút "Tua chậm 0.1x" và "Step dt" để đo vận tốc sau va chạm v1\' và v2\', đối chiếu với hệ phương trình bảo toàn động lượng và động năng.'
    ],
    extractedFrom: {
      subject: 'Vật lí 10',
      grade: 'Lớp 10',
      lesson: 'Bài 28: Động lượng và Định luật bảo toàn động lượng',
      textbook: 'SGK Vật lí 10 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-time-control',
    interactionPatternName: 'Tua chậm vi phân & Khảo sát động lượng',
    hasLiveSim: false,
    keyVariables: ['Khối lượng m1, m2 (kg)', 'Vận tốc trước v1, v2 (m/s)', 'Vận tốc sau v1\', v2\' (m/s)', 'Độ biến dạng lò xo'],
    firstPrinciplesNote: 'Định luật bảo toàn động lượng xuất phát trực tiếp từ tính đồng nhất của không gian (Định lý Noether).'
  },
  {
    stt: 23,
    id: 'sim-thpt-06',
    title: 'Quang phổ vạch nguyên tử Hydro & Mẫu nguyên tử Bohr',
    purpose: 'Mô phỏng bước nhảy lượng tử của electron giữa các mức năng lượng gián đoạn En = -13.6 / n² (eV) và sự phát xạ/hấp thụ photon ánh sáng đơn sắc.',
    procedure: [
      'Bước 1: Kéo electron ở trạng thái cơ bản n = 1 hấp thụ một photon ánh sáng có năng lượng thích hợp.',
      'Bước 2: Quan sát electron nhảy vọt lên quỹ đạo dừng kích thích n = 3.',
      'Bước 3: Sau một thời gian cực ngắn (~10⁻⁸s), electron chuyển dịch ngược về mức n = 2 và phát xạ ra một hạt photon ánh sáng màu Đỏ có bước sóng 656.3 nm (vạch H-alpha trong dãy Ban-me).',
      'Bước 4: Bật màn quang phổ để ghi nhận các vạch màu đặc trưng tương ứng với các bước nhảy lượng tử.'
    ],
    extractedFrom: {
      subject: 'Vật lí 12',
      grade: 'Lớp 12',
      lesson: 'Bài 21: Mẫu nguyên tử Bohr & Quang phổ phát xạ vạch',
      textbook: 'SGK Vật lí 12 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-particle-sandbox',
    interactionPatternName: 'Sandbox lượng tử & Bước nhảy photon',
    hasLiveSim: false,
    keyVariables: ['Số lượng tử n (1, 2, 3, 4...)', 'Năng lượng mức En (eV)', 'Bước sóng photon phát xạ λ (nm)'],
    firstPrinciplesNote: 'Cơ học lượng tử: Năng lượng ở thế giới vi mô bị lượng tử hóa thành từng gói rời rạc h*f thay vì liên tục.'
  },
  {
    stt: 24,
    id: 'sim-thpt-07',
    title: 'Tốc độ phản ứng hóa học & Năng lượng hoạt hóa Arrhenius',
    purpose: 'Khảo sát ảnh hưởng của nồng độ chất phản ứng, nhiệt độ, diện tích tiếp xúc và chất xúc tác đến tốc độ va chạm hiệu quả giữa các phân tử.',
    procedure: [
      'Bước 1: Thiết lập buồng phản ứng gồm các phân tử chất A và chất B với nồng độ ban đầu tùy chỉnh.',
      'Bước 2: Tăng nhiệt độ hỗn hợp: Quan sát vận tốc chuyển động nhiệt của các hạt tăng lên, đồ thị phân bố năng lượng Maxwell-Boltzmann dịch chuyển sang phải.',
      'Bước 3: Thêm hạt chất xúc tác: Quan sát hàng rào năng lượng hoạt hóa Ea bị hạ thấp xuống, dẫn đến số vụ va chạm hiệu quả tăng vọt.',
      'Bước 4: Theo dõi đường cong đồ thị nồng độ sản phẩm hình thành theo thời gian để tính hằng số tốc độ k.'
    ],
    extractedFrom: {
      subject: 'Hóa học 10',
      grade: 'Lớp 10',
      lesson: 'Bài 16: Các yếu tố ảnh hưởng đến tốc độ phản ứng hóa học',
      textbook: 'SGK Hóa học 10 - Bộ Kết nối tri thức với cuộc sống'
    },
    levelId: 'thpt',
    interactionPatternId: 'pattern-particle-sandbox',
    interactionPatternName: 'Buồng va chạm phân tử & Hàng rào năng lượng Ea',
    hasLiveSim: false,
    keyVariables: ['Nhiệt độ T (K)', 'Năng lượng hoạt hóa Ea (kJ/mol)', 'Tần số va chạm Z', 'Tốc độ phản ứng v (mol/L.s)'],
    firstPrinciplesNote: 'Phương trình Arrhenius k = A * exp(-Ea / RT): Chỉ những phân tử có động năng lớn hơn hàng rào thế năng mới phản ứng.'
  }
];

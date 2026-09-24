export interface PreschoolProductExperiment {
  id: string;
  stt: number;
  title: string;
  domain: string;
  domainCategory: 'khoa-hoc' | 'tham-my' | 'toan-do-luong';
  ageRange: string;
  tag: string;
  purpose: string;
  teacherPrompt: string;
  basicRequirement: string;
  advancedRequirement: string;
  part1Description: {
    title: string;
    concept: string;
    features: string[];
  };
  part2Description: {
    title: string;
    concept: string;
    features: string[];
  };
  materials: string[];
  procedure: {
    part1: string[];
    part2: string[];
  };
  pedagogicalOutcome: string;
}

export const PRESCHOOL_PRODUCT_EXPERIMENTS: PreschoolProductExperiment[] = [
  {
    id: 'mn-prod-01',
    stt: 1,
    title: 'Thí nghiệm Sự chìm, nổi của vật',
    domain: 'Phát triển Nhận thức - Khám phá Khoa học (STEAM)',
    domainCategory: 'khoa-hoc',
    ageRange: '3 - 6 tuổi',
    tag: 'Vật lý trực giác • Lực đẩy nước',
    purpose: 'Giúp trẻ hình thành trực giác sơ khai về tính chất của vật trong nước (khối lượng riêng, độ rỗng, không khí bên trong) và cách hình dạng, vật liệu quyết định khả năng nổi để chế tạo phương tiện cứu hộ.',
    teacherPrompt: 'Theo các con, một hòn sỏi nhỏ xíu và một quả bóng to đùng, cái nào sẽ chìm nghỉm dưới đáy nước? Làm sao để biến những que kem và nắp chai thành chiếc bè cứu hộ chở bạn gấu qua sông?',
    basicRequirement: 'Trẻ phân biệt được vật chìm và vật nổi trong nước; giải thích được tính chất vật liệu cơ bản (vật đặc/nặng như sắt, đá thì chìm; vật nhẹ/rỗng chứa không khí như xốp, bóng bàn, gỗ thì nổi).',
    advancedRequirement: 'Trẻ hiểu được mối liên hệ giữa hình dáng, cấu trúc và tải trọng; biết vận dụng phối hợp các vật liệu nổi (giấy bạc, ống hút, xốp, que kem, nắp chai) để thiết kế bè cứu hộ chở được số lượng hành khách hoặc vật nặng (sỏi) qua sông mà không bị chìm.',
    part1Description: {
      title: 'Phần 1: Sản phẩm Cải tiến (Tái hiện trực tiếp lên Online)',
      concept: 'Tái tạo lại các thao tác giáo viên và trẻ đã làm trên lớp để trẻ thấy được quá trình nhanh hơn, chủ động tương tác khám phá:',
      features: [
        'Bể thử nghiệm chìm nổi trực quan: Thả các vật quen thuộc (sỏi, thìa sắt, quả bóng bàn, mẩu xốp, lá cây, thanh gỗ, quả táo, quả trứng) với hiệu ứng vật lý rơi, bồng bềnh và mớn nước.',
        'Chế tạo Đèn Dung Nham (Lava Lamp): Mô phỏng bình nước pha dầu ăn (dầu nhẹ nổi lên trên), nhỏ giọt màu và thả viên sủi C tạo chu kỳ bọt khí đẩy giọt màu trồi sủi bọt lung linh kèm đèn chiếu dạ quang.'
      ]
    },
    part2Description: {
      title: 'Phần 2: Sản phẩm Khám phá (Vận dụng tư duy tìm ra nguyên lý)',
      concept: 'Thử thách kỹ thuật đòi hỏi tư duy cao hơn, yêu cầu trẻ vận dụng kiến thức về sức nổi và tải trọng:',
      features: [
        'Chế tạo Bè Cứu Hộ Vượt Sông: Trẻ được cấp nhiều vật liệu khác nhau (giấy bạc gập thuyền, ống hút nhựa, que kem gỗ, xốp, nắp chai nhựa, mảnh gỗ...).',
        'Lắp ráp và kiểm tra tải trọng: Thử nghiệm chở các "hành khách" (Bạn Gấu, Bé Thỏ, Vịt cao su, Sỏi nhỏ, Sỏi to), tính toán giới hạn chìm/nước tràn để gia cố bè trước khi khởi hành qua sông.'
      ]
    },
    materials: [
      'Bể nước trong suốt, thước đo mớn nước',
      'Đồ vật mẫu: Sỏi, thìa inox, bóng bàn, xốp, lá cây, gỗ, quả táo, trứng',
      'Bình thủy tinh, dầu ăn, phẩm màu thực phẩm, viên sủi C',
      'Vật liệu chế tạo bè: Giấy bạc định hình, que kem, ống hút, xốp EVA, nắp chai nhựa, dây buộc',
      'Hành khách & tải trọng: Thú bông mini (Gấu, Thỏ, Vịt), các viên sỏi thử tải (10g - 50g)'
    ],
    procedure: {
      part1: [
        'Bước 1: Trẻ chọn vật thử nghiệm và dự đoán "Chìm" hay "Nổi".',
        'Bước 2: Kéo thả vật vào bể nước, quan sát chuyển động và vị trí dừng lại (ở đáy hay mặt nước).',
        'Bước 3: Mở chế độ "Đèn Dung Nham": Rót dầu ăn vào bình nước, nhỏ giọt màu chìm qua lớp dầu.',
        'Bước 4: Thả viên sủi C vào đáy, quan sát bọt khí kéo giọt màu bốc lên mặt dầu rồi rơi xuống liên tục.'
      ],
      part2: [
        'Bước 1: Chọn vật liệu khung bè (que kem, ống hút) và phao nổi (xốp, nắp chai, giấy bạc).',
        'Bước 2: Lắp ráp bè và thả xuống dòng sông mô phỏng để kiểm tra cân bằng ban đầu.',
        'Bước 3: Đặt từng hành khách (gấu bông, vịt) hoặc tải trọng sỏi lên bè, quan sát mớn nước lún xuống.',
        'Bước 4: Nếu nước mấp mé tràn viền, trẻ tìm cách gia cố thêm phao nổi hoặc điều chỉnh phân bổ tải trọng để bè vượt sông an toàn.'
      ]
    },
    pedagogicalOutcome: 'Bé nắm vững khái niệm vật chìm/vật nổi, hiểu sâu sắc về nguyên lý cấu trúc bè nổi chịu tải và phát triển năng lực tư duy kỹ thuật giải quyết vấn đề (STEM).'
  },
  {
    id: 'mn-prod-02',
    stt: 2,
    title: 'Thí nghiệm "Hòa trộn màu sắc"',
    domain: 'Phát triển Thẩm mỹ & Cảm thụ Nghệ thuật',
    domainCategory: 'tham-my',
    ageRange: '3 - 6 tuổi',
    tag: 'Lý thuyết màu sắc • Thiết kế thời trang nhí',
    purpose: 'Khơi gợi tình yêu nghệ thuật, giúp trẻ khám phá quy luật biến đổi kỳ diệu của màu sắc từ 3 màu cơ bản và vận dụng gu thẩm mỹ để phối màu trang phục theo chủ đề lễ hội, thiên nhiên.',
    teacherPrompt: 'Các con có biết điều gì xảy ra khi giọt màu Đỏ bí mật nắm tay giọt màu Vàng ấm áp không? Hôm nay chúng mình cùng làm nhà thiết kế thời trang tài ba để phối màu quần áo dạo phố nhé!',
    basicRequirement: 'Trẻ nhận biết 3 màu gốc (Đỏ, Vàng, Xanh lam); biết nguyên lý phối 2 màu gốc tạo thành màu mới (Đỏ + Vàng = Cam; Vàng + Lam = Xanh lá; Đỏ + Lam = Tím); phân biệt màu sáng/tối khi thêm trắng/đen.',
    advancedRequirement: 'Thiết kế trang phục theo chủ đề, phối màu theo yêu cầu từ nhóm màu sắc đã cho: Trẻ lựa chọn chủ đề (Mùa xuân rực rỡ, Đại dương sâu thẳm, Phi hành gia vũ trụ), tự pha chế màu theo gam màu quy định và phối màu hài hòa cho các chi tiết áo, váy, mũ, giày.',
    part1Description: {
      title: 'Phần 1: Sản phẩm Cải tiến (Tái hiện trực tiếp lên Online)',
      concept: 'Mô phỏng thao tác pha màu nước trực quan, giúp trẻ thử nghiệm nhanh không lấm bẩn tay chân, xem phản ứng hòa sắc tức thì:',
      features: [
        'Cốc Pha Màu Ma Thuật Online: Các lọ màu giọt cơ bản (Đỏ, Vàng, Xanh lam, Trắng, Đen) với hiệu ứng giọt màu rơi vào nước, loang màu sống động.',
        'Cây đũa khuấy kỳ diệu: Bấm khuấy để nước trong cốc chuyển màu đồng nhất kèm hiển thị công thức màu, tên màu tiếng Việt và giọng đọc tên màu chuẩn xác.',
        'Hộp màu cá nhân: Lưu lại các sắc màu bé vừa pha chế thành công để đem sang xưởng thiết kế thời trang.'
      ]
    },
    part2Description: {
      title: 'Phần 2: Sản phẩm Khám phá (Vận dụng tư duy tìm ra nguyên lý)',
      concept: 'Xưởng Thiết Kế Thời Trang Bé Yêu - Thử thách thẩm mỹ đòi hỏi trẻ áp dụng quy tắc hòa sắc vào sản phẩm thực tế:',
      features: [
        'Chọn chủ đề thiết kế: Lễ hội Xuân (tông màu nóng: Đỏ, Cam, Vàng), Biển & Rừng xanh (tông màu mát mẻ: Lam, Xanh ngọc, Lục), Vũ trụ kỳ ảo (Tím, Xanh thẫm, Trắng ánh kim).',
        'Bộ sưu tập thời trang tương tác: Nhân vật bé mầm non dễ thương với Áo, Váy/Quần, Nón/Mũ, Giày sneaker, Nơ cài áo.',
        'Trực tiếp chấm màu tô trang phục: Chấm cọ vào nhóm màu quy định để phối màu trang phục theo gu thẩm mỹ.',
        'Hệ thống đánh giá phong cách: Kiểm tra sự hòa hợp màu sắc, chúc mừng và vinh danh "Nhà thiết kế thời trang nhí xuất sắc".'
      ]
    },
    materials: [
      '3 lọ màu nước cơ bản (Đỏ, Vàng, Xanh lam) + Lọ màu trắng, đen',
      'Cốc nước trong suốt, ống bóp nhỏ giọt (dropper), que khuấy',
      'Bảng pha màu nghệ thuật (palette)',
      'Bộ rập thiết kế trang phục mầm non: Áo khoác, váy xòe, quần yếm, mũ beret, giày thể thao',
      'Bảng mẫu gam màu chủ đề (Bảng ấm áp, Bảng mát dịu, Bảng huyền bí)'
    ],
    procedure: {
      part1: [
        'Bước 1: Chọn 2 ống màu cơ bản (Ví dụ: Đỏ và Vàng) nhỏ vào cốc nước trong.',
        'Bước 2: Quan sát từng vệt màu loang nhẹ trong nước chưa hòa tan.',
        'Bước 3: Nhấn nút "Khuấy đều": Nước chuyển sang màu Cam rực rỡ!',
        'Bước 4: Thử thêm giọt màu Trắng để biến thành màu Cam sữa pastel ngọt ngào, lưu màu vào khay màu.'
      ],
      part2: [
        'Bước 1: Chọn chủ đề biểu diễn thời trang (Ví dụ: "Lễ hội Mùa xuân ấm áp").',
        'Bước 2: Quan sát yêu cầu phối màu của cô giáo: Phải sử dụng gam màu ấm (Đỏ, Cam, Vàng, Hồng đào).',
        'Bước 3: Trẻ chọn cọ, nhúng vào các màu tương ứng và tô lên từng bộ phận trang phục của bé mẫu.',
        'Bước 4: Kiểm tra tổng thể bộ trang phục, nhấn "Trình diễn thời trang" để nghe nhận xét thẩm mỹ và nhận huy hiệu.'
      ]
    },
    pedagogicalOutcome: 'Bé làm chủ nguyên lý tạo màu, phát triển tư duy cảm thụ cái đẹp, biết cách phối màu hài hòa theo ngữ cảnh chủ đề thực tế.'
  },
  {
    id: 'mn-prod-03',
    stt: 3,
    title: 'Thí nghiệm về Đo lường',
    domain: 'Phát triển Nhận thức - Làm quen với Biểu tượng Toán & Đo lường',
    domainCategory: 'toan-do-luong',
    ageRange: '4 - 6 tuổi',
    tag: 'Toán học thực tế • Tư duy chọn công cụ',
    purpose: 'Giúp trẻ hiểu bản chất của việc đo lường là so sánh vật cần đo với một đơn vị quy ước, biết cách dùng các dụng cụ đo thông dụng và hình thành tư duy thực tế: chọn công cụ đo nhanh nhất, dễ nhất và sẵn có nhất.',
    teacherPrompt: 'Nếu cô muốn biết lớp học của chúng mình dài bao nhiêu để trải thảm múa, chúng mình có nên lấy cây thước kẻ 15cm ngắn xíu ra đo không? Hay có cách nào khác vừa nhanh vừa không cần tìm kiếm?',
    basicRequirement: 'Trẻ biết và sử dụng được các công cụ đo lường cơ bản: Thước kẻ centimet (đo độ dài), Ca đong chia vạch ml (đo thể tích nước/sữa), Cân thăng bằng (so sánh nặng - nhẹ), Gang tay/Bước chân (đo tự nhiên).',
    advancedRequirement: 'Lựa chọn được loại công cụ đo phù hợp với hoàn cảnh dựa trên 3 tiêu chí: Sẵn có, Công cụ dễ sử dụng và Có cách đo nhanh nhất. Trẻ giải quyết được các tình huống thực tế đời sống thông qua việc chọn đúng công cụ tối ưu.',
    part1Description: {
      title: 'Phần 1: Sản phẩm Cải tiến (Tái hiện trực tiếp lên Online)',
      concept: 'Trạm thực hành đo lường tương tác mô phỏng chuẩn xác từng thao tác đo lường của trẻ mầm non:',
      features: [
        'Bàn đo độ dài tương tác: Cây thước kẻ ảo có vạch số phóng to, kéo rê áp sát mép bút chì, cục tẩy, hộp bút để đọc số centimet chính xác.',
        'Bình rót đo thể tích nước: Kéo ca nước rót vào cốc chia vạch ml, mức nước dâng lên theo số ml tương ứng.',
        'Cân bập bênh so sánh khối lượng: Đặt quả táo và quả dưa lên hai đĩa cân để thấy bên nặng hạ xuống, bên nhẹ nhấc lên rõ rệt.'
      ]
    },
    part2Description: {
      title: 'Phần 2: Sản phẩm Khám phá (Vận dụng tư duy tìm ra nguyên lý)',
      concept: 'Thử thách "Thám Tử Đo Lường Tài Ba" - Tình huống giải quyết vấn đề thực tế theo tiêu chí Sẵn có - Dễ - Nhanh nhất:',
      features: [
        'Tình huống 1 (Đo chiều dài lớp học): So sánh đo bằng Bước chân (sẵn có, nhanh nhất 10 giây) vs Thước kẻ ngắn 15cm (mất cả buổi chắp nối dễ sai sót).',
        'Tình huống 2 (Đong 200ml sữa làm bánh): So sánh Ca chia vạch ml (nhanh, chuẩn xác) vs Cân đĩa vs Thước kẻ.',
        'Tình huống 3 (So sánh dưa hấu và chùm nho): Cân thăng bằng (trực quan, nhận biết ngay lập tức) vs Thước dây.',
        'Tình huống 4 (Đo vòng bụng gấu bông may đai): Sợi dây mềm / Thước cuộn (ôm tròn mềm mại) vs Thước gỗ cứng (không thể uốn cong).'
      ]
    },
    materials: [
      'Thước kẻ phẳng học sinh (15cm - 30cm), thước cuộn dây mềm',
      'Ca đong chia vạch ml (100ml, 250ml, 500ml), bình nước lọc',
      'Cân thăng bằng bập bênh kèm các quả cân và đồ vật mẫu',
      'Thước đo tự nhiên: Bàn chân của bé, gang tay, que tính',
      'Vật thể thử thách đo: Bút chì, hộp quà, quả dưa hấu, chùm nho, gấu bông, sàn phòng học'
    ],
    procedure: {
      part1: [
        'Bước 1: Chọn công cụ đo cơ bản (Thước đo cm, Ca đong ml, hoặc Cân thăng bằng).',
        'Bước 2: Căn chỉnh điểm gốc số 0 sát mép vật cần đo hoặc đặt lên đĩa cân.',
        'Bước 3: Đọc kết quả đo hiển thị to rõ (centimet, mililit, hoặc bên nào nặng hơn).',
        'Bước 4: Thay đổi các vật thể khác nhau để luyện kỹ năng đọc chỉ số đo lường.'
      ],
      part2: [
        'Bước 1: Đọc tình huống thực tế do cô giáo đưa ra (Ví dụ: "Đo chiều dài sàn lớp học").',
        'Bước 2: Đánh giá 4 công cụ đưa ra theo 3 tiêu chí: Sẵn có không? Dễ dùng không? Cách nào nhanh nhất?',
        'Bước 3: Chọn công cụ tối ưu (Ví dụ: Bước chân của bé) và bấm "Thử đo ngay".',
        'Bước 4: Xem mô phỏng quá trình đo trực tiếp và đọc lời giải thích logic để củng cố tư duy chọn công cụ.'
      ]
    },
    pedagogicalOutcome: 'Bé nắm vững kỹ năng đo lường cơ bản, phát triển tư duy phản biện và khả năng linh hoạt thích ứng chọn công cụ giải quyết bài toán thực tế hiệu quả nhất.'
  }
];

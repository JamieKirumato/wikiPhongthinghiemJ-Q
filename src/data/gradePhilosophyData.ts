export interface GradePhilosophy {
  gradeId: string;
  gradeName: string;
  ageRange: string;
  bookSeriesFocus: string;
  // 1. Đặc điểm chung nhất về triết lý giáo dục ở độ tuổi này
  generalPhilosophy: {
    summary: string;
    corePrinciples: string[];
  };
  // 2. Điều bắt buộc học sinh cần học (Chuẩn tối thiểu)
  mandatoryLearnings: {
    summary: string;
    items: string[];
  };
  // 3. Điều học sinh nên học / nắm được (Mở rộng & khuyến khích)
  recommendedLearnings: {
    summary: string;
    items: string[];
  };
  // 4. Thái độ học sinh cần có (Phẩm chất & tâm thế)
  requiredAttitudes: {
    summary: string;
    items: string[];
  };
}

export const GRADE_PHILOSOPHIES: Record<string, GradePhilosophy> = {
  'mam-non': {
    gradeId: 'mam-non',
    gradeName: 'Mầm non',
    ageRange: '3 - 6 tuổi',
    bookSeriesFocus: 'Làm quen ngôn ngữ & Khám phá khoa học giác quan',
    generalPhilosophy: {
      summary: 'Triết lý "Học bằng chơi, chơi mà học" lấy trẻ làm trung tâm. Giáo dục mầm non chú trọng nuôi dưỡng sự tò mò bẩm sinh thông qua các trải nghiệm đa giác quan (thị giác, xúc giác, thính giác, vận động) thay vì truyền thụ lý thuyết trừu tượng.',
      corePrinciples: [
        'Học qua trải nghiệm cụ thể và thao tác trực tiếp với đồ vật, thế giới tự nhiên.',
        'Tôn trọng nhịp độ phát triển tâm sinh lý tự nhiên của từng trẻ, không gò ép học thuật hàn lâm.',
        'Xây dựng cảm xúc an toàn, tin tưởng và hào hứng mỗi ngày khi đến trường lớp.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Các kỹ năng sinh tồn, tự phục vụ và nhận biết các khái niệm nền tảng về bản thân và môi trường xung quanh.',
      items: [
        'Nhận biết và gọi tên chính xác các bộ phận cơ thể, màu sắc cơ bản (đỏ, vàng, xanh), hình khối đơn giản (tròn, vuông, tam giác).',
        'Kỹ năng tự phục vụ cơ bản: tự xúc ăn, tự rửa tay bằng xà phòng đúng quy trình, tự mang giày dép, cất dọn đồ chơi.',
        'Quy tắc an toàn cốt tử: nhận biết vật sắc nhọn, nguồn nhiệt, phích nước nóng, ổ cắm điện, không đi theo người lạ.',
        'Ngôn ngữ giao tiếp cơ bản: diễn đạt nhu cầu bằng câu hoàn chỉnh, biết nói lời chào, cảm ơn, xin lỗi.'
      ]
    },
    recommendedLearnings: {
      summary: 'Khuyến khích mở rộng tư duy trực quan, trí tưởng tượng và khả năng thích ứng linh hoạt.',
      items: [
        'Làm quen với âm tiết, phát âm chuẩn tiếng Việt và bước đầu tiếp cận từ vựng tiếng Anh qua hình ảnh, bài hát tương tác.',
        'Quan sát và mô tả các hiện tượng tự nhiên đơn giản: ngày và đêm, nắng mưa, sự nổi chìm của đồ vật trong nước.',
        'Kỹ năng phối hợp vận động tinh (cầm kéo an toàn, xâu hạt, nặn đất sét) và vận động thô (chạy nhảy giữ thăng bằng).',
        'Khả năng tập trung lắng nghe câu chuyện ngắn và kể lại theo tranh minh họa bằng ngôn từ của chính mình.'
      ]
    },
    requiredAttitudes: {
      summary: 'Hình thành tâm thế hồn nhiên, ham học hỏi và biết quan tâm đến bạn bè, người thân.',
      items: [
        'Lòng hiếu kỳ, thích khám phá cái mới và đặt câu hỏi "Vì sao?", "Cái gì đây?".',
        'Thái độ lễ phép với người lớn tuổi, thân thiện và biết chia sẻ đồ chơi cùng bạn.',
        'Yêu quý thiên nhiên, cây cỏ, con vật nuôi và có ý thức bỏ rác đúng nơi quy định.',
        'Sự kiên nhẫn bước đầu khi hoàn thành một việc nhỏ (xếp xong bộ đồ chơi, tô xong bức tranh).'
      ]
    }
  },

  'lop-1': {
    gradeId: 'lop-1',
    gradeName: 'Lớp 1',
    ageRange: '6 - 7 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống / Chân trời sáng tạo',
    generalPhilosophy: {
      summary: 'Triết lý "Chuyển giao êm thuận từ mầm non sang tiểu học", lấy việc hình thành thói quen học tập nền nếp và niềm say mê đọc viết làm cốt lõi. Chuyển từ tư duy trực quan hành động sang tư duy trực quan hình tượng gắn liền đời sống.',
      corePrinciples: [
        'Kiến thức khởi đầu phải luôn xuất phát từ ngữ cảnh đời sống thường nhật của trẻ.',
        'Khen ngợi nỗ lực và quá trình tiến bộ của học sinh hơn là chỉ chấm điểm kết quả.',
        'Tạo lập môi trường học tập không sợ sai, khuyến khích thử nghiệm và tự sửa lỗi.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Nắm vững công cụ đọc viết cơ bản (ngôn ngữ) và khái niệm số lượng sơ khởi (toán học).',
      items: [
        'Thuộc bảng chữ cái, nhận diện và ghép vần chuẩn tiếng Việt; đọc trơn các đoạn văn ngắn, viết đúng cỡ chữ và tư thế ngồi chuẩn.',
        'Nhận biết số, đếm, so sánh và thực hiện thành thạo phép cộng, phép trừ không nhớ trong phạm vi 10 và 20, nhận biết đến 100.',
        'Nhận dạng các hình phẳng cơ bản (hình vuông, tròn, tam giác, chữ nhật) và hình khối (khối lập phương, hộp chữ nhật).',
        'Nắm vững nội quy lớp học, các kỹ năng vệ sinh cá nhân, phòng tránh tai nạn thương tích tại trường và trên đường đi học.'
      ]
    },
    recommendedLearnings: {
      summary: 'Phát triển tư duy logic sớm và khả năng tự tin biểu đạt suy nghĩ.',
      items: [
        'Bước đầu hiểu bản chất toán học: phép cộng là sự gộp lại, phép trừ là tách rời (thay vì chỉ học vẹt bảng tính).',
        'Tập đặt câu hỏi phán đoán: "Điều gì sẽ xảy ra nếu...?" khi quan sát cây cối, thời tiết trong môn Tự nhiên và Xã hội.',
        'Kỹ năng quản lý đồ dùng học tập cá nhân và tự chuẩn bị sách vở theo thời khóa biểu.',
        'Bước đầu nhận biết các cảm xúc cơ bản của bản thân (vui, buồn, tức giận, sợ hãi) và cách giải tỏa lành mạnh.'
      ]
    },
    requiredAttitudes: {
      summary: 'Tâm thế yêu thích việc học, trung thực và hình thành tính kỷ luật bản thân.',
      items: [
        'Hào hứng đón nhận bài học mới mỗi ngày, không sợ bị phê bình khi mắc lỗi.',
        'Thái độ trung thực: không giấu lỗi, trung thực trong các hoạt động trên lớp.',
        'Biết lắng nghe khi thầy cô hoặc bạn bè đang phát biểu, giơ tay khi muốn có ý kiến.',
        'Tôn trọng và giúp đỡ bạn bè cùng tiến bộ, biết nói lời xin lỗi chân thành khi làm phiền người khác.'
      ]
    }
  },

  'lop-2': {
    gradeId: 'lop-2',
    gradeName: 'Lớp 2',
    ageRange: '7 - 8 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống / Chân trời sáng tạo',
    generalPhilosophy: {
      summary: 'Triết lý "Mở rộng không gian nhận thức từ gia đình đến cộng đồng", bồi dưỡng năng lực giao tiếp mạch lạc và tư duy tính toán linh hoạt có kèm kỹ thuật nhớ.',
      corePrinciples: [
        'Học sinh làm chủ các thao tác tính toán và diễn đạt ngôn ngữ có cấu trúc rõ ràng.',
        'Gắn kết kiến thức nhà trường với các hoạt động cộng đồng, làng xóm và môi trường tự nhiên.',
        'Khuyến khích tư duy so sánh, phân loại đồ vật và hiện tượng theo các tiêu chí cụ thể.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Thành thạo kỹ năng đọc hiểu đoạn văn, bảng cửu chương 2 và 5, phép cộng trừ có nhớ trong phạm vi 100 và các số đến 1000.',
      items: [
        'Đọc trôi chảy với tốc độ khoảng 50-60 từ/phút; trả lời đúng câu hỏi đọc hiểu; viết đúng chính tả đoạn chính tả ngắn; viết đoạn văn 4-5 câu tả người/vật.',
        'Thực hiện thành thạo phép cộng, phép trừ có nhớ trong phạm vi 100; bước đầu làm quen phép nhân, phép chia (bảng 2 và bảng 5); số đến 1000.',
        'Đo lường cơ bản: đơn vị độ dài (dm, m, km), khối lượng (kg), dung tích (lít), biết xem giờ trên đồng hồ kim và xem lịch ngày tháng.',
        'Hiểu về các cơ quan trong cơ thể người (vận động, hô hấp, bài tiết) và các biện pháp giữ gìn vệ sinh, dinh dưỡng hợp lý.'
      ]
    },
    recommendedLearnings: {
      summary: 'Khả năng tóm tắt ý chính và giải toán có lời văn gắn liền đời sống.',
      items: [
        'Tự giải thích lý do vì sao chọn phép tính cộng/trừ/nhân/chia trong các bài toán thực tế (bản chất của bài toán).',
        'Tập thu thập số liệu đơn giản (ví dụ: đếm số bạn thích môn học nào trong tổ) và lập bảng kiểm đếm sơ khai.',
        'Hình thành kỹ năng làm việc nhóm đôi: phân công nhiệm vụ, thảo luận ngắn và trình bày trước nhóm.',
        'Ý thức tiết kiệm nước, điện và phân loại rác hữu cơ/vô cơ tại gia đình.'
      ]
    },
    requiredAttitudes: {
      summary: 'Hình thành tinh thần trách nhiệm với công việc được giao và lòng nhân ái.',
      items: [
        'Tính cẩn thận, sạch sẽ, giữ gìn sách vở và dụng cụ học tập ngay ngắn.',
        'Ý thức tự giác làm bài tập về nhà và tự chuẩn bị bài mới.',
        'Lòng nhân ái: biết sẻ chia, quan tâm đến người già, em nhỏ và các bạn có hoàn cảnh khó khăn.',
        'Thái độ dũng cảm nhận lỗi và kiên trì khắc phục khó khăn trong học tập.'
      ]
    }
  },

  'lop-3': {
    gradeId: 'lop-3',
    gradeName: 'Lớp 3',
    ageRange: '8 - 9 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống / Chân trời sáng tạo',
    generalPhilosophy: {
      summary: 'Triết lý "Tiếp cận thế giới kỹ thuật số và phân tích khoa học sơ khởi". Đây là bước ngoặt khi học sinh bắt đầu học Tin học, Công nghệ chính thức, chuyển dịch từ quan sát cảm tính sang quan sát có phương pháp.',
      corePrinciples: [
        'Học sinh là người chủ động đặt câu hỏi nghiên cứu nhỏ và tiến hành thử nghiệm đơn giản.',
        'Tích hợp tư duy công nghệ: hiểu công nghệ là công cụ phục vụ đời sống con người, hình thành văn hóa ứng xử số an toàn.',
        'Rèn luyện kỹ năng phân tích, so sánh và khái quát hóa dữ liệu trực quan.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Làm chủ các phép tính cơ bản trong phạm vi 100.000, các thao tác máy tính căn bản và kiến thức xã hội địa phương.',
      items: [
        'Thành thạo 4 phép tính: cộng, trừ, nhân, chia trong phạm vi 100.000; thuộc làu bảng nhân, bảng chia từ 2 đến 9; giải bài toán có đến hai bước tính.',
        'Đọc diễn cảm văn bản, viết đoạn văn nêu tình cảm, cảm xúc hoặc miêu tả sự vật dài 7-8 câu.',
        'Sử dụng chuột, bàn phím máy tính đúng cách, nhận diện các bộ phận máy tính và tuân thủ an toàn thông tin khi dùng thiết bị điện tử.',
        'Nắm vững kiến thức về tự nhiên, văn hóa, làng nghề truyền thống của địa phương em trong môn Tự nhiên và Xã hội.'
      ]
    },
    recommendedLearnings: {
      summary: 'Khả năng tư duy thuật toán cơ bản và thói quen đọc sách bách khoa.',
      items: [
        'Khái niệm bước đầu về thuật toán: trình tự các bước để hoàn thành một nhiệm vụ (ví dụ: pha trà, quét nhà, giải toán).',
        'Khám phá thế giới vi sinh vật và các hiện tượng vật lý thú vị: sự bay hơi, ngưng tụ của nước, chu kỳ của giọt nước.',
        'Kỹ năng tìm kiếm tài liệu học tập trong thư viện hoặc trên các phần mềm giáo dục có hướng dẫn.',
        'Kỹ năng tự đánh giá bài làm của bản thân và góp ý mang tính xây dựng cho bạn bè.'
      ]
    },
    requiredAttitudes: {
      summary: 'Tính chủ động, tự lập trong học tập và tinh thần tôn trọng kỷ luật công nghệ.',
      items: [
        'Chủ động đặt câu hỏi khi chưa hiểu bài, không giấu dốt.',
        'Tuân thủ quy định sử dụng thiết bị số (không vào trang web xấu, hạn chế thời gian ngồi màn hình).',
        'Tôn trọng công sức lao động của cha mẹ, thầy cô và những người lao động xung quanh.',
        'Thói quen yêu quý sách, giữ gìn sách giáo khoa cẩn thận để có thể tặng lại cho các em lớp dưới.'
      ]
    }
  },

  'lop-4': {
    gradeId: 'lop-4',
    gradeName: 'Lớp 4',
    ageRange: '9 - 10 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống / Chân trời sáng tạo',
    generalPhilosophy: {
      summary: 'Triết lý "Khám phá khoa học thực nghiệm và lịch sử dân tộc sâu rộng". Ở lớp 4, môn Tự nhiên & Xã hội tách thành Khoa học và Lịch sử & Địa lí độc lập, đòi hỏi tư duy phân tích nguyên nhân - kết quả và hiểu biết về dòng thời gian lịch sử.',
      corePrinciples: [
        'Dạy học dựa trên bằng chứng khoa học và thực nghiệm: học sinh dự đoán, làm thí nghiệm, ghi chép và kết luận.',
        'Khơi gợi lòng tự hào dân tộc qua các câu chuyện lịch sử hào hùng và địa lý đất nước giàu đẹp.',
        'Phát triển tư duy trừu tượng qua phân số, góc, diện tích và các đại lượng biến thiên.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Làm chủ phân số, các cấu trúc bài văn miêu tả hoàn chỉnh và các định luật khoa học thường thức.',
      items: [
        'Khái niệm phân số, phân số bằng nhau, rút gọn, quy đồng và thực hiện thành thạo 4 phép tính với phân số; tính diện tích hình bình hành, hình thoi.',
        'Viết bài văn hoàn chỉnh có bố cục 3 phần (mở bài, thân bài, kết bài) miêu tả con vật, cây cối, đồ vật; nhận biết các biện pháp tu từ so sánh, nhân hóa.',
        'Khoa học: Hiểu về năng lượng (nhiệt, ánh sáng, âm thanh), nước và không khí, chuỗi thức ăn trong tự nhiên; thực hành các thí nghiệm an toàn.',
        'Lịch sử & Địa lí: Nắm vững các vùng địa lý Việt Nam (Trung du & Miền núi phía Bắc, Đồng bằng Bắc Bộ, Duyên hải miền Trung, Tây Nguyên, Nam Bộ) và các mốc lịch sử dựng nước, giữ nước tiêu biểu.'
      ]
    },
    recommendedLearnings: {
      summary: 'Tư duy mô hình hóa toán học và phương pháp tư duy phản biện sơ khai.',
      items: [
        'Biết biểu diễn bài toán bằng sơ đồ đoạn thẳng, bảng dữ liệu hoặc biểu đồ cột để tìm quy luật.',
        'Tự lập kế hoạch thí nghiệm khoa học đơn giản tại nhà (ví dụ: thử nghiệm cây cần ánh sáng, lọc nước bẩn).',
        'Tư duy phản biện: phân biệt giữa "sự thật khách quan" (fact) và "ý kiến chủ quan" (opinion) trong văn bản đọc.',
        'Bước đầu học lập trình khối cơ bản (Scratch hoặc tư duy điều khiển robot).'
      ]
    },
    requiredAttitudes: {
      summary: 'Lòng yêu nước, tinh thần khoa học khách quan và sự kiên trì vượt khó.',
      items: [
        'Ý thức tôn trọng sự thật trong ghi chép kết quả thí nghiệm và học tập.',
        'Lòng tự hào về cội nguồn dân tộc, trân trọng các di tích lịch sử và văn hóa truyền thống.',
        'Tinh thần bảo vệ môi trường: kiên quyết không xả rác bừa bãi, tuyên truyền tiết kiệm tài nguyên.',
        'Sự hợp tác bình đẳng, lắng nghe và tiếp thu các quan điểm khác biệt trong làm việc nhóm.'
      ]
    }
  },

  'lop-5': {
    gradeId: 'lop-5',
    gradeName: 'Lớp 5',
    ageRange: '10 - 11 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống / Chân trời sáng tạo',
    generalPhilosophy: {
      summary: 'Triết lý "Tổng hòa năng lực, hoàn thiện nhân cách và bản lề chuyển cấp THCS". Học sinh lớp 5 là độ tuổi tiền dậy thì, tư duy trừu tượng và ý thức bản thân phát triển mạnh mẽ. Giáo dục chú trọng năng lực tự học, giải quyết vấn đề phức hợp và trách nhiệm công dân nhỏ tuổi.',
      corePrinciples: [
        'Học sinh là chủ thể tự kiến tạo tri thức thông qua các dự án học tập (Project-based Learning).',
        'Tích hợp liên môn STEM/STEAM: kết hợp Toán, Khoa học, Công nghệ, Nghệ thuật để giải quyết bài toán thực tế.',
        'Chuẩn bị tâm thế vững vàng, tự tin và kỹ năng học tập độc lập để sẵn sàng bước vào bậc Trung học cơ sở.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Làm chủ số thập phân, tỉ số phần trăm, hình học không gian sơ khai và năng lực nghị luận xã hội đơn giản.',
      items: [
        'Thành thạo các phép tính với số thập phân, tỉ số phần trăm, giải toán chuyển động đều (vận tốc, quãng đường, thời gian); tính thể tích hình hộp chữ nhật, hình lập phương.',
        'Viết bài văn tả cảnh, tả người sắc sảo, giàu cảm xúc; viết bài văn thuyết minh ngắn hoặc bày tỏ quan điểm về một hiện tượng trong đời sống.',
        'Khoa học: Hiểu sâu về cấu tạo và sự phát triển của cơ thể người ở tuổi dậy thì, các biện pháp phòng tránh xâm hại, bệnh tật; biến đổi hóa học của chất; năng lượng tái tạo.',
        'Lịch sử & Địa lí: Tiến trình lịch sử Việt Nam cận - hiện đại; địa lý các châu lục trên thế giới và vị trí, chủ quyền biển đảo của Việt Nam.'
      ]
    },
    recommendedLearnings: {
      summary: 'Tư duy tài chính cơ bản, quản trị thời gian và năng lực nghiên cứu khoa học nhỏ.',
      items: [
        'Kỹ năng lập ngân sách cá nhân đơn giản: phân biệt "nhu cầu" (needs) và "mong muốn" (wants).',
        'Năng lực thuyết trình tự tin trước đám đông với sự hỗ trợ của slide trình chiếu hoặc poster trực quan.',
        'Kỹ năng tìm kiếm, chọn lọc và trích dẫn nguồn tài liệu tin cậy trên Internet cho các bài tập dự án.',
        'Phương pháp tư duy hệ thống: nhìn nhận một vấn đề dưới nhiều góc độ (kinh tế, môi trường, xã hội).'
      ]
    },
    requiredAttitudes: {
      summary: 'Tính tự chủ cao độ, lòng chính trực, lòng trắc ẩn và khát vọng vươn lên.',
      items: [
        'Ý thức tự giác và kỷ luật tự thân: tự quản lý thời gian học tập, rèn luyện thể thao và sinh hoạt.',
        'Lòng trắc ẩn và tinh thần tương thân tương ái, sẵn sàng bảo vệ bạn bè khỏi bạo lực học đường.',
        'Thái độ tôn trọng bình đẳng giới, tôn trọng sự đa dạng văn hóa và quan điểm của người khác.',
        'Khát vọng hoàn thiện bản thân, tự hào về những nỗ lực cá nhân và có tinh thần trách nhiệm với tập thể.'
      ]
    }
  },

  'thcs': {
    gradeId: 'thcs',
    gradeName: 'Trung học cơ sở (Lớp 6 - 9)',
    ageRange: '11 - 15 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống (Khoa học tự nhiên & Công nghệ)',
    generalPhilosophy: {
      summary: 'Triết lý "Khám phá khoa học bản chất và tư duy thực nghiệm định lượng". Học sinh bước vào giai đoạn tư duy logic hình thức, bắt đầu hiểu cội nguồn cấu tạo vật chất từ nguyên tử, electron đến các định luật cơ học và hóa học.',
      corePrinciples: [
        'Dạy học khoa học qua mô hình và thực nghiệm: Học sinh đặt giả thuyết, thiết kế thí nghiệm và kiểm chứng số liệu.',
        'Kết nối khoa học với đời sống: Năng lượng, biến đổi khí hậu, vi sinh vật và công nghệ số.',
        'Tôn trọng tư duy độc lập và năng lực tự học của lứa tuổi thiếu niên.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Làm chủ các định luật Vật lý sơ cấp, phản ứng Hóa học vô cơ cơ bản và cấu tạo tế bào Sinh học.',
      items: [
        'Vật lý: Định luật Ohm, cơ năng, nhiệt lượng, quang hình học và dòng điện một chiều/xoay chiều.',
        'Hóa học: Bảng tuần hoàn Mendeleev, liên kết hóa học, axit, bazơ, muối và kim loại/phi kim.',
        'Sinh học: Cấu tạo tế bào, di truyền Menđen, hệ cơ quan người và sinh thái học.',
        'Toán học: Đại số (phương trình bậc nhất/bậc hai, hệ thức Vi-ét) và Hình học phẳng (chứng minh tam giác bằng nhau, đường tròn).'
      ]
    },
    recommendedLearnings: {
      summary: 'Tư duy mô phỏng máy tính và phương pháp nghiên cứu khoa học kỹ thuật.',
      items: [
        'Bước đầu viết code mô phỏng hiện tượng vật lý hoặc thuật toán tính toán bằng Python/Scratch.',
        'Tham gia các dự án STEM liên môn và cuộc thi sáng tạo khoa học kỹ thuật dành cho thanh thiếu niên.',
        'Kỹ năng phản biện dữ liệu: đánh giá sai số thí nghiệm và phân tích nguyên nhân sai lệch.'
      ]
    },
    requiredAttitudes: {
      summary: 'Tinh thần khoa học khách quan, tư duy phản biện và tinh thần cống hiến xã hội.',
      items: [
        'Tôn trọng sự thật khoa học và dữ liệu thực nghiệm trung thực.',
        'Tư duy phản biện lành mạnh: không chấp nhận kiến thức thụ động mà luôn tìm hiểu nguyên lý sơ khởi.',
        'Trách nhiệm công dân đối với môi trường tự nhiên và cộng đồng.'
      ]
    }
  },

  'thpt': {
    gradeId: 'thpt',
    gradeName: 'Trung học phổ thông (Lớp 10 - 12)',
    ageRange: '15 - 18 tuổi',
    bookSeriesFocus: 'Kết nối tri thức với cuộc sống (Chuyên đề học tập nâng cao)',
    generalPhilosophy: {
      summary: 'Triết lý "Toán học hóa sâu sắc, tư duy khoa học thực nghiệm và định hướng nghề nghiệp tương lai". Học sinh làm chủ các mô hình toán học vi phân, lượng tử và năng lượng để sẵn sàng bước vào đại học hoặc làm chủ công nghệ mới.',
      corePrinciples: [
        'Tư duy mô hình hóa toán học: Hiểu cội nguồn mọi định luật qua đạo hàm, tích phân và vector.',
        'Định hướng nghề nghiệp và tự chủ định hình tương lai.',
        'Tự do sáng tạo và khai phóng tiềm năng trí tuệ cá nhân.'
      ]
    },
    mandatoryLearnings: {
      summary: 'Toán giải tích và hình học giải tích, Vật lý hiện đại, Hóa học hữu cơ và Di truyền học phân tử.',
      items: [
        'Toán: Đạo hàm, vi phân, tích phân, số phức và hình học giải tích Oxyz trong không gian.',
        'Vật lý: Động lực học Newton nâng cao, dao động điều hòa vi phân, sóng điện từ và vật lý hạt nhân.',
        'Hóa học: Hóa học hữu cơ chuyên sâu (Hydrocarbon, Alcohol, Polymer) và nhiệt động học phản ứng.',
        'Sinh học: Cơ chế di truyền ở cấp độ phân tử (DNA, RNA, Protein), đột biến và tiến hóa.'
      ]
    },
    recommendedLearnings: {
      summary: 'Lập trình tính toán khoa học, trí tuệ nhân tạo (AI) và dự án nghiên cứu chuyên sâu.',
      items: [
        'Mô phỏng các hệ vật lý và hóa học bằng code tính toán số (Numerical simulation).',
        'Tìm hiểu nền tảng toán học của Machine Learning (Đại số tuyến tính, Gradient Descent).',
        'Năng lực đọc hiểu tài liệu khoa học quốc tế và chuẩn bị hồ sơ du học hoặc đại học hàng đầu.'
      ]
    },
    requiredAttitudes: {
      summary: 'Khát vọng cống hiến, tư duy toàn cầu, lòng kiên trì theo đuổi chân lý và bản lĩnh tự chủ.',
      items: [
        'Bản lĩnh đối mặt với các thử thách học thuật phức tạp mà không nản chí.',
        'Ý thức cống hiến cho sự phát triển của đất nước và nhân loại.',
        'Thói quen học tập suốt đời (Lifelong Learning) trong kỷ nguyên AI.'
      ]
    }
  }
};

export const getGradePhilosophy = (gradeId: string): GradePhilosophy => {
  if (gradeId.startsWith('mn-') || gradeId === 'mam-non') {
    return GRADE_PHILOSOPHIES['mam-non'];
  }
  if (gradeId === 'th-lop-1' || gradeId === 'lop-1') {
    return GRADE_PHILOSOPHIES['lop-1'];
  }
  if (gradeId === 'th-lop-2' || gradeId === 'lop-2') {
    return GRADE_PHILOSOPHIES['lop-2'];
  }
  if (gradeId === 'th-lop-3' || gradeId === 'lop-3') {
    return GRADE_PHILOSOPHIES['lop-3'];
  }
  if (gradeId === 'th-lop-4' || gradeId === 'lop-4') {
    return GRADE_PHILOSOPHIES['lop-4'];
  }
  if (gradeId === 'th-lop-5' || gradeId === 'lop-5') {
    return GRADE_PHILOSOPHIES['lop-5'];
  }
  if (gradeId.startsWith('thcs-') || gradeId === 'thcs') {
    return GRADE_PHILOSOPHIES['thcs'];
  }
  if (gradeId.startsWith('thpt-') || gradeId === 'thpt') {
    return GRADE_PHILOSOPHIES['thpt'];
  }
  return GRADE_PHILOSOPHIES[gradeId] || GRADE_PHILOSOPHIES['lop-1'];
};


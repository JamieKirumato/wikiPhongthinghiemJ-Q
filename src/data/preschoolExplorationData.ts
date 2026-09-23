import { PreschoolExplorationData } from '../types/curriculum';

export const PRESCHOOL_EXPLORATION_MAP: Record<string, PreschoolExplorationData> = {
  'sim-mn-01': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ: Cảm thụ Màu sắc & Thị giác',
    ageGroup: '4 - 5 tuổi',
    materials: ['3 đèn pin bọc giấy kiếng màu (Đỏ, Xanh lục, Xanh lam)', 'Màn chiếu trắng phẳng', 'Phòng tối'],
    teacherPrompt: 'Đố các con biết khi ngọn đèn Đỏ gặp ngọn đèn Xanh lá cây thì sẽ biến hóa thành màu gì nào?',
    variableTuning: {
      name: 'Cường độ 3 nguồn sáng RGB',
      description: 'Điều chỉnh độ sáng từ mờ nhẹ (0) đến cực đại (255)',
      options: [
        { label: 'Chỉ bật Đỏ + Lam', outcome: 'Xuất hiện màu Tím hoa cà huyền ảo!' },
        { label: 'Chỉ bật Đỏ + Lục', outcome: 'Hòa thành màu Vàng nắng ấm áp rực rỡ!' },
        { label: 'Bật cả 3 màu cực đại', outcome: 'Kỳ diệu thay! Ba màu gộp lại biến thành Ánh Sáng Trắng tinh khiết!' }
      ]
    },
    spatialLayout: {
      action: 'Dời 3 nguồn sáng chồng khít tâm lên nhau',
      outcome: 'Các quầng sáng giao thoa tạo thành bánh xe màu sắc 7 sắc cầu vồng'
    },
    gestureDynamics: {
      action: 'Bật tắt ngắt quãng luân phiên các ngọn đèn',
      outcome: 'Màu sắc chớp nháy vui nhộn như bữa tiệc ánh sáng lễ hội'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bé tắt hết cả 3 ngọn đèn?',
      discoveryOutcome: 'Bóng tối xuất hiện! Bé hiểu ánh sáng tạo nên sắc màu cho thế giới.',
      badgeName: 'Phù Thủy Ánh Sáng',
      badgeIcon: 'Sparkles'
    }
  },

  'sim-mn-02': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Khám phá Khoa học (Lực đẩy nước)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Bể nước trong suốt', 'Hòn sỏi', 'Chiếc lá bàng', 'Quả bóng nhựa', 'Chùm chìa khóa', 'Mẩu xốp'],
    teacherPrompt: 'Theo các con, hòn sỏi bé tí và quả bóng to đùng, vật nào sẽ chìm nghỉm dưới đáy bể?',
    variableTuning: {
      name: 'Độ đặc / rỗng của vật thể',
      description: 'Chọn vật liệu từ siêu nhẹ (xốp) đến kim loại nặng',
      options: [
        { label: 'Vật nhẹ & rỗng (bóng, lá, xốp)', outcome: 'Nổi bồng bềnh dập dềnh trên mặt nước!' },
        { label: 'Vật đặc & nặng (sỏi, chìa khóa sắt)', outcome: 'Chìm vèo xuống tận đáy bể phát tiếng cạch!' },
        { label: 'Thử ấn mẩu xốp xuống đáy rồi thả tay', outcome: 'Mẩu xốp bắn vọt lên mặt nước như tên lửa nhỏ!' }
      ]
    },
    spatialLayout: {
      action: 'Thả vật nằm ngang hay dựng đứng',
      outcome: 'Chiếc lá đặt nằm ngang nổi nhẹ tênh, dựng đứng chém nước nổi một phần'
    },
    gestureDynamics: {
      action: 'Thả từ trên cao tạo sóng nước bắn tung tóe',
      outcome: 'Sóng nước lăn tăn dâng lên mép bể rồi lắng dịu'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bé gắn hòn sỏi nhỏ vào miếng xốp to?',
      discoveryOutcome: 'Miếng xốp cõng hòn sỏi cùng nổi! Bé học về sự tương trợ trọng lượng.',
      badgeName: 'Thuyền Trưởng Bể Bơi',
      badgeIcon: 'Ship'
    }
  },

  'sim-mn-03': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Làm quen với Toán (So sánh & Cân bằng)',
    ageGroup: '4 - 5 tuổi',
    materials: ['Cầu bập bênh gỗ đồ chơi', 'Các bạn thú bông (Gấu lớn, Thỏ nhỡ, Sóc nhỏ)'],
    teacherPrompt: 'Bạn Gấu to béo ngồi một đầu làm bập bênh chạm đất rồi, làm sao cho bạn Thỏ nâng bạn Gấu lên?',
    variableTuning: {
      name: 'Số lượng bạn thú nhỏ',
      description: 'Thêm các bạn thú nhỏ vào đĩa bên kia',
      options: [
        { label: 'Thêm 1 bạn Thỏ', outcome: 'Bập bênh vẫn nghiêng về phía bạn Gấu béo' },
        { label: 'Thêm 2 bạn Thỏ + 1 bạn Sóc', outcome: 'Cầu bập bênh bắt đầu rục rịch nhấc lên!' },
        { label: 'Thêm đủ 3 bạn Thỏ', outcome: 'Tuyệt vời! Bập bênh nằm ngang thăng bằng tuyệt đối!' }
      ]
    },
    spatialLayout: {
      action: 'Dời bạn Gấu trượt lại gần trục quay ở giữa',
      outcome: 'Kỳ lạ chưa: Chỉ 1 bạn Thỏ ở đầu xa cũng nâng bổng được bạn Gấu to!'
    },
    gestureDynamics: {
      action: 'Nhấn nhẹ một đầu rồi thả tay',
      outcome: 'Bập bênh đu đưa nhịp nhàng lên xuống như điệu múa vui tai'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu cho cả 2 bạn cùng ngồi ngay chính giữa trục quay?',
      discoveryOutcome: 'Bập bênh đứng yên bất động vì cánh tay đòn bằng 0!',
      badgeName: 'Kỹ Sư Cân Bằng',
      badgeIcon: 'Scale'
    }
  },

  'sim-mn-04': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Khám phá Khoa học (Quang học sơ khai)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Đèn pin siêu sáng', 'Con khủng long đồ chơi', 'Bức tường trắng phòng tối'],
    teacherPrompt: 'Chiếc bóng của chú khủng long trên tường biết biến hóa to nhỏ kìa, bé làm cách nào vậy?',
    variableTuning: {
      name: 'Khoảng cách từ Khủng long đến ngọn đèn',
      description: 'Kéo khủng long lại gần đèn hoặc lùi xa đèn',
      options: [
        { label: 'Kéo sát ngọn đèn pin', outcome: 'Bóng khủng long phóng to khổng lồ chiếm trọn cả bức tường!' },
        { label: 'Kéo lùi xa đèn về phía tường', outcome: 'Chiếc bóng thu nhỏ dần, nét vẽ sắc cạnh rõ ràng.' },
        { label: 'Che một nửa ngọn đèn', outcome: 'Bóng mờ nhòe viền huyền bí như sương mù.' }
      ]
    },
    spatialLayout: {
      action: 'Nâng khủng long lên cao hoặc hạ thấp xuống sàn',
      outcome: 'Bóng lướt vút lên trần nhà hoặc trườn dài trên mặt đất'
    },
    gestureDynamics: {
      action: 'Lắc lư khủng long qua lại trước luồng sáng',
      outcome: 'Chiếc bóng nhảy múa theo điệu nhạc kịch rối bóng sống động'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu dùng 2 ngọn đèn pin chiếu cùng lúc?',
      discoveryOutcome: 'Chú khủng long có tới 2 chiếc bóng cùng một lúc!',
      badgeName: 'Bậc Thầy Ảo Ảnh',
      badgeIcon: 'Ghost'
    }
  },

  'sim-mn-05': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ: Cảm thụ Âm nhạc (Cao độ & Âm thanh)',
    ageGroup: '5 - 6 tuổi',
    materials: ['5 chiếc cốc thủy tinh giống hệt nhau', 'Bình nước', 'Chiếc đũa gỗ', 'Thìa inox'],
    teacherPrompt: 'Cô gõ cốc có nhiều nước nghe trầm ấm hay thánh thót như tiếng chuông?',
    variableTuning: {
      name: 'Mức nước trong từng chiếc cốc',
      description: 'Rót nước theo nấc từ vơi 1 nấc đến đầy tràn',
      options: [
        { label: 'Cốc rót đầy ắp nước', outcome: 'Tiếng gõ kêu "Tùng" trầm ấm, đầm sâu.' },
        { label: 'Cốc chỉ có một chút nước', outcome: 'Tiếng gõ kêu "Ting" thanh thoát trong trẻo!' },
        { label: 'Xếp 5 cốc mức nước tăng dần', outcome: 'Tạo thành dàn nhạc Đồ - Rê - Mi - Pha - Sol ngân vang!' }
      ]
    },
    spatialLayout: {
      action: 'Xếp cốc thành hàng ngang vs vòng cung bán nguyệt',
      outcome: 'Trẻ gõ liên hoàn thuận tay như một nghệ sĩ đàn phiến đá'
    },
    gestureDynamics: {
      action: 'Gõ bằng đũa gỗ vs thìa kim loại',
      outcome: 'Đũa gỗ âm thanh mộc mạc êm ái; thìa kim loại âm thanh đanh giòn vang xa'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bé dùng ngón tay ướt miết quanh miệng cốc?',
      discoveryOutcome: 'Cốc thủy tinh tự hát lên một âm thanh ma thuật ngân dài!',
      badgeName: 'Nghệ Sĩ Thủy Tinh',
      badgeIcon: 'Music'
    }
  },

  'sim-mn-06': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Khám phá Khoa học (Lực từ nam châm)',
    ageGroup: '4 - 5 tuổi',
    materials: ['Thanh nam châm chữ U', 'Kẹp giấy sắt', 'Cúc nhựa', 'Đồng xu', 'Mẩu gỗ', 'Tẩy cao su'],
    teacherPrompt: 'Chiếc gậy thần kỳ có thể câu được đồ vật nào mà không cần chạm tay vào?',
    variableTuning: {
      name: 'Chất liệu đồ vật thử nghiệm',
      description: 'Thử nghiệm kim loại sắt vs phi kim loại',
      options: [
        { label: 'Đưa lại gần kẹp giấy & đinh sắt', outcome: 'Kẹp sắt nhảy vọt lên dính "tách" chặt vào đầu nam châm!' },
        { label: 'Đưa lại gần cúc nhựa, mẩu gỗ', outcome: 'Đồ nhựa và gỗ nằm yên bất động, không bị hút.' },
        { label: 'Đưa lại gần thanh nam châm thứ hai', outcome: 'Hai đầu cùng màu đẩy nhau bắn ra, khác màu hút chặt!' }
      ]
    },
    spatialLayout: {
      action: 'Lót tờ bìa giấy hoặc cốc nước ở giữa',
      outcome: 'Lực từ xuyên qua tờ giấy mỏng vẫn kéo kẹp sắt chạy theo!'
    },
    gestureDynamics: {
      action: 'Rê nam châm lướt nhanh trên mặt bàn',
      outcome: 'Đàn kẹp giấy như đàn kiến nhỏ nối đuôi nhau nhảy múa'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu thả kẹp giấy vào cốc nước rồi đưa nam châm áp ngoài thành cốc?',
      discoveryOutcome: 'Kẹp giấy leo ngược từ đáy cốc lên miệng nước như có phép thuật!',
      badgeName: 'Hiệp Sĩ Nam Châm',
      badgeIcon: 'Compass'
    }
  },

  'sim-mn-07': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ & Nhận thức: Cấu trúc Hình học Tự nhiên',
    ageGroup: '5 - 6 tuổi',
    materials: ['Chậu nước xà phòng óng ánh', 'Que thổi tròn', 'Que thổi vuông', 'Que hình ngôi sao'],
    teacherPrompt: 'Bé nhúng chiếc que hình ngôi sao thì bong bóng bay ra sẽ có hình gì?',
    variableTuning: {
      name: 'Lực thổi của luồng hơi',
      description: 'Thổi nhẹ êm vs hít sâu thổi một luồng hơi lớn',
      options: [
        { label: 'Thổi nhẹ nhàng từ từ', outcome: 'Tạo ra quả bóng xà phòng to khổng lồ bay chậm rãi!' },
        { label: 'Thổi nhanh dồn dập', outcome: 'Hàng chục quả bong bóng li ti bay rợp cả bầu trời!' },
        { label: 'Dùng que hình vuông hoặc sao', outcome: 'Bất ngờ chưa: Dù que hình gì thì bong bóng bay ra vẫn luôn tròn vo!' }
      ]
    },
    spatialLayout: {
      action: 'Thổi bong bóng bay lên cao đón ánh nắng mặt trời',
      outcome: 'Màng bóng lấp lánh phản chiếu 7 sắc cầu vồng rực rỡ'
    },
    gestureDynamics: {
      action: 'Chạm ngón tay khô vs ngón tay nhúng ướt xà phòng vào bóng',
      outcome: 'Ngón tay khô làm nổ "bốp"; ngón tay ướt xà phòng xuyên qua mà bóng không vỡ!'
    },
    whatIfChallenge: {
      question: 'Làm thế nào để nhốt một quả bóng nhỏ vào bên trong một quả bóng to?',
      discoveryOutcome: 'Bé cắm ống hút ướt xuyên vào quả bóng to và thổi tiếp quả thứ hai!',
      badgeName: 'Vương Quốc Bong Bóng',
      badgeIcon: 'Circle'
    }
  },

  'sim-mn-08': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Thế giới Thực vật (Tính hướng sáng)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Chậu hạt đậu xanh đã nảy mầm', 'Hộp các-tông có khoét 1 lỗ thủng', 'Đèn chiếu'],
    teacherPrompt: 'Cây đậu con bị nhốt trong hộp tối sẽ làm cách nào để tìm thấy ánh nắng mặt trời?',
    variableTuning: {
      name: 'Vị trí của lỗ khoét trên hộp',
      description: 'Đổi lỗ thủng sang bên trái, bên phải hoặc trên đỉnh nóc',
      options: [
        { label: 'Khoét lỗ bên phải', outcome: 'Thân cây mầm uốn cong sang phải vươn đầu ra đón nắng!' },
        { label: 'Khoét lỗ bên trái', outcome: 'Cây đổi hướng, uốn lượn hình chữ S quay ngoắt sang trái!' },
        { label: 'Khoét lỗ ngay trên đỉnh', outcome: 'Cây vươn thẳng đứng kiêu hãnh vươn cao về bầu trời.' }
      ]
    },
    spatialLayout: {
      action: 'Xoay ngược chậu cây 180 độ',
      outcome: 'Sau 2 ngày, ngọn cây lại kiên trì quay đầu hướng về phía có ánh sáng'
    },
    gestureDynamics: {
      action: 'Tua nhanh dòng thời gian sinh trưởng 5 ngày',
      outcome: 'Quan sát ngọn mầm xanh vươn mình như một thước phim kỳ diệu'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bịt kín hoàn toàn không cho ánh sáng lọt vào?',
      discoveryOutcome: 'Cây mọc dài khẳng khiu và lá ngả màu vàng nhạt vì thiếu nắng!',
      badgeName: 'Bác Nông Dân Tí Hon',
      badgeIcon: 'Sprout'
    }
  },

  'sim-mn-09': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Khám phá Thế giới Vi mô (Kính lúp)',
    ageGroup: '4 - 5 tuổi',
    materials: ['Chiếc kính lúp cán tròn', 'Chiếc lá bàng', 'Bé kiến bò', 'Mảnh vải dệt', 'Hạt cát'],
    teacherPrompt: 'Chiếc mắt kính thần kỳ này giúp mắt bé nhìn thấy những điều bí mật gì nào?',
    variableTuning: {
      name: 'Khoảng cách từ kính lúp đến đồ vật',
      description: 'Đưa sát vào vật rồi nhấc ra xa dần để lấy nét',
      options: [
        { label: 'Để kính lúp quá sát vật', outcome: 'Hình ảnh to lên một chút nhưng chưa thật rõ nét.' },
        { label: 'Đưa kính lúp cách vật 5cm (tiêu cự chuẩn)', outcome: 'Ồ! Từng đường gân lá li ti và các đốt chân chú kiến hiện rõ mồn một!' },
        { label: 'Nhấc kính lúp ra quá xa', outcome: 'Hình ảnh bị mờ nhòe và lộn ngược ngộ nghĩnh.' }
      ]
    },
    spatialLayout: {
      action: 'Soi hạt cát thô vs sợi lông tơ của chiếc lá',
      outcome: 'Phát hiện hạt cát lấp lánh như viên kim cương tí hon'
    },
    gestureDynamics: {
      action: 'Lia kính lúp đuổi theo chú kiến đang bò',
      outcome: 'Bé rèn luyện khả năng phối hợp tay - mắt tập trung cao độ'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bé soi kính lúp lên ngón tay của chính mình?',
      discoveryOutcome: 'Bé nhìn thấy các vòng xoáy vân tay độc nhất vô nhị của bản thân!',
      badgeName: 'Nhà Thám Hiểm Rừng Xanh',
      badgeIcon: 'Search'
    }
  },

  'sim-mn-10': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Hóa học Đời sống (Sự hòa tan)',
    ageGroup: '4 - 5 tuổi',
    materials: ['Cốc nước thủy tinh', 'Thìa đường trắng', 'Quả chanh tươi', 'Hạt đậu'],
    teacherPrompt: 'Các hạt đường nhỏ xíu sau khi khuấy đều đã trốn đi đâu mất rồi?',
    variableTuning: {
      name: 'Nhiệt độ của nước & Lượng đường',
      description: 'Thử nước đá lạnh vs nước ấm; thêm 1 thìa vs 5 thìa đường',
      options: [
        { label: 'Cho 1 thìa đường vào nước ấm', outcome: 'Đường tan biến vèo cực nhanh, nước trong veo ngọt lịm!' },
        { label: 'Cho đường vào cốc nước đá lạnh', outcome: 'Đường tan chậm hơn rất nhiều, phải khuấy lâu hơn.' },
        { label: 'Cho thật nhiều 6 thìa đường', outcome: 'Đường đọng lại dưới đáy cốc vì nước đã no đường (bão hòa)!' }
      ]
    },
    spatialLayout: {
      action: 'Vắt chanh và thả cả hạt chanh vào cốc',
      outcome: 'Nước cốt chanh hòa quyện, còn hạt chanh không tan mà chìm nghỉm dưới đáy'
    },
    gestureDynamics: {
      action: 'Khuấy đều tay tạo dòng xoáy nước',
      outcome: 'Các hạt đường cuộn theo lốc xoáy rồi tan biến vào lòng nước'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bé cho cát vào cốc nước khuấy thay vì cho đường?',
      discoveryOutcome: 'Cát không hề tan! Cát lắng xuống đáy làm nước đục ngầu.',
      badgeName: 'Bé Pha Chế Tài Ba',
      badgeIcon: 'Coffee'
    }
  },

  'sim-mn-11': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Hiện tượng Tự nhiên (Tĩnh điện vui nhộn)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Quả bóng bay cao su', 'Mái tóc khô của bé', 'Mẩu giấy vụn cắt nhỏ', 'Mặt gương'],
    teacherPrompt: 'Quả bóng cọ vào tóc có phép thuật hút được những mẩu giấy bay lên như đàn bướm kìa!',
    variableTuning: {
      name: 'Số lần cọ xát bóng bay vào tóc khô',
      description: 'Cọ 3 lần vs cọ nhanh 15 lần liên tục',
      options: [
        { label: 'Cọ xát nhẹ 3 lần', outcome: 'Quả bóng chỉ hút được 1 - 2 mẩu giấy nhỏ xíu.' },
        { label: 'Cọ xát nhanh mạnh 15 lần', outcome: 'Hàng chục mẩu giấy nhảy tanh tách bám chặt vào quả bóng!' },
        { label: 'Đưa quả bóng lại gần mái tóc', outcome: 'Các sợi tóc của bé dựng đứng xòe rộng như chú nhím!' }
      ]
    },
    spatialLayout: {
      action: 'Áp quả bóng đã cọ xát vào bức tường hoặc mặt gương',
      outcome: 'Quả bóng tự dính chặt trên tường như có keo dán vô hình!'
    },
    gestureDynamics: {
      action: 'Đưa bóng lại gần dòng nước nhỏ chảy từ vòi',
      outcome: 'Kỳ diệu thay: Dòng nước nhỏ bị quả bóng hút uốn cong sang một bên!'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu dùng tóc ướt sũng nước để cọ bóng?',
      discoveryOutcome: 'Tóc ướt không sinh ra tĩnh điện, mẩu giấy nằm im bất động!',
      badgeName: 'Phù Thủy Tĩnh Điện',
      badgeIcon: 'Zap'
    }
  },

  'sim-mn-12': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Làm quen với Toán (Đo lường sơ đẳng)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Quyển truyện tranh cổ tích', 'Chiếc bút chì', 'Hộp que tính 5cm', 'Cục tẩy gôm'],
    teacherPrompt: 'Quyển sách này dài bằng bao nhiêu chiếc que tính xếp nối đuôi nhau nhỉ?',
    variableTuning: {
      name: 'Lựa chọn đơn vị đo',
      description: 'Đo bằng que tính ngắn vs bút chì dài',
      options: [
        { label: 'Đo bằng que tính 5cm', outcome: 'Cần đúng 4 que tính xếp nối tiếp từ đầu đến cuối sách.' },
        { label: 'Đo bằng chiếc bút chì dài 10cm', outcome: 'Chỉ cần đúng 2 chiếc bút chì là đo trọn quyển sách.' },
        { label: 'Đo bằng cục tẩy nhỏ 2.5cm', outcome: 'Cần tới 8 cục tẩy xếp thành hàng dài!' }
      ]
    },
    spatialLayout: {
      action: 'Xếp các que tính thẳng hàng không để khe hở',
      outcome: 'Hình thành cho trẻ tư duy đo lường chuẩn xác, không chắp vá lộn xộn'
    },
    gestureDynamics: {
      action: 'Dùng ngón tay chạm đếm từng que tính: 1, 2, 3, 4',
      outcome: 'Rèn luyện kỹ năng đếm tương ứng 1-1 và kết luận kết quả đo'
    },
    whatIfChallenge: {
      question: 'Tại sao đo cùng một quyển sách mà que tính cần 4 cái, bút chì chỉ cần 2 cái?',
      discoveryOutcome: 'Bé nhận ra quy luật: Thước đo càng dài thì số lần đo càng ít!',
      badgeName: 'Nhà Toán Học Nhí',
      badgeIcon: 'Ruler'
    }
  },

  'sim-mn-13': {
    domain: 'the-chat',
    domainLabel: 'Phát triển Thể chất & Vận động: Không khí & Sức gió',
    ageGroup: '4 - 5 tuổi',
    materials: ['Chiếc quạt giấy gấp', 'Chong chóng 4 cánh sắc màu', 'Chiếc thuyền xốp nhẹ'],
    teacherPrompt: 'Bé không nhìn thấy không khí, nhưng làm sao để biết không khí đang chuyển động?',
    variableTuning: {
      name: 'Tốc độ và lực phẩy quạt',
      description: 'Phẩy nhẹ hiu hiu vs quạt nhanh dồn dập',
      options: [
        { label: 'Phẩy quạt nhè nhẹ', outcome: 'Chong chóng bắt đầu quay từ từ từng vòng êm ái.' },
        { label: 'Quạt thật mạnh dứt khoát', outcome: 'Gió ào tới, chong chóng quay tít mù tạo thành vệt màu tròn xoe!' },
        { label: 'Hướng quạt đẩy thuyền xốp', outcome: 'Chiếc thuyền xốp lướt băng băng trên mặt sàn như có buồm đẩy.' }
      ]
    },
    spatialLayout: {
      action: 'Đổi hướng quạt từ thổi ngang sang thổi từ dưới lên',
      outcome: 'Những mẩu giấy vụn bay lượn lờ lơ lửng trong không trung'
    },
    gestureDynamics: {
      action: 'Bé cầm chong chóng chạy thật nhanh về phía trước',
      outcome: 'Gió ngược chiều làm chong chóng tự quay tít mà không cần quạt giấy!'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu quạt trong một chiếc hộp kín bưng?',
      discoveryOutcome: 'Không có luồng gió thoát ra ngoài, chong chóng đứng yên!',
      badgeName: 'Bé Cưỡi Gió Bay',
      badgeIcon: 'Wind'
    }
  },

  'sim-mn-14': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Hiện tượng Tự nhiên (Vòng tuần hoàn nước)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Bình xịt nước', 'Phiến đá ngoài sân nắng', 'Phiến đá trong bóng râm râm mát'],
    teacherPrompt: 'Vũng nước mưa trên sân trường sau buổi trưa nắng gắt đã biến đi đâu rồi?',
    variableTuning: {
      name: 'Nhiệt độ môi trường (Nắng gắt vs Bóng râm)',
      description: 'So sánh tốc độ khô của hai giọt nước giống nhau',
      options: [
        { label: 'Chấm giọt nước dưới nắng gắt', outcome: 'Chỉ 10 phút sau giọt nước co nhỏ rồi biến mất hoàn toàn!' },
        { label: 'Chấm giọt nước trong bóng râm mát', outcome: 'Giọt nước vẫn đọng lại rất lâu, bay hơi cực kỳ chậm chạp.' },
        { label: 'Dùng quạt thổi vào giọt nước', outcome: 'Gió giúp nước bốc hơi nhanh gấp đôi!' }
      ]
    },
    spatialLayout: {
      action: 'Chấm 1 giọt nước dày vs xoa mỏng giọt nước ra mặt sân',
      outcome: 'Vệt nước mỏng khô ngay tức khắc vì diện tích tiếp xúc với nắng lớn'
    },
    gestureDynamics: {
      action: 'Úp chiếc cốc thủy tinh lên giọt nước dưới nắng',
      outcome: 'Hơi nước bay lên đọng thành các giọt sương li ti trên thành cốc!'
    },
    whatIfChallenge: {
      question: 'Nước bốc hơi bay lên trời sẽ biến thành cái gì?',
      discoveryOutcome: 'Nước tụ lại thành những đám mây trắng bồng bềnh và tạo thành mưa!',
      badgeName: 'Bạn Của Thần Mưa',
      badgeIcon: 'CloudRain'
    }
  },

  'sim-mn-15': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ: Sáng tạo Nghệ thuật (Tranh sữa chuyển động)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Đĩa sứ sâu lòng', 'Sữa tươi nguyên kem', 'Màu thực phẩm (Đỏ, Vàng, Xanh)', 'Tăm bông', 'Nước rửa bát'],
    teacherPrompt: 'Chiếc tăm bông phép thuật chạm vào đĩa sữa sẽ làm các vệt màu khiêu vũ ra sao?',
    variableTuning: {
      name: 'Vị trí chạm tăm bông xà phòng',
      description: 'Chấm chính giữa đĩa sữa vs chấm ở mép viền ngoài',
      options: [
        { label: 'Chấm tăm bông vào chính tâm', outcome: 'Màu nổ tung bắn ra xung quanh như chùm pháo hoa rực rỡ!' },
        { label: 'Chấm tăm bông ở mép viền', outcome: 'Các dải màu cuộn tròn xoáy về phía đối diện tạo hoa văn xoắn ốc.' },
        { label: 'Chấm giữ tăm bông liên tục 5 giây', outcome: 'Dòng sữa sôi sục cuộn tròn liên hồi tạo bức tranh chuyển động không ngừng!' }
      ]
    },
    spatialLayout: {
      action: 'Đặt một tờ giấy trắng áp nhẹ lên mặt đĩa sữa',
      outcome: 'In trọn vẹn hoa văn cẩm thạch huyền ảo lên giấy thành tác phẩm nghệ thuật'
    },
    gestureDynamics: {
      action: 'Nhỏ các giọt màu gần nhau vs cách xa nhau',
      outcome: 'Các màu tự hòa trộn thành màu xanh lá, màu tím và màu cam bất ngờ'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu thay sữa bằng nước lọc thông thường?',
      discoveryOutcome: 'Nước lọc không có chất béo, màu loãng toẹt và không có dòng xoáy múa!',
      badgeName: 'Họa Sĩ Sữa Ma Thuật',
      badgeIcon: 'Palette'
    }
  },

  'sim-mn-16': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Khám phá Khoa học (Lực đẩy dung dịch muối)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Cốc thủy tinh trong suốt', 'Quả trứng gà tươi', 'Lọ muối ăn', 'Thìa xúc'],
    teacherPrompt: 'Làm thế nào để quả trứng nặng trĩu đang nằm dưới đáy cốc bỗng nhiên nổi bồng bềnh?',
    variableTuning: {
      name: 'Số lượng thìa muối hòa tan',
      description: 'Thêm muối từng thìa một vào cốc nước',
      options: [
        { label: 'Cho 1 thìa muối', outcome: 'Quả trứng vẫn nằm yên dưới đáy cốc (chưa đủ độ nổi).' },
        { label: 'Cho 3 thìa muối khuấy tan', outcome: 'Kỳ diệu! Quả trứng bắt đầu nhấc mình lơ lửng ở lưng chừng cốc!' },
        { label: 'Cho 5 thìa muối đầy', outcome: 'Quả trứng nổi hẳn lên bề mặt cốc nước nhô đầu lên thở!' }
      ]
    },
    spatialLayout: {
      action: 'Rót thêm từ từ một lớp nước lọc ngọt lên trên mặt nước muối',
      outcome: 'Quả trứng lơ lửng chuẩn xác ngay tại ranh giới giữa hai tầng nước!'
    },
    gestureDynamics: {
      action: 'Dùng ngón tay ấn quả trứng xuống đáy rồi buông tay',
      outcome: 'Nước muối đẩy quả trứng bật nổi ngược trở lại ngay lập tức'
    },
    whatIfChallenge: {
      question: 'Tại sao khi đi tắm ở Biển Chết con người có thể nằm nổi đọc báo mà không bị chìm?',
      discoveryOutcome: 'Bé khám phá: Nước biển càng mặn nhiều muối thì càng nâng bổng vật thể!',
      badgeName: 'Nhà Khoa Học Đại Dương',
      badgeIcon: 'Waves'
    }
  },

  'sim-mn-17': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ & Thị giác: Lọc màu Quang học',
    ageGroup: '4 - 5 tuổi',
    materials: ['Kính lọc màu Đỏ, Lam, Vàng bằng nhựa trong', 'Bức tranh vẽ mật mã bí mật'],
    teacherPrompt: 'Đeo cặp kính màu thần kỳ vào mắt, bé có thấy chú gấu bông tàng hình biến mất không?',
    variableTuning: {
      name: 'Màu sắc của tấm kính lọc',
      description: 'Đổi tấm kính lọc Đỏ sang Xanh lam hoặc Vàng',
      options: [
        { label: 'Đặt tấm kính Đỏ trước mắt', outcome: 'Mọi nét vẽ màu đỏ biến mất, chỉ còn bức tranh vẽ màu xanh hiện rõ!' },
        { label: 'Đặt tấm kính Xanh lam', outcome: 'Ngược lại: Nét vẽ màu xanh biến mất, nét vẽ màu đỏ nổi bật lên!' },
        { label: 'Chồng tấm Đỏ lên tấm Vàng', outcome: 'Cảnh vật chuyển sang màu Cam hoàng hôn ấm áp lộng lẫy.' }
      ]
    },
    spatialLayout: {
      action: 'Nhìn qua kính lọc ra ngoài cửa sổ vườn hoa',
      outcome: 'Bé ngạc nhiên thấy bầu trời xanh biến thành màu tím khi nhìn qua kính đỏ'
    },
    gestureDynamics: {
      action: 'Nhấp nháy đưa kính vào rồi nhấc kính ra liên tục',
      outcome: 'Hình ảnh bí mật chớp tắt như trò chơi trốn tìm thị giác'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu chồng cả 3 tấm kính Đỏ, Lam, Vàng lại với nhau?',
      discoveryOutcome: 'Kính tối đen lại như đêm vì đã hấp thụ hầu hết ánh sáng!',
      badgeName: 'Điệp Viên Màu Sắc',
      badgeIcon: 'Eye'
    }
  },

  'sim-mn-18': {
    domain: 'the-chat',
    domainLabel: 'Phát triển Thể chất: Vận động Thô & Giữ Thăng Bằng',
    ageGroup: '4 - 5 tuổi',
    materials: ['Thanh cầu gỗ hẹp đặt trên sàn', 'Nhân vật hoạt hình bé', 'Rổ quả đồ chơi'],
    teacherPrompt: 'Khi đi trên chiếc cầu khỉ nhỏ hẹp, bé dang hai tay ra hay khép tay lại sẽ không bị ngã?',
    variableTuning: {
      name: 'Tư thế của hai cánh tay',
      description: 'Khép tay sát đùi vs Dang rộng hai tay sang ngang',
      options: [
        { label: 'Khép chặt hai tay sát người', outcome: 'Cơ thể bé chao đảo nghiêng ngả, bước đi run rẩy suýt ngã.' },
        { label: 'Dang rộng hai cánh tay sang hai bên', outcome: 'Cơ thể vững chãi như chiếc máy bay, bước đi tự tin qua cầu an toàn!' },
        { label: 'Cầm thêm hai quả bóng ở hai tay', outcome: 'Hai quả bóng làm tay đòn cân bằng giúp bé bước càng thêm vững vàng.' }
      ]
    },
    spatialLayout: {
      action: 'Thu hẹp độ rộng thanh cầu gỗ từ 20cm xuống 10cm',
      outcome: 'Bé tập trung hạ thấp trọng tâm, bước chân nối gót khéo léo'
    },
    gestureDynamics: {
      action: 'Bước đi chầm chậm vs chạy hấp tấp vội vã',
      outcome: 'Bước chậm giúp điều chỉnh tư thế kịp thời; chạy vội dễ mất trọng tâm'
    },
    whatIfChallenge: {
      question: 'Tại sao các nghệ sĩ xiếc đi trên dây luôn cầm một chiếc sào thật dài?',
      discoveryOutcome: 'Chiếc sào dài đóng vai trò như đôi cánh tay dang rộng giữ thăng bằng tuyệt đỉnh!',
      badgeName: 'Nghệ Sĩ Xiếc Nhí',
      badgeIcon: 'Award'
    }
  },

  'sim-mn-19': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Bản thân & Không gian Đối xứng',
    ageGroup: '4 - 5 tuổi',
    materials: ['Chiếc gương soi lớn trong lớp', 'Chiếc nón xinh xắn', 'Nhân vật bé'],
    teacherPrompt: 'Người bạn ở trong gương giống bé như đúc, nhưng khi bé giơ tay phải bạn ấy giơ tay nào?',
    variableTuning: {
      name: 'Khoảng cách giữa bé và chiếc gương',
      description: 'Bước lại gần gương vs lùi xa ra xa',
      options: [
        { label: 'Bé bước lại thật gần gương', outcome: 'Bạn trong gương cũng tiến sát lại gần chạm mũi vào bé!' },
        { label: 'Bé bước lùi lại 3 bước', outcome: 'Bạn trong gương cũng lùi sâu vào trong phòng nhỏ dần.' },
        { label: 'Bé nghiêng đầu sang trái', outcome: 'Bạn trong gương cũng nghiêng đầu sang phía đối diện mỉm cười.' }
      ]
    },
    spatialLayout: {
      action: 'Đặt hai chiếc gương đối diện nhau',
      outcome: 'Bé nhìn thấy hàng trăm bạn nhỏ nối đuôi nhau vào đường hầm vô tận!'
    },
    gestureDynamics: {
      action: 'Bé giơ tay phải lên vẫy chào',
      outcome: 'Bạn trong gương giơ cánh tay đối xứng (tay trái của hình ảnh) chào lại bé'
    },
    whatIfChallenge: {
      question: 'Bé có thể bắt tay người bạn ở trong gương ngoài đời thật được không?',
      discoveryOutcome: 'Không được, vì hình ảnh trong gương là ảnh ảo phản chiếu ánh sáng!',
      badgeName: 'Bé Khám Phá Bản Thân',
      badgeIcon: 'Smile'
    }
  },

  'sim-mn-20': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Làm quen với Toán (Bảo toàn Khối lượng)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Cân điện tử hiện số', 'Viên đất sét màu 100g', 'Dụng cụ nặn đồ chơi'],
    teacherPrompt: 'Viên đất sét to tròn bóp dẹp thành chiếc bánh rán thì nó có bị nhẹ đi không nhỉ?',
    variableTuning: {
      name: 'Hình dạng nặn của khối đất sét',
      description: 'Vo tròn, cán dẹt bánh rán, nặn thành chú sâu dài',
      options: [
        { label: 'Vo thành khối cầu tròn', outcome: 'Kim cân chỉ chuẩn xác 100 gam.' },
        { label: 'Cán mỏng dẹt thành chiếc bánh rán', outcome: 'Kim cân vẫn đứng yên chuẩn xác ở số 100 gam!' },
        { label: 'Kéo dài thành chú rắn ngoằn ngoèo', outcome: 'Hình dáng dài hơn rất nhiều nhưng cân vẫn đúng 100 gam!' }
      ]
    },
    spatialLayout: {
      action: 'Chia khối đất thành 5 viên bi nhỏ rồi đặt tất cả lên cân',
      outcome: 'Tổng của 5 viên bi con cộng lại vẫn đúng tròn 100 gam'
    },
    gestureDynamics: {
      action: 'Dùng ngón tay bóp vụn rồi gom lại vo chặt',
      outcome: 'Lượng đất vẫn nguyên vẹn, hình dạng đổi thay khối lượng không đổi'
    },
    whatIfChallenge: {
      question: 'Nếu cấu bớt một mẩu đất sét nhỏ bỏ ra ngoài thì cân sẽ thế nào?',
      discoveryOutcome: 'Cân hạ số ngay! Vì lượng đất đã bị mất đi một phần.',
      badgeName: 'Bậc Thầy Nặn Đất',
      badgeIcon: 'Layers'
    }
  },

  'sim-mn-21': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ: Âm thanh & Sự Rung Động Cơ Học',
    ageGroup: '5 - 6 tuổi',
    materials: ['Hộp các-tông rỗng lòng', 'Dây chun nịt co giãn đủ kích cỡ'],
    teacherPrompt: 'Khi bé gảy sợi dây chun, bé nhìn thấy sợi dây mờ đi rung rung và nghe thấy tiếng gì?',
    variableTuning: {
      name: 'Độ căng của sợi dây chun',
      description: 'Để dây chun chùng lỏng vs kéo căng hết cỡ quanh hộp',
      options: [
        { label: 'Dây chun chùng lỏng', outcome: 'Tiếng kêu "bụp bụp" trầm thấp, dây rung chậm chạp.' },
        { label: 'Dây chun kéo căng vừa phải', outcome: 'Tiếng kêu "tưng tưng" vui tai rộn rã!' },
        { label: 'Kéo dây chun thật căng', outcome: 'Dây rung vùn vụt phát tiếng "tinh tinh" cao vút trong trẻo!' }
      ]
    },
    spatialLayout: {
      action: 'Căng 4 sợi dây chun độ dày khác nhau lên cùng chiếc hộp',
      outcome: 'Biến chiếc hộp các-tông thành cây đàn ghi-ta tí hon chơi được giai điệu'
    },
    gestureDynamics: {
      action: 'Gảy dây rồi lấy ngón tay chạm giữ chặt dây lại',
      outcome: 'Sợi dây ngừng rung lập tức và âm thanh tắt ngấm ngay!'
    },
    whatIfChallenge: {
      question: 'Đặt một mẩu giấy nhỏ lên sợi dây chun rồi gảy thì mẩu giấy sẽ thế nào?',
      discoveryOutcome: 'Mẩu giấy nhảy bật lên cao như trên sàn nhún nhúp vì dây rung động!',
      badgeName: 'Cây Đàn Ghi-ta Nhí',
      badgeIcon: 'Radio'
    }
  },

  'sim-mn-22': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Kỹ năng Sống & An toàn (Dẫn nhiệt vật liệu)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Bát nước ấm an toàn 40°C', 'Chiếc thìa nhôm', 'Chiếc thìa gỗ', 'Chiếc thìa nhựa'],
    teacherPrompt: 'Cắm cả hai chiếc thìa vào bát canh nóng, chiếc thìa nào bé cầm vào sẽ bị nóng tay?',
    variableTuning: {
      name: 'Chất liệu của chiếc thìa thử nghiệm',
      description: 'Thìa kim loại nhôm vs thìa gỗ tự nhiên vs thìa nhựa',
      options: [
        { label: 'Thìa nhôm kim loại', outcome: 'Chỉ sau 20 giây cán thìa đã ấm nóng ran lên tận ngón tay!' },
        { label: 'Thìa gỗ tự nhiên', outcome: 'Cán thìa vẫn mát rượi dễ chịu, nhiệt độ không hề đổi.' },
        { label: 'Thìa nhựa ăn dặm', outcome: 'Cán thìa cách nhiệt tốt, ấm rất nhẹ an toàn cho bé.' }
      ]
    },
    spatialLayout: {
      action: 'Nhấc thìa nhôm ra và nhúng đuôi thìa vào bát nước đá lạnh',
      outcome: 'Cán thìa kim loại lại lạnh buốt cực nhanh vì truyền nhiệt 2 chiều'
    },
    gestureDynamics: {
      action: 'Chạm nhẹ đầu ngón tay vào đầu cán của 2 thìa cùng lúc',
      outcome: 'Cảm giác xúc giác phân biệt rõ rệt một bên ấm nóng, một bên mát dịu'
    },
    whatIfChallenge: {
      question: 'Vì sao chiếc nồi nấu canh bằng kim loại mà quai cầm lại bọc gỗ hoặc nhựa?',
      discoveryOutcome: 'Để khi mẹ nấu bếp cầm vào quai không bị bỏng tay, rất an toàn!',
      badgeName: 'Bé An Toàn Nhất Nhà',
      badgeIcon: 'ShieldAlert'
    }
  },

  'sim-mn-23': {
    domain: 'tinh-cam-xa-hoi',
    domainLabel: 'Phát triển Kỹ năng Sống: Giữ ấm Cơ thể & Thích ứng Thời tiết',
    ageGroup: '5 - 6 tuổi',
    materials: ['2 bình nước ấm 40°C', 'Chiếc áo bông xốp dày', 'Nhiệt kế đo độ'],
    teacherPrompt: 'Mùa đông rét buốt, chiếc áo khoác bông xốp giữ ấm cho cơ thể bé bằng cách nào?',
    variableTuning: {
      name: 'Lớp áo bọc ngoài bình nước ấm',
      description: 'Để bình trần không bọc vs Bọc áo bông dày',
      options: [
        { label: 'Bình không mặc áo (để trần)', outcome: 'Sau 1 giờ nước nguội ngắt còn 20°C lạnh tanh!' },
        { label: 'Bình mặc áo phao bông dày', outcome: 'Sau 1 giờ nước vẫn ấm áp 36°C như cơ thể bé khỏe mạnh!' },
        { label: 'Bọc thêm lớp khăn len ấm', outcome: 'Nước giữ nhiệt bền lâu vượt trội không sợ gió rét.' }
      ]
    },
    spatialLayout: {
      action: 'Bật thêm quạt gió thổi vào cả 2 bình nước',
      outcome: 'Gió làm bình không mặc áo hạ nhiệt nhanh gấp 3 lần bình có áo bông'
    },
    gestureDynamics: {
      action: 'Dùng tay bóp lớp áo bông xốp để cảm nhận',
      outcome: 'Bé cảm nhận vô số khoang khí nhỏ li ti êm ái giữ nhiệt bên trong'
    },
    whatIfChallenge: {
      question: 'Bản thân chiếc áo bông có tự phát ra nhiệt như bếp lò không?',
      discoveryOutcome: 'Không! Chiếc áo chỉ làm nhiệm vụ giữ lại hơi ấm quý giá của cơ thể bé.',
      badgeName: 'Bé Ấm Áp Mùa Đông',
      badgeIcon: 'Heart'
    }
  },

  'sim-mn-24': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Nhận thức: Thế giới Tự nhiên (Điều kiện sống của cây)',
    ageGroup: '4 - 5 tuổi',
    materials: ['Khay lót bông gòn tẩm nước ẩm', 'Khay rải sỏi đá khô cong', 'Hạt đỗ xanh mập mạp', 'Bình xịt'],
    teacherPrompt: 'Gieo hạt đỗ vào bông ẩm và sỏi khô, những hạt mầm xinh sẽ lớn lên ở khay nào?',
    variableTuning: {
      name: 'Độ ẩm của giá thể gieo hạt',
      description: 'Môi trường ẩm ướt có nước vs Môi trường sỏi khô cằn',
      options: [
        { label: 'Khay bông gòn ẩm', outcome: 'Ngày thứ 2 hạt nứt vỏ nhú rễ trắng; ngày thứ 3 chồi xanh vươn cao!' },
        { label: 'Khay sỏi đá khô cong', outcome: 'Hạt đỗ nằm yên bất động, teo tóp khô cứng không nảy mầm.' },
        { label: 'Tưới nước bổ sung cho khay sỏi', outcome: 'Hạt hút no nước bắt đầu hồi sinh và nứt nanh nảy mầm sau 1 ngày!' }
      ]
    },
    spatialLayout: {
      action: 'Xếp khay gieo hạt ra cửa sổ đón nắng sớm',
      outcome: 'Lá mầm quang hợp chuyển sang màu xanh lục mơn mởn tràn đầy sức sống'
    },
    gestureDynamics: {
      action: 'Dùng bình xịt phun sương hạt nước mát lành',
      outcome: 'Hạt đỗ như được tắm mát nở to gấp đôi chuẩn bị bung vỏ'
    },
    whatIfChallenge: {
      question: 'Hạt giống cần những gì nhất để tỉnh giấc nảy mầm?',
      discoveryOutcome: 'Nước ẩm, không khí mát lành và tình yêu chăm sóc của bé!',
      badgeName: 'Bảo Vệ Mầm Xanh',
      badgeIcon: 'Feather'
    }
  },

  'sim-mn-25': {
    domain: 'the-chat',
    domainLabel: 'Phát triển Thể chất: Khám phá Chuyển động & Ma sát',
    ageGroup: '4 - 5 tuổi',
    materials: ['Máng trượt đồ chơi dốc đứng', 'Chiếc ô tô đồ chơi bánh xe trơn', 'Làn gạch men', 'Làn bãi cát'],
    teacherPrompt: 'Chiếc ô tô phóng xuống dốc trên đường gạch trơn hay đường cát sẽ chạy xa hơn?',
    variableTuning: {
      name: 'Bề mặt của làn đường trượt',
      description: 'Mặt gạch men bóng loáng vs Bãi cát lún nhấp nhô',
      options: [
        { label: 'Thả xe trên sàn gạch men', outcome: 'Chiếc xe phóng vèo băng băng vượt qua vạch đích xa tít 2 mét!' },
        { label: 'Thả xe trên bãi cát lún', outcome: 'Cát lún giữ chặt bánh xe, xe dừng khựng lại sau 10cm!' },
        { label: 'Trải thêm tấm thảm len nhung', outcome: 'Xe chạy êm ru nhưng đi chậm hơn trên gạch men do lực cản ma sát.' }
      ]
    },
    spatialLayout: {
      action: 'Nâng độ dốc máng trượt cao lên gấp đôi',
      outcome: 'Xe lao xuống dốc với tốc độ nhanh chóng mặt tạo cảm giác thích thú'
    },
    gestureDynamics: {
      action: 'Đẩy nhẹ một lực vs lấy đà đẩy thật mạnh',
      outcome: 'Lực đẩy mạnh truyền động năng giúp xe lăn xa hơn hẳn'
    },
    whatIfChallenge: {
      question: 'Nếu bánh xe bị kẹt không quay được thì xe có chạy xa được không?',
      discoveryOutcome: 'Xe chỉ trượt lết rồi dừng ngay! Bánh xe tròn quay lăn giúp giảm ma sát tối đa.',
      badgeName: 'Tay Lái Cừ Khôi',
      badgeIcon: 'Truck'
    }
  },

  'sim-mn-26': {
    domain: 'nhan-thuc',
    domainLabel: 'Phát triển Sáng tạo STEAM: Chế tạo Thuyền & Sức chở',
    ageGroup: '5 - 6 tuổi',
    materials: ['Cục đất sét dẻo', 'Chậu nước lớn', 'Các chú gấu bông tí hon làm hành khách'],
    teacherPrompt: 'Cùng một cục đất sét, vo tròn thì chìm nghỉm, làm sao biến nó thành chiếc thuyền nổi được?',
    variableTuning: {
      name: 'Hình dạng tạo hình của đất sét',
      description: 'Vo tròn khối đặc vs Nặn thành chiếc thuyền lòng trũng có mép cao',
      options: [
        { label: 'Vo tròn như hòn bi', outcome: 'Đất sét chìm thẳng cánh xuống đáy chậu nước!' },
        { label: 'Nặn thành chiếc đĩa thuyền lòng sâu', outcome: 'Ồ diệu kỳ! Chiếc thuyền đất sét nổi bồng bềnh trên mặt nước!' },
        { label: 'Thêm 3 bạn gấu bông tí hon lên thuyền', outcome: 'Thuyền chìm sâu xuống một chút nhưng vẫn nổi chở khách an toàn!' }
      ]
    },
    spatialLayout: {
      action: 'Nặn mép thuyền cao lên vs nặn mép thuyền quá thấp',
      outcome: 'Mép thấp dễ bị sóng nước tràn vào chìm; mép cao ngăn nước tuyệt hảo'
    },
    gestureDynamics: {
      action: 'Đặt các hành khách cân đối hai bên lòng thuyền',
      outcome: 'Thuyền giữ thăng bằng chuẩn mực không bị lật nghiêng sang một bên'
    },
    whatIfChallenge: {
      question: 'Đặt bao nhiêu bạn gấu bông thì chiếc thuyền đất sét bắt đầu chìm?',
      discoveryOutcome: 'Đặt đến bạn gấu thứ 6 thì thuyền quá tải chìm! Bé học giới hạn trọng tải.',
      badgeName: 'Kỹ Sư Đóng Tàu Nhí',
      badgeIcon: 'Anchor'
    }
  },

  'sim-mn-27': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ: Kỳ quan Thiên nhiên (Cầu vồng ánh sáng)',
    ageGroup: '5 - 6 tuổi',
    materials: ['Bình xịt nước có núm phun sương mịn', 'Bầu trời đầy nắng vàng rực rỡ'],
    teacherPrompt: 'Bé đứng quay lưng lại với mặt trời rồi xịt làn sương nước xem dải 7 sắc xuất hiện ở đâu?',
    variableTuning: {
      name: 'Góc đứng so với hướng ánh nắng',
      description: 'Quay lưng về phía mặt trời vs Nhìn thẳng vào mặt trời',
      options: [
        { label: 'Đứng quay lưng về phía ánh nắng', outcome: 'Dải cầu vồng uốn cong 7 sắc lung linh hiện ra ngay trong làn sương mù!' },
        { label: 'Đứng nhìn thẳng về phía mặt trời', outcome: 'Chói mắt và không thấy cầu vồng vì không đúng góc khúc xạ 42 độ.' },
        { label: 'Chỉnh vòi xịt phun sương thật mịn', outcome: 'Dải màu cầu vồng hiện lên sáng rực và sắc nét hơn hạt nước to.' }
      ]
    },
    spatialLayout: {
      action: 'Di chuyển bình xịt nước theo hình cánh cung',
      outcome: 'Dải cầu vồng uốn lượn nối từ mặt đất lên bầu trời như dải lụa'
    },
    gestureDynamics: {
      action: 'Chạy lại gần chạm tay vào dải cầu vồng',
      outcome: 'Bé nhận ra cầu vồng là ánh sáng tán sắc qua giọt nước, không thể cầm nắm được'
    },
    whatIfChallenge: {
      question: 'Bé hãy đọc tên 7 sắc màu rực rỡ của dải cầu vồng xem nào?',
      discoveryOutcome: 'Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím! Cầu vồng đẹp nhất sau cơn mưa rào.',
      badgeName: 'Bé Vẽ Cầu Vồng',
      badgeIcon: 'Sun'
    }
  },

  'sim-mn-28': {
    domain: 'the-chat',
    domainLabel: 'Phát triển Giác quan & Bản thân: 5 Giác quan Thần kỳ',
    ageGroup: '4 - 5 tuổi',
    materials: ['Hộp quà bí mật', 'Bông hoa hồng thơm', 'Lát chanh chua', 'Kẹo ngọt', 'Chuông reo', 'Gấu bông lông mịn'],
    teacherPrompt: 'Mắt nhìn, tai nghe, mũi ngửi, lưỡi nếm, tay sờ - Giác quan nào giúp bé nhận biết mùi hương?',
    variableTuning: {
      name: 'Chọn cơ quan giác quan để khám phá',
      description: 'Thử nghiệm từng giác quan tương ứng với đồ vật',
      options: [
        { label: 'Đưa bông hoa lại gần mũi (Khứu giác)', outcome: 'Mũi bé hít vào và cảm nhận mùi hương hoa ngào ngạt thơm lừng!' },
        { label: 'Chấm giọt chanh lên đầu lưỡi (Vị giác)', outcome: 'Lưỡi cảm nhận vị chua lè làm mắt bé nháy tít mỉm cười!' },
        { label: 'Lắc chiếc chuông nhỏ bên tai (Thính giác)', outcome: 'Tai bé lắng nghe tiếng chuông reo leng keng rộn rã.' }
      ]
    },
    spatialLayout: {
      action: 'Dùng tay sờ vào bộ lông mềm mại của bạn gấu bông',
      outcome: 'Xúc giác ở đầu ngón tay cảm nhận độ êm ái, mịn màng và ấm áp'
    },
    gestureDynamics: {
      action: 'Bịt mắt bé lại và cho bé ngửi mùi cam để đoán quả',
      outcome: 'Bé đoán trúng phóc quả cam nhờ khứu giác nhạy bén mà không cần nhìn mắt'
    },
    whatIfChallenge: {
      question: 'Khi bé bị ngạt mũi thì ăn kẹo có thấy thơm ngon như bình thường không?',
      discoveryOutcome: 'Khứu giác và vị giác cùng phối hợp giúp bé cảm nhận trọn vẹn vị ngon của món ăn!',
      badgeName: 'Bác Sĩ Giác Quan',
      badgeIcon: 'Activity'
    }
  },

  'sim-mn-29': {
    domain: 'tham-my',
    domainLabel: 'Phát triển Thẩm mỹ & Tạo hình: Cát ướt & Lâu đài cổ tích',
    ageGroup: '4 - 5 tuổi',
    materials: ['Bãi cát hạt mịn', 'Xô nước mát', 'Khuôn xây lâu đài', 'Xẻng xúc'],
    teacherPrompt: 'Tại sao cát khô chảy tuột qua kẽ tay, còn cát ẩm lại đúc thành lâu đài nguy nga?',
    variableTuning: {
      name: 'Lượng nước pha trộn vào cát',
      description: 'Cát khô cong vs Cát ẩm vừa đủ vs Cát sũng nước thành bùn',
      options: [
        { label: 'Dùng cát khô cong đổ vào khuôn', outcome: 'Nhấc khuôn lên cát sụp đổ tan tành không giữ được hình khối!' },
        { label: 'Trộn nước vừa ẩm nén chặt khuôn', outcome: 'Nhấc khuôn lên lâu đài nguy nga sừng sững với các tháp nhọn kiên cố!' },
        { label: 'Đổ quá nhiều nước thành vũng bùn lầy', outcome: 'Lâu đài bị nhão nhoẹt chảy xệ xuống đất không đứng được.' }
      ]
    },
    spatialLayout: {
      action: 'Đắp thêm tường thành bao quanh và cắm lá cờ nhỏ trên đỉnh tháp',
      outcome: 'Bé phát triển khả năng phối hợp không gian 3 chiều và óc kiến trúc sáng tạo'
    },
    gestureDynamics: {
      action: 'Dùng lòng bàn tay vỗ nhẹ xung quanh khuôn trước khi nhấc',
      outcome: 'Kỹ thuật nén giúp các hạt cát liên kết khít chặt bền vững hơn'
    },
    whatIfChallenge: {
      question: 'Dưới nắng hè gắt, lâu đài cát ẩm để lâu sẽ ra sao?',
      discoveryOutcome: 'Nước bốc hơi hết, cát khô lại và lâu đài dần dần rã thành cát khô rời rạc!',
      badgeName: 'Kiến Trúc Sư Cát',
      badgeIcon: 'Castle'
    }
  },

  'sim-mn-30': {
    domain: 'the-chat',
    domainLabel: 'Phát triển Thể chất & Hô hấp: Hơi thở & Tiếng còi vang',
    ageGroup: '4 - 5 tuổi',
    materials: ['Chiếc còi nhựa đồ chơi', 'Đồng hồ đo mức âm thanh Decibel', 'Quả bóng bay'],
    teacherPrompt: 'Bé hít một hơi thật sâu rồi thổi mạnh vào còi thì tiếng còi sẽ kêu to thế nào?',
    variableTuning: {
      name: 'Cường độ luồng hơi thở của bé',
      description: 'Thổi khẽ nhẹ hiu vs Lấy hơi sâu thổi hết sức',
      options: [
        { label: 'Thổi một luồng hơi nhẹ', outcome: 'Chiếc còi kêu "tít" lí nhí êm dịu, kim đo chỉ 35 Decibel.' },
        { label: 'Thổi hơi dài đều đặn', outcome: 'Tiếng còi vang ngân dài réo rắt vui tai, kim đo chỉ 60 Decibel.' },
        { label: 'Hít sâu thổi mạnh dứt khoát', outcome: 'Tiếng còi rít to vang dội khắp phòng, kim đo vọt lên 85 Decibel!' }
      ]
    },
    spatialLayout: {
      action: 'Đưa còi lại gần góc tường phòng kín',
      outcome: 'Âm thanh dội lại vang vọng rõ ràng hơn ngoài sân thoáng'
    },
    gestureDynamics: {
      action: 'Thổi ngắt quãng từng nhịp ngắn: Tít - Tít - Tít',
      outcome: 'Bé tập làm trọng tài bóng đá và rèn luyện kỹ năng điều tiết hơi thở khỏe mạnh'
    },
    whatIfChallenge: {
      question: 'Điều gì xảy ra nếu bé dùng ngón tay bịt một lỗ nhỏ trên chiếc còi?',
      discoveryOutcome: 'Âm thanh đổi giọng ngay sang một nốt nhạc trầm hơn hoặc lạ tai!',
      badgeName: 'Trọng Tài Tí Hon',
      badgeIcon: 'Volume2'
    }
  }
};

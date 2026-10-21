# Đề xuất thiết kế Núi lửa của con — 21/10/2026

GPT-6 Astra được người dùng yêu cầu trực tiếp thiết kế hướng giao diện và hiệu ứng. Codex tổng hợp và dùng ImageGen tích hợp để dựng ảnh minh họa. Tài liệu này là đề xuất, chưa triển khai và chưa thử với trẻ. Đợt sửa đang xuất bản chỉ bỏ mặt bàn tròn và kéo dài bàn chữ nhật hiện có.

**Cập nhật sau khi người dùng duyệt hướng:** đã triển khai bản thử giao diện kem–đỏ–vàng, logo dung nham đỏ, hai khay Nặn núi/Thử, giọng Việt cục bộ, nhỏ từng giọt màu, nặn trực tiếp trên vỏ núi với hoàn tác và đường chảy tính theo bề mặt. Cốc mới giữ dáng núi; lưu tối đa ba hình cùng lượng bột/giấm/màu để so sánh trong phiên chơi. Bản thử bắt đầu từ vỏ núi có sẵn, chưa có dựng từ cốc trống, khay nhiều loại miếng đất hoặc tự cấp lại công thức đã lưu. Bọt và đường nước là minh họa định tính, không phải mô hình thủy động lực hay hiệu chuẩn hóa học. Đã bổ sung kiểm tra màu không tăng CO₂, hữu hạn giọt/nước tràn và rãnh làm đổi đường chảy. Chưa thử với trẻ. Antigravity CLI đã nhận yêu cầu rà soát ngắn nhưng chưa trả tệp nhận xét; không coi là một lượt review hoàn tất.

## Hướng chọn: Xưởng núi lửa đất nặn

Ba hướng đã cân nhắc: xưởng đất nặn (vật liệu thật, tự làm), bảo tàng địa chất (đá than, nhận diện núi thật), sân chơi địa hình (hình khối đơn giản). Chọn xưởng đất nặn, mượn độ rõ nét của icon địa chất. Mục tiêu: trẻ tự tạo mô hình, thêm vật liệu, quan sát bọt và thử sửa địa hình dựa trên đường nước màu vừa nhìn thấy.

| Thành phần | Đề xuất |
|---|---|
| Tên và lối vào | “Núi lửa của con”; “Nặn núi” và “Dùng núi có sẵn”. Trẻ được vào thử ngay nếu chưa muốn nặn. |
| Màu | Kem #FFF7E8, chữ than #302A26, đỏ son #D8422F, vàng #F6C64B, đất #A56645. Đỏ cho nhận diện và màu chất lỏng; vàng cho hành động. Vùng quan sát vẫn đủ sáng và trung tính để thấy dòng đỏ. |
| Icon | Núi đá than có miệng rõ, dải dung nham đỏ–cam trên huy hiệu vàng. Logo đại diện chủ đề núi lửa; các nút dụng cụ dùng hình cốc, thìa, ống nhỏ màu thật. |
| Bố cục | Núi và miệng cốc lớn ở trung tâm; một khay vật liệu theo ngữ cảnh. Nặn: đất và công cụ nặn. Thử: bột, giấm, màu. Điện thoại ưu tiên ba dụng cụ và một hành động lớn, không thu nhỏ nguyên thanh desktop. |
| Chữ | Động từ theo thao tác: “Đắp”, “Miết”, “Tạo rãnh”, “Bớt đất”, “Nhỏ màu”, “Rót”, “Dừng”, “Đặt xuống”. Lời gợi mở: “Đắp quanh cốc”, “Rót từng chút”, “Nước đi phía nào?”. Không đặt lời giải trước khi quan sát. |
| Trạng thái | Dụng cụ nhấc lên, viền rõ, lượng thay đổi trên vật; không dựa riêng vào màu. Vùng chạm chính thử ở 56–64 px, nhãn thao tác 18–20 px trên desktop; hiệu chỉnh theo thử nghiệm thực. |

## Phẩm màu và hiệu ứng đỏ

Phẩm màu thực phẩm là một vật liệu tùy chọn do trẻ tự lấy. Một giọt tạo vệt đỏ rồi phân tán; số giọt làm màu đậm hơn, không tự tăng lượng CO2. Mô phỏng giữ được lượt không màu để trẻ so sánh. Không thêm ngầm xà phòng hoặc chất tạo bọt.

| Pha | Hình ảnh và hành vi |
|---|---|
| Nhỏ màu | Thấy giọt tách khỏi đầu ống, vào chất lỏng rồi loang; không đổi toàn bộ cảnh thành đỏ ngay lập tức. |
| Sủi | Bong bóng nhỏ trong hỗn hợp, thành trong/nhạt hồng và điểm sáng trắng. Sinh, nổi, nhập/vỡ khác thời điểm. |
| Tụ và tràn | Chỉ tràn khi mức chất lỏng cộng phần bọt đạt mép. Bọt ướt ngắn hạn, không thành cột kem. Có lượt chỉ sủi mà không tràn. |
| Chảy | Dòng nước đỏ mỏng, bóng, thay đổi độ rộng; đầu dòng tiến theo sườn và rãnh thực sự có trong mẫu. Không xếp bong bóng thành chuỗi hạt đều nhau. |
| Lắng | Bọt thưa rồi vỡ; nước và dấu ướt còn lại. Mô hình phải theo dõi lượng tràn ra khay, không làm xuất hiện nước vô hạn. |
| So sánh | Dùng cùng lượng bột/giấm để so không màu/có màu; nếu thử xà phòng sau này, thêm công khai và so riêng độ bền bọt. |

Icon có thể tả dung nham nóng thật. Trong cảnh thí nghiệm, đỏ là nước có phẩm màu: ánh sáng phản chiếu, không tự phát sáng, không có lửa, tro hay hơi nóng. Ảnh storyboard là chỉ dẫn mỹ thuật, không phải hiệu chuẩn độ cao bọt, số giây hoặc kết quả hóa học.

## Vòng chơi: tạo → dự đoán nếu muốn → thử → giữ ảnh → sửa → thử lại

| Việc trẻ làm | Kết quả có ý nghĩa |
|---|---|
| Chọn đất từ khay, đắp quanh cốc mở | Tạo từng mảng theo vị trí tay chọn; không chỉ đổi sang một mô hình hoàn thiện. Phần cốc giữ nguyên và miệng không bị bịt. |
| Miết một sườn, thêm/bớt đất | Có núi vai rộng hoặc núi lệch; mỗi thay đổi nhìn thấy ngay trên chính mẫu của trẻ. Có hoàn tác. |
| Vạch một rãnh, tạo gờ hoặc hõm ngoài sườn | Rãnh dẫn nước nếu nằm trên đường chảy; gờ có thể chia dòng; hõm có thể giữ một ít nước. Mặt sau có thể không nhận nước. |
| Đoán đường chảy bằng chạm, hoặc bỏ qua | Tạo câu hỏi quan sát mà không bắt trả lời trước khi được chơi. |
| Tự xúc, nhỏ màu, rót và dừng | Giữ quyền quyết định lượng và thời điểm; không tự pha sẵn chỉ để phát một hoạt ảnh đẹp. |
| Giữ ảnh mẫu A và sửa thành B | Lưu cả hình đất và biểu tượng lượng vật liệu để có căn cứ so sánh. |
| Chọn “Giữ cách pha lần trước”, tự cấp lại vật liệu | So hình/rãnh với lượng pha tương đương; đổi một điều giúp nhận ra tác động. Không tự đổ nguyên liệu khi chọn mẫu. |

Khay có thể chứa đất nâu, đất đỏ, đất xám hoặc các miếng lớn/cuộn dải để tạo bề mặt khác nhau. Kiểu núi phụ thuộc cách đắp và miết. Màu đất không làm đổi loại magma hoặc tự tạo kiểu phun mạnh/yếu. Trong bản đầu nên giữ một loại đất vật lý và cùng cốc chứa, thay đổi hình bên ngoài; so nhiều vật liệu thấm/không thấm là bài mở rộng riêng.

Mẫu gợi ý không bắt buộc: núi vai rộng với rãnh dài; núi lệch có gờ chia đôi; núi có hõm ngoài sườn và đường thoát thấp. Không gắn mỗi mẫu với một hoạt ảnh bất biến.

## Mức hỗ trợ và cầu nối thực hành

- 3–4 tuổi: miếng đất lớn, Đắp/Bớt, chạm–chọn thay kéo chính xác; một lời Việt ngắn; so sánh là tùy chọn.
- 5–6 tuổi: thêm Miết/Tạo rãnh, dự đoán bằng chỉ tay, ảnh trước–sau, sửa rồi thử.
- Trẻ lớn và người lớn: so hai địa hình với cùng cách pha, thay một yếu tố, xem lượng và dấu đường chảy. Không tuyên bố phù hợp SGK khi chưa đối chiếu bài.
- Mô phỏng hỗ trợ lên ý tưởng và quan sát. Cảm giác ấn, miết và lợi ích vận động tinh của đất nặn thật cần hoạt động tay thật ở lớp/nhà, không suy ra từ việc chạm màn hình.
- Có thể làm hóa học chỉ bằng cốc nhựa mở, khay, thìa, baking soda và giấm ăn; đất nặn/phẩm màu tùy chọn. Người lớn hỗ trợ, bảo vệ mắt; không nếm, không đậy kín hoặc đun nóng.

## Căn cứ

- [ACS — Volcano](https://www.acs.org/content/dam/acsorg/education/resources/k-8/science-activities/planetearth/land/volcano.pdf): nặn đất quanh cốc, để miệng mở, màu đỏ tùy chọn; giấm và baking soda tạo khí CO2.
- [ACS — Gas Sudsation](https://www.acs.org/education/whatischemistry/adventures-in-chemistry/experiments/gas-sudsation.html): chất rửa bát giúp bong bóng tồn tại lâu hơn.
- [NAEYC — Open-ended materials](https://www.naeyc.org/node/4650): làm mẫu kỹ thuật thay vì hoàn thiện mẫu sẵn, quan sát quá trình, hỗ trợ vừa đủ.
- [NAEYC — Playdough Power](https://www.naeyc.org/our-work/families/playdough-power/): thử, so, sửa với đất nặn thật và các cơ hội ngôn ngữ, khoa học, toán.
- [USGS — Lava building blocks](https://pubs.usgs.gov/gip/19/downloads/Chapter_2/Activities/Lava_building_blocks.pdf): hình núi thật liên quan lịch sử hình thành và tính chất dung nham, không do màu đất mô hình.

Các kích thước thao tác, mức hỗ trợ tuổi và dự đoán về hứng thú là đề xuất cần kiểm chứng. Bản thử tiếp theo chỉ nên chọn một vòng nặn đơn giản và một rãnh ảnh hưởng thật đến đường nước trước khi làm bộ công cụ địa hình lớn.

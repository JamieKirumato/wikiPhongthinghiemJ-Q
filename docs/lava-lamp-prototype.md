# Đèn dung nham tại nhà — bản thử A

Mục tiêu: dự đoán và quan sát dầu–nước phân lớp, bọt khí nâng giọt nước và giọt trở về khi mất khí; nối mô phỏng với thí nghiệm dùng đồ gia đình. Màu và đèn pin tùy chọn. Bình luôn mở, trẻ nhỏ làm cùng người lớn. Đèn sáp dùng nhiệt chỉ là đối chiếu.

Mô hình SI rút gọn dùng lực Archimedes, trọng lực, lực cản nhớt cộng thành phần quán tính và khối lượng gia tăng. Mỗi giọt mang lượng nước và khí; khí giãn theo áp suất thủy tĩnh rồi thoát ở mặt dầu. Nước nhập lại bể khi chìm. Viên sủi chỉ phản ứng sau khi gặp nước; lượng khí hữu hạn. Tích phân bước cố định 1/120 s, PRNG cố định để so sánh khung hình. Kiểm tra bằng npm run test:lava.

Giới hạn bản thử: suất sinh khí và tốc độ tan minh họa, chưa hiệu chuẩn theo nhãn viên sủi hoặc loại dầu; bỏ qua hòa tan khí, dòng chảy nền, tương tác giọt–giọt và sức căng bề mặt định lượng. Bọt tự do dùng tốc độ nổi xấp xỉ. Mặt phân lớp cố định vì lượng nước ở các giọt nhỏ so với bể. Hình giọt là ellipse bảo toàn diện tích khi biến dạng, không phải mô phỏng bề mặt 3D. Đây chưa phải CFD hay kiểm chứng tốc độ bằng thí nghiệm thật; không dùng mốc thời gian mô phỏng để dự báo tại nhà.

Antigravity CLI được giao phần physics và kiểm tra nhưng chưa có file kết quả trong lượt này; Codex dựng bản thử tiếp để tránh chờ. Không coi lệnh CLI thành công là bằng chứng đã có phản hồi hay review của Antigravity.

Nguồn: [Warwick](https://warwick.ac.uk/fac/sci/chemistry/outreach/primary/lavalamp/lava_lamp_experiment_instructions.pdf), [ACS](https://www.acs.org/content/dam/acsorg/education/resources/highschool/chemmatters/issues/2015-2016/february2016/chemmatters-feb2016-chemclub-activity.pdf). Review khả dụng với trẻ hiện là giả định thiết kế; cần trẻ thử thật để xác nhận.

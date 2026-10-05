# Vật chìm, vật nổi: trải nghiệm mầm non

Đối tượng: trẻ Việt Nam 3–6 tuổi. Mục tiêu bổ trợ: quan sát và phân biệt chìm/nổi; dự đoán rồi thử; so sánh khi thay đổi điều kiện. Trẻ được thử lại, không bị phạt khi dự đoán sai.

## Phạm vi 20 cải tiến

1. Hướng dẫn tiếng Việt; âm thanh cục bộ dự phòng khi thiết bị thiếu giọng Việt.
2. Bể rõ mặt nước; góc nhìn ngang và camera phù hợp màn hình nhỏ.
3. Vật thể khối 3D, giữ ảnh đồ vật ban đầu trong khay.
4. Ném theo vị trí và đường đi; ném trượt có thể lấy lại.
5. Sóng và giọt nước khi vật chạm nước.
6. Kéo vật trong bể, dìm xuống rồi thả để quan sát.
7. Xúc liên tiếp trong hũ, không phải chọn lại dụng cụ mỗi lần.
8. Nghiêng thìa để đổ; chọn nửa thìa hoặc đầy thìa.
9. Khuấy trong nước; hạt muối và dòng nước chuyển động, tan dần.
10. Nồng độ phụ thuộc lượng muối đã tan và thể tích bể.
11. Dụng cụ bên phải, thao tác xoay và ném tách biệt; minh họa bàn tay theo yêu cầu.
12. Ba mục tiêu học tập trong khu vực giáo viên.
13. Dự đoán bằng hình; cho phép chưa biết và không chấm phạt.
14. Chỉ ghi nhận chìm/nổi khi vật đã tới trạng thái quan sát được.
15. Giữ lịch sử từng lần quan sát với điều kiện nước lúc đó.
16. Trẻ chọn điều đã thấy trước khi nhận giải thích.
17. Nhóm 3–4 tuổi có ít vật và lời nhắc ngắn; nhóm 5–6 tuổi có thêm lựa chọn.
18. Thử thách trứng, gợi ý tăng dần và tự thử lại.
19. Thuyền nhôm: thay hình dạng, thêm hàng, so sánh sức chở, làm khô để thử lại.
20. Liên hệ tàu thuyền, phao và nước muối; hoạt động ngoài màn hình cho lớp học.

## Giới hạn mô hình

Đây là mô hình học tập gần đúng, không phải công cụ đo hoặc dự báo thí nghiệm phòng lab. Bể chữ nhật lớn quy ước 1 lít, một thìa đầy quy ước 50 g; bể nhỏ giảm một nửa mỗi chiều nên thể tích bằng 1/8. Khối lượng riêng nước muối tăng theo lượng muối đã tan và có giới hạn. Quá trình tan được đơn giản hóa, không mô phỏng đầy đủ nhiệt độ hay muối dư sau bão hòa.

Vật nổi dùng tỷ lệ thể tích ngập để xác định vị trí cân bằng. Thuyền dùng thể tích chứa và tải trọng, bỏ qua sức căng bề mặt; viên nhôm được giả định đã thấm/ngập. Không lấy số thìa hoặc số kiện hàng trong game làm hướng dẫn định lượng cho thí nghiệm thật.

Âm thanh dự phòng đọc câu ngắn theo tình huống; thiết bị có giọng Việt đọc đầy đủ lời hiện trên màn hình. Các MP3 được tạo bằng giọng tổng hợp, nội dung nằm trong `public/audio/vi/transcripts.json`.

## Kiểm tra

- `npm run test:sink-float`: thể tích các dạng bể, nồng độ và lượng muối, cân bằng thể tích ngập, mô hình khối 3D, ánh xạ âm thanh và tắt tiếng.
- `npm run build`: kiểm tra TypeScript và bản production.
- Chơi bằng trình duyệt: trứng chìm trong nước ngọt và nổi sau ba thìa đầy ở bể mặc định; xúc–nghiêng–khuấy nhiều lần; nửa thìa; lịch sử trước/sau; thuyền thấp và sâu cho sức chở khác nhau; giao diện 1280×720 và 768×1024.

Chưa thực hiện nghiên cứu sử dụng trực tiếp với trẻ. Mức hấp dẫn và độ dễ hiểu cần tiếp tục xác nhận qua quan sát trẻ trong lớp.

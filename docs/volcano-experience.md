# Núi lửa phun trào — bản thử mầm non 3–6 tuổi

Áp dụng `docs/Tiêu chí xây dựng thí nghiệm mô phỏng.txt`. Dùng lại phong cách lớp học, bảng màu kem–xanh, màn bắt đầu Học sinh/Giáo viên, khay nguyên liệu và thao tác chọn–thêm hoặc kéo–thả của Vật nổi, vật chìm. Đường dẫn độc lập: `/nui-lua`.

Mục tiêu: trẻ tự thử rồi nhận ra một số nguyên liệu gặp nhau tạo bọt, mô tả bọt xuất hiện và trào/lắng. Trẻ 5–6 tuổi có thể so sánh hai cốc sạch cùng một thìa bột, chỉ đổi nước thành giấm. Bằng chứng học tập là trẻ chỉ/nói điều đã thấy, chọn thay đổi và kể lại sự khác nhau; lịch sử thao tác không phải đánh giá năng lực.

Trẻ chọn nguyên liệu theo thứ tự bất kỳ; chạm nguyên liệu rồi chạm miệng núi hoặc kéo đến miệng núi. Không bắt buộc dự đoán, không chấm điểm. Nước rửa chén và màu là tùy chọn. Sổ khám phá lưu tối đa bốn lần thử trong phiên; nhận xét do trẻ chọn, không tự gán kết luận cho trẻ. Giải thích nằm trong góc người lớn, sau hoạt động quan sát. Hoạt động thật với cốc nhựa mở và khay là phần tiếp nối chính; đất nặn chỉ trang trí, không bắt buộc mua.

## Khoa học và giới hạn

Giấm + baking soda tạo CO₂ với tỉ lệ mol 1:1, có chất giới hạn; thêm theo thứ tự nào cũng phản ứng. Nước không tạo phản ứng này; màu không tạo khí. Nước rửa chén giữ bọt và làm bọt tồn tại lâu hơn, không tăng tổng khí. Mô hình Antigravity viết được Codex rà lại và sửa chặn thêm xà phòng khi cốc đầy. Kiểm tra tập trung xác nhận cả hai thứ tự, đối chứng nước, lượng khí hữu hạn, xà phòng, lắng và dung tích.

Một liều mô hình là 4 g baking soda, 20 mL giấm 5% hoặc 20 mL nước; cốc quy ước tối đa 120 mL. Động học và hình dạng bọt là minh họa gần đúng, chạy chậm để quan sát; không dự báo lượng bọt/thời gian thực tế. Không có lửa, nhiệt, tiếng nổ hoặc mô tả hỗn hợp là dung nham thật. Núi lửa thật liên quan đá nóng chảy và khí trong lòng đất.

Lời Việt là bảy MP3 tổng hợp bằng cùng phương thức TTS đang dùng trong `/api/narration`; văn bản ở `public/audio/vi/volcano/transcripts.json`. Không phụ thuộc thiết bị có cài giọng Việt. Có nút tắt/nghe lại và hướng dẫn chữ khi âm thanh bị chặn.

## Nguồn nghiên cứu

- [Bảo tàng Đại học Oregon — Homemade Volcano](https://mnch.uoregon.edu/sites/default/files/inline-files/May%202020%20LW%20Homemade%20Volcano%20Experiment_KS.pdf): nguyên liệu và hoạt động tại nhà. Lượng dùng trong phần người lớn được giảm để bắt đầu với cốc nhỏ và rót từ từ, không sao chép định lượng lớn của tài liệu.
- [ICIQ — Volcano eruption](https://iciq.org/experiment/volcano-eruption/): phản ứng giấm–baking soda tạo CO₂.
- [USGS — The Nature of Volcanoes](https://pubs.usgs.gov/gip/volc/nature.html): magma, lava và núi lửa thật, đối chiếu qua trích đoạn tìm kiếm; trang đầy đủ trả 403 tại thời điểm tra cứu.

Chưa thử trực tiếp với giáo viên/trẻ hoặc thiết bị cảm ứng thật. Các gợi ý theo tuổi cần xác nhận bằng quan sát trẻ sử dụng; kiểm tra trình duyệt không thay thế bước này.

Kiểm tra bản thử: TypeScript/Vite build production đạt; `scripts/verify-volcano.cjs` đạt. Đã thử chọn–thêm, kéo nguyên liệu tới miệng núi, đối chứng nước, đảo thứ tự giấm/bột, thêm xà phòng và màu, ghi nhận trong sổ, góc giáo viên và hoạt động thật. Đã xem bố cục desktop và kích thước điện thoại giả lập; không tràn ngang, không thấy lỗi runtime trong các luồng đã kiểm tra.

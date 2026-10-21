# Núi lửa — giai đoạn 1

Mục tiêu: trẻ tự chuyển vật liệu, chủ động xúc/rót/dừng và nhận ra bọt xuất hiện khi giấm gặp baking soda. Bắt đầu bằng cốc rỗng, không thêm ngầm màu hoặc xà phòng. Chưa mở rộng sang các cấp học khác.

- Cảnh núi 3D với chất liệu đá, miệng cốc mở; giữ nền phòng học.
- Thìa và cốc độc lập, giữ lượng còn lại khi đặt xuống. Có thể kéo trong cảnh hoặc chạm vị trí đích; chọn đích không tự xúc/rót.
- Chạm Xúc/Rót để bắt đầu, chạm Dừng để ngừng thêm vật liệu. Phản ứng của vật liệu đã trộn vẫn tiếp tục.
- Giảm chữ ở cảnh trẻ, lời nói tiếng Việt ngắn; hướng dẫn giáo viên và thử tại nhà nằm trong bảng riêng.
- Mô hình lượng: 24 g bột dự trữ, thìa tối đa 4 g; giấm ban đầu 60 mL. Tốc độ xúc 1,4 g/s, rót bột 1,8 g/s và giấm 12 mL/s khi nghiêng tối đa. Đây là ánh xạ thao tác để quan sát, không phải hiệu chuẩn kết quả thật.
- Bọt minh họa định tính dựa trên khí và sự tan bọt; hình dạng dòng chảy không phải mô phỏng thủy động lực học. Không dùng hình ảnh dung nham nóng cho phản ứng này.

Antigravity CLI tham gia phần mô hình xúc/rót (`stageOneModel.ts`); mã được rà soát và kiểm tra riêng về bảo toàn lượng, dừng rót, giữ lượng trên dụng cụ và giới hạn dung tích.

Chưa thử trực tiếp với trẻ; chưa thể kết luận biểu tượng hay thẩm mỹ phù hợp chỉ từ kiểm tra trình duyệt.

## Chất liệu hình ảnh

`public/assets/volcano/volcanic-rock-v1.webp` được tạo bằng công cụ imagegen tích hợp, chuyển WebP để phục vụ web. Prompt: “Seamless square diffuse/albedo texture of natural volcanic tuff and basalt, warm muted cinnamon and umber mineral patches with charcoal grey rock, irregular fractured facets, pores and angular cracks; orthographic surface, even diffuse illumination, tileable edges; no landscape, text, molten lava, glow, or smooth clay.”

## Đợt giao diện 21/10/2026 — vấn đề 1, 3, 4

- Mặt bàn 3D rộng cùng không gian với dụng cụ và bóng đổ; chất liệu lấy qua UV từ phần gỗ trống của ảnh lớp học đã có. Khay tròn lớn hơn để chứa chân núi ở mọi phương ngang, không thu nhỏ núi.
- Thay dải trắng bằng bong bóng có chu kỳ và các cụm bọt không đều trên vệt chất lỏng. Dòng chảy bắt đầu khi mức bọt minh họa vượt mép cốc; vệt ướt giữ lại sau phản ứng. Đây vẫn là biểu diễn định tính, không hiệu chuẩn chiều cao bọt hay tốc độ dòng chảy thực tế.
- Đồng hồ ×½ làm chậm đồng bộ chuyển vật liệu, phản ứng và hoạt ảnh. Không thêm ngầm xà phòng/màu, không đổi lượng khí hay công thức phản ứng. Ẩn mũi tên tại miệng khi đã đưa dụng cụ tới đó.
- Logo miệng núi và bọt, chữ xanh đậm, thẻ dụng cụ và trạng thái chọn rõ hơn; nút đặt xuống có nhãn.
- Đã chạy build và bộ kiểm tra volcano; thử xúc đầy, rót, dừng, giữ lượng còn lại, phản ứng tiếp diễn, xoay sang sườn khác và giới hạn góc cao/thấp bằng chuột trong trình duyệt. Kiểm tra nhanh bố cục 375 px, không phải thiết bị cảm ứng thật hay thử với trẻ.
- Đã gửi Antigravity CLI yêu cầu review giới hạn hai phút; chưa có file phản hồi ở thời điểm hoàn tất kiểm tra. Không coi lệnh CLI trả thành công là review đã hoàn thành.
- Đề xuất bối cảnh tự nhiên nằm trong `nui-lua-thuc-te-de-xuat.md`, chưa xây dựng. Dáng núi, miệng núi, vật liệu dụng cụ và tối ưu thiết bị sâu để đợt tiếp theo theo yêu cầu người dùng.

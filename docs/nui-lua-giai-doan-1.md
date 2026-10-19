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

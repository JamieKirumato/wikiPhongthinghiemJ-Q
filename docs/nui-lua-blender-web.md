# Mô hình Blender đã duyệt trên web

Người dùng duyệt bản render `01-nui-lua-theo-anh-mau.png` và cho phép cập nhật website ngày 21/10/2026. File Blender gốc được lưu tại `assets/volcano-source/approved-v3.blend`.

`public/assets/volcano/blender-v3/volcano-approved-v3.glb` chứa hình học núi, khay, cốc, lá đất nặn, bát xanh và bột, ca, thìa, chai màu, đất rời và que nặn từ chính bản đã duyệt. Màu và normal map đất được bake từ vật liệu Blender, đóng gói trong GLB. Các phần cùng vật liệu đã gộp còn 15 mesh; file khoảng 5,1 MB.

`blenderClayGrid.ts` được dò từ mesh núi để nối hình học mới với thao tác nặn và đường nước. Nặn làm biến dạng các đỉnh từ hình học gốc, không thay mô hình bằng lưới hình nón. Cốc được chuẩn hóa giữ miệng ở cao độ 2,575; mực nước và vị trí bột được chỉnh cho chiều sâu cốc mới. Phản ứng, lượng nguyên liệu, màu, nước chảy và bọt tiếp tục được mô phỏng; không nhập dòng nước tĩnh từ bản render.

Xuất lại bằng Blender 5.2 LTS (chạy từ thư mục dự án):

```powershell
blender --background assets/volcano-source/approved-v3.blend --python scripts/blender/export-volcano-web.py
blender --background --python scripts/blender/optimize-volcano-glb.py
```

Hai ảnh PNG trung gian trong thư mục xuất chỉ phục vụ bake; tài nguyên được tải khi chơi là GLB có sẵn ảnh bên trong. Khi đổi hình học nguồn, xuất lại cả GLB và lưới cao độ. Glass dùng alpha theo góc nhìn để hiển thị trên nền lớp học HTML; ảnh Cycles và WebGL có thể khác nhẹ về ánh sáng/phản xạ.

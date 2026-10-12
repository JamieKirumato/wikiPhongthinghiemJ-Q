# Tài nguyên cho bản thử giao diện 12/10/2026

Chỉ có bản cục bộ; chưa commit, push hoặc deploy. Đây là bản thử đầu, chưa phải toàn bộ giao diện hoàn thiện theo concept.

- Nền lớp học: `public/assets/sink-float/classroom-studio.png`, tạo bằng công cụ ImageGen tích hợp. Ảnh nền không chứa bể hoặc đồ vật; bể và chuyển động được render riêng.
- Táo: `public/assets/models/apple/food_apple_01_1k.gltf`, Oliver Harries / Poly Haven, CC0. Nguồn: https://polyhaven.com/a/food_apple_01. File giấy phép đặt cùng mô hình. Chỉ táo dùng mô hình nhập ngoài trong bản thử này; các vật khác dùng mesh hiện có, khay vẫn dùng ảnh cũ.
- Nguồn ứng viên chưa tích hợp: vịt https://sketchfab.com/3d-models/rubber-duck-f1de4fc390db4266a509b9739350512a; trứng https://sketchfab.com/3d-models/egg-c46d64155bae47d4a0888cdfcf8c27dc. Hai nguồn công bố CC Attribution; cần giữ ghi công khi tích hợp.
- Kiểm tra: build và test:sink-float qua; trình duyệt desktop đã thử thả táo/sỏi, xoay bể và xem lịch sử. Chưa kiểm tra thiết bị thật, trẻ thật, toàn bộ responsive hoặc toàn bộ công cụ nâng cao. Antigravity CLI nhận yêu cầu review nhưng chưa tạo file kết quả.

## Prompt ảnh nền (ImageGen tích hợp)

Use case: product-mockup. Image 1 is a style reference. Create a production background plate for this interactive 3D educational simulation, matching exactly the warm beautiful classroom in the reference. Output ONLY the room environment, no UI and NO TANK, NO WATER, NO APPLE, NO STONE, NO TOOL OR OBJECT ON TABLE, NO TEXT. Landscape 16:10. Camera near tabletop at a slight downward angle, straight horizontal horizon, broad empty pale honey oak desk foreground occupying bottom 36% of image with very subtle natural wood grain, back edge straight horizontal. Upper 64% softly defocused premium airy Montessori classroom, sunlight through tall pale wood window on far left with green leaves outside, cream wall in center, shelves with books and small plant on far right. Middle 70% of frame quiet uncluttered pale cream. Gentle warm natural light from top left, restrained soft shadows, high end realistic interior photography. This will sit behind actual rendered transparent tank and physically animated objects. No glass tank, no aquarium, no water, no floating particles, no screen frame. Entire desktop empty.

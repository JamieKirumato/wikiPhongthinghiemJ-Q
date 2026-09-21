# Thiết Kế Giao Diện & Logic K-12 Wiki & Simulator (Phong cách Andrej Karpathy)

Thư mục này lưu trữ các hình ảnh mô phỏng giao diện chuẩn của dự án:

### 1. `k12_wiki_overview_mockup.jpg` - Chế độ "Tổng quan chương trình"
- **Bố cục 2 cột**:
  - Cột trái: Cây mục lục các chương và bài học bám sát 100% sách **Kết nối tri thức với cuộc sống** (hanhtrangso.nxbgd.vn).
  - Cột phải: 
    - Tiêu đề bài học.
    - Hộp **First-Principles**: Giải thích bản chất hiện tượng từ những khối dựng cơ bản nhất.
    - Công thức và tóm tắt lý thuyết hiển thị chuẩn xác (KaTeX).
    - **Widget mô phỏng tương tác nhúng ngay trong bài**: Cho phép học sinh kéo thanh trượt (slider), quan sát vector lực/vận tốc và đồ thị thời gian thực.
    - Nút **[Inspect Code]**: Mở xem logic mã nguồn mô phỏng.
- **Thanh phân cấp phía trên**: Chuyển đổi linh hoạt giữa 4 Cấp học (`[Mầm non]`, `[Tiểu học]`, `[THCS]`, `[THPT]`), chọn khối lớp (`Lớp 6` -> `Lớp 9`) và môn học (`Khoa học tự nhiên`, `Toán`, `Tin học`...).

---

### 2. `k12_simulation_lab_mockup.jpg` - Chế độ "Thư viện mô phỏng" (Simulation Lab)
- Không gian phòng thí nghiệm trực quan tập trung:
  - Bộ lọc cấp học: `[Tất cả]`, `[Mầm non]`, `[Tiểu học]`, `[THCS]`, `[THPT]`.
  - Lưới thẻ thí nghiệm (Interactive Cards):
    - **Mầm non**: Trộn màu sắc tương tác 3 màu gốc (RGB/CMYK visualizer).
    - **Tiểu học**: Cân đĩa thăng bằng (Algebra & Weight Balance Scale).
    - **THCS**: Mạch điện DC với bóng đèn, ampe kế & dòng electron chuyển động theo định luật Ohm.
    - **THPT**: Con lắc điều hòa vi tích phân & đồ thị sóng dao động.

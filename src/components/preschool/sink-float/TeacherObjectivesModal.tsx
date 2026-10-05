import React from 'react';
interface Props {onClose:()=>void;}
export const TeacherObjectivesModal: React.FC<Props> = ({onClose}) => <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
  <div role="dialog" aria-modal="true" aria-label="Mục tiêu thí nghiệm" className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 space-y-4">
    <div className="flex justify-between"><h2 className="font-black text-xl">🎓 Mục tiêu thí nghiệm</h2><button onClick={onClose} aria-label="Đóng mục tiêu" className="min-h-[44px] min-w-[44px] bg-slate-100 rounded-xl">✕</button></div>
    <p>Hoạt động bổ trợ khám phá khoa học cho trẻ 3–6 tuổi. Giáo viên chọn phần phù hợp với mục tiêu buổi học; không cần dùng tất cả các chế độ.</p>
    <ol className="list-decimal pl-5 space-y-2"><li>Nhận biết chìm và nổi bằng quan sát vị trí vật so với mặt nước.</li><li>Đưa ra dự đoán, thử để kiểm tra và so sánh kết quả; dự đoán khác kết quả là cơ hội học.</li><li>Nhận ra cùng một vật có thể thay đổi trạng thái khi thay đổi nước.</li></ol>
    <div className="bg-sky-50 rounded-2xl p-4 space-y-2"><h3 className="font-bold">Quan sát việc học</h3><p>Trẻ tự chọn vật; làm lại khi chưa rõ; chỉ được vật chìm/nổi; nhận ra điều mình đã thay đổi. Không đánh giá bằng số lần đoán đúng.</p></div>
    <p><strong>3–4 tuổi:</strong> một thao tác mỗi lần, bốn vật quen thuộc, chỉ cần chỉ hoặc gọi tên kết quả. <strong>5–6 tuổi:</strong> dự đoán, so sánh hai lần thử, kể lại bằng tranh hoặc lời nói và chỉ thay đổi một yếu tố mỗi lần.</p>
    <p><strong>Thử thách tùy chọn:</strong> làm trứng nổi; thay đổi hình dạng thuyền và tải hàng. Khuyến khích thử lại, gợi ý dần khi trẻ cần.</p>
    <p><strong>Ứng dụng:</strong> thuyền chở hàng, vật chứa khí, nước muối. Tiếp nối bằng thí nghiệm chậu nước cùng người lớn.</p>
    <details className="bg-amber-50 p-3 rounded-xl text-sm"><summary className="font-bold">Giới hạn mô hình</summary><p>Bể chữ nhật lớn quy ước chứa 1 lít; bể nhỏ có 1/8 lượng nước. Một thìa đầy quy ước 50 g muối, nửa thìa 25 g. Đây là mô hình nồng độ gần đúng, không phải công thức thực hành. Không dùng quy tắc “nặng thì chìm, nhẹ thì nổi”; sức nâng liên quan lượng nước vật chiếm chỗ. Mô hình bỏ qua sức căng mặt ngoài và sai khác giữa vật thật.</p></details>
    <button onClick={onClose} className="min-h-[48px] w-full rounded-2xl bg-amber-300 font-bold">Tiếp tục quan sát</button>
  </div>
</div>;

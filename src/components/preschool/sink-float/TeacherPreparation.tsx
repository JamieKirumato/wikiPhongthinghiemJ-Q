import {useEffect, useRef, useState} from 'react';
import type {TankShape} from './types';
import {SCENE_OPTIONS, SceneSetting} from './SceneBackdrop';

export type PreparationTab = 'lesson' | 'advanced' | 'hands-on';
export type TeacherLesson = {mode: 'discovery' | 'egg-challenge'; age: '3-4' | '5-6'; itemIds: string[]};
export const LESSONS = [
  {mode:'discovery' as const, title:'Chìm hay nổi', icon:'🌊', objective:'Trẻ chỉ hoặc gọi tên vật chìm và vật nổi qua quan sát.', evidence:'Trẻ chỉ vị trí vật so với mặt nước và thử lại khi chưa rõ.', tools:'Bể nước thường và khay đồ vật.', essential:'Chậu hoặc hộp nhựa trong, nước, khăn lau; vài vật lớn quen thuộc như táo, đồ chơi nhựa và thìa inox.', optional:'Có thể thay táo bằng miếng gỗ sạch; chọn vật không sắc và không vừa miệng trẻ.', steps:'Cho trẻ chọn vật, dự đoán rồi tự thả. Mời trẻ chỉ vật ở đâu; thử lại và so sánh với mô phỏng.', ids:['item-pebble','item-egg','item-apple','item-duck']},
  {mode:'egg-challenge' as const, title:'Nước thường và nước muối', icon:'💧🧂', objective:'Trẻ so sánh vị trí cùng một đồ vật trong nước thường và nước muối.', evidence:'Trẻ nhận ra điều đã thay đổi và kể hoặc chỉ sự khác nhau giữa hai lần thử.', tools:'Đồ vật cô chọn, muối, thìa và dụng cụ khuấy. Quả trứng là vật gợi ý để quan sát sự thay đổi.', essential:'Cốc nhựa trong đủ rộng, nước, muối ăn, thìa và trứng gà còn nguyên vỏ; người lớn chuẩn bị và kiểm tra trước.', optional:'Có thể dùng hộp nhựa trong thay cốc. Quy trình dưới đây dùng trứng; cô có thể cho trẻ thử thêm đồ vật khác để so sánh. Không phải vật nào cũng đổi trạng thái khi thêm muối.', steps:'Thử trứng trong nước ngọt. Thêm từng ít muối, khuấy tan rồi quan sát lại. Giữ cùng trứng và lượng nước; không lấy số thìa trong game làm công thức ngoài đời.', ids:['item-egg']},
];

type Props = {
  tab: PreparationTab; onTab:(tab:PreparationTab)=>void; onClose:()=>void;
  lesson:TeacherLesson; onStart:(lesson:TeacherLesson)=>void;
  items:{id:string;name:string;image:string}[];
  shape:TankShape; onShape:(shape:TankShape)=>void;
  scale:'normal'|'compact'; onScale:(scale:'normal'|'compact')=>void;
  scene:SceneSetting; onScene:(scene:SceneSetting)=>void;
};

export function TeacherPreparation({tab,onTab,onClose,lesson,onStart,items,shape,onShape,scale,onScale,scene,onScene}:Props){
  const [draft,setDraft]=useState(lesson);
  const closeRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;closeRef.current?.focus();return()=>previous?.focus();},[]);
  const selected=LESSONS.find(l=>l.mode===draft.mode)||LESSONS[0];
  const ready=draft.itemIds.length>0;
  const isWaterLesson=draft.mode==='egg-challenge';
  const materials=isWaterLesson?['Cốc hoặc hộp nhựa trong đủ rộng.','Nước thường và muối ăn.','Một quả trứng gà còn nguyên vỏ.','Thìa, dụng cụ khuấy và khăn lau.']:['Chậu hoặc hộp nhựa trong.','Nước thường và khăn lau.','Vài đồ vật lớn như táo, đồ chơi nhựa và thìa inox.'];
  const alternatives=isWaterLesson?['Dùng hộp nhựa trong thay cho cốc.','Thử thêm táo hoặc đồ chơi nhựa để so sánh với trứng.','Dùng cùng một đồ vật ở các lần thử nước thường và nước muối.']:['Dùng miếng gỗ sạch thay cho táo.','Chọn đồ vật quen thuộc có sẵn trong nhà.','Thử thêm vật có hình dạng hoặc chất liệu khác.'];
  const practiceSteps=isWaterLesson?[
    'Chuẩn bị cốc nước nông, trứng, muối, thìa và khăn lau.',
    'Dự đoán rồi thả nhẹ trứng vào nước thường; quan sát vị trí của trứng.',
    'Lấy trứng ra, thêm một ít muối và khuấy tan; giữ nguyên lượng nước.',
    'Thả lại cùng quả trứng và so sánh vị trí với lần trước; lặp lại bước 3–4 nếu muốn thử thêm.',
    'Kể lại điều đã thấy, thu dọn và rửa tay.'
  ]:[
    'Chuẩn bị chậu nước nông, khăn lau và vài đồ vật an toàn.',
    'Chọn một đồ vật và dự đoán vật sẽ chìm hay nổi.',
    'Thả nhẹ đồ vật vào nước; chờ vật ổn định rồi quan sát.',
    'Thử thêm đồ vật khác và so sánh vị trí của các vật trong nước.',
    'Kể lại điều đã thấy, thu dọn và rửa tay.'
  ];
  const learningGoals=isWaterLesson?{
    younger:['Chỉ vị trí quả trứng trong nước thường và nước muối.','Nói hoặc chỉ vị trí nào khác nhau giữa hai lần thử.','Nhận biết thao tác thêm muối qua lời nói hoặc cử chỉ.'],
    older:['So sánh vị trí cùng một quả trứng trước và sau khi thêm muối.','Kể lại trình tự thử với nước thường, thêm muối, khuấy và thử lại.','Nêu điều đã thay đổi là nước có thêm muối.','Đối chiếu dự đoán với kết quả thực tế và đề xuất một lần thử tiếp.']
  }:{
    younger:['Chỉ hoặc gọi tên một vật chìm và một vật nổi đã thử.','Phân biệt vị trí ở mặt nước và dưới đáy bằng lời nói hoặc cử chỉ.'],
    older:['So sánh ít nhất hai đồ vật theo vị trí sau khi thả.','Xếp các đồ vật đã thử thành nhóm chìm và nhóm nổi.','Kể lại dự đoán, cách thử và kết quả của một đồ vật.','Chọn một vật muốn thử tiếp và nêu dự đoán của mình.']
  };
  return <div className="teacher-panel-backdrop" onKeyDown={e=>{
    if(e.key==='Escape')onClose();
    if(e.key==='Tab'){
      const nodes=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, textarea, summary')).filter(el=>el.getClientRects().length);
      const first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }
  }}>
    <section role="dialog" aria-modal="true" aria-label="Chuẩn bị bài cho giáo viên" className="teacher-panel">
      <header className="teacher-panel-heading"><div><span className="lab-eyebrow">DÀNH CHO GIÁO VIÊN</span><h2>Chuẩn bị bài</h2></div><button ref={closeRef} aria-label="Đóng chuẩn bị bài" onClick={onClose}>✕</button></header>
      <nav className="teacher-panel-tabs" aria-label="Nội dung chuẩn bị">
        {([['lesson','Bài học'],['advanced','Giao diện chơi'],['hands-on','Thực hành tại nhà']] as const).map(([id,label])=><button key={id} aria-pressed={tab===id} onClick={()=>onTab(id)}>{label}</button>)}
      </nav>
      <div className="teacher-panel-body">
      {tab==='lesson'&&<>
        <h3>1. Chọn mẫu hoạt động</h3><p className="teacher-muted">Chọn một mục tiêu cho buổi học. Cô có thể điều chỉnh đồ vật bên dưới.</p>
        <div className="teacher-lesson-cards">{LESSONS.map(l=><button key={l.mode} aria-pressed={draft.mode===l.mode} onClick={()=>setDraft({...draft,mode:l.mode,itemIds:[...l.ids]})}><span aria-hidden="true">{l.icon}</span><strong>{l.title}</strong></button>)}</div>
        <div className="teacher-objective"><h3>Mục tiêu</h3><p>{selected.objective}</p><h3>Quan sát việc học</h3><p>{selected.evidence}</p><p className="teacher-muted">Công cụ: {selected.tools}</p></div>
        <h3>2. Độ tuổi</h3><div className="teacher-choice-row">{(['3-4','5-6'] as const).map(age=><button key={age} aria-pressed={draft.age===age} onClick={()=>setDraft({...draft,age})}>{age==='3-4'?'3–4 tuổi':'5–6 tuổi'}</button>)}</div>
        <p className="teacher-muted">{draft.age==='3-4'?'Một thao tác mỗi lần; trẻ chỉ hoặc gọi tên điều đã thấy.':'Mời trẻ dự đoán, thử lại và kể sự khác nhau; chỉ đổi một yếu tố mỗi lượt.'}</p>
        <><h3>3. Đồ vật trong khay ({draft.itemIds.length})</h3><div className="teacher-item-picker">{items.map(item=><button key={item.id} aria-pressed={draft.itemIds.includes(item.id)} onClick={()=>setDraft({...draft,itemIds:draft.itemIds.includes(item.id)?draft.itemIds.filter(id=>id!==item.id):[...draft.itemIds,item.id]})}><img src={item.image} alt=""/><span>{item.name}</span></button>)}</div>{!ready&&<p role="status">Cô chọn ít nhất một đồ vật để bắt đầu.</p>}</>
        <p className="teacher-muted">Bắt đầu hoạt động sẽ trả vật về khay và chuẩn bị nước ngọt; lịch sử quan sát được giữ lại.</p>
      </>}
      {tab==='advanced'&&<>
        <h3>Hình dạng bể</h3><div className="teacher-choice-row">{([['rectangle','Chữ nhật'],['square','Lập phương'],['cylinder','Trụ tròn'],['triangle','Tam giác']] as const).map(([id,label])=><button key={id} aria-pressed={shape===id} onClick={()=>onShape(id)}>{label}</button>)}</div>
        <h3>Kích thước bể</h3><div className="teacher-choice-row"><button aria-pressed={scale==='normal'} onClick={()=>onScale('normal')}>Bể lớn</button><button aria-pressed={scale==='compact'} onClick={()=>onScale('compact')}>Bể nhỏ</button></div>
        <h3>Cảnh nền</h3><div className="teacher-scene-picker">{SCENE_OPTIONS.map(option=><button key={option.id} aria-pressed={scene===option.id} onClick={()=>onScene(option.id)}><span aria-hidden="true">{option.icon}</span> {option.label}</button>)}</div>
        <p className="teacher-muted">Cảnh nền chỉ thay không gian xung quanh. Loại nước trong bể giữ theo thí nghiệm đang thực hiện.</p>
        <p className="teacher-muted">Áp dụng ngay vào cảnh. Thay hình dạng bể đơn thuần không làm đổi tính nổi của vật trong nước có cùng khối lượng riêng.</p>
      </>}
      {tab==='hands-on'&&<>
        <h3>🔎 Bé là nhà khoa học - Thực hành với đồ vật thật</h3>
        <p className="teacher-muted">Hoạt động đã chọn: {selected.title}</p>
        <section className="teacher-objective"><h3>1. Cần chuẩn bị</h3><ul className="list-disc pl-5 space-y-2">{materials.map(text=><li key={text}>{text}</li>)}</ul></section>
        <section className="teacher-objective"><h3>2. Thay thế hoặc mở rộng</h3><ul className="list-disc pl-5 space-y-2">{alternatives.map(text=><li key={text}>{text}</li>)}</ul></section>
        <section className="teacher-objective"><h3>3. Cách tổ chức</h3><ol className="teacher-practice-steps">{practiceSteps.map((step,index)=><li key={step}><strong>Bước {index+1}</strong><p>{step}</p></li>)}</ol></section>
        <section className="teacher-safety"><h3>4. Lưu ý dành cho người lớn hỗ trợ trẻ</h3><h4 className="font-bold mt-2">Nguyên tắc thực hiện thí nghiệm</h4><ul className="list-disc pl-5 space-y-2"><li>Cho trẻ chọn, dự đoán và quan sát trước khi giải thích.</li><li>Chỉ thay đổi một yếu tố trong mỗi lượt so sánh.</li><li>Chờ vật ổn định trước khi ghi nhận kết quả.</li>{isWaterLesson&&<li>Giữ cùng đồ vật, cùng cốc và lượng nước ban đầu khi thử thêm muối.</li>}<li>Chấp nhận dự đoán khác kết quả và cho trẻ thử lại.</li><li>Ghi nhận điều trẻ thực sự quan sát được.</li></ul><h4 className="font-bold mt-3">Nguyên tắc đảm bảo an toàn</h4><ul className="list-disc pl-5 space-y-2"><li>Luôn giám sát trẻ trong suốt hoạt động với nước.</li><li>Dùng nước nông và vật chứa nhựa đặt trên mặt phẳng chắc chắn.</li><li>Chọn đồ vật sạch, không sắc cạnh và không nhỏ dễ nuốt.</li><li>Không cho trẻ nếm nước thí nghiệm hoặc đưa vật liệu vào miệng.</li><li>Dừng hoạt động khi nước đổ hoặc đồ vật bị vỡ.</li>{isWaterLesson&&<li>Người lớn xử lý trứng vỡ và nước có trứng sống.</li>}<li>Lau khô khu vực và rửa tay sau hoạt động.</li></ul></section>
        <section className="teacher-objective"><h3>5. So sánh và kể lại</h3><h4 className="font-bold">Trẻ 3–4 tuổi</h4><ul className="list-disc pl-5 space-y-2">{learningGoals.younger.map(text=><li key={text}>{text}</li>)}</ul><h4 className="font-bold mt-3">Trẻ 5–6 tuổi</h4><ul className="list-disc pl-5 space-y-2">{learningGoals.older.map(text=><li key={text}>{text}</li>)}</ul></section>
      </>}
      </div>
      <footer className="teacher-panel-footer">{tab==='lesson'?<button className="teacher-primary" disabled={!ready} onClick={()=>onStart(draft)}>Bắt đầu hoạt động</button>:<button className="teacher-primary" onClick={onClose}>Quay lại thí nghiệm</button>}</footer>
    </section>
  </div>;
}

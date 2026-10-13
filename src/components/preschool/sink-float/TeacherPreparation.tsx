import {useEffect, useRef, useState} from 'react';
import {ThreeTankCanvas} from './ThreeTankCanvas';
import {getTankDimensions} from './tankGeometry';
import {TankThumbnail} from './TankThumbnail';
import type {TankShape} from './types';
import {SCENE_OPTIONS, SceneSetting} from './SceneBackdrop';
import {BookOpen,Droplets,Home,Monitor,Volume2,Waves,X,ShieldCheck,Lightbulb,Check,ArrowLeft} from 'lucide-react';

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
  onAudio?:()=>void;
};

export function TeacherPreparation({tab,onTab,onClose,lesson,onStart,items,shape,onShape,scale,onScale,scene,onScene,onAudio}:Props){
  const [draft,setDraft]=useState(lesson);
  const [guideMode,setGuideMode]=useState(lesson.mode);
  const closeRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;closeRef.current?.focus();return()=>previous?.focus();},[]);
  const selected=LESSONS.find(l=>l.mode===draft.mode)||LESSONS[0];
  const ready=draft.itemIds.length>0;
  const isWaterLesson=guideMode==='egg-challenge';
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
    <section role="dialog" aria-modal="true" aria-label="Chuẩn bị bài cho giáo viên" className="teacher-panel teacher-redesign">
      <header className="teacher-panel-heading"><div className="teacher-panel-title"><h2>Chuẩn bị buổi khám phá</h2><span className="lab-eyebrow">GIÁO VIÊN & PHỤ HUYNH</span></div><button ref={closeRef} aria-label="Đóng chuẩn bị bài" onClick={onClose}><X size={22}/></button></header>
      <nav className="teacher-panel-tabs" aria-label="Nội dung chuẩn bị">
        {([['lesson','Bài học',BookOpen],['advanced','Giao diện',Monitor],['hands-on','Thực hành tại nhà',Home]] as const).map(([id,label,Icon])=><button key={id} aria-pressed={tab===id} onClick={()=>onTab(id)}><Icon size={19}/>{label}</button>)}
        {onAudio&&<button onClick={onAudio}><Volume2 size={19}/> Âm thanh</button>}
      </nav>
      <div className="teacher-panel-body">
      {tab==='lesson'&&<>
        <h3>1. Chọn mẫu hoạt động</h3><p className="teacher-muted">Chọn một mục tiêu cho buổi học. Cô có thể điều chỉnh đồ vật bên dưới.</p>
        <div className="teacher-lesson-cards">{LESSONS.map(l=><button key={l.mode} aria-pressed={draft.mode===l.mode} onClick={()=>setDraft({...draft,mode:l.mode,itemIds:[...l.ids]})}>{l.mode==='discovery'?<Waves size={29}/>:<Droplets size={29}/>}<strong>{l.title}</strong></button>)}</div>
        <div className="premium-adult-preview"><div className="premium-mini-tank"><div className="premium-mini-water"/>{items.filter(item=>draft.itemIds.includes(item.id)).slice(0,4).map((item,i)=><img key={item.id} src={item.image} alt="" style={{left:(18+i*21)+'%'}}/>)}</div><span>Chuẩn bị đồ vật cho buổi học</span></div>
        <div className="teacher-objective"><h3>Mục tiêu</h3><p>{selected.objective}</p><h3>Quan sát việc học</h3><p>{selected.evidence}</p><p className="teacher-muted">Công cụ: {selected.tools}</p></div>
        <h3>2. Độ tuổi</h3><div className="teacher-choice-row">{(['3-4','5-6'] as const).map(age=><button key={age} aria-pressed={draft.age===age} onClick={()=>setDraft({...draft,age})}>{age==='3-4'?'3–4 tuổi':'5–6 tuổi'}</button>)}</div>
        <p className="teacher-muted">{draft.age==='3-4'?'Một thao tác mỗi lần; trẻ chỉ hoặc gọi tên điều đã thấy.':'Mời trẻ dự đoán, thử lại và kể sự khác nhau; chỉ đổi một yếu tố mỗi lượt.'}</p>
        <><h3>3. Đồ vật trong khay ({draft.itemIds.length})</h3><div className="teacher-item-picker">{items.map(item=><button key={item.id} aria-pressed={draft.itemIds.includes(item.id)} onClick={()=>setDraft({...draft,itemIds:draft.itemIds.includes(item.id)?draft.itemIds.filter(id=>id!==item.id):[...draft.itemIds,item.id]})}><img src={item.image} alt=""/><span>{item.name}</span></button>)}</div>{!ready&&<p role="status">Cô chọn ít nhất một đồ vật để bắt đầu.</p>}</>
        <p className="teacher-muted">Bắt đầu hoạt động sẽ trả vật về khay và chuẩn bị nước ngọt; lịch sử quan sát được giữ lại.</p>
      </>}
      {tab==='advanced'&&<div className="teacher-appearance">
        <div className="teacher-live-column"><div className="teacher-live-preview" aria-label="Xem trước giao diện bể"><ThreeTankCanvas sceneSetting={scene} shape={shape} scale={scale} dims={getTankDimensions(shape,scale)} items={[]} onUpdateItems={()=>{}} waterDensity={1} interactionMode="interact" onInteractionModeChange={()=>{}} holdingItemId={null} onHoldItem={()=>{}} workflowStep="idle" onPourSaltAtPoint={()=>{}} soundEnabled={false} onMessageUpdate={()=>{}} showXRay={false} inputLocked/>
          <span className="teacher-preview-tag">Xem trước · {SCENE_OPTIONS.find(s=>s.id===scene)?.label}</span>
        </div><div className="teacher-preview-note"><Check size={18}/><div><strong>Thấy ngay lựa chọn của cô</strong><p>Quay lại để tiếp tục thí nghiệm trong chế độ giáo viên.</p></div></div><p className="teacher-muted">Bản xem trước minh họa hình dáng và không gian. Nước và đồ vật trong thí nghiệm được giữ khi đóng bảng này.</p></div>
        <div className="teacher-appearance-controls"><h3>Hình dạng bể</h3><p className="teacher-muted">Chọn chiếc bể cho buổi khám phá</p><div className="teacher-tank-choices">{([['rectangle','Chữ nhật'],['square','Lập phương'],['cylinder','Trụ tròn'],['triangle','Tam giác']] as const).map(([id,label])=><button key={id} aria-pressed={shape===id} onClick={()=>onShape(id)}><TankThumbnail shape={id}/><span>{label}</span></button>)}</div>
        <h3>Kích thước bể</h3><div className="teacher-size-choices">{([['normal','Bể lớn'],['compact','Bể nhỏ']] as const).map(([id,label])=><button key={id} aria-pressed={scale===id} onClick={()=>onScale(id)}><TankThumbnail shape={shape} compact={id==='compact'}/><span>{label}</span></button>)}</div>
        <h3>Cảnh nền <span className="teacher-count">8 không gian khám phá</span></h3><div className="teacher-scene-picker">{SCENE_OPTIONS.map(option=><button key={option.id} aria-pressed={scene===option.id} onClick={()=>onScene(option.id)}><img src={option.thumbnail} alt="" width={320} height={200} draggable={false}/><span>{option.label}</span>{scene===option.id&&<span className="teacher-scene-selected" aria-hidden="true">✓</span>}</button>)}</div>
        <p className="teacher-muted">Cảnh nền chỉ thay không gian xung quanh. Thay hình dạng bể không làm đổi tính nổi của vật trong nước có cùng khối lượng riêng.</p></div>
      </div>}
      {tab==='hands-on'&&<div className="teacher-home">
        <div className="teacher-home-intro"><h2>Cùng khám phá với đồ vật thật</h2><p>Từ màn hình đến một chậu nước ở nhà.</p></div>
        <div className="teacher-guide-tabs" aria-label="Chọn hoạt động thực hành">{LESSONS.map(l=><button key={l.mode} aria-pressed={guideMode===l.mode} onClick={()=>setGuideMode(l.mode)}>{l.mode==='discovery'?<Waves size={21}/>:<Droplets size={21}/>} {l.title}</button>)}</div>
        <div className="teacher-home-layout"><main className="teacher-home-main">
          <section className="teacher-home-prep" aria-label="Dụng cụ thực hành tại nhà">
            <div className="teacher-home-materials"><h3>Chuẩn bị đơn giản</h3><div className="teacher-home-photo"><img src={isWaterLesson?'/assets/sink-float/home-salt-materials.webp':'/assets/sink-float/home-materials-v2.webp'} alt={isWaterLesson?'Cốc nhựa nước, trứng còn nguyên vỏ, muối, thìa và khăn lau':'Chậu nhựa nước nông, bình nhựa, táo, vịt đồ chơi, thìa và khăn lau'}/><div className="teacher-photo-labels" aria-hidden="true">{(isWaterLesson?['Cốc nhựa','Trứng','Muối','Thìa','Khăn lau']:['Chậu nhựa','Nước','Đồ vật quen thuộc','Khăn lau']).map(label=><span key={label}>{label}</span>)}</div></div></div>
            <div className="teacher-home-substitutes"><h3>Có thể thay thế</h3><img src="/assets/sink-float/home-alternatives.webp" alt="Hộp nhựa trong và miếng gỗ sạch"/><p><strong>Hộp nhựa trong</strong> thay {isWaterLesson?'cốc':'chậu'}.</p><p><strong>Miếng gỗ sạch</strong> để thử thêm cùng đồ vật quen thuộc.</p></div>
          </section>
          <section className="teacher-home-try"><h3>Cùng trẻ thử</h3><div className="teacher-home-steps">{[{title:'Dự đoán',text:isWaterLesson?'Con nghĩ trứng sẽ ở đâu?':'Con nghĩ vật sẽ ở đâu?'},{title:'Thử và quan sát',text:isWaterLesson?'Thử trứng trong nước thường, rồi thêm muối và thử lại.':'Thả nhẹ, chờ rồi quan sát.'},{title:'Kể lại',text:isWaterLesson?'Con thấy gì khác nhau?':'Con thấy điều gì?'}].map(({title,text},i)=><section key={title}><header><span className="teacher-step-number">{i+1}</span><h4>{title}</h4></header><img src={`/assets/sink-float/${isWaterLesson?'home-salt-step':'home-step'}-${i+1}.webp`} alt={`${title}: ${text}`}/><p>{text}</p></section>)}</div></section>
          <details className="teacher-home-details"><summary>Hướng dẫn từng bước và vật liệu thay thế</summary>
            <section className="teacher-objective"><h3>1. Cần chuẩn bị</h3><ul className="list-disc pl-5 space-y-2">{materials.map(text=><li key={text}>{text}</li>)}</ul></section>
            <section className="teacher-objective"><h3>2. Thay thế hoặc mở rộng</h3><ul className="list-disc pl-5 space-y-2">{alternatives.map(text=><li key={text}>{text}</li>)}</ul></section>
            <section className="teacher-objective"><h3>3. Cách tổ chức</h3><ol className="teacher-practice-steps">{practiceSteps.map((step,index)=><li key={step}><strong>Bước {index+1}</strong><p>{step}</p></li>)}</ol></section>
          </details>
        </main><aside className="teacher-home-aside"><section className="teacher-home-supervision"><h3><ShieldCheck size={29}/> Người lớn đồng hành</h3><ul><li><ShieldCheck/> Luôn ở bên trẻ</li><li><Droplets/> Dùng nước nông</li><li><Home/> Vật lớn, sạch, không sắc</li><li><X/> Không nếm nước thí nghiệm</li></ul></section>
          <section className="teacher-home-age"><h3><Lightbulb size={26}/> Cho trẻ chọn và thử lại</h3><div><p><strong>3–4 tuổi</strong><span>{isWaterLesson?'Chỉ vị trí cùng quả trứng trước và sau khi thêm muối.':'Thử với 2–3 đồ vật quen thuộc, chỉ hoặc gọi tên vị trí.'}</span></p><p><strong>5–6 tuổi</strong><span>{isWaterLesson?'Dự đoán, so sánh hai lần thử với cùng quả trứng.':'Thử thêm vài đồ vật khác, dự đoán và so sánh.'}</span></p></div></section>
          <details className="teacher-home-details"><summary>Hướng dẫn tổ chức và an toàn</summary><section className="teacher-safety"><h3>Người lớn hỗ trợ trẻ</h3><ul className="list-disc pl-5 space-y-2"><li>Cho trẻ chọn, dự đoán và quan sát trước khi giải thích.</li><li>Chỉ thay đổi một yếu tố trong mỗi lượt so sánh.</li><li>Chờ vật ổn định rồi ghi nhận kết quả; mời trẻ thử lại.</li>{isWaterLesson&&<li>Giữ cùng quả trứng, cốc và lượng nước ban đầu khi thử thêm muối. Người lớn xử lý trứng vỡ.</li>}<li>Dùng vật chứa nhựa trên mặt phẳng chắc chắn; tránh vật sắc cạnh hoặc nhỏ dễ nuốt.</li><li>Dừng hoạt động nếu nước đổ hay vật vỡ; lau khô và rửa tay sau hoạt động.</li></ul></section></details>
          <details className="teacher-home-details"><summary>Gợi ý quan sát theo độ tuổi</summary><h4>Trẻ 3–4 tuổi</h4><ul className="list-disc pl-5 space-y-2">{learningGoals.younger.map(text=><li key={text}>{text}</li>)}</ul><h4>Trẻ 5–6 tuổi</h4><ul className="list-disc pl-5 space-y-2">{learningGoals.older.map(text=><li key={text}>{text}</li>)}</ul></details>
          <details className="teacher-home-details"><summary>So sánh với mô phỏng</summary><p>Mời trẻ kể điều giống và khác giữa lần thử thật và trên màn hình. Đồ vật thật có thể khác chất liệu, kích thước và lượng không khí bên trong.</p>{isWaterLesson&&<p>Không phải vật nào cũng đổi trạng thái khi thêm muối. Giữ cùng trứng và lượng nước ban đầu; không dùng số thìa trong game làm công thức ngoài đời.</p>}</details></aside></div>
      </div>}
      </div>
      <footer className="teacher-panel-footer">{tab==='lesson'?<button className="teacher-primary" disabled={!ready} onClick={()=>onStart(draft)}>Bắt đầu hoạt động</button>:<><button className="teacher-primary" onClick={onClose}><ArrowLeft size={22}/> Quay lại thí nghiệm</button><span className="teacher-footer-note">{tab==='advanced'?'Áp dụng ngay trong chế độ giáo viên':'Lau khô và rửa tay sau hoạt động.'}</span></>}</footer>
    </section>
  </div>;
}

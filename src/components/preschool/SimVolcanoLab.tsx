import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, FlaskConical, Hand, Home, Lightbulb, Mountain, Play, RotateCcw, Users, Volume2, VolumeX, X } from 'lucide-react';
import { createReaction, addIngredient, advanceReaction, Ingredient, MAX_LIQUID_ML, MAX_SODA_GRAMS, MAX_SOAP_DOSES } from './volcano/reaction';
import { MaterialArt, MATERIALS } from './volcano/MaterialArt';
import { VolcanoScene } from './volcano/VolcanoScene';
import './sink-float/premiumExperience.css';
import './volcano/volcano.css';

type Recipe=Record<Ingredient,number>;
const emptyRecipe=():Recipe=>({bakingSoda:0,vinegar:0,water:0,soap:0,color:0});
type Trial={recipe:Recipe; observation:string; peak:number; prediction:string};
const observations=['Không thấy bọt','Có bọt trong cốc','Bọt trào ra ngoài'];
const speech={start:'Con chọn một nguyên liệu, rồi chạm miệng núi để thêm vào nhé.',added:'Con đã thêm nguyên liệu. Hãy nhìn vào miệng núi. Con thấy điều gì?',bubble:'Con hãy nhìn những bọt nhỏ. Chúng đang đi đâu nhỉ?',water:'Con hãy nhìn trong cốc. Con muốn thử thêm nguyên liệu nào?',reset:'Cốc mới đã sẵn sàng. Con thử một cách khác nhé.',compare:'Con thử hai lần. Giữ nguyên một thìa baking soda, rồi đổi nước thành giấm. Con thấy gì khác nhau?',home:'Con hãy cùng người lớn tìm nguyên liệu và thử với một chiếc cốc mở trên khay nhé.'};
type Clip=keyof typeof speech;

export function SimVolcanoLab() {
  const reaction=useRef(createReaction());const recipeRef=useRef(emptyRecipe());
  const [role,setRole]=useState<'student'|'teacher'|null>(null);
  const [voice,setVoice]=useState(false);const [clip,setClip]=useState<Clip>('start');const [voiceTick,setVoiceTick]=useState(0);const [audioError,setAudioError]=useState(false);
  const [selected,setSelected]=useState<Ingredient|null>(null);const selectedRef=useRef<Ingredient|null>(null);
  const [pointer,setPointer]=useState<{x:number;y:number}|null>(null);
  const [pouring,setPouring]=useState<Ingredient|null>(null);const pourLock=useRef(false);
  const [recipe,setRecipe]=useState<Recipe>(emptyRecipe);const [status,setStatus]=useState({...reaction.current});
  const [message,setMessage]=useState(speech.start);const [more,setMore]=useState(false);
  const [panel,setPanel]=useState<'teacher'|'journal'|'home'|null>(null);const [teacherTab,setTeacherTab]=useState<'lesson'|'home'>('lesson');
  const [prediction,setPrediction]=useState('');const [observation,setObservation]=useState('');const [trials,setTrials]=useState<Trial[]>([]);
  const [compare,setCompare]=useState(false);const [resetView,setResetView]=useState(0);
  const [mouth,setMouth]=useState({x:300,y:200});const stage=useRef<HTMLDivElement>(null);
  const timers=useRef<number[]>([]);const priorReaction=useRef(false);

  const say=(text:string,key:Clip)=>{setMessage(text);setClip(key);setVoiceTick(v=>v+1);};
  useEffect(()=>{
    let frame=0,last=0,update=0;
    const tick=(now:number)=>{const dt=last?Math.min((now-last)/1000,.06):0;last=now;advanceReaction(reaction.current,dt*.45);
      if(now-update>130){setStatus({...reaction.current});update=now;}
      if(reaction.current.reacted&&!priorReaction.current){priorReaction.current=true;say('Con nhìn thấy gì ở miệng núi? Bọt đang đi đâu?', 'bubble');}
      frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);timers.current.forEach(clearTimeout);};
  },[]);
  useEffect(()=>{
    if(!voice)return;setAudioError(false);
    let active=true;
    const audio=new Audio(`/audio/vi/volcano/${clip}.mp3`);
    audio.onerror=()=>{if(active)setAudioError(true);};
    void audio.play().catch(()=>{if(active)setAudioError(true);});
    return()=>{active=false;audio.pause();audio.removeAttribute('src');};
  },[voice,clip,voiceTick]);
  useEffect(()=>{
    const cancel=(event:KeyboardEvent)=>{if(event.key==='Escape'){setSelected(null);selectedRef.current=null;setPointer(null);setPanel(null);}};
    window.addEventListener('keydown',cancel);return()=>window.removeEventListener('keydown',cancel);
  },[]);

  const isFull=(id:Ingredient)=>{
    const s=reaction.current;
    return id==='bakingSoda'?s.sodaGrams>=MAX_SODA_GRAMS-.01:id==='soap'?s.soap>=MAX_SOAP_DOSES||s.liquidMl+2>MAX_LIQUID_ML:id==='color'?s.color:s.liquidMl+20>MAX_LIQUID_ML;
  };
  const choose=(id:Ingredient)=>{if(pourLock.current||isFull(id))return;selectedRef.current=id;setSelected(id);say(`Con đang cầm ${MATERIALS.find(m=>m.id===id)!.name.toLocaleLowerCase('vi')}. Chạm miệng núi để thêm vào.`, 'start');};
  const pour=()=>{
    const id=selectedRef.current;if(!id||pourLock.current)return;
    if(isFull(id)){say('Cốc đã đủ nguyên liệu này. Con dùng cốc mới để thử tiếp nhé.','reset');return;}
    pourLock.current=true;setPouring(id);setPointer(null);setSelected(null);selectedRef.current=null;
    timers.current.push(window.setTimeout(()=>{
      addIngredient(reaction.current,id);recipeRef.current={...recipeRef.current,[id]:recipeRef.current[id]+1};setRecipe({...recipeRef.current});
      say(id==='water'?'Con đã thêm nước. Con thấy điều gì trong cốc?':'Con đã thêm nguyên liệu. Hãy nhìn vào miệng núi nhé.',id==='water'?'water':'added');
    },480));
    timers.current.push(window.setTimeout(()=>{setPouring(null);pourLock.current=false;},1200));
  };
  const reset=()=>{
    if(pourLock.current)return;
    reaction.current=createReaction();recipeRef.current=emptyRecipe();setRecipe(emptyRecipe());setStatus({...reaction.current});priorReaction.current=false;
    setSelected(null);selectedRef.current=null;setObservation('');setPrediction('');say(speech.reset,'reset');
  };
  const keepTrial=()=>{
    if(!observation||!reaction.current.additions||pourLock.current||reaction.current.foam>.02)return;
    setTrials(previous=>[...previous.slice(-3),{recipe:{...recipeRef.current},observation,peak:reaction.current.peakFoam,prediction}]);reset();
  };
  const onDragStart=(event:React.PointerEvent<HTMLButtonElement>,id:Ingredient)=>{
    if(pourLock.current||isFull(id))return;choose(id);const start={x:event.clientX,y:event.clientY};let moved=false;
    event.currentTarget.setPointerCapture(event.pointerId);
    const button=event.currentTarget;
    const move=(ev:PointerEvent)=>{if(Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>8)moved=true;if(moved)setPointer({x:ev.clientX,y:ev.clientY});};
    const up=(ev:PointerEvent)=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerup',up);button.removeEventListener('pointercancel',cancel);setPointer(null);
      if(moved){const r=stage.current?.getBoundingClientRect();if(r&&Math.hypot(ev.clientX-r.left-mouth.x,ev.clientY-r.top-mouth.y)<90)pour();}
    };
    const cancel=()=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerup',up);button.removeEventListener('pointercancel',cancel);setPointer(null);};
    button.addEventListener('pointermove',move);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',cancel);
  };
  const start=(mode:'student'|'teacher')=>{setRole(mode);setVoice(mode==='student');if(mode==='teacher'){setPanel('teacher');setMore(true);}else say(speech.start,'start');};
  const stageView=(welcome=false)=><div className={`volcano-stage ${welcome?'volcano-stage-welcome':''}`} ref={welcome?undefined:stage}>
    <img className="volcano-backdrop" src="/assets/sink-float/scenes/classroom.webp" alt="" draggable={false}/>
    <VolcanoScene read={()=>reaction.current} onMouth={welcome?undefined:setMouth} resetView={resetView} active={!welcome&&!selected&&!pouring}/>
    {!welcome&&<>
      <span className="volcano-live"><span/> {status.foam>.2?'Bọt đang trào':status.foam>.025?'Bọt đang dâng':status.additions?'Con thử tiếp nhé':'Cốc mở · sẵn sàng'}</span>
      <button className={`volcano-mouth ${selected?'volcano-mouth-ready':''}`} style={{left:mouth.x,top:mouth.y}} onClick={pour} disabled={!selected||!!pouring} aria-label="Thêm nguyên liệu vào miệng núi lửa">{selected&&<><span>＋</span><strong>Thêm vào đây</strong></>}</button>
      {pouring&&<div className="volcano-pour" style={{left:mouth.x,top:mouth.y}}><MaterialArt kind={pouring}/><span className={`volcano-stream ${pouring==='bakingSoda'?'volcano-grains':''}`} style={{background:pouring==='color'?'#e87e71':pouring==='bakingSoda'?'#fff9e8':'#b7dce4'}}/></div>}
      <div className="volcano-scene-controls"><button onClick={()=>setResetView(v=>v+1)}><RotateCcw size={17}/> Góc chuẩn</button><span>Kéo nền để xoay · cuộn để phóng to</span></div>
    </>}
  </div>;

  if(!role)return <section className="premium-welcome volcano-welcome">
    <header className="premium-welcome-brand"><Mountain/><span>Núi lửa phun trào</span><span className="premium-edition">KHÁM PHÁ KHOA HỌC · 3–6 TUỔI</span></header>
    <div className="premium-welcome-body"><div className="premium-welcome-copy"><span className="premium-kicker">MỘT CHIẾC CỐC. MỘT ĐIỀU BẤT NGỜ.</span><h1>Núi lửa nhỏ,<br/><em>khám phá lớn!</em></h1><p>Con chọn nguyên liệu, tự tay thử.<br/>Điều gì sẽ xảy ra trong miệng núi?</p><button className="premium-primary" onClick={()=>start('student')}><Play size={22} fill="currentColor"/> Bé khám phá <ArrowRight size={22}/></button><button className="premium-secondary" onClick={()=>start('teacher')}><Users size={22}/> Giáo viên & phụ huynh</button><span className="premium-welcome-note">Tự chọn · Tự thử · Cùng quan sát</span></div><div className="premium-welcome-scene">{stageView(true)}<span className="premium-live-tag"><span/> Núi lửa đất nặn 3D</span></div></div>
    <footer className="premium-welcome-footer">Bắt đầu trên màn hình, cùng người lớn thử với cốc thật.<span>Mô hình bọt khí bằng giấm và baking soda</span></footer>
  </section>;

  return <section className="volcano-lab" aria-label="Thí nghiệm núi lửa phun trào">
    <header className="volcano-heading"><button className="volcano-icon-button" onClick={()=>{setRole(null);setVoice(false);setPanel(null);}} aria-label="Về màn hình bắt đầu"><ArrowLeft size={20}/></button><Mountain className="volcano-logo"/><h1>Núi lửa phun trào</h1><span className="volcano-age">3–6 tuổi</span><div className="volcano-utilities"><button onClick={()=>{setVoice(v=>!v);setVoiceTick(v=>v+1);}} aria-label={voice?'Tắt giọng hướng dẫn':'Bật giọng hướng dẫn'}>{voice?<Volume2 size={20}/>:<VolumeX size={20}/>}</button><button onClick={()=>setPanel('teacher')}><Users size={19}/><span>Giáo viên</span></button></div></header>
    <nav className="volcano-navigation" aria-label="Hoạt động"><button aria-pressed={!compare} onClick={()=>{setCompare(false);say(speech.start,'start');}}><FlaskConical size={18}/> Tự khám phá</button><button aria-pressed={compare} onClick={()=>{setCompare(true);say(speech.compare,'compare');}}><Lightbulb size={18}/> Thử hai cách</button><button onClick={()=>{setPanel('home');say(speech.home,'home');}}><Home size={18}/> Thử ngoài đời</button></nav>
    <div className="volcano-workspace"><main className="volcano-main">{stageView()}
      <div className="volcano-prompt"><Hand size={22}/><p aria-live="polite">{message}</p><button className="volcano-icon-button" aria-label="Nghe lại hướng dẫn" onClick={()=>{setVoice(true);setVoiceTick(v=>v+1);}}><Volume2 size={19}/></button></div>
      {audioError&&<p className="volcano-audio-error">Chưa phát được lời đọc. Con có thể xem hướng dẫn trên màn hình.</p>}
      {compare&&<div className="volcano-compare"><Lightbulb size={22}/><p><strong>Một thìa bột. Hai cách thử.</strong> Lần đầu thêm nước. Giữ lần thử, rồi dùng cốc mới: cùng một thìa bột, đổi nước thành giấm. Con thấy gì khác?</p></div>}
      <div className="volcano-reflect"><BookOpen size={21}/><span>Con đã thấy điều gì?</span><button onClick={()=>setPanel('journal')}>Sổ khám phá {trials.length>0&&<b>{trials.length}</b>} <ArrowRight size={17}/></button></div>
    </main>
    <aside className="volcano-dock"><div className="volcano-tray-heading"><span className="volcano-eyebrow">GÓC NGUYÊN LIỆU</span><h2>Con muốn thử gì?</h2><p>Chọn hoặc kéo nguyên liệu<br/>đến miệng núi lửa.</p></div>
      <div className="volcano-materials">{MATERIALS.filter(m=>more||m.id!=='color').map(item=><button key={item.id} className="volcano-material" aria-pressed={selected===item.id} aria-label={`Lấy ${item.name}`} disabled={!!pouring||isFull(item.id)} onPointerDown={e=>onDragStart(e,item.id)} onClick={e=>{if(e.detail===0)choose(item.id);}}><MaterialArt kind={item.id}/><strong>{item.name}</strong><small>{item.note}</small>{recipe[item.id]>0&&<b className="volcano-count">{recipe[item.id]}</b>}</button>)}</div>
      <button className="volcano-more" aria-expanded={more} onClick={()=>setMore(!more)}>{more?'Thu gọn nguyên liệu':'＋ Khám phá thêm'}</button>
      {selected&&<button className="volcano-cancel" onClick={()=>{setSelected(null);selectedRef.current=null;}}>Trả nguyên liệu về khay</button>}
      <div className="volcano-recipe"><span>Trong cốc của con</span><p>{recipeSummary(recipe)}</p></div>
      <button className="volcano-reset" disabled={!!pouring} onClick={reset}><RotateCcw size={18}/> Cốc mới · thử lại</button>
      <p className="volcano-dock-note">Tự thử bao nhiêu lần cũng được.</p>
    </aside></div>
    {pointer&&selected&&<div className="volcano-carried" style={{left:pointer.x,top:pointer.y}}><MaterialArt kind={selected}/></div>}
    {panel&&<div className="volcano-modal-backdrop" onClick={()=>setPanel(null)}><section role="dialog" aria-modal="true" aria-label={panel==='teacher'?'Góc giáo viên':panel==='journal'?'Sổ khám phá':'Thử ngoài đời'} className="volcano-modal" onClick={e=>e.stopPropagation()}><header><div><span className="volcano-eyebrow">NÚI LỬA PHUN TRÀO</span><h2>{panel==='teacher'?'Cùng trẻ khám phá':panel==='journal'?'Sổ khám phá của con':'Từ màn hình đến chiếc cốc thật'}</h2></div><button className="volcano-icon-button" onClick={()=>setPanel(null)} aria-label="Đóng"><X/></button></header>
      {panel==='journal'?<>
        <p>Con nhìn cốc rồi chọn điều mình thấy. Mỗi lần thử là một phát hiện.</p>
        {status.additions>0?<div className="volcano-current-trial"><h3>Lần đang thử</h3><p>{recipeSummary(recipe)}</p><div className="volcano-observations">{observations.map((label,i)=><button key={label} aria-pressed={observation===label} onClick={()=>setObservation(label)}><span>{['○','◌','♧'][i]}</span>{label}</button>)}</div><button className="volcano-primary" disabled={!observation||status.foam>.02||!!pouring} onClick={keepTrial}><Check size={18}/> Giữ lần thử & dùng cốc mới</button>{status.foam>.02&&<small>Chờ bọt lắng để quan sát trọn lần thử nhé.</small>}</div>:<p className="volcano-empty">Con tự thử với nguyên liệu trước, rồi trở lại đây nhé.</p>}
        {trials.map((trial,i)=><article className="volcano-trial" key={i}><b>Lần {i+1}</b><p>{recipeSummary(trial.recipe)}</p><strong>Con kể: {trial.observation.toLowerCase()}.</strong>{trial.prediction&&<small>Trước đó con đoán: {trial.prediction.toLowerCase()}.</small>}</article>)}
        {trials.length>=2&&<p className="volcano-question">Nhìn lại hai lần thử: con đã đổi nguyên liệu nào? Con muốn thử gì tiếp?</p>}
      </>:<>
        {panel==='teacher'&&<nav className="volcano-modal-tabs"><button aria-pressed={teacherTab==='lesson'} onClick={()=>setTeacherTab('lesson')}>Mục tiêu & gợi mở</button><button aria-pressed={teacherTab==='home'} onClick={()=>setTeacherTab('home')}>Chuẩn bị ngoài đời</button></nav>}
        {panel==='home'||teacherTab==='home'?<HomeGuide/>:<>
          <div className="volcano-objective"><h3>Một mục tiêu nhỏ, quan sát thật rõ</h3><p>Trẻ nhận ra một số nguyên liệu khi gặp nhau tạo bọt; tự thử và kể lại bọt xuất hiện, dâng lên, tràn rồi lắng. Với trẻ 5–6 tuổi, so sánh hai lần chỉ đổi nước thành giấm.</p></div>
          <h3>Gợi mở ngắn, để trẻ tự làm</h3><ol><li><strong>Trước khi thử:</strong> “Con chọn gì? Con nghĩ điều gì sẽ xảy ra?” Không bắt buộc dự đoán, không chấm đúng sai.</li><li><strong>Trong khi thử:</strong> “Con nhìn trong miệng núi. Con thấy gì?” Chờ trẻ quan sát.</li><li><strong>Sau khi thử:</strong> “Lần này có gì khác? Con muốn thử lại thế nào?”</li></ol>
          <label className="volcano-prediction">Dự đoán cùng trẻ · có thể bỏ qua<select value={prediction} onChange={e=>setPrediction(e.target.value)}><option value="">Chưa chọn</option>{observations.map(o=><option key={o}>{o}</option>)}</select></label>
          <p><strong>3–4 tuổi:</strong> người lớn hỗ trợ lấy–thêm một nguyên liệu mỗi lần; trẻ chỉ, nói hoặc chọn tranh điều đã thấy.<br/><strong>5–6 tuổi:</strong> tự chọn, đổi một điều kiện, lưu hai lần thử rồi so sánh.</p>
          <details className="volcano-science"><summary>Kiến thức cho người lớn · dùng sau quan sát</summary><p>Giấm phản ứng với baking soda tạo khí CO₂. Khí thoát ra thành bọt; nước rửa chén giữ bọt lâu hơn, không tạo thêm khí. Màu chỉ giúp dễ nhìn. Chỉ có nước và baking soda không tạo phản ứng này.</p><p>Núi lửa đất nặn chỉ mô phỏng hình ảnh trào ra. Núi lửa thật có đá nóng chảy và khí từ trong lòng đất, không có phản ứng giấm–baking soda.</p><p>Mô hình rút gọn có giới hạn nguyên liệu và tốc độ quy ước; lượng bọt, thời gian và liều trên màn hình không dự báo thí nghiệm thật. Chưa thử khả năng sử dụng trực tiếp với trẻ.</p><p>Nguồn: <a href="https://mnch.uoregon.edu/sites/default/files/inline-files/May%202020%20LW%20Homemade%20Volcano%20Experiment_KS.pdf" target="_blank" rel="noreferrer">Đại học Oregon</a> · <a href="https://www.usgs.gov/programs/VHP/about-volcanoes" target="_blank" rel="noreferrer">USGS</a>.</p></details>
          <button className="volcano-primary" onClick={()=>setPanel(null)}><Play size={18}/> Vào bàn thí nghiệm</button>
        </>}
      </>}
    </section></div>}
  </section>;
}

function recipeSummary(recipe:Recipe) {const parts=MATERIALS.filter(m=>recipe[m.id]>0).map(m=>`${recipe[m.id]} ${m.id==='bakingSoda'?'thìa':m.id==='water'||m.id==='vinegar'?'cốc':'giọt'} ${m.name.toLocaleLowerCase('vi')}`);return parts.join(' · ')||'Cốc trống. Con chọn nguyên liệu nhé!';}
function HomeGuide(){return <div className="volcano-home-guide"><p className="volcano-question">Thử trên màn hình rồi cùng người lớn làm thật. Kết quả có giống điều con thấy không?</p><h3>Tìm quanh nhà</h3><p><strong>Cần có:</strong> cốc nhựa nhỏ để mở, khay hoặc chậu hứng, thìa, baking soda (muối nở) và giấm ăn. Người lớn kiểm tra đúng baking soda, không thay bằng bột nở làm bánh.</p><p><strong>Tùy chọn:</strong> một giọt nước rửa chén để giữ bọt, màu thực phẩm giúp dễ nhìn; đất nặn tạo vỏ núi. Không có đất nặn, dùng nguyên chiếc cốc vẫn thử được. Đĩa sâu có thể thay khay.</p><h3>Người lớn chuẩn bị, trẻ cùng thử</h3><ol><li>Đặt cốc nhựa nhỏ trong khay. Cốc luôn để mở, chừa phần lớn khoảng trống.</li><li>Người lớn cho một thìa cà phê baking soda; có thể thêm một giọt nước rửa chén và màu thực phẩm.</li><li>Trẻ dự đoán rồi cùng người lớn rót từ từ một ít giấm ăn. Dừng rót để quan sát bọt.</li><li>Dùng cốc sạch khác: giữ lượng bột như cũ, thử nước thay giấm. Con thấy gì khác?</li></ol><p className="volcano-safety">Luôn có người lớn bên cạnh. Không nếm, không đưa lên mắt, không đậy kín, không đun nóng và không trộn thêm chất tẩy rửa khác. Rửa tay, lau khay sau khi làm.</p><p><strong>Kết nối hằng ngày:</strong> cùng nhìn bọt nước rửa chén khi rửa cốc. Trông giống nhau, nhưng không phải bọt nào cũng do phản ứng giấm–baking soda.</p><a href="https://mnch.uoregon.edu/sites/default/files/inline-files/May%202020%20LW%20Homemade%20Volcano%20Experiment_KS.pdf" target="_blank" rel="noreferrer">Tham khảo hoạt động của Bảo tàng Đại học Oregon ↗</a></div>;}

import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, CircleHelp, Hand, Home, Pause, Play, RotateCcw, Sparkles, Timer, Undo2, Users, Volume2, VolumeX, X } from 'lucide-react';
import { advanceStageOne, createStageOne, HeldTool, pickTool, returnTool, scoop, ToolZone } from './volcano/stageOneModel';
import { MaterialArt } from './volcano/MaterialArt';
import { SceneAnchors, StageOneScene, StageOneSceneHandle } from './volcano/StageOneScene';
import { VolcanoMark } from './volcano/VolcanoMark';
import './volcano/stageOne.css';

const words:Record<string,string>={
  'stage-start':'Con lấy thìa, đưa vào bát bột rồi chạm nút xúc nhé.',
  'stage-scoop':'Con chạm để xúc. Chạm lần nữa để dừng nhé.',
  'stage-pour':'Đưa dụng cụ đến miệng núi. Con chạm để rót, chạm lần nữa để dừng.',
  'stage-observe':'Con thấy gì trong miệng núi? Con thử dừng rót để nhìn nhé.',
  'stage-retry':'Cốc mới đã sẵn sàng. Con thử lại nhé.',
};
function SpoonPicture(){return <svg viewBox="0 0 100 90" aria-hidden="true"><path d="M73 12Q80 8 80 16L48 62L40 56Z" fill="#bacad0" stroke="#657c84" strokeWidth="2"/><ellipse cx="37" cy="65" rx="21" ry="14" transform="rotate(-30 37 65)" fill="#d9e3e5" stroke="#70868d" strokeWidth="2"/><path d="M20 68Q29 46 49 57Q50 69 20 68" fill="#fffdf5"/></svg>}
function BowlPicture(){return <svg viewBox="0 0 100 90" aria-hidden="true"><path d="M12 42Q15 80 50 81Q84 78 88 42" fill="#d7c8a8" stroke="#a29176" strokeWidth="2"/><ellipse cx="50" cy="42" rx="38" ry="15" fill="#f1e7d3"/><path d="M18 43Q50 10 82 43Q50 59 18 43" fill="#fffdf5"/></svg>}

export function SimVolcanoLab(){
  const model=useRef(createStageOne()),scene=useRef<StageOneSceneHandle>(null),scooping=useRef(false),dragging=useRef(false),hasReacted=useRef(false);
  const [role,setRole]=useState<'student'|'teacher'|null>(null),[voice,setVoice]=useState(false),[clip,setClip]=useState('stage-start'),[tick,setTick]=useState(0);
  const [state,setState]=useState({...model.current}),[panel,setPanel]=useState<'teacher'|'home'|null>(null),[help,setHelp]=useState(false),[audioError,setAudioError]=useState(false),[webglError,setWebglError]=useState(false);
  const [slow,setSlow]=useState(false),speed=useRef(1);
  speed.current=slow ? .5 : 1;
  const [anchors,setAnchors]=useState<SceneAnchors>({bowl:{x:200,y:350},crater:{x:500,y:200},spoon:{x:220,y:450},vinegar:{x:800,y:350}});
  const roleRef=useRef(role);roleRef.current=role;
  const refresh=()=>setState({...model.current});
  const speak=(key:string)=>{setClip(key);setTick(n=>n+1);};
  const stop=()=>{scooping.current=false;dragging.current=false;model.current.pouring=false;};
  useEffect(()=>{if(!voice||!role)return;let active=true;const audio=new Audio(`/audio/vi/volcano/${clip}.mp3`);audio.play().then(()=>{if(active)setAudioError(false);}).catch(()=>{if(active)setAudioError(true);});return()=>{active=false;audio.pause();};},[clip,tick,voice,role]);
  useEffect(()=>{let id=0,last=performance.now(),update=0;const frame=(now:number)=>{const dt=Math.min((now-last)/1000,.05)*speed.current;last=now;const m=model.current;
    if(roleRef.current){if(scooping.current)scoop(m,dt);m.tilt=Math.max(0,Math.min(1,m.tilt+(m.pouring?dt*3.8:-dt*5)));advanceStageOne(m,dt);if(m.spoonGrams>=3.995)scooping.current=false;if(m.pouring&&((m.held==='spoon'&&m.spoonGrams<.001)||(m.held==='vinegar'&&m.vinegarMl<.001)))m.pouring=false;if(m.reaction.reacted&&!hasReacted.current){hasReacted.current=true;speak('stage-observe');}}
    if(now-update>110){refresh();update=now;}id=requestAnimationFrame(frame);};id=requestAnimationFrame(frame);return()=>cancelAnimationFrame(id);},[]);
  useEffect(()=>{if(!help)return;const t=setTimeout(()=>setHelp(false),8000);return()=>clearTimeout(t);},[help]);
  useEffect(()=>{const up=()=>{dragging.current=false;};const blur=()=>{stop();refresh();};const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){stop();returnTool(model.current);setPanel(null);refresh();}};window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('blur',blur);window.addEventListener('keydown',key);return()=>{window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('blur',blur);window.removeEventListener('keydown',key);};},[]);
  const pick=(tool:HeldTool)=>{stop();pickTool(model.current,tool);model.current.target=null;scene.current?.pick(tool);refresh();speak(tool==='spoon'?'stage-start':'stage-pour');};
  const place=(zone:ToolZone)=>{if(!model.current.held)return;stop();model.current.target=zone;scene.current?.place(zone);refresh();};
  const action=()=>{const m=model.current;if(m.held==='spoon'&&m.target==='bowl'){scooping.current=!scooping.current;m.pouring=false;}else if(m.held&&m.target==='crater'){scooping.current=false;m.pouring=!m.pouring;}refresh();};
  const reset=()=>{stop();model.current=createStageOne();hasReacted.current=false;scene.current?.home();refresh();speak('stage-retry');};
  const start=(mode:'student'|'teacher')=>{setRole(mode);setVoice(mode==='student');speak('stage-start');if(mode==='teacher')setPanel('teacher');};
  const open=(which:'teacher'|'home')=>{stop();setPanel(which);refresh();};
  const canScoop=state.held==='spoon'&&state.target==='bowl',canPour=!!state.held&&state.target==='crater',active=state.pouring||scooping.current;
  const quantity=state.held==='spoon'?state.spoonGrams/4:state.vinegarMl/60;
  return <section className="v1-shell" aria-label="Thí nghiệm núi lửa">
    <header className="v1-header"><div className="v1-brand"><VolcanoMark/><div><strong>Núi lửa</strong><span>THÍ NGHIỆM TẠO BỌT</span></div></div><nav aria-label="Điều khiển thí nghiệm">
      {role&&<button title="Màn hình bắt đầu" aria-label="Về màn hình bắt đầu" onClick={()=>{stop();setRole(null);setPanel(null);}}><ArrowLeft/></button>}
      <button title={voice?'Tắt giọng nói':'Bật giọng nói'} aria-label={voice?'Tắt giọng nói':'Bật giọng nói'} aria-pressed={voice} onClick={()=>setVoice(v=>!v)}>{voice?<Volume2/>:<VolumeX/>}</button>
      <button title="Gợi ý bằng hình ảnh" aria-label="Xem gợi ý bằng hình ảnh" aria-pressed={help} onClick={()=>{setHelp(v=>!v);speak('stage-start');}}><CircleHelp/></button>
      <button className="v1-teacher-button" title="Góc giáo viên và phụ huynh" aria-label="Góc giáo viên và phụ huynh" onClick={()=>open('teacher')}><Users/><span>Giáo viên</span></button>
    </nav></header>
    <div className="v1-stage" onPointerMove={e=>{if(!dragging.current||!model.current.held)return;stop();dragging.current=true;model.current.target=scene.current?.aim(e.clientX,e.clientY)||'tray';refresh();}}
      onPointerDown={e=>{if(!role||!model.current.held||(e.target as HTMLElement).closest('[data-action-control]'))return;stop();model.current.target=scene.current?.aim(e.clientX,e.clientY)||'tray';dragging.current=true;e.currentTarget.setPointerCapture(e.pointerId);refresh();}}>
      <img className="v1-backdrop" src="/assets/sink-float/scenes/classroom.webp" alt=""/>
      <StageOneScene ref={scene} read={()=>model.current} scooping={()=>scooping.current} timeScale={()=>speed.current} onAnchors={setAnchors} locked={!role||!!panel} onUnavailable={()=>setWebglError(true)}/>
      {!role?<><div className="v1-intro"><span>CHẠM · THỬ · KHÁM PHÁ</span><h2>Một ngọn núi.<br/><em>Bao điều bất ngờ.</em></h2></div><div className="v1-welcome-actions" data-action-control><button className="v1-start" onClick={()=>start('student')}><Play fill="currentColor"/>Bé chơi<ArrowRight/></button><button className="v1-adult" onClick={()=>start('teacher')}><Users/>Cùng trẻ</button></div><small className="v1-model-note">Mô hình thí nghiệm · giấm & baking soda</small></>:<>
        <div className="v1-scene-top" data-action-control><span className={`v1-live ${state.reaction.foam>.03?'is-reacting':''}`}>{state.reaction.foam>.03?<Sparkles/>:<Hand/>}<span>{state.reaction.foam>.03?'Cùng quan sát':'Tự tay khám phá'}</span></span><div><button className="v1-speed" title={slow?'Trở về tốc độ thường':'Quan sát ở nửa tốc độ'} aria-label="Xem chậm phản ứng" aria-pressed={slow} onClick={()=>setSlow(v=>!v)}><Timer/><span>{slow?'×½':'×1'}</span></button><button title="Góc nhìn ban đầu" aria-label="Đưa góc nhìn về ban đầu" onClick={()=>scene.current?.home()}><VolcanoMark/></button><button title="Làm lại thí nghiệm" aria-label="Làm lại thí nghiệm" onClick={reset}><RotateCcw/></button></div></div>
        {(['spoon','vinegar'] as const).map(tool=>state.held!==tool&&<button key={tool} data-action-control className="v1-source-pick" style={{left:anchors[tool].x,top:anchors[tool].y}} aria-label={tool==='spoon'?'Lấy thìa trong cảnh':'Lấy cốc giấm trong cảnh'} onPointerDown={e=>{e.stopPropagation();pick(tool);dragging.current=true;e.currentTarget.setPointerCapture(e.pointerId);}}><Hand size={20}/></button>)}
        {state.held==='spoon'&&<button data-action-control className={`v1-target ${state.target==='bowl'?'is-target':''}`} style={{left:anchors.bowl.x,top:anchors.bowl.y}} aria-label="Đưa thìa đến bát baking soda" onClick={()=>{place('bowl');speak('stage-scoop');}}><ArrowDownToLine/></button>}
        {state.held&&state.target!=='crater'&&<button data-action-control className="v1-target v1-crater-target" style={{left:anchors.crater.x,top:anchors.crater.y}} aria-label="Đưa dụng cụ đến miệng núi lửa" onClick={()=>{place('crater');speak('stage-pour');}}><ArrowDownToLine/></button>}
        <div className="v1-dock" data-action-control aria-label="Khay dụng cụ">
          <button className="v1-tool" aria-label="Lấy thìa" aria-pressed={state.held==='spoon'} onClick={()=>pick('spoon')}><SpoonPicture/><span>Thìa</span><i><b style={{width:`${state.spoonGrams/4*100}%`}}/></i></button>
          <button className="v1-tool" aria-label="Lấy cốc giấm" aria-pressed={state.held==='vinegar'} onClick={()=>pick('vinegar')}><MaterialArt kind="vinegar"/><span>Giấm</span><i><b style={{width:`${state.vinegarMl/60*100}%`}}/></i></button>
          {state.held&&<div className="v1-held-actions"><div className="v1-destinations">{state.held==='spoon'&&<button title="Đưa thìa đến bát bột" aria-label="Đưa thìa đến bát baking soda" onClick={()=>place('bowl')}><BowlPicture/></button>}<button title="Đưa dụng cụ đến miệng núi" aria-label="Đưa dụng cụ đến miệng núi lửa" onClick={()=>place('crater')}><VolcanoMark/></button></div>
            <button className={`v1-action ${active?'is-active':''}`} disabled={!canScoop&&!canPour} aria-label={active?'Dừng thao tác':canScoop?'Xúc baking soda':'Rót vào núi lửa'} onClick={action}>{active?<Pause/>:canScoop?<SpoonPicture/>:<ArrowDownToLine/>}<span>{active?'Dừng':canScoop?'Xúc':'Rót'}</span></button>
            <div className="v1-meter" role="meter" aria-label="Lượng còn trong dụng cụ" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(quantity*100)}><i style={{height:`${quantity*100}%`}}/></div><button className="v1-put" title="Đặt dụng cụ xuống, giữ lượng còn lại" aria-label="Đặt dụng cụ xuống" onClick={()=>{stop();returnTool(model.current);refresh();}}><Undo2/><span>Đặt xuống</span></button>
          </div>}
        </div><button data-action-control className="v1-home" aria-label="Thử thí nghiệm ở nhà cùng người lớn" onClick={()=>open('home')}><Home/></button>
      </>}
      {help&&role&&<svg className="v1-help" aria-hidden="true"><path d={`M${anchors.spoon.x},${anchors.spoon.y} Q${anchors.bowl.x-60},${anchors.bowl.y-60} ${anchors.bowl.x},${anchors.bowl.y} Q${anchors.bowl.x+90},${anchors.crater.y-80} ${anchors.crater.x},${anchors.crater.y}`} fill="none" stroke="#e7b54b" strokeWidth="5" strokeDasharray="9 10"/><circle cx={anchors.bowl.x} cy={anchors.bowl.y} r="37"/></svg>}
      {audioError&&voice&&<span className="v1-audio-error">Chưa phát được giọng nói. Chạm biểu tượng loa để thử lại.</span>}
      {webglError&&<div className="v1-render-error">Thiết bị chưa mở được cảnh 3D. Hãy bật tăng tốc đồ họa trong trình duyệt rồi tải lại.</div>}
      <span className="v1-sr" role="status" aria-live="polite">{role?words[clip]:''}</span>
    </div>
    {panel&&<div className="v1-modal-backdrop" onClick={()=>setPanel(null)}><section className="v1-modal" role="dialog" aria-modal="true" aria-labelledby="v1-guide-title" onClick={e=>e.stopPropagation()}><button className="v1-close" aria-label="Đóng hướng dẫn" onClick={()=>setPanel(null)}><X/></button><span className="v1-eyebrow">DÀNH CHO NGƯỜI LỚN</span><h2 id="v1-guide-title">Cùng trẻ khám phá</h2><div className="v1-story"><article><SpoonPicture/><div><strong>Trẻ tự xúc</strong><p>Chọn thìa → đưa vào bát → xúc từng chút.</p></div></article><article><MaterialArt kind="vinegar"/><div><strong>Trẻ tự rót</strong><p>Đưa cốc đến miệng núi. Rót, dừng, rồi quan sát.</p></div></article><article><Sparkles/><div><strong>Cùng quan sát</strong><p>“Con thấy gì thay đổi?” Cho trẻ thử lại với lượng khác.</p></div></article></div>
      <p className="v1-objective">Mục tiêu: trẻ tự chọn và chuyển vật liệu, nhận ra bọt xuất hiện khi giấm gặp baking soda. Không cần đọc chữ để hoàn thành lượt chơi.</p>
      <details open={panel==='home'}><summary><Home size={18}/> Thử ở nhà</summary><p>Cần: cốc nhựa mở miệng, khay, thìa, baking soda và giấm ăn. Vỏ núi chỉ để trang trí; màu và nước rửa chén là tùy chọn. Phiên bản này bắt đầu với cốc rỗng, không thêm sẵn màu hay xà phòng.</p><p>Người lớn chuẩn bị, ở cạnh trẻ. Không nếm, không đưa gần mắt, không đậy kín, không đun nóng; rửa tay sau khi chơi.</p></details>
      <details><summary><VolcanoMark/> Giải thích sau khi quan sát</summary><p>Giấm và baking soda tạo khí CO₂; những bong bóng khí làm chất lỏng sủi bọt. Dừng rót không làm phản ứng dừng ngay: vật liệu đã gặp nhau vẫn tiếp tục phản ứng.</p><p>Nút đồng hồ ×½ làm chậm toàn bộ thao tác và phản ứng để dễ quan sát; đây không phải thời gian phản ứng đã được hiệu chuẩn ngoài thực tế.</p><p>Đây là mô hình hóa học tạo bọt. Núi lửa thật liên quan đến magma và khí trong lòng đất; bọt này không phải dung nham. <a href="https://spaceplace.nasa.gov/volcanoes2/en/" target="_blank" rel="noreferrer">Xem giải thích của NASA</a>.</p></details>
      <small>Chưa có thử nghiệm sử dụng trực tiếp với trẻ. Cần quan sát trẻ chơi để kiểm chứng độ dễ hiểu của các biểu tượng.</small><button className="v1-start v1-continue" onClick={()=>{if(!role)start('student');setPanel(null);}}><Play/>Vào khám phá</button>
    </section></div>}
  </section>;
}

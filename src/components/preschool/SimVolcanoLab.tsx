import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, Camera, Check, CircleHelp, Hand, Home, Images, Pause, Play, Rotate3D, RotateCcw, Timer, Undo2, Users, Volume2, VolumeX, X } from 'lucide-react';
import { addColorDrop, advanceStageOne, createStageOne, HeldTool, pickTool, returnTool, scoop, ToolZone } from './volcano/stageOneModel';
import { ClayTool, createClay } from './volcano/clayModel';
import { PlayArt } from './volcano/PlayArt';
import { SceneAnchors, StageOneScene, StageOneSceneHandle } from './volcano/StageOneScene';
import { VolcanoMark } from './volcano/VolcanoMark';
import './volcano/stageOne.css';

const words:Record<string,string>={
  'stage-start':'Con lấy thìa, xúc một chút bột rồi đưa đến miệng núi nhé.',
  'stage-scoop':'Con chạm để xúc. Chạm lần nữa để dừng nhé.',
  'stage-pour':'Đưa dụng cụ đến miệng núi. Con chạm để rót, chạm lần nữa để dừng.',
  'stage-observe':'Con thấy gì trong miệng núi? Con thử dừng rót để nhìn nhé.',
  'stage-retry':'Cốc mới đã sẵn sàng. Con thử lại nhé.',
  clay:'Con chọn đất, rồi chạm hoặc vuốt trên sườn núi. Con có thể đắp thêm, bớt đất hoặc tạo rãnh.',
  color:'Con chạm Nhỏ màu để nhỏ một giọt vào cốc. Con muốn màu nhạt hay đậm?',
};
const clayTools:{id:ClayTool;label:string;hint:string}[]=[
  {id:'add',label:'Đắp',hint:'Chạm để đắp đất'},
  {id:'smooth',label:'Miết',hint:'Vuốt để miết sườn núi'},
  {id:'channel',label:'Tạo rãnh',hint:'Vuốt từ miệng núi xuống'},
  {id:'remove',label:'Bớt đất',hint:'Chạm để bớt đất'},
];
type SavedTrial={image:string;soda:number;vinegar:number;drops:number};

export function SimVolcanoLab(){
  const model=useRef(createStageOne()),scene=useRef<StageOneSceneHandle>(null),scooping=useRef(false),dragging=useRef(false),drawing=useRef(false),hasReacted=useRef(false);
  const undoStack=useRef<number[][]>([]),lastPoint=useRef({x:0,y:0});
  const [role,setRole]=useState<'student'|'teacher'|null>(null),[workspace,setWorkspace]=useState<'build'|'experiment'>('experiment');
  const [voice,setVoice]=useState(false),[clip,setClip]=useState('stage-start'),[tick,setTick]=useState(0);
  const [state,setState]=useState({...model.current}),[panel,setPanel]=useState<'teacher'|'home'|null>(null),[help,setHelp]=useState(false),[audioError,setAudioError]=useState(false),[webglError,setWebglError]=useState(false);
  const [saved,setSaved]=useState<SavedTrial[]>([]),[compare,setCompare]=useState(false),[savedFlash,setSavedFlash]=useState(false);
  const [slow,setSlow]=useState(false),speed=useRef(1);speed.current=slow?.5:1;
  const [anchors,setAnchors]=useState<SceneAnchors>({bowl:{x:200,y:350},crater:{x:500,y:200},spoon:{x:220,y:450},vinegar:{x:800,y:350}});
  const roleRef=useRef(role);roleRef.current=role;
  const refresh=()=>setState({...model.current});
  const speak=(key:string)=>{setClip(key);setTick(n=>n+1);};
  const stop=()=>{scooping.current=false;dragging.current=false;drawing.current=false;model.current.pouring=false;};
  useEffect(()=>{
    if(!voice||!role)return;
    let active=true;const audio=new Audio(`/audio/vi/volcano/${clip}.mp3`);audio.play().then(()=>{if(active)setAudioError(false);}).catch(()=>{if(active)setAudioError(true);});return()=>{active=false;audio.pause();};
  },[clip,tick,voice,role]);
  useEffect(()=>{let id=0,last=performance.now(),update=0;const frame=(now:number)=>{
    const dt=Math.min((now-last)/1000,.05)*speed.current;last=now;const m=model.current;
    if(roleRef.current){
      if(scooping.current)scoop(m,dt);m.tilt=Math.max(0,Math.min(1,m.tilt+(m.pouring?dt*3.8:-dt*5)));advanceStageOne(m,dt);
      if(m.spoonGrams>=3.995||m.sodaStockGrams<.001)scooping.current=false;
      if(m.pouring&&((m.held==='spoon'&&m.spoonGrams<.001)||(m.held==='vinegar'&&m.vinegarMl<.001)))m.pouring=false;
      if(m.reaction.reacted&&!hasReacted.current){hasReacted.current=true;speak('stage-observe');}
    }
    if(now-update>110){refresh();update=now;}id=requestAnimationFrame(frame);
  };id=requestAnimationFrame(frame);return()=>cancelAnimationFrame(id);},[]);
  useEffect(()=>{if(!help)return;const t=setTimeout(()=>setHelp(false),7000);return()=>clearTimeout(t);},[help]);
  useEffect(()=>{if(!savedFlash)return;const t=setTimeout(()=>setSavedFlash(false),1600);return()=>clearTimeout(t);},[savedFlash]);
  useEffect(()=>{
    const up=()=>{dragging.current=false;drawing.current=false;};
    const blur=()=>{stop();refresh();};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){stop();returnTool(model.current);model.current.clayTool=null;setPanel(null);refresh();}};
    window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('blur',blur);window.addEventListener('keydown',key);
    return()=>{window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('blur',blur);window.removeEventListener('keydown',key);};
  },[]);
  const pick=(tool:HeldTool)=>{
    stop();pickTool(model.current,tool);model.current.clayTool=null;scene.current?.pick(tool);
    const zone=tool==='spoon'&&model.current.spoonGrams<.01?'bowl':'crater';model.current.target=zone;scene.current?.place(zone);refresh();
    speak(tool==='color'?'color':tool==='spoon'?'stage-scoop':'stage-pour');
  };
  const place=(zone:ToolZone)=>{if(!model.current.held)return;stop();model.current.target=zone;scene.current?.place(zone);refresh();};
  const action=()=>{const m=model.current;
    if(m.held==='color'){addColorDrop(m);}
    else if(m.held==='spoon'&&m.target==='bowl'){scooping.current=!scooping.current;m.pouring=false;}
    else if(m.held&&m.target==='crater'){scooping.current=false;m.pouring=!m.pouring;}
    refresh();
  };
  const switchWorkspace=(next:'build'|'experiment')=>{stop();returnTool(model.current);model.current.clayTool=next==='build'?'add':null;setWorkspace(next);setCompare(false);refresh();if(next==='build')speak('clay');};
  const reset=()=>{stop();const clay=model.current.clay,tool=model.current.clayTool;model.current=createStageOne();model.current.clay=clay;model.current.clayTool=tool;hasReacted.current=false;refresh();speak('stage-retry');};
  const start=(mode:'student'|'teacher',next:'build'|'experiment'='experiment')=>{setRole(mode);setVoice(mode==='student');switchWorkspace(next);if(next==='experiment')speak('stage-start');if(mode==='teacher')setPanel('teacher');};
  const open=(which:'teacher'|'home')=>{stop();setPanel(which);refresh();};
  const undo=()=>{const previous=undoStack.current.pop();if(previous){model.current.clay.offsets=previous;model.current.clay.revision++;refresh();}};
  const save=()=>{stop();returnTool(model.current);model.current.clayTool=null;const image=scene.current?.capture();if(!image)return;
    setSaved(items=>[...items.slice(-2),{image,soda:model.current.transferredSoda,vinegar:model.current.transferredVinegar,drops:model.current.colorDrops}]);setSavedFlash(true);refresh();};
  const currentTool=clayTools.find(t=>t.id===state.clayTool);
  const canScoop=state.held==='spoon'&&state.target==='bowl',canPour=(state.held==='spoon'||state.held==='vinegar')&&state.target==='crater',canDrop=state.held==='color'&&state.target==='crater'&&state.colorStock>0;
  const active=state.pouring||scooping.current;
  const quantity=state.held==='spoon'?state.spoonGrams/4:state.held==='color'?state.colorStock/12:state.vinegarMl/60;
  const hint=workspace==='build'?(currentTool?.hint||'Kéo để xoay ngọn núi'):state.held==='color'?'Một giọt hay nhiều giọt?':canScoop?(state.spoonGrams>3.99?'Thìa đầy · đưa đến miệng cốc':'Xúc một chút, rồi thử nhé'):state.held?(active?'Con có thể dừng để nhìn':'Rót từng chút, rồi quan sát'):state.reaction.reacted?'Nước đã đi phía nào?':'Con muốn thử vật liệu nào?';
  return <section className={`v1-shell ${role?'is-playing':''}`} aria-label="Núi lửa của con">
    <header className="v1-header"><div className="v1-brand"><VolcanoMark/><div><strong>Núi lửa của con</strong><span>XƯỞNG KHÁM PHÁ</span></div></div><nav aria-label="Điều khiển thí nghiệm">
      {role&&<button title="Màn hình bắt đầu" aria-label="Về màn hình bắt đầu" onClick={()=>{stop();returnTool(model.current);model.current.clayTool=null;setRole(null);setPanel(null);refresh();}}><ArrowLeft/></button>}
      <button title={voice?'Tắt giọng nói':'Bật giọng nói'} aria-label={voice?'Tắt giọng nói':'Bật giọng nói'} aria-pressed={voice} onClick={()=>setVoice(v=>!v)}>{voice?<Volume2/>:<VolumeX/>}</button>
      <button title="Gợi ý thao tác" aria-label="Xem gợi ý thao tác" aria-pressed={help} onClick={()=>{setHelp(v=>!v);speak(workspace==='build'?'clay':state.held==='color'?'color':'stage-start');}}><CircleHelp/></button>
      <button className="v1-teacher-button" aria-label="Góc giáo viên và phụ huynh" onClick={()=>open('teacher')}><Users/><span>Cùng trẻ</span></button>
    </nav></header>
    <div className="v1-stage" onPointerMove={e=>{
      if(drawing.current&&model.current.clayTool){if(Math.hypot(e.clientX-lastPoint.current.x,e.clientY-lastPoint.current.y)<7)return;lastPoint.current={x:e.clientX,y:e.clientY};scene.current?.sculpt(e.clientX,e.clientY,model.current.clayTool);refresh();return;}
      if(!dragging.current||!model.current.held)return;stop();dragging.current=true;model.current.target=scene.current?.aim(e.clientX,e.clientY)||'tray';refresh();
    }} onPointerDown={e=>{
      if(!role||panel||(e.target as HTMLElement).closest('[data-action-control]'))return;
      if(model.current.clayTool){const before=model.current.clay.offsets.slice();if(scene.current?.sculpt(e.clientX,e.clientY,model.current.clayTool)){undoStack.current.push(before);if(undoStack.current.length>20)undoStack.current.shift();drawing.current=true;lastPoint.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);refresh();}return;}
      if(!model.current.held)return;stop();model.current.target=scene.current?.aim(e.clientX,e.clientY)||'tray';dragging.current=true;e.currentTarget.setPointerCapture(e.pointerId);refresh();
    }}>
      <img className="v1-backdrop" src="/assets/volcano/classroom-table-extended-v2.webp" alt=""/>
      <StageOneScene ref={scene} read={()=>model.current} scooping={()=>scooping.current} timeScale={()=>speed.current} onAnchors={setAnchors} locked={!role||!!panel} onUnavailable={()=>setWebglError(true)}/>
      {!role?<><div className="v1-intro"><span>TỰ TAY TẠO · TÒ MÒ THỬ</span><h2>Ngọn núi của con.<br/><em>Nước sẽ đi đâu?</em></h2><p>Đắp núi · Nhỏ màu · Quan sát</p></div><div className="v1-welcome-actions" data-action-control><button className="v1-start" onClick={()=>start('student','build')}><PlayArt kind="clay"/>Nặn núi<ArrowRight/></button><button className="v1-adult" onClick={()=>start('student')}><Play/>Thử ngay</button></div><small className="v1-model-note">Mô hình giấm & baking soda</small></>:<>
        <div className="v1-scene-top" data-action-control><span className="v1-live"><Hand/><span>{hint}</span></span><div>
          <button title="Lưu hình và cách pha" aria-label="Lưu hình và cách pha" onClick={save}>{savedFlash?<Check/>:<Camera/>}</button>
          <button title="So sánh những lần thử" aria-label="So sánh những lần thử" aria-pressed={compare} disabled={!saved.length} onClick={()=>setCompare(v=>!v)}><Images/>{saved.length>0&&<small>{saved.length}</small>}</button>
          <button className="v1-speed" title="Xem chậm" aria-label="Xem chậm phản ứng" aria-pressed={slow} onClick={()=>setSlow(v=>!v)}><Timer/><span>{slow?'×½':'×1'}</span></button>
          <button title="Góc nhìn ban đầu" aria-label="Đưa góc nhìn về ban đầu" onClick={()=>scene.current?.home()}><Rotate3D/></button>
        </div></div>
        {compare&&<div className="v1-comparisons" data-action-control><button className="v1-comparison-close" aria-label="Đóng so sánh" onClick={()=>setCompare(false)}><X/></button>{saved.map((trial,i)=><figure key={i}><img src={trial.image} alt={`Mẫu đã lưu ${i+1}`}/><figcaption><strong>Lần {i+1}</strong><span>{trial.soda.toFixed(1)} g bột · {Math.round(trial.vinegar)} ml giấm · {trial.drops} giọt</span></figcaption></figure>)}</div>}
        {workspace==='experiment'&&state.held==='spoon'&&state.target!=='bowl'&&<button data-action-control className="v1-target" style={{left:anchors.bowl.x,top:anchors.bowl.y}} aria-label="Đưa thìa đến bát baking soda" onClick={()=>place('bowl')}><PlayArt kind="bowl"/></button>}
        {workspace==='experiment'&&state.held&&state.target!=='crater'&&<button data-action-control className="v1-target v1-crater-target" style={{left:anchors.crater.x,top:anchors.crater.y}} aria-label="Đưa dụng cụ đến miệng cốc" onClick={()=>place('crater')}><ArrowDownToLine/></button>}
        <div className="v1-workbench" data-action-control>
          <div className="v1-workbench-top"><div className="v1-tabs" aria-label="Chọn hoạt động"><button aria-pressed={workspace==='build'} onClick={()=>switchWorkspace('build')}><PlayArt kind="clay"/><span>Nặn núi</span></button><button aria-pressed={workspace==='experiment'} onClick={()=>switchWorkspace('experiment')}><PlayArt kind="color"/><span>Thử</span></button></div><button className="v1-new-cup" title="Cốc mới, giữ ngọn núi đã nặn" aria-label="Cốc mới, giữ ngọn núi đã nặn" onClick={reset}><RotateCcw/><span>Cốc mới</span></button></div>
          <div className="v1-dock" aria-label={workspace==='build'?'Khay đất và công cụ nặn':'Khay dụng cụ thí nghiệm'}>
            {workspace==='build'?<><div className="v1-tools">{clayTools.map(tool=><button key={tool.id} className="v1-tool" aria-label={tool.label} aria-pressed={state.clayTool===tool.id} onClick={()=>{stop();model.current.clayTool=tool.id;refresh();}}><PlayArt kind={tool.id}/><span>{tool.label}</span></button>)}</div><div className="v1-build-actions"><button className="v1-put" aria-label="Hoàn tác nét nặn" disabled={!undoStack.current.length} onClick={undo}><Undo2/><span>Hoàn tác</span></button><button className={`v1-put ${!state.clayTool?'is-selected':''}`} aria-label="Xoay núi" aria-pressed={!state.clayTool} onClick={()=>{model.current.clayTool=null;refresh();}}><Rotate3D/><span>Xoay núi</span></button><button className="v1-action v1-try" onClick={()=>switchWorkspace('experiment')}><Play/><span>Thử thôi</span></button></div></>:
            <><div className="v1-tools"><button className="v1-tool" aria-label="Lấy thìa" aria-pressed={state.held==='spoon'} onClick={()=>pick('spoon')}><PlayArt kind="spoon"/><span>Bột</span><i><b style={{width:`${state.spoonGrams/4*100}%`}}/></i></button><button className="v1-tool" aria-label="Lấy cốc giấm" aria-pressed={state.held==='vinegar'} onClick={()=>pick('vinegar')}><PlayArt kind="vinegar"/><span>Giấm</span><i><b style={{width:`${state.vinegarMl/60*100}%`}}/></i></button><button className="v1-tool" aria-label="Lấy ống nhỏ phẩm màu" aria-pressed={state.held==='color'} onClick={()=>pick('color')}><PlayArt kind="color"/><span>Màu đỏ</span><i><b style={{width:`${state.colorStock/12*100}%`}}/></i></button></div>
            {state.held?<div className="v1-held-actions"><div className="v1-destinations">{state.held==='spoon'&&<button title="Đến bát bột" aria-label="Đưa thìa đến bát baking soda" onClick={()=>place('bowl')}><PlayArt kind="bowl"/></button>}<button title="Đến miệng cốc" aria-label="Đưa dụng cụ đến miệng cốc" onClick={()=>place('crater')}><PlayArt kind="cup"/></button></div><button className={`v1-action ${active?'is-active':''}`} disabled={(!canScoop&&!canPour&&!canDrop)||(canScoop&&state.spoonGrams>=4)||(canPour&&quantity<.001)} aria-label={active?'Dừng thao tác':state.held==='color'?'Nhỏ một giọt màu':canScoop?'Xúc baking soda':'Rót vào núi lửa'} onClick={action}>{active?<Pause/>:canDrop?<PlayArt kind="color"/>:canScoop?<PlayArt kind="spoon"/>:<ArrowDownToLine/>}<span>{active?'Dừng':state.held==='color'?'Nhỏ màu':canScoop?'Xúc':'Rót'}</span></button><div className="v1-meter" role="meter" aria-label="Lượng còn trong dụng cụ" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(quantity*100)}><i style={{height:`${quantity*100}%`}}/></div><button className="v1-put" aria-label="Đặt dụng cụ xuống" onClick={()=>{stop();returnTool(model.current);refresh();}}><Undo2/><span>Đặt xuống</span></button></div>:<div className="v1-idle"><ArrowLeft/><span>Chọn một dụng cụ</span></div>}</>}
          </div>
        </div>
        <button data-action-control className="v1-home" aria-label="Thử thí nghiệm ở nhà cùng người lớn" onClick={()=>open('home')}><Home/></button>
        {savedFlash&&<span className="v1-saved-toast" role="status"><Check/>Đã giữ hình và cách pha</span>}
      </>}
      {help&&role&&<div className="v1-help-card" data-action-control><PlayArt kind={workspace==='build'?(state.clayTool||'clay'):state.held||'spoon'}/><strong>{hint}</strong><span>{workspace==='build'?'Chạm hoặc vuốt trên đất. Chọn Xoay núi để xem mặt khác.':'Chọn dụng cụ → chọn vị trí → tự xúc, nhỏ hoặc rót.'}</span></div>}
      {audioError&&voice&&<button className="v1-audio-error" data-action-control onClick={()=>{setVoice(false);setAudioError(false);}}>Chưa có giọng Việt cho gợi ý này · tắt loa</button>}
      {webglError&&<div className="v1-render-error">Thiết bị chưa mở được cảnh 3D. Hãy bật tăng tốc đồ họa rồi tải lại.</div>}
      <span className="v1-sr" role="status" aria-live="polite">{role?words[clip]:''}</span>
    </div>
    {panel&&<div className="v1-modal-backdrop" onClick={()=>setPanel(null)}><section className="v1-modal" role="dialog" aria-modal="true" aria-labelledby="v1-guide-title" onClick={e=>e.stopPropagation()}><button className="v1-close" aria-label="Đóng hướng dẫn" onClick={()=>setPanel(null)}><X/></button><span className="v1-eyebrow">DÀNH CHO NGƯỜI LỚN</span><h2 id="v1-guide-title">Cùng trẻ khám phá</h2><div className="v1-story"><article><PlayArt kind="channel"/><strong>Tạo một đường nước</strong></article><article><PlayArt kind="color"/><strong>Tự chọn lượng màu</strong></article><article><PlayArt kind="cup"/><strong>Thử, sửa, rồi so sánh</strong></article></div>
      <p className="v1-objective">Trẻ nhận ra giấm gặp baking soda tạo bọt; quan sát hình sườn núi và rãnh ảnh hưởng đường nước chảy. Gợi hỏi: “Con muốn đổi điều gì ở lần sau?”</p>
      <details open={panel==='home'}><summary><Home/> Thử ở nhà</summary><p>Cốc nhựa mở, khay, thìa, baking soda và giấm ăn. Đất nặn và phẩm màu thực phẩm là tùy chọn. Đắp quanh phía ngoài cốc, giữ miệng mở. Mô phỏng không thêm sẵn phẩm màu hay nước rửa chén.</p><p>Người lớn chuẩn bị và ở cạnh trẻ. Không nếm, không đưa gần mắt, không đậy kín, không đun nóng; rửa tay sau khi chơi. Nặn trên màn hình gợi ý cách làm; hãy cho trẻ trải nghiệm đất nặn thật.</p></details>
      <details><summary><Images/> Gợi ý so sánh</summary><p>Lưu hình bằng nút máy ảnh. Chọn Cốc mới để giữ ngọn núi và tự pha lượt khác. Muốn so đường chảy, dùng lượng bột và giấm tương đương rồi sửa một rãnh. Miết làm đều đất; Tạo rãnh cần vuốt liên tục từ gần miệng xuống sườn.</p><button className="v1-adult" onClick={()=>{undoStack.current.push(model.current.clay.offsets.slice());model.current.clay=createClay();refresh();}}>Về dáng núi ban đầu</button></details>
      <details><summary><VolcanoMark/> Giải thích sau quan sát</summary><p>Giấm và baking soda tạo khí CO₂. Phẩm màu chỉ đổi màu; không tăng khí. Vật liệu đã gặp nhau tiếp tục phản ứng sau khi dừng rót. Có lượt chỉ sủi trong cốc mà chưa tràn.</p><p>Đỏ trong cốc là nước có phẩm màu, không phải dung nham nóng. Đường nước và bọt là mô hình gần đúng; không dùng để dự đoán thời gian hoặc phạm vi núi lửa thật. Nút ×½ làm chậm để quan sát.</p><a href="https://www.acs.org/content/dam/acsorg/education/resources/k-8/science-activities/planetearth/land/volcano.pdf" target="_blank" rel="noreferrer">Hoạt động núi lửa của ACS</a></details>
      <button className="v1-start v1-continue" onClick={()=>{if(!role)start('student');setPanel(null);}}><Play/>Vào khám phá</button>
    </section></div>}
  </section>;
}

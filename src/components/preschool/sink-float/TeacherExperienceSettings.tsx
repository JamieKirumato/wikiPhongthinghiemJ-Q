import {useEffect,useRef,useState} from 'react';
import {INTRO_GUIDE} from './introGuide';
import {ExperienceSettings,INTRO_ACTIONS,INTRO_LABELS,NarrationRecord,createNarration,defaultIntroText,readNarration,saveExperience,writeNarration} from './teacherExperience';
export function TeacherExperienceSettings({settings,onChange,onClose,onPreview,voiceEnabled,onVoiceChange}:{settings:ExperienceSettings;onChange:(value:ExperienceSettings)=>void;onClose:()=>void;onPreview:()=>void;voiceEnabled:boolean;onVoiceChange:(enabled:boolean)=>void}){
  const [draft,setDraft]=useState<Record<string,string>>(()=>Object.fromEntries(INTRO_GUIDE.map(s=>[s.audio,defaultIntroText(s.audio)])));
  const [saved,setSaved]=useState<NarrationRecord>({}),[busy,setBusy]=useState(false),[status,setStatus]=useState('');
  const [segment,setSegment]=useState(INTRO_GUIDE[0].audio);
  const abort=useRef<AbortController|null>(null),audio=useRef<HTMLAudioElement|null>(null),urls=useRef<string[]>([]),alive=useRef(true);
  useEffect(()=>{alive.current=true;void readNarration().then(record=>{if(alive.current){setSaved(record);setDraft(Object.fromEntries(INTRO_GUIDE.map(s=>[s.audio,record[s.audio]?.text||defaultIntroText(s.audio)])));}}).catch(()=>setStatus('Chưa đọc được kịch bản đã lưu.'));return()=>{alive.current=false;abort.current?.abort();audio.current?.pause();urls.current.forEach(URL.revokeObjectURL);};},[]);
  const change=(next:ExperienceSettings)=>{onChange(next);try{saveExperience(next);setStatus('Đã lưu tùy chỉnh cho các lần vào trang sau.');}catch{setStatus('Trình duyệt chưa lưu được tùy chỉnh; chỉ áp dụng cho lần chơi này.');}};
  const preview=async(key:string)=>{
    if(!draft[key]?.trim()){setStatus('Hãy nhập lời dẫn cho thao tác này.');return;}
    setBusy(true);abort.current=new AbortController();audio.current?.pause();
    try{
      let src=`/audio/vi/${key}.mp3`;
      if(draft[key].trim()!==defaultIntroText(key)){
        const blob=saved[key]?.text===draft[key].trim()?saved[key].audio:await createNarration(draft[key].trim(),abort.current.signal);
        src=URL.createObjectURL(blob);urls.current.push(src);
      }
      if(!alive.current)return;
      audio.current=new Audio(src);await audio.current.play();setStatus('Đang đọc thử đoạn lời dẫn này.');
    }catch(error){if(alive.current)setStatus(error instanceof Error?error.message:'Chưa đọc được lời dẫn.');}
    finally{if(alive.current)setBusy(false);}
  };
  const save=async()=>{
    if(INTRO_GUIDE.some(s=>!draft[s.audio]?.trim())){setStatus('Cần có lời dẫn ở mỗi thao tác; có thể dùng lời mặc định.');return;}
    setBusy(true);abort.current=new AbortController();audio.current?.pause();
    try{
      const next:NarrationRecord={};
      for(let i=0;i<INTRO_GUIDE.length;i++){
        const key=INTRO_GUIDE[i].audio,text=draft[key].trim();
        if(text===defaultIntroText(key))continue;
        setStatus(`Đang tạo giọng Việt: ${INTRO_LABELS[i]}…`);
        next[key]={text,audio:saved[key]?.text===text?saved[key].audio:await createNarration(text,abort.current.signal)};
      }
      if(!alive.current)return;
      await writeNarration(next);setSaved(next);setStatus('Đã lưu lời dẫn và giọng Việt. Lần hướng dẫn tiếp theo sẽ đọc kịch bản này.');
    }catch(error){if(alive.current)setStatus(error instanceof Error?error.message:'Chưa lưu được kịch bản. Bản cũ vẫn được giữ nguyên.');}
    finally{if(alive.current)setBusy(false);}
  };
  return <div role="dialog" aria-modal="true" aria-label="Hướng dẫn và âm thanh cho giáo viên" className="absolute inset-0 z-[120] bg-slate-900/30 flex justify-end">
    <section className="teacher-audio-settings w-full max-w-lg h-full overflow-y-auto bg-white p-4 space-y-4 shadow-xl" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 className="font-bold text-lg">Âm thanh và lời dẫn</h2><button autoFocus aria-label="Đóng cài đặt giáo viên" onClick={onClose} className="min-w-[48px] min-h-[48px] rounded-xl border">✕</button></div>
      <p className="text-sm text-slate-600">Cô chọn cách hướng dẫn lớp. Bản đọc tùy chỉnh vẫn được giữ khi tắt giọng.</p>
      <div className="teacher-choice-row"><button aria-pressed={!voiceEnabled} onClick={()=>onVoiceChange(false)} className="min-h-[48px] rounded-xl border px-3">Cô tự hướng dẫn</button><button aria-pressed={voiceEnabled} onClick={()=>onVoiceChange(true)} className="min-h-[48px] rounded-xl border px-3">Bật giọng hướng dẫn</button></div>
      <label className="block font-semibold">Âm lượng tiếng nước và va chạm: {settings.effectsVolume}%<input aria-label="Âm lượng tiếng nước và va chạm" type="range" min="0" max="100" step="5" value={settings.effectsVolume} onChange={e=>change({...settings,effectsVolume:Number(e.target.value)})} className="block w-full mt-3"/></label>
      <p className="text-sm text-slate-600">0% tắt tiếng hiệu ứng; 100% là mức tối đa trong trò chơi.</p>
      <details className="rounded-2xl border p-3"><summary className="min-h-[44px] cursor-pointer font-bold">Mẫu thao tác và kịch bản đọc</summary>
      <details className="rounded-xl border p-2 mb-3"><summary className="min-h-[44px] cursor-pointer font-semibold text-sm">Chọn thao tác làm mẫu ({settings.introActions.length}/8)</summary>
      <fieldset className="space-y-2 rounded-2xl border border-sky-200 p-3">
        <legend className="font-bold">Chọn thao tác trẻ sẽ được hướng dẫn</legend>
        <p className="text-sm text-slate-600">Đã chọn {settings.introActions.length}/8 thao tác. Lời chào và lời kết được giữ khi có thao tác; bỏ chọn tất cả thì vào chơi ngay.</p>
        {INTRO_GUIDE.map((step,i)=>INTRO_ACTIONS.includes(step.action)&&<label key={step.action} className="flex items-center gap-3 min-h-[44px]"><input type="checkbox" checked={settings.introActions.includes(step.action)} onChange={e=>change({...settings,introActions:e.target.checked?[...settings.introActions,step.action]:settings.introActions.filter(a=>a!==step.action)})}/>{INTRO_LABELS[i]}</label>)}
        <button onClick={()=>change({...settings,introActions:['pick']})} className="min-h-[44px] rounded-xl border px-3 mr-2">Chỉ cầm và thả</button>
        <button onClick={()=>change({...settings,introActions:[...INTRO_ACTIONS]})} className="min-h-[44px] rounded-xl border px-3">Chọn tất cả thao tác</button>
      </fieldset>
      </details>
      <button disabled={busy||!settings.introActions.length} onClick={onPreview} className="min-h-[48px] w-full rounded-xl bg-sky-100 font-bold">Xem lại hướng dẫn với kịch bản đã lưu</button>
      <h3 className="font-bold mt-4">Lời dẫn của giáo viên</h3>
      <p className="text-sm text-slate-600">Soạn lời theo từng thao tác để bàn tay minh họa đúng phần đang đọc. Khi tạo giọng hoặc nghe thử lời mới, nội dung được gửi tới dịch vụ đọc tiếng Việt của Google và cần Internet. Bản đọc lưu trên trình duyệt này.</p>
      <fieldset disabled={busy} className="space-y-4">
        <label className="block font-semibold">Chọn đoạn lời dẫn<select aria-label="Chọn đoạn lời dẫn" value={segment} onChange={e=>setSegment(e.target.value)} className="block w-full min-h-[48px] border rounded-xl px-2 mt-2">{INTRO_GUIDE.map((step,i)=><option key={step.audio} value={step.audio}>{i+1}. {INTRO_LABELS[i]}</option>)}</select></label>
        {INTRO_GUIDE.map((step,i)=>step.audio===segment&&<div key={step.audio} className="p-3 rounded-xl border border-sky-100 space-y-2">
          <label className="block font-semibold text-sm" htmlFor={`teacher-${step.audio}`}>{i+1}. {INTRO_LABELS[i]}</label>
          <textarea id={`teacher-${step.audio}`} maxLength={600} rows={3} value={draft[step.audio]||''} onChange={e=>setDraft(prev=>({...prev,[step.audio]:e.target.value}))} className="w-full rounded-lg border p-2 text-sm"/>
          <button onClick={()=>void preview(step.audio)} className="min-h-[44px] rounded-lg border px-3 text-sm">Nghe thử: {INTRO_LABELS[i]}</button>
        </div>)}
        <button onClick={()=>void save()} className="min-h-[52px] w-full rounded-xl bg-sky-600 text-white font-bold">Lưu kịch bản và tạo giọng Việt</button>
        <button onClick={()=>{audio.current?.pause();void writeNarration({}).then(()=>{setSaved({});setDraft(Object.fromEntries(INTRO_GUIDE.map(s=>[s.audio,defaultIntroText(s.audio)])));setStatus('Đã khôi phục lời dẫn mặc định.');}).catch(()=>setStatus('Chưa khôi phục được; hãy thử lại.'));}} className="min-h-[48px] w-full rounded-xl border">Khôi phục lời dẫn mặc định</button>
      </fieldset>
      </details>
      <p role="status" className="text-sm text-sky-800">{busy?'Đang xử lý… ':''}{status}</p>
    </section>
  </div>;
}

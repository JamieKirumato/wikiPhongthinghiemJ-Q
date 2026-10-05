import {useEffect,useRef,useState} from 'react';
import {INTRO_GUIDE} from './introGuide';
import {ExperienceSettings,INTRO_LABELS,NarrationRecord,createNarration,defaultIntroText,readNarration,saveExperience,writeNarration} from './teacherExperience';
export function TeacherExperienceSettings({settings,onChange,onClose,onPreview}:{settings:ExperienceSettings;onChange:(value:ExperienceSettings)=>void;onClose:()=>void;onPreview:()=>void}){
  const [draft,setDraft]=useState<Record<string,string>>(()=>Object.fromEntries(INTRO_GUIDE.map(s=>[s.audio,defaultIntroText(s.audio)])));
  const [saved,setSaved]=useState<NarrationRecord>({}),[busy,setBusy]=useState(false),[status,setStatus]=useState('');
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
    <section className="w-full max-w-lg h-full overflow-y-auto bg-white p-4 space-y-4 shadow-xl" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 className="font-bold text-lg">Hướng dẫn và âm thanh</h2><button autoFocus aria-label="Đóng cài đặt giáo viên" onClick={onClose} className="min-w-[48px] min-h-[48px] rounded-xl border">✕</button></div>
      <label className="flex gap-3 items-center min-h-[48px]"><input type="checkbox" checked={settings.introEnabled} onChange={e=>change({...settings,introEnabled:e.target.checked})}/>Tự bật hướng dẫn một lần mỗi lần vào thí nghiệm</label>
      <p className="text-sm text-slate-600">Khi bật, trẻ nghe và xem hết thao tác mẫu rồi mới chơi tự do. Giáo viên có thể tắt để vào chơi ngay.</p>
      <label className="block font-semibold">Âm lượng tiếng nước và va chạm: {settings.effectsVolume}%<input aria-label="Âm lượng tiếng nước và va chạm" type="range" min="0" max="100" step="5" value={settings.effectsVolume} onChange={e=>change({...settings,effectsVolume:Number(e.target.value)})} className="block w-full mt-3"/></label>
      <p className="text-sm text-slate-600">0% tắt tiếng hiệu ứng; 100% là mức tối đa trong trò chơi. Giọng hướng dẫn có âm lượng riêng.</p>
      <button disabled={busy} onClick={onPreview} className="min-h-[48px] w-full rounded-xl bg-sky-100 font-bold">Xem lại hướng dẫn với kịch bản đã lưu</button>
      <h3 className="font-bold">Lời dẫn của giáo viên</h3>
      <p className="text-sm text-slate-600">Soạn lời theo từng thao tác để bàn tay minh họa đúng phần đang đọc. Khi tạo giọng hoặc nghe thử lời mới, nội dung được gửi tới dịch vụ đọc tiếng Việt của Google và cần Internet. Bản đọc lưu trên trình duyệt này.</p>
      <fieldset disabled={busy} className="space-y-4">
        {INTRO_GUIDE.map((step,i)=><div key={step.audio} className="p-3 rounded-xl border border-sky-100 space-y-2">
          <label className="block font-semibold text-sm" htmlFor={`teacher-${step.audio}`}>{i+1}. {INTRO_LABELS[i]}</label>
          <textarea id={`teacher-${step.audio}`} maxLength={600} rows={3} value={draft[step.audio]||''} onChange={e=>setDraft(prev=>({...prev,[step.audio]:e.target.value}))} className="w-full rounded-lg border p-2 text-sm"/>
          <button onClick={()=>void preview(step.audio)} className="min-h-[44px] rounded-lg border px-3 text-sm">Nghe thử: {INTRO_LABELS[i]}</button>
        </div>)}
        <button onClick={()=>void save()} className="min-h-[52px] w-full rounded-xl bg-sky-600 text-white font-bold">Lưu kịch bản và tạo giọng Việt</button>
        <button onClick={()=>{audio.current?.pause();void writeNarration({}).then(()=>{setSaved({});setDraft(Object.fromEntries(INTRO_GUIDE.map(s=>[s.audio,defaultIntroText(s.audio)])));setStatus('Đã khôi phục lời dẫn mặc định.');}).catch(()=>setStatus('Chưa khôi phục được; hãy thử lại.'));}} className="min-h-[48px] w-full rounded-xl border">Khôi phục lời dẫn mặc định</button>
      </fieldset>
      <p role="status" className="text-sm text-sky-800">{busy?'Đang xử lý… ':''}{status}</p>
    </section>
  </div>;
}

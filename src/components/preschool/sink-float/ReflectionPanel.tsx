import {useEffect,useId,useState} from 'react';
import type {TrialRecord} from '../SimSinkOrFloatLab';
import {eggComparison,reflectionObservations} from './reflectionHistory';
import {BookOpen,X} from 'lucide-react';

export function ReflectionPanel({history,onClose,onBoard}:{history:TrialRecord[];onClose:()=>void;onBoard:()=>void}){
  const observations=reflectionObservations(history);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [recalledPosition,setRecalledPosition]=useState<'surface'|'bottom'|null>(null);
  const [revealed,setRevealed]=useState(false);
  const recordId=useId();
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;return()=>previous?.focus();},[]);
  const selected=observations.find(t=>t.id===selectedId);
  const comparison=selected?eggComparison(history,selected.itemId):null;
  return <div className="premium-modal-backdrop">
    <div role="dialog" aria-modal="true" aria-label="Con kể lại điều đã thấy" className="premium-reflection w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4" onKeyDown={event=>{
      if(event.key==='Escape')onClose();
      if(event.key==='Tab'){
        const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')).filter(button=>button.getClientRects().length);
        const first=buttons[0],last=buttons[buttons.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    }}>
      <div className="flex justify-between gap-3"><h3 className="text-xl font-bold flex items-center gap-2"><BookOpen size={24}/> Con vừa thấy điều gì?</h3><button autoFocus aria-label="Đóng phần kể lại" onClick={onClose} className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100"><X size={21} className="mx-auto"/></button></div>
      <p>{observations.length?'Con chỉ vào đồ vật con muốn kể. Con đã thấy vật ở đâu trong nước?':'Con thử thả một đồ vật vào nước rồi mình cùng nhìn lại nhé.'}</p>
      <div className="grid grid-cols-2 gap-3">
        {observations.map(trial=><button key={trial.id} aria-label={`Kể về ${trial.itemName}`} aria-pressed={selectedId===trial.id} onClick={()=>{setSelectedId(trial.id);setRecalledPosition(null);setRevealed(false);}} className={`rounded-2xl border-2 p-3 font-bold ${selectedId===trial.id?'bg-amber-100 border-amber-500':'border-slate-200'}`}>
          {trial.itemImage?<img src={trial.itemImage} alt="" className="w-16 h-16 mx-auto object-contain"/>:<span className="text-5xl">{trial.itemIcon}</span>}
          <span className="block">{trial.itemName}</span>
        </button>)}
      </div>
      {selected&&<section aria-label="Con nhớ vật ở đâu" className="rounded-2xl bg-sky-50 p-3 space-y-3">
        <p className="font-bold">Con đã thấy {selected.itemName.toLowerCase()} ở đâu?</p>
        <p>Con có thể chỉ vào hình hoặc kể bằng lời. Chưa nhớ cũng được.</p>
        <div role="group" aria-label="Vị trí con nhớ" className="relative h-48 rounded-xl border-2 border-sky-300 bg-white overflow-hidden">
          <div aria-hidden="true" className="absolute inset-x-0 top-14 bottom-0 bg-sky-100 border-t-4 border-sky-400"/>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-4 bg-amber-100"/>
          <button aria-pressed={recalledPosition==='surface'} onClick={()=>setRecalledPosition('surface')} className={`absolute top-7 left-3 right-3 min-h-[48px] rounded-xl border-2 px-3 font-bold ${recalledPosition==='surface'?'bg-amber-200 border-amber-500':'bg-white/90 border-sky-200'}`}>Ở mặt nước</button>
          <button aria-pressed={recalledPosition==='bottom'} onClick={()=>setRecalledPosition('bottom')} className={`absolute bottom-4 left-3 right-3 min-h-[48px] rounded-xl border-2 px-3 font-bold ${recalledPosition==='bottom'?'bg-amber-200 border-amber-500':'bg-white/90 border-sky-200'}`}>Ở dưới đáy</button>
        </div>
        <button aria-expanded={revealed} aria-controls={recordId} onClick={()=>setRevealed(value=>!value)} className="min-h-[48px] w-full rounded-xl bg-sky-200 px-3 font-bold">{revealed?'Ẩn bản ghi':'Xem lần đã thử'}</button>
      </section>}
      {selected&&revealed&&<section id={recordId} aria-label="Bản ghi của mô phỏng" className="rounded-2xl bg-sky-50 p-3 space-y-2">
        <p>Bản ghi gần nhất trên màn hình: <strong>{selected.itemName} {selected.result==='floating'?'nổi ở mặt nước':'chìm xuống đáy'}.</strong></p>
        {comparison?<><p>Cùng quả trứng này, con đã thử hai lần. Con thấy điều gì giống hoặc khác nhau?</p><div className="grid grid-cols-2 gap-3">
          {[{label:'Trước: nước thường',trial:comparison.before},{label:'Sau: thêm muối',trial:comparison.after}].map(({label,trial})=><div key={trial.id} className="rounded-xl bg-white p-2 text-center">
            <p className="font-bold text-sm">{label}</p><svg viewBox="0 0 120 120" className="w-full h-24" aria-hidden="true"><rect x="12" y="12" width="96" height="96" rx="6" fill="#e5faff" stroke="#75ccdc" strokeWidth="3"/><path d="M14 35H106" stroke="#56bbd1" strokeWidth="3"/><ellipse cx="60" cy={trial.result==='floating'?35:90} rx="11" ry="15" fill="#f1dbb8" stroke="#c5a77f"/></svg><p>{trial.result==='floating'?'Đã nổi':'Đã chìm'}</p>
          </div>)}
        </div></>:<p>Con có thể chỉ, kể bằng lời hoặc thử lại để quan sát thêm.</p>}
      </section>}
      {observations.length>0&&<button onClick={onBoard} className="min-h-[48px] w-full rounded-2xl bg-sky-100 font-bold">Xem những lần đã thử</button>}
      <button onClick={onClose} className="min-h-[44px] w-full rounded-2xl bg-amber-300 font-bold">Con muốn thử tiếp</button>
    </div>
  </div>;
}

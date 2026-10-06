import {useState} from 'react';
import type {TrialRecord} from '../SimSinkOrFloatLab';
import {eggComparison,reflectionObservations} from './reflectionHistory';

export function ReflectionPanel({history,onClose,onBoard}:{history:TrialRecord[];onClose:()=>void;onBoard:()=>void}){
  const observations=reflectionObservations(history);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const selected=observations.find(t=>t.id===selectedId);
  const comparison=selected?eggComparison(history,selected.itemId):null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
    <div role="dialog" aria-modal="true" aria-label="Con kể lại điều đã thấy" className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border-4 border-amber-300 p-5 space-y-4">
      <div className="flex justify-between gap-3"><h3 className="text-lg font-black">🤔 Con vừa thấy điều gì?</h3><button autoFocus aria-label="Đóng phần kể lại" onClick={onClose} className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100">✕</button></div>
      <p>{observations.length?'Con chỉ vào đồ vật con muốn kể. Con đã thấy vật ở đâu trong nước?':'Con thử thả một đồ vật vào nước rồi mình cùng nhìn lại nhé.'}</p>
      <div className="grid grid-cols-2 gap-3">
        {observations.map(trial=><button key={trial.id} aria-label={`Kể về ${trial.itemName}`} aria-pressed={selectedId===trial.id} onClick={()=>setSelectedId(trial.id)} className={`rounded-2xl border-2 p-3 font-bold ${selectedId===trial.id?'bg-amber-100 border-amber-500':'border-slate-200'}`}>
          {trial.itemImage?<img src={trial.itemImage} alt="" className="w-16 h-16 mx-auto object-contain"/>:<span className="text-5xl">{trial.itemIcon}</span>}
          <span className="block">{trial.itemName}</span>
        </button>)}
      </div>
      {selected&&<section aria-label="Quan sát đã ghi lại" className="rounded-2xl bg-sky-50 p-3 space-y-2">
        <p>Lần quan sát gần nhất: <strong>{selected.itemName} {selected.result==='floating'?'nổi ở mặt nước':'chìm xuống đáy'}.</strong></p>
        {comparison?<><p>Cùng quả trứng này, con đã thử hai lần. Con thấy điều gì giống hoặc khác nhau?</p><div className="grid grid-cols-2 gap-3">
          {[{label:'Trước: nước ngọt',trial:comparison.before},{label:'Sau: thêm muối',trial:comparison.after}].map(({label,trial})=><div key={trial.id} className="rounded-xl bg-white p-2 text-center">
            <p className="font-bold text-sm">{label}</p><svg viewBox="0 0 120 120" className="w-full h-24" aria-hidden="true"><rect x="12" y="12" width="96" height="96" rx="6" fill="#e5faff" stroke="#75ccdc" strokeWidth="3"/><path d="M14 35H106" stroke="#56bbd1" strokeWidth="3"/><ellipse cx="60" cy={trial.result==='floating'?35:90} rx="11" ry="15" fill="#f1dbb8" stroke="#c5a77f"/></svg><p>{trial.result==='floating'?'Đã nổi':'Đã chìm'}</p>
          </div>)}
        </div></>:<p>Con có thể chỉ, kể bằng lời hoặc thử lại để quan sát thêm.</p>}
      </section>}
      {observations.length>0&&<button onClick={onBoard} className="min-h-[48px] w-full rounded-2xl bg-sky-100 font-bold">📋 Xem những lần đã thử</button>}
      <button onClick={onClose} className="min-h-[44px] w-full rounded-2xl bg-amber-300 font-bold">Con muốn thử tiếp</button>
    </div>
  </div>;
}

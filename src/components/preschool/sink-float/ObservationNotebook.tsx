import {useEffect,useRef} from 'react';
import {ArrowRight,BookOpen,Droplets,RotateCcw,X} from 'lucide-react';
import type {TrialRecord} from '../SimSinkOrFloatLab';
import {eggComparison} from './reflectionHistory';

export function ObservationCard({trial,index}:{trial:TrialRecord;index:number}) {
  const salty=trial.waterDensity>1.00001;
  return <article className="premium-observation-card">
    <div className="premium-observation-caption"><span>Lần {index+1}</span><span><Droplets size={14}/>{salty?'Nước muối':'Nước thường'}</span></div>
    <div className="premium-observation-scene" aria-label={trial.itemName+' '+(trial.result==='floating'?'nổi ở mặt nước':'chìm xuống đáy')}>
      <div className="premium-mini-tank"><div className="premium-mini-water"/><img src={trial.itemImage} alt="" className={trial.result==='floating'?'at-surface':'at-bottom'}/></div>
    </div>
    <div className="premium-observation-result"><strong>{trial.itemName}</strong><span>{trial.result==='floating'?'Đã nổi':'Đã chìm'}</span></div>
    {salty&&<p className="premium-observation-condition">Muối đã tan: {trial.saltAmount} thìa trong mô phỏng</p>}
  </article>;
}

export function ObservationNotebook({history,onClose,onReset}:{history:TrialRecord[];onClose:()=>void;onReset:()=>void}) {
  const close=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;close.current?.focus();return()=>previous?.focus();},[]);
  const eggPair=eggComparison(history);
  return <div className="premium-modal-backdrop" onKeyDown={event=>{
    if(event.key==='Escape')onClose();
    if(event.key==='Tab'){
      const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
      const first=buttons[0],last=buttons[buttons.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  }}>
    <section className="premium-notebook" role="dialog" aria-modal="true" aria-label="Sổ khám phá của con">
      <header><div><span className="premium-kicker">SỔ KHÁM PHÁ</span><h2><BookOpen size={28}/> Con đã quan sát được gì?</h2></div><button ref={close} aria-label="Đóng sổ khám phá" onClick={onClose}><X size={22}/></button></header>
      <div className="premium-notebook-body">
        {history.length===0?<div className="premium-notebook-empty"><BookOpen size={50}/><h3>Khám phá đầu tiên đang chờ con!</h3><p>Thả một đồ vật vào nước, chờ vật ổn định rồi cùng nhìn lại nhé.</p></div>:<>
          <p className="premium-notebook-invitation">Mỗi lần thử là một điều mới. Con chỉ vào hình và kể lại nhé.</p>
          {eggPair&&<section className="premium-comparison-record"><h3>Cùng một quả trứng · Trước và sau</h3><div><ObservationCard trial={eggPair.before} index={history.indexOf(eggPair.before)}/><ObservationCard trial={eggPair.after} index={history.indexOf(eggPair.after)}/></div></section>}
          <div className="premium-observation-grid">{history.slice().reverse().map((trial,i)=><ObservationCard key={trial.id} trial={trial} index={history.length-i-1}/>)}</div>
        </>}
      </div>
      <footer><button onClick={onReset}><RotateCcw size={17}/> Bắt đầu lượt mới</button><button className="premium-primary" onClick={onClose}>Thử tiếp <ArrowRight size={19}/></button></footer>
    </section>
  </div>;
}

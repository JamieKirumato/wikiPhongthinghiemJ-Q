import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
export function RimStirTool({getAnchor,active,highlighted,disabled,progress,hasSalt,onTake,onPut}:{getAnchor?:()=>{x:number;y:number}|null;active:boolean;highlighted:boolean;disabled:boolean;progress:number;hasSalt:boolean;onTake:()=>void;onPut:()=>void}){
  const [anchor,setAnchor]=useState<{x:number;y:number}|null>(null);
  useEffect(()=>{
    if(!getAnchor)return;
    const update=()=>{const p=getAnchor();setAnchor(previous=>p&&previous&&Math.hypot(p.x-previous.x,p.y-previous.y)<.5?previous:p);};
    update();const timer=setInterval(update,100);return()=>clearInterval(timer);
  },[getAnchor]);
  if(!anchor)return null;
  return createPortal(<div data-rim-stir-tool className="fixed z-[90] flex flex-col items-center gap-1" style={{left:anchor.x,top:anchor.y,transform:'translate(-50%,-100%)'}} onPointerDown={e=>e.stopPropagation()}>
    {active&&hasSalt&&<div role="progressbar" aria-label="Muối đang tan" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} className="h-3 w-28 rounded-full bg-white border border-sky-300 overflow-hidden"><div className="h-full bg-cyan-500" style={{width:`${progress}%`}}/></div>}
    <button aria-label={active?'Đặt que khuấy xuống':'Cầm que khuấy'} disabled={disabled} onClick={active?onPut:onTake} className={`min-w-[52px] min-h-[64px] rounded-2xl bg-white/90 border border-amber-300 touch-none ${highlighted&&!active?'ring-4 ring-yellow-300 shadow-[0_0_30px_12px_#fde04788]':''}`}>
      {active?<span aria-hidden="true" className="text-2xl">↩</span>:<svg width="52" height="64" viewBox="0 0 52 64" aria-hidden="true"><path d="M17 54L35 8" stroke="#a77537" strokeWidth="7" strokeLinecap="round"/><path d="M17 53L35 9" stroke="#dfb371" strokeWidth="3" strokeLinecap="round"/></svg>}
    </button>
  </div>,document.body);
}

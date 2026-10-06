import React,{useEffect,useRef,useState} from 'react';
export function FloorMop({disabled,teacher,onActive,onClean}:{disabled:boolean;teacher:boolean;onActive:(active:boolean)=>void;onClean:(x:number,y:number)=>void}){
  const [hand,setHand]=useState<{x:number;y:number}|null>(null),cleanup=useRef<(()=>void)|null>(null);
  const callbacks=useRef({onActive,onClean});callbacks.current={onActive,onClean};
  useEffect(()=>()=>cleanup.current?.(),[]);
  const start=(e:React.PointerEvent)=>{
    if(disabled||e.button!==0||cleanup.current)return;e.preventDefault();callbacks.current.onActive(true);
    const pointer=e.pointerId;
    const move=(event:PointerEvent)=>{if(event.pointerId!==pointer)return;setHand({x:event.clientX,y:event.clientY});callbacks.current.onClean(event.clientX,event.clientY);};
    const stop=(event?:PointerEvent)=>{if(event&&event.pointerId!==pointer)return;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);window.removeEventListener('blur',blur);setHand(null);cleanup.current=null;callbacks.current.onActive(false);};
    const blur=()=>stop();cleanup.current=stop;setHand({x:e.clientX,y:e.clientY});window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);window.addEventListener('blur',blur);
  };
  const icon=<svg viewBox="0 0 80 90" width="65" height="72" aria-hidden="true"><path d="M44 9 L35 63" stroke="#f5ae5b" strokeWidth="8" strokeLinecap="round"/><path d="M14 65 Q37 54 61 65 L68 79 Q39 88 8 79Z" fill="#e9d3ab" stroke="#bf9766" strokeWidth="3"/><path d="M18 69 L15 80 M30 65 L29 83 M43 65 L44 83 M56 69 L60 80" stroke="#fff6db" strokeWidth="4"/></svg>;
  return <><button disabled={disabled} onPointerDown={start} aria-label="Cầm giẻ lau để dọn sàn" className="min-h-[72px] w-full rounded-2xl border border-amber-200 bg-white flex flex-col items-center disabled:opacity-40 touch-none">{icon}{teacher&&<span className="text-sm">Kéo giẻ qua nước và vỏ trứng để dọn</span>}</button>{hand&&<div aria-hidden="true" className="fixed z-50 pointer-events-none" style={{left:hand.x-34,top:hand.y-66}}>{icon}<span className="absolute top-3 right-0 text-3xl">✊</span></div>}</>;
}

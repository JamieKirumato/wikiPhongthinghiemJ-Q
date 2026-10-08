import {WaterStream} from './WaterStream';
import {FlowTarget} from './waterTransfer';
import React,{useEffect,useRef,useState} from 'react';
import { playWaterSwish, unlockImpactAudio } from './impactAudio';
// SVG spout (10,23), scaled to 70 px and rotated around the icon centre.
export function pitcherSpout(x:number,y:number){
  const angle=-65*Math.PI/180,dx=7-35,dy=16.1-35;
  return {x:x+dx*Math.cos(angle)-dy*Math.sin(angle),y:y-30+dx*Math.sin(angle)+dy*Math.cos(angle)};
}
export function pitcherPourPosition(point:{x:number;y:number},target:{x:number;y:number}){
  const spout=pitcherSpout(point.x,point.y);
  return {x:point.x+target.x-spout.x,y:point.y+Math.min(0,target.y-24-spout.y)};
}
export function PitcherIcon(){return <svg viewBox="0 0 100 100" width="70" height="70" aria-hidden="true"><path d="M68 30 C98 25 98 72 68 72" fill="none" stroke="#7bc6e0" strokeWidth="8"/><path d="M22 18 L73 18 L73 80 Q48 95 23 80 L23 37 L10 23 Z" fill="#d8f5fa" stroke="#72bcd5" strokeWidth="3"/><path d="M25 47 L69 47 L69 78 Q47 89 26 78 Z" fill="#92dce9"/><path d="M31 30 L31 70" stroke="white" strokeWidth="5" opacity=".8"/></svg>;}
export function WaterPitcher({disabled,onActive,onAdd,checkMouth,teacher,onFlow,flowRate,getTarget,onSpill}:{disabled:boolean;onActive:(active:boolean)=>void;onAdd:(ml:number)=>number;checkMouth:(x:number,y:number)=>boolean;teacher:boolean;onFlow:(x:number,y:number)=>void;flowRate:number;getTarget:(x:number,y:number)=>FlowTarget|null;onSpill:(x:number,z:number,ml:number)=>void}) {
  const [hand,setHand]=useState<{x:number;y:number;pouring:boolean;target?:FlowTarget}|null>(null);
  const cleanupRef=useRef<(()=>void)|null>(null);
  const callbacks=useRef({onActive,onAdd,checkMouth,onFlow,flowRate,getTarget,onSpill});callbacks.current={onActive,onAdd,checkMouth,onFlow,flowRate,getTarget,onSpill};
  useEffect(()=>()=>cleanupRef.current?.(),[]);
  const start=(event:React.PointerEvent)=>{
    if(disabled||cleanupRef.current||event.button!==0)return;
    event.preventDefault();unlockImpactAudio();callbacks.current.onActive(true);
    let point={x:event.clientX,y:event.clientY},last=performance.now(),frame=0;
    const pointer=event.pointerId;
    let pickupReleased=false;
    setHand({...point,pouring:false});
    const move=(e:PointerEvent)=>{if(e.pointerId===pointer){point={x:e.clientX,y:e.clientY};}};
    const stop=(e?:PointerEvent)=>{
      if(e&&e.pointerId!==pointer)return;
      if(e?.type==='pointerup'&&!pickupReleased){pickupReleased=true;return;}
      cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);window.removeEventListener('blur',blur);window.removeEventListener('keydown',key);
      cleanupRef.current=null;setHand(null);callbacks.current.onActive(false);
    };
    const blur=()=>stop();
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')stop();};
    const tick=(time:number)=>{
      const dt=Math.min(.1,(time-last)/1000);last=time;
      const p=callbacks.current,spout=pitcherSpout(point.x,point.y),candidate=p.getTarget(point.x,point.y);
      const target=candidate&&(candidate.inside||candidate.y>spout.y)?candidate:null,over=target?.inside ?? false;
      const amount=p.flowRate*dt;
      const poured=target?(over?p.onAdd(amount):amount):0;
      if(target&&!over&&poured>0)p.onSpill(target.worldX,target.worldZ,poured);
      setHand({...point,pouring:poured>0,target:target||undefined});
      if(poured>0){playWaterSwish(.6);callbacks.current.onFlow(target!.x,target!.y);}
      frame=requestAnimationFrame(tick);
    };
    cleanupRef.current=stop;window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);window.addEventListener('blur',blur);window.addEventListener('keydown',key);frame=requestAnimationFrame(tick);
  };
  // Place the tilted spout directly above the water contact, never pull the stream sideways.
  const displayHand=hand?.pouring&&hand.target?pitcherPourPosition(hand,hand.target):hand;
  return <>
    <button disabled={disabled} aria-label="Cầm bình nước để rót vào bể" aria-pressed={!!hand} onPointerDown={start} className="min-h-[72px] w-full rounded-2xl border border-sky-200 bg-white flex flex-col items-center justify-center touch-none disabled:opacity-40">
      <PitcherIcon/>
      {teacher&&<span className="text-sm">Click để cầm bình, đưa lên miệng bể để rót; click lần nữa để đặt xuống</span>}
    </button>
    {hand&&<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[120] rounded-2xl bg-white shadow-lg border border-sky-200 p-2 flex items-center gap-3">{teacher&&<span className="text-sm">{hand.pouring?'Đang rót nước':'Đưa miệng bình lên trên bể'}</span>}<button aria-label="Đặt bình xuống" onPointerDown={e=>{e.stopPropagation();cleanupRef.current?.();}} onClick={()=>cleanupRef.current?.()} className="min-h-[48px] rounded-xl bg-sky-100 px-3 font-bold">{teacher?'Đặt bình xuống':<span aria-hidden="true" className="text-2xl">↩</span>}</button></div>}
    {hand?.pouring&&hand.target&&displayHand&&<WaterStream from={pitcherSpout(displayHand.x,displayHand.y)} to={hand.target}/>}
    {hand&&displayHand&&<div aria-hidden="true" className="fixed pointer-events-none z-50" style={{left:displayHand.x-35,top:displayHand.y-65}}><div style={{transform:hand.pouring?'rotate(-65deg)':'rotate(-15deg)'}}><PitcherIcon/></div></div>}
  </>;
}

import {WaterStream} from './WaterStream';
import {FlowTarget} from './waterTransfer';
import React,{useEffect,useRef,useState} from 'react';
import { playWaterSwish, unlockImpactAudio } from './impactAudio';
// SVG spout (10,23), scaled to 70 px and rotated around the icon centre.
export function pitcherSpout(x:number,y:number){
  const angle=-65*Math.PI/180,dx=7-35,dy=16.1-35;
  return {x:x+dx*Math.cos(angle)-dy*Math.sin(angle),y:y-30+dx*Math.sin(angle)+dy*Math.cos(angle)};
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
    const startPoint={x:event.clientX,y:event.clientY};let lifted=false,moved=false;
    const move=(e:PointerEvent)=>{if(e.pointerId===pointer){point={x:e.clientX,y:e.clientY};moved ||= Math.hypot(point.x-startPoint.x,point.y-startPoint.y)>8;}};
    const stop=(e?:PointerEvent)=>{
      if(e&&e.pointerId!==pointer)return;
      if(e&&!lifted&&!moved){lifted=true;return;}
      cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);window.removeEventListener('blur',blur);window.removeEventListener('keydown',key);
      cleanupRef.current=null;setHand(null);callbacks.current.onActive(false);
    };
    const blur=()=>stop();
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')stop();};
    const tick=(time:number)=>{
      const dt=Math.min(.1,(time-last)/1000);last=time;
      const p=callbacks.current,spout=pitcherSpout(point.x,point.y),candidate=p.getTarget(spout.x,spout.y);
      const target=candidate&&candidate.y>spout.y?candidate:null,over=target?.inside ?? false;
      const amount=p.flowRate*dt;
      const poured=target?(over?p.onAdd(amount):amount):0;
      if(target&&!over&&poured>0)p.onSpill(target.worldX,target.worldZ,poured);
      setHand({...point,pouring:poured>0,target:target||undefined});
      if(poured>0){playWaterSwish(.6);callbacks.current.onFlow(target!.x,target!.y);}
      frame=requestAnimationFrame(tick);
    };
    cleanupRef.current=stop;window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);window.addEventListener('blur',blur);window.addEventListener('keydown',key);frame=requestAnimationFrame(tick);
  };
  return <>
    <button disabled={disabled} aria-label="Cầm bình nước để rót vào bể" onPointerDown={start} className="min-h-[72px] w-full rounded-2xl border border-sky-200 bg-white flex flex-col items-center justify-center touch-none disabled:opacity-40">
      <PitcherIcon/>
      {teacher&&<span className="text-sm">Giữ và đưa bình lên miệng bể để rót; buông để dừng</span>}
    </button>
    {hand?.pouring&&hand.target&&<WaterStream from={pitcherSpout(hand.x,hand.y)} to={hand.target}/>}
    {hand&&<div aria-hidden="true" className="fixed pointer-events-none z-50" style={{left:hand.x-35,top:hand.y-65}}><div style={{transform:hand.pouring?'rotate(-65deg)':'rotate(-15deg)'}}><PitcherIcon/></div><div className="absolute left-12 top-9 text-3xl">🖐️</div></div>}
  </>;
}

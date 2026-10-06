import {WaterStream} from './WaterStream';
import {FlowTarget} from './waterTransfer';
import React, {useEffect,useRef,useState} from 'react';
import {playWaterSwish,unlockImpactAudio} from './impactAudio';

type Water={ml:number;grams:number};
type Props={disabled:boolean;teacher:boolean;capacity:number;onActive:(active:boolean)=>void;checkWater:(x:number,y:number)=>boolean;checkMouth:(x:number,y:number)=>boolean;onTake:(ml:number)=>Water;onReturn:(water:Water)=>void;onFlow:(x:number,y:number)=>void;onDispose:(x:number,y:number,water:Water)=>void;getTarget:(x:number,y:number)=>FlowTarget|null};
export function LadleIcon({fill=0}:{fill?:number}) {
  return <svg viewBox="0 0 100 100" width="70" height="70" aria-hidden="true">
    <path d="M53 58 L77 14 Q82 5 88 12 L65 65" fill="#f9b56d" stroke="#ba713a" strokeWidth="3"/>
    <path d="M12 57 Q41 40 68 57 L65 76 Q40 97 15 76 Z" fill="#ffe1a5" stroke="#c58b47" strokeWidth="3"/>
    <ellipse cx="40" cy="58" rx="27" ry="11" fill="#fff3d3" stroke="#c58b47" strokeWidth="3"/>
    {fill>0&&<ellipse cx="40" cy="58" rx={24*fill} ry={8*fill} fill="#9de3ee"/>}
  </svg>;
}
export function WaterLadle(props:Props) {
  const callbacks=useRef(props);callbacks.current=props;
  const [hand,setHand]=useState<{x:number;y:number;fill:number;emptying:boolean;target?:FlowTarget}|null>(null);
  const cleanup=useRef<(()=>void)|null>(null);
  useEffect(()=>()=>cleanup.current?.(),[]);
  const start=(event:React.PointerEvent)=>{
    if(props.disabled||cleanup.current||event.button!==0)return;
    event.preventDefault();unlockImpactAudio();props.onActive(true);
    const pointer=event.pointerId;
    const startPoint={x:event.clientX,y:event.clientY};let lifted=false,moved=false;
    let point={x:event.clientX,y:event.clientY},water:Water={ml:0,grams:0},last=performance.now(),lastMove=last,frame=0;
    const move=(e:PointerEvent)=>{if(e.pointerId===pointer){point={x:e.clientX,y:e.clientY};moved ||= Math.hypot(point.x-startPoint.x,point.y-startPoint.y)>8;lastMove=performance.now();}};
    const stop=(e?:PointerEvent)=>{
      if(e&&e.pointerId!==pointer)return;
      if(e&&!lifted&&!moved){lifted=true;return;}
      cancelAnimationFrame(frame);
      // Releasing over the tank returns the carried water; elsewhere it is emptied outside.
      if(water.ml>0&&(callbacks.current.checkWater(point.x,point.y)||callbacks.current.checkMouth(point.x,point.y)))callbacks.current.onReturn(water);
      else if(water.ml>0)callbacks.current.onDispose(point.x,point.y,water);
      water={ml:0,grams:0};
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);
      cleanup.current=null;setHand(null);callbacks.current.onActive(false);
    };
    const cancel=()=>{if(water.ml>0){callbacks.current.onReturn(water);water={ml:0,grams:0};}stop();};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')cancel();};
    const tick=(time:number)=>{
      const dt=Math.min(.1,(time-last)/1000);last=time;
      const p=callbacks.current,inside=p.checkWater(point.x,point.y),mouth=p.checkMouth(point.x,point.y);
      let emptying=false;
      if(inside&&water.ml<p.capacity){
        const taken=p.onTake(Math.min(p.capacity-water.ml,p.capacity*dt));
        water={ml:water.ml+taken.ml,grams:water.grams+taken.grams};
        if(taken.ml>0){playWaterSwish(.5);p.onFlow(point.x,point.y);}
      }else if(!inside&&!mouth&&water.ml>0&&time-lastMove>350){
        const emptied=Math.min(water.ml,p.capacity*dt);
        p.onDispose(point.x,point.y,{ml:emptied,grams:water.grams*emptied/water.ml});
        const ratio=(water.ml-emptied)/water.ml;
        water={ml:water.ml-emptied,grams:water.grams*ratio};emptying=true;playWaterSwish(.4);
      }
      setHand({...point,fill:water.ml/p.capacity,emptying,target:emptying?p.getTarget(point.x,point.y)||undefined:undefined});frame=requestAnimationFrame(tick);
    };
    cleanup.current=cancel;window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);frame=requestAnimationFrame(tick);
  };
  return <>
    <button disabled={props.disabled} onPointerDown={start} aria-label="Cầm gáo để múc nước ra khỏi bể" className="min-h-[72px] w-full rounded-2xl border border-amber-200 bg-white flex flex-col items-center justify-center touch-none disabled:opacity-40">
      <LadleIcon/>{props.teacher&&<span className="text-sm text-amber-900">Giữ gáo, nhúng vào nước để múc; đưa ra ngoài để đổ. Buông trong bể để trả nước.</span>}
    </button>
    {hand?.emptying&&hand.target&&<WaterStream from={{x:hand.x-13,y:hand.y+7}} to={hand.target}/>}
    {hand&&<div aria-hidden="true" className="fixed pointer-events-none z-50" style={{left:hand.x-28,top:hand.y-40}}><div style={{transform:hand.emptying?'rotate(-55deg)':undefined}}><LadleIcon fill={hand.fill}/></div><div className="absolute left-10 top-2 text-3xl">🖐️</div></div>}
  </>;
}

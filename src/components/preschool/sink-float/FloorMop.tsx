import React,{useEffect,useRef,useState} from 'react';
const CAPACITY=80;
export function FloorMop({disabled,available,highlighted,clearBucketsToken,onWringComplete,onActive,onClean}:{disabled:boolean;teacher:boolean;available:boolean;highlighted?:boolean;clearBucketsToken?:number;onWringComplete?:()=>void;onActive:(active:boolean)=>void;onClean:(x:number,y:number,capacity:number)=>number}){
  const [hand,setHand]=useState<{x:number;y:number}|null>(null);
  const [wet,setWet]=useState(0),[wringing,setWringing]=useState(false),[collected,setCollected]=useState<number[]>([]);
  const wetRef=useRef(0),wringingRef=useRef(false),bucketRef=useRef<HTMLDivElement|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),cleanup=useRef<(()=>void)|null>(null);
  const wetOrigin=useRef<{x:number;y:number}|null>(null),travelProgress=useRef(0);
  const callbacks=useRef({onActive,onClean,onWringComplete});callbacks.current={onActive,onClean,onWringComplete};
  useEffect(()=>{setCollected([]);},[clearBucketsToken]);
  useEffect(()=>()=>{cleanup.current?.();if(timer.current)clearTimeout(timer.current);callbacks.current.onActive(false);},[]);
  const wring=()=>{
    if(wringingRef.current||wetRef.current<=0)return;
    cleanup.current?.();
    wringingRef.current=true;setWringing(true);callbacks.current.onActive(true);
    const amount=wetRef.current;
    timer.current=setTimeout(()=>{setCollected(prev=>[...prev,amount]);wetRef.current=0;wetOrigin.current=null;travelProgress.current=0;setWet(0);wringingRef.current=false;setWringing(false);setHand(null);callbacks.current.onActive(false);timer.current=null;callbacks.current.onWringComplete?.();},1300);
  };
  const start=(e:React.PointerEvent)=>{
    if(disabled||e.button!==0||cleanup.current||wringingRef.current||(!available&&wetRef.current===0))return;
    e.preventDefault();callbacks.current.onActive(true);
    const pointer=e.pointerId;let pickupReleased=false;
    const move=(event:PointerEvent)=>{
      if(event.pointerId!==pointer||wringingRef.current)return;
      if(wetRef.current>0){
        const r=bucketRef.current?.getBoundingClientRect();
        if(r&&wetOrigin.current){const origin=wetOrigin.current,dx=(r.left+r.right)/2-origin.x,dy=(r.top+r.bottom)/2-origin.y;const t=Math.max(travelProgress.current,Math.min(1,((event.clientX-origin.x)*dx+(event.clientY-origin.y)*dy)/(dx*dx+dy*dy||1)));travelProgress.current=t;setHand({x:origin.x+t*dx,y:origin.y+t*dy});}
        if(r&&event.clientX>=r.left-20&&event.clientX<=r.right+20&&event.clientY>=r.top-35&&event.clientY<=r.bottom){wring();return;}
        return;
      }
      setHand({x:event.clientX,y:event.clientY});
      if(wetRef.current<CAPACITY-.01){
        const absorbed=Math.max(0,Math.min(CAPACITY-wetRef.current,callbacks.current.onClean(event.clientX,event.clientY,CAPACITY-wetRef.current)));
        if(absorbed>0){wetOrigin.current={x:event.clientX,y:event.clientY};travelProgress.current=0;wetRef.current+=absorbed;setWet(wetRef.current);}
      }
    };
    const stop=(event?:PointerEvent)=>{
      if(event&&event.pointerId!==pointer)return;
      if(event?.type==='pointerup'&&!pickupReleased){pickupReleased=true;return;}
      if(event?.type==='pointerup'&&wetRef.current>0)return;
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);window.removeEventListener('blur',blur);
      setHand(null);cleanup.current=null;if(!wringingRef.current)callbacks.current.onActive(false);
    };
    const blur=()=>stop();cleanup.current=stop;setHand(wetRef.current>0?wetOrigin.current:{x:e.clientX,y:e.clientY});
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);window.addEventListener('blur',blur);
  };
  const cloth=<div className="relative w-[86px] h-[62px]" aria-hidden="true">
    <img src="/assets/items/approved/floor-cloth.png" alt="" draggable={false} className="w-full h-full object-contain" style={{filter:wet>0?'brightness(.82)':'none'}}/>
    {wet>0&&<div className="absolute inset-0" style={{background:'#46afca',opacity:.6,mixBlendMode:'multiply',maskImage:'url(/assets/items/approved/floor-cloth.png)',maskSize:'contain',maskPosition:'center',maskRepeat:'no-repeat'}}/>}
  </div>;
  return <>
    {(available||wet>0||collected.length>0)&&<button disabled={disabled||wringing||(!available&&wet===0)} onPointerDown={start} aria-label="Cầm giẻ lau sàn" className={`min-h-[72px] w-full rounded-2xl border border-amber-200 bg-white flex flex-col items-center disabled:opacity-40 touch-none ${highlighted?'ring-4 ring-yellow-300 shadow-[0_0_25px_#fde047] animate-pulse':''}`}>{cloth}</button>}
    {hand&&!wringing&&<div aria-hidden="true" className="fixed z-50 pointer-events-none" style={{left:hand.x-39,top:hand.y-28}}>{cloth}</div>}
    {wet>0||wringing?<div ref={bucketRef} className="fixed bottom-6 left-[28%] z-50 rounded-3xl bg-yellow-50/95 p-3 text-center" style={{boxShadow:'0 0 0 10px #fde68a55,0 0 55px 18px #facc1570'}}>
      {wringing&&<div className="mx-auto relative w-20 h-16">{cloth}<span className="absolute left-8 bottom-0 h-7 w-1 rounded bg-sky-400 animate-pulse"/><span className="absolute left-12 bottom-0 h-6 w-1 rounded bg-sky-300 animate-pulse"/></div>}
      <svg viewBox="0 0 120 105" width="110" height="96" className="mx-auto" aria-hidden="true"><path d="M17 32L27 88Q60 103 93 88L103 32" fill="#ffd59c" stroke="#b87838" strokeWidth="3"/><ellipse cx="60" cy="32" rx="43" ry="13" fill={wringing?'#86dcea':'#fff0cf'} stroke="#b87838" strokeWidth="3"/></svg>
      <button onClick={wring} disabled={wringing} aria-label="Vắt giẻ vào xô" className="absolute inset-0 rounded-3xl"/>
    </div>:null}
    {collected.length>0&&<div aria-label={`${collected.length} xô đã hứng nước từ giẻ`} className="flex gap-1 flex-wrap">{collected.map((_,i)=><svg key={i} viewBox="0 0 60 65" width="32" height="35" aria-hidden="true"><path d="M8 18L14 55Q30 64 46 55L52 18" fill="#ffd59c" stroke="#b87838" strokeWidth="2"/><ellipse cx="30" cy="18" rx="22" ry="7" fill="#86dcea" stroke="#b87838" strokeWidth="2"/></svg>)}</div>}
  </>;
}

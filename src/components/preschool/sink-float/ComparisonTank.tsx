import {useEffect,useRef,useState} from 'react';
import {ThreeTankCanvas,ThreeTankCanvasHandle} from './ThreeTankCanvas';
import {ObjectBasket} from './ObjectBasket';
import {getTankDimensions} from './tankGeometry';
import {TankObject,TankShape,TankScale,InteractionMode} from './types';
import {freshComparisonItem} from './comparisonTrial';
import {SceneSetting} from './SceneBackdrop';

export function ComparisonTank({presets,sceneSetting,pairedShape,pairedScale,trial}:{presets:TankObject[];sceneSetting:SceneSetting;pairedShape?:TankShape;pairedScale?:TankScale;trial?:{token:number;item:TankObject}}){
  const [ownShape,setShape]=useState<TankShape>('square'),[ownScale,setScale]=useState<TankScale>('normal');
  const shape=pairedShape??ownShape,scale=pairedScale??ownScale,paired=!!pairedShape;
  const [items,setItems]=useState<TankObject[]>(()=>presets.map(i=>({...i})));
  const [selected,setSelected]=useState<TankObject|null>(null),[held,setHeld]=useState<string|null>(null);
  const [interaction,setInteraction]=useState<InteractionMode>('interact'),[message,setMessage]=useState('Chọn vật trong khay riêng rồi thả vào bể 2.');
  const tank=useRef<ThreeTankCanvasHandle|null>(null),scene=useRef<HTMLDivElement|null>(null);
  const cleanup=useRef<(()=>void)|null>(null);
  const dims=getTankDimensions(shape,scale);
  const reset=()=>{cleanup.current?.();tank.current?.cancelActiveGesture();setSelected(null);setHeld(null);setItems(presets.map(i=>({...i,inTank:false,outsideTank:false,status:'basket',damage:undefined,settled:false})));};
  useEffect(()=>{reset();},[presets.length,shape,scale]);
  useEffect(()=>()=>cleanup.current?.(),[]);
  useEffect(()=>{if(trial){tank.current?.resetDefaultView();tank.current?.dropComparisonItem(freshComparisonItem(trial.item));setMessage('Con nhìn vị trí của vật trong hai bể nhé.');}},[trial?.token]);
  const drop=(item:TankObject,x:number,y:number)=>{tank.current?.dropOrThrowItemAtScreenPos(item,x,y);setSelected(null);};
  const pick=(event:React.PointerEvent,item:TankObject)=>{
    if(event.button!==0||held||cleanup.current)return;
    event.preventDefault();setSelected(item);
    let moved=false;const pointer=event.pointerId,start={x:event.clientX,y:event.clientY};
    const move=(e:PointerEvent)=>{if(e.pointerId!==pointer)return;moved ||= Math.hypot(e.clientX-start.x,e.clientY-start.y)>8;tank.current?.previewDropAtScreenPos(item,e.clientX,e.clientY);};
    const end=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);tank.current?.clearDropPreview();cleanup.current=null;};
    const up=(e:PointerEvent)=>{if(e.pointerId!==pointer)return;end();if(moved)drop(item,e.clientX,e.clientY);};
    const cancel=()=>{end();setSelected(null);};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')cancel();};
    cleanup.current=cancel;window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);window.addEventListener('keydown',key);
  };
  return <section aria-label="Bể so sánh thứ hai" className="flex-1 min-w-0 min-h-0 flex flex-col rounded-3xl border-2 border-violet-300 bg-violet-50 overflow-hidden">
    <div className="flex flex-wrap items-center gap-2 p-2 text-sm">
      <strong>{paired?'Bể B · Nước ngọt':'Bể 2'}</strong>
      {!paired&&<>
      <select aria-label="Hình dạng bể 2" value={shape} disabled={paired||!!held||!!selected} onChange={e=>setShape(e.target.value as TankShape)} className="min-h-[44px] rounded-xl bg-white px-2">
        <option value="rectangle">Chữ nhật</option><option value="square">Lập phương</option><option value="cylinder">Trụ tròn</option><option value="triangle">Tam giác</option>
      </select>
      <select aria-label="Kích thước bể 2" value={scale} disabled={paired||!!held||!!selected} onChange={e=>setScale(e.target.value as TankScale)} className="min-h-[44px] rounded-xl bg-white px-2"><option value="normal">Bể to</option><option value="compact">Bể nhỏ</option></select>
      <button disabled={paired} onClick={reset} className="min-h-[44px] px-2 rounded-xl bg-white">Dọn bể 2</button></>}
    </div>
    <div ref={scene} role="group" aria-label="Bể 2: nhấn Enter để thả vật đang chọn" tabIndex={0} className="relative flex-1 min-h-[140px]" onClick={e=>{if(selected&&!cleanup.current)drop(selected,e.clientX,e.clientY);}} onKeyDown={e=>{if(e.key==='Enter'&&selected){const r=scene.current?.getBoundingClientRect();if(r)drop(selected,r.left+r.width/2,r.top+r.height*.18);}}}>
      <ThreeTankCanvas ref={tank} shape={shape} scale={scale} dims={dims} sceneSetting={sceneSetting} items={items} onUpdateItems={setItems} waterDensity={1} interactionMode={interaction} onInteractionModeChange={setInteraction} holdingItemId={held} onHoldItem={setHeld} carryingTrayItem={!!selected} workflowStep="idle" onPourSaltAtPoint={()=>{}} soundEnabled onMessageUpdate={setMessage} showXRay={false}/>
    </div>
    <div className="max-h-[170px] overflow-y-auto p-2"><p className="text-xs mb-1" role="status">{paired?'Bể B giữ nước ngọt để con so sánh.':message}</p>{!paired&&<ObjectBasket items={items.filter(i=>!i.inTank)} selectedId={selected?.id||null} showLabels onPick={pick} onKeyboardPick={item=>{if(!held)setSelected(item);}}/>}</div>
  </section>;
}

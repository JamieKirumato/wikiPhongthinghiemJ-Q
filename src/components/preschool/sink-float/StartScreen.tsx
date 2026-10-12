import { useState } from 'react';
import { ArrowRight, Play, Users, Waves } from 'lucide-react';
import { ThreeTankCanvas } from './ThreeTankCanvas';
import { getTankDimensions } from './tankGeometry';
import { TankObject } from './types';

const dims = getTankDimensions('rectangle', 'normal');
export function StartScreen({onStart, presets}:{onStart:(mode:'student'|'teacher')=>void; presets:TankObject[]}) {
  const [items, setItems] = useState<TankObject[]>(() => presets.filter(i => ['item-apple','item-pebble','item-duck'].includes(i.id)).map((item,index) => ({...item,inTank:true,x:(index-1)*2.2,y:dims.waterHeight+1,z:0,status:'falling' as const})));
  return <section className="premium-welcome">
    <header className="premium-welcome-brand"><Waves/><span>Vật nổi, vật chìm</span><span className="premium-edition">KHÁM PHÁ KHOA HỌC</span></header>
    <div className="premium-welcome-body">
      <div className="premium-welcome-copy">
        <span className="premium-kicker">MỘT CHẬU NƯỚC. THẬT NHIỀU KHÁM PHÁ.</span>
        <h1>Cùng khám phá<br/>với <em>nước!</em></h1>
        <p>Chọn một đồ vật, thả vào nước.<br/>Điều gì sẽ xảy ra? Con thử nhé!</p>
        <button className="premium-primary" onClick={()=>onStart('student')}><Play size={22} fill="currentColor"/> Bé khám phá <ArrowRight size={22}/></button>
        <button className="premium-secondary" onClick={()=>onStart('teacher')}><Users size={22}/> Giáo viên & phụ huynh</button>
        <span className="premium-welcome-note">Tự chọn · Tự thử · Cùng quan sát</span>
      </div>
      <div className="premium-welcome-scene" aria-label="Minh họa đồ vật nổi và chìm trong bể 3D">
        <ThreeTankCanvas shape="rectangle" scale="normal" dims={dims} items={items} onUpdateItems={setItems} waterDensity={1} interactionMode="interact" onInteractionModeChange={()=>{}} holdingItemId={null} onHoldItem={()=>{}} workflowStep="idle" onPourSaltAtPoint={()=>{}} soundEnabled={false} onMessageUpdate={()=>{}} showXRay={false} inputLocked/>
        <span className="premium-live-tag"><span/> Bể nước 3D</span>
      </div>
    </div>
    <footer className="premium-welcome-footer">Bắt đầu trên màn hình, tiếp tục khám phá với đồ vật thật.<a href="https://polyhaven.com/a/food_apple_01" target="_blank" rel="noreferrer">Mô hình táo: Poly Haven · CC0</a></footer>
  </section>;
}

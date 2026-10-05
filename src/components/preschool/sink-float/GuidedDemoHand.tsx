import React, { useEffect, useRef, useState } from 'react';
import { speechEngine } from '../../../utils/speechUtils';
import { soundEngine } from '../../../utils/audioEffects';
interface Props { onClose: () => void; soundEnabled: boolean; sceneBounds?: DOMRect; trayBounds?: DOMRect; }
export const GuidedDemoHand: React.FC<Props> = ({onClose, soundEnabled, sceneBounds, trayBounds}) => {
  const [step,setStep] = useState(0);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  useEffect(() => {
    speechEngine.speak('Chọn vật, đưa vào bể, buông tay rồi quan sát. Con có thể thử bao nhiêu lần cũng được.');
    const timers = [window.setTimeout(()=>setStep(1),900),window.setTimeout(()=> {setStep(2);if(soundEnabled)soundEngine.playWaterDrop();},2200),window.setTimeout(()=>setStep(3),3300),window.setTimeout(()=>closeRef.current(),5200)];
    return () => timers.forEach(clearTimeout);
  }, [soundEnabled]);
  const scene = sceneBounds || {left:30,top:120,width:700,height:350};
  const tray = trayBounds || {left:30,top:500};
  const points = [
    {x:tray.left+82,y:tray.top+60},
    {x:scene.left+scene.width*0.48,y:scene.top+scene.height*0.18},
    {x:scene.left+scene.width*0.48,y:scene.top+scene.height*0.42},
    {x:scene.left+scene.width*0.48,y:scene.top+scene.height*0.42},
  ];
  const point = points[step];
  return <div className="fixed inset-0 z-50 pointer-events-none" role="dialog" aria-label="Bàn tay làm mẫu">
    <div className="fixed pointer-events-auto rounded-2xl bg-amber-100 border-2 border-amber-400 p-3 shadow-xl max-w-xs" style={{left:scene.left+12,top:scene.top+12}}>
      <p className="font-bold text-sm">{['👆 Chọn một vật ở khay','✋ Đưa lên miệng bể','💧 Buông tay nhẹ nhàng','👀 Nhìn vật rồi tự thử nhé'][step]}</p>
      <button onClick={() => closeRef.current()} className="min-h-[44px] rounded-xl bg-white px-3 mt-2 font-bold">Đến lượt con</button>
    </div>
    <div style={{position:'fixed',left:point.x,top:point.y,transition:'left 1.1s ease, top 1.1s ease',transform:'translate(-22px,-22px)'}}>
      {step<3 && <img src="/assets/items/apple.png" alt="Vật mẫu" className="w-12 h-12 object-contain"/>}
      <span className="absolute left-7 top-7 text-4xl drop-shadow-lg">{step===2 || step===3 ? '👆' : '✋'}</span>
      {step===3 && <span className="absolute -left-3 top-3 w-20 h-8 rounded-full border-4 border-cyan-300 animate-ping"/>}
    </div>
  </div>;
};

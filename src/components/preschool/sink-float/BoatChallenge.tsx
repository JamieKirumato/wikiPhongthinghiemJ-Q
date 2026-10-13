import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Lightbulb, Minus, Plus, RotateCcw } from 'lucide-react';
import { ThreeTankCanvas } from './ThreeTankCanvas';
import type { SceneSetting } from './SceneBackdrop';
import { getTankDimensions } from './tankGeometry';
import { soundEngine } from '../../../utils/audioEffects';

interface Props { soundEnabled: boolean; onMessageUpdate: (message: string) => void; controlsHost?: HTMLElement | null; sceneSetting: SceneSetting; }
type Hull = 'ball' | 'shallow' | 'deep';
const HULLS = {
  ball: { label: 'Vo thành viên', icon: '⚪', capacityMl: 15 / 2.7 },
  shallow: { label: 'Thuyền thấp', icon: '🛶', capacityMl: 65 },
  deep: { label: 'Thuyền sâu', icon: '⛵', capacityMl: 110 },
};
const FOIL_MASS_G = 15;
const CARGO_MASS_G = 15;

/** Displacement capacity, identical material mass, and persistent flooding.
 * Surface tension is omitted: the solid ball is submerged before release.
 */
export const BoatChallenge: React.FC<Props> = ({ soundEnabled, onMessageUpdate, controlsHost, sceneSetting }) => {
  const [hull, setHull] = useState<Hull>('shallow');
  const [cargo, setCargo] = useState(0);
  const [flooded, setFlooded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const totalMass = FOIL_MASS_G + cargo * CARGO_MASS_G;
  const capacity = HULLS[hull].capacityMl; // water density 1 g/ml
  const sinking = flooded || totalMass > capacity;
  const immersion = Math.min(1, totalMass / capacity);
  const dims = getTankDimensions('rectangle','normal');
  const callbackRef = useRef(onMessageUpdate);
  callbackRef.current = onMessageUpdate;

  useEffect(() => {
    if (totalMass > capacity && !flooded) {
      setFlooded(true);
      setAttempts(value => value + 1);
      callbackRef.current(hull === 'ball' ? 'Viên nhôm đang đi xuống. Con thử đổi hình dạng nhé!' : 'Nước tràn vào thuyền rồi. Con thử bớt hàng, làm khô thuyền rồi đổi hình dạng nhé!');
      if (soundEnabled) soundEngine.playBubbleGlug();
    } else if (!flooded) {
      callbackRef.current(cargo ? 'Con vừa thêm hàng. Mép thuyền đang ở đâu so với mặt nước?' : 'Con hãy chọn hình dạng và thử chở hàng. Điều gì sẽ xảy ra?');
    }
  }, [totalMass, capacity, flooded, cargo, soundEnabled, hull]);

  const addCargo = () => {
    if (sinking || cargo >= 8 || hull === 'ball') return;
    setCargo(value => value + 1);
    if (soundEnabled) soundEngine.playSpoonClink();
  };
  const reset = (nextHull = hull) => {
    setHull(nextHull); setCargo(0); setFlooded(false);
    callbackRef.current('Mình đã lấy hàng ra và làm khô thuyền. Con có thể thử cách khác nhé!');
  };
  const dragCargo = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const releaseCargo = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) addCargo();
  };

  const controls = <div className="premium-boat-tools">
    <p className="premium-section-label">CHỌN HÌNH DẠNG</p>
    <div className="premium-hull-choices">{(Object.keys(HULLS) as Hull[]).map(value=><button key={value} onClick={()=>reset(value)} aria-pressed={hull===value}>
      <svg viewBox="0 0 120 65" aria-hidden="true"><defs><linearGradient id={'foil-'+value} x2="0" y2="1"><stop stopColor="#f5f7f8"/><stop offset=".45" stopColor="#97a8af"/><stop offset="1" stopColor="#dbe2e4"/></linearGradient></defs>
        {value==='ball'?<circle cx="60" cy="31" r="21" fill={'url(#foil-'+value+')'} stroke="#9babb2"/>:<><path d={value==='deep'?'M12 17L30 56H90L108 17Z':'M12 24L30 47H90L108 24Z'} fill={'url(#foil-'+value+')'} stroke="#96a7ae"/><ellipse cx="60" cy={value==='deep'?17:24} rx="48" ry="9" fill="#d0dbdf" stroke="#8f9fa6"/><ellipse cx="60" cy={value==='deep'?17:24} rx="39" ry="5" fill="#9eafb7"/></>}
      </svg><span>{HULLS[value].label}</span></button>)}</div>
    <button className="premium-cargo-piece" onPointerDown={dragCargo} onPointerUp={releaseCargo} disabled={sinking||hull==='ball'}><Box size={35}/><span>Kéo hàng lên thuyền</span></button>
    <div className="premium-cargo-actions"><button className="premium-add-cargo" onClick={addCargo} disabled={sinking||hull==='ball'}><Plus size={20}/> Thêm hàng</button><button onClick={()=>setCargo(value=>Math.max(0,value-1))} disabled={!cargo} aria-label="Bớt hàng"><Minus size={20}/></button></div>
    <button onClick={()=>reset()}><RotateCcw size={18}/> Làm khô, thử lại</button>
    <button aria-expanded={showHint} onClick={()=>setShowHint(value=>!value)}><Lightbulb size={18}/> Con muốn gợi ý?</button>
    <details className="premium-model-note"><summary>Dành cho người lớn</summary><p>Cùng một miếng nhôm {FOIL_MASS_G} g; mỗi kiện {CARGO_MASS_G} g. Sức chở phụ thuộc thể tích chiếm chỗ trước khi nước tràn vào. Mô hình bỏ qua sức căng bề mặt; viên nhôm được đặt ngập nước trước khi buông. Muốn thử lại cần bớt hàng và làm khô thuyền. Các số trong mô phỏng là quy ước.</p></details>
  </div>;

  return <div className="lab-scene premium-boat-scene" ref={sceneRef} role="group" aria-label="Bể thuyền chở hàng">
    <ThreeTankCanvas sceneSetting={sceneSetting} shape="rectangle" scale="normal" dims={dims} items={[]} onUpdateItems={()=>{}} waterDensity={1} interactionMode="interact" onInteractionModeChange={()=>{}} holdingItemId={null} onHoldItem={()=>{}} workflowStep="idle" onPourSaltAtPoint={()=>{}} soundEnabled={soundEnabled} onMessageUpdate={onMessageUpdate} showXRay={false} boatVisual={{hull,cargo,immersion,sinking}}/>
    <div className="premium-scene-prompt">Con thử chở thêm nhé!</div>
    {showHint&&<div className="premium-boat-hint">{attempts>0?'Con thử mép thuyền cao hơn. Thêm một kiện mỗi lần rồi quan sát.':'Khi thêm hàng, mép thuyền gần mặt nước hay xa hơn?'}</div>}
    <div className="premium-boat-status" role="status">{sinking?hull==='ball'?'Viên nhôm đã chìm':'Nước vào thuyền rồi. Con thử lại nhé!':cargo+' kiện hàng · Con nhìn mép thuyền nhé.'}</div>
    {controlsHost?createPortal(controls,controlsHost):controls}
  </div>;
};

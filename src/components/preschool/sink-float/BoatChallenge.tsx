import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../../../utils/audioEffects';

interface Props { soundEnabled: boolean; onMessageUpdate: (message: string) => void; controlsHost?: HTMLElement | null; }
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
export const BoatChallenge: React.FC<Props> = ({ soundEnabled, onMessageUpdate, controlsHost }) => {
  const [hull, setHull] = useState<Hull>('shallow');
  const [cargo, setCargo] = useState(0);
  const [flooded, setFlooded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [record, setRecord] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const totalMass = FOIL_MASS_G + cargo * CARGO_MASS_G;
  const capacity = HULLS[hull].capacityMl; // water density 1 g/ml
  const sinking = flooded || totalMass > capacity;
  const immersion = Math.min(1, totalMass / capacity);
  const bodyHeight = hull === 'deep' ? 78 : 48;
  const boatY = sinking ? 233 : 130 - bodyHeight + bodyHeight * immersion;
  const callbackRef = useRef(onMessageUpdate);
  callbackRef.current = onMessageUpdate;

  useEffect(() => {
    if (totalMass > capacity && !flooded) {
      setFlooded(true);
      setAttempts(value => value + 1);
      callbackRef.current(hull === 'ball' ? 'Viên nhôm đang đi xuống. Con thử đổi hình dạng nhé!' : 'Nước tràn vào thuyền rồi. Con thử bớt hàng, làm khô thuyền rồi đổi hình dạng nhé!');
      if (soundEnabled) soundEngine.playBubbleGlug();
    } else if (!flooded) {
      setRecord(value => Math.max(value, cargo));
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

  const controls = (
<div className="bg-white p-3 flex-shrink-0 space-y-2">
      <button className="min-h-[44px] rounded-2xl px-4 bg-amber-100 font-bold" onClick={() => setShowHint(value => !value)}>💡 Gợi ý</button>
      <div className="grid grid-cols-1 gap-2">{(Object.keys(HULLS) as Hull[]).map(value => <button key={value} onClick={() => reset(value)} aria-pressed={hull === value} className={`flex-1 min-h-[52px] rounded-2xl border-2 text-sm font-bold ${hull === value ? 'bg-amber-100 border-amber-400' : 'border-slate-200'}`}>{HULLS[value].icon} {HULLS[value].label}</button>)}</div>
      <div className="grid grid-cols-1 gap-2">
        <button onPointerDown={dragCargo} onPointerUp={releaseCargo} className="touch-none min-h-[48px] rounded-2xl bg-amber-200 px-4 font-bold" disabled={sinking || hull === 'ball'}>📦 Kéo hàng lên thuyền</button>
        <button onClick={addCargo} disabled={sinking || hull === 'ball'} className="min-h-[48px] rounded-2xl bg-sky-500 px-4 font-bold text-white disabled:opacity-40">＋ Thêm hàng</button>
        <button onClick={() => setCargo(value => Math.max(0,value-1))} disabled={cargo === 0} className="min-h-[48px] rounded-2xl bg-sky-100 px-4 font-bold">− Bớt hàng</button>
        <button onClick={() => reset()} className="min-h-[48px] rounded-2xl bg-emerald-100 px-4 font-bold">↻ Làm khô, thử lại</button>
        <span className="text-sm font-bold text-slate-500">Con đã chở được {record} kiện!</span>
      </div>
      <details className="text-xs text-slate-500"><summary>Dành cho người lớn: mô hình sức chở</summary><p>Nhôm {FOIL_MASS_G} g; mỗi kiện {CARGO_MASS_G} g. Thuyền thấp chiếm chỗ tối đa 65 ml, thuyền sâu 110 ml nước trước khi nước tràn vào. Nước ngọt 1 g/ml; sức nâng phụ thuộc thể tích phần chìm. Mô hình bỏ qua sức căng mặt ngoài; viên nhôm được đặt ngập nước trước khi buông. Muốn thuyền nổi lại cần lấy hàng ra và làm khô.</p></details>
    </div>
  );

  return <div className="h-full min-h-0 flex flex-col rounded-3xl bg-sky-50 border-2 border-sky-200 overflow-hidden">
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white">
      <div><h2 className="font-black text-lg text-sky-900">⛵ Thuyền chở hàng</h2><p className="text-sm text-slate-600">Cùng một miếng nhôm, con làm thuyền chở được nhiều hàng nhé!</p></div>
    </div>
    {showHint && <p className="px-4 py-2 bg-amber-100 text-sm">{attempts > 0 ? 'Con thử một chiếc thuyền có mép cao hơn. Chỉ thêm một kiện mỗi lần rồi quan sát.' : 'Con hãy nhìn mép thuyền. Khi thêm hàng, mép thuyền gần mặt nước hay xa hơn?'}</p>}
    <div ref={sceneRef} className="flex-1 min-h-0 relative p-2" aria-label="Bể thuyền chở hàng">
      <svg viewBox="0 0 520 330" className="w-full h-full" role="img" aria-label={sinking ? 'Nhôm đã chìm dưới nước' : `Thuyền đang chở ${cargo} kiện hàng trên mặt nước`}>
        <defs>
          <linearGradient id="boatWater" x2="0" y2="1"><stop stopColor="#daf8ff"/><stop offset="1" stopColor="#b1eaf5"/></linearGradient>
          <linearGradient id="boatFoil" x2="0" y2="1"><stop stopColor="#eef3f8"/><stop offset="1" stopColor="#8facc3"/></linearGradient>
        </defs>
        <rect x="25" y="30" width="470" height="270" rx="14" fill="#fff" stroke="#85cddc" strokeWidth="4"/>
        <rect x="28" y="130" width="464" height="165" fill="url(#boatWater)"/>
        <path d="M28 130 Q85 124 140 130 T255 130 T370 130 T492 130" fill="none" stroke="#48b9d2" strokeWidth="3"/>
        <text x="40" y="116" fontSize="15" fill="#248ba6">〰 Mặt nước</text>
        <rect x="28" y="280" width="464" height="16" fill="#f4eee0"/>
        <g style={{transform:`translate(260px, ${boatY}px)`,transition:'transform 1.1s ease-in-out'}}>
          {hull === 'ball' ? <circle r="18" fill="url(#boatFoil)" stroke="#698397" strokeWidth="2"/> : <>
            <path d={`M-104 0 L-75 ${bodyHeight} L75 ${bodyHeight} L104 0 Z`} fill="url(#boatFoil)" stroke="#698397" strokeWidth="3"/>
            <ellipse cx="0" cy="0" rx="104" ry="12" fill="#cfdeeb" stroke="#698397" strokeWidth="3"/>
            <ellipse cx="0" cy="0" rx="87" ry="7" fill={flooded ? '#8ee1ef' : '#889fad'}/>
            {Array.from({length:cargo}, (_,i) => <g key={i} transform={`translate(${-61 + i % 4 * 34}, ${-15 - Math.floor(i/4)*29})`}>
              <rect width="28" height="27" rx="4" fill="#eda94a" stroke="#b87825" strokeWidth="2"/><path d="M14 0V27M0 13H28" stroke="#ffe1a0" strokeWidth="3"/>
            </g>)}
          </>}
        </g>
        {sinking && <g fill="none" stroke="#fff" strokeWidth="3"><circle cx="241" cy="195" r="5"/><circle cx="280" cy="180" r="7"/><circle cx="250" cy="161" r="4"/></g>}
      </svg>
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl px-4 py-2 font-bold ${sinking ? 'bg-rose-100 text-rose-900' : 'bg-white text-sky-900'}`} aria-live="polite">{sinking ? hull === 'ball' ? '⚪ Viên nhôm ở dưới đáy' : '💧 Nước đã vào thuyền — thử lại nhé!' : `📦 ${cargo} kiện hàng · Con thử thêm nhé!`}</div>
    </div>
    {controlsHost ? createPortal(controls, controlsHost) : controls}
  </div>;
};

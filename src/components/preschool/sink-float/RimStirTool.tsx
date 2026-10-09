import {createPortal} from 'react-dom';
export function RimStirTool({active,highlighted,disabled,onTake,onPut}:{active:boolean;highlighted:boolean;disabled:boolean;onTake:()=>void;onPut:()=>void}){
  const slot=document.querySelector('[data-stir-tool-slot]');
  if(!slot)return null;
  return <>{createPortal(<div data-stir-tool className="w-full" onPointerDown={e=>e.stopPropagation()}>
    <button aria-label={active?'Đặt que khuấy xuống':'Cầm que khuấy'} disabled={disabled} onClick={active?onPut:onTake} className={`w-full min-h-[72px] flex items-center justify-center rounded-2xl bg-white/90 border border-amber-300 touch-none ${highlighted&&!active?'ring-4 ring-yellow-300 shadow-[0_0_30px_12px_#fde04788]':''}`}>
      {active?<span aria-hidden="true" className="text-2xl">↩</span>:<svg width="52" height="64" viewBox="0 0 52 64" aria-hidden="true"><path d="M17 54L35 8" stroke="#a77537" strokeWidth="7" strokeLinecap="round"/><path d="M17 53L35 9" stroke="#dfb371" strokeWidth="3" strokeLinecap="round"/></svg>}
    </button>
  </div>,slot)}</>;
}

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TankObject } from './types';

export interface ObjectBasketProps {
  items: TankObject[];
  selectedId: string | null;
  showLabels: boolean;
  onPick: (event: React.PointerEvent, item: TankObject) => void;
  onKeyboardPick: (item: TankObject) => void;
}

export const ObjectBasket: React.FC<ObjectBasketProps> = ({items, selectedId, showLabels, onPick, onKeyboardPick}) => {
  const pointerTypeRef = useRef('mouse');
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState({start: true, end: false});
  const updateEdges = () => {
    const strip = stripRef.current;
    if (strip) setEdges({start: strip.scrollLeft < 2, end: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2});
  };
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new ResizeObserver(updateEdges); observer.observe(strip); updateEdges();
    return () => observer.disconnect();
  }, [items.length]);
  const turnPage = (direction: number) => {
    const strip = stripRef.current;
    strip?.scrollBy({left: direction * strip.clientWidth, behavior: 'smooth'});
  };
  return <div role="group" aria-label="Rổ đồ vật" className={`lab-basket ${items.length > 4 ? 'lab-basket-paged' : ''}`}>
    {items.length > 4 && <button className="lab-tray-arrow" aria-label="Đồ vật trước" disabled={edges.start} onClick={() => turnPage(-1)}><ChevronLeft/></button>}
    <div ref={stripRef} onScroll={updateEdges} className="lab-basket-items">
      {items.map(item => {
        const disabled = item.inTank && !item.damage;
        return <button key={item.id} type="button" disabled={disabled}
          aria-label={`Cầm ${item.name}`} aria-pressed={selectedId === item.id}
          onPointerDown={event => { pointerTypeRef.current=event.pointerType; if (!disabled && event.pointerType !== 'touch') onPick(event, item); }}
          onClick={event => { if (!disabled && event.detail !== 0 && pointerTypeRef.current === 'touch') onKeyboardPick(item); }}
          onKeyDown={event => {
            if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault(); onKeyboardPick(item);
            }
          }} className="lab-object">
          <div className="lab-object-image"><img src={item.image} alt={item.name} draggable={false} style={{transform: `scale(${item.id.includes('item-marble') ? 1.04 : item.id.includes('item-wood') ? 1.01 : 1})`}}/></div>
          {showLabels && <span className="text-[11px] font-semibold truncate w-full text-center pb-1 pointer-events-none">{item.name}</span>}
        </button>;
      })}
    </div>
    {items.length > 4 && <button className="lab-tray-arrow" aria-label="Đồ vật tiếp theo" disabled={edges.end} onClick={() => turnPage(1)}><ChevronRight/></button>}
  </div>;
};
export default ObjectBasket;

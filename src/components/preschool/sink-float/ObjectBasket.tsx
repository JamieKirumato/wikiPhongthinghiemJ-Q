import React from 'react';
import { TankObject } from './types';

export interface ObjectBasketProps {
  items: TankObject[];
  selectedId: string | null;
  showLabels: boolean;
  onPick: (event: React.PointerEvent, item: TankObject) => void;
  onKeyboardPick: (item: TankObject) => void;
}

const WICKER_PATTERN_STYLE: React.CSSProperties = {
  backgroundColor: '#fbf5ea',
  backgroundImage: `
    linear-gradient(45deg, rgba(193, 145, 92, 0.14) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(193, 145, 92, 0.14) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(193, 145, 92, 0.14) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(193, 145, 92, 0.14) 75%)
  `,
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
};

export const ObjectBasket: React.FC<ObjectBasketProps> = ({
  items,
  selectedId,
  showLabels,
  onPick,
  onKeyboardPick,
}) => {
  return (
    <div
      role="group"
      aria-label="Rổ đồ vật"
      className="w-full rounded-3xl border-4 border-[#cda06d] dark:border-[#8e683e] p-2.5 sm:p-3 shadow-md transition-all space-y-2"
      style={WICKER_PATTERN_STYLE}
    >
      {/* Vành rổ mây đan mô phỏng tự nhiên */}
      <div className="w-full flex items-center justify-center pb-1 border-b border-[#cfa677]/40 select-none" aria-hidden="true">
        <div className="h-1.5 w-16 rounded-full bg-[#c89862]/60" />
      </div>

      {/* Lưới 2 cột các ô tranh đồ vật >= 80px */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
        {items.map((item) => {
          const isDamaged = Boolean(item.damage);
          const isDisabled = item.inTank && !isDamaged;
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              disabled={isDisabled}
              aria-label={`Cầm ${item.name}`}
              aria-pressed={isSelected}
              onPointerDown={(event) => {
                if (!isDisabled) {
                  onPick(event, item);
                }
              }}
              onKeyDown={(event) => {
                if (!isDisabled && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onKeyboardPick(item);
                }
              }}
              className={`group relative min-h-[80px] w-full p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 ${
                isDisabled
                  ? 'opacity-30 grayscale bg-amber-50/40 border-dashed border-amber-300/40 cursor-not-allowed'
                  : isSelected
                  ? 'bg-amber-100 dark:bg-amber-900/60 border-amber-500 scale-[1.03] shadow-md ring-2 ring-amber-400 cursor-grab active:cursor-grabbing'
                  : isDamaged
                  ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 hover:border-rose-400 hover:shadow-md cursor-pointer'
                  : 'bg-white/90 dark:bg-slate-800/90 border-amber-200 dark:border-amber-900/40 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
              }`}
              style={{ touchAction: 'none' }}
            >
              {/* Hình ảnh gốc của đồ vật */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center pointer-events-none">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`max-w-full max-h-full object-contain filter drop-shadow pointer-events-none ${
                    isDisabled ? 'grayscale opacity-40' : ''
                  }`}
                  draggable={false}
                />
              </div>

              {/* Nhãn chữ chỉ hiển thị khi showLabels = true */}
              {showLabels && (
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate w-full text-center mt-1 pointer-events-none">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ObjectBasket;

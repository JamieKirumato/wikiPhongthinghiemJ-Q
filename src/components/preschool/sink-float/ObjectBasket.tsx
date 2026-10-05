import React from 'react';
import { TankObject } from './types';

export interface ObjectBasketProps {
  items: TankObject[];
  selectedId: string | null;
  showLabels: boolean;
  onPick: (event: React.PointerEvent, item: TankObject) => void;
  onKeyboardPick: (item: TankObject) => void;
}

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
      className="w-full rounded-[28px] sm:rounded-3xl border-4 border-orange-300/80 dark:border-orange-500/60 p-2.5 sm:p-3 shadow-[0_8px_20px_-4px_rgba(249,115,22,0.18),0_2px_6px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.75)] dark:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)] transition-all space-y-2 bg-gradient-to-b from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] dark:from-slate-900 dark:via-orange-950/40 dark:to-slate-900"
    >
      {/* Quai xách hình vòm đồ chơi nhựa uốn cong mềm mại (Molded plastic handle arches) */}
      <div className="flex flex-col items-center -mt-2 select-none pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 160 32"
          className="w-32 sm:w-40 h-6 sm:h-7 drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vòm quai xách màu san hô pastel / cam ấm */}
          <path
            d="M 16 30 C 16 10, 48 4, 80 4 C 112 4, 144 10, 144 30"
            stroke="#fb923c"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Vệt phản quang ánh sáng trên bề mặt nhựa đúc */}
          <path
            d="M 32 18 C 48 8, 64 6, 80 6 C 96 6, 112 8, 128 18"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Vành rổ nhựa đúc dày dặn bo tròn */}
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-orange-300 via-amber-200 to-orange-300 dark:from-orange-600 dark:via-amber-500 dark:to-orange-600 border border-orange-400/40 shadow-sm flex items-center justify-between px-3" />
      </div>

      {/* Hàng khe thoáng khí đồ chơi nhựa đúc (Ventilation holes) */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-0.5 select-none" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-4 sm:w-6 rounded-full bg-orange-400/25 dark:bg-orange-300/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] border-b border-white/60 dark:border-white/10"
          />
        ))}
      </div>

      {/* Lưới ô tranh đồ vật: 1 cột khi màn hình hẹp/sidebar hẹp (< sm), 2 cột khi sm trở lên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full">
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
              className={`group relative min-h-[82px] sm:min-h-[80px] w-full p-2.5 sm:p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-150 select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400 ${
                isDisabled
                  ? 'bg-amber-50/40 dark:bg-slate-800/40 border-dashed border-amber-300/60 dark:border-amber-700/50 cursor-not-allowed shadow-inner'
                  : isSelected
                  ? 'bg-orange-100/90 dark:bg-orange-950/70 border-orange-500 scale-[1.03] shadow-md ring-4 ring-orange-300/60 dark:ring-orange-500/40 cursor-grab active:cursor-grabbing'
                  : isDamaged
                  ? 'bg-rose-50/95 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 hover:border-rose-400 hover:shadow-md cursor-pointer'
                  : 'bg-white/95 dark:bg-slate-800/90 border-amber-200/80 dark:border-amber-800/50 hover:border-orange-400 dark:hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
              }`}
              style={{ touchAction: 'none' }}
            >
              {/* Hình ảnh gốc của đồ vật - khi disabled vẫn nhận diện rõ bóng mờ silhouette (không bị cộng dồn opacity làm biến mất) */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center pointer-events-none">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`max-w-full max-h-full object-contain filter drop-shadow pointer-events-none transition-opacity ${
                    isDisabled ? 'opacity-50 grayscale contrast-75' : ''
                  }`}
                  draggable={false}
                />
              </div>

              {/* Nhãn chữ chỉ hiển thị khi giáo viên bật showLabels = true; chế độ trẻ em không có chữ */}
              {showLabels && (
                <span className="text-xs sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate w-full text-center mt-1 pointer-events-none">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chân đế rổ nhựa đúc hoàn thiện chi tiết (Molded base feet) */}
      <div className="w-full flex items-center justify-center gap-3 pt-0.5 select-none pointer-events-none" aria-hidden="true">
        <div className="h-1.5 w-6 rounded-full bg-orange-400/20 dark:bg-orange-400/15" />
        <div className="h-1.5 w-12 rounded-full bg-orange-400/25 dark:bg-orange-400/20" />
        <div className="h-1.5 w-6 rounded-full bg-orange-400/20 dark:bg-orange-400/15" />
      </div>
    </div>
  );
};

export default ObjectBasket;

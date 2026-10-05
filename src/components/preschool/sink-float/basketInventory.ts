import { TankObject } from './types';
import { itemKind } from './playPhysics';

export function basketSlots(items: TankObject[], presets: TankObject[]) {
  return presets.map(preset => {
    const matching = items.filter(item => itemKind(item.id) === preset.id);
    return matching.find(item => !item.inTank) || matching[matching.length - 1] || preset;
  });
}

export function replenishBasket(items: TankObject[], presets: TankObject[], batch: number) {
  if (presets.some(preset => items.some(item => itemKind(item.id) === preset.id && !item.inTank))) return items;
  return [...items, ...presets.map(preset => ({ ...preset, id: `${preset.id}#${batch}` }))];
}

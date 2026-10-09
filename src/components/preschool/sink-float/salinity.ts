import { getFootprintArea } from './tankGeometry';
import { TankDimensions, TankShape } from './types';

// A pedagogical scale: one normal rectangular tank holds 1 litre.
// Shapes and 50%-per-dimension scaling preserve actual volume ratios.
export const ML_PER_WORLD_VOLUME = 1000 / (9.6 * 4.6 * 4.8 * 0.52);
export const SALT_GRAMS_PER_SPOON = 50;
export function waterVolumeMl(shape: TankShape, dimensions: TankDimensions): number {
  return getFootprintArea(shape, dimensions) * dimensions.waterHeight * ML_PER_WORLD_VOLUME;
}
/** Approximate room-temperature brine density; cap at near saturated brine.
 * This illustrates concentration, not laboratory calibration or fixed spoon counts.
 */
export function brineDensity(dissolvedGrams: number, waterMl: number): number {
  const concentration = Math.min(0.36, Math.max(0, dissolvedGrams) / Math.max(1, waterMl));
  return 1 + 0.7 * concentration;
}

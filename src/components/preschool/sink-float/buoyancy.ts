/** Fraction of a sphere/vertical ellipsoid below the water surface. */
export function submergedFraction(centerY: number, radius: number, waterY: number): number {
  const depth = Math.max(0, Math.min(2, (waterY - centerY + radius) / radius));
  return depth * depth * (3 - depth) / 4;
}

/** Solve displaced-volume equilibrium; unlike a linear height ratio, this
 * keeps almost-neutral objects mostly submerged and light objects higher. */
export function floatingCenterY(radius: number, waterY: number, densityRatio: number): number {
  let low = -1;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (submergedFraction(mid, 1, 0) > densityRatio) low = mid;
    else high = mid;
  }
  return waterY + (low + high) / 2 * radius;
}

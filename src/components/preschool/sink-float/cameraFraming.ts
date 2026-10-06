import { TankDimensions } from './types';

/** Fit the normal tank plus a little floor/headroom; compact remains half-size. */
export function tankCameraDistance(dims: TankDimensions, aspect: number, yaw: number, pitch: number) {
  const targetY = dims.height * .4;
  const tanVertical = Math.tan(20 * Math.PI / 180) * .88;
  const tanHorizontal = tanVertical * Math.max(.1, aspect);
  let distance = 0;
  for (const x of [-dims.width / 2, dims.width / 2]) {
    for (const y of [-targetY - .6, dims.height - targetY + .6]) {
      for (const z of [-dims.depth / 2, dims.depth / 2]) {
        const horizontal = x * Math.cos(yaw) - z * Math.sin(yaw);
        const vertical = -x * Math.sin(yaw) * Math.sin(pitch) + y * Math.cos(pitch) - z * Math.cos(yaw) * Math.sin(pitch);
        const depth = x * Math.sin(yaw) * Math.cos(pitch) + y * Math.sin(pitch) + z * Math.cos(yaw) * Math.cos(pitch);
        distance = Math.max(distance, depth + Math.abs(horizontal) / tanHorizontal, depth + Math.abs(vertical) / tanVertical);
      }
    }
  }
  return distance;
}

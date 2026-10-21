/** Editable radial clay shell around a fixed, open cup. Not a geological model. */
export type ClayTool = 'add' | 'smooth' | 'channel' | 'remove';
export const CLAY_ROWS = 32;
export const CLAY_SEGMENTS = 96;
export type ClaySurface = { offsets: number[]; revision: number };
const TAU = Math.PI * 2;
const wrap = (n: number) => (n % CLAY_SEGMENTS + CLAY_SEGMENTS) % CLAY_SEGMENTS;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function createClay(): ClaySurface {
  return { offsets: Array((CLAY_ROWS + 1) * CLAY_SEGMENTS).fill(0), revision: 0 };
}
export function baseRadius(y: number, a: number) {
  const t = clamp((y - .13) / 2.3, 0, 1);
  const body=(1.92 - 1.43 * Math.pow(t, .72)) * (1 + .075 * Math.sin(a * 3 + t) + .035 * Math.sin(a * 7 - t * 2));
  return body + Math.sin(t*Math.PI)*(.035*Math.sin(y*6+a*3)+.009*Math.sin(y*30+a*5));
}
export function clayRadius(surface: ClaySurface, y: number, angle: number) {
  const row = clamp((y - .13) / 2.3 * CLAY_ROWS, 0, CLAY_ROWS);
  const col = ((angle % TAU + TAU) % TAU) / TAU * CLAY_SEGMENTS;
  const r0 = Math.floor(row), r1 = Math.min(CLAY_ROWS, r0 + 1), c0 = Math.floor(col), c1 = wrap(c0 + 1);
  const at = (r: number, c: number) => surface.offsets[r * CLAY_SEGMENTS + wrap(c)];
  const lower = at(r0, c0) * (1 - col % 1) + at(r0, c1) * (col % 1);
  const upper = at(r1, c0) * (1 - col % 1) + at(r1, c1) * (col % 1);
  return baseRadius(y, angle) + lower * (1 - row % 1) + upper * (row % 1);
}
export function clayHeight(surface: ClaySurface, radius: number, angle: number) {
  let lo = .13, hi = 2.43;
  for (let i = 0; i < 16; i++) {
    const y = (lo + hi) / 2;
    if (clayRadius(surface, y, angle) > radius) lo = y; else hi = y;
  }
  return (lo + hi) / 2;
}
/** A brush edits a neighbourhood, with fixed base and open cup rim. */
export function sculptClay(surface: ClaySurface, y: number, angle: number, tool: ClayTool) {
  const previous = surface.offsets.slice();
  for (let row = 1; row < CLAY_ROWS - 1; row++) {
    const py = .13 + row / CLAY_ROWS * 2.3;
    const vertical = (py - y) / (tool === 'channel' ? .32 : .4);
    for (let col = 0; col < CLAY_SEGMENTS; col++) {
      const a = col / CLAY_SEGMENTS * TAU;
      const da = Math.atan2(Math.sin(a - angle), Math.cos(a - angle));
      const angular = da / (tool === 'channel' ? .13 : .28);
      const weight = Math.exp(-(vertical * vertical + angular * angular) * 2);
      if (weight < .005) continue;
      const k = row * CLAY_SEGMENTS + col;
      if (tool === 'smooth') {
        const average = (previous[k] + previous[(row - 1) * CLAY_SEGMENTS + col] + previous[(row + 1) * CLAY_SEGMENTS + col] + previous[row * CLAY_SEGMENTS + wrap(col - 1)] + previous[row * CLAY_SEGMENTS + wrap(col + 1)]) / 5;
        surface.offsets[k] += (average - previous[k]) * weight * .8;
      } else {
        const strength = tool === 'add' ? .09 : tool === 'channel' ? -.055 : -.07;
        surface.offsets[k] = clamp(previous[k] + strength * weight, -.24, .34);
      }
    }
  }
  // Preserve a descending shell: no folded triangles or unsupported overhangs.
  for (let col = 0; col < CLAY_SEGMENTS; col++) for (let row = CLAY_ROWS - 2; row >= 1; row--) {
    const a = col / CLAY_SEGMENTS * TAU, y = .13 + row / CLAY_ROWS * 2.3;
    const next = baseRadius(y + 2.3 / CLAY_ROWS, a) + surface.offsets[(row + 1) * CLAY_SEGMENTS + col];
    surface.offsets[row * CLAY_SEGMENTS + col] = Math.max(surface.offsets[row * CLAY_SEGMENTS + col], next + .008 - baseRadius(y, a));
  }
  surface.revision++;
}
export type FlowPoint = { x: number; y: number; z: number; angle: number };
/** Follow the lowest reachable adjacent surface at successive outward radii. */
export function traceClayFlow(surface: ClaySurface, startAngle: number): FlowPoint[] {
  const points: FlowPoint[] = [];
  let angle = startAngle, lastY = 2.46;
  for (let step = 0; step <= 72; step++) {
    const radius = .48 + step / 72 * 1.65;
    if (step > 0) {
      let best = Infinity, bestAngle = angle;
      for (const turn of [-.055, -.0275, 0, .0275, .055]) {
        const candidate = angle + turn;
        const score = clayHeight(surface, radius, candidate) + Math.abs(turn) * .06;
        if (score < best) { best = score; bestAngle = candidate; }
      }
      angle = bestAngle;
    }
    const y = Math.min(lastY, clayHeight(surface, radius, angle) + .022);
    lastY = y;
    points.push({ x: Math.cos(angle) * radius + .09, y, z: Math.sin(angle) * radius, angle });
  }
  return points;
}

import { dropRadius, forces, PHYSICS, type LampState } from './lavaPhysics';
type Options = { step: number; color: string; light: boolean; showForces: boolean };
export function drawLamp(ctx: CanvasRenderingContext2D, state: LampState, options: Options) {
  const w = 480, h = 600, left = 160, width = 160, bottom = 548;
  const scale = width / PHYSICS.width;
  const px = (x: number) => 240 + x * scale;
  const py = (y: number) => bottom - y * scale;
  const waterY = py(PHYSICS.waterTop), oilY = py(PHYSICS.oilTop);
  const color = options.step >= 3 ? options.color : '#aed5e1';
  ctx.clearRect(0, 0, w, h);
  const background = ctx.createRadialGradient(240, 320, 40, 240, 320, 330);
  background.addColorStop(0, options.light ? '#172c3b' : '#122131'); background.addColorStop(1, '#08121f');
  ctx.fillStyle = background; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#14202c'; ctx.fillRect(0, 550, w, 50);
  ctx.fillStyle = '#0008'; ctx.beginPath(); ctx.ellipse(240, 558, 109, 10, 0, 0, Math.PI * 2); ctx.fill();
  if (options.light) {
    const beam = ctx.createLinearGradient(0, 140, 0, 565);
    beam.addColorStop(0, '#fff4c000'); beam.addColorStop(1, '#ffecb236');
    ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(135, 545); ctx.lineTo(198, 80); ctx.lineTo(280, 80); ctx.lineTo(345, 545); ctx.fill();
  }
  ctx.save(); ctx.beginPath(); ctx.roundRect(left, 6, width, bottom - 6, [5, 5, 18, 18]); ctx.clip();
  const glass = ctx.createLinearGradient(left, 0, left + width, 0);
  glass.addColorStop(0, '#bde5fa1f'); glass.addColorStop(0.2, '#e3f6ff03'); glass.addColorStop(0.83, '#a6ceea0a'); glass.addColorStop(1, '#bde5fa27');
  ctx.fillStyle = glass; ctx.fillRect(left, 6, width, bottom - 6);
  if (options.step >= 2) {
    const oil = ctx.createLinearGradient(0, oilY, 0, waterY);
    oil.addColorStop(0, options.light ? '#d7bc6450' : '#b5a85840'); oil.addColorStop(1, '#99854325');
    ctx.fillStyle = oil; ctx.fillRect(left, oilY, width, waterY - oilY);
    ctx.strokeStyle = '#e5d49999'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(240, oilY, width / 2, 2.5, 0, 0, Math.PI * 2); ctx.stroke();
  }
  if (options.step >= 1) {
    const pool = ctx.createLinearGradient(0, waterY, 0, bottom);
    pool.addColorStop(0, color + 'c0'); pool.addColorStop(1, color + '70');
    ctx.fillStyle = pool; ctx.fillRect(left, waterY, width, bottom - waterY);
    ctx.fillStyle = color + 'db'; ctx.beginPath(); ctx.ellipse(240, waterY, width / 2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff38'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(left, waterY - 1); ctx.lineTo(left + width, waterY - 1); ctx.stroke();
  }
  const bubble = (x: number, y: number, radius: number) => {
    ctx.fillStyle = '#dffaff0d'; ctx.strokeStyle = '#dffaffb0'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(x, y, Math.max(1, radius), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#ffffffdc'; ctx.beginPath(); ctx.arc(x - radius * 0.1, y - radius * 0.1, radius * 0.72, Math.PI, Math.PI * 1.5); ctx.stroke();
  };
  for (const item of state.tablets) {
    const radius = 7 * Math.cbrt(item.remaining / 0.25);
    ctx.fillStyle = '#f6efe2'; ctx.strokeStyle = '#c3b9a8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(px(item.x), py(item.y), Math.max(1, radius), Math.max(1, radius * 0.42), -0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  for (const item of state.bubbles) bubble(px(item.x), py(item.y), item.radius * scale);
  for (let i = 0; i < state.drops.length; i++) {
    const drop = state.drops[i], x = px(drop.x), y = py(drop.y), radius = dropRadius(drop) * scale;
    // Volume stays in physics; area-preserving ellipses are a restrained visual deformation.
    const stretch = 1 + Math.min(0.20, Math.abs(drop.vy) * 3);
    ctx.save(); ctx.translate(x, y); ctx.scale(1 / stretch, stretch);
    const fill = ctx.createRadialGradient(-radius * 0.35, -radius * 0.4, radius * 0.08, 0, 0, radius);
    fill.addColorStop(0, '#ffffffbd'); fill.addColorStop(0.28, color + 'd9'); fill.addColorStop(0.78, color + 'c2'); fill.addColorStop(1, color + '70');
    ctx.fillStyle = fill; ctx.strokeStyle = color; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#fff8'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(-radius * 0.15, -radius * 0.15, radius * 0.6, Math.PI, Math.PI * 1.47); ctx.stroke(); ctx.restore();
    if (drop.gasVolume > 0) {
      const gasRadius = Math.cbrt(3 * drop.gasVolume / (4 * Math.PI)) * scale;
      bubble(x, y - radius * stretch - gasRadius * 0.7, gasRadius);
    }
    if (options.showForces && i === 0) {
      const force = forces(drop);
      const arrow = (length: number, direction: number, ink: string, dx: number) => {
        ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 2;
        const ax = x + dx, end = y + direction * length;
        ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(ax, end); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax, end); ctx.lineTo(ax - 4, end - direction * 7); ctx.lineTo(ax + 4, end - direction * 7); ctx.fill();
      };
      const maximum = Math.max(force.buoyancy, force.weight, Math.abs(force.drag), 1e-9);
      const factor = 46 / maximum;
      arrow(force.buoyancy * factor, -1, '#6ee7b7', -5);
      arrow(force.weight * factor, 1, '#fda4af', 5);
      if (Math.abs(force.drag) > 1e-8) arrow(Math.abs(force.drag) * factor, force.drag > 0 ? -1 : 1, '#7dd3fc', 15);
      ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, radius + 5, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
  // Thin open glass lip and asymmetric highlights, never a lid or heater.
  ctx.strokeStyle = '#c3dbe885'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(left - 2, 5, width + 4, bottom - 2, [5, 5, 18, 18]); ctx.stroke();
  ctx.strokeStyle = '#ffffffa0'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(240, 7, width / 2 + 2, 4, 0, 0, Math.PI * 2); ctx.stroke();
  const reflection = ctx.createLinearGradient(left + 5, 0, left + 18, 0);
  reflection.addColorStop(0, '#e7f8ff00'); reflection.addColorStop(0.4, '#e7f8ff40'); reflection.addColorStop(1, '#e7f8ff00');
  ctx.fillStyle = reflection; ctx.fillRect(left + 5, 17, 13, bottom - 37);
  ctx.strokeStyle = '#e3f3ff35'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(left + width - 7, 24); ctx.lineTo(left + width - 7, bottom - 20); ctx.stroke();
  ctx.font = '13px Inter, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = '#a3b7c8';
  const label = (text: string, y: number) => { ctx.fillText(text, left - 20, y + 4); ctx.strokeStyle = '#64748b70'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(left - 15, y); ctx.lineTo(left - 5, y); ctx.stroke(); };
  if (options.step >= 2) label('Dầu ăn', (waterY + oilY) / 2);
  if (options.step >= 1) label(options.step >= 3 && options.color !== '#c7e4ed' ? 'Nước màu' : 'Nước', waterY + 75);
  ctx.textAlign = 'center'; ctx.fillStyle = '#72889a'; ctx.font = '12px Inter, sans-serif';
  ctx.fillText(options.step === 0 ? 'Bình mở · con bắt đầu với nước nhé' : 'Bình luôn mở · không dùng nhiệt', 240, 583);
}

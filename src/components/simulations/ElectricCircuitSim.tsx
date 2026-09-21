import React, { useState, useEffect, useRef } from 'react';
import { Zap, Code, Power } from 'lucide-react';
import { SIMULATIONS } from '../../data/curriculumData';
import { CodeInspectorModal } from './CodeInspectorModal';

export const ElectricCircuitSim: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [resistance, setResistance] = useState<number>(6); // Ohms
  const [isOpenSwitch, setIsOpenSwitch] = useState<boolean>(false); // False = Closed circuit (ON)
  const [showCode, setShowCode] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Electrical calculations
  const current = isOpenSwitch ? 0 : voltage / resistance; // I = U / R
  const power = isOpenSwitch ? 0 : current * voltage; // P = U * I

  const simData = SIMULATIONS.find(s => s.id === 'sim-electric-circuit')!;

  // Particles for electron flow
  const electronsRef = useRef<{ pos: number }[]>(
    Array.from({ length: 28 }, (_, i) => ({ pos: i / 28 }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    // Circuit geometry parameters (scaled inside canvas)
    const rectX = 40;
    const rectY = 30;
    const rectW = 280;
    const rectH = 140;
    const perimeter = 2 * (rectW + rectH);

    const getPointOnCircuit = (t: number) => {
      const dist = (t % 1) * perimeter;
      if (dist < rectW) {
        return { x: rectX + dist, y: rectY }; // Top wire (left to right)
      } else if (dist < rectW + rectH) {
        return { x: rectX + rectW, y: rectY + (dist - rectW) }; // Right wire (down)
      } else if (dist < 2 * rectW + rectH) {
        return { x: rectX + rectW - (dist - (rectW + rectH)), y: rectY + rectH }; // Bottom wire (right to left)
      } else {
        return { x: rectX, y: rectY + rectH - (dist - (2 * rectW + rectH)) }; // Left wire (up)
      }
    };

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Wires
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeRect(rectX, rectY, rectW, rectH);

      // 1. Draw Battery on Left wire (rectX, rectY + rectH/2)
      const batY = rectY + rectH / 2;
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(rectX - 10, batY - 25, 20, 50);

      // Long plate (+)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rectX - 12, batY - 14);
      ctx.lineTo(rectX + 12, batY - 14);
      ctx.stroke();

      // Short plate (-)
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(rectX - 7, batY + 14);
      ctx.lineTo(rectX + 7, batY + 14);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('+', rectX + 15, batY - 12);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('-', rectX + 15, batY + 16);

      // 2. Draw Resistor on Top wire (rectX + rectW/2, rectY)
      const resX = rectX + rectW / 2;
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(resX - 25, rectY - 10, 50, 20);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(resX - 25, rectY);
      ctx.lineTo(resX - 15, rectY - 8);
      ctx.lineTo(resX - 5, rectY + 8);
      ctx.lineTo(resX + 5, rectY - 8);
      ctx.lineTo(resX + 15, rectY + 8);
      ctx.lineTo(resX + 25, rectY);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText(`${resistance}Ω`, resX - 8, rectY - 14);

      // 3. Draw Light Bulb on Bottom wire (rectX + rectW/2, rectY + rectH)
      const bulbX = rectX + rectW / 2;
      const bulbY = rectY + rectH;
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(bulbX - 20, bulbY - 20, 40, 40);

      // Bulb Glow halo
      if (!isOpenSwitch && current > 0) {
        const glowRadius = Math.min(35, 10 + current * 8);
        const glow = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, glowRadius);
        glow.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
        glow.addColorStop(0.5, 'rgba(234, 179, 8, 0.4)');
        glow.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bulb Glass circle
      ctx.strokeStyle = !isOpenSwitch && current > 0 ? '#fef08a' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Filament
      ctx.strokeStyle = !isOpenSwitch && current > 0 ? '#ffffff' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bulbX - 4, bulbY + 5);
      ctx.lineTo(bulbX, bulbY - 4);
      ctx.lineTo(bulbX + 4, bulbY + 5);
      ctx.stroke();

      // 4. Draw Switch on Right wire (rectX + rectW, rectY + rectH/2)
      const swY = rectY + rectH / 2;
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(rectX + rectW - 10, swY - 20, 20, 40);
      // Terminals
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(rectX + rectW, swY - 14, 3, 0, Math.PI * 2);
      ctx.arc(rectX + rectW, swY + 14, 3, 0, Math.PI * 2);
      ctx.fill();

      // Switch blade
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rectX + rectW, swY - 14);
      if (isOpenSwitch) {
        ctx.lineTo(rectX + rectW + 12, swY + 4); // open blade
      } else {
        ctx.lineTo(rectX + rectW, swY + 14); // closed blade
      }
      ctx.stroke();

      // 5. Draw Animated Electron Particles
      const speedFactor = isOpenSwitch ? 0 : current * 0.08;
      electronsRef.current.forEach((el) => {
        el.pos = (el.pos + speedFactor * dt) % 1;
        const pt = getPointOnCircuit(el.pos);

        // Draw glowing electron
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = isOpenSwitch ? 0 : 4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [voltage, resistance, isOpenSwitch, current]);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Sim Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#141d2e]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-400" />
          <span className="font-medium text-slate-200 text-sm">Mô phỏng 3: Phòng Lab Mạch Điện DC & Định Luật Ohm</span>
          <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">THCS (Lớp 8)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpenSwitch(!isOpenSwitch)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium transition ${
              isOpenSwitch
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {isOpenSwitch ? 'Đóng Công Tắc (BẬT)' : 'Ngắt Công Tắc (TẮT)'}
          </button>
          <button
            onClick={() => setShowCode(true)}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 px-3 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition font-mono"
          >
            <Code className="w-3.5 h-3.5" />
            Inspect Code
          </button>
        </div>
      </div>

      {/* Sim Content */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Canvas Area */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#0b0f17] border border-slate-800/80 rounded-xl relative">
          <canvas
            ref={canvasRef}
            width={360}
            height={200}
            className="w-full max-w-[340px] h-auto"
          />

          {/* Real-time Meters Dashboard */}
          <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Hiệu điện thế U</span>
              <span className="text-sm font-bold text-sky-400">{voltage.toFixed(1)} V</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Dòng điện I</span>
              <span className="text-sm font-bold text-emerald-400">{current.toFixed(2)} A</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Công suất P</span>
              <span className="text-sm font-bold text-amber-400">{power.toFixed(1)} W</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 text-xs">
          <div className="text-slate-400">
            Điều chỉnh thông số nguồn và linh kiện để quan sát tốc độ trôi của các electron xanh:
          </div>

          {/* Voltage Slider */}
          <div className="space-y-1 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex justify-between font-mono">
              <span className="text-sky-300 font-medium">Nguồn điện U (Volt):</span>
              <span className="text-sky-400 font-bold">{voltage} V</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1V (Pin tiểu)</span>
              <span>12V (Ắc quy)</span>
              <span>24V (Nguồn mạnh)</span>
            </div>
          </div>

          {/* Resistance Slider */}
          <div className="space-y-1 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex justify-between font-mono">
              <span className="text-amber-300 font-medium">Điện trở R (Ohm):</span>
              <span className="text-amber-400 font-bold">{resistance} Ω</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1Ω (Dẫn điện tốt)</span>
              <span>15Ω</span>
              <span>30Ω (Cản trở mạnh)</span>
            </div>
          </div>

          {/* First Principles Insight Box */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-slate-400 text-[11px] leading-relaxed">
            <span className="text-sky-400 font-semibold font-mono">Quan sát vật lý: </span>
            Khi <strong className="text-slate-200">tăng U</strong>, máy bơm điện mạnh hơn khiến electron chạy nhanh hơn. 
            Khi <strong className="text-slate-200">tăng R</strong>, vật cản trở nhiều hơn khiến electron chậm lại.
          </div>
        </div>
      </div>

      <CodeInspectorModal
        simulation={simData}
        isOpen={showCode}
        onClose={() => setShowCode(false)}
      />
    </div>
  );
};

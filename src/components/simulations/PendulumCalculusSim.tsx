import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Code, Waves } from 'lucide-react';
import { SIMULATIONS } from '../../data/curriculumData';
import { CodeInspectorModal } from './CodeInspectorModal';

export const PendulumCalculusSim: React.FC = () => {
  const [lengthM, setLengthM] = useState<number>(1.2); // Length in meters
  const [massKg] = useState<number>(1.0); // Bob mass in kg
  const [gravity, setGravity] = useState<number>(9.8); // m/s^2
  const [initialAngleDeg, setInitialAngleDeg] = useState<number>(30); // degrees
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showCode, setShowCode] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Physics state
  const stateRef = useRef<{ theta: number; omega: number; time: number; history: { t: number; x: number; v: number; a: number }[] }>({
    theta: (initialAngleDeg * Math.PI) / 180,
    omega: 0,
    time: 0,
    history: []
  });

  const simData = SIMULATIONS.find(s => s.id === 'sim-pendulum-calculus')!;

  const handleReset = () => {
    stateRef.current = {
      theta: (initialAngleDeg * Math.PI) / 180,
      omega: 0,
      time: 0,
      history: []
    };
  };

  useEffect(() => {
    handleReset();
  }, [initialAngleDeg, lengthM, gravity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta time
      lastTime = now;

      if (isPlaying) {
        // Numerical Integration: Euler-Cromer (symplectic, conserves energy)
        const alpha = -(gravity / lengthM) * Math.sin(stateRef.current.theta);
        stateRef.current.omega += alpha * dt;
        stateRef.current.theta += stateRef.current.omega * dt;
        stateRef.current.time += dt;

        // Record history for mini-chart
        stateRef.current.history.push({
          t: stateRef.current.time,
          x: stateRef.current.theta,
          v: stateRef.current.omega,
          a: alpha
        });
        if (stateRef.current.history.length > 100) {
          stateRef.current.history.shift();
        }
      }

      const { theta, omega } = stateRef.current;
      const alpha = -(gravity / lengthM) * Math.sin(theta);

      // Calculations for display
      const currentHeight = lengthM * (1 - Math.cos(theta));
      const potentialEnergy = massKg * gravity * currentHeight;
      const linearVelocity = omega * lengthM;
      const kineticEnergy = 0.5 * massKg * linearVelocity * linearVelocity;
      const totalEnergy = Math.max(0.001, potentialEnergy + kineticEnergy);

      // Draw Simulation
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Energy Meter at bottom left of canvas
      const eBarX = 15;
      const eBarY = 165;
      const eBarW = 100;
      const eBarH = 8;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(eBarX, eBarY, eBarW, eBarH);
      const keWidth = (kineticEnergy / totalEnergy) * eBarW;
      const peWidth = (potentialEnergy / totalEnergy) * eBarW;
      ctx.fillStyle = '#38bdf8'; // Wđ
      ctx.fillRect(eBarX, eBarY, keWidth, eBarH);
      ctx.fillStyle = '#f59e0b'; // Wt
      ctx.fillRect(eBarX + keWidth, eBarY, peWidth, eBarH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(eBarX, eBarY, eBarW, eBarH);

      ctx.fillStyle = '#64748b';
      ctx.font = '8px monospace';
      ctx.fillText('Wđ (động)', eBarX, eBarY - 3);
      ctx.fillText('Wt (thế)', eBarX + 65, eBarY - 3);

      // Pivot position in canvas
      const pivotX = 140;
      const pivotY = 25;
      const pixelsPerMeter = 80;
      const bobDistancePx = lengthM * pixelsPerMeter;

      const bobX = pivotX + bobDistancePx * Math.sin(theta);
      const bobY = pivotY + bobDistancePx * Math.cos(theta);

      // 1. Draw Pivot
      ctx.fillStyle = '#475569';
      ctx.fillRect(pivotX - 20, pivotY - 6, 40, 6);
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // 2. Draw Arc / Trajectory guideline
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, bobDistancePx, Math.PI / 2 - 0.7, Math.PI / 2 + 0.7);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Rod
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // 4. Draw Vectors on Bob (Calculus in action)
      // Velocity Vector (Cyan) - perpendicular to rod
      const vScale = 12;
      const vx = linearVelocity * Math.cos(theta) * vScale;
      const vy = -linearVelocity * Math.sin(theta) * vScale;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();

      // Acceleration Vector (Amber) - tangential
      const aScale = 2.5;
      const linAcc = alpha * lengthM;
      const ax = linAcc * Math.cos(theta) * aScale;
      const ay = -linAcc * Math.sin(theta) * aScale;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + ax, bobY + ay);
      ctx.stroke();

      // 5. Draw Bob
      const glowGrad = ctx.createRadialGradient(bobX, bobY, 2, bobX, bobY, 18);
      glowGrad.addColorStop(0, '#38bdf8');
      glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bobX, bobY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 6. Draw Mini Real-time Waveform Oscilloscope (right side of canvas)
      const graphX = 260;
      const graphY = 30;
      const graphW = 110;
      const graphH = 110;

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      // Center zero line
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();

      // Plot x(t) in green, v(t) in cyan
      if (stateRef.current.history.length > 2) {
        // Plot theta (Position)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        stateRef.current.history.forEach((pt, i) => {
          const px = graphX + (i / 100) * graphW;
          const py = graphY + graphH / 2 - pt.x * 35;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Plot v (Velocity)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        stateRef.current.history.forEach((pt, i) => {
          const px = graphX + (i / 100) * graphW;
          const py = graphY + graphH / 2 - pt.v * 12;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      ctx.font = '9px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('x(t)', graphX + 6, graphY + 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText("v(t)=x'", graphX + 36, graphY + 14);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, lengthM, gravity, massKg]);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Sim Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#141d2e]">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-slate-200 text-sm">Mô phỏng 4: Con Lắc Đơn & Vi Tích Phân Thời Gian Thực</span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">THPT (Lớp 11)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isPlaying ? 'Tạm dừng' : 'Chạy'}
          </button>
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-white p-1 rounded bg-slate-800 hover:bg-slate-750 transition"
            title="Làm mới"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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
            width={380}
            height={190}
            className="w-full max-w-[370px] h-auto"
          />

          {/* Real-time Calculus & Energy Bar */}
          <div className="w-full mt-3 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> {"Vận tốc vector v (Cyan)"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> {"Gia tốc vector a (Amber)"}
              </span>
              <span className="text-emerald-400 font-semibold">Cơ năng E bảo toàn</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3.5 text-xs">
          {/* Initial Angle */}
          <div className="space-y-1 p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Góc lệch ban đầu $\theta_0$:</span>
              <span className="text-emerald-400 font-bold">{initialAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="75"
              step="1"
              value={initialAngleDeg}
              onChange={(e) => setInitialAngleDeg(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Length */}
          <div className="space-y-1 p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Chiều dài dây $L$:</span>
              <span className="text-sky-400 font-bold">{lengthM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={lengthM}
              onChange={(e) => setLengthM(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded cursor-pointer accent-sky-400"
            />
          </div>

          {/* Gravity presets */}
          <div className="space-y-1 p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-slate-400 block mb-1.5 font-mono">Môi trường trọng trường $g$:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setGravity(9.8)}
                className={`py-1 rounded font-mono text-[11px] transition ${
                  gravity === 9.8 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Trái Đất (9.8)
              </button>
              <button
                onClick={() => setGravity(1.6)}
                className={`py-1 rounded font-mono text-[11px] transition ${
                  gravity === 1.6 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Mặt Trăng (1.6)
              </button>
              <button
                onClick={() => setGravity(3.7)}
                className={`py-1 rounded font-mono text-[11px] transition ${
                  gravity === 3.7 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Sao Hỏa (3.7)
              </button>
            </div>
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

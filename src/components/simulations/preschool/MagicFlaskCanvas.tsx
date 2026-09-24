import React, { useEffect, useRef } from 'react';

interface Props {
  r: number;
  g: number;
  b: number;
  isDropping: boolean;
  droppingColor: string;
}

export const MagicFlaskCanvas: React.FC<Props> = ({
  r,
  g,
  b,
  isDropping,
  droppingColor
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Bubbles inside liquid
  const bubblesRef = useRef<
    { x: number; y: number; r: number; speed: number; opacity: number }[]
  >(
    Array.from({ length: 12 }, () => ({
      x: 70 + Math.random() * 100,
      y: 130 + Math.random() * 80,
      r: 2 + Math.random() * 3.5,
      speed: 0.5 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  );

  // Falling drop animation
  const dropRef = useRef<{ y: number; active: boolean; color: string }>({
    y: 10,
    active: false,
    color: '#ff3333',
  });

  useEffect(() => {
    if (isDropping) {
      dropRef.current = {
        y: 15,
        active: true,
        color: droppingColor,
      };
    }
  }, [isDropping, droppingColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waveOffset += 0.04;

      const centerX = canvas.width / 2;

      // 1. Draw falling drop if active
      if (dropRef.current.active) {
        dropRef.current.y += 9;
        ctx.fillStyle = dropRef.current.color;
        ctx.shadowColor = dropRef.current.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(centerX, dropRef.current.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Splashed into flask neck/liquid
        if (dropRef.current.y >= 115) {
          dropRef.current.active = false;
        }
      }

      // 2. Draw Magic Flask Glass Container
      ctx.save();
      ctx.beginPath();
      // Flask neck
      ctx.moveTo(centerX - 24, 45);
      ctx.lineTo(centerX - 24, 90);
      // Flask bell body
      ctx.bezierCurveTo(centerX - 40, 110, centerX - 90, 150, centerX - 85, 215);
      // Bottom flat curve
      ctx.bezierCurveTo(centerX - 80, 235, centerX + 80, 235, centerX + 85, 215);
      // Right bell body
      ctx.bezierCurveTo(centerX + 90, 150, centerX + 40, 110, centerX + 24, 90);
      // Right neck
      ctx.lineTo(centerX + 24, 45);
      ctx.closePath();

      // Clip liquid inside the flask body
      ctx.save();
      ctx.clip();

      // Flask background shadow
      ctx.fillStyle = '#060a12';
      ctx.fill();

      // Liquid body (from y=115 to bottom)
      const liquidLevelY = 115;
      ctx.beginPath();
      ctx.moveTo(centerX - 95, liquidLevelY);

      // Wavy surface of liquid
      for (let x = centerX - 95; x <= centerX + 95; x += 5) {
        const y = liquidLevelY + Math.sin(x * 0.05 + waveOffset) * 3.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(centerX + 95, 240);
      ctx.lineTo(centerX - 95, 240);
      ctx.closePath();

      // Liquid Gradient
      const grad = ctx.createLinearGradient(0, liquidLevelY, 0, 230);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
      grad.addColorStop(1, `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 0.95)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Floating Magic Bubbles
      bubblesRef.current.forEach((bObj) => {
        bObj.y -= bObj.speed;
        if (bObj.y < liquidLevelY + 4) {
          bObj.y = 210 + Math.random() * 15;
          bObj.x = centerX - 60 + Math.random() * 120;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${bObj.opacity})`;
        ctx.beginPath();
        ctx.arc(bObj.x, bObj.y, bObj.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Liquid surface reflection highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = centerX - 70; x <= centerX + 70; x += 5) {
        const y = liquidLevelY + Math.sin(x * 0.05 + waveOffset) * 3.5;
        if (x === centerX - 70) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.restore(); // unclip

      // 3. Glass Highlights & Outer Border
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Flask Rim / Lip at the top
      ctx.beginPath();
      ctx.ellipse(centerX, 45, 28, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Glass shine curve on the left
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX - 48, 170, 36, Math.PI * 0.75, Math.PI * 1.25);
      ctx.stroke();

      ctx.restore();

      // 4. Glow around the flask
      const outerGlow = ctx.createRadialGradient(
        centerX,
        170,
        20,
        centerX,
        170,
        110
      );
      outerGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, 170, 110, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [r, g, b]);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <canvas
        ref={canvasRef}
        width={260}
        height={250}
        className="w-full max-w-[240px] h-auto drop-shadow-2xl"
      />
    </div>
  );
};

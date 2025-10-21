'use client';
import { useRef, useEffect } from 'react';
type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  vx: number;
  vy: number;
};

const DotGrid = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const dotSize = 6;
  const gap = 15;
  const proximity = 100;
  const speedTrigger = 100;
  const shockRadius = 200;
  const shockStrength = 6;
  const maxSpeed = 3000;
  const resistance = 500;
  const returnSpeed = 0.1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const cols = Math.floor(width / (dotSize + gap));
      const rows = Math.floor(height / (dotSize + gap));
      const startX = (width - cols * (dotSize + gap)) / 2 + dotSize / 2;
      const startY = (height - rows * (dotSize + gap)) / 2 + dotSize / 2;

      const dots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cx = startX + x * (dotSize + gap);
          const cy = startY + y * (dotSize + gap);
          dots.push({
            cx,
            cy,
            xOffset: 0,
            yOffset: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
      dotsRef.current = dots;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    let animationId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pr = pointerRef.current;

      for (const dot of dotsRef.current) {
        // 물리 계산
        dot.vx -= dot.xOffset * returnSpeed;
        dot.vy -= dot.yOffset * returnSpeed;

        dot.vx *= 1 - returnSpeed;
        dot.vy *= 1 - returnSpeed;

        dot.xOffset += dot.vx;
        dot.yOffset += dot.vy;

        const dx = dot.cx - pr.x;
        const dy = dot.cy - pr.y;
        const distSq = dx * dx + dy * dy;

        let color = '#434C66';
        if (distSq < proximity * proximity) {
          const t = 1 - Math.sqrt(distSq) / proximity;
          const r = Math.round(82 + (255 - 82) * t);
          const g = Math.round(39 + (255 - 39) * t);
          const b = Math.round(255 + (255 - 255) * t);
          color = `rgb(${r},${g},${b})`;
        }

        ctx.beginPath();
        ctx.arc(dot.cx + dot.xOffset, dot.cy + dot.yOffset, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: any) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      if (speed > speedTrigger) {
        for (const dot of dotsRef.current) {
          const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
          if (dist < proximity) {
            const pushX = (dot.cx - pr.x + vx * 0.01) / resistance;
            const pushY = (dot.cy - pr.y + vy * 0.01) / resistance;
            dot.vx += pushX;
            dot.vy += pushY;
          }
        }
      }
    };

    const handleClick = (e: any) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius) {
          const falloff = 1 - dist / shockRadius;
          const pushX = ((dot.cx - cx) * shockStrength * falloff) / resistance;
          const pushY = ((dot.cy - cy) * shockStrength * falloff) / resistance;
          dot.vx += pushX;
          dot.vy += pushY;
        }
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <section className="relative flex h-full w-full items-center justify-center pt-4 pl-4 opacity-50">
      <div ref={wrapperRef} className="relative h-full w-full">
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
};

export default DotGrid;

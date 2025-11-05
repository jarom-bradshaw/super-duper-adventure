import { useEffect, useRef } from 'react';

export default function FroggerMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const dirRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const stateRef = useRef({ w: 480, h: 320, gx: 7, gy: 15, cols: 16, rows: 16, cars: [] as { x: number; y: number; v: number }[], logs: [] as { x: number; y: number; v: number }[], score: 0, alive: true });
  useEffect(() => {
    const s = stateRef.current;
    for (let i = 0; i < 5; i++) s.cars.push({ x: Math.random() * s.w, y: 12 * 16 + (i%2)*16, v: (i%2? -90: 120) });
    for (let i = 0; i < 5; i++) s.logs.push({ x: Math.random() * s.w, y: 6 * 16 + (i%2)*16, v: (i%2? 70: -110) });
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') dirRef.current = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' || e.key === 's') dirRef.current = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' || e.key === 'a') dirRef.current = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' || e.key === 'd') dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000); last = t;
      const s = stateRef.current; if (!s.alive) return;
      // move frog
      if (dirRef.current.x || dirRef.current.y) {
        s.gx = Math.max(0, Math.min(s.cols - 1, s.gx + dirRef.current.x));
        s.gy = Math.max(0, Math.min(s.rows - 1, s.gy + dirRef.current.y));
        dirRef.current = { x: 0, y: 0 };
      }
      // move cars/logs
      for (const c of s.cars) { c.x += c.v * dt; if (c.x < -40) c.x = s.w + 40; if (c.x > s.w + 40) c.x = -40; }
      for (const l of s.logs) { l.x += l.v * dt; if (l.x < -60) l.x = s.w + 60; if (l.x > s.w + 60) l.x = -60; }
      // collisions
      const fx = s.gx * 16 + 8; const fy = s.gy * 16 + 8;
      // road rows 12-13
      if (s.gy >= 12 && s.gy <= 13) {
        for (const c of s.cars) if (Math.abs(fy - c.y) < 10 && Math.abs(fx - c.x) < 14) s.alive = false;
      }
      // river rows 6-7 : must be on a log; carry frog with log velocity
      if (s.gy >= 6 && s.gy <= 7) {
        let onLog = false;
        for (const l of s.logs) {
          if (Math.abs(fy - l.y) < 10 && Math.abs(fx - l.x) < 22) {
            onLog = true;
            // move frog along log velocity in continuous space then snap to grid
            const nx = fx + l.v * dt; // carry
            const snapped = Math.max(0, Math.min(s.cols - 1, Math.floor(nx / 16)));
            s.gx = snapped;
            break;
          }
        }
        if (!onLog) s.alive = false;
      }
      // goal at row 2
      if (s.gy === 2) { s.score += 1; s.gx = 7; s.gy = 15; }
      // draw
      ctx.clearRect(0,0,s.w,s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,s.w,s.h);
      // lanes
      ctx.fillStyle = '#233'; ctx.fillRect(0, 6*16, s.w, 2*16); // river
      ctx.fillStyle = '#322'; ctx.fillRect(0, 12*16, s.w, 2*16); // road
      // logs
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--meteor-color') || '#0ff';
      for (const l of s.logs) ctx.fillRect(l.x - 20, l.y - 6, 40, 12);
      // cars
      ctx.fillStyle = '#fff';
      for (const c of s.cars) ctx.fillRect(c.x - 12, c.y - 6, 24, 12);
      // frog
      ctx.fillStyle = '#7f7'; ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.fillText(`Score: ${s.score}`, 10, 18);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);
  return (
    <div className="mx-auto">
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Frogger — Arrows</div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



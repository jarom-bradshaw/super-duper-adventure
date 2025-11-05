import { useEffect, useRef } from 'react';

export default function PongMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const keys = useRef({ up: false, down: false });
  const stateRef = useRef({
    w: 480, h: 320,
    ballX: 240, ballY: 160, vx: 180, vy: 140,
    p1Y: 140, p2Y: 140, padW: 10, padH: 60, padSpeed: 220
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'w' || e.key === 'ArrowUp') keys.current.up = down;
      if (e.key === 's' || e.key === 'ArrowDown') keys.current.down = down;
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, []);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const s = stateRef.current;
      // input
      if (keys.current.up) s.p1Y -= s.padSpeed * dt;
      if (keys.current.down) s.p1Y += s.padSpeed * dt;
      s.p1Y = Math.max(0, Math.min(s.h - s.padH, s.p1Y));
      // simple AI
      const target = s.ballY - s.padH / 2;
      const aiSpeed = 180;
      if (s.p2Y < target) s.p2Y = Math.min(s.p2Y + aiSpeed * dt, target);
      if (s.p2Y > target) s.p2Y = Math.max(s.p2Y - aiSpeed * dt, target);
      s.p2Y = Math.max(0, Math.min(s.h - s.padH, s.p2Y));
      // ball
      s.ballX += s.vx * dt;
      s.ballY += s.vy * dt;
      if (s.ballY < 0) { s.ballY = 0; s.vy *= -1; }
      if (s.ballY > s.h) { s.ballY = s.h; s.vy *= -1; }
      // collide paddles
      if (s.ballX < 20 && s.ballY > s.p1Y && s.ballY < s.p1Y + s.padH) { s.ballX = 20; s.vx = Math.abs(s.vx); }
      if (s.ballX > s.w - 20 && s.ballY > s.p2Y && s.ballY < s.p2Y + s.padH) { s.ballX = s.w - 20; s.vx = -Math.abs(s.vx); }
      // wrap score (reset)
      if (s.ballX < -10 || s.ballX > s.w + 10) { s.ballX = s.w/2; s.ballY = s.h/2; s.vx *= -1; }
      // draw
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, s.w, s.h);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#fff';
      ctx.fillRect(10, s.p1Y, s.padW, s.padH);
      ctx.fillRect(s.w - 20, s.p2Y, s.padW, s.padH);
      ctx.beginPath(); ctx.arc(s.ballX, s.ballY, 5, 0, Math.PI * 2); ctx.fill();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);
  return (
    <div className="mx-auto">
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Pong — W/S or ▲/▼ to move</div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



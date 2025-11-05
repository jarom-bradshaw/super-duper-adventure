import { useEffect, useRef, useState } from 'react';
import GameResult from '../GameResult';

export default function FroggerMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const dirRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [finalScore, setFinalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const restartRef = useRef(false);
  const stateRef = useRef({ w: 480, h: 320, gx: 7, gy: 15, cols: 16, rows: 16, cars: [] as { x: number; y: number; v: number }[], logs: [] as { x: number; y: number; v: number }[], score: 0, alive: true });
  useEffect(() => {
    const s = stateRef.current;
    for (let i = 0; i < 5; i++) s.cars.push({ x: Math.random() * s.w, y: 12 * 16 + (i%2)*16, v: (i%2? -90: 120) });
    for (let i = 0; i < 5; i++) s.logs.push({ x: Math.random() * s.w, y: 6 * 16 + (i%2)*16, v: (i%2? 70: -110) });
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stateRef.current.alive) {
        // restart on any key when dead
        restartRef.current = true;
        return;
      }
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
      const s = stateRef.current; 
      if (!s.alive) {
        // allow restart on keypress
        if (restartRef.current) {
          s.gx = 7; s.gy = 15; s.score = 0; s.alive = true;
          restartRef.current = false;
          setShowResult(false);
          // reset cars and logs
          s.cars = []; s.logs = [];
          for (let i = 0; i < 5; i++) s.cars.push({ x: Math.random() * s.w, y: 12 * 16 + (i%2)*16, v: (i%2? -90: 120) });
          for (let i = 0; i < 5; i++) s.logs.push({ x: Math.random() * s.w, y: 6 * 16 + (i%2)*16, v: (i%2? 70: -110) });
        }
        // still draw game over screen
        ctx.clearRect(0,0,s.w,s.h);
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,s.w,s.h);
        ctx.fillStyle = '#f77'; ctx.font = '16px sans-serif';
        ctx.fillText('Game Over - Press any key to restart', s.w/2 - 140, s.h/2);
        animRef.current = requestAnimationFrame(loop);
        return;
      }
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
        for (const c of s.cars) if (Math.abs(fy - c.y) < 10 && Math.abs(fx - c.x) < 14) {
          s.alive = false;
          setFinalScore(s.score);
          setShowResult(true);
        }
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
        if (!onLog) {
          s.alive = false;
          setFinalScore(s.score);
          setShowResult(true);
        }
      }
      // goal at row 2
      if (s.gy === 2) { s.score += 1; s.gx = 7; s.gy = 15; }
      // draw
      ctx.clearRect(0,0,s.w,s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,s.w,s.h);
      // safe grass areas
      ctx.fillStyle = '#1a4a1a'; 
      ctx.fillRect(0, 0, s.w, 6*16); // top grass
      ctx.fillRect(0, 8*16, s.w, 4*16); // middle grass
      ctx.fillRect(0, 14*16, s.w, 2*16); // bottom grass
      // dangerous areas
      ctx.fillStyle = '#233'; ctx.fillRect(0, 6*16, s.w, 2*16); // river (water)
      ctx.fillStyle = '#322'; ctx.fillRect(0, 12*16, s.w, 2*16); // road (dangerous)
      // goal area indicator
      ctx.fillStyle = '#4a4'; ctx.strokeStyle = '#7f7'; ctx.lineWidth = 2;
      ctx.strokeRect(0, 2*16 - 2, s.w, 16 + 4);
      // logs (safe platforms in water)
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--meteor-color') || '#0ff';
      for (const l of s.logs) ctx.fillRect(l.x - 20, l.y - 6, 40, 12);
      // cars (avoid these!)
      ctx.fillStyle = '#fff';
      for (const c of s.cars) ctx.fillRect(c.x - 12, c.y - 6, 24, 12);
      // frog
      ctx.fillStyle = '#7f7'; ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI * 2); ctx.fill();
      // UI text
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.fillText(`Score: ${s.score}`, 10, 18);
      if (!s.alive) {
        ctx.fillStyle = '#f77'; ctx.font = '16px sans-serif';
        ctx.fillText('Game Over - Press any key to restart', s.w/2 - 140, s.h/2);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);
  return (
    <div className="mx-auto relative">
      {showResult && (
        <GameResult
          result="win"
          playerScore={finalScore}
          opponentScore={0}
          onClose={() => setShowResult(false)}
        />
      )}
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">
        Frogger — Use Arrows/WASD to move. Avoid cars (white) on road. Stay on logs (blue) in water. Reach the top to score!
      </div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



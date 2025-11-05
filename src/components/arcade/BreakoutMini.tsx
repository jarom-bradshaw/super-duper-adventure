import { useEffect, useRef, useState } from 'react';
import GameResult from '../GameResult';

export default function BreakoutMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const keys = useRef({ left: false, right: false });
  const [finalScore, setFinalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const stateRef = useRef({ w: 480, h: 320, padX: 200, padW: 80, padH: 10, ballX: 240, ballY: 200, vx: 160, vy: -180, bricks: [] as boolean[], cols: 8, rows: 5, score: 0 });
  useEffect(() => {
    const bricks = new Array(stateRef.current.cols * stateRef.current.rows).fill(true);
    stateRef.current.bricks = bricks;
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.left = down;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.right = down;
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
      if (keys.current.left) s.padX -= 280 * dt;
      if (keys.current.right) s.padX += 280 * dt;
      s.padX = Math.max(0, Math.min(s.w - s.padW, s.padX));
      // ball
      s.ballX += s.vx * dt; s.ballY += s.vy * dt;
      if (s.ballX < 0) { s.ballX = 0; s.vx *= -1; }
      if (s.ballX > s.w) { s.ballX = s.w; s.vx *= -1; }
      if (s.ballY < 0) { s.ballY = 0; s.vy *= -1; }
      // paddle
      if (s.ballY > s.h - 24 && s.ballX > s.padX && s.ballX < s.padX + s.padW) { s.ballY = s.h - 24; s.vy = -Math.abs(s.vy); }
      if (s.ballY > s.h + 10) { // game over
        setFinalScore(s.score);
        setShowResult(true);
        s.ballX = 240; s.ballY = 200; s.vx = 160; s.vy = -180; s.score = 0; s.bricks.fill(true);
      }
      // win condition - all bricks cleared
      if (s.bricks.every(b => !b)) {
        setFinalScore(s.score);
        setShowResult(true);
        s.bricks.fill(true);
      }
      // bricks
      const bw = s.w / s.cols; const bh = 16; const top = 40;
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          const i = r * s.cols + c; if (!s.bricks[i]) continue;
          const x = c * bw; const y = top + r * (bh + 6);
          if (s.ballX > x && s.ballX < x + bw && s.ballY > y && s.ballY < y + bh) {
            s.bricks[i] = false; s.vy *= -1; s.score += 1;
          }
        }
      }
      // draw
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, s.w, s.h);
      // bricks
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--meteor-color') || '#0ff';
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          const i = r * s.cols + c; if (!s.bricks[i]) continue;
          const bw2 = s.w / s.cols; const bh2 = 16; const top2 = 40;
          ctx.fillRect(c * bw2 + 2, top2 + r * (bh2 + 6), bw2 - 4, bh2);
        }
      }
      // paddle & ball
      ctx.fillStyle = '#fff'; ctx.fillRect(s.padX, s.h - 20, s.padW, s.padH);
      ctx.beginPath(); ctx.arc(s.ballX, s.ballY, 5, 0, Math.PI * 2); ctx.fill();
      // score
      ctx.font = '14px sans-serif'; ctx.fillText(`Score: ${s.score}`, 10, 18);
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
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Breakout — A/D or ◀/▶</div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



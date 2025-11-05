import { useEffect, useRef, useState } from 'react';
import GameResult from '../GameResult';

export default function FlappyMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const pressRef = useRef(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const stateRef = useRef({ w: 480, h: 320, x: 120, y: 160, vy: 0, gravity: 700, flap: -260, pipes: [] as { x: number; gapY: number }[], t: 0, score: 0, alive: true });
  useEffect(() => {
    const kd = () => { pressRef.current = true; };
    window.addEventListener('keydown', kd);
    window.addEventListener('mousedown', kd as any);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('mousedown', kd as any); };
  }, []);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const s = stateRef.current;
      if (s.alive) {
        s.t += dt;
        // spawn pipes
        if (s.t > 1.2) { s.t = 0; s.pipes.push({ x: s.w + 40, gapY: 80 + Math.random() * 160 }); }
        // physics
        if (pressRef.current) { s.vy = s.flap; pressRef.current = false; }
        s.vy += s.gravity * dt; s.y += s.vy * dt;
        // move pipes
        s.pipes.forEach(p => p.x -= 160 * dt);
        s.pipes = s.pipes.filter(p => p.x > -40);
        // collisions and scoring
        for (const p of s.pipes) {
          if (p.x < s.x + 12 && p.x + 30 > s.x - 12) {
            if (s.y < p.gapY - 45 || s.y > p.gapY + 45) {
              s.alive = false;
              setFinalScore(s.score);
              setShowResult(true);
            }
          }
          if (Math.abs(p.x - s.x) < 2) s.score += 1;
        }
        if (s.y < 8 || s.y > s.h - 8) {
          s.alive = false;
          setFinalScore(s.score);
          setShowResult(true);
        }
      }
      // draw
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, s.w, s.h);
      // bird
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI * 2); ctx.fill();
      // pipes
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--meteor-color') || '#0ff';
      for (const p of s.pipes) {
        ctx.fillRect(p.x, 0, 30, p.gapY - 45);
        ctx.fillRect(p.x, p.gapY + 45, 30, s.h - (p.gapY + 45));
      }
      // score
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.fillText(`Score: ${s.score}`, 10, 18);
      if (!s.alive) ctx.fillText('Game over - press any key/click to retry', 100, 160);
      // reset on press
      if (!s.alive && pressRef.current) { 
        stateRef.current = { w: 480, h: 320, x: 120, y: 160, vy: 0, gravity: 700, flap: -260, pipes: [], t: 0, score: 0, alive: true }; 
        pressRef.current = false;
        setShowResult(false);
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
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Flappy — Space/Enter or click to flap</div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



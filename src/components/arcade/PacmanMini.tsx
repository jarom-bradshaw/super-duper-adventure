import { useEffect, useRef, useState } from 'react';
import GameResult from '../GameResult';

export default function PacmanMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const gridRef = useRef<number[][]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const stateRef = useRef({ w: 480, h: 320, cell: 16, px: 8, py: 8, gx: 18, gy: 8, dots: 0, alive: true, score: 0 });
  useEffect(() => {
    // simple small maze (0 empty, 1 wall, 2 dot)
    const rows = 18, cols = 28; const g: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        const border = r === 0 || c === 0 || r === rows - 1 || c === cols - 1;
        const wall = border || (r % 4 === 0 && c % 6 !== 0);
        row.push(wall ? 1 : 2);
      }
      g.push(row);
    }
    g[stateRef.current.py][stateRef.current.px] = 0;
    gridRef.current = g;
    stateRef.current.dots = g.flat().filter(v => v === 2).length;
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') nextRef.current = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' || e.key === 's') nextRef.current = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' || e.key === 'a') nextRef.current = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' || e.key === 'd') nextRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    let acc = 0; const stepTime = 0.12; let ghostPhase = 0;
    const loop = () => {
      const dt = 0.016; acc += dt; ghostPhase += dt;
      const s = stateRef.current; const g = gridRef.current;
      if (!s.alive) return;
      // try turn if possible
      if (g[s.py + nextRef.current.y]?.[s.px + nextRef.current.x] !== 1) dirRef.current = nextRef.current;
      if (acc >= stepTime) {
        acc = 0;
        const nx = s.px + dirRef.current.x; const ny = s.py + dirRef.current.y;
        if (g[ny]?.[nx] !== 1) { s.px = nx; s.py = ny; if (g[ny][nx] === 2) { g[ny][nx] = 0; s.score += 1; s.dots -= 1; } }
      }
      // ghost simple loop
      s.gx = 8 + Math.floor(6 * Math.sin(ghostPhase));
      s.gy = 9 + Math.floor(4 * Math.cos(ghostPhase * 0.7));
      if (s.gx === s.px && s.gy === s.py) {
        s.alive = false;
        setFinalScore(s.score);
        setShowResult(true);
      }
      // win condition - all dots collected
      if (s.dots === 0) {
        s.alive = false;
        setFinalScore(s.score);
        setShowResult(true);
      }
      // draw
      ctx.clearRect(0,0,s.w,s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,s.w,s.h);
      // maze
      for (let r = 0; r < g.length; r++) for (let c = 0; c < g[0].length; c++) {
        if (g[r][c] === 1) { ctx.fillStyle = '#345'; ctx.fillRect(c*s.cell, r*s.cell, s.cell, s.cell); }
        if (g[r][c] === 2) { ctx.fillStyle = '#fff'; ctx.fillRect(c*s.cell + 7, r*s.cell + 7, 2, 2); }
      }
      // pacman & ghost
      ctx.fillStyle = '#ff0'; ctx.beginPath(); ctx.arc(s.px*s.cell + 8, s.py*s.cell + 8, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--meteor-color') || '#0ff';
      ctx.fillRect(s.gx*s.cell + 3, s.gy*s.cell + 3, 10, 10);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.fillText(`Score: ${s.score}`, 10, 18);
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
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Pac‑Man — Arrows</div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



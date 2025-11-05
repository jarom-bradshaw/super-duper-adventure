import { useEffect, useRef, useState } from 'react';
import GameResult from '../GameResult';

export default function InvadersMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const keys = useRef({ left: false, right: false, shoot: false });
  const [finalScore, setFinalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const stateRef = useRef({ w: 480, h: 320, x: 220, bullets: [] as { x: number; y: number }[], aliens: [] as { x: number; y: number; alive: boolean }[], dir: 1 as 1 | -1, stepT: 0, score: 0, level: 1, boss: null as null | { x: number; y: number; hp: number; vx: number }, enemyBullets: [] as { x: number; y: number }[], alive: true });
  useEffect(() => {
    const aliens = [] as { x: number; y: number; alive: boolean }[];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) aliens.push({ x: 60 + c * 42, y: 50 + r * 26, alive: true });
    stateRef.current.aliens = aliens;
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.left = down;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.right = down;
      if (e.key === ' ' || e.key === 'Spacebar') keys.current.shoot = down;
      if (!down && (e.key === 'Enter' || e.key === ' ')) {
        const s = stateRef.current;
        if (!s.alive) {
          // restart
          s.x = 220; s.bullets = []; s.enemyBullets = []; s.level = 1; s.score = 0; s.dir = 1; s.stepT = 0; s.boss = null; s.alive = true;
          s.aliens = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) s.aliens.push({ x: 60 + c * 42, y: 50 + r * 26, alive: true });
          setShowResult(false);
        }
      }
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
    let last = performance.now(); let shootCd = 0; let enemyShootT = 0;
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000); last = t;
      const s = stateRef.current;
      // if dead, draw game over screen and stop updates until restart
      if (!s.alive) {
        const ctx2 = ctx;
        ctx2.clearRect(0, 0, s.w, s.h);
        ctx2.fillStyle = 'rgba(0,0,0,0.5)'; ctx2.fillRect(0, 0, s.w, s.h);
        ctx2.fillStyle = '#fff'; ctx2.font = '16px sans-serif';
        ctx2.fillText(`Game Over — Score: ${s.score}`, s.w/2 - 100, s.h/2 - 10);
        ctx2.fillText('Press Enter to restart', s.w/2 - 90, s.h/2 + 14);
        animRef.current = requestAnimationFrame(loop);
        return;
      }
      // input
      if (keys.current.left) s.x -= 240 * dt;
      if (keys.current.right) s.x += 240 * dt;
      s.x = Math.max(10, Math.min(s.w - 10, s.x));
      shootCd -= dt;
      if (keys.current.shoot && shootCd <= 0) { s.bullets.push({ x: s.x, y: s.h - 24 }); shootCd = 0.3; }
      // bullets
      s.bullets.forEach(b => b.y -= 380 * dt);
      s.bullets = s.bullets.filter(b => b.y > -10);
      // enemy bullets (from boss or random alien)
      enemyShootT += dt;
      if (enemyShootT > Math.max(0.9 - s.level*0.05, 0.3)) {
        enemyShootT = 0;
        if (s.boss) s.enemyBullets.push({ x: s.boss.x, y: s.boss.y + 8 });
        else {
          const alive = s.aliens.filter(a => a.alive);
          if (alive.length) {
            const a = alive[Math.floor(Math.random() * alive.length)];
            s.enemyBullets.push({ x: a.x, y: a.y + 6 });
          }
        }
      }
      s.enemyBullets.forEach(b => b.y += 220 * dt);
      s.enemyBullets = s.enemyBullets.filter(b => b.y < s.h + 10);
      // aliens step movement
      s.stepT += dt; const step = s.stepT > 0.6; if (step) { s.stepT = 0; }
      if (step) {
        let hitEdge = false;
        for (const a of s.aliens) if (a.alive) { a.x += 16 * s.dir; if (a.x < 20 || a.x > s.w - 20) hitEdge = true; }
        if (hitEdge) { s.dir = s.dir === 1 ? -1 : 1; for (const a of s.aliens) if (a.alive) a.y += 10; }
      }
      // collisions
      for (const b of s.bullets) {
        for (const a of s.aliens) if (a.alive) {
          if (Math.abs(b.x - a.x) < 12 && Math.abs(b.y - a.y) < 8) { a.alive = false; b.y = -999; s.score += 10; }
        }
      }
      if (s.boss) {
        for (const b of s.bullets) {
          if (Math.abs(b.x - s.boss.x) < 18 && Math.abs(b.y - s.boss.y) < 12) { s.boss.hp -= 1; b.y = -999; s.score += 20; }
        }
      }
      // player hit
      for (const eb of s.enemyBullets) {
        if (Math.abs(eb.x - s.x) < 12 && eb.y > s.h - 24) {
          s.alive = false;
          setFinalScore(s.score);
          setShowResult(true);
          break;
        }
      }
      // advance level when aliens cleared and no boss
      if (!s.boss && s.aliens.every(a => !a.alive)) {
        s.level += 1;
        if (s.level % 3 === 0) {
          // spawn boss
          s.boss = { x: s.w/2, y: 60, hp: 8 + s.level, vx: 60 + s.level * 10 };
        } else {
          // spawn new wave
          s.aliens = [];
          for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) s.aliens.push({ x: 60 + c * 42, y: 50 + r * 26, alive: true });
          s.dir = 1; s.stepT = 0;
        }
      }
      // move boss
      if (s.boss) {
        s.boss.x += s.boss.vx * dt;
        if (s.boss.x < 30 || s.boss.x > s.w - 30) s.boss.vx *= -1;
        if (s.boss.hp <= 0) { s.boss = null; }
      }
      // draw
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, s.w, s.h);
      // aliens
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--meteor-color') || '#0ff';
      for (const a of s.aliens) if (a.alive) ctx.fillRect(a.x - 10, a.y - 6, 20, 12);
      // boss
      if (s.boss) { ctx.fillRect(s.boss.x - 18, s.boss.y - 10, 36, 20); }
      // cannon
      ctx.fillStyle = '#fff'; ctx.fillRect(s.x - 12, s.h - 18, 24, 10);
      // bullets
      for (const b of s.bullets) { ctx.fillRect(b.x - 2, b.y - 6, 4, 8); }
      ctx.fillStyle = '#f77'; for (const eb of s.enemyBullets) ctx.fillRect(eb.x - 2, eb.y - 6, 4, 8);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.fillText(`Score: ${s.score}  Lv ${s.level}`, 10, 18);
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
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Invaders — ◀/▶ and Space</div>
      <canvas ref={canvasRef} width={480} height={320} className="rounded border border-[color:var(--glass-border)]" />
    </div>
  );
}



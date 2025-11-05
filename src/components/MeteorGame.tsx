import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/mini-game.css';
import { samplePathYAtX } from './game/shared/paths';
import { GRAVITY, MOVE_ACCEL, MAX_SPEED_X, JUMP_SPEED, FRICTION_AIR, FRICTION_GROUND, clampDt } from './game/shared/physics';
import GameOverlay from './GameOverlay';

type Vec2 = { x: number; y: number };

type Player = {
  pos: Vec2;
  vel: Vec2;
  grounded: boolean;
  facing: 1 | -1;
  dropUntil: number;
  lives: number;
  invulnUntil: number;
  deathAt?: number;
  score: number;
  streak: number;
  airtimeStart?: number;
};

type Meteor = { id: number; pos: Vec2; vel: Vec2; radius: number; active: boolean };
type Explosion = { id: number; pos: Vec2; life: number; maxLife: number; radius: number };

const VIEW_W = 1200;
const VIEW_H = 600;

function useRaf(callback: (dt: number, tSec: number) => void) {
  const lastRef = useRef<number | null>(null);
  const accTime = useRef(0);
  useEffect(() => {
    let rafId: number;
    const tick = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = clampDt((t - lastRef.current) / 1000);
      lastRef.current = t;
      accTime.current += dt;
      callback(dt, accTime.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [callback]);
}

export default function MeteorGame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const hill1Ref = useRef<SVGPathElement>(null);
  const hill2Ref = useRef<SVGPathElement>(null);
  const hill3Ref = useRef<SVGPathElement>(null);
  const ridge1Ref = useRef<SVGPathElement>(null);
  const ridge2Ref = useRef<SVGPathElement>(null);
  const ridge3Ref = useRef<SVGPathElement>(null);

  const leftKeys = useRef({ left: false, right: false, up: false, down: false });
  const rightKeys = useRef({ left: false, right: false, up: false, down: false });

  const [players, setPlayers] = useState<Player[]>([
    { pos: { x: 250, y: 515 }, vel: { x: 0, y: 0 }, grounded: false, facing: 1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
    { pos: { x: 950, y: 525 }, vel: { x: 0, y: 0 }, grounded: false, facing: -1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
  ]);
  const playersRef = useRef(players);
  useEffect(() => { playersRef.current = players; }, [players]);

  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeSurvived, setTimeSurvived] = useState(0);
  const [survivedCount, setSurvivedCount] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; player: number; text: string; life: number; maxLife: number }[]>([]);
  const nextId = useRef(1);
  const spawnTimer = useRef(0);

  const caches = useMemo(() => [new Map<number, number>(), new Map<number, number>(), new Map<number, number>()], []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)) e.preventDefault();
      if (e.key === 'a') leftKeys.current.left = down;
      if (e.key === 'd') leftKeys.current.right = down;
      if (e.key === 'w') leftKeys.current.up = down;
      if (e.key === 's') leftKeys.current.down = down;
      if (e.key === 'ArrowLeft') rightKeys.current.left = down;
      if (e.key === 'ArrowRight') rightKeys.current.right = down;
      if (e.key === 'ArrowUp') rightKeys.current.up = down;
      if (e.key === 'ArrowDown') rightKeys.current.down = down;
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd, { passive: false });
    window.addEventListener('keyup', ku, { passive: false });
    return () => { window.removeEventListener('keydown', kd as any); window.removeEventListener('keyup', ku as any); };
  }, []);

  useRaf((dt, tSec) => {
    const r1 = ridge1Ref.current, r2 = ridge2Ref.current, r3 = ridge3Ref.current;
    if (!r1 || !r2 || !r3) return;
    if (!started || gameOver) return; // pause game until started or after over
    setTimeSurvived(tSec);

    // Spawn meteors
    spawnTimer.current -= dt;
    if (spawnTimer.current <= 0) {
      spawnTimer.current = Math.max(0.4, 1.5 - tSec * 0.02); // faster over time
      const id = nextId.current++;
      const x = Math.random() * VIEW_W;
      const radius = 10 + Math.random() * 10;
      const drift = (Math.random() - 0.5) * 60;
      setMeteors((prev) => [
        ...prev.filter((m) => m.active).slice(-40),
        { id, pos: { x, y: -30 }, vel: { x: drift, y: 100 }, radius, active: true },
      ]);
    }

    // Update players
    setPlayers((prev) => {
      const next = prev.map((p, idx) => ({ ...p, pos: { ...p.pos }, vel: { ...p.vel }, grounded: false }));
      const inputs = [leftKeys.current, rightKeys.current];
      for (let i = 0; i < next.length; i++) {
        const pl = next[i];
        const wasGrounded = prev[i].grounded;
        const input = inputs[i];
        if (pl.lives <= 0) continue;

        if (input.left) { pl.vel.x -= MOVE_ACCEL * dt; pl.facing = -1; }
        if (input.right) { pl.vel.x += MOVE_ACCEL * dt; pl.facing = 1; }
        if (pl.vel.x > MAX_SPEED_X) pl.vel.x = MAX_SPEED_X;
        if (pl.vel.x < -MAX_SPEED_X) pl.vel.x = -MAX_SPEED_X;

        pl.vel.y += GRAVITY * dt;
        pl.pos.x += pl.vel.x * dt;
        pl.pos.y += pl.vel.y * dt;
        if (pl.pos.x < 0) { pl.pos.x = 0; pl.vel.x = 0; }
        if (pl.pos.x > VIEW_W) { pl.pos.x = VIEW_W; pl.vel.x = 0; }

        if (wasGrounded && input.down) {
          pl.dropUntil = tSec + 0.25;
          pl.grounded = false;
          pl.pos.y += 3;
          if (pl.vel.y < 50) pl.vel.y = 50;
        }
        const dropActive = tSec < pl.dropUntil;

        const y1 = samplePathYAtX(r1, pl.pos.x, caches[0]);
        const y2 = samplePathYAtX(r2, pl.pos.x, caches[1]);
        const y3 = samplePathYAtX(r3, pl.pos.x, caches[2]);
        const ys = [y1, y2, y3].filter((y): y is number => y != null);
        const feetY = pl.pos.y;
        const descending = pl.vel.y >= 0;
        const CATCH_TOL = 2;
        const candidates = (descending && !dropActive) ? ys.filter((y) => y <= feetY + CATCH_TOL) : [];
        const groundY = candidates.length ? Math.max(...candidates) : null;
        if (groundY != null && !dropActive && descending && feetY >= groundY - CATCH_TOL) {
          pl.pos.y = groundY; pl.vel.y = 0; pl.grounded = true;
          if (pl.airtimeStart != null) {
            const air = tSec - pl.airtimeStart;
            if (air >= 0.75 && tSec >= pl.invulnUntil) {
              pl.score += 2;
              setToasts((ts) => [...ts, { id: nextId.current++, player: i, text: 'Airtime +2', life: 0, maxLife: 0.8 }]);
            }
            pl.airtimeStart = undefined;
          }
        }
        if (input.up && pl.grounded) { pl.vel.y = -JUMP_SPEED; pl.grounded = false; pl.airtimeStart = tSec; }
        const fric = pl.grounded ? FRICTION_GROUND : FRICTION_AIR;
        if (!input.left && !input.right) {
          if (pl.vel.x > 0) pl.vel.x = Math.max(0, pl.vel.x - fric * dt);
          if (pl.vel.x < 0) pl.vel.x = Math.min(0, pl.vel.x + fric * dt);
        }
      }
      return next;
    });

    // Update meteors and trigger explosions on hill impact
    setMeteors((prev) => {
      const next = prev.map((m) => ({ ...m, pos: { x: m.pos.x + m.vel.x * dt, y: m.pos.y + m.vel.y * dt }, vel: { x: m.vel.x, y: m.vel.y + GRAVITY * 0.6 * dt } }));
      const r1c = ridge1Ref.current!, r2c = ridge2Ref.current!, r3c = ridge3Ref.current!;
      const newExplosions: Explosion[] = [];
      for (const m of next) {
        if (!m.active) continue;
        const y1 = samplePathYAtX(r1c, m.pos.x, caches[0]);
        const y2 = samplePathYAtX(r2c, m.pos.x, caches[1]);
        const y3 = samplePathYAtX(r3c, m.pos.x, caches[2]);
        const ys = [y1, y2, y3].filter((y): y is number => y != null);
        const crestY = ys.length ? Math.min(...ys) : null; // uppermost crest visually higher => smaller y
        if (crestY != null && m.pos.y + m.radius >= crestY) {
          m.active = false;
          const expRadius = 60;
          newExplosions.push({ id: nextId.current++, pos: { x: m.pos.x, y: crestY }, life: 0, maxLife: 0.5, radius: expRadius });
          const band = 24; // px band for close
          setPlayers((prevP) => prevP.map((pl, pi) => {
            if (pl.lives <= 0) return pl;
            const dx = pl.pos.x - m.pos.x;
            const dy = pl.pos.y - crestY;
            const dist = Math.hypot(dx, dy);
            if (pl.vel.y >= 0 && dist > expRadius) {
              let gained = 1;
              if (dist <= expRadius + 10) { gained = 5; setToasts((ts) => [...ts, { id: nextId.current++, player: pi, text: 'Perfect +5', life: 0, maxLife: 0.9 }]); }
              else if (dist <= expRadius + band) { gained = 3; setToasts((ts) => [...ts, { id: nextId.current++, player: pi, text: 'Close +3', life: 0, maxLife: 0.9 }]); }
              const bonus = pl.streak * 2;
              if (bonus > 0) setToasts((ts) => [...ts, { id: nextId.current++, player: pi, text: `Streak +${bonus}`, life: 0, maxLife: 0.8 }]);
              return { ...pl, score: pl.score + gained + bonus, streak: pl.streak + 1 };
            }
            return pl;
          }));
          setSurvivedCount((c) => c + 1);
        }
      }
      if (newExplosions.length) setExplosions((prevE) => [...prevE, ...newExplosions]);
      return next.filter((m) => m.active && m.pos.y < VIEW_H + 100);
    });

    // Update explosions and apply damage
    setExplosions((prev) => {
      const next = prev.map((e) => ({ ...e, life: e.life + dt }));
      const active = next.filter((e) => e.life < e.maxLife);
      // Damage window first half of life
      const damaging = active.filter((e) => e.life < e.maxLife * 0.35);
      if (damaging.length) {
        setPlayers((prevP) => prevP.map((pl) => {
          if (pl.lives <= 0) return pl;
          for (const e of damaging) {
            if (tSec < pl.invulnUntil) continue;
            const dx = pl.pos.x - e.pos.x;
            const dy = pl.pos.y - e.pos.y;
            const dist = Math.hypot(dx, dy);
            if (dist <= e.radius) {
              const lives = pl.lives - 1;
              return { ...pl, lives, invulnUntil: tSec + 1, deathAt: lives <= 0 ? tSec : pl.deathAt, streak: 0 };
            }
          }
          return pl;
        }));
      }
      return active;
    });

    // Check game over
    setPlayers((prevP) => {
      const allDead = prevP.every((p) => p.lives <= 0);
      if (allDead) setGameOver(true);
      return prevP;
    });
  });

  const idlePhase = useRef(0);
  useRaf((dt) => { idlePhase.current += dt; });
  // advance and cleanup toasts
  useRaf((dt) => {
    setToasts((prev) => prev.map((t) => ({ ...t, life: t.life + dt })).filter((t) => t.life < t.maxLife));
  });

  return (
    <div className="relative w-full h-full">
      {/* Per-player scores top-left (P1) and top-right (P2) */}
      {started && !gameOver && (
        <>
          <div className="absolute top-2 left-3 z-20 glass-card rounded-md px-3 py-1 text-sm text-[color:var(--text)]">P1: {players[0]?.score ?? 0}</div>
          <div className="absolute top-2 right-3 z-20 glass-card rounded-md px-3 py-1 text-sm text-[color:var(--text)]">P2: {players[1]?.score ?? 0}</div>
        </>
      )}
      {!started && (
        <GameOverlay
          title="Meteor Dodge"
          description="Survive falling meteors. Explosions on the hills will hurt. Don’t hide on bottom hills — that’s lame."
          rules={["Meteors explode on hill tops","Avoid the blast radius to keep your hearts","Game speeds up over time"]}
          controls={["Left: A / ArrowLeft","Right: D / ArrowRight","Jump: W / ArrowUp","Drop through: S / ArrowDown"]}
          startLabel="Start Game"
          onStart={() => setStarted(true)}
        />
      )}
      <svg
        ref={svgRef}
        viewBox={`${0} ${0} ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="game-svg block w-[100vw] max-w-none h-full"
        role="img"
        aria-label="Meteor game with hills"
      >
        {/* Fills */}
        <g className="hills">
          <path ref={hill3Ref} className="hill hill-3" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470 L1200,600 L0,600 Z" />
          <path ref={hill2Ref} className="hill hill-2" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530 L1200,600 L0,600 Z" />
          <path ref={hill1Ref} className="hill hill-1" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580 L1200,600 L0,600 Z" />
        </g>
        {/* Ridge strokes for collision sampling */}
        <g className="hills">
          <path ref={ridge3Ref} className="hill-stroke" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470" />
          <path ref={ridge2Ref} className="hill-stroke" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530" />
          <path ref={ridge1Ref} className="hill-stroke" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580" />
        </g>

        {/* Meteors */}
        <g className="meteors" fill="none" stroke="var(--meteor-color)">
          {meteors.map((m) => (
            <g key={m.id}>
              <circle cx={m.pos.x} cy={m.pos.y} r={m.radius} strokeWidth={2} />
              <circle cx={m.pos.x} cy={m.pos.y} r={m.radius * 0.6} strokeWidth={1} />
            </g>
          ))}
        </g>

        {/* Explosions */}
        <g className="explosions" fill="none" stroke="var(--accent)">
          {explosions.map((e) => {
            const t = e.life / e.maxLife;
            const r = e.radius * (0.4 + 0.8 * t);
            const alpha = 1 - t;
            return (
              <circle key={e.id} cx={e.pos.x} cy={e.pos.y} r={r} strokeWidth={2} strokeOpacity={alpha} />
            );
          })}
        </g>

        {/* Figures (with lives HUD above head) */}
        <g className="figures">
          {players.map((pl, i) => {
            const sway = pl.grounded && Math.abs(pl.vel.x) < 1 ? Math.sin(idlePhase.current * 2 + i) * 3 : 0;
            const tx = pl.pos.x + sway;
            const ty = pl.pos.y;
            const dead = pl.lives <= 0;
            const now = idlePhase.current;
            const deathT = pl.deathAt ?? now;
            const deathProg = dead ? Math.min(1, Math.max(0, (now - deathT) / 1.0)) : 0;
            const fade = dead ? 1 - deathProg : 1;
            return (
              <g key={i} className="figure" transform={`translate(${tx},${ty})`} opacity={fade}>
                <circle cx="0" cy="-40" r={14 * (1 - 0.2 * deathProg)} />
                <path d="M0,-26 L0,10" />
                <path d="M0,-10 L-18,6" />
                <path d="M0,-10 L18,6" />
                <path d="M0,10 L-16,26" />
                <path d="M0,10 L16,26" />
                {dead && (
                  <g>
                    <path d="M-10,-50 L10,-30" />
                    <path d="M10,-50 L-10,-30" />
                  </g>
                )}
                {/* Lives HUD */}
                <text x="0" y="-60" textAnchor="middle" fontSize="12" fill="var(--text)">{pl.lives}❤</text>
              </g>
            );
          })}
        </g>
        {/* Toasts */}
        <g className="toasts">
          {toasts.map((t) => {
            const pl = players[t.player];
            if (!pl) return null;
            const k = t.life / t.maxLife;
            const dy = -20 - k * 20;
            const opacity = 1 - k;
            return (
              <text key={t.id} x={pl.pos.x} y={pl.pos.y + dy} textAnchor="middle" fontSize="12" fill="var(--text)" opacity={opacity}>
                {t.text}
              </text>
            );
          })}
        </g>
      </svg>
      {gameOver && (() => {
        const p1 = players[0]?.score ?? 0;
        const p2 = players[1]?.score ?? 0;
        const winner = p1 === p2 ? 'Tie' : p1 > p2 ? 'Player 1 Wins' : 'Player 2 Wins';
        return (
          <GameOverlay
            title="Game Over"
            description={`Time survived: ${timeSurvived.toFixed(1)}s — ${winner}`}
            rules={[`Player 1: ${p1} pts`, `Player 2: ${p2} pts`, `Meteors dodged: ${survivedCount}`]}
            controls={["Press Restart to play again"]}
            startLabel="Restart"
            onStart={() => {
              // reset state
              setMeteors([]);
              setExplosions([]);
              setPlayers([
                { pos: { x: 250, y: 515 }, vel: { x: 0, y: 0 }, grounded: false, facing: 1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
                { pos: { x: 950, y: 525 }, vel: { x: 0, y: 0 }, grounded: false, facing: -1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
              ]);
              setTimeSurvived(0);
              setSurvivedCount(0);
              setGameOver(false);
              setStarted(true);
            }}
          />
        );
      })()}
    </div>
  );
}



import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/mini-game.css';
import { samplePathYAtX } from './game/shared/paths';
import { GRAVITY, MOVE_ACCEL, MAX_SPEED_X, JUMP_SPEED, FRICTION_AIR, FRICTION_GROUND } from './game/shared/physics';

type Vec2 = { x: number; y: number };

type Player = {
  pos: Vec2;
  vel: Vec2;
  grounded: boolean;
  facing: 1 | -1;
  dropUntil: number; // seconds timestamp until which collisions are ignored (drop-through)
};

const VIEW_W = 1200;
const VIEW_H = 600;

// uses shared physics constants

function useRaf(callback: (dt: number, tSec: number) => void) {
  const lastRef = useRef<number | null>(null);
  const accTime = useRef(0);
  useEffect(() => {
    let rafId: number;
    const tick = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dtMs = t - lastRef.current!;
      lastRef.current = t;
      const dt = Math.min(0.032, dtMs / 1000);
      accTime.current += dt;
      callback(dt, accTime.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [callback]);
}

// ridge sampling moved to shared

export default function StarscapeGame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const hill1Ref = useRef<SVGPathElement>(null);
  const hill2Ref = useRef<SVGPathElement>(null);
  const hill3Ref = useRef<SVGPathElement>(null);
  // Stroke-only ridge paths for collision sampling
  const ridge1Ref = useRef<SVGPathElement>(null);
  const ridge2Ref = useRef<SVGPathElement>(null);
  const ridge3Ref = useRef<SVGPathElement>(null);

  const leftKeys = useRef({ left: false, right: false, up: false, down: false }); // A,D,W,S
  const rightKeys = useRef({ left: false, right: false, up: false, down: false }); // ←,→,↑,↓

  const [players, setPlayers] = useState<Player[]>([
    { pos: { x: 250, y: 515 }, vel: { x: 0, y: 0 }, grounded: false, facing: 1, dropUntil: 0 },
    { pos: { x: 950, y: 525 }, vel: { x: 0, y: 0 }, grounded: false, facing: -1, dropUntil: 0 },
  ]);

  const caches = useMemo(() => [new Map<number, number>(), new Map<number, number>(), new Map<number, number>()], []);

  // Grass tuft points sampled along ridge paths
  const [grass, setGrass] = useState<{ x: number; y: number; angle: number }[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'a') leftKeys.current.left = down;
      if (e.key === 'd') leftKeys.current.right = down;
      if (e.key === 'w') leftKeys.current.up = down;
      if (e.key === 's') leftKeys.current.down = down;
      if (e.key === 'ArrowLeft') rightKeys.current.left = down;
      if (e.key === 'ArrowRight') rightKeys.current.right = down;
      if (e.key === 'ArrowUp') rightKeys.current.up = down;
      if (e.key === 'ArrowDown') rightKeys.current.down = down;
    };
    const down = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up, { passive: false });
    return () => {
      window.removeEventListener('keydown', down as any);
      window.removeEventListener('keyup', up as any);
    };
  }, []);

  // Sample grass tufts along ridge paths once
  useEffect(() => {
    const r1 = ridge1Ref.current;
    const r2 = ridge2Ref.current;
    const r3 = ridge3Ref.current;
    if (!r1 || !r2 || !r3) return;
    const paths = [r1, r2, r3];
    const tufts: { x: number; y: number; angle: number }[] = [];
    for (const p of paths) {
      const len = p.getTotalLength();
      const step = 80; // px along path between tufts
      for (let d = 40; d < len - 40; d += step) {
        const pt = p.getPointAtLength(d);
        const prev = p.getPointAtLength(Math.max(0, d - 1));
        const next = p.getPointAtLength(Math.min(len, d + 1));
        const angle = Math.atan2(next.y - prev.y, next.x - prev.x);
        tufts.push({ x: pt.x, y: pt.y, angle });
      }
    }
    setGrass(tufts);
  }, [ridge1Ref.current, ridge2Ref.current, ridge3Ref.current]);

useRaf((dt, tSec) => {
  const h1 = ridge1Ref.current;
  const h2 = ridge2Ref.current;
  const h3 = ridge3Ref.current;
    if (!h1 || !h2 || !h3) return;

    setPlayers((prev) => {
      const next = prev.map((p) => ({ ...p, pos: { ...p.pos }, vel: { ...p.vel }, grounded: false }));
      const inputs = [leftKeys.current, rightKeys.current];
      for (let i = 0; i < next.length; i++) {
        const pl = next[i];
        const wasGrounded = prev[i].grounded; // capture grounded state before reset
        const input = inputs[i];

        // Horizontal movement
        if (input.left) {
          pl.vel.x -= MOVE_ACCEL * dt;
          pl.facing = -1;
        }
        if (input.right) {
          pl.vel.x += MOVE_ACCEL * dt;
          pl.facing = 1;
        }
        // Clamp max speed
        if (pl.vel.x > MAX_SPEED_X) pl.vel.x = MAX_SPEED_X;
        if (pl.vel.x < -MAX_SPEED_X) pl.vel.x = -MAX_SPEED_X;

        // Gravity
        pl.vel.y += GRAVITY * dt;

        // Integrate
        pl.pos.x += pl.vel.x * dt;
        pl.pos.y += pl.vel.y * dt;

        // World bounds
        if (pl.pos.x < 0) { pl.pos.x = 0; pl.vel.x = 0; }
        if (pl.pos.x > VIEW_W) { pl.pos.x = VIEW_W; pl.vel.x = 0; }

        // Handle drop-through initiation (use previous grounded state)
        if (wasGrounded && input.down) {
          pl.dropUntil = tSec + 0.25; // 250ms
          pl.grounded = false;
          // Nudge below current surface so gravity takes over immediately
          pl.pos.y += 3;
          // Ensure downward velocity to defeat tiny ascent during drop window
          if (pl.vel.y < 50) pl.vel.y = 50;
        }

        const dropActive = tSec < pl.dropUntil;

        // Ground collision: get top-most hill y at this x
        const y1 = samplePathYAtX(h1, pl.pos.x, caches[0]);
        const y2 = samplePathYAtX(h2, pl.pos.x, caches[1]);
        const y3 = samplePathYAtX(h3, pl.pos.x, caches[2]);
        const ys = [y1, y2, y3].filter((y): y is number => y != null);
        const feetY = pl.pos.y; // feet position
        const descending = pl.vel.y >= 0;
        // Find the nearest surface just below (or at) the feet to catch while descending
        const CATCH_TOL = 2; // px penetration tolerance
        const candidates = (descending && !dropActive)
          ? ys.filter((y) => y <= feetY + CATCH_TOL)
          : [];
        const groundY = candidates.length ? Math.max(...candidates) : null;
        if (groundY != null) {
          if (!dropActive && descending && feetY >= groundY - CATCH_TOL) {
            pl.pos.y = groundY;
            pl.vel.y = 0;
            pl.grounded = true;
          }
        }

        // Jump
        if (input.up && pl.grounded) {
          pl.vel.y = -JUMP_SPEED;
          pl.grounded = false;
        }

        // Friction
        const fric = pl.grounded ? FRICTION_GROUND : FRICTION_AIR;
        if (!input.left && !input.right) {
          if (pl.vel.x > 0) { pl.vel.x = Math.max(0, pl.vel.x - fric * dt); }
          if (pl.vel.x < 0) { pl.vel.x = Math.min(0, pl.vel.x + fric * dt); }
        }
      }
      return next;
    });
  });

  const idlePhase = useRef(0);
  useRaf((dt) => { idlePhase.current += dt; });

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`${0} ${0} ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="game-svg block w-[100vw] max-w-none h-full"
        role="img"
        aria-label="Rolling hills with figures watching the stars"
      >
        <g className="hills">
          <path ref={hill3Ref} className="hill hill-3" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470 L1200,600 L0,600 Z" />
          <path ref={hill2Ref} className="hill hill-2" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530 L1200,600 L0,600 Z" />
          <path ref={hill1Ref} className="hill hill-1" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580 L1200,600 L0,600 Z" />
        </g>
        {/* Stroke overlays to ensure visible edges */}
        <g className="hills">
          <path ref={ridge3Ref} className="hill-stroke" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470" />
          <path ref={ridge2Ref} className="hill-stroke" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530" />
          <path ref={ridge1Ref} className="hill-stroke" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580" />
        </g>

        {/* Grass tufts under figures, above fills */}
        <g className="grass">
          {grass.map((g, idx) => {
            const size = 14;
            const spread = 10;
            // Draw a small "V" tuft oriented along the surface normal
            const angle = g.angle - Math.PI / 2;
            const x1 = g.x + Math.cos(angle) * size;
            const y1 = g.y + Math.sin(angle) * size;
            const leftAngle = angle - 0.35;
            const rightAngle = angle + 0.35;
            const lx = g.x + Math.cos(leftAngle) * (size - spread);
            const ly = g.y + Math.sin(leftAngle) * (size - spread);
            const rx = g.x + Math.cos(rightAngle) * (size - spread);
            const ry = g.y + Math.sin(rightAngle) * (size - spread);
            return (
              <g key={idx} className="tuft">
                <path d={`M ${g.x} ${g.y} L ${x1} ${y1}`} className="tuft-blade" />
                <path d={`M ${g.x} ${g.y} L ${lx} ${ly}`} className="tuft-blade" />
                <path d={`M ${g.x} ${g.y} L ${rx} ${ry}`} className="tuft-blade" />
              </g>
            );
          })}
        </g>

        {/* Figures rendered last to guarantee top z-order within the SVG */}
        <g className="figures">
          {players.map((pl, i) => {
            const sway = pl.grounded && Math.abs(pl.vel.x) < 1 ? Math.sin(idlePhase.current * 2 + i) * 3 : 0;
            const tx = pl.pos.x + sway;
            const ty = pl.pos.y;
            const scale = 1;
            return (
              <g key={i} className="figure" transform={`translate(${tx},${ty}) scale(${scale})`}>
                <circle cx="0" cy="-40" r="14" />
                <path d="M0,-26 L0,10" />
                <path d="M0,-10 L-18,6" />
                <path d="M0,-10 L18,6" />
                <path d="M0,10 L-16,26" />
                <path d="M0,10 L16,26" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}



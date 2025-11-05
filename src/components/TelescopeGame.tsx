import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/mini-game.css';
import { samplePathYAtX } from './game/shared/paths';
import { GRAVITY, MOVE_ACCEL, MAX_SPEED_X, JUMP_SPEED, FRICTION_AIR, FRICTION_GROUND, clampDt } from './game/shared/physics';
import { STAR_FACTS } from '../data/stars_facts';
import GameOverlay from './GameOverlay';

type Vec2 = { x: number; y: number };

type Player = {
  pos: Vec2;
  vel: Vec2;
  grounded: boolean;
  facing: 1 | -1;
  dropUntil: number;
};

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

export default function TelescopeGame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const hill1Ref = useRef<SVGPathElement>(null);
  const hill2Ref = useRef<SVGPathElement>(null);
  const hill3Ref = useRef<SVGPathElement>(null);
  const ridge1Ref = useRef<SVGPathElement>(null);
  const ridge2Ref = useRef<SVGPathElement>(null);
  const ridge3Ref = useRef<SVGPathElement>(null);

  const keys = useRef({ left: false, right: false, up: false, down: false, enter: false });

  const [player, setPlayer] = useState<Player>({ pos: { x: 250, y: 515 }, vel: { x: 0, y: 0 }, grounded: false, facing: 1, dropUntil: 0 });
  const playerRef = useRef(player);
  useEffect(() => { playerRef.current = player; }, [player]);

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragLast = useRef<{ x: number; y: number } | null>(null);
  const [, setZenScore] = useState(0);
  const [jarHeld, setJarHeld] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [p2Enabled, setP2Enabled] = useState(false);
  const [p2Name, setP2Name] = useState('Player 2');
  const [windTarget, setWindTarget] = useState(6);
  const [streakTarget, setStreakTarget] = useState(0);
  const [ambientOn, setAmbientOn] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [started, setStarted] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<'pong' | 'flappy'>('pong');

  // Wind curls moving across the sky
  type Wind = { id: number; x: number; y: number; speed: number; life: number; maxLife: number; scale: number };
  const [winds, setWinds] = useState<Wind[]>(() => []);
  const windNextId = useRef(1);
  const windSpawnTimer = useRef(0);
  // Shooting stars
  type Streak = { id: number; x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const streakNextId = useRef(1);
  const streakSpawnTimer = useRef(0);
  // Ambient audio (simple gentle tone with slow amplitude LFO)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainOscRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  function startAmbient() {
    if (audioCtxRef.current) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const mainOsc = ctx.createOscillator();
    const mainGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    mainOsc.type = 'sine';
    mainOsc.frequency.value = 432; // gentle
    mainGain.gain.value = volume;
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // slow tremolo
    lfoGain.gain.value = volume * 0.6;
    lfo.connect(lfoGain);
    lfoGain.connect(mainGain.gain);
    mainOsc.connect(mainGain);
    mainGain.connect(ctx.destination);
    mainOsc.start();
    lfo.start();
    audioCtxRef.current = ctx;
    mainOscRef.current = mainOsc;
    lfoRef.current = lfo;
    mainGainRef.current = mainGain;
    lfoGainRef.current = lfoGain;
  }
  function stopAmbient() {
    if (!audioCtxRef.current) return;
    try { mainOscRef.current?.stop(); lfoRef.current?.stop(); } catch {}
    audioCtxRef.current.close();
    audioCtxRef.current = null;
    mainOscRef.current = null;
    lfoRef.current = null;
    mainGainRef.current = null;
    lfoGainRef.current = null;
  }
  useEffect(() => {
    if (ambientOn) startAmbient(); else stopAmbient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientOn]);
  useEffect(() => {
    if (mainGainRef.current) mainGainRef.current.gain.value = volume;
    if (lfoGainRef.current) lfoGainRef.current.gain.value = volume * 0.6;
  }, [volume]);
  type Firefly = { id: number; x: number; y: number; vx: number; vy: number };
  const [flies, setFlies] = useState<Firefly[]>(() => {
    const out: Firefly[] = [];
    for (let i = 0; i < 25; i++) {
      out.push({ id: i + 1, x: Math.random() * VIEW_W, y: 300 + Math.random() * 200, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 20 });
    }
    return out;
  });

  // Use fixed positions from data to span left/center/right
  const starCloud = useMemo(() => STAR_FACTS, []);

  const caches = useMemo(() => [new Map<number, number>(), new Map<number, number>(), new Map<number, number>()], []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (['Enter', 'Escape', 'w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)) e.preventDefault();
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.left = down;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.right = down;
      if (e.key === 'w' || e.key === 'ArrowUp') keys.current.up = down;
      if (e.key === 's' || e.key === 'ArrowDown') keys.current.down = down;
      if (e.key === 'Enter') keys.current.enter = down;
      // Toggle jar on key down when near the jar/table
      if (down && (e.key === 'e' || e.key === 'E') && !overlayOpen) {
        const nearJar = Math.abs(playerRef.current.pos.x - 1130) < 30 && playerRef.current.grounded;
        if (nearJar) setJarHeld((h) => !h);
      }
      // Open overlay when near telescope on Enter
      if (down && e.key === 'Enter' && !overlayOpen) {
        const near = Math.abs(playerRef.current.pos.x - telescopeX) < 30 && playerRef.current.grounded;
        if (near) { setOverlayOpen(true); setFocused(false); }
      }
      // Open arcade when near cabinet on Enter
      if (down && e.key === 'Enter' && !arcadeOpen) {
        const nearCab = Math.abs(playerRef.current.pos.x - 120) < 40 && playerRef.current.grounded;
        if (nearCab) { setArcadeOpen(true); setActiveGame('pong'); }
      }
      if (overlayOpen) {
        const step = 20;
        if (down && (e.key === 'a' || e.key === 'ArrowLeft')) setPan((p) => ({ x: p.x - step, y: p.y }));
        if (down && (e.key === 'd' || e.key === 'ArrowRight')) setPan((p) => ({ x: p.x + step, y: p.y }));
        if (down && (e.key === 'w' || e.key === 'ArrowUp')) setPan((p) => ({ x: p.x, y: p.y - step }));
        if (down && (e.key === 's' || e.key === 'ArrowDown')) setPan((p) => ({ x: p.x, y: p.y + step }));
        if (down && e.key === 'Enter') setFocused((f) => !f);
        if (down && e.key === 'Escape') { setOverlayOpen(false); setFocused(false); }
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd, { passive: false });
    window.addEventListener('keyup', ku, { passive: false });
    return () => { window.removeEventListener('keydown', kd as any); window.removeEventListener('keyup', ku as any); };
  }, [overlayOpen]);

  useRaf((dt, tSec) => {
    if (!started || overlayOpen || arcadeOpen) return;
    const r1 = ridge1Ref.current, r2 = ridge2Ref.current, r3 = ridge3Ref.current;
    if (!r1 || !r2 || !r3) return;
    setPlayer((prev) => {
      const wasGrounded = prev.grounded;
      const pl = { ...prev, pos: { ...prev.pos }, vel: { ...prev.vel }, grounded: false };

      // Horizontal movement (parity with day)
      if (keys.current.left) { pl.vel.x -= MOVE_ACCEL * dt; pl.facing = -1; }
      if (keys.current.right) { pl.vel.x += MOVE_ACCEL * dt; pl.facing = 1; }
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

      // Drop-through initiation
      if (wasGrounded && keys.current.down) {
        pl.dropUntil = tSec + 0.25;
        pl.grounded = false;
        pl.pos.y += 3;
        if (pl.vel.y < 50) pl.vel.y = 50;
      }
      const dropActive = tSec < pl.dropUntil;

      // Ground collision via ridges
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
        pl.pos.y = groundY;
        pl.vel.y = 0;
        pl.grounded = true;
      }

      // Jump
      if (keys.current.up && pl.grounded) { pl.vel.y = -JUMP_SPEED; pl.grounded = false; }

      // Friction
      const fric = pl.grounded ? FRICTION_GROUND : FRICTION_AIR;
      if (!keys.current.left && !keys.current.right) {
        if (pl.vel.x > 0) pl.vel.x = Math.max(0, pl.vel.x - fric * dt);
        if (pl.vel.x < 0) pl.vel.x = Math.min(0, pl.vel.x + fric * dt);
      }

      return pl;
    });

    // (Jar toggling handled on keydown now)

    // Update fireflies wander
    setFlies((prev) => prev.map((f) => {
      let { x, y, vx, vy } = f;
      vx += (Math.random() - 0.5) * 10 * dt;
      vy += (Math.random() - 0.5) * 10 * dt;
      vx = Math.max(-60, Math.min(60, vx));
      vy = Math.max(-40, Math.min(40, vy));
      x += vx * dt; y += vy * dt;
      if (x < 20) { x = 20; vx = Math.abs(vx); }
      if (x > VIEW_W - 20) { x = VIEW_W - 20; vx = -Math.abs(vx); }
      if (y < 320) { y = 320; vy = Math.abs(vy); }
      if (y > VIEW_H - 40) { y = VIEW_H - 40; vy = -Math.abs(vy); }
      return { id: f.id, x, y, vx, vy };
    }));

    // Catch with jar while jumping upward and colliding with a fly
    if (jarHeld) {
      const jarPos = { x: playerRef.current.pos.x + 16, y: playerRef.current.pos.y - 20 };
      const jumpingUp = playerRef.current.vel.y < 0;
      if (jumpingUp) {
        setFlies((prev) => prev.map((f) => {
          const d = Math.hypot(f.x - jarPos.x, f.y - jarPos.y);
          if (d < 20) { // slightly wider than the jar
            // caught: increment score and respawn fly
            setZenScore((s) => s + 1);
            return { ...f, x: Math.random() * VIEW_W, y: 320 + Math.random() * 200, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 20 };
          }
          return f;
        }));
      }
    }

    // Spawn and move wind gusts (configurable)
    windSpawnTimer.current -= dt;
    if (winds.length < windTarget && windSpawnTimer.current <= 0) {
      windSpawnTimer.current = 0.1; // spawn frequently until target reached
      const id = windNextId.current++;
      const y = 60 + Math.random() * (VIEW_H - 160);
      const speed = 60 + Math.random() * 80;
      const scale = 0.7 + Math.random() * 0.8;
      setWinds((prev) => [...prev, { id, x: VIEW_W + 40, y, speed, life: 0, maxLife: (VIEW_W + 100) / speed, scale }]);
    }
    setWinds((prev) => prev
      .map((w) => ({ ...w, x: w.x - w.speed * dt, life: w.life + dt }))
      .filter((w) => w.x > -120));

    // Shooting stars
    streakSpawnTimer.current -= dt;
    if (streaks.length < streakTarget && streakSpawnTimer.current <= 0) {
      streakSpawnTimer.current = 0.6;
      const id = streakNextId.current++;
      // spawn near top-right, travel down-left
      const y = 40 + Math.random() * 160;
      const x = VIEW_W - Math.random() * 200;
      const speed = 300 + Math.random() * 200;
      const angle = (-35 * Math.PI) / 180;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      setStreaks((prev) => [...prev, { id, x, y, vx, vy, life: 0, maxLife: 1.2 }]);
    }
    setStreaks((prev) => prev
      .map((s) => ({ ...s, x: s.x + s.vx * dt, y: s.y + s.vy * dt, life: s.life + dt }))
      .filter((s) => s.life < s.maxLife));
  });

  // telescope hotspot (right side near x ~ 1040)
  const telescopeX = 1040;
  const nearTelescope = Math.abs(player.pos.x - telescopeX) < 30 && player.grounded;
  // arcade cabinet hotspot (left side)
  const cabinetX = 120;
  const nearCabinet = Math.abs(player.pos.x - cabinetX) < 30 && player.grounded;
  useEffect(() => {
    if (!overlayOpen && nearTelescope && keys.current.enter) {
      setOverlayOpen(true);
      setFocused(false);
    }
  }, [nearTelescope, overlayOpen]);
  useEffect(() => {
    if (!arcadeOpen && nearCabinet && keys.current.enter) {
      setArcadeOpen(true);
      setActiveGame('pong');
    }
  }, [nearCabinet, arcadeOpen]);

  const idlePhase = useRef(0);
  useRaf((dt) => { idlePhase.current += dt; });

  return (
    <div className="relative w-full h-full">
      {/* User Menu (top-left) */}
      <div className="absolute top-2 left-3 z-30">
        <button
          type="button"
          className="glass-card rounded-md px-3 py-1 text-sm text-[color:var(--text)]"
          onClick={() => setShowMenu((v) => !v)}
        >Menu</button>
        {showMenu && (
          <div className="mt-2 glass-card rounded-md p-3 w-64 text-[color:var(--text)]">
            <div className="text-sm mb-3">
              <div className="mb-1">Wind gusts: {windTarget}</div>
              <input type="range" min={0} max={12} step={1} value={windTarget} onChange={(e) => setWindTarget(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="text-sm mb-3">
              <div className="mb-1">Shooting stars: {streakTarget}</div>
              <input type="range" min={0} max={20} step={1} value={streakTarget} onChange={(e) => setStreakTarget(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="text-sm mb-3">
              <div className="mb-1 flex items-center justify-between">
                <span>Ambient</span>
                <button type="button" className="rounded px-2 py-0.5 border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)]" onClick={() => setAmbientOn((v) => !v)}>{ambientOn ? 'Pause' : 'Play'}</button>
              </div>
              <div className="mb-1">Volume</div>
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="text-sm mb-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={p2Enabled} onChange={(e) => setP2Enabled(e.target.checked)} />
                Enable second player (beta)
              </label>
            </div>
            {p2Enabled && (
              <div className="text-sm mb-2">
                <label className="block mb-1">Second player name</label>
                <input
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full rounded px-2 py-1 bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] text-[color:var(--text)]"
                />
                <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">Controls: Arrow keys</div>
              </div>
            )}
            <button
              type="button"
              className="mt-2 w-full rounded-md px-3 py-1 text-sm border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] hover:bg-[color:var(--glass-bg)]/80"
              onClick={() => { window.location.href = '/'; }}
            >Quit</button>
          </div>
        )}
      </div>
      {!started && (
        <GameOverlay
          title="Starry Night"
          description="Single-player. Wander the hills, catch fireflies with the jar, and gaze at the stars with the telescope. Relax and enjoy the night."
          rules={["E near the jar to grab/drop","Jump upward into a firefly to catch +1 zen","Enter near telescope to look closely"]}
          controls={["Move: A/D or ◀ ▶","Jump: W or ▲","Drop-through: S or ▼"]}
          startLabel="Start"
          onStart={() => setStarted(true)}
        />
      )}

      <svg
        ref={svgRef}
        viewBox={`${0} ${0} ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="game-svg block w-[100vw] max-w-none h-full"
        role="img"
        aria-label="Starry telescope game"
      >
        {/* padding group to align child indexes (so hills are g:nth-child(3) and (4)) */}
        <g className="pad" opacity={0} />
        {/* faint star field (always visible) */}
        <g className="sky-stars" opacity={0.5}>
          {starCloud.map((s) => {
            // Map fixed data coords to full SVG (container) width/height
            const sx = ((s.x + 300) / 600) * VIEW_W;   // x: [-300,300] -> [0, VIEW_W]
            const sy = ((s.y + 180) / 360) * VIEW_H;   // y: [-180,180] -> [0, VIEW_H]
            return <circle key={`bg-${s.id}`} cx={sx} cy={sy} r={1.8} fill="var(--text)" opacity={0.6} />;
          })}
        </g>
        {/* Fills */}
        <g className="hills">
          <path ref={hill3Ref} className="hill hill-3" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470 L1200,600 L0,600 Z" />
          <path ref={hill2Ref} className="hill hill-2" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530 L1200,600 L0,600 Z" />
          <path ref={hill1Ref} className="hill hill-1" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580 L1200,600 L0,600 Z" />
        </g>
        {/* Ridges */}
        <g className="hills">
          <path ref={ridge3Ref} className="hill-stroke" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470" />
          <path ref={ridge2Ref} className="hill-stroke" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530" />
          <path ref={ridge1Ref} className="hill-stroke" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580" />
        </g>

        {/* Trees & extra grass */}
         <g className="scenery">
          {/* simple trees on foreground hill */}
          <g>
            {/* tree 1 */}
            <rect x={180} y={520} width={8} height={40} fill="rgba(255,255,255,0.12)" />
            <circle cx={184} cy={510} r={18} fill="var(--grass)" opacity={0.4} />
            <circle cx={174} cy={516} r={12} fill="var(--grass)" opacity={0.35} />
            <circle cx={194} cy={516} r={12} fill="var(--grass)" opacity={0.35} />
          </g>
          <g>
            {/* tree 2 */}
            <rect x={420} y={530} width={8} height={36} fill="rgba(255,255,255,0.12)" />
            <circle cx={424} cy={522} r={16} fill="var(--grass)" opacity={0.4} />
            <circle cx={414} cy={528} r={10} fill="var(--grass)" opacity={0.35} />
            <circle cx={434} cy={528} r={10} fill="var(--grass)" opacity={0.35} />
          </g>
          <g>
            {/* tree 3 */}
            <rect x={820} y={528} width={8} height={38} fill="rgba(255,255,255,0.12)" />
            <circle cx={824} cy={518} r={17} fill="var(--grass)" opacity={0.4} />
            <circle cx={814} cy={524} r={11} fill="var(--grass)" opacity={0.35} />
            <circle cx={834} cy={524} r={11} fill="var(--grass)" opacity={0.35} />
          </g>

          {/* extra grass tufts along foreground */}
          <g>
            <path d="M 140 560 L 150 540" className="tuft-blade" />
            <path d="M 140 560 L 146 546" className="tuft-blade" />
            <path d="M 140 560 L 154 546" className="tuft-blade" />

            <path d="M 360 562 L 370 542" className="tuft-blade" />
            <path d="M 360 562 L 366 548" className="tuft-blade" />
            <path d="M 360 562 L 374 548" className="tuft-blade" />

            <path d="M 700 558 L 710 538" className="tuft-blade" />
            <path d="M 700 558 L 706 544" className="tuft-blade" />
            <path d="M 700 558 L 714 544" className="tuft-blade" />

            <path d="M 980 556 L 990 536" className="tuft-blade" />
            <path d="M 980 556 L 986 542" className="tuft-blade" />
            <path d="M 980 556 L 994 542" className="tuft-blade" />
          </g>
          {/* big swaying trees on top hill (background) */}
          {(() => {
            const sway = Math.sin(idlePhase.current * 0.7) * 3; // degrees
            const trees = [
              { x: 260, y: 500 },
              { x: 520, y: 492 },
              { x: 780, y: 496 },
              { x: 1000, y: 488 },
            ];
            return (
              <g>
                {trees.map((t, i) => (
                  <g key={i} transform={`translate(${t.x},${t.y}) rotate(${sway})`}>
                    <rect x={-6} y={0} width={12} height={60} fill="rgba(255,255,255,0.12)" />
                    <circle cx={0} cy={-10} r={26} fill="var(--grass)" opacity={0.35} />
                    <circle cx={-16} cy={-2} r={18} fill="var(--grass)" opacity={0.3} />
                    <circle cx={16} cy={-2} r={18} fill="var(--grass)" opacity={0.3} />
                  </g>
                ))}
              </g>
            );
          })()}

          {/* wind gusts like wind.css/html */}
          <g className="wind-gusts">
            {winds.slice(0, windTarget).map((w, idx) => (
              <g key={w.id} className="wind-gust-move" style={{ animationDelay: `${(idx % 6) * 0.6}s` }} transform={`translate(0,${w.y - 200}) scale(3)`}>
                <path
                  className="wind-gust-path"
                  d="M-34.8,166.8c51.6,1.9,70.9,16.4,78.4,30.3c10.9,20.1-3.6,37.5,6.9,75c3.9,14,11.8,42.2,33.7,50.9
                  c25.7,10.2,65.3-8.7,76.4-36.5c13.8-34.4-26.4-57.5-19.3-110.1c3.3-24.1,17.1-58.7,44.7-67.4c34.9-10.9,84.3,21.7,90.8,65.4
                  c5.3,36-20.6,66.1-42.6,79.8c-39.5,24.5-95.7,14.9-108-7.6c-0.5-0.9-7.9-14.7-2.1-22.7c3.7-5,10.9-5.4,13.1-5.5
                  c15.4-0.8,28.1,12.1,33,17.2c46.5,48.5,53.9,63.9,72.2,75.7c24.1,15.6,66.1,24.2,90.8,6.9c36.4-25.5,7.6-88,49.5-130.7
                  c17.6-17.9,40-24.6,56.4-27.5"
                  strokeDasharray="100 1200"
                />
                {/* faint expanding circle accent */}
                <circle className="wind-gust-circle" cx="40" cy="210" r="25" />
              </g>
            ))}
          </g>
          {/* shooting stars */}
          <g className="shooting-stars">
            {streaks.map((s) => (
              <line key={s.id} x1={s.x} y1={s.y} x2={s.x - 30} y2={s.y + 18} stroke="var(--meteor-color)" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
            ))}
          </g>
          {/* arcade cabinet (left) */}
          <g className="arcade" transform="translate(120,540)">
            <g
              role="button"
              tabIndex={0}
              onClick={() => { setArcadeOpen(true); setActiveGame('pong'); }}
              className="cursor-pointer"
            >
              {/* enlarged invisible hitbox */}
              <rect x={-60} y={-110} width={120} height={120} fill="transparent" />
              <rect x={-40} y={-90} width={80} height={90} rx={6} ry={6} fill="rgba(255,255,255,0.06)" stroke="var(--figure)" strokeWidth={2} />
              <rect x={-30} y={-80} width={60} height={34} rx={4} ry={4} fill="black" stroke="var(--figure)" strokeWidth={1} />
              <circle cx={-12} cy={-26} r={3} fill="var(--meteor-color)" />
              <circle cx={0} cy={-26} r={3} fill="var(--text)" />
              <rect x={-10} y={-20} width={20} height={4} rx={2} fill="var(--figure)" />
            </g>
            {nearCabinet && !arcadeOpen && (
              <text x={0} y={-100} textAnchor="middle" fontSize="12" fill="var(--text)">Press Enter to play</text>
            )}
            <text x={0} y={-86} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Arcade</text>
          </g>
        </g>

         {/* Right-side table and telescope */}
        <g className="telescope-area">
          {/* tabletop */}
           <rect x={940} y={540} width={260} height={12} fill="rgba(255,255,255,0.08)" />
          {/* legs (placed below the tabletop) */}
           <rect x={960} y={552} width={16} height={26} fill="rgba(255,255,255,0.08)" />
           <rect x={1065} y={552} width={16} height={26} fill="rgba(255,255,255,0.08)" />
           <rect x={1170} y={552} width={16} height={26} fill="rgba(255,255,255,0.08)" />
          {/* simple telescope */}
          <line x1={1040} y1={520} x2={1088} y2={500} stroke="var(--figure)" strokeWidth={3} />
          <circle cx={1092} cy={498} r={10} fill="none" stroke="var(--figure)" strokeWidth={2} />
           {/* jar on table if not held */}
           {!jarHeld && (
             <g>
               <ellipse cx={1130} cy={538} rx={10} ry={4} fill="rgba(255,255,255,0.1)" />
               <rect x={1122} y={510} width={16} height={28} rx={4} ry={4} fill="none" stroke="var(--figure)" strokeWidth={2} />
               {/* flowing lights in jar */}
               <circle cx={1126} cy={520} r={1.5} fill="var(--meteor-color)" opacity={0.7} />
               <circle cx={1132} cy={528} r={1.2} fill="var(--meteor-color)" opacity={0.5} />
               <circle cx={1128} cy={533} r={1.4} fill="var(--meteor-color)" opacity={0.6} />
               {Math.abs(player.pos.x - 1130) < 30 && player.grounded && (
                 <text x={1130} y={500} textAnchor="middle" fontSize="10" fill="var(--text)">Press E to grab jar</text>
               )}
             </g>
           )}
          {nearTelescope && !overlayOpen && (
            <text x={1040} y={490} textAnchor="middle" fontSize="12" fill="var(--text)">Press Enter to use telescope</text>
          )}
        </g>

        {/* One stick figure */}
        <g className="figures">
          {(() => {
            const sway = player.grounded && Math.abs(player.vel.x) < 1 ? Math.sin(idlePhase.current * 2) * 3 : 0;
            const tx = player.pos.x + sway;
            const ty = player.pos.y;
             return (
              <g className="figure" transform={`translate(${tx},${ty})`}>
                <circle cx="0" cy="-40" r={14} />
                <path d="M0,-26 L0,10" />
                <path d="M0,-10 L-18,6" />
                <path d="M0,-10 L18,6" />
                <path d="M0,10 L-16,26" />
                <path d="M0,10 L16,26" />
                 {/* held jar on right hand */}
                 {jarHeld && (
                   <g transform={`translate(16,-20)`}>
                     <rect x={-8} y={-10} width={16} height={20} rx={4} ry={4} fill="none" stroke="var(--figure)" strokeWidth={2} />
                     <circle cx={-3} cy={-2} r={1.2} fill="var(--meteor-color)" opacity={0.7} />
                     <circle cx={2} cy={4} r={1.1} fill="var(--meteor-color)" opacity={0.5} />
                   </g>
                 )}
              </g>
            );
          })()}
        </g>

        {/* fireflies */}
        <g className="fireflies">
          {flies.map((f) => (
            <circle key={f.id} cx={f.x} cy={f.y} r={2} fill="var(--meteor-color)" opacity={0.8} />
          ))}
        </g>
      </svg>

      {/* center HUD removed per request */}

      {/* Arcade overlay */}
      {arcadeOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="glass-card rounded-lg p-4 w-[92%] max-w-3xl text-center relative">
            <button
              type="button"
              className="absolute top-2 left-2 text-xs px-2 py-1 rounded border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--text)]"
              onClick={() => setArcadeOpen(false)}
            >Exit</button>
            <div className="mb-3 flex items-center justify-center gap-4 text-sm">
              <button
                type="button"
                className={`px-3 py-1 rounded border ${activeGame==='pong' ? 'border-[color:var(--meteor-color)]' : 'border-[color:var(--glass-border)]'}`}
                onClick={() => setActiveGame('pong')}
              >Pong</button>
              <button
                type="button"
                className={`px-3 py-1 rounded border ${activeGame==='flappy' ? 'border-[color:var(--meteor-color)]' : 'border-[color:var(--glass-border)]'}`}
                onClick={() => setActiveGame('flappy')}
              >Flappy</button>
            </div>
            {activeGame === 'pong' ? <PongMini /> : <FlappyStub />}
          </div>
        </div>
      )}

      {/* Telescope overlay */}
      {overlayOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="glass-card rounded-lg p-4 w-[92%] max-w-2xl text-center relative">
            <button
              type="button"
              className="absolute top-2 left-2 text-xs px-2 py-1 rounded border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--text)]"
              onClick={() => { setOverlayOpen(false); setFocused(false); }}
            >Exit</button>
            <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Pan with mouse drag or arrows. Enter to toggle focus.</div>
            <div
              className="relative mx-auto my-2 w-[28rem] h-[28rem] rounded border border-[color:var(--glass-border)] bg-black/30 overflow-hidden"
              onMouseDown={(e) => { dragging.current = true; dragLast.current = { x: e.clientX, y: e.clientY }; }}
              onMouseUp={() => { dragging.current = false; dragLast.current = null; }}
              onMouseLeave={() => { dragging.current = false; dragLast.current = null; }}
              onMouseMove={(e) => {
                if (!dragging.current || !dragLast.current) return;
                const dx = e.clientX - dragLast.current.x;
                const dy = e.clientY - dragLast.current.y;
                dragLast.current = { x: e.clientX, y: e.clientY };
                setPan((p) => ({ x: p.x - dx, y: p.y - dy }));
              }}
            >
              {/* stars field */}
              <svg viewBox={`0 0 448 448`} className="absolute inset-0 w-full h-full">
                {starCloud.map((s) => {
                  const sx = 224 + s.x - pan.x;
                  const sy = 224 + s.y - pan.y;
                  return <circle key={s.id} cx={sx} cy={sy} r={2} fill="var(--text)" opacity={0.8} />;
                })}
                {/* crosshair */}
                <circle cx={224} cy={224} r={8} fill="none" stroke="var(--meteor-color)" strokeWidth={1} />
                <line x1={224} y1={214} x2={224} y2={234} stroke="var(--meteor-color)" strokeWidth={1} />
                <line x1={214} y1={224} x2={234} y2={224} stroke="var(--meteor-color)" strokeWidth={1} />
              </svg>
            </div>
            {(() => {
              // find nearest star to crosshair within threshold
              const threshold = 12;
              let nearest = null as null | typeof starCloud[number];
              let best = Infinity;
              for (const s of starCloud) {
                const sx = 224 + s.x - pan.x;
                const sy = 224 + s.y - pan.y;
                const dx = sx - 224;
                const dy = sy - 224;
                const d = Math.hypot(dx, dy);
                if (d < best) { best = d; nearest = s; }
              }
              if (nearest && best <= threshold) {
                return (
                  <div className="mt-2">
                    <div className="text-lg font-semibold gradient-text">{nearest.name}</div>
                    <div className="text-[color:var(--muted-foreground)] mt-1">{focused ? nearest.fact : 'Press Enter to focus'}</div>
                  </div>
                );
              }
              return <div className="mt-2 text-[color:var(--muted-foreground)]">Move the crosshair over a star</div>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function PongMini() {
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
    window.addEventListener('keydown', (e) => onKey(e, true));
    window.addEventListener('keyup', (e) => onKey(e, false));
    return () => {
      window.removeEventListener('keydown', (e) => onKey(e, true));
      window.removeEventListener('keyup', (e) => onKey(e, false));
    };
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

function FlappyStub() {
  return (
    <div className="mx-auto w-[480px] h-[320px] rounded border border-[color:var(--glass-border)] flex items-center justify-center bg-black/40">
      <div className="text-sm text-[color:var(--muted-foreground)]">Flappy — coming soon</div>
    </div>
  );
}



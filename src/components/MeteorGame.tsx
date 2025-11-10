import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/mini-game.css';
import { samplePathYAtX } from './game/shared/paths';
import { GRAVITY, MOVE_ACCEL, MAX_SPEED_X, JUMP_SPEED, FRICTION_AIR, FRICTION_GROUND, clampDt } from './game/shared/physics';
import GameOverlay from './GameOverlay';
import desertSunAudio from '../assets/desert-sun-164212.mp3';
import pterodactylSvg from '../assets/pterodatcyl.svg?url';

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
type Dinosaur = { id: number; x: number; y: number; speed: number; active: boolean; warningUntil: number; spawnTime: number; ridgeIndex: number };
type Pterodactyl = {
  id: number;
  // Bezier curve points for natural swooping motion
  startX: number;
  startY: number;
  controlX: number; // Dive point (aims at player)
  controlY: number;
  endX: number;
  endY: number;
  progress: number; // 0 to 1, progress along the curve
  speed: number; // How fast it moves along the curve
  active: boolean;
  warningUntil: number;
  spawnTime: number;
  targetPlayerIndex: number; // Which player to target
  fromLeft: boolean; // true if coming from left (no flip), false if from right (flip 180)
};

const VIEW_W = 1200;
const VIEW_H = 600;

// Dinosaur constants
const DINOSAUR_SPAWN_INTERVAL = 5; // Changed to 5 seconds for testing
const DINOSAUR_WARNING_DURATION = 3;
const DINOSAUR_SPEED = 250;
const DINOSAUR_DAMAGE = 1.5;
const DINOSAUR_COLLISION_RADIUS = 30;

// Pterodactyl constants
const PTERODACTYL_SPAWN_INTERVAL = 15; // Spawn every 15 seconds
const PTERODACTYL_WARNING_DURATION = 2;
const PTERODACTYL_SPEED = 0.2; // Progress per second along curve (much slower)
const PTERODACTYL_DAMAGE = 1.5;
const PTERODACTYL_COLLISION_RADIUS = 40;
const PTERODACTYL_START_HEIGHT = 80; // Start high in the sky
const PTERODACTYL_END_HEIGHT = 80; // End high in the sky

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

  const leftKeys = useRef({ left: false, right: false, up: false, down: false, e: false, enter: false });
  const rightKeys = useRef({ left: false, right: false, up: false, down: false, e: false, enter: false });

  const [players, setPlayers] = useState<Player[]>([
    { pos: { x: 250, y: 515 }, vel: { x: 0, y: 0 }, grounded: false, facing: 1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
    { pos: { x: 950, y: 525 }, vel: { x: 0, y: 0 }, grounded: false, facing: -1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
  ]);
  const playersRef = useRef(players);
  useEffect(() => { playersRef.current = players; }, [players]);

  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [dinosaurs, setDinosaurs] = useState<Dinosaur[]>([]);
  const [pterodactyls, setPterodactyls] = useState<Pterodactyl[]>([]);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeSurvived, setTimeSurvived] = useState(0);
  const [survivedCount, setSurvivedCount] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; player: number; text: string; life: number; maxLife: number }[]>([]);
  const nextId = useRef(1);
  const spawnTimer = useRef(0);
  const dinosaurNextId = useRef(1);
  const dinosaurSpawnTimer = useRef(0);
  const nextRidgeIndex = useRef(0); // Track which ridge to use next (0, 1, or 2)
  const pterodactylNextId = useRef(1);
  const pterodactylSpawnTimer = useRef(0);
  const [showMenu, setShowMenu] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const caches = useMemo(() => [new Map<number, number>(), new Map<number, number>(), new Map<number, number>()], []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'e', 'E', 'Enter'].includes(e.key)) e.preventDefault();
      // Make E and Enter interchangeable
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        leftKeys.current.e = down;
        rightKeys.current.e = down;
        leftKeys.current.enter = down;
        rightKeys.current.enter = down;
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
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd, { passive: false });
    window.addEventListener('keyup', ku, { passive: false });
    return () => { window.removeEventListener('keydown', kd as any); window.removeEventListener('keyup', ku as any); };
  }, []);

  // Wind gusts visuals (simple spawn and drift)
  type Wind = { id: number; x: number; y: number; speed: number; life: number; maxLife: number; scale: number };
  const [winds, setWinds] = useState<Wind[]>([]);
  const windNextId = useRef(1);
  const windSpawnTimer = useRef(0);

  useRaf((dt) => {
    windSpawnTimer.current -= dt;
    const target = 6;
    if (winds.length < target && windSpawnTimer.current <= 0) {
      windSpawnTimer.current = 0.2;
      const id = windNextId.current++;
      const y = 80 + Math.random() * 300;
      const speed = 60 + Math.random() * 80;
      const scale = 0.7 + Math.random() * 0.8;
      setWinds((prev) => [...prev, { id, x: VIEW_W + 40, y, speed, life: 0, maxLife: (VIEW_W + 100) / speed, scale }]);
    }
    setWinds((prev) => prev.map((w) => ({ ...w, x: w.x - w.speed * dt, life: w.life + dt })).filter((w) => w.x > -120));
  });

  // Single red-foliage tree with apple drop
  const treeX = 200; // top-left hill area (more dangerous)
  const treeY = 470; // higher on the hill
  const appleCooldownUntil = useRef(0);
  const appleDropInterval = useRef(30); // Auto-drop every 30 seconds
  const [apple, setApple] = useState<{ x: number; y: number; vy: number } | null>(null);
  
  // Audio setup
  useEffect(() => {
    if (!audioElementRef.current) {
      const audio = new Audio(desertSunAudio);
      audio.loop = true;
      audio.volume = volume;
      audioElementRef.current = audio;
    }
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    if (audioElementRef.current && started && !gameOver) {
      if (musicEnabled) {
        audioElementRef.current.play().catch(() => {});
      } else {
        audioElementRef.current.pause();
      }
    } else if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  }, [musicEnabled, started, gameOver]);

  useRaf((dt, tSec) => {
    const r1 = ridge1Ref.current, r2 = ridge2Ref.current, r3 = ridge3Ref.current;
    if (!r1 || !r2 || !r3) return;
    if (!started || gameOver) return; // pause game until started or after over
    setTimeSurvived(tSec);
    currentTimeRef.current = tSec;

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

    // Spawn dinosaurs every 5 seconds (testing) - can spawn 1 or 2 at a time
    dinosaurSpawnTimer.current += dt;
    if (dinosaurSpawnTimer.current >= DINOSAUR_SPAWN_INTERVAL) {
      dinosaurSpawnTimer.current = 0;
      const spawnTime = tSec;
      const warningUntil = spawnTime + DINOSAUR_WARNING_DURATION;
      
      // Randomly spawn 1 or 2 dinosaurs
      const spawnCount = Math.random() < 0.5 ? 1 : 2;
      const newDinosaurs: Dinosaur[] = [];
      
      // Track which ridges we're using to avoid duplicates when spawning 2
      const usedRidges = new Set<number>();
      
      for (let i = 0; i < spawnCount; i++) {
        // Select a ridge that hasn't been used yet
        let ridgeIndex: number;
        if (usedRidges.size < 3) {
          // Try to pick an unused ridge
          const availableRidges = [0, 1, 2].filter(r => !usedRidges.has(r));
          ridgeIndex = availableRidges[Math.floor(Math.random() * availableRidges.length)];
        } else {
          // All ridges used, just cycle through
          ridgeIndex = nextRidgeIndex.current;
          nextRidgeIndex.current = (nextRidgeIndex.current + 1) % 3;
        }
        
        usedRidges.add(ridgeIndex);
        nextRidgeIndex.current = (ridgeIndex + 1) % 3; // Advance for next spawn
        
        newDinosaurs.push({
          id: dinosaurNextId.current++,
          x: VIEW_W + 50,
          y: 0,
          speed: DINOSAUR_SPEED,
          active: true,
          warningUntil,
          spawnTime,
          ridgeIndex,
        });
      }
      
      setDinosaurs((prev) => [...prev, ...newDinosaurs]);
    }

    // Spawn pterodactyls
    pterodactylSpawnTimer.current += dt;
    if (pterodactylSpawnTimer.current >= PTERODACTYL_SPAWN_INTERVAL) {
      pterodactylSpawnTimer.current = 0;
      const spawnTime = tSec;
      const warningUntil = spawnTime + PTERODACTYL_WARNING_DURATION;
      
      // Pick a random player to target
      const livingPlayers = playersRef.current.filter((p) => p.lives > 0);
      if (livingPlayers.length > 0) {
        const targetPlayer = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
        const targetPlayerIndex = playersRef.current.indexOf(targetPlayer);
        
        // Determine start side (random: left or right)
        const fromLeft = Math.random() < 0.5;
        const startX = fromLeft ? -150 : VIEW_W + 150;
        const startY = PTERODACTYL_START_HEIGHT;
        
        // End on opposite side
        const endX = fromLeft ? VIEW_W + 150 : -150;
        const endY = PTERODACTYL_END_HEIGHT;
        
        // Control point aims at player's position at spawn time for sharp dive
        // Make it dive to the player's actual Y position (or close to it) for a sharp swoop
        // Allow it to dive as low as the player is on the hills
        const controlX = targetPlayer.pos.x;
        const controlY = targetPlayer.pos.y; // Dive directly to player's Y position
        
        setPterodactyls((prev) => [
          ...prev,
          {
            id: pterodactylNextId.current++,
            startX,
            startY,
            controlX,
            controlY,
            endX,
            endY,
            progress: 0,
            speed: PTERODACTYL_SPEED,
            active: true,
            warningUntil,
            spawnTime,
            targetPlayerIndex,
            fromLeft,
          },
        ]);
      }
    }

    // Auto-drop apple every 30 seconds
    if (tSec >= appleCooldownUntil.current && !apple) {
      appleCooldownUntil.current = tSec + appleDropInterval.current;
      setApple({ x: treeX, y: treeY - 12, vy: -40 });
    }

    // Update players
    setPlayers((prev) => {
      const next = prev.map((p) => ({ ...p, pos: { ...p.pos }, vel: { ...p.vel }, grounded: false }));
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

    // Apple physics and pickup
    if (apple) {
      setApple((a) => {
        if (!a) return a;
        let vy = a.vy + GRAVITY * dt * 0.6;
        let y = a.y + vy * dt;
        if (y > 560) { y = 560; vy = 0; }
        return { x: a.x, y, vy };
      });
      // pickup by any living player
      setPlayers((prevP) => {
        if (!apple) return prevP;
        const picked = prevP.some((pl) => pl.lives > 0 && Math.hypot(pl.pos.x - apple.x, pl.pos.y - apple.y) < 16);
        if (picked) {
          setApple(null);
          return prevP.map((pl) => {
            if (pl.lives <= 0) return pl;
            if (Math.hypot(pl.pos.x - treeX, pl.pos.y - 560) < 60) {
              return { ...pl, lives: Math.min(3, pl.lives + 0.5) };
            }
            return pl;
          });
        }
        return prevP;
      });
    }

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

    // Update dinosaurs
    setDinosaurs((prev) => {
      const ridgeRefs = [ridge1Ref.current, ridge2Ref.current, ridge3Ref.current];
      
      const updated = prev.map((dino) => {
        if (!dino.active) return dino;
        
        // Calculate Y position on the assigned ridge
        const ridgeRef = ridgeRefs[dino.ridgeIndex];
        if (ridgeRef) {
          const dinoY = samplePathYAtX(ridgeRef, dino.x, caches[dino.ridgeIndex]);
          if (dinoY != null) {
            dino.y = dinoY - 20; // Offset slightly above the ridge for visual
          }
        }
        
        // Only move after warning period
        if (tSec >= dino.warningUntil) {
          dino.x -= dino.speed * dt;
        }
        
        // Deactivate if off screen
        if (dino.x < -100) {
          dino.active = false;
        }
        
        return dino;
      });
      
      // Check collisions with players
      updated.forEach((dino) => {
        if (!dino.active || tSec < dino.warningUntil) return;
        
        setPlayers((prevP) => {
          return prevP.map((pl, pi) => {
            if (pl.lives <= 0 || tSec < pl.invulnUntil) return pl;
            
            // Check if player is on the same ridge as the dinosaur
            const ridgeRef = ridgeRefs[dino.ridgeIndex];
            if (!ridgeRef) return pl;
            
            const playerYOnRidge = samplePathYAtX(ridgeRef, pl.pos.x, caches[dino.ridgeIndex]);
            const isOnRidge = playerYOnRidge != null && 
              Math.abs(pl.pos.y - playerYOnRidge) < 10; // Player is on this ridge
            
            if (isOnRidge) {
              // Check horizontal collision
              const dx = pl.pos.x - dino.x;
              
              if (Math.abs(dx) < DINOSAUR_COLLISION_RADIUS) {
                // Collision! Deal damage
                const newLives = Math.max(0, pl.lives - DINOSAUR_DAMAGE);
                setToasts((ts) => [
                  ...ts,
                  {
                    id: nextId.current++,
                    player: pi,
                    text: 'Dino Hit -1.5❤',
                    life: 0,
                    maxLife: 1.0,
                  },
                ]);
                return {
                  ...pl,
                  lives: newLives,
                  invulnUntil: tSec + 1.5, // Invulnerability period
                  deathAt: newLives <= 0 ? tSec : pl.deathAt,
                  streak: 0, // Reset streak on damage
                };
              }
            }
            return pl;
          });
        });
      });
      
      return updated.filter((d) => d.active);
    });

    // Update pterodactyls along their bezier curve paths
    setPterodactyls((prev) => {
      const updated = prev.map((ptero) => {
        if (!ptero.active) return ptero;
        
        // Only move after warning period
        if (tSec >= ptero.warningUntil) {
          ptero.progress += ptero.speed * dt;
          
          // Deactivate when path is complete
          if (ptero.progress >= 1) {
            ptero.active = false;
          }
        }
        
        return ptero;
      });
      
      // Calculate positions using quadratic bezier curve
      // B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
      // Where P₀ is start, P₁ is control, P₂ is end
      updated.forEach((ptero) => {
        if (!ptero.active || tSec < ptero.warningUntil) return;
        
        const t = ptero.progress;
        const oneMinusT = 1 - t;
        
        // Quadratic bezier curve calculation
        const x = oneMinusT * oneMinusT * ptero.startX + 
                  2 * oneMinusT * t * ptero.controlX + 
                  t * t * ptero.endX;
        const y = oneMinusT * oneMinusT * ptero.startY + 
                  2 * oneMinusT * t * ptero.controlY + 
                  t * t * ptero.endY;
        
        // Check collision with target player
        const targetPlayer = playersRef.current[ptero.targetPlayerIndex];
        if (targetPlayer && targetPlayer.lives > 0 && tSec >= targetPlayer.invulnUntil) {
          const playerX = targetPlayer.pos.x;
          const playerY = targetPlayer.pos.y;
          const dist = Math.hypot(playerX - x, playerY - y);
          
          if (dist < PTERODACTYL_COLLISION_RADIUS) {
            // Collision! Deal damage
            setPlayers((prevP) => {
              return prevP.map((pl, pi) => {
                if (pi === ptero.targetPlayerIndex && pl.lives > 0) {
                  const newLives = Math.max(0, pl.lives - PTERODACTYL_DAMAGE);
                  setToasts((ts) => [
                    ...ts,
                    {
                      id: nextId.current++,
                      player: pi,
                      text: 'Pterodactyl Hit -1.5❤',
                      life: 0,
                      maxLife: 1.0,
                    },
                  ]);
                  return {
                    ...pl,
                    lives: newLives,
                    invulnUntil: tSec + 1.5,
                    deathAt: newLives <= 0 ? tSec : pl.deathAt,
                    streak: 0,
                  };
                }
                return pl;
              });
            });
          }
        }
      });
      
      return updated.filter((p) => p.active);
    });

    // Check game over
    setPlayers((prevP) => {
      const allDead = prevP.every((p) => p.lives <= 0);
      if (allDead) setGameOver(true);
      return prevP;
    });
  });

  const idlePhase = useRef(0);
  const currentTimeRef = useRef(0);
  useRaf((dt) => { idlePhase.current += dt; });
  // advance and cleanup toasts
  useRaf((dt) => {
    setToasts((prev) => prev.map((t) => ({ ...t, life: t.life + dt })).filter((t) => t.life < t.maxLife));
  });

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
              <div className="mb-1">Music: {musicEnabled ? 'On' : 'Off'}</div>
              <button
                type="button"
                className="px-3 py-1 bg-[color:var(--link)]/20 text-[color:var(--link)] rounded-md hover:bg-[color:var(--link)]/30 mb-2"
                onClick={() => setMusicEnabled((v) => !v)}
              >
                {musicEnabled ? 'Turn Off' : 'Turn On'}
              </button>
              <div className="mb-1">Volume</div>
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
              <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                Music by{' '}
                <a 
                  href="https://pixabay.com/users/drmseq-3141130/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=164212" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-[color:var(--text)]"
                >
                  drmseq
                </a>
                {' '}from{' '}
                <a 
                  href="https://pixabay.com/sound-effects/desert-sun-164212/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-[color:var(--text)]"
                >
                  Pixabay
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Per-player scores top-left (P1) and top-right (P2) */}
      {started && !gameOver && (
        <>
          <div className="absolute top-2 left-24 z-20 glass-card rounded-md px-3 py-1 text-sm text-[color:var(--text)]">P1: {players[0]?.score ?? 0}</div>
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

        {/* Wind gusts */}
        <g className="wind-gusts" stroke="#ff6b6b">
          {winds.slice(0, 6).map((w) => (
            <g key={w.id} className="wind-gust-move" transform={`translate(0,${w.y - 200}) scale(3)`}>
              <path
                className="wind-gust-path"
                d="M-34.8,166.8c51.6,1.9,70.9,16.4,78.4,30.3c10.9,20.1-3.6,37.5,6.9,75c3.9,14,11.8,42.2,33.7,50.9
                c25.7,10.2,65.3-8.7,76.4-36.5c13.8-34.4-26.4-57.5-19.3-110.1c3.3-24.1,17.1-58.7,44.7-67.4c34.9-10.9,84.3,21.7,90.8,65.4
                c5.3,36-20.6,66.1-42.6,79.8c-39.5,24.5-95.7,14.9-108-7.6c-0.5-0.9-7.9-14.7-2.1-22.7c3.7-5,10.9-5.4,13.1-5.5
                c15.4-0.8,28.1,12.1,33,17.2c46.5,48.5,53.9,63.9,72.2,75.7c24.1,15.6,66.1,24.2,90.8,6.9c36.4-25.5,7.6-88,49.5-130.7
                c17.6-17.9,40-24.6,56.4-27.5"
                strokeDasharray="100 1200"
              />
            </g>
          ))}
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

        {/* Warning indicators for incoming pterodactyls */}
        <g className="pterodactyl-warnings">
          {pterodactyls.map((ptero) => {
            const currentTime = currentTimeRef.current;
            if (currentTime >= ptero.warningUntil) return null;
            
            const warningProgress = (currentTime - ptero.spawnTime) / PTERODACTYL_WARNING_DURATION;
            const pulse = Math.sin(warningProgress * Math.PI * 8) * 0.5 + 0.5;
            const targetPlayer = playersRef.current[ptero.targetPlayerIndex];
            
            if (!targetPlayer) return null;
            
            return (
              <g key={`ptero-warning-${ptero.id}`}>
                {/* Sky warning flash */}
                <rect
                  x={0}
                  y={0}
                  width={VIEW_W}
                  height={120}
                  fill="#ff8800"
                  opacity={pulse * 0.25}
                />
                {/* Warning text in sky */}
                <text
                  x={VIEW_W / 2}
                  y={70}
                  textAnchor="middle"
                  fontSize="28"
                  fill="#ff8800"
                  fontWeight="bold"
                  opacity={pulse}
                >
                  ⚠ PTERODACTYL INCOMING! ⚠
                </text>
              </g>
            );
          })}
        </g>

        {/* Pterodactyls */}
        <g className="pterodactyls">
          {pterodactyls.map((ptero) => {
            const currentTime = currentTimeRef.current;
            if (currentTime < ptero.warningUntil || !ptero.active) return null;
            
            const t = ptero.progress;
            const oneMinusT = 1 - t;
            
            // Calculate current position on bezier curve
            const x = oneMinusT * oneMinusT * ptero.startX + 
                      2 * oneMinusT * t * ptero.controlX + 
                      t * t * ptero.endX;
            const y = oneMinusT * oneMinusT * ptero.startY + 
                      2 * oneMinusT * t * ptero.controlY + 
                      t * t * ptero.endY;
            
            // Scale for rendering (pterodactyl SVG viewBox is 0 0 26324 17977, so it's huge)
            const scale = 0.005; // Size as requested
            const svgWidth = 26324;
            const svgHeight = 17977;
            const centerX = svgWidth / 2;
            const centerY = svgHeight / 2;
            
            // SVG faces right by default
            // Transform order in SVG (applied right-to-left): 
            // 1. translate(-centerX, -centerY) - move to center
            // 2. scale() - scale and optionally flip horizontally
            // 3. translate(x, y) - move to position
            // - From left: moving right, no horizontal flip needed (faces right)
            // - From right: moving left, flip horizontally (scale x = -1) to face left
            const scaleX = ptero.fromLeft ? scale : -scale;
            
            return (
              <g
                key={ptero.id}
                transform={`translate(${x}, ${y}) scale(${scaleX}, ${scale}) translate(-${centerX}, -${centerY})`}
                opacity={0.95}
              >
                {/* Pterodactyl SVG - using image element to load the SVG file */}
                <image
                  href={pterodactylSvg}
                  width={svgWidth}
                  height={svgHeight}
                  preserveAspectRatio="xMidYMid"
                />
              </g>
            );
          })}
        </g>

        {/* Warning indicators for incoming dinosaurs */}
        <g className="dinosaur-warnings">
          {dinosaurs.map((dino) => {
            const currentTime = currentTimeRef.current;
            if (currentTime >= dino.warningUntil) return null; // No warning after it appears
            
            const ridgeRefs = [ridge1Ref.current, ridge2Ref.current, ridge3Ref.current];
            const ridgeRef = ridgeRefs[dino.ridgeIndex];
            if (!ridgeRef) return null;
            
            const warningY = samplePathYAtX(ridgeRef, VIEW_W / 2, caches[dino.ridgeIndex]); // Center of screen
            if (warningY == null) return null;
            
            const warningProgress = (currentTime - dino.spawnTime) / DINOSAUR_WARNING_DURATION;
            const pulse = Math.sin(warningProgress * Math.PI * 10) * 0.5 + 0.5;
            
            return (
              <g key={`warning-${dino.id}`}>
                {/* Warning flash effect */}
                <rect
                  x={VIEW_W / 2 - 200}
                  y={warningY - 50}
                  width={400}
                  height={50}
                  fill="#ff4444"
                  opacity={pulse * 0.3}
                  rx={5}
                />
                {/* Warning text */}
                <text
                  x={VIEW_W / 2}
                  y={warningY - 20}
                  textAnchor="middle"
                  fontSize="24"
                  fill="#ff4444"
                  fontWeight="bold"
                  opacity={pulse}
                >
                  ⚠ DINOSAUR INCOMING! ⚠
                </text>
              </g>
            );
          })}
        </g>

        {/* Dinosaurs */}
        <g className="dinosaurs">
          {dinosaurs.map((dino) => {
            const currentTime = currentTimeRef.current;
            if (currentTime < dino.warningUntil || !dino.active) return null;
            
            // SVG viewBox is 0 0 800 600.7, path is in that coordinate space
            // Scale down to ~60px height, flip horizontally to face left
            const scale = 0.1; // Scale from 800px width to ~80px
            const centerX = 400; // Center of SVG viewBox
            
            return (
              <g
                key={dino.id}
                transform={`translate(${dino.x}, ${dino.y}) scale(-${scale}, ${scale}) translate(-${centerX}, 0)`}
                opacity={0.9}
              >
                {/* Dinosaur SVG path - flipped horizontally to face left */}
                <path
                  d="M560.99,133.34c1.13,.91,2.43,1.68,3.37,2.76,2.17,2.5,4.66,2.04,7.45,1.45,2.95-.62,2.21-2.86,2.72-4.7,.41-1.45,1.41-2.73,2.14-4.09,1.15,1.02,2.68,1.83,3.36,3.1,1.51,2.83,3.88,2.7,6.31,2.27,2.54-.45,3.48-2.32,3.43-4.78-.01-.68-.12-1.42,.09-2.03,.34-.96,.91-1.83,1.39-2.73,.89,.47,1.84,.84,2.63,1.44,.52,.38,.86,1.05,1.18,1.65,2.01,3.75,5.04,4.46,8.53,2.45,6.11-3.52,11.42-2.32,16.93,1.6,8.7,6.19,18.62,6.36,28.52,4.01,11.47-2.72,22.68-1.26,33.85,1.16,9.62,2.09,19.35,4.02,28.66,7.12,11.4,3.8,18.89,12.61,24.16,23.02,1.65,3.27,1.29,7.59,1.66,11.45,.08,.82-.6,2.4-1.09,2.47-5.68,.77-4.51,6.08-6.38,9.34-.59,1.03-1.11,2.1-2.15,4.09v-11.25c-2.97,4.06-2.52,9.43-7.32,13.36,.35-4.2,.6-7.2,.84-10.19l-.82-.31c-1.59,3.75-3.18,7.49-4.76,11.24l-1.24-.31v-8.73l-1.09-.56c-1.89,3.58-3.78,7.17-5.67,10.75l-.83-.1-.43-7.44-1.01-.53c-1.74,3.89-3.48,7.78-5.22,11.66l-.92-.25v-7.39c-3.31,.34-3.28,.35-4.3,4.47-.53,2.14-1.19,4.24-2.74,6.28-.45-2.85-.9-5.7-1.43-9.06-5.84,.95-4.12,7.24-7.77,10.32-.31-3.24-.57-6.07-.86-9.14-5.4-.66-3.09,5.56-6.7,6.95-.64-2-1.33-4.15-2.15-6.71-4.71,2.2-3.13,7.62-6.58,11.28v-10.32c-5.64,.58-3.96,6.8-8.08,8.74l-.92-7.53-1.28-.43c-1.29,2.39-2.58,4.79-4.36,8.08-.47-3.13-.8-5.33-1.14-7.53l-1.2-.33c-1.55,2.77-3.1,5.54-4.65,8.31l-.88-.25c.32-2.98,.64-5.96,.98-9.15-10.65-4.48-21.58-5.64-32.95-3.46-6.48,1.24-12.93,.96-19.1-1.87-10.71-4.9-20.79-2.03-30.68,3.07,1.19,0,2.39,.1,3.57-.03,1.2-.12,2.38-.45,3.57-.71,7.83-1.73,15.2-1.15,22.27,3.21,6.22,3.83,13.22,5.03,20.34,3.17,9.29-2.43,15.72,1.23,20.96,8.56,4.54,6.36,9.34,12.55,14.3,19.17,1.96-2.17,3.14-3.47,4.63-5.13,.33,3.06,.58,5.41,.83,7.77l1.16-.03c.98-1.53,1.96-3.06,2.98-4.66,3.26,2.09-2.53,7.05,3.29,7.96,.92-2.51,1.86-5.05,2.8-7.6l1.26,.09,1,10.09,1.35-.04,1.78-5.5,1.12-.38c1,2.49,2,4.98,3.32,8.26,.99-2.37,1.67-3.99,2.54-6.05,1.63,2.68,3.06,5.03,4.5,7.39l1.21-.33c.08-1.87,.17-3.74,.25-5.61l1.03-.32c.85,2.4,1.7,4.8,2.55,7.2l.95,.12c.32-1.1,.72-2.18,.93-3.3,.23-1.25,.27-2.53,.39-3.8l1.1-.22c1.11,3.01,2.22,6.02,3.33,9.03l1.42-.24c.45-2.65,.9-5.31,1.43-8.44,2.42,3.53,1.43,8.67,6.75,10.51v-10l.78-.15c1.58,3.3,3.16,6.61,4.73,9.91l1.07-.13v-10.62c4.81,3.47,2.48,8.22,5.16,11.93v-9.11l1.47-.4c1.18,2.91,2.37,5.81,3.7,9.09,1.02-1.16,1.79-2.02,2.48-2.8,3.08,1.5,6.89,2.57,5.99,7.18-1.15,5.86-2.96,11.56-9.29,13.77-11.38,3.98-22.89,6.38-34.98,2.68-14.77-4.52-29.99-6.26-45.4-5.97-4.99,.09-10.11,.42-14.92,1.64-11.46,2.89-22.56,1.91-33.61-1.72-2.31-.76-4.76-1.17-6.97-2.15-4.78-2.11-8.62-.76-11.3,3.25-3.82,5.72-7.49,11.58-10.66,17.68-3.31,6.35-5.77,13.14-8.93,19.58-4.48,9.12-11.16,16.44-19.97,21.45-9.47,5.38-14.86,13.43-17.77,23.69-2.21,7.77-4.98,15.39-7.62,23.43,3.17,1.14,7.2,2.48,11.14,4.04,9.55,3.79,19.06,7.68,28.58,11.55,.62,.25,1.46,.47,1.75,.97,3.76,6.37,9.76,12.49,10.64,19.26,1.71,13.09-12.39,25.41-26.16,22.12-.93-.22-1.74-.92-2.94-1.59,4.42-.88,8.44-1.21,12.09-2.55,3.73-1.37,6.09-4.58,7.47-8.32-6.47,7.31-17.41,9.16-23.68,3.14,1.92-.16,3.38,0,4.62-.45,3.63-1.27,7.44-2.35,10.68-4.32,2.96-1.81,1.81-9.48-1.28-11.84-3.95-3.02-7.74-6.27-11.82-9.1-1.43-.99-3.51-1.37-5.32-1.46-4.75-.23-9.52-.1-14.28-.18-14.15-.24-20.88-6.44-22.27-20.47-.27-2.7-.59-5.39-.94-8.63-14.22,11.59-29.52,20.41-46.7,25.22-.83,7.22-1.2,14.44-2.54,21.47-3.42,17.89-14.47,28.84-31.85,33.73-9.68,2.72-9.78,2.81-8.55,12.44,.57,4.42,1.51,8.82,2.62,13.14,1.72,6.66,6.27,10.97,12.44,13.62,1.13,.49,2.55,.32,3.84,.43,5.05,.44,10.21,.4,15.14,1.45,4.98,1.05,9.65,3.57,14.62,4.75,11.8,2.8,22.58,24.17,13.99,35.49-5.55-17.51-13.1-24.13-27.31-22.98,11.14,6.24,10.11,14.92,6.02,25.28-.91-2.29-1.78-3.67-1.97-5.14-.92-6.91-5.78-9.66-11.71-10.51-6.13-.88-11.86-2.14-17.02-5.88-3.73-2.7-8.04-1.81-12.13-.4-7.74,2.66-15.24,1.34-22.63-1.38-.9-.33-2.09-1.23-2.19-1.98-.09-.72,.95-1.78,1.74-2.36,5.33-3.87,5.81-5.76,3.99-12.05-3.32-11.42-11.31-19.6-18.92-28.09-1.54-1.72-3.19-3.37-4.53-5.23-3.14-4.38-4.04-9.57-.62-13.65,8.89-10.62,10.52-23.47,12.54-36.68-5.33-1.1-10.74-2.15-16.13-3.33-6.86-1.51-13.7-3.09-20.53-4.74-2.15-.52-3.67-.73-4.88,1.86-5.6,12.01-14.87,20.12-27.17,24.94-3.51,1.38-6.94,3.04-10.23,4.89-4.82,2.71-7.42,6.79-7.61,12.55-.19,5.82-1.02,11.62-1.37,17.44-.22,3.66-.43,7.38,0,11,.38,3.21,.74,8.06,2.73,9.1,4.39,2.31,9.91,3.47,14.73,.17,5.13-3.5,9.84-2.87,14.68,.52,4,2.8,8.14,5.38,12.25,8.02,3.91,2.52,6.14,6.16,6.72,10.68,.58,4.57,.81,9.19,.3,14.18-1.13-2.1-2.23-4.21-3.39-6.29-3.15-5.65-6.53-11.19-13.54-12.51-3.09-.59-6.34-.39-9.49-.54,0,.94-.08,1.36,.01,1.4,11.14,4.74,11.45,15.66,13.92,25.1,1.44,5.49,1.48,11.35,1.47,17.28-5.62-11.19-9.7-23.38-22.51-28.55-5.32-2.15-10.83-3.82-16.52-5.21,6.47,9.89,7.63,20.84,8.47,32.06-.76-1.17-1.46-2.39-2.3-3.5-3.97-5.31-7.76-10.78-12.03-15.83-8.35-9.88-19.12-10.82-30.79-7.58-3.25,.9-6.48,1.93-9.64,3.1-5.86,2.18-11.47,1.06-17.02-1.05-.82-.31-1.49-1.01-2.9-2,1.75-1.09,2.92-2.24,4.3-2.61,6.19-1.67,9.88-5.57,11.98-11.6,1.14-3.26,2.83-6.76,5.31-9.02,5.58-5.08,5.12-11.04,3.66-17.25-.7-2.98-2.01-5.9-3.47-8.61-4.55-8.48-4.6-15.3,2.07-21.95,11.37-11.34,17.4-24.92,19.94-40.48,.69-4.23,2.42-8.28,4.04-13.6-6.23,0-12.11-.21-17.97,.04-26.7,1.11-51.14,9.75-74.23,22.68-39.58,22.16-71.95,52.08-96.69,90.18-2.26,3.47-4.86,6.72-7.3,10.07-.45-.16-.9-.32-1.35-.49,.34-1.99,.49-4.04,1.07-5.96,6.19-20.56,16.3-39.25,27.86-57.19,19.95-30.96,44.63-57.8,72.01-82.3,21.21-18.98,44.49-35.22,67.32-52.09,6.74-4.98,12.68-11.05,18.97-16.64,1.74-1.55,2.51-3.15,1.61-5.73-1.12-3.21,1.64-6.01,4.85-5.46,4,.69,6.37-1.93,5.43-6.02-.42-1.84-1.18-3.65-1.31-5.51-.24-3.42,1.4-6.02,4.36-7.7,2.7-1.54,4.48,.4,6.58,1.68,1.41,.86,4.26,1.83,4.74,1.26,1.35-1.57,2.19-3.85,2.5-5.95,.35-2.32-.65-4.91-.08-7.13,1.25-4.88,5.05-5.82,8.92-2.58,1.83,1.54,3.39,3.58,6.33,2.38,2.91-1.18,4.41-3.05,3.71-6.28-.26-1.19-.97-2.46-.73-3.53,.47-2.05,1.48-3.98,2.26-5.97,1.87,.75,3.8,1.4,5.59,2.3,.8,.4,1.23,1.64,2.04,1.93,1.76,.64,4.06,1.74,5.37,1.09,1.29-.63,2.03-3.14,2.29-4.93,.37-2.51-.44-5.24,.21-7.63,.48-1.78,2.46-3.15,3.77-4.71,1.32,1.3,2.87,2.43,3.89,3.93,1.12,1.65,1.57,3.76,2.64,5.45,1.83,2.86,4.17,2.73,5.34-.44,.93-2.5,.88-5.35,1.75-7.88,.88-2.55,2.35-4.9,3.56-7.34,1.94,1.84,3.99,3.58,5.79,5.55,.88,.97,1.26,2.38,1.93,3.56,2.12,3.74,4.52,3.91,6.3-.02,1.6-3.52,2.27-7.46,3.34-11.22,.29-1.04,.26-2.3,.87-3.09,1-1.31,2.3-3.09,3.64-3.24,1.27-.14,3.22,1.24,4.04,2.49,2.29,3.51,3.99,7.4,6.27,10.92,1,1.54,3.24,3.81,4.23,3.5,1.86-.57,3.83-2.5,4.66-4.36,1.54-3.42,2.07-7.28,3.49-10.77,.67-1.64,2.39-3.89,3.72-3.95,1.43-.07,3.6,1.8,4.35,3.35,1.99,4.13,3.26,8.6,5.11,12.8,.64,1.46,2.15,2.54,3.27,3.79,1.22-1.35,2.87-2.51,3.57-4.09,1.42-3.19,2.11-6.71,3.53-9.9,.56-1.26,2.27-2.79,3.45-2.78,1.18,0,2.94,1.54,3.43,2.81,1.75,4.53,2.89,9.3,4.65,13.82,.81,2.09,2.53,3.82,3.84,5.71,1.41-1.72,3.18-3.26,4.14-5.21,1.49-3.02,2.23-6.39,3.67-9.44,.67-1.43,2.23-2.44,3.38-3.65,1.19,1.21,2.88,2.21,3.48,3.66,2.16,5.25,3.82,10.71,5.94,15.98,1.04,2.59,1.39,6.86,5.12,6.11,1.71-.34,3.05-4.18,3.93-6.66,1.12-3.17,1.45-6.61,2.41-9.84,1.47-4.95,4.14-5.62,7.31-1.64,2.95,3.7,5.2,7.95,8.12,11.68,1.3,1.65,3.48,2.61,5.27,3.88,1.04-1.91,2.53-3.72,3-5.76,.66-2.88,.32-5.97,.85-8.89,.34-1.86,1.48-3.57,2.26-5.34,1.64,.97,3.52,1.68,4.85,2.97,1.73,1.68,2.8,4.07,4.59,5.66,1.11,.98,3.65,1.87,4.45,1.29,1.22-.89,2.09-3.1,2.05-4.72-.06-2.52-1.33-4.99-1.49-7.52-.1-1.68,.35-3.95,1.46-4.97,.81-.75,3.26-.31,4.68,.3,2.53,1.09,4.74,3.73,7.68,1.16,3.09-2.7,2.49-5.99,1.21-9.35-.48-1.25-.92-2.57-1.07-3.89-.41-3.65,1.26-4.95,4.81-3.86,.77,.24,1.51,.61,2.3,.78,3.85,.82,5.85-1.34,4.56-5.04-.66-1.91-1.76-3.66-2.48-5.55-1.01-2.65-.12-3.94,2.83-3.43,.67,.11,1.35,.13,2.02,.24,6,.94,7.89-1.3,5.87-6.96-.27-.76-.63-1.51-.8-2.3-.74-3.37,.66-4.58,4.02-3.5,.51,.17,1.03,.36,1.5,.63,2.09,1.19,4.63,2.42,6.13-.01,.97-1.57,.41-4.14,.38-6.26-.02-1.67-.29-3.33-.44-5,1.66,.18,3.35,.23,4.97,.6,1.3,.3,2.47,1.24,3.76,1.44,2.78,.44,4.46-.77,4.44-3.78,0-.4-.17-.8-.21-1.2q-.79-7.66,6.31-5.07c3.27,1.2,5.86-.64,6.01-4.17,.11-2.47,.37-4.94,.56-7.41l1.41-.38Zm63.99,20.71c-.49,3.03,.08,5.42,3.03,6.23,.57,.16,2.47-1.77,2.44-2.7-.1-3.11-1.96-4.47-5.47-3.53Z"
                  fill="var(--text)"
                />
              </g>
            );
          })}
        </g>

        {/* Red tree with apple */}
        <g className="red-tree">
          {/* trunk */}
          <rect x={treeX - 6} y={treeY} width={12} height={46} fill="rgba(255,255,255,0.12)" />
          {/* red canopy */}
          <circle cx={treeX} cy={treeY - 14} r={28} fill="#9b2c2c" opacity={0.6} />
          <circle cx={treeX - 18} cy={treeY - 4} r={18} fill="#b83232" opacity={0.5} />
          <circle cx={treeX + 18} cy={treeY - 4} r={18} fill="#b83232" opacity={0.5} />
          {/* shine cue reserved for future */}
          {/* apple */}
          {apple && <circle cx={apple.x} cy={apple.y} r={5} fill="#ff5757" stroke="#fff" strokeWidth={1} />}
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
              setDinosaurs([]);
              setPterodactyls([]);
              setPlayers([
                { pos: { x: 250, y: 515 }, vel: { x: 0, y: 0 }, grounded: false, facing: 1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
                { pos: { x: 950, y: 525 }, vel: { x: 0, y: 0 }, grounded: false, facing: -1, dropUntil: 0, lives: 3, invulnUntil: 0, score: 0, streak: 0 },
              ]);
              setTimeSurvived(0);
              setSurvivedCount(0);
              setGameOver(false);
              setStarted(true);
              dinosaurSpawnTimer.current = 0;
              pterodactylSpawnTimer.current = 0;
              pterodactylNextId.current = 1;
              currentTimeRef.current = 0;
              nextRidgeIndex.current = 0;
            }}
          />
        );
      })()}
    </div>
  );
}



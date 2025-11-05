import { useEffect, useRef, useState } from 'react';

type GameKey = 'pong' | 'flappy' | 'breakout' | 'invaders' | 'pacman' | 'frogger';

type Props = {
  open: boolean;
  onClose: () => void;
  onStartGame: (game: GameKey) => void;
  renderActiveGame?: (game: GameKey) => JSX.Element | null;
};

const GAMES: { key: GameKey; name: string; desc: string }[] = [
  { key: 'pong', name: 'Pong', desc: 'Classic paddles and ball' },
  { key: 'flappy', name: 'Flappy', desc: 'Tap to fly through pipes' },
  { key: 'breakout', name: 'Breakout', desc: 'Break the bricks!' },
  { key: 'invaders', name: 'Invaders', desc: 'Defend against aliens' },
  { key: 'pacman', name: 'Pac‑Man', desc: 'Eat dots, avoid ghost' },
  { key: 'frogger', name: 'Frogger', desc: 'Cross road and river' },
];

export default function ArcadeOverlay({ open, onClose, onStartGame, renderActiveGame }: Props) {
  const [screen, setScreen] = useState<'grid' | 'mode' | 'playing' | 'gameover'>('grid');
  const [selected, setSelected] = useState<GameKey>('pong');
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Reset to grid only on open transition
  const prevOpen = useRef<boolean>(false);
  useEffect(() => {
    if (open && !prevOpen.current) {
      setScreen('grid');
    }
    prevOpen.current = open;
  }, [open]);

  // Keyboard handling without resetting screen inadvertently
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); if (screen === 'grid') onClose(); else if (screen === 'playing') setScreen('grid'); else setScreen('grid'); }
      if (screen === 'grid') {
        const idx = GAMES.findIndex(g => g.key === selected);
        if (e.key === 'ArrowRight' || e.key === 'd') setSelected(GAMES[(idx + 1) % GAMES.length].key);
        if (e.key === 'ArrowLeft' || e.key === 'a') setSelected(GAMES[(idx - 1 + GAMES.length) % GAMES.length].key);
        if (e.key === 'ArrowDown' || e.key === 's') setSelected(GAMES[(idx + 2) % GAMES.length].key);
        if (e.key === 'ArrowUp' || e.key === 'w') setSelected(GAMES[(idx - 2 + GAMES.length) % GAMES.length].key);
        if (e.key === 'Enter') setScreen('mode');
      } else if (screen === 'mode') {
        if (e.key === 'Enter') { onStartGame(selected); setScreen('playing'); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, screen, selected, onStartGame]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="glass-card rounded-lg p-4 w-[92%] max-w-4xl text-center relative">
        <button
          type="button"
          className="absolute top-2 left-2 text-xs px-2 py-1 rounded border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--text)]"
          onClick={onClose}
        >Exit</button>

        {screen === 'grid' && (
          <div>
            <div className="mb-3 text-sm text-[color:var(--muted-foreground)]">Choose a game (WASD/Arrows, Enter)</div>
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GAMES.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => { setSelected(g.key); setScreen('mode'); }}
                  className={`rounded border p-3 text-left ${selected===g.key? 'border-[color:var(--meteor-color)]' : 'border-[color:var(--glass-border)]'}`}
                  aria-label={g.name}
                >
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">{g.desc}</div>
                  {/* top score removed */}
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === 'mode' && (
          <div>
            <div className="text-lg font-semibold mb-1">{GAMES.find(g=>g.key===selected)?.name}</div>
            <div className="text-sm text-[color:var(--muted-foreground)] mb-3">Mode</div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <button type="button" className="px-3 py-1 rounded border border-[color:var(--meteor-color)]">Single Player</button>
              <button type="button" className="px-3 py-1 rounded border border-[color:var(--glass-border)] opacity-50 cursor-not-allowed">Multiplayer (soon)</button>
            </div>
            <div className="text-xs text-[color:var(--muted-foreground)] mb-3">Press Enter to start</div>
            <button type="button" className="px-3 py-1 rounded border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)]" onClick={() => { onStartGame(selected); setScreen('playing'); }}>Start</button>
          </div>
        )}

        {screen === 'playing' && (
          <div>
            {renderActiveGame ? renderActiveGame(selected) : null}
            <div className="mt-2">
              <button type="button" className="px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={() => setScreen('grid')}>Back to Grid</button>
            </div>
          </div>
        )}

        {screen === 'gameover' && null}
      </div>
    </div>
  );
}



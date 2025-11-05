import { useEffect, useMemo, useRef, useState } from 'react';

type GameKey = 'tictactoe' | 'connect4' | 'checkers' | 'dots' | 'battleship';

type Props = {
  open: boolean;
  onClose: () => void;
  renderActiveGame: (game: GameKey) => JSX.Element | null;
};

const GAMES: { key: GameKey; name: string; desc: string }[] = [
  { key: 'tictactoe', name: 'Tic‑Tac‑Toe', desc: '3×3 grid' },
  { key: 'connect4', name: 'Connect Four', desc: 'Drop to stack' },
  { key: 'checkers', name: 'Checkers', desc: 'Jump to capture' },
  { key: 'dots', name: 'Dots & Boxes', desc: 'Complete boxes' },
  { key: 'battleship', name: 'Battleship', desc: 'Find the fleet' },
];

export default function BoardGamesOverlay({ open, onClose, renderActiveGame }: Props) {
  const [screen, setScreen] = useState<'grid' | 'playing'>('grid');
  const [selected, setSelected] = useState<GameKey>('tictactoe');
  const prevOpen = useRef<boolean>(false);
  useEffect(() => {
    if (open && !prevOpen.current) setScreen('grid');
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); if (screen === 'grid') onClose(); else setScreen('grid'); }
      if (screen === 'grid') {
        const idx = GAMES.findIndex(g => g.key === selected);
        if (e.key === 'ArrowRight' || e.key === 'd') setSelected(GAMES[(idx + 1) % GAMES.length].key);
        if (e.key === 'ArrowLeft' || e.key === 'a') setSelected(GAMES[(idx - 1 + GAMES.length) % GAMES.length].key);
        if (e.key === 'ArrowDown' || e.key === 's') setSelected(GAMES[(idx + 2) % GAMES.length].key);
        if (e.key === 'ArrowUp' || e.key === 'w') setSelected(GAMES[(idx - 2 + GAMES.length) % GAMES.length].key);
        if (e.key === 'Enter') setScreen('playing');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, screen, selected]);

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
            <div className="mb-3 text-sm text-[color:var(--muted-foreground)]">Choose a board game (WASD/Arrows, Enter)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GAMES.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => { setSelected(g.key); setScreen('playing'); }}
                  className={`rounded border p-3 text-left ${selected===g.key? 'border-[color:var(--meteor-color)]' : 'border-[color:var(--glass-border)]'}`}
                  aria-label={g.name}
                >
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === 'playing' && (
          <div>
            {renderActiveGame(selected)}
            <div className="mt-2">
              <button type="button" className="px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={() => setScreen('grid')}>Back to Grid</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



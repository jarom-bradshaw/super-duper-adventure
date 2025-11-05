import { useMemo, useState } from 'react';
import GameResult from '../GameResult';

type Cell = 'X' | 'O' | null;

function checkWin(b: Cell[]): Cell | 'draw' | null {
  const L = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b2,c] of L) if (b[a] && b[a]===b[b2] && b[a]===b[c]) return b[a];
  return b.every(c=>c) ? 'draw' : null;
}

function bestMove(b: Cell[], ai: Cell, human: Cell): number {
  const res = minimax(b, ai, human, ai);
  return res.move ?? b.findIndex(c=>!c);
}

function minimax(b: Cell[], ai: Cell, human: Cell, turn: Cell): { score: number; move?: number } {
  const w = checkWin(b);
  if (w === ai) return { score: 10 };
  if (w === human) return { score: -10 };
  if (w === 'draw') return { score: 0 };
  let best = { score: turn===ai ? -Infinity : Infinity, move: -1 };
  for (let i=0;i<9;i++) if (!b[i]) {
    b[i] = turn;
    const r = minimax(b, ai, human, turn===ai? human: ai);
    b[i] = null;
    if (turn===ai) {
      if (r.score > best.score) best = { score: r.score, move: i };
    } else {
      if (r.score < best.score) best = { score: r.score, move: i };
    }
  }
  return best;
}

export default function TicTacToeMini() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Cell>('X');
  const [showResult, setShowResult] = useState(false);
  const ai: Cell = 'O'; const human: Cell = 'X';
  const status = useMemo(() => checkWin(board), [board]);

  function play(i: number) {
    if (status || board[i]) return;
    const nb = board.slice(); nb[i] = human; setBoard(nb); setTurn(ai);
    const s1 = checkWin(nb); if (s1) { setShowResult(true); return; }
    // AI move
    const mv = bestMove(nb.slice(), ai, human);
    if (mv != null && nb[mv] == null) { 
      nb[mv] = ai; 
      setBoard(nb); 
      setTurn(human);
      const s2 = checkWin(nb);
      if (s2) setShowResult(true);
    }
  }

  function reset() { setBoard(Array(9).fill(null)); setTurn(human); setShowResult(false); }

  const result = status === 'draw' ? 'draw' : status === human ? 'win' : 'loss';
  const playerScore = status === human ? 1 : 0;
  const aiScore = status === ai ? 1 : 0;

  return (
    <div className="mx-auto relative">
      {showResult && status && (
        <GameResult
          result={result}
          playerScore={playerScore}
          opponentScore={aiScore}
          onClose={() => setShowResult(false)}
        />
      )}
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Tic‑Tac‑Toe — You (X) vs AI (O)</div>
      <div className="grid grid-cols-3 gap-1 w-[180px] mx-auto">
        {board.map((c,i)=> (
          <button key={i} className="h-14 rounded border border-[color:var(--glass-border)] text-lg" onClick={()=>play(i)} disabled={!!status || !!c}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-2 text-sm">
        {status ? (status==='draw' ? 'Draw' : `${status} wins`) : `Turn: ${turn}`}
      </div>
      <button className="mt-2 px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={reset}>Reset</button>
    </div>
  );
}



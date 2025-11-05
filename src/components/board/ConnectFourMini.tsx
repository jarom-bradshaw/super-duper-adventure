import { useMemo, useState } from 'react';
import GameResult from '../GameResult';

type Cell = 0 | 1 | 2; // 0 empty, 1 human, 2 ai
const ROWS = 6, COLS = 7;

function clone(g: Cell[][]) { return g.map(r=>r.slice()); }
function drop(g: Cell[][], col: number, p: Cell): boolean {
  if (col<0||col>=COLS) return false;
  for (let r=ROWS-1;r>=0;r--) if (g[r][col]===0) { g[r][col]=p; return true; }
  return false;
}
function winner(g: Cell[][]): Cell | 3 | 0 { // 3 draw
  const dirs = [[1,0],[0,1],[1,1],[1,-1]];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (g[r][c]) {
    const p = g[r][c];
    for (const [dx,dy] of dirs) {
      let k=1; while (k<4 && g[r+dy*k]?.[c+dx*k]===p) k++;
      if (k===4) return p;
    }
  }
  if (g.every(row=>row.every(x=>x!==0))) return 3;
  return 0;
}

function aiMove(g: Cell[][]): number {
  // simple: win if possible, else block, else random
  for (let c=0;c<COLS;c++){ const t=clone(g); if (drop(t,c,2)&&winner(t)===2) return c; }
  for (let c=0;c<COLS;c++){ const t=clone(g); if (drop(t,c,1)&&winner(t)===1) return c; }
  const opts = Array.from({length:COLS},(_,i)=>i).filter(c=>g[0][c]===0);
  return opts[Math.floor(Math.random()*opts.length)] ?? 0;
}

export default function ConnectFourMini(){
  const [grid, setGrid] = useState<Cell[][]>(Array.from({length:ROWS},()=>Array(COLS).fill(0)));
  const [turn, setTurn] = useState<Cell>(1);
  const [showResult, setShowResult] = useState(false);
  const win = useMemo(()=>winner(grid),[grid]);

  function play(c:number){
    if (win) return;
    const g = clone(grid);
    if (!drop(g,c,1)) return;
    setGrid(g); setTurn(2);
    const w = winner(g); 
    if (w) { setShowResult(true); return; }
    const aiC = aiMove(g);
    drop(g, aiC, 2); 
    setGrid(clone(g)); 
    setTurn(1);
    const w2 = winner(g);
    if (w2) setShowResult(true);
  }
  function reset(){ setGrid(Array.from({length:ROWS},()=>Array(COLS).fill(0))); setTurn(1); setShowResult(false); }

  const playerPieces = grid.flat().filter(c => c === 1).length;
  const aiPieces = grid.flat().filter(c => c === 2).length;
  const result = win === 3 ? 'draw' : win === 1 ? 'win' : win === 2 ? 'loss' : 'draw';

  return (
    <div className="mx-auto relative">
      {showResult && win && (
        <GameResult
          result={result}
          playerScore={playerPieces}
          opponentScore={aiPieces}
          onClose={() => setShowResult(false)}
        />
      )}
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Connect Four — You vs AI</div>
      <div className="grid grid-cols-7 gap-1 w-[280px] mx-auto">
        {Array.from({length:COLS},(_,c)=> (
          <button key={c} className="h-8 rounded border border-[color:var(--glass-border)]" onClick={()=>play(c)} disabled={!!win}>
            ▼
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${COLS*30} ${ROWS*30}`} className="block mx-auto mt-2" width={COLS*30} height={ROWS*30}>
        {grid.map((row,r)=> row.map((v,c)=> (
          <circle key={`${r}-${c}`} cx={c*30+15} cy={r*30+15} r={12} fill={v===0? '#222': v===1? '#ffeb3b':'#00e5ff'} />
        )))}
      </svg>
      <div className="mt-2 text-sm">{win? (win===3?'Draw': win===1? 'You win':'AI wins') : `Turn: ${turn===1?'You':'AI'}`}</div>
      <button className="mt-2 px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={reset}>Reset</button>
    </div>
  );
}



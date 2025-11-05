import { useMemo, useState } from 'react';

type P = 0 | 1 | 2 | 3 | 4; // 0 empty, 1 human, 2 ai, 3 human king, 4 ai king
const N=8;

function init(): P[][] {
  const b: P[][] = Array.from({length:N},()=>Array(N).fill(0));
  for (let r=0;r<3;r++) for (let c=0;c<N;c++) if ((r+c)%2===1) b[r][c]=2;
  for (let r=N-3;r<N;r++) for (let c=0;c<N;c++) if ((r+c)%2===1) b[r][c]=1;
  return b;
}

function inside(r:number,c:number){return r>=0&&r<N&&c>=0&&c<N;}
function movesFor(b:P[][], r:number,c:number): {r:number;c:number; jump?:{r:number;c:number}}[] {
  const p=b[r][c]; if(!p) return [];
  const res: any[]=[]; const dir = (p===1||p===3)? -1 : 1; const king = (p===3||p===4);
  const opp = p===1||p===3? [2,4] : [1,3];
  const dirs = king? [-1,1]: [dir];
  for (const d of dirs){
    for (const dc of [-1,1]){
      const r1=r+d, c1=c+dc; if (inside(r1,c1)&& b[r1][c1]===0) res.push({r:r1,c:c1});
      const r2=r+d*2,c2=c+dc*2; if (inside(r2,c2)&& b[r1]?.[c1]!=null && opp.includes(b[r1][c1]) && b[r2][c2]===0) res.push({r:r2,c:c2,jump:{r:r1,c:c1}});
    }
  }
  return res;
}

export default function CheckersMini(){
  const [board,setBoard]=useState<P[][]>(init());
  const [sel,setSel]=useState<{r:number;c:number}|null>(null);
  const [turn,setTurn]=useState<1|2>(1);
  const win = useMemo(()=> (board.flat().some(p=>p===1||p===3)? (board.flat().some(p=>p===2||p===4)? 0:1):2),[board]);

  function clickCell(r:number,c:number){
    if (win) return;
    if (turn!==1) return; // simple: human moves only when human turn
    const p=board[r][c];
    if (p===1||p===3){ setSel({r,c}); return; }
    if (sel){
      const ms = movesFor(board, sel.r, sel.c);
      const m = ms.find(m=>m.r===r&&m.c===c);
      if (!m) { setSel(null); return; }
      const b=board.map(row=>row.slice());
      const piece = b[sel.r][sel.c]; b[sel.r][sel.c]=0; b[r][c]=piece;
      if (m.jump){ b[m.jump.r][m.jump.c]=0; }
      if (r===0 && piece===1) b[r][c]=3;
      setBoard(b); setSel(null); setTurn(2);
      aiTurn(b);
    }
  }

  function aiTurn(b:P[][]){
    // very simple AI: pick first legal move
    for (let r=0;r<N;r++) for (let c=0;c<N;c++) if (b[r][c]===2||b[r][c]===4){
      const ms=movesFor(b,r,c); if (ms.length){
        const m = ms.find(x=>x.jump) || ms[0];
        const nb=b.map(row=>row.slice()); const piece=nb[r][c]; nb[r][c]=0; nb[m.r][m.c]=piece; if (m.jump) nb[m.jump.r][m.jump.c]=0; if (m.r===N-1 && piece===2) nb[m.r][m.c]=4;
        setBoard(nb); setTurn(1); return;
      }
    }
    setTurn(1);
  }

  function reset(){ setBoard(init()); setSel(null); setTurn(1); }

  return (
    <div className="mx-auto">
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Checkers — simple AI</div>
      <div className="inline-block">
        {board.map((row,r)=> (
          <div key={r} className="flex">
            {row.map((p,c)=> (
              <button key={c} className="w-8 h-8 flex items-center justify-center" style={{background: (r+c)%2? 'var(--glass-bg)':'transparent', border: '1px solid var(--glass-border)'}} onClick={()=>clickCell(r,c)}>
                {p===1||p===3? <div style={{width:14,height:14,borderRadius:7,background:'#ffeb3b',border:'2px solid #fff'}}/>: p===2||p===4? <div style={{width:14,height:14,borderRadius:7,background:'#00e5ff',border:'2px solid #fff'}}/>: null}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm">{win? (win===1?'You win':'AI wins') : `Turn: ${turn===1?'You':'AI'}`}</div>
      <button className="mt-2 px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={reset}>Reset</button>
    </div>
  );
}



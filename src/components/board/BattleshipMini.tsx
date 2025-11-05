import { useEffect, useMemo, useState } from 'react';

type Cell = 0|1|2; // 0 unknown, 1 miss, 2 hit
type Ship = { r:number; c:number; len:number; dir:0|1; hits:number };

const N=10;

function placeShips(): Ship[]{
  const ships: Ship[]=[]; const lens=[5,4,3,3,2];
  const occ = Array.from({length:N},()=>Array(N).fill(0));
  for (const L of lens){
    while(true){
      const dir = (Math.random()<0.5? 0:1) as 0|1; const r = Math.floor(Math.random()*N); const c = Math.floor(Math.random()*N);
      let ok=true; for (let k=0;k<L;k++){ const rr=r+(dir? k:0), cc=c+(dir? 0:k); if (rr<0||cc<0||rr>=N||cc>=N||occ[rr][cc]) { ok=false; break; } }
      if (!ok) continue;
      for (let k=0;k<L;k++){ const rr=r+(dir? k:0), cc=c+(dir? 0:k); occ[rr][cc]=1; }
      ships.push({ r,c,len:L,dir,hits:0 }); break;
    }
  }
  return ships;
}

export default function BattleshipMini(){
  const [cells,setCells]=useState<Cell[][]>(Array.from({length:N},()=>Array(N).fill(0)));
  const [ships,setShips]=useState<Ship[]>(placeShips());
  const sunk = useMemo(()=> ships.filter(s=>s.hits>=s.len).length, [ships]);

  function fire(r:number,c:number){
    if (cells[r][c]!==0) return;
    let hit=false; const ns=ships.map(s=> ({...s}));
    for (const s of ns){
      for (let k=0;k<s.len;k++){ const rr=s.r+(s.dir? k:0), cc=s.c+(s.dir? 0:k); if (rr===r&&cc===c){ s.hits++; hit=true; }}
    }
    setShips(ns);
    const nc=cells.map(row=>row.slice()); nc[r][c]= hit? 2:1; setCells(nc);
  }
  function reset(){ setCells(Array.from({length:N},()=>Array(N).fill(0))); setShips(placeShips()); }

  return (
    <div className="mx-auto">
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Battleship — Click to fire</div>
      <div className="inline-block">
        {cells.map((row,r)=> (
          <div key={r} className="flex">
            {row.map((v,c)=> (
              <button key={c} className="w-7 h-7 border border-[color:var(--glass-border)]" onClick={()=>fire(r,c)} style={{background: v===0?'rgba(255,255,255,0.05)': v===1?'#1b2a34':'#b71c1c'}} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm">Sunk: {sunk} / 5</div>
      <button className="mt-2 px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={reset}>Reset</button>
    </div>
  );
}



import { useMemo, useState } from 'react';

const N=4; // 4x4 dots → 3x3 boxes
type Edge = {[key:string]: 0|1|2};

function keyH(r:number,c:number){return `h-${r}-${c}`;} // horizontal edge above box (r,c)
function keyV(r:number,c:number){return `v-${r}-${c}`;} // vertical edge left of box (r,c)

export default function DotsAndBoxesMini(){
  const [edges,setEdges]=useState<Edge>({});
  const [turn,setTurn]=useState<1|2>(1);
  const [score,setScore]=useState<{a:number;b:number}>({a:0,b:0});
  const boxes = useMemo(()=>{
    const owned: {[k:string]: 0|1|2}={};
    for(let r=0;r<N-1;r++) for(let c=0;c<N-1;c++){
      const full = edges[keyH(r,c)] && edges[keyH(r+1,c)] && edges[keyV(r,c)] && edges[keyV(r,c+1)];
      if (full) owned[`${r}-${c}`]= (edges[keyH(r,c)]||edges[keyH(r+1,c)]||edges[keyV(r,c)]||edges[keyV(r,c+1)]) as 1|2;
    }
    return owned;
  },[edges]);

  function claim(type:'h'|'v', r:number,c:number){
    const k = type==='h'? keyH(r,c): keyV(r,c);
    if (edges[k]) return;
    const ne = {...edges, [k]: turn};
    const beforeBoxes = Object.keys(boxes).length;
    setEdges(ne);
    // check if made box; if yes, keep turn
    const after = (()=>{
      let count=0; for(let rr=0;rr<N-1;rr++) for(let cc=0;cc<N-1;cc++){
        if (ne[keyH(rr,cc)] && ne[keyH(rr+1,cc)] && ne[keyV(rr,cc)] && ne[keyV(rr,cc+1)]) count++;
      }
      return count;
    })();
    if (after>beforeBoxes){
      setScore(s=> turn===1? {...s,a:s.a+ (after-beforeBoxes)} : {...s,b:s.b+(after-beforeBoxes)});
    } else {
      setTurn(t=> t===1?2:1);
      aiTurn(ne);
    }
  }

  function aiTurn(e: Edge){
    // simple AI: take a safe edge (not creating 3rd edge of a box) or any available
    const all: {k:string;type:'h'|'v';r:number;c:number}[]=[];
    for(let r=0;r<N-1;r++) for(let c=0;c<N-1;c++){
      all.push({k:keyH(r,c),type:'h',r,c}); all.push({k:keyH(r+1,c),type:'h',r:r+1,c});
      all.push({k:keyV(r,c),type:'v',r,c}); all.push({k:keyV(r,c+1),type:'v',r,c:c+1});
    }
    const avail = all.filter(a=>!e[a.k]);
    const pick = avail[0]; if (!pick) return;
    setEdges(prev=> ({...prev, [pick.k]: 2})); setTurn(1);
  }

  function reset(){ setEdges({}); setTurn(1); setScore({a:0,b:0}); }

  return (
    <div className="mx-auto">
      <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">Dots & Boxes — You vs AI</div>
      <svg viewBox={`0 0 ${N*40} ${N*40}`} className="block mx-auto" width={N*40} height={N*40}>
        {Array.from({length:N},(_,r)=> Array.from({length:N},(_,c)=> (
          <circle key={`${r}-${c}`} cx={c*40+20} cy={r*40+20} r={3} fill="#fff" />
        )))}
        {Array.from({length:N-1},(_,r)=> Array.from({length:N-1},(_,c)=> (
          <g key={`box-${r}-${c}`}>
            <line x1={c*40+20} y1={r*40+20} x2={c*40+60} y2={r*40+20} stroke={edges[keyH(r,c)]? '#0ff':'#555'} strokeWidth={4} onClick={()=>claim('h',r,c)}/>
            <line x1={c*40+20} y1={r*40+60} x2={c*40+60} y2={r*40+60} stroke={edges[keyH(r+1,c)]? '#0ff':'#555'} strokeWidth={4} onClick={()=>claim('h',r+1,c)}/>
            <line x1={c*40+20} y1={r*40+20} x2={c*40+20} y2={r*40+60} stroke={edges[keyV(r,c)]? '#0ff':'#555'} strokeWidth={4} onClick={()=>claim('v',r,c)}/>
            <line x1={c*40+60} y1={r*40+20} x2={c*40+60} y2={r*40+60} stroke={edges[keyV(r,c+1)]? '#0ff':'#555'} strokeWidth={4} onClick={()=>claim('v',r,c+1)}/>
          </g>
        )))}
      </svg>
      <div className="mt-2 text-sm">Score — You: {score.a} AI: {score.b}</div>
      <button className="mt-2 px-3 py-1 rounded border border-[color:var(--glass-border)]" onClick={reset}>Reset</button>
    </div>
  );
}



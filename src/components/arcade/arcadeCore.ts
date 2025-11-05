import { useEffect, useRef } from 'react';

export function useCanvasLoop(draw: (dt: number) => void) {
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(performance.now());
  useEffect(() => {
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - lastRef.current) / 1000);
      lastRef.current = t;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);
}

export function useKeyInput(map: Record<string, (down: boolean) => void>) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (map[e.key]) map[e.key](true); };
    const onKeyUp = (e: KeyboardEvent) => { if (map[e.key]) map[e.key](false); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [map]);
}

export function aabb(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}



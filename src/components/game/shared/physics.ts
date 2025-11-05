export const GRAVITY = 2000;
export const MOVE_ACCEL = 4000;
export const MAX_SPEED_X = 450;
export const JUMP_SPEED = 800;
export const FRICTION_GROUND = 2000;
export const FRICTION_AIR = 200;

export function clampDt(dt: number): number {
  return Math.min(0.032, Math.max(0, dt));
}



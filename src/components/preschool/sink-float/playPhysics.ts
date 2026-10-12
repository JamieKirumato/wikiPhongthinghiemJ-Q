// Two display units represent one metre for the animated trajectory.
export const DISPLAY_GRAVITY = 9.81 * 2;

/** Approximate air drag from sample cross-section/mass; broad light leaves resist most.
 * These are representative shapes, not measured fall times. Dense samples remain nearly ballistic.
 */
export function objectAirDrag(id:string,massGrams:number,volumeMl:number) {
  const shapes:Record<string,number>={'item-leaf':12,'item-bottle':1.5,'item-duck':1.6,'item-spoon':2,'item-keys':1.8,'item-coin':2};
  const radiusCm=Math.cbrt(3*Math.max(.01,volumeMl)/(4*Math.PI));
  // rho_air=1.2 kg/m³, cm²→m², g→kg and two display units per metre.
  return .03*Math.PI*radiusCm*radiusCm*(shapes[itemKind(id)]??.5)/Math.max(.1,massGrams);
}

export function advanceAirFall(y: number, vy: number, dt: number, drag=0) {
  if(drag>0){
    const steps=Math.max(1,Math.ceil(dt*120)),step=dt/steps;
    for(let n=0;n<steps;n++){
      const before=vy,half=vy-DISPLAY_GRAVITY*step/2;
      vy=half/(1+drag*Math.abs(half)*step)-DISPLAY_GRAVITY*step/2;
      y+=(before+vy)*step/2;
    }
    return {y,vy};
  }
  return { y: y + vy * dt - 0.5 * DISPLAY_GRAVITY * dt * dt, vy: vy - DISPLAY_GRAVITY * dt };
}

export function itemKind(id: string) { return id.split('#')[0]; }

export function impactVolume(speed: number) {
  return Math.max(0.4, Math.min(1, Math.sqrt(Math.max(0, Number.isFinite(speed) ? speed : 0) / 8)));
}

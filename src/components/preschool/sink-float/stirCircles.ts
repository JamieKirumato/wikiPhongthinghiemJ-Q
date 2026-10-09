export interface StirCircleState {
  last: {x:number;y:number;angle:number}|null;
  radians: number;
}

export const REQUIRED_STIR_CIRCLES = 5;

/** Count continuous turns around the visible water centre, never straight strokes. */
export function advanceStirCircles(state:StirCircleState, point:{x:number;y:number}, centre:{x:number;y:number}, inside:boolean):StirCircleState {
  const radius=Math.hypot(point.x-centre.x,point.y-centre.y);
  if(!inside||radius>150)return {...state,last:null};
  // Passing briefly through the middle of a small hand circle is still part of that turn.
  if(radius<8)return state;
  const angle=Math.atan2(point.y-centre.y,point.x-centre.x);
  if(!state.last)return {...state,last:{...point,angle}};
  const distance=Math.hypot(point.x-state.last.x,point.y-state.last.y);
  if(distance<2)return state;
  let delta=angle-state.last.angle;
  if(delta>Math.PI)delta-=Math.PI*2;
  if(delta<-Math.PI)delta+=Math.PI*2;
  if(distance>70||Math.abs(delta)>1.9)return {...state,last:{...point,angle}};
  return {last:{...point,angle},radians:state.radians+delta};
}

export function stirCircleProgress(state:StirCircleState):number {
  const radians=Math.abs(state.radians);
  return radians<1e-6?0:Math.min(100,radians/(REQUIRED_STIR_CIRCLES*Math.PI*2)*100+1e-7);
}

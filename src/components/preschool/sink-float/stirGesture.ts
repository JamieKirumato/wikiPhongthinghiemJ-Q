export interface StirGestureState {
  last: {x:number;y:number;angle:number}|null;
  radians: number;
  distance: number;
}

// Two short 36px sweeps or three 24px sweeps are enough; no full circles required.
const SYMBOLIC_STIR_DISTANCE = 72;

export function advanceStirGesture(state:StirGestureState, point:{x:number;y:number}, centre:{x:number;y:number}, inside:boolean):StirGestureState {
  if(!inside)return {...state,last:null};
  const angle=Math.atan2(point.y-centre.y,point.x-centre.x);
  const last={...point,angle};
  if(!state.last)return {...state,last};
  const distance=Math.hypot(point.x-state.last.x,point.y-state.last.y);
  if(distance<2)return state;
  // Do not count a jump, or bridge a trip out of the water.
  if(distance>70)return {...state,last};
  let delta=angle-state.last.angle;
  if(delta>Math.PI)delta-=Math.PI*2;
  if(delta<-Math.PI)delta+=Math.PI*2;
  // Angular movement only controls the water effect, never dissolution.
  return {last,radians:state.radians+(Math.abs(delta)<=1.9?delta:0),distance:state.distance+distance};
}

export function stirGestureProgress(state:StirGestureState):number {
  return Math.min(100,state.distance/SYMBOLIC_STIR_DISTANCE*100);
}

import {TankDimensions} from './types';
export type IntroAction='welcome'|'pick'|'outside'|'dip'|'rotate'|'salt'|'stir'|'pour'|'scoop'|'ready';
export const INTRO_GUIDE:Array<{action:IntroAction;audio:string;icon:string}>=[
  {action:'welcome',audio:'intro-0',icon:'👋'},
  {action:'pick',audio:'intro-1',icon:'🖐️ 🍎'},
  {action:'outside',audio:'intro-2',icon:'🖐️ 💦'},
  {action:'dip',audio:'intro-3',icon:'🖐️ 🦆'},
  {action:'rotate',audio:'intro-4',icon:'🔄 🔍'},
  {action:'salt',audio:'intro-5',icon:'🧂 🥄'},
  {action:'stir',audio:'intro-6',icon:'🥢 💧'},
  {action:'pour',audio:'intro-8',icon:'🫗 💧'},
  {action:'scoop',audio:'intro-9',icon:'🥣 💧'},
  {action:'ready',audio:'intro-7',icon:'🧺 ✨'},
];
export const introProgress=(time:number,duration:number)=>Number.isFinite(time)&&Number.isFinite(duration)&&duration>0?Math.max(0,Math.min(1,time/duration)):0;
const phase=(p:number,start:number,end:number)=>Math.max(0,Math.min(1,(p-start)/(end-start)));
export function introPose(action:IntroAction,progress:number,dims:TankDimensions,water:number){
  const p=Math.max(0,Math.min(1,progress)),top=dims.height+.9;
  let x=0,y=water+.35,z=0,waterOffset=0;
  let item:'item-apple'|'item-egg'|'item-duck'|null=null;
  let carrying=false,fromTray=0,tool='',toolFill=0;
  if(action==='pick'||action==='outside'){
    item='item-apple';fromTray=1-phase(p,.14,.43);carrying=p<.56;
    if(action==='outside'){x=-dims.width*.3;z=dims.depth*.63;y=top-(top+.42)*phase(p,.58,.79)**2;}
    else {
      y=top-(top-water-.35)*phase(p,.56,.76)**2;
      if(p>.8){const arc=phase(p,.8,.99);x=Math.sin(arc*Math.PI)*1.5;y=water+.35+Math.sin(arc*Math.PI)*1.8;carrying=p<.85;}
    }
  }
  if(action==='dip'){item='item-duck';carrying=p>.13&&p<.72;y=water+.35-1.3*phase(p,.3,.52)+1.3*phase(p,.72,.95);}
  if(action==='rotate'){x=dims.width*.42;y=dims.height;z=dims.depth*.45;}
  if(action==='salt'){tool=p<.32?'🧂':'🥄';fromTray=1-phase(p,.4,.65);y=top;toolFill=phase(p,.28,.4)*(1-phase(p,.7,.85));}
  if(action==='stir'){tool='🥢';x=Math.cos(p*Math.PI*6)*.7;z=Math.sin(p*Math.PI*6)*.6;y=water;}
  if(action==='pour'){tool='pitcher';fromTray=1-phase(p,.08,.32);y=top;waterOffset=dims.waterHeight*.2*phase(p,.35,.83);toolFill=p>.35&&p<.83?1:0;}
  if(action==='scoop'){
    tool='ladle';fromTray=1-phase(p,.05,.27);
    const outside=phase(p,.55,.65)*(1-phase(p,.74,.81));
    x=-dims.width*.3*outside;z=dims.depth*.63*outside;y=water-.12+.65*outside;
    toolFill=phase(p,.3,.5)*(1-phase(p,.65,.74))+.5*phase(p,.81,.87)*(1-phase(p,.9,.97));
    waterOffset=dims.waterHeight*(.2*(1-phase(p,.3,.5))-.1*phase(p,.81,.87)*(1-phase(p,.9,.97)));
  }
  return {x,y,z,item,carrying,fromTray,tool,toolFill,waterOffset,p};
}

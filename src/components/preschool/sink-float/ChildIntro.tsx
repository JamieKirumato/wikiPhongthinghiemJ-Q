import {useEffect,useRef,useState} from 'react';
import {unlockImpactAudio} from './impactAudio';
import {INTRO_GUIDE,IntroAction,introProgress} from './introGuide';
import {PitcherIcon} from './WaterPitcher';
import {LadleIcon} from './WaterLadle';
import {RealisticHandSpoon,RealisticStirringHand} from './SaltWorkflow';
import {introAudioSources} from './teacherExperience';
export type IntroFrame={x:number;y:number;carrying:boolean;fromTray:number;tool:string;toolFill:number;item:string|null};

export function ChildIntro({onComplete,onFrame,onCleanup}:{onComplete:()=>void;onFrame:(action:IntroAction,p:number)=>IntroFrame|null;onCleanup:()=>void}) {
  const indexRef=useRef(0);
  const [step,setStep]=useState(0),[waiting,setWaiting]=useState(false),[progress,setProgress]=useState(0);
  const [frame,setFrame]=useState<IntroFrame|null>(null);
  const callbacks=useRef({onComplete,onFrame,onCleanup});callbacks.current={onComplete,onFrame,onCleanup};
  useEffect(()=>{
    let active=true,raf=0,lastUpdate=0,blocked=false;
    let audio:HTMLAudioElement|null=null,release=()=>{};
    const start=(bundle:{sources:string[];release:()=>void})=>{
    if(!active){bundle.release();return;}
    release=bundle.release;
    const media=new Audio(bundle.sources[0]);media.preload='auto';audio=media;
    const play=()=>{blocked=false;setWaiting(false);void media.play().catch(()=>{if(active){blocked=true;setWaiting(true);}});};
    media.onended=()=>{
      if(!active)return;
      const next=++indexRef.current;
      if(next===INTRO_GUIDE.length){callbacks.current.onCleanup();callbacks.current.onComplete();return;}
      setStep(next);setFrame(null);media.src=bundle.sources[next];play();
    };
    // One clock drives speech, hand position and all demonstration effects.
    const tick=(time:number)=>{
      if(!active)return;
      if(!media.paused&&media.readyState>=3&&indexRef.current<INTRO_GUIDE.length&&time-lastUpdate>=32){
        lastUpdate=time;
        const p=introProgress(media.currentTime,media.duration);
        setProgress((indexRef.current+p)/INTRO_GUIDE.length*100);
        setFrame(callbacks.current.onFrame(INTRO_GUIDE[indexRef.current].action,p));
      }
      raf=requestAnimationFrame(tick);
    };
    media.onerror=()=>{if(active){blocked=true;setWaiting(true);}};play();raf=requestAnimationFrame(tick);
    };
    // A browser may require user activation: any natural contact starts the guide, no media toolbar.
    const activate=()=>{if(!active||!blocked||!audio||indexRef.current>=INTRO_GUIDE.length)return;blocked=false;unlockImpactAudio();if(audio.error)audio.load();void audio.play().then(()=>{if(active)setWaiting(false);}).catch(()=>{if(active)blocked=true;});};
    window.addEventListener('pointerdown',activate,true);window.addEventListener('keydown',activate,true);
    void introAudioSources().then(start,()=>start({sources:INTRO_GUIDE.map(s=>`/audio/vi/${s.audio}.mp3`),release:()=>{}}));
    return ()=>{active=false;window.removeEventListener('pointerdown',activate,true);window.removeEventListener('keydown',activate,true);cancelAnimationFrame(raf);if(audio){audio.pause();audio.onended=null;audio.onerror=null;}release();indexRef.current=0;callbacks.current.onCleanup();};
  },[]);
  const action=INTRO_GUIDE[step].action;
  const phaseProgress=progress/100*INTRO_GUIDE.length-step;
  const image=frame?.item?.replace('item-','');
  return <>
    {frame&&<div data-intro-hand data-action={action} aria-hidden="true" className="fixed z-[90] pointer-events-none" style={{left:frame.x,top:frame.y,transform:'translate(-50%,-50%)'}}>
      <div className="absolute -inset-5 rounded-full border-4 border-amber-300/70 bg-amber-100/20"/>
      {image&&frame.fromTray>0&&<img src={`/assets/items/${image}.png`} alt="" className="absolute w-14 h-14 max-w-none -left-5 -top-6 object-contain"/>}
      {frame.tool==='pitcher'?<div style={{transform:frame.toolFill?'rotate(-55deg)':undefined}}><PitcherIcon/>{frame.toolFill>0&&<div className="absolute left-3 top-14 h-16 w-1.5 bg-sky-300 rounded-full"/>}</div>:
        frame.tool==='ladle'?<div style={{transform:frame.toolFill>0&&action==='scoop'&&frame.fromTray===0?'rotate(-10deg)':undefined}}><LadleIcon fill={frame.toolFill}/></div>:
        frame.tool&&frame.tool!=='🥄'&&frame.tool!=='🥢'?<div className="text-5xl">{frame.tool}</div>:null}
      {frame.tool!=='🥄'&&frame.tool!=='🥢'&&<span className="relative text-5xl drop-shadow-md" style={{display:'block',transform:action==='welcome'?'rotate(-15deg)':undefined}}>{action==='welcome'?'👋':frame.carrying?'✊':'🖐️'}</span>}
    </div>}
    {frame&&(frame.tool==='🥄'||frame.tool==='🥢')&&<div aria-hidden="true" className="fixed left-0 top-0 z-[91] pointer-events-none">
      {frame.tool==='🥄'?<RealisticHandSpoon x={frame.x} y={frame.y} hasSalt={frame.toolFill>0} isPouring={phaseProgress>.7&&phaseProgress<.85}/>:
        <RealisticStirringHand x={frame.x} y={frame.y} angle={phaseProgress*1080} isInWater/>}
    </div>}
    <span data-child-intro role="status" className="sr-only">{waiting?'Hướng dẫn sẽ phát khi chạm vào màn chơi.':'Đang hướng dẫn cách chơi.'}</span>
  </>;
}

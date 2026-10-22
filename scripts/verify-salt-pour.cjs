const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/components/preschool/sink-float/SaltWorkflow.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
const gestureModule={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/preschool/sink-float/stirGesture.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:gestureModule,exports:gestureModule.exports});
function mount(step,overrides={}){
  const listeners=new Map(),effects=[],calls=[],elements=[],frames=new Map(),rodPositions=[];let frameId=0;
  const react={createElement:(type,props,...children)=>{elements.push({type,props,children});return null;},useState:v=>[v,()=>{}],useRef:v=>({current:v}),useCallback:fn=>fn,useEffect:fn=>effects.push(fn)};
  const module={exports:{}};
  vm.runInNewContext(code,{module,exports:module.exports,require:name=>name==='react'?react:name==='react-dom'?{createPortal:v=>v}:name==='./stirGesture'?gestureModule.exports:{},window:{addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)},requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),clearTimeout,document:{body:{}},performance});
  module.exports.SaltWorkflow({visualOnly:true,workflowStep:step,saltSpoons:0,activeStirProgress:0,currentDensity:1,onPourAtScreenPoint:(x,y)=>calls.push({x,y}),getStirRod:(x,y)=>{rodPositions.push({x,y});return null;},checkPointOverMouth:x=>x>200,onStepChange(){},onStirProgressUpdate(){},onSpoonCompleted(){},onResetSalt(){},checkPointInWater:()=>false,onMessageUpdate(){},soundEnabled:false,...overrides});
  const cleanup=effects.map(fn=>fn());
  return {listeners,calls,elements,frames,rodPositions,dispose:()=>cleanup.forEach(fn=>fn?.())};
}
const holding=mount('holdingSpoon');
assert.equal(holding.listeners.has('pointerdown'),false);
holding.listeners.get('pointermove')({clientX:250,clientY:300});
assert.deepEqual(holding.calls,[{x:250,y:300}],'moving a filled spoon alone attempts pouring; no press or tilt required');
holding.dispose();assert.equal(holding.listeners.has('pointermove'),false);
const pouring=mount('pouring');pouring.listeners.get('pointermove')({clientX:700,clientY:600});assert.equal(pouring.calls.length,0,'a pouring spoon stays in place and does not pour again');pouring.dispose();
const empty=mount('scoopMode');empty.listeners.get('pointermove')({clientX:250,clientY:300});assert.equal(empty.calls.length,0,'an empty spoon cannot pour');empty.dispose();
console.log('Passed: filled spoon auto-pours on pointer movement without a press/tilt, freezes while pouring, ignores an empty spoon, and cleans up listeners.');

const stirring=mount('stirring');
const grab=stirring.elements.find(element=>element.props?.onGrab).props.onGrab;
grab({button:0,pointerId:1,clientX:0,clientY:0,preventDefault(){},stopPropagation(){},currentTarget:{setPointerCapture(){}}});
for(let x=1;x<=20;x++)stirring.listeners.get('pointermove')({pointerId:1,clientX:x,clientY:100});
assert.equal(stirring.frames.size,1,'a burst of pointer events schedules only one display frame');
assert.equal(stirring.rodPositions.length,0);
[...stirring.frames.values()][0]();
assert.deepEqual(stirring.rodPositions,[{x:20,y:100}],'the rod uses the most recent pointer position');
stirring.listeners.get('pointermove')({pointerId:1,clientX:25,clientY:105});
stirring.listeners.get('pointerup')();
assert.deepEqual(stirring.rodPositions.at(-1),{x:25,y:105},'release flushes the final position before releasing capture');
assert.equal(stirring.frames.size,0);
stirring.listeners.get('pointermove')({pointerId:1,clientX:30,clientY:110});
stirring.dispose();assert.equal(stirring.frames.size,0,'unmount cancels the pending frame');assert.equal(stirring.listeners.size,0);
console.log('Passed: rod movement is coalesced per frame, release keeps the final position, and unmount clears input and frames.');

// Exercise the actual parent callbacks: multiple pours accumulate before any stirring.
const parent=fs.readFileSync('src/components/preschool/SimSinkOrFloatLab.tsx','utf8');
const completed=parent.slice(parent.indexOf('  const handleSpoonCompleted ='),parent.indexOf('  // Thay nước ngọt ban đầu'));
const pour=parent.slice(parent.indexOf('  const handlePourSaltAtPoint ='),parent.indexOf('  // Bắt đầu đua thả 2 vật'));
const state={workflowStep:'holdingSpoon',spoonFraction:1,pendingSaltSpoons:0,saltSpoons:0,soundEnabled:false,SALT_GRAMS_PER_SPOON:50,tankShape:'rectangle',dimensions:{},waterVolumeMl:()=>1000,pourTimeoutRef:{current:null},setMessage(){},activeStirProgress:0,setItems(){},useCallback:fn=>fn,window:{setTimeout:fn=>{state.timer=fn;return 1;}},clearTimeout(){},threeTankRef:{current:{spawnSaltGrains(){},clearSaltGrains(){},setSaltSediment(grams){state.sediment=grams;},refreshObservations(){}}}};
state.setActiveStirProgress=value=>state.activeStirProgress=typeof value==='function'?value(state.activeStirProgress):value;
state.setWorkflowStep=step=>state.workflowStep=step;state.setPendingSaltSpoons=value=>state.pendingSaltSpoons=typeof value==='function'?value(state.pendingSaltSpoons):value;state.setSaltSpoons=value=>state.saltSpoons=typeof value==='function'?value(state.saltSpoons):value;
vm.runInNewContext(ts.transpileModule(completed+pour+'\nthis.handlers={handleSpoonCompleted,handlePourSaltAtPoint};',{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText,state);
for(let i=0;i<9;i++){state.workflowStep='holdingSpoon';state.handlers.handlePourSaltAtPoint({x:0,y:5,z:0});assert.equal(state.workflowStep,'pouring');state.timer();assert.equal(state.workflowStep,'scoopMode');assert.equal(state.pendingSaltSpoons,i+1);assert.equal(state.saltSpoons,0);}
state.handlers.handleSpoonCompleted();assert.equal(state.saltSpoons,9);assert.equal(state.pendingSaltSpoons,0);assert.equal(state.sediment,90);
console.log('Passed: nine consecutive pours retain an empty spoon, have no eight-spoon limit, and show excess salt after mixing.');

state.saltSpoons=0;state.pendingSaltSpoons=1;state.activeStirProgress=50;state.workflowStep='holdingSpoon';
state.handlers.handlePourSaltAtPoint({x:0,y:5,z:0});state.timer();
assert.equal(state.pendingSaltSpoons,2);assert.equal(state.activeStirProgress,25);assert.equal(state.pendingSaltSpoons*state.activeStirProgress/100,.5,'adding salt after a partial stir preserves the amount already dissolved');

const gesture=gestureModule.exports,centre={x:100,y:100};
const fresh=()=>({last:null,radians:0,distance:0});
function move(state,x,y,inside=true){return gesture.advanceStirGesture(state,{x,y},centre,inside);}
for(const width of [24,36]){
  let state=move(fresh(),100,100);
  const sweeps=72/width;
  for(let sweep=0;sweep<sweeps;sweep++){
    for(let step=3;step<=width;step+=3)state=move(state,100+(sweep%2?width-step:step),100);
    if(sweep<sweeps-1)assert.ok(gesture.stirGestureProgress(state)<100);
  }
  assert.equal(gesture.stirGestureProgress(state),100,'2-3 short back-and-forth strokes finish immediately, even through the water centre');
}
let arc=move(fresh(),130,100);
for(let i=1;i<=36;i++)arc=move(arc,100+30*Math.cos(i*Math.PI/36),100+30*Math.sin(i*Math.PI/36));
assert.equal(gesture.stirGestureProgress(arc),100,'a short curved gesture works without full circles');
let jitter=move(fresh(),100,100);
for(let i=0;i<100;i++)jitter=move(jitter,100+(i%2)*.5,100);
assert.equal(gesture.stirGestureProgress(jitter),0,'stationary input and tiny jitter do not dissolve salt');
let outside=move(fresh(),100,100);
outside=move(outside,124,100,false);outside=move(outside,150,100,false);outside=move(outside,124,100);
assert.equal(gesture.stirGestureProgress(outside),0,'entering/leaving the water contributes no distance');
outside=move(outside,220,100);
assert.equal(gesture.stirGestureProgress(outside),0,'large jumps contribute no distance');
console.log('Passed: 2-3 short strokes dissolve salt immediately; arcs also work, while jitter, outside-water movement and jumps do not.');

// Exercise the actual workflow at slow, one-pixel-per-frame pointer speed.
let completions=0;const published=[];
const shortStir=mount('stirring',{pendingSaltSpoons:1,getStirCentre:()=>centre,checkPointInWater:()=>true,onSpoonCompleted:()=>completions++,onStirProgressUpdate:value=>published.push(value)});
shortStir.elements.find(element=>element.props?.onTake).props.onTake();
shortStir.elements.find(element=>element.props?.onGrab).props.onGrab({button:0,pointerId:1,clientX:100,clientY:100,preventDefault(){},stopPropagation(){},currentTarget:{setPointerCapture(){}}});
for(let sweep=0;sweep<3;sweep++){
  for(let step=1;step<=24;step++){
    shortStir.listeners.get('pointermove')({pointerId:1,clientX:100+(sweep%2?24-step:step),clientY:100});
    [...shortStir.frames.values()][0]();
  }
  assert.equal(completions,sweep===2?1:0,'actual workflow finishes on the third short sweep, without extra movement or waiting');
}
assert.equal(published.at(-1),100);shortStir.dispose();
console.log('Passed: actual salt workflow completes immediately after three slow, short strokes.');

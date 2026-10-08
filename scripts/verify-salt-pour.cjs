const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/components/preschool/sink-float/SaltWorkflow.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
function mount(step){
  const listeners=new Map(),effects=[],calls=[];
  const react={createElement:()=>null,useState:v=>[v,()=>{}],useRef:v=>({current:v}),useCallback:fn=>fn,useEffect:fn=>effects.push(fn)};
  const module={exports:{}};
  vm.runInNewContext(code,{module,exports:module.exports,require:name=>name==='react'?react:name==='react-dom'?{createPortal:v=>v}:name==='./salinity'?{MAX_SALT_SPOONS:5}:{},window:{addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)},clearTimeout,document:{body:{}},performance});
  module.exports.SaltWorkflow({visualOnly:true,workflowStep:step,saltSpoons:0,activeStirProgress:0,currentDensity:1,onPourAtScreenPoint:(x,y)=>calls.push({x,y}),onStepChange(){},onStirProgressUpdate(){},onSpoonCompleted(){},onResetSalt(){},checkPointInWater:()=>false,onMessageUpdate(){},soundEnabled:false});
  const cleanup=effects.map(fn=>fn());
  return {listeners,calls,dispose:()=>cleanup.forEach(fn=>fn?.())};
}
const holding=mount('holdingSpoon');
assert.equal(holding.listeners.has('pointerdown'),false);
holding.listeners.get('pointermove')({clientX:250,clientY:300});
assert.deepEqual(holding.calls,[{x:250,y:300}],'moving a filled spoon alone attempts pouring; no press or tilt required');
holding.dispose();assert.equal(holding.listeners.has('pointermove'),false);
const pouring=mount('pouring');pouring.listeners.get('pointermove')({clientX:700,clientY:600});assert.equal(pouring.calls.length,0,'a pouring spoon stays in place and does not pour again');pouring.dispose();
const empty=mount('scoopMode');empty.listeners.get('pointermove')({clientX:250,clientY:300});assert.equal(empty.calls.length,0,'an empty spoon cannot pour');empty.dispose();
console.log('Passed: filled spoon auto-pours on pointer movement without a press/tilt, freezes while pouring, ignores an empty spoon, and cleans up listeners.');

// Exercise the actual parent callbacks: multiple pours accumulate before any stirring.
const parent=fs.readFileSync('src/components/preschool/SimSinkOrFloatLab.tsx','utf8');
const completed=parent.slice(parent.indexOf('  const handleSpoonCompleted ='),parent.indexOf('  // Thay nước ngọt ban đầu'));
const pour=parent.slice(parent.indexOf('  const handlePourSaltAtPoint ='),parent.indexOf('  // Bắt đầu đua thả 2 vật'));
const state={workflowStep:'holdingSpoon',spoonFraction:1,pendingSaltSpoons:0,saltSpoons:0,soundEnabled:false,MAX_SALT_SPOONS:5,pourTimeoutRef:{current:null},setMessage(){},activeStirProgress:0,setItems(){},useCallback:fn=>fn,window:{setTimeout:fn=>{state.timer=fn;return 1;}},clearTimeout(){},threeTankRef:{current:{spawnSaltGrains(){},clearSaltGrains(){},refreshObservations(){}}}};
state.setActiveStirProgress=value=>state.activeStirProgress=typeof value==='function'?value(state.activeStirProgress):value;
state.setWorkflowStep=step=>state.workflowStep=step;state.setPendingSaltSpoons=value=>state.pendingSaltSpoons=typeof value==='function'?value(state.pendingSaltSpoons):value;state.setSaltSpoons=value=>state.saltSpoons=typeof value==='function'?value(state.saltSpoons):value;
vm.runInNewContext(ts.transpileModule(completed+pour+'\nthis.handlers={handleSpoonCompleted,handlePourSaltAtPoint};',{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText,state);
for(let i=0;i<2;i++){state.workflowStep='holdingSpoon';state.handlers.handlePourSaltAtPoint({x:0,y:5,z:0});assert.equal(state.workflowStep,'pouring');state.timer();assert.equal(state.workflowStep,'scoopMode');assert.equal(state.pendingSaltSpoons,i+1);assert.equal(state.saltSpoons,0);}
state.handlers.handleSpoonCompleted();assert.equal(state.saltSpoons,2);assert.equal(state.pendingSaltSpoons,0);
console.log('Passed: two pours retain an empty spoon, accumulate two undissolved doses, and dissolve both exactly once on stirring completion.');

state.saltSpoons=0;state.pendingSaltSpoons=1;state.activeStirProgress=50;state.workflowStep='holdingSpoon';
state.handlers.handlePourSaltAtPoint({x:0,y:5,z:0});state.timer();
assert.equal(state.pendingSaltSpoons,2);assert.equal(state.activeStirProgress,25);assert.equal(state.pendingSaltSpoons*state.activeStirProgress/100,.5,'adding salt after a partial stir preserves the amount already dissolved');

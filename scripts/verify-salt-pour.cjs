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

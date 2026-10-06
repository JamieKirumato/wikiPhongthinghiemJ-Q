const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
function source(relative, context = {}) {
  const filename = path.resolve(relative);
  if (cache.has(filename) && !Object.keys(context).length) return cache.get(filename);
  const module = {exports:{}};
  const output = ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const requireSource = name => name.startsWith('.') ? (name.endsWith('.json')?{default:JSON.parse(fs.readFileSync(path.resolve(path.dirname(filename),name),'utf8'))}:source(path.join(path.dirname(filename),`${name}.ts`),context)) : require(name);
  vm.runInNewContext(output,{module,exports:module.exports,require:requireSource,...context},{filename});
  if (!Object.keys(context).length) cache.set(filename,module.exports);
  return module.exports;
}
const geometry = source('src/components/preschool/sink-float/tankGeometry.ts');
const salt = source('src/components/preschool/sink-float/salinity.ts');
const buoyancy = source('src/components/preschool/sink-float/buoyancy.ts');
const impact = source('src/components/preschool/sink-float/impactPhysics.ts');
const waterMotion = source('src/components/preschool/sink-float/waterMotion.ts');
const waterPhysics=source('src/components/preschool/sink-float/waterPhysics.ts');
const fillDims=geometry.getTankDimensions('rectangle','normal');
const mlHeight=waterPhysics.addedWaterHeight(100,'rectangle',fillDims);
assert.ok(Math.abs(mlHeight-fillDims.waterHeight*.1)<1e-9);
assert.ok(waterPhysics.addedWaterHeight(-100,'rectangle',fillDims)<0);
let scoopVolume=1000,scoopSalt=150;
for(let n=0;n<4;n++){
  const taken=waterPhysics.scoopWater(scoopVolume,scoopSalt,200);
  scoopVolume-=taken.ml;scoopSalt-=taken.grams;
  assert.ok(Math.abs(scoopSalt/scoopVolume-.15)<1e-10);
  assert.ok(Math.abs(salt.brineDensity(scoopSalt,scoopVolume)-salt.brineDensity(150,1000))<1e-10);
}
const lastScoop=waterPhysics.scoopWater(scoopVolume,scoopSalt,500);
assert.equal(lastScoop.ml,200);assert.equal(lastScoop.grams,30);
assert.deepEqual(JSON.parse(JSON.stringify(waterPhysics.scoopWater(0,0,200))),{ml:0,grams:0});
const returned=waterPhysics.scoopWater(1000,150,200);
assert.equal(1000-returned.ml+returned.ml,1000);
assert.equal(150-returned.grams+returned.grams,150);
assert.ok(salt.brineDensity(150,1200)<salt.brineDensity(150,1000));
console.log('Passed: ladle lowers water, bounds empty tanks, preserves brine concentration and returns carried salt.');
// Exercise the real ladle pointer/animation handlers, including cancellation and water return.
let ladleVolume=1000,ladleSalt=150,ladleActive=false,ladleHand=null;
let ladleFrame=0;const ladleFrames=new Map(),ladleListeners=new Map();
const fakeReact={useRef:value=>({current:value}),useEffect(){},useState:()=>[null,value=>{ladleHand=value;}],createElement:(type,props,...children)=>({type,props:props||{},children}),Fragment:'fragment'};
fakeReact.default=fakeReact;
const ladleModule={exports:{}};
const ladleCode=ts.transpileModule(fs.readFileSync('src/components/preschool/sink-float/WaterLadle.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React}}).outputText;
vm.runInNewContext(ladleCode,{module:ladleModule,exports:ladleModule.exports,require:name=>name==='react'?fakeReact:{playWaterSwish(){},unlockImpactAudio(){}},performance:{now:()=>0},requestAnimationFrame:fn=>{ladleFrames.set(++ladleFrame,fn);return ladleFrame;},cancelAnimationFrame:id=>ladleFrames.delete(id),window:{addEventListener:(name,fn)=>ladleListeners.set(name,fn),removeEventListener:name=>ladleListeners.delete(name)}});
function startLadle(){const tree=ladleModule.exports.WaterLadle({disabled:false,teacher:false,capacity:200,onActive:active=>{ladleActive=active;},checkWater:(x,y)=>x===100&&y===100,checkMouth:(x,y)=>x===100&&y===50,onFlow(){},onTake:ml=>{const taken=waterPhysics.scoopWater(ladleVolume,ladleSalt,ml);ladleVolume-=taken.ml;ladleSalt-=taken.grams;return taken;},onReturn:water=>{ladleVolume+=water.ml;ladleSalt+=water.grams;}});tree.children[0].props.onPointerDown({button:0,pointerId:1,clientX:500,clientY:500,preventDefault(){}});}
function ladleTick(time){const [id,fn]=ladleFrames.entries().next().value;ladleFrames.delete(id);fn(time);}
startLadle();assert.equal(ladleActive,true);
ladleListeners.get('pointermove')({pointerId:2,clientX:100,clientY:100});ladleTick(100);assert.equal(ladleVolume,1000);
ladleListeners.get('pointermove')({pointerId:1,clientX:100,clientY:100});for(let t=200;t<=1200;t+=100)ladleTick(t);
assert.equal(ladleVolume,800);assert.equal(ladleHand.fill,1);
ladleListeners.get('pointerup')({pointerId:2});assert.equal(ladleActive,true);
ladleListeners.get('pointerup')({pointerId:1});assert.equal(ladleVolume,1000);assert.equal(ladleSalt,150);assert.equal(ladleActive,false);assert.equal(ladleFrames.size,0);
startLadle();ladleListeners.get('pointermove')({pointerId:1,clientX:100,clientY:100});for(let t=100;t<=1000;t+=100)ladleTick(t);
ladleListeners.get('pointermove')({pointerId:1,clientX:500,clientY:500});for(let t=1100;t<=1500;t+=100)ladleTick(t);
assert.equal(ladleVolume,800);assert.ok(ladleHand.fill<1);ladleListeners.get('pointerup')({pointerId:1});assert.equal(ladleVolume,800);assert.equal(ladleSalt,120);
startLadle();ladleListeners.get('pointermove')({pointerId:1,clientX:100,clientY:100});ladleTick(100);ladleListeners.get('blur')();assert.equal(ladleVolume,800);assert.equal(ladleSalt,120);assert.equal(ladleActive,false);
console.log('Passed: actual ladle handlers fill, empty outside, return inside, ignore second pointer and restore carried water on blur.');
const lowStone=waterPhysics.displacedWaterLevel(3,'rectangle',fillDims,[{y:.9,radius:.5,volume:80}]);
const liftedStone=waterPhysics.displacedWaterLevel(3,'rectangle',fillDims,[{y:2,radius:.5,volume:80}]);
assert.ok(Math.abs(lowStone-liftedStone)<1e-7); // depth of an immersed object cannot change displaced volume
assert.ok(waterPhysics.displacedWaterLevel(3,'rectangle',fillDims,[{y:6,radius:.5,volume:80}])<lowStone);
assert.ok(waterPhysics.maximumAddedWater(80,'rectangle',fillDims)>0);
assert.ok(salt.brineDensity(150,1000)>salt.brineDensity(150,1500));
let slow={y:3,vy:0},fine={y:3,vy:0};
for(let i=0;i<10;i++)slow=waterPhysics.advanceSinking(slow.y,slow.vy,.1,2.6,1);
for(let i=0;i<100;i++)fine=waterPhysics.advanceSinking(fine.y,fine.vy,.01,2.6,1);
assert.ok(Math.abs(slow.y-fine.y)<1e-8);
assert.ok(slow.y>1); // stone takes observable time to descend, not a teleport to the bed
function descentTime(start){let state={y:start,vy:0},time=0;while(state.y>.9&&time<20){state=waterPhysics.advanceSinking(state.y,state.vy,1/60,2.6,1);time+=1/60;}return time;}
assert.ok(descentTime(4)>descentTime(2)+1);
for(const clip of ['impactMining','impactGlass_light','impactPlate_light','impactSoft_medium'])for(let i=0;i<3;i++) {
  const data=fs.readFileSync(`public/audio/impacts/${clip}_${String(i).padStart(3,'0')}.ogg`);
  assert.equal(data.toString('ascii',0,4),'OggS');
}
console.log('Passed: conserved water volume, held-object displacement, dilution, frame-independent sinking and foley assets.');
const impulse = {x:0,z:0,time:1,strength:3};
assert.notEqual(waterMotion.waterDisplacement(.4,0,1.2,[impulse]),waterMotion.waterDisplacement(.4,0,1.2,[]));
assert.equal(waterMotion.waterDisplacement(.4,0,4,[impulse]),waterMotion.waterDisplacement(.4,0,4,[]));
for(const shape of ['rectangle','square','cylinder','triangle']) {
  assert.equal(waterMotion.waterEdgeFade(0,0,shape,8,4),1);
  assert.equal(waterMotion.waterEdgeFade(20,20,shape,8,4),0);
}
for(let t=0;t<4;t+=.1) assert.ok(Math.abs(waterMotion.waterDisplacement(.4,0,t,Array(24).fill(impulse)))<=.12);
assert.equal(waterMotion.waterEdgeFade(4,0,'rectangle',8,4),0);
assert.equal(waterMotion.waterEdgeFade(4,0,'cylinder',8,4),0);
assert.equal(waterMotion.waterEdgeFade(0,-2,'triangle',8,4),0);
console.log('Passed: bounded travelling water waves, natural decay and all tank boundaries.');
assert.equal(impact.damageFromImpact('item-egg',1),undefined);
assert.equal(impact.damageFromImpact('item-egg',3),'cracked');
assert.equal(impact.damageFromImpact('item-egg',6),'broken');
assert.equal(impact.damageFromImpact('item-apple',6),'bruised');
assert.equal(impact.damageFromImpact('item-pebble',12),undefined);
assert.equal(impact.damageFromImpact('item-egg',0,'broken'),'broken');
assert.deepEqual(JSON.parse(JSON.stringify(impact.gestureVelocity(20,10,0.3))),{vx:0,vy:0});
assert.deepEqual(JSON.parse(JSON.stringify(impact.gestureVelocity(5,5,0.1))),{vx:0,vy:0});
assert.ok(impact.gestureVelocity(100,-100,0.1).vy<0);
for (const shape of ['rectangle','square','cylinder','triangle']) {
  const normal = geometry.getTankDimensions(shape,'normal');
  const small = geometry.getTankDimensions(shape,'compact');
  assert.ok(Math.abs(salt.waterVolumeMl(shape,normal)/salt.waterVolumeMl(shape,small)-8)<1e-9);
  const fresh = salt.brineDensity(0,salt.waterVolumeMl(shape,normal));
  assert.equal(fresh,1);
  assert.ok(salt.brineDensity(25,salt.waterVolumeMl(shape,small))>salt.brineDensity(25,salt.waterVolumeMl(shape,normal)));
}
assert.ok(Math.abs(salt.waterVolumeMl('rectangle',geometry.getTankDimensions('rectangle','normal'))-1000)<1e-9);
assert.ok(salt.brineDensity(150,1000)>1.1); // full spoons can lift the reference egg
assert.ok(salt.brineDensity(75,1000)<1.1); // three HALF spoons do not silently behave as full
assert.ok(salt.brineDensity(10000,125)<=1.252); // solubility cap
for(let i=1;i<100;i++) {
  const ratio=i/100;
  const center=buoyancy.floatingCenterY(.4,2.5,ratio);
  assert.ok(Math.abs(buoyancy.submergedFraction(center,.4,2.5)-ratio)<1e-6);
}
assert.equal(buoyancy.submergedFraction(0,1,0),.5);
assert.equal(buoyancy.submergedFraction(3,1,0),0);
assert.equal(buoyancy.submergedFraction(-3,1,0),1);
const THREE = require('three');
const models=source('src/components/preschool/sink-float/itemModels.ts');
const stoneModel=models.createItemModel('item-pebble',1);
const stoneSize=new (require('three').Box3)().setFromObject(stoneModel).getSize(new (require('three').Vector3)());
assert.ok(stoneSize.y>.75 && stoneSize.y/stoneSize.x>.7);
models.disposeItemModel(stoneModel);
for(const id of ['pebble','keys','spoon','egg','apple','wood','duck','pingpong','leaf','foam']) {
  const model=models.createItemModel(`item-${id}`,.8);
  const box=new THREE.Box3().setFromObject(model);
  const size=box.getSize(new THREE.Vector3());
  assert.ok(size.x>0 && size.y>0 && size.z>0);
  model.traverse(child=>{if(child.geometry) assert.notEqual(child.geometry.type,'PlaneGeometry');});
  models.disposeItemModel(model);
}
const clips=source('src/utils/preschoolNarration.ts');
for (const [message,expected] of [['Muối đã tan. Con thấy gì?','dissolved'],['Hũ muối đã mở.','saltopen'],['Con đang xoay bể.','orbit'],['Vật rơi ngoài bể rồi.','miss']]) {
  assert.equal(clips.narrationClipFor(message),`/audio/vi/${expected}.mp3`);
}
const transcripts=JSON.parse(fs.readFileSync('public/audio/vi/transcripts.json','utf8'));
for(const name of Object.keys(transcripts)) assert.ok(fs.statSync(`public/audio/vi/${name}.mp3`).size>1000);
let played=0, paused=0;
class AudioMock {
  constructor(url){this.src=url;}
  play(){played++;return Promise.resolve();}
  pause(){paused++;}
}
const voices=[];
const browserWindow={speechSynthesis:{getVoices:()=>voices,cancel:()=>{},speak:()=>{throw Error('No non-Vietnamese voice allowed');},onvoiceschanged:null}};
const speech=source('src/utils/speechUtils.ts',{window:browserWindow,localStorage:{getItem:()=>null,setItem:()=>{}},Audio:AudioMock}).speechEngine;
assert.equal(speech.hasVietnameseVoice(),false);
assert.equal(speech.speak('Con hãy quan sát.'),true);
assert.equal(played,1);
speech.setVoiceEnabled(false);
assert.equal(paused,1);
assert.equal(speech.speak('Con hãy quan sát.'),false);
console.log('Passed: volume/salinity, displaced-volume equilibrium, solid 3D models, local Vietnamese audio, mute/cancel.');

// Real-time trajectories accelerate consistently at different frame rates.
const motion = source('src/components/preschool/sink-float/playPhysics.ts');
const expectedFall = 4 - .5 * motion.DISPLAY_GRAVITY * .4 ** 2;
for (const fps of [30, 60, 120]) {
  let state = {y:4,vy:0};
  for(let n=0;n<fps*.4;n++) state=motion.advanceAirFall(state.y,state.vy,1/fps);
  assert.ok(Math.abs(state.y-expectedFall)<1e-9);
}
assert.ok(motion.advanceAirFall(4,0,.2).vy < motion.advanceAirFall(4,0,.1).vy);
assert.ok(motion.impactVolume(0)>=.4);
assert.ok(motion.impactVolume(8)<=1);
assert.ok(motion.impactVolume(6)>motion.impactVolume(1));
assert.equal(impact.damageFromImpact('item-egg#2',6),'broken');
const inventory=source('src/components/preschool/sink-float/basketInventory.ts');
const presets=['egg','pebble','apple','duck'].map(kind=>({id:`item-${kind}`,inTank:false,status:'basket',weightGrams:10,volumeMl:20}));
const used=presets.map(item=>({...item,inTank:true,status:'falling'}));
assert.equal(inventory.replenishBasket(presets,presets,1),presets);
const replenished=inventory.replenishBasket(used,presets,1);
assert.equal(replenished.length,8);
assert.equal(inventory.basketSlots(replenished,presets).filter(item=>!item.inTank).length,4);
assert.equal(new Set(replenished.map(item=>item.id)).size,8);
assert.equal(replenished[0],used[0]); // no disappearance of the experiment already in water
assert.equal(inventory.replenishBasket(replenished,presets,2),replenished);
const cloned=models.createItemModel('item-egg#2',1.05);
cloned.traverse(child=>{if(child.isMesh)assert.equal(child.userData.itemId,'item-egg#2');});
assert.equal(cloned.children.length,1);
models.disposeItemModel(cloned);
// Impact audio really creates audible gain/output nodes for both surfaces and damage kinds.
let audioStarts=0, audioOutputs=0;
const parameter={setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}};
const audioNode=()=>({gain:parameter,frequency:parameter,Q:parameter,connect(){audioOutputs++;},disconnect(){},start(){audioStarts++;},stop(){}});
class ContextMock {
 constructor(){this.state='running';this.currentTime=0;this.sampleRate=48000;this.destination={};}
 createGain(){return audioNode();} createOscillator(){return audioNode();}
 createBufferSource(){return audioNode();} createBiquadFilter(){return audioNode();}
 createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};}
}
const impactSounds=source('src/components/preschool/sink-float/impactAudio.ts',{window:{AudioContext:ContextMock,setTimeout:()=>0}});
for(const kind of ['water','tile','egg','apple','glass']) impactSounds.playImpact(kind,5);
assert.ok(audioStarts>=10 && audioOutputs>=20);
let waterClock=1000;
const waterSounds=source('src/components/preschool/sink-float/impactAudio.ts',{performance:{now:()=>waterClock},window:{AudioContext:ContextMock,setTimeout:()=>0}});
const beforeWater=audioStarts;
waterSounds.playWaterSwish(1);
waterSounds.playWaterSwish(3);
assert.equal(audioStarts,beforeWater+1);
waterClock+=200;
waterSounds.playWaterSwish(2);
assert.equal(audioStarts,beforeWater+2);
console.log('Passed: water swish produces audio and throttles repeated pointer events.');
console.log('Passed: frame-rate independent gravity, audible impact graphs, unique repeated basket supplies and cloned object identities.');

let nativePlayed=0,nativeAppended=0;
class ImpactMediaMock {
 constructor(src){this.src=src;this.dataset={};}
 setAttribute(){} remove(){} play(){nativePlayed++;return Promise.resolve();}
}
const nativeImpact=source('src/components/preschool/sink-float/impactAudio.ts',{Audio:ImpactMediaMock,document:{body:{append(audio){nativeAppended++;assert.ok(audio.volume>=.34);assert.ok(audio.src.includes('/audio/impacts/'));}}},window:{AudioContext:ContextMock,setTimeout:()=>0}});
for(const kind of ['water','tile','egg','apple','glass']) {
 nativeImpact.playImpact(kind,0);
 const data=fs.readFileSync(`public/audio/impacts/${kind}.wav`);
 assert.equal(data.toString('ascii',0,4),'RIFF');
 assert.ok(data.length>20000);
}
assert.equal(nativePlayed,5);assert.equal(nativeAppended,5);
for(let i=0;i<10;i++) assert.ok(fs.statSync(`public/audio/vi/intro-${i}.mp3`).size>1000);
console.log('Passed: independent native impact playback, packaged WAV clips and complete Vietnamese intro assets.');

const guide=source('src/components/preschool/sink-float/introGuide.ts');
assert.equal(guide.INTRO_GUIDE.length,10);
assert.equal(guide.INTRO_GUIDE.at(-1).action,'ready');
assert.equal(guide.introProgress(5,10),.5);assert.equal(guide.introProgress(5,NaN),0);assert.equal(guide.introProgress(NaN,10),0);
assert.equal(guide.introProgress(-2,10),0);assert.equal(guide.introProgress(12,10),1);
assert.ok(guide.introPose('pick',.5,fillDims,3).y>guide.introPose('pick',.8,fillDims,3).y);
assert.ok(guide.introPose('dip',.5,fillDims,3).y<guide.introPose('dip',.1,fillDims,3).y);
assert.ok(guide.introPose('pour',.8,fillDims,3).waterOffset>guide.introPose('pour',.1,fillDims,3).waterOffset);
assert.ok(guide.introPose('scoop',.6,fillDims,3).waterOffset<guide.introPose('scoop',.1,fillDims,3).waterOffset);
let introEffect,introAudio,introFinished=0,introCleanup=0,introCalls=[],blockIntroPlayback=false,introPlayAttempts=0;
let introFrameId=0;const introFrames=new Map();const introListeners=new Map();
class IntroAudioMock{constructor(src){this.src=src;this.currentTime=0;this.duration=10;this.readyState=4;this.paused=false;introAudio=this;}play(){introPlayAttempts++;this.paused=blockIntroPlayback;return blockIntroPlayback?Promise.reject(new Error('NotAllowedError')):Promise.resolve();}pause(){this.paused=true;}}
const introReact={...fakeReact,useState:value=>[value,()=>{}],useEffect:fn=>{introEffect=fn;}};
const introModule={exports:{}};
const introCode=ts.transpileModule(fs.readFileSync('src/components/preschool/sink-float/ChildIntro.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React}}).outputText;
vm.runInNewContext(introCode,{module:introModule,exports:introModule.exports,React:introReact,require:name=>name==='react'?introReact:name==='./introGuide'?guide:name==='./teacherExperience'?{introAudioSources:()=>({then:fn=>fn({sources:guide.INTRO_GUIDE.map(s=>`/audio/vi/${s.audio}.mp3`),release(){}})})}:{unlockImpactAudio(){}},window:{addEventListener:(name,fn)=>introListeners.set(name,fn),removeEventListener:name=>introListeners.delete(name)},Audio:IntroAudioMock,requestAnimationFrame:fn=>{introFrames.set(++introFrameId,fn);return introFrameId;},cancelAnimationFrame:id=>introFrames.delete(id)});
introModule.exports.ChildIntro({onComplete:()=>introFinished++,onCleanup:()=>introCleanup++,onFrame:(action,p)=>{introCalls.push({action,p});return null;}});
const disposeIntro=introEffect();
function introTick(time){const [id,fn]=introFrames.entries().next().value;introFrames.delete(id);fn(time);}
introAudio.currentTime=2;introTick(40);assert.equal(introCalls.at(-1).p,.2);
introAudio.paused=true;introAudio.currentTime=5;introTick(80);assert.equal(introCalls.length,1);
introAudio.paused=false;introAudio.readyState=2;introTick(120);assert.equal(introCalls.length,1);
introAudio.readyState=4;introTick(160);assert.equal(introCalls.at(-1).p,.5);
for(let i=0;i<guide.INTRO_GUIDE.length;i++){
  assert.ok(introAudio.src.endsWith(guide.INTRO_GUIDE[i].audio+'.mp3'));
  assert.equal(introFinished,0);introAudio.onended();
}
assert.equal(introFinished,1);assert.equal(introCleanup,1);
disposeIntro();assert.equal(introListeners.size,0);assert.equal(introFrames.size,0);assert.equal(introAudio.paused,true);assert.equal(introAudio.onended,null);
console.log('Passed: demo follows audio clock, freezes on pause/buffering, covers ten clips, unlocks only at end and cleans up on unmount.');

nativeImpact.setImpactEffectsVolume(.5);nativeImpact.playImpact('water',4);
assert.equal(nativePlayed,6);
nativeImpact.setImpactEffectsVolume(0);nativeImpact.playImpact('tile',8);assert.equal(nativePlayed,6);
const silentBefore=audioStarts;waterSounds.setImpactEffectsVolume(0);waterClock+=200;waterSounds.playWaterSwish(3);assert.equal(audioStarts,silentBefore);
nativeImpact.setImpactEffectsVolume(1);waterSounds.setImpactEffectsVolume(1);
const prefs=source('src/components/preschool/sink-float/teacherExperience.ts',{localStorage:{getItem:()=>'{"introEnabled":false,"effectsVolume":25}',setItem(){}}});
assert.equal(prefs.readExperience().introEnabled,false);assert.equal(prefs.readExperience().effectsVolume,25);
assert.equal(prefs.normalizeExperience(null).introEnabled,true);assert.equal(prefs.normalizeExperience(null).effectsVolume,100);
assert.equal(prefs.normalizeExperience({effectsVolume:120}).effectsVolume,100);assert.equal(prefs.normalizeExperience({effectsVolume:-4}).effectsVolume,0);
assert.ok(prefs.defaultIntroText('intro-0').startsWith('Chào'));
console.log('Passed: teacher defaults, persistent disabled intro, bounded effect volume, and muted native/water playback.');

(async()=>{
  blockIntroPlayback=true;introModule.exports.ChildIntro({onComplete:()=>introFinished++,onCleanup:()=>introCleanup++,onFrame:()=>null});const stopBlockedIntro=introEffect();
  await Promise.resolve();assert.equal(introAudio.paused,true);assert.equal(introFinished,1);const triesBefore=introPlayAttempts;
  blockIntroPlayback=false;introListeners.get('pointerdown')();await Promise.resolve();assert.equal(introAudio.paused,false);assert.equal(introPlayAttempts,triesBefore+1);
  introListeners.get('pointerdown')();assert.equal(introPlayAttempts,triesBefore+1);stopBlockedIntro();assert.equal(introListeners.size,0);
  console.log('Passed: blocked autoplay resumes from natural screen contact without a play button, duplicate playback or premature unlock.');
  let record={},revoked=0,urlCount=0;
  const db={createObjectStore(){},close(){},transaction(){const tx={objectStore:()=>({get(){const req={result:record};setImmediate(()=>req.onsuccess?.());return req;},put(value){record=value;setImmediate(()=>tx.oncomplete?.());}})};return tx;}};
  const indexedDB={open(){const req={result:db};setImmediate(()=>req.onsuccess?.());return req;}};
  const storage=source('src/components/preschool/sink-float/teacherExperience.ts',{indexedDB,Blob,URL:{createObjectURL:()=>`blob:teacher-${++urlCount}`,revokeObjectURL:()=>revoked++}});
  const blob=new Blob([Buffer.alloc(2000)],{type:'audio/mpeg'});
  await storage.writeNarration({'intro-0':{text:'Lời dẫn thử',audio:blob}});
  assert.equal((await storage.readNarration())['intro-0'].text,'Lời dẫn thử');
  let sources=await storage.introAudioSources();assert.equal(sources.sources.length,10);assert.ok(sources.sources[0].startsWith('blob:'));sources.release();assert.equal(revoked,1);
  await storage.writeNarration({});sources=await storage.introAudioSources();assert.equal(sources.sources[0],'/audio/vi/intro-0.mp3');
  const api=await import(require('node:url').pathToFileURL(path.resolve('api/narration.js')));
  const sentence='Con cầm vật và thả vào nước. '.repeat(10);
  assert.ok(api.splitNarration(sentence).length>1);assert.ok(api.splitNarration(sentence).every(s=>s.length<=180));
  const fetchOriginal=global.fetch;let requests=0;
  global.fetch=async url=>{requests++;assert.equal(new URL(url).hostname,'translate.google.com');assert.equal(new URL(url).searchParams.get('tl'),'vi');return {ok:true,headers:{get:()=> 'audio/mpeg'},arrayBuffer:async()=>Buffer.alloc(2000).buffer};};
  try{
    const res={headers:{},setHeader(key,value){this.headers[key]=value;},end(value){this.body=value;}};
    await api.default({method:'POST',body:{text:sentence}},res);assert.equal(res.statusCode,200);assert.ok(Buffer.isBuffer(res.body));assert.equal(res.headers['Cache-Control'],'no-store');
    const before=requests;await api.default({method:'POST',body:{text:'x'.repeat(601)}},res);assert.equal(res.statusCode,400);assert.equal(requests,before);
    await api.default({method:'GET'},res);assert.equal(res.statusCode,405);
  }finally{global.fetch=fetchOriginal;}
  console.log('Passed: custom MP3 storage, source selection and cleanup, script reset, Vietnamese generation chunks and endpoint validation.');
})().catch(error=>{console.error(error);process.exitCode=1;});

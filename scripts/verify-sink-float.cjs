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
  const requireSource = name => name.startsWith('.') ? source(path.join(path.dirname(filename),`${name}.ts`),context) : require(name);
  vm.runInNewContext(output,{module,exports:module.exports,require:requireSource,...context},{filename});
  if (!Object.keys(context).length) cache.set(filename,module.exports);
  return module.exports;
}
const geometry = source('src/components/preschool/sink-float/tankGeometry.ts');
const salt = source('src/components/preschool/sink-float/salinity.ts');
const buoyancy = source('src/components/preschool/sink-float/buoyancy.ts');
const impact = source('src/components/preschool/sink-float/impactPhysics.ts');
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
console.log('Passed: frame-rate independent gravity, audible impact graphs, unique repeated basket supplies and cloned object identities.');

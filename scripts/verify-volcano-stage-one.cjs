const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(name,dependencies={}){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(`src/components/preschool/volcano/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:mod,exports:mod.exports,require:id=>dependencies[id]});return mod.exports;}
const reaction=load('reaction'),clay=load('clayModel'),{createStageOne,pickTool,scoop,transfer,advanceStageOne,returnTool,addColorDrop}=load('stageOneModel',{'./reaction':reaction,'./clayModel':clay});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const s=createStageOne();assert.equal(s.reaction.soap,0);assert.equal(s.reaction.liquidMl,0);assert.equal(s.reaction.sodaGrams,0);
pickTool(s,'spoon');s.target='bowl';scoop(s,.3);near(s.spoonGrams,0.42);near(s.sodaStockGrams+s.spoonGrams,24);returnTool(s);near(s.spoonGrams,0.42);
pickTool(s,'spoon');s.target='crater';advanceStageOne(s,1);near(s.transferredSoda,0);s.pouring=true;s.tilt=1;transfer(s,.1);near(s.transferredSoda,.18);s.pouring=false;advanceStageOne(s,1);near(s.transferredSoda,.18);near(s.sodaStockGrams+s.spoonGrams+s.transferredSoda,24);
pickTool(s,'vinegar');s.target='crater';s.pouring=true;s.tilt=1;advanceStageOne(s,.25);near(s.vinegarMl+s.transferredVinegar,60);assert.ok(s.reaction.gasMl>0);s.pouring=false;const gas=s.reaction.gasMl,amount=s.vinegarMl;advanceStageOne(s,.5);near(s.vinegarMl,amount);assert.ok(s.reaction.gasMl>gas,'Chemistry continues after pouring stops');
const spill=createStageOne();pickTool(spill,'vinegar');spill.target='tray';spill.pouring=true;spill.tilt=1;transfer(spill,100);near(spill.vinegarMl,0);near(spill.spilledVinegar,60);near(spill.reaction.liquidMl,0);near(spill.reaction.gasMl,0);
const full=createStageOne();full.reaction.liquidMl=120;pickTool(full,'vinegar');full.target='crater';full.pouring=true;full.tilt=1;transfer(full,1);near(full.vinegarMl,60);
for(const dt of [NaN,Infinity,-1,0]){const invalid=createStageOne();pickTool(invalid,'spoon');invalid.target='bowl';scoop(invalid,dt);transfer(invalid,dt);advanceStageOne(invalid,dt);near(invalid.spoonGrams,0);}
console.log('Stage 1: finite stocks, partial scoop/pour, pause, retained tool contents, continued chemistry, spills, capacity and invalid input passed.');
const clear=createStageOne(),colored=createStageOne();
for(const state of [clear,colored]){reaction.addIngredient(state.reaction,'bakingSoda',1);reaction.addIngredient(state.reaction,'vinegar',3);}
pickTool(colored,'color');colored.target='crater';for(let i=0;i<15;i++)addColorDrop(colored);
assert.equal(colored.colorDrops,12);assert.equal(colored.colorStock,0);
for(let i=0;i<400;i++){advanceStageOne(clear,.05);advanceStageOne(colored,.05);}
near(clear.reaction.gasMl,colored.reaction.gasMl);assert.ok(colored.colorMix>.99);
assert.ok(colored.runoffMl>0&&colored.runoffMl<=colored.reaction.liquidMl,'Runoff is finite and bounded by liquid added');
const shell=clay.createClay(),before=clay.traceClayFlow(shell,.9);
for(let y=2.3;y>.2;y-=.09)for(let i=0;i<4;i++)clay.sculptClay(shell,y,1.03,'channel');
const after=clay.traceClayFlow(shell,.9);
assert.ok(after.some((p,i)=>Math.abs(p.angle-before[i].angle)>.02),'A nearby connected groove changes the computed flow path');
for(let col=0;col<96;col++)for(let row=0;row<32;row++)assert.ok(clay.clayRadius(shell,.13+row/32*2.3,col/96*Math.PI*2)>=clay.clayRadius(shell,.13+(row+1)/32*2.3,col/96*Math.PI*2)-.001,'Clay remains a descending, unfolded shell');
console.log('Color does not change CO2; bounded drops/runoff and terrain-dependent flow passed.');

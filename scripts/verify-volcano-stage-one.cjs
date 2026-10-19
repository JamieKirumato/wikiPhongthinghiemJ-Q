const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(name,dependencies={}){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(`src/components/preschool/volcano/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:mod,exports:mod.exports,require:id=>dependencies[id]});return mod.exports;}
const reaction=load('reaction'),{createStageOne,pickTool,scoop,transfer,advanceStageOne,returnTool}=load('stageOneModel',{'./reaction':reaction});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const s=createStageOne();assert.equal(s.reaction.soap,0);assert.equal(s.reaction.liquidMl,0);assert.equal(s.reaction.sodaGrams,0);
pickTool(s,'spoon');s.target='bowl';scoop(s,.3);near(s.spoonGrams,0.42);near(s.sodaStockGrams+s.spoonGrams,24);returnTool(s);near(s.spoonGrams,0.42);
pickTool(s,'spoon');s.target='crater';advanceStageOne(s,1);near(s.transferredSoda,0);s.pouring=true;s.tilt=1;transfer(s,.1);near(s.transferredSoda,.18);s.pouring=false;advanceStageOne(s,1);near(s.transferredSoda,.18);near(s.sodaStockGrams+s.spoonGrams+s.transferredSoda,24);
pickTool(s,'vinegar');s.target='crater';s.pouring=true;s.tilt=1;advanceStageOne(s,.25);near(s.vinegarMl+s.transferredVinegar,60);assert.ok(s.reaction.gasMl>0);s.pouring=false;const gas=s.reaction.gasMl,amount=s.vinegarMl;advanceStageOne(s,.5);near(s.vinegarMl,amount);assert.ok(s.reaction.gasMl>gas,'Chemistry continues after pouring stops');
const spill=createStageOne();pickTool(spill,'vinegar');spill.target='tray';spill.pouring=true;spill.tilt=1;transfer(spill,100);near(spill.vinegarMl,0);near(spill.spilledVinegar,60);near(spill.reaction.liquidMl,0);near(spill.reaction.gasMl,0);
const full=createStageOne();full.reaction.liquidMl=120;pickTool(full,'vinegar');full.target='crater';full.pouring=true;full.tilt=1;transfer(full,1);near(full.vinegarMl,60);
for(const dt of [NaN,Infinity,-1,0]){const invalid=createStageOne();pickTool(invalid,'spoon');invalid.target='bowl';scoop(invalid,dt);transfer(invalid,dt);advanceStageOne(invalid,dt);near(invalid.spoonGrams,0);}
console.log('Stage 1: finite stocks, partial scoop/pour, pause, retained tool contents, continued chemistry, spills, capacity and invalid input passed.');

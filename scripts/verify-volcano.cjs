const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/preschool/volcano/reaction.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:mod,exports:mod.exports});
const {createReaction,addIngredient,advanceReaction,CO2_ML_PER_MOLE,ACETIC_ACID_MOLAR_MASS,MAX_LIQUID_ML}=mod.exports;
const run=(s,seconds=30)=>{for(let i=0;i<seconds*60;i++)advanceReaction(s,1/60);return s;};
for(const ingredients of [['water'],['bakingSoda','water'],['vinegar','water'],['soap','color','water']]){const s=createReaction();ingredients.forEach(i=>addIngredient(s,i));run(s);assert.equal(s.gasMl,0);assert.equal(s.foam,0);}
for(const order of [['bakingSoda','vinegar'],['vinegar','bakingSoda']]){const s=createReaction();order.forEach(i=>addIngredient(s,i));run(s);assert.ok(Math.abs(s.gasMl-CO2_ML_PER_MOLE/ACETIC_ACID_MOLAR_MASS)<.01);assert.ok(s.sodaGrams>2.5&&s.sodaGrams<2.7);assert.equal(s.acidMoles,0);assert.ok(s.reacted);const gas=s.gasMl;run(s,60);assert.equal(s.gasMl,gas);assert.equal(s.foam,0);addIngredient(s,'vinegar');run(s);assert.ok(s.gasMl>gas);}
const plain=createReaction(),soapy=createReaction();addIngredient(soapy,'soap');for(const s of [plain,soapy]){addIngredient(s,'bakingSoda');addIngredient(s,'vinegar');run(s,15);}assert.ok(Math.abs(plain.gasMl-soapy.gasMl)<.01);assert.ok(soapy.peakFoam>plain.peakFoam);assert.ok(soapy.foam>plain.foam);
const limited=createReaction();addIngredient(limited,'bakingSoda',.1);addIngredient(limited,'vinegar',3);run(limited);assert.equal(limited.sodaGrams,0);assert.ok(limited.acidMoles>0);assert.ok(limited.gasMl<120);
const full=createReaction();for(let i=0;i<20;i++)addIngredient(full,'vinegar');assert.equal(full.liquidMl,MAX_LIQUID_ML);const prior=full.acidMoles;addIngredient(full,'vinegar');addIngredient(full,'soap');assert.equal(full.acidMoles,prior);assert.equal(full.soap,0);
const invalid=createReaction();for(const value of [NaN,Infinity,-1,0]){addIngredient(invalid,'vinegar',value);advanceReaction(invalid,value);}assert.equal(invalid.additions,0);assert.equal(invalid.elapsed,0);
console.log('Volcano: water controls, both addition orders, limiting reagents, gas conservation, soap retention, decay and capacity passed.');

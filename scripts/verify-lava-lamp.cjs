const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleOutput = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('src/components/preschool/lava-lamp/lavaPhysics.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(code, { module: moduleOutput, exports: moduleOutput.exports });
const { PHYSICS: p, createLamp, addTablet, advanceLamp, forces, dropRadius } = moduleOutput.exports;
const still = createLamp();
advanceLamp(still, 10);
assert.equal(still.gasProduced, 0);
assert.equal(still.drops.length, 0);
const testDrop = { id: 1, x: 0, y: 0.15, vy: 0, waterVolume: 0.0000004, gasVolume: 0, gasReference: 0, released: true };
assert.ok(forces(testDrop).net < 0, 'Unassisted water must sink in oil.');
assert.ok(forces({ ...testDrop, gasVolume: 0.00000012, gasReference: 0.00000012 }).net > 0, 'Sufficient attached gas must reverse buoyancy.');
assert.ok(forces({ ...testDrop, vy: 0.04 }).drag < 0);
assert.ok(forces({ ...testDrop, vy: -0.04 }).drag > 0);
const lamp = createLamp(17);
addTablet(lamp, 0.25);
advanceLamp(lamp, 0.1);
assert.equal(lamp.gasProduced, 0, 'No reaction while the tablet is still in oil.');
assert.ok(lamp.tablets[0].y < p.oilTop + 0.009, 'Tablet visibly sinks.');
let rose = false, fell = false, previousGas = 0;
for (let frame = 0; frame < 240 * 60; frame++) {
  advanceLamp(lamp, 1 / 60);
  const water = lamp.waterPool + lamp.drops.reduce((sum, drop) => sum + drop.waterVolume, 0);
  assert.ok(Math.abs(water - p.totalWater) < 1e-12, 'Water volume is conserved.');
  const gas = lamp.gasEscaped + lamp.gasBudget + lamp.drops.reduce((sum, drop) => sum + drop.gasReference, 0) + lamp.bubbles.reduce((sum, bubble) => sum + bubble.gasReference, 0);
  assert.ok(Math.abs(gas - lamp.gasProduced) < 1e-12, 'Gas is accounted for at ambient equivalent volume.');
  assert.ok(lamp.gasProduced >= previousGas);
  previousGas = lamp.gasProduced;
  for (const drop of lamp.drops) {
    assert.ok(Number.isFinite(drop.y) && Number.isFinite(drop.vy));
    assert.ok(Math.abs(drop.x) + dropRadius(drop) <= p.width / 2 + 1e-10);
    assert.ok(drop.y + dropRadius(drop) <= p.oilTop + 1e-10);
    if (drop.vy > 0.001) rose = true;
    if (drop.released && drop.vy < -0.001) fell = true;
  }
}
assert.ok(rose && fell && lamp.cycles > 0, 'Real upward and downward phases must complete.');
assert.equal(lamp.tablets.length, 0);
assert.equal(lamp.drops.length, 0);
assert.equal(lamp.bubbles.length, 0);
assert.ok(Math.abs(lamp.waterPool - p.totalWater) < 1e-12);
const finalGas = lamp.gasProduced;
advanceLamp(lamp, 0.25);
assert.equal(lamp.gasProduced, finalGas, 'Exhausted tablet must stop producing gas.');
function snapshot(fps) {
  const state = createLamp(17); addTablet(state, 0.25);
  for (let i = 0; i < fps * 12; i++) advanceLamp(state, 1 / fps);
  return JSON.stringify({ time: state.time, drops: state.drops, tablets: state.tablets, cycles: state.cycles, gas: state.gasProduced, water: state.waterPool });
}
assert.equal(snapshot(30), snapshot(60));
assert.equal(snapshot(60), snapshot(120));
const small = createLamp(17), large = createLamp(17);
addTablet(small, 0.25); addTablet(large, 0.5);
for (let i = 0; i < 240 * 30; i++) { advanceLamp(small, 1 / 30); advanceLamp(large, 1 / 30); }
assert.ok(Math.abs(large.gasProduced / small.gasProduced - 2) < 1e-9);
console.log('PASS: tablet sinks before reacting; buoyancy and drag directions; rise/vent/sink; water and gas conservation; finite reaction/rest; deterministic 30/60/120 fps; larger dose doubles gas yield.');

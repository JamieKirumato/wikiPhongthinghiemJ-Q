/** Reduced-order oil/water/CO2 model. SI units; not a calibrated CFD solver. */
export const PHYSICS = {
  rhoWater: 1000, rhoOil: 920, rhoGas: 1.84, gravity: 9.81,
  viscosity: 0.055, width: 0.09, waterTop: 0.08, oilTop: 0.30,
  totalWater: Math.PI * 0.045 ** 2 * 0.08, fixedDt: 1 / 120,
};
export type Drop = { id: number; x: number; y: number; vy: number; waterVolume: number; gasVolume: number; gasReference: number; released: boolean };
type Bubble = { id: number; x: number; y: number; radius: number; gasReference: number };
type Tablet = { id: number; x: number; y: number; remaining: number; initial: number; vy: number };
export type LampState = {
  time: number; waterPool: number; drops: Drop[]; bubbles: Bubble[]; tablets: Tablet[];
  gasProduced: number; gasEscaped: number; cycles: number;
  accumulator: number; random: number; nextId: number; gasBudget: number;
};
const atmosphericPressure = 101325;
// Yield and dissolution are illustrative; tablet chemistry/brand are not calibrated.
const gasYield = 0.00012; // m3 at ambient pressure per nominal gram of tablet.
const dissolution = 0.055;
const sphereRadius = (volume: number) => Math.cbrt(3 * volume / (4 * Math.PI));
export const dropRadius = (drop: Drop) => sphereRadius(drop.waterVolume);
function pressure(y: number) {
  return atmosphericPressure + PHYSICS.gravity * (PHYSICS.rhoOil * Math.max(0, PHYSICS.oilTop - Math.max(y, PHYSICS.waterTop)) + PHYSICS.rhoWater * Math.max(0, PHYSICS.waterTop - y));
}
function random(state: LampState) {
  state.random = (Math.imul(state.random, 1664525) + 1013904223) >>> 0;
  return state.random / 4294967296;
}
export function createLamp(seed = 17): LampState {
  return { time: 0, waterPool: PHYSICS.totalWater, drops: [], bubbles: [], tablets: [],
    gasProduced: 0, gasEscaped: 0, cycles: 0, accumulator: 0, random: seed >>> 0, nextId: 1, gasBudget: 0 };
}
export function addTablet(state: LampState, amount: number) {
  if (!Number.isFinite(amount) || amount <= 0 || state.tablets.length >= 4) return;
  const initial = Math.min(amount, 0.5);
  state.tablets.push({ id: state.nextId++, x: (random(state) - 0.5) * PHYSICS.width * 0.5, y: PHYSICS.oilTop + 0.009, vy: 0, initial, remaining: initial });
}
export function forces(drop: Drop) {
  const volume = drop.waterVolume + drop.gasVolume;
  const radius = sphereRadius(volume);
  const buoyancy = PHYSICS.rhoOil * volume * PHYSICS.gravity;
  // Gas mass uses ambient-equivalent volume so expansion does not create gas mass.
  const weight = (PHYSICS.rhoWater * drop.waterVolume + PHYSICS.rhoGas * drop.gasReference) * PHYSICS.gravity;
  const drag = -6 * Math.PI * PHYSICS.viscosity * radius * drop.vy
    - 0.5 * PHYSICS.rhoOil * 0.47 * Math.PI * radius ** 2 * drop.vy * Math.abs(drop.vy);
  return { buoyancy, weight, drag, net: buoyancy - weight + drag };
}
function freeBubble(state: LampState, x: number, y: number, gasReference: number) {
  // Keep a finite visual count; unresolved bubbles are accounted for as escaping gas.
  if (state.bubbles.length >= 90) { state.gasEscaped += gasReference; return; }
  state.bubbles.push({ id: state.nextId++, x, y, gasReference, radius: sphereRadius(gasReference * atmosphericPressure / pressure(y)) });
}
function tick(state: LampState) {
  const dt = PHYSICS.fixedDt;
  state.time += dt;
  for (const tablet of state.tablets) {
    const bed = 0.005;
    if (tablet.y > bed) {
      // Heavy solid: gravity/buoyancy plus viscous settling approximation.
      const ambient = tablet.y > PHYSICS.waterTop ? PHYSICS.rhoOil : PHYSICS.rhoWater;
      const acceleration = PHYSICS.gravity * (1 - ambient / 1600) - tablet.vy / 0.06;
      tablet.vy += acceleration * dt;
      tablet.y = Math.max(bed, tablet.y - tablet.vy * dt);
    }
    if (tablet.y <= PHYSICS.waterTop) {
      const used = Math.min(tablet.remaining, tablet.remaining * (1 - Math.exp(-dissolution * dt)));
      tablet.remaining -= used;
      const gas = used * gasYield;
      state.gasProduced += gas; state.gasBudget += gas;
      if (tablet.remaining < tablet.initial * 0.001) {
        const rest = tablet.remaining * gasYield;
        state.gasProduced += rest; state.gasBudget += rest; tablet.remaining = 0;
      }
    }
  }
  state.tablets = state.tablets.filter(tablet => tablet.remaining > 0);
  // Bubble growth accumulates gas until a release event; every event consumes its budget.
  const packet = 0.00000012;
  while (state.gasBudget >= packet) {
    state.gasBudget -= packet;
    const x = (random(state) - 0.5) * PHYSICS.width * 0.68;
    if (state.drops.length < 22 && state.waterPool > 0.000001 && random(state) < 0.5) {
      const waterVolume = packet * (2.5 + random(state) * 2.0);
      state.waterPool -= waterVolume;
      const radius = sphereRadius(waterVolume);
      state.drops.push({ id: state.nextId++, x, y: PHYSICS.waterTop + radius, vy: 0, waterVolume,
        gasReference: packet, gasVolume: packet * atmosphericPressure / pressure(PHYSICS.waterTop), released: false });
    } else freeBubble(state, x, 0.008, packet);
  }
  // A final small gas remainder is also released, not an indefinite bubbling source.
  if (!state.tablets.length && state.gasBudget > 0) {
    freeBubble(state, 0, 0.008, state.gasBudget); state.gasBudget = 0;
  }
  for (const drop of state.drops) {
    const radius = dropRadius(drop);
    if (!drop.released) drop.gasVolume = drop.gasReference * atmosphericPressure / pressure(drop.y);
    const force = forces(drop);
    const mass = PHYSICS.rhoWater * drop.waterVolume + PHYSICS.rhoGas * drop.gasReference
      + 0.5 * PHYSICS.rhoOil * (drop.waterVolume + drop.gasVolume);
    drop.vy += force.net / mass * dt;
    drop.y += drop.vy * dt;
    drop.x = Math.max(-PHYSICS.width / 2 + radius, Math.min(PHYSICS.width / 2 - radius, drop.x));
    const gasRadius = sphereRadius(drop.gasVolume);
    if (!drop.released && drop.y + radius + 2 * gasRadius >= PHYSICS.oilTop) {
      // CO2 vents to the open air. The drop keeps upward inertia, then gravity reverses it.
      state.gasEscaped += drop.gasReference;
      drop.gasReference = 0; drop.gasVolume = 0; drop.released = true;
    }
    if (drop.y + radius > PHYSICS.oilTop) { drop.y = PHYSICS.oilTop - radius; drop.vy = Math.min(0, drop.vy); }
  }
  state.drops = state.drops.filter(drop => {
    if (drop.released && drop.y - dropRadius(drop) <= PHYSICS.waterTop) {
      state.waterPool += drop.waterVolume; state.cycles++; return false;
    }
    return true;
  });
  for (const bubble of state.bubbles) {
    bubble.radius = sphereRadius(bubble.gasReference * atmosphericPressure / pressure(bubble.y));
    bubble.y += (bubble.y < PHYSICS.waterTop ? 0.10 : 0.055) * dt;
  }
  state.bubbles = state.bubbles.filter(bubble => {
    if (bubble.y + bubble.radius >= PHYSICS.oilTop) { state.gasEscaped += bubble.gasReference; return false; }
    return true;
  });
}
export function advanceLamp(state: LampState, dt: number) {
  if (!Number.isFinite(dt) || dt <= 0) return;
  state.accumulator += Math.min(dt, 0.25);
  while (state.accumulator + 1e-12 >= PHYSICS.fixedDt) {
    tick(state); state.accumulator = Math.max(0, state.accumulator - PHYSICS.fixedDt);
  }
}

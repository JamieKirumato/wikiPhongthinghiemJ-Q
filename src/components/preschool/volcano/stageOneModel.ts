/**
 * Stage 1 Preschool Volcano Interactive Pouring & Scooping Model
 *
 * API Summary:
 * - `createStageOne()`: Initializes Stage 1 with an empty reaction, 0 g on the spoon,
 *   60 mL vinegar stock, 24 g baking soda stock, no held tool, and zeroed transfer/spill counters.
 * - `pickTool(state, tool)`: Selects `'spoon'`, `'vinegar'`, or `null` while preserving all reagent quantities.
 * - `scoop(state, dt)`: Gradually scoops baking soda from `'bowl'` onto `'spoon'` at 1.4 g/s (up to 4 g cap and available stock)
 *   when holding the spoon over the bowl and not pouring; updates `scoopProgress` as `spoonGrams / 4`.
 * - `transfer(state, dt)`: Pours held reagent into `'crater'` or `'tray'` when `pouring` is true and `tilt > 0.25`
 *   at a tilt-dependent rate (~1.8 g/s for soda, ~12 mL/s for vinegar), clamped to remaining tool supply and crater capacity.
 *   Only crater transfers invoke `addIngredient`; tray transfers accumulate as spills without reacting.
 * - `advanceStageOne(state, dt)`: Substeps `dt` (clamped to <= 0.1 s per substep), performs active transfers,
 *   and advances the chemical reaction at 0.65x real `dt`.
 * - `returnTool(state)`: Stops pouring and clears `held`, `target`, and `tilt` without losing reagent contents.
 */

import {
  MAX_LIQUID_ML,
  MAX_SODA_GRAMS,
  SODA_GRAMS_PER_DOSE,
  VINEGAR_ML_PER_DOSE,
  addIngredient,
  advanceReaction,
  createReaction,
} from './reaction';
import { createClay, ClaySurface, ClayTool } from './clayModel';

export type HeldTool = 'spoon' | 'vinegar' | 'color' | null;
export type ToolZone = 'bowl' | 'crater' | 'tray';

export interface StageOneState {
  reaction: ReturnType<typeof createReaction>;
  held: HeldTool;
  spoonGrams: number;
  vinegarMl: number;
  sodaStockGrams: number;
  transferredSoda: number;
  transferredVinegar: number;
  spilledSoda: number;
  spilledVinegar: number;
  scoopProgress: number;
  tilt: number;
  pouring: boolean;
  target: ToolZone | null;
  clay: ClaySurface;
  clayTool: ClayTool | null;
  colorDrops: number;
  colorStock: number;
  colorDropAge: number;
  colorMix: number;
  runoffMl: number;
}

export const INITIAL_VINEGAR_ML = 60;
export const INITIAL_SODA_STOCK_GRAMS = 24;
export const MAX_SPOON_GRAMS = 4;
export const SCOOP_RATE_GRAMS_PER_SEC = 1.4;
export const POUR_TILT_THRESHOLD = 0.25;
export const SODA_POUR_RATE_GRAMS_PER_SEC = 1.8;
export const VINEGAR_POUR_RATE_ML_PER_SEC = 12;
export const CHEMISTRY_TIME_SCALE = 0.65;
export const MAX_SUBSTEP_DT = 0.1;

function isValidDt(dt: number): boolean {
  return typeof dt === 'number' && Number.isFinite(dt) && dt > 0;
}

/**
 * Create the initial Stage 1 state with an empty reaction and full household stocks.
 */
export function createStageOne(): StageOneState {
  return {
    reaction: createReaction(),
    held: null,
    spoonGrams: 0,
    vinegarMl: INITIAL_VINEGAR_ML,
    sodaStockGrams: INITIAL_SODA_STOCK_GRAMS,
    transferredSoda: 0,
    transferredVinegar: 0,
    spilledSoda: 0,
    spilledVinegar: 0,
    scoopProgress: 0,
    tilt: 0,
    pouring: false,
    target: null,
    clay: createClay(),
    clayTool: null,
    colorDrops: 0,
    colorStock: 12,
    colorDropAge: 10,
    colorMix: 0,
    runoffMl: 0,
  };
}

/**
 * Pick or switch the currently held tool while retaining all reagent quantities on tools and in stocks.
 */
export function pickTool(state: StageOneState, tool: HeldTool): StageOneState {
  state.held = tool;
  state.pouring = false;
  state.tilt = 0;
  if (tool === null) {
    state.target = null;
  }
  state.scoopProgress = Math.min(1, Math.max(0, state.spoonGrams / MAX_SPOON_GRAMS));
  return state;
}

function scoopStep(state: StageOneState, stepDt: number): void {
  if (state.held !== 'spoon' || state.target !== 'bowl' || state.pouring) {
    return;
  }

  const roomOnSpoon = Math.max(0, MAX_SPOON_GRAMS - state.spoonGrams);
  const availableStock = Math.max(0, state.sodaStockGrams);
  const maxTransfer = SCOOP_RATE_GRAMS_PER_SEC * stepDt;
  const scooped = Math.min(roomOnSpoon, availableStock, maxTransfer);

  if (scooped > 0) {
    state.spoonGrams += scooped;
    state.sodaStockGrams -= scooped;
  }

  state.scoopProgress = Math.min(1, Math.max(0, state.spoonGrams / MAX_SPOON_GRAMS));
}

/**
 * Scoop baking soda from the bowl onto the held spoon at 1.4 g/s (up to 4 g on spoon and remaining stock).
 */
export function scoop(state: StageOneState, dt: number): StageOneState {
  if (!isValidDt(dt)) {
    return state;
  }

  let remaining = dt;
  while (remaining > 1e-9) {
    const stepDt = Math.min(remaining, MAX_SUBSTEP_DT);
    scoopStep(state, stepDt);
    remaining -= stepDt;
  }

  return state;
}

function transferStep(state: StageOneState, stepDt: number): void {
  if (
    state.held === null ||
    !state.pouring ||
    !Number.isFinite(state.tilt) ||
    state.tilt <= POUR_TILT_THRESHOLD ||
    (state.target !== 'crater' && state.target !== 'tray')
  ) {
    return;
  }

  const clampedTilt = Math.min(1, Math.max(POUR_TILT_THRESHOLD, state.tilt));
  // Monotonically increases with tilt above 0.25 up to full rate at tilt = 1.0
  const tiltFactor = clampedTilt;

  if (state.held === 'spoon') {
    const availableSoda = Math.max(0, state.spoonGrams);
    const requestedGrams = Math.min(
      availableSoda,
      SODA_POUR_RATE_GRAMS_PER_SEC * tiltFactor * stepDt,
    );

    if (requestedGrams <= 0) {
      return;
    }

    if (state.target === 'crater') {
      const craterRoom = Math.max(0, MAX_SODA_GRAMS - state.reaction.sodaGrams);
      const movedGrams = Math.min(requestedGrams, craterRoom);
      if (movedGrams > 0) {
        state.spoonGrams -= movedGrams;
        state.transferredSoda += movedGrams;
        addIngredient(
          state.reaction,
          'bakingSoda',
          movedGrams / SODA_GRAMS_PER_DOSE,
        );
      }
    } else {
      state.spoonGrams -= requestedGrams;
      state.spilledSoda += requestedGrams;
    }

    state.scoopProgress = Math.min(1, Math.max(0, state.spoonGrams / MAX_SPOON_GRAMS));
    return;
  }

  if (state.held === 'vinegar') {
    const availableVinegar = Math.max(0, state.vinegarMl);
    const requestedMl = Math.min(
      availableVinegar,
      VINEGAR_POUR_RATE_ML_PER_SEC * tiltFactor * stepDt,
    );

    if (requestedMl <= 0) {
      return;
    }

    if (state.target === 'crater') {
      const craterLiquidRoom = Math.max(0, MAX_LIQUID_ML - state.reaction.liquidMl);
      const movedMl = Math.min(requestedMl, craterLiquidRoom);
      if (movedMl > 0) {
        state.vinegarMl -= movedMl;
        state.transferredVinegar += movedMl;
        addIngredient(
          state.reaction,
          'vinegar',
          movedMl / VINEGAR_ML_PER_DOSE,
        );
      }
    } else {
      state.vinegarMl -= requestedMl;
      state.spilledVinegar += requestedMl;
    }
  }
}

/**
 * Transfer held baking soda or vinegar into the crater or onto the tray at a tilt-dependent rate.
 */
export function transfer(state: StageOneState, dt: number): StageOneState {
  if (!isValidDt(dt)) {
    return state;
  }

  let remaining = dt;
  while (remaining > 1e-9) {
    const stepDt = Math.min(remaining, MAX_SUBSTEP_DT);
    transferStep(state, stepDt);
    remaining -= stepDt;
  }

  return state;
}

/**
 * Advance Stage 1 by performing any active reagent transfer and then advancing chemistry at 0.65x real dt.
 */
export function advanceStageOne(state: StageOneState, dt: number): void {
  if (!isValidDt(dt)) {
    return;
  }

  let remaining = dt;
  while (remaining > 1e-9) {
    const stepDt = Math.min(remaining, MAX_SUBSTEP_DT);
    transferStep(state, stepDt);
    advanceReaction(state.reaction, stepDt * CHEMISTRY_TIME_SCALE);
    state.colorDropAge += stepDt;
    if (state.reaction.liquidMl > .05) state.colorMix += ((1 - Math.exp(-state.colorDrops * .65)) - state.colorMix) * (1 - Math.exp(-stepDt * 1.6));
    // Liquid is redistributed from cup to tray, never created by the animation.
    const top = cupWaterY(state) + Math.min(.6, state.reaction.foam * 3);
    const overflow = Math.max(0, Math.min(1, (top - 2.57) * 4));
    state.runoffMl += Math.min(Math.max(0, state.reaction.liquidMl - state.runoffMl), stepDt * overflow * 4);
    remaining -= stepDt;
  }
}

export function cupWaterY(state: StageOneState) {
  return 2.145 + Math.min(Math.max(0, state.reaction.liquidMl - state.runoffMl) / 100, 1) * .34;
}

/** One intentional drop per press; cosmetic, without changing CO2 or reagent amounts. */
export function addColorDrop(state: StageOneState) {
  if (state.held !== 'color' || state.target !== 'crater' || state.colorStock <= 0) return false;
  state.colorDrops++;
  state.colorStock--;
  state.colorDropAge = 0;
  addIngredient(state.reaction, 'color');
  return true;
}

/**
 * Return the active tool to rest: stops pouring and clears held tool, target zone, and tilt without losing contents.
 */
export function returnTool(state: StageOneState): StageOneState {
  state.pouring = false;
  state.held = null;
  state.target = null;
  state.tilt = 0;
  state.scoopProgress = Math.min(1, Math.max(0, state.spoonGrams / MAX_SPOON_GRAMS));
  return state;
}

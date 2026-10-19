/**
 * Approximate stoichiometric and foam-dynamics model for a household
 * baking soda + vinegar volcano experiment:
 *
 *   NaHCO3 (s/aq) + CH3COOH (aq) -> CH3COONa (aq) + H2O (l) + CO2 (g)
 *
 * Scientific model notes & approximations:
 * - 1:1 molar reaction between sodium bicarbonate (M ≈ 84.007 g/mol) and
 *   acetic acid (M ≈ 60.052 g/mol).
 * - 1 dose of baking soda = 4 g (≈ 0.0476 mol NaHCO3).
 * - 1 dose of household vinegar = 20 mL at 5% w/v acetic acid (≈ 1.0 g CH3COOH
 *   ≈ 0.01665 mol H+). Thus 1 dose of soda requires ~2.86 doses of vinegar for
 *   complete neutralization; whichever reagent runs out first is the limiting reagent.
 * - Released CO2 gas volume at ~25 °C, 1 atm is ~24,465 mL/mol.
 * - Dish soap (surfactant) lowers surface tension and stabilizes gas bubbles,
 *   increasing foam height/retention and slowing bubble drainage/decay without
 *   increasing the total stoichiometric CO2 produced.
 * - Water adds liquid volume (dilution/carrier) without generating CO2 on its own.
 * - Food coloring is purely cosmetic.
 */

export type Ingredient = 'bakingSoda' | 'vinegar' | 'water' | 'soap' | 'color';

export interface ReactionState {
  /** Unreacted sodium bicarbonate mass remaining (grams) */
  sodaGrams: number;
  /** Unreacted acetic acid remaining (moles) */
  acidMoles: number;
  /** Total liquid volume in the volcano crater/bottle (mL), bounded by capacity */
  liquidMl: number;
  /** Surfactant (dish soap) doses added; increases foam stability, not CO2 yield */
  soap: number;
  /** Whether food coloring has been added (cosmetic only) */
  color: boolean;
  /** Cumulative CO2 gas volume produced at room conditions (mL) */
  gasMl: number;
  /** Visual normalized foam height (0..1.5) */
  foam: number;
  /** Maximum foam height reached so far (0..1.5) */
  peakFoam: number;
  /** Total simulated reaction time elapsed (seconds) */
  elapsed: number;
  /** True once any acid-base reaction has occurred */
  reacted: boolean;
  /** Count of valid ingredient additions accepted */
  additions: number;
}

/** Molar mass of NaHCO3 (g/mol) */
export const SODA_MOLAR_MASS = 84.007;

/** Molar mass of CH3COOH (g/mol) */
export const ACETIC_ACID_MOLAR_MASS = 60.052;

/** Standard dose constants */
export const SODA_GRAMS_PER_DOSE = 4;
export const VINEGAR_ML_PER_DOSE = 20;
export const VINEGAR_ACID_MASS_FRACTION = 0.05; // 5% w/v acetic acid (~1 g per 20 mL)
export const WATER_ML_PER_DOSE = 20;
export const SOAP_ML_PER_DOSE = 2;

/** Molar volume of ideal gas at ~25 °C, 1 atm (mL/mol) */
export const CO2_ML_PER_MOLE = 24465;

/** Bounded crater/container liquid capacity (mL) to prevent unbounded additions */
export const MAX_LIQUID_ML = 120;
export const MAX_SODA_GRAMS = 24;
export const MAX_SOAP_DOSES = 5;
export const MAX_FOAM_HEIGHT = 1.5;

/** Create a fresh, unreacted volcano state. */
export function createReaction(): ReactionState {
  return {
    sodaGrams: 0,
    acidMoles: 0,
    liquidMl: 0,
    soap: 0,
    color: false,
    gasMl: 0,
    foam: 0,
    peakFoam: 0,
    elapsed: 0,
    reacted: false,
    additions: 0,
  };
}

/**
 * Add an ingredient dose to the mutable reaction state.
 * Order-independent: baking soda before vinegar or vinegar before baking soda both work.
 */
export function addIngredient(
  state: ReactionState,
  ingredient: Ingredient,
  dose = 1,
): ReactionState {
  if (!(dose > 0) || !Number.isFinite(dose)) {
    return state;
  }

  switch (ingredient) {
    case 'bakingSoda': {
      const remainingCap = Math.max(0, MAX_SODA_GRAMS - state.sodaGrams);
      const addedGrams = Math.min(remainingCap, SODA_GRAMS_PER_DOSE * dose);
      if (addedGrams <= 0) return state;
      state.sodaGrams += addedGrams;
      state.additions += 1;
      break;
    }

    case 'vinegar': {
      const remainingLiquid = Math.max(0, MAX_LIQUID_ML - state.liquidMl);
      const requestedMl = VINEGAR_ML_PER_DOSE * dose;
      const addedMl = Math.min(remainingLiquid, requestedMl);
      if (addedMl <= 0) return state;
      const effectiveDose = addedMl / VINEGAR_ML_PER_DOSE;
      const acidGrams =
        VINEGAR_ML_PER_DOSE * VINEGAR_ACID_MASS_FRACTION * effectiveDose;
      state.liquidMl += addedMl;
      state.acidMoles += acidGrams / ACETIC_ACID_MOLAR_MASS;
      state.additions += 1;
      break;
    }

    case 'water': {
      const remainingLiquid = Math.max(0, MAX_LIQUID_ML - state.liquidMl);
      const addedMl = Math.min(remainingLiquid, WATER_ML_PER_DOSE * dose);
      if (addedMl <= 0) return state;
      state.liquidMl += addedMl;
      state.additions += 1;
      break;
    }

    case 'soap': {
      if (state.soap >= MAX_SOAP_DOSES || state.liquidMl >= MAX_LIQUID_ML) return state;
      const addedSoap = Math.min(MAX_SOAP_DOSES - state.soap, dose);
      const addedMl = Math.min(
        Math.max(0, MAX_LIQUID_ML - state.liquidMl),
        SOAP_ML_PER_DOSE * addedSoap,
      );
      state.soap += addedSoap;
      state.liquidMl += addedMl;
      state.additions += 1;
      break;
    }

    case 'color': {
      state.color = true;
      state.additions += 1;
      break;
    }
  }

  return state;
}

/**
 * Advance the chemical reaction and foam physics by `dt` seconds.
 * - Consumes baking soda and acetic acid in a 1:1 molar ratio at a finite rate.
 * - Produces CO2 only while both reagents are present.
 * - Soap increases bubble trapping efficiency and slows foam collapse without
 *   altering total CO2 gas produced.
 */
export function advanceReaction(
  state: ReactionState,
  dt: number,
): ReactionState {
  if (!(dt > 0) || !Number.isFinite(dt)) {
    return state;
  }

  state.elapsed += dt;

  const sodaMoles = state.sodaGrams / SODA_MOLAR_MASS;
  const acidMoles = state.acidMoles;
  const limitingMoles = Math.min(sodaMoles, acidMoles);

  let dGasMl = 0;

  // Reaction proceeds only when both NaHCO3 and CH3COOH are available
  if (limitingMoles > 1e-7) {
    // Finite first-order-like consumption with a small baseline rate so the tail finishes cleanly
    const rateConstant = 1.35; // s^-1
    const fraction = 1 - Math.exp(-rateConstant * dt);
    const minStepMoles = 0.0015 * dt;
    const reactedMoles = Math.min(
      limitingMoles,
      Math.max(limitingMoles * fraction, minStepMoles),
    );

    state.sodaGrams = Math.max(
      0,
      state.sodaGrams - reactedMoles * SODA_MOLAR_MASS,
    );
    state.acidMoles = Math.max(0, state.acidMoles - reactedMoles);

    dGasMl = reactedMoles * CO2_ML_PER_MOLE;
    state.gasMl += dGasMl;
    state.reacted = true;
  } else {
    if (state.sodaGrams < 1e-5) state.sodaGrams = 0;
    if (state.acidMoles < 1e-7) state.acidMoles = 0;
  }

  // Surfactant factor (0..1): soap traps CO2 bubbles into taller, longer-lived foam
  const soapLevel = Math.min(1, state.soap / 2);

  // Without soap, fizz escapes quickly as low bubbles; with soap, gas builds high foam
  const foamPerGasMl = 0.0014 + 0.0021 * soapLevel;
  const foamGain = dGasMl * foamPerGasMl;

  // Foam decays faster without surfactant and slower when stabilized by dish soap
  const decayRate = 0.85 - 0.55 * soapLevel; // s^-1
  const decayedFoam = state.foam * Math.exp(-decayRate * dt);

  state.foam = Math.min(MAX_FOAM_HEIGHT, Math.max(0, decayedFoam + foamGain));
  if (state.foam < 1e-4 && limitingMoles <= 1e-7) {
    state.foam = 0;
  }

  if (state.foam > state.peakFoam) {
    state.peakFoam = state.foam;
  }

  return state;
}

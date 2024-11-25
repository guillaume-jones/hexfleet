export const adjustableConstants = {
  // Enemy probability calculations
  defensiveMeans: [1.45, 9, 10, 1000],
  defensiveVariances: [3.3, 4.5, 5, 0.001],
  offensiveMeans: [1.7, 4.8, 8.3, 21],
  offensiveVariances: [2.7, 5.4, 7, 3.68],
  zeroSpend: 20,

  // Gains & losses
  homeworldValue: 75,
  neighborFactor: 0.2,
  disableFactor: 0.78,
};

export const fixedConstants = {
  maxSimulations: 10000,
  myId: 'AI',
};

export const defaultAiConstants = { ...adjustableConstants, ...fixedConstants };

export type AIConstants = typeof defaultAiConstants;

export const adjustableConstants = {
  // Enemy probability calculations
  defensiveMeans: [1.3755, 13.49222, 15.3155, 1000],
  defensiveVariances: [4.1477, 5.5243, 4.6101, 0.001],
  offensiveMeans: [1.7208, 5.4561, 7.2086, 14.9702],
  offensiveVariances: [2.7231, 6.0466, 5.7635, 4.3978],
  zeroSpend: 25,

  // Gains & losses
  homeworldValue: 82,
  neighborFactor: 0.09,
  disableFactor: 0.67,
};

export const fixedConstants = {
  maxSimulations: 10000,
  myId: 'AI',
};

export const defaultAiConstants = { ...adjustableConstants, ...fixedConstants };

export type AIConstants = typeof defaultAiConstants;

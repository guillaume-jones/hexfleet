const adjustableConstants = {
  // Enemy probability calculations
  defensiveMeans: [2, 6, 14, 1000],
  defensiveVariances: [5, 8, 5, 0.1],
  offensiveMeans: [2, 5, 9, 13],
  offensiveVariances: [4, 8, 6, 4],
  zeroSpend: 40,

  // Gains & losses
  homeworldValue: 50,
  neighborFactor: 0.1,
  disableFactor: 0.75,
};

const fixedConstants = {
  maxSimulations: 10000,
  myId: 'AI',
};

export const defaultAiConstants = { ...adjustableConstants, ...fixedConstants };

export type AIConstants = typeof defaultAiConstants;

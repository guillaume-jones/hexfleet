export const adjustableConstants = {
  // Enemy probability calculations
  defensiveMeans: [1.436, 15.026, 11.365, 1000],
  defensiveVariances: [3.313, 5.684, 6.776, 0.001],
  offensiveMeans: [1.698, 5.594, 8.959, 20.352],
  offensiveVariances: [2.428, 6.211, 7.372, 3.672],
  zeroSpend: 21.6,

  // Gains & losses
  homeworldValue: 75.747,
  neighborFactor: 0.2,
  disableFactor: 0.719,
};

export const fixedConstants = {
  maxSimulations: 10000,
  myId: 'AI',
};

export const defaultAiConstants = { ...adjustableConstants, ...fixedConstants };

export type AIConstants = typeof defaultAiConstants;

import { getGainsLosses } from '../action-calculations/gains-losses';
import { AIConstants } from '../training/ai-constants';
import { range, sum, sumBy } from 'lodash';
import NormalDistribution from 'normal-distribution';

import { BoardInfluences } from './ai-influence';
import { TileWithNeighbors } from './neighbor-counts';
import {
  maxPressure,
  minPressureInterval,
} from 'functions/src/game-logic/GameConstants';

export type TileWithEnemyProbabilities = TileWithNeighbors & {
  enemyAttack: number[];
  enemyDefense: number[];
};

const getZeroSpendFunction = ({
  boardState,
  enemyInfluence,
  zeroSpendFactor,
}: {
  boardState: TileWithNeighbors[];
  enemyInfluence: number;
  zeroSpendFactor: number;
}) => {
  // Counts all enemy tiles they can reach, distance is taken into account later
  const enemyReachableTiles = sumBy(boardState, (tile) =>
    tile.enemyDistance < Infinity ? 1 : 0,
  );
  const influenceFactor = enemyInfluence / enemyReachableTiles;

  const denominator = zeroSpendFactor / influenceFactor;

  return (v: number) => 1 - v / denominator;
};

const getProbabilities = ({
  distributions,
  zeroSpendDistribution,
  value,
}: {
  distributions: NormalDistribution[];
  zeroSpendDistribution: (value: number) => number;
  value: number;
}) => {
  const rawProbabilities = distributions.map((distribution) =>
    distribution.probabilityBetween(value - 0.5, value + 0.5),
  );
  const probabilitiesSum = sum(rawProbabilities);

  const zeroSpendProbability = zeroSpendDistribution(value);
  const nonZeroSpendProbabily = 1 - zeroSpendProbability;

  const normalizationFactor = nonZeroSpendProbabily / probabilitiesSum;

  return [
    zeroSpendProbability,
    ...rawProbabilities.map((probability) => probability * normalizationFactor),
  ];
};

export const getEnemyProbabilities = ({
  boardState,
  influences,
  constants,
}: {
  boardState: TileWithNeighbors[];
  influences: BoardInfluences;
  constants: AIConstants;
}): TileWithEnemyProbabilities[] => {
  const pressures = range(
    minPressureInterval,
    maxPressure + 1,
    minPressureInterval,
  );

  const defenseDistributions = pressures.map(
    (_, i) =>
      new NormalDistribution(
        constants.defensiveMeans[i],
        constants.defensiveVariances[i],
      ),
  );

  const offenseDistributions = pressures.map(
    (_, i) =>
      new NormalDistribution(
        constants.offensiveMeans[i],
        constants.offensiveVariances[i],
      ),
  );

  const zeroSpendDistribution = getZeroSpendFunction({
    boardState,
    enemyInfluence: influences.enemyInfluence,
    zeroSpendFactor: constants.zeroSpend,
  });

  return boardState.map((tile) => {
    const gainsLosses = getGainsLosses(tile, constants);

    const defensiveValue =
      (gainsLosses.gainFromConquer + gainsLosses.gainFromDisable) /
      tile.distance;
    const offensiveValue =
      (gainsLosses.lossFromConquer + gainsLosses.lossFromDisable) /
      tile.enemyDistance;

    const enemyDefense = getProbabilities({
      distributions: defenseDistributions,
      value: defensiveValue,
      zeroSpendDistribution,
    });

    const enemyAttack = getProbabilities({
      distributions: offenseDistributions,
      value: offensiveValue,
      zeroSpendDistribution,
    });

    return { ...tile, enemyDefense, enemyAttack };
  });
};

import { getGainsLosses } from '../action-calculations/gains-losses';
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

/** Factors of enemy spend
 * TODO: Adjust with training
 */
const factors = {
  // 2, 4, 6, 8
  defensiveMeans: [2, 6, 14, 100],
  defensiveVariances: [5, 8, 5, 0.1],
  offensiveMeans: [2, 5, 9, 13],
  offensiveVariances: [4, 8, 6, 4],
  zeroSpend: 40,
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
}: {
  boardState: TileWithNeighbors[];
  influences: BoardInfluences;
}): TileWithEnemyProbabilities[] => {
  const pressures = range(
    minPressureInterval,
    maxPressure + 1,
    minPressureInterval,
  );

  const defenseDistributions = pressures.map(
    (_, i) =>
      new NormalDistribution(
        factors.defensiveMeans[i],
        factors.defensiveVariances[i],
      ),
  );

  const offenseDistributions = pressures.map(
    (_, i) =>
      new NormalDistribution(
        factors.offensiveMeans[i],
        factors.offensiveVariances[i],
      ),
  );

  const zeroSpendDistribution = getZeroSpendFunction({
    boardState,
    enemyInfluence: influences.enemyInfluence,
    zeroSpendFactor: factors.zeroSpend,
  });

  return boardState.map((tile) => {
    const gainsLosses = getGainsLosses(tile);

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

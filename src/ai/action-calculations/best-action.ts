import { TileWithEnemyProbabilities } from '../pre-calculations/enemy-probabilities';
import range from 'lodash/range';
import { add, dotDivide, matrix, max, multiply } from 'mathjs';

import {
  buildDefenseMatrix,
  buildOffenseMatrix,
} from './build-action-matrices';
import { getGainsLosses, shouldClearTile } from './gains-losses';
import {
  maxPressure,
  minPressureInterval,
  pressureToConquer,
} from 'functions/src/game-logic/GameConstants';

import { aiId } from 'src/game/create-game/createGame';

export type TileActionChange = {
  gainRatio: number;
  initialId?: string;
  finalId?: string;
  pressure: number;
  clear: boolean;
};

export const actionCache: Record<string, TileActionChange | undefined> = {};

export const calculateBestAction = ({
  tile,
  maxInfluence,
}: {
  tile: TileWithEnemyProbabilities;
  maxInfluence: number;
}): TileActionChange | undefined => {
  const maxSpend = Math.min(maxInfluence / tile.distance, maxPressure);
  const gainsLosses = getGainsLosses(tile);

  // Checks cache for existing calculations
  // cacheKey MUST INCLUDE ALL VARIABLES SUSCEPTIBLE TO CHANGE
  const cacheKey =
    JSON.stringify(tile.neighbors) +
    tile.distance +
    tile.enemyDistance +
    tile.playerId +
    maxInfluence;
  const cached = actionCache[cacheKey];
  if (cached) return actionCache[cacheKey];

  // Special case, nothing to spend, just checks if clear is worthwhile
  if (maxSpend < minPressureInterval) {
    if (tile.playerId !== aiId) return undefined;

    const shouldClear = shouldClearTile({ ...tile, ...gainsLosses });
    if (!shouldClear) return undefined;

    return {
      gainRatio: gainsLosses.gainFromMyClear,
      initialId: tile.playerId,
      finalId: undefined,
      pressure: 0,
      clear: true,
    };
  }

  if (
    // Unreachable
    tile.distance === Infinity ||
    // In safe territory
    (tile.enemyDistance === Infinity &&
      gainsLosses.gainFromConquer <= 0 &&
      gainsLosses.gainFromDisable <= 0)
  )
    return;

  const myPressures = range(
    minPressureInterval,
    maxSpend + 0.0001,
    minPressureInterval,
  );
  const myPressuresMatrix = matrix(myPressures);

  const offenseMatrix = buildOffenseMatrix({ ...gainsLosses, myPressures });
  const defenseMatrix = buildDefenseMatrix({ ...gainsLosses, myPressures });

  const offenseGainRatios = multiply(offenseMatrix, matrix(tile.enemyDefense));
  const defenseGainRatios = multiply(defenseMatrix, matrix(tile.enemyAttack));
  const finalGainRatios = dotDivide(
    add(offenseGainRatios, defenseGainRatios),
    myPressuresMatrix,
  ).toArray();

  const bestGainRatio = max(finalGainRatios);
  const bestGainRatioIndex = finalGainRatios.findIndex(
    (value) => value === bestGainRatio,
  );

  const pressure = myPressures[bestGainRatioIndex];
  const newOwner = pressure >= pressureToConquer ? aiId : tile.playerId;
  const isCleared = shouldClearTile({
    ...tile,
    ...gainsLosses,
    playerId: newOwner,
  });

  const returned = {
    gainRatio: (bestGainRatio.valueOf() as number) / tile.distance,
    pressure,
    initialId: tile.playerId,
    finalId: isCleared ? undefined : newOwner,
    clear: isCleared,
  };

  actionCache[cacheKey] = returned;

  return returned;
};

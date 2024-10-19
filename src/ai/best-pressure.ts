import { clamp, maxBy, range } from 'lodash';

import { GainsLosses, shouldClearOwnTile } from './gains-losses';
import { TileWithDistances } from './tiles-distances';
import {
  maxInfluenceReach,
  maxPressure,
  minPressureInterval,
  pressureToConquer,
  pressureToDisable,
} from 'functions/src/game-logic/GameConstants';

import { aiId } from 'src/game/create-game/createGame';
import { roundToNearest } from 'src/utils/math';

export type TilePressureGain = {
  gainRatio: number;
  initialId?: string;
  finalId?: string;
  pressure: number;
  clear: boolean;
};

/** Estimate of enemy spending on defense.
 * Increase to make the AI more focused on defense.
 * TODO: adjust based on enemy pressure
 */
const enemySpendFactor = 0.18;

const enemyId = 'enemy';

const estimateEnemySpend = ({
  gainsLosses: {
    gainFromConquer,
    gainFromDisable,
    lossFromDisable,
    lossFromConquer,
  },
  distance,
  enemyDistance,
}: {
  gainsLosses: GainsLosses;
  distance: number;
  enemyDistance: number;
}) => {
  if (enemyDistance > maxInfluenceReach) return 0;

  // Calculates value, including my distance & enemy distance
  const value =
    (gainFromConquer + gainFromDisable) / distance +
    (lossFromConquer + lossFromDisable) / enemyDistance;

  // Estimates enemy spend
  const spend = roundToNearest(enemySpendFactor * value, minPressureInterval);

  // Clamps to 2/4/6/8 range
  return clamp(spend, 0, maxPressure);
};

export const calculateBestPressure = ({
  tile,
  gainsLosses,
  maxInfluence,
}: {
  tile: TileWithDistances;
  gainsLosses: GainsLosses;
  maxInfluence: number;
}): TilePressureGain | undefined => {
  const {
    gainFromConquer,
    gainFromDisable,
    lossFromConquer,
    lossFromDisable,
    gainFromMyClear,
    gainFromEnemyClear,
  } = gainsLosses;

  const shouldClear = shouldClearOwnTile({ ...tile, gainFromMyClear });
  const enemySpend = estimateEnemySpend({ ...tile, gainsLosses });

  const maxSpend = Math.min(maxInfluence / tile.distance, maxPressure);

  // Special case, just checks if clear is the best action
  if (maxSpend === 0) {
    return {
      gainRatio: shouldClear ? gainFromMyClear : 0,
      initialId: tile.playerId,
      finalId: undefined,
      pressure: 0,
      clear: shouldClear,
    };
  }

  /* Evaluates all possible pressures (2,4,6,8) up to remaining spend */
  const possibleActions = range(
    minPressureInterval,
    maxSpend + 0.001,
    minPressureInterval,
  ).map((pressure) => {
    let estimatedGain = 0;
    let finalId = tile.playerId;
    const pressureDelta = pressure - enemySpend;

    if (pressureDelta >= pressureToConquer) {
      estimatedGain += gainFromConquer;
      finalId = aiId;
    } else if (pressureDelta >= pressureToDisable) {
      estimatedGain += gainFromDisable;
    }

    // Enemy would have conquered
    if (enemySpend >= pressureToConquer) {
      if (-pressureDelta < pressureToDisable) {
        estimatedGain += lossFromConquer;
      } else if (-pressureDelta < pressureToConquer) {
        estimatedGain += lossFromConquer - lossFromDisable;
      } else {
        finalId = enemyId;
      }
    } else if (
      enemySpend >= pressureToDisable &&
      enemySpend - pressure < pressureToDisable
    ) {
      estimatedGain += lossFromDisable;
    }

    // Determines if enemy or me should clear the tile
    if (
      (gainFromEnemyClear > 0 && finalId === enemyId) ||
      (gainFromMyClear > 0 && finalId === aiId)
    )
      finalId = undefined;

    return {
      gainRatio: estimatedGain / (pressure * tile.distance),
      initialId: tile.playerId,
      finalId,
      pressure,
      clear: shouldClear,
    };
  });

  /* Calculates best gain and returns it */
  return maxBy(possibleActions, 'gainRatio');
};

import { clamp, maxBy, range } from 'lodash';

import { GainsLosses, shouldClearOwnTile } from './gains-losses';
import { TileWithDistances } from './tiles-distances';
import {
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
 * Increase to make AI attacks more focused & spend less on offense.
 * TODO: adjust based on enemy influence available
 */
const enemyDefenseFactor = 0.2;
/** Estimate of enemy spending on attack.
 * Increase to make AI defense more focused & spend less on offense.
 * TODO: adjust based on enemy influence available
 */
const enemyAttackFactor = 0.4;

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
  if (enemyDistance === Infinity) {
    return { enemyDefense: 0, enemyAttack: 0 };
  }

  const myAttackValue = (gainFromConquer + gainFromDisable) / distance;
  const enemyAttackValue = (lossFromConquer + lossFromDisable) / enemyDistance;

  const enemyDefense = clamp(
    roundToNearest(myAttackValue * enemyDefenseFactor, minPressureInterval),
    0,
    maxPressure,
  );
  const enemyAttack = clamp(
    roundToNearest(enemyAttackValue * enemyAttackFactor, minPressureInterval),
    0,
    maxPressure,
  );

  return { enemyDefense, enemyAttack };
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
  const { enemyDefense, enemyAttack } = estimateEnemySpend({
    ...tile,
    gainsLosses,
  });

  const maxSpend = Math.min(maxInfluence / tile.distance, maxPressure);

  // Special case, just checks if clear is the best action
  if (maxSpend < minPressureInterval) {
    if (!shouldClear) return undefined;

    return {
      gainRatio: gainFromMyClear,
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

    if (pressure - enemyDefense >= pressureToConquer) {
      estimatedGain += gainFromConquer;
      finalId = aiId;
    } else if (pressure - enemyDefense >= pressureToDisable) {
      estimatedGain += gainFromDisable;
    }

    // Enemy would have conquered
    if (enemyAttack >= pressureToConquer) {
      if (enemyAttack - pressure < pressureToDisable) {
        estimatedGain += lossFromConquer;
      } else if (enemyAttack - pressure < pressureToConquer) {
        estimatedGain += lossFromConquer - lossFromDisable;
      } else {
        finalId = 'enemy'; // TODO: Set to actual users if needed
      }
    } else if (
      enemyAttack >= pressureToDisable &&
      enemyAttack - pressure < pressureToDisable
    ) {
      estimatedGain += lossFromDisable;
    }

    // Determines if enemy or me should clear the tile
    if (
      (gainFromEnemyClear > 0 && finalId && finalId !== aiId) ||
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

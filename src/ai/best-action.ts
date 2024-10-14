import { clamp, maxBy, range } from 'lodash';

import { GainsLosses } from './gains-losses';
import {
  maxInfluenceReach,
  maxPressure,
  minPressureInterval,
  pressureToConquer,
  pressureToDisable,
} from 'functions/src/game-logic/GameConstants';

import { roundToNearest } from 'src/utils/math';

/** Estimate of enemy spending on defense.
 * Increase to make the AI more focused on defense.
 */
const enemySpendFactor = 0.2;
const estimateEnemySpend = ({
  gainsLosses: {
    gainFromConquer,
    gainFromDisable,
    lossFromDisable,
    lossFromConquer,
  },
  myDistance,
  enemyDistance,
}: {
  gainsLosses: GainsLosses;
  myDistance: number;
  enemyDistance: number;
}) => {
  if (enemyDistance > maxInfluenceReach) return 0;

  // Calculates value, including my distance & enemy distance
  const value =
    (gainFromConquer + gainFromDisable) / myDistance +
    (lossFromConquer + lossFromDisable) / enemyDistance;

  // Estimates enemy spend
  const spend = roundToNearest(enemySpendFactor * value, minPressureInterval);

  // Clamps to 2/4/6/8 range
  return clamp(spend, 0, maxPressure);
};

export const getBestAction = ({
  myDistance,
  enemyDistance,
  gainsLosses,
}: {
  myDistance: number;
  enemyDistance: number;
  gainsLosses: GainsLosses;
}) => {
  const enemySpend = estimateEnemySpend({
    gainsLosses,
    myDistance,
    enemyDistance,
  });

  const { gainFromConquer, gainFromDisable, lossFromConquer, lossFromDisable } =
    gainsLosses;

  /* Evaluates all possible gains for 2/4/6/8 spend */
  const possibleActions = range(2, maxPressure + 1, minPressureInterval).map(
    (pressure) => {
      let estimatedGain = 0;
      const pressureDelta = pressure - enemySpend;

      if (pressureDelta >= pressureToConquer) {
        estimatedGain += gainFromConquer;
      } else if (pressureDelta >= pressureToDisable) {
        estimatedGain += gainFromDisable;
      }

      // Enemy would have conquered
      if (enemySpend >= pressureToConquer) {
        if (-pressureDelta < pressureToDisable) {
          estimatedGain += lossFromConquer;
        } else if (-pressureDelta < pressureToConquer) {
          estimatedGain += lossFromConquer - lossFromDisable;
        }
      } else if (
        enemySpend >= pressureToDisable &&
        enemySpend - pressure < pressureToDisable
      ) {
        estimatedGain += lossFromDisable;
      }

      return {
        gainRatio: estimatedGain / (pressure * myDistance),
        pressure,
      };
    },
  );

  /* Calculates best gain and returns it */
  return maxBy(possibleActions, 'gainRatio');
};

import range from 'lodash/range';
import { matrix } from 'mathjs';

import { GainsLosses } from './gains-losses';
import {
  maxPressure,
  minPressureInterval,
  pressureToConquer,
  pressureToDisable,
} from 'functions/src/game-logic/GameConstants';

export const buildDefenseMatrix = ({
  lossFromDisable,
  lossFromConquer,
  myPressures,
}: GainsLosses & {
  myPressures: number[];
}) => {
  /**  Matrix (typically 4x5) with:
   * Rows are my pressure:  2, ... maxSpend
   * Columns are enemy pressure: 0, 2, ... maxPressure
   */
  return matrix(
    myPressures.map((myPressure) =>
      range(0, maxPressure + 0.0001, minPressureInterval).map(
        (enemyPressure) => {
          if (enemyPressure < pressureToDisable) return 0;

          if (enemyPressure < pressureToConquer) {
            if (enemyPressure - myPressure < pressureToDisable)
              return lossFromDisable;

            return 0;
          }

          if (enemyPressure - myPressure < pressureToDisable)
            return lossFromConquer;
          if (enemyPressure - myPressure < pressureToConquer)
            return lossFromConquer - lossFromDisable;

          return 0;
        },
      ),
    ),
  );
};

export const buildOffenseMatrix = ({
  gainFromDisable,
  gainFromConquer,
  myPressures,
}: GainsLosses & {
  myPressures: number[];
}) => {
  /**  Matrix (typically 4x5) with:
   * Rows are my pressure:  2, ... maxSpend
   * Columns are enemy pressure: 0, 2, ... maxPressure
   */
  return matrix(
    myPressures.map((myPressure) =>
      range(0, maxPressure + 0.0001, minPressureInterval).map(
        (enemyPressure) => {
          if (myPressure - enemyPressure >= pressureToConquer)
            return gainFromConquer;
          if (myPressure - enemyPressure >= pressureToDisable)
            return gainFromDisable;

          return 0;
        },
      ),
    ),
  );
};

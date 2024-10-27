import { TileWithEnemyProbabilities } from '../pre-calculations/enemy-probabilities';
import {
  TileWithNeighbors,
  applyNeighborCountUpdate,
} from '../pre-calculations/neighbor-counts';

import { TileActionChange, calculateBestAction } from './best-action';
import { getGainsLosses } from './gains-losses';
import {
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

export const getBestRemainingActions = ({
  boardState,
  previousActions,
  maxInfluence,
}: {
  boardState: TileWithEnemyProbabilities[];
  maxInfluence: number;
  previousActions: TileCoords[];
}): {
  actions: TileWithPressure<TileWithEnemyProbabilities>[];
  applyUpdate: (boardState: TileWithNeighbors[]) => void;
} => {
  const bestRemainingActions = boardState
    .map((tile) => {
      // Skips tiles which have already been acted on
      if (previousActions.find((v) => v.x === tile.x && v.y === tile.y)) return;

      // Skips unreachable tiles
      if (tile.distance === Infinity) return;

      // Calculates best action
      const gainsLosses = getGainsLosses(tile);
      const bestPressure = calculateBestAction({
        tile,
        gainsLosses,
        maxInfluence,
      });

      return { ...tile, ...bestPressure };
    })
    .filter(
      (action): action is TileWithEnemyProbabilities & TileActionChange =>
        !!action,
    )
    .sort((a, b) => b.gainRatio - a.gainRatio);

  const changeIndex = bestRemainingActions.findIndex(
    (action) => action.finalId !== action.initialId,
  );
  const change = bestRemainingActions[changeIndex];

  const actions =
    changeIndex === -1
      ? bestRemainingActions
      : bestRemainingActions.slice(0, changeIndex + 1);

  return {
    actions,
    applyUpdate: (boardState) =>
      applyNeighborCountUpdate({ ...change, boardState }),
  };
};

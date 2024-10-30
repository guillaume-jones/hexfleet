import { TileWithEnemyProbabilities } from '../pre-calculations/enemy-probabilities';
import {
  TileWithNeighbors,
  applyNeighborCountUpdate,
} from '../pre-calculations/neighbor-counts';
import { AIConstants } from '../training/ai-constants';

import { TileActionChange, calculateBestAction } from './best-action';
import {
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

export const getBestRemainingActions = ({
  boardState,
  previousActions,
  maxInfluence,
  constants,
}: {
  boardState: TileWithEnemyProbabilities[];
  maxInfluence: number;
  constants: AIConstants;
  previousActions: TileCoords[];
}): {
  actions: TileWithPressure<TileWithEnemyProbabilities>[];
  applyUpdate: (boardState: TileWithNeighbors[]) => void;
} => {
  const bestRemainingActions = boardState
    .map((tile) => {
      // Skips tiles which have already been acted on
      if (previousActions.find((v) => v.x === tile.x && v.y === tile.y)) return;

      // Calculates best action
      const bestPressure = calculateBestAction({
        tile,
        maxInfluence,
        constants,
      });
      if (!bestPressure || bestPressure.gainRatio <= 0) return;

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
  const change = bestRemainingActions.at(changeIndex);

  const actions = change
    ? bestRemainingActions.slice(0, changeIndex + 1)
    : bestRemainingActions;

  return {
    actions,
    applyUpdate: (boardState) => {
      if (!change) return;
      applyNeighborCountUpdate({ ...change, boardState, myId: constants.myId });
    },
  };
};

import { range, shuffle } from 'lodash';

import { getBestRemainingActions } from './action-calculations/best-remaining-actions';
import {
  BoardInfluences,
  getAiInfluence,
} from './pre-calculations/ai-influence';
import {
  TileWithEnemyProbabilities,
  getEnemyProbabilities,
} from './pre-calculations/enemy-probabilities';
import { getNeighborCounts } from './pre-calculations/neighbor-counts';
import { getTilesWithDistances } from './pre-calculations/tiles-distances';
import { AIConstants } from './training/ai-training';
import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { removeDisabled } from 'functions/src/game-logic/removeDisabled';

const generateTurn = ({
  boardSize,
  boardState: unshuffledBoardState,
  influences,
  constants,
}: {
  boardSize: number;
  boardState: TileWithEnemyProbabilities[];
  influences: BoardInfluences;
  constants: AIConstants;
}): NextTurn & { relativeInfluence: number } => {
  const boardState = shuffle(structuredClone(unshuffledBoardState));

  const pressures = [] as TileWithPressure<TileCoords>[];
  let remainingInfluence = influences.aiInfluence;

  while (remainingInfluence >= 0) {
    const { actions, applyUpdate } = getBestRemainingActions({
      boardState,
      previousActions: pressures,
      maxInfluence: remainingInfluence,
      constants,
    });

    // No more good actions to take (including clears)
    if (actions.length === 0) break;

    for (let i = 0; i < actions.length; i++) {
      const cost = actions[i].pressure * actions[i].distance;

      // Remaining influence has run out before bestActions are exhausted
      if (cost > remainingInfluence) break;

      pressures.push(actions[i]);
      remainingInfluence -= cost;

      // If last action was taken, must update board state since it is a change
      if (i === actions.length - 1) applyUpdate(boardState);
    }
  }

  // Calculates value of final board)
  const { relativeInfluence } = getAiInfluence({ boardState, boardSize });

  return { pressures, relativeInfluence };
};

/** How many boards should be simulated each turn */
export const getAiNextTurn = (game: Game, constants: AIConstants): NextTurn => {
  const boardSize = game.boardSize;
  const influences = getAiInfluence(game);

  const boardWithDistances = getTilesWithDistances(game);
  const boardWithoutDisabled = removeDisabled(boardWithDistances);
  const boardWithNeighbors = getNeighborCounts({
    boardState: boardWithoutDisabled,
    boardSize,
  });
  const boardState = getEnemyProbabilities({
    boardState: boardWithNeighbors,
    influences,
    constants,
  });

  // Allows more simulations on smaller boards since takes less time
  const maxSimulations = constants.maxSimulations / game.boardSize ** 2;

  const turns = range(maxSimulations)
    .map(() => generateTurn({ boardSize, boardState, influences, constants }))
    .sort((a, b) => b.relativeInfluence - a.relativeInfluence);

  return { pressures: turns[0].pressures };
};

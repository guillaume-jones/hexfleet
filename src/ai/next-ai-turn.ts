import { range, shuffle, sum } from 'lodash';

import { getBestRemainingActions } from './best-actions';
import { TileWithDistances, getTilesWithDistances } from './tiles-distances';
import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';
import { removeDisabled } from 'functions/src/game-logic/removeDisabled';

import { aiId } from 'src/game/create-game/createGame';

const generateTurn = ({
  boardSize,
  boardState: rawBoardState,
}: {
  boardSize: number;
  boardState: TileWithDistances[];
}): NextTurn & { differential: number } => {
  const boardState = removeDisabled(shuffle(structuredClone(rawBoardState)));

  const pressures = [] as TileWithPressure<TileCoords>[];
  let remainingInfluence = getPlayersInfluence(
    addBordersToBoard(rawBoardState, boardSize),
  )[aiId];

  while (remainingInfluence >= 0) {
    const bestActions = getBestRemainingActions({
      boardState,
      boardSize,
      previousActions: pressures,
      maxInfluence: remainingInfluence,
    });

    if (bestActions.length === 0) break;

    for (let i = 0; i < bestActions.length; i++) {
      const action = bestActions[i];
      const cost = action.pressure * action.distance;

      // Remaining influence has run out before bestActions are exhausted
      if (cost > remainingInfluence) break;

      pressures.push(action);
      remainingInfluence -= cost;

      // Applies last action to board state, since this one is a change
      if (i === bestActions.length - 1) {
        for (const tile of boardState) {
          if (tile.x === action.x && tile.y === action.y) {
            tile.playerId = action.finalId;
            break;
          }
        }
      }
    }
  }

  // Calculates value of final board
  const finalInfluences = getPlayersInfluence(
    addBordersToBoard(boardState, boardSize),
  );
  const enemyInfluence =
    sum(Object.values(finalInfluences)) - finalInfluences[aiId];
  const differential = finalInfluences[aiId] - enemyInfluence;

  return {
    pressures,
    differential,
  };
};

/** How many boards should be simulated each turn */
export const getAiNextTurn = (game: Game): NextTurn => {
  const boardSize = game.boardSize;
  const boardState = getTilesWithDistances(game);

  // Allows more simulations on smaller boards since takes less time
  const absoluteMaxSimulations = 100;
  const maxSimulations = absoluteMaxSimulations / game.boardSize ** 2;

  const turns = range(maxSimulations)
    .map(() => generateTurn({ boardSize, boardState }))
    .sort((a, b) => b.differential - a.differential);

  return { pressures: turns[0].pressures };
};

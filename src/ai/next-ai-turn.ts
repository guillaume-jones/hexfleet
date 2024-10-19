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

import { aiId } from 'src/game/create-game/createGame';

const generateTurn = ({
  boardSize,
  boardState: rawBoardState,
}: {
  boardSize: number;
  boardState: TileWithDistances[];
}): NextTurn & { differential: number } => {
  const boardState = shuffle(structuredClone(rawBoardState));
  const pressures = [] as TileWithPressure<TileCoords>[];

  let remainingInfluence = getPlayersInfluence(
    addBordersToBoard(boardState, boardSize),
  )[aiId];

  while (remainingInfluence >= 0) {
    const bestActions = getBestRemainingActions({
      boardState,
      boardSize,
      previousActions: pressures,
      maxInfluence: remainingInfluence,
    });

    if (bestActions.length === 0) break;

    bestActions.forEach((action, i) => {
      pressures.push(action);
      remainingInfluence -= action.pressure * action.distance;

      // Applies last action to board state, since this one is a change
      if (i === bestActions.length - 1) {
        for (const tile of boardState) {
          if (tile.x === action.x && tile.y === action.y) {
            tile.playerId = action.finalId;
            break;
          }
        }
      }
    });
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
  const absoluteMaxSimulations = 10000;
  const maxSimulations = absoluteMaxSimulations / game.boardSize ** 2;

  const turns = range(maxSimulations)
    .map(() => generateTurn({ boardSize, boardState }))
    .sort((a, b) => b.differential - a.differential);

  return { pressures: turns[0].pressures };
};

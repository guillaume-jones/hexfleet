import { range, shuffle, sum } from 'lodash';

import { getBestRemainingActions } from './best-actions';
import { TileWithDistances, getTilesWithDistances } from './tiles-distances';
import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { minPressureInterval } from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

import { aiId } from 'src/game/create-game/createGame';
import { floorToNearest } from 'src/utils/math';

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

  while (remainingInfluence >= minPressureInterval) {
    const bestActions = getBestRemainingActions({
      boardState,
      boardSize,
      previousActions: pressures,
    });

    if (bestActions.length === 0) break;

    bestActions.forEach((action, i) => {
      const cost = action.pressure * action.distance;

      // Should not half-attack distant tiles or homeworlds
      if (remainingInfluence < cost && action.distance > 1) {
        pressures.push({ ...action, pressure: 0 });
        return;
      }

      // Spends intended pressure or as much as is left
      const pressure = Math.min(
        action.pressure,
        floorToNearest(remainingInfluence, minPressureInterval),
      );
      pressures.push({ ...action, pressure });

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
const maxSimulations = 100;

export const getAiNextTurn = (game: Game): NextTurn => {
  const boardSize = game.boardSize;
  const boardState = getTilesWithDistances(game);

  const turns = range(maxSimulations)
    .map(() => generateTurn({ boardSize, boardState }))
    .sort((a, b) => b.differential - a.differential);

  return { pressures: turns[0].pressures };
};

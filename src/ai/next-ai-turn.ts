import { shuffle } from 'lodash';

import { getBestRemainingActions } from './best-actions';
import { Game, NextTurn, Tile } from 'functions/src/document-types/Games';
import {
  maxInfluenceReach,
  minPressureInterval,
} from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';
import { ValidDistance } from 'functions/src/game-logic/getValidNeighbors';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

import { aiId } from 'src/game/create-game/createGame';
import { floorToNearest } from 'src/utils/math';

export type TileWithDistances = Tile & {
  distance: number;
  enemyDistance: number;
};

const getTilesWithDistances = ({
  boardState,
  boardSize,
}: {
  boardState: Tile[];
  boardSize: number;
}): TileWithDistances[] => {
  return boardState.map((tile) => {
    const params = {
      coords: tile,
      boardState,
      boardSize,
      maxDistance: maxInfluenceReach as ValidDistance,
    };

    const distance =
      findClosestTileWithId({ ...params, id: aiId }).distance || 1;

    const enemyDistance =
      findClosestTileWithId({ ...params, id: aiId, invertSearch: true })
        .distance || 1;

    return { ...tile, distance, enemyDistance };
  });
};

export const getAiNextTurn = (game: Game): NextTurn => {
  const boardSize = game.boardSize;
  const boardState = getTilesWithDistances({
    boardState: shuffle(game.boardState),
    boardSize,
  });
  const nextTurn: NextTurn = { pressures: [] };

  let remainingInfluence = getPlayersInfluence(
    addBordersToBoard(boardState, boardSize),
  )[aiId];

  while (remainingInfluence >= minPressureInterval) {
    const bestActions = getBestRemainingActions({
      boardState,
      boardSize,
      previousActions: nextTurn.pressures,
    });

    if (bestActions.length === 0) break;

    for (const action of bestActions) {
      const cost = action.pressure * action.distance;

      // Should not half-attack distant tiles or homeworlds
      if (remainingInfluence < cost && action.distance > 1) {
        nextTurn.pressures.push({ ...action, pressure: 0 });
        continue;
      }

      // Spends intended pressure or as much as is left
      const pressure = Math.min(
        action.pressure,
        floorToNearest(remainingInfluence, minPressureInterval),
      );

      nextTurn.pressures.push({ ...action, pressure });
      remainingInfluence -= cost;
    }
  }

  return nextTurn;
};

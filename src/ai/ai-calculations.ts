import { shuffle } from 'lodash';

import { getBestAction } from './best-action';
import { getGainsLosses } from './gains-losses';
import { getNeighborCounts } from './neighbor-counts';
import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import {
  maxInfluenceReach,
  minPressureInterval,
} from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

import { aiId } from 'src/game/create-game/createGame';
import { floorToNearest } from 'src/utils/math';

type TileAction = {
  ratio: number;
  tilePressure: TileWithPressure<TileCoords>;
};

const getBestActions = (game: Game) => {
  const { boardSize, boardState } = game;

  return shuffle(boardState)
    .map((tile) => {
      const coords = { x: tile.x, y: tile.y };

      const myDistance =
        findClosestTileWithId({
          coords,
          boardState,
          boardSize,
          maxDistance: maxInfluenceReach,
          id: aiId,
        }).distance || 1;

      // Returns early if untouchable
      if (myDistance === Infinity) return undefined;

      const enemyDistance =
        findClosestTileWithId({
          coords,
          boardState,
          boardSize,
          maxDistance: maxInfluenceReach,
          id: aiId,
          invertSearch: true,
        }).distance || 1;

      const neighbors = getNeighborCounts({ tile, boardState, boardSize });

      const gainsLosses = getGainsLosses({ tile, neighbors });

      const bestAction = getBestAction({
        myDistance,
        enemyDistance,
        gainsLosses,
      });

      if (!bestAction || bestAction.gainRatio <= 0) return undefined;

      return {
        ratio: bestAction.gainRatio,
        tilePressure: {
          ...coords,
          pressure: bestAction.pressure,
          distance: myDistance,
          clear: gainsLosses.shouldClearMine,
        },
      };
    })
    .filter((action): action is TileAction => !!action)
    .sort((a, b) => b.ratio - a.ratio)
    .map(({ tilePressure }) => tilePressure);
};

export const getAiNextTurn = (game: Game): NextTurn => {
  let remainingInfluence = getPlayersInfluence(
    addBordersToBoard(game.boardState, game.boardSize),
  )[aiId];

  const bestActions = getBestActions(game);
  const nextTurn: NextTurn = { pressures: [] };

  for (const action of bestActions) {
    const cost = action.pressure * action.distance;

    if (remainingInfluence <= cost) {
      // Should not half-attack distant tiles or homeworlds
      if (action.distance > 1) {
        continue;
      }

      // Spends all remaining influence on last tile
      const pressure = floorToNearest(remainingInfluence, minPressureInterval);
      nextTurn.pressures.push({ ...action, pressure });
      break;
    }

    nextTurn.pressures.push(action);
    remainingInfluence -= cost;
  }

  return nextTurn;
};

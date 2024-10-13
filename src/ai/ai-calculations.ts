import { clamp, maxBy, range, round } from 'lodash';

import { Game, NextTurn, Tile } from 'functions/src/document-types/Games';
import {
  maxInfluenceReach,
  maxPressure,
  minPressureInterval,
  pressureToConquer,
  pressureToDisable,
  tileMaintenance,
} from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';
import { getValidNeighbors } from 'functions/src/game-logic/getValidNeighbors';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

import { aiId } from 'src/game/create-game/createGame';

/** Minimum amount of influence gain to allow a removal
 */
const minimumRemovalGain = 2;

/** Estimate of enemy spending on defense.
 * Increase to make the AI more "concentrated" on certain tiles
 */
const fractionOfGain = 0.5;

const getBestActions = (game: Game) => {
  const { boardSize, boardState } = game;

  return boardState
    .map((tile) => {
      const isMine = tile.playerId === aiId;
      const isEnemy = tile.playerId && tile.playerId !== aiId;
      const coords = { x: tile.x, y: tile.y };

      // Determines borders
      const neighbors = getValidNeighbors({ tile, boardSize })
        .map(({ x, y }) =>
          boardState.find((tile) => tile.x === x && tile.y === y),
        )
        .filter((tile): tile is Tile => tile !== undefined);
      const openNeighbors = neighbors.filter(
        ({ playerId }) => !playerId,
      ).length;
      const meNeighbors = neighbors.filter(
        ({ playerId }) => playerId === aiId,
      ).length;
      const enemyNeighbors = neighbors.length - openNeighbors - meNeighbors;

      // Determines costs
      const myDistance =
        findClosestTileWithId({
          coords,
          boardState,
          boardSize,
          maxDistance: maxInfluenceReach,
          id: aiId,
        }).distance || 1;
      const enemyDistance =
        findClosestTileWithId({
          coords,
          boardState,
          boardSize,
          maxDistance: maxInfluenceReach,
          id: aiId,
          invertSearch: true,
        }).distance || 1;

      // Determines gains & losses from changes
      const gainFromRemoval = isMine
        ? meNeighbors - openNeighbors - enemyNeighbors
        : 0;
      const gainFromFlip = isMine
        ? 0 // Already mine: no gain
        : isEnemy
        ? 2 * (openNeighbors - tileMaintenance) // Enemy: double gain - tile cost
        : // Empty: gain - tile cost - blocks mine + blocks enemy
          openNeighbors - tileMaintenance - meNeighbors + enemyNeighbors;
      const gainFromDisable = isEnemy ? openNeighbors : 0;

      const lossFromFlip = isEnemy
        ? 0 // Already enemy: no gain
        : isMine
        ? 2 * (openNeighbors - tileMaintenance) // Mine: double loss - tile cost
        : // Empty: loss - tile cost + blocks mine - blocks enemy
          openNeighbors - tileMaintenance + meNeighbors - enemyNeighbors;
      const lossFromDisable = isMine ? openNeighbors : 0;

      // Estimates how much the enemy will spend on the tile
      // Adjusts for my distance and for their distance
      const totalValue =
        gainFromFlip / myDistance +
        gainFromDisable / myDistance +
        lossFromFlip +
        lossFromDisable;
      const estimatedEnemySpend = clamp(
        round(
          // Rounds to nearest applicable pressure
          (fractionOfGain * totalValue) / enemyDistance / minPressureInterval,
        ) * minPressureInterval,
        0,
        maxPressure,
      );

      const gains = range(2, maxPressure + 1, minPressureInterval).map(
        (pressure) => {
          if (pressure - estimatedEnemySpend > pressureToConquer) {
            return {
              ratio:
                (gainFromFlip + lossFromDisable + lossFromFlip) /
                (pressure * myDistance),
              pressure,
            };
          }
          if (pressure - estimatedEnemySpend > pressureToDisable) {
            return {
              ratio:
                (gainFromDisable + lossFromDisable + lossFromFlip) /
                (pressure * myDistance),
              pressure,
            };
          }
          if (pressure - estimatedEnemySpend === 0) {
            return {
              ratio: (lossFromDisable + lossFromFlip) / (pressure * myDistance),
              pressure,
            };
          }
          if (pressure - estimatedEnemySpend === -pressureToDisable) {
            return {
              ratio: lossFromFlip / (pressure * myDistance),
              pressure,
            };
          }
        },
      );

      const maxGain = maxBy(gains, 'ratio');

      return {
        ratio: maxGain?.ratio || 0,
        tilePressure: {
          ...coords,
          pressure: maxGain?.pressure || 0,
          distance: myDistance,
          clear: gainFromRemoval > minimumRemovalGain,
        },
      };
    })
    .sort((a, b) => b.ratio - a.ratio)
    .map(({ tilePressure }) => tilePressure);
};

export const getAiNextTurn = (game: Game) => {
  const bestActions = getBestActions(game);
  const nextTurn: NextTurn = {
    pressures: [],
  };

  let remainingInfluence = getPlayersInfluence(
    addBordersToBoard(game.boardState, game.boardSize),
  )[aiId];

  for (const action of bestActions) {
    if (remainingInfluence <= action.pressure) {
      nextTurn.pressures.push({ ...action, pressure: remainingInfluence });
    } else {
      nextTurn.pressures.push(action);
    }

    remainingInfluence -= action.pressure;
    if (remainingInfluence <= 0) break;
  }

  return nextTurn;
};

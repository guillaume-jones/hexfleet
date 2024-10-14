import { clamp, maxBy, range } from 'lodash';

import {
  Game,
  NextTurn,
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
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
import { floorToNearest, roundToNearest } from 'src/utils/math';

/** Minimum amount of influence gain to allow a clear
 */
const minClearGain = 1;

/** Estimate of enemy spending on defense.
 * Increase to make the AI more focused on defense.
 */
const enemySpendForValue = 0.2;

type TileAction = {
  ratio: number;
  tilePressure: TileWithPressure<TileCoords>;
};

const getBestActions = (game: Game) => {
  const { boardSize, boardState } = game;

  const tilesToClear: TileCoords[] = [];

  return boardState
    .map((tile) => {
      let isMine = tile.playerId === aiId;
      const isEnemy = tile.playerId && tile.playerId !== aiId;
      const isHomeworld = !!tile.homeworld;
      const coords = { x: tile.x, y: tile.y };

      /* Determines my costs */
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

      /* Determines enemy costs */
      const enemyDistance =
        findClosestTileWithId({
          coords,
          boardState,
          boardSize,
          maxDistance: maxInfluenceReach,
          id: aiId,
          invertSearch: true,
        }).distance || 1;
      const enemyCanReach = enemyDistance < Infinity;

      /* Determines borders */
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

      /* Determines if should clear */
      if (
        isMine &&
        !isHomeworld &&
        meNeighbors + tileMaintenance - openNeighbors - enemyNeighbors >
          minClearGain
      ) {
        tilesToClear.push(coords);
        isMine = false;
      }

      /* Determines gains & losses from changes */
      const gainFromFlipAndClear =
        openNeighbors + meNeighbors - enemyNeighbors - tileMaintenance;
      const gainFromFlip = 2 * (openNeighbors - tileMaintenance);

      if (isEnemy && !isHomeworld && gainFromFlipAndClear > gainFromFlip) {
        tilesToClear.push(coords);
      }

      const gainFromConquer = isMine
        ? 0 // Already mine: no gain
        : isEnemy && isHomeworld
        ? 25 // Enemy homeworld: win condition
        : isEnemy
        ? Math.max(gainFromFlipAndClear, gainFromFlip)
        : // Empty: gain - tile cost - blocks mine + blocks enemy
          openNeighbors - tileMaintenance - meNeighbors + enemyNeighbors;
      const gainFromDisable = isEnemy ? openNeighbors : 0;

      const lossFromFlipAndClear =
        openNeighbors + enemyNeighbors - meNeighbors - tileMaintenance;
      const lossFromFlip = 2 * (openNeighbors - tileMaintenance);

      const lossFromConquer =
        isEnemy || !enemyCanReach
          ? 0 // Already enemy or enemy cannot reach: no gain
          : isMine && isHomeworld && enemyCanReach
          ? 50 // My homeworld: loss condition
          : isMine
          ? Math.max(lossFromFlipAndClear, lossFromFlip)
          : // Empty: loss - tile cost + blocks mine - blocks enemy
            openNeighbors - tileMaintenance + meNeighbors - enemyNeighbors;
      const lossFromDisable = isMine && enemyCanReach ? openNeighbors : 0;

      /* Estimates how much the enemy will spend */
      let estimatedEnemySpend = 0;

      if (enemyCanReach) {
        // Calculates value, including my distance & enemy distance
        const totalValue =
          (gainFromConquer + gainFromDisable) / myDistance +
          (lossFromConquer + lossFromDisable) / enemyDistance;

        // Calculates spend, clamped within 2/4/6/8 range
        estimatedEnemySpend = clamp(
          roundToNearest(enemySpendForValue * totalValue, minPressureInterval),
          0,
          maxPressure,
        );
      }

      /* Evaluates all possible gains for 2/4/6/8 spend */
      const potentialGains = range(2, maxPressure + 1, minPressureInterval).map(
        (pressure) => {
          let estimatedGain = 0;

          if (pressure - estimatedEnemySpend >= pressureToConquer) {
            estimatedGain += gainFromConquer;
          } else if (pressure - estimatedEnemySpend >= pressureToDisable) {
            estimatedGain += gainFromDisable;
          }

          if (estimatedEnemySpend >= pressureToConquer) {
            if (estimatedEnemySpend - pressure < pressureToDisable) {
              estimatedGain += lossFromConquer;
            } else if (estimatedEnemySpend - pressure < pressureToConquer) {
              estimatedGain += lossFromConquer - lossFromDisable;
            }
          } else if (
            estimatedEnemySpend >= pressureToDisable &&
            estimatedEnemySpend - pressure < pressureToDisable
          ) {
            estimatedGain += lossFromDisable;
          }

          return {
            ratio: estimatedGain / (pressure * myDistance),
            pressure,
          };
        },
      );

      /* Calculates best gain and returns it */
      const maxGain = maxBy(potentialGains, 'ratio');
      if (!maxGain || maxGain.ratio === 0) return undefined;

      return {
        ratio: maxGain.ratio,
        tilePressure: {
          ...coords,
          pressure: maxGain.pressure,
          distance: myDistance,
        },
      };
    })
    .filter((action): action is TileAction => !!action)
    .sort((a, b) => b.ratio - a.ratio)
    .map(({ tilePressure }) => {
      tilePressure.clear = !!tilesToClear.find(
        ({ x, y }) => x === tilePressure.x && y === tilePressure.y,
      );

      return tilePressure;
    });
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
      // Should not half attack distant tiles or homeworlds
      if (action.distance > 1) {
        continue;
      }

      // Spends all remaining influence on last tile
      nextTurn.pressures.push({
        ...action,
        pressure: floorToNearest(remainingInfluence, minPressureInterval),
      });
      break;
    }

    nextTurn.pressures.push(action);
    remainingInfluence -= cost;
  }

  return nextTurn;
};

import {
  getAngleForNeighbor,
  getValidNeighbors,
} from '../board-utils/tileNeighbors';
import { TileWithBorders } from '../game-context/GameContextTypes';

import { Tile, TileWithPressure } from 'functions/src/document-types/Games';
import {
  pressureToConquer,
  pressureToDisable,
} from 'functions/src/game-logic/GameConstants';

export const addBordersToBoard = <T extends TileWithPressure<Tile>>(
  board?: T[],
  boardSize?: number,
  userId?: string,
): TileWithBorders[] => {
  if (!board || !boardSize) return [];

  return board.map((tile) => {
    const baseTile: TileWithBorders = {
      ...tile,
      borders: [],
      futurePlayerId: tile.pressure >= pressureToConquer ? userId : undefined,
      disabled:
        tile.playerId &&
        tile.playerId !== userId &&
        tile.pressure >= pressureToDisable &&
        tile.pressure < pressureToConquer,
    };

    if (!baseTile.playerId && !baseTile.futurePlayerId) return baseTile;

    const neighbors = getValidNeighbors(baseTile, boardSize);

    for (const { x: nx, y: ny } of neighbors) {
      const neighbor = board.find(({ x, y }) => x === nx && y === ny);
      // Skip tiles that are already held
      if (!neighbor || neighbor.playerId !== undefined) continue;

      baseTile.borders.push({
        angle: getAngleForNeighbor(baseTile, neighbor),
      });
    }

    return baseTile;
  });
};

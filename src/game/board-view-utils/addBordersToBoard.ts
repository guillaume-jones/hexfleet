import {
  getAngleForNeighbor,
  getValidNeighbors,
} from '../board-utils/tileNeighbors';
import { TileWithBorders } from '../game-context/GameContextTypes';

import { Tile } from 'functions/src/document-types/Games';

export const addBordersToBoard = <T extends Tile>(
  board?: T[],
  boardSize?: number,
): TileWithBorders<T>[] => {
  if (!board || !boardSize) return [];

  return board.map((tile) => {
    const baseTile: TileWithBorders<T> = { ...tile, borders: [] };

    if (tile.playerId === undefined) return baseTile;

    const neighbors = getValidNeighbors(tile, boardSize);

    for (const { x: nx, y: ny } of neighbors) {
      const neighbor = board.find(({ x, y }) => x === nx && y === ny);
      // Skip tiles that are already held
      if (!neighbor || neighbor.playerId !== undefined) continue;

      baseTile.borders.push({
        angle: getAngleForNeighbor(tile, neighbor),
      });
    }

    return baseTile;
  });
};

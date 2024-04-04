import { Tile, TileCoords } from 'functions/src/document-types/Games';
import { getValidNeighbors } from 'functions/src/game-logic/getValidNeighbors';

import { TileWithBorders } from 'src/game/game-context/GameContextTypes';

export const getAngleForNeighbor = (
  tile: TileCoords,
  neighbor: TileCoords,
): number => {
  const xDiff = neighbor.x - tile.x;
  const yDiff = neighbor.y - tile.y;

  // Horizontals
  if (yDiff === 0) {
    return 90 * xDiff;
  }
  // Row above
  if (yDiff === -1) {
    if (xDiff === -1) return -30;
    if (xDiff === 0) return 30;
  }
  // Row below
  if (yDiff === 1) {
    if (xDiff === 0) return -150;
    if (xDiff === 1) return 150;
  }
  return 0;
};

export const addBordersToBoard = <T extends Tile>(
  board?: T[],
  boardSize?: number,
): TileWithBorders<T>[] => {
  if (!board || !boardSize) return [];

  return board.map((tile) => {
    const baseTile: TileWithBorders<T> = { ...tile, borders: [] };

    if (!baseTile.playerId) return baseTile;

    const neighbors = getValidNeighbors({ tile: baseTile, boardSize });

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

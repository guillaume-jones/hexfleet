import {
  getAngleForNeighbor,
  getValidNeighbors,
} from '../board-utils/tileNeighbors';

import { Tile } from 'functions/src/document-types/Games';

export type Border = {
  angle: number;
};

export type TileWithBorders = Tile & {
  borders: Border[];
};

export const getSpecialBorders = (
  rawBoard?: Tile[],
  boardSize?: number,
): TileWithBorders[] => {
  if (!rawBoard || !boardSize) return [];

  return rawBoard.map((tile) => {
    const baseTile: TileWithBorders = { ...tile, borders: [] };

    if (tile.playerId === undefined) return baseTile;

    const neighbors = getValidNeighbors(tile, boardSize);

    for (const { x: nx, y: ny } of neighbors) {
      const neighbor = rawBoard.find(({ x, y }) => x === nx && y === ny);
      // Skip tiles that are already held
      if (!neighbor || neighbor.playerId !== undefined) continue;

      baseTile.borders.push({
        angle: getAngleForNeighbor(tile, neighbor),
      });
    }

    return baseTile;
  });
};

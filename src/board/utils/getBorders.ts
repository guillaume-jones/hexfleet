import { getAngleForNeighbor, getValidNeighbors } from './tileNeighbors';
import { TileState } from 'functions/src/document-types/Games';

export type Border = {
  angle: number;
  controlled: boolean;
};

export type TileStateWithBorders = TileState & {
  borders: Border[];
};

export const getSpecialBorders = (
  rawBoard: TileState[],
  boardSize: number,
): TileStateWithBorders[] => {
  return rawBoard.map((tile) => {
    const baseTile: TileStateWithBorders = { ...tile, borders: [] };

    if (tile.playerId === undefined) return baseTile;

    const neighbors = getValidNeighbors(tile, boardSize);

    for (const { x: nx, y: ny } of neighbors) {
      const neighbor = rawBoard.find(({ x, y }) => x === nx && y === ny);
      // Skip contiguous tiles
      if (!neighbor || neighbor.playerId === tile.playerId) continue;

      baseTile.borders.push({
        angle: getAngleForNeighbor(tile, neighbor),
        // Thicker border when border is not contested
        controlled: neighbor.playerId === undefined,
      });
    }

    return baseTile;
  });
};

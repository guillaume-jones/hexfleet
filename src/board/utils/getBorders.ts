import { getAngleForNeighbor, getValidNeighbors } from './tileNeighbors';
import { TileState } from 'functions/src/document-types/Games';

export type Border = {
  angle: number;
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
      // Skip tiles that are already held
      if (!neighbor || neighbor.playerId !== undefined) continue;

      baseTile.borders.push({
        angle: getAngleForNeighbor(tile, neighbor),
      });
    }

    return baseTile;
  });
};

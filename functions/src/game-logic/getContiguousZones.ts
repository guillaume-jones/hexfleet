import { Tile } from '../document-types/Games';

import { getValidNeighbors } from './getValidNeighbors';

type CountedTileState = Tile & { counted?: boolean };

const getSameNeighbors = (
  tiles: Tile[],
  { board, boardSize }: { board: CountedTileState[]; boardSize: number },
): Tile[] => {
  if (tiles.length === 0) return [];

  return tiles.flatMap((tile): Tile[] => {
    const neighbors = getValidNeighbors({ tile, boardSize, distance: 1 })
      .map(({ x, y }) => board.find(({ x: x2, y: y2 }) => x === x2 && y === y2))
      .filter((neighbor): neighbor is CountedTileState => !!neighbor);

    const sameUniqueNeighbors = neighbors.filter((neighbor) => {
      if (
        neighbor.playerId !== undefined &&
        neighbor.playerId === tile.playerId &&
        !neighbor.counted
      ) {
        neighbor.counted = true;
        return true;
      }
      return false;
    });

    return [
      tile,
      ...getSameNeighbors(sameUniqueNeighbors, { board, boardSize }),
    ];
  });
};

export const getContiguousZones = (
  rawBoard: Tile[],
  boardSize: number,
): Tile[][] => {
  const board: CountedTileState[] = [...rawBoard];
  const zones: Tile[][] = [];

  for (const tile of board) {
    if (tile.counted || !tile.playerId) continue;

    tile.counted = true;
    zones.push(getSameNeighbors([tile], { board, boardSize }));
  }

  return zones;
};

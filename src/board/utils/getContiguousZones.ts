import { getTileNeighbors } from './getTileNeighbors';
import { TileState } from 'functions/src/document-types/Games';

type CountedTileState = TileState & { counted?: boolean };

const getSameNeighbors = (
  tiles: TileState[],
  { board, boardSize }: { board: CountedTileState[]; boardSize: number },
): TileState[] => {
  if (tiles.length === 0) return [];

  return tiles.flatMap((tile): TileState[] => {
    const neighbors = getTileNeighbors(tile, boardSize)
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
    });

    return [
      tile,
      ...getSameNeighbors(sameUniqueNeighbors, { board, boardSize }),
    ];
  });
};

export const getContiguousZones = (
  rawBoard: TileState[],
  boardSize: number,
): TileState[][] => {
  const board: CountedTileState[] = [...rawBoard];
  const zones: TileState[][] = [];

  for (const tile of board) {
    if (tile.counted || !tile.playerId) continue;

    tile.counted = true;
    zones.push(getSameNeighbors([tile], { board, boardSize }));
  }

  return zones;
};

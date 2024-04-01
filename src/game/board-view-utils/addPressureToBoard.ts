import {
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

export const addPressuresToBoard = <T extends Tile>(
  board: T[] | undefined,
  tilePressures: TileWithPressure<TileCoords>[],
): TileWithPressure<T>[] => {
  if (!board) return [];

  return board?.map((tile) => {
    const tilePressure = tilePressures.find(
      (pressure) => pressure.x === tile.x && pressure.y === tile.y,
    );

    return {
      ...tile,
      pressure: tilePressure?.pressure ?? 0,
      clear: tilePressure?.clear,
    };
  });
};

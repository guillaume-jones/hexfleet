import { BoardState, TileCoords } from '../document-types/Games';
import range from 'lodash/range';

import { ValidDistance, getValidNeighbors } from './getValidNeighbors';

export const findClosestTileWithId = ({
  coords,
  boardState,
  boardSize,
  id,
  maxDistance,
}: {
  coords: TileCoords;
  boardState: BoardState;
  boardSize: number;
  id: string;
  maxDistance: ValidDistance;
}) => {
  let distance: ValidDistance;
  for (distance of range(0, maxDistance + 1) as ValidDistance[]) {
    const neighbors = getValidNeighbors({ tile: coords, boardSize, distance });
    for (const { x, y } of neighbors) {
      const tile = boardState.find((t) => t.x === x && t.y === y);
      if (tile?.playerId === id) return { tile, distance };
    }
  }

  return undefined;
};

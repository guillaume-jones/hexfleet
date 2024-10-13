import { BoardState, TileCoords } from '../document-types/Games';
import range from 'lodash/range';

import { getTileModifier } from './getTileModifier';
import { ValidDistance, getValidNeighbors } from './getValidNeighbors';

export const findClosestTileWithId = ({
  coords,
  boardState,
  boardSize,
  id,
  maxDistance,
  invertSearch,
}: {
  coords: TileCoords;
  boardState: BoardState;
  boardSize: number;
  id: string;
  maxDistance: ValidDistance;
  invertSearch?: boolean;
}) => {
  let distance: ValidDistance;
  const modifier = getTileModifier({
    boardState,
    coords,
    id: invertSearch ? undefined : id,
  });

  for (distance of range(0, maxDistance + 1) as ValidDistance[]) {
    const neighbors = getValidNeighbors({ tile: coords, boardSize, distance });
    for (const { x, y } of neighbors) {
      const tile = boardState.find((t) => t.x === x && t.y === y);
      if (!tile?.playerId) continue;

      if (invertSearch ? tile.playerId !== id : tile.playerId === id) {
        return { tile, distance: Math.max(distance, 1) * modifier };
      }
    }
  }

  return { tile: undefined, distance: Infinity };
};

import {
  BoardState,
  TileCoords,
  TileWithPressure,
} from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';
import { findClosestTileWithId } from './findClosestTileWithId';

export const validatePressureTile = ({
  tile: { x, y, pressure, clear, distance },
  boardState,
  boardSize,
  id,
}: {
  tile: TileWithPressure<TileCoords>;
  boardState: BoardState;
  boardSize: number;
  id: string;
}): boolean => {
  // Tests if user was eligible to clear the tile
  if (clear) {
    const tile = boardState.find(({ x, y }) => x === x && y === y);
    if (tile?.playerId !== id) return false;
    if (tile.homeworld) return false;
  }

  if (!pressure) return true;

  // Tests if user applied correct pressure
  const closestTile = findClosestTileWithId({
    coords: { x, y },
    boardState,
    boardSize,
    id,
    maxDistance: maxInfluenceReach,
  });

  if (!closestTile || closestTile.distance !== distance) return false;

  return true;
};

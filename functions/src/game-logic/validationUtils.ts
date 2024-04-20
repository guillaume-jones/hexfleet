import {
  BoardState,
  TileCoords,
  TileWithPressure,
} from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';
import { findClosestTileWithId } from './findClosestTileWithId';
import { canApplyPressure } from './tileActionTests';

export const validateTileWithPressure = ({
  tileCoords,
  boardState,
  boardSize,
  playerId,
}: {
  tileCoords: TileWithPressure<TileCoords>;
  boardState: BoardState;
  boardSize: number;
  playerId: string;
}): boolean => {
  if (!tileCoords.pressure) return true;

  const { distance } = findClosestTileWithId({
    coords: tileCoords,
    boardState,
    boardSize,
    id: playerId,
    maxDistance: maxInfluenceReach,
  });

  return tileCoords.distance === distance && canApplyPressure(tileCoords);
};

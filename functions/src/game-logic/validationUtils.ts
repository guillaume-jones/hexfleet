import {
  BoardState,
  TileCoords,
  TileWithPressure,
} from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';
import { findClosestTileWithId } from './findClosestTileWithId';
import { getTileModifier } from './getTileModifier';
import { canApplyPressure } from './tileActionTests';

export const validateTileWithPressure = ({
  tileCoords,
  boardState,
  boardSize,
  id,
}: {
  tileCoords: TileWithPressure<TileCoords>;
  boardState: BoardState;
  boardSize: number;
  id: string;
}): boolean => {
  if (!tileCoords.pressure) return true;

  const tile = boardState.find(
    (t) => t.x === tileCoords.x && t.y === tileCoords.y,
  );

  const { distance } = findClosestTileWithId({
    coords: tileCoords,
    boardState,
    boardSize,
    id,
    maxDistance: maxInfluenceReach,
    modifier: getTileModifier({ tile, playerId: id }),
  });

  return tileCoords.distance === distance && canApplyPressure(tileCoords);
};

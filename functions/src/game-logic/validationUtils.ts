import {
  BoardState,
  Tile,
  TileCoords,
  TileWithPressure,
} from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';
import { findClosestTileWithId } from './findClosestTileWithId';
import { canApplyPressure, canClear } from './tileActionTests';

export const validateTilePressure = ({
  tile,
  boardState,
  boardSize,
  id,
}: {
  tile: TileWithPressure<TileCoords>;
  boardState: BoardState;
  boardSize: number;
  id: string;
}): boolean => {
  if (!tile.pressure) return true;

  const { distance } = findClosestTileWithId({
    coords: tile,
    boardState,
    boardSize,
    id,
    maxDistance: maxInfluenceReach,
  });

  return tile.distance === distance && canApplyPressure(tile);
};

export const validateTileClear = ({
  tile,
  id,
}: {
  tile: TileWithPressure<Tile>;
  id: string;
}): boolean => {
  if (!tile.clear) return true;

  return canClear(tile, id);
};

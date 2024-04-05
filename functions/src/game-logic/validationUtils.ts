import { BoardState, Tile, TileWithPressure } from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';
import { findClosestTileWithId } from './findClosestTileWithId';
import { canApplyPressure, canClear } from './tileActionTests';

export const validateTileDistance = ({
  tile,
  boardState,
  boardSize,
  id,
}: {
  tile: TileWithPressure<Tile>;
  boardState: BoardState;
  boardSize: number;
  id: string;
}): boolean => {
  const { distance } = findClosestTileWithId({
    coords: tile,
    boardState,
    boardSize,
    id,
    maxDistance: maxInfluenceReach,
  });

  return tile.distance === distance;
};

export const validateTileAction = ({
  tile,
  id,
}: {
  tile: TileWithPressure<Tile>;
  boardState: BoardState;
  boardSize: number;
  id: string;
}): boolean => {
  if (tile.clear && !canClear(tile, id)) return false;
  if (tile.pressure && !canApplyPressure(tile)) return false;

  return true;
};

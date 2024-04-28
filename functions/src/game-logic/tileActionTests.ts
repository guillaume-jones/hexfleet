import { Tile, TileCoords, TileWithPressure } from '../document-types/Games';

import { maxPressure } from './GameConstants';

export const canClear = (
  tile: Pick<TileWithPressure<Tile>, 'homeworld' | 'playerId' | 'clear'>,
  userId?: string,
) => !tile.homeworld && (tile.playerId === userId || tile.clear);

export const canApplyPressure = (
  tile: Pick<TileWithPressure<TileCoords>, 'distance' | 'pressure'>,
) =>
  tile.distance < Infinity &&
  tile.pressure >= 0 &&
  tile.pressure <= maxPressure;

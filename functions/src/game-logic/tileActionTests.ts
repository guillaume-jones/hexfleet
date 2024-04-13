import { Tile, TileCoords, TileWithPressure } from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';

export const canClear = (
  tile?: Pick<TileWithPressure<Tile>, 'homeworld' | 'playerId' | 'clear'>,
) => tile !== undefined && !tile.homeworld && (tile.playerId || tile.clear);

export const canApplyPressure = (
  tile?: Pick<TileWithPressure<TileCoords>, 'distance' | 'pressure'>,
) =>
  tile !== undefined &&
  tile.distance <= maxInfluenceReach &&
  tile.pressure >= 0;

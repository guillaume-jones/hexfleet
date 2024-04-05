import { Tile, TileCoords, TileWithPressure } from '../document-types/Games';

import { maxInfluenceReach } from './GameConstants';

export const canClear = (
  tile?: Pick<Tile, 'homeworld' | 'playerId'>,
  id?: string,
) => tile !== undefined && !tile.homeworld && tile.playerId === id;

export const canApplyPressure = (
  tile?: Pick<TileWithPressure<TileCoords>, 'distance' | 'pressure'>,
) =>
  tile !== undefined &&
  tile.distance <= maxInfluenceReach &&
  tile.pressure >= 0;

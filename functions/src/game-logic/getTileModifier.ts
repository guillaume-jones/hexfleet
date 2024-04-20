import { Tile } from '../document-types/Games';

import { homeworldDistanceModifier } from './GameConstants';

export const getTileModifier = ({
  tile,
  playerId,
}: {
  tile?: Tile;
  playerId?: string;
}) => {
  if (tile?.homeworld && tile?.playerId !== playerId)
    return homeworldDistanceModifier;

  return 1;
};

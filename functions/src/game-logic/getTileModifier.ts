import { BoardState, TileCoords } from '../document-types/Games';

import { homeworldDistanceModifier } from './GameConstants';

export const getTileModifier = ({
  boardState,
  coords,
  id,
}: {
  boardState: BoardState;
  coords?: TileCoords;
  id?: string;
}) => {
  const tile = boardState.find((t) => t.x === coords?.x && t.y === coords?.y);

  if (tile?.homeworld && tile?.playerId !== id)
    return homeworldDistanceModifier;

  return 1;
};

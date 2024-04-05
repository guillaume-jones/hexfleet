import { NextTurn, Tile, TileWithBorders } from '../document-types/Games';
import countBy from 'lodash/countBy';

import { pressureToClear } from './GameConstants';

export const getInfluenceSpent = (nextTurn?: NextTurn) => {
  if (!nextTurn) return 0;
  return nextTurn.pressures.reduce(
    (influenceSpent, { pressure, distance, clear }) =>
      influenceSpent + pressure * distance + (clear ? pressureToClear : 0),
    0,
  );
};

export const getPlayersInfluence = <T extends Tile>(
  boardWithBorders: TileWithBorders<T>[],
) => {
  return countBy(
    boardWithBorders.flatMap(({ borders, playerId }) =>
      borders.map(() => playerId),
    ),
  );
};

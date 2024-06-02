import { NextTurn, Tile, TileWithBorders } from '../document-types/Games';
import { Dictionary, countBy } from 'lodash';

import {
  pressureToClear,
  startingInfluence,
  tileMaintenance,
} from './GameConstants';

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
  const borderCounts = countBy(
    boardWithBorders.flatMap(({ borders, playerId }) =>
      borders.map(() => playerId),
    ),
  );
  const tileCounts = countBy(boardWithBorders.map(({ playerId }) => playerId));
  const influenceByPlayer: Dictionary<number> = {};

  for (const playerId in borderCounts) {
    influenceByPlayer[playerId] =
      startingInfluence +
      borderCounts[playerId] -
      tileCounts[playerId] * tileMaintenance;
  }

  return influenceByPlayer;
};

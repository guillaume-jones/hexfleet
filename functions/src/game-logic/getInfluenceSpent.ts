import { NextTurn } from '../document-types/Games';

import { pressureToClear } from './GameConstants';

export const getInfluenceSpent = (nextTurn: NextTurn) => {
  return nextTurn.pressures.reduce(
    (influenceSpent, { pressure, distance, clear }) =>
      influenceSpent + pressure * distance + (clear ? pressureToClear : 0),
    0,
  );
};

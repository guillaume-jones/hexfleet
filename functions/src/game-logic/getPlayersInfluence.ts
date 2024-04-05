import { Tile, TileWithBorders } from '../document-types/Games';
import countBy from 'lodash/countBy';

export const getPlayersInfluence = <T extends Tile>(
  boardWithBorders: TileWithBorders<T>[],
) => {
  return countBy(
    boardWithBorders.flatMap(({ borders, playerId }) =>
      borders.map(() => playerId),
    ),
  );
};

import { Tile } from '../document-types/Games';

export const removeDisabled = <T extends Tile>(boardState: T[]): Tile[] => {
  return boardState.map(({ disabled, ...tile }) => {
    return tile;
  });
};

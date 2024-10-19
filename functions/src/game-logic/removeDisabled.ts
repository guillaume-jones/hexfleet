import { Tile } from '../document-types/Games';

export const removeDisabled = <T extends Tile>(boardState: T[]): T[] => {
  return boardState.map((tile) => {
    return { ...tile, disabled: false };
  });
};

import { BoardState } from 'functions/src/document-types/Games';

export const getIndexOfBoardDifferences = (
  a: BoardState,
  b: BoardState,
): number[] => {
  return a
    .map((aTile, i) => {
      const bTile = b[i];
      if (
        aTile.disabled === bTile.disabled &&
        aTile.playerId === bTile.playerId
      ) {
        return -1;
      }
      return i;
    })
    .filter((el) => el > -1);
};

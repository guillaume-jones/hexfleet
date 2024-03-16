import { TileState } from 'functions/src/document-types/Games';

export const generateBoard = (
  boardSize: number,
  options?: { testBoard?: true },
): TileState[] => {
  const tiles = [];
  const testBoard = options?.testBoard;

  for (let y = 0; y < boardSize; y++)
    for (let x = 0; x < boardSize; x++)
      if (Math.abs(x - y) < boardSize / 2)
        tiles.push({
          x,
          y,
          playerId:
            testBoard &&
            (Math.random() > 0.5
              ? Math.random() > 0.5
                ? 'abc'
                : 'def'
              : undefined),
        });

  return tiles;
};

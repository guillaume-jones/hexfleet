import { clamp } from 'lodash';

import { Tile } from 'functions/src/document-types/Games';

export type BoardOptions = {
  boardSize: number;
};

export const defaultBoardOptions = {
  boardSize: 9,
  playerCount: 2,
};

export const generateBoard = ({ boardSize }: BoardOptions): Tile[] => {
  boardSize = clamp(boardSize, 5, 50);

  const tiles: Tile[] = [];

  for (let y = 0; y < boardSize; y++)
    for (let x = 0; x < boardSize; x++)
      if (Math.abs(x - y) < boardSize / 2)
        tiles.push({
          x,
          y,
        });

  return tiles;
};

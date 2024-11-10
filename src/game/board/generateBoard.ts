import clamp from 'lodash/clamp';

import { Tile } from 'functions/src/document-types/Games';
import {
  maxBoardSize,
  minBoardSize,
} from 'functions/src/game-logic/GameConstants';

export type BoardOptions = {
  boardSize: number;
  boardState?: Tile[];
};

export const generateBoard = ({
  boardSize,
  boardState,
}: BoardOptions): Tile[] => {
  if (boardState) return boardState;

  boardSize = clamp(boardSize, minBoardSize, maxBoardSize);

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

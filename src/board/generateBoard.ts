import { TileStructure } from 'functions/src/document-types/Games';

export const generateBoard = (boardSize: number): TileStructure[] => {
  const tiles = [];

  for (let y = 0; y < boardSize; y++)
    for (let x = 0; x < boardSize; x++)
      tiles.push({ x, y, inPlay: Math.abs(x - y) < boardSize / 2 });

  return tiles;
};

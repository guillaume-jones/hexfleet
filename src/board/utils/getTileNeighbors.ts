import { Tile } from 'functions/src/document-types/Games';

export const getTileNeighbors = ({ x, y }: Tile, boardSize: number): Tile[] => {
  const neighbors = [];

  const inTopRight = x - (y - 1) > boardSize / 2;
  const inTopLeft = y + 1 - x > boardSize / 2;

  // Horizontal neighbors
  if (x > 0 && !inTopLeft) neighbors.push({ x: x - 1, y });
  if (x < boardSize - 1 && !inTopRight) neighbors.push({ x: x + 1, y });
  // Row above
  if (y > 0) {
    if (x > 0) neighbors.push({ x: x - 1, y: y - 1 });
    if (!inTopRight) neighbors.push({ x, y: y - 1 });
  }
  // Row below
  if (y < boardSize - 1) {
    if (x < boardSize - 1) neighbors.push({ x: x + 1, y: y + 1 });
    if (!inTopLeft) neighbors.push({ x, y: y + 1 });
  }

  return neighbors;
};

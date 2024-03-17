import { TileCoords } from 'functions/src/document-types/Games';

export const getValidNeighbors = (
  { x, y }: TileCoords,
  boardSize: number,
): TileCoords[] => {
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

export const getAngleForNeighbor = (
  tile: TileCoords,
  neighbor: TileCoords,
): number => {
  const xDiff = neighbor.x - tile.x;
  const yDiff = neighbor.y - tile.y;

  // Horizontals
  if (yDiff === 0) {
    return 90 * xDiff;
  }
  // Row above
  if (yDiff === -1) {
    if (xDiff === -1) return -30;
    if (xDiff === 0) return 30;
  }
  // Row below
  if (yDiff === 1) {
    if (xDiff === 0) return -150;
    if (xDiff === 1) return 150;
  }
  return 0;
};

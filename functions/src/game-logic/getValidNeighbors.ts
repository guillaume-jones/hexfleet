import { TileCoords } from '../document-types/Games';

// Not an elegant solution, but most efficient I could find for now
const getNeighborsForDistance = [
  (x: number, y: number) => {
    return [{ x, y }];
  },
  (x: number, y: number) => {
    return [
      { x: x - 1, y: y - 1 },
      { x, y: y - 1 },
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
  },
  (x: number, y: number) => {
    return [
      { x: x - 2, y: y - 2 },
      { x: x - 1, y: y - 2 },
      { x, y: y - 2 },
      { x: x + 1, y: y - 1 },
      { x: x + 2, y },
      { x: x + 2, y: y + 1 },
      { x: x + 2, y: y + 2 },
      { x: x + 1, y: y + 2 },
      { x, y: y + 2 },
      { x: x - 1, y: y + 1 },
      { x: x - 2, y },
      { x: x - 2, y: y - 1 },
    ];
  },
  (x: number, y: number) => {
    return [
      { x: x - 3, y: y - 3 },
      { x: x - 2, y: y - 3 },
      { x: x - 1, y: y - 3 },
      { x, y: y - 3 },
      { x: x + 1, y: y - 2 },
      { x: x + 2, y: y - 1 },
      { x: x + 3, y },
      { x: x + 3, y: y + 1 },
      { x: x + 3, y: y + 2 },
      { x: x + 3, y: y + 3 },
      { x: x + 2, y: y + 3 },
      { x: x + 1, y: y + 3 },
      { x, y: y + 3 },
      { x: x - 1, y: y + 2 },
      { x: x - 2, y: y + 1 },
      { x: x - 3, y },
      { x: x - 3, y: y - 1 },
      { x: x - 3, y: y - 2 },
    ];
  },
  (x: number, y: number) => {
    return [
      { x: x - 4, y: y - 4 },
      { x: x - 3, y: y - 4 },
      { x: x - 2, y: y - 4 },
      { x: x - 1, y: y - 4 },
      { x, y: y - 4 },
      { x: x + 1, y: y - 3 },
      { x: x + 2, y: y - 2 },
      { x: x + 3, y: y - 1 },
      { x: x + 4, y },
      { x: x + 4, y: y + 1 },
      { x: x + 4, y: y + 2 },
      { x: x + 4, y: y + 3 },
      { x: x + 4, y: y + 4 },
      { x: x + 3, y: y + 4 },
      { x: x + 2, y: y + 4 },
      { x: x + 1, y: y + 4 },
      { x, y: y + 4 },
      { x: x - 1, y: y + 3 },
      { x: x - 2, y: y + 2 },
      { x: x - 3, y: y + 1 },
      { x: x - 4, y },
      { x: x - 4, y: y - 1 },
      { x: x - 4, y: y - 2 },
      { x: x - 4, y: y - 3 },
    ];
  },
];

export type ValidDistance = 1 | 2 | 3 | 4;

export const getValidNeighbors = ({
  tile: { x, y },
  boardSize,
  distance = 1,
}: {
  tile: TileCoords;
  boardSize: number;
  distance?: ValidDistance;
}): TileCoords[] => {
  const validNeighbors = [];
  const allNeighbors = getNeighborsForDistance[distance](x, y);
  for (const neighbor of allNeighbors) {
    if (
      neighbor.x >= 0 &&
      neighbor.x < boardSize &&
      neighbor.y >= 0 &&
      neighbor.y < boardSize &&
      neighbor.x - neighbor.y < boardSize / 2 &&
      neighbor.y - neighbor.x < boardSize / 2
    ) {
      validNeighbors.push(neighbor);
    }
  }
  return validNeighbors;
};

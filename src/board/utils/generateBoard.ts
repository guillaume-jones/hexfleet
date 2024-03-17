import { Tile, TileCoords } from 'functions/src/document-types/Games';

export type BoardOptions = {
  boardSize: number;
  players: string[];
};

const getStartPositions = ({
  boardSize,
  players,
}: BoardOptions): TileCoords[] => {
  const allPositions = [
    { x: Math.round((boardSize - 1) / 4), y: 0 },
    { x: Math.round((boardSize - 1) * (3 / 4)), y: Math.round(boardSize / 4) },
    { x: boardSize - 1, y: Math.round((boardSize - 1) * (3 / 4)) },
    { x: Math.round(boardSize * (3 / 4) - 1), y: boardSize - 1 },
    {
      x: Math.round((boardSize - 2) / 4),
      y: Math.round((boardSize - 1.5) * (3 / 4)),
    },
    { x: 0, y: Math.round((boardSize - 2) / 4) },
  ];

  return players.map((_, i) => {
    return allPositions[Math.floor((i * 6) / players.length)];
  });
};

export const generateBoard = ({ boardSize, players }: BoardOptions): Tile[] => {
  const tiles: Tile[] = [];

  for (let y = 0; y < boardSize; y++)
    for (let x = 0; x < boardSize; x++)
      if (Math.abs(x - y) < boardSize / 2)
        tiles.push({
          x,
          y,
        });

  getStartPositions({ boardSize, players }).forEach(({ x, y }, i) => {
    const tile = tiles.find((t) => t.x === x && t.y === y);
    if (tile) {
      tile.playerId = players[i];
      tile.homeworld = true;
    }
  });

  return tiles;
};

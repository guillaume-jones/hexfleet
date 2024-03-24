import { Tile, TileCoords } from 'functions/src/document-types/Games';

const getStartPositions = ({
  boardSize,
  players,
}: {
  boardSize: number;
  players: string[];
}): TileCoords[] => {
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

export const addPlayersToBoard = ({
  board,
  boardSize,
  players,
}: {
  board: Tile[];
  boardSize: number;
  players: string[];
}): Tile[] => {
  const boardWithPlayers = [...board];
  getStartPositions({ boardSize, players }).forEach(({ x, y }, i) => {
    const tile = boardWithPlayers.find((t) => t.x === x && t.y === y);
    if (tile) {
      tile.playerId = players[i];
      tile.homeworld = true;
    }
  });

  return boardWithPlayers;
};

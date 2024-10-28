import { TileWithDistances } from './tiles-distances';
import { Tile } from 'functions/src/document-types/Games';
import { getValidNeighbors } from 'functions/src/game-logic/getValidNeighbors';

export type TileWithNeighbors = TileWithDistances & {
  neighbors: NeighborCounts;
};

export type NeighborCounts = {
  tiles: Tile[];
  open: number;
  me: number;
  enemy: number;
  all: number;
};

export const getNeighborCounts = ({
  boardState,
  boardSize,
  myId,
}: {
  boardState: TileWithDistances[];
  boardSize: number;
  myId: string;
}): TileWithNeighbors[] =>
  boardState.map((tile) => {
    const neighbors = getValidNeighbors({ tile, boardSize })
      .map(({ x, y }) =>
        boardState.find((tile) => tile.x === x && tile.y === y),
      )
      .filter((tile): tile is TileWithDistances => tile !== undefined);

    return {
      ...tile,
      neighbors: {
        tiles: neighbors,
        all: neighbors.length,
        open: neighbors.filter(({ playerId }) => !playerId).length,
        me: neighbors.filter(({ playerId }) => playerId === myId).length,
        enemy: neighbors.filter(({ playerId }) => playerId && playerId !== myId)
          .length,
      },
    };
  });

export const applyNeighborCountUpdate = ({
  initialId,
  finalId,
  x,
  y,
  neighbors,
  boardState,
  myId,
}: {
  initialId?: string;
  finalId?: string;
  x: number;
  y: number;
  neighbors: NeighborCounts;
  boardState: TileWithNeighbors[];
  myId: string;
}) => {
  if (initialId === finalId) return;

  const openUpdate =
    finalId === undefined ? 1 : initialId === undefined ? -1 : 0;
  const meUpdate = finalId === myId ? 1 : initialId === myId ? -1 : 0;
  const enemyUpdate =
    finalId && finalId !== myId ? 1 : initialId && initialId !== myId ? -1 : 0;

  for (const tile of boardState) {
    if (tile.x === x && tile.y === y) {
      tile.playerId = finalId;
    }

    if (neighbors.tiles.find((v) => v.x === tile.x && v.y === tile.y)) {
      tile.neighbors.open += openUpdate;
      tile.neighbors.me += meUpdate;
      tile.neighbors.enemy += enemyUpdate;
    }
  }
};

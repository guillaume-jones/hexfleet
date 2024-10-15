import { Tile } from 'functions/src/document-types/Games';
import { getValidNeighbors } from 'functions/src/game-logic/getValidNeighbors';

import { aiId } from 'src/game/create-game/createGame';

export type NeighborCounts = {
  open: number;
  me: number;
  enemy: number;
  all: number;
  neighbors: Tile[];
};

export const getNeighborCounts = ({
  tile,
  boardState,
  boardSize,
}: {
  tile: Tile;
  boardState: Tile[];
  boardSize: number;
}): NeighborCounts => {
  const neighbors = getValidNeighbors({ tile, boardSize })
    .map(({ x, y }) => boardState.find((tile) => tile.x === x && tile.y === y))
    .filter((tile): tile is Tile => tile !== undefined);

  return {
    neighbors: neighbors,
    all: neighbors.length,
    open: neighbors.filter(({ playerId }) => !playerId).length,
    me: neighbors.filter(({ playerId }) => playerId === aiId).length,
    enemy: neighbors.filter(({ playerId }) => playerId && playerId !== aiId)
      .length,
  };
};

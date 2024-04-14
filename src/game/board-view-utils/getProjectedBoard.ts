import {
  NextTurn,
  Player,
  Tile,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { maxInfluenceReach } from 'functions/src/game-logic/GameConstants';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';

export type ProjectedTile<T extends Tile> = TileWithPressure<T> & {
  previousPlayerId?: string;
};

const defaultTileWithPressure = {
  pressure: 0,
  distance: 0,
  clear: false,
};

export const getProjectedBoard = ({
  boardState,
  boardSize,
  nextTurn,
  players,
  userId,
}: {
  boardState?: Tile[];
  boardSize?: number;
  nextTurn?: NextTurn;
  players?: Player[];
  userId?: string;
}): ProjectedTile<Tile>[] => {
  if (!boardState || !boardSize) return [];

  if (!nextTurn || !userId) {
    return boardState.map((tile) => ({ ...tile, ...defaultTileWithPressure }));
  }

  const newBoardState = calculateNewBoardState(
    boardState,
    [nextTurn],
    [userId],
    true,
  );
  const deadPlayers = (players ?? [])
    .filter((player) => player.dead)
    .map((player) => player.id);

  return newBoardState?.map((tile, i) => {
    const tilePressure =
      nextTurn.pressures.find(
        (pressure) => pressure.x === tile.x && pressure.y === tile.y,
      ) ?? defaultTileWithPressure;
    const closestOwnTile = findClosestTileWithId({
      coords: { x: tile.x, y: tile.y },
      boardState,
      boardSize,
      id: userId,
      maxDistance: maxInfluenceReach,
    });

    return {
      ...tile,
      ...tilePressure,
      previousPlayerId: boardState[i].playerId,
      distance: closestOwnTile.distance,
      disabled: tile.disabled || deadPlayers.includes(tile.playerId ?? ''),
    };
  });
};

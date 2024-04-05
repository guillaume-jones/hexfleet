import {
  NextTurn,
  Tile,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';

export type ProjectedTile<T extends Tile> = TileWithPressure<T> & {
  previousPlayerId?: string;
};

export const getProjectedBoard = ({
  boardState,
  boardSize,
  nextTurn,
  userId,
}: {
  boardState?: Tile[];
  boardSize?: number;
  nextTurn?: NextTurn;
  userId?: string;
}): ProjectedTile<Tile>[] => {
  if (!boardState || !boardSize) return [];

  if (!nextTurn || !userId)
    return boardState.map((tile) => ({ ...tile, pressure: 0, distance: 0 }));

  const newBoardState = calculateNewBoardState(
    boardState,
    [nextTurn],
    [userId],
  );

  return newBoardState?.map((tile, i) => {
    const tilePressure = nextTurn.pressures.find(
      (pressure) => pressure.x === tile.x && pressure.y === tile.y,
    );
    const closestOwnTile = findClosestTileWithId({
      coords: { x: tile.x, y: tile.y },
      boardState,
      boardSize,
      id: userId,
      maxDistance: 3,
    });

    return {
      ...tile,
      previousPlayerId: boardState[i].playerId,
      pressure: tilePressure?.pressure ?? 0,
      clear: tilePressure?.clear,
      distance: closestOwnTile?.distance ?? -1,
    };
  });
};

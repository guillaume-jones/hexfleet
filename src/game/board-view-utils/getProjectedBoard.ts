import {
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';

import { ProjectedTile } from 'src/game/game-context/GameContextTypes';

export const getProjectedBoard = (
  boardState: Tile[] | undefined,
  tilePressures?: TileWithPressure<TileCoords>[],
  userId?: string,
): ProjectedTile<Tile>[] => {
  if (!boardState) return [];

  if (!tilePressures || !userId)
    return boardState.map((tile) => ({ ...tile, pressure: 0, distance: 0 }));

  const newBoardState = calculateNewBoardState(
    boardState,
    [{ pressures: tilePressures }],
    [userId],
  );

  return newBoardState?.map((tile, i) => {
    const tilePressure = tilePressures.find(
      (pressure) => pressure.x === tile.x && pressure.y === tile.y,
    );
    const closestOwnTile = findClosestTileWithId({
      coords: { x: tile.x, y: tile.y },
      boardState,
      boardSize: 7,
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

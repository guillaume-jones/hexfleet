import { ProjectedTile } from '../game-context/GameContextTypes';

import {
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';

export const getProjectedBoard = (
  boardState: Tile[] | undefined,
  tilePressures?: TileWithPressure<TileCoords>[],
  userId?: string,
): ProjectedTile<Tile>[] => {
  if (!boardState) return [];

  if (!tilePressures || !userId)
    return boardState.map((tile) => ({ ...tile, pressure: 0 }));

  const newBoardState = calculateNewBoardState(
    boardState,
    [{ pressures: tilePressures }],
    [userId],
  );

  return newBoardState?.map((tile, i) => {
    const tilePressure = tilePressures.find(
      (pressure) => pressure.x === tile.x && pressure.y === tile.y,
    );

    return {
      ...tile,
      previousPlayerId: boardState[i].playerId,
      pressure: tilePressure?.pressure ?? 0,
      clear: tilePressure?.clear,
    };
  });
};

import {
  NextTurn,
  Player,
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { maxInfluenceReach } from 'functions/src/game-logic/GameConstants';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';

export type ProjectedTile = TileWithPressure<Tile> & {
  previousPlayerId?: string;
  selected: boolean;
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
  selectedTile,
  isInPast,
}: {
  boardState?: Tile[];
  boardSize?: number;
  nextTurn?: NextTurn;
  players?: Player[];
  userId?: string;
  selectedTile?: TileCoords;
  isInPast?: boolean;
}): ProjectedTile[] => {
  if (!boardState || !boardSize || !userId) return [];

  if (isInPast) nextTurn = undefined;

  const newBoardState = calculateNewBoardState(
    boardState,
    nextTurn ? [nextTurn] : [],
    nextTurn ? [userId] : [],
    true,
  );
  const deadPlayers = (players ?? [])
    .filter((player) => player.dead)
    .map((player) => player.id);

  return newBoardState?.map((tile, i) => {
    const tilePressure =
      nextTurn?.pressures.find(
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
      disabled:
        tile.disabled ||
        (!isInPast && deadPlayers.includes(tile.playerId ?? '')),
      selected: selectedTile?.x === tile.x && selectedTile?.y === tile.y,
    };
  });
};

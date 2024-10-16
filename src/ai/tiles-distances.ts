import { Tile } from 'functions/src/document-types/Games';
import { maxInfluenceReach } from 'functions/src/game-logic/GameConstants';
import { findClosestTileWithId } from 'functions/src/game-logic/findClosestTileWithId';
import { ValidDistance } from 'functions/src/game-logic/getValidNeighbors';

import { aiId } from 'src/game/create-game/createGame';

export type TileWithDistances = Tile & {
  distance: number;
  enemyDistance: number;
};

export const getTilesWithDistances = ({
  boardState,
  boardSize,
}: {
  boardState: Tile[];
  boardSize: number;
}): TileWithDistances[] => {
  return boardState.map((tile) => {
    const params = {
      coords: tile,
      boardState,
      boardSize,
      maxDistance: maxInfluenceReach as ValidDistance,
    };

    const distance =
      findClosestTileWithId({ ...params, id: aiId }).distance || 1;

    const enemyDistance =
      findClosestTileWithId({ ...params, id: aiId, invertSearch: true })
        .distance || 1;

    return { ...tile, distance, enemyDistance };
  });
};

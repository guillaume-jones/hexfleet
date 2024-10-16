import { TilePressureGain, calculateBestPressure } from './best-pressure';
import { getGainsLosses } from './gains-losses';
import { getNeighborCounts } from './neighbor-counts';
import { TileWithDistances } from './tiles-distances';
import {
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

type TileWithBoth = TileWithDistances & TilePressureGain;

const getBestActionForTile = ({
  tile,
  boardState,
  boardSize,
}: {
  tile: TileWithDistances;
  boardState: Tile[];
  boardSize: number;
}): TileWithBoth | undefined => {
  const neighbors = getNeighborCounts({ tile, boardState, boardSize });
  const gainsLosses = getGainsLosses({ tile, neighbors });
  const bestPressure = calculateBestPressure({ tile, gainsLosses });

  if (!bestPressure || bestPressure.gainRatio <= 0) return undefined;

  return { ...tile, ...bestPressure };
};

export const getBestRemainingActions = ({
  boardSize,
  boardState,
  previousActions,
}: {
  boardSize: number;
  boardState: TileWithDistances[];
  previousActions: TileWithPressure<TileCoords>[];
}): TileWithBoth[] => {
  const bestRemainingActions = boardState
    .map((tile) => {
      // Skips tiles which have already been acted on
      const previousAction = previousActions.find(
        (action) => action.x === tile.x && action.y === tile.y,
      );
      if (previousAction) return undefined;

      return getBestActionForTile({ tile, boardState, boardSize });
    })
    .filter(
      (action): action is TilePressureGain & TileWithDistances => !!action,
    )
    .sort((a, b) => b.gainRatio - a.gainRatio);

  const nextChangeIndex = bestRemainingActions.findIndex(
    (action) => action.finalId !== action.initialId,
  );
  return nextChangeIndex === -1
    ? bestRemainingActions
    : bestRemainingActions.slice(0, nextChangeIndex + 1);
};

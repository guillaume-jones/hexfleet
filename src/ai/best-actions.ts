import { TilePressureGain, calculateBestPressure } from './best-pressure';
import { getGainsLosses } from './gains-losses';
import { getNeighborCounts } from './neighbor-counts';
import { TileWithDistances } from './tiles-distances';
import { TileCoords } from 'functions/src/document-types/Games';

type TileWithBoth = TileWithDistances & TilePressureGain;

type BaseActionData = {
  boardState: TileWithDistances[];
  boardSize: number;
  maxInfluence: number;
};

const getBestActionForTile = ({
  tile,
  boardState,
  boardSize,
  maxInfluence,
}: BaseActionData & {
  tile: TileWithDistances;
}): TileWithBoth | undefined => {
  const neighbors = getNeighborCounts({ tile, boardState, boardSize });
  const gainsLosses = getGainsLosses({ tile, neighbors });
  const bestPressure = calculateBestPressure({
    tile,
    gainsLosses,
    maxInfluence,
  });

  if (!bestPressure || bestPressure.gainRatio <= 0) return undefined;

  return { ...tile, ...bestPressure };
};

export const getBestRemainingActions = ({
  boardSize,
  boardState,
  previousActions,
  maxInfluence,
}: BaseActionData & {
  previousActions: TileCoords[];
}): TileWithBoth[] => {
  const bestRemainingActions = boardState
    .map((tile) => {
      // Skips tiles which have already been acted on
      if (previousActions.find((v) => v.x === tile.x && v.y === tile.y)) return;

      return getBestActionForTile({
        tile,
        boardState,
        boardSize,
        maxInfluence,
      });
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

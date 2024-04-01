import {
  BoardState,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from '../document-types/Games';

import { pressureToConquer, pressureToDisable } from './GameConstants';

export function calculateNewBoardState(
  boardState: BoardState,
  nextTurns: NextTurn[],
  // Expects player ids to be in same order as nextTurns
  players: string[],
): BoardState {
  return boardState.map(({ playerId, disabled: _, ...tile }) => {
    const appliedPressures: (TileWithPressure<TileCoords> & {
      pressureId: string;
    })[] = [];

    // Finds all relevant applied pressures
    nextTurns.forEach((nextTurn, i) => {
      const tileWithPressure = nextTurn.pressures.find(
        (p) => p.x === tile.x && p.y === tile.y,
      );
      if (tileWithPressure)
        appliedPressures.push({ ...tileWithPressure, pressureId: players[i] });
    });

    // Early return: nothing to calculate
    if (appliedPressures.length === 0) return { ...tile, playerId };

    // Attempt to clear tile if owner requested clear
    const ownerPressure = appliedPressures.find(
      (p) => p.pressureId === playerId,
    );
    if (ownerPressure?.clear) playerId = undefined;

    // Early return: only 1 player applied pressure
    if (appliedPressures.length === 1) {
      const onlyPressure = appliedPressures[0];
      if (onlyPressure.pressure > pressureToConquer) {
        return { ...tile, playerId: onlyPressure.pressureId };
      }
      // Do not disable if owner is applying pressure
      if (onlyPressure.pressure > pressureToDisable && !ownerPressure) {
        return { ...tile, playerId, disabled: true };
      }
      return { ...tile, playerId };
    }

    // Sorts pressures and resolves conflicts
    appliedPressures.sort((a, b) => b.pressure - a.pressure);

    const topPressure = appliedPressures[0];
    const secondPressure = appliedPressures[1];

    // Early return: top pressure has enough power to conquer tile
    if (topPressure.pressure - secondPressure.pressure > pressureToConquer) {
      return { ...tile, playerId: topPressure.pressureId };
    }

    // Early return: top pressure only has enough power to disable tile
    if (
      topPressure.pressure - (ownerPressure?.pressure ?? 0) >
      pressureToDisable
    ) {
      return { ...tile, playerId, disabled: true };
    }

    // Final return: no change, tile remains the same
    return { ...tile, playerId };
  });
}

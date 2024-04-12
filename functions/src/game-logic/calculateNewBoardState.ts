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
  keepDisabled?: boolean,
): BoardState {
  return boardState.map(({ playerId, ...tile }) => {
    if (!keepDisabled) delete tile.disabled;

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
    if (appliedPressures.length === 0) {
      if (playerId) return { ...tile, playerId };
      return { ...tile };
    }

    // Attempt to clear tile if owner requested clear
    const ownerPressure = appliedPressures.find(
      (p) => p.pressureId === playerId,
    );
    if (ownerPressure?.clear) playerId = undefined;

    // Early return: only 1 player applied pressure
    if (appliedPressures.length === 1) {
      // Only owner is applying pressure
      if (ownerPressure) {
        if (playerId) return { ...tile, playerId };
        return { ...tile };
      }

      const onlyPressure = appliedPressures[0];
      if (onlyPressure.pressure >= pressureToConquer) {
        delete tile.disabled;
        return { ...tile, playerId: onlyPressure.pressureId };
      }
      if (playerId && onlyPressure.pressure >= pressureToDisable) {
        return { ...tile, playerId, disabled: true };
      }
      if (playerId) return { ...tile, playerId };
      return { ...tile };
    }

    // Sorts pressures and resolves conflicts
    appliedPressures.sort((a, b) => b.pressure - a.pressure);

    const topPressure = appliedPressures[0];
    const secondPressure = appliedPressures[1];

    // Early return: top pressure has enough power to conquer tile
    if (topPressure.pressure - secondPressure.pressure >= pressureToConquer) {
      delete tile.disabled;
      return { ...tile, playerId: topPressure.pressureId };
    }

    // Early return: top pressure can overpower owner to disable tile
    if (
      playerId &&
      topPressure.pressure - (ownerPressure?.pressure ?? 0) >= pressureToDisable
    ) {
      return { ...tile, playerId, disabled: true };
    }

    // Final return: no change, tile remains the same
    if (playerId) return { ...tile, playerId };
    return { ...tile };
  });
}

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
  return boardState.map(({ ...tile }) => {
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
      return tile;
    }

    // Attempt to clear tile if owner requested clear
    const ownerPressure = appliedPressures.find(
      (p) => p.pressureId === tile.playerId,
    );
    if (ownerPressure?.clear) delete tile.playerId;

    // Early return: only 1 player applied pressure
    if (appliedPressures.length === 1) {
      // Only owner is applying pressure
      if (ownerPressure) {
        return tile;
      }

      const onlyPressure = appliedPressures[0];
      if (onlyPressure.pressure >= pressureToConquer) {
        delete tile.disabled;
        if (onlyPressure.clear) {
          delete tile.playerId;
        } else {
          tile.playerId = onlyPressure.pressureId;
        }
        return tile;
      }
      if (tile.playerId && onlyPressure.pressure >= pressureToDisable) {
        tile.disabled = true;
        return tile;
      }
      return tile;
    }

    // Sorts pressures and resolves conflicts
    appliedPressures.sort((a, b) => b.pressure - a.pressure);

    const topPressure = appliedPressures[0];
    const secondPressure = appliedPressures[1];

    // Early return: top pressure has enough power to conquer tile
    if (topPressure.pressure - secondPressure.pressure >= pressureToConquer) {
      delete tile.disabled;
      if (topPressure.clear) {
        delete tile.playerId;
      } else {
        tile.playerId = topPressure.pressureId;
      }
      return tile;
    }

    // Early return: top pressure can overpower owner to disable tile
    if (
      tile.playerId &&
      topPressure.pressure - (ownerPressure?.pressure ?? 0) >= pressureToDisable
    ) {
      tile.disabled = true;
      return tile;
    }

    // Final return: no change, tile remains the same
    return tile;
  });
}

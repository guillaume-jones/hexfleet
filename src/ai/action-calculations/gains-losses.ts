import { TileWithNeighbors } from '../pre-calculations/neighbor-counts';
import { TileWithDistances } from '../pre-calculations/tiles-distances';

import { tileMaintenance } from 'functions/src/game-logic/GameConstants';

import { aiId } from 'src/game/create-game/createGame';

export enum TileStatus {
  Mine = 'Mine',
  Enemy = 'Enemy',
  Empty = 'Empty',
}

export type GainsLosses = {
  gainFromConquer: number;
  gainFromDisable: number;
  lossFromConquer: number;
  lossFromDisable: number;
  gainFromMyClear: number;
  gainFromEnemyClear: number;
};

/** Incentive to attack & defend homeworlds.*/
const homeworldValue = 50;
/** Incentive to defend tiles that neighbor my own */
const neighborFactor = 0.1;

const getConquerValue = ({
  ownerValue,
  neighborsValue,
  status,
  attackerStatus,
  isHomeworld,
}: {
  ownerValue: number;
  neighborsValue: number;
  status: TileStatus;
  attackerStatus: TileStatus.Mine | TileStatus.Enemy;
  isHomeworld?: boolean;
}) => {
  switch (status) {
    case TileStatus.Empty:
      return ownerValue - neighborsValue + neighborFactor * neighborsValue;
    case attackerStatus:
      return 0; // No value if already owned by attacker
    default:
      return (
        ownerValue +
        Math.max(neighborsValue, ownerValue) + // Tile could be cleared
        neighborFactor * neighborsValue +
        (isHomeworld ? homeworldValue : 0)
      );
  }
};

/** Incentive for AI to favor conquest over disable (for future gains)
 */
const disableFactor = 0.75;

const getDisableValue = ({
  openNeighbors: openNeighbors,
  status,
  attackerStatus,
}: {
  openNeighbors: number;
  status: TileStatus;
  attackerStatus: TileStatus.Mine | TileStatus.Enemy;
}) => {
  return status === TileStatus.Empty || status === attackerStatus
    ? 0
    : openNeighbors * disableFactor;
};

export const getGainsLosses = (tile: TileWithNeighbors): GainsLosses => {
  const status =
    tile.playerId === aiId
      ? TileStatus.Mine
      : tile.playerId
      ? TileStatus.Enemy
      : TileStatus.Empty;
  const neighbors = tile.neighbors;

  const ownerValue = neighbors.open - tileMaintenance + (neighbors.all - 6) / 6;
  const myNeighborsValue = neighbors.me - neighbors.enemy;
  const enemyNeighborsValue = neighbors.enemy - neighbors.me;

  const gainFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: myNeighborsValue,
    status,
    attackerStatus: TileStatus.Mine,
    isHomeworld: tile.homeworld,
  });
  const lossFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: enemyNeighborsValue,
    status,
    attackerStatus: TileStatus.Enemy,
    isHomeworld: tile.homeworld,
  });

  const gainFromDisable = getDisableValue({
    openNeighbors: neighbors.open,
    attackerStatus: TileStatus.Mine,
    status,
  });
  const lossFromDisable = getDisableValue({
    openNeighbors: neighbors.open,
    attackerStatus: TileStatus.Enemy,
    status,
  });

  return {
    gainFromConquer,
    lossFromConquer,
    gainFromDisable,
    lossFromDisable,
    gainFromMyClear: myNeighborsValue - ownerValue,
    gainFromEnemyClear: enemyNeighborsValue - ownerValue,
  };
};

export const shouldClearOwnTile = ({
  playerId,
  homeworld,
  enemyDistance,
  gainFromMyClear,
}: TileWithDistances & {
  gainFromMyClear: number;
}) => {
  if (playerId !== aiId || homeworld) return false;
  // Avoids clearing tiles whose neighbors may be conquered
  return gainFromMyClear > (enemyDistance === Infinity ? 0 : 1);
};

import { NeighborCounts } from './neighbor-counts';
import { TileWithDistances } from './tiles-distances';
import { Tile } from 'functions/src/document-types/Games';
import {
  maxInfluenceReach,
  tileMaintenance,
} from 'functions/src/game-logic/GameConstants';

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
const getConquerValue = ({
  ownerValue,
  neighborsValue,
  homeworldValue,
  status,
  attackerStatus,
}: {
  ownerValue: number;
  neighborsValue: number;
  homeworldValue: number;
  status: TileStatus;
  attackerStatus: TileStatus.Mine | TileStatus.Enemy;
}) => {
  switch (status) {
    case TileStatus.Empty:
      return ownerValue - neighborsValue;
    case attackerStatus:
      return 0; // No value if already owned by attacker
    default:
      return ownerValue + Math.max(neighborsValue, ownerValue) + homeworldValue;
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
/** Incentive to attack & defend homeworlds */
const homeworldValue = 100;

export const getGainsLosses = ({
  tile,
  neighbors,
}: {
  tile: Tile;
  neighbors: NeighborCounts;
}): GainsLosses => {
  const status =
    tile.playerId === aiId
      ? TileStatus.Mine
      : tile.playerId
      ? TileStatus.Enemy
      : TileStatus.Empty;

  const ownerValue = neighbors.open - tileMaintenance + (neighbors.all - 6) / 6;
  const myNeighborsValue = neighbors.me - neighbors.enemy;
  const enemyNeighborsValue = neighbors.enemy - neighbors.me;

  const gainFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: myNeighborsValue,
    status,
    attackerStatus: TileStatus.Mine,
    homeworldValue: tile.homeworld ? homeworldValue : 0,
  });
  const lossFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: enemyNeighborsValue,
    status,
    attackerStatus: TileStatus.Enemy,
    homeworldValue: tile.homeworld ? homeworldValue : 0,
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
  return gainFromMyClear > (enemyDistance <= maxInfluenceReach ? 1 : 0);
};

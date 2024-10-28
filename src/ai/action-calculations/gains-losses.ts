import { TileWithNeighbors } from '../pre-calculations/neighbor-counts';
import { TileWithDistances } from '../pre-calculations/tiles-distances';
import { AIConstants } from '../training/ai-training';

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

const getConquerValue = ({
  ownerValue,
  neighborsValue,
  status,
  attackerStatus,
  isHomeworld,
  constants,
}: {
  ownerValue: number;
  neighborsValue: number;
  status: TileStatus;
  attackerStatus: TileStatus.Mine | TileStatus.Enemy;
  isHomeworld?: boolean;
  constants: AIConstants;
}) => {
  switch (status) {
    case TileStatus.Empty:
      return (
        ownerValue - neighborsValue + constants.neighborFactor * neighborsValue
      );
    case attackerStatus:
      return 0; // No value if already owned by attacker
    default:
      return (
        ownerValue +
        Math.max(neighborsValue, ownerValue) + // Tile could be cleared
        constants.neighborFactor * neighborsValue +
        (isHomeworld ? constants.homeworldValue : 0)
      );
  }
};

const getDisableValue = ({
  openNeighbors: openNeighbors,
  status,
  attackerStatus,
  constants,
}: {
  openNeighbors: number;
  status: TileStatus;
  attackerStatus: TileStatus.Mine | TileStatus.Enemy;
  constants: AIConstants;
}) => {
  return status === TileStatus.Empty || status === attackerStatus
    ? 0
    : openNeighbors * constants.disableFactor;
};

export const getGainsLosses = (
  tile: Pick<TileWithNeighbors, 'neighbors' | 'playerId' | 'homeworld'>,
  constants: AIConstants,
): GainsLosses => {
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
    constants,
  });
  const lossFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: enemyNeighborsValue,
    status,
    attackerStatus: TileStatus.Enemy,
    isHomeworld: tile.homeworld,
    constants,
  });

  const gainFromDisable = getDisableValue({
    openNeighbors: neighbors.open,
    attackerStatus: TileStatus.Mine,
    status,
    constants,
  });
  const lossFromDisable = getDisableValue({
    openNeighbors: neighbors.open,
    attackerStatus: TileStatus.Enemy,
    status,
    constants,
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

export const shouldClearTile = ({
  playerId,
  homeworld,
  distance,
  enemyDistance,
  gainFromMyClear,
  gainFromEnemyClear,
}: Pick<
  TileWithDistances,
  'playerId' | 'homeworld' | 'distance' | 'enemyDistance'
> &
  GainsLosses) => {
  if (playerId === undefined || homeworld) return false;

  if (playerId === aiId) {
    return gainFromMyClear > (enemyDistance === Infinity ? 0 : 1);
  }

  return gainFromEnemyClear > (distance === Infinity ? 0 : 1);
};

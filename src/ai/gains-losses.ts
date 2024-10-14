import { NeighborCounts } from './neighbor-counts';
import { Tile } from 'functions/src/document-types/Games';
import { tileMaintenance } from 'functions/src/game-logic/GameConstants';

import { aiId } from 'src/game/create-game/createGame';

enum TileStatus {
  Mine = 'Mine',
  Enemy = 'Enemy',
  Empty = 'Empty',
}

/** Value of homeworld conquest */
const homeworldValue = 40;

export type GainsLosses = {
  gainFromConquer: number;
  gainFromDisable: number;
  lossFromConquer: number;
  lossFromDisable: number;
  shouldClearMine: boolean;
  shouldClearEnemy: boolean;
};

const getConquerValue = ({
  ownerValue,
  neighborsValue,
  status,
  attackerStatus,
}: {
  ownerValue: number;
  neighborsValue: number;
  status: TileStatus;
  attackerStatus: TileStatus.Mine | TileStatus.Enemy;
}) => {
  switch (status) {
    case TileStatus.Empty:
      return ownerValue - neighborsValue;
    case attackerStatus:
      return 0; // No value if already owned by attacker
    default:
      return ownerValue + Math.max(neighborsValue, ownerValue);
  }
};

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

  const ownerValue =
    neighbors.open - tileMaintenance + (tile.homeworld ? homeworldValue : 0);
  const myNeighborsValue = neighbors.me - neighbors.enemy;
  const enemyNeighborsValue = neighbors.enemy - neighbors.me;

  const gainFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: myNeighborsValue,
    status,
    attackerStatus: TileStatus.Mine,
  });
  const lossFromConquer = getConquerValue({
    ownerValue,
    neighborsValue: enemyNeighborsValue,
    status,
    attackerStatus: TileStatus.Enemy,
  });

  const gainFromDisable = status === TileStatus.Enemy ? neighbors.open : 0;
  const lossFromDisable = status === TileStatus.Mine ? neighbors.open : 0;

  return {
    gainFromConquer,
    lossFromConquer,
    gainFromDisable,
    lossFromDisable,
    shouldClearMine: myNeighborsValue > ownerValue,
    shouldClearEnemy: enemyNeighborsValue > ownerValue,
  };
};

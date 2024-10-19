import countBy from 'lodash/countBy';

import {
  NextTurn,
  Tile,
  TileWithBorders,
} from 'functions/src/document-types/Games';
import {
  getInfluenceSpent,
  getPlayersInfluence,
} from 'functions/src/game-logic/influenceUtils';

export const getInfluenceInformation = ({
  latestBoard = [],
  currentBoard = [],
  currentBoardWithoutDisabled = [],
  projectedBoard = [],
  nextTurn,
  userId,
}: {
  latestBoard?: TileWithBorders<Tile>[];
  currentBoard?: TileWithBorders<Tile>[];
  currentBoardWithoutDisabled?: TileWithBorders<Tile>[];
  projectedBoard?: TileWithBorders<Tile>[];
  nextTurn?: NextTurn;
  userId?: string;
}) => {
  // Get "current" influence and tile information
  const influenceByPlayer = getPlayersInfluence(currentBoard);
  const influenceByPlayerWithoutDisabled = getPlayersInfluence(
    currentBoardWithoutDisabled,
  );
  const tilesByPlayer = countBy(currentBoard, 'playerId');

  // Get projections of influence and tile information
  const userInfluence = userId ? getPlayersInfluence(latestBoard)[userId] : 0;
  const userInfluenceRemaining = userInfluence - getInfluenceSpent(nextTurn);
  const userInfluenceProjected = userId
    ? getPlayersInfluence(projectedBoard)[userId]
    : 0;

  return {
    tilesByPlayer,
    influenceByPlayer,
    influenceByPlayerWithoutDisabled,
    userInfluenceProjected,
    userInfluence,
    userInfluenceRemaining,
  };
};

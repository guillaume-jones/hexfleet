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
  currentBoard = [],
  currentBoardWithoutDisabled = [],
  projectedBoard = [],
  nextTurn,
  userId,
}: {
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
  const userInfluence = userId ? influenceByPlayer[userId] : 0;
  const influenceRemaining = isNaN(userInfluence)
    ? 0
    : userInfluence - getInfluenceSpent(nextTurn);

  // Project new board for display
  const projectedInfluenceByPlayer = getPlayersInfluence(projectedBoard);

  return {
    tilesByPlayer,
    influenceByPlayer,
    influenceByPlayerWithoutDisabled,
    projectedInfluenceByPlayer,
    influenceRemaining,
  };
};

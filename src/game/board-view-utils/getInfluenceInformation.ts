import countBy from 'lodash/countBy';

import {
  BoardState,
  NextTurn,
  Tile,
  TileWithBorders,
} from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';
import {
  getInfluenceSpent,
  getPlayersInfluence,
} from 'functions/src/game-logic/influenceUtils';

export const getInfluenceInformation = ({
  oldBoard,
  newBoardWithBorders,
  nextTurn,
  boardSize,
  userId,
}: {
  oldBoard?: BoardState;
  newBoardWithBorders?: TileWithBorders<Tile>[];
  nextTurn?: NextTurn;
  boardSize?: number;
  userId?: string;
}) => {
  // Get "current" influence and tile information
  const influenceByPlayer = getPlayersInfluence(
    addBordersToBoard(oldBoard ?? [], boardSize),
  );
  const influenceByPlayerWithoutDisabled = getPlayersInfluence(
    addBordersToBoard(
      calculateNewBoardState(oldBoard ?? [], [], []),
      boardSize,
    ),
  );
  const tilesByPlayer = countBy(oldBoard, 'playerId');

  // Get projections of influence and tile information
  const influenceRemaining = userId
    ? influenceByPlayer[userId] - getInfluenceSpent(nextTurn)
    : 0;

  // Project new board for display
  const projectedInfluenceByPlayer = getPlayersInfluence(
    newBoardWithBorders ?? [],
  );

  return {
    tilesByPlayer,
    influenceByPlayer,
    influenceByPlayerWithoutDisabled,
    projectedInfluenceByPlayer,
    influenceRemaining,
  };
};

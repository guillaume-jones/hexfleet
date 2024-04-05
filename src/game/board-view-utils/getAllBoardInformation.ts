import countBy from 'lodash/countBy';

import { BoardState, NextTurn } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { getInfluenceSpent } from 'functions/src/game-logic/getInfluenceSpent';
import { getPlayersInfluence } from 'functions/src/game-logic/getPlayersInfluence';

import { getProjectedBoard } from 'src/game/board-view-utils/getProjectedBoard';

export const getAllBoardInformation = ({
  boardState,
  boardSize,
  nextTurn,
  userId,
}: {
  boardState?: BoardState;
  boardSize?: number;
  nextTurn?: NextTurn;
  userId?: string;
}) => {
  // Get influence & tile info from old board
  const oldBoardWithBorders = addBordersToBoard(boardState, boardSize);
  const influenceByPlayer = getPlayersInfluence(oldBoardWithBorders);
  const tilesByPlayer = countBy(oldBoardWithBorders, 'playerId');
  const influenceRemaining = userId
    ? influenceByPlayer[userId] - getInfluenceSpent(nextTurn)
    : 0;

  // Project new board for display
  const newBoardState = getProjectedBoard(boardState, nextTurn, userId);
  const newBoardWithBorders = addBordersToBoard(newBoardState, boardSize).sort(
    // Must sort or empty tiles override player tiles/borders
    (a, b) => +!!a.playerId - +!!b.playerId,
  );
  const projectedInfluenceByPlayer = getPlayersInfluence(newBoardWithBorders);

  return {
    boardState: newBoardWithBorders,
    tilesByPlayer,
    influenceByPlayer,
    projectedInfluenceByPlayer,
    influenceRemaining,
  };
};

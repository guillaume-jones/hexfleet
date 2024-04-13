import countBy from 'lodash/countBy';

import {
  BoardState,
  NextTurn,
  Player,
} from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';
import {
  getInfluenceSpent,
  getPlayersInfluence,
} from 'functions/src/game-logic/influenceUtils';

import { getProjectedBoard } from 'src/game/board-view-utils/getProjectedBoard';

export const getAllBoardInformation = ({
  boardState,
  boardSize,
  nextTurn,
  userId,
  players,
}: {
  boardState?: BoardState;
  boardSize?: number;
  nextTurn?: NextTurn;
  userId?: string;
  players?: Player[];
}) => {
  // Get influence & tile info from old board
  const oldBoardWithBorders = addBordersToBoard(boardState, boardSize);
  const oldBoardWithBordersWithoutDisabled = addBordersToBoard(
    calculateNewBoardState(boardState ?? [], [], []),
    boardSize,
  );
  const influenceByPlayer = getPlayersInfluence(oldBoardWithBorders);
  const influenceByPlayerWithoutDisabled = getPlayersInfluence(
    oldBoardWithBordersWithoutDisabled,
  );
  const tilesByPlayer = countBy(oldBoardWithBorders, 'playerId');
  const influenceRemaining = userId
    ? influenceByPlayer[userId] - getInfluenceSpent(nextTurn)
    : 0;

  // Project new board for display
  const newBoardState = getProjectedBoard({
    boardState,
    boardSize,
    nextTurn,
    players,
    userId,
  });
  const newBoardWithBorders = addBordersToBoard(newBoardState, boardSize).sort(
    // Must sort or empty tiles override player tiles/borders
    (a, b) => +!!a.playerId - +!!b.playerId,
  );
  const projectedInfluenceByPlayer = getPlayersInfluence(newBoardWithBorders);

  return {
    boardState: newBoardWithBorders,
    tilesByPlayer,
    influenceByPlayer,
    influenceByPlayerWithoutDisabled,
    projectedInfluenceByPlayer,
    influenceRemaining,
  };
};

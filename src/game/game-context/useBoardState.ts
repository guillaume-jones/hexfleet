import { getProjectedBoard } from '../board-view-utils/getProjectedBoard';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Game, NextTurn } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';

import { auth } from 'src/firebase/firebaseApp';

const useBoardState = (game?: Partial<Game>, nextTurn?: NextTurn) => {
  const [user] = useAuthState(auth);

  const [turn, setTurn] = useState<number>(-1);

  // Reset turn counter if new turn added / game loaded
  useEffect(() => {
    setTurn(game?.pastTurns?.length ?? -1);
  }, [game?.pastTurns?.length]);

  const { currentBoard, currentBoardWithoutDisabled } = useMemo(() => {
    return {
      currentBoard: addBordersToBoard(game?.boardState ?? [], game?.boardSize),
      currentBoardWithoutDisabled: addBordersToBoard(
        calculateNewBoardState(game?.boardState ?? [], [], []),
        game?.boardSize,
      ),
    };
  }, [game?.boardSize, game?.boardState]);

  const projectedBoard = useMemo(() => {
    if (!game || turn < 0) return [];

    const isInPast = game.pastTurns && turn < game.pastTurns.length;

    const boardState = isInPast
      ? game.pastTurns?.[turn].boardState
      : game.boardState;

    return addBordersToBoard(
      getProjectedBoard({
        boardState: boardState,
        boardSize: game.boardSize,
        players: game.players,
        userId: user?.uid,
        nextTurn: isInPast ? { pressures: [] } : nextTurn,
      }),
      game.boardSize,
    );
  }, [turn, game, user?.uid, nextTurn]);

  return useMemo(
    () => ({
      turn,
      setTurn,
      projectedBoard,
      currentBoard,
      currentBoardWithoutDisabled,
    }),
    [turn, projectedBoard, currentBoard, currentBoardWithoutDisabled],
  );
};

export default useBoardState;

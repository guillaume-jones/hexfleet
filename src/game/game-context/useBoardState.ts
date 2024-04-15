import { getIndexOfBoardDifferences } from '../board-view-utils/getIndexOfBoardDifferences';
import { getProjectedBoard } from '../board-view-utils/getProjectedBoard';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { BoardState, Game, NextTurn } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { calculateNewBoardState } from 'functions/src/game-logic/calculateNewBoardState';

import { auth } from 'src/firebase/firebaseApp';

const newTileLoadingSpeed = 300;

const useBoardState = (game?: Partial<Game>, nextTurn?: NextTurn) => {
  const [user] = useAuthState(auth);

  const [turn, setTurn] = useState(game?.pastTurns?.length ?? 0);
  const [localBoardState, setLocalBoardState] = useState<BoardState>();

  // Reset turn counter if new turn added / game loaded
  useEffect(() => {
    setTurn(game?.pastTurns?.length ?? 0);
  }, [game?.pastTurns?.length]);

  // Loads in new board gradually
  useEffect(() => {
    if (!game?.boardState) return;
    // Will reset whole state if not yet loaded
    if (!localBoardState) {
      setLocalBoardState(game?.boardState);
      return;
    }

    const differencesIndex = getIndexOfBoardDifferences(
      game.boardState,
      localBoardState,
    );

    const updateUsingDifference = () => {
      const i = differencesIndex.shift();
      if (i === undefined) return;

      setLocalBoardState((prev) => {
        // Updates only the first difference
        // We know both variable are defined due to the conditions above
        const newBoard = [...prev!];
        newBoard[i] = game.boardState![i];
        return newBoard;
      });

      // Re-runs if there are still differences
      setTimeout(updateUsingDifference, newTileLoadingSpeed);
    };

    updateUsingDifference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.boardState]);

  const { currentBoard, currentBoardWithoutDisabled } = useMemo(() => {
    return {
      currentBoard: addBordersToBoard(localBoardState ?? [], game?.boardSize),
      currentBoardWithoutDisabled: addBordersToBoard(
        calculateNewBoardState(localBoardState ?? [], [], []),
        game?.boardSize,
      ),
    };
  }, [game?.boardSize, localBoardState]);

  const projectedBoard = useMemo(() => {
    const isInPast = game?.pastTurns && turn < game?.pastTurns.length;

    const boardState = isInPast
      ? game.pastTurns?.[turn].boardState
      : localBoardState;

    return addBordersToBoard(
      getProjectedBoard({
        boardState: boardState,
        boardSize: game?.boardSize,
        players: game?.players,
        userId: user?.uid,
        nextTurn: isInPast ? { pressures: [] } : nextTurn,
      }),
      game?.boardSize,
    );
  }, [
    localBoardState,
    turn,
    game?.pastTurns,
    game?.boardSize,
    game?.players,
    user?.uid,
    nextTurn,
  ]);

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

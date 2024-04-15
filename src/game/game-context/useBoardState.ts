import { getProjectedBoard } from '../board-view-utils/getProjectedBoard';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Game, NextTurn } from 'functions/src/document-types/Games';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';

import { auth } from 'src/firebase/firebaseApp';

const useBoardState = (game?: Partial<Game>, nextTurn?: NextTurn) => {
  const [user] = useAuthState(auth);

  const [turn, setTurn] = useState(game?.pastTurns?.length ?? 0);

  // Reset turn counter if new turn added / game loaded
  useEffect(() => {
    setTurn(game?.pastTurns?.length ?? 0);
  }, [game?.pastTurns?.length]);

  const boardWithBorders = useMemo(() => {
    if (!game) return [];

    const isInPast = !!game.pastTurns && turn < game.pastTurns.length;

    const boardState = isInPast
      ? game.pastTurns?.[turn].boardState
      : game.boardState;

    return addBordersToBoard(
      getProjectedBoard({
        boardState,
        boardSize: game.boardSize,
        players: game.players,
        userId: user?.uid,
        nextTurn: isInPast ? { pressures: [] } : nextTurn,
      }),
      game.boardSize,
    );
  }, [game, nextTurn, turn, user?.uid]);

  return useMemo(
    () => ({ turn, setTurn, boardWithBorders }),
    [turn, boardWithBorders],
  );
};

export default useBoardState;

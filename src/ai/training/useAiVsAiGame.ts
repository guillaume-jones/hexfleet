import { useCallback, useMemo, useState } from 'react';

import { Game, NextTurn } from 'functions/src/document-types/Games';
import { updateBoardTurn } from 'functions/src/game-logic/updateBoardTurn';

import { getAiNextTurn } from 'src/ai/next-ai-turn';
import { AIConstants } from 'src/ai/training/ai-training';
import { createAIGame } from 'src/game/create-game/createGame';

const doNothing = () => undefined;
const asyncDoNothing = async () => await Promise.resolve();

export const useAiVsAiGame = (ai1: AIConstants, ai2: AIConstants) => {
  const [game, setGame] = useState<Game>(() =>
    createAIGame({ boardSize: 9 }, [ai1.myId, ai2.myId]),
  );
  const [nextTurn] = useState<NextTurn>({ pressures: [] });
  const [waitingForAI, setWaitingForAI] = useState(false);

  const sendNextTurn = useCallback(() => {
    if (!game) {
      console.error('Game not loaded.');
      return Promise.resolve();
    }

    // Starts AI calculations
    setWaitingForAI(true);

    return new Promise<void>((resolve) => {
      const ai1NextTurn = getAiNextTurn(game, ai1);
      const ai2NextTurn = getAiNextTurn(game, ai2);

      const { newBoardState, newPlayers, winner } = updateBoardTurn({
        game,
        nextTurns: [ai1NextTurn, ai2NextTurn],
        players: [ai1.myId, ai2.myId],
      });

      const newGame = {
        ...game,
        boardState: newBoardState,
        players: newPlayers,
        pastTurns: game.pastTurns.concat({ boardState: game.boardState }),
        winner,
      };

      setGame(newGame);

      resolve();
    }).finally(() => setWaitingForAI(false));
  }, [ai1, ai2, game]);

  const resetNextTurn = useCallback(() => {
    setGame(createAIGame({ boardSize: 9 }, [ai1.myId, ai2.myId]));
  }, [ai1.myId, ai2.myId]);

  return useMemo(
    () => ({
      game,
      nextTurn,
      sendNextTurn,
      wasPlaying: true,
      nextTurnSent: waitingForAI,
      nextTurnEqualsSent: nextTurn === undefined || waitingForAI,
      resetNextTurn,
      updateNextTurn: doNothing,
      updatePlayer: asyncDoNothing,
    }),
    [game, nextTurn, resetNextTurn, sendNextTurn, waitingForAI],
  );
};

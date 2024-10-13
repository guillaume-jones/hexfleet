import { aiId } from '../create-game/createGame';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { updateBoardTurn } from 'functions/src/game-logic/updateBoardTurn';

import { getAiNextTurn } from 'src/ai/ai-calculations';
import { auth } from 'src/firebase/firebaseApp';

export const spNextTurnKey = (id: string) => `sp-next-turn-${id}`;
export const spGameKey = (id: string) => `sp-game-${id}`;

export const useSinglePlayerGame = (gameId: string) => {
  const [game, setGame] = useState<Game>();
  const [nextTurn, setNextTurn] = useState<NextTurn>();
  const [wasPlaying, setWasPlaying] = useState(false);
  const [waitingForAI, setWaitingForAI] = useState(false);

  useEffect(() => {
    // Tries to load game & next turn from local storage on reload
    const localNextTurn = localStorage.getItem(spNextTurnKey(gameId));
    const localGame = localStorage.getItem(spGameKey(gameId));
    if (localGame) {
      setGame(JSON.parse(localGame) as Game);
    }
    if (localNextTurn) {
      setNextTurn(JSON.parse(localNextTurn) as NextTurn);
      setWasPlaying(true);
    }
  }, [gameId]);

  const resetNextTurn = useCallback(() => {
    setNextTurn(undefined);
    localStorage.removeItem(spNextTurnKey(gameId));
  }, [gameId]);

  const sendNextTurn = useCallback(async () => {
    if (!auth.currentUser) {
      console.error('User not loaded.');
      return;
    }
    if (!game || !nextTurn) {
      console.error('Game or user next turn not loaded.');
      return;
    }

    // Starts AI calculations
    setWaitingForAI(true);

    const aiNextTurn = getAiNextTurn(game);

    const { newBoardState, newPlayers, winner } = updateBoardTurn({
      game,
      nextTurns: [aiNextTurn, nextTurn],
      players: [aiId, auth.currentUser.uid],
    });

    const newGame = {
      ...game,
      boardState: newBoardState,
      players: newPlayers,
      pastTurns: game.pastTurns.concat({ boardState: game.boardState }),
      winner,
      endedAt: winner ? Timestamp.now() : null,
    };

    if (winner) {
      // TODO: save games to cloud on game end
      await Promise.resolve();
    }

    setGame(newGame);
    setWaitingForAI(false);
    resetNextTurn();
  }, [game, nextTurn, resetNextTurn]);

  const updateNextTurn = useCallback(
    (tile: TileWithPressure<TileCoords>) => {
      setWasPlaying(true);
      setNextTurn((prev) => {
        const newPressures = (prev?.pressures ?? []).filter(
          ({ x, y }) => !(x === tile.x && y === tile.y),
        );
        if (tile.pressure || tile.clear) newPressures.push(tile);

        const newNextTurn = { pressures: newPressures };
        localStorage.setItem(
          spNextTurnKey(gameId),
          JSON.stringify(newNextTurn),
        );

        return newNextTurn;
      });
    },
    [gameId],
  );

  return useMemo(
    () => ({
      game,
      nextTurn,
      sendNextTurn,
      updateNextTurn,
      resetNextTurn,
      wasPlaying,
      nextTurnSent: waitingForAI,
      nextTurnEqualsSent: nextTurn === undefined || waitingForAI,
    }),
    [
      game,
      nextTurn,
      sendNextTurn,
      updateNextTurn,
      resetNextTurn,
      wasPlaying,
      waitingForAI,
    ],
  );
};

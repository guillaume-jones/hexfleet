import { BoardOptions } from '../board/generateBoard';
import { createSinglePlayerGame } from '../create-game/createGame';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

const nextTurnKey = 'next-turn-singleplayer';

export const useSinglePlayerGame = () => {
  const [game, setGame] = useState<Game>();
  const [nextTurn, setNextTurn] = useState<NextTurn>();
  const [wasPlaying, setWasPlaying] = useState(false);
  const [waitingForAI, setWaitingForAI] = useState(false);

  useEffect(() => {
    // Tries to load next turn from local storage on reload
    const localNextTurn = localStorage.getItem(nextTurnKey);
    if (localNextTurn) {
      setNextTurn(JSON.parse(localNextTurn) as NextTurn);
      setWasPlaying(true);
    }
  }, []);

  const createNewGame = useCallback((options: BoardOptions) => {
    setGame(createSinglePlayerGame(options));
  }, []);

  const sendNextTurn = useCallback(async () => {
    setWaitingForAI(true);
    await Promise.resolve();
    // TODO: Implement AI update
    setWaitingForAI(false);
  }, []);

  const updateNextTurn = useCallback((tile: TileWithPressure<TileCoords>) => {
    setWasPlaying(true);
    setNextTurn((prev) => {
      const newPressures = (prev?.pressures ?? []).filter(
        ({ x, y }) => !(x === tile.x && y === tile.y),
      );
      if (tile.pressure || tile.clear) newPressures.push(tile);

      const newNextTurn = { pressures: newPressures };
      localStorage.setItem(nextTurnKey, JSON.stringify(newNextTurn));

      return newNextTurn;
    });
  }, []);

  const resetNextTurn = useCallback(() => {
    if (waitingForAI) return;

    setNextTurn(undefined);
    localStorage.removeItem(nextTurnKey);
  }, [waitingForAI]);

  return useMemo(
    () => ({
      game,
      createNewGame,
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
      createNewGame,
      nextTurn,
      sendNextTurn,
      updateNextTurn,
      resetNextTurn,
      wasPlaying,
      waitingForAI,
    ],
  );
};

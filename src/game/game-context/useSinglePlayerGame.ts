import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Game,
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

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

  const sendNextTurn = useCallback(async () => {
    // TODO: Resolve previous turn

    // Starts AI calculations for next turn
    setWaitingForAI(true);
    await Promise.resolve();
    // TODO: Implement AI update
    setWaitingForAI(false);
  }, []);

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

  const resetNextTurn = useCallback(() => {
    setNextTurn(undefined);
    localStorage.removeItem(spNextTurnKey(gameId));
  }, [gameId]);

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

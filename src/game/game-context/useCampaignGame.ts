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

import { getAiNextTurn } from 'src/ai/next-ai-turn';
import { defaultAiConstants } from 'src/ai/training/ai-constants';
import { useCampaignDoc } from 'src/campaign/useCampaignDoc';
import { useCampaignGameDoc } from 'src/campaign/useCampaignGameDoc';
import { auth } from 'src/firebase/firebaseApp';

const isFullGame = (game: Partial<Game>): game is Game => {
  return (
    !!game.boardSize && !!game.boardState && !!game.players && !!game.pastTurns
  );
};

export const useCampaignGame = (gameId: string) => {
  const { game, setGame } = useCampaignGameDoc(gameId);
  const { campaign, setCampaign } = useCampaignDoc();

  const [nextTurn, setNextTurn] = useState<NextTurn>();
  const [wasPlaying, setWasPlaying] = useState(false);
  const [waitingForAI, setWaitingForAI] = useState(false);

  const spNextTurnKey = useMemo(() => {
    return `sp-next-turn-${gameId}`;
  }, [gameId]);

  useEffect(() => {
    // Tries to load game & next turn from local storage on reload
    const localNextTurn = localStorage.getItem(spNextTurnKey);

    if (localNextTurn) {
      setNextTurn(JSON.parse(localNextTurn) as NextTurn);
      setWasPlaying(true);
    }
  }, [spNextTurnKey]);

  const resetNextTurn = useCallback(() => {
    setNextTurn(undefined);
    localStorage.removeItem(spNextTurnKey);
  }, [spNextTurnKey]);

  const sendNextTurn = useCallback(async () => {
    if (!auth.currentUser) {
      console.error('User not loaded.');
      return;
    }
    if (!game || !nextTurn || !isFullGame(game)) {
      console.error('Game or user next turn not loaded.');
      return;
    }

    // Starts AI calculations
    setWaitingForAI(true);

    const aiNextTurn = getAiNextTurn(game, defaultAiConstants);

    const { newBoardState, newPlayers, winner } = updateBoardTurn({
      game,
      nextTurns: [aiNextTurn, nextTurn],
      players: [aiId, auth.currentUser.uid],
    });

    const newGame = {
      ...game,
      boardState: newBoardState,
      players: newPlayers,
      pastTurns: [...(game.pastTurns ?? []), { boardState: game.boardState }],
      winner,
      endedAt: winner ? Timestamp.now() : null,
    };

    if (winner && winner !== aiId) {
      await setCampaign({
        achievedMaps: [...(campaign?.achievedMaps ?? []), gameId],
      });
    }

    await setGame(newGame);
    setWaitingForAI(false);
    resetNextTurn();
  }, [
    game,
    nextTurn,
    setGame,
    resetNextTurn,
    campaign?.achievedMaps,
    setCampaign,
    gameId,
  ]);

  const updateNextTurn = useCallback(
    (tile: TileWithPressure<TileCoords>) => {
      setWasPlaying(true);
      setNextTurn((prev) => {
        const newPressures = (prev?.pressures ?? []).filter(
          ({ x, y }) => !(x === tile.x && y === tile.y),
        );
        if (tile.pressure || tile.clear) newPressures.push(tile);

        const newNextTurn = { pressures: newPressures };
        localStorage.setItem(spNextTurnKey, JSON.stringify(newNextTurn));
        return newNextTurn;
      });
    },
    [spNextTurnKey],
  );

  const updatePlayer = useCallback(async () => {
    if (!game) return;

    const newGame = {
      ...game,
      players: game?.players?.map((p) =>
        p.id === aiId ? { ...p, dead: true } : p,
      ),
      winner: aiId,
      endedAt: Timestamp.now(),
    };
    await setGame(newGame);
    resetNextTurn();
  }, [game, resetNextTurn, setGame]);

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
      updatePlayer,
    }),
    [
      game,
      nextTurn,
      sendNextTurn,
      updateNextTurn,
      resetNextTurn,
      wasPlaying,
      waitingForAI,
      updatePlayer,
    ],
  );
};

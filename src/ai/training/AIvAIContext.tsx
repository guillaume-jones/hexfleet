import { ReactNode, useMemo } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { defaultAiConstants, defaultAiConstants2 } from './ai-training';
import { useAiVsAiGame } from './useAiVsAiGame';

import { auth } from 'src/firebase/firebaseApp';
import { getInfluenceInformation } from 'src/game/board-view-utils/getInfluenceInformation';
import {
  GameContext,
  GameContextType,
} from 'src/game/game-context/GameContext';
import useBoardState from 'src/game/game-context/useBoardState';
import usePlayers from 'src/game/game-context/usePlayers';

const useAiVsAiProvider = (): GameContextType => {
  const [user] = useIdToken(auth);

  const gameParams = useAiVsAiGame(defaultAiConstants, defaultAiConstants2);
  const players = usePlayers(gameParams.game);
  const boardParams = useBoardState(gameParams.game, gameParams.nextTurn);

  // Board processing for display
  const influenceInformation = useMemo(() => {
    return getInfluenceInformation({
      ...boardParams,
      nextTurn: gameParams.nextTurn,
      userId: user?.uid,
    });
  }, [boardParams, gameParams.nextTurn, user?.uid]);

  return {
    ...gameParams.game,
    ...gameParams,
    ...boardParams,
    ...influenceInformation,
    loading: false,
    players,
    gameId: '',
    userId: user?.uid ?? '',
    userDead: gameParams.game?.players?.find((p) => p.id === user?.uid)?.dead,
  };
};

export const AiVsAiProvider = ({ children }: { children: ReactNode }) => {
  const value = useAiVsAiProvider();

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

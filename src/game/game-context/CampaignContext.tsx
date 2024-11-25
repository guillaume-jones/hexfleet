import { getInfluenceInformation } from '../board-view-utils/getInfluenceInformation';
import { ReactNode, useMemo } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { GameContext, GameContextType } from './GameContext';
import useBoardState from './useBoardState';
import { useCampaignGame } from './useCampaignGame';
import usePlayers from './usePlayers';

import { auth } from 'src/firebase/firebaseApp';

const useCampaignProvider = (gameId: string): GameContextType => {
  const [user] = useIdToken(auth);

  const gameParams = useCampaignGame(gameId);
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
    gameId,
    userId: user?.uid ?? '',
    userDead: gameParams.game?.players?.find((p) => p.id === user?.uid)?.dead,
  };
};

export const CampaignProvider = ({
  gameId,
  children,
}: {
  gameId: string;
  children: ReactNode;
}) => {
  const value = useCampaignProvider(gameId);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

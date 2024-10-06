import { getInfluenceInformation } from '../board-view-utils/getInfluenceInformation';
import { ReactNode, createContext, useMemo } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { GameContextType } from './GameContext';
import useBoardState from './useBoardState';
import usePlayers from './usePlayers';
import { useSinglePlayerGame } from './useSinglePlayerGame';

import { auth } from 'src/firebase/firebaseApp';

export type SinglePlayerContextType = GameContextType;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const SinglePlayerContext = createContext<SinglePlayerContextType>(
  undefined!,
);

const useSinglePlayerProvider = (gameId: string): SinglePlayerContextType => {
  const [user] = useIdToken(auth);

  const gameParams = useSinglePlayerGame(gameId);
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

export const SinglePlayerProvider = ({
  gameId,
  children,
}: {
  gameId: string;
  children: ReactNode;
}) => {
  const value = useSinglePlayerProvider(gameId);

  return (
    <SinglePlayerContext.Provider value={value}>
      {children}
    </SinglePlayerContext.Provider>
  );
};

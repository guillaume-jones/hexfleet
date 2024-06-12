import { getInfluenceInformation } from '../board-view-utils/getInfluenceInformation';
import { BoardOptions } from '../board/generateBoard';
import { ReactNode, createContext, useMemo } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';

import { GameContextType } from './GameContext';
import useBoardState from './useBoardState';
import usePlayers from './usePlayers';
import { useSinglePlayerGame } from './useSinglePlayerGame';

import { auth } from 'src/firebase/firebaseApp';

export type SinglePlayerContextType = GameContextType & {
  createNewGame: (options: BoardOptions) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const SinglePlayerContext = createContext<SinglePlayerContextType>(
  undefined!,
);

const useSinglePlayerProvider = (): SinglePlayerContextType => {
  const [user] = useIdToken(auth);

  const gameParams = useSinglePlayerGame();
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

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const value = useSinglePlayerProvider();

  return (
    <SinglePlayerContext.Provider value={value}>
      {children}
    </SinglePlayerContext.Provider>
  );
};

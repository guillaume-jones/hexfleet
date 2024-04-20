import { getInfluenceInformation } from '../board-view-utils/getInfluenceInformation';
import { ProjectedTile } from '../board-view-utils/getProjectedBoard';
import { doc } from 'firebase/firestore';
import { Dictionary } from 'lodash';
import { useRouter } from 'next/router';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import useBoardState from './useBoardState';
import useNextTurn from './useNextTurn';
import usePlayers from './usePlayers';
import {
  Game,
  NextTurn,
  TileCoords,
  TileWithBorders,
  TileWithPressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';
import { PlayerWithName } from 'src/game/board-view-utils/addNamesToPlayers';

export type GameContextType = Omit<Partial<Game>, 'boardState' | 'players'> & {
  gameId: string;
  userId: string;
  loading: boolean;
  players: PlayerWithName[];
  projectedBoard: TileWithBorders<ProjectedTile>[];
  turn: number;
  setTurn: Dispatch<SetStateAction<number>>;
  setSelectedTile: Dispatch<SetStateAction<TileCoords | undefined>>;
  isInPast: boolean;
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  influenceByPlayerWithoutDisabled: Dictionary<number>;
  projectedInfluenceByPlayer: Dictionary<number>;
  influenceRemaining: number;
  nextTurn: NextTurn | undefined;
  nextTurnSent: boolean;
  nextTurnEqualsSent: boolean;
  userDead: boolean | undefined;
  updateNextTurn: (tile: TileWithPressure<TileCoords>) => void;
  resetNextTurn: () => void;
  sendNextTurn: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GameContext = createContext<GameContextType>(undefined!);

const useGameProvider = (gameId: string): GameContextType => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [game, loading, error] = useDocumentData<Partial<Game>>(
    doc(firestore, 'games', gameId),
  );
  const players = usePlayers(game);
  const nextTurnParams = useNextTurn(gameId);
  const boardParams = useBoardState(game, nextTurnParams.nextTurn);

  // Redirects to landing page if game is not accessible
  useEffect(() => {
    if (error) {
      console.error(error);
      void router.push('/');
    }
  }, [error, router]);

  // Board processing for display
  const influenceInformation = useMemo(() => {
    return getInfluenceInformation({
      ...boardParams,
      nextTurn: nextTurnParams.nextTurn,
      userId: user?.uid,
    });
  }, [boardParams, nextTurnParams.nextTurn, user?.uid]);

  return {
    ...game,
    ...nextTurnParams,
    ...boardParams,
    ...influenceInformation,
    loading,
    players,
    gameId,
    userId: user?.uid ?? '',
    userDead: game?.players?.find((p) => p.id === user?.uid)?.dead,
  };
};

export const GameProvider = ({
  gameId,
  children,
}: {
  gameId: string;
  children: ReactNode;
}) => {
  const value = useGameProvider(gameId);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

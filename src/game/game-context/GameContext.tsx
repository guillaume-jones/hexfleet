import { getInfluenceInformation } from '../board-view-utils/getInfluenceInformation';
import { ProjectedTile } from '../board-view-utils/getProjectedBoard';
import { doc } from 'firebase/firestore';
import { Dictionary } from 'lodash';
import { useRouter } from 'next/router';
import { ReactNode, createContext, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import useBoardState from './useBoardState';
import useNextTurn from './useNextTurn';
import usePlayers from './usePlayers';
import {
  Game,
  NextTurn,
  Tile,
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
  boardWithBorders: TileWithBorders<ProjectedTile<Tile>>[];
  turn: number;
  setTurn: (turn: number) => void;
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  influenceByPlayerWithoutDisabled: Dictionary<number>;
  projectedInfluenceByPlayer: Dictionary<number>;
  influenceRemaining: number;
  nextTurn: NextTurn;
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
      newBoardWithBorders: boardParams.boardWithBorders,
      oldBoard: game?.boardState,
      boardSize: game?.boardSize,
      nextTurn: nextTurnParams.nextTurn,
      userId: user?.uid,
    });
  }, [
    boardParams.boardWithBorders,
    game?.boardState,
    game?.boardSize,
    nextTurnParams.nextTurn,
    user?.uid,
  ]);

  return {
    ...game,
    ...boardParams,
    ...influenceInformation,
    ...nextTurnParams,
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

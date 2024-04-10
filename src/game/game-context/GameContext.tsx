import { getAllBoardInformation } from '../board-view-utils/getAllBoardInformation';
import { ProjectedTile } from '../board-view-utils/getProjectedBoard';
import { doc } from 'firebase/firestore';
import { Dictionary } from 'lodash';
import { useRouter } from 'next/router';
import { ReactNode, createContext, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import useNextTurn from './useNextTurn';
import usePlayers from './usePlayers';
import {
  Game,
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
  players: PlayerWithName[];
  boardState: TileWithBorders<ProjectedTile<Tile>>[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  projectedInfluenceByPlayer: Dictionary<number>;
  influenceRemaining: number;
  nextTurnSent: boolean;
  nextTurnEqualsSent: boolean;
  userResigned: boolean | undefined;
  updateNextTurn: (tile: TileWithPressure<TileCoords>) => void;
  sendNextTurn: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GameContext = createContext<GameContextType>(undefined!);

const useGameProvider = (gameId: string): GameContextType => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [game, , error] = useDocumentData<Partial<Game>>(
    doc(firestore, 'games', gameId),
  );
  const players = usePlayers(game);
  const nextTurnParams = useNextTurn(gameId);

  // Redirects to landing page if game is not accessible
  useEffect(() => {
    if (error) {
      console.error(error);
      void router.push('/');
    }
  }, [error, router]);

  // Board processing for display
  const information = useMemo(() => {
    return getAllBoardInformation({
      boardState: game?.boardState,
      boardSize: game?.boardSize,
      nextTurn: nextTurnParams.nextTurn,
      userId: user?.uid,
    });
  }, [game?.boardState, game?.boardSize, nextTurnParams, user?.uid]);

  return {
    ...game,
    ...information,
    ...nextTurnParams,
    players,
    gameId,
    userId: user?.uid ?? '',
    userResigned: game?.players?.find((p) => p.id === user?.uid)?.hasResigned,
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

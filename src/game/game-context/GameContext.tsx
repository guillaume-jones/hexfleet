import { getAllBoardInformation } from '../board-view-utils/getAllBoardInformation';
import { ProjectedTile } from '../board-view-utils/getProjectedBoard';
import { doc, setDoc } from 'firebase/firestore';
import { Dictionary } from 'lodash';
import { useRouter } from 'next/router';
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import {
  Game,
  NextTurn,
  Tile,
  TileCoords,
  TileWithBorders,
  TileWithPressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';
import {
  PlayerWithName,
  addNamesToPlayers,
} from 'src/game/board-view-utils/addNamesToPlayers';

export type GameContextType = Omit<Partial<Game>, 'boardState' | 'players'> & {
  gameId: string;
  userId: string;
  players: PlayerWithName[];
  boardState: TileWithBorders<ProjectedTile<Tile>>[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  projectedInfluenceByPlayer: Dictionary<number>;
  influenceRemaining: number;
  loading: boolean;
  nextTurnSent: boolean;
  nextTurnMatchesSent: boolean;
  userResigned: boolean | undefined;
  updateNextTurn: (tile: TileWithPressure<TileCoords>) => void;
  sendNextTurn: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GameContext = createContext<GameContextType>(undefined!);

const useGameProvider = (gameId: string): GameContextType => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [game, loading, error] = useDocumentData<Partial<Game>>(
    gameId === undefined ? undefined : doc(firestore, 'games', gameId),
  );
  const [players, setPlayers] = useState<PlayerWithName[]>([]);
  const [nextTurn, setNextTurn] = useState<NextTurn>({ pressures: [] });
  const [nextTurnSent, setNextTurnSent] = useState(false);
  const [nextTurnMatchesSent, setNextTurnMatchesSent] = useState(true);

  // Redirects to landing page if game is not accessible
  useEffect(() => {
    if (error) {
      console.error(error);
      router.push('/').catch((e) => console.error(e));
    }
  }, [error, router]);

  // Loads in player names
  useEffect(() => {
    const asyncFunction = async () => {
      if (game?.players) {
        setPlayers(await addNamesToPlayers(game.players));
      }
    };
    void asyncFunction();
  }, [game?.players]);

  // Next turn handling
  const updateNextTurn = useCallback((tile: TileWithPressure<TileCoords>) => {
    setNextTurn((prev) => {
      const newPressures = prev.pressures.filter(
        ({ x, y }) => !(x === tile.x && y === tile.y),
      );
      // Remove tile from updates if it is not being cleared or pressured
      if (!tile.clear && !tile.pressure) return { pressures: newPressures };

      return { pressures: [...newPressures, tile] };
    });
    setNextTurnMatchesSent(false);
  }, []);
  const sendNextTurn = useCallback(async () => {
    const nextTurnRef =
      user && gameId && doc(firestore, 'games', gameId, 'nextTurns', user.uid);
    if (!nextTurnRef) return;

    setNextTurnSent(true);
    try {
      await setDoc(nextTurnRef, nextTurn);
      setNextTurnMatchesSent(true);
    } catch (e) {
      console.error(e);
      setNextTurnSent(false);
    }
  }, [user, gameId, nextTurn]);

  // Board processing for display
  const information = useMemo(() => {
    return getAllBoardInformation({
      boardState: game?.boardState,
      boardSize: game?.boardSize,
      nextTurn,
      userId: user?.uid,
    });
  }, [game?.boardState, game?.boardSize, nextTurn, user?.uid]);

  return {
    ...game,
    ...information,
    userId: user?.uid ?? '',
    userResigned: game?.players?.find((p) => p.id === user?.uid)?.hasResigned,
    players,
    gameId,
    loading,
    nextTurnSent,
    nextTurnMatchesSent,
    updateNextTurn,
    sendNextTurn,
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

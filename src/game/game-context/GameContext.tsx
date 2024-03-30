import { getPlayersWithNames } from '../board-view-utils/getPlayersWithNames';
import { getSpecialBorders } from '../board-view-utils/getSpecialBorders';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Dictionary } from 'lodash';
import countBy from 'lodash/countBy';
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

import { PlayerWithName, TileWithBorders } from './GameContextTypes';
import {
  Game,
  NextTurn,
  TilePressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type GameContextType = Omit<Partial<Game>, 'boardState' | 'players'> & {
  gameId: string;
  players: PlayerWithName[];
  boardState: TileWithBorders[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  loading: boolean;
  nextTurn: NextTurn;
  nextTurnLocked: boolean;
  updateNextTurn: (tile: TilePressure) => void;
  toggleNextTurnLock: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GameContext = createContext<GameContextType>(undefined!);

const emptyNextTurn: NextTurn = { pressures: [] };

const useGameProvider = (gameId: string) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [game, loading, error] = useDocumentData<Partial<Game>>(
    gameId === undefined ? undefined : doc(firestore, 'games', gameId),
  );
  const [players, setPlayers] = useState<PlayerWithName[]>([]);
  const [nextTurn, setNextTurn] = useState<NextTurn>(emptyNextTurn);
  const [nextTurnLocked, setNextTurnLocked] = useState(false);

  // Redirects to landing page if game is not accessible
  useEffect(() => {
    if (error) {
      console.error(error);
      router.push('/').catch((e) => console.error(e));
    }
  }, [error, router]);

  // Clears next turn state when game updates
  useEffect(() => {
    setNextTurn(emptyNextTurn);
    setNextTurnLocked(false);
  }, [game?.boardState]);

  // Loads in player names
  useEffect(() => {
    const asyncFunction = async () => {
      if (game?.players) {
        setPlayers(await getPlayersWithNames(game.players));
      }
    };
    void asyncFunction();
  }, [game?.players]);

  const updateNextTurn = useCallback((tile: TilePressure) => {
    setNextTurn((prev) => {
      if (!prev) return { pressures: [tile] };

      const tileIndex = prev.pressures.findIndex(
        ({ x, y }) => x === tile.x && y === tile.y,
      );

      if (tileIndex !== undefined) {
        return {
          pressures: prev.pressures.map((p, i) => (i === tileIndex ? tile : p)),
        };
      }

      return { pressures: [...prev.pressures, tile] };
    });
  }, []);

  const nextTurnRef = useMemo(
    () =>
      user && gameId && doc(firestore, 'games', gameId, 'nextTurns', user.uid),
    [user, gameId],
  );

  const toggleNextTurnLock = useCallback(() => {
    if (!nextTurnRef) return;
    setNextTurnLocked((prev) => !prev);
    if (nextTurnLocked) {
      deleteDoc(nextTurnRef).catch((e) => console.error(e));
    } else {
      setDoc(nextTurnRef, nextTurn).catch((e) => console.error(e));
    }
  }, [nextTurnRef, nextTurn, nextTurnLocked]);

  return useMemo(() => {
    const boardState = getSpecialBorders(game?.boardState, game?.boardSize)
      // Must sort or empty tiles override player tiles/borders
      .sort((a, b) => (a.playerId ? 1 : 0) - (b.playerId ? 1 : 0));

    const tilesByPlayer = countBy(boardState, 'playerId');
    delete tilesByPlayer.undefined;

    const influenceByPlayer = countBy(
      boardState.flatMap(({ borders, playerId }) =>
        borders.map(() => playerId),
      ),
    );

    return {
      ...game,
      players,
      gameId,
      boardState,
      tilesByPlayer,
      influenceByPlayer,
      loading,
      nextTurn,
      nextTurnLocked,
      updateNextTurn,
      toggleNextTurnLock,
    };
  }, [
    game,
    players,
    gameId,
    loading,
    nextTurn,
    nextTurnLocked,
    updateNextTurn,
    toggleNextTurnLock,
  ]);
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

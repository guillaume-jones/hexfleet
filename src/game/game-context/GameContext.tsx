import { addBordersToBoard } from '../board-view-utils/addBordersToBoard';
import { addNamesToPlayers } from '../board-view-utils/addNamesToPlayers';
import { addPressuresToBoard } from '../board-view-utils/addPressuresToBoard';
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
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type GameContextType = Omit<Partial<Game>, 'boardState' | 'players'> & {
  gameId: string;
  players: PlayerWithName[];
  boardState: TileWithBorders<TileWithPressure<Tile>>[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  loading: boolean;
  nextTurnLocked: boolean;
  updateNextTurn: (tile: TileWithPressure<TileCoords>) => void;
  toggleNextTurnLock: () => void;
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
  const [tilePressures, setTilePressures] = useState<
    TileWithPressure<TileCoords>[]
  >([]);
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
    setTilePressures([]);
    setNextTurnLocked(false);
  }, [game?.boardState]);

  // Loads in player names
  useEffect(() => {
    const asyncFunction = async () => {
      if (game?.players) {
        setPlayers(await addNamesToPlayers(game.players));
      }
    };
    void asyncFunction();
  }, [game?.players]);

  const updateNextTurn = useCallback((tile: TileWithPressure<TileCoords>) => {
    setTilePressures((prev) => {
      const newPressures = prev.filter(
        ({ x, y }) => !(x === tile.x && y === tile.y),
      );

      return [...newPressures, tile];
    });
  }, []);

  const toggleNextTurnLock = useCallback(() => {
    const nextTurnRef =
      user && gameId && doc(firestore, 'games', gameId, 'nextTurns', user.uid);
    if (!nextTurnRef) return;

    setNextTurnLocked((prev) => !prev);
    if (nextTurnLocked) {
      deleteDoc(nextTurnRef).catch((e) => console.error(e));
    } else {
      const nextTurn: NextTurn = { pressures: tilePressures };
      setDoc(nextTurnRef, nextTurn).catch((e) => console.error(e));
    }
  }, [user, gameId, tilePressures, nextTurnLocked]);

  const calculatedBoardParams = useMemo(() => {
    const boardState = addBordersToBoard(
      addPressuresToBoard(game?.boardState, tilePressures),
      game?.boardSize,
    ).sort((a, b) => (a.playerId ? 1 : 0) - (b.playerId ? 1 : 0));
    // Must sort or empty tiles override player tiles/borders

    return {
      boardState,
      tilesByPlayer: countBy(boardState, 'playerId'),
      influenceByPlayer: countBy(
        boardState.flatMap(({ borders, playerId }) =>
          borders.map(() => playerId),
        ),
      ),
    };
  }, [game?.boardState, game?.boardSize, tilePressures]);

  return {
    ...game,
    ...calculatedBoardParams,
    players,
    gameId,
    loading,
    nextTurnLocked,
    updateNextTurn,
    toggleNextTurnLock,
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

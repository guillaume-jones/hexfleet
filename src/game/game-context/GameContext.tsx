import { addBordersToBoard } from '../board-view-utils/addBordersToBoard';
import { addNamesToPlayers } from '../board-view-utils/addNamesToPlayers';
import { getProjectedBoard } from '../board-view-utils/getProjectedBoard';
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

import {
  PlayerWithName,
  ProjectedTile,
  TileWithBorders,
} from './GameContextTypes';
import {
  Game,
  NextTurn,
  Tile,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';
import { getInfluenceSpent } from 'functions/src/game-logic/getInfluenceSpent';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type GameContextType = Omit<Partial<Game>, 'boardState' | 'players'> & {
  gameId: string;
  userId: string;
  players: PlayerWithName[];
  boardState: TileWithBorders<ProjectedTile<Tile>>[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  futurePressure: number;
  influenceRemaining: number;
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
    const oldBoardWithBorders = addBordersToBoard(
      game?.boardState,
      game?.boardSize,
    );
    const newBoardState = getProjectedBoard(
      game?.boardState,
      tilePressures,
      user?.uid,
    );
    const newBoardWithBorders = addBordersToBoard(
      newBoardState,
      game?.boardSize,
    ).sort(
      // Must sort or empty tiles override player tiles/borders
      (a, b) => +!!a.playerId - +!!b.playerId,
    );
    const influenceByPlayer = countBy(
      oldBoardWithBorders.flatMap(({ borders, playerId }) =>
        borders.map(() => playerId),
      ),
    );

    return {
      boardState: newBoardWithBorders,
      tilesByPlayer: countBy(oldBoardWithBorders, 'playerId'),
      influenceByPlayer,
      futurePressure: newBoardWithBorders.flatMap(({ borders, playerId }) =>
        playerId === user?.uid ? borders.map(() => playerId) : [],
      ).length,
      influenceRemaining: user?.uid
        ? influenceByPlayer[user.uid] -
          getInfluenceSpent({ pressures: tilePressures })
        : 0,
    };
  }, [game?.boardState, game?.boardSize, tilePressures, user?.uid]);

  return {
    ...game,
    ...calculatedBoardParams,
    userId: user?.uid ?? '',
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

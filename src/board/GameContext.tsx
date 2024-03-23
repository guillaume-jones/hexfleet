import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Dictionary } from 'lodash';
import countBy from 'lodash/countBy';
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

import { TileWithBorders, getSpecialBorders } from './utils/getBorders';
import {
  Game,
  NextTurn,
  TilePressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type GameContextType = Partial<Game> & {
  board: TileWithBorders[];
  tilesByPlayer: Dictionary<number>;
  influenceByPlayer: Dictionary<number>;
  loading: boolean;
  nextTurn: NextTurn;
  nextTurnLocked: boolean;
  updateNextTurn: (tile: TilePressure) => void;
  lockTurn: () => void;
  unlockTurn: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GameContext = createContext<GameContextType>(undefined!);

const emptyNextTurn: NextTurn = { pressures: [] };

const useGameProvider = (gameId?: string) => {
  const [user] = useAuthState(auth);

  const [game, loading] = useDocumentData<Partial<Game>>(
    gameId === undefined ? undefined : doc(firestore, 'games', gameId),
  );
  const [nextTurn, setNextTurn] = useState<NextTurn>(emptyNextTurn);
  const [nextTurnLocked, setNextTurnLocked] = useState(false);

  // Clears next turn state when game updates
  useEffect(() => {
    setNextTurn(emptyNextTurn);
    setNextTurnLocked(false);
  }, [game?.boardState]);

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
      user && gameId && doc(firestore, 'games', gameId, 'nextTurn', user.uid),
    [user, gameId],
  );

  const lockTurn = useCallback(() => {
    if (!nextTurnRef) return;
    setDoc(nextTurnRef, nextTurn)
      .then(() => setNextTurnLocked(true))
      .catch((e) => console.error(e));
  }, [nextTurnRef, nextTurn]);

  const unlockTurn = useCallback(() => {
    if (!nextTurnRef) return;
    deleteDoc(nextTurnRef)
      .then(() => setNextTurnLocked(false))
      .catch((e) => console.error(e));
  }, [nextTurnRef]);

  return useMemo(() => {
    const board = getSpecialBorders(game?.boardState, game?.boardSize)
      // Must sort or empty tiles override player tiles/borders
      .sort((a, b) => (a.playerId ? 1 : 0) - (b.playerId ? 1 : 0));

    const tilesByPlayer = countBy(board, 'playerId');
    delete tilesByPlayer.undefined;

    const influenceByPlayer = countBy(
      board.flatMap(({ borders, playerId }) => borders.map(() => playerId)),
    );

    return {
      ...game,
      board,
      tilesByPlayer,
      influenceByPlayer,
      loading,
      nextTurn,
      nextTurnLocked,
      updateNextTurn,
      lockTurn,
      unlockTurn,
    };
  }, [
    game,
    loading,
    nextTurn,
    nextTurnLocked,
    updateNextTurn,
    lockTurn,
    unlockTurn,
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

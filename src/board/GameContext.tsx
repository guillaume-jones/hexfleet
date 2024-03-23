import { deleteDoc, doc, setDoc } from 'firebase/firestore';
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
  TilePressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type GameContextType = Partial<Game> & {
  loading?: boolean;
  nextTurn?: NextTurn;
  nextTurnLocked: boolean;
  updateNextTurn: (tile: TilePressure) => void;
  lockNextTurn: () => void;
  unlockNextTurn: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GameContext = createContext<GameContextType>(undefined!);

const useGameProvider = (gameId?: string) => {
  const [user] = useAuthState(auth);

  const [game, loading] = useDocumentData<Partial<Game>>(
    gameId === undefined ? undefined : doc(firestore, 'games', gameId),
  );
  const [nextTurn, setNextTurn] = useState<NextTurn>();
  const [nextTurnLocked, setNextTurnLocked] = useState(false);

  const nextTurnRef = useMemo(
    () =>
      user && gameId && doc(firestore, 'games', gameId, 'nextTurn', user.uid),
    [user, gameId],
  );

  // Clears next turn state when game updates
  useEffect(() => {
    setNextTurn(undefined);
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

  const lockNextTurn = useCallback(() => {
    if (!nextTurnRef) return;
    setDoc(nextTurnRef, nextTurn)
      .then(() => setNextTurnLocked(true))
      .catch((e) => console.error(e));
  }, [nextTurnRef, nextTurn]);

  const unlockNextTurn = useCallback(() => {
    if (!nextTurnRef) return;
    deleteDoc(nextTurnRef)
      .then(() => setNextTurnLocked(false))
      .catch((e) => console.error(e));
  }, [nextTurnRef]);

  return useMemo(
    () => ({
      ...game,
      loading,
      nextTurnLocked,
      updateNextTurn,
      lockNextTurn,
      unlockNextTurn,
    }),
    [
      game,
      loading,
      nextTurnLocked,
      updateNextTurn,
      lockNextTurn,
      unlockNextTurn,
    ],
  );
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

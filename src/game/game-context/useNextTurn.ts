import { doc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import {
  NextTurn,
  TileCoords,
  TileWithPressure,
} from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

const nextTurnKey = 'next-turn';

const useNextTurn = (gameId: string) => {
  const [user] = useAuthState(auth);

  const nextTurnRef =
    user && gameId
      ? doc(firestore, 'games', gameId, 'nextTurns', user.uid)
      : undefined;

  const [sentNextTurn, sentNextTurnLoading] =
    useDocumentData<Partial<NextTurn>>(nextTurnRef);

  const [nextTurn, setNextTurn] = useState<NextTurn>({ pressures: [] });

  useEffect(() => {
    if (sentNextTurnLoading) return;

    // Tries to load next turn from server
    if (sentNextTurn) {
      setNextTurn(sentNextTurn as NextTurn);
      return;
    }

    // Tries to load next turn from local storage if not sent
    const localNextTurn = localStorage.getItem(nextTurnKey);
    if (localNextTurn) {
      setNextTurn(JSON.parse(localNextTurn) as NextTurn);
      return;
    }

    // Resets next turn if server just updated and cleared my turn
    setNextTurn({ pressures: [] });
  }, [sentNextTurn, sentNextTurnLoading]);

  const sendNextTurn = useCallback(async () => {
    if (!nextTurnRef) return;

    try {
      await setDoc(nextTurnRef, nextTurn);
      localStorage.removeItem(nextTurnKey);
    } catch (e) {
      console.error(e);
    }
  }, [nextTurnRef, nextTurn]);

  const updateNextTurn = useCallback((tile: TileWithPressure<TileCoords>) => {
    setNextTurn((prev) => {
      const filteredPressures = prev.pressures.filter(
        ({ x, y }) => !(x === tile.x && y === tile.y),
      );
      const newNextTurn = {
        pressures: [
          ...filteredPressures,
          ...(tile.clear || tile.pressure ? [tile] : []),
        ],
      };

      localStorage.setItem(nextTurnKey, JSON.stringify(newNextTurn));
      return newNextTurn;
    });
  }, []);

  const resetNextTurn = useCallback(() => {
    setNextTurn({ pressures: [] });
  }, []);

  return {
    nextTurn,
    sendNextTurn,
    updateNextTurn,
    resetNextTurn,
    nextTurnSent: !!sentNextTurn,
    nextTurnEqualsSent:
      JSON.stringify(nextTurn) === JSON.stringify(sentNextTurn),
  };
};

export default useNextTurn;

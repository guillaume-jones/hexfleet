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

const useNextTurn = (gameId: string) => {
  const [user] = useAuthState(auth);

  const nextTurnRef =
    user && gameId
      ? doc(firestore, 'games', gameId, 'nextTurns', user.uid)
      : undefined;

  const [sentNextTurn, sentNextTurnLoading] =
    useDocumentData<Partial<NextTurn>>(nextTurnRef);

  const [nextTurn, setNextTurn] = useState<NextTurn>({ pressures: [] });

  // Loads in next turn on reload, or clears next turn if server cleared
  useEffect(() => {
    if (sentNextTurnLoading) return;

    if (sentNextTurn) {
      setNextTurn(sentNextTurn as NextTurn);
    } else {
      setNextTurn({ pressures: [] });
    }
  }, [sentNextTurn, sentNextTurnLoading]);

  const sendNextTurn = useCallback(async () => {
    if (!nextTurnRef) return;

    try {
      await setDoc(nextTurnRef, nextTurn);
    } catch (e) {
      console.error(e);
    }
  }, [nextTurnRef, nextTurn]);

  const updateNextTurn = useCallback((tile: TileWithPressure<TileCoords>) => {
    setNextTurn((prev) => {
      const newPressures = prev.pressures.filter(
        ({ x, y }) => !(x === tile.x && y === tile.y),
      );
      // Remove tile from updates if it is not being cleared or pressured
      if (!tile.clear && !tile.pressure) return { pressures: newPressures };

      return { pressures: [...newPressures, tile] };
    });
  }, []);

  return {
    nextTurn,
    sendNextTurn,
    updateNextTurn,
    nextTurnSent: !!sentNextTurn,
    nextTurnEqualsSent:
      JSON.stringify(nextTurn) === JSON.stringify(sentNextTurn),
  };
};

export default useNextTurn;

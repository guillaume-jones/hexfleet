import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Game } from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

export const useCampaignGameDoc = (gameId: string) => {
  const [user] = useIdToken(auth);

  const docRef = user && doc(firestore, 'campaigns', user.uid, 'games', gameId);

  const [game, loading] = useDocumentData<Partial<Game>>(docRef);

  const setGame = useCallback(
    (newGame: Partial<Game>) =>
      docRef && setDoc(docRef, newGame, { merge: true }),
    [docRef],
  );

  const deleteGame = useCallback(() => docRef && deleteDoc(docRef), [docRef]);

  return { game, loading, setGame, deleteGame } as const;
};

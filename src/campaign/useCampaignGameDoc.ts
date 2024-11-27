import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { useCampaignDoc } from './useCampaignDoc';
import { Game } from 'functions/src/document-types/Games';

import { auth, firestore } from 'src/firebase/firebaseApp';

export const useCampaignGameDoc = (gameId: string) => {
  const [user] = useIdToken(auth);

  const docRef = user && doc(firestore, 'campaigns', user.uid, 'games', gameId);

  const [game, loading] = useDocumentData<Partial<Game>>(docRef);

  const { campaign, setCampaign } = useCampaignDoc();

  const setGame = useCallback(
    async (newGame: Partial<Game>) => {
      if (!docRef) return;

      if (!campaign) await setCampaign({});

      await setDoc(docRef, newGame, { merge: true });
    },
    [campaign, setCampaign, docRef],
  );

  const deleteGame = useCallback(async () => {
    if (!docRef) return;
    await deleteDoc(docRef);
  }, [docRef]);

  return { game, loading, setGame, deleteGame } as const;
};

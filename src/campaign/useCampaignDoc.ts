import { doc, setDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Campaign } from 'functions/src/document-types/Campaign';

import { auth, firestore } from 'src/firebase/firebaseApp';

const newCampaign: Campaign = {
  achievedMaps: [],
  finishedCampaign: null,
};

export const useCampaignDoc = () => {
  const [user] = useIdToken(auth);

  const docRef = user && doc(firestore, 'campaigns', user.uid);

  const [campaign, loading] = useDocumentData<Partial<Campaign>>(docRef);

  const setCampaign = useCallback(
    async (update: Partial<Campaign>) => {
      if (!docRef) return;

      const newDoc = campaign ? update : { ...newCampaign, ...update };

      await setDoc(docRef, newDoc, { merge: true });
    },
    [campaign, docRef],
  );

  return { campaign, loading, setCampaign };
};

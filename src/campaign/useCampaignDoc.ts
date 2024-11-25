import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Campaign } from 'functions/src/document-types/Campaign';

import { auth, firestore } from 'src/firebase/firebaseApp';

export const useCampaignDoc = () => {
  const [user] = useIdToken(auth);
  const data = useDocumentData<Partial<Campaign>>(
    user && doc(firestore, 'campaigns', user.uid),
  );

  const [loading, campaign] = data;

  useEffect(() => {
    if (loading || campaign || !user) return;

    const createCampaign = async () => {
      const newCampaign: Campaign = {
        achievedMaps: [],
        finishedCampaign: null,
      };
      await setDoc(doc(firestore, 'campaigns', user.uid), newCampaign);
    };

    createCampaign().catch(console.error);
  }, [loading, campaign, user]);

  return data;
};

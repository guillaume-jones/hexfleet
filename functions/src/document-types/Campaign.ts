import { Timestamp } from 'firebase/firestore';

export type Campaign = {
  achievedMaps: string[];
  finishedCampaign: Timestamp | null;
};

import { Timestamp } from 'firebase/firestore';

export type GameInvite = {
  createdAt: Timestamp;
  expiresAt: Timestamp;
  fromPlayerId: string;
  shortId: string;
};

export type Invites = {
  gameInvites: GameInvite[];
};
